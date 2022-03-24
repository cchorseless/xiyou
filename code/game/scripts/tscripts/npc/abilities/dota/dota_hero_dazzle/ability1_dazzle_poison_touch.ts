
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_dazzle_poison_touch = {"ID":"5233","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_PHYSICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_Dazzle.Poison_Touch","HasShardUpgrade":"1","AbilityCastRange":"500 600 700 800","AbilityCastPoint":"0.3 0.3 0.3 0.3","AbilityCooldown":"27 24 21 18","AbilityManaCost":"110 120 130 140","AbilityModifierSupportValue":"0.35","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","start_radius":"200 200 200 200"},"02":{"var_type":"FIELD_INTEGER","end_radius":"300 300 300 300"},"03":{"var_type":"FIELD_INTEGER","end_distance":"600 700 800 900"},"04":{"var_type":"FIELD_INTEGER","targets":"2 4 6 8"},"05":{"var_type":"FIELD_INTEGER","damage":"16 28 40 52","LinkedSpecialBonus":"special_bonus_unique_dazzle_3"},"06":{"var_type":"FIELD_INTEGER","slow":"-14 -16 -18 -20","LinkedSpecialBonus":"special_bonus_unique_dazzle_1"},"07":{"var_type":"FIELD_INTEGER","projectile_speed":"1300"},"08":{"var_type":"FIELD_FLOAT","duration":"4 5 6 7"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_dazzle_poison_touch extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "dazzle_poison_touch";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_dazzle_poison_touch = Data_dazzle_poison_touch ;
}
    