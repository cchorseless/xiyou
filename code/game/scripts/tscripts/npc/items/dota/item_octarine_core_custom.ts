
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_octarine_core_custom = {"ID":"235","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"5275","ItemShopTags":"move_speed;boost_mana;mana_pool","ItemQuality":"rare","ItemAliases":"mana;mb;octarine core","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_TO_SPECTATORS","ItemDisassembleRule":"DOTA_ITEM_DISASSEMBLE_ALWAYS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_cooldown":"25"},"02":{"var_type":"FIELD_INTEGER","cast_range_bonus":"225"},"03":{"var_type":"FIELD_INTEGER","bonus_health":"425"},"04":{"var_type":"FIELD_INTEGER","bonus_mana":"725"},"05":{"var_type":"FIELD_FLOAT","bonus_mana_regen":"3.0"}}} ;

@registerAbility()
export class item_octarine_core_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_octarine_core";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_octarine_core_custom = Data_item_octarine_core_custom ;
};

    