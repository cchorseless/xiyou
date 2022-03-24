
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_doom_bringer_scorched_earth = {"ID":"5340","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"1","AbilitySound":"Hero_DoomBringer.ScorchedEarthAura","AbilityCastPoint":"0.0 0.0 0.0 0.0","AbilityCastRange":"600 600 600 600","AbilityCooldown":"50 45 40 35","AbilityManaCost":"60 70 80 90","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","damage_per_second":"15 30 45 60","LinkedSpecialBonus":"special_bonus_unique_doom_4"},"02":{"var_type":"FIELD_INTEGER","radius":"600 600 600 600"},"03":{"var_type":"FIELD_INTEGER","bonus_movement_speed_pct":"9 11 13 15","LinkedSpecialBonus":"special_bonus_unique_doom_6"},"04":{"var_type":"FIELD_FLOAT","duration":"15.0"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_doom_bringer_scorched_earth extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "doom_bringer_scorched_earth";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_doom_bringer_scorched_earth = Data_doom_bringer_scorched_earth ;
}
    