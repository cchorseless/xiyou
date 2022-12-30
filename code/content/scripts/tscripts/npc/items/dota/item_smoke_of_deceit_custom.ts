
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_smoke_of_deceit_custom = {"ID":"188","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","Model":"models/props_gameplay/smoke.vmdl","Effect":"particles/generic_gameplay/dropped_smoke.vpcf","FightRecapLevel":"1","AbilityCooldown":"1.0","AbilityCastRange":"1200","ItemCost":"50","ItemShopTags":"consumable","ItemQuality":"consumable","ItemAliases":"smoke of deceit","ItemStackable":"1","ItemShareability":"ITEM_FULLY_SHAREABLE","ItemPermanent":"0","ItemInitialCharges":"1","ItemDisplayCharges":"1","ItemStockMax":"2","ItemStockTime":"420.0","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_TO_SPECTATORS","ItemSupport":"1","ItemAlertable":"1","IsTempestDoubleClonable":"0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","application_radius":"1200"},"02":{"var_type":"FIELD_INTEGER","visibility_radius":"1025"},"03":{"var_type":"FIELD_INTEGER","bonus_movement_speed":"15"},"04":{"var_type":"FIELD_FLOAT","duration":"35.0"}}} ;

@registerAbility()
export class item_smoke_of_deceit_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_smoke_of_deceit";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_smoke_of_deceit_custom = Data_item_smoke_of_deceit_custom ;
};

    