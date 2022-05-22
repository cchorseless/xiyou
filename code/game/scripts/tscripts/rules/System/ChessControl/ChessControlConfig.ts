export module ChessControlConfig {
   

    export enum EProtocol {
        pick_chess_position = "pick_chess_position",
      
    }
    export namespace I {
        export interface pick_chess_position{
            x: number;
            y: number;
            z: number;
            entityid: number;
      }
    }
}
