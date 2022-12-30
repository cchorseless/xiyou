
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_blitz_knuckles_custom = {"ID":"485","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"1000","ItemShopTags":"attack_speed","ItemQuality":"component","ItemAliases":"blitz knuckles","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"35"}}} ;

@registerAbility()
export class item_blitz_knuckles_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_blitz_knuckles";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_blitz_knuckles_custom = Data_item_blitz_knuckles_custom ;
};

    