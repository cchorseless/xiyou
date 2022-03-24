
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_zuus_cloud = { "ID": "6325", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_HIDDEN | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "MaxLevel": "1", "FightRecapLevel": "1", "IsGrantedByScepter": "1", "HasScepterUpgrade": "1", "AbilitySound": "Hero_Zuus.Cloud.Cast", "AbilityCastRange": "0", "AbilityCastPoint": "0.2", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "45", "AbilityManaCost": "325", "AbilityModifierSupportValue": "0.1", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "cloud_duration": "35", "RequiresScepter": "1" }, "02": { "var_type": "FIELD_FLOAT", "cloud_bolt_interval": "2.25", "RequiresScepter": "1" }, "03": { "var_type": "FIELD_INTEGER", "cloud_radius": "450", "RequiresScepter": "1" }, "04": { "var_type": "FIELD_INTEGER", "hits_to_kill_tooltip": "8", "RequiresScepter": "1" }, "05": { "var_type": "FIELD_INTEGER", "creep_hits_to_kill_tooltip": "16", "RequiresScepter": "1" }, "06": { "var_type": "FIELD_INTEGER", "cloud_bounty_tooltip": "100", "RequiresScepter": "1" } } };

@registerAbility()
export class ability4_zuus_cloud extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "zuus_cloud";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_zuus_cloud = Data_zuus_cloud;
}
