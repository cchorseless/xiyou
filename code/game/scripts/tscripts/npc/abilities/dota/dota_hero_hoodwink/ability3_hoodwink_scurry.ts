
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_hoodwink_scurry = {"ID":"9501","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE","AbilityCastPoint":"0.0","AbilityCastRange":"275","AbilityCooldown":"0.0","AbilityCharges":"2","AbilityChargeRestoreTime":"30 24 18 12","AbilityManaCost":"35","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"275"},"02":{"var_type":"FIELD_INTEGER","movement_speed_pct":"20 25 30 35"},"03":{"var_type":"FIELD_FLOAT","duration":"4.0"},"04":{"var_type":"FIELD_INTEGER","evasion":"8 16 24 32"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_hoodwink_scurry extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "hoodwink_scurry";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_hoodwink_scurry = Data_hoodwink_scurry ;
}
    