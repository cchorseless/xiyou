
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_mutation_tombstone_custom = {"ID":"1028","AbilityName":"item_tombstone","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_CHANNELLED | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","Model":"models/props_gameplay/tombstoneb01.vmdl","PingOverrideText":"DOTA_Chat_Tombstone_Pinged","precache":{"particle_folder":"particles/units/heroes/hero_morphling"},"AbilityCastRange":"100","AbilityCastPoint":"0.0","ItemCost":"0","ItemPurchasable":"0","ItemShopTags":"consumable","ItemQuality":"consumable","ItemStackable":"1","ItemShareability":"ITEM_FULLY_SHAREABLE","ItemPermanent":"0","ItemInitialCharges":"1","ItemCastOnPickup":"1","ItemKillable":"0"} ;

@registerAbility()
export class item_mutation_tombstone_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_mutation_tombstone";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_mutation_tombstone_custom = Data_item_mutation_tombstone_custom ;
};

    