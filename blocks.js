import {defs, tiny} from './assignment-4-resources.js';

const shader = new defs.Textured_Phong(2);

export class Block extends defs.Cube{
    constructor(){
        super();
    }
};

export class GrassBlock extends Block{
    #material;
    #shader;
    constructor(){
        super();
        this.#shader = shader;
        this.#material = new tiny.Material(this.#shader, { texture: new tiny.Texture( "assets/earth.gif" ),
                  ambient: 1, diffusivity: 1, specularity: 0, color: tiny.Color.of( .4,.4,.4,1 )});
    }
    draw(context, program_state, transform){
        let mat = this.#material;
        super.draw(context, program_state, transform, mat);
    }
}
