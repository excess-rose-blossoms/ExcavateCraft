import {PerlinNoise} from './utils/perlin.js';
import {Random} from './utils/random.js';

export const CHUNK_SIZE = 16;
const HEIGHT = 32;
const CHAOS = 15;

export class MapGenerator{
  #noise;
  #random;
  constructor(seed){
    this.#random = new Random(seed);
    this.#noise = new PerlinNoise(this.#random);
  };

  convert_to_worldcoords(chunk, x, y, z){
    let nx = CHUNK_SIZE * chunk[0] + x;//(chunk[0]+(chunk[0]<0?1:0)) + ((chunk[0] < 0?-1:1) * x - (chunk[0] < 0?1:0));
    let nz = CHUNK_SIZE * chunk[1] + z;//(chunk[1]+(chunk[1]<0?1:0)) + ((chunk[1] < 0?-1:1) * z - (chunk[1] < 0?1:0));
    return [nx, y, nz];
  }

  
  generate_chunk(chunk, map, blocks){
    let my_chunk = []
    for(var x = 0; x < CHUNK_SIZE + 2; x++){
        my_chunk.push([])
      for(var y = 0; y < HEIGHT; y++){
          my_chunk[x].push([]);
        for(var z = 0; z < CHUNK_SIZE + 2; z++){
          my_chunk[x][y].push(null);
        }
      }
    }
    let chunk_obj = {};
    for(var x = -1; x < CHUNK_SIZE + 1; x ++){
      for(var y = 0; y< HEIGHT; y++){
        for(var z = -1; z< CHUNK_SIZE + 1; z++){
          let perlin = this.#noise.noise((x+chunk[0] * CHUNK_SIZE)/CHAOS, 
                                         y/CHAOS,
                                         (z+chunk[1]*CHUNK_SIZE)/CHAOS);
          if(2*perlin + (.7 - 5*y/HEIGHT)> 0){
            my_chunk[x+1][y][z+1] = {
              'block': blocks.grass, 
              'exposed': true
            };          
          }
        }
      }
    }
    for(var x = 0; x < CHUNK_SIZE + 2; x++){
      for(var z = 0; z < CHUNK_SIZE + 2; z++){
        my_chunk[x][0][z] = {
          'block': blocks.bedrock,
          'exposed': true
        };
      }
    }

    // Do checking for exposed blocks
    for(var x = 1; x < CHUNK_SIZE+1; x++){
      for(var y = 0; y<HEIGHT; y++){
        for(var z = 1; z<CHUNK_SIZE+1; z++){
          if(my_chunk[x][y][z] !== null){
            my_chunk[x][y][z].exposed = this.block_is_exposed(my_chunk, x, y, z);
          }
        }
      }
    }

    // Convert multi-dimensional array into an item that can be stored
    for(var x = 1; x < CHUNK_SIZE+1; x++){
      for(var y = 0; y<HEIGHT; y++){
        for(var z = 1; z<CHUNK_SIZE+1; z++){
          if(my_chunk[x][y][z] !== null){
            chunk_obj[JSON.stringify(this.convert_to_worldcoords(chunk, x-1, y, z-1))] = my_chunk[x][y][z];
          }
        }
      }
    }

    map.insert_chunk(chunk, chunk_obj);
  }

  block_is_exposed(chunk_data, x, y, z){
    if(y > 0 && y < HEIGHT - 1){
      return (chunk_data[x-1][y][z] == null || chunk_data[x+1][y][z] == null || 
              chunk_data[x][y-1][z] == null || chunk_data[x][y+1][z] == null || 
              chunk_data[x][y][z-1] == null || chunk_data[x][y][z+1] == null)
    }
    if(y == 0){
      return (chunk_data[x-1][y][z] == null || chunk_data[x+1][y][z] == null || 
              chunk_data[x][y+1][z] == null ||
              chunk_data[x][y][z-1] == null || chunk_data[x][y][z+1] == null)

    }
    return true;
  }

}