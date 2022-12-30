
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_headdress_custom = {"ID":"94","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"425","ItemShopTags":"str;int;agi;regen_health","ItemQuality":"rare","ItemAliases":"headdress","AbilityCastRange":"1200","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","health_regen":"0.5"},"02":{"var_type":"FIELD_FLOAT","aura_health_regen":"2.0"},"03":{"var_type":"FIELD_INTEGER","aura_radius":"1200"}}} ;

@registerAbility()
export class item_headdress_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_headdress";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_headdress_custom = Data_item_headdress_custom ;
};

    