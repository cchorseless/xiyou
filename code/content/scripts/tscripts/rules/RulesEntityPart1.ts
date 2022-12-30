import { BuildingSystemComponent } from "./System/BuildingSystemComponent";
import { ChessControlSystemComponent } from "./System/ChessControlSystemComponent";
import { CombinationSystemComponent } from "./System/CombinationSystemComponent";
import { DrawSystemComponent } from "./System/DrawSystemComponent";
import { EnemySystemComponent } from "./System/EnemySystemComponent";
import { GameServiceSystemComponent } from "./System/GameServiceSystemComponent";
import { MapSystemComponent } from "./System/MapSystemComponent";
import { PublicBagSystemComponent } from "./System/PublicBagSystemComponent";
import { RoundSystemComponent } from "./System/RoundSystemComponent";






[
    GameServiceSystemComponent,
    MapSystemComponent,
    RoundSystemComponent,
    EnemySystemComponent,
    CombinationSystemComponent,
    ChessControlSystemComponent,
    BuildingSystemComponent,
    DrawSystemComponent,
    PublicBagSystemComponent,

]



export class RulesEntityPart1 {
    static init() {
        GLogHelper.print("register RulesEntityPart1");
    }
}