import { EventHelper } from "../../helper/EventHelper";
import { NotificationConfig } from "../../shared/NotificationConfig";
import { ET } from "../../shared/lib/Entity";

@GReloadable
export class NotificationSystemComponent extends ET.SingletonComponent {

    /**
     * 推送錯誤信息給玩家
     * @Server
     * @param message
     * @param sound
     * @param playerID
     */
    static ErrorMessage(errorcode: string, ...playerID: Array<PlayerID>) {
        if (!IsServer()) {
            return;
        }
        let event: JS_TO_LUA_DATA = {};
        event.state = true;
        event.data = errorcode;
        // 全部玩家
        if (playerID == null || playerID.length == 0) {
            EventHelper.fireProtocolEventToClient(NotificationConfig.EProtocol.push_error_message, event);
        } else {
            playerID.forEach((_id) => {
                EventHelper.fireProtocolEventToPlayer(NotificationConfig.EProtocol.push_error_message, event, _id as PlayerID);
            });
        }
    }
    /**
     * 推送战斗信息给玩家
     * @param message 
     * @param playerID 
     * @returns 
     */
    static NoticeCombatMessage(message: INotificationConfig.INotificationData, ...playerID: Array<PlayerID>) {
        if (!IsServer()) {
            return;
        }
        let event: JS_TO_LUA_DATA = {};
        event.state = true;
        event.data = message;
        // 全部玩家
        if (playerID == null || playerID.length == 0) {
            EventHelper.fireProtocolEventToClient(NotificationConfig.EProtocol.push_notification_combat, event);
        } else {
            playerID.forEach((_id) => {
                EventHelper.fireProtocolEventToPlayer(NotificationConfig.EProtocol.push_notification_combat, event, _id as PlayerID);
            });
        }
    }



}

declare global {
    /**
     * @ServerOnly
     */
    var GNotificationSystem: typeof NotificationSystemComponent;
}
if (_G.GNotificationSystem == undefined) {
    _G.GNotificationSystem = NotificationSystemComponent;
}