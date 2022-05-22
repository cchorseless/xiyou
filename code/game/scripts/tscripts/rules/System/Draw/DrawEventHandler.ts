import { GameEnum } from "../../../GameEnum";
import { EventHelper } from "../../../helper/EventHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { PlayerSystem } from "../Player/PlayerSystem";
import { DrawConfig } from "./DrawConfig";
import { DrawSystem } from "./DrawSystem";

export class DrawEventHandler {
    private static System: typeof DrawSystem;

    public static startListen(System: typeof DrawSystem) {
        DrawEventHandler.System = System;
        /**开局选卡 */
        EventHelper.addProtocolEvent(this, DrawConfig.EProtocol.StartCardSelected, (event: CLIENT_DATA<DrawConfig.I.ICardSelected>) => {
            [event.state, event.message] = PlayerSystem.GetPlayer(event.PlayerID).DrawComp().OnStartCardSelected(1, event.data.itemName);
        });
        /**选卡 */
        EventHelper.addProtocolEvent(this, DrawConfig.EProtocol.CardSelected, (event: CLIENT_DATA<DrawConfig.I.ICardSelected>) => {
            [event.state, event.message] = PlayerSystem.GetPlayer(event.PlayerID).DrawComp().OnSelectCard(event.data.index, event.data.itemName, event.data.b2Public);
        });
    }
}
