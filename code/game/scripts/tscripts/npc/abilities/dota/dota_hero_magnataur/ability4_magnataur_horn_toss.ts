import { GameEnum } from "../../../../shared/GameEnum";
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
export const Data_magnataur_horn_toss = { "ID": "649", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "MaxLevel": "1", "FightRecapLevel": "1", "IsGrantedByShard": "1", "AbilityCastPoint": "0.2", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_5", "AbilityCooldown": "30", "AbilityManaCost": "125", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "damage": "200" }, "02": { "var_type": "FIELD_INTEGER", "radius": "325" }, "03": { "var_type": "FIELD_FLOAT", "air_duration": "0.6" }, "04": { "var_type": "FIELD_INTEGER", "air_height": "300" }, "05": { "var_type": "FIELD_FLOAT", "stun_duration": "0.75" }, "06": { "var_type": "FIELD_INTEGER", "pull_offset": "75" }, "07": { "var_type": "FIELD_INTEGER", "destination_offset": "175" }, "08": { "var_type": "FIELD_INTEGER", "pull_angle": "230" } } };

@registerAbility()
export class ability4_magnataur_horn_toss extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "magnataur_horn_toss";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_magnataur_horn_toss = Data_magnataur_horn_toss;
}
