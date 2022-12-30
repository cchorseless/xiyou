
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_void_stone_custom = {"ID":"57","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"825","ItemShopTags":"regen_mana","ItemQuality":"component","ItemAliases":"void stone","SecretShop":"1","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","bonus_mana_regen":"2.25"}}} ;

@registerAbility()
export class item_void_stone_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_void_stone";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_void_stone_custom = Data_item_void_stone_custom ;
};

    