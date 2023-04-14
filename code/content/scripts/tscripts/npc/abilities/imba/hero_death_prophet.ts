
// import { GameFunc } from "../../../GameFunc";
// import { AoiHelper } from "../../../helper/AoiHelper";
// import { ProjectileHelper } from "../../../helper/ProjectileHelper";
// import { ResHelper } from "../../../helper/ResHelper";
// import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
// import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
// import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

// @registerAbility()
// export class imba_death_prophet_carrion_swarm extends BaseAbility_Plus {
//     public projectiles: any;
//     GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
//         if (!this.GetCasterPlus().HasTalent("special_bonus_unique_death_prophet_crypt_swarm_2")) {
//             return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT;
//         } else {
//             return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET;
//         }
//     }
//     OnSpellStart(): void {
//         let caster = this.GetCasterPlus();
//         let position = this.GetCursorPosition();
//         let direction = GFuncVector.CalculateDirection(position, caster);
//         if (caster.HasTalent("special_bonus_unique_death_prophet_crypt_swarm_2")) {
//             direction = caster.GetForwardVector();
//         }
//         let speed = this.GetSpecialValueFor("speed");
//         let distance = this.GetSpecialValueFor("range");
//         let width = this.GetSpecialValueFor("start_radius");
//         let endWidth = this.GetSpecialValueFor("end_radius");
//         if (caster.HasTalent("special_bonus_unique_death_prophet_crypt_swarm_2")) {
//             for (const [_, enemy] of GameFunc.iPair(AoiHelper.FindEntityInRadius(caster.GetTeam(), caster.GetAbsOrigin(), distance))) {
//                 this.OnProjectileHitHandle(enemy, enemy.GetAbsOrigin(), null);
//             }
//             ParticleManager.FireParticle("particles/units/heroes/hero_death_prophet/death_prophet_carrion_nova.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster, {
//                 [0]: caster.GetAbsOrigin() + Vector(0, 0, 64)
//             });
//         } else {
//             this.projectiles = this.projectiles || {}
//             let id = this.FireLinearProjectile("", direction * speed, distance, width, {
//                 width_end: endWidth
//             });
//             let fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_death_prophet/death_prophet_carrion_swarm.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster);
//             ParticleManager.SetParticleControl(fx, 0, caster.GetAbsOrigin());
//             ParticleManager.SetParticleControl(fx, 1, direction * speed as Vector);
//             ParticleManager.SetParticleControl(fx, 2, Vector(endWidth, width, endWidth));
//             this.projectiles[id] = fx;
//         }
//         caster.EmitSound("Hero_DeathProphet.CarrionSwarm");
//     }
//     OnProjectileHitHandle(target: IBaseNpc_Plus, position: Vector, id: ParticleID) {
//         if (target && !target.TriggerSpellAbsorb(this)) {
//             let caster = this.GetCasterPlus();
//             if (caster.HasTalent("special_bonus_unique_death_prophet_crypt_swarm_1")) {
//                 target.AddNewModifier(caster, this, "modifier_imba_death_prophet_carrion_swarm_talent", {
//                     duration: caster.GetTalentValue("special_bonus_unique_death_prophet_crypt_swarm_1", "duration")
//                 });
//             } else {
//                 let damage = this.GetSpecialValueFor("damage");
//                 this.DealDamage(caster, target, damage);
//             }
//             target.EmitSound("Hero_DeathProphet.CarrionSwarm.Damage");
//         } else if (id) {
//             ParticleManager.ClearParticle(this.projectiles[id]);
//             this.projectiles[id] = undefined;
//         }
//     }
// }
// @registerModifier()
// export class modifier_imba_death_prophet_carrion_swarm_talent extends BaseModifier_Plus {
//     public tick: any;
//     public damage: number;
//     public lifesteal: any;
//     BeCreated(p_0: any,): void {
//         this.tick = this.GetRemainingTime() / this.GetCasterPlus().GetTalentValue("special_bonus_unique_death_prophet_crypt_swarm_1", "duration");
//         this.damage = this.GetSpecialValueFor("damage") / this.GetCasterPlus().GetTalentValue("special_bonus_unique_death_prophet_crypt_swarm_1", "duration");
//         this.lifesteal = 1;
//         if (!this.GetParentPlus().IsRoundNecessary()) {
//             this.lifesteal = 0.25;
//         }
//         this.StartIntervalThink(this.tick);
//     }
//     BeRefresh(p_0: any,): void {
//         if (this.tick - this.GetRemainingTime() / this.GetCasterPlus().GetTalentValue("special_bonus_unique_death_prophet_crypt_swarm_1", "duration") > 0.01) {
//             this.tick = this.GetRemainingTime() / this.GetCasterPlus().GetTalentValue("special_bonus_unique_death_prophet_crypt_swarm_1", "duration");
//             this.StartIntervalThink(this.tick);
//         }
//         this.damage = this.GetSpecialValueFor("damage") / this.GetCasterPlus().GetTalentValue("special_bonus_unique_death_prophet_crypt_swarm_1", "duration");
//         this.lifesteal = 1;
//         if (!this.GetParentPlus().IsRoundNecessary()) {
//             this.lifesteal = 0.25;
//         }
//     }
//     OnIntervalThink(): void {
//         let caster = this.GetCasterPlus();
//         let ability = this.GetAbilityPlus();
//         let damage = ability.DealDamage(caster, this.GetParentPlus(), this.damage);
//         caster.ApplyHeal(damage * this.lifesteal, ability);
//     }
//     GetAttributes(): DOTAModifierAttribute_t {
//         return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
//     }
// }

// @registerAbility()
// export class imba_death_prophet_silence extends BaseAbility_Plus {
//     GetAOERadius(): number {
//         return this.GetSpecialValueFor("radius");
//     }
//     OnSpellStart(): void {
//         if (IsClient()) {
//             return;
//         }
//         this.GetCasterPlus().EmitSound("Hero_DeathProphet.Silence");
//         let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCursorPosition(), undefined, this.GetSpecialValueFor("radius"), this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false);
//         let pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_death_prophet/death_prophet_silence.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined, this.GetCasterPlus());
//         ParticleManager.SetParticleControl(pfx, 0, this.GetCursorPosition());
//         ParticleManager.SetParticleControl(pfx, 1, Vector(this.GetSpecialValueFor("radius"), 0, 1));
//         ParticleManager.ReleaseParticleIndex(pfx);
//         for (const [_, enemy] of GameFunc.iPair(enemies)) {
//             let pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_death_prophet/death_prophet_silence_impact.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy, this.GetCasterPlus());
//             ParticleManager.SetParticleControl(pfx, 0, enemy.GetAbsOrigin());
//             ParticleManager.ReleaseParticleIndex(pfx);
//             enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_death_prophet_silence", {
//                 duration: this.GetDuration() * (1 - enemy.GetStatusResistance())
//             });
//         }
//     }
// }
// @registerModifier()
// export class modifier_imba_death_prophet_silence extends BaseModifier_Plus {
//     public pfx: any;
//     public pfx2: any;
//     CheckState(): Partial<Record<modifierstate, boolean>> {
//         return {
//             [modifierstate.MODIFIER_STATE_SILENCED]: true
//         };
//     }
//     BeCreated(p_0: any,): void {
//         if (IsClient()) {
//             return;
//         }
//         this.pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_death_prophet/death_prophet_silence_custom.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
//         ParticleManager.SetParticleControl(this.pfx, 0, this.GetParentPlus().GetAbsOrigin());
//         this.pfx2 = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_silenced.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
//         ParticleManager.SetParticleControl(this.pfx2, 0, this.GetParentPlus().GetAbsOrigin());
//     }
//     BeDestroy(): void {
//         if (IsClient()) {
//             return;
//         }
//         if (this.pfx) {
//             ParticleManager.DestroyParticle(this.pfx, false);
//             ParticleManager.ReleaseParticleIndex(this.pfx);
//         }
//         if (this.pfx2) {
//             ParticleManager.DestroyParticle(this.pfx2, false);
//             ParticleManager.ReleaseParticleIndex(this.pfx2);
//         }
//     }
// }


// @registerAbility()
// export class imba_death_prophet_spirit_siphon extends BaseAbility_Plus {
//     IsStealable(): boolean {
//         return true;
//     }
//     IsHiddenWhenStolen(): boolean {
//         return false;
//     }
//     GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
//         if (this.GetCasterPlus().HasTalent("special_bonus_unique_death_prophet_spirit_siphon_2")) {
//             return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING;
//         } else {
//             return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING;
//         }
//     }
//     AbilityCharges() {
//         return this.GetSpecialValueFor("max_charges");
//     }
//     GetIntrinsicModifierName(): string {
//         return "modifier_imba_death_prophet_spirit_siphon_charges";
//     }
//     OnSpellStart(): void {
//         let caster = this.GetCasterPlus();
//         let target = this.GetCursorTarget();
//         caster.EmitSound("Hero_DeathProphet.SpiritSiphon.Cast");
//         if (this.GetCasterPlus().HasTalent("special_bonus_unique_death_prophet_spirit_siphon_2")) {
//             for (const [_, enemy] of GameFunc.iPair(AoiHelper.FindEntityInRadius(caster.GetTeam(), caster.GetAbsOrigin(), this.GetTrueCastRange()))) {
//                 if (!enemy.TriggerSpellAbsorb(this)) {
//                     enemy.AddNewModifier(caster, this, "modifier_imba_death_prophet_spirit_siphon_debuff", {
//                         duration: this.GetSpecialValueFor("haunt_duration")
//                     });
//                 }
//             }
//         } else {
//             if (target.TriggerSpellAbsorb(this)) {
//                 return;
//             }
//             target.AddNewModifier(caster, this, "modifier_imba_death_prophet_spirit_siphon_debuff", {
//                 duration: this.GetSpecialValueFor("haunt_duration")
//             });
//         }
//     }
// }
// @registerModifier()
// export class modifier_imba_death_prophet_spirit_siphon_debuff extends BaseModifier_Plus {
//     public slow: any;
//     public talent1: any;
//     public damage: number;
//     public range: number;
//     public nFX: any;
//     BeCreated(p_0: any,): void {
//         this.slow = math.abs(this.GetSpecialValueFor("movement_slow")) * (-1);
//         this.talent1 = this.GetCasterPlus().HasTalent("special_bonus_unique_death_prophet_spirit_siphon_1");
//         if (IsServer()) {
//             this.damage = this.GetSpecialValueFor("base_damage") * (1 + this.GetCasterPlus().GetSpellAmplification(false)) + this.GetParentPlus().GetMaxHealth() * this.GetSpecialValueFor("damage_pct") / 100;
//             let caster = this.GetCasterPlus();
//             let parent = this.GetParentPlus();
//             let ability = this.GetAbilityPlus();
//             this.range = this.GetAbilityPlus().GetCastRangePlus() + this.GetSpecialValueFor("siphon_buffer");
//             this.nFX = ResHelper.CreateParticleEx("particles/units/heroes/hero_death_prophet/death_prophet_spiritsiphon.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.GetCasterPlus());
//             ParticleManager.SetParticleControlEnt(this.nFX, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
//             ParticleManager.SetParticleControlEnt(this.nFX, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
//             ParticleManager.SetParticleControl(this.nFX, 5, Vector(this.GetRemainingTime(), 0, 0));
//             this.GetParentPlus().EmitSound("Hero_DeathProphet.SpiritSiphon.Target");
//             if (this.talent1) {
//                 let damage = this.damage * this.GetRemainingTime();
//                 let heal = ability.DealDamage(caster, parent, damage, {
//                     damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION
//                 });
//                 caster.ApplyHeal(heal, ability);
//                 this.StartIntervalThink(1);
//             } else {
//                 this.StartIntervalThink(0.2);
//             }
//         }
//     }
//     BeRefresh(p_0: any,): void {
//         this.slow = math.abs(this.GetSpecialValueFor("movement_slow")) * (-1);
//         this.talent1 = this.GetCasterPlus().HasTalent("special_bonus_unique_death_prophet_spirit_siphon_1");
//         if (IsServer()) {
//             this.damage = this.GetSpecialValueFor("base_damage") * (1 + this.GetCasterPlus().GetSpellAmplification(false)) + this.GetParentPlus().GetMaxHealth() * this.GetSpecialValueFor("damage_pct") / 100;
//             let caster = this.GetCasterPlus();
//             let parent = this.GetParentPlus();
//             let ability = this.GetAbilityPlus();
//             this.range = this.GetAbilityPlus().GetCastRangePlus() + this.GetSpecialValueFor("siphon_buffer");
//             if (this.talent1) {
//                 let damage = this.damage * this.GetRemainingTime();
//                 let heal = ability.DealDamage(caster, parent, damage, {
//                     damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION
//                 });
//                 caster.ApplyHeal(heal, ability);
//                 this.StartIntervalThink(1);
//             } else {
//                 this.StartIntervalThink(0.2);
//             }
//         }
//     }
//     OnIntervalThink(): void {
//         if (this.talent1) {
//             this.Destroy();
//         } else {
//             let caster = this.GetCasterPlus();
//             let parent = this.GetParentPlus();
//             let ability = this.GetAbilityPlus();
//             let heal = ability.DealDamage(caster, parent, this.damage * 0.2, {
//                 damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION
//             });
//             caster.ApplyHeal(heal, ability);
//             if (GFuncVector.CalculateDistance(caster, parent) > this.range) {
//                 this.Destroy();
//             }
//         }
//     }
//     BeDestroy(): void {
//         if (IsServer()) {
//             this.GetParentPlus().StopSound("Hero_DeathProphet.SpiritSiphon.Target");
//             ParticleManager.ClearParticle(this.nFX);
//         }
//     }
//     /** DeclareFunctions():modifierfunction[] {
//         return Object.values({
//             1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
//         });
//     } */
//     @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
//     CC_GetModifierMoveSpeedBonus_Percentage(): number {
//         return this.slow;
//     }
// }
// @registerModifier()
// export class modifier_imba_death_prophet_spirit_siphon_charges extends BaseModifier_Plus {
//     public kv: any;
//     Update() {
//         let caster = this.GetCasterPlus();
//         this.kv.replenish_time = this.GetSpecialValueFor("charge_restore_time");
//         this.kv.max_count = math.floor(this.GetSpecialValueFor("max_charges"));
//         if (this.GetStackCount() == this.kv.max_count) {
//             this.SetDuration(-1, true);
//         } else if (this.GetStackCount() > this.kv.max_count) {
//             this.SetDuration(-1, true);
//             this.SetStackCount(this.kv.max_count);
//         } else if (this.GetStackCount() < this.kv.max_count) {
//             if (this.GetRemainingTime() <= -1) {
//                 let duration = this.kv.replenish_time * caster.GetCooldownReduction();
//                 this.SetDuration(duration, true);
//             }
//             this.StartIntervalThink(this.GetRemainingTime());
//             if (this.GetStackCount() == 0) {
//                 this.GetAbilityPlus().StartCooldown(this.GetRemainingTime());
//             }
//         }
//     }
//     BeCreated(p_0: any,): void {
//         let kv = {
//             max_count: math.floor(this.GetSpecialValueFor("max_charges")),
//             replenish_time: this.GetSpecialValueFor("charge_restore_time"),
//             start_count: math.floor(this.GetSpecialValueFor("max_charges"))
//         }
//         this.SetStackCount(kv.start_count || kv.max_count);
//         this.kv = kv;
//         if (kv.start_count && kv.start_count != kv.max_count) {
//             this.Update();
//         } else {
//             this.SetDuration(-1, true);
//         }
//     }
//     BeRefresh(p_0: any,): void {
//         this.kv.max_count = math.floor(this.GetSpecialValueFor("max_charges"));
//         this.kv.replenish_time = this.GetSpecialValueFor("charge_restore_time");
//         if (this.GetStackCount() != this.kv.max_count) {
//             this.IncrementStackCount();
//             this.Update();
//         }
//     }
//     /** DeclareFunctions():modifierfunction[] {
//         let funcs = {
//             1: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST
//         }
//         return Object.values(funcs);
//     } */
//     @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
//     CC_OnAbilityFullyCast(params: ModifierAbilityEvent): void {
//         if (params.unit == this.GetParentPlus()) {
//             this.kv.replenish_time = this.GetSpecialValueFor("charge_restore_time");
//             this.kv.max_count = math.floor(this.GetSpecialValueFor("max_charges"));
//             let ability = params.ability;
//             if (params.ability == this.GetAbilityPlus()) {
//                 this.DecrementStackCount();
//                 ability.EndCooldown();
//                 this.Update();
//             } else if (params.ability.GetName().includes( "orb_of_renewal") && this.GetStackCount() < this.kv.max_count) {
//                 this.IncrementStackCount();
//                 this.Update();
//             }
//         }
//     }
//     OnIntervalThink(): void {
//         let stacks = this.GetStackCount();
//         let caster = this.GetCasterPlus();
//         this.StartIntervalThink(-1);
//         let duration = this.kv.replenish_time * caster.GetCooldownReduction();
//         this.SetDuration(duration, true);
//         if (stacks < this.kv.max_count) {
//             this.IncrementStackCount();
//             this.Update();
//         } else if (stacks == this.kv.max_count) {
//             this.SetDuration(-1, true);
//         }
//     }
//     DestroyOnExpire(): boolean {
//         return false;
//     }
//     IsPurgable(): boolean {
//         return false;
//     }
//     RemoveOnDeath(): boolean {
//         return false;
//     }
// }
// @registerAbility()
// export class imba_death_prophet_exorcism extends BaseAbility_Plus {
//     public seekTarget: any;
//     public state: any;
//     public damageDealt: number;
//     GetIntrinsicModifierName(): string {
//         return "modifier_imba_death_prophet_exorcism_talent";
//     }
//     OnSpellStart(): void {
//         let caster = this.GetCasterPlus();
//         caster.RemoveModifierByName("modifier_imba_death_prophet_exorcism");
//         caster.AddNewModifier(caster, this, "modifier_imba_death_prophet_exorcism", {
//             duration: this.GetDuration()
//         });
//         caster.EmitSound("Hero_DeathProphet.Exorcism.Cast");
//         ParticleManager.FireParticle("particles/units/heroes/hero_death_prophet/death_prophet_spawn.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, caster);
//     }
//     CreateGhost(_position: Vector, duration: number) {
//         let caster = this.GetCasterPlus();
//         let vPos = _position || caster.GetAbsOrigin();
//         let speed = this.GetSpecialValueFor("spirit_speed");
//         let radius = this.GetSpecialValueFor("radius");
//         let give_up_distance = this.GetSpecialValueFor("give_up_distance");
//         let max_distance = this.GetSpecialValueFor("max_distance");
//         let damage = this.GetSpecialValueFor("average_damage");
//         let damageType = TernaryOperator(DAMAGE_TYPES.DAMAGE_TYPE_PURE, caster.HasScepter(), DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL);
//         let turnSpeed = 150;
//         let stateList = {
//             ORBITING: 1,
//             SEEKING: 2,
//             RETURNING: 3
//         }
//         let direction = TernaryOperator(caster.GetRightVector(), RollPercentage(50), caster.GetRightVector() * (-1));
//         let position = caster.GetAbsOrigin() + direction * 180 as Vector;
//         caster.nearbyEnemies = caster.FindEnemyUnitsInRadius(caster.GetAbsOrigin(), radius);

//         let ProjectileThink = GHandler.create(this, (pj: ISimpleLineProjectile) => {
//             let position = pj.GetPosition();
//             let velocity = pj.GetVelocity();
//             let speed = pj.GetSpeed();
//             let caster = pj.GetCaster();
//             let casterDistance = GFuncVector.CalculateDistance(caster, position);
//             if (velocity.z > 0) {
//                 velocity.z = 0;
//             }
//             if (this.state == stateList.ORBITING) {
//                 let distance = pj.orbitRadius - casterDistance;
//                 let direction = GFuncVector.CalculateDirection(position, caster);
//                 pj.SetVelocity(GetPerpendicularVector(direction) * speed * math.pow(-1,  this.orientation) + direction * distance);
//                 pj.SetPosition(GetGroundPosition(position + (this.GetVelocity() * ProjectileManager.FrameTime()), undefined));
//                 let newTarget = caster.GetAttackTarget() || caster.nearbyEnemies[RandomInt(1, GameFunc.GetCount(caster.nearbyEnemies))];
//                 if (newTarget) {
//                     this.seekTarget = newTarget;
//                     this.state = stateList.SEEKING;
//                 }
//             } else if (this.state == stateList.SEEKING) {
//                 if (this.seekTarget && !this.seekTarget.IsNull() && this.seekTarget.IsAlive()) {
//                     let distance = CalculateDistance(position, this.seekTarget);
//                     let targetPos = this.seekTarget.GetAbsOrigin();
//                     let direction = GFuncVector.CalculateDirection(this.seekTarget, position);
//                     let distVect = distance * direction;
//                     let comparator = velocity - distVect;
//                     let angle = math.deg(math.atan2(distVect.y, distVect.x) - math.atan2(velocity.y, velocity.x));
//                     if (angle > 360) {
//                         angle = angle - 360;
//                     }
//                     angle = math.abs(angle);
//                     let direction = RotateVector2D(velocity, ToRadians(math.min(this.turn_speed, angle)) * ProjectileManager.FrameTime());
//                     this.SetVelocity(direction * speed + GFuncVector.CalculateDirection(this.seekTarget, position) * math.max(100, (500 - distance)));
//                     let newPosition = GetGroundPosition(position + (velocity * ProjectileManager.FrameTime()), undefined);
//                     this.SetPosition(newPosition);
//                     if (distance <= this.GetRadius() + this.seekTarget.GetHullRadius() + this.seekTarget.GetCollisionPadding()) {
//                         let [status, err, ret] = pcall(this.hitBehavior, this, this.seekTarget, newPosition);
//                         if (!status) {
//                             print(err);
//                             this.Remove();
//                         } else if (!err) {
//                             this.Remove();
//                             return undefined;
//                         }
//                     }
//                 } else {
//                     this.state = stateList.RETURNING;
//                 }
//             } else if (this.state == stateList.RETURNING) {
//                 let distance = CalculateDistance(position, caster);
//                 let targetPos = caster.GetAbsOrigin();
//                 let direction = GFuncVector.CalculateDirection(caster, position);
//                 let distVect = distance * direction;
//                 let comparator = velocity - distVect;
//                 let angle = math.deg(math.atan2(distVect.y, distVect.x) - math.atan2(velocity.y, velocity.x));
//                 if (angle > 360) {
//                     angle = angle - 360;
//                 }
//                 angle = math.abs(angle);
//                 let direction = RotateVector2D(velocity, ToRadians(math.min(this.turn_speed, angle)) * ProjectileManager.FrameTime());
//                 this.SetVelocity(direction * speed + GFuncVector.CalculateDirection(caster, position) * math.max(100, (500 - distance)));
//                 this.SetPosition(GetGroundPosition(position + (velocity * ProjectileManager.FrameTime()), undefined));
//                 if (casterDistance < (this.GetRadius() + caster.GetHullRadius() + caster.GetCollisionPadding())) {
//                     this.state = stateList.ORBITING;
//                 }
//             }
//             if (casterDistance > this.maxRadius) {
//                 this.Remove();
//             }
//         });
//         let ProjectileHit = GHandler.create(this, (pj: ISimpleLineProjectile, enemy: IBaseNpc_Plus, position) => {
//             if (this.seekTarget) {
//                 this.state = stateList.RETURNING;
//                 this.damageDealt = this.damageDealt + this.DealDamage(caster, enemy, damage, {
//                     damage_type: damageType
//                 });
//                 this.seekTarget = undefined;
//             }
//             return true;
//         })
//         let projectile = ProjectileHelper.LineProjectiles.SimpleLineProjectile.CreateOne({
//             FX: "particles/units/heroes/hero_death_prophet/death_prophet_exorcism_ghost.vpcf",
//             position: position,
//             caster: caster,
//             ability: this,
//             OnHit: ProjectileHit,
//             OnThink: ProjectileThink,
//             speed: speed,
//             radius: 24,
//             velocity: speed * caster.GetForwardVector() as Vector,
//             turn_speed: turnSpeed,
//             state: stateList.ORBITING,
//             orbitRadius: math.random() * radius + 50,
//             maxRadius: max_distance,
//             giveUpDistance: give_up_distance,
//             orientation: RandomInt(1, 10),
//             damageDealt: 0,
//             duration: duration,
//             isUniqueProjectile: true
//         })
//         return projectile;
//     }
// }
// @registerModifier()
// export class modifier_imba_death_prophet_exorcism extends BaseModifier_Plus {
//     public spawnRate: any;
//     public maxGhosts: any;
//     public seekRadius: any;
//     public ghostList: any;
//     BeCreated(p_0: any,): void {
//         this.spawnRate = this.GetSpecialValueFor("ghost_spawn_rate");
//         this.maxGhosts = this.GetSpecialValueFor("spirits");
//         this.seekRadius = this.GetSpecialValueFor("radius");
//         this.StartIntervalThink(this.spawnRate);
//         this.GetCasterPlus().EmitSound("Hero_DeathProphet.Exorcism");
//         this.ghostList = {}
//     }
//     OnIntervalThink(): void {
//         let caster = this.GetCasterPlus();
//         let ability = this.GetAbilityPlus();
//         caster.nearbyEnemies = caster.FindEnemyUnitsInRadius(caster.GetAbsOrigin(), this.seekRadius);
//         if (this.GetGhostCount() >= this.maxGhosts) {
//             return;
//         }
//         let ghost = this.GetAbilityPlus().CreateGhost();
//         table.insert(this.ghostList, ghost);
//     }
//     BeDestroy(): void {
//         let caster = this.GetCasterPlus();
//         let ability = this.GetAbilityPlus();
//         caster.StopSound("Hero_DeathProphet.Exorcism");
//         if (!caster.IsAlive() && caster.HasTalent("special_bonus_unique_death_prophet_exorcism_1")) {
//             let respawnPosition = caster.GetAbsOrigin();
//             caster.RespawnHero(false, false);
//             caster.SetHealth(1);
//             caster.SetAbsOrigin(respawnPosition);
//         }
//         let heal = 0;
//         for (const [_, ghost] of GameFunc.iPair(this.GetGhosts())) {
//             heal = heal + ghost.damageDealt;
//             ghost.Remove();
//         }
//         if (caster.IsAlive()) {
//             caster.ApplyHeal(heal, ability);
//         }
//     }
//     GetGhosts() {
//         return this.ghostList;
//     }
//     GetGhostCount() {
//         for (let i = GameFunc.GetCount(this.ghostList); i >= 1; i += -1) {
//             if (!ProjectileHandler.projectiles[this.ghostList[i].uniqueProjectileID]) {
//                 table.remove(this.ghostList, i);
//             }
//         }
//         return GameFunc.GetCount(this.ghostList);
//     }
// }
// @registerModifier()
// export class modifier_imba_death_prophet_exorcism_talent extends BaseModifier_Plus {
//     /** DeclareFunctions():modifierfunction[] {
//         return Object.values({
//             1: Enum_MODIFIER_EVENT.ON_DEATH
//         });
//     } */
//     @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
//     CC_OnDeath(params: ModifierInstanceEvent): void {
//         if (params.attacker == this.GetParentPlus() && this.GetParentPlus().HasTalent("special_bonus_unique_death_prophet_exorcism_2") && !params.unit.IsMinion()) {
//             let ghosts = 1;
//             let roll = RollPercentage(50);
//             if (params.unit.IsBoss()) {
//                 ghosts = 2;
//             }
//             if (roll || params.unit.IsBoss()) {
//                 for (let i = 1; i <= ghosts; i += 1) {
//                     this.GetAbilityPlus<imba_death_prophet_exorcism>().CreateGhost(params.unit.GetAbsOrigin(), this.GetAbilityPlus().GetDuration());
//                 }
//             }
//         }
//     }
//     IsHidden(): boolean {
//         return true;
//     }
//     IsPurgable(): boolean {
//         return false;
//     }
//     RemoveOnDeath(): boolean {
//         return false;
//     }
// }
