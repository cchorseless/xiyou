
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_trickster_cloak_custom = {"ID":"571","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","AbilityCooldown":"25.0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","evasion":"20"},"02":{"var_type":"FIELD_INTEGER","magic_resistance":"20"},"03":{"var_type":"FIELD_FLOAT","duration":"6"}}} ;

@registerAbility()
export class item_trickster_cloak_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_trickster_cloak";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_trickster_cloak_custom = Data_item_trickster_cloak_custom ;
};

    