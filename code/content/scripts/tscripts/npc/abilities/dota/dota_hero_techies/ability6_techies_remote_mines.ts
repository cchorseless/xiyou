
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";
import { unit_remote_mine } from "../../../units/common/unit_remote_mine";

/** dota原技能数据 */
export const Data_techies_remote_mines = { "ID": "5602", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_NORMAL_WHEN_STOLEN", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_6", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "HasScepterUpgrade": "1", "AbilityDraftPreAbility": "techies_focused_detonate", "AbilityCastRange": "500", "AbilityCastPoint": "0.75", "AbilityCooldown": "8", "AbilityManaCost": "120 180 240", "AbilitySpecial": { "10": { "var_type": "FIELD_FLOAT", "vision_duration": "3.0" }, "11": { "var_type": "FIELD_INTEGER", "model_scale": "0 10 20" }, "12": { "var_type": "FIELD_FLOAT", "detonate_delay": "0.25" }, "01": { "var_type": "FIELD_INTEGER", "max_mines": "21" }, "02": { "var_type": "FIELD_INTEGER", "damage": "300 450 600" }, "03": { "var_type": "FIELD_INTEGER", "radius": "425" }, "04": { "var_type": "FIELD_FLOAT", "duration": "600.0" }, "05": { "var_type": "FIELD_FLOAT", "activation_time": "2.0" }, "06": { "var_type": "FIELD_INTEGER", "damage_scepter": "450 600 750", "RequiresScepter": "1" }, "07": { "var_type": "FIELD_INTEGER", "radius_scepter": "425", "RequiresScepter": "1" }, "08": { "var_type": "FIELD_INTEGER", "cast_range_scepter_bonus": "300", "RequiresScepter": "1" }, "09": { "var_type": "FIELD_INTEGER", "vision_radius": "500" } } };

@registerAbility()
export class ability6_techies_remote_mines extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "techies_remote_mines";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_techies_remote_mines = Data_techies_remote_mines;


    GetManaCost() {
        return 10
    }

    OnSpellStart() {
        let caster = this.GetCasterPlus()
        unit_remote_mine.CreateOne(this.GetCursorPosition(), DOTATeam_t.DOTA_TEAM_GOODGUYS, true, caster, caster);
    }

}
