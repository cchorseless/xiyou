import { ChessControlEventHandler } from "./ChessControlEventHandler";

export class ChessControlSystem {


    public static init() {
        ChessControlEventHandler.startListen(ChessControlSystem);
    }
}