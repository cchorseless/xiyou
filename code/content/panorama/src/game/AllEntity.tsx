import { LogHelper } from "../helper/LogHelper";
import { ChessControlComponent } from "./components/ChessControlComponent";
import { DrawComponent } from "./components/DrawComponent";
import { PlayerComponent } from "./components/Player/PlayerComponent";
import { PlayerDataComponent } from "./components/Player/PlayerDataComponent";
import { ERoundBoard } from "./components/Round/ERoundBoard";
import { RoundManagerComponent } from "./components/Round/RoundManagerComponent";

ChessControlComponent;
DrawComponent;
PlayerComponent;
PlayerDataComponent;
RoundManagerComponent;
ERoundBoard;
export class AllEntity {
    static Init() {
        LogHelper.print("register all entity");
    }
}