import { DrawEventHandler } from "./DrawEventHandler";

export class DrawSystem {


    public static init() {
        DrawEventHandler.startListen(DrawSystem);
    }
}