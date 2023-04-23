export module NotificationConfig {

    export enum EProtocol {
        /**推送错误信息 */
        push_error_message = "push_error_message",
        push_update_minimap = "push_update_minimap",
        push_update_minimap_nodraw = "push_update_minimap_nodraw",
        /**推送战斗信息 */
        push_notification_combat = "push_notification_combat",
    }

    export enum EMessageType {

    }
}

declare global {
    namespace INotificationConfig {
        interface INotificationData {
            message: string;
            /**显示玩家1 */
            player_id?: PlayerID;
            /**显示玩家2 */
            player_id2?: PlayerID;
            teamnumber?: DOTATeam_t;
            // 获取的货币
            coin_gold?: number;
            coin_wood?: number;
            coin_population?: number;
            coin_soulcrystal?: number;
            /**获取的道具 itemname,level */
            item_get?: string;
            /**玩法功能 */
            string_from?: string;
            [x: string]: any;
        }
    }
}