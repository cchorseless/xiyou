
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_poor_mans_shield_custom = {"ID":"71","Model":"models/props_gameplay/neutral_box.vmdl","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"0","ItemShopTags":"agi;block","ItemQuality":"common","ItemAliases":"pms;poor man's shield","ItemPurchasable":"0","ItemIsNeutralDrop":"1","DisplayOverheadAlertOnReceived":"0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_agility":"8"},"02":{"var_type":"FIELD_INTEGER","damage_block_melee":"30"},"03":{"var_type":"FIELD_INTEGER","damage_block_ranged":"20"},"04":{"var_type":"FIELD_INTEGER","block_chance":"50"},"05":{"var_type":"FIELD_INTEGER","block_chance_hero":"100"}}} ;

@registerAbility()
export class item_poor_mans_shield_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_poor_mans_shield";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_poor_mans_shield_custom = Data_item_poor_mans_shield_custom ;
};

    