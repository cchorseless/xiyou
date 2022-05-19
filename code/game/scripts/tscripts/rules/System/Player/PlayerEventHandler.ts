import { GameEnum } from "../../../GameEnum";
import { GameSetting } from "../../../GameSetting";
import { EventHelper } from "../../../helper/EventHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { GameProtocol } from "../../../service/GameProtocol";
import { GameRequest } from "../../../service/GameRequest";
import { PlayerSystem } from "./PlayerSystem";

export class PlayerEventHandler {
    private static System: typeof PlayerSystem;

    public static startListen(sys: typeof PlayerSystem) {
        PlayerEventHandler.System = sys;
        EventHelper.addGameEvent(GameEnum.Event.GameEvent.game_rules_state_change, this.OnGameRulesStateChange, this);
    }

    private static OnGameRulesStateChange(e: any) {
        const nNewState = GameRules.State_Get();
        LogHelper.print("OnGameRulesStateChange", nNewState);
        switch (nNewState) {
            case DOTA_GameState.DOTA_GAMERULES_STATE_INIT:
                break;
            case DOTA_GameState.DOTA_GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD:
                break;
            // -- 游戏初始化
            case DOTA_GameState.DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP:
                PlayerEventHandler.System.CreateAllPlayer();
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
}
