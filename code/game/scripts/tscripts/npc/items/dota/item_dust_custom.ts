
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_dust_custom = {"ID":"40","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET","Model":"models/props_gameplay/dust.vmdl","Effect":"particles/generic_gameplay/dropped_dust.vpcf","AbilityCooldown":"30.0","AbilityCastRange":"1050","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilityManaCost":"0","ItemCost":"80","ItemShopTags":"consumable","ItemQuality":"consumable","ItemAliases":"dust of appearance","ItemStackable":"1","ItemShareability":"ITEM_FULLY_SHAREABLE","ItemPermanent":"0","ItemInitialCharges":"1","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES","ItemSupport":"1","IsTempestDoubleClonable":"0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","duration":"12"},"02":{"var_type":"FIELD_INTEGER","radius":"1050"},"03":{"var_type":"FIELD_INTEGER","movespeed":"-20"}}} ;

@registerAbility()
export class item_dust_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_dust";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_dust_custom = Data_item_dust_custom ;
};

    