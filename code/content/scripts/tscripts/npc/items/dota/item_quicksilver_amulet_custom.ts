
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_quicksilver_amulet_custom = {"ID":"686","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","base_movement":"4"},"02":{"var_type":"FIELD_INTEGER","base_attack":"10"},"03":{"var_type":"FIELD_INTEGER","bonus_movement":"4"},"04":{"var_type":"FIELD_INTEGER","bonus_attack":"20"},"05":{"var_type":"FIELD_INTEGER","anim_increase":"40"},"06":{"var_type":"FIELD_INTEGER","projectile_increase":"40"}}} ;

@registerAbility()
export class item_quicksilver_amulet_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_quicksilver_amulet";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_quicksilver_amulet_custom = Data_item_quicksilver_amulet_custom ;
};

    