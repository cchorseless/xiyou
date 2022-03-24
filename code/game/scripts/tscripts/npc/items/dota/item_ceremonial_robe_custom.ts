
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_ceremonial_robe_custom = {"ID":"676","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_mana":"350"},"02":{"var_type":"FIELD_INTEGER","aura_radius":"1200"},"03":{"var_type":"FIELD_INTEGER","status_resistance":"10"},"04":{"var_type":"FIELD_INTEGER","magic_resistance":"10"}}} ;

@registerAbility()
export class item_ceremonial_robe_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_ceremonial_robe";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_ceremonial_robe_custom = Data_item_ceremonial_robe_custom ;
};

    