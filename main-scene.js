import {tiny, defs} from './assignment-4-resources.js';
import {Frustrum} from './frustrum.js';
import {Map} from './hash.js';
import {Block, GrassBlock, BrickBlock, StoneBlock, SandBlock, WoodBlock, LeafBlock, BedrockBlock} from './blocks.js';
import {InputManager} from './input_manager.js';   
import {gen_tree} from './generateTree.js';
import {MapGenerator, CHUNK_SIZE} from './generateTerrain.js';

const { Vec, Mat, Mat4, Color, Light, Shape, Shader, Material, Texture,
         Scene, Canvas_Widget, Code_Widget, Text_Widget } = tiny;
const { Cube, Subdivision_Sphere, Transforms_Sandbox_Base } = defs;

const CHUNK_DISPLAY_WIDTH = 4;

const Main_Scene =
class Not_Solar_System extends Scene{      
  #blocks;  
  #materials;
  #input_manager;   
  #map;    
  #frustrum;
  #mapGenerator;
  #seed;                              
  constructor(){                 
     super();
     this.#blocks = {
                    grass: new GrassBlock(),
                    brick: new BrickBlock(),
                    stone: new StoneBlock(),
                    sand: new SandBlock(),
                    wood: new WoodBlock(),
                    leaf: new LeafBlock(),
                    bedrock: new BedrockBlock()
    };
    this.#seed = 1001;
    this.#input_manager = new InputManager();
    this.#mapGenerator = new MapGenerator(this.#seed);
    this.#map = new Map(CHUNK_SIZE, CHUNK_DISPLAY_WIDTH, this.#blocks, this.#mapGenerator);
/*
    //this.#mapGenerator.generate_chunk([0,0], this.#map, this.#blocks);
    this.#mapGenerator.generate_chunk([0,0], this.#map, this.#blocks);
    this.#mapGenerator.generate_chunk([0,1], this.#map, this.#blocks);
    this.#mapGenerator.generate_chunk([0,-1], this.#map, this.#blocks);

    this.#mapGenerator.generate_chunk([1,0], this.#map, this.#blocks);
    this.#mapGenerator.generate_chunk([1,1], this.#map, this.#blocks);
    this.#mapGenerator.generate_chunk([1,-1], this.#map, this.#blocks);  
    this.#mapGenerator.generate_chunk([-1,0], this.#map, this.#blocks);
    this.#mapGenerator.generate_chunk([-1,1], this.#map, this.#blocks);
    this.#mapGenerator.generate_chunk([-1,-1], this.#map, this.#blocks);   
*/
    }
  make_control_panel(){     
                             
    }
  display( context, program_state )
    { 
      this.#input_manager.perform_action(context, program_state);
                           // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
      if( !context.scratchpad.controls ) 
      {                       // Add a movement controls panel to the page:
          this.children.push( context.scratchpad.controls = new defs.Movement_Controls(this.#map) );

          // Add a helper scene / child scene that allows viewing each moving body up close.
          // Define the global camera and projection matrices, which are stored in program_state.  The camera
          // matrix follows the usual format for transforms, but with opposite values (cameras exist as 
          // inverted matrices).  The projection matrix follows an unusual format and determines how depth is 
          // treated when projecting 3D points onto a plane.  The Mat4 functions perspective() and
          // orthographic() automatically generate valid matrices for one.  The input arguments of
          // perspective() are field of view, aspect ratio, and distances to the near plane and far plane.   
                          
          program_state.set_camera( Mat4.look_at( Vec.of( 0,10,10 ), Vec.of( 0,100,0 ), Vec.of( 100,100,100 ) ) );

          this.initial_camera_location = program_state.camera_inverse;
          program_state.projection_transform = Mat4.perspective( Math.PI/4, context.width/context.height, 1, 200 );
      }

      // Find how much time has passed in seconds; we can use
      // time as an input when calculating new transforms:
      const t = program_state.animation_time / 1000;
      
      
      
      program_state.lights = [ new Light( Vec.of( 0,0,0,1 ), Color.of(1., 1., 1., 1.), 1000 ) ];     

      let model_transform = Mat4.identity();
      
     /* this.#blocks.grass.draw( context, program_state, model_transform);
      this.#blocks.brick.draw(context, program_state, model_transform.times(Mat4.translation([1,0,0])));
      this.#blocks.stone.draw(context, program_state, model_transform.times(Mat4.translation([-1,0,0])));
      this.#blocks.sand.draw(context, program_state, model_transform.times(Mat4.translation([0,0,-1])));
      this.#blocks.wood.draw(context, program_state, model_transform.times(Mat4.translation([1,1,-1])));
      this.#blocks.leaf.draw(context, program_state, model_transform.times(Mat4.translation([-1,1,-1])));*/

      program_state.lights = [ new Light( Vec.of( 0,0,0,1 ), Color.of(1., 1., 1., 1.), 1000 ) ];     


      //this.frustrum.draw(context, program_state);
      //this.map.draw(context, program_state);
      model_transform = Mat4.identity();
      
      this.#blocks.grass.draw( context, program_state, model_transform);

      model_transform = model_transform
                          .times( Mat4.translation( Vec.of(0,10,0) ) );
      
      this.#blocks.grass.draw( context, program_state, model_transform); 

      model_transform = model_transform
                          .times( Mat4.translation( Vec.of(0,5,5) ) );  

      this.#blocks.grass.draw( context, program_state, model_transform);

      model_transform = model_transform
                          .times( Mat4.translation( Vec.of(0,5,5) ) );  

      this.#blocks.grass.draw( context, program_state, model_transform);

            model_transform = model_transform
                          .times( Mat4.translation( Vec.of(0,5,5) ) );  

      this.#blocks.grass.draw( context, program_state, model_transform);

            model_transform = model_transform
                          .times( Mat4.translation( Vec.of(0,5,5) ) );  

      this.#blocks.grass.draw( context, program_state, model_transform);
      this.#map.draw(context, program_state);
      
    }
}

const Additional_Scenes = [];

export { Main_Scene, Additional_Scenes, Canvas_Widget, Code_Widget, Text_Widget, defs }


