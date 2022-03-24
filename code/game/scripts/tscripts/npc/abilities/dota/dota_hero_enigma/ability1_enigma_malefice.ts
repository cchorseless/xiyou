
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_enigma_malefice = {"ID":"5146","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_Enigma.Malefice","AbilityCastRange":"600","AbilityCastPoint":"0.3 0.3 0.3 0.3","AbilityCooldown":"14","AbilityManaCost":"100 120 140 160","AbilityModifierSupportValue":"0.33","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","tick_rate":"2.0 2.0 2.0 2.0"},"02":{"var_type":"FIELD_FLOAT","stun_duration":"0.4 0.6 0.8 1.0","LinkedSpecialBonus":"special_bonus_unique_enigma_6"},"03":{"var_type":"FIELD_INTEGER","damage":"40 60 80 100","LinkedSpecialBonus":"special_bonus_unique_enigma_5"},"04":{"var_type":"FIELD_FLOAT","duration":"4.0 4.0 4.0 4.0"},"05":{"var_type":"FIELD_FLOAT","tooltip_stuns":"3 3 3 3","LinkedSpecialBonus":"special_bonus_unique_enigma_2","LinkedSpecialBonusField":"value2"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_enigma_malefice extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "enigma_malefice";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_enigma_malefice = Data_enigma_malefice ;
}
    