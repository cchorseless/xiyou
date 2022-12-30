
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_techies_focused_detonate = {"ID":"5635","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_UNRESTRICTED | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","AbilityCastRange":"0","AbilityCastAnimation":"ACT_INVALID","MaxLevel":"1","AbilityCooldown":"1.0 1.0 1.0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"700"}}} ;

@registerAbility()
export class ability4_techies_focused_detonate extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "techies_focused_detonate";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_techies_focused_detonate = Data_techies_focused_detonate ;
}
    