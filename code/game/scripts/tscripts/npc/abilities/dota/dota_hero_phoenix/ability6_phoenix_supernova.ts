
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_phoenix_supernova = {"ID":"5630","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"2","HasScepterUpgrade":"1","AbilitySound":"Hero_Phoenix.SuperNova.Begin","AbilityCastRange":"500","AbilityCastPoint":"0.01","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_5","AbilityCooldown":"120","AbilityDuration":"6.0","AbilityManaCost":"150 200 250","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","aura_radius":"1200"},"02":{"var_type":"FIELD_INTEGER","damage_per_sec":"60 90 120"},"03":{"var_type":"FIELD_FLOAT","stun_duration":"2.0 2.5 3.0","LinkedSpecialBonus":"special_bonus_unique_phoenix_2"},"04":{"var_type":"FIELD_INTEGER","max_hero_attacks":"6 8 10","LinkedSpecialBonus":"special_bonus_unique_phoenix_1"},"05":{"var_type":"FIELD_INTEGER","max_hero_attacks_scepter":"7 10 13","LinkedSpecialBonus":"special_bonus_unique_phoenix_1","RequiresScepter":"1"},"07":{"var_type":"FIELD_INTEGER","cast_range_tooltip_scepter":"500","RequiresScepter":"1"}}} ;

@registerAbility()
export class ability6_phoenix_supernova extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "phoenix_supernova";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_phoenix_supernova = Data_phoenix_supernova ;
}
    