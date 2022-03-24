
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_dark_willow_cursed_crown = {"ID":"6342","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","HasShardUpgrade":"1","AbilityCastRange":"600 625 650 675","AbilityCastPoint":"0.2","AbilityCooldown":"18 16 14 12","AbilityManaCost":"80 100 120 140","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","delay":"4"},"02":{"var_type":"FIELD_FLOAT","stun_duration":"1.75 2.25 2.75 3.25","LinkedSpecialBonus":"special_bonus_unique_dark_willow_6"},"03":{"var_type":"FIELD_INTEGER","stun_radius":"360","LinkedSpecialBonus":"special_bonus_unique_dark_willow_7"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_dark_willow_cursed_crown extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "dark_willow_cursed_crown";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_dark_willow_cursed_crown = Data_dark_willow_cursed_crown ;
}
    