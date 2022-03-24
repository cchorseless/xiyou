
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_basher_custom = {"ID":"143","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilityUnitDamageType":"DAMAGE_TYPE_PHYSICAL","AbilityCooldown":"2.3","SpellDispellableType":"SPELL_DISPELLABLE_YES_STRONG","ItemCost":"2950","ItemShopTags":"damage;str;hard_to_tag","ItemQuality":"epic","ItemAliases":"skull basher","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_damage":"25"},"02":{"var_type":"FIELD_INTEGER","bonus_strength":"10"},"03":{"var_type":"FIELD_INTEGER","bash_chance_melee":"25"},"04":{"var_type":"FIELD_INTEGER","bash_chance_ranged":"10"},"05":{"var_type":"FIELD_FLOAT","bash_duration":"1.5"},"06":{"var_type":"FIELD_FLOAT","bash_cooldown":"2.3"},"07":{"var_type":"FIELD_INTEGER","bonus_chance_damage":"100"}}} ;

@registerAbility()
export class item_basher_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_basher";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_basher_custom = Data_item_basher_custom ;
};

    