
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_doom_bringer_doom = {"ID":"5342","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES | DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","SpellDispellableType":"SPELL_DISPELLABLE_NO","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityUnitDamageType":"DAMAGE_TYPE_PURE","FightRecapLevel":"2","HasScepterUpgrade":"1","AbilityCastPoint":"0.5","AbilityCastRange":"550 550 550","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_6","AbilityCooldown":"145.0","AbilityManaCost":"150 200 250","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"16.0","LinkedSpecialBonus":"special_bonus_unique_doom_7"},"02":{"var_type":"FIELD_INTEGER","damage":"30 45 60","LinkedSpecialBonus":"special_bonus_unique_doom_5"},"03":{"var_type":"FIELD_INTEGER","deniable_pct":"25 25 25"},"04":{"var_type":"FIELD_FLOAT","scepter_cooldown":"100.0"}}} ;

@registerAbility()
export class ability6_doom_bringer_doom extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "doom_bringer_doom";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_doom_bringer_doom = Data_doom_bringer_doom ;
}
    