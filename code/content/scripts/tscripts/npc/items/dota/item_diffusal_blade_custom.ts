
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_diffusal_blade_custom = {"ID":"174","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","FightRecapLevel":"1","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilityCastRange":"600","AbilityCastPoint":"0.0","AbilityCooldown":"15.0","AbilitySharedCooldown":"diffusal","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","AbilityManaCost":"0","ItemCost":"3150","ItemShopTags":"agi;int;unique;hard_to_tag","ItemQuality":"artifact","ItemAliases":"diffusal blade 1","ItemPermanent":"1","UpgradesItems":"item_diffusal_blade","UpgradeRecipe":"item_recipe_diffusal_blade","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_agility":"24"},"02":{"var_type":"FIELD_INTEGER","bonus_intellect":"12"},"03":{"var_type":"FIELD_INTEGER","feedback_mana_burn":"40"},"04":{"var_type":"FIELD_INTEGER","feedback_mana_burn_illusion_melee":"12"},"05":{"var_type":"FIELD_INTEGER","feedback_mana_burn_illusion_ranged":"8"},"06":{"var_type":"FIELD_INTEGER","purge_rate":"5"},"07":{"var_type":"FIELD_FLOAT","purge_root_duration":"3.0"},"08":{"var_type":"FIELD_FLOAT","purge_slow_duration":"4.0"},"09":{"var_type":"FIELD_FLOAT","damage_per_burn":"1"}}} ;

@registerAbility()
export class item_diffusal_blade_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_diffusal_blade";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_diffusal_blade_custom = Data_item_diffusal_blade_custom ;
};

    