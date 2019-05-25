import {tiny, defs} from './assignment-4-resources.js';
import {Block} from './blocks.js';
                                                                // Pull these names into this module's scope for convenience:
const { Vec, Mat, Mat4, Color, Light, Shape, Shader, Material, Texture,
         Scene, Canvas_Widget, Code_Widget, Text_Widget } = tiny;
const { Cube, Subdivision_Sphere, Transforms_Sandbox_Base } = defs;

export class Frustrum
{
  constructor(block_tree){
    this.view_box_normalized = Vec.cast( [-1, -1, -1],  [1,  -1, -1],  [-1, 1, -1],  [1,  1, -1],  
                                      [-1, -1, 1],   [1,  -1, 1],   [-1, 1, 1],   [1,  1, 1]  );
    this.corner_points = [];
    this.block_tree = block_tree;
  }

  derive_frustum_points_from_matrix( m, points )
    { return points.map( p => Mat4.inverse( m ).times( p.to4(1) ) )    // Apply the linear part to the points cube.
                   .map( p => p.map( x => x/p[3] ).to3() );            // Manually do a perspective division
    }
  
  should_draw(block){
    
  }
  
  get_plane_normals(){
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
    let fldtou = flu.minus(fld);
    let fdltor = frd.minus(fld);
    let far_normal = fdltor.cross(fldtou).normalized();

    return [near_normal, far_normal, left_normal, right_normal, bottom_normal, top_normal]; 


  }

  update_frustrum(program_state){
      /*
        nld = near left down, ...
        corner_points = [nld, nrd, nlu, nru, fld, frd, flu, fru]
      */
      this.corner_points = this.derive_frustum_points_from_matrix( program_state.projection_transform, this.view_box_normalized );
  }

  draw(program_state){
      this.update_frustrum(program_state);
      let normals = this.get_plane_normals();
  }

};


export class BlockTree{
    constructor(){
        
    }
};







