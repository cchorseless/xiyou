
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_kaya_and_sange_custom = {"ID":"273","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"4100","ItemShopTags":"damage;str;agi;attack_speed;unique","ItemQuality":"artifact","ItemAliases":"snk;s&k;sk;sange and kaya","ItemDisassembleRule":"DOTA_ITEM_DISASSEMBLE_ALWAYS","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_strength":"16"},"02":{"var_type":"FIELD_INTEGER","bonus_intellect":"16"},"03":{"var_type":"FIELD_INTEGER","status_resistance":"25"},"04":{"var_type":"FIELD_INTEGER","mana_regen_multiplier":"50"},"05":{"var_type":"FIELD_INTEGER","spell_amp":"16"},"06":{"var_type":"FIELD_INTEGER","hp_regen_amp":"22"},"07":{"var_type":"FIELD_INTEGER","spell_lifesteal_amp":"30"}}} ;

@registerAbility()
export class item_kaya_and_sange_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_kaya_and_sange";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_kaya_and_sange_custom = Data_item_kaya_and_sange_custom ;
};

    