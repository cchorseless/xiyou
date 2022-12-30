
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_elder_titan_ancestral_spirit = {"ID":"5591","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilitySound":"Hero_ElderTitan.AncestralSpirit.Cast","HasScepterUpgrade":"1","AbilityCastAnimation":"ACT_DOTA_ANCESTRAL_SPIRIT","AbilityCastGestureSlot":"DEFAULT","AbilityCastRange":"1200","AbilityCastPoint":"0.4 0.4 0.4 0.4","AbilityCooldown":"23 21 19 17","AbilityManaCost":"80 90 100 110","AbilitySpecial":{"10":{"var_type":"FIELD_FLOAT","armor_creeps":"0.5"},"11":{"var_type":"FIELD_FLOAT","armor_heroes":"1.5 3 4.5 6"},"12":{"var_type":"FIELD_INTEGER","move_pct_cap":"40"},"13":{"var_type":"FIELD_INTEGER","scepter_magic_immune_per_hero":"2","RequiresScepter":"1"},"01":{"var_type":"FIELD_INTEGER","radius":"275"},"02":{"var_type":"FIELD_INTEGER","pass_damage":"50"},"03":{"var_type":"FIELD_FLOAT","spirit_duration":"8.0"},"04":{"var_type":"FIELD_FLOAT","buff_duration":"10.0"},"05":{"var_type":"FIELD_INTEGER","speed":"900"},"06":{"var_type":"FIELD_INTEGER","move_pct_creeps":"1"},"07":{"var_type":"FIELD_INTEGER","move_pct_heroes":"7"},"08":{"var_type":"FIELD_INTEGER","damage_creeps":"3 7 11 15","CalculateSpellDamageTooltip":"0"},"09":{"var_type":"FIELD_INTEGER","damage_heroes":"20 40 60 80","LinkedSpecialBonus":"special_bonus_unique_elder_titan","CalculateSpellDamageTooltip":"0"}}} ;

@registerAbility()
export class ability2_elder_titan_ancestral_spirit extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "elder_titan_ancestral_spirit";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_elder_titan_ancestral_spirit = Data_elder_titan_ancestral_spirit ;
}
    