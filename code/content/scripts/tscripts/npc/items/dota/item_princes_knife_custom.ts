
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_princes_knife_custom = {"ID":"325","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilityCooldown":"10.0","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"1.5"},"02":{"var_type":"FIELD_INTEGER","movespeed":"140"},"03":{"var_type":"FIELD_INTEGER","projectile_bonus":"60"}}} ;

@registerAbility()
export class item_princes_knife_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_princes_knife";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_princes_knife_custom = Data_item_princes_knife_custom ;
};

    