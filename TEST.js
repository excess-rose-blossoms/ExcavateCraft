import {tiny, defs} from './assignment-4-resources.js';
import {Block} from './blocks.js';
                                                                // Pull these names into this module's scope for convenience:
const { Vec, Mat, Mat4, Color, Light, Shape, Shader, Material, Texture,
         Scene, Canvas_Widget, Code_Widget, Text_Widget } = tiny;
const { Cube, Subdivision_Sphere, Transforms_Sandbox_Base } = defs;

    // Now we have loaded everything in the files tiny-graphics.js, tiny-graphics-widgets.js, and assignment-4-resources.js.
    // This yielded "tiny", an object wrapping the stuff in the first two files, and "defs" for wrapping all the rest.

// (Can define Main_Scene's class here)

const Main_Scene =
class Not_Solar_System extends Scene{                                             
  constructor(){                 
      super();


     //Shapes                                                   
     this.shapes = { 'box': new Cube() 
     };

     //Shaders
     const phong_shader = new defs.Phong_Shader(2);

     //Materials
     this.materials = { 'plastic': new Material( phong_shader, 
                                    { ambient: 0.5, diffusivity: 1, specularity: 0, color: Color.of( 1,1,1,1 ) } )
     };



    }
  make_control_panel(){                                
    }
  display( context, program_state )
    {   
     
                           // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
      if( !context.scratchpad.controls ) 
        {                       // Add a movement controls panel to the page:
          //this.children.push( context.scratchpad.controls = new defs.Movement_Controls() ); 

                                // Add a helper scene / child scene that allows viewing each moving body up close.

                    // Define the global camera and projection matrices, which are stored in program_state.  The camera
                    // matrix follows the usual format for transforms, but with opposite values (cameras exist as 
                    // inverted matrices).  The projection matrix follows an unusual format and determines how depth is 
                    // treated when projecting 3D points onto a plane.  The Mat4 functions perspective() and
                    // orthographic() automatically generate valid matrices for one.  The input arguments of
                    // perspective() are field of view, aspect ratio, and distances to the near plane and far plane.          
          program_state.set_camera( Mat4.look_at( Vec.of( 0,10,20 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) ) );
          this.initial_camera_location = program_state.camera_inverse;
          program_state.projection_transform = Mat4.perspective( Math.PI/4, context.width/context.height, 1, 200 );
        }

                                                                      // Find how much time has passed in seconds; we can use
                                                                      // time as an input when calculating new transforms:
      const t = program_state.animation_time / 1000;
      
      program_state.lights = [ new Light( Vec.of( 0,0,0,1 ), Color.of(1., 1., 1., 1.), 1000 ) ];     

      let model_transform = Mat4.identity();
      
      this.shapes.box.draw( context, program_state, model_transform, this.materials.plastic );

    }
}

const Additional_Scenes = [];

export { Main_Scene, Additional_Scenes, Canvas_Widget, Code_Widget, Text_Widget, defs }



