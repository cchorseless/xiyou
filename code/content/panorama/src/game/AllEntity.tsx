import { LogHelper } from "../helper/LogHelper";
import { AbilityEntityRoot } from "./components/Ability/AbilityEntityRoot";
import { BuildingComponent } from "./components/Building/BuildingComponent";
import { BuildingEntityRoot } from "./components/Building/BuildingEntityRoot";
import { BuildingManagerComponent } from "./components/Building/BuildingManagerComponent";
import { ChessControlComponent } from "./components/ChessControlComponent";
import { DrawComponent } from "./components/DrawComponent";
import { EnemyUnitComponent } from "./components/Enemy/EnemyUnitComponent";
import { EnemyUnitEntityRoot } from "./components/Enemy/EnemyUnitEntityRoot";
import { PlayerHeroComponent } from "./components/Player/PlayerHeroComponent";
import { PlayerDataComponent } from "./components/Player/PlayerDataComponent";
import { PlayerEntityRootComponent } from "./components/Player/PlayerEntityRootComponent";
import { ERoundBoard } from "./components/Round/ERoundBoard";
import { RoundManagerComponent } from "./components/Round/RoundManagerComponent";
import { CharacterDataComponent } from "./service/account/CharacterDataComponent";
import { SeedRandomComponent } from "./service/account/SeedRandomComponent";
import { TCharacter } from "./service/account/TCharacter";
import { BagComponent } from "./service/bag/BagComponent";
import { TItem } from "./service/bag/TItem";

AbilityEntityRoot;
BuildingEntityRoot;
BuildingComponent;
BuildingManagerComponent;

EnemyUnitEntityRoot;
EnemyUnitComponent;

ChessControlComponent;
DrawComponent;
PlayerHeroComponent;
PlayerDataComponent;
PlayerEntityRootComponent;
RoundManagerComponent;
ERoundBoard;


CharacterDataComponent;
SeedRandomComponent;
TCharacter;
BagComponent;
TItem;
export class AllEntity {
    static Init() {
        LogHelper.print("register all entity");
    }
}