import { LogHelper } from "./helper/LogHelper";
import { PrecacheHelper } from "./helper/PrecacheHelper";
import { GameSetting } from "./GameSetting";
import { GameEvent } from "./GameEvent";
import { GameDebugger } from "./GameDebugger";
import { modifier_event } from "./npc/modifier/modifier_event";
import { KVHelper } from "./helper/KVHelper";
import { globalData, reloadable } from "./GameCache";
import { GameEnum } from "./GameEnum";
import { BaseModifier } from "./npc/entityPlus/Base_Plus";
import { GameEntityRoot } from "./GameEntityRoot";
import { Assert_Sounds } from "./assert/Assert_Sounds";
import { ET } from "./rules/Entity/Entity";
declare global {
    interface CDOTAGameRules {
        Addon: GameMode;
    }
}

@reloadable
export class GameMode implements ET.IEntityRoot {
    ETRoot: GameEntityRoot;
    public static Precache(this: void, context: CScriptPrecacheContext) {
        PrecacheHelper.init(context);
    }
    public static Activate(this: void) {
        LogHelper.print("Activate-------------");
        GameRules.Addon = new GameMode();
        GameEntityRoot.Active(GameRules.Addon);
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
        // 添加監聽事件
        GameEvent.GetInstance().init();
        // 启动模块
        this.ETRoot.init();
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
        // debug
        if (!IsInToolsMode()) {
            return;
        }
        let state = GameRules.State_Get();
        if (state <= DOTA_GameState.DOTA_GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD) return;
        LogHelper.print("Script reloaded start!");
        // Do some stuff here
        /**更新KV */
        GameRules.Playtesting_UpdateAddOnKeyValues();
        KVHelper.initKVFile();
        // let units = Entities.FindAllByClassname("npc_dota_creature") as BaseNpc_Plus[]
        // LogHelper.print(modifier_test.GetAllInstance(), 111)
        // let s = []
        // for (let unit of units) {
        //     let unitname = (unit as BaseNpc_Plus).GetUnitName();
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
    /**本局是否結束 */
    public bGameEnd = false;
    public Victory() {
        if (this.bGameEnd == true) return;
        this.ETRoot.PlayerSystem().GetAllPlayeridByTeam().forEach((iPlayerID) => {
            let _hHero = PlayerResource.GetSelectedHeroEntity(iPlayerID);
            if (_hHero && _hHero.IsAlive()) {
                // this.UpdatePlayerEndData(hHero)
            }
        });
        this.bGameEnd = true;
        EmitAnnouncerSound(Assert_Sounds.Announcer.end_02);
        EmitGlobalSound(Assert_Sounds.Game.Victory);
        GameRules.SetGameWinner(DOTATeam_t.DOTA_TEAM_GOODGUYS);
    }
    public Defeat() {
        if (this.bGameEnd == true) return;
        this.ETRoot.PlayerSystem().GetAllPlayeridByTeam().forEach((iPlayerID) => {
            let _hHero = PlayerResource.GetSelectedHeroEntity(iPlayerID);
            if (_hHero && _hHero.IsAlive()) {
                // this.UpdatePlayerEndData(hHero)
                if (!IsInToolsMode()) {
                    _hHero.ForceKill(false);
                }
            }
        });
        this.bGameEnd = true;
        EmitAnnouncerSound(Assert_Sounds.Announcer.end_08);
        EmitGlobalSound(Assert_Sounds.Game.Defeat);
        GameRules.SetGameWinner(DOTATeam_t.DOTA_TEAM_BADGUYS);
    }
}
