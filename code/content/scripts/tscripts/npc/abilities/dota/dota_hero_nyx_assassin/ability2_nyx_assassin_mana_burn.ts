
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_nyx_assassin_mana_burn = {"ID":"5463","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","FightRecapLevel":"1","AbilitySound":"Hero_NyxAssassin.ManaBurn.Target","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","AbilityCastRange":"600 600 600 600","AbilityCastPoint":"0.4 0.4 0.4 0.4","AbilityCooldown":"28.0 20.0 12.0 4.0","AbilityManaCost":"100","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","float_multiplier":"3.5 4 4.5 5"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_nyx_assassin_mana_burn extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "nyx_assassin_mana_burn";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_nyx_assassin_mana_burn = Data_nyx_assassin_mana_burn ;
}
    