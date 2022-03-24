
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_tome_of_knowledge_custom = {"ID":"257","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","FightRecapLevel":"1","ItemCost":"75","ItemShopTags":"consumable","ItemQuality":"consumable","ItemAliases":"tome of knowledge","ItemStackable":"0","ItemShareability":"ITEM_FULLY_SHAREABLE","AbilitySharedCooldown":"tome","ItemPermanent":"0","ItemInitialCharges":"1","ItemDisplayCharges":"1","ItemStockMax":"3","ItemStockInitial":"0","ItemStockTime":"600.0","ItemInitialStockTime":"690.0","BonusDelayedStockCount":"0","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_TO_SPECTATORS","ItemSupport":"1","IsTempestDoubleClonable":"0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","xp_bonus":"700"},"02":{"var_type":"FIELD_INTEGER","xp_per_use":"135"}}} ;

@registerAbility()
export class item_tome_of_knowledge_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_tome_of_knowledge";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_tome_of_knowledge_custom = Data_item_tome_of_knowledge_custom ;
};

    