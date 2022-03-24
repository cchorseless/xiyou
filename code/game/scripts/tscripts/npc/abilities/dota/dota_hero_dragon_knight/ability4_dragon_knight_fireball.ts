
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_dragon_knight_fireball = {"ID":"660","MaxLevel":"1","AbilityType":"DOTA_ABILITY_TYPE_BASIC","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_HIDDEN  | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","FightRecapLevel":"1","IsGrantedByShard":"1","AbilityCastRange":"1400","AbilityCastPoint":"0.2","AbilityCooldown":"20","AbilityManaCost":"100","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"450"},"02":{"var_type":"FIELD_INTEGER","damage":"80"},"03":{"var_type":"FIELD_FLOAT","duration":"10.0"},"04":{"var_type":"FIELD_FLOAT","burn_interval":"0.5"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability4_dragon_knight_fireball extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "dragon_knight_fireball";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_dragon_knight_fireball = Data_dragon_knight_fireball ;
}
    