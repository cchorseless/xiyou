
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_aegis_custom = {"ID":"117","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","Model":"models/props_gameplay/aegis.vmdl","Effect":"particles/generic_gameplay/dropped_aegis.vpcf","FightRecapLevel":"2","ItemCost":"0","ItemShopTags":"","ItemQuality":"artifact","ItemPurchasable":"0","ItemDroppable":"0","ItemSellable":"0","ItemKillable":"1","ItemContributesToNetWorthWhenDropped":"0","AllowedInBackpack":"0","IsTempestDoubleClonable":"0","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","reincarnate_time":"5.0"},"02":{"var_type":"FIELD_FLOAT","disappear_time":"300.0"},"03":{"var_type":"FIELD_INTEGER","disappear_time_minutes_tooltip":"5"}}} ;

@registerAbility()
export class item_aegis_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_aegis";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_aegis_custom = Data_item_aegis_custom ;
};

    