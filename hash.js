import {tiny, defs} from './assignment-4-resources.js';
import {Block, BLOCK_TYPES, BLOCK_TYPES_INV, BLOCK_CONVERTER, INT_TO_BLOCK} from './blocks.js';
import {Frustrum} from './frustrum.js';
const { Vec, Mat, Mat4, Color, Light, Shape, Shader, Material, Texture,
         Scene, Canvas_Widget, Code_Widget, Text_Widget } = tiny;

const MIN_CHUNKS_TO_SHOW = 1;


export class Map{
  constructor(chunk_size, num_chunks, blocks, generator){
    this.chunks = {};
    this.chunk_size = chunk_size;
    this.num_chunks = num_chunks;
    this.frustrum = new Frustrum(this);
    this.blocks = blocks;
    this.check_chunks_flag = true;
    this.num_showing = 0;
    this.generator = generator;
    
  }
  get_chunk_coord(coord){
    coord = [coord[0], coord[2]];
    //let chunk_coord = coord.map(c => (c<0?-1:1)* Math.floor((c<0?-1:1) * c / this.chunk_size)  - (c<0?1:0));
    return coord.map(c => Math.floor( c / this.chunk_size) );
    //return chunk_coord;
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
    let chunk_coord_hash = JSON.stringify(chunk_coord);
    let flag = {};
    if(! this.chunks.hasOwnProperty(chunk_coord_hash)){
      let chunk = localStorage.getItem(chunk_coord_hash);
      if(!chunk){
        chunk = {};
      }else{
        chunk = JSON.parse(chunk);
      }
      chunk[JSON.stringify(coord)] = {};
      chunk[JSON.stringify(coord)].exposed = block.exposed;
      let block_type = BLOCK_TYPES[chunk[world_coord_hash].block.constructor.name];
      chunk[JSON.stringify(coord)].block = block_type;
      chunk = JSON.stringify(chunk);
      localStorage.setItem(chunk_coord_hash, chunk);
    }else{
      this.chunks[chunk_coord_hash][JSON.stringify(coord)] = block;
      this.frustrum.insertBlock(coord, block);
    }

    
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
    let chunk_coord_hash = JSON.stringify(chunk_coord);
    let chunk = this.chunks[chunk_coord_hash];
    if(chunk === null){
      return false;
    }
    let chunk_list = []
    let x_off = chunk_coord[0] * 16;
    let z_off = chunk_coord[1] * 16;
    for(var world_coord_hash in chunk){
      let positions = JSON.parse(world_coord_hash);
      let encoded = this.encode_block(chunk[world_coord_hash].block.id, 
      positions[0] - x_off, positions[1], positions[2] - z_off, chunk[world_coord_hash].exposed);
      this.frustrum.deleteBlock(positions);
      chunk_list.push(encoded);
    }
    localStorage.setItem(chunk_coord_hash, JSON.stringify(chunk_list));
    this.chunks[chunk_coord_hash] = null;
    delete this.chunks[chunk_coord_hash];

    return true;
  }

  reinstate(chunk_coord){
    let chunk_coord_hash = JSON.stringify(chunk_coord);
    let chunk_temp = localStorage.getItem(chunk_coord_hash);
    let x_off = 16 * chunk_coord[0];
    let z_off = 16 * chunk_coord[1];
    let chunk = {};

    if(! chunk_temp){
      chunk_temp = this.generator.generate_chunk(chunk_coord, this, this.blocks);
      for(var i = 0; i<chunk_temp.length; i++){
      	let thisblock = {
      		block: chunk_temp[i].block,
      		exposed: chunk_temp[i].exposed
      	};
      	let world_coord = [chunk_temp[i].x + x_off, chunk_temp[i].y, chunk_temp[i].z + z_off];
      	this.frustrum.insertBlock(world_coord, thisblock);
      	chunk[JSON.stringify(world_coord)] = thisblock;
      }
    }else{
    	chunk_temp = JSON.parse(chunk_temp);
		for(var i = 0; i<chunk_temp.length; i++){
			let decoded = this.decode_block(chunk_temp[i]);
			let thisblock = {
				block: this.blocks[INT_TO_BLOCK[decoded[0]]],
				exposed: decoded[4]
		  };
		  let world_coord = [decoded[1]+x_off, decoded[2], decoded[3]+z_off];
		  this.frustrum.insertBlock(world_coord, thisblock);
		  chunk[JSON.stringify(world_coord)] = thisblock;
		}
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
    let blocklist = [];
    let value = 0;
    for(var i = 0; i<chunk.length; i++){
		value = this.encode_block(chunk[i].block_type, chunk[i].x, chunk[i].y, chunk[i].z, chunk[i].exposed);
		blocklist.push(value);
    }
    localStorage.setItem(chunk_coord_hash, JSON.stringify(blocklist));
  }

  // Delete a chunk from localStorage
  delete_chunk_from_disk(chunk_coord){
    let chunk_coord_hash = JSON.stringify( chunk_coord);
    localStorage.removeItem(chunk_coord);
  }
  
  is_in_bounds(chunk_coord, bounds){
    if(chunk_coord[0] < bounds.down_left[0] || chunk_coord[0] > bounds.up_right[0] 
    || chunk_coord[1] < bounds.down_left[1] || chunk_coord[1] > bounds.up_right[1] ){
      return false;
    }
    return true;
  }

  // FAST RAYCAST: Takes a single direction and raycasts to the first nearest block
  fast_raycast(position, direction, depth){
    for(var i = 0; i<=depth; i++){
      let newpos = [Math.floor(position[0]+direction[0]*i), 
                    Math.floor(position[1]+direction[1]*i), 
                    Math.floor(position[2]+direction[2]*i)];
      let block = this.get(newpos);
      if(block !== null){
        return block;
      }
    }
    return null;
  }

  // returns an integer that is the encoded representation of the block, position and exposed data
  encode_block(blocktype, x, y, z, exposed){
	let e_val = 0;
	if(exposed)
		e_val = 1;
	let result = (blocktype & 0x1f) << 21 | 
			 (x & 0xf) << 17 | 
			 (y & 0x3f) << 11 | 
			 (z & 0xf) << 5 |
			 e_val;
	return result;
}

  // Returns an array with [blocktype, x coordinate, y coordinate, z coordinate, exposed boolean]
  decode_block(value){
	let blocktype = (value >>> 21) & 0x1f;
	let x = (value >>> 17) & 0xf;
	let y = (value >>> 11) & 0x3f;
	let z = (value >>> 5) & 0xf;
	let e_val = (value & 1) == 1;
	return [blocktype, x, y, z, e_val];
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

