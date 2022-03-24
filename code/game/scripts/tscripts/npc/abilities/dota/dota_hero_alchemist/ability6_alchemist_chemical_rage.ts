
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_alchemist_chemical_rage = {"ID":"5369","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET","AbilityType":"DOTA_ABILITY_TYPE_ULTIMATE","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"2","AbilitySound":"Hero_Alchemist.ChemicalRage.Cast","HasScepterUpgrade":"1","AbilityDraftUltShardAbility":"alchemist_berserk_potion","AbilityCastPoint":"0.0","AbilityCastAnimation":"ACT_INVALID","AbilityCooldown":"55.0","AbilityManaCost":"50 100 150","AbilitySpecial":{"10":{"var_type":"FIELD_INTEGER","scepter_spell_amp":"5","RequiresScepter":"1"},"01":{"var_type":"FIELD_FLOAT","duration":"25.0"},"02":{"var_type":"FIELD_FLOAT","transformation_time":"0.35"},"03":{"var_type":"FIELD_FLOAT","base_attack_time":"1.2 1.1 1.0","LinkedSpecialBonus":"special_bonus_unique_alchemist_3"},"04":{"var_type":"FIELD_INTEGER","bonus_health":"0"},"05":{"var_type":"FIELD_INTEGER","bonus_health_regen":"50 75 100","LinkedSpecialBonus":"special_bonus_unique_alchemist_4"},"06":{"var_type":"FIELD_FLOAT","bonus_mana_regen":"0"},"07":{"var_type":"FIELD_INTEGER","bonus_movespeed":"40 50 60","LinkedSpecialBonus":"special_bonus_unique_alchemist_6"},"08":{"var_type":"FIELD_FLOAT","scepter_gold_damage":"2","RequiresScepter":"1"},"09":{"var_type":"FIELD_INTEGER","scepter_bonus_damage":"20","RequiresScepter":"1"}}} ;

@registerAbility()
export class ability6_alchemist_chemical_rage extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "alchemist_chemical_rage";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_alchemist_chemical_rage = Data_alchemist_chemical_rage ;
}
    