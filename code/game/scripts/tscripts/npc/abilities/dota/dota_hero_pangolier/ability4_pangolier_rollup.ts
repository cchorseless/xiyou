
import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_pangolier_rollup = { "ID": "8027", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET |  DOTA_ABILITY_BEHAVIOR_HIDDEN  | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "MaxLevel": "1", "FightRecapLevel": "1", "IsGrantedByShard": "1", "AbilityCastRange": "0", "AbilityCastPoint": "0.1", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "30", "AbilityManaCost": "50", "AbilityDamage": "200", "precache": { "model": "models/heroes/pangolier/pangolier_gyroshell2.vmdl" }, "AbilitySpecial": { "10": { "var_type": "FIELD_INTEGER", "knockback_radius": "150" }, "11": { "var_type": "FIELD_FLOAT", "duration": "4.0" }, "12": { "var_type": "FIELD_FLOAT", "jump_recover_time": "0.25" }, "01": { "var_type": "FIELD_FLOAT", "cast_time_tooltip": "0.5" }, "02": { "var_type": "FIELD_FLOAT", "tick_interval": "0.05" }, "03": { "var_type": "FIELD_FLOAT", "forward_move_speed": "600" }, "04": { "var_type": "FIELD_FLOAT", "turn_rate_boosted": "275" }, "05": { "var_type": "FIELD_FLOAT", "turn_rate": "275" }, "06": { "var_type": "FIELD_INTEGER", "radius": "400" }, "07": { "var_type": "FIELD_INTEGER", "hit_radius": "150" }, "08": { "var_type": "FIELD_FLOAT", "bounce_duration": "0.4" }, "09": { "var_type": "FIELD_FLOAT", "stun_duration": "1.0 1.25 1.5" } } };

@registerAbility()
export class ability4_pangolier_rollup extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "pangolier_rollup";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_pangolier_rollup = Data_pangolier_rollup;
}
