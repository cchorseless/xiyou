import { GameEnum } from "../../../GameEnum";
import { EventHelper } from "../../../helper/EventHelper";
import { PlayerSystem } from "../Player/PlayerSystem";
import { DrawConfig } from "./DrawConfig";
import { DrawSystem } from "./DrawSystem";

export class DrawEventHandler {
    private static System: typeof DrawSystem;

    public static startListen(System: typeof DrawSystem) {
        DrawEventHandler.System = System;
        // 开局抽卡
        EventHelper.addGameEvent(
            GameEnum.Event.GameEvent.game_rules_state_change,
            (e) => {
                const nNewState = GameRules.State_Get();
                switch (nNewState) {
                    case DOTA_GameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS:
                        for (let playerid in PlayerSystem.AllPlayer) {
                            PlayerSystem.AllPlayer[playerid].DrawComp().DrawStartCard();
                        }
                        return;
                }
            },
            this
        );
        /**开局选卡 */
        EventHelper.addProtocolEvent(
            DrawConfig.EProtocol.StartCardSelected,
            (event: CLIENT_DATA<DrawConfig.I.ICardSelected>) => {
                [event.state, event.message] = PlayerSystem.GetPlayer(event.PlayerID).DrawComp().OnStartCardSelected(1, event.data.itemName);
            },
            this
        );
        /**选卡 */
        EventHelper.addProtocolEvent(
            DrawConfig.EProtocol.CardSelected,
            (event: CLIENT_DATA<DrawConfig.I.ICardSelected>) => {
                [event.state, event.message] = PlayerSystem.GetPlayer(event.PlayerID).DrawComp().OnSelectCard(event.data.itemName, false);
            },
            this
        );
    }
}
