
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_lotus_orb_custom = {"ID":"226","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","FightRecapLevel":"1","AbilityCooldown":"15.0","AbilityCastRange":"900","AbilityManaCost":"175","ItemCost":"3850","ItemShopTags":"regen_health;regen_mana;str;agi;int;hard_to_tag","ItemQuality":"epic","ItemAliases":"ls;lotus orb","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ItemDisassembleRule":"DOTA_ITEM_DISASSEMBLE_ALWAYS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_armor":"10"},"02":{"var_type":"FIELD_FLOAT","bonus_health_regen":"6.5"},"03":{"var_type":"FIELD_FLOAT","bonus_mana_regen":"4.0"},"04":{"var_type":"FIELD_INTEGER","bonus_mana":"250"},"05":{"var_type":"FIELD_FLOAT","active_duration":"6"}}} ;

@registerAbility()
export class item_lotus_orb_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_lotus_orb";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_lotus_orb_custom = Data_item_lotus_orb_custom ;
};

    