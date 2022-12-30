
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_techies_suicide = {"ID":"5601","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_NORMAL_WHEN_STOLEN","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","HasShardUpgrade":"1","AbilityCastRange":"1000","AbilityCastPoint":"1.0","AbilityCooldown":"35","AbilityManaCost":"100 125 150 175","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"400"},"02":{"var_type":"FIELD_INTEGER","damage":"300 400 500 600","LinkedSpecialBonus":"special_bonus_unique_techies"},"03":{"var_type":"FIELD_FLOAT","silence_duration":"4 5 6 7"},"04":{"var_type":"FIELD_INTEGER","hp_cost":"50"},"05":{"var_type":"FIELD_FLOAT","duration":"0.75"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_techies_suicide extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "techies_suicide";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_techies_suicide = Data_techies_suicide ;
}
    