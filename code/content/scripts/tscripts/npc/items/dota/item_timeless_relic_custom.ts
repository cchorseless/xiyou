
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_timeless_relic_custom = {"ID":"300","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","debuff_amp":"25"},"02":{"var_type":"FIELD_INTEGER","spell_amp":"15"}}} ;

@registerAbility()
export class item_timeless_relic_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_timeless_relic";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_timeless_relic_custom = Data_item_timeless_relic_custom ;
};

    