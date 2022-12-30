
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_blades_of_attack_custom = {"ID":"2","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"450","ItemShopTags":"damage;tutorial","ItemQuality":"component","ItemAliases":"blades of attack","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_damage":"9"}}} ;

@registerAbility()
export class item_blades_of_attack_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_blades_of_attack";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_blades_of_attack_custom = Data_item_blades_of_attack_custom ;
};

    