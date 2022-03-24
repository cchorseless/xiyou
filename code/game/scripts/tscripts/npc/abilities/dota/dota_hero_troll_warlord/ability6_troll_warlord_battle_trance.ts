
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_troll_warlord_battle_trance = {"ID":"5512","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_BOTH","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"2","AbilitySound":"Hero_TrollWarlord.BattleTrance.Cast","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","MaxLevel":"3","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCastGestureSlot":"DEFAULT","AbilityCastPoint":"0.0 0.0 0.0","AbilityCastRange":"525","AbilityCooldown":"90","AbilityManaCost":"150","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","trance_duration":"6.5","LinkedSpecialBonus":"special_bonus_unique_troll_warlord_7"},"02":{"var_type":"FIELD_INTEGER","lifesteal":"40 60 80"},"03":{"var_type":"FIELD_INTEGER","attack_speed":"140 170 200"},"04":{"var_type":"FIELD_INTEGER","movement_speed":"25 30 35"},"05":{"var_type":"FIELD_INTEGER","range":"900"},"06":{"var_type":"FIELD_INTEGER","scepter_cooldown":"35","RequiresScepter":"1"},"07":{"var_type":"FIELD_FLOAT","scepter_duration_enemies":"3.25","RequiresScepter":"1"},"08":{"var_type":"FIELD_FLOAT","scepter_cast_range_tooltip":"525","RequiresScepter":"1"}}} ;

@registerAbility()
export class ability6_troll_warlord_battle_trance extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "troll_warlord_battle_trance";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_troll_warlord_battle_trance = Data_troll_warlord_battle_trance ;
}
    