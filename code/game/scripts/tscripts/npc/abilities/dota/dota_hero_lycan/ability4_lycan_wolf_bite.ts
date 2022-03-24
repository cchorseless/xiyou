
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_lycan_wolf_bite = {"ID":"333","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_FRIENDLY","AbilityUnitTargetType":"DOTA_UNIT_TARGET_HERO","SpellDispellableType":"SPELL_DISPELLABLE_NO","SpellImmunityType":"SPELL_IMMUNITY_ALLIES_YES","MaxLevel":"1","FightRecapLevel":"1","IsGrantedByScepter":"1","HasScepterUpgrade":"1","AbilityCastPoint":"0.3 0.3 0.3 0.3","AbilityCastRange":"300","AbilityCooldown":"80","AbilityManaCost":"150","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","lifesteal_percent":"30"},"02":{"var_type":"FIELD_INTEGER","lifesteal_range":"1200"}}} ;

@registerAbility()
export class ability4_lycan_wolf_bite extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "lycan_wolf_bite";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_lycan_wolf_bite = Data_lycan_wolf_bite ;
}
    