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
        EventHelper.addGameEvent(
            GameEnum.Event.GameEvent.game_rules_state_change,
            (e) => {
                const nNewState = GameRules.State_Get();
                LogHelper.print("OnGameRulesStateChange", nNewState);
                switch (nNewState) {
                    // -- 游戏初始化
                    case DOTA_GameState.DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP:
                        PlayerEventHandler.System.CreateAllPlayer();
                        break;
                }
            },
            this
        );
    }
}
