
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_mekansm_custom = {"ID":"79","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","FightRecapLevel":"2","AbilityCooldown":"65.0","AbilityCastRange":"1200","AbilityManaCost":"100","ItemCost":"1875","ItemShopTags":"agi;int;str;armor;boost_health","ItemQuality":"rare","ItemAliases":"mechanism;mekansm","ItemAlertable":"1","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_armor":"4"},"02":{"var_type":"FIELD_INTEGER","aura_radius":"1200"},"03":{"var_type":"FIELD_FLOAT","aura_health_regen":"2.5"},"04":{"var_type":"FIELD_INTEGER","heal_amount":"275"},"05":{"var_type":"FIELD_INTEGER","heal_radius":"1200"}}} ;

@registerAbility()
export class item_mekansm_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_mekansm";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_mekansm_custom = Data_item_mekansm_custom ;
};

    