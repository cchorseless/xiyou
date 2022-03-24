
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_rattletrap_battery_assault = {"ID":"5237","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_IMMEDIATE","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"1","AbilitySound":"Hero_Rattletrap.Battery_Assault_Impact","AbilityCooldown":"24 22 20 18","AbilityManaCost":"100","AbilityModifierSupportValue":"0.2","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"275 275 275 275"},"02":{"var_type":"FIELD_FLOAT","duration":"10.5 10.5 10.5 10.5"},"03":{"var_type":"FIELD_FLOAT","interval":"0.7 0.7 0.7 0.7","LinkedSpecialBonus":"special_bonus_unique_clockwerk"},"04":{"var_type":"FIELD_INTEGER","damage":"20 45 70 95","LinkedSpecialBonus":"special_bonus_unique_clockwerk_3"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_rattletrap_battery_assault extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "rattletrap_battery_assault";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_rattletrap_battery_assault = Data_rattletrap_battery_assault ;
}
    