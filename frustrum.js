import {tiny, defs} from './assignment-4-resources.js';
import {Block} from './blocks.js';
import {AvlTree} from './bbtree.js';
                                                                // Pull these names into this module's scope for convenience:
const { Vec, Mat, Mat4, Color, Light, Shape, Shader, Material, Texture,
         Scene, Canvas_Widget, Code_Widget, Text_Widget } = tiny;
const { Cube, Subdivision_Sphere, Transforms_Sandbox_Base } = defs;

export class Frustrum
{
  constructor(map){
    this.map = map;
    this.view_box_normalized = Vec.cast( [-1, -1, -1],  [1,  -1, -1],  [-1, 1, -1],  [1,  1, -1],  
                                      [-1, -1, 1],   [1,  -1, 1],   [-1, 1, 1],   [1,  1, 1]  );
    this.corner_points = [];
    this.block_tree = new AvlTree(compare);
  }

  insertBlock(coord, block){
    this.block_tree.delete(Vec.of(...coord));
    this.block_tree.insert(Vec.of(...coord), block);
  }

  deleteBlock(coord){
    this.block_tree.delete(Vec.of(...coord));
  }
  derive_frustum_points_from_matrix( m, points )
    { return points.map( p => Mat4.inverse( m ).times( p.to4(1) ) )    // Apply the linear part to the points cube.
                   .map( p => p.map( x => x/p[3] ).to3() );            // Manually do a perspective division
    }
  

  should_draw(coord, block){
    if(!block.exposed){
      return false;
    }
    for(var i =0; i < 6; i++){
      if(! this.planes[i].on_correct_side(coord)){
        return false;
      }
    }
//     if(!block){
//       return false;
//     }
//     let num_adjacent = 0;
//     for(var i in [-1, 1]){
//       for(var j in [-1, 1]){
//         let adjacent = this.map.get(Vec.of(coord[0] + i, coord[1] + j));
//         if(adjacent && adjacent.block){
//           num_adjacent++;
//         }
//       }
//     }
//     if(num_adjacent >= 4){
//       return false;
//     }
    
    return true;
     
  }
  
  get_planes(){
    let normals = [];
    let [nld, nrd, nlu, nru, fld, frd, flu, fru] =this.corner_points;
    let nldtou = nlu.minus(nld);
    let ndltor = nrd.minus(nld);
    let near_normal = nldtou.cross(ndltor).normalized();
    let ldntof = fld.minus(nld);
    let left_normal = ldntof.cross(nldtou).normalized();
    let rdntof = frd.minus(nrd);
    let bottom_normal = ndltor.cross(rdntof).normalized();
    let nrdtou = nru.minus(nrd);
    let right_normal = nrdtou.cross(rdntof).normalized();
    let nultor = nru.minus(nlu);
    let luntof = flu.minus(nlu);
    let top_normal = luntof.cross(nultor).normalized();
    let top_plane = new Plane(top_normal, fru);
    let fldtou = flu.minus(fld);
    let fdltor = frd.minus(fld);
    let far_normal = fdltor.cross(fldtou).normalized();

    let planes = [near_normal, left_normal, bottom_normal, far_normal, right_normal, top_normal]
    .map((normal, index) => {
      let point;
      if(index < 3){
        point = nld;
      }
      else{
        point = fru;
      }
      return new Plane(normal, point);
    });
    return planes;

  }

  update_frustrum(program_state){
      /*
        nld = near left down, ...
        corner_points = [nld, nrd, nlu, nru, fld, frd, flu, fru]
      */
      this.corner_points = this.derive_frustum_points_from_matrix( program_state.projection_transform, this.view_box_normalized );

      let corner_points = [];
      for(var i =0; i < 8; i++){
        let point = Vec.of(...this.corner_points[i], 1.0);
        point = program_state.camera_transform.times(point);
        point = Vec.of(... (point.slice(0, 3)));
        corner_points.push(point);
      }
      this.corner_points = corner_points;
      this.planes = this.get_planes();
  }

  draw(context, program_state){
      this.context = context;
      this.program_state = program_state;
      this.update_frustrum(program_state);
      this.inOrder(this.block_tree._root, this.corner_points[0], this.corner_points[7]);
  }

  inOrder(root, leastCoord, mostCoord){
    if(!root){
      return;
    }
    this.inOrder(root.left, leastCoord, mostCoord);
    if(this.should_draw(root.key, root.value)){
      if(root.value.block)
        root.value.block.draw(this.context, this.program_state, Mat4.identity().times(Mat4.translation(root.key)));
      //console.log(this.corner_points);
    }
    this.inOrder(root.right, leastCoord, mostCoord);
    return;
  }

};


class Plane{
  constructor(normal, point){
    this.normal = normal;
    this.point = point;
  }
  on_correct_side(coord){
    if(coord.minus(this.point).dot(this.normal) < -0.8){
      return false;
    }
    return true;
  }
};

function compare(coord1, coord2){
  let dif = coord1.minus(coord2);
  for(var i = 0; i < 3; i ++){
    if(dif[i] != 0){
      return dif[i];
    }
  }
  return 0;
}








