

export class InputManager {
  #holdtime;
  constructor(map, movement_controls){
    this.#holdtime = null;
    this.map = map;
    this.movement_controls = movement_controls;
    this.direction_map = [[1,0,0], [0,1,0], [0,0,1]];
    this.negative_direction_map = [[-1,0,0], [0,-1,0], [0,0,-1]];
  }

  perform_action(context, program_state){

    let camera_translation = [program_state.camera_transform[0][3], 
                              program_state.camera_transform[1][3],
                              program_state.camera_transform[2][3]];

    let camera_forward = [ Math.sin(this.movement_controls.my_rot[1]),
                           -Math.sin(this.movement_controls.my_rot[0]),
                           -Math.cos(this.movement_controls.my_rot[1]) ]

    console.log("FORWARD: ", camera_forward);

    context.canvas.onmousedown = e => {
      let block_coord = this.raycast_return_coord(camera_translation, camera_forward, 4);
      console.log("BLOCK COORD: ", block_coord);
      if ( block_coord !== null )
      {
        this.map.deleteBlock(block_coord);
      }


      this.#holdtime = new Date().getTime();
      context.canvas.requestPointerLock();  

      };
    context.canvas.onmouseup = e => {
        console.log(new Date().getTime() - this.#holdtime);
        this.#holdtime = null;
      };
  };

  raycast_return_coord(position, direction, depth){
    for(var i = 1; i<=depth; i++){
      let newpos = [Math.floor(position[0]+direction[0]*i), 
                    Math.floor(position[1]+direction[1]*i), 
                    Math.floor(position[2]+direction[2]*i)];
      let block = this.map.get(newpos);
      if(block !== null){
        return newpos;
      }
    }
    return null;
  }

//   get_selected_block(program_state, blocks){
//     let camera_position = [program_state.camera_transform[0][3], 
//                                     program_state.camera_transform[1][3],
//                                     program_state.camera_transform[2][3]];

//     console.log("POSITION: ", camera_position);

//     let camera_forward = [program_state.camera_transform[0][2], 
//                                     program_state.camera_transform[1][2],
//                                     program_state.camera_transform[2][2]];
//     let spot = [0,0,0];
//     for(var i = 0.1; i < 3; i = i + 1){
//       spot[0] = parseInt(camera_position[0] + (camera_forward[0] * i));
//       spot[1] = parseInt(camera_position[1] + (camera_forward[1] * i));
//       spot[2] = parseInt(camera_position[2] + (camera_forward[2] * i));
//       if(blocks.get(spot)){
//         return blocks.get(spot);
//       }
//     }
//     return null;
    
//   }


  // Tell how long the mouse has been held down
  get_clicktime(){
    if(this.#holdtime === null)
      return 0;
    return (new Date().getTime() - this.#holdtime);
  }

};