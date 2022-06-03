export module ChessControlConfig {
    export const Gird_Width = 256;
    export const Gird_Height = 256;
    export const Gird_Max_X = 8;
    export const Gird_Max_Y = 10;
    export const ChessValid_Max_Y = 5;


    export class ChessVector {
        public x = -1;
        public y = -1;
        public playerid = -1;
        constructor(x: number, y: number, playerid: number) {
            this.x = x;
            this.y = y;
            this.playerid = playerid;
        }
        isSame(v: ChessControlConfig.ChessVector) {
            return this.isSameX(v) && this.isSameY(v) && this.isSamePlayer(v);
        }
        isSameX(v: ChessControlConfig.ChessVector) {
            return this.x - v.x < 0.1 && this.x - v.x > -0.1;
        }
        isSameY(v: ChessControlConfig.ChessVector) {
            return this.y - v.y < 0.1 && this.y - v.y > -0.1;
        }
        isSamePlayer(v: ChessControlConfig.ChessVector) {
            return this.playerid - v.playerid < 0.1 && this.playerid - v.playerid > -0.1;
        }
        distance(v: ChessControlConfig.ChessVector) {
            return (this.x - v.x)*(this.x - v.x) + (this.y - v.y)*(this.y - v.y);
       }
    }

    export enum EProtocol {
        pick_chess_position = "pick_chess_position",
    }
    export namespace I {
        export interface pick_chess_position {
            x: number;
            y: number;
            z: number;
            entityid: number;
        }
    }
}
