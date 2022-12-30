
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_bloodstone_custom = {"ID":"121","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET","FightRecapLevel":"2","AbilityCastPoint":"0.0","AbilityCooldown":"85.0","ItemCost":"5750","ItemShopTags":"regen_health;regen_mana;mana_pool;health_pool","ItemQuality":"epic","ItemAliases":"bs;bloodstone","ItemInitialCharges":"14","ItemDisplayCharges":"1","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","AllowedInBackpack":"0","ShouldBeSuggested":"1","AbilitySpecial":{"10":{"var_type":"FIELD_FLOAT","amp_per_charge":"0.35"},"11":{"var_type":"FIELD_INTEGER","death_charges":"3"},"12":{"var_type":"FIELD_INTEGER","kill_charges":"1"},"13":{"var_type":"FIELD_INTEGER","charge_range":"1600"},"14":{"var_type":"FIELD_INTEGER","initial_charges_tooltip":"14"},"15":{"var_type":"FIELD_FLOAT","restore_duration":"2.0"},"16":{"var_type":"FIELD_INTEGER","mana_cost_percentage":"30"},"01":{"var_type":"FIELD_INTEGER","bonus_health":"425"},"02":{"var_type":"FIELD_INTEGER","bonus_mana":"425"},"03":{"var_type":"FIELD_INTEGER","bonus_intellect":"16"},"04":{"var_type":"FIELD_INTEGER","mana_regen_multiplier":"100"},"05":{"var_type":"FIELD_INTEGER","spell_amp":"8"},"06":{"var_type":"FIELD_INTEGER","spell_lifesteal_amp":"30"},"07":{"var_type":"FIELD_FLOAT","hero_lifesteal":"15"},"08":{"var_type":"FIELD_FLOAT","creep_lifesteal":"3"},"09":{"var_type":"FIELD_FLOAT","regen_per_charge":"0.2"}}} ;

@registerAbility()
export class item_bloodstone_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_bloodstone";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_bloodstone_custom = Data_item_bloodstone_custom ;
};

    