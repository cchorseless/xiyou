
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_essence_ring_custom = {"ID":"359","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilityCooldown":"25.0","AbilityManaCost":"200","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_int":"6"},"02":{"var_type":"FIELD_FLOAT","mp_regen":"2.5"},"03":{"var_type":"FIELD_INTEGER","health_gain":"400"},"04":{"var_type":"FIELD_INTEGER","health_gain_duration":"15"}}} ;

@registerAbility()
export class item_essence_ring_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_essence_ring";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_essence_ring_custom = Data_item_essence_ring_custom ;
};

    