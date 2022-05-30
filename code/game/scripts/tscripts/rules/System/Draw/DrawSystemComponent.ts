import { EventHelper } from "../../../helper/EventHelper";
import { ET, registerET } from "../../Entity/Entity";
import { DrawConfig } from "./DrawConfig";

@registerET()
export class DrawSystemComponent extends ET.Component {
    public onAwake() {
        this.addEvent();
    }
    public addEvent() {
        /**开局选卡 */
        EventHelper.addProtocolEvent(this, DrawConfig.EProtocol.StartCardSelected, (event: CLIENT_DATA<DrawConfig.I.ICardSelected>) => {
            [event.state, event.message] = GameRules.Addon.ETRoot.PlayerSystem().GetPlayer(event.PlayerID).DrawComp().OnStartCardSelected(1, event.data.itemName);
        });
        /**选卡 */
        EventHelper.addProtocolEvent(this, DrawConfig.EProtocol.CardSelected, (event: CLIENT_DATA<DrawConfig.I.ICardSelected>) => {
            [event.state, event.message] = GameRules.Addon.ETRoot.PlayerSystem().GetPlayer(event.PlayerID).DrawComp().OnSelectCard(event.data.index, event.data.itemName, event.data.b2Public);
        });
    }
}
