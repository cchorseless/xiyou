
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_keeper_of_the_light_spirit_form_illuminate = {"ID":"5479","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","FightRecapLevel":"1","HasShardUpgrade":"1","AbilityCastRange":"1800","AbilityCastPoint":"0.3 0.3 0.3 0.3","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_7","AbilityCooldown":"11","AbilityManaCost":"100 125 150 175","AbilitySpecial":{"10":{"var_type":"FIELD_FLOAT","channel_vision_duration":"10.34"},"11":{"var_type":"FIELD_INTEGER","channel_vision_step":"150"},"01":{"var_type":"FIELD_INTEGER","total_damage":"225 325 425 525","LinkedSpecialBonus":"special_bonus_unique_keeper_of_the_light"},"02":{"var_type":"FIELD_FLOAT","max_channel_time":"2 2.7 3.4 4.1"},"03":{"var_type":"FIELD_INTEGER","radius":"375"},"04":{"var_type":"FIELD_INTEGER","range":"1550"},"05":{"var_type":"FIELD_FLOAT","speed":"1050.0"},"06":{"var_type":"FIELD_INTEGER","vision_radius":"800 800 800 800"},"07":{"var_type":"FIELD_FLOAT","vision_duration":"3.34 3.34 3.34 3.34"},"08":{"var_type":"FIELD_INTEGER","channel_vision_radius":"375"},"09":{"var_type":"FIELD_FLOAT","channel_vision_interval":"0.5"}}} ;

@registerAbility()
export class ability8_keeper_of_the_light_spirit_form_illuminate extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "keeper_of_the_light_spirit_form_illuminate";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_keeper_of_the_light_spirit_form_illuminate = Data_keeper_of_the_light_spirit_form_illuminate ;
}
    