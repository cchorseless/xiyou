import { GameEnum } from "./GameEnum";
import { GameSetting } from "./GameSetting";
import { EventHelper } from "./helper/EventHelper";
import { LogHelper } from "./helper/LogHelper";
import { SingletonClass } from "./helper/SingletonHelper";
import { TimerHelper } from "./helper/TimerHelper";
import { globalData, reloadable } from "./GameCache";
import { GameRequest } from "./service/GameRequest";
import { BotHelper } from "./helper/BotHelper";
import { BaseItem_Plus } from "./npc/entityPlus/BaseItem_Plus";

@reloadable
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
        TimerHelper.addTimer(
            1,
            () => {
                if (!IsInToolsMode() && GameRules.IsCheatMode()) {
                    GameRules.SetGameWinner(DOTATeam_t.DOTA_TEAM_BADGUYS);
                }
                return 5;
            },
            this,
            false
        );
    }

    /**打印游戏时间顺序 */
    private printGameEvent() {
        for (let k in GameEnum.Event.GameEvent) {
            let eventName = (GameEnum.Event.GameEvent as any)[k];
            if (eventName) {
                EventHelper.addGameEvent(this, eventName, (e) => {
                    LogHelper.print(k, "|", eventName);
                });
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
        TimerHelper.addTimer(
            inter,
            () => {
                this.luaMemory = collectgarbage("count");
                this.server_fps = parseFloat("" + 1 / FrameTime());
                LogHelper.print(string.format("[Lua Memory]:  %.3f MB   [server FPS]:  %.1f", this.luaMemory / 1024, this.server_fps));
                return inter;
            },
            this,
            false
        );
    }
    /**
     * 客户端FPS
     * @param inter
     */
    public debugger_ClientFps(inter: number = 60) {
        TimerHelper.addTimer(
            inter,
            () => {
                this.client_fps = parseFloat("" + 1 / GameRules.GetGameFrameTime());
                LogHelper.print(string.format("[client FPS]:  %.1f ", this.client_fps));
                return inter;
            },
            this,
            false
        );
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
        TimerHelper.addTimer(
            inter,
            () => {
                LogHelper.print("-------------------");
                LogHelper.print(
                    string.format("[Globalcache]: allGameEvent => event:  %.1f | listener:  %.1f ", Object.keys(globalData.allGameEvent).length, count(Object.values(globalData.allGameEvent)))
                );
                LogHelper.print(
                    string.format("[Globalcache]: allCustomEvent => event:  %.1f | listener:  %.1f ", Object.keys(globalData.allCustomEvent).length, count(Object.values(globalData.allCustomEvent)))
                );
                LogHelper.print(
                    string.format(
                        "[Globalcache]: allCustomProtocolEvent => event:  %.1f | listener:  %.1f",
                        Object.keys(globalData.allCustomProtocolEvent).length,
                        count(Object.values(globalData.allCustomProtocolEvent))
                    )
                );
                LogHelper.print(
                    string.format(
                        "[Globalcache]: allCustomServerEvent => event:  %.1f | listener:  %.1f",
                        Object.keys(globalData.allCustomServerEvent).length,
                        count(Object.values(globalData.allCustomServerEvent))
                    )
                );
                LogHelper.print(
                    string.format(
                        "[Globalcache]: allRegisterEvent => event:  %.1f | listener:  %.1f",
                        Object.keys(globalData.allRegisterEvent).length,
                        countSet(Object.values(globalData.allRegisterEvent))
                    )
                );
                LogHelper.print(string.format("[Globalcache]: allTimers => event:  %.1f | listener:  %.1f", Object.keys(globalData.allTimers).length, Object.values(globalData.allTimers).length));
                LogHelper.print(
                    string.format("[Globalcache]: allFrameTimers => event:  %.1f | listener:  %.1f ", Object.keys(globalData.allFrameTimers).length, Object.values(globalData.allFrameTimers).length)
                );
                LogHelper.print("-------------------");
                return inter;
            },
            this,
            false
        );
    }



    public addDebugEvent() {
        //#region  游戏内事件
        EventHelper.addGameEvent(this, GameEnum.Event.GameEvent.PlayerChatEvent, this.OnPlayerChat);
        //#endregion
        //#region  自定义事件
        // 游戏结束
        EventHelper.addProtocolEvent(this, GameEnum.Event.CustomProtocol.req_DebugGameOver, this.onDebugGameOver);
        // 游戏重载
        EventHelper.addProtocolEvent(this, GameEnum.Event.CustomProtocol.req_DebugReload, this.onDebugReload);
        // 游戏重新开始
        EventHelper.addProtocolEvent(this, GameEnum.Event.CustomProtocol.req_DebugRestart, this.onDebugRestart);
        // 清除打印
        EventHelper.addProtocolEvent(this, GameEnum.Event.CustomProtocol.req_DebugClearAll, this.onDebugClearAll);
        EventHelper.addProtocolEvent(this, GameEnum.Event.CustomProtocol.req_addBot, this.onreq_addBot);

        //#endregion
    }

    /**聊天添加GM指令 */
    OnPlayerChat(events: PlayerChatEvent) {
        let iPlayerID = events.playerid;
        let player = PlayerResource.GetPlayer(iPlayerID);
        let hero = player.GetAssignedHero();
        let sText = events.text.toLowerCase();
        let bTeamOnly = events.teamonly == 1;
        let tokens = sText.split(" ");
        switch (tokens[0]) {
            case "-sendkey":
                let serverkey = GetDedicatedServerKeyV2(tokens[1]);
                GameRequest.GetInstance().SendServerKey(GameSetting.GAME_Name, tokens[1], serverkey);
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
                hero.AddItemByName(tokens[1]);
                break;
            case "-b":
                BaseItem_Plus.CreateOneToUnit(hero,"item_building_hero_" + tokens[1])
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

