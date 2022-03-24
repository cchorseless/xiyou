
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_philosophers_stone_custom = {"ID":"290","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"0","ItemIsNeutralDrop":"1","DisplayOverheadAlertOnReceived":"0","ItemPurchasable":"0","Model":"models/props_gameplay/neutral_box.vmdl","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_gpm":"80"},"02":{"var_type":"FIELD_INTEGER","bonus_mana":"200"},"03":{"var_type":"FIELD_INTEGER","bonus_damage":"-30"}}} ;

@registerAbility()
export class item_philosophers_stone_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_philosophers_stone";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_philosophers_stone_custom = Data_item_philosophers_stone_custom ;
};

    