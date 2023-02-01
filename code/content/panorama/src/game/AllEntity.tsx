import { LogHelper } from "../helper/LogHelper";
import { LuBanConfigComponent } from "./componentext/LuBanConfigComponent";
import { AbilityEntityRoot } from "./components/Ability/AbilityEntityRoot";
import { BattleUnitIllusionEntityRoot } from "./components/BattleUnit/BattleUnitIllusionEntityRoot";
import { BattleUnitSummonEntityRoot } from "./components/BattleUnit/BattleUnitSummonEntityRoot";
import { BuildingComponent } from "./components/Building/BuildingComponent";
import { BuildingEntityRoot } from "./components/Building/BuildingEntityRoot";
import { BuildingManagerComponent } from "./components/Building/BuildingManagerComponent";
import { BuildingRuntimeEntityRoot } from "./components/Building/BuildingRuntimeEntityRoot";
import { ChessControlComponent } from "./components/ChessControl/ChessControlComponent";
import { ChessDataComponent } from "./components/ChessControl/ChessDataComponent";
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
import { ItemEntityRoot } from "./components/Item/ItemEntityRoot";
import { PlayerDataComponent } from "./components/Player/PlayerDataComponent";
import { PlayerEntityRoot } from "./components/Player/PlayerEntityRoot";
import { PublicShopComponent } from "./components/Public/PublicShopComponent";
import { ERoundBoard } from "./components/Round/ERoundBoard";
import { RoundManagerComponent } from "./components/Round/RoundManagerComponent";
import { GameServiceSystemComponent } from "./system/GameStateSystemComponent";
import { PublicBagSystemComponent } from "./system/PublicBagSystemComponent";

LuBanConfigComponent;
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



CourierDataComponent;
CourierEntityRoot;
CourierBagComponent;
CourierShopComponent;

ECombination;

EnemyUnitEntityRoot;
EnemyUnitComponent;

FakerHeroEntityRoot;
FHeroCombination;

ChessControlComponent;
DrawComponent;
PlayerDataComponent;
PlayerEntityRoot;
RoundManagerComponent;
ERoundBoard;

PublicShopComponent;
PublicBagSystemComponent;


export class AllEntity {
    static Init() {
        LogHelper.print("register all entity 111111");
    }
}
