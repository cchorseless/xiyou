import { LogHelper } from "../helper/LogHelper";
import { ChessControlComponent } from "./components/ChessControlComponent";
import { DrawComponent } from "./components/DrawComponent";
import { PlayerComponent } from "./components/Player/PlayerComponent";
import { PlayerDataComponent } from "./components/Player/PlayerDataComponent";
import { ERoundBoard } from "./components/Round/ERoundBoard";
import { RoundManagerComponent } from "./components/Round/RoundManagerComponent";
import { CharacterDataComponent } from "./service/account/CharacterDataComponent";
import { SeedRandomComponent } from "./service/account/SeedRandomComponent";
import { TCharacter } from "./service/account/TCharacter";
import { BagComponent } from "./service/bag/BagComponent";
import { TItem } from "./service/bag/TItem";

ChessControlComponent;
DrawComponent;
PlayerComponent;
PlayerDataComponent;
RoundManagerComponent;
ERoundBoard;


CharacterDataComponent;
SeedRandomComponent;
TCharacter;
BagComponent;
TItem;
export class AllEntity {
    static Init() {
        LogHelper.print("register all entity");
    }
}