
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_rubick_arcane_supremacy = {"ID":"7320","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","cast_range":"100 150 200 250"},"02":{"var_type":"FIELD_INTEGER","spell_amp":"14 18 22 26"}}} ;

@registerAbility()
export class ability3_rubick_arcane_supremacy extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "rubick_arcane_supremacy";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_rubick_arcane_supremacy = Data_rubick_arcane_supremacy ;
}
    