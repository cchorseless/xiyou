
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_holy_locket_custom = {"ID":"269","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","AbilityCastRange":"500","AbilityCastPoint":"0.0","ItemCost":"2400","ItemQuality":"rare","ItemAliases":"hl;holy locket","ActiveDescriptionLine":"1","ShouldBeInitiallySuggested":"1","AbilityCooldown":"13.0","AbilitySharedCooldown":"magicwand","UIPickupSound":"Item.PickUpRingShop","UIDropSound":"Item.DropRingShop","WorldDropSound":"Item.DropRingWorld","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","charge_gain_timer":"10"},"01":{"var_type":"FIELD_INTEGER","bonus_health":"250"},"02":{"var_type":"FIELD_INTEGER","bonus_mana":"325"},"03":{"var_type":"FIELD_FLOAT","aura_health_regen":"3"},"04":{"var_type":"FIELD_INTEGER","aura_radius":"1200"},"05":{"var_type":"FIELD_INTEGER","heal_increase":"35"},"06":{"var_type":"FIELD_INTEGER","max_charges":"20"},"07":{"var_type":"FIELD_INTEGER","charge_radius":"1200"},"08":{"var_type":"FIELD_INTEGER","bonus_all_stats":"3"},"09":{"var_type":"FIELD_INTEGER","restore_per_charge":"15"}}} ;

@registerAbility()
export class item_holy_locket_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_holy_locket";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_holy_locket_custom = Data_item_holy_locket_custom ;
};

    