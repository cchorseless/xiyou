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
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_life_stealer_ghoul_frenzy = { "ID": "631", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "movement_slow": "10 15 20 25", "LinkedSpecialBonus": "special_bonus_unique_lifestealer_6" }, "02": { "var_type": "FIELD_FLOAT", "duration": "1.5" }, "03": { "var_type": "FIELD_INTEGER", "attack_speed_bonus": "20 30 40 50", "LinkedSpecialBonus": "special_bonus_unique_lifestealer_7" } } };

@registerAbility()
export class ability3_life_stealer_ghoul_frenzy extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "life_stealer_ghoul_frenzy";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_life_stealer_ghoul_frenzy = Data_life_stealer_ghoul_frenzy;

}
