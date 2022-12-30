
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_greater_faerie_fire_custom = {"ID":"299","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","ItemCost":"0","ItemIsNeutralDrop":"1","ItemQuality":"consumable","ItemPurchasable":"0","ItemInitialCharges":"3","ItemPermanent":"0","AbilityCooldown":"10.0","IsTempestDoubleClonable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_damage":"20"},"02":{"var_type":"FIELD_INTEGER","hp_restore":"250"}}} ;

@registerAbility()
export class item_greater_faerie_fire_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_greater_faerie_fire";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_greater_faerie_fire_custom = Data_item_greater_faerie_fire_custom ;
};

    