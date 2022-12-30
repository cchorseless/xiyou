
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_tidehunter_ravage = {"ID":"5121","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES_STRONG","FightRecapLevel":"2","AbilitySound":"Ability.Ravage","AbilityCastRange":"0","AbilityCastPoint":"0.3 0.3 0.3","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"150.0 150.0 150.0","AbilityDamage":"200 300 400","AbilityManaCost":"150 225 325","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"1250"},"02":{"var_type":"FIELD_INTEGER","speed":"725"},"03":{"var_type":"FIELD_FLOAT","duration":"2.4 2.6 2.8"}}} ;

@registerAbility()
export class ability6_tidehunter_ravage extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "tidehunter_ravage";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_tidehunter_ravage = Data_tidehunter_ravage ;
}
    