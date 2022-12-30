
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_bloodthorn_custom = {"ID":"250","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","FightRecapLevel":"1","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilityCastRange":"900","AbilityCastPoint":"0.0","AbilityCooldown":"15.0","AbilitySharedCooldown":"orchid","AbilityManaCost":"100","ItemCost":"6275","ItemShopTags":"int;attack_speed;damage;regen_mana;damage;hard_to_tag","ItemQuality":"epic","ItemAliases":"orchid malevolence","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_intellect":"25"},"02":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"90"},"03":{"var_type":"FIELD_INTEGER","bonus_damage":"30"},"04":{"var_type":"FIELD_FLOAT","bonus_mana_regen":"5.5"},"05":{"var_type":"FIELD_FLOAT","silence_damage_percent":"30"},"06":{"var_type":"FIELD_FLOAT","silence_duration":"5"},"07":{"var_type":"FIELD_FLOAT","target_crit_multiplier":"130"},"08":{"var_type":"FIELD_FLOAT","tooltip_crit_chance":"100"}}} ;

@registerAbility()
export class item_bloodthorn_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_bloodthorn";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_bloodthorn_custom = Data_item_bloodthorn_custom ;
};

    