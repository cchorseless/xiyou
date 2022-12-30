
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_enchanted_quiver_custom = {"ID":"361","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilityCooldown":"5.0","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_attack_range":"400"},"02":{"var_type":"FIELD_INTEGER","bonus_damage":"300"}}} ;

@registerAbility()
export class item_enchanted_quiver_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_enchanted_quiver";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_enchanted_quiver_custom = Data_item_enchanted_quiver_custom ;
};

    