
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_witch_doctor_death_ward = {"ID":"5141","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_CHANNELLED","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityUnitDamageType":"DAMAGE_TYPE_PHYSICAL","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_NO_INVIS | DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE | DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE | DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES | DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","FightRecapLevel":"2","AbilitySound":"Hero_WitchDoctor.Death_WardBuild","HasShardUpgrade":"1","HasScepterUpgrade":"1","AbilityDraftUltShardAbility":"witch_doctor_voodoo_switcheroo","AbilityCastRange":"600","AbilityCastPoint":"0.35 0.35 0.35","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityChannelAnimation":"ACT_DOTA_CHANNEL_ABILITY_4","AbilityCooldown":"80.0","AbilityChannelTime":"8.0","AbilityManaCost":"200 200 200","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","damage":"85 135 185","LinkedSpecialBonus":"special_bonus_unique_witch_doctor_5","CalculateSpellDamageTooltip":"0"},"02":{"var_type":"FIELD_INTEGER","attack_range_tooltip":"700","LinkedSpecialBonus":"special_bonus_unique_witch_doctor_1"},"03":{"var_type":"FIELD_INTEGER","bounce_radius":"650 650 650","RequiresScepter":"1"},"04":{"var_type":"FIELD_INTEGER","scepter_lifesteal":"10","RequiresScepter":"1"}}} ;

@registerAbility()
export class ability6_witch_doctor_death_ward extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "witch_doctor_death_ward";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_witch_doctor_death_ward = Data_witch_doctor_death_ward ;
}
    