// import { GameFunc } from "../../../../GameFunc";
// import { GameSetting } from "../../../../GameSetting";
// import { ResHelper } from "../../../../helper/ResHelper";
// import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
// import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
// import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
// // import { modifier_shredder_2_buff } from "./ability2_shredder_timber_chain";
// /** dota原技能数据 */
// export const Data_shredder_reactive_armor = { "ID": "5526", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "bonus_armor": "0.9 1 1.1 1.2" }, "02": { "var_type": "FIELD_FLOAT", "bonus_hp_regen": "0.7 0.9 1.1 1.3" }, "03": { "var_type": "FIELD_INTEGER", "stack_limit": "6 12 18 24", "LinkedSpecialBonus": "special_bonus_unique_timbersaw_2" }, "04": { "var_type": "FIELD_FLOAT", "stack_duration": "10 12 14 16", "LinkedSpecialBonus": "special_bonus_unique_timbersaw_2" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

// @registerAbility()
// export class ability3_shredder_reactive_armor extends BaseAbility_Plus {
//     /**对应dota内的名字 */
//     __IN_DOTA_NAME__ = "shredder_reactive_armor";
//     /**对应dota内的数据 */
//     __IN_DOTA_DATA__: typeof Data_shredder_reactive_armor = Data_shredder_reactive_armor;
//     Init() {
//         this.SetDefaultSpecialValue("inherit_crit_spell_percent", [50, 60, 70, 80, 90]);
//         this.SetDefaultSpecialValue("duration", 10);

//     }

//     Init_old() {
//         this.SetDefaultSpecialValue("inherit_crit_spell_percent", [50, 60, 70, 80, 90]);

//     }

//     hLastTarget: CDOTA_BaseNPC;


//     CastFilterResultTarget(hTarget: IBaseNpc_Plus) {
//         if (hTarget == this.GetCasterPlus()) {
//             this.errorStr = "dota_hud_error_cant_cast_on_self"
//             return UnitFilterResult.UF_FAIL_CUSTOM
//         }
//         if (hTarget.GetPlayerOwnerID() != this.GetCasterPlus().GetPlayerOwnerID()) {
//             this.errorStr = "dota_hud_error_cant_cast_on_ally"
//             return UnitFilterResult.UF_FAIL_CUSTOM
//         }
//         return UnitFilter(hTarget, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, this.GetCasterPlus().GetTeamNumber())
//     }

//     OnSpellStart() {
//         let hCaster = this.GetCasterPlus()
//         let hTarget = this.GetCursorTarget()
//         let duration = this.GetSpecialValueFor("duration")
//         modifier_shredder_3_link_buff.remove(hTarget);
//         modifier_shredder_3_link_buff.apply(hTarget, hCaster, this, { duration: duration })
//         this.hLastTarget = hTarget
//     }

//     ProcsMagicStick() {
//         return false
//     }

//     GetIntrinsicModifierName() {
//         return "modifier_shredder_3"
//     }
//     OnStolen(hSourceAbility: this) {
//         this.hLastTarget = hSourceAbility.hLastTarget
//     }
// }
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// // Modifiers
// @registerModifier()
// export class modifier_shredder_3 extends BaseModifier_Plus {
//     IsHidden() {
//         return true
//     }
//     IsDebuff() {
//         return false
//     }
//     IsPurgable() {
//         return false
//     }
//     IsPurgeException() {
//         return false
//     }
//     IsStunDebuff() {
//         return false
//     }
//     AllowIllusionDuplicate() {
//         return false
//     }
//     BeCreated(params: IModifierTable) {

//         if (IsServer()) {
//             this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
//         }
//     }


//     OnIntervalThink() {
//         if (IsServer()) {
//             let ability = this.GetAbilityPlus() as ability3_shredder_reactive_armor
//             if (!GameFunc.IsValid(ability)) {
//                 this.StartIntervalThink(-1)
//                 this.Destroy()
//                 return
//             }

//             let caster = ability.GetCasterPlus()

//             if (!ability.GetAutoCastState()) {
//                 return
//             }

//             if (caster.IsTempestDouble() || caster.IsIllusion()) {
//                 this.StartIntervalThink(-1)
//                 return
//             }

//             if (!ability.IsAbilityReady()) {
//                 return
//             }

//             let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus() + caster.GetHullRadius()

//             //  优先上一个目标
//             let target = GameFunc.IsValid(ability.hLastTarget) && ability.hLastTarget || null
//             if (target != null && !target.IsPositionInRange(caster.GetAbsOrigin(), range + target.GetHullRadius())) {
//                 target = null
//             }

//             //  搜索范围
//             if (target == null) {
//                 let teamFilter = ability.GetAbilityTargetTeam()
//                 let typeFilter = ability.GetAbilityTargetType()
//                 let flagFilter = ability.GetAbilityTargetFlags()
//                 let order = FindOrder.FIND_CLOSEST
//                 let targets = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), null, range, teamFilter, typeFilter, flagFilter, order, false)
//                 for (let i = targets.length - 1; i >= 0; i--) {
//                     if (targets[i].GetUnitLabel() != "HERO") {
//                         table.remove(targets, i)
//                     }
//                 }
//                 target = targets[0]
//             }

//             //  施法命令
//             if (target != null) {
//                 ExecuteOrderFromTable({
//                     UnitIndex: caster.entindex(),
//                     OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
//                     TargetIndex: target.entindex(),
//                     AbilityIndex: ability.entindex()
//                 })
//             }
//         }
//     }
// }
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// @registerModifier()
// export class modifier_shredder_3_link_buff extends BaseModifier_Plus {
//     inherit_crit_spell_percent: number;
//     bonus_spell_crit_chance: number;
//     base_spell_crit_damage: any;
//     bonus_spell_crit_damage: number;
//     IsHidden() {
//         return false
//     }
//     IsDebuff() {
//         return false
//     }
//     IsPurgable() {
//         return false
//     }
//     IsPurgeException() {
//         return false
//     }
//     IsStunDebuff() {
//         return false
//     }
//     AllowIllusionDuplicate() {
//         return false
//     }
//     BeCreated(params: IModifierTable) {

//         let hCaster = this.GetCasterPlus()
//         let hParent = this.GetParentPlus()
//         let hAbility = this.GetAbilityPlus()
//         if (!IsServer()) {
//             // 特效
//             let speed = 1000
//             let time = ((hParent.GetAbsOrigin() - hCaster.GetAbsOrigin()) as Vector).Length() / speed
//             let iParticleID = ResHelper.CreateParticle({
//                 resPath: "particles/units/heroes/hero_shredder/shredder_timberchain.vpcf",
//                 resNpc: hCaster,
//                 iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
//                 owner: hParent
//             });

//             ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), false)
//             ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), false)
//             ParticleManager.SetParticleControl(iParticleID, 2, Vector(speed, 1, 1))
//             ParticleManager.SetParticleControl(iParticleID, 3, Vector(time, 1, 1))
//             this.AddParticle(iParticleID, false, false, -1, false, false)
//         }
//     }
//     Init(params: IModifierTable) {
//         this.inherit_crit_spell_percent = this.GetSpecialValueFor("inherit_crit_spell_percent")
//     }
//     @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_PURE_DAMAGE_PERCENTAGE)
//     G_OUTGOING_PURE_DAMAGE_PERCENTAGE() {
//         return this.GetCasterPlus().GetTalentValue("special_bonus_unique_shredder_custom_7")
//     }
//     @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_CRITICALSTRIKE)
//     CC_GetModifierSpellCriticalStrike(params: IModifierTable) {
//         let hCaster = this.GetCasterPlus()
//         let buff = null;
//         // let buff = modifier_shredder_2_buff.findIn(hCaster)
//         if (GameFunc.IsValid(hCaster) && GameFunc.IsValid(buff)) {
//             this.bonus_spell_crit_chance = (buff.bonus_spell_crit_chance || 0) * this.inherit_crit_spell_percent * 0.01
//             this.base_spell_crit_damage = buff.base_spell_crit_damage || 0
//             this.SetStackCount(buff.GetStackCount())
//             return buff.CC_GetModifierSpellCriticalStrike(params)
//         }
//         this.SetStackCount(0)
//     }
//     @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_CRITICALSTRIKE_DAMAGE)
//     CC_GetModifierSpellCriticalStrikeDamage(params: IModifierTable) {
//         let hCaster = this.GetCasterPlus()
//         let buff = modifier_shredder_2_buff.findIn(hCaster)
//         if (GameFunc.IsValid(hCaster) && GameFunc.IsValid(buff)) {
//             this.bonus_spell_crit_damage = (buff.bonus_spell_crit_damage || 0) * this.inherit_crit_spell_percent * 0.01
//             this.SetStackCount(buff.GetStackCount())
//             return buff.CC_GetModifierSpellCriticalStrikeDamage(params)
//         }
//         this.SetStackCount(0)
//     }
// }
