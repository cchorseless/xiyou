
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_lich_frost_nova = {"ID":"5134","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AOE","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Ability.FrostNova","AbilityCastRange":"600","AbilityCastPoint":"0.4","AbilityCooldown":"7.0","AbilityDuration":"4.0","AbilityDamage":"40 80 120 160","AbilityManaCost":"115 135 155 175","AbilityModifierSupportValue":"0.3","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","radius":"200 200 200 200","LinkedSpecialBonus":"special_bonus_unique_lich_6"},"02":{"var_type":"FIELD_INTEGER","slow_movement_speed":"-30"},"03":{"var_type":"FIELD_INTEGER","slow_attack_speed":"-30"},"04":{"var_type":"FIELD_INTEGER","aoe_damage":"80 120 160 200","LinkedSpecialBonus":"special_bonus_unique_lich_6"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_lich_frost_nova extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "lich_frost_nova";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_lich_frost_nova = Data_lich_frost_nova ;
}
    