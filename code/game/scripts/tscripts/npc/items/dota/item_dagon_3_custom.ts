
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_dagon_3_custom = {"ID":"202","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","FightRecapLevel":"1","AbilityCastRange":"700 750 800 850 900","AbilityCastPoint":"0.0","AbilityCooldown":"35.0 30.0 25.0 20.0 15.0","AbilitySharedCooldown":"dagon","MaxUpgradeLevel":"5","ItemBaseLevel":"3","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","AbilityManaCost":"120 140 160 180 200","ItemCost":"5200","ItemShopTags":"damage;int;str;agi;hard_to_tag","ItemQuality":"rare","ItemAliases":"dagon 3","UpgradesItems":"item_dagon_3;item_dagon_4","UpgradeRecipe":"item_recipe_dagon","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_int":"14 16 18 20 22"},"02":{"var_type":"FIELD_INTEGER","bonus_str":"6 8 10 12 14"},"03":{"var_type":"FIELD_INTEGER","bonus_agi":"6 8 10 12 14"},"04":{"var_type":"FIELD_INTEGER","damage":"400 500 600 700 800"},"05":{"var_type":"FIELD_FLOAT","damage_delay":"0"},"06":{"var_type":"FIELD_FLOAT","mana_cost_tooltip":"120 140 160 180 200"}}} ;

@registerAbility()
export class item_dagon_3_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_dagon_3";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_dagon_3_custom = Data_item_dagon_3_custom ;
};

    