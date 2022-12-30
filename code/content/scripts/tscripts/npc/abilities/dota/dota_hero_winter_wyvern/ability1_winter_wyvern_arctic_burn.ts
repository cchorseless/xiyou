
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_winter_wyvern_arctic_burn = {"ID":"5651","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","AbilitySound":"Hero_WinterWyvern.ArcticBurn.Cast","SpellDispellableType":"SPELL_DISPELLABLE_NO","HasScepterUpgrade":"1","AbilityCastPoint":"0.0 0.0 0.0 0.0","AbilityCooldown":"42 36 28 20","AbilityManaCost":"100","AbilitySpecial":{"10":{"var_type":"FIELD_FLOAT","attack_point":"0.1"},"11":{"var_type":"FIELD_INTEGER","max_attacks":"5"},"12":{"var_type":"FIELD_INTEGER","mana_cost_scepter":"20","RequiresScepter":"1"},"13":{"var_type":"FIELD_INTEGER","movement_scepter":"25","RequiresScepter":"1"},"01":{"var_type":"FIELD_FLOAT","duration":"8.0","LinkedSpecialBonus":"special_bonus_unique_winter_wyvern_6"},"02":{"var_type":"FIELD_INTEGER","attack_range_bonus":"350 425 500 575"},"03":{"var_type":"FIELD_FLOAT","percent_damage":"6 7 8 9"},"04":{"var_type":"FIELD_FLOAT","tick_rate":"1.0"},"05":{"var_type":"FIELD_FLOAT","damage_duration":"5.0","CalculateSpellDamageTooltip":"0"},"06":{"var_type":"FIELD_INTEGER","move_slow":"22 28 34 40","LinkedSpecialBonus":"special_bonus_unique_winter_wyvern_1"},"07":{"var_type":"FIELD_INTEGER","night_vision_bonus":"400"},"08":{"var_type":"FIELD_INTEGER","projectile_speed_bonus":"500"},"09":{"var_type":"FIELD_INTEGER","tree_destruction_radius":"175"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_winter_wyvern_arctic_burn extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "winter_wyvern_arctic_burn";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_winter_wyvern_arctic_burn = Data_winter_wyvern_arctic_burn ;
}
    