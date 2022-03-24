
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_satanic_custom = {"ID":"156","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","FightRecapLevel":"2","SpellDispellableType":"SPELL_DISPELLABLE_NO","AbilityCooldown":"25.0","ItemCost":"5050","ItemShopTags":"damage;str;armor;unique;hard_to_tag","ItemQuality":"artifact","ItemAliases":"satanic","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_strength":"25"},"02":{"var_type":"FIELD_INTEGER","bonus_damage":"55"},"04":{"var_type":"FIELD_INTEGER","lifesteal_percent":"25"},"05":{"var_type":"FIELD_INTEGER","unholy_lifesteal_percent":"175"},"06":{"var_type":"FIELD_INTEGER","unholy_lifesteal_total_tooltip":"200"},"07":{"var_type":"FIELD_FLOAT","unholy_duration":"6.0"}}} ;

@registerAbility()
export class item_satanic_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_satanic";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_satanic_custom = Data_item_satanic_custom ;
};

    