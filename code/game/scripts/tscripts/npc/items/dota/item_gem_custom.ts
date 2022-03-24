
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_gem_custom = {"ID":"30","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilityCastRange":"900","Model":"models/props_gameplay/gem01.vmdl","Effect":"particles/generic_gameplay/dropped_gem.vpcf","ItemCost":"900","ItemShopTags":"see_invis","ItemQuality":"component","ItemAliases":"gem of true sight","ItemSellable":"0","ItemInitiallySellable":"1","ItemShareability":"ITEM_FULLY_SHAREABLE","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_TO_SPECTATORS","ItemStockMax":"1","ItemStockTime":"600.0","ItemSupport":"1","ItemKillable":"0","ItemContributesToNetWorthWhenDropped":"0","AllowedInBackpack":"0","IsTempestDoubleClonable":"0","UIPickupSound":"Item.PickUpGemShop","UIDropSound":"Item.DropGemShop","WorldDropSound":"Item.DropGemWorld","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"900"}}} ;

@registerAbility()
export class item_gem_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_gem";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_gem_custom = Data_item_gem_custom ;
};

    