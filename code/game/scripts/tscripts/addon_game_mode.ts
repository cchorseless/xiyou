import { GameMode } from "./GameMode";
import { TimerHelper } from "./helper/TimerHelper";
import { AllEntity } from "./rules/AllEntity";
AllEntity.init();
TimerHelper.TimeWorker.Start();
Object.assign(getfenv(), {
    Activate: GameMode.Activate,
    Precache: GameMode.Precache,
});

if (GameRules.Addon) {
    GameRules.Addon.Reload();
}
