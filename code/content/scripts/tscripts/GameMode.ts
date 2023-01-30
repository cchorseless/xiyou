import { GameDebugger } from "./GameDebugger";
import { GameScene } from "./GameScene";
import { GameSetting } from "./GameSetting";
import { KVHelper } from "./helper/KVHelper";
import { LogHelper } from "./helper/LogHelper";
import { PrecacheHelper } from "./helper/PrecacheHelper";
import { modifier_event } from "./npc/propertystat/modifier_event";
import { GameEnum } from "./shared/GameEnum";
import { ETEntitySystem } from "./shared/lib/Entity";
declare global {
    interface CDOTAGameRules {
        Addon: GameMode;
    }
}

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
        // 初始化配置
        GameSetting.init();
        // 初始化debugger
        GameDebugger.GetInstance().init();
        // 启动模块
        GameScene.init()
        // 初始化全局对象
        this.InitGlobalBaseNPC();
    }

    /**全局战斗伤害记录 */
    public globalNpc_RECORD_SYSTEM: CDOTA_BaseNPC;
    /**全局buff事件监听 */
    public globalNpc_MODIFIER_EVENTS: CDOTA_BaseNPC;
    /**
     * 初始化全局NPC
     */
    private InitGlobalBaseNPC() {
        if (this.globalNpc_MODIFIER_EVENTS) {
            UTIL_Remove(this.globalNpc_MODIFIER_EVENTS);
            this.globalNpc_MODIFIER_EVENTS = null;
        }
        this.globalNpc_MODIFIER_EVENTS = modifier_event.applyThinker(Vector(0, 0, 0), this.Instance as any, null, null, DOTATeam_t.DOTA_TEAM_NOTEAM, false);
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
        // let units = Entities.FindAllByClassname("npc_dota_creature") as IBaseNpc_Plus[]
        // LogHelper.print(modifier_test.GetAllInstance(), 111)
        // let s = []
        // for (let unit of units) {
        //     let unitname = (unit as IBaseNpc_Plus).GetUnitName();
        //     if (unitname == 'dota_hero_axe') {
        //         let modef = unit.FindModifierByName('modifier_test')
        //         LogHelper.print(Object.keys(modef.constructor.prototype))
        //         LogHelper.print(Object.keys(modifier_test))
        //         LogHelper.print(modef.constructor == modifier_test)
        //         LogHelper.print((modef.constructor as any).mmmm, modifier_test.mmmm)
        //         LogHelper.print((modef.constructor as any).reload(), modifier_test.reload())
        //         modef.constructor = modifier_test;
        //         // s.push(modef.constructor)
        //         break
        //     }
        // }
        // LogHelper.print(s[0] == s[1])
        // 更新全局NPC
        // this.InitGlobalBaseNPC();
        LogHelper.print("Script reloaded end!");
    }
}
