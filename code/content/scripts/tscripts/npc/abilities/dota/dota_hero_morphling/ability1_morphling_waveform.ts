
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_morphling_waveform = {"ID":"5052","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","FightRecapLevel":"1","AbilitySound":"Hero_Morphling.Waveform","AbilityCastRange":"700 800 900 1000","AbilityCastPoint":"0.25","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1","AbilityCooldown":"20 17 14 11","AbilityDamage":"75 150 225 300","AbilityManaCost":"140","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","speed":"1250"},"02":{"var_type":"FIELD_INTEGER","width":"200"},"03":{"var_type":"FIELD_INTEGER","AbilityCharges":"","LinkedSpecialBonus":"special_bonus_unique_morphling_6"},"04":{"var_type":"FIELD_INTEGER","abilitycastrange":"","LinkedSpecialBonus":"special_bonus_unique_morphling_1"}}} ;

@registerAbility()
export class ability1_morphling_waveform extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "morphling_waveform";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_morphling_waveform = Data_morphling_waveform ;
}
    