import {tiny, defs} from './assignment-4-resources.js';
import {Block, BLOCK_TYPES, BLOCK_TYPES_INV, BLOCK_CONVERTER} from './blocks.js';
import {Frustrum} from './frustrum.js';
const { Vec, Mat, Mat4, Color, Light, Shape, Shader, Material, Texture,
         Scene, Canvas_Widget, Code_Widget, Text_Widget } = tiny;

const MIN_CHUNKS_TO_SHOW = 1;


export class Map{
  constructor(chunk_size, num_chunks, blocks){
    this.chunks = {};
    this.chunk_size = chunk_size;
    this.num_chunks = num_chunks;
    this.frustrum = new Frustrum(this);
    this.blocks = blocks;
    this.check_chunks_flag = true;
    this.num_showing = 0;
    
  }
  get_chunk_coord(coord){
    coord = [coord[0], coord[2]];
    //let chunk_coord = coord.map(c => (c<0?-1:1)* Math.floor((c<0?-1:1) * c / this.chunk_size)  - (c<0?1:0));
    let chunk_coord = coord.map(c => Math.floor( c / this.chunk_size) );
    return chunk_coord;
  }

  //*********************************************
  // Only handles blocks that are already in RAM. TODO: handle getting random chunks
  //*********************************************

  deleteBlock(coord){
    this.frustrum.deleteBlock(coord);
    let chunk_coord = this.get_chunk_coord(coord)
    this.chunks[JSON.stringify(chunk_coord)][JSON.stringify(coord)] = null;
    delete this.chunks[JSON.stringify(chunk_coord)][JSON.stringify(coord)];
  }
  //block includes 'exposed' property
  insertBlock(coord, block){
    let chunk_coord = this.get_chunk_coord(coord);
    this.frustrum.insertBlock(coord, block);
    this.chunks[JSON.stringify(chunk_coord)][JSON.stringify(coord)] = block;
  }
  get(coord){
    let chunk_coord = this.get_chunk_coord(coord);
    let chunk_coord_hash = JSON.stringify(chunk_coord);
    let chunk = {};
    if(! this.chunks.hasOwnProperty(chunk_coord_hash)){
      chunk = localStorage.getItem(chunk_coord_hash);
    }else{
      chunk = this.chunks[chunk_coord_hash];
    }

    if(!chunk || !chunk[JSON.stringify(coord)]){
      return null;
    }
    return chunk[JSON.stringify(coord)];
    
  }
  evict(chunk_coord){
    let table = {};
    let chunk_coord_hash = JSON.stringify(chunk_coord);
    if(! this.chunks.hasOwnProperty(chunk_coord_hash)){
      return false;
    }
    let chunk = this.chunks[chunk_coord_hash];
    for(var world_coord_hash in chunk){
      table[world_coord_hash] = {};
      table[world_coord_hash].exposed = chunk[world_coord_hash].exposed;
      let block_type = BLOCK_TYPES[chunk[world_coord_hash].block.constructor.name];
      table[world_coord_hash].block = block_type;
      let world_coord_arr = JSON.parse(world_coord_hash);
      this.frustrum.deleteBlock(world_coord_arr);
    }
    table = JSON.stringify(table);
    localStorage.setItem(chunk_coord_hash, table);
    this.chunks[chunk_coord_hash] = null;
    delete this.chunks[chunk_coord_hash];
    return true;
  }

  reinstate(chunk_coord){
    let chunk_coord_hash = JSON.stringify(chunk_coord);
    let chunk_temp = localStorage.getItem(chunk_coord_hash);
    if(! chunk_temp){
      return false;
    }
    chunk_temp = JSON.parse(chunk_temp);
    let chunk = {};
    for(var world_coord_hash in chunk_temp){
      chunk[world_coord_hash] = {};
      chunk[world_coord_hash].exposed = chunk_temp[world_coord_hash].exposed;
      let block_type = chunk_temp[world_coord_hash].block;
      block_type = BLOCK_TYPES_INV[block_type];
      block_type = BLOCK_CONVERTER[block_type];
      chunk[world_coord_hash].block = this.blocks[block_type];
      let world_coord_arr = JSON.parse(world_coord_hash);
      this.frustrum.insertBlock(world_coord_arr, chunk[world_coord_hash]);
    }
    this.chunks[chunk_coord_hash] = chunk;   
    return true;
  }

  get_bounds(chunk_coord){
    let add_right_up =  Math.floor(this.num_chunks/2) - 1;
    let add_left_down = -Math.floor(this.num_chunks/2);
    let bounds = {}
    bounds.up_right = Vec.of(...chunk_coord).plus(Vec.of( add_right_up, add_right_up));
    bounds.down_left = Vec.of(...chunk_coord).plus(Vec.of( add_left_down, add_left_down));
    bounds.up_right = [bounds.up_right[0], bounds.up_right[1]];
    bounds.down_left = [bounds.down_left[0], bounds.down_left[1]];
    return bounds;
  }

  //inserts into local storage, draw takes care of displying the right chunks
  insert_chunk(chunk_coord, chunk){
    let chunk_coord_hash = JSON.stringify(chunk_coord);
    let table = {};
    for(var world_coord_hash in chunk){
      table[world_coord_hash] = {};
      table[world_coord_hash].exposed = chunk[world_coord_hash].exposed;
      let block_type = chunk[world_coord_hash].block.constructor.name;
      block_type = BLOCK_TYPES[block_type];
      table[world_coord_hash].block = block_type;
      let world_coord_arr = JSON.parse(world_coord_hash);
    }
    table = JSON.stringify(table);
    localStorage.setItem(chunk_coord_hash, table);
  }
  
  is_in_bounds(chunk_coord, bounds){
    if(chunk_coord[0] < bounds.down_left[0] || chunk_coord[0] > bounds.up_right[0] 
    || chunk_coord[1] < bounds.down_left[1] || chunk_coord[1] > bounds.up_right[1] ){
      return false;
    }
    return true;
  }

  draw(context, program_state){
    let cam_pos = program_state.camera_transform.map(row => row[3]);
    this.new_position = this.get_chunk_coord(cam_pos);
    if(!this.last_position){
      this.last_position = this.new_position;  
      this.check_chunks_flag = true;    
    }

    let dist = Vec.of(...this.new_position).minus(Vec.of(...this.last_position)).norm();    
    if(dist >= 1 || this.check_chunks_flag){   
      console.log("checking chunks " + this.new_position + "   " + this.last_position); 
      let bounds = this.get_bounds(this.new_position);

      for(var chunk_coord in this.chunks){
        let chunk_coord_arr = JSON.parse(chunk_coord);
        if(!this.is_in_bounds(chunk_coord_arr, bounds)){
          if(this.evict(chunk_coord_arr))
            {this.num_showing--;}
        }
      }
      for(var i = bounds.down_left[0]; i <= bounds.up_right[0]; i++){
        for(var j = bounds.down_left[1]; j <= bounds.up_right[1]; j++){
          let curr_chunk_coord = [i, j];
          let curr_hash = JSON.stringify(curr_chunk_coord);
          if(! this.chunks.hasOwnProperty(curr_hash)){
            if(this.reinstate(curr_chunk_coord))
              {this.num_showing++;}
          }
        }
      }
      this.last_position = this.new_position;
      if(this.num_showing >= MIN_CHUNKS_TO_SHOW){
        this.check_chunks_flag = false;
      }      
    }
    this.frustrum.draw(context, program_state);    
    
  }  

}

