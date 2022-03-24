
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_legion_commander_overwhelming_odds = {"ID":"5595","AbilityBehavior":"DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING","AbilityUnitDamageType":"DAMAGE_TYPE_MAGICAL","SpellImmunityType":"SPELL_IMMUNITY_ENEMIES_NO","SpellDispellableType":"SPELL_DISPELLABLE_YES","FightRecapLevel":"1","AbilitySound":"Hero_LegionCommander.Overwhelming.Location","AbilityCooldown":"15","AbilityCastRange":"1000","AbilityCastPoint":"0.3 0.3 0.3 0.3","AbilityManaCost":"100 110 120 130","AbilitySpecial":{"01":{"var_type":"FIELD_INTEGER","damage":"40 60 80 100"},"02":{"var_type":"FIELD_INTEGER","damage_per_unit":"14 16 18 20"},"03":{"var_type":"FIELD_INTEGER","damage_per_hero":"30 60 90 120","LinkedSpecialBonus":"special_bonus_unique_legion_commander_4"},"04":{"var_type":"FIELD_INTEGER","illusion_dmg_pct":"25","CalculateSpellDamageTooltip":"1"},"05":{"var_type":"FIELD_INTEGER","bonus_speed_creeps":"3"},"06":{"var_type":"FIELD_INTEGER","bonus_speed_heroes":"9"},"07":{"var_type":"FIELD_FLOAT","duration":"7.0"},"08":{"var_type":"FIELD_INTEGER","radius":"330 340 350 360"}},"AbilityCastAnimation":"ACT_DOTA_CAST_ABILITY_1"} ;

@registerAbility()
export class ability1_legion_commander_overwhelming_odds extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "legion_commander_overwhelming_odds";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_legion_commander_overwhelming_odds = Data_legion_commander_overwhelming_odds ;
}
    