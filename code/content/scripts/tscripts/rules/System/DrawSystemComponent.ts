
import { EventHelper } from "../../helper/EventHelper";
import { DrawConfig } from "../../shared/DrawConfig";
import { ET } from "../../shared/lib/Entity";

@GReloadable
export class DrawSystemComponent extends ET.SingletonComponent {
    public onAwake() {
        this.addEvent();
    }
    public addEvent() {
        /**开局选卡 */
        EventHelper.addProtocolEvent(DrawConfig.EProtocol.StartCardSelected, GHandler.create(this, (event: CLIENT_DATA<IDrawConfig.ICardSelected>) => {
            [event.state, event.message] = GPlayerEntityRoot.GetOneInstance(event.PlayerID).DrawComp().OnStartCardSelected(1, event.data.itemName);
        }));
        /**选卡 */
        EventHelper.addProtocolEvent(DrawConfig.EProtocol.CardSelected, GHandler.create(this, (event: CLIENT_DATA<IDrawConfig.ICardSelected>) => {
            [event.state, event.message] = GPlayerEntityRoot.GetOneInstance(event.PlayerID).DrawComp().OnSelectCard(event.data.index, event.data.itemName, event.data.b2Public);
        }));
        /**锁定 */
        EventHelper.addProtocolEvent(DrawConfig.EProtocol.LockSelectedCard, GHandler.create(this, (event: CLIENT_DATA<IDrawConfig.ICardLocked>) => {
            [event.state, event.message] = GPlayerEntityRoot.GetOneInstance(event.PlayerID).DrawComp().OnLockChess(event.data.index, event.data.itemName, event.data.block);
            if (event.state == false) {
                GNotificationSystem.ErrorMessage(event.message, event.PlayerID)
            }
        }));
        /**愿望单 */
        EventHelper.addProtocolEvent(DrawConfig.EProtocol.Add2WishList, GHandler.create(this, (event: CLIENT_DATA<IDrawConfig.ICardWanted>) => {
            [event.state, event.message] = GPlayerEntityRoot.GetOneInstance(event.PlayerID).DrawComp().OnAdd2WishList(event.data.itemName, event.data.isadd);
            if (event.state == false) {
                GNotificationSystem.ErrorMessage(event.message, event.PlayerID)
            }
        }));
    }

    public StartGame() {
        GTimerHelper.AddTimer(1, GHandler.create(this, () => {
            GPlayerEntityRoot.GetAllInstance().forEach((player) => {
                player.DrawComp().DrawStartCard();
            });
        }));
    }
}
declare global {
    /**
     * @ServerOnly
     */
    var GDrawSystem: typeof DrawSystemComponent;
}
if (_G.GDrawSystem == undefined) {
    _G.GDrawSystem = DrawSystemComponent;
}