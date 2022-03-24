
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_shivas_guard_custom = {"ID":"119","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL","FightRecapLevel":"1","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilityCooldown":"27","AbilityCastRange":"900","AbilityManaCost":"100","ItemCost":"4850","ItemShopTags":"int;armor;hard_to_tag","ItemQuality":"epic","ItemAliases":"shiva's guard;shivas","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","hp_regen_degen_aura":"25"},"01":{"var_type":"FIELD_INTEGER","bonus_intellect":"30"},"02":{"var_type":"FIELD_INTEGER","bonus_armor":"15"},"03":{"var_type":"FIELD_INTEGER","aura_radius":"1200"},"04":{"var_type":"FIELD_INTEGER","aura_attack_speed":"-45"},"05":{"var_type":"FIELD_INTEGER","blast_damage":"200"},"06":{"var_type":"FIELD_INTEGER","blast_movement_speed":"-40"},"07":{"var_type":"FIELD_FLOAT","blast_debuff_duration":"4.0"},"08":{"var_type":"FIELD_INTEGER","blast_radius":"900"},"09":{"var_type":"FIELD_INTEGER","blast_speed":"350"}}} ;

@registerAbility()
export class item_shivas_guard_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_shivas_guard";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_shivas_guard_custom = Data_item_shivas_guard_custom ;
};

    