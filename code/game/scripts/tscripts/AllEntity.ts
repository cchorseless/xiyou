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
import { CharacterDataComponent } from "./service/account/CharacterDataComponent";
import { TCharacter } from "./service/account/TCharacter";
import { BagComponent } from "./service/bag/BagComponent";
import { TItem } from "./service/bag/TItem";
import { SeedRandomComponent } from "./service/common/SeedRandomComponent";
import { WearableComponent } from "./rules/Components/Wearable/WearableComponent";
import { WearableSystemComponent } from "./rules/System/Wearable/WearableSystemComponent";
import { CharacterInGameDataComponent } from "./service/account/CharacterInGameDataComponent";
import { CharacterSteamComponent } from "./service/account/CharacterSteamComponent";
import { CharacterSteamDigestItem } from "./service/account/CharacterSteamDigestItem";
import { CharacterAchievementComponent } from "./service/achievement/CharacterAchievementComponent";
import { TCharacterAchievementItem } from "./service/achievement/TCharacterAchievementItem";
import { CharacterActivityComponent } from "./service/activity/CharacterActivityComponent";
import { ServerZoneActivityComponent } from "./service/activity/ServerZoneActivityComponent";
import { TActivity } from "./service/activity/TActivity";
import { TActivityBattlePass } from "./service/activity/TActivityBattlePass";
import { TActivityBattlePassData } from "./service/activity/TActivityBattlePassData";
import { TActivityDailyOnlinePrize } from "./service/activity/TActivityDailyOnlinePrize";
import { TActivityDailyOnlinePrizeData } from "./service/activity/TActivityDailyOnlinePrizeData";
import { TActivityData } from "./service/activity/TActivityData";
import { TActivityGiftCommond } from "./service/activity/TActivityGiftCommond";


MapSystemComponent;
RoundSystemComponent;
PlayerSystemComponent;
EnemySystemComponent;
CombinationSystemComponent;
ChessControlSystemComponent;
BuildingSystemComponent;
DrawSystemComponent;

PlayerComponent;
PlayerDataComponent;
PlayerHttpComponent;
DrawComponent;
RoundManagerComponent;
RoundEnemyComponent;
RoundBuildingComponent;
RoundPrizeUnitKillPrizeComponent;
CombinationManagerComponent;
BuildingManagerComponent;
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

WearableComponent;
WearableSystemComponent;

// service -----------
CharacterDataComponent;
CharacterInGameDataComponent;
CharacterSteamComponent;
CharacterSteamDigestItem;
TCharacter;

CharacterAchievementComponent;
TCharacterAchievementItem;

CharacterActivityComponent;
ServerZoneActivityComponent;
TActivity;
TActivityBattlePass;
TActivityBattlePassData;
TActivityDailyOnlinePrize;
TActivityDailyOnlinePrizeData;
TActivityData;
TActivityGiftCommond;



SeedRandomComponent;
BagComponent;
TItem;

export class AllEntity {
    static init() {
        LogHelper.print("register all entity");
    }
}
