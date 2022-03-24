
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_nyx_assassin_vendetta = {"ID":"5465","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityUnitDamageType":"DAMAGE_TYPE_PURE","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"2","AbilitySound":"Hero_NyxAssassin.Vendetta","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_6","HasShardUpgrade":"1","AbilityDraftUltScepterAbility":"nyx_assassin_burrow","AbilityCooldown":"90 75 60","AbilityManaCost":"180 240 300","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"40 50 60"},"02":{"var_type":"FIELD_FLOAT","fade_time":"0.0"},"03":{"var_type":"FIELD_INTEGER","movement_speed":"16 18 20"},"04":{"var_type":"FIELD_INTEGER","bonus_damage":"300 450 600"},"05":{"var_type":"FIELD_INTEGER","health_regen_rate_scepter":"3"},"06":{"var_type":"FIELD_INTEGER","mana_regen_rate_scepter":"3"},"07":{"var_type":"FIELD_FLOAT","break_duration":"4.0"},"08":{"var_type":"FIELD_INTEGER","shard_magic_resist_reduction":"20"}}} ;

@registerAbility()
export class ability6_nyx_assassin_vendetta extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "nyx_assassin_vendetta";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_nyx_assassin_vendetta = Data_nyx_assassin_vendetta ;
}
    