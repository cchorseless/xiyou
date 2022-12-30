
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_bane_brain_sap = {"ID":"5011","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_PURE","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","FightRecapLevel":"1","AbilitySound":"Hero_Bane.BrainSap","HasShardUpgrade":"1","AbilityCastPoint":"0.2","AbilityCastRange":"600","AbilityCooldown":"14 13 12 11","AbilityManaCost":"120 140 160 180","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","brain_sap_damage":"75 150 225 300","LinkedSpecialBonus":"special_bonus_unique_bane_2"},"02":{"var_type":"FIELD_FLOAT","cooldown_scepter":"1.5","RequiresScepter":"1"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_bane_brain_sap extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "bane_brain_sap";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_bane_brain_sap = Data_bane_brain_sap ;
}
    