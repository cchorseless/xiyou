
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_dragon_scale_custom = {"ID":"358","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_armor":"5"},"02":{"var_type":"FIELD_INTEGER","bonus_hp_regen":"5"},"03":{"var_type":"FIELD_INTEGER","damage_per_sec":"18"},"04":{"var_type":"FIELD_FLOAT","duration":"3"}}} ;

@registerAbility()
export class item_dragon_scale_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_dragon_scale";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_dragon_scale_custom = Data_item_dragon_scale_custom ;
};

    