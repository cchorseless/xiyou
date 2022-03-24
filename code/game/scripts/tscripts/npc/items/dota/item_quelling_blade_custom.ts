
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_quelling_blade_custom = {"ID":"11","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetType":"DOTA_UNIT_TARGET_TREE | DOTA_UNIT_TARGET_CUSTOM","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_CUSTOM","AbilityCastRange":"350","AbilityCastPoint":"0.0","AbilityCooldown":"4.0","Model":"models/props_gameplay/quelling_blade.vmdl","AbilityManaCost":"0","ItemCost":"130","ItemShopTags":"damage","ItemQuality":"component","ItemAliases":"qb;quelling blade","ShouldBeSuggested":"1","ShouldBeInitiallySuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","damage_bonus":"12"},"02":{"var_type":"FIELD_INTEGER","damage_bonus_ranged":"6"},"03":{"var_type":"FIELD_INTEGER","quelling_range_tooltip":"350"}}} ;

@registerAbility()
export class item_quelling_blade_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_quelling_blade";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_quelling_blade_custom = Data_item_quelling_blade_custom ;
};

    