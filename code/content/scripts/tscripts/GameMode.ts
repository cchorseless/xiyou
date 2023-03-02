import { GameDebugger } from "./GameDebugger";
import { GameRulesExt } from "./GameRulesExt";
import { GameScene } from "./GameScene";
import { GameSetting } from "./GameSetting";
import { KVHelper } from "./helper/KVHelper";
import { LogHelper } from "./helper/LogHelper";
import { PrecacheHelper } from "./helper/PrecacheHelper";
import { GameEnum } from "./shared/GameEnum";
import { ETEntitySystem } from "./shared/lib/Entity";

@GReloadable
export class GameMode {
    public static Precache(this: void, context: CScriptPrecacheContext) {
        PrecacheHelper.init(context);
    }
    public static Activate(this: void) {
        LogHelper.print("Activate-------------");
        GameRules.Addon = new GameMode();
        GameRules.Addon.InitGameMode();
    }
    public Instance: CDOTABaseGameMode;

    private InitGameMode() {
        if (!this.Instance) {
            this.Instance = GameRules.GetGameModeEntity();
        }
        LogHelper.print("Entering Game:InitGameMode");
        GameRulesExt.Init();
        // 初始化配置
        GameSetting.init();
        // 初始化debugger
        GameDebugger.GetInstance().init();
        // 启动模块
        GameScene.init()
    }


    // Called on script_reload
    public Reload() {
        if (!IsInToolsMode()) {
            return;
        }
        let state = GameRules.State_Get();
        if (state <= DOTA_GameState.DOTA_GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD) return;
        LogHelper.print("Script reloaded start!");
        // Do some stuff here
        /**更新KV */
        KVHelper.initKVFile();
        GameRules.Playtesting_UpdateAddOnKeyValues();
        FireGameEvent(GameEnum.GameEvent.client_reload_game_keyvalues, {});
        ETEntitySystem.DebugReload();
        GGameCache.DebugReload();
        // 更新全局NPC
        // this.InitGlobalBaseNPC();
        LogHelper.print("Script reloaded end!");
    }
}
