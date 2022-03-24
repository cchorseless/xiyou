
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_morphling_replicate = {"ID":"5057","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_CUSTOM","AbilityUnitTargetType":"DOTA_UNIT_TARGET_CUSTOM","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","AbilitySound":"Hero_Morphling.Replicate","SpellDispellableType":"SPELL_DISPELLABLE_NO","HasScepterUpgrade":"1","AbilityCastRange":"700 850 1000","AbilityCastPoint":"0.25","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_6","AbilityCooldown":"140 100 60","AbilityManaCost":"50","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"20","LinkedSpecialBonus":"special_bonus_unique_morphling_8"},"02":{"var_type":"FIELD_INTEGER","scepter_manacost_reduction":"50"},"03":{"var_type":"FIELD_INTEGER","scepter_cast_range_bonus":"300","RequiresScepter":"1"},"04":{"var_type":"FIELD_INTEGER","scepter_cooldown_reduction":"20","RequiresScepter":"1"}}} ;

@registerAbility()
export class ability6_morphling_replicate extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "morphling_replicate";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_morphling_replicate = Data_morphling_replicate ;
}
    