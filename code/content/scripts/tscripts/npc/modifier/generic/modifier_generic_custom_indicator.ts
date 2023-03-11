
//     import { AI_ability } from "../../../ai/AI_ability";
//     import { GameFunc } from "../../../GameFunc";
//     import { ResHelper } from "../../../helper/ResHelper";
//     import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
//     import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
//     import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
//     import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
//     @registerModifier()
// export class modifier_generic_custom_indicator extends BaseModifier_Plus {
// public init : any; 
// IsHidden():boolean {
//     return true;
// }
// IsPurgable():boolean {
//     return true;
// }
// GetAttributes():DOTAModifierAttribute_t {
//     return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT + DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
// }
// BeCreated(kv:any):void {
//     if (IsServer()) {
//         return;
//     }
//     this.GetAbilityPlus().custom_indicator = this;
// }
// BeRefresh(kv:any):void {
// }
// BeRemoved():void {
// }
// BeDestroy():void {
// }
// OnIntervalThink():void {
//     if (IsClient()) {
//         this.StartIntervalThink(-1);
//         let ability = this.GetAbilityPlus();
//         if (this.init && ability.DestroyCustomIndicator) {
//             this.init = undefined;
//             ability.DestroyCustomIndicator();
//         }
//     }
// }
// Register(loc) {
//     let ability = this.GetAbilityPlus();
//     if ((!this.init) && ability.CreateCustomIndicator) {
//         this.init = true;
//         ability.CreateCustomIndicator();
//     }
//     if (ability.UpdateCustomIndicator) {
//         ability.UpdateCustomIndicator(loc);
//     }
//     this.StartIntervalThink(0.1);
// }
// }
