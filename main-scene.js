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
    let seed = localStorage.getItem('seed');
    if(! seed){
      this.#seed = new Date().getTime();
      localStorage.setItem('seed', this.#seed);
    }
    else
      this.#seed = parseInt(seed);

    this.#mapGenerator = new MapGenerator(this.#seed);
    this.#map = new Map(CHUNK_SIZE, CHUNK_DISPLAY_WIDTH, this.#blocks, this.#mapGenerator);
    this.movement_controls = new defs.Movement_Controls(this.#map);
    this.#input_manager = new InputManager(this.#map, this.movement_controls);
    this.movement_controls.input_manager = this.#input_manager;

    }
  make_control_panel(){     
                             
    }
  display( context, program_state )
    { 
      this.#input_manager.perform_action(context, program_state);
                          
      //Setup
      if( !context.scratchpad.controls ) 
      { 
          //Add movement controls panel
          this.children.push( context.scratchpad.controls = this.movement_controls );
               
          //Set up the camera           
          program_state.set_camera( Mat4.look_at( Vec.of( 0,10,10 ), Vec.of( 0,100,0 ), Vec.of( 100,100,100 ) ) );
          this.initial_camera_location = program_state.camera_inverse;
          program_state.projection_transform = Mat4.perspective( Math.PI/4, context.width/context.height, 1, 200 );
      }

      // Find how much time has passed in seconds
      const t = program_state.animation_time / 1000;  
          
      program_state.lights = [ ];//new Light( Vec.of( 0,0,0,1 ), Color.of(1., 1., 1., 1.), 1000 ) ];     
      
      this.#map.draw(context, program_state);
      
    }
}

const Additional_Scenes = [];

export { Main_Scene, Additional_Scenes, Canvas_Widget, Code_Widget, Text_Widget, defs }


