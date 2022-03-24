
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_visage_summon_familiars_stone_form = {"ID":"5484","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_HIDDEN","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES_STRONG","AbilityCastRange":"160","AbilityCastPoint":"0.0","MaxLevel":"3","AbilitySound":"Visage_Familiar.StoneForm.Cast","AbilityCooldown":"14.0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","stun_radius":"350"},"02":{"var_type":"FIELD_FLOAT","stun_delay":"0.55"},"03":{"var_type":"FIELD_INTEGER","stun_damage":"60 100 140"},"04":{"var_type":"FIELD_FLOAT","stun_duration":"1.0 1.25 1.5"},"05":{"var_type":"FIELD_FLOAT","stone_duration":"6.0"},"06":{"var_type":"FIELD_FLOAT","hp_regen":"150 175 200"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_5"} ;

@registerAbility()
export class ability7_visage_summon_familiars_stone_form extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "visage_summon_familiars_stone_form";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_visage_summon_familiars_stone_form = Data_visage_summon_familiars_stone_form ;
}
    