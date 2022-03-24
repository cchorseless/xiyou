
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_demonicon_custom = {"ID":"370","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilityCooldown":"80.0","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_strength":"30"},"02":{"var_type":"FIELD_INTEGER","bonus_intellect":"30"},"03":{"var_type":"FIELD_FLOAT","summon_duration":"75"}}} ;

@registerAbility()
export class item_demonicon_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_demonicon";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_demonicon_custom = Data_item_demonicon_custom ;
};

    