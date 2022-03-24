
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_echo_sabre_custom = {"ID":"252","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","FightRecapLevel":"1","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilityCastPoint":"0.0","AbilityCooldown":"5.0","AbilitySharedCooldown":"echo_sabre","AbilityManaCost":"0","ItemCost":"2500","ItemShopTags":"int;attack_speed;damage;regen_mana;damage;hard_to_tag","ItemQuality":"artifact","ItemAliases":"echo sabre","ItemDisassembleRule":"DOTA_ITEM_DISASSEMBLE_ALWAYS","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_damage":"15"},"02":{"var_type":"FIELD_INTEGER","bonus_strength":"15"},"03":{"var_type":"FIELD_INTEGER","bonus_intellect":"10"},"04":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"10"},"05":{"var_type":"FIELD_FLOAT","bonus_mana_regen":"2.25"},"06":{"var_type":"FIELD_INTEGER","movement_slow":"100"},"07":{"var_type":"FIELD_INTEGER","attack_speed_slow":"0"},"08":{"var_type":"FIELD_FLOAT","slow_duration":"0.8"}}} ;

@registerAbility()
export class item_echo_sabre_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_echo_sabre";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_echo_sabre_custom = Data_item_echo_sabre_custom ;
};

    