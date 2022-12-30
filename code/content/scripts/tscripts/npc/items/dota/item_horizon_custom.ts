
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_horizon_custom = {"ID":"312","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET |  DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_CUSTOM","AbilityUnitTargetType":"DOTA_UNIT_TARGET_CUSTOM","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","AbilityCastRange":"1600","AbilityCooldown":"10.0","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","knockback_distance":"250"},"02":{"var_type":"FIELD_FLOAT","knockback_duration":"1"}}} ;

@registerAbility()
export class item_horizon_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_horizon";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_horizon_custom = Data_item_horizon_custom ;
};

    