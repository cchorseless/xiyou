
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_doom_bringer_infernal_blade = {"ID":"5341","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AUTOCAST | DOTA_ABILITY_BEHAVIOR_ATTACK","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilitySound":"Hero_DoomBringer.InfernalBlade.Target","HasShardUpgrade":"1","AbilityCooldown":"16 12 8 4","AbilityManaCost":"40","AbilityCastRange":"200","AbilityCastPoint":"0.0 0.0 0.0 0.0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","burn_damage":"16 20 24 28"},"02":{"var_type":"FIELD_FLOAT","burn_damage_pct":"1.25 2.5 3.75 5","LinkedSpecialBonus":"special_bonus_unique_doom_1"},"03":{"var_type":"FIELD_FLOAT","burn_duration":"4.0"},"04":{"var_type":"FIELD_FLOAT","ministun_duration":"0.6"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_doom_bringer_infernal_blade extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "doom_bringer_infernal_blade";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_doom_bringer_infernal_blade = Data_doom_bringer_infernal_blade ;
}
    