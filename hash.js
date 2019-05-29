import {Block} from './blocks.js';


class HashTable{
  constructor(num_chunks, chunk_size){
    this.num_chunks = num_chunks;
    this.chunk_size = chunk_size;    
    this.table = {};
  }
  insertBlock(coord, block){
    let hash_string = this.hash(coord);
    this.table[hash_string] = block;
  }
  getBlock(coord){
    let hash_string = this.hash(coord);
    let block = this.table[hash_string];
    return block;
  }
  hash(coord){
    let hash_string = "";
    for(var i =0; i < 3; i++){
      let s = coord[i].toString().padStart(4, "0");
      hash_string += s;
    }
    return hash_string;
  }
}

export class Map{
  constructor(num_chunks, chunk_size){
    this.chunks = [];
    this.chunk_size = chunk_size;
    this.num_chunks = num_chunks;

    for(var i = 0; i < this.num_chunks; i++){
      this.chunks.push([]);
      for(var j = 0; j < this.num_chunks; j++){
        this.chunks[i].push([]);
        for(var k = 0; k < this.num_chunks; k++){
          this.chunks[i][j].push(new HashTable(this.num_chunks, this.chunk_size));
        }
      }
    }
    
  }
  chunk_num(coord){
    let corrected = coord.map(c => c + this.chunk_size * this.num_chunks / 2);
    let chunk_num = corrected.map(c => Math.min(Math.floor( Math.max(c, 0) / this.chunk_size)), this.num_chunks - 1);
    return chunk_num;
  }
  insertBlock(coord, block){
    let chunk = this.chunk_num(coord);
    this.chunks[chunk[0]][chunk[1]][chunk[2]].insertBlock(coord, block);
  }
  get(coord){
    let chunk = this.chunk_num(coord);
    return this.chunks[chunk[0]][chunk[1]][chunk[2]].getBlock(coord);
    
  }

}

