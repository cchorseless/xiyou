export module ChessControlConfig {
    export const Gird_Width = 200;
    export const Gird_Height = 200;
    export const Gird_Max_X = 8;
    export const Gird_Max_Y = 12;
    export const Gird_OffSet_Y = 3;
    export const ChessValid_Max_Y = 3;

    export enum Event {
        ChessControl_JoinBattle = "ChessControl_JoinBattle",
        ChessControl_LeaveBattle = "ChessControl_LeaveBattle",
    }


    export enum EProtocol {
        pick_chess_position = "pick_chess_position",
    }


}
declare global {
    namespace IChessControlConfig {
        interface IPickChessPosition {
            x: number;
            y: number;
            z: number;
            entityid: number;
        }
    }
}