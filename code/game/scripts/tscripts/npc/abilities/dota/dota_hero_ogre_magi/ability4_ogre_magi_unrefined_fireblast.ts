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
export const Data_ogre_magi_unrefined_fireblast = { "ID": "5466", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "MaxLevel": "1", "FightRecapLevel": "1", "IsGrantedByScepter": "1", "HasScepterUpgrade": "1", "AbilityCastRange": "475", "AbilityCastPoint": "0.45", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "6", "AbilityManaCost": "400", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "stun_duration": "1.5", "RequiresScepter": "1" }, "02": { "var_type": "FIELD_FLOAT", "multicast_delay": "0.6", "RequiresScepter": "1" }, "03": { "var_type": "FIELD_INTEGER", "scepter_mana": "30", "RequiresScepter": "1" }, "04": { "var_type": "FIELD_INTEGER", "fireblast_damage": "275", "RequiresScepter": "1" } } };

@registerAbility()
export class ability4_ogre_magi_unrefined_fireblast extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "ogre_magi_unrefined_fireblast";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_ogre_magi_unrefined_fireblast = Data_ogre_magi_unrefined_fireblast;
}
