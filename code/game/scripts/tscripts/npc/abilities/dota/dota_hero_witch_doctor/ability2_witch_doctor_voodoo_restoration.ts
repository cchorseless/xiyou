
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_witch_doctor_voodoo_restoration = { "ID": "5139", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_TOGGLE | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "SpellImmunityType": "SPELL_IMMUNITY_ALLIES_YES", "AbilitySound": "Hero_WitchDoctor.Voodoo_Restoration", "AbilityCooldown": "0.0 0.0 0.0 0.0", "AbilityManaCost": "35 40 45 50", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "mana_per_second": "8 12 16 20" }, "02": { "var_type": "FIELD_INTEGER", "radius": "500" }, "03": { "var_type": "FIELD_INTEGER", "heal": "16 24 32 40" }, "04": { "var_type": "FIELD_FLOAT", "heal_interval": "0.33 0.33 0.33 0.33" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_witch_doctor_voodoo_restoration extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "witch_doctor_voodoo_restoration";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_witch_doctor_voodoo_restoration = Data_witch_doctor_voodoo_restoration;
}
