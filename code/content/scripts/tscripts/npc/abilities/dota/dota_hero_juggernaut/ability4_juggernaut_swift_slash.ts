
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_juggernaut_swift_slash = {"ID":"419","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","AbilityUnitTargetFlags":"DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_YES","AbilityUnitDamageType":"DAMAGE_TYPE_PHYSICAL","SpellDispellableType":"SPELL_DISPELLABLE_NO","MaxLevel":"1","FightRecapLevel":"1","IsGrantedByScepter":"1","HasScepterUpgrade":"1","AbilityCastRange":"550","AbilityCastPoint":"0.3 0.3 0.3","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"20","AbilityManaCost":"125","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"0.8","RequiresScepter":"1"}}} ;

@registerAbility()
export class ability4_juggernaut_swift_slash extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "juggernaut_swift_slash";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_juggernaut_swift_slash = Data_juggernaut_swift_slash ;
}
    