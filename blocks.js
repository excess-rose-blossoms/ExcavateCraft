import {defs, tiny} from './assignment-4-resources.js';

const {Texture, Material} = tiny;
const shader = new defs.Textured_Phong(2);
const material = new Material(shader, {ambient: .4, diffusivity: .4, specularity: .4, color: tiny.Color.of(.3,.3,.3,1)})
export const BLOCK_TYPES = {
    "GrassBlock": 0,
    "BrickBlock": 1,
    "StoneBlock": 2,
    "SandBlock": 3,
    "WoodBlock": 4,
    "LeafBlock": 5,
    "BedrockBlock": 6
}; 

export const BLOCK_TYPES_INV = {
    0: "GrassBlock",
    1: "BrickBlock",
    2: "StoneBlock",
    3: "SandBlock",
    4: "WoodBlock",
    5: "LeafBlock",
    6: "BedrockBlock"
}; 

export const BLOCK_CONVERTER = {
  "GrassBlock": "grass",
    "BrickBlock": "brick",
    "StoneBlock": "stone",
    "SandBlock": "sand",
    "WoodBlock": "wood",
    "LeafBlock": "leaf",
    "BedrockBlock": "bedrock"
};

export const INT_TO_BLOCK = {
    0: "grass",
    1: "brick",
    2: "stone",
    3: "sand",
    4: "wood",
    5: "leaf",
    6: "bedrock"
}

export class Block extends defs.Cube{
    constructor(){
        super();
        this.arrays.texture_coord = tiny.Vec.cast(
        [.25,0], [.5,0], [.25,.25], [.5,.25],   // BOTTOM
        [.25,.5], [.5,.5], [.25,.75], [.5,.75], // TOP
        [0,.75], [0,.5], [.25,.75], [.25,.5],   // LEFT
        [.75,.5], [.75,.75], [.5,.5], [.5,.75], // RIGHT
        [.25,.25], [.5,.25], [.25,.5], [.5,.5], // FRONT
        [.5,1], [.25,1], [.5,.75], [.25,.75],   // BACK
        )
    }
};

export class GrassBlock extends Block{
    #material;
    constructor(){
        super();
        this.#material = material.override({ texture: new Texture( "assets/grass.png" )});
        this.id = 0;
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
        this.id = 1;
    }
    draw(context, program_state, transform){
        super.draw(context, program_state, transform, this.#material);
    }
}

export class StoneBlock extends Block{
    #material;
    constructor(){
        super();
        this.#material = material.override({texture: new Texture("assets/stone.png")});
        this.id = 2;
    }
    draw(context, program_state, transform){
        super.draw(context, program_state, transform, this.#material);
    }
}

export class SandBlock extends Block{
    #material;
    constructor(){
        super();
        this.#material = material.override({texture: new Texture("assets/sand.png")});
        this.id = 3;
    }
    draw(context, program_state, transform){
        super.draw(context, program_state, transform, this.#material);
    }
}

export class WoodBlock extends Block{
    #material;
    constructor(){
        super();
        this.#material = material.override({texture: new Texture("assets/wood.png")});
        this.id = 4;
    }
    draw(context, program_state, transform){
        super.draw(context, program_state, transform, this.#material);
    }
}

export class LeafBlock extends Block{
    #material;
    constructor(){
        super();
        this.#material = material.override({texture: new Texture("assets/leaves.png")});
        this.id = 5;
    }
    draw(context, program_state, transform){
        super.draw(context, program_state, transform, this.#material);
    }
}
export class BedrockBlock extends Block{
    #material;
    constructor(){
        super();
        this.#material = material.override({texture: new Texture("assets/bedrock.png")});
        this.id = 6;
    }
    draw(context, program_state, transform){
        super.draw(context, program_state, transform, this.#material);
    }
}