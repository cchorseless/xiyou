
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_ninja_gear_custom = {"ID":"362","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilityCooldown":"45.0","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_agility":"24"},"02":{"var_type":"FIELD_INTEGER","passive_movement_bonus":"25"},"03":{"var_type":"FIELD_INTEGER","visibility_radius":"1025"},"04":{"var_type":"FIELD_FLOAT","duration":"35.0"},"05":{"var_type":"FIELD_INTEGER","bonus_movement_speed":"15"}}} ;

@registerAbility()
export class item_ninja_gear_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_ninja_gear";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_ninja_gear_custom = Data_item_ninja_gear_custom ;
};

    