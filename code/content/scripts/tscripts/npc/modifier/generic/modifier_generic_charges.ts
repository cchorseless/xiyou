
//     import { AI_ability } from "../../../ai/AI_ability";
//     import { GameFunc } from "../../../GameFunc";
//     import { ResHelper } from "../../../helper/ResHelper";
//     import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
//     import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
//     import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
//     import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
//     @registerModifier()
// export class modifier_generic_charges extends BaseModifier_Plus {
// IsHidden():boolean {
//     return false;
// }
// IsDebuff():boolean {
//     return false;
// }
// IsPurgable():boolean {
//     return false;
// }
// DestroyOnExpire():boolean {
//     return false;
// }
// RemoveOnDeath():boolean {
//     return false;
// }
// GetAttributes():DOTAModifierAttribute_t {
//     return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
// }
// BeCreated(p_0:any,):void {
//     if (!IsServer()) {
//         return;
//     }
//     this.AddTimer(1.0, () => {
//         if (this.GetCasterPlus().HasScepter() && this.GetAbilityPlus().GetTalentSpecialValueFor("max_charges_scepter") != 0) {
//             this.SetStackCount(this.GetAbilityPlus().GetTalentSpecialValueFor("max_charges_scepter"));
//             this.CalculateCharge();
//         } else if (this.GetAbilityPlus().GetTalentSpecialValueFor("max_charges") > 0) {
//             this.SetStackCount(this.GetAbilityPlus().GetTalentSpecialValueFor("max_charges"));
//             this.CalculateCharge();
//         }
//         if (this.GetAbilityPlus().RequiresScepterForCharges && this.GetAbilityPlus().RequiresScepterForCharges()) {
//             this.AddTimer(1, () => {
//                 if (this.GetCasterPlus().HasScepter()) {
//                     if (!this.GetCasterPlus().HasItemInInventory("item_ultimate_scepter")) {
//                         return;
//                     }
//                     return 1;
//                 } else {
//                     this.Destroy();
//                 }
//             });
//         }
//         CustomGameEventManager.Send_ServerToPlayer(this.GetParentPlus().GetPlayerOwner(), "init_charge_ui", {
//             unit_index: this.GetParentPlus().entindex(),
//             ability_index: this.GetRightfulAbilityIndex(),
//             charge_duration: this.GetAbilityPlus().GetTalentSpecialValueFor("charge_restore_time"),
//             scepter_charge_duration: this.GetAbilityPlus().GetTalentSpecialValueFor("charge_restore_time_scepter") || 0,
//             ability_name: this.GetAbilityPlus().GetAbilityName()
//         });
//     });
// }
// BeRefresh(params:any):void {
//     if (!IsServer()) {
//         return;
//     }
//     let max_charges = this.GetAbilityPlus().GetTalentSpecialValueFor("max_charges");
//     if (this.GetCasterPlus().HasScepter() && this.GetAbilityPlus().GetTalentSpecialValueFor("max_charges_scepter") != 0) {
//         max_charges = this.GetAbilityPlus().GetTalentSpecialValueFor("max_charges_scepter");
//     }
//     if (params.bonus_charges) {
//         this.SetStackCount(math.min(this.GetStackCount() + params.bonus_charges, max_charges));
//     }
//     this.CalculateCharge();
// }
// GetRightfulAbilityIndex() {
//     if (!IsServer()) {
//         return;
//     }
//     let ab_index = this.GetAbilityPlus().GetAbilityIndex();
//     if (this.GetAbilityPlus().GetAbilityName() == "imba_void_spirit_astral_step") {
//         ab_index = 4;
//     }
//     return ab_index;
// }
// /** DeclareFunctions():modifierfunction[] {
//     return Object.values({
//         1: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST,
//         2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
//     });
// } */
// @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
// CC_OnTooltip():number {
//     let charge_time = this.GetAbilityPlus().GetTalentSpecialValueFor("charge_restore_time") * this.GetParentPlus().GetCooldownReduction();
//     if (this.GetParentPlus().HasScepter() && this.GetAbilityPlus().GetTalentSpecialValueFor("charge_restore_time_scepter") && this.GetAbilityPlus().GetTalentSpecialValueFor("charge_restore_time_scepter") > 0) {
//         charge_time = this.GetAbilityPlus().GetTalentSpecialValueFor("charge_restore_time_scepter") * this.GetParentPlus().GetCooldownReduction();
//     }
//     return charge_time;
// }
// @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
// CC_OnAbilityFullyCast(params:ModifierAbilityEvent):void {
//     if (params.unit != this.GetParentPlus()) {
//         return;
//     }
//     if (!this.GetAbilityPlus() || this.GetAbilityPlus().IsNull()) {
//         this.Destroy();
//         return;
//     }
//     if (params.ability == this.GetAbilityPlus()) {
//         let wtf_mode = false;
//         if (!GameRules.IsCheatMode()) {
//             wtf_mode = false;
//         } else {
//             for (let ability = 0; ability <= 24 - 1; ability += 1) {
//                 if (this.GetParentPlus().GetAbilityByIndex(ability) && this.GetParentPlus().GetAbilityByIndex(ability).GetCooldownTimeRemaining() > 0) {
//                     wtf_mode = false;
//                     return;
//                 }
//             }
//             if (wtf_mode == false) {
//                 for (let item = 0; item <= 15; item += 1) {
//                     if (this.GetParentPlus().GetItemInSlot(item) && this.GetParentPlus().GetItemInSlot(item).GetCooldownTimeRemaining() > 0) {
//                         wtf_mode = false;
//                         return;
//                     }
//                 }
//             }
//         }
//         if (wtf_mode == false) {
//             this.DecrementStackCount();
//             this.AddTimer(FrameTime() * 2, () => {
//                 CustomGameEventManager.Send_ServerToPlayer(this.GetParentPlus().GetPlayerOwner(), "update_charge_count", {
//                     unit_index: this.GetParentPlus().entindex(),
//                     ability_index: this.GetRightfulAbilityIndex()
//                 });
//                 CustomGameEventManager.Send_ServerToPlayer(this.GetParentPlus().GetPlayerOwner(), "update_charge_loading", {
//                     unit_index: this.GetParentPlus().entindex(),
//                     ability_index: this.GetRightfulAbilityIndex()
//                 });
//             });
//             this.CalculateCharge();
//         }
//     } else if (params.ability.GetName() == "item_refresher" || params.ability.GetName() == "item_refresher_shard") {
//         this.StartIntervalThink(-1);
//         this.SetDuration(-1, true);
//         if (this.GetCasterPlus().HasScepter() && this.GetAbilityPlus().GetTalentSpecialValueFor("max_charges_scepter") != 0) {
//             this.SetStackCount(this.GetAbilityPlus().GetTalentSpecialValueFor("max_charges_scepter"));
//         } else {
//             this.SetStackCount(this.GetAbilityPlus().GetTalentSpecialValueFor("max_charges"));
//         }
//     }
// }
// OnIntervalThink():void {
//     this.IncrementStackCount();
//     this.StartIntervalThink(-1);
//     this.CalculateCharge();
// }
// CalculateCharge() {
//     if (this.IsHidden()) {
//         return;
//     }
//     if ((this.GetCasterPlus().HasScepter() && this.GetAbilityPlus().GetTalentSpecialValueFor("max_charges_scepter") != 0 && this.GetStackCount() >= this.GetAbilityPlus().GetTalentSpecialValueFor("max_charges_scepter")) || (this.GetAbilityPlus().GetTalentSpecialValueFor("max_charges") > 0 && this.GetStackCount() >= this.GetAbilityPlus().GetTalentSpecialValueFor("max_charges"))) {
//         this.SetDuration(-1, true);
//         this.StartIntervalThink(-1);
//     } else {
//         if (this.GetRemainingTime() <= 0.05) {
//             let charge_time = this.GetAbilityPlus().GetTalentSpecialValueFor("charge_restore_time") * this.GetParentPlus().GetCooldownReduction();
//             if (this.GetParentPlus().HasScepter() && this.GetAbilityPlus().GetTalentSpecialValueFor("charge_restore_time_scepter") && this.GetAbilityPlus().GetTalentSpecialValueFor("charge_restore_time_scepter") > 0) {
//                 charge_time = this.GetAbilityPlus().GetTalentSpecialValueFor("charge_restore_time_scepter") * this.GetParentPlus().GetCooldownReduction();
//             }
//             this.StartIntervalThink(charge_time);
//             this.SetDuration(charge_time, true);
//         }
//         if (this.GetStackCount() == 0) {
//             this.GetAbilityPlus().EndCooldown();
//             this.GetAbilityPlus().StartCooldown(this.GetRemainingTime());
//         } else {
//             this.GetAbilityPlus().EndCooldown();
//             if (this.GetAbilityPlus().GetName() != "imba_gyrocopter_homing_missile" && this.GetAbilityPlus().GetName() != "imba_void_spirit_astral_step" && this.GetAbilityPlus().GetName() != "imba_void_spirit_astral_step_helper_2") {
//                 this.GetAbilityPlus().StartCooldown(0.25);
//             }
//         }
//     }
//     this.AddTimer(FrameTime() * 2, () => {
//         CustomGameEventManager.Send_ServerToPlayer(this.GetParentPlus().GetPlayerOwner(), "update_charge_count", {
//             unit_index: this.GetParentPlus().entindex(),
//             ability_index: this.GetRightfulAbilityIndex()
//         });
//     });
// }
// }
