
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_special_bonus_unique_hoodwink_sharpshooter_pure_damage = {"ID":"9507","AbilityType":"DOTA_ABILITY_TYPE_ATTRIBUTES","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","value":"0","ad_linked_ability":"hoodwink_sharpshooter"}}} ;

@registerAbility()
export class ability17_special_bonus_unique_hoodwink_sharpshooter_pure_damage extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "special_bonus_unique_hoodwink_sharpshooter_pure_damage";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_special_bonus_unique_hoodwink_sharpshooter_pure_damage = Data_special_bonus_unique_hoodwink_sharpshooter_pure_damage ;
}
    