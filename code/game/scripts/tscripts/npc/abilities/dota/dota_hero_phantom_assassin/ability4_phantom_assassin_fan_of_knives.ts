
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_phantom_assassin_fan_of_knives = {"ID":"662","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","AbilityUnitDamageType":"DAMAGE_TYPE_PURE","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","MaxLevel":"1","FightRecapLevel":"1","IsGrantedByShard":"1","AbilitySound":"Ability.Torrent","AbilityCastPoint":"0.15","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"20","AbilityManaCost":"50","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","pct_health_damage_initial":"16"},"02":{"var_type":"FIELD_FLOAT","pct_health_damage":"2"},"03":{"var_type":"FIELD_INTEGER","degen":"-50"},"04":{"var_type":"FIELD_FLOAT","duration":"3"},"05":{"var_type":"FIELD_INTEGER","radius":"550"},"06":{"var_type":"FIELD_INTEGER","projectile_speed":"1000"}}} ;

@registerAbility()
export class ability4_phantom_assassin_fan_of_knives extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "phantom_assassin_fan_of_knives";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_phantom_assassin_fan_of_knives = Data_phantom_assassin_fan_of_knives ;
}
    