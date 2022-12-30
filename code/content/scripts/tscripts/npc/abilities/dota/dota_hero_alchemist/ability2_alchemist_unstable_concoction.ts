
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_alchemist_unstable_concoction = {"ID":"5366","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE","AbilityUnitDamageType":"DAMAGE_TYPE_PHYSICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES_STRONG","FightRecapLevel":"1","AbilitySound":"Hero_Alchemist.UnstableConcoction.Fuse","AbilityCastRange":"775","AbilityCastPoint":"0.0","AbilityCooldown":"16","AbilityManaCost":"90 100 110 120","AbilitySpecial":{"01":{"var_type":"FIELD_FLOAT","brew_time":"5.0"},"02":{"var_type":"FIELD_FLOAT","brew_explosion":"5.5"},"03":{"var_type":"FIELD_FLOAT","min_stun":"0.25"},"04":{"var_type":"FIELD_FLOAT","max_stun":"1.75 2.5 3.25 4.0"},"05":{"var_type":"FIELD_INTEGER","min_damage":"0"},"06":{"var_type":"FIELD_INTEGER","max_damage":"150 220 290 360","LinkedSpecialBonus":"special_bonus_unique_alchemist_2"},"07":{"var_type":"FIELD_INTEGER","radius":"250"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_2"} ;

@registerAbility()
export class ability2_alchemist_unstable_concoction extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "alchemist_unstable_concoction";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_alchemist_unstable_concoction = Data_alchemist_unstable_concoction ;
}
    