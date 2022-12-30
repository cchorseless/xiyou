
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_ocean_heart_custom = {"ID":"354","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","all_stats":"5"},"02":{"var_type":"FIELD_FLOAT","water_hp_regen":"10"},"03":{"var_type":"FIELD_FLOAT","water_mp_regen":"5"}}} ;

@registerAbility()
export class item_ocean_heart_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_ocean_heart";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_ocean_heart_custom = Data_item_ocean_heart_custom ;
};

    