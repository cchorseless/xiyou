
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_winter_wyvern_splinter_blast = {"ID":"5652","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AOE","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilityCastRange":"1200","AbilityCastPoint":"0.3 0.3 0.3 0.3","AbilityCooldown":"7","AbilityDamage":"100 180 260 340","AbilityManaCost":"105 120 135 150","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","projectile_speed":"650"},"02":{"var_type":"FIELD_FLOAT","projectile_max_time":"1.0"},"03":{"var_type":"FIELD_INTEGER","split_radius":"500"},"04":{"var_type":"FIELD_INTEGER","bonus_movespeed":"-30"},"05":{"var_type":"FIELD_INTEGER","movespeed_slow_tooltip":"30"},"06":{"var_type":"FIELD_FLOAT","duration":"4.0"},"07":{"var_type":"FIELD_INTEGER","secondary_projectile_speed":"650"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_winter_wyvern_splinter_blast extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "winter_wyvern_splinter_blast";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_winter_wyvern_splinter_blast = Data_winter_wyvern_splinter_blast ;
}
    