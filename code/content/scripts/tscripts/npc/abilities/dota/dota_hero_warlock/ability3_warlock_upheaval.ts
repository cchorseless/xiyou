
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_warlock_upheaval = {"ID":"5164","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_CHANNELLED | DOTA_ABILITY_BEHAVIOR_AOE","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilitySound":"Hero_Warlock.Upheaval","AbilityCastPoint":"0.4","AbilityChannelTime":"10 12 14 16","AbilityCooldown":"50 46 42 38","AbilityDamage":"0 0 0 0","AbilityManaCost":"70 90 110 130","AbilityCastRange":"1200","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","aoe":"500 550 600 650"},"02":{"var_type":"FIELD_INTEGER","slow_per_second":"12 17 22 27"},"03":{"var_type":"FIELD_FLOAT","duration":"3.0"},"04":{"var_type":"FIELD_INTEGER","max_slow":"40 60 80 100"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_warlock_upheaval extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "warlock_upheaval";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_warlock_upheaval = Data_warlock_upheaval ;
}
    