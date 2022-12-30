
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_dazzle_bad_juju = {"ID":"7304","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"2","AbilitySound":"Hero_Dazzle.Weave","AbilityCastRange":"1200","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","cooldown_reduction":"26 38 50"},"02":{"var_type":"FIELD_FLOAT","armor_reduction":"2 2.25 2.5","LinkedSpecialBonus":"special_bonus_unique_dazzle_4"},"03":{"var_type":"FIELD_FLOAT","duration":"8.0"},"04":{"var_type":"FIELD_INTEGER","radius":"1200"},"05":{"var_type":"FIELD_INTEGER","scepter_radius":"800","RequiresScepter":"1"},"06":{"var_type":"FIELD_INTEGER","scepter_count":"8","RequiresScepter":"1"}}} ;

@registerAbility()
export class ability6_dazzle_bad_juju extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "dazzle_bad_juju";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_dazzle_bad_juju = Data_dazzle_bad_juju ;
}
    