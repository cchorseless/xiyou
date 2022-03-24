
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_terrorblade_reflection = {"ID":"5619","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_Terrorblade.Reflection","AbilityCooldown":"28 24 20 16","AbilityCastPoint":"0.3","AbilityCastRange":"700","AbilityManaCost":"35 40 45 50","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","illusion_duration":"5"},"02":{"var_type":"FIELD_FLOAT","illusion_outgoing_damage":"-45 -30 -15 0"},"03":{"var_type":"FIELD_FLOAT","illusion_outgoing_tooltip":"55 70 85 100","LinkedSpecialBonus":"special_bonus_unique_terrorblade_4"},"04":{"var_type":"FIELD_INTEGER","move_slow":"15 20 25 30"},"05":{"var_type":"FIELD_INTEGER","range":"475"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_terrorblade_reflection extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "terrorblade_reflection";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_terrorblade_reflection = Data_terrorblade_reflection ;
}
    