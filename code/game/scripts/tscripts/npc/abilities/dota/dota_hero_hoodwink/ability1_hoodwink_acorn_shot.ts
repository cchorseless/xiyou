
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_hoodwink_acorn_shot = {"ID":"8429","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_AUTOCAST","AbilityUnitDamageType":"DAMAGE_TYPE_PHYSICAL","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_CREEP","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","AbilityCooldown":"16 14 12 10","AbilityCastRange":"575","AbilityCastPoint":"0.2","AbilityManaCost":"75 85 95 105","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_range":"125 200 275 350"},"02":{"var_type":"FIELD_INTEGER","acorn_shot_damage":"50 75 100 125"},"03":{"var_type":"FIELD_INTEGER","base_damage_pct":"75"},"04":{"var_type":"FIELD_INTEGER","bounce_count":"2 3 4 5"},"05":{"var_type":"FIELD_INTEGER","bounce_range":"525"},"06":{"var_type":"FIELD_FLOAT","debuff_duration":"0.25"},"07":{"var_type":"FIELD_INTEGER","slow":"100"},"08":{"var_type":"FIELD_FLOAT","bounce_delay":"0.1"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_hoodwink_acorn_shot extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "hoodwink_acorn_shot";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_hoodwink_acorn_shot = Data_hoodwink_acorn_shot ;
}
    