
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_panic_button_custom = {"ID":"365","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilityCooldown":"75.0","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_health":"300"},"02":{"var_type":"FIELD_INTEGER","heal":"300"},"03":{"var_type":"FIELD_FLOAT","health_threshold":"20"}}} ;

@registerAbility()
export class item_panic_button_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_panic_button";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_panic_button_custom = Data_item_panic_button_custom ;
};

    