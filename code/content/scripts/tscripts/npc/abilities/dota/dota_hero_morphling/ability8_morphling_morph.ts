
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_morphling_morph = {"ID":"5054","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_HIDDEN","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_attributes":"3 5 7 9"}}} ;

@registerAbility()
export class ability8_morphling_morph extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "morphling_morph";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_morphling_morph = Data_morphling_morph ;
}
    