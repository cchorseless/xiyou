
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_ancient_perseverance_custom = {"ID":"578","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"0","ItemIsNeutralDrop":"1","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","damage":"10"},"02":{"var_type":"FIELD_INTEGER","hp_regen":"7"},"03":{"var_type":"FIELD_INTEGER","mana_regen_amp":"50"}}} ;

@registerAbility()
export class item_ancient_perseverance_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_ancient_perseverance";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_ancient_perseverance_custom = Data_item_ancient_perseverance_custom ;
};

    