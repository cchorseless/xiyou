
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_faceless_void_chronosphere = {"ID":"5185","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_POINT","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"2","AbilitySound":"Hero_FacelessVoid.Chronosphere","AbilityCastRange":"500","AbilityCastPoint":"0.35 0.35 0.35","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"160","AbilityManaCost":"150 225 300","AbilityModifierSupportBonus":"50","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"500","LinkedSpecialBonus":"special_bonus_unique_faceless_void_2"},"02":{"var_type":"FIELD_FLOAT","duration":"4.0 4.5 5.0"},"03":{"var_type":"FIELD_INTEGER","vision_radius":"475"},"04":{"var_type":"FIELD_INTEGER","bonus_attack_speed":"0"}}} ;

@registerAbility()
export class ability6_faceless_void_chronosphere extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "faceless_void_chronosphere";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_faceless_void_chronosphere = Data_faceless_void_chronosphere ;
}
    