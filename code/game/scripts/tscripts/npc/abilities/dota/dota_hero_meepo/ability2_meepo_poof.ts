
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_meepo_poof = {"ID":"5431","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | | DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_NORMAL_WHEN_STOLEN | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","FightRecapLevel":"1","AbilitySound":"Hero_Meepo.Poof","HasShardUpgrade":"1","AbilityCastPoint":"1.5","AbilityChannelTime":"0.0","AbilityCooldown":"12 10 8 6","AbilityManaCost":"80","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"400"},"02":{"var_type":"FIELD_INTEGER","poof_damage":"60 80 100 120","LinkedSpecialBonus":"special_bonus_unique_meepo_2"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_meepo_poof extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "meepo_poof";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_meepo_poof = Data_meepo_poof ;
}
    