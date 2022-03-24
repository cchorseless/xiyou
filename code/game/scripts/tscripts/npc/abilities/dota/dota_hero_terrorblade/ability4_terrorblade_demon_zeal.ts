
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_terrorblade_demon_zeal = {"ID":"699","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN  | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","MaxLevel":"1","FightRecapLevel":"1","IsGrantedByShard":"1","HasShardUpgrade":"1","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_5","AbilityCastPoint":"0.2","AbilityCastGestureSlot":"DEFAULT","AbilityCooldown":"14","AbilityManaCost":"0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","berserk_bonus_attack_speed":"50"},"02":{"var_type":"FIELD_INTEGER","berserk_bonus_movement_speed":"50"},"03":{"var_type":"FIELD_INTEGER","melee_bonus":"100"},"04":{"var_type":"FIELD_FLOAT","duration":"7"},"05":{"var_type":"FIELD_INTEGER","health_cost_pct":"20"}}} ;

@registerAbility()
export class ability4_terrorblade_demon_zeal extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "terrorblade_demon_zeal";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_terrorblade_demon_zeal = Data_terrorblade_demon_zeal ;
}
    