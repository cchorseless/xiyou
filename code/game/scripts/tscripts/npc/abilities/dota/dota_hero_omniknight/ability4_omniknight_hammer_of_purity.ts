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
export const Data_omniknight_hammer_of_purity = { "ID": "656", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AUTOCAST | DOTA_ABILITY_BEHAVIOR_ATTACK | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilityUnitDamageType": "DAMAGE_TYPE_PURE", "MaxLevel": "1", "HasShardUpgrade": "1", "IsGrantedByShard": "1", "AbilityCastRange": "150", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilityCooldown": "4", "AbilityDamage": "0 0 0 0", "AbilityManaCost": "20", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "base_damage": "115" }, "02": { "var_type": "FIELD_INTEGER", "bonus_damage": "60" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability4_omniknight_hammer_of_purity extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "omniknight_hammer_of_purity";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_omniknight_hammer_of_purity = Data_omniknight_hammer_of_purity;
}
