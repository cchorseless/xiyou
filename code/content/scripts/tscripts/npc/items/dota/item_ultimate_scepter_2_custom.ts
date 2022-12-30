
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_ultimate_scepter_2_custom = {"ID":"271","Model":"models/props_gameplay/aghanim_scepter.vmdl","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"5800","ItemShopTags":"int;str;agi;mana_pool;health_pool;hard_to_tag","ItemQuality":"rare","ItemAliases":"ags;ultimate;aghanim's scepter;ags"} ;

@registerAbility()
export class item_ultimate_scepter_2_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_ultimate_scepter_2";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_ultimate_scepter_2_custom = Data_item_ultimate_scepter_2_custom ;
};

    