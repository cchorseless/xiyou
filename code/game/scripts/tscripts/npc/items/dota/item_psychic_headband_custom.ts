
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_psychic_headband_custom = {"ID":"675","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityCastRange":"800","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","AbilityCooldown":"20.0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","intelligence_pct":"16"},"02":{"var_type":"FIELD_INTEGER","cast_range":"100"},"03":{"var_type":"FIELD_INTEGER","push_length":"400"},"04":{"var_type":"FIELD_FLOAT","push_duration":"0.3"}}} ;

@registerAbility()
export class item_psychic_headband_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_psychic_headband";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_psychic_headband_custom = Data_item_psychic_headband_custom ;
};

    