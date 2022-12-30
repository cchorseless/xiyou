import { GameEnum } from "../../../scripts/tscripts/shared/GameEnum";
import { LogHelper } from "./LogHelper";
import { NetHelper } from "./NetHelper";

export module EventHelper {
    export function Init() {
        addEvent();
    }

    function addEvent() {
        GameEvents.Subscribe("custom_npc_first_spawned", (e) => {
            LogHelper.print(111111);
            LogHelper.print(e)
        })
        GameEvents.Subscribe(GameEnum.GameEvent.game_rules_state_change, (e) => {
            $.Msg("Game Enter State", Game.GetState());
        });

        /**物品位置变动 */
        GameEvents.Subscribe(GameEnum.GameEvent.dota_inventory_changed, (e) => {
            LogHelper.print(e);
            // 通知服务器
            NetHelper.SendToLua(GameEnum.CustomProtocol.req_ITEM_SLOT_CHANGE, e);
        });

    }
}
