
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_beastmaster_wild_axes = {"ID":"5168","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_Beastmaster.Wild_Axes","HasScepterUpgrade":"1","AbilityCastRange":"1500","AbilityCastPoint":"0.4","AbilityCooldown":"8","AbilityManaCost":"65","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"175"},"02":{"var_type":"FIELD_INTEGER","spread":"450"},"03":{"var_type":"FIELD_INTEGER","range":"1500"},"04":{"var_type":"FIELD_INTEGER","axe_damage":"40 70 100 130","LinkedSpecialBonus":"special_bonus_unique_beastmaster"},"05":{"var_type":"FIELD_FLOAT","duration":"12"},"06":{"var_type":"FIELD_INTEGER","damage_amp":"6 8 10 12","LinkedSpecialBonus":"special_bonus_unique_beastmaster_9"},"07":{"var_type":"FIELD_FLOAT","scepter_cooldown":"0","RequiresScepter":"1"},"08":{"var_type":"FIELD_FLOAT","min_throw_duration":"0.4"},"09":{"var_type":"FIELD_FLOAT","max_throw_duration":"1.0"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_beastmaster_wild_axes extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "beastmaster_wild_axes";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_beastmaster_wild_axes = Data_beastmaster_wild_axes ;
}
    