
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_legion_commander_duel = {"ID":"5598","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES | DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"2","AbilitySound":"Hero_LegionCommander.Duel","HasScepterUpgrade":"1","AbilityCastRange":"150","AbilityCastPoint":"0.3 0.3 0.3 0.3","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"50.0 50.0 50.0","AbilityManaCost":"75 75 75","AbilityModifierSupportValue":"3.0","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"4.0 4.75 5.5"},"02":{"var_type":"FIELD_FLOAT","duration_scepter":"6 7 8","RequiresScepter":"1"},"03":{"var_type":"FIELD_INTEGER","reward_damage":"10 20 30","LinkedSpecialBonus":"special_bonus_unique_legion_commander"},"04":{"var_type":"FIELD_INTEGER","victory_range":"600"}}} ;

@registerAbility()
export class ability6_legion_commander_duel extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "legion_commander_duel";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_legion_commander_duel = Data_legion_commander_duel ;
}
    