
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_clinkz_burning_army = {"ID":"7319","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_VECTOR_TARGETING | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES","AbilityUnitDamageType":"DAMAGE_TYPE_PHYSICAL","MaxLevel":"1","FightRecapLevel":"1","IsGrantedByScepter":"1","HasScepterUpgrade":"1","AbilitySound":"Hero_Clinkz.DeathPact","AbilityCastRange":"1200","AbilityCastPoint":"0","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"80","AbilityManaCost":"150","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","range":"1300"},"02":{"var_type":"FIELD_FLOAT","duration":"20"},"03":{"var_type":"FIELD_INTEGER","count":"5"},"04":{"var_type":"FIELD_FLOAT","attack_rate":"1.6"},"05":{"var_type":"FIELD_INTEGER","damage_percent":"30"},"07":{"var_type":"FIELD_FLOAT","spawn_interval":"0.5"}}} ;

@registerAbility()
export class ability4_clinkz_burning_army extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "clinkz_burning_army";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_clinkz_burning_army = Data_clinkz_burning_army ;
}
    