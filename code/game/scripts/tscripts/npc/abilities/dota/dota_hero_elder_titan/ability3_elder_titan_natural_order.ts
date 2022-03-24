
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_elder_titan_natural_order = {"ID":"5593","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE | DOTA_ABILITY_BEHAVIOR_AURA","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","AbilityCastAnimation":"ACT_INVALID","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"350"},"02":{"var_type":"FIELD_INTEGER","armor_reduction_pct":"40 60 80 100"},"03":{"var_type":"FIELD_INTEGER","magic_resistance_pct":"40 60 80 100"}}} ;

@registerAbility()
export class ability3_elder_titan_natural_order extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "elder_titan_natural_order";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_elder_titan_natural_order = Data_elder_titan_natural_order ;
}
    