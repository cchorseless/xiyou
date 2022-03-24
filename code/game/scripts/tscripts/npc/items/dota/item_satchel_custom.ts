
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_satchel_custom = {"ID":"731","Model":"models/props_gameplay/neutral_box.vmdl","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"0","ItemShopTags":"agi;block","ItemQuality":"common","ItemPurchasable":"0","ItemIsNeutralDrop":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_all_stats":"5"},"02":{"var_type":"FIELD_INTEGER","xp_gain":"15"}}} ;

@registerAbility()
export class item_satchel_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_satchel";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_satchel_custom = Data_item_satchel_custom ;
};

    