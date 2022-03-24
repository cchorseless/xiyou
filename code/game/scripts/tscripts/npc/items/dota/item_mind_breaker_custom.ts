
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_mind_breaker_custom = {"ID":"309","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","AbilityCooldown":"12.0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","magic_damage":"25"},"02":{"var_type":"FIELD_INTEGER","attack_speed":"25"},"03":{"var_type":"FIELD_FLOAT","duration":"1.75"}}} ;

@registerAbility()
export class item_mind_breaker_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_mind_breaker";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_mind_breaker_custom = Data_item_mind_breaker_custom ;
};

    