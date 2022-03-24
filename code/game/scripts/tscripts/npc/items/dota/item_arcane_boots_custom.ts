
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_arcane_boots_custom = {"ID":"180","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilityCooldown":"55.0","AbilityCastRange":"1200","AbilityManaCost":"0","ItemCost":"1300","ItemShopTags":"move_speed;boost_mana;mana_pool","ItemQuality":"rare","ItemAliases":"mana;mb;arcane boots","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_TO_SPECTATORS","ItemDisassembleRule":"DOTA_ITEM_DISASSEMBLE_ALWAYS","ItemAlertable":"1","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_movement":"45"},"02":{"var_type":"FIELD_INTEGER","bonus_mana":"250"},"03":{"var_type":"FIELD_INTEGER","replenish_amount":"160"},"04":{"var_type":"FIELD_INTEGER","replenish_radius":"1200"}}} ;

@registerAbility()
export class item_arcane_boots_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_arcane_boots";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_arcane_boots_custom = Data_item_arcane_boots_custom ;
};

    