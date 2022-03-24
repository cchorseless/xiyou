
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_quarterstaff_custom = {"ID":"10","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"875","ItemShopTags":"damage;attack_speed","ItemQuality":"component","ItemAliases":"quarterstaff","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_speed":"10"},"02":{"var_type":"FIELD_INTEGER","bonus_damage":"10"}}} ;

@registerAbility()
export class item_quarterstaff_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_quarterstaff";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_quarterstaff_custom = Data_item_quarterstaff_custom ;
};

    