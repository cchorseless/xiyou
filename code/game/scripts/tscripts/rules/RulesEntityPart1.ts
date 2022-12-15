import { LogHelper } from "../helper/LogHelper";
import { BuildingSystemComponent } from "./System/Building/BuildingSystemComponent";
import { ChessControlSystemComponent } from "./System/ChessControl/ChessControlSystemComponent";
import { CombinationSystemComponent } from "./System/Combination/CombinationSystem";
import { DrawSystemComponent } from "./System/Draw/DrawSystemComponent";
import { EnemySystemComponent } from "./System/Enemy/EnemySystemComponent";
import { GameStateSystemComponent } from "./System/GameState/GameStateSystemComponent";
import { MapSystemComponent } from "./System/Map/MapSystemComponent";
import { PlayerSystemComponent } from "./System/Player/PlayerSystemComponent";
import { PublicBagSystemComponent } from "./System/Public/PublicBagSystemComponent";
import { RoundSystemComponent } from "./System/Round/RoundSystemComponent";







[
    GameStateSystemComponent,
    MapSystemComponent,
    RoundSystemComponent,
    PlayerSystemComponent,
    EnemySystemComponent,
    CombinationSystemComponent,
    ChessControlSystemComponent,
    BuildingSystemComponent,
    DrawSystemComponent,
    PublicBagSystemComponent,

]



export class RulesEntityPart1 {
    static init() {
        LogHelper.print("register RulesEntityPart1");
    }
}