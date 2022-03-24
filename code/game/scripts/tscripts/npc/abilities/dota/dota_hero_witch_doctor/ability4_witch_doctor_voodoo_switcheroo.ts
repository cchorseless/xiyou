
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_witch_doctor_voodoo_switcheroo = {"ID":"632","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","MaxLevel":"1","IsGrantedByShard":"1","HasShardUpgrade":"1","AbilityCastPoint":"0.1","AbilityCooldown":"70","AbilityManaCost":"250","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"2"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability4_witch_doctor_voodoo_switcheroo extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "witch_doctor_voodoo_switcheroo";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_witch_doctor_voodoo_switcheroo = Data_witch_doctor_voodoo_switcheroo ;
}
    