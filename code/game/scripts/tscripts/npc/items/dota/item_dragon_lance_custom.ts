
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_dragon_lance_custom = {"ID":"236","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"1900","ItemShopTags":"damage","ItemQuality":"artifact","ItemAliases":"dragon lance","ItemDisassembleRule":"DOTA_ITEM_DISASSEMBLE_ALWAYS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_agility":"16"},"02":{"var_type":"FIELD_INTEGER","bonus_strength":"12"},"03":{"var_type":"FIELD_INTEGER","base_attack_range":"140"}}} ;

@registerAbility()
export class item_dragon_lance_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_dragon_lance";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_dragon_lance_custom = Data_item_dragon_lance_custom ;
};

    