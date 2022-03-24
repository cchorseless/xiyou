
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_arcane_ring_custom = {"ID":"349","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilityCooldown":"45.0","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_intelligence":"10"},"02":{"var_type":"FIELD_INTEGER","bonus_armor":"2"},"03":{"var_type":"FIELD_INTEGER","mana_restore":"75"},"04":{"var_type":"FIELD_INTEGER","radius":"1200"}}} ;

@registerAbility()
export class item_arcane_ring_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_arcane_ring";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_arcane_ring_custom = Data_item_arcane_ring_custom ;
};

    