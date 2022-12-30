// LogHelper必须放第一行先导入
import { AllEntity } from "./AllEntity";
import { GameCache } from "./GameCache";
import { GameMode } from "./GameMode";
import { LogHelper } from "./helper/LogHelper";
import { TimerHelper } from "./helper/TimerHelper";
LogHelper.print("IsServer start-----------------------------------")
GameCache.Init();
AllEntity.Init();
TimerHelper.Init();
Object.assign(getfenv(), {
    Activate: GameMode.Activate,
    Precache: GameMode.Precache,
});

if (GameRules.Addon) {
    GameRules.Addon.Reload();
}
