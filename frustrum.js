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
    this.Matrix = Mat4.of([1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]);
  }

  insertBlock(coord, block){
    this.block_tree.delete(coord);
    this.block_tree.insert(coord, block);
  };

  deleteBlock(coord){
    this.block_tree.delete(coord);
  };

  derive_frustum_points_from_matrix( m, points )
    { return points.map( p => Mat4.inverse( m ).times( p.to4(1) ) )    // Apply the linear part to the points cube.
                   .map( p => p.map( x => x/p[3] ).to3() );            // Manually do a perspective division
    }
  

  should_draw(coord){
    let x = coord[0], y=coord[1], z=coord[2];
    for(var i =0; i < 6; i++){
      if(! this.planes[i].on_correct_side(x,y,z)){
        return false;
      }
    }
    
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
      this.inOrder(this.block_tree._root);
  }

  inOrder(root){
    if(root.left)
      this.inOrder(root.left);
    if(root.value.exposed && this.should_draw(root.key)){
        this.Matrix[0][3] = root.key[0];
        this.Matrix[1][3] = root.key[1];
        this.Matrix[2][3] = root.key[2];
        root.value.block.draw(this.context, this.program_state, this.Matrix);
    }
    if(root.right)
      this.inOrder(root.right);
  }

};


class Plane{
  constructor(normal, point){
    this.normal = normal;
    this.point = point;
  }
  on_correct_side(x,y,z){
    return ((x - this.point[0]) * this.normal[0] + 
    (y - this.point[1]) * this.normal[1] +
    (z - this.point[2]) * this.normal[2] > -0.8);
  }
};

function compare(coord1, coord2){
  let dif;
  for(var i = 0; i < 3; i ++){
    dif = coord1[i] - coord2[i];
    if(dif != 0){
      return dif;
    }
  }
  return 0;
}








