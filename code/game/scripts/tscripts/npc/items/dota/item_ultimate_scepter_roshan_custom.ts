
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_ultimate_scepter_roshan_custom = {"ID":"727","Model":"models/props_gameplay/aghanim_scepter.vmdl","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET","ItemCost":"5800","ItemShopTags":"int;str;agi;mana_pool;health_pool;hard_to_tag","ItemQuality":"rare","ItemAliases":"ags;ultimate;aghanim's scepter;ags","ItemPurchasable":"0","ItemSellable":"0","ItemKillable":"1","ItemShareability":"ITEM_FULLY_SHAREABLE"} ;

@registerAbility()
export class item_ultimate_scepter_roshan_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_ultimate_scepter_roshan";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_ultimate_scepter_roshan_custom = Data_item_ultimate_scepter_roshan_custom ;
};

    