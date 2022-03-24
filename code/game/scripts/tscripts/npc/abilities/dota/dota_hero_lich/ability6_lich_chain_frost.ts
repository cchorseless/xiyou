
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_lich_chain_frost = {"ID":"5137","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","FightRecapLevel":"2","AbilitySound":"Hero_Lich.ChainFrost","AbilityDraftUltShardAbility":"lich_ice_spire","AbilityCastRange":"750","AbilityCastPoint":"0.3","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_6","AbilityCooldown":"100.0 80.0 60.0","AbilityManaCost":"200 350 500","AbilityModifierSupportValue":"0.0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","damage":"250 400 550","LinkedSpecialBonus":"special_bonus_unique_lich_7"},"02":{"var_type":"FIELD_INTEGER","jumps":"10 10 10"},"03":{"var_type":"FIELD_INTEGER","jump_range":"600"},"04":{"var_type":"FIELD_INTEGER","slow_movement_speed":"-65"},"05":{"var_type":"FIELD_INTEGER","slow_attack_speed":"-65"},"06":{"var_type":"FIELD_FLOAT","slow_duration":"2.5"},"07":{"var_type":"FIELD_INTEGER","projectile_speed":"850"},"08":{"var_type":"FIELD_INTEGER","vision_radius":"800"},"09":{"var_type":"FIELD_INTEGER","bonus_jump_damage":"15 20 25"}}} ;

@registerAbility()
export class ability6_lich_chain_frost extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "lich_chain_frost";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_lich_chain_frost = Data_lich_chain_frost ;
}
    