import {PerlinNoise} from './perlin.js';

export const CHUNK_SIZE = 16;
const HEIGHT = 32;
const DIVIDER = 10;

export class MapGenerator{
  #noise;
  constructor(seed){
    this.#noise = new PerlinNoise();
  };
  generate_chunk(chunk, map, blocks){
    let chunk_obj = {};
    for(var x = 0; x < CHUNK_SIZE; x ++){
      for(var y = 0; y< HEIGHT; y++){
        for(var z = 0; z< CHUNK_SIZE; z++){
          let perlin = this.#noise.noise((x+chunk[0] * CHUNK_SIZE)/DIVIDER, 
                                         y/DIVIDER,
                                         (z+chunk[1]*CHUNK_SIZE)/DIVIDER);
          if(2*perlin + (.7 - 5*y/HEIGHT)> 0){
            //map.insertBlock([x+chunk[0]*CHUNK_SIZE, y, z + chunk[1]*CHUNK_SIZE], blocks.grass);
            var x_fin = CHUNK_SIZE * (chunk[0]+(chunk[0]<0?1:0)) + ((chunk[0] < 0?-1:1) * x - (chunk[0] < 0?1:0));
            var z_fin = CHUNK_SIZE * (chunk[1]+(chunk[1]<0?1:0)) + ((chunk[1] < 0?-1:1) * z - (chunk[1] < 0?1:0));
            var coord_hash = JSON.stringify([x_fin, y, z_fin]);
            chunk_obj[coord_hash] = {
              'block': blocks.grass, 
              'exposed': true
            };          

          }
        }
      }

      for(var coord_hash in chunk_obj){
        let adj_counter = 0;
        let coord_arr = JSON.parse(coord_hash);
        let l = [-1, 1];
        for(var i = 0; i < 2; i++){
          for(var j = 0; j < 2; j++){
            for(var k = 0; k < 2; k++){
              let other_hash = JSON.stringify([coord_arr[0] + l[i], coord_arr[1] + l[j], coord_arr[2] + l[k]]);
              if(chunk_obj.hasOwnProperty(other_hash)){
                adj_counter++;
              }
            }            
          }
        }
        if(adj_counter >= 6){
          chunk_obj[coord_hash].exposed = false;
        }
      }
      map.insert_chunk(chunk, chunk_obj);
    }

  }

}