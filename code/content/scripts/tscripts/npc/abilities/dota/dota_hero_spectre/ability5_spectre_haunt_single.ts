import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
/** dota原技能数据 */
export const Data_spectre_haunt_single = { "ID": "7851", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "FightRecapLevel": "2", "MaxLevel": "3", "AbilitySound": "Hero_Spectre.Haunt", "HasScepterUpgrade": "1", "IsGrantedByScepter": "1", "AbilityDraftPreAbility": "spectre_reality", "AbilityCastPoint": "0.3 0.3 0.3", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "30", "AbilityManaCost": "180", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "5.0 6.0 7.0", "RequiresScepter": "1" }, "02": { "var_type": "FIELD_INTEGER", "illusion_damage_outgoing": "-60 -40 -20", "RequiresScepter": "1" }, "03": { "var_type": "FIELD_INTEGER", "tooltip_outgoing": "40 60 80", "LinkedSpecialBonus": "special_bonus_unique_spectre_4", "RequiresScepter": "1" }, "04": { "var_type": "FIELD_INTEGER", "illusion_damage_incoming": "100 100 100", "RequiresScepter": "1" }, "05": { "var_type": "FIELD_INTEGER", "tooltip_illusion_total_damage_incoming": "200 200 200", "RequiresScepter": "1" }, "06": { "var_type": "FIELD_FLOAT", "attack_delay": "0", "RequiresScepter": "1" }, "07": { "var_type": "FIELD_FLOAT", "tooltip_cooldown": "35", "RequiresScepter": "1" } } };

@registerAbility()
export class ability5_spectre_haunt_single extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "spectre_haunt_single";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_spectre_haunt_single = Data_spectre_haunt_single;
}
