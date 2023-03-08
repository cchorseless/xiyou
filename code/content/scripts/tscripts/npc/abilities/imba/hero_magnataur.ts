
import { GameFunc } from "../../../GameFunc";
import { AoiHelper } from "../../../helper/AoiHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerModifier()
export class modifier_imba_polarize_debuff extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    public caster: IBaseNpc_Plus;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    GetTexture(): string {
        return "magnus_polarize";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.parent = this.GetParentPlus();
            this.caster = this.GetCasterPlus();
            let think_interval;
            if (this.caster.HasTalent("special_bonus_imba_magnataur_7")) {
                think_interval = this.caster.GetTalentValue("special_bonus_imba_magnataur_7");
            } else {
                think_interval = 1.0;
            }
            this.StartIntervalThink(think_interval);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.caster.HasTalent("special_bonus_imba_magnataur_7")) {
                let enemies = FindUnitsInRadius(this.parent.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST, false);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    if (enemy != this.parent) {
                        let direction = (enemy.GetAbsOrigin() - this.parent.GetAbsOrigin() as Vector).Normalized();
                        let new_point = this.parent.GetAbsOrigin() + direction * this.parent.GetIdealSpeed() * this.caster.GetTalentValue("special_bonus_imba_magnataur_7", "pull_strength") * 0.01 as Vector;
                        this.parent.AddNewModifier(this.caster, undefined, "modifier_imba_polarize_debuff_pull", {
                            duration: 0.15 * (1 - this.parent.GetStatusResistance())
                        });
                        this.parent.SetAbsOrigin(new_point);
                        this.parent.SetUnitOnClearGround();
                        return;
                    }
                }
            }
        }
    }
    GetEffectName(): string {
        return "particles/econ/items/magnataur/seismic_berserker/seismic_berserker_weapon_horn_b.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
}
@registerModifier()
export class modifier_imba_polarize_debuff_stack extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let caster = this.GetCasterPlus();
            if (parent.HasModifier("modifier_imba_polarize_debuff")) {
                let modifier = parent.findBuff<modifier_imba_polarize_debuff>("modifier_imba_polarize_debuff");
                modifier.IncrementStackCount();
                let max_duration = params.duration;
                let modifier_counter = parent.FindAllModifiersByName("modifier_imba_polarize_debuff_stack");
                for (const [_, modi] of GameFunc.iPair(modifier_counter)) {
                    let current_duration = modi.GetDuration();
                    if (current_duration > max_duration) {
                        max_duration = current_duration;
                    }
                }
                modifier.SetDuration(max_duration, true);
            } else {
                parent.AddNewModifier(caster, undefined, "modifier_imba_polarize_debuff", {
                    duration: params.duration * (1 - parent.GetStatusResistance())
                });
                parent.findBuff<modifier_imba_polarize_debuff>("modifier_imba_polarize_debuff").SetStackCount(1);
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            if (parent.HasModifier("modifier_imba_polarize_debuff")) {
                parent.findBuff<modifier_imba_polarize_debuff>("modifier_imba_polarize_debuff").DecrementStackCount();
            }
        }
    }
}
@registerModifier()
export class modifier_imba_polarize_debuff_pull extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/hero/magnataur/skewer_entangle_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
}
@registerModifier()
export class modifier_imba_magnetize_debuff extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    GetTexture(): string {
        return "magnus_magnetize";
    }
    GetEffectName(): string {
        return "particles/econ/items/magnataur/seismic_berserker/seismic_berserker_weapon_horn_b.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
}
@registerModifier()
export class modifier_imba_magnetize_debuff_stack extends BaseModifier_Plus {
    public max_duration: number;
    public distance: number;
    public radius: number;
    public speed: number;
    public damage: number;
    public polarize_duration: number;
    public magnetize_duration: number;

    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        this.distance = this.GetSpecialValueFor("distance");
        this.radius = this.GetSpecialValueFor("radius");
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let caster = this.GetCasterPlus();
            let duration = this.GetRemainingTime();
            this.max_duration = this.GetSpecialValueFor("magnetize_duration");
            if (parent.HasModifier("modifier_imba_magnetize_debuff")) {
                let modifier = parent.findBuff<modifier_imba_magnetize_debuff>("modifier_imba_magnetize_debuff");
                modifier.IncrementStackCount();
                let modifier_counter = parent.FindAllModifiersByName("modifier_imba_magnetize_debuff_stack");
                for (const [_, modi] of GameFunc.iPair(modifier_counter)) {
                    let current_duration = modi.GetDuration();
                    if (current_duration < duration) {
                        duration = current_duration;
                    }
                }
                modifier.SetDuration(duration, true);
            } else {
                parent.AddNewModifier(caster, this.GetAbilityPlus(), "modifier_imba_magnetize_debuff", {
                    duration: duration * (1 - parent.GetStatusResistance())
                });
                parent.findBuff<modifier_imba_magnetize_debuff>("modifier_imba_magnetize_debuff").SetStackCount(1);
            }
            this.StartIntervalThink(this.max_duration);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            this.max_duration = this.GetSpecialValueFor("magnetize_duration");
            let parent = this.GetParentPlus();
            let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), parent.GetAbsOrigin(), undefined, this.distance, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let direction: Vector;
                if (enemy == parent && GameFunc.GetCount(enemies) > 1) {
                } else {
                    if (GameFunc.GetCount(enemies) <= 1) {
                        direction = (parent.GetAbsOrigin() - (parent.GetAbsOrigin() + RandomVector(64)) as Vector).Normalized();
                    } else {
                        if (enemy == parent) {
                        } else {
                            direction = (enemy.GetAbsOrigin() - parent.GetAbsOrigin() as Vector).Normalized();
                            if (enemy.GetAbsOrigin() == parent.GetAbsOrigin()) {
                                direction = direction + RandomVector(1) as Vector;
                            }
                        }
                    }
                    if (enemy == parent && GameFunc.GetCount(enemies) > 1) {
                    } else {
                        parent.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_magnetize_debuff_immune", {
                            duration: 0.1
                        });
                        let projectile: CreateLinearProjectileOptions = {
                            Ability: this.GetAbilityPlus(),
                            EffectName: "particles/units/heroes/hero_magnataur/magnataur_shockwave.vpcf",
                            vSpawnOrigin: parent.GetAbsOrigin(),
                            fDistance: this.distance,
                            fStartRadius: this.radius,
                            fEndRadius: this.radius,
                            Source: this.GetCasterPlus(),
                            bHasFrontalCone: false,
                            // bReplaceExisting: false,
                            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                            fExpireTime: GameRules.GetGameTime() + 5.0,
                            // bDeleteOnHit: false,
                            vVelocity: Vector(direction.x, direction.y, 0) * this.speed as Vector,
                            bProvidesVision: false,
                            ExtraData: {
                                damage: this.damage,
                                distance: this.distance,
                                polarize_duration: this.polarize_duration,
                                magnetize_duration: this.magnetize_duration,
                                speed: this.speed,
                                radius: this.radius,
                                magnetize_shockwave: 1,
                                talent: 0
                            }
                        }
                        ProjectileManager.CreateLinearProjectile(projectile);
                        return;
                    }
                }
            }
            let modifier_magnetize = parent.findBuff<modifier_imba_magnetize_debuff>("modifier_imba_magnetize_debuff");
            let modifier_magnetize_stack = parent.findBuff<modifier_imba_magnetize_debuff_stack>("modifier_imba_magnetize_debuff_stack");
            if (modifier_magnetize) {
                if (modifier_magnetize.GetStackCount() <= 1) {
                    modifier_magnetize.Destroy();
                    modifier_magnetize_stack.Destroy();
                } else {
                    modifier_magnetize.DecrementStackCount();
                    modifier_magnetize.SetDuration(this.max_duration, true);
                    modifier_magnetize_stack.DecrementStackCount();
                    modifier_magnetize_stack.SetDuration(this.max_duration, true);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_magnetize_debuff_immune extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
}
@registerAbility()
export class imba_magnataur_shockwave extends BaseAbility_Plus {
    public swing_fx: any;
    tempdata: { [k: string]: IBaseNpc_Plus[] } = {};
    tempcount: { [k: string]: number } = {};
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        if (!this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("cast_range");
        } else {
            return this.GetSpecialValueFor("scepter_distance");
        }
    }
    GetAbilityTextureName(): string {
        return "magnataur_shockwave";
    }
    OnAbilityPhaseStart(): boolean {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            caster.EmitSound("Hero_Magnataur.ShockWave.Cast");
            this.swing_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_magnataur/magnataur_shockwave_cast.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, caster);
            let swing = this.swing_fx;
            ParticleManager.SetParticleControlEnt(this.swing_fx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", caster.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(this.swing_fx, 1, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", caster.GetAbsOrigin(), true);
            this.AddTimer(this.GetBackswingTime(), () => {
                ParticleManager.DestroyParticle(swing, false);
                ParticleManager.ReleaseParticleIndex(swing);
            });
            return true;
        }
    }
    OnAbilityPhaseInterrupted(): void {
        if (IsServer()) {
            this.GetCasterPlus().StopSound("Hero_Magnataur.ShockWave.Cast");
            ParticleManager.DestroyParticle(this.swing_fx, false);
            return;
        }
    }
    IsStealable(): boolean {
        return true;
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
                this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
            }
            let caster = this.GetCasterPlus();
            let target_loc = this.GetCursorPosition();
            let caster_loc = caster.GetAbsOrigin();
            let damage = this.GetSpecialValueFor("damage");
            let secondary_damage = this.GetSpecialValueFor("secondary_damage");
            let spread_angle = this.GetSpecialValueFor("spread_angle");
            let secondary_amount = this.GetSpecialValueFor("secondary_amount");
            let secondary_occurance = this.GetSpecialValueFor("secondary_occurance");
            let distance = this.GetCastRange(caster_loc, caster) + GPropertyCalculate.GetCastRangeBonus(caster);
            let polarize_duration = this.GetTalentSpecialValueFor("polarize_duration");
            let magnetize_duration = this.GetTalentSpecialValueFor("magnetize_duration");
            let speed = this.GetSpecialValueFor("speed");
            if (caster.HasScepter()) {
                speed = this.GetSpecialValueFor("scepter_speed");
            }
            let radius = this.GetSpecialValueFor("radius");
            let direction = (target_loc - caster_loc as Vector).Normalized();
            let index = "hit_targets_" + tostring(GameRules.GetDOTATime(true, true));
            this.tempdata[index] = []
            this.tempcount[index + "_counter"] = secondary_occurance;
            this.AddTimer(15, () => {
                this.tempdata[index] = undefined;
                this.tempdata[index + "_counter"] = undefined;
            });
            caster.EmitSound("Hero_Magnataur.ShockWave.Particle");
            if (!caster.EmitCasterSound(["magnataur_magn_shockwave_01", "magnataur_magn_shockwave_02"], 75, ResHelper.EDOTA_CAST_SOUND.FLAG_NONE)) {
                if (!caster.EmitCasterSound(["magnataur_magn_shockwave_04", "magnataur_magn_shockwave_05"], 50, ResHelper.EDOTA_CAST_SOUND.FLAG_NONE)) {
                    caster.EmitCasterSound(["magnataur_magn_shockwave_03"], 15, ResHelper.EDOTA_CAST_SOUND.FLAG_NONE, undefined, undefined);
                }
            }
            let projectile: CreateLinearProjectileOptions = {
                Ability: this,
                EffectName: "particles/units/heroes/hero_magnataur/magnataur_shockwave.vpcf",
                vSpawnOrigin: caster_loc,
                fDistance: distance,
                fStartRadius: radius,
                fEndRadius: radius,
                Source: caster,
                bHasFrontalCone: false,
                // bReplaceExisting: false,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                fExpireTime: GameRules.GetGameTime() + 5.0,
                // bDeleteOnHit: false,
                vVelocity: Vector(direction.x, direction.y, 0) * speed as Vector,
                bProvidesVision: false,
                ExtraData: {
                    index: index,
                    damage: damage,
                    secondary_damage: secondary_damage,
                    spread_angle: spread_angle,
                    secondary_amount: secondary_amount,
                    distance: distance,
                    polarize_duration: polarize_duration,
                    magnetize_duration: magnetize_duration,
                    speed: speed,
                    direction_x: direction.x,
                    direction_y: direction.y,
                    radius: radius,
                    magnetize_shockwave: 0,
                    talent: 1,
                    caster_loc_x: caster_loc.x,
                    caster_loc_y: caster_loc.y,
                    main_shockwave: true
                }
            }
            ProjectileManager.CreateLinearProjectile(projectile);
        }
    }
    OnProjectileThink_ExtraData(location: Vector, ExtraData: any): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let distance = (location - Vector(ExtraData.caster_loc_x, ExtraData.caster_loc_y, 0) as Vector).Length2D();
            if (caster.HasTalent("special_bonus_imba_magnataur_1") && ExtraData.talent == 1 && distance > (ExtraData.distance / 2 - ExtraData.speed * FrameTime()) && distance < ExtraData.distance / 2) {
                let start_angle;
                let interval_angle = 0;
                let direction = Vector(ExtraData.direction_x, ExtraData.direction_y, 0);
                if (ExtraData.secondary_amount == 1) {
                    start_angle = 0;
                } else {
                    start_angle = ExtraData.spread_angle * (-1);
                    interval_angle = (ExtraData.spread_angle * 2 / ExtraData.secondary_amount);
                }
                for (let i = 0; i < ExtraData.secondary_amount; i++) {
                    let angle = start_angle + i * interval_angle + 45;
                    let new_direction = GFuncVector.RotateVector2D(direction, angle, true);
                    let velocity = new_direction * ExtraData.speed as Vector;
                    let projectile = {
                        Ability: this,
                        EffectName: "particles/units/heroes/hero_magnataur/magnataur_shockwave.vpcf",
                        vSpawnOrigin: location,
                        fDistance: ExtraData.distance / 2,
                        fStartRadius: ExtraData.radius,
                        fEndRadius: ExtraData.radius,
                        Source: caster,
                        bHasFrontalCone: false,
                        bReplaceExisting: false,
                        iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                        iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                        fExpireTime: GameRules.GetGameTime() + 5.0,
                        bDeleteOnHit: false,
                        vVelocity: Vector(velocity.x, velocity.y, 0),
                        bProvidesVision: false,
                        ExtraData: {
                            index: ExtraData.index,
                            damage: ExtraData.damage,
                            secondary_damage: ExtraData.secondary_damage,
                            spread_angle: ExtraData.spread_angle,
                            secondary_amount: ExtraData.secondary_amount,
                            distance: ExtraData.distance,
                            polarize_duration: ExtraData.polarize_duration,
                            magnetize_duration: ExtraData.magnetize_duration,
                            speed: ExtraData.speed,
                            direction_x: new_direction.x,
                            direction_y: new_direction.y,
                            radius: ExtraData.radius,
                            magnetize_shockwave: 0,
                            talent: 0
                        }
                    }
                    ProjectileManager.CreateLinearProjectile(projectile);
                }
                EmitSoundOnLocationWithCaster(location, "Hero_Magnataur.ShockWave.Target", caster);
            }
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        if (target) {
            let caster = this.GetCasterPlus();
            target.AddNewModifier(caster, this, "modifier_imba_shockwave_pull", {
                duration: this.GetSpecialValueFor("pull_duration") * (1 - target.GetStatusResistance()),
                x: location.x,
                y: location.y
            });
            if (caster.HasScepter()) {
                target.AddNewModifier(caster, this, "modifier_imba_shockwave_slow", {
                    duration: this.GetSpecialValueFor("basic_slow_duration") * (1 - target.GetStatusResistance())
                });
            } else {
                target.AddNewModifier(caster, this, "modifier_imba_shockwave_slow", {
                    duration: this.GetSpecialValueFor("slow_duration") * (1 - target.GetStatusResistance())
                });
            }
            if (ExtraData.ubercharge == 1) {
                ApplyDamage({
                    victim: target,
                    attacker: caster,
                    ability: this,
                    damage: ExtraData.damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                });
                target.AddNewModifier(caster, undefined, "modifier_imba_polarize_debuff_stack", {
                    duration: ExtraData.polarize_duration * (1 - target.GetStatusResistance())
                });
            } else {
                if (ExtraData.magnetize_shockwave == 1) {
                    if (target.HasModifier("modifier_imba_magnetize_debuff_immune")) {
                    } else {
                        ApplyDamage({
                            victim: target,
                            attacker: caster,
                            ability: this,
                            damage: ExtraData.damage,
                            damage_type: this.GetAbilityDamageType()
                        });
                        target.AddNewModifier(caster, undefined, "modifier_imba_polarize_debuff_stack", {
                            duration: ExtraData.polarize_duration * (1 - target.GetStatusResistance())
                        });
                    }
                } else {
                    let was_hit = false;
                    for (const [_, hit_target] of GameFunc.iPair(this.tempdata[ExtraData.index])) {
                        if (hit_target == target) {
                            was_hit = true;
                        }
                    }
                    if (was_hit && !ExtraData.scepter_shockwave) {
                        ApplyDamage({
                            victim: target,
                            attacker: caster,
                            ability: this,
                            damage: ExtraData.secondary_damage,
                            damage_type: this.GetAbilityDamageType()
                        });
                        if (ExtraData.target_entindex != target.entindex()) {
                            target.AddNewModifier(caster, undefined, "modifier_imba_polarize_debuff_stack", {
                                duration: ExtraData.polarize_duration * (1 - target.GetStatusResistance())
                            });
                        }
                        let modifier_magnetize = target.findBuff<modifier_imba_magnetize_debuff>("modifier_imba_magnetize_debuff");
                        let magnetize_debuff: modifier_imba_magnetize_debuff_stack = undefined;
                        if (modifier_magnetize) {
                            magnetize_debuff = target.AddNewModifier(caster, this, "modifier_imba_magnetize_debuff_stack", {
                                duration: modifier_magnetize.GetRemainingTime()
                            }) as modifier_imba_magnetize_debuff_stack;
                        } else {
                            magnetize_debuff = target.AddNewModifier(caster, this, "modifier_imba_magnetize_debuff_stack", {
                                duration: ExtraData.magnetize_duration * (1 - target.GetStatusResistance())
                            }) as modifier_imba_magnetize_debuff_stack;
                        }
                        if (magnetize_debuff) {
                            magnetize_debuff.damage = ExtraData.damage / 4;
                            magnetize_debuff.distance = ExtraData.distance;
                            magnetize_debuff.polarize_duration = ExtraData.polarize_duration;
                            magnetize_debuff.magnetize_duration = ExtraData.magnetize_duration;
                            magnetize_debuff.speed = ExtraData.speed;
                            magnetize_debuff.radius = ExtraData.radius;
                        }
                        if (caster.HasTalent("special_bonus_imba_magnataur_5")) {
                            target.AddNewModifier(caster, this, "modifier_imba_shockwave_root", {
                                duration: caster.GetTalentValue("special_bonus_imba_magnataur_5", "secondary_duration") * (1 - target.GetStatusResistance())
                            });
                        }
                    } else {
                        if (ExtraData.scepter_shockwave && target.IsCreep()) {
                            ApplyDamage({
                                victim: target,
                                attacker: caster,
                                ability: this,
                                damage: ExtraData.damage / 2,
                                damage_type: this.GetAbilityDamageType()
                            });
                        } else {
                            ApplyDamage({
                                victim: target,
                                attacker: caster,
                                ability: this,
                                damage: ExtraData.damage,
                                damage_type: this.GetAbilityDamageType()
                            });
                        }
                        this.tempdata[ExtraData.index].push(target);
                        if ((this.tempcount[ExtraData.index + "_counter"] > 0) && target.HasModifier("modifier_imba_polarize_debuff") && target.IsRealUnit()) {
                            this.tempcount[ExtraData.index + "_counter"] = this.tempcount[ExtraData.index + "_counter"] - 1;
                            let start_angle;
                            let interval_angle = 0;
                            let direction = Vector(ExtraData.direction_x, ExtraData.direction_y, 0);
                            if (ExtraData.secondary_amount == 1) {
                                start_angle = 0;
                            } else {
                                start_angle = ExtraData.spread_angle * (-1);
                                interval_angle = (ExtraData.spread_angle * 2 / ExtraData.secondary_amount);
                            }
                            for (let i = 0; i < ExtraData.secondary_amount; i++) {
                                let angle = start_angle + i * interval_angle + 45;
                                let new_direction = GFuncVector.RotateVector2D(direction, angle, true);
                                let velocity = new_direction * ExtraData.speed as Vector;
                                let projectile = {
                                    Ability: this,
                                    EffectName: "particles/units/heroes/hero_magnataur/magnataur_shockwave.vpcf",
                                    vSpawnOrigin: location,
                                    fDistance: ExtraData.distance / 2,
                                    fStartRadius: ExtraData.radius,
                                    fEndRadius: ExtraData.radius,
                                    Source: caster,
                                    bHasFrontalCone: false,
                                    bReplaceExisting: false,
                                    iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                                    iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                                    fExpireTime: GameRules.GetGameTime() + 5.0,
                                    bDeleteOnHit: false,
                                    vVelocity: Vector(velocity.x, velocity.y, 0),
                                    bProvidesVision: false,
                                    ExtraData: {
                                        index: ExtraData.index,
                                        damage: ExtraData.damage,
                                        secondary_damage: ExtraData.secondary_damage,
                                        spread_angle: ExtraData.spread_angle,
                                        secondary_amount: ExtraData.secondary_amount,
                                        distance: ExtraData.distance,
                                        polarize_duration: ExtraData.polarize_duration,
                                        magnetize_duration: ExtraData.magnetize_duration,
                                        speed: ExtraData.speed,
                                        direction_x: new_direction.x,
                                        direction_y: new_direction.y,
                                        radius: ExtraData.radius,
                                        magnetize_shockwave: 0,
                                        talent: 0,
                                        target_entindex: target.entindex()
                                    }
                                }
                                ProjectileManager.CreateLinearProjectile(projectile);
                            }
                        }
                        target.AddNewModifier(caster, undefined, "modifier_imba_polarize_debuff_stack", {
                            duration: ExtraData.polarize_duration * (1 - target.GetStatusResistance())
                        });
                        let modifier_magnetize = target.findBuff<modifier_imba_magnetize_debuff_stack>("modifier_imba_magnetize_debuff_stack");
                        let magnetize_debuff: modifier_imba_magnetize_debuff_stack;
                        if (modifier_magnetize) {
                            magnetize_debuff = target.AddNewModifier(caster, this, "modifier_imba_magnetize_debuff_stack", {
                                duration: modifier_magnetize.GetRemainingTime()
                            }) as modifier_imba_magnetize_debuff_stack;
                        } else {
                            magnetize_debuff = target.AddNewModifier(caster, this, "modifier_imba_magnetize_debuff_stack", {
                                duration: ExtraData.magnetize_duration * (1 - target.GetStatusResistance())
                            }) as modifier_imba_magnetize_debuff_stack;
                        }
                        if (magnetize_debuff) {
                            magnetize_debuff.damage = ExtraData.damage / 4;
                            magnetize_debuff.distance = ExtraData.distance;
                            magnetize_debuff.polarize_duration = ExtraData.polarize_duration;
                            magnetize_debuff.magnetize_duration = ExtraData.magnetize_duration;
                            magnetize_debuff.speed = ExtraData.speed;
                            magnetize_debuff.radius = ExtraData.radius;
                        }
                        if (caster.HasTalent("special_bonus_imba_magnataur_5")) {
                            target.AddNewModifier(caster, this, "modifier_imba_shockwave_root", {
                                duration: caster.GetTalentValue("special_bonus_imba_magnataur_5") * (1 - target.GetStatusResistance())
                            });
                        }
                    }
                }
                target.EmitSound("Hero_Magnataur.ShockWave.Target");
            }
        } else if (this.GetCasterPlus().HasScepter() && ExtraData.main_shockwave) {
            let projectile: CreateLinearProjectileOptions = {
                Ability: this,
                EffectName: "particles/units/heroes/hero_magnataur/magnataur_shockwave.vpcf",
                vSpawnOrigin: location,
                fDistance: ExtraData.distance,
                fStartRadius: ExtraData.radius,
                fEndRadius: ExtraData.radius,
                Source: this.GetCasterPlus(),
                bHasFrontalCone: false,
                // bReplaceExisting: false,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                fExpireTime: GameRules.GetGameTime() + 5.0,
                // bDeleteOnHit: false,
                vVelocity: Vector(ExtraData.direction_x * (-1), ExtraData.direction_y * (-1), 0) * ExtraData.speed as Vector,
                bProvidesVision: false,
                ExtraData: {
                    index: ExtraData.index,
                    damage: this.GetSpecialValueFor("damage"),
                    secondary_damage: this.GetSpecialValueFor("secondary_damage"),
                    spread_angle: ExtraData.spread_angle,
                    secondary_amount: ExtraData.secondary_amount,
                    distance: ExtraData.distance,
                    polarize_duration: ExtraData.polarize_duration,
                    magnetize_duration: ExtraData.magnetize_duration,
                    speed: ExtraData.speed,
                    direction_x: ExtraData.direction_x * (-1),
                    direction_y: ExtraData.direction_y * (-1),
                    radius: ExtraData.radius,
                    magnetize_shockwave: ExtraData.magnetize_shockwave,
                    talent: 0,
                    caster_loc_x: location.x,
                    caster_loc_y: location.y,
                    scepter_shockwave: true
                }
            }
            ProjectileManager.CreateLinearProjectile(projectile);
        }
    }
}
@registerAbility()
export class imba_magnataur_empower extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "magnataur_empower";
    }
    OnAbilityPhaseStart(): boolean {
        this.GetCasterPlus().EmitSound("Hero_Magnataur.Empower.Cast");
        return true;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            if (caster.HasTalent("special_bonus_imba_magnataur_8") && target.HasModifier("modifier_imba_supercharged")) {
                this.AddTimer(FrameTime(), () => {
                    let shockwave_ability = caster.findAbliityPlus<imba_magnataur_shockwave>("imba_magnataur_shockwave");
                    if (shockwave_ability) {
                        target.AddNewModifier(caster, shockwave_ability, "modifier_imba_ubercharged", {
                            duration: caster.GetTalentValue("special_bonus_imba_magnataur_8")
                        });
                    }
                });
            }
            let empower_duration = this.GetSpecialValueFor("empower_duration");
            let supercharge_duration = this.GetSpecialValueFor("supercharge_duration");
            if (target.HasModifier("modifier_imba_empower")) {
                target.AddNewModifier(caster, this, "modifier_imba_supercharged", {
                    duration: supercharge_duration
                });
            }
            target.AddNewModifier(caster, this, "modifier_imba_empower", {
                duration: empower_duration
            });
            if (!caster.EmitCasterSound(Object.values({
                "1": "magnataur_magn_empower_01",
                "2": "magnataur_magn_empower_03",
                "3": "magnataur_magn_empower_04",
                "4": "magnataur_magn_empower_05"
            }), 25, ResHelper.EDOTA_CAST_SOUND.FLAG_NONE, 10, "empower")) {
                caster.EmitCasterSound(["magnataur_magn_empower_02"], 15, ResHelper.EDOTA_CAST_SOUND.FLAG_NONE, 10, "empower");
            }
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_empower_aura";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsStealable(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_empower_aura extends BaseModifier_Plus {
    public particle: any;
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let ability = this.GetAbilityPlus();
            if ((parent.GetUnitName() == target.GetUnitName()) && target != parent) {
                return true;
            }
            if (parent.HasScepter()) {
                if (!this.particle) {
                    this.particle = ResHelper.CreateParticleEx("particles/auras/aura_empower.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, parent);
                    this.AddParticle(this.particle, false, false, -1, false, false);
                }
                if (target.IsRealUnit()) {
                    return false;
                }
            } else {
                if (this.particle) {
                    ParticleManager.DestroyParticle(this.particle, false);
                    ParticleManager.ReleaseParticleIndex(this.particle);
                    this.particle = undefined;
                }
            }
            if (target == parent) {
                return false;
            }
            return true;
        }
    }
    GetAuraRadius(): number {
        if (this.GetCasterPlus().IsRealUnit()) {
            return this.GetSpecialValueFor("radius_scepter");
        }
        return 0;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING;
    }
    GetModifierAura(): string {
        return "modifier_imba_empower";
    }
    IsAura(): boolean {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT;
    }
    IsHidden(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_empower extends BaseModifier_Plus {
    public bonus_damage_pct: number;
    public cleave_damage_pct: number;
    public cleave_damage_ranged: number;
    public splash_radius: number;
    public cleave_radius_start: number;
    public cleave_radius_end: number;
    public cleave_distance: number;
    public super_cleave_start: any;
    public super_cleave_end: any;
    public super_cleave_distance: number;
    public super_splash_radius: number;
    public interval: number;
    public remaining_duration: number;
    public was_refreshed: any;

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            2: GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.bonus_damage_pct;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        let ability = this.GetAbilityPlus();
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let caster = this.GetCasterPlus();
            if (params.attacker == parent && (!parent.IsIllusion()) && params.attacker.GetTeamNumber() != params.target.GetTeamNumber()) {
                let cleave_particle = "particles/units/heroes/hero_magnataur/magnataur_empower_cleave_effect.vpcf";
                let splash_particle = "particles/hero/magnataur/magnataur_empower_splash.vpcf";
                if (parent.HasModifier("modifier_imba_supercharged")) {
                    cleave_particle = "particles/hero/magnataur/magnataur_empower_cleave_red_effect.vpcf";
                    splash_particle = "particles/hero/magnataur/magnataur_empower_red_splash.vpcf";
                }
                if (parent.HasModifier("modifier_imba_supercharged") && caster.HasTalent("special_bonus_imba_magnataur_3")) {
                    cleave_particle = "particles/hero/magnataur/magnataur_empower_cleave_red_effect_plus.vpcf";
                    splash_particle = "particles/hero/magnataur/magnataur_empower_red_splash_plus.vpcf";
                }
                if (params.attacker.IsRangedAttacker()) {
                    let splash_radius = this.splash_radius;
                    if (parent.HasModifier("modifier_imba_supercharged")) {
                        splash_radius = this.super_splash_radius;
                    }
                    let enemies = FindUnitsInRadius(params.attacker.GetTeamNumber(), params.target.GetAbsOrigin(), undefined, splash_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
                    for (const [_, enemy] of GameFunc.iPair(enemies)) {
                        if (enemy != params.target && !enemy.IsAttackImmune()) {
                            ApplyDamage({
                                attacker: params.attacker,
                                victim: enemy,
                                ability: ability,
                                damage: (params.damage * this.cleave_damage_ranged),
                                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
                            });
                        }
                    }
                    let cleave_pfx = ResHelper.CreateParticleEx(splash_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, params.target);
                    ParticleManager.SetParticleControl(cleave_pfx, 0, params.target.GetAbsOrigin());
                    ParticleManager.SetParticleControl(cleave_pfx, 1, Vector(splash_radius, 0, 0));
                    ParticleManager.ReleaseParticleIndex(cleave_pfx);
                } else {
                    let cleave_radius_start = this.cleave_radius_start;
                    let cleave_radius_end = this.cleave_radius_end;
                    let cleave_distance = this.cleave_distance;
                    if (parent.HasModifier("modifier_imba_supercharged")) {
                        cleave_radius_start = this.super_cleave_start;
                        cleave_radius_end = this.super_cleave_end;
                        cleave_distance = this.super_cleave_distance;
                    }
                    if (caster.HasTalent("special_bonus_imba_magnataur_6")) {
                        if (!params.target.IsBuilding() && !params.target.IsOther()) {
                            let cleave_splash_particle = "particles/hero/magnataur/magnataur_empower_cleave_splash_effect.vpcf";
                            if (parent.HasModifier("modifier_imba_supercharged")) {
                                cleave_splash_particle = "particles/hero/magnataur/magnataur_empower_cleave_splash_red_effect.vpcf";
                            }
                            if (parent.HasModifier("modifier_imba_supercharged") && caster.HasTalent("special_bonus_imba_magnataur_3")) {
                                cleave_splash_particle = "particles/hero/magnataur/magnataur_empower_cleave_splash_red_effect_plus.vpcf";
                            }
                            let enemies = FindUnitsInRadius(params.attacker.GetTeamNumber(), params.target.GetAbsOrigin(), undefined, cleave_distance, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_ANY_ORDER, false);
                            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                                if (enemy != params.target) {
                                    ApplyDamage({
                                        attacker: params.attacker,
                                        victim: enemy,
                                        ability: ability,
                                        damage: (params.damage * this.cleave_damage_pct),
                                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION
                                    });
                                }
                            }
                            let cleave_splash_pfx = ResHelper.CreateParticleEx(cleave_splash_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, params.target);
                            ParticleManager.SetParticleControl(cleave_splash_pfx, 0, params.target.GetAbsOrigin());
                            ParticleManager.SetParticleControl(cleave_splash_pfx, 1, Vector(cleave_distance, 0, 0));
                            ParticleManager.ReleaseParticleIndex(cleave_splash_pfx);
                        }
                    } else {
                        DoCleaveAttack(params.attacker, params.target, ability, (params.damage * this.cleave_damage_pct), cleave_radius_start, cleave_radius_end, cleave_distance, cleave_particle);
                    }
                }
            }
        }
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        this.bonus_damage_pct = this.GetSpecialValueFor("bonus_damage_pct");
        this.cleave_damage_pct = this.GetSpecialValueFor("cleave_damage_pct") * 0.01;
        this.cleave_damage_ranged = this.GetSpecialValueFor("cleave_damage_ranged") * 0.01;
        this.splash_radius = this.GetSpecialValueFor("splash_radius");
        this.cleave_radius_start = this.GetSpecialValueFor("cleave_radius_start");
        this.cleave_radius_end = this.GetSpecialValueFor("cleave_radius_end");
        this.cleave_distance = this.GetSpecialValueFor("cleave_distance");
        this.super_cleave_start = this.GetSpecialValueFor("super_cleave_start");
        this.super_cleave_end = this.GetSpecialValueFor("super_cleave_end");
        this.super_cleave_distance = this.GetSpecialValueFor("super_cleave_distance");
        this.super_splash_radius = this.GetSpecialValueFor("super_splash_radius");
        if (this.GetParentPlus() == this.GetCasterPlus()) {
            this.cleave_damage_pct = this.cleave_damage_pct * this.GetSpecialValueFor("self_multiplier");
            this.cleave_damage_ranged = this.cleave_damage_ranged * this.GetSpecialValueFor("self_multiplier");
        }
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let ability = this.GetAbilityPlus();
            let caster = this.GetCasterPlus();
            parent.AddNewModifier(caster, this.GetAbilityPlus(), "modifier_imba_empower_particle", {});
            if (caster != parent) {
                this.interval = 0.1;
                if (params.isProvidedByAura) {
                    this.remaining_duration = 0;
                } else {
                    this.remaining_duration = params.duration;
                }
                this.StartIntervalThink(this.interval);
            }
            if (!params.was_refreshed) {
                parent.EmitSound("Hero_Magnataur.Empower.Target");
            }
        }
    }
    BeRefresh(params: any): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let caster = this.GetCasterPlus();
            parent.AddNewModifier(caster, this.GetAbilityPlus(), "modifier_imba_empower_particle", {});
            if (caster != parent) {
                this.remaining_duration = params.duration;
                parent.RemoveModifierByName("modifier_imba_empower_linger");
            }
            parent.EmitSound("Hero_Magnataur.Empower.Target");
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (this.GetCasterPlus() != this.GetParentPlus()) {
                if (this.GetDuration() == 0.5) {
                    let parent = this.GetParentPlus();
                    let ability = this.GetAbilityPlus();
                    let linger_duration = ability.GetSpecialValueFor("linger_duration");
                    if (parent.HasModifier("modifier_imba_empower_linger")) {
                        let linger_remaining = parent.findBuff<modifier_imba_empower_linger>("modifier_imba_empower_linger").GetRemainingTime();
                        if (linger_duration < linger_remaining) {
                            linger_duration = linger_remaining;
                        }
                        parent.RemoveModifierByName("modifier_imba_empower_linger");
                    }
                    this.was_refreshed = true;
                    parent.AddNewModifier(this.GetCasterPlus(), ability, "modifier_imba_empower", {
                        duration: linger_duration,
                        was_refreshed: true
                    });
                }
            }
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            if (this.GetDuration() == 0.5) {
                if (!parent.HasModifier("modifier_imba_empower_linger")) {
                    parent.AddNewModifier(caster, ability, "modifier_imba_empower_linger", {
                        duration: this.remaining_duration
                    });
                }
            } else {
                this.remaining_duration = this.remaining_duration - this.interval;
            }
            if (!(parent.HasModifier("modifier_imba_empower_particle") || parent.HasModifier("modifier_imba_supercharged"))) {
                parent.AddNewModifier(caster, ability, "modifier_imba_empower_particle", {});
            }
        }
    }
}
@registerModifier()
export class modifier_imba_empower_particle extends BaseModifier_Plus {
    public particle: any;
    IsHidden(): boolean {
        return true;
    }
    Init(p_0: any,): void {
        let parent = this.GetParentPlus();
        if (parent.HasModifier("modifier_imba_supercharged") || !parent.HasModifier("modifier_imba_empower")) {
            this.Destroy();
            return;
        }
        if (!this.particle) {
            this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_magnataur/magnataur_empower.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, parent);
            this.AddParticle(this.particle, false, false, -1, false, false);
            this.StartIntervalThink(0.2);
        }
    }
    OnIntervalThink(): void {
        this.Init({});
    }

    IsPurgable(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_empower_linger extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_empower_polarizer extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public search_radius: number;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.search_radius = this.ability.GetSpecialValueFor("search_radius");
            let empower_search = FindUnitsInRadius(this.parent.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.search_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            let refresh_interval = this.ability.GetSpecialValueFor("refresh_interval");
            for (const [_, enemy] of GameFunc.iPair(empower_search)) {
                let polarize_debuff = enemy.findBuff<modifier_imba_polarize_debuff>("modifier_imba_polarize_debuff");
                if ((!(polarize_debuff && polarize_debuff.GetDuration() > this.ability.GetSpecialValueFor("polarize_duration")))) {
                    enemy.AddNewModifier(this.caster, undefined, "modifier_imba_polarize_debuff", {
                        duration: this.ability.GetSpecialValueFor("polarize_duration") * (1 - enemy.GetStatusResistance())
                    });
                }
            }
            this.StartIntervalThink(refresh_interval);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if ((!(this.parent.HasModifier("modifier_imba_empower") || this.parent.HasModifier("modifier_imba_empower_aura")))) {
                this.Destroy();
                return;
            }
            let empower_search = FindUnitsInRadius(this.parent.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.search_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            let refresh_interval = this.ability.GetSpecialValueFor("refresh_interval");
            for (const [_, enemy] of GameFunc.iPair(empower_search)) {
                let polarize_debuff = enemy.findBuff<modifier_imba_polarize_debuff>("modifier_imba_polarize_debuff");
                if ((!(polarize_debuff && polarize_debuff.GetDuration() > this.ability.GetSpecialValueFor("polarize_duration")))) {
                    enemy.AddNewModifier(this.caster, undefined, "modifier_imba_polarize_debuff", {
                        duration: this.ability.GetSpecialValueFor("polarize_duration") * (1 - enemy.GetStatusResistance())
                    });
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_supercharged extends BaseModifier_Plus {
    BeCreated(params: any): void {
        if (IsServer()) {
            let particle = ResHelper.CreateParticleEx("particles/hero/magnataur/magnataur_empower_red.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetParentPlus());
            this.AddParticle(particle, false, false, -1, false, false);
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            if (parent.HasModifier("modifier_imba_empower")) {
                parent.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_empower_particle", {});
            }
        }
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    GetEffectName(): string {
        if (this.GetParentPlus().HasModifier("modifier_imba_ubercharged")) {
            return undefined;
        } else {
            return "particles/hero/magnataur/magnataur_supercharge.vpcf";
        }
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_POINT_FOLLOW;
    }
    GetTexture(): string {
        return "magnus_supercharge";
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.GetSpecialValueFor("supercharge_as");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetSpecialValueFor("supercharge_ms");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    CC_GetModifierBaseAttack_BonusDamage(): number {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_magnataur_3") && this.GetParentPlus().GetPrimaryStatValue && this.GetParentPlus().GetPrimaryStatValue()) {
            return this.GetParentPlus().GetPrimaryStatValue() * this.GetCasterPlus().GetTalentValue("special_bonus_imba_magnataur_3") * 0.01;
        }
    }
}
@registerModifier()
export class modifier_imba_ubercharged extends BaseModifier_Plus {
    public parent_loc: any;
    public direction: any;
    public damage: number;
    public radius: number;
    public distance: number;
    public speed: number;
    public polarize_duration: number;
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetParentPlus().HasModifier("modifier_imba_ubercharged_indicator")) {
                let modifier_indicator = this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_ubercharged_indicator", {});
                if (modifier_indicator) {
                    modifier_indicator.SetStackCount(1);
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let parent = this.GetParentPlus();
            let ability = this.GetAbilityPlus();
            let ubercharge_indicator = parent.findBuff<modifier_imba_ubercharged_indicator>("modifier_imba_ubercharged_indicator");
            if (parent == params.attacker && ubercharge_indicator.GetStackCount() >= 1 && params.attacker.GetTeamNumber() != params.target.GetTeamNumber()) {
                this.CreateShockwave(parent, params.target, caster, ability);
                ubercharge_indicator.SetStackCount(0);
            }
        }
    }
    CreateShockwave(parent: IBaseNpc_Plus, target: IBaseNpc_Plus, caster: IBaseNpc_Plus, ability: IBaseAbility_Plus) {
        if (ability.GetLevel() > 0) {
            this.parent_loc = parent.GetAbsOrigin();
            this.direction = (target.GetAbsOrigin() - this.parent_loc as Vector).Normalized();
            this.damage = ability.GetSpecialValueFor("damage") / 2;
            this.radius = ability.GetSpecialValueFor("radius");
            this.distance = ability.GetCastRange(this.parent_loc, caster) + GPropertyCalculate.GetCastRangeBonus(caster);
            this.speed = ability.GetSpecialValueFor("speed");
            this.polarize_duration = ability.GetSpecialValueFor("polarize_duration");
            let shockwave_projectile = {
                Ability: ability,
                EffectName: "particles/units/heroes/hero_magnataur/magnataur_shockwave.vpcf",
                vSpawnOrigin: this.parent_loc,
                fDistance: this.distance,
                fStartRadius: this.radius,
                fEndRadius: this.radius,
                Source: caster,
                bHasFrontalCone: false,
                bReplaceExisting: false,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                fExpireTime: GameRules.GetGameTime() + 5.0,
                bDeleteOnHit: false,
                vVelocity: Vector(this.direction.x, this.direction.y, 0) * this.speed as Vector,
                bProvidesVision: false,
                ExtraData: {
                    damage: this.damage,
                    distance: this.distance,
                    polarize_duration: this.polarize_duration,
                    speed: this.speed,
                    radius: this.radius,
                    ubercharge: 1
                }
            }
            ProjectileManager.CreateLinearProjectile(shockwave_projectile);
            EmitSoundOnLocationWithCaster(this.parent_loc, "Hero_Magnataur.ShockWave.Particle", parent);
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (this.GetParentPlus().HasModifier("modifier_imba_ubercharged_indicator")) {
                this.GetParentPlus().RemoveModifierByName("modifier_imba_ubercharged_indicator");
            }
        }
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/hero/magnataur/magnataur_ubercharge.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_POINT_FOLLOW;
    }
    GetTexture(): string {
        return "magnus_ubercharge";
    }
}
@registerModifier()
export class modifier_imba_ubercharged_indicator extends BaseModifier_Plus {
    public stacking_up: number;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetTexture(): string {
        return "magnus_ubercharge";
    }
    DestroyOnExpire(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.stacking_up = 0;
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (this.GetStackCount() < 1) {
                if (this.stacking_up < 1) {
                    this.SetDuration(caster.GetTalentValue("special_bonus_imba_magnataur_8", "refresh_interval"), true);
                }
                this.stacking_up = this.stacking_up + 1;
            }
            if (this.stacking_up >= 10 && this.GetStackCount() < 1) {
                this.SetDuration(-1, true);
                this.stacking_up = 0;
                this.SetStackCount(1);
            }
        }
    }
}
@registerAbility()
export class imba_magnataur_skewer extends BaseAbility_Plus {
    public begged_for_pardon: boolean;

    OnAbilityPhaseStart(): boolean {
        let caster = this.GetCasterPlus();
        if (this.begged_for_pardon) {
            return false;
        }
        return true;
    }
    // CastFilterResult(): UnitFilterResult {
    //     if (IsServer()) {
    //         this.begged_for_pardon = true;
    //     }
    // }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasModifier("modifier_imba_skewer_motion_controller")) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET;
        }
    }
    GetCastPoint(): number {
        if (this.GetCasterPlus().HasScepter()) {
            return super.GetCastPoint() * this.GetSpecialValueFor("cast_point_reduction") / 100;
        }
        return super.GetCastPoint();
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (IsClient()) {
            return this.GetSpecialValueFor("range") + this.GetCasterPlus().GetCastRangeBonus();
        }
    }
    GetCooldown(iLevel: number): number {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("scepter_cooldown");
        }
        return super.GetCooldown(iLevel);
    }
    GetManaCost(iLevel: number): number {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("skewer_manacost");
        }
        return super.GetManaCost(iLevel);
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target_loc = this.GetCursorPosition();
            let caster_loc = caster.GetAbsOrigin();
            let range = this.GetSpecialValueFor("range") + GPropertyCalculate.GetCastRangeBonus(caster);
            let distance = (target_loc - caster_loc as Vector).Length2D();
            let direction = (target_loc - caster_loc as Vector).Normalized();
            let current_cooldown = this.GetCooldownTimeRemaining();
            this.EndCooldown();
            if (distance > range) {
                distance = range;
            }
            caster.EmitSound("Hero_Magnataur.Skewer.Cast");
            if (!caster.EmitCasterSound(Object.values({
                "1": "magnataur_magn_skewer_01",
                "2": "magnataur_magn_skewer_02",
                "3": "magnataur_magn_skewer_03",
                "4": "magnataur_magn_skewer_07",
                "5": "magnataur_magn_skewer_09",
                "6": "magnataur_magn_skewer_12",
                "7": "magnataur_magn_skewer_13",
                "8": "magnataur_magn_skewer_14"
            }), 25, ResHelper.EDOTA_CAST_SOUND.FLAG_BOTH_TEAMS, 3, "Skewer")) {
                caster.EmitCasterSound(Object.values({
                    "1": "magnataur_magn_lasthit_09"
                }), 20, ResHelper.EDOTA_CAST_SOUND.FLAG_BOTH_TEAMS, 3, "Skewer");
            }
            caster.AddNewModifier(caster, this, "modifier_imba_skewer_motion_controller", {
                distance: distance,
                direction_x: direction.x,
                direction_y: direction.y,
                direction_z: direction.z,
                cooldown: current_cooldown,
                // cast_sound: cast_sound
            });
            if (caster.HasTalent("special_bonus_imba_magnataur_4")) {
                let radius = caster.GetTalentValue("special_bonus_imba_magnataur_4");
                caster.EmitSound("Hero_Magnataur.ReversePolarity.Cast");
                let animation_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_magnataur/magnataur_reverse_polarity.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
                ParticleManager.SetParticleControlEnt(animation_pfx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, undefined, (caster_loc + direction * 100 as Vector), true);
                ParticleManager.SetParticleControl(animation_pfx, 1, Vector(radius, 0, 0));
                ParticleManager.SetParticleControl(animation_pfx, 2, Vector(this.GetCastPoint(), 0, 0));
                ParticleManager.SetParticleControl(animation_pfx, 3, caster.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(animation_pfx);
            }
        }
    }
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_MAGNUS_SKEWER_START;
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsStealable(): boolean {
        return true;
    }
    GetAbilityTextureName(): string {
        if (this.GetCasterPlus().HasModifier("modifier_imba_skewer_motion_controller")) {
            return "magnataur_beg_my_pardon";
        } else {
            return "magnataur_skewer";
        }
    }
}
@registerModifier()
export class modifier_imba_skewer_motion_controller extends BaseModifierMotionHorizontal_Plus {
    public speed: number;
    public skewer_radius: number;
    public tree_radius: number;
    public slow_duration: number;
    public horned_distance: number;
    public pardon_min_range: number;
    public damage: number;
    public pardon_extra_dmg: any;
    public entangle_dur: any;
    public distance: number;
    public cast_sound: any;
    public direction: any;
    public traveled: any;
    public final: any;
    public cooldown: number;
    public skewer_fx: any;
    public skewer_finished: any;
    BeCreated(params: any): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            let caster_loc = caster.GetAbsOrigin();
            caster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_3);
            this.speed = ability.GetSpecialValueFor("speed") * FrameTime();
            this.skewer_radius = ability.GetSpecialValueFor("skewer_radius");
            this.tree_radius = ability.GetSpecialValueFor("tree_radius");
            this.slow_duration = ability.GetSpecialValueFor("slow_duration");
            this.horned_distance = ability.GetSpecialValueFor("horned_distance");
            this.pardon_min_range = ability.GetSpecialValueFor("pardon_min_range");
            this.damage = ability.GetSpecialValueFor("damage");
            this.pardon_extra_dmg = ability.GetSpecialValueFor("pardon_extra_dmg");
            this.entangle_dur = ability.GetSpecialValueFor("entangle_dur");
            this.distance = params.distance;
            // this.cast_sound = params.cast_sound;
            this.direction = Vector(params.direction_x, params.direction_y, params.direction_z);
            this.traveled = 0;
            this.final = false;
            this.cooldown = params.cooldown;
            this.skewer_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_magnataur/magnataur_skewer.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControlEnt(this.skewer_fx, 0, caster, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, undefined, caster.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(this.skewer_fx, 1, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_horn", caster.GetAbsOrigin(), true);
            if (caster.HasTalent("special_bonus_imba_magnataur_4")) {
                let radius = caster.GetTalentValue("special_bonus_imba_magnataur_4");
                let pulled_loc = caster_loc + this.direction * 100 as Vector;
                let enemies = FindUnitsInRadius(caster.GetTeam(), pulled_loc, undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, FindOrder.FIND_ANY_ORDER, false);
                for (const enemy of (enemies as IBaseNpc_Plus[])) {
                    let pull_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_magnataur/magnataur_reverse_polarity_pull.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster);
                    ParticleManager.SetParticleControl(pull_pfx, 0, enemy.GetAbsOrigin());
                    ParticleManager.SetParticleControl(pull_pfx, 1, pulled_loc);
                    ParticleManager.ReleaseParticleIndex(pull_pfx);
                    enemy.InterruptMotionControllers(true);
                    BaseModifierMotionHorizontal_Plus.RemoveAllMotionBuff(enemy);
                    enemy.SetAbsOrigin(pulled_loc);
                    FindClearSpaceForUnit(enemy, pulled_loc, true);
                    enemy.AddNewModifier(caster, ability, "modifier_stunned", {
                        duration: 0.1 * (1 - enemy.GetStatusResistance())
                    });
                    enemy.EmitSound("Hero_Magnataur.ReversePolarity.Stun");
                }
            }
            this.BeginMotionOrDestroy();
        }
    }

    BeDestroy(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            this.GetAbilityPlus().StartCooldown(math.max(this.cooldown - this.GetElapsedTime(), 0));
            ParticleManager.DestroyParticle(this.skewer_fx, false);
            ParticleManager.ReleaseParticleIndex(this.skewer_fx);
            GridNav.DestroyTreesAroundPoint(this.GetCasterPlus().GetAbsOrigin(), (this.tree_radius + 100), false);
        }
    }
    IsHidden(): boolean {
        return true;
    }
    IgnoreTenacity() {
        return true;
    }

    IsPurgable(): boolean {
        return false;
    }
    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_ULTRA;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }
    UpdateHorizontalMotion(unit: IBaseNpc_Plus, time: number) {
        if (IsServer()) {
            if (this.GetParentPlus().HasModifier("modifier_mars_arena_of_blood_leash") && this.GetParentPlus().findBuff("modifier_mars_arena_of_blood_leash").GetAuraOwner() && (this.GetParentPlus().GetAbsOrigin() - this.GetParentPlus().FindModifierByName("modifier_mars_arena_of_blood_leash").GetAuraOwner().GetAbsOrigin() as Vector).Length2D() >= this.GetParentPlus().FindModifierByName("modifier_mars_arena_of_blood_leash").GetSpecialValueFor("radius") - this.GetParentPlus().FindModifierByName("modifier_mars_arena_of_blood_leash").GetSpecialValueFor("width")) {
                this.Destroy();
                return;
            }
            let caster = this.GetCasterPlus();
            let caster_loc = caster.GetAbsOrigin();
            let ability = this.GetAbilityPlus<imba_magnataur_skewer>();
            GridNav.DestroyTreesAroundPoint(caster_loc, this.tree_radius, false);
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster_loc, undefined, this.skewer_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, 0, 0, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (!enemy.HasModifier("modifier_imba_skewer_motion_controller_target")) {
                    let set_point = caster.GetAbsOrigin() + this.direction * this.horned_distance as Vector;
                    enemy.SetAbsOrigin(Vector(set_point.x, set_point.y, GetGroundPosition(set_point, enemy).z));
                    enemy.AddNewModifier(caster, ability, "modifier_imba_skewer_motion_controller_target", {
                        direction_x: this.direction.x,
                        direction_y: this.direction.y,
                        direction_z: this.direction.z,
                        speed: this.speed
                    });
                }
            }
            if ((this.traveled < this.distance) && caster.IsAlive() && !ability.begged_for_pardon) {
                let set_point = caster.GetAbsOrigin() + this.direction * this.speed as Vector;
                caster.SetAbsOrigin(Vector(set_point.x, set_point.y, GetGroundPosition(set_point, caster).z));
                this.traveled = this.traveled + this.speed;
                if (((this.traveled + (3 * this.speed)) > this.distance) && !this.final) {
                    caster.FadeGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_3);
                    caster.StartGesture(GameActivity_t.ACT_DOTA_MAGNUS_SKEWER_END);
                    this.final = true;
                }
            } else {
                if (!this.final) {
                    caster.FadeGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_3);
                    caster.StartGesture(GameActivity_t.ACT_DOTA_MAGNUS_SKEWER_END);
                }
                let responses = {
                    "1": "magnataur_magn_skewer_04",
                    "2": "magnataur_magn_skewer_05",
                    "3": "magnataur_magn_skewer_06",
                    "4": "magnataur_magn_skewer_08",
                    "5": "magnataur_magn_skewer_10",
                    "6": "magnataur_magn_skewer_11"
                }
                caster.EmitCasterSound(Object.values(responses), 25, ResHelper.EDOTA_CAST_SOUND.FLAG_BOTH_TEAMS, 2, "Skewer");
                this.EndSkewer();
            }
        }
    }
    EndSkewer() {
        if (IsServer()) {
            if (this.skewer_finished) {
                return;
            }
            this.skewer_finished = true;
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus<imba_magnataur_skewer>();
            let caster_loc = caster.GetAbsOrigin();
            let piked_enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, this.skewer_radius * 2, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, 0, 0, false);
            let polarize_counter = 0;
            for (const enemy of (piked_enemies)) {
                if (enemy.HasModifier("modifier_imba_polarize_debuff")) {
                    polarize_counter = polarize_counter + 1;
                    if (polarize_counter == 2) {
                        return;
                    }
                }
            }
            for (const [_, enemy] of GameFunc.iPair(piked_enemies)) {
                let damage = this.damage;
                if (ability.begged_for_pardon) {
                    damage = damage + this.pardon_extra_dmg;
                }
                let modifier = enemy.FindModifierByNameAndCaster("modifier_imba_skewer_motion_controller_target", caster);
                if (modifier) {
                    if (ability.begged_for_pardon && !enemy.HasModifier("modifier_imba_polarize_debuff")) {
                        let knockup_duration = 0.5 + (math.random() * 0.3);
                        let angle = (math.random() - 0.5) * 100;
                        let v = (caster_loc - (GFuncVector.RotateVector2D(this.direction, angle, true)) * 1000) as Vector
                        let knockback = {
                            should_stun: 1,
                            knockback_duration: knockup_duration * (1 - enemy.GetStatusResistance()),
                            duration: knockup_duration * (1 - enemy.GetStatusResistance()),
                            knockback_distance: this.pardon_min_range + knockup_duration * 100,
                            knockback_height: 125 + (knockup_duration * 50),
                            center_x: v.x,
                            center_y: v.y,
                            center_z: caster_loc.z
                        }
                        enemy.AddNewModifier(caster, this.GetAbilityPlus(), "modifier_knockback", knockback);
                        this.AddTimer(knockup_duration, () => {
                            ApplyDamage({
                                victim: enemy,
                                attacker: caster,
                                ability: ability,
                                damage: damage,
                                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                            });
                        });
                    } else {
                        let knockup_duration = 0;
                        if (ability.begged_for_pardon) {
                            knockup_duration = 0.5;
                            let knockback = {
                                should_stun: 1,
                                knockback_duration: knockup_duration * (1 - enemy.GetStatusResistance()),
                                duration: knockup_duration * (1 - enemy.GetStatusResistance()),
                                knockback_distance: this.pardon_min_range + knockup_duration * 100,
                                knockback_height: 125 + (knockup_duration * 50),
                                center_x: caster_loc.x,
                                center_y: caster_loc.y,
                                center_z: caster_loc.z
                            }
                            enemy.AddNewModifier(caster, this.GetAbilityPlus(), "modifier_knockback", knockback);
                        }
                        this.AddTimer(knockup_duration, () => {
                            ApplyDamage({
                                victim: enemy,
                                attacker: caster,
                                ability: ability,
                                damage: damage,
                                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                            });
                            if (enemy.HasModifier("modifier_imba_polarize_debuff") && (polarize_counter == 2)) {
                                enemy.AddNewModifier(caster, ability, "modifier_imba_skewer_entangle", {
                                    duration: this.entangle_dur * (1 - enemy.GetStatusResistance())
                                });
                            } else {
                                FindClearSpaceForUnit(enemy, enemy.GetAbsOrigin(), true);
                            }
                        });
                    }
                    enemy.AddNewModifier(caster, ability, "modifier_imba_skewer_slow", {
                        duration: this.slow_duration * (1 - enemy.GetStatusResistance()),
                        pardoned: ability.begged_for_pardon
                    });
                }
            }
            ability.begged_for_pardon = undefined;
            caster.SetUnitOnClearGround();
            this.Destroy();
        }
    }
}
@registerModifier()
export class modifier_imba_skewer_motion_controller_target extends BaseModifierMotionHorizontal_Plus {
    public direction: any;
    public speed: number;
    BeCreated(params: any): void {
        if (IsServer()) {
            this.direction = Vector(params.direction_x, params.direction_y, params.direction_z);
            this.speed = params.speed;
            this.BeginMotionOrDestroy();
        }
    }

    BeDestroy(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            caster.SetUnitOnClearGround();
        }
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IgnoreTenacity() {
        return true;
    }

    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_ULTRA;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }
    UpdateHorizontalMotion(unit: IBaseNpc_Plus, time: number) {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (caster.HasModifier("modifier_imba_skewer_motion_controller") && caster.IsAlive()) {
                let set_point = unit.GetAbsOrigin() + this.direction * this.speed as Vector;
                unit.SetAbsOrigin(Vector(set_point.x, set_point.y, GetGroundPosition(set_point, unit).z));
            } else {
                this.Destroy();
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_FLAIL;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        }
        return Object.values(decFuncs);
    } */
}
@registerModifier()
export class modifier_imba_skewer_slow extends BaseModifier_Plus {
    public pardoned: any;
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.pardoned) {
            return this.GetSpecialValueFor("pardon_slow") * (-1);
        }
        return this.GetSpecialValueFor("slow") * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (this.pardoned) {
            return this.GetSpecialValueFor("pardon_slow") * (-1);
        }
        return this.GetSpecialValueFor("slow") * (-1);
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_magnataur/magnataur_skewer_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    BeCreated(params: any): void {
        this.pardoned = params.pardoned;
    }
}
@registerModifier()
export class modifier_imba_skewer_entangle extends BaseModifier_Plus {
    public position: any;
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_LIMIT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_LIMIT)
    CC_GetModifierMoveSpeed_Limit(): number {
        return 0.1;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        }
        return state;
    }
    GetEffectName(): string {
        return "particles/hero/magnataur/skewer_entangle_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.position = this.GetParentPlus().GetAbsOrigin();
            this.StartIntervalThink(0.4);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if ((this.position - this.GetParentPlus().GetAbsOrigin() as Vector).Length2D() > 3) {
                this.Destroy();
            }
        }
    }
}
@registerAbility()
export class imba_magnataur_reverse_polarity extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "magnataur_reverse_polarity";
    }
    OnAbilityPhaseStart(): boolean {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let radius = this.GetTalentSpecialValueFor("main_radius");
            let caster_loc = caster.GetAbsOrigin();
            caster.EmitSound("Hero_Magnataur.ReversePolarity.Anim");
            let animation_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_magnataur/magnataur_reverse_polarity.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
            ParticleManager.SetParticleControlEnt(animation_pfx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, undefined, caster_loc, true);
            ParticleManager.SetParticleControl(animation_pfx, 1, Vector(radius, 0, 0));
            ParticleManager.SetParticleControl(animation_pfx, 2, Vector(this.GetCastPoint(), 0, 0));
            ParticleManager.SetParticleControl(animation_pfx, 3, caster.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(animation_pfx);
            return true;
        }
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsStealable(): boolean {
        return true;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let caster_loc = caster.GetAbsOrigin();
            let direction = caster.GetForwardVector();
            let damage = this.GetTalentSpecialValueFor("damage");
            let radius = this.GetTalentSpecialValueFor("main_radius");
            let hero_stun_duration = this.GetSpecialValueFor("hero_stun_duration") + caster.GetTalentValue("special_bonus_imba_magnataur_9");
            let polarize_slow_duration = hero_stun_duration;
            let creep_stun_duration = this.GetSpecialValueFor("creep_stun_duration") + caster.GetTalentValue("special_bonus_imba_magnataur_9");
            let pull_offset = this.GetSpecialValueFor("pull_offset");
            let pull_per_stack = this.GetTalentSpecialValueFor("pull_per_stack");
            let polarize_duration = this.GetSpecialValueFor("polarize_duration");
            let polarize_slow = this.GetSpecialValueFor("polarize_slow");
            let global_pull = this.GetSpecialValueFor("global_pull");
            let final_loc = caster_loc + (direction * pull_offset) as Vector;
            caster.EmitSound("Hero_Magnataur.ReversePolarity.Cast");
            let responses = {
                "1": "magnataur_magn_polarity_01",
                "2": "magnataur_magn_polarity_02",
                "3": "magnataur_magn_polarity_03",
                "4": "magnataur_magn_polarity_04",
                "5": "magnataur_magn_polarity_05",
                "6": "magnataur_magn_polarity_06",
                "7": "magnataur_magn_polarity_07",
                "8": "magnataur_magn_polarity_08",
                "9": "magnataur_magn_polarity_09",
                "10": "magnataur_magn_polarity_10"
            }
            caster.EmitCasterSound(Object.values(responses), 25, ResHelper.EDOTA_CAST_SOUND.FLAG_BOTH_TEAMS);
            let creeps = FindUnitsInRadius(caster.GetTeam(), caster_loc, undefined, radius, this.GetAbilityTargetTeam(), DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, creep] of GameFunc.iPair(creeps)) {
                creep.SetAbsOrigin(final_loc);
                FindClearSpaceForUnit(creep, final_loc, true);
                creep.AddNewModifier(caster, this, "modifier_stunned", {
                    duration: creep_stun_duration * (1 - creep.GetStatusResistance())
                });
                ApplyDamage({
                    victim: creep,
                    attacker: caster,
                    ability: this,
                    damage: damage,
                    damage_type: this.GetAbilityDamageType()
                });
                creep.EmitSound("Hero_Magnataur.ReversePolarity.Stun");
            }
            let enemies = FindUnitsInRadius(caster.GetTeam(), caster_loc, undefined, FIND_UNITS_EVERYWHERE, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let particle_loc = final_loc as Vector;
                let enemy_pos = enemy.GetAbsOrigin();
                let current_distance = (caster_loc - enemy_pos as Vector).Length2D();
                let pull_distance = radius;
                let point_direction = (final_loc - enemy_pos as Vector).Normalized();
                let pull_pfx;
                if (enemy.HasModifier("modifier_imba_polarize_debuff")) {
                    pull_distance = pull_distance + (enemy.findBuff<modifier_imba_polarize_debuff>("modifier_imba_polarize_debuff").GetStackCount() * pull_per_stack);
                    pull_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_magnataur/magnataur_reverse_polarity_pull.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, caster);
                    ParticleManager.SetParticleControl(pull_pfx, 0, enemy.GetAbsOrigin());
                    if (caster.HasTalent("special_bonus_imba_magnataur_2") && pull_distance > radius) {
                        enemy.AddNewModifier(caster, this, "modifier_imba_reverse_polarity_slow", {
                            duration: caster.GetTalentValue("special_bonus_imba_magnataur_2") * (1 - enemy.GetStatusResistance())
                        });
                    }
                } else {
                    pull_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_magnataur/magnataur_reverse_polarity_pull.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster);
                    ParticleManager.SetParticleControl(pull_pfx, 0, enemy.GetAbsOrigin());
                }
                if (pull_distance >= current_distance) {
                    enemy.InterruptMotionControllers(true);
                    BaseModifierMotionHorizontal_Plus.RemoveAllMotionBuff(enemy);
                    enemy.SetAbsOrigin(final_loc);
                    FindClearSpaceForUnit(enemy, final_loc, true);
                    enemy.AddNewModifier(caster, this, "modifier_stunned", {
                        duration: hero_stun_duration * (1 - enemy.GetStatusResistance())
                    });
                    enemy.AddNewModifier(caster, undefined, "modifier_imba_polarize_debuff_stack", {
                        duration: polarize_duration * (1 - enemy.GetStatusResistance())
                    });
                    ApplyDamage({
                        victim: enemy,
                        attacker: caster,
                        ability: this,
                        damage: damage,
                        damage_type: this.GetAbilityDamageType()
                    });
                    enemy.EmitSound("Hero_Magnataur.ReversePolarity.Stun");
                } else if (pull_distance > radius) {
                    pull_distance = pull_distance - radius;
                    let pos = caster.GetAbsOrigin();
                    let knockbackProperties = {
                        center_x: pos.x + 1,
                        center_y: pos.y + 1,
                        center_z: pos.z,
                        duration: FrameTime() * 2,
                        knockback_duration: FrameTime() * 2,
                        knockback_distance: -pull_distance,
                        knockback_height: 0,
                        should_stun: 0
                    }
                    enemy.AddNewModifier(caster, this, "modifier_knockback", knockbackProperties);
                    particle_loc = enemy_pos + ((final_loc - enemy_pos as Vector).Normalized() * pull_distance) as Vector;
                } else {
                    pull_distance = global_pull;
                    let pos = caster.GetAbsOrigin();
                    let knockbackProperties = {
                        center_x: pos.x + 1,
                        center_y: pos.y + 1,
                        center_z: pos.z,
                        duration: FrameTime() * 2,
                        knockback_duration: FrameTime() * 2,
                        knockback_distance: -pull_distance,
                        knockback_height: 0,
                        should_stun: 0
                    }
                    enemy.AddNewModifier(caster, this, "modifier_knockback", knockbackProperties);
                    particle_loc = enemy_pos + ((final_loc - enemy_pos as Vector).Normalized() * pull_distance) as Vector;
                }
                if (enemy.IsRealUnit() && AoiHelper.IsNearEnemyClass(enemy, 1700, "ent_dota_fountain")) {
                    let fountain_loc;
                    if (enemy.GetTeam() == DOTATeam_t.DOTA_TEAM_GOODGUYS) {
                        fountain_loc = Vector(7472, 6912, 512);
                    } else {
                        fountain_loc = Vector(-7456, -6938, 528);
                    }
                    FindClearSpaceForUnit(enemy, fountain_loc + (enemy.GetAbsOrigin() - fountain_loc as Vector).Normalized() * 1700 as Vector, true);
                }
                ParticleManager.SetParticleControl(pull_pfx, 1, particle_loc);
                ParticleManager.ReleaseParticleIndex(pull_pfx);
            }
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return super.GetCastRange(location, target);
    }
}
@registerModifier()
export class modifier_imba_reverse_polarity_slow extends BaseModifier_Plus {
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetCasterPlus().GetTalentValue("special_bonus_imba_magnataur_2", "polarize_slow") * (-1);
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_magnataur_1 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_magnataur_2 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_magnataur_3 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_magnataur_4 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_magnataur_6 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_magnataur_8 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_magnataur_9 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
