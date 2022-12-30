
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_vambrace_custom = {"ID":"331","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","ItemCost":"0","ItemShopTags":"damage;int;agi;str","ItemQuality":"common","ItemAliases":"bracer","ItemIsNeutralDrop":"1","ItemShareability":"ITEM_FULLY_SHAREABLE","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_primary_stat":"10"},"02":{"var_type":"FIELD_INTEGER","bonus_secondary_stat":"5"},"03":{"var_type":"FIELD_INTEGER","bonus_spell_amp":"6"},"04":{"var_type":"FIELD_INTEGER","bonus_magic_resistance":"10"},"05":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"10"}}} ;

@registerAbility()
export class item_vambrace_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_vambrace";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_vambrace_custom = Data_item_vambrace_custom ;
};

    