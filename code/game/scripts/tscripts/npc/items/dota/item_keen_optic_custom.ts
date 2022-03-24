
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_keen_optic_custom = {"ID":"287","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","Model":"models/props_gameplay/neutral_box.vmdl","ItemCost":"0","ItemIsNeutralDrop":"1","DisplayOverheadAlertOnReceived":"0","ItemPurchasable":"0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","cast_range_bonus":"75"},"02":{"var_type":"FIELD_FLOAT","bonus_mana_regen":"1.25"}}} ;

@registerAbility()
export class item_keen_optic_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_keen_optic";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_keen_optic_custom = Data_item_keen_optic_custom ;
};

    