
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_chen_penitence = {"ID":"5328","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilitySound":"Hero_Chen.PenitenceCast","AbilityCastPoint":"0.3 0.3 0.3 0.3","AbilityCastRange":"800","AbilityCooldown":"14.0 13.0 12.0 11.0","AbilityManaCost":"70 80 90 100","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"5 6 7 8"},"02":{"var_type":"FIELD_INTEGER","speed":"1400"},"03":{"var_type":"FIELD_INTEGER","bonus_movement_speed":"-18 -24 -30 -36","LinkedSpecialBonus":"special_bonus_unique_chen_8","LinkedSpecialBonusOperation":"SPECIAL_BONUS_SUBTRACT"},"04":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"30 60 90 120"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_chen_penitence extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "chen_penitence";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_chen_penitence = Data_chen_penitence ;
}
    