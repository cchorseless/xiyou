
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";

/** dota原道具数据 */
export const Data_item_ethereal_blade_custom = {"ID":"176","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY | DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_CREEP","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_NOT_MAGIC_IMMUNE_ALLIES","FightRecapLevel":"1","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilityCastRange":"800","AbilityCastPoint":"0.0","AbilityCooldown":"20.0","AbilitySharedCooldown":"ethereal","AbilityManaCost":"100","ItemCost":"4300","ItemShopTags":"agi;str;int;hard_to_tag","ItemQuality":"epic","ItemDisassembleRule":"DOTA_ITEM_DISASSEMBLE_ALWAYS","ItemAliases":"eb;ethereal blade;eblade","ItemDeclarations":"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_TO_SPECTATORS","ShouldBeSuggested":"1","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","projectile_speed":"1275"},"01":{"var_type":"FIELD_INTEGER","bonus_agility":"40"},"02":{"var_type":"FIELD_INTEGER","bonus_strength":"10"},"03":{"var_type":"FIELD_INTEGER","bonus_intellect":"10"},"04":{"var_type":"FIELD_INTEGER","blast_movement_slow":"-80"},"05":{"var_type":"FIELD_FLOAT","duration":"4.0"},"06":{"var_type":"FIELD_FLOAT","blast_agility_multiplier":"1.5"},"07":{"var_type":"FIELD_INTEGER","blast_damage_base":"125"},"08":{"var_type":"FIELD_FLOAT","duration_ally":"4.0"},"09":{"var_type":"FIELD_INTEGER","ethereal_damage_bonus":"-40"}}} ;

@registerAbility()
export class item_ethereal_blade_custom extends BaseItem_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "item_ethereal_blade";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_item_ethereal_blade_custom = Data_item_ethereal_blade_custom ;
};

    