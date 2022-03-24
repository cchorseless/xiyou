
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_aghanims_shard_custom = {"ID":"609","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"1400","ItemShopTags":"int;str;agi;mana_pool;health_pool;hard_to_tag","ItemQuality":"rare","ItemAliases":"ags;shard;aghanim's shard;aghs","ItemPermanent":"0","ItemStockTime":"1","ItemStockInitial":"0","ItemStockMax":"1","ItemInitialStockTime":"1290.0","ItemInitialStockTimeTurbo":"645.0"} ;

@registerAbility()
export class item_aghanims_shard_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_aghanims_shard";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_aghanims_shard_custom = Data_item_aghanims_shard_custom ;
};

    