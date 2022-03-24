
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_river_painter7_custom = {"ID":"1027","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT","IsObsolete":"1","AbilityCastRange":"200","AbilityCastPoint":"0.0","AbilityCooldown":"0.0","ItemCost":"0","ItemQuality":"component","ItemAliases":"paint","ItemStockMax":"1","ItemStockInitial":"1","ItemStackable":"1","ItemStockTime":"900.0","AssociatedConsumable":"17047","EventID":"14","PlayerSpecificCooldown":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","paint_duration":"900.0"}}} ;

@registerAbility()
export class item_river_painter7_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_river_painter7";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_river_painter7_custom = Data_item_river_painter7_custom ;
};

    