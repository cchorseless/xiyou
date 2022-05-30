/*
 * @Author: Jaxh
 * @Date: 2021-04-30 15:18:16
 * @LastEditors: your name
 * @LastEditTime: 2021-04-30 15:18:42
 * @Description: file content
 */

import { GameEnum } from "../GameEnum";
import { EventHelper } from "../helper/EventHelper";
import { LogHelper } from "../helper/LogHelper";
import { SingletonClass } from "../helper/SingletonHelper";
import { TimerHelper } from "../helper/TimerHelper";

export class GameService extends SingletonClass {
    public init() {
        this.addEvent();
    }

    public addEvent() {
        EventHelper.addGameEvent(this, GameEnum.Event.GameEvent.game_rules_state_change, this.OnGameRulesStateChange);
    }

    public OnGameRulesStateChange(e: any) {
        const nNewState = GameRules.State_Get();
        LogHelper.print("OnGameRulesStateChange", nNewState);
        switch (nNewState) {
            case DOTA_GameState.DOTA_GAMERULES_STATE_INIT:
                break;
            case DOTA_GameState.DOTA_GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD:
                break;
            // -- 游戏初始化
            case DOTA_GameState.DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP:
                this.GetPlayerServerData();
                break;
            // 	-- 选择英雄
            case DOTA_GameState.DOTA_GAMERULES_STATE_HERO_SELECTION:
                break;
            // 	-- 策略时间
            case DOTA_GameState.DOTA_GAMERULES_STATE_STRATEGY_TIME:
                break;
            // 	-- 准备阶段(进游戏，刷怪前)
            case DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME:
                break;
            // -- 游戏开始
            case DOTA_GameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS:
                break;
        }
    }

    public GetPlayerServerData() {
        GameRules.Addon.ETRoot.PlayerSystem()
            .GetAllPlayerid()
            .forEach((playerid) => {});
    }

    public Sleep(fTime: number) {
        let co = coroutine.running();
        TimerHelper.addTimer(fTime, () => {
            coroutine.resume(co);
        });
        coroutine.yield();
    }
}
