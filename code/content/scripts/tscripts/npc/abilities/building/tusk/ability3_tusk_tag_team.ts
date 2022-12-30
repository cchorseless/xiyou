
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_tusk_tag_team = {"ID":"7322","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_PHYSICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","AbilitySound":"Hero_Tusk.FrozenSigil","AbilityCastPoint":"0","AbilityCastRange":"500","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3","AbilityCastGestureSlot":"DEFAULT","AbilityCooldown":"24 21 18 15","AbilityManaCost":"70","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_damage":"20 45 70 95"},"02":{"var_type":"FIELD_INTEGER","movement_slow":"75"},"03":{"var_type":"FIELD_FLOAT","slow_duration":"0.4"},"04":{"var_type":"FIELD_FLOAT","debuff_duration":"5"},"05":{"var_type":"FIELD_INTEGER","radius":"350"}}} ;

@registerAbility()
export class ability3_tusk_tag_team extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "tusk_tag_team";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_tusk_tag_team = Data_tusk_tag_team ;
}
    