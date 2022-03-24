
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_warhammer_custom = {"ID":"674","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityCastRange":"750","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","AbilityCooldown":"20.0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_strength":"10"},"02":{"var_type":"FIELD_INTEGER","armor_reduction":"3"},"03":{"var_type":"FIELD_FLOAT","duration":"6"},"04":{"var_type":"FIELD_INTEGER","damage":"75"}}} ;

@registerAbility()
export class item_warhammer_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_warhammer";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_warhammer_custom = Data_item_warhammer_custom ;
};

    