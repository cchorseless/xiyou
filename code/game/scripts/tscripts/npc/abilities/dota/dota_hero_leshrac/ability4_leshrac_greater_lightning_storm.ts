
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_leshrac_greater_lightning_storm = {"ID":"539","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE| DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","AbilityUnitTargetTeam":"DOTA_UNIT_TARGET_TEAM_ENEMY","AbilityUnitDamageType":"DAMAGE_TYPE_PHYSICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","FightRecapLevel":"1","HasScepterUpgrade":"1","MaxLevel":"1","IsGrantedByScepter":"1","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_5","AbilityCastGestureSlot":"DEFAULT","AbilityCooldown":"25","AbilityManaCost":"75","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","duration":"4"},"02":{"var_type":"FIELD_INTEGER","magic_amp":"30"},"03":{"var_type":"FIELD_INTEGER","slow":"30"},"04":{"var_type":"FIELD_INTEGER","radius":"450"}}} ;

@registerAbility()
export class ability4_leshrac_greater_lightning_storm extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "leshrac_greater_lightning_storm";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_leshrac_greater_lightning_storm = Data_leshrac_greater_lightning_storm ;
}
    