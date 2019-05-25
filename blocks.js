import {defs, tiny} from './assignment-4-resources.js';

const {Texture, Material} = tiny;
const shader = new defs.Textured_Phong(2);
const material = new Material(shader, {ambient: .4, diffusivity: .4, specularity: .4, color: tiny.Color.of(.3,.3,.3,1)})
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
    constructor(){
        super();
        this.#material = material.override({ texture: new Texture( "assets/grass.png" )});
    }
    draw(context, program_state, transform){
        super.draw(context, program_state, transform, this.#material);
    }
}

export class BrickBlock extends Block{
    #material;
    constructor(){
        super();
        this.#material = material.override({texture: new Texture("assets/bricks.png")});
    }
    draw(context, program_state, transform){
        super.draw(context, program_state, transform, this.#material);
    }
}
