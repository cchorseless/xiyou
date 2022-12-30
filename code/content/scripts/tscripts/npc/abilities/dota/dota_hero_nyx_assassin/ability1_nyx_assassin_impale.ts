
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_nyx_assassin_impale = {"ID":"5462","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES_STRONG","FightRecapLevel":"1","AbilitySound":"Hero_NyxAssassin.Impale","AbilityCastRange":"700","AbilityCastPoint":"0.3","AbilityCooldown":"14","AbilityManaCost":"105 120 135 150","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","width":"125 125 125 125"},"02":{"var_type":"FIELD_FLOAT","duration":"1.4 1.8 2.2 2.6","LinkedSpecialBonus":"special_bonus_unique_nyx_4"},"03":{"var_type":"FIELD_INTEGER","length":"700"},"04":{"var_type":"FIELD_INTEGER","speed":"1600"},"05":{"var_type":"FIELD_INTEGER","cooldown_upgrade":"7"},"06":{"var_type":"FIELD_INTEGER","impale_damage":"100 160 220 280","LinkedSpecialBonus":"special_bonus_unique_nyx_2"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_nyx_assassin_impale extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "nyx_assassin_impale";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_nyx_assassin_impale = Data_nyx_assassin_impale ;
}
    