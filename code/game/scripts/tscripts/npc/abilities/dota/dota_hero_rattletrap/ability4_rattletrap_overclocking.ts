
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_rattletrap_overclocking = {"ID":"321","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","MaxLevel":"1","FightRecapLevel":"1","IsGrantedByScepter":"1","HasScepterUpgrade":"1","AbilitySound":"Hero_Rattletrap.Battery_Assault_Impact","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1","AbilityCastGestureSlot":"DEFAULT","AbilityCooldown":"60","AbilityManaCost":"150","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","buff_duration":"8","RequiresScepter":"1"},"02":{"var_type":"FIELD_INTEGER","bonus_movement_speed":"40","RequiresScepter":"1"},"03":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"200","RequiresScepter":"1"},"04":{"var_type":"FIELD_FLOAT","debuff_duration":"4","RequiresScepter":"1"}}} ;

@registerAbility()
export class ability4_rattletrap_overclocking extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "rattletrap_overclocking";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_rattletrap_overclocking = Data_rattletrap_overclocking ;
}
    