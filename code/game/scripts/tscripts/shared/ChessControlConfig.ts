export module ChessControlConfig {
    export const Gird_Width = 256;
    export const Gird_Height = 256;
    export const Gird_Max_X = 8;
    export const Gird_Max_Y = 10;
    export const ChessValid_Max_Y = 5;


    export enum Event {
        ChessControl_JoinBattle = "ChessControl_JoinBattle",
        ChessControl_LeaveBattle = "ChessControl_LeaveBattle",
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
