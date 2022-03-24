
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_assault_custom = {"ID":"112","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilityCastRange":"1200","ItemCost":"5125","ItemShopTags":"attack_speed;armor;hard_to_tag","ItemQuality":"epic","ItemAliases":"ac;assault cuirass","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"30"},"02":{"var_type":"FIELD_INTEGER","bonus_armor":"10"},"03":{"var_type":"FIELD_INTEGER","aura_radius":"1200"},"04":{"var_type":"FIELD_INTEGER","aura_attack_speed":"30"},"05":{"var_type":"FIELD_INTEGER","aura_positive_armor":"5"},"06":{"var_type":"FIELD_INTEGER","aura_negative_armor":"-5"}}} ;

@registerAbility()
export class item_assault_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_assault";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_assault_custom = Data_item_assault_custom ;
};

    