
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_aeon_disk_custom = { "ID": "256", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilityCooldown": "105.0", "ItemCost": "3000", "ItemShopTags": "str;regen_health;health_pool", "ItemQuality": "epic", "ItemAliases": "ad;aeon disk", "ItemDeclarations": "DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_TO_SPECTATORS | DECLARE_PURCHASES_IN_SPEECH", "ShouldBeSuggested": "1", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "bonus_health": "300" }, "02": { "var_type": "FIELD_INTEGER", "bonus_mana": "300" }, "03": { "var_type": "FIELD_INTEGER", "health_threshold_pct": "70" }, "04": { "var_type": "FIELD_INTEGER", "status_resistance": "75" }, "05": { "var_type": "FIELD_FLOAT", "buff_duration": "2.5" } } };

@registerAbility()
export class item_aeon_disk_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_aeon_disk";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_aeon_disk_custom = Data_item_aeon_disk_custom;

};

