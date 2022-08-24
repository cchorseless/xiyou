import { LogHelper } from "./helper/LogHelper";
import { MapSystemComponent } from "./rules/System/Map/MapSystemComponent";
import { RoundSystemComponent } from "./rules/System/Round/RoundSystemComponent";
import { PlayerSystemComponent } from "./rules/System/Player/PlayerSystemComponent";
import { EnemySystemComponent } from "./rules/System/Enemy/EnemySystemComponent";
import { CombinationSystemComponent } from "./rules/System/Combination/CombinationSystem";
import { ChessControlSystemComponent } from "./rules/System/ChessControl/ChessControlSystemComponent";
import { BuildingSystemComponent } from "./rules/System/Building/BuildingSystemComponent";
import { DrawSystemComponent } from "./rules/System/Draw/DrawSystemComponent";
import { BuildingComponent } from "./rules/Components/Building/BuildingComponent";
import { BuildingManagerComponent } from "./rules/Components/Building/BuildingManagerComponent";
import { BuildingPropsComponent } from "./rules/Components/Building/BuildingPropsComponent";
import { ChessComponent } from "./rules/Components/ChessControl/ChessComponent";
import { ChessControlComponent } from "./rules/Components/ChessControl/ChessControlComponent";
import { CombinationComponent } from "./rules/Components/Combination/CombinationComponent";
import { CombinationManagerComponent } from "./rules/Components/Combination/CombinationManagerComponent";
import { DrawComponent } from "./rules/Components/Draw/DrawComponent";
import { EnemyKillPrizeComponent } from "./rules/Components/Enemy/EnemyKillPrizeComponent";
import { EnemyManagerComponent } from "./rules/Components/Enemy/EnemyManagerComponent";
import { EnemyMoveComponent } from "./rules/Components/Enemy/EnemyMoveComponent";
import { EnemyPropsComponent } from "./rules/Components/Enemy/EnemyPropsComponent";
import { EnemyUnitComponent } from "./rules/Components/Enemy/EnemyUnitComponent";
import { PlayerComponent } from "./rules/Components/Player/PlayerComponent";
import { PlayerHttpComponent } from "./rules/Components/Player/PlayerHttpComponent";
import { RoundEnemyComponent } from "./rules/Components/Round/RoundEnemyComponent";
import { RoundManagerComponent } from "./rules/Components/Round/RoundManagerComponent";
import { PlayerDataComponent } from "./rules/Components/Player/PlayerDataComponent";
import { RoundBuildingComponent } from "./rules/Components/Round/RoundBuildingComponent";
import { RoundPrizeUnitKillPrizeComponent } from "./rules/Components/Round/RoundPrizeUnitKillPrizeComponent";
import { WearableComponent } from "./rules/Components/Wearable/WearableComponent";
import { WearableSystemComponent } from "./rules/System/Wearable/WearableSystemComponent";
import { ServiceEntity } from "./service/ServiceEntity";

[
    MapSystemComponent,
    RoundSystemComponent,
    PlayerSystemComponent,
    EnemySystemComponent,
    CombinationSystemComponent,
    ChessControlSystemComponent,
    BuildingSystemComponent,
    DrawSystemComponent,

    PlayerComponent,
    PlayerDataComponent,
    PlayerHttpComponent,
    DrawComponent,
    RoundManagerComponent,
    RoundEnemyComponent,
    RoundBuildingComponent,
    RoundPrizeUnitKillPrizeComponent,
    CombinationManagerComponent,
    BuildingManagerComponent,
    ChessControlComponent,
    EnemyManagerComponent,

    BuildingComponent,
    BuildingPropsComponent,
    CombinationComponent,
    ChessComponent,

    EnemyUnitComponent,
    EnemyKillPrizeComponent,
    EnemyMoveComponent,
    EnemyPropsComponent,

    WearableComponent,
    WearableSystemComponent,
];
export class AllEntity {
    static init() {
        ServiceEntity.init();
        LogHelper.print("register all entity");
    }
}
