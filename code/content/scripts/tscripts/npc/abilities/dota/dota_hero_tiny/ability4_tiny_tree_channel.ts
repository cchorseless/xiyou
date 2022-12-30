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
export const Data_tiny_tree_channel = { "ID": "7850", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_CHANNELLED  | DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "FightRecapLevel": "1", "MaxLevel": "1", "HasScepterUpgrade": "1", "IsGrantedByScepter": "1", "AbilityChannelTime": "2.4", "AbilityCastRange": "1200", "AbilityCastPoint": "0.2", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityChannelAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "15", "AbilityManaCost": "200", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "speed": "1000.0", "RequiresScepter": "1" }, "02": { "var_type": "FIELD_INTEGER", "range": "1200", "RequiresScepter": "1" }, "03": { "var_type": "FIELD_INTEGER", "splash_radius": "400", "RequiresScepter": "1" }, "04": { "var_type": "FIELD_INTEGER", "tree_grab_radius": "525", "RequiresScepter": "1" }, "05": { "var_type": "FIELD_FLOAT", "interval": "0.4", "RequiresScepter": "1" }, "06": { "var_type": "FIELD_INTEGER", "bonus_damage": "0", "RequiresScepter": "1", "CalculateSpellDamageTooltip": "0" }, "07": { "var_type": "FIELD_INTEGER", "abilitychanneltime": "", "RequiresScepter": "1" } } };

@registerAbility()
export class ability4_tiny_tree_channel extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "tiny_tree_channel";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_tiny_tree_channel = Data_tiny_tree_channel;
}
