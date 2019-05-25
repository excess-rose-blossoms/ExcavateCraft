import {tiny, defs} from './assignment-4-resources.js';
import {Block, GrassBlock} from './blocks.js';
                                                                // Pull these names into this module's scope for convenience:
const { Vec, Mat, Mat4, Color, Light, Shape, Shader, Material, Texture,
         Scene, Canvas_Widget, Code_Widget, Text_Widget } = tiny;
const { Cube, Subdivision_Sphere, Transforms_Sandbox_Base } = defs;

const Main_Scene =
class Not_Solar_System extends Scene{      

  #b;  
  #materials;                                     
  constructor(){                 
     super();
     this.#b = new GrassBlock() ;


     //Shaders
     const phong_shader = new defs.Phong_Shader(2);

     this.#materials = { 'plastic': new Material( phong_shader, 
                                    { ambient: 0.5, diffusivity: 1, specularity: 0, color: Color.of( 1,1,1,1 ) } )
     };



    }
  make_control_panel(){     
                             
    }
  display( context, program_state )
    {          
      program_state.set_camera( Mat4.look_at( Vec.of( 0,10,20 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) ) );
      this.initial_camera_location = program_state.camera_inverse;
      program_state.projection_transform = Mat4.perspective( Math.PI/4, context.width/context.height, 1, 200 );


                                                                      // Find how much time has passed in seconds; we can use
                                                                      // time as an input when calculating new transforms:
      const t = program_state.animation_time / 1000;
      
      program_state.lights = [ new Light( Vec.of( 0,0,0,1 ), Color.of(1., 1., 1., 1.), 1000 ) ];     

      let model_transform = Mat4.identity();
      
      this.#b.draw( context, program_state, model_transform);

    }
}

const Additional_Scenes = [];

export { Main_Scene, Additional_Scenes, Canvas_Widget, Code_Widget, Text_Widget, defs }


