
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_meepo_ransack = {"ID":"7318","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_PASSIVE","AbilityUnitDamageType":"DAMAGE_TYPE_PURE","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","AbilitySound":"Hero_Meepo.Geostrike","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","health_steal_heroes":"6 10 14 18","LinkedSpecialBonus":"special_bonus_unique_meepo_6"},"02":{"var_type":"FIELD_INTEGER","health_steal_creeps":"4 6 8 10","LinkedSpecialBonus":"special_bonus_unique_meepo_6"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_3"} ;

@registerAbility()
export class ability3_meepo_ransack extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "meepo_ransack";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_meepo_ransack = Data_meepo_ransack ;
}
    