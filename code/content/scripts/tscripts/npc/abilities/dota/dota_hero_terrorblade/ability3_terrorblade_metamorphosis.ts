
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_terrorblade_metamorphosis = {"ID":"5621","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE","SpellDispellableType":"SPELL_DISPELLABLE_NO","AbilitySound":"Hero_Terrorblade.Metamorphosis","HasScepterUpgrade":"1","AbilityCastPoint":"0.","AbilityCooldown":"155.0","AbilityManaCost":"100","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"40 44 48 52"},"02":{"var_type":"FIELD_FLOAT","transformation_time":"0.35"},"03":{"var_type":"FIELD_FLOAT","base_attack_time":"1.5"},"04":{"var_type":"FIELD_INTEGER","bonus_range":"340 360 380 400","LinkedSpecialBonus":"special_bonus_unique_terrorblade_3"},"05":{"var_type":"FIELD_INTEGER","tooltip_attack_range":"550","LinkedSpecialBonus":"special_bonus_unique_terrorblade_3"},"06":{"var_type":"FIELD_INTEGER","bonus_damage":"15 30 45 60"},"07":{"var_type":"FIELD_INTEGER","speed_loss":"0"},"08":{"var_type":"FIELD_INTEGER","metamorph_aura_tooltip":"1200"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_terrorblade_metamorphosis extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "terrorblade_metamorphosis";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_terrorblade_metamorphosis = Data_terrorblade_metamorphosis ;
}
    