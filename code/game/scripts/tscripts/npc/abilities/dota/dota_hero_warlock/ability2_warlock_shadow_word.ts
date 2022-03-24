
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_warlock_shadow_word = {"ID":"5163","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_BOTH","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_Warlock.ShadowWordCastGood","HasShardUpgrade":"1","AbilityCastPoint":"0.4","AbilityCooldown":"14","AbilityManaCost":"120 130 140 150","AbilityCastRange":"450 600 750 900","AbilityModifierSupportValue":"0.0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","damage":"15 25 35 45","LinkedSpecialBonus":"special_bonus_unique_warlock_7"},"02":{"var_type":"FIELD_FLOAT","duration":"12.0"},"03":{"var_type":"FIELD_FLOAT","tick_interval":"1.0"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_warlock_shadow_word extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "warlock_shadow_word";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_warlock_shadow_word = Data_warlock_shadow_word ;
}
    