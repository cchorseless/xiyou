
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_grimstroke_dark_portrait = {"ID":"7852","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","FightRecapLevel":"1","MaxLevel":"1","IsGrantedByScepter":"1","HasScepterUpgrade":"1","AbilityCastAnimation":"ACT_DOTA_GS_INK_CREATURE","AbilityCastGestureSlot":"DEFAULT","AbilityCastRange":"1200","AbilityCastPoint":"0.0","AbilityCooldown":"35","AbilityManaCost":"200","AbilityModifierSupportValue":"0.5","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","illusion_duration":"25","RequiresScepter":"1"},"02":{"var_type":"FIELD_INTEGER","images_do_damage_percent":"50","RequiresScepter":"1"},"03":{"var_type":"FIELD_INTEGER","images_do_damage_percent_tooltip":"150","RequiresScepter":"1"},"04":{"var_type":"FIELD_INTEGER","images_take_damage_percent":"250","RequiresScepter":"1"},"05":{"var_type":"FIELD_INTEGER","images_take_damage_percent_tooltip":"350","RequiresScepter":"1"},"06":{"var_type":"FIELD_INTEGER","images_movespeed_bonus":"30","RequiresScepter":"1"}}} ;

@registerAbility()
export class ability4_grimstroke_dark_portrait extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "grimstroke_dark_portrait";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_grimstroke_dark_portrait = Data_grimstroke_dark_portrait ;
}
    