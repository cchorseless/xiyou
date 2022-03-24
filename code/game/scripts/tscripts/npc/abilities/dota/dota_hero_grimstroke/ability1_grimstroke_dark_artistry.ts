
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_grimstroke_dark_artistry = {"ID":"8000","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilityCastRange":"1400","AbilityCastPoint":"0.8","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3","AbilityCooldown":"11 9 7 5","AbilityManaCost":"100 110 120 130","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","AbilityModifierSupportValue":"0.5","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","start_radius":"120"},"02":{"var_type":"FIELD_INTEGER","end_radius":"160"},"03":{"var_type":"FIELD_INTEGER","projectile_speed":"2400"},"04":{"var_type":"FIELD_INTEGER","damage":"120 180 240 300","LinkedSpecialBonus":"special_bonus_unique_grimstroke_2","LinkedSpecialBonusOperation":"SPECIAL_BONUS_PERCENTAGE_ADD"},"05":{"var_type":"FIELD_INTEGER","bonus_damage_per_target":"16 24 32 40","LinkedSpecialBonus":"special_bonus_unique_grimstroke_2","LinkedSpecialBonusOperation":"SPECIAL_BONUS_PERCENTAGE_ADD"},"06":{"var_type":"FIELD_INTEGER","movement_slow_pct":"50 60 70 80"},"07":{"var_type":"FIELD_FLOAT","slow_duration":"1.5"},"08":{"var_type":"FIELD_FLOAT","vision_duration":"2.0"},"09":{"var_type":"FIELD_INTEGER","abilitycastrange":"","LinkedSpecialBonus":"special_bonus_unique_grimstroke_3"}}} ;

@registerAbility()
export class ability1_grimstroke_dark_artistry extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "grimstroke_dark_artistry";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_grimstroke_dark_artistry = Data_grimstroke_dark_artistry ;
}
    