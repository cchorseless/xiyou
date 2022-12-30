
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_vengeances_shadow_custom = {"ID":"679","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_health":"500"},"02":{"var_type":"FIELD_INTEGER","damage_return":"20"},"03":{"var_type":"FIELD_FLOAT","illusion_duration":"30"},"04":{"var_type":"FIELD_INTEGER","illusion_outgoing_damage":"100"},"05":{"var_type":"FIELD_INTEGER","illusion_incoming_damage":"150"}}} ;

@registerAbility()
export class item_vengeances_shadow_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_vengeances_shadow";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_vengeances_shadow_custom = Data_item_vengeances_shadow_custom ;
};

    