
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_vanguard_custom = {"ID":"125","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"1825","ItemShopTags":"regen_health;block;health_pool","ItemQuality":"epic","ItemAliases":"vg;vanguard","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","ItemDisassembleRule":"DOTA_ITEM_DISASSEMBLE_ALWAYS","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_health":"250"},"02":{"var_type":"FIELD_FLOAT","bonus_health_regen":"7.0"},"03":{"var_type":"FIELD_INTEGER","block_damage_melee":"64"},"04":{"var_type":"FIELD_INTEGER","block_damage_ranged":"32"},"05":{"var_type":"FIELD_INTEGER","block_chance":"60"}}} ;

@registerAbility()
export class item_vanguard_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_vanguard";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_vanguard_custom = Data_item_vanguard_custom ;
};

    