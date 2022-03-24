
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_terrorblade_sunder = {"ID":"5622","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_BOTH","AbilityUnitTargetType":"DOTA_UNIT_TARGET_CUSTOM","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","FightRecapLevel":"2","AbilitySound":"Hero_Terrorblade.Sunder.Target","AbilityDraftUltShardAbility":"terrorblade_demon_zeal","AbilityCooldown":"120.0 80.0 40.0","AbilityCastRange":"475","AbilityCastPoint":"0.35","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityManaCost":"150 100 50","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","hit_point_minimum_pct":"35 30 25"}}} ;

@registerAbility()
export class ability6_terrorblade_sunder extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "terrorblade_sunder";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_terrorblade_sunder = Data_terrorblade_sunder ;
}
    