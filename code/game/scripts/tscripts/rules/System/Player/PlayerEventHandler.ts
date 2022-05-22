import { GameEnum } from "../../../GameEnum";
import { GameSetting } from "../../../GameSetting";
import { EventHelper } from "../../../helper/EventHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { GameProtocol } from "../../../service/GameProtocol";
import { GameRequest } from "../../../service/GameRequest";
import { PlayerSystem } from "./PlayerSystem";

export class PlayerEventHandler {
    private static System: typeof PlayerSystem;

    public static startListen(sys: typeof PlayerSystem) {
        PlayerEventHandler.System = sys;
        EventHelper.addGameEvent(
            this,
            GameEnum.Event.GameEvent.game_rules_state_change,
            (e) => {
                const nNewState = GameRules.State_Get();
                switch (nNewState) {
                    // -- 游戏初始化
                    case DOTA_GameState.DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP:
                        PlayerEventHandler.System.CreateAllPlayer();
                        break;
                }
            },
        );

        /**客户端登陆 */
        EventHelper.addProtocolEvent(
            this,
            GameEnum.Event.CustomProtocol.req_LoginGame,
            (event: JS_TO_LUA_DATA) => {
                event.state = true;
                let playerid = event.PlayerID;
                TimerHelper.addTimer(1, () => {
                    PlayerEventHandler.System.GetPlayer(playerid).DrawComp().DrawStartCard();
                });
            },
         
        );
    }
}
