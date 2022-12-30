
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_tusk_walrus_kick = {"ID":"5672","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_YES","MaxLevel":"1","FightRecapLevel":"1","IsGrantedByScepter":"1","HasScepterUpgrade":"1","AbilitySound":"Hero_Tusk.WalrusKick.Target","AbilityCastPoint":"0.2","AbilityCastRange":"0","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_5","AbilityCooldown":"8","AbilityManaCost":"100","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","crit_multiplier":"0.0","RequiresScepter":"1"},"02":{"var_type":"FIELD_FLOAT","air_time":"1.0","RequiresScepter":"1"},"03":{"var_type":"FIELD_INTEGER","push_length":"1400","RequiresScepter":"1"},"04":{"var_type":"FIELD_INTEGER","move_slow":"40","RequiresScepter":"1"},"05":{"var_type":"FIELD_INTEGER","slow_duration":"4","RequiresScepter":"1"},"06":{"var_type":"FIELD_INTEGER","cooldown_scepter":"8","RequiresScepter":"1"},"07":{"var_type":"FIELD_INTEGER","damage":"350","RequiresScepter":"1"},"08":{"var_type":"FIELD_INTEGER","search_radius":"250","RequiresScepter":"1"}}} ;

@registerAbility()
export class ability4_tusk_walrus_kick extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "tusk_walrus_kick";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_tusk_walrus_kick = Data_tusk_walrus_kick ;
}
    