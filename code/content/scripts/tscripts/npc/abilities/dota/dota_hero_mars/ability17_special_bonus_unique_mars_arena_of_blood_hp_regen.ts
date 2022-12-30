
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_special_bonus_unique_mars_arena_of_blood_hp_regen = {"ID":"6766","AbilityType":"DOTA_ABILITY_TYPE_ATTRIBUTES","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","value":"180","ad_linked_ability":"mars_arena_of_blood"}}} ;

@registerAbility()
export class ability17_special_bonus_unique_mars_arena_of_blood_hp_regen extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "special_bonus_unique_mars_arena_of_blood_hp_regen";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_special_bonus_unique_mars_arena_of_blood_hp_regen = Data_special_bonus_unique_mars_arena_of_blood_hp_regen ;
}
    