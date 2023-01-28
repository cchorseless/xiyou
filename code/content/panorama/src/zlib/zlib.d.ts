declare module Zlib {
    export class Inflate {
        constructor(data: Array<number> | Uint8Array);
        decompress(): Array<number> | Uint8Array;
    }
}