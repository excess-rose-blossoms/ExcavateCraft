import {PerlinNoise} from './perlin.js';

const noise = new PerlinNoise();
export function gen_tree(map, position, wood, leaf){

  let height = parseInt(5 + 2*noise.noise(1.2,0,5.2));
  let size = 2;

  for(var x = position[0] - size; x <= position[0] + size; x ++){
    for(var y = position[1] + height - size; y <= position[1] + height + size; y ++){
      for(var z = position[2] - size; z <= position[2] + size; z ++){
        let dist = Math.sqrt(x*x + y*y + z*z);
        if(size + noise.noise((x%10)/11.0, (y%10)/11., (z%10)/11.) - dist > 0)
          map.insertBlock([x, y, z], leaf);
      }
    }
  }

  for(var i = position[1]; i < position[1]+height; i++){
    map.insertBlock([position[0], i, position[2]], wood);
  }
};