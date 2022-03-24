
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_monkey_king_bar_custom = {"ID":"135","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","ItemCost":"4975","ItemShopTags":"damage;attack_speed;hard_to_tag","ItemQuality":"epic","ItemAliases":"mkb;monkey king bar","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_damage":"40"},"02":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"35"},"03":{"var_type":"FIELD_INTEGER","bonus_chance":"80"},"04":{"var_type":"FIELD_INTEGER","bonus_chance_damage":"70"}}} ;

@registerAbility()
export class item_monkey_king_bar_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_monkey_king_bar";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_monkey_king_bar_custom = Data_item_monkey_king_bar_custom ;
};

    