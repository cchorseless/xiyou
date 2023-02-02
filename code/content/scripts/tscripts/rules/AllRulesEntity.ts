import { AbilityManagerComponent } from "./Components/Ability/AbilityManagerComponent";
import { AiAttackComponent } from "./Components/AI/AiAttackComponent";
import { BattleUnitManagerComponent } from "./Components/BattleUnit/BattleUnitManagerComponent";
import { BuildingDataComponent } from "./Components/Building/BuildingDataComponent";
import { BuildingManagerComponent } from "./Components/Building/BuildingManagerComponent";
import { BuildingPropsComponent } from "./Components/Building/BuildingPropsComponent";
import { ChessControlComponent } from "./Components/ChessControl/ChessControlComponent";
import { ChessMoveComponent } from "./Components/ChessControl/ChessMoveComponent";
import { CombinationComponent } from "./Components/Combination/CombinationComponent";
import { CombinationManagerComponent } from "./Components/Combination/CombinationManagerComponent";
import { ECombination } from "./Components/Combination/ECombination";
import { ECombinationLabelItem } from "./Components/Combination/ECombinationLabelItem";
import { DrawComponent } from "./Components/Draw/DrawComponent";
import { EnemyDataComponent } from "./Components/Enemy/EnemyDataComponent";
import { EnemyKillPrizeComponent } from "./Components/Enemy/EnemyKillPrizeComponent";
import { EnemyManagerComponent } from "./Components/Enemy/EnemyManagerComponent";
import { EnemyMoveComponent } from "./Components/Enemy/EnemyMoveComponent";
import { FakerHeroDataComponent } from "./Components/FakerHero/FakerHeroDataComponent";
import { FHeroCombination } from "./Components/FakerHero/FHeroCombination";
import { FHeroCombinationManagerComponent } from "./Components/FakerHero/FHeroCombinationManagerComponent";
import { InventoryComponent } from "./Components/Inventory/InventoryComponent";
import { PlayerDataComponent } from "./Components/Player/PlayerDataComponent";
import { PlayerHttpComponent } from "./Components/Player/PlayerHttpComponent";
import { RoundManagerComponent } from "./Components/Round/RoundManagerComponent";
import { RoundPrizeUnitKillPrizeComponent } from "./Components/Round/RoundPrizeUnitKillPrizeComponent";
import { RoundStateComponent } from "./Components/Round/RoundStateComponent";
import { EWearableItem } from "./Components/Wearable/EWearableItem";
import { WearableComponent } from "./Components/Wearable/WearableComponent";

import { LuBanConfigComponent } from "./ComponentExt/LuBanConfigComponent";
import { BuffManagerComponent } from "./Components/Buff/BuffManagerComponent";
import { ChessDataComponent } from "./Components/ChessControl/ChessDataComponent";
import { CombEffectComponent } from "./Components/Combination/CombEffectComponent";
import { CourierBagComponent } from "./Components/Courier/CourierBagComponent";
import { CourierDataComponent } from "./Components/Courier/CourierDataComponent";
import { CourierShopComponent } from "./Components/Courier/CourierShopComponent";
import { PlayerEntityRoot } from "./Components/Player/PlayerEntityRoot";
import { RulesEntityPart1 } from "./RulesEntityPart1";
import { WearableSystemComponent } from "./System/WearableSystemComponent";


[
    LuBanConfigComponent,
    BattleUnitManagerComponent,
    AbilityManagerComponent,
    InventoryComponent,
    PlayerEntityRoot,
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
    CombEffectComponent,
    CourierDataComponent,
    CourierBagComponent,
    CourierShopComponent,
    BuildingManagerComponent,
    ChessControlComponent,
    ChessDataComponent,
    EnemyManagerComponent,
    AiAttackComponent,

    FakerHeroDataComponent,
    FHeroCombination,
    FHeroCombinationManagerComponent,

    BuffManagerComponent,
    BuildingDataComponent,
    BuildingPropsComponent,
    ChessMoveComponent,

    EnemyDataComponent,
    EnemyKillPrizeComponent,
    EnemyMoveComponent,
    EWearableItem,
    WearableComponent,
    WearableSystemComponent,
];
export class AllRulesEntity {
    static init() {
        RulesEntityPart1.init()
        GLogHelper.print("register AllRulesEntity");
    }
}