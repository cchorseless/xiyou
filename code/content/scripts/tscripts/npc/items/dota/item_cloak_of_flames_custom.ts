
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_cloak_of_flames_custom = {"ID":"574","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","armor":"4"},"02":{"var_type":"FIELD_INTEGER","magic_resistance":"10"},"03":{"var_type":"FIELD_INTEGER","damage":"45"},"04":{"var_type":"FIELD_INTEGER","radius":"375"},"05":{"var_type":"FIELD_INTEGER","damage_illusions":"30"}}} ;

@registerAbility()
export class item_cloak_of_flames_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_cloak_of_flames";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_cloak_of_flames_custom = Data_item_cloak_of_flames_custom ;
};

    