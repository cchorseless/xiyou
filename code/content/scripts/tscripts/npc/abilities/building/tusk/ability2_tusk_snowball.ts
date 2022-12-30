
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_tusk_snowball = {"ID":"5566","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"1","AbilitySound":"Hero_Tusk.Snowball.Cast","AbilityCastRange":"1150","AbilityCastPoint":"0.1 0.1 0.1 0.1","AbilityCooldown":"21 20 19 18","AbilityManaCost":"75 75 75 75","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","snowball_grab_radius":"350"},"01":{"var_type":"FIELD_INTEGER","snowball_damage":"80 120 160 200","LinkedSpecialBonus":"special_bonus_unique_tusk_2"},"02":{"var_type":"FIELD_INTEGER","snowball_speed":"600 625 650 675","LinkedSpecialBonus":"special_bonus_unique_tusk_3"},"03":{"var_type":"FIELD_INTEGER","snowball_damage_bonus":"20 40 60 80"},"04":{"var_type":"FIELD_FLOAT","stun_duration":"0.5 0.75 1.0 1.25"},"05":{"var_type":"FIELD_INTEGER","snowball_windup_radius":"100"},"06":{"var_type":"FIELD_FLOAT","snowball_duration":"3.0"},"07":{"var_type":"FIELD_INTEGER","snowball_radius":"200"},"08":{"var_type":"FIELD_INTEGER","snowball_grow_rate":"40"},"09":{"var_type":"FIELD_FLOAT","snowball_windup":"3.0"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_tusk_snowball extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "tusk_snowball";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_tusk_snowball = Data_tusk_snowball ;
}
    