
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_bristleback_hairball = {"ID":"643","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ALLIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_YES","MaxLevel":"1","FightRecapLevel":"1","IsGrantedByShard":"1","AbilityCastRange":"1500","AbilityCastPoint":"0.1","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"20","AbilityManaCost":"100","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","projectile_speed":"1200"}}} ;

@registerAbility()
export class ability4_bristleback_hairball extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "bristleback_hairball";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_bristleback_hairball = Data_bristleback_hairball ;
}
    