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
export const Data_riki_poison_dart = { "ID": "550", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "MaxLevel": "1", "FightRecapLevel": "1", "IsGrantedByShard": "1", "AbilityCastRange": "1200", "AbilityCastPoint": "0.2", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_5", "AbilityCooldown": "12", "AbilityManaCost": "85", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "4" }, "02": { "var_type": "FIELD_INTEGER", "movement_slow": "30" }, "03": { "var_type": "FIELD_FLOAT", "debuff_duration": "4" }, "04": { "var_type": "FIELD_INTEGER", "projectile_speed": "1600" }, "05": { "var_type": "FIELD_INTEGER", "damage": "150" }, "06": { "var_type": "FIELD_INTEGER", "armor_reduction": "4" } } };

@registerAbility()
export class ability4_riki_poison_dart extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "riki_poison_dart";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_riki_poison_dart = Data_riki_poison_dart;
}
