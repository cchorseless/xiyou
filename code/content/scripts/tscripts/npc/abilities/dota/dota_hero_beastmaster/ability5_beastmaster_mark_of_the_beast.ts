
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_beastmaster_mark_of_the_beast = {"ID":"602","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","MaxLevel":"1","FightRecapLevel":"1","IsGrantedByScepter":"1","HasScepterUpgrade":"1","AbilityCastRange":"800","AbilityCastPoint":"0.2","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"16.0","AbilityManaCost":"75","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"6","RequiresScepter":"1"},"02":{"var_type":"FIELD_INTEGER","target_crit_multiplier":"160","RequiresScepter":"1"}}} ;

@registerAbility()
export class ability5_beastmaster_mark_of_the_beast extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "beastmaster_mark_of_the_beast";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_beastmaster_mark_of_the_beast = Data_beastmaster_mark_of_the_beast ;
}
    