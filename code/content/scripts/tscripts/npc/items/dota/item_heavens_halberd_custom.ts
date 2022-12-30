
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_heavens_halberd_custom = {"ID":"210","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","FightRecapLevel":"1","AbilityCooldown":"18","AbilityCastRange":"600","AbilityCastPoint":"0.0","AbilityManaCost":"100","ItemCost":"3550","ItemShopTags":"str;damage;evasion","ItemQuality":"artifact","ItemAliases":"heaven's halberd","ItemDisassembleRule":"DOTA_ITEM_DISASSEMBLE_ALWAYS","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_evasion":"20"},"02":{"var_type":"FIELD_INTEGER","bonus_strength":"20"},"03":{"var_type":"FIELD_FLOAT","disarm_range":"5.0"},"04":{"var_type":"FIELD_FLOAT","disarm_melee":"3.0"},"05":{"var_type":"FIELD_INTEGER","status_resistance":"16"},"06":{"var_type":"FIELD_INTEGER","hp_regen_amp":"20"}}} ;

@registerAbility()
export class item_heavens_halberd_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_heavens_halberd";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_heavens_halberd_custom = Data_item_heavens_halberd_custom ;
};

    