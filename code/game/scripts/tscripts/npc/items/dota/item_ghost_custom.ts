
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_ghost_custom = {"ID":"37","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE","FightRecapLevel":"1","AbilityCooldown":"20.0","AbilitySharedCooldown":"ethereal","SpellDispellableType":"SPELL_DISPELLABLE_YES","ItemCost":"1500","ItemShopTags":"int;agi;str;hard_to_tag","ItemQuality":"component","ItemAliases":"ghost scepter","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_all_stats":"5"},"02":{"var_type":"FIELD_FLOAT","duration":"4.0"},"03":{"var_type":"FIELD_INTEGER","extra_spell_damage_percent":"-40"}}} ;

@registerAbility()
export class item_ghost_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_ghost";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_ghost_custom = Data_item_ghost_custom ;
};

    