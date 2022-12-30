
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_gladiator_helm_custom = {"ID":"576","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","damage":"18"},"02":{"var_type":"FIELD_INTEGER","armor":"5"},"03":{"var_type":"FIELD_INTEGER","movement_speed":"15"},"04":{"var_type":"FIELD_FLOAT","duration":"7"}}} ;

@registerAbility()
export class item_gladiator_helm_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_gladiator_helm";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_gladiator_helm_custom = Data_item_gladiator_helm_custom ;
};

    