
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_ballista_custom = {"ID":"367","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","attack_range_bonus":"250"},"02":{"var_type":"FIELD_INTEGER","knockback_distance":"50"},"03":{"var_type":"FIELD_FLOAT","knockback_duration":"0.2"},"04":{"var_type":"FIELD_INTEGER","bonus_damage":"50"}}} ;

@registerAbility()
export class item_ballista_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_ballista";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_ballista_custom = Data_item_ballista_custom ;
};

    