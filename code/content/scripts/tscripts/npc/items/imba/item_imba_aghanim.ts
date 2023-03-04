
//     import { AI_ability } from "../../../ai/AI_ability";
//     import { GameFunc } from "../../../GameFunc";
//     import { ResHelper } from "../../../helper/ResHelper";
//     import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
//     import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
//     import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
//     import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
//     import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
// function AghanimsSynthCast(keys) {
//     let caster = keys.caster;
//     let ability = keys.ability;
//     let modifier_synth = keys.modifier_synth;
//     let modifier_stats = keys.modifier_stats;
//     let sound_cast = keys.sound_cast;
//     if (caster.HasModifier(modifier_synth)) {
//         return undefined;
//     }
//     if (caster.HasModifier("modifier_arc_warden_tempest_double")) {
//         DisplayError(caster.GetPlayerID(), "Tempest Doubles cannot create a divergent synth modifier.");
//         return undefined;
//     }
//     caster.AddNewModifier(caster, undefined, modifier_synth, {});
//     ability.ApplyDataDrivenModifier(caster, caster, modifier_stats, {});
//     caster.EmitSound(sound_cast);
//     ability.SetCurrentCharges(ability.GetCurrentCharges() - 1);
//     caster.RemoveItem(ability);
//     let dummy_scepter = CreateItem("item_ultimate_scepter", caster, caster);
//     caster.AddItem(dummy_scepter);
//     this.AddTimer(0.01, () => {
//         caster.RemoveItem(dummy_scepter);
//     });
// }
