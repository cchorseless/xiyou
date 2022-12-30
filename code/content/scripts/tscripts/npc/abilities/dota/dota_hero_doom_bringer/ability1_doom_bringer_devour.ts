
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_doom_bringer_devour = {"ID":"5339","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK | DOTA_ABILITY_BEHAVIOR_AUTOCAST","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_CUSTOM","AbilityUnitTargetType":"DOTA_UNIT_TARGET_CUSTOM","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO","SpellDispellableType":"SPELL_DISPELLABLE_NO","AbilitySound":"Hero_DoomBringer.Devour","AbilityCastPoint":"0.3 0.3 0.3 0.3","AbilityCastRange":"300 300 300 300","AbilityCooldown":"60","AbilityManaCost":"40 50 60 70","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_gold":"60 120 180 240","LinkedSpecialBonus":"special_bonus_unique_doom_3"},"02":{"var_type":"FIELD_INTEGER","regen":"0"},"03":{"var_type":"FIELD_INTEGER","creep_level":"4 5 6 6"},"04":{"var_type":"FIELD_FLOAT","hero_ability_steal_time":"99999"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_doom_bringer_devour extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "doom_bringer_devour";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_doom_bringer_devour = Data_doom_bringer_devour ;
}
    