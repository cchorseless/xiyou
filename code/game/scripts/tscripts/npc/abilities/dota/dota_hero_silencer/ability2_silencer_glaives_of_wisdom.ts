
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_silencer_glaives_of_wisdom = {"ID":"5378","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AUTOCAST | DOTA_ABILITY_BEHAVIOR_ATTACK","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","AbilityUnitDamageType":"DAMAGE_TYPE_PURE","AbilitySound":"Hero_Silencer.GlaivesOfWisdom","HasShardUpgrade":"1","AbilityDuration":"0.0 0.0 0.0 0.0","AbilityCastRange":"600","AbilityCooldown":"0","AbilityManaCost":"15","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","intellect_damage_pct":"15 35 55 75","LinkedSpecialBonus":"special_bonus_unique_silencer_3"},"02":{"var_type":"FIELD_INTEGER","int_steal":"1 1 2 3"},"03":{"var_type":"FIELD_FLOAT","int_steal_duration":"10 20 30 40"},"04":{"var_type":"FIELD_INTEGER","scepter_range":"600"},"05":{"var_type":"FIELD_INTEGER","scepter_bounce_count":"1"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_silencer_glaives_of_wisdom extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "silencer_glaives_of_wisdom";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_silencer_glaives_of_wisdom = Data_silencer_glaives_of_wisdom ;
}
    