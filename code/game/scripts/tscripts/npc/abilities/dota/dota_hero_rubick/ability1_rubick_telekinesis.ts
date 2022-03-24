
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_rubick_telekinesis = {"ID":"5448","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES_STRONG","HasShardUpgrade":"1","AbilityCastPoint":"0.1 0.1 0.1 0.1","AbilityCooldown":"28 26 24 22","AbilityManaCost":"125","AbilityCastRange":"550 575 600 625","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","lift_duration":"0.8 1.2 1.6 2.0","LinkedSpecialBonus":"special_bonus_unique_rubick_7"},"02":{"var_type":"FIELD_FLOAT","stun_duration":"1.2 1.4 1.6 1.8"},"03":{"var_type":"FIELD_INTEGER","radius":"325 325 325 325"},"04":{"var_type":"FIELD_INTEGER","max_land_distance":"375 375 375 375","LinkedSpecialBonus":"special_bonus_unique_rubick"},"05":{"var_type":"FIELD_FLOAT","fall_duration":"0.3 0.3 0.3 0.3"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_rubick_telekinesis extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "rubick_telekinesis";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_rubick_telekinesis = Data_rubick_telekinesis ;
}
    