
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_vladmir_custom = {"ID":"81","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilityCastRange":"1200","ItemCost":"2700","ItemShopTags":"damage;armor;regen_mana","ItemQuality":"rare","ItemAliases":"vladmir's offering;vlads","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","armor_aura":"3.0"},"02":{"var_type":"FIELD_FLOAT","mana_regen_aura":"1.75"},"03":{"var_type":"FIELD_INTEGER","lifesteal_aura":"15"},"04":{"var_type":"FIELD_INTEGER","damage_aura":"18"},"05":{"var_type":"FIELD_INTEGER","aura_radius":"1200"}}} ;

@registerAbility()
export class item_vladmir_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_vladmir";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_vladmir_custom = Data_item_vladmir_custom ;
};

    