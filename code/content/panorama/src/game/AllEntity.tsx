import { AllServiceEntity } from "../../../scripts/tscripts/shared/service/AllServiceEntity";
import { LogHelper } from "../helper/LogHelper";
import { AbilityEntityRoot } from "./components/Ability/AbilityEntityRoot";
import { BattleUnitIllusionEntityRoot } from "./components/BattleUnit/BattleUnitIllusionEntityRoot";
import { BattleUnitSummonEntityRoot } from "./components/BattleUnit/BattleUnitSummonEntityRoot";
import { BuildingComponent } from "./components/Building/BuildingComponent";
import { BuildingEntityRoot } from "./components/Building/BuildingEntityRoot";
import { BuildingManagerComponent } from "./components/Building/BuildingManagerComponent";
import { BuildingRuntimeEntityRoot } from "./components/Building/BuildingRuntimeEntityRoot";
import { ChessControlComponent } from "./components/ChessControl/ChessControlComponent";
import { ChessDataComponent } from "./components/ChessControl/ChessDataComponent";
import { CombinationManagerComponent } from "./components/Combination/CombinationManagerComponent";
import { ECombination } from "./components/Combination/ECombination";
import { CourierBagComponent } from "./components/Courier/CourierBagComponent";
import { CourierDataComponent } from "./components/Courier/CourierDataComponent";
import { CourierEntityRoot } from "./components/Courier/CourierEntityRoot";
import { CourierShopComponent } from "./components/Courier/CourierShopComponent";
import { DrawComponent } from "./components/Draw/DrawComponent";
import { EnemyUnitComponent } from "./components/Enemy/EnemyUnitComponent";
import { EnemyUnitEntityRoot } from "./components/Enemy/EnemyUnitEntityRoot";
import { FakerHeroEntityRoot } from "./components/FakerHero/FakerHeroEntityRoot";
import { FHeroCombination } from "./components/FakerHero/FHeroCombination";
import { FHeroCombinationManagerComponent } from "./components/FakerHero/FHeroCombinationManagerComponent";
import { ItemEntityRoot } from "./components/Item/ItemEntityRoot";
import { PlayerDataComponent } from "./components/Player/PlayerDataComponent";
import { PlayerEntityRoot } from "./components/Player/PlayerEntityRoot";
import { PlayerNetTableComponent } from "./components/Player/PlayerNetTableComponent";
import { PublicShopComponent } from "./components/Public/PublicShopComponent";
import { ERoundBoard } from "./components/Round/ERoundBoard";
import { RoundManagerComponent } from "./components/Round/RoundManagerComponent";
import { GameServiceSystemComponent } from "./system/GameStateSystemComponent";
import { PublicBagSystemComponent } from "./system/PublicBagSystemComponent";


GameServiceSystemComponent;

AbilityEntityRoot;
ItemEntityRoot;

ChessDataComponent;
BattleUnitIllusionEntityRoot;
BattleUnitSummonEntityRoot;

BuildingEntityRoot;
BuildingComponent;
BuildingManagerComponent;
BuildingRuntimeEntityRoot;


CombinationManagerComponent;

CourierDataComponent;
CourierEntityRoot;
CourierBagComponent;
CourierShopComponent;

ECombination;

EnemyUnitEntityRoot;
EnemyUnitComponent;

FakerHeroEntityRoot;
FHeroCombinationManagerComponent;
FHeroCombination;

ChessControlComponent;
DrawComponent;
PlayerNetTableComponent;
PlayerDataComponent;
PlayerEntityRoot;
RoundManagerComponent;
ERoundBoard;

PublicShopComponent;
PublicBagSystemComponent;


export class AllEntity {
    static Init() {
        AllServiceEntity.init()
        LogHelper.print("register all entity 111111");
    }
}
