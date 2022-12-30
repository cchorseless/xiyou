
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_trusty_shovel_custom = {"ID":"356","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_CHANNELLED | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","AbilityCastAnimation":"ACT_DOTA_GENERIC_CHANNEL_1","AbilityCastRange":"250","AbilityCooldown":"55.0","AbilityCastPoint":"0.1","AbilityChannelTime":"1","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_health":"100"}}} ;

@registerAbility()
export class item_trusty_shovel_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_trusty_shovel";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_trusty_shovel_custom = Data_item_trusty_shovel_custom ;
};

    