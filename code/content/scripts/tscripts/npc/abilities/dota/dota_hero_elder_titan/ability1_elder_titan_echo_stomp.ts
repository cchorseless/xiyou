
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_elder_titan_echo_stomp = {"ID":"5589","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_CHANNELLED","AbilityUnitDamageType":"DAMAGE_TYPE_PHYSICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES_STRONG","FightRecapLevel":"1","AbilitySound":"Hero_ElderTitan.EchoStomp","HasShardUpgrade":"1","AbilityCastAnimation":"ACT_INVALID","AbilityCastPoint":"0.4","AbilityCastRange":"500","AbilityChannelTime":"1.3","AbilityCooldown":"14 13 12 11","AbilityManaCost":"100","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","cast_time":"1.7"},"02":{"var_type":"FIELD_INTEGER","radius":"500"},"03":{"var_type":"FIELD_FLOAT","sleep_duration":"2 3 4 5"},"04":{"var_type":"FIELD_INTEGER","stomp_damage":"70 100 130 160","LinkedSpecialBonus":"special_bonus_unique_elder_titan_2"},"05":{"var_type":"FIELD_FLOAT","initial_stun_duration":"0.2"},"06":{"var_type":"FIELD_FLOAT","animation_rate":"0.0"},"07":{"var_type":"FIELD_INTEGER","wake_damage_limit":"50 100 150 200","LinkedSpecialBonus":"special_bonus_unique_elder_titan_4"}}} ;

@registerAbility()
export class ability1_elder_titan_echo_stomp extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "elder_titan_echo_stomp";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_elder_titan_echo_stomp = Data_elder_titan_echo_stomp ;
}
    