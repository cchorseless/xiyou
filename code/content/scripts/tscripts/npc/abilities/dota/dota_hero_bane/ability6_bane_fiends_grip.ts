
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_bane_fiends_grip = {"ID":"5013","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_CHANNELLED","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_YES_STRONG","AbilityUnitDamageType":"DAMAGE_TYPE_PURE","FightRecapLevel":"2","AbilitySound":"Hero_Bane.FiendsGrip","HasScepterUpgrade":"1","AbilityCastRange":"625","AbilityCastPoint":"0.4","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityChannelTime":"6.0 6.0 6.0","AbilityCooldown":"120 110 100","AbilityManaCost":"200 300 400","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","fiend_grip_tick_interval":"0.5"},"02":{"var_type":"FIELD_INTEGER","fiend_grip_mana_drain":"5","LinkedSpecialBonus":"special_bonus_unique_bane_9"},"03":{"var_type":"FIELD_FLOAT","abilitychanneltime":"","LinkedSpecialBonus":"special_bonus_unique_bane_3"},"04":{"var_type":"FIELD_INTEGER","fiend_grip_damage":"80 120 160"}}} ;

@registerAbility()
export class ability6_bane_fiends_grip extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "bane_fiends_grip";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_bane_fiends_grip = Data_bane_fiends_grip ;
}
    