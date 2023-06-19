// import { EBATTLE_ATTACK_STATE } from "../../../rules/System/BattleSystemComponent";
// import { PropertyConfig } from "../../../shared/PropertyConfig";
// import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
// import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
// import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

// @registerAbility()
// export class jakiro_1 extends BaseAbility_Plus {
//     GetIntrinsicModifierName() {
//         return "modifier_jakiro_1"
//     }
// }

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// // Modifiers
// @registerModifier()
// export class modifier_jakiro_1 extends BaseModifier_Plus {
//     IsHidden() {
//         return true
//     }
//     GetPriority() {
//         return modifierpriority.MODIFIER_PRIORITY_SUPER_ULTRA
//     }

//     CheckState() {
//         return {
//             [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
//             [modifierstate.MODIFIER_STATE_DISARMED]: true
//         }
//     }
//     @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
//     CC_ON_ATTACK_LANDED(params: ModifierAttackEvent) {
//         let hParent = this.GetParentPlus()
//         let hTarget = params.target
//         if (params.attacker == hParent) {
//             if (hParent.HasModifier("modifier_jakiro_3_ice")) {
//                 //  冰形态攻击减速
//                 hTarget.AddNewModifier(hParent, this.GetAbilityPlus(), "modifier_jakiro_1_slow", { duration: this.GetSpecialValueFor("slow_duration") * hTarget.GetStatusResistanceFactor() })
//             } else {
//                 //  火形态攻击燃烧
//                 hTarget.AddNewModifier(hParent, this.GetAbilityPlus(), "modifier_jakiro_1_ignite", { duration: this.GetSpecialValueFor("ignite_duration") })
//             }
//         }
//     }
//     @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
//     CC_OnAttack(params: ModifierAttackEvent) {
//         if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
//             return
//         }
//         if (params.attacker == this.GetParentPlus() &&
//             !params.attacker.PassivesDisabled() &&
//             !GBattleSystem.AttackFilter(params.record, EBATTLE_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK) &&
//             params.attacker.HasModifier("modifier_jakiro_3_ice")) {	//  冰形态分裂攻击
//             let tTargets = FindUnitsInRadius(params.attacker.GetTeamNumber(), params.attacker.GetAbsOrigin(), null, params.attacker.GetBaseAttackRange(), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false)
//             let attack_split = this.GetCasterPlus().GetActiveEgg() * 2
//             for (let hUnit of (tTargets)) {

//                 if (attack_split > 0) {
//                     let iAttackState = EBATTLE_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB + EBATTLE_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS + EBATTLE_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + EBATTLE_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + EBATTLE_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE + EBATTLE_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + EBATTLE_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING
//                     params.attacker.Attack(hUnit, iAttackState)
//                     attack_split = attack_split - 1
//                 }
//                 if (attack_split <= 0) {
//                     break
//                 }
//             }
//         }
//     }
//     @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
//     CC_OnAbilityExecuted(params: ModifierAbilityEvent) {
//         if (IsServer()) {
//             EachUnits((hUnit) => {
//                 if (hUnit.IsAlive()) {
//                     let iAttackState = EBATTLE_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB + EBATTLE_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS + EBATTLE_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + EBATTLE_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + EBATTLE_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE + EBATTLE_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + EBATTLE_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING
//                     this.GetParentPlus().Attack(hUnit, iAttackState)
//                 }
//             }, UnitType.Building)
//         }
//     }
//     @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
//     CC_OnAttackStart(params: ModifierAttackEvent) {
//         if (params.attacker == this.GetParentPlus()) {
//             params.attacker.StartGesture(GameActivity_t.ACT_DOTA_IDLE)
//             params.attacker.StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_ATTACK, params.attacker.GetAttackSpeed())
//         }
//     }
//     @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_CANCELLED)
//     CC_OnAttackCancelled(params: ModifierAttackEvent) {
//         if (params.attacker == this.GetParentPlus()) {
//             params.attacker.FadeGesture(GameActivity_t.ACT_DOTA_IDLE)
//         }
//     }
//     @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_FINISHED)
//     CC_OnAttackFinished(params: ModifierAttackEvent) {
//         if (params.attacker == this.GetParentPlus()) {
//             params.attacker.FadeGesture(GameActivity_t.ACT_DOTA_IDLE)
//         }
//     }
// }
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// @registerModifier()
// export class modifier_jakiro_1_slow extends BaseModifier_Plus {
//     IsDebuff() {
//         return true
//     }
//     attackspeed_slow: number;
//     movespeed_slow: number;
//     max_stack: number;
//     Init(params: IModifierTable) {
//         this.attackspeed_slow = this.GetSpecialValueFor("attackspeed_slow")
//         this.movespeed_slow = this.GetSpecialValueFor("movespeed_slow")
//         this.max_stack = this.GetSpecialValueFor("max_stack")
//         if (IsServer()) {
//             if (this.GetStackCount() < this.max_stack) {
//                 this.IncrementStackCount()
//             }
//         } else {
//             let iParticleID = ParticleManager.CreateParticle("particles/units/heroes/hero_lich/lich_slowed_cold.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus())
//             this.AddParticle(iParticleID, false, false, -1, false, false)
//         }
//     }


//     @registerProp(PropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
//     EOM_GetModifierAttackSpeedBonus_Constant() {
//         return -this.attackspeed_slow * this.GetStackCount()
//     }
//     @registerProp(PropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
//     EOM_GetModifierMoveSpeedBonus_Constant() {
//         return -this.movespeed_slow * this.GetStackCount()
//     }
// }
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// @registerModifier()
// export class modifier_jakiro_1_ignite extends BaseModifier_Plus {
//     IsDebuff() {
//         return true
//     }
//     ignite_damage: number;
//     BeCreated(params: IModifierTable) {
//         this.ignite_damage = this.GetSpecialValueFor("ignite_damage")
//         if (IsServer()) {
//             this.StartIntervalThink(1)
//         } else {
//             let iParticleID = ParticleManager.CreateParticle("particles/units/heroes/hero_jakiro/jakiro_liquid_fire_debuff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus())
//             this.AddParticle(iParticleID, false, false, -1, false, false)
//         }
//     }
//     OnIntervalThink() {
//         if (IsServer()) {
//             let hCaster = this.GetCasterPlus()
//             let hAbility = this.GetAbilityPlus()
//             if (IsValid(hCaster) && IsValid(hAbility) && type(hCaster.GetActiveEgg) == "function") {
//                 hCaster.DealDamage(this.GetParentPlus(), hAbility, this.ignite_damage * hCaster.GetActiveEgg().length)
//             }
//         }
//     }
// }