import { LogHelper } from "../helper/LogHelper";
import { AbilityManagerComponent } from "./Components/Ability/AbilityManagerComponent";
import { AiAttackComponent } from "./Components/AI/AiAttackComponent";
import { BattleUnitManagerComponent } from "./Components/BattleUnit/BattleUnitManagerComponent";
import { BuildingComponent } from "./Components/Building/BuildingComponent";
import { BuildingManagerComponent } from "./Components/Building/BuildingManagerComponent";
import { BuildingPropsComponent } from "./Components/Building/BuildingPropsComponent";
import { ChessComponent } from "./Components/ChessControl/ChessComponent";
import { ChessControlComponent } from "./Components/ChessControl/ChessControlComponent";
import { CombinationComponent } from "./Components/Combination/CombinationComponent";
import { CombinationManagerComponent } from "./Components/Combination/CombinationManagerComponent";
import { ECombination } from "./Components/Combination/ECombination";
import { ECombinationLabelItem } from "./Components/Combination/ECombinationLabelItem";
import { DrawComponent } from "./Components/Draw/DrawComponent";
import { EnemyKillPrizeComponent } from "./Components/Enemy/EnemyKillPrizeComponent";
import { EnemyManagerComponent } from "./Components/Enemy/EnemyManagerComponent";
import { EnemyMoveComponent } from "./Components/Enemy/EnemyMoveComponent";
import { EnemyPropsComponent } from "./Components/Enemy/EnemyPropsComponent";
import { EnemyUnitComponent } from "./Components/Enemy/EnemyUnitComponent";
import { FakerHeroComponent } from "./Components/FakerHero/FakerHeroComponent";
import { FHeroCombination } from "./Components/FakerHero/FHeroCombination";
import { FHeroCombinationManagerComponent } from "./Components/FakerHero/FHeroCombinationManagerComponent";
import { ItemManagerComponent } from "./Components/Item/ItemManagerComponent";
import { PlayerDataComponent } from "./Components/Player/PlayerDataComponent";
import { PlayerHeroComponent } from "./Components/Player/PlayerHeroComponent";
import { PlayerHttpComponent } from "./Components/Player/PlayerHttpComponent";
import { RoundStateComponent } from "./Components/Round/RoundStateComponent";
import { RoundManagerComponent } from "./Components/Round/RoundManagerComponent";
import { RoundPrizeUnitKillPrizeComponent } from "./Components/Round/RoundPrizeUnitKillPrizeComponent";
import { EWearableItem } from "./Components/Wearable/EWearableItem";
import { WearableComponent } from "./Components/Wearable/WearableComponent";
import { BuildingSystemComponent } from "./System/Building/BuildingSystemComponent";
import { ChessControlSystemComponent } from "./System/ChessControl/ChessControlSystemComponent";
import { CombinationSystemComponent } from "./System/Combination/CombinationSystem";
import { DrawSystemComponent } from "./System/Draw/DrawSystemComponent";
import { EnemySystemComponent } from "./System/Enemy/EnemySystemComponent";
import { MapSystemComponent } from "./System/Map/MapSystemComponent";
import { PlayerSystemComponent } from "./System/Player/PlayerSystemComponent";
import { PublicBagSystemComponent } from "./System/Public/PublicBagSystemComponent";
import { RoundSystemComponent } from "./System/Round/RoundSystemComponent";
import { WearableSystemComponent } from "./System/Wearable/WearableSystemComponent";



[
    MapSystemComponent,
    RoundSystemComponent,
    PlayerSystemComponent,
    EnemySystemComponent,
    CombinationSystemComponent,
    ChessControlSystemComponent,
    BuildingSystemComponent,
    DrawSystemComponent,
    PublicBagSystemComponent,
    BattleUnitManagerComponent,
    AbilityManagerComponent,
    ItemManagerComponent,
    PlayerHeroComponent,
    PlayerDataComponent,
    PlayerHttpComponent,
    DrawComponent,
    RoundManagerComponent,
    RoundStateComponent,
    RoundPrizeUnitKillPrizeComponent,
    CombinationManagerComponent,
    CombinationComponent,
    ECombination,
    ECombinationLabelItem,
    BuildingManagerComponent,
    ChessControlComponent,
    EnemyManagerComponent,

    AiAttackComponent,

    FakerHeroComponent,
    FHeroCombination,
    FHeroCombinationManagerComponent,

    BuildingComponent,
    BuildingPropsComponent,
    ChessComponent,

    EnemyUnitComponent,
    EnemyKillPrizeComponent,
    EnemyMoveComponent,
    EnemyPropsComponent,

    EWearableItem,
    WearableComponent,
    WearableSystemComponent,
];
export class AllRulesEntity {
    static init() {
        LogHelper.print("register AllRulesEntity");
    }
}