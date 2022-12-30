
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_rapier_custom = {"ID":"133","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","Model":"models/props_gameplay/divine_rapier.vmdl","ItemCost":"6000","ItemShopTags":"damage","ItemQuality":"epic","ItemAliases":"divine rapier","ItemShareability":"ITEM_NOT_SHAREABLE","ItemSellable":"0","ItemKillable":"0","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_TO_SPECTATORS | DECLARE_PURCHASES_IN_SPEECH","ItemContributesToNetWorthWhenDropped":"0","AllowedInBackpack":"0","IsTempestDoubleClonable":"0","ItemDisassembleRule":"DOTA_ITEM_DISASSEMBLE_NEVER","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_damage":"350"}}} ;

@registerAbility()
export class item_rapier_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_rapier";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_rapier_custom = Data_item_rapier_custom ;
};

    