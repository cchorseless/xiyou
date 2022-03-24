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
export const Data_shredder_flamethrower = { "ID": "651", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "MaxLevel": "1", "FightRecapLevel": "1", "IsGrantedByShard": "1", "AbilityCastPoint": "0", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "18", "AbilityManaCost": "100", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "damage_per_second": "90" }, "02": { "var_type": "FIELD_INTEGER", "duration": "7" }, "03": { "var_type": "FIELD_INTEGER", "width": "275" }, "04": { "var_type": "FIELD_INTEGER", "length": "400" } } };

@registerAbility()
export class ability5_shredder_flamethrower extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "shredder_flamethrower";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_shredder_flamethrower = Data_shredder_flamethrower;
}
