
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_winter_wyvern_cold_embrace = {"ID":"5653","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_CREEP","SpellImmunityType":"SPELL_IMMUNITY_ALLIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"1","AbilitySound":"Hero_Winter_Wyvern.ColdEmbrace","HasShardUpgrade":"1","AbilityCastRange":"1000","AbilityCastPoint":"0.3 0.3 0.3 0.3","AbilityCooldown":"24 21 18 15","AbilityManaCost":"50 60 70 80","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"4.0"},"02":{"var_type":"FIELD_INTEGER","heal_additive":"30 35 40 45"},"03":{"var_type":"FIELD_FLOAT","heal_percentage":"2 3 4 5","LinkedSpecialBonus":"special_bonus_unique_winter_wyvern_5"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_winter_wyvern_cold_embrace extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "winter_wyvern_cold_embrace";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_winter_wyvern_cold_embrace = Data_winter_wyvern_cold_embrace ;
}
    