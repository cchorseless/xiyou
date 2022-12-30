
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_ancient_apparition_cold_feet = {"ID":"5345","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_Ancient_Apparition.ColdFeetCast","AbilityCastAnimation":"ACT_DOTA_COLD_FEET","AbilityCastGestureSlot":"DEFAULT","AbilityCastRange":"700 800 900 1000","AbilityCastPoint":"0.01 0.01 0.01 0.01","AbilityCooldown":"10 9 8 7","AbilityDuration":"4.0 4.0 4.0 4.0","AbilityManaCost":"125","AbilityModifierSupportValue":"0.5","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","damage":"30 50 70 90"},"02":{"var_type":"FIELD_INTEGER","break_distance":"715"},"03":{"var_type":"FIELD_FLOAT","stun_duration":"2.0 2.5 3.0 3.5"},"04":{"var_type":"FIELD_INTEGER","AbilityCharges":"","LinkedSpecialBonus":"special_bonus_unique_ancient_apparition_1"}}} ;

@registerAbility()
export class ability1_ancient_apparition_cold_feet extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "ancient_apparition_cold_feet";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_ancient_apparition_cold_feet = Data_ancient_apparition_cold_feet ;
}
    