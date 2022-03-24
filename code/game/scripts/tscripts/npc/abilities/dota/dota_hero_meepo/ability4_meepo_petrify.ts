
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_meepo_petrify = {"ID":"547","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_CHANNELLED | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES","MaxLevel":"1","FightRecapLevel":"1","IsGrantedByScepter":"1","HasScepterUpgrade":"1","AbilityCastPoint":"0","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_5","AbilityCooldown":"40","AbilityChannelTime":"0.75","AbilityManaCost":"150","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"4"},"02":{"var_type":"FIELD_INTEGER","hp_restore":"40"}}} ;

@registerAbility()
export class ability4_meepo_petrify extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "meepo_petrify";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_meepo_petrify = Data_meepo_petrify ;
}
    