
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_abyssal_blade_custom = {"ID":"208","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES","FightRecapLevel":"1","SpellDispellableType":"SPELL_DISPELLABLE_YES_STRONG","AbilityCooldown":"35","AbilityCastRange":"150","AbilityCastPoint":"0.0","AbilityManaCost":"75","ItemCost":"6325","ItemShopTags":"damage;str;hard_to_tag","ItemQuality":"epic","ItemAliases":"abyssal blade","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"10":{"var_type":"FIELD_FLOAT","bash_duration":"1.5"},"11":{"var_type":"FIELD_FLOAT","bash_cooldown":"2.3"},"12":{"var_type":"FIELD_INTEGER","bonus_chance_damage":"100"},"13":{"var_type":"FIELD_FLOAT","stun_duration":"2.0"},"01":{"var_type":"FIELD_INTEGER","bonus_damage":"25"},"02":{"var_type":"FIELD_INTEGER","bonus_health":"250"},"03":{"var_type":"FIELD_FLOAT","bonus_health_regen":"10"},"04":{"var_type":"FIELD_INTEGER","block_damage_melee":"70"},"05":{"var_type":"FIELD_INTEGER","block_damage_ranged":"35"},"06":{"var_type":"FIELD_INTEGER","block_chance":"60"},"07":{"var_type":"FIELD_INTEGER","bonus_strength":"10"},"08":{"var_type":"FIELD_INTEGER","bash_chance_melee":"25"},"09":{"var_type":"FIELD_INTEGER","bash_chance_ranged":"10"}}} ;

@registerAbility()
export class item_abyssal_blade_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_abyssal_blade";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_abyssal_blade_custom = Data_item_abyssal_blade_custom ;
};

    