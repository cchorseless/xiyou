import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
/** dota原技能数据 */
export const Data_templar_assassin_trap_teleport = { "ID": "7853", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES | DOTA_ABILITY_BEHAVIOR_CHANNELLED | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE", "MaxLevel": "3", "FightRecapLevel": "1", "IsGrantedByScepter": "1", "HasScepterUpgrade": "1", "AbilityDraftPreAbility": "templar_assassin_trap", "AbilityCastPoint": "0.2", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2", "AbilityChannelTime": "1.0", "AbilityCooldown": "10", "AbilityManaCost": "50", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "trap_radius": "400", "RequiresScepter": "1" }, "02": { "var_type": "FIELD_FLOAT", "trap_duration": "5.0", "RequiresScepter": "1" }, "03": { "var_type": "FIELD_INTEGER", "trap_bonus_damage": "250 300 350", "RequiresScepter": "1" }, "04": { "var_type": "FIELD_INTEGER", "movement_speed_min": "30", "RequiresScepter": "1" }, "05": { "var_type": "FIELD_INTEGER", "movement_speed_max": "60", "RequiresScepter": "1" }, "06": { "var_type": "FIELD_FLOAT", "trap_max_charge_duration": "4", "RequiresScepter": "1" }, "07": { "var_type": "FIELD_INTEGER", "tooltip_channel_time": "1", "RequiresScepter": "1" }, "08": { "var_type": "FIELD_INTEGER", "tooltip_cooldown": "30", "RequiresScepter": "1" } } };

@registerAbility()
export class ability5_templar_assassin_trap_teleport extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "templar_assassin_trap_teleport";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_templar_assassin_trap_teleport = Data_templar_assassin_trap_teleport;
}
