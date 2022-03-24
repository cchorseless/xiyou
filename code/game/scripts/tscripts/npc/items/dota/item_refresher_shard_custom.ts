
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_refresher_shard_custom = {"ID":"260","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","FightRecapLevel":"2","Model":"models/props_gameplay/refresher_shard.vmdl","Effect":"particles/generic_gameplay/dropped_refresher_shard.vpcf","AbilityCooldown":"200.0","ItemCost":"1000","ItemShopTags":"","ItemQuality":"consumable","ItemPurchasable":"0","ItemStackable":"0","ItemShareability":"ITEM_FULLY_SHAREABLE","ItemPermanent":"0","ItemInitialCharges":"1","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_TO_SPECTATORS","ItemContributesToNetWorthWhenDropped":"0","IsTempestDoubleClonable":"0"} ;

@registerAbility()
export class item_refresher_shard_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_refresher_shard";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_refresher_shard_custom = Data_item_refresher_shard_custom ;
};

    