
import { GameEnum } from "../../../../GameEnum";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_snapfire_mortimer_kisses = { "ID": "6482", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_MOVEMENT | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "Hero_Snapfire.MortimerBlob.Launch", "AbilityDraftUltScepterAbility": "snapfire_gobble_up", "AbilityDraftUltScepterPreAbility": "snapfire_spit_creep", "AbilityCastRange": "3000", "AbilityCastPoint": "0.5", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "AbilityCooldown": "110", "AbilityDuration": "6.0", "AbilityManaCost": "125 150 175", "AbilitySpecial": { "10": { "var_type": "FIELD_INTEGER", "burn_damage": "50 75 100" }, "11": { "var_type": "FIELD_INTEGER", "move_slow_pct": "15 20 25", "LinkedSpecialBonus": "special_bonus_unique_snapfire_4" }, "12": { "var_type": "FIELD_FLOAT", "burn_ground_duration": "3.0" }, "13": { "var_type": "FIELD_FLOAT", "dist_change_speed": "75" }, "14": { "var_type": "FIELD_INTEGER", "min_range": "600" }, "15": { "var_type": "FIELD_FLOAT", "min_lob_travel_time": "0.8" }, "16": { "var_type": "FIELD_FLOAT", "max_lob_travel_time": "2.0" }, "17": { "var_type": "FIELD_FLOAT", "delay_after_last_projectile": "0.5" }, "18": { "var_type": "FIELD_FLOAT", "burn_linger_duration": "1.0" }, "01": { "var_type": "FIELD_INTEGER", "projectile_count": "8", "LinkedSpecialBonus": "special_bonus_unique_snapfire_1" }, "02": { "var_type": "FIELD_INTEGER", "projectile_speed": "1300" }, "03": { "var_type": "FIELD_INTEGER", "projectile_width": "130" }, "04": { "var_type": "FIELD_INTEGER", "impact_radius": "275" }, "05": { "var_type": "FIELD_INTEGER", "damage_per_impact": "160 240 320" }, "06": { "var_type": "FIELD_FLOAT", "duration_tooltip": "6.0" }, "07": { "var_type": "FIELD_INTEGER", "projectile_vision": "500" }, "08": { "var_type": "FIELD_FLOAT", "turn_rate": "75" }, "09": { "var_type": "FIELD_FLOAT", "burn_interval": "0.5" } } };

@registerAbility()
export class ability6_snapfire_mortimer_kisses extends BaseAbility_Plus {
        /**对应dota内的名字 */
        __IN_DOTA_NAME__ = "snapfire_mortimer_kisses";
        /**对应dota内的数据 */
        __IN_DOTA_DATA__: typeof Data_snapfire_mortimer_kisses = Data_snapfire_mortimer_kisses;
        Init() {
                this.SetDefaultSpecialValue("min_lob_travel_time", 0.8);
                this.SetDefaultSpecialValue("max_lob_travel_time", 2);
                this.SetDefaultSpecialValue("burn_interval", 1);
                this.SetDefaultSpecialValue("burn_duration", 5);
                this.SetDefaultSpecialValue("duration", 15);
                this.SetDefaultSpecialValue("projectile_count", [5, 6, 7, 8, 10, 12]);
                this.SetDefaultSpecialValue("projectile_speed", 1300);
                this.SetDefaultSpecialValue("projectile_width", 130);
                this.SetDefaultSpecialValue("impact_radius", 275);
                this.SetDefaultSpecialValue("impact_damage", [1500, 2000, 3500, 5000, 8000, 12000]);
                this.SetDefaultSpecialValue("impact_damage_str_factor", [5, 6, 7, 9, 11, 14]);
                this.SetDefaultSpecialValue("impact_per_damage_percent", 70);
                this.SetDefaultSpecialValue("burn_ground_duration", 5);
                this.SetDefaultSpecialValue("interval", 1);

        }



}
