
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_sniper_concussive_grenade = {"ID":"694","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","MaxLevel":"1","FightRecapLevel":"1","IsGrantedByShard":"1","AbilityCastRange":"600","AbilityCastPoint":"0.1","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_5","AbilityCooldown":"16","AbilityManaCost":"50","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","knockback_distance":"425"},"02":{"var_type":"FIELD_INTEGER","radius":"375"},"03":{"var_type":"FIELD_FLOAT","knockback_duration":"0.4"},"04":{"var_type":"FIELD_INTEGER","slow":"50"},"05":{"var_type":"FIELD_FLOAT","debuff_duration":"3"},"06":{"var_type":"FIELD_FLOAT","knockback_height":"100"}}} ;

@registerAbility()
export class ability4_sniper_concussive_grenade extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "sniper_concussive_grenade";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_sniper_concussive_grenade = Data_sniper_concussive_grenade ;
}
    