
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_repair_kit_custom = {"ID":"308","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK | DOTA_ABILITY_BEHAVIOR_SUPPRESS_ASSOCIATED_CONSUMABLE","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_BUILDING","ItemCost":"0","ItemIsNeutralDrop":"1","ItemQuality":"consumable","ItemPurchasable":"0","ItemInitialCharges":"3","ItemPermanent":"0","IsTempestDoubleClonable":"0","AbilityCooldown":"60.0","Model":"models/props_gameplay/neutral_box.vmdl","AbilityCastRange":"600","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"30"},"02":{"var_type":"FIELD_INTEGER","heal_percent":"40"},"03":{"var_type":"FIELD_INTEGER","armor_bonus":"10"},"04":{"var_type":"FIELD_INTEGER","hp_regen":"25"}}} ;

@registerAbility()
export class item_repair_kit_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_repair_kit";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_repair_kit_custom = Data_item_repair_kit_custom ;
};

    