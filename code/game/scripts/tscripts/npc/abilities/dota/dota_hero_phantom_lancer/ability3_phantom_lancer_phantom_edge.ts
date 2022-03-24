
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_phantom_lancer_phantom_edge = {"ID":"5068","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_TOGGLE","AbilitySound":"Hero_PhantomLancer.PhantomEdge","SpellDispellableType":"SPELL_DISPELLABLE_YES","HasScepterUpgrade":"0","AbilityCooldown":"16 12 8 4","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","min_distance":"200"},"02":{"var_type":"FIELD_INTEGER","max_distance":"600 675 750 825","LinkedSpecialBonus":"special_bonus_unique_phantom_lancer"},"03":{"var_type":"FIELD_INTEGER","bonus_speed":"800"},"04":{"var_type":"FIELD_INTEGER","bonus_agility":"10 20 30 40"},"05":{"var_type":"FIELD_FLOAT","agility_duration":"1.5"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_phantom_lancer_phantom_edge extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "phantom_lancer_phantom_edge";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_phantom_lancer_phantom_edge = Data_phantom_lancer_phantom_edge ;
}
    