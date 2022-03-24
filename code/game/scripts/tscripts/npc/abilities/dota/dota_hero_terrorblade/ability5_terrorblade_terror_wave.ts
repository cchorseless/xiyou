
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_terrorblade_terror_wave = {"ID":"425","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","MaxLevel":"1","FightRecapLevel":"1","IsGrantedByScepter":"1","HasScepterUpgrade":"1","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3","AbilityCooldown":"90","AbilityManaCost":"75","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","fear_duration":"2.5","RequiresScepter":"1"},"02":{"var_type":"FIELD_INTEGER","scepter_radius":"1600","RequiresScepter":"1"},"03":{"var_type":"FIELD_INTEGER","scepter_speed":"1000","RequiresScepter":"1"},"04":{"var_type":"FIELD_FLOAT","scepter_spawn_delay":"0.6","RequiresScepter":"1"},"05":{"var_type":"FIELD_FLOAT","scepter_meta_duration":"10","RequiresScepter":"1"}}} ;

@registerAbility()
export class ability5_terrorblade_terror_wave extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "terrorblade_terror_wave";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_terrorblade_terror_wave = Data_terrorblade_terror_wave ;
}
    