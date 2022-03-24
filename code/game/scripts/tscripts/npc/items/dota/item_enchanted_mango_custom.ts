
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_enchanted_mango_custom = {"ID":"216","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_OPTIONAL_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK | DOTA_ABILITY_BEHAVIOR_SUPPRESS_ASSOCIATED_CONSUMABLE","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","Model":"models/props_gameplay/mango.vmdl","AbilityCastRange":"400","AbilityCastPoint":"0.0","ItemCost":"70","ItemShopTags":"consumable","ItemQuality":"consumable","ItemAliases":"enchanted mango","ItemStackable":"1","ItemStackableMax":"3","ItemInitialCharges":"1","ItemPermanent":"0","IsTempestDoubleClonable":"0","ShouldBeInitiallySuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","hp_regen":"0.6"},"02":{"var_type":"FIELD_INTEGER","replenish_amount":"100"}}} ;

@registerAbility()
export class item_enchanted_mango_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_enchanted_mango";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_enchanted_mango_custom = Data_item_enchanted_mango_custom ;
};

    