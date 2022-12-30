
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_witch_doctor_maledict = {"ID":"5140","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"1","AbilitySound":"Hero_WitchDoctor.Maledict_Cast","AbilityCastRange":"575","AbilityCastPoint":"0.35 0.35 0.35 0.35","AbilityCooldown":"30 26 22 18","AbilityDuration":"12.0","AbilityDamage":"7 14 21 28","AbilityManaCost":"105 110 115 120","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"180","LinkedSpecialBonus":"special_bonus_unique_witch_doctor_6"},"02":{"var_type":"FIELD_INTEGER","abilityduration":"","LinkedSpecialBonus":"special_bonus_unique_witch_doctor_4","LinkedSpecialBonusField":"value"},"03":{"var_type":"FIELD_INTEGER","bonus_damage":"16 24 32 40","LinkedSpecialBonus":"special_bonus_unique_witch_doctor_7"},"04":{"var_type":"FIELD_INTEGER","bonus_damage_threshold":"100"},"05":{"var_type":"FIELD_INTEGER","ticks":"3","LinkedSpecialBonusField":"value2"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_5"} ;

@registerAbility()
export class ability3_witch_doctor_maledict extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "witch_doctor_maledict";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_witch_doctor_maledict = Data_witch_doctor_maledict ;
}
    