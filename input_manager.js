

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

    context.canvas.onmousedown = e => {
      let block_coord = this.raycast_return_coord(camera_translation, camera_forward, 4);
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
      let newpos = [Math.round(position[0]+direction[0]*i), 
                    Math.round(position[1]+direction[1]*i), 
                    Math.round(position[2]+direction[2]*i)];
      let block = this.map.get(newpos);
      if(block !== null){
        return newpos;
      }
    }
    return null;
  }

  // Tell how long the mouse has been held down
  get_clicktime(){
    if(this.#holdtime === null)
      return 0;
    return (new Date().getTime() - this.#holdtime);
  }

};