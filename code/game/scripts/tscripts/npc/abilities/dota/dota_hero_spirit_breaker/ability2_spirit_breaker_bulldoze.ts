
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_spirit_breaker_bulldoze = {"ID":"7301","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_Spirit_Breaker.EmpoweringHaste.Cast","AbilityCooldown":"22 20 18 16","AbilityManaCost":"30 40 50 60","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","movement_speed":"10 16 22 28"},"02":{"var_type":"FIELD_INTEGER","status_resistance":"34 46 58 70"},"03":{"var_type":"FIELD_FLOAT","duration":"8"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2","AbilityCastGestureSlot":"DEFAULT"} ;

@registerAbility()
export class ability2_spirit_breaker_bulldoze extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "spirit_breaker_bulldoze";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_spirit_breaker_bulldoze = Data_spirit_breaker_bulldoze ;
}
    