
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_grandmasters_glaive_custom = {"ID":"655","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","ItemCost":"5000","ItemShopTags":"attack_speed;move_speed;int;agi;str","ItemQuality":"common","ItemAliases":"power treads","ItemDeclarations":"DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","ItemDisassembleRule":"DOTA_ITEM_DISASSEMBLE_ALWAYS","ItemPurchasable":"0","IsObsolete":"1","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","yasha_movement_speed_percent_bonus":"8"},"11":{"var_type":"FIELD_INTEGER","bonus_damage":"25"},"12":{"var_type":"FIELD_INTEGER","bonus_strength":"10"},"13":{"var_type":"FIELD_INTEGER","bash_chance_melee":"25"},"14":{"var_type":"FIELD_INTEGER","bash_chance_ranged":"10"},"15":{"var_type":"FIELD_FLOAT","bash_duration":"1.5"},"16":{"var_type":"FIELD_FLOAT","bash_cooldown":"2.3"},"17":{"var_type":"FIELD_INTEGER","bonus_chance_damage":"100"},"18":{"var_type":"FIELD_INTEGER","str_stance":"10"},"19":{"var_type":"FIELD_INTEGER","agi_stance":"25"},"20":{"var_type":"FIELD_INTEGER","int_stance":"25"},"21":{"var_type":"FIELD_FLOAT","stance_bonus_duration":"6"},"01":{"var_type":"FIELD_INTEGER","sange_bonus_strength":"16"},"02":{"var_type":"FIELD_INTEGER","sange_status_resistance":"16"},"03":{"var_type":"FIELD_INTEGER","sange_hp_regen_amp":"24"},"04":{"var_type":"FIELD_INTEGER","kaya_bonus_intellect":"16"},"05":{"var_type":"FIELD_INTEGER","kaya_spell_amp":"8"},"06":{"var_type":"FIELD_INTEGER","kaya_mana_regen_multiplier":"24"},"07":{"var_type":"FIELD_INTEGER","kaya_magic_damage_attack":"14"},"08":{"var_type":"FIELD_INTEGER","yasha_bonus_agility":"16"},"09":{"var_type":"FIELD_INTEGER","yasha_bonus_attack_speed":"12"}}} ;

@registerAbility()
export class item_grandmasters_glaive_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_grandmasters_glaive";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_grandmasters_glaive_custom = Data_item_grandmasters_glaive_custom ;
};

    