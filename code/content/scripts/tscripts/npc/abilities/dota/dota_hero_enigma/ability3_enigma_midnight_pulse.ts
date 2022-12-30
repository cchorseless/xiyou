
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_enigma_midnight_pulse = {"ID":"5148","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","FightRecapLevel":"1","AbilitySound":"Hero_Enigma.Midnight_Pulse","AbilityCastAnimation":"ACT_DOTA_MIDNIGHT_PULSE","AbilityCastGestureSlot":"DEFAULT","AbilityCastRange":"700","AbilityCastPoint":"0.1","AbilityCooldown":"50 45 40 35","AbilityManaCost":"50 80 110 140","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"550","LinkedSpecialBonus":"special_bonus_unique_enigma_9"},"02":{"var_type":"FIELD_FLOAT","damage_percent":"4.75 5.5 6.25 7"},"03":{"var_type":"FIELD_FLOAT","duration":"9 10 11 12","LinkedSpecialBonus":"special_bonus_unique_enigma_8"}}} ;

@registerAbility()
export class ability3_enigma_midnight_pulse extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "enigma_midnight_pulse";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_enigma_midnight_pulse = Data_enigma_midnight_pulse ;
}
    