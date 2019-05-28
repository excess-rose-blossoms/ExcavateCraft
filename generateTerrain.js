import {PerlinNoise} from './perlin.js';

const CHUNK_SIZE = 16;
const HEIGHT = 32;
const DIVIDER = 10;

export class MapGenerator{
  #noise;
  constructor(seed){
    this.#noise = new PerlinNoise();
  };
  generate_chunk(chunk, map, blocks){
    for(var x = 0; x < CHUNK_SIZE; x ++){
      for(var y = 0; y< HEIGHT; y++){
        for(var z = 0; z< CHUNK_SIZE; z++){
          let perlin = this.#noise.noise((x+chunk[0] * CHUNK_SIZE)/DIVIDER, 
                                         y/DIVIDER,
                                         (z+chunk[1]*CHUNK_SIZE)/DIVIDER);
          if(2*perlin + (.7 - 5*y/HEIGHT)> 0){
            map.insertBlock([x+chunk[0]*CHUNK_SIZE, y, z + chunk[1]*CHUNK_SIZE], blocks.grass);
          }
        }
      }
    }

  }

}