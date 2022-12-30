
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_silencer_last_word = {"ID":"5379","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","FightRecapLevel":"1","AbilitySound":"Hero_Silencer.LastWord.Target","HasScepterUpgrade":"1","AbilityCastPoint":"0.3","AbilityCastRange":"900","AbilityCooldown":"22 18 14 10","AbilityManaCost":"100 105 110 115","AbilityModifierSupportValue":"0.3","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","damage":"120 160 200 240"},"02":{"var_type":"FIELD_FLOAT","int_multiplier":"1.5 2 2.5 3"},"03":{"var_type":"FIELD_FLOAT","debuff_duration":"4"},"04":{"var_type":"FIELD_INTEGER","duration":"3 4 5 6"},"05":{"var_type":"FIELD_INTEGER","scepter_radius":"650","RequiresScepter":"1"},"06":{"var_type":"FIELD_INTEGER","scepter_bonus_damage":"0","RequiresScepter":"1"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_silencer_last_word extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "silencer_last_word";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_silencer_last_word = Data_silencer_last_word ;
}
    