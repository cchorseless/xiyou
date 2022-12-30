
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_grimstroke_soul_chain = {"ID":"6491","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AOE","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"1","HasScepterUpgrade":"1","AbilityDraftUltScepterAbility":"grimstroke_dark_portrait","AbilityDraftUltShardAbility":"grimstroke_ink_over","AbilityCastAnimation":"ACT_DOTA_GS_SOUL_CHAIN","AbilityCastGestureSlot":"DEFAULT","AbilityCooldown":"100 75 50","AbilityCastRange":"700 800 900","AbilityCastPoint":"0.15","AbilityManaCost":"150 200 250","AbilityModifierSupportValue":"0.75","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","chain_duration":"6.0 7.0 8.0"},"02":{"var_type":"FIELD_INTEGER","chain_latch_radius":"600"},"03":{"var_type":"FIELD_INTEGER","chain_break_distance":"700"},"04":{"var_type":"FIELD_FLOAT","leash_limit_multiplier":"1.3"},"05":{"var_type":"FIELD_INTEGER","leash_radius_buffer":"50"},"06":{"var_type":"FIELD_FLOAT","creep_duration_pct":"50.0"}}} ;

@registerAbility()
export class ability6_grimstroke_soul_chain extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "grimstroke_soul_chain";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_grimstroke_soul_chain = Data_grimstroke_soul_chain ;
}
    