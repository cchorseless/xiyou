
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_blade_mail_custom = {"ID":"127","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilityCooldown":"25.0","AbilityManaCost":"25","ItemCost":"2125","ItemShopTags":"damage;armor;int;hard_to_tag","ItemQuality":"epic","ItemAliases":"bm;blade mail;blademail","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_damage":"28"},"02":{"var_type":"FIELD_INTEGER","bonus_armor":"6"},"03":{"var_type":"FIELD_INTEGER","bonus_intellect":"0"},"04":{"var_type":"FIELD_FLOAT","duration":"4.5"},"05":{"var_type":"FIELD_INTEGER","passive_reflection_constant":"20"},"06":{"var_type":"FIELD_INTEGER","passive_reflection_pct":"20"},"07":{"var_type":"FIELD_INTEGER","active_reflection_pct":"80"}}} ;

@registerAbility()
export class item_blade_mail_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_blade_mail";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_blade_mail_custom = Data_item_blade_mail_custom ;
};

    