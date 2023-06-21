import { LogHelper } from "../helper/LogHelper";
import { LuBanConfigComponent } from "./componentext/LuBanConfigComponent";
import { AbilityEntityRoot } from "./components/Ability/AbilityEntityRoot";
import { BattleUnitIllusionEntityRoot } from "./components/BattleUnit/BattleUnitIllusionEntityRoot";
import { BattleUnitSummonEntityRoot } from "./components/BattleUnit/BattleUnitSummonEntityRoot";
import { BuildingEntityRoot } from "./components/Building/BuildingEntityRoot";
import { BuildingManagerComponent } from "./components/Building/BuildingManagerComponent";
import { BuildingRuntimeEntityRoot } from "./components/Building/BuildingRuntimeEntityRoot";
import { ChessControlComponent } from "./components/ChessControl/ChessControlComponent";
import { ECombination } from "./components/Combination/ECombination";
import { CourierBagComponent } from "./components/Courier/CourierBagComponent";
import { CourierEntityRoot } from "./components/Courier/CourierEntityRoot";
import { CourierShopComponent } from "./components/Courier/CourierShopComponent";
import { DrawComponent } from "./components/Draw/DrawComponent";
import { EnemyUnitEntityRoot } from "./components/Enemy/EnemyUnitEntityRoot";
import { FakerHeroEntityRoot } from "./components/FakerHero/FakerHeroEntityRoot";
import { FHeroCombination } from "./components/FakerHero/FHeroCombination";
import { ItemEntityRoot } from "./components/Item/ItemEntityRoot";
import { PlayerDataComponent } from "./components/Player/PlayerDataComponent";
import { PlayerEntityRoot } from "./components/Player/PlayerEntityRoot";
import { ERoundBoard } from "./components/Round/ERoundBoard";
import { RoundManagerComponent } from "./components/Round/RoundManagerComponent";
import { GameServiceSystemComponent } from "./system/GameServiceSystemComponent";
import { PublicBagSystemComponent } from "./system/PublicBagSystemComponent";

LuBanConfigComponent;
GameServiceSystemComponent;

AbilityEntityRoot;
ItemEntityRoot;

BattleUnitIllusionEntityRoot;
BattleUnitSummonEntityRoot;

BuildingEntityRoot;
BuildingManagerComponent;
BuildingRuntimeEntityRoot;



CourierEntityRoot;
CourierBagComponent;
CourierShopComponent;

ECombination;

EnemyUnitEntityRoot;

FakerHeroEntityRoot;
FHeroCombination;

ChessControlComponent;
DrawComponent;
PlayerDataComponent;
PlayerEntityRoot;
RoundManagerComponent;
ERoundBoard;

PublicBagSystemComponent;


export class AllEntity {
    static Init() {
        LogHelper.print("register all entity ");
    }
}
