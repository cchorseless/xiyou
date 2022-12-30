
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_broodmother_insatiable_hunger = {"ID":"5282","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET","SpellDispellableType":"SPELL_DISPELLABLE_NO","FightRecapLevel":"2","AbilityCastPoint":"0.2 0.2 0.2","AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_4","AbilityCooldown":"40 35 30 25","AbilityManaCost":"50 60 70 80","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","bonus_damage":"35 40 45 50","LinkedSpecialBonus":"special_bonus_unique_broodmother_1"},"02":{"var_type":"FIELD_INTEGER","lifesteal_pct":"70 80 90 100","LinkedSpecialBonus":"special_bonus_unique_broodmother_1"},"03":{"var_type":"FIELD_FLOAT","duration":"8 10 12 14"}}} ;

@registerAbility()
export class ability1_broodmother_insatiable_hunger extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "broodmother_insatiable_hunger";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_broodmother_insatiable_hunger = Data_broodmother_insatiable_hunger ;
}
    