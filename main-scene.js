import {tiny, defs} from './assignment-4-resources.js';
import {Block, GrassBlock, BrickBlock, StoneBlock, SandBlock, WoodBlock, LeafBlock} from './blocks.js';
                                                                // Pull these names into this module's scope for convenience:
const { Vec, Mat, Mat4, Color, Light, Shape, Shader, Material, Texture,
         Scene, Canvas_Widget, Code_Widget, Text_Widget } = tiny;
const { Cube, Subdivision_Sphere, Transforms_Sandbox_Base } = defs;

const Main_Scene =
class Not_Solar_System extends Scene{      

  #blocks;  
  #materials;                                     
  constructor(){                 
     super();
     this.#blocks = {
                    grass: new GrassBlock(),
                    brick: new BrickBlock(),
                    stone: new StoneBlock(),
                    sand: new SandBlock(),
                    wood: new WoodBlock(),
                    leaf: new LeafBlock()
  };

    }
  make_control_panel(){     
                             
    }
  display( context, program_state )
    {          
      program_state.set_camera( Mat4.look_at( Vec.of(0, 3,4 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) ) );
      this.initial_camera_location = program_state.camera_inverse;
      program_state.projection_transform = Mat4.perspective( Math.PI/4, context.width/context.height, 1, 200 );


                                                                      // Find how much time has passed in seconds; we can use
                                                                      // time as an input when calculating new transforms:
      const t = program_state.animation_time / 1000;
      
      program_state.lights = [ new Light( Vec.of( 0,0,0,1 ), Color.of(1., 1., 1., 1.), 1000 ) ];     

      let model_transform = Mat4.identity();
      
      this.#blocks.grass.draw( context, program_state, model_transform);
      this.#blocks.brick.draw(context, program_state, model_transform.times(Mat4.translation([1,0,0])));
      this.#blocks.stone.draw(context, program_state, model_transform.times(Mat4.translation([-1,0,0])));
      this.#blocks.sand.draw(context, program_state, model_transform.times(Mat4.translation([0,0,-1])));
      this.#blocks.wood.draw(context, program_state, model_transform.times(Mat4.translation([1,1,-1])));
      this.#blocks.leaf.draw(context, program_state, model_transform.times(Mat4.translation([-1,1,-1])));

    }
}

const Additional_Scenes = [];

export { Main_Scene, Additional_Scenes, Canvas_Widget, Code_Widget, Text_Widget, defs }


