
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_visage_stone_form_self_cast = {"ID":"7116","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL | DOTA_ABILITY_BEHAVIOR_IGNORE_PSEUDO_QUEUE","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","MaxLevel":"3","AbilityCastPoint":"0.0","AbilityCooldown":"0.0","AbilityManaCost":"0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","stun_radius":"350"},"02":{"var_type":"FIELD_FLOAT","stun_delay":"0.55"},"03":{"var_type":"FIELD_INTEGER","stun_damage":"60 100 140"},"04":{"var_type":"FIELD_FLOAT","stun_duration":"1.0 1.25 1.5"},"05":{"var_type":"FIELD_FLOAT","stone_duration":"6.0"},"06":{"var_type":"FIELD_FLOAT","hp_regen":"150 175 200"}}} ;

@registerAbility()
export class ability4_visage_stone_form_self_cast extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "visage_stone_form_self_cast";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_visage_stone_form_self_cast = Data_visage_stone_form_self_cast ;
}
    