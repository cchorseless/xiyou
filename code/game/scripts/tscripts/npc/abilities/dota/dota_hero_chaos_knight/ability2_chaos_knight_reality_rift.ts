
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_chaos_knight_reality_rift = {"ID":"5427","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_ChaosKnight.RealityRift","AbilityCastAnimation":"ACT_DOTA_OVERRIDE_ABILITY_2","AbilityCastGestureSlot":"DEFAULT","AbilityCastRange":"550 600 650 700","AbilityCastPoint":"0.3","AbilityCooldown":"15 12 9 6","AbilityManaCost":"50","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","cast_range":"550 600 650 700"},"02":{"var_type":"FIELD_INTEGER","pull_distance":"250 300 350 400"},"03":{"var_type":"FIELD_INTEGER","armor_reduction":"3 4 5 6"},"04":{"var_type":"FIELD_FLOAT","duration":"6"}}} ;

@registerAbility()
export class ability2_chaos_knight_reality_rift extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "chaos_knight_reality_rift";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_chaos_knight_reality_rift = Data_chaos_knight_reality_rift ;
}
    