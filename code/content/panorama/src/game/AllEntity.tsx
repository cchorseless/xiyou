import { LogHelper } from "../helper/LogHelper";
import { AbilityEntityRoot } from "./components/Ability/AbilityEntityRoot";
import { BuildingComponent } from "./components/Building/BuildingComponent";
import { BuildingEntityRoot } from "./components/Building/BuildingEntityRoot";
import { BuildingManagerComponent } from "./components/Building/BuildingManagerComponent";
import { ChessControlComponent } from "./components/ChessControlComponent";
import { DrawComponent } from "./components/Draw/DrawComponent";
import { EnemyUnitComponent } from "./components/Enemy/EnemyUnitComponent";
import { EnemyUnitEntityRoot } from "./components/Enemy/EnemyUnitEntityRoot";
import { PlayerHeroComponent } from "./components/Player/PlayerHeroComponent";
import { PlayerDataComponent } from "./components/Player/PlayerDataComponent";
import { EntityRootManagerComponent } from "./components/Player/EntityRootManagerComponent";
import { ERoundBoard } from "./components/Round/ERoundBoard";
import { RoundManagerComponent } from "./components/Round/RoundManagerComponent";
import { ServiceEntity } from "./service/ServiceEntity";
import { PlayerEntityRoot } from "./components/Player/PlayerEntityRoot";
import { CombinationManagerComponent } from "./components/Combination/CombinationManagerComponent";
import { ECombination } from "./components/Combination/ECombination";
import { FakerHeroEntityRoot } from "./components/FakerHero/FakerHeroEntityRoot";
import { FHeroCombination } from "./components/FakerHero/FHeroCombination";
import { FHeroCombinationManagerComponent } from "./components/FakerHero/FHeroCombinationManagerComponent";

AbilityEntityRoot;
BuildingEntityRoot;
BuildingComponent;
BuildingManagerComponent;

CombinationManagerComponent;
ECombination;

EnemyUnitEntityRoot;
EnemyUnitComponent;

FakerHeroEntityRoot;
FHeroCombinationManagerComponent;
FHeroCombination;

ChessControlComponent;
DrawComponent;
PlayerHeroComponent;
PlayerDataComponent;
PlayerEntityRoot;
EntityRootManagerComponent;
RoundManagerComponent;
ERoundBoard;

export class AllEntity {
    static IsInit: boolean = false;
    static Init() {
        if (AllEntity.IsInit) {
            return;
        }
        ServiceEntity.init();
        LogHelper.print("register all entity");
        AllEntity.IsInit = true;
    }
}
