

export class InputManager {
  #holdtime;
  constructor(map, movement_controls){
    this.#holdtime = null;
    this.map = map;
    this.movement_controls = movement_controls;
    this.direction_map = [[1,0,0], [0,1,0], [0,0,1]];
    this.negative_direction_map = [[-1,0,0], [0,-1,0], [0,0,-1]];
    this.selected_block = this.map.blocks.brick;
  }

  perform_action(context, program_state){

    let camera_translation = [program_state.camera_transform[0][3], 
                              program_state.camera_transform[1][3],
                              program_state.camera_transform[2][3]];

    let camera_forward = [ Math.sin(this.movement_controls.my_rot[1] * Math.cos(this.movement_controls.my_rot[0])),
                           -Math.sin(this.movement_controls.my_rot[0]),
                           -Math.cos(this.movement_controls.my_rot[1]) * Math.cos(this.movement_controls.my_rot[0]) ]


    context.canvas.onmousedown = e => {
      let block_coord = this.raycast_return_coord(camera_translation, camera_forward, 4);
      if ( block_coord !== null ){
        if(e.button == 0)
          this.map.deleteBlock(block_coord[0]);
        if(e.button == 2){
          this.map.insertBlock(block_coord[1], this.selected_block );
        }
      }

      this.#holdtime = new Date().getTime();
      context.canvas.requestPointerLock();  

      };
    context.canvas.onmouseup = e => {
        this.#holdtime = null;
      };
  };

  raycast_return_coord(position, direction, depth){
    for(var i = 0; i<=depth; i+= 0.005){
      let newpos = [Math.round(position[0]+direction[0]*i), 
                    Math.round(position[1]+direction[1]*i), 
                    Math.round(position[2]+direction[2]*i)];
      let block = this.map.get(newpos);
      if(block){ // bedrock
        if(block.id == 6)
          return null;
        let point = [position[0]+direction[0]*i - newpos[0], 
                    position[1]+direction[1]*i - newpos[1], 
                    position[2]+direction[2]*i - newpos[2]];
        let diff_pos = [1,0,0];
        let diff = 0;
        for(var k = 0; k<3; k++){
          if(Math.abs(point[k]) > diff){
            diff = Math.abs(point[k]);
            diff_pos[0] = newpos[0];
            diff_pos[1] = newpos[1];
            diff_pos[2] = newpos[2];
            diff_pos[k] = newpos[k] + (point[k] > 0 ? 1 : -1);
          }
        }
        return [newpos, diff_pos];
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