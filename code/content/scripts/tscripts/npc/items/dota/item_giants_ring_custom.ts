
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_giants_ring_custom = {"ID":"678","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_strength":"40"},"02":{"var_type":"FIELD_INTEGER","movement_speed":"60"},"03":{"var_type":"FIELD_INTEGER","model_scale":"60"},"04":{"var_type":"FIELD_INTEGER","pct_str_damage_per_second":"100"},"05":{"var_type":"FIELD_INTEGER","damage_radius":"100"}}} ;

@registerAbility()
export class item_giants_ring_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_giants_ring";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_giants_ring_custom = Data_item_giants_ring_custom ;
};

    