
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_sandking_sand_storm = {"ID":"5103","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"1","AbilitySound":"Ability.SandKing_SandStorm.start","AbilityCastRange":"0","AbilityDuration":"20 25 30 35","AbilityCooldown":"40 34 28 22","AbilityCastPoint":"0.0 0.0 0.0 0.0","AbilityManaCost":"75","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","damage_tick_rate":"0.5"},"02":{"var_type":"FIELD_INTEGER","sand_storm_radius":"425 500 575 650"},"03":{"var_type":"FIELD_INTEGER","sand_storm_damage":"20 45 70 95","LinkedSpecialBonus":"special_bonus_unique_sand_king_2"},"04":{"var_type":"FIELD_FLOAT","fade_delay":"0.7"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_sandking_sand_storm extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "sandking_sand_storm";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_sandking_sand_storm = Data_sandking_sand_storm ;
}
    