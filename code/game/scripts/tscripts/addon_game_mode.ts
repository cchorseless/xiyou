import { GameMode } from "./GameMode";
import { TimerHelper } from "./helper/TimerHelper";

TimerHelper.TimeWorker.Start();
Object.assign(getfenv(), {
    Activate: GameMode.Activate,
    Precache: GameMode.Precache,
});

if (GameRules.Addon) {
    GameRules.Addon.Reload();
}
