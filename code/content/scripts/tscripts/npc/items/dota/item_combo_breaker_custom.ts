
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_combo_breaker_custom = {"ID":"276","IsObsolete":"1","ItemPurchasable":"0"} ;

@registerAbility()
export class item_combo_breaker_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_combo_breaker";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_combo_breaker_custom = Data_item_combo_breaker_custom ;
};

    