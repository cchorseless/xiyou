
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_stormcrafter_custom = {"ID":"585","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","AbilityCooldown":"25.0","AbilityManaCost":"50","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","range":"700"},"02":{"var_type":"FIELD_INTEGER","damage":"200"},"03":{"var_type":"FIELD_FLOAT","interval":"3"},"04":{"var_type":"FIELD_INTEGER","slow":"40"},"05":{"var_type":"FIELD_FLOAT","slow_duration":"0.3"},"06":{"var_type":"FIELD_FLOAT","cyclone_duration":"0.75"},"07":{"var_type":"FIELD_FLOAT","bonus_mana_regen":"4"}}} ;

@registerAbility()
export class item_stormcrafter_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_stormcrafter";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_stormcrafter_custom = Data_item_stormcrafter_custom ;
};

    