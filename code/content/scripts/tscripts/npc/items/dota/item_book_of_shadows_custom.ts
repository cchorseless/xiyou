
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_book_of_shadows_custom = {"ID":"677","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_BOTH","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","AbilityCastRange":"700","AbilityCooldown":"8.0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_all_stats":"12"},"02":{"var_type":"FIELD_INTEGER","night_vision":"400"},"03":{"var_type":"FIELD_FLOAT","duration":"4"}}} ;

@registerAbility()
export class item_book_of_shadows_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_book_of_shadows";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_book_of_shadows_custom = Data_item_book_of_shadows_custom ;
};

    