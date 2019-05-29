
const mod = 2147483648;
const a = 22695477;
const c = 1;

export class Random{
  #seed;
  constructor(seed){
    this.#seed = seed;
  }
  random(){
    this.#seed = (a * this.#seed + c) % mod;
    return this.#seed/mod;
  }


}