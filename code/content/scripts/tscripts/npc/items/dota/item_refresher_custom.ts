
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_refresher_custom = {"ID":"110","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilityCastPoint":"0.0","AbilityCooldown":"160.0","AbilityManaCost":"300","ItemCost":"5000","ItemShopTags":"regen_health;regen_mana;hard_to_tag","ItemQuality":"rare","ItemAliases":"refresher orb","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_health_regen":"13"},"02":{"var_type":"FIELD_FLOAT","bonus_mana_regen":"12.0"}}} ;

@registerAbility()
export class item_refresher_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_refresher";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_refresher_custom = Data_item_refresher_custom ;
};

    