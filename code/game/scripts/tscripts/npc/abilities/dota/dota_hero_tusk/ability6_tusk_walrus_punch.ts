
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_tusk_walrus_punch = {"ID":"5568","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AUTOCAST | DOTA_ABILITY_BEHAVIOR_ATTACK","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","FightRecapLevel":"1","AbilitySound":"Hero_Tusk.WalrusPunch.Target","HasScepterUpgrade":"1","AbilityDraftUltScepterAbility":"tusk_walrus_kick","AbilityDraftUltShardAbility":"tusk_frozen_sigil","AbilityCastPoint":"0","AbilityCastRange":"150","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"36 24 12","AbilityManaCost":"50 75 100","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","crit_multiplier":"350","LinkedSpecialBonus":"special_bonus_unique_tusk"},"02":{"var_type":"FIELD_FLOAT","air_time":"1.0","LinkedSpecialBonus":"special_bonus_unique_tusk_7"},"03":{"var_type":"FIELD_FLOAT","slow_duration":"2.0 3.0 4.0"},"04":{"var_type":"FIELD_INTEGER","move_slow":"40"},"05":{"var_type":"FIELD_INTEGER","push_length":"1000"}}} ;

@registerAbility()
export class ability6_tusk_walrus_punch extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "tusk_walrus_punch";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_tusk_walrus_punch = Data_tusk_walrus_punch ;
}
    