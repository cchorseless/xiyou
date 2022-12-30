
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_antimage_mana_overload = {"ID":"543","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","FightRecapLevel":"1","MaxLevel":"1","IsGrantedByScepter":"1","HasScepterUpgrade":"1","AbilityCastRange":"0","AbilityCastPoint":"0.2","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2","AbilityCooldown":"20","AbilityManaCost":"50","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"7"},"02":{"var_type":"FIELD_INTEGER","outgoing_damage":"-25"},"03":{"var_type":"FIELD_INTEGER","incoming_damage":"100"}}} ;

@registerAbility()
export class ability4_antimage_mana_overload extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "antimage_mana_overload";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_antimage_mana_overload = Data_antimage_mana_overload ;
}
    