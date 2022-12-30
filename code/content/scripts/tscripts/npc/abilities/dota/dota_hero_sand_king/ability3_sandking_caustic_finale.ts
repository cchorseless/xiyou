
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_sandking_caustic_finale = {"ID":"5104","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilitySound":"Ability.SandKing_CausticFinale","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","caustic_finale_radius":"500"},"02":{"var_type":"FIELD_INTEGER","caustic_finale_damage_base":"70 90 110 130"},"03":{"var_type":"FIELD_INTEGER","caustic_finale_damage_pct":"10 14 18 22"},"04":{"var_type":"FIELD_FLOAT","caustic_finale_duration":"5"},"05":{"var_type":"FIELD_INTEGER","caustic_finale_slow":"-10 -15 -20 -25","LinkedSpecialBonus":"special_bonus_unique_sand_king_6","LinkedSpecialBonusOperation":"SPECIAL_BONUS_SUBTRACT"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_sandking_caustic_finale extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "sandking_caustic_finale";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_sandking_caustic_finale = Data_sandking_caustic_finale ;
}
    