
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_troll_warlord_fervor = {"ID":"5511","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","SpellDispellableType":"SPELL_DISPELLABLE_NO","AbilityCastAnimation":"ACT_INVALID","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","attack_speed":"15 20 25 30","LinkedSpecialBonus":"special_bonus_unique_troll_warlord_5"},"02":{"var_type":"FIELD_INTEGER","max_stacks":"12","LinkedSpecialBonus":"special_bonus_unique_troll_warlord_2"}}} ;

@registerAbility()
export class ability4_troll_warlord_fervor extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "troll_warlord_fervor";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_troll_warlord_fervor = Data_troll_warlord_fervor ;
}
    