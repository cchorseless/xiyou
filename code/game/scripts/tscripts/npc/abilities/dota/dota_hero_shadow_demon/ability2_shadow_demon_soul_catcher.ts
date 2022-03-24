
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_shadow_demon_soul_catcher = {"ID":"5422","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","AbilityUnitDamageType":"DAMAGE_TYPE_PURE","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_ShadowDemon.Soul_Catcher","AbilityCooldown":"26 24 22 20","AbilityCastRange":"700","AbilityCastPoint":"0.3 0.3 0.3 0.3","AbilityManaCost":"80 100 120 140","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","health_lost":"20 25 30 35"},"02":{"var_type":"FIELD_INTEGER","radius":"175 200 225 250"},"03":{"var_type":"FIELD_FLOAT","duration":"10","LinkedSpecialBonus":"special_bonus_unique_shadow_demon_8"},"04":{"var_type":"FIELD_INTEGER","illusion_outgoing_damage":"-70 -55 -40 -25"},"05":{"var_type":"FIELD_INTEGER","illusion_outgoing_damage_tooltip":"30 45 60 75"},"06":{"var_type":"FIELD_INTEGER","illusion_incoming_damage":"100"},"07":{"var_type":"FIELD_INTEGER","illusion_incoming_damage_tooltip":"200"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_shadow_demon_soul_catcher extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "shadow_demon_soul_catcher";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_shadow_demon_soul_catcher = Data_shadow_demon_soul_catcher ;
}
    