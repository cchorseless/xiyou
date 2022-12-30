
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_orb_of_corrosion_custom = {"ID":"569","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"925","ItemShopTags":"hard_to_tag","ItemQuality":"rare","ItemAliases":"ooc;orb of corrosion;corosion;corossion","ShouldBeInitiallySuggested":"1","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","armor":"3"},"02":{"var_type":"FIELD_INTEGER","slow_melee":"13"},"03":{"var_type":"FIELD_INTEGER","slow_range":"4"},"04":{"var_type":"FIELD_INTEGER","damage":"3"},"05":{"var_type":"FIELD_FLOAT","duration":"3"},"06":{"var_type":"FIELD_INTEGER","health_bonus":"150"}}} ;

@registerAbility()
export class item_orb_of_corrosion_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_orb_of_corrosion";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_orb_of_corrosion_custom = Data_item_orb_of_corrosion_custom ;
};

    