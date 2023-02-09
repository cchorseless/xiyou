import { GameSetting } from "./GameSetting";
import { BotHelper } from "./helper/BotHelper";
import { EventHelper } from "./helper/EventHelper";
import { LogHelper } from "./helper/LogHelper";
import { ActiveRootItem } from "./npc/items/ActiveRootItem";
import { GameEnum } from "./shared/GameEnum";
import { GameProtocol } from "./shared/GameProtocol";
import { GameServiceConfig } from "./shared/GameServiceConfig";
import { SingletonClass } from "./shared/lib/SingletonClass";

@GReloadable
export class GameDebugger extends SingletonClass {
    public init(): void {
        if (GameSetting.GAME_ISDEBUG) {
            // this.debugger_LuaMemory(5);
            // this.debuger_globalcache(5);
            this.addDebugEvent();
            // this.printGameEvent();
            // Todo 数据埋点上报
        }
        this.checkCheatMode();
    }
    private checkCheatMode() {
        GTimerHelper.AddTimer(1, GHandler.create(this, () => {
            if (!IsInToolsMode() && GameRules.IsCheatMode()) {
                GameRules.SetGameWinner(DOTATeam_t.DOTA_TEAM_BADGUYS);
            }
            return 5;
        }), true);
    }

    /**打印游戏时间顺序 */
    private printGameEvent() {
        for (let k in GameEnum.GameEvent) {
            let eventName = (GameEnum.GameEvent as any)[k];
            if (eventName) {
                EventHelper.addGameEvent(eventName, GHandler.create(this, (e) => {
                    LogHelper.print(k, "|", eventName);
                }));
            }
        }
    }
    /**LUA Memory  */
    public luaMemory: number = 0;
    /**客户端帧数  */
    public client_fps: number = 0;
    /**服务器帧数  */
    public server_fps: number = 0;
    /**
     * 打印LUA 内存
     * @param inter 时间间隔（秒）
     */
    private debugger_LuaMemory(inter: number = 60) {
        GTimerHelper.AddTimer(inter, GHandler.create(this,
            () => {
                this.luaMemory = collectgarbage("count");
                this.server_fps = parseFloat("" + 1 / FrameTime());
                GLogHelper.print(string.format("[Lua Memory]:  %.3f MB   [server FPS]:  %.1f", this.luaMemory / 1024, this.server_fps));
                return inter
            }), true);
    }
    /**
     * 客户端FPS
     * @param inter
     */
    public debugger_ClientFps(inter: number = 60) {
        GTimerHelper.AddTimer(inter, GHandler.create(this,
            () => {
                this.client_fps = parseFloat("" + 1 / GameRules.GetGameFrameTime());
                GLogHelper.print(string.format("[client FPS]:  %.1f ", this.client_fps));
                return inter
            }), true);
    }

    /**
     * 全局缓存统计
     * @param inter
     */
    public debuger_globalcache(inter: number) {
        let count = (obj: any[][]) => {
            let c = 0;
            obj.forEach((arr) => {
                c += arr.length;
            });
            return c;
        };
        let countSet = (obj: Set<any>[]) => {
            let c = 0;
            obj.forEach((arr) => {
                c += arr.size;
            });
            return c;
        };
        GTimerHelper.AddTimer(inter, GHandler.create(this,
            () => {
                LogHelper.print("-------------------");
                LogHelper.print(
                    string.format("[Globalcache]: allGameEvent => event:  %.1f | listener:  %.1f ", Object.keys(GGameCache.allGameEvent).length, count(Object.values(GGameCache.allGameEvent)))
                );
                LogHelper.print(
                    string.format("[Globalcache]: allCustomEvent => event:  %.1f | listener:  %.1f ", Object.keys(GGameCache.allCustomEvent).length, count(Object.values(GGameCache.allCustomEvent)))
                );
                LogHelper.print(
                    string.format(
                        "[Globalcache]: allCustomProtocolEvent => event:  %.1f | listener:  %.1f",
                        Object.keys(GGameCache.allCustomProtocolEvent).length,
                        count(Object.values(GGameCache.allCustomProtocolEvent))
                    )
                );
                LogHelper.print(
                    string.format(
                        "[Globalcache]: allBuffRegisterEvent => event:  %.1f | listener:  %.1f",
                        Object.keys(GGameCache.allBuffRegisterEvent).length,
                        countSet(Object.values(GGameCache.allBuffRegisterEvent))
                    )
                );
                LogHelper.print(string.format("[Globalcache]: allTimers =>  %.1f", GTimerHelper.mUseTimerTasks.length));
                LogHelper.print("-------------------");
                return inter
            }), true);
    }



    public addDebugEvent() {
        //#region  游戏内事件
        EventHelper.addGameEvent(GameEnum.GameEvent.PlayerChatEvent, GHandler.create(this, this.OnPlayerChat));
        //#endregion
        //#region  自定义事件
        // 游戏结束
        EventHelper.addProtocolEvent(GameProtocol.Protocol.req_DebugGameOver, GHandler.create(this, this.onDebugGameOver));
        // 游戏重载
        EventHelper.addProtocolEvent(GameProtocol.Protocol.req_DebugReload, GHandler.create(this, this.onDebugReload));
        // 游戏重新开始
        EventHelper.addProtocolEvent(GameProtocol.Protocol.req_DebugRestart, GHandler.create(this, this.onDebugRestart));
        // 清除打印
        EventHelper.addProtocolEvent(GameProtocol.Protocol.req_DebugClearAll, GHandler.create(this, this.onDebugClearAll));
        EventHelper.addProtocolEvent(GameProtocol.Protocol.req_addBot, GHandler.create(this, this.onreq_addBot));
        // 主机速度
        EventHelper.addProtocolEvent(GameProtocol.Protocol.ChangeHostTimescale, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            SendToConsole("host_timescale " + e.data);
        }));
        EventHelper.addProtocolEvent(GameProtocol.Protocol.req_DebugAddItem, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            let { entityindex, itemname } = e.data;
            let unit = EntIndexToHScript(entityindex) as IBaseNpc_Plus;
            if (unit && itemname) {
                ActiveRootItem.CreateOneToUnit(unit, itemname);
            }
        }));
        EventHelper.addProtocolEvent(GameProtocol.Protocol.req_DebugAddAbility, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            let { entityindex, abilityname } = e.data;
            let unit = EntIndexToHScript(entityindex) as IBaseNpc_Plus;
            if (unit && abilityname) {
                unit.addAbilityPlus(abilityname);
            }
        }));
        EventHelper.addProtocolEvent(GameProtocol.Protocol.req_DebugRemoveAllItem, GHandler.create(this, (e: JS_TO_LUA_DATA) => {

        }));
        EventHelper.addProtocolEvent(GameProtocol.Protocol.req_DebugRemoveAllAbility, GHandler.create(this, (e: JS_TO_LUA_DATA) => {

        }));
        //#endregion
    }

    /**聊天添加GM指令 */
    OnPlayerChat(events: PlayerChatEvent) {
        let iPlayerID = events.playerid;
        let player = GPlayerEntityRoot.GetOneInstance(iPlayerID);
        let hero = player.Hero!;
        let sText = events.text.toLowerCase();
        let tokens = sText.split(" ");
        switch (tokens[0]) {
            case "-sendkey":
                let serverkey = GetDedicatedServerKeyV2(tokens[1]);
                GGameServiceSystem.GetInstance().SendServerKey(GameServiceConfig.GAME_Name, tokens[1], serverkey);
                break;
            case "-addbot":
                let botCount = tonumber(tokens[1] || 1);
                BotHelper.addBot(botCount);
                break;
            case "-clear":
                break;
            case "-addgold":
                break;
            case "-wave":
                break;
            case "-wood":
                break;
            case "-ent_text":
                break;
            case "-test":
                break;
            case "-additem":
                ActiveRootItem.CreateOneToUnit(hero, tokens[1]);
                break;
            case "-b":
                ActiveRootItem.CreateOneToUnit(hero, "item_building_hero_" + tokens[1]);
                break;
        }
    }
    //#region  自定义事件
    /**游戏结束 */
    onDebugGameOver(event: JS_TO_LUA_DATA) { }
    /**reload */
    onDebugReload(event: JS_TO_LUA_DATA) {
        SendToConsole("clearall");
        SendToConsole("cl_script_reload");
        SendToConsole("script_reload");
    }
    onDebugRestart(event: JS_TO_LUA_DATA) {
        SendToConsole("clearall");
        SendToConsole("restart");
    }
    onDebugClearAll(event: JS_TO_LUA_DATA) {
        SendToConsole("clearall");
    }
    /**添加机器人 */
    onreq_addBot(event: JS_TO_LUA_DATA) {
        if (event.PlayerID) {
            let player = PlayerResource.GetPlayer(event.PlayerID);
            event.state = GameRules.PlayerHasCustomGameHostPrivileges(player);
            if (event.state) {
                BotHelper.addBot();
                EventHelper.fireProtocolEventToClient(event.protocol as any, event);
            }
        }
    }
    //#endregion

}

