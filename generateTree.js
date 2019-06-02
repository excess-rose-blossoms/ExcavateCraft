import {PerlinNoise} from './utils/perlin.js';

const noise = new PerlinNoise();
export function gen_tree(map, position, wood, leaf){

  let height = parseInt(5 + 2*noise.noise(1.2,0,5.2));
  let size = 3;
  let result = {};
  for(var x = - size; x <= size; x ++){
    for(var y = - size; y <= size; y ++){
      for(var z = - size; z <= size; z ++){
        let dist = Math.sqrt(x*x + y*y + z*z);
        if(size + 3*noise.noise(x/11.0, 10/11., z/11.) - 1.2*dist > 0){
          result[x + position[0], y + position[1] + height, z + position[2]] = leaf;
        }
      }
    }
  }

  for(var i = position[1]; i <= position[1]+height; i++){
    map.insertBlock([position[0], i, position[2]], wood);
  }
};

