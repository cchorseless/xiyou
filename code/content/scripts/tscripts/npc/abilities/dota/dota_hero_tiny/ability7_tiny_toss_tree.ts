
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_tiny_toss_tree = {"ID":"6937","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_PHYSICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","FightRecapLevel":"1","LinkedAbility":"tiny_tree_grab","AbilityCastRange":"1200","AbilityCastPoint":"0.2","AbilityCastAnimation":"ACT_INVALID","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","speed":"900.0"},"02":{"var_type":"FIELD_INTEGER","range":"1200"},"03":{"var_type":"FIELD_INTEGER","bonus_damage":"25","LinkedSpecialBonus":"special_bonus_unique_tiny_7","CalculateSpellDamageTooltip":"0"},"04":{"var_type":"FIELD_INTEGER","splash_radius":"275"},"05":{"var_type":"FIELD_INTEGER","splash_pct":"150"}}} ;

@registerAbility()
export class ability7_tiny_toss_tree extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "tiny_toss_tree";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_tiny_toss_tree = Data_tiny_toss_tree ;
}
    