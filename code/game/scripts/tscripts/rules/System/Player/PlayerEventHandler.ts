import { GameEnum } from "../../../GameEnum";
import { EventHelper } from "../../../helper/EventHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { PlayerSystem } from "./PlayerSystem";

export class PlayerEventHandler {
    private static System: typeof PlayerSystem;

    public static startListen(sys: typeof PlayerSystem) {
        PlayerEventHandler.System = sys;
        EventHelper.addGameEvent(this, GameEnum.Event.GameEvent.game_rules_state_change, (e) => {
            const nNewState = GameRules.State_Get();
            switch (nNewState) {
                // -- 游戏初始化
                case DOTA_GameState.DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP:
                    PlayerEventHandler.System.CreateAllPlayer();
                    break;
            }
        });

        /**客户端登陆 */
        EventHelper.addProtocolEvent(this, GameEnum.Event.CustomProtocol.req_LoginGame, (event: JS_TO_LUA_DATA) => {
            event.state = true;
            PlayerEventHandler.OnLoginPlayer(event.PlayerID);
        });
    }
    private static IsAllLogin: boolean = false;

    public static OnLoginPlayer(playerid: PlayerID) {
        if (this.IsAllLogin) {
            return;
        }
        let playerroot = PlayerEventHandler.System.GetPlayer(playerid);
        TimerHelper.addTimer(1, () => {
            playerroot.DrawComp().DrawStartCard();
        });
        playerroot.IsLogin = true;
        for (let player of PlayerEventHandler.System.GetAllPlayer()) {
            if (!player.IsLogin) {
                return;
            }
        }
        this.IsAllLogin = true;
        PlayerEventHandler.System.OnAllPlayerClientLogin();
    }

}
