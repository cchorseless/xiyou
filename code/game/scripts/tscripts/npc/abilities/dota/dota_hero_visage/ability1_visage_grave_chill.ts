
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_visage_grave_chill = {"ID":"5480","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_Visage.GraveChill.Cast","AbilityCastPoint":"0.2 0.2 0.2 0.2","AbilityCooldown":"16 14 12 10","AbilityManaCost":"90","AbilityCastRange":"625","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","chill_duration":"6","LinkedSpecialBonus":"special_bonus_unique_visage_7"},"02":{"var_type":"FIELD_INTEGER","movespeed_bonus":"17 23 29 35"},"03":{"var_type":"FIELD_INTEGER","attackspeed_bonus":"34 46 58 70"},"04":{"var_type":"FIELD_INTEGER","radius":"900"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability1_visage_grave_chill extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "visage_grave_chill";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_visage_grave_chill = Data_visage_grave_chill ;
}
    