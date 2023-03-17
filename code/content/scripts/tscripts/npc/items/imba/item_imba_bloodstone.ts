
//     import { AI_ability } from "../../../ai/AI_ability";
//     import { GameFunc } from "../../../GameFunc";
//     import { ResHelper } from "../../../helper/ResHelper";
//     import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
//     import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
//     import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
//     import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
//     import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
//     import * as math from "@wowts/math";
// import globals from "./globals";
// import { pairs } from "@wowts/lua";
// function Suicide(keys) {
//     let caster = keys.caster;
//     let item = keys.ability;
//     if (caster.HasModifier("modifier_imba_reincarnation")) {
//         caster.Kill(item, caster);
//     } else {
//         TrueKill(caster, caster, item);
//     }
// }
// function SetCharges(keys) {
//     let ability = keys.ability;
//     if (!ability.initialized) {
//         ability.initialized = true;
//         ability.SetCurrentCharges(ability.GetSpecialValueFor("initial_charges"));
//     }
// }
// function UpdateCharges(keys) {
//     let caster = keys.caster;
//     let item = keys.ability;
//     let charges_modifier = keys.charges_modifier;
//     let respawn_time_reduction = item.GetLevelSpecialValueFor("respawn_time_reduction", item.GetLevel() - 1);
//     let current_charges = item.GetCurrentCharges();
//     item.ApplyDataDrivenModifier(caster, caster, charges_modifier, {});
//     caster.SetModifierStackCount(charges_modifier, caster, current_charges);
//     caster.bloodstone_respawn_reduction = current_charges * respawn_time_reduction;
// }
// function GainChargesOnKill(keys) {
//     let caster = keys.caster;
//     let item = keys.ability;
//     let item_level = item.GetLevel() - 1;
//     let target = keys.target;
//     let assist_modifier = keys.assist_modifier;
//     let current_charges = item.GetCurrentCharges();
//     if (target.GetTeam() != caster.GetTeam() && !target.HasModifier(assist_modifier) && !target.IsIllusion() && !target.HasModifier("modifier_arc_warden_tempest_double")) {
//         item.SetCurrentCharges(current_charges + 1);
//     }
// }
// function GainChargesOnAssist(keys) {
//     let target = keys.unit;
//     let item = keys.ability;
//     if (!item) {
//         return;
//     }
//     let item_level = item.GetLevel() - 1;
//     let current_charges = item.GetCurrentCharges();
//     if ((!target.IsIllusion()) && !target.HasModifier("modifier_arc_warden_tempest_double")) {
//         item.SetCurrentCharges(current_charges + 1);
//     }
// }
// function LoseCharges(keys) {
//     let caster = keys.caster;
//     let item = keys.ability;
//     let item_level = item.GetLevel() - 1;
//     if (caster.HasModifier("modifier_arc_warden_tempest_double") || (!caster.IsRealUnit())) {
//         return undefined;
//     }
//     if (caster.WillReincarnate()) {
//         return undefined;
//     }
//     let on_death_charge_loss = item.GetLevelSpecialValueFor("on_death_loss", item_level);
//     let effect_radius = item.GetLevelSpecialValueFor("effect_radius", item_level);
//     let heal_on_death_base = item.GetLevelSpecialValueFor("heal_on_death_base", item_level);
//     let heal_on_death_per_charge = item.GetLevelSpecialValueFor("heal_on_death_per_charge", item_level);
//     let current_charges = item.GetCurrentCharges();
//     let total_heal = heal_on_death_base + current_charges * heal_on_death_per_charge;
//     item.SetCurrentCharges(math.floor(current_charges * on_death_charge_loss));
//     let allies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, effect_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0, false);
//     for (const [_, ally] of GameFunc.iPair(allies)) {
//         ally.ApplyHeal(total_heal, caster);
//     }
// }
// function RespawnTimeReset(keys) {
//     let caster = keys.caster;
//     caster.bloodstone_respawn_reduction = undefined;
// }
