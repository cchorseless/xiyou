
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_imp_claw_custom = {"ID":"334","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilityCooldown":"7.0","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","crit_multiplier":"130"},"02":{"var_type":"FIELD_INTEGER","bonus_damage":"26"}}} ;

@registerAbility()
export class item_imp_claw_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_imp_claw";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_imp_claw_custom = Data_item_imp_claw_custom ;
};

    