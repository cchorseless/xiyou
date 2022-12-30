
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_dark_willow_bedlam = {"ID":"6340","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","MaxLevel":"3","FightRecapLevel":"1","LinkedAbility":"dark_willow_terrorize","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCastGestureSlot":"ABSOLUTE","AbilityCooldown":"30","AbilityManaCost":"100 150 200","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","attack_damage":"75 125 175","LinkedSpecialBonus":"special_bonus_unique_dark_willow_4"},"02":{"var_type":"FIELD_FLOAT","attack_interval":"0.25"},"03":{"var_type":"FIELD_INTEGER","attack_radius":"300"},"04":{"var_type":"FIELD_INTEGER","attack_targets":"1"},"05":{"var_type":"FIELD_INTEGER","roaming_radius":"200"},"06":{"var_type":"FIELD_FLOAT","roaming_seconds_per_rotation":"1.8"},"07":{"var_type":"FIELD_FLOAT","roaming_duration":"5.0"}}} ;

@registerAbility()
export class ability4_dark_willow_bedlam extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "dark_willow_bedlam";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_dark_willow_bedlam = Data_dark_willow_bedlam ;
}
    