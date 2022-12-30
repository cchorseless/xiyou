
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_royal_jelly_custom = {"ID":"305","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK | DOTA_ABILITY_BEHAVIOR_SUPPRESS_ASSOCIATED_CONSUMABLE","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO","ItemCost":"0","ItemIsNeutralDrop":"1","ItemQuality":"consumable","ItemPurchasable":"0","ItemInitialCharges":"2","ItemPermanent":"0","IsTempestDoubleClonable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilityCastRange":"0","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","health_regen":"2.25"},"02":{"var_type":"FIELD_FLOAT","mana_regen":"1.25"}}} ;

@registerAbility()
export class item_royal_jelly_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_royal_jelly";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_royal_jelly_custom = Data_item_royal_jelly_custom ;
};

    