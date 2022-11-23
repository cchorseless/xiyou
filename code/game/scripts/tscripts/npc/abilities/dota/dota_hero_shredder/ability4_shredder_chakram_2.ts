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
export const Data_shredder_chakram_2 = { "ID": "5645", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES", "AbilityUnitDamageType": "DAMAGE_TYPE_PURE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "1", "MaxLevel": "3", "IsGrantedByScepter": "1", "HasScepterUpgrade": "1", "AbilityCastRange": "1200 1200 1200", "AbilityCastPoint": "0.15", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_6", "AbilityCooldown": "8.0 8.0 8.0", "AbilityManaCost": "80 140 200", "AbilitySpecial": { "10": { "var_type": "FIELD_INTEGER", "slow_health_percentage": "5", "RequiresScepter": "1" }, "01": { "var_type": "FIELD_FLOAT", "speed": "900.0", "RequiresScepter": "1" }, "02": { "var_type": "FIELD_INTEGER", "radius": "200", "RequiresScepter": "1" }, "03": { "var_type": "FIELD_INTEGER", "pass_damage": "100 140 180", "RequiresScepter": "1" }, "04": { "var_type": "FIELD_INTEGER", "damage_per_second": "50 75 100", "RequiresScepter": "1" }, "05": { "var_type": "FIELD_INTEGER", "slow": "5", "RequiresScepter": "1" }, "06": { "var_type": "FIELD_FLOAT", "damage_interval": "0.5", "RequiresScepter": "1" }, "07": { "var_type": "FIELD_FLOAT", "break_distance": "2000.0", "RequiresScepter": "1" }, "08": { "var_type": "FIELD_FLOAT", "mana_per_second": "16 23 30", "RequiresScepter": "1" }, "09": { "var_type": "FIELD_FLOAT", "pass_slow_duration": "0.5", "RequiresScepter": "1" } } };

@registerAbility()
export class ability4_shredder_chakram_2 extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "shredder_chakram_2";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_shredder_chakram_2 = Data_shredder_chakram_2;
}
