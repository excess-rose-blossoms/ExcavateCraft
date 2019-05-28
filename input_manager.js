

export class InputManager{
  #holdtime;
  constructor(){
    this.#holdtime = null;
  }

  perform_action(context, program_state){
    let camera_translation = [program_state.camera_transform[0][3], 
                                    program_state.camera_transform[1][3],
                                    program_state.camera_transform[2][3]];
    context.canvas.onmousedown = e => {
      console.log("Clicke"); 
      this.#holdtime = new Date().getTime();
      };
    context.canvas.onmouseup = e => {
        console.log(new Date().getTime() - this.#holdtime);
        this.#holdtime = null;
      };
  };

  get_selected_block(program_state, blocks){
    let camera_position = [program_state.camera_transform[0][3], 
                                    program_state.camera_transform[1][3],
                                    program_state.camera_transform[2][3]];

    let camera_forward = [program_state.camera_transform[0][2], 
                                    program_state.camera_transform[1][2],
                                    program_state.camera_transform[2][2]];
    let spot = [0,0,0];
    for(var i = 0.1; i < 3; i = i + 1){
      spot[0] = parseInt(camera_position[0] + (camera_forward[0] * i));
      spot[1] = parseInt(camera_position[1] + (camera_forward[1] * i));
      spot[2] = parseInt(camera_position[2] + (camera_forward[2] * i));
      if(blocks.get(spot)){
        return blocks.get(spot);
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