
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_third_eye_custom = {"ID":"310","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","ItemInitialCharges":"3","ItemPermanent":"0","IsTempestDoubleClonable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","truesight_radius":"500"},"02":{"var_type":"FIELD_INTEGER","bonus_vision":"300"},"03":{"var_type":"FIELD_INTEGER","bonus_all_stats":"7"}}} ;

@registerAbility()
export class item_third_eye_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_third_eye";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_third_eye_custom = Data_item_third_eye_custom ;
};

    