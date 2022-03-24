
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_invoker_cold_snap = {"ID":"5376","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","MaxLevel":"1","HotKeyOverride":"Y","FightRecapLevel":"1","AbilitySound":"Hero_Invoker.ColdSnap","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","AbilityCastRange":"1000","AbilityCastPoint":"0.05","AbilityCastAnimation":"ACT_INVALID","AbilityCooldown":"20","AbilityManaCost":"100","AbilityModifierSupportValue":"0.15","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"3.0 3.5 4.0 4.5 5.0 5.5 6.0 6.5","levelkey":"quaslevel","LinkedSpecialBonus":"special_bonus_unique_invoker_7"},"02":{"var_type":"FIELD_FLOAT","freeze_duration":"0.4"},"03":{"var_type":"FIELD_FLOAT","freeze_cooldown":"0.77 0.74 0.71 0.69 0.66 0.63 0.60 0.57","levelkey":"quaslevel"},"04":{"var_type":"FIELD_FLOAT","freeze_damage":"8 16 24 32 40 48 56 64","levelkey":"quaslevel"},"05":{"var_type":"FIELD_FLOAT","damage_trigger":"10.0"}}} ;

@registerAbility()
export class ability7_invoker_cold_snap extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "invoker_cold_snap";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_invoker_cold_snap = Data_invoker_cold_snap ;
}
    