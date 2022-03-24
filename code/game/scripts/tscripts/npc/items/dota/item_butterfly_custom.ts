
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_butterfly_custom = {"ID":"139","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"4975","ItemShopTags":"agi;damage;evasion;attack_speed","ItemQuality":"epic","ItemAliases":"bfly;butterfly","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_agility":"30"},"02":{"var_type":"FIELD_INTEGER","bonus_evasion":"35"},"03":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"30"},"04":{"var_type":"FIELD_INTEGER","bonus_damage":"25"}}} ;

@registerAbility()
export class item_butterfly_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_butterfly";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_butterfly_custom = Data_item_butterfly_custom ;
};

    