
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_weaver_shukuchi = {"ID":"5290","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","AbilitySound":"Hero_Weaver.Shukuchi","AbilityCastPoint":"0 0 0 0","AbilityCooldown":"12.0 10.0 8.0 6.0","AbilityManaCost":"70","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","damage":"100 125 150 175","LinkedSpecialBonus":"special_bonus_unique_weaver_1"},"02":{"var_type":"FIELD_INTEGER","speed":"200 230 260 290","LinkedSpecialBonus":"special_bonus_unique_weaver_2"},"03":{"var_type":"FIELD_INTEGER","radius":"175 175 175 175"},"04":{"var_type":"FIELD_FLOAT","fade_time":"0.25 0.25 0.25 0.25"},"05":{"var_type":"FIELD_FLOAT","duration":"4.0 4.0 4.0 4.0"},"06":{"var_type":"FIELD_INTEGER","AbilityCharges":"","LinkedSpecialBonus":"special_bonus_unique_weaver_6"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_weaver_shukuchi extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "weaver_shukuchi";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_weaver_shukuchi = Data_weaver_shukuchi ;
}
    