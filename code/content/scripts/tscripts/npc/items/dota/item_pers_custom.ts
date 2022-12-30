
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_pers_custom = {"ID":"69","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"1650","ItemShopTags":"regen_health;regen_mana","ItemQuality":"common","ItemAliases":"perseverance","ItemDisassembleRule":"DOTA_ITEM_DISASSEMBLE_ALWAYS","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","bonus_health_regen":"6.5"},"02":{"var_type":"FIELD_FLOAT","bonus_mana_regen":"2.25"}}} ;

@registerAbility()
export class item_pers_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_pers";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_pers_custom = Data_item_pers_custom ;
};

    