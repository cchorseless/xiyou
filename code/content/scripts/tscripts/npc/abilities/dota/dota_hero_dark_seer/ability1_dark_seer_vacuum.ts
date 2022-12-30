
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_dark_seer_vacuum = {"ID":"5255","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES_STRONG","FightRecapLevel":"1","AbilitySound":"Hero_Dark_Seer.Vacuum","AbilityCastRange":"450 500 550 600","AbilityCastPoint":"0.4","AbilityCooldown":"60 50 40 30","AbilityManaCost":"60 90 120 150","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"400 450 500 550","LinkedSpecialBonus":"special_bonus_unique_dark_seer_2"},"02":{"var_type":"FIELD_FLOAT","duration":"0.3 0.4 0.5 0.6"},"03":{"var_type":"FIELD_INTEGER","damage":"100 150 200 250"},"04":{"var_type":"FIELD_INTEGER","radius_tree":"150"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_dark_seer_vacuum extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "dark_seer_vacuum";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_dark_seer_vacuum = Data_dark_seer_vacuum ;
}
    