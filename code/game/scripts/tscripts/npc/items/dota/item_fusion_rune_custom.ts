
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_fusion_rune_custom = {"ID":"313","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK | DOTA_ABILITY_BEHAVIOR_SUPPRESS_ASSOCIATED_CONSUMABLE","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","ItemInitialCharges":"3","ItemPermanent":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilityCooldown":"120.0","AbilityCastRange":"250","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"50"}}} ;

@registerAbility()
export class item_fusion_rune_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_fusion_rune";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_fusion_rune_custom = Data_item_fusion_rune_custom ;
};

    