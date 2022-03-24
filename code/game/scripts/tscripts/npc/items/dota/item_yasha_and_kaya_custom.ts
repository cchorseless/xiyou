
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_yasha_and_kaya_custom = {"ID":"277","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"4100","ItemShopTags":"damage;str;agi;attack_speed;unique","ItemQuality":"artifact","ItemAliases":"ynk;y&k;sk;yasha and kaya","ItemDisassembleRule":"DOTA_ITEM_DISASSEMBLE_ALWAYS","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_agility":"16"},"02":{"var_type":"FIELD_INTEGER","bonus_intellect":"16"},"03":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"12"},"04":{"var_type":"FIELD_INTEGER","mana_regen_multiplier":"50"},"05":{"var_type":"FIELD_INTEGER","movement_speed_percent_bonus":"10"},"06":{"var_type":"FIELD_INTEGER","spell_amp":"16"},"07":{"var_type":"FIELD_INTEGER","spell_lifesteal_amp":"30"}}} ;

@registerAbility()
export class item_yasha_and_kaya_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_yasha_and_kaya";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_yasha_and_kaya_custom = Data_item_yasha_and_kaya_custom ;
};

    