import { LogHelper } from "./helper/LogHelper";
import { BuildingComponent } from "./rules/Components/Building/BuildingComponent";
import { BuildingManagerComponent } from "./rules/Components/Building/BuildingManagerComponent";
import {  BuildingPropsComponent } from "./rules/Components/Building/BuildingPropsComponent";
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

PlayerComponent;
PlayerDataComponent
PlayerHttpComponent;
DrawComponent;
RoundManagerComponent;
RoundEnemyComponent;
RoundBuildingComponent;
CombinationManagerComponent;
BuildingManagerComponent
ChessControlComponent;
EnemyManagerComponent;

BuildingComponent;
BuildingPropsComponent;
CombinationComponent;
ChessComponent;

EnemyUnitComponent;
EnemyKillPrizeComponent;
EnemyMoveComponent;
EnemyPropsComponent;


export class AllEntity {
    static init() {
        LogHelper.print("register all entity");
    }
}
