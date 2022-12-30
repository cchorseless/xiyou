
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_spell_prism_custom = {"ID":"311","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_cooldown":"18"},"02":{"var_type":"FIELD_INTEGER","bonus_all_stats":"6"},"03":{"var_type":"FIELD_FLOAT","mana_regen":"4"}}} ;

@registerAbility()
export class item_spell_prism_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_spell_prism";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_spell_prism_custom = Data_item_spell_prism_custom ;
};

    