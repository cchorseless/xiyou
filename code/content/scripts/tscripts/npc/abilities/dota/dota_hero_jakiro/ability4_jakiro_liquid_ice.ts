
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_jakiro_liquid_ice = { "ID": "553", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AUTOCAST | DOTA_ABILITY_BEHAVIOR_ATTACK | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC | DOTA_UNIT_TARGET_BUILDING", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES | DOTA_UNIT_TARGET_FLAG_DEAD", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "Hero_Jakiro.LiquidFire", "MaxLevel": "1", "FightRecapLevel": "1", "IsGrantedByShard": "1", "HasShardUpgrade": "1", "AbilityCooldown": "12", "AbilityCastRange": "600", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilityModifierSupportBonus": "35", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "movement_slow": "20" }, "02": { "var_type": "FIELD_INTEGER", "base_damage": "20" }, "03": { "var_type": "FIELD_FLOAT", "pct_health_damage": "2.5" }, "04": { "var_type": "FIELD_FLOAT", "duration": "4.0" }, "05": { "var_type": "FIELD_INTEGER", "radius": "300" }, "06": { "var_type": "FIELD_FLOAT", "stun_duration": "0.4" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability4_jakiro_liquid_ice extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "jakiro_liquid_ice";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_jakiro_liquid_ice = Data_jakiro_liquid_ice;




}
