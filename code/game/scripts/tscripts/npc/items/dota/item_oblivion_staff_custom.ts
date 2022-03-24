
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_oblivion_staff_custom = {"ID":"67","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"1500","ItemShopTags":"damage;int;attack_speed;regen_mana","ItemQuality":"common","ItemAliases":"oblivion staff","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_damage":"15"},"02":{"var_type":"FIELD_INTEGER","bonus_intellect":"10"},"03":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"10"},"04":{"var_type":"FIELD_FLOAT","bonus_mana_regen":"1.25"}}} ;

@registerAbility()
export class item_oblivion_staff_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_oblivion_staff";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_oblivion_staff_custom = Data_item_oblivion_staff_custom ;
};

    