
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_soul_booster_custom = {"ID":"129","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"3000","ItemShopTags":"regen_health;regen_mana;health_pool;mana_pool","ItemQuality":"epic","ItemAliases":"soul booster","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_health":"425"},"02":{"var_type":"FIELD_INTEGER","bonus_mana":"425"},"03":{"var_type":"FIELD_INTEGER","bonus_magical_armor":"0"}}} ;

@registerAbility()
export class item_soul_booster_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_soul_booster";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_soul_booster_custom = Data_item_soul_booster_custom ;
};

    