
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_gyrocopter_flak_cannon = {"ID":"5363","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE","AbilityUnitDamageType":"DAMAGE_TYPE_PHYSICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"1","AbilitySound":"Hero_Gyrocopter.FlackCannon","HasScepterUpgrade":"1","AbilityCastPoint":"0 0 0 0","AbilityCooldown":"24 22 20 18","AbilityManaCost":"50 50 50 50","AbilityDuration":"10","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"1250"},"02":{"var_type":"FIELD_INTEGER","max_attacks":"3 4 5 6","LinkedSpecialBonus":"special_bonus_unique_gyrocopter_2"},"03":{"var_type":"FIELD_INTEGER","projectile_speed":"800"},"04":{"var_type":"FIELD_FLOAT","fire_rate":"1.2","RequiresScepter":"1"},"05":{"var_type":"FIELD_INTEGER","scepter_radius":"700","RequiresScepter":"1"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_gyrocopter_flak_cannon extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "gyrocopter_flak_cannon";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_gyrocopter_flak_cannon = Data_gyrocopter_flak_cannon ;
}
    