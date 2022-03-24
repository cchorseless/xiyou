
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_rattletrap_jetpack = {"ID":"630","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","MaxLevel":"1","FightRecapLevel":"1","IsGrantedByShard":"1","HasShardUpgrade":"1","AbilitySound":"Hero_Rattletrap.Battery_Assault_Impact","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"16","AbilityManaCost":"75","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_speed":"20"},"02":{"var_type":"FIELD_INTEGER","turn_rate":"75"},"03":{"var_type":"FIELD_INTEGER","height":"250"},"04":{"var_type":"FIELD_FLOAT","duration":"6"}}} ;

@registerAbility()
export class ability5_rattletrap_jetpack extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "rattletrap_jetpack";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_rattletrap_jetpack = Data_rattletrap_jetpack ;
}
    