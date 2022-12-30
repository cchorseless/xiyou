
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_keeper_of_the_light_blinding_light = {"ID":"5476","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","AbilitySound":"Hero_KeeperOfTheLight.BlindingLight","MaxLevel":"1","FightRecapLevel":"1","AbilityCastRange":"600","AbilityCastPoint":"0.3 0.3 0.3 0.3","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_5","AbilityCooldown":"18","AbilityManaCost":"150","AbilityModifierSupportValue":"1.0","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","miss_rate":"40","LinkedSpecialBonus":"special_bonus_unique_keeper_of_the_light_8"},"02":{"var_type":"FIELD_FLOAT","duration":"4"},"03":{"var_type":"FIELD_INTEGER","radius":"600"},"05":{"var_type":"FIELD_FLOAT","knockback_duration":"0.4"},"06":{"var_type":"FIELD_FLOAT","knockback_distance":"400"},"07":{"var_type":"FIELD_INTEGER","damage":"100"},"08":{"var_type":"FIELD_INTEGER","AbilityCharges":"","LinkedSpecialBonus":"special_bonus_unique_keeper_of_the_light_12"}}} ;

@registerAbility()
export class ability4_keeper_of_the_light_blinding_light extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "keeper_of_the_light_blinding_light";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_keeper_of_the_light_blinding_light = Data_keeper_of_the_light_blinding_light ;
}
    