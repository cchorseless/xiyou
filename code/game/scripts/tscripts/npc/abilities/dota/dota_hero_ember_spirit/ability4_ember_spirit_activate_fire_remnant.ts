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
export const Data_ember_spirit_activate_fire_remnant = { "ID": "5607", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES", "AbilityType": "DOTA_ABILITY_TYPE_BASIC", "MaxLevel": "3", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "1", "AbilityCastRange": "99999", "AbilityCastPoint": "0.0", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "0.0", "AbilityManaCost": "150", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "speed_multiplier": "250" }, "02": { "var_type": "FIELD_INTEGER", "max_charges": "3" }, "03": { "var_type": "FIELD_FLOAT", "charge_restore_time": "35.0" }, "04": { "var_type": "FIELD_INTEGER", "damage": "100 200 300" }, "05": { "var_type": "FIELD_INTEGER", "radius": "450" }, "06": { "var_type": "FIELD_INTEGER", "speed": "1300" }, "07": { "var_type": "FIELD_INTEGER", "scepter_mana_cost": "75", "RequiresScepter": "1" }, "08": { "var_type": "FIELD_INTEGER", "shard_remnant_speed_pct": "300" } } };

@registerAbility()
export class ability4_ember_spirit_activate_fire_remnant extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "ember_spirit_activate_fire_remnant";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_ember_spirit_activate_fire_remnant = Data_ember_spirit_activate_fire_remnant;
}
