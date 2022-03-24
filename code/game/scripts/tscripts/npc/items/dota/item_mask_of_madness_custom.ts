
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_mask_of_madness_custom = {"ID":"172","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL","FightRecapLevel":"1","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilityCooldown":"16.0","AbilityManaCost":"25","ItemCost":"1775","ItemShopTags":"unique;hard_to_tag","ItemQuality":"artifact","ItemAliases":"mom;mask of madness","ItemDisassembleRule":"DOTA_ITEM_DISASSEMBLE_ALWAYS","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_damage":"10"},"02":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"10"},"03":{"var_type":"FIELD_INTEGER","lifesteal_percent":"20"},"04":{"var_type":"FIELD_INTEGER","berserk_bonus_attack_speed":"110"},"05":{"var_type":"FIELD_INTEGER","berserk_bonus_movement_speed":"30"},"06":{"var_type":"FIELD_INTEGER","berserk_armor_reduction":"8"},"07":{"var_type":"FIELD_FLOAT","berserk_duration":"6.0"}}} ;

@registerAbility()
export class item_mask_of_madness_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_mask_of_madness";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_mask_of_madness_custom = Data_item_mask_of_madness_custom ;
};

    