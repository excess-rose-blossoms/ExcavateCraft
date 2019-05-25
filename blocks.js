import {defs, tiny} from './assignment-4-resources.js';

const shader = new defs.Textured_Phong(2);

export class Block extends defs.Cube{
    constructor(){
        super();
        this.arrays.texture_coord = tiny.Vec.cast(
        [.25,0], [.5,0], [.25,.25], [.5,.25],   // BOTTOM
        [.25,.5], [.5,.5], [.25,.75], [.5,.75], // TOP
        [0,.75], [0,.5], [.25,.75], [.25,.5],   // LEFT
        [.75,.5], [.75,.75], [.5,.5], [.5,.75], // RIGHT
        [.25,.25], [.5,.25], [.25,.5], [.5,.5], // FRONT
        [.25,.75], [.5,.75], [.25,1], [.5,1],   // BACK //TODO: Fix this ordering
        )
    }
};

export class GrassBlock extends Block{
    #material;
    #shader;
    constructor(){
        super();
        this.#shader = shader;
        this.#material = new tiny.Material(this.#shader, { texture: new tiny.Texture( "assets/grass.png" ),
                  ambient: 1, diffusivity: 1, specularity: 0, color: tiny.Color.of( .4,.4,.4,1 )});
    }
    draw(context, program_state, transform){
        let mat = this.#material;
        super.draw(context, program_state, transform, mat);
    }
}
