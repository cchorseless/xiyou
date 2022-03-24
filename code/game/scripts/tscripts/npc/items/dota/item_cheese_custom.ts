
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_cheese_custom = {"ID":"33","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","Model":"models/props_gameplay/cheese.vmdl","FightRecapLevel":"2","AbilityCooldown":"40.0","ItemCost":"1000","ItemShopTags":"","ItemQuality":"consumable","ItemPurchasable":"0","ItemStackable":"1","ItemShareability":"ITEM_FULLY_SHAREABLE","ItemPermanent":"0","ItemInitialCharges":"1","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_TO_SPECTATORS","ItemContributesToNetWorthWhenDropped":"0","IsTempestDoubleClonable":"0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","health_restore":"2500"},"02":{"var_type":"FIELD_INTEGER","mana_restore":"1500"}}} ;

@registerAbility()
export class item_cheese_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_cheese";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_cheese_custom = Data_item_cheese_custom ;
};

    