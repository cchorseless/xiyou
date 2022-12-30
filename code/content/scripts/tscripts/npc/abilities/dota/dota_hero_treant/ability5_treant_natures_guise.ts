
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_treant_natures_guise = {"ID":"5434","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","FightRecapLevel":"2","MaxLevel":"1","AbilitySound":"Hero_Treant.NaturesGuise.On","HasShardUpgrade":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"150"},"02":{"var_type":"FIELD_FLOAT","grace_time":"0.75"},"03":{"var_type":"FIELD_FLOAT","cooldown_time":"3"},"04":{"var_type":"FIELD_INTEGER","regen_amp":"40"},"05":{"var_type":"FIELD_INTEGER","movement_bonus":"15"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability5_treant_natures_guise extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "treant_natures_guise";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_treant_natures_guise = Data_treant_natures_guise ;
}
    