
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_voodoo_mask_custom = {"ID":"473","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"700","ItemShopTags":"unique","ItemQuality":"component","ItemAliases":"voodoo mask;voom;vodo;vm","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","hero_lifesteal":"10"},"02":{"var_type":"FIELD_FLOAT","creep_lifesteal":"2"}}} ;

@registerAbility()
export class item_voodoo_mask_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_voodoo_mask";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_voodoo_mask_custom = Data_item_voodoo_mask_custom ;
};

    