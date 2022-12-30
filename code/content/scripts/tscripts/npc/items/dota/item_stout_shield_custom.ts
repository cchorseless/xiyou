
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_stout_shield_custom = {"ID":"182","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","Model":"models/props_gameplay/stout_shield.vmdl","ItemCost":"100","ItemShopTags":"block","ItemQuality":"component","ItemAliases":"stout shield","ShouldBeSuggested":"0","ItemPurchasable":"0","IsObsolete":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","damage_block_melee":"20"},"02":{"var_type":"FIELD_INTEGER","damage_block_ranged":"8"},"03":{"var_type":"FIELD_INTEGER","block_chance":"50"}}} ;

@registerAbility()
export class item_stout_shield_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_stout_shield";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_stout_shield_custom = Data_item_stout_shield_custom ;
};

    