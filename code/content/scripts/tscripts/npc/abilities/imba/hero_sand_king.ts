
import { GameFunc } from "../../../GameFunc";
import { AoiHelper } from "../../../helper/AoiHelper";
import { ProjectileHelper } from "../../../helper/ProjectileHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { GameServiceConfig } from "../../../shared/GameServiceConfig";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_sandking_burrowstrike extends BaseAbility_Plus {
    public target_point: any;
    GetAbilityTextureName(): string {
        return "sandking_burrowstrike";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsNetherWardStealable() {
        return false;
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        let caster = this.GetCasterPlus();
        let cast_range = this.GetSpecialValueFor("cast_range");
        if (caster.HasScepter()) {
            return this.GetSpecialValueFor("cast_range_scepter");
        } else {
            return cast_range;
        }
    }
    OnSpellStart(): void {
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
        }
        let caster = this.GetCasterPlus();
        let ability = this;
        let target_point = this.GetCursorPosition();
        let cast_responses = "sandking_skg_ability_burrowstrike_0" + math.random(1, 9);
        let sound_cast = "Ability.SandKing_BurrowStrike";
        let particle_burrow = "particles/units/heroes/hero_sandking/sandking_burrowstrike.vpcf";
        let modifier_burrow = "modifier_imba_burrowstrike_burrow";
        let burrow_speed = ability.GetSpecialValueFor("burrow_speed");
        let burrow_radius = ability.GetSpecialValueFor("burrow_radius");
        let burrowstrike_time = ability.GetSpecialValueFor("burrowstrike_time");
        burrow_radius = burrow_radius + caster.GetTalentValue("special_bonus_imba_sand_king_1");
        EmitSoundOn(cast_responses, caster);
        EmitSoundOn(sound_cast, caster);
        ProjectileHelper.ProjectileDodgePlus(caster);
        let distance = (caster.GetAbsOrigin() - target_point as Vector).Length2D();
        let direction = (target_point - caster.GetAbsOrigin() as Vector).Normalized();
        let particle_burrow_fx = ResHelper.CreateParticleEx(particle_burrow, ParticleAttachment_t.PATTACH_WORLDORIGIN, caster);
        ParticleManager.SetParticleControl(particle_burrow_fx, 0, caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_burrow_fx, 1, target_point);
        let burrow_projectile = {
            Ability: ability,
            vSpawnOrigin: caster.GetAbsOrigin(),
            fDistance: distance,
            fStartRadius: burrow_radius,
            fEndRadius: burrow_radius,
            Source: caster,
            bHasFrontalCone: false,
            bReplaceExisting: false,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            bDeleteOnHit: false,
            vVelocity: direction * burrow_speed * Vector(1, 1, 0) as Vector,
            bProvidesVision: false
        }
        ProjectileManager.CreateLinearProjectile(burrow_projectile);
        this.target_point = target_point;
        caster.SetAbsOrigin(target_point);
        this.AddTimer(FrameTime(), () => {
            ResolveNPCPositions(target_point, 128);
        });
        caster.AddNewModifier(caster, ability, modifier_burrow, {
            duration: burrowstrike_time
        });
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (!target) {
            return undefined;
        }
        if (target.IsMagicImmune()) {
            return undefined;
        }
        let caster = this.GetCasterPlus();
        let ability = this;
        let target_point = this.target_point;
        let modifier_stun = "modifier_imba_burrowstrike_stun";
        let modifier_poison = "modifier_imba_caustic_finale_poison";
        let knockback_duration = ability.GetSpecialValueFor("knockback_duration");
        let stun_duration = ability.GetSpecialValueFor("stun_duration");
        let damage = ability.GetSpecialValueFor("damage");
        let max_push_distance = ability.GetSpecialValueFor("max_push_distance");
        let knockup_height = ability.GetSpecialValueFor("knockup_height");
        let knockup_duration = ability.GetSpecialValueFor("knockup_duration");
        let caustic_ability_name = "imba_sandking_caustic_finale";
        let caustic_ability;
        let poison_duration;
        if (caster.HasAbility(caustic_ability_name)) {
            caustic_ability = caster.FindAbilityByName(caustic_ability_name);
            poison_duration = caustic_ability.GetSpecialValueFor("poison_duration");
        }
        if (caster.GetTeamNumber() != target.GetTeamNumber()) {
            if (target.TriggerSpellAbsorb(ability)) {
                return undefined;
            }
        }
        let push_distance = (target.GetAbsOrigin() - target_point as Vector).Length2D();
        if (push_distance > max_push_distance) {
            push_distance = max_push_distance;
        }
        let distance = (target.GetAbsOrigin() - caster.GetAbsOrigin() as Vector).Length2D();
        let direction = (target.GetAbsOrigin() - caster.GetAbsOrigin() as Vector).Normalized();
        let bump_point = caster.GetAbsOrigin() + direction * (distance + 150) as Vector;
        let knockbackProperties = {
            center_x: bump_point.x,
            center_y: bump_point.y,
            center_z: bump_point.z,
            duration: knockup_duration * (1 - target.GetStatusResistance()),
            knockback_duration: knockup_duration * (1 - target.GetStatusResistance()),
            knockback_distance: push_distance,
            knockback_height: knockup_height
        }
        target.RemoveModifierByName("modifier_knockback");
        target.AddNewModifier(target, undefined, "modifier_knockback", knockbackProperties);
        target.AddNewModifier(caster, ability, modifier_stun, {
            duration: stun_duration * (1 - target.GetStatusResistance())
        });
        if (target.IsRealUnit() && !target.IsIllusion() && poison_duration && poison_duration > 0 && !target.HasModifier(modifier_poison)) {
            target.AddNewModifier(caster, caustic_ability, modifier_poison, {
                duration: poison_duration
            });
        }
        let damageTable = {
            victim: target,
            attacker: caster,
            damage: damage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            ability: ability
        }
        ApplyDamage(damageTable);
        this.AddTimer(knockup_duration + FrameTime(), () => {
            ResolveNPCPositions(target_point, 128);
        });
    }
}
@registerModifier()
export class modifier_imba_burrowstrike_stun extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_stunned.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_burrowstrike_burrow extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.caster.AddNoDraw();
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true
        }
        return state;
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.caster.RemoveNoDraw();
        }
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
}
@registerAbility()
export class imba_sandking_sand_storm extends BaseAbility_Plus {
    public new_cast: any;
    public particle_sandstorm_fx: any;
    GetAbilityTextureName(): string {
        return "sandking_sand_storm";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_sandstorm_aura";
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let sound_cast = "Ability.SandKing_SandStorm.start";
        let sound_loop = "Ability.SandKing_SandStorm.loop";
        let sound_darude = "Imba.SandKingSandStorm";
        let particle_sandstorm = "particles/units/heroes/hero_sandking/sandking_sandstorm.vpcf";
        let modifier_sandstorm = "modifier_imba_sandstorm";
        let modifier_invis = "modifier_imba_sandstorm_invis";
        let radius = ability.GetSpecialValueFor("radius");
        EmitSoundOn(sound_cast, caster);
        if (GameServiceConfig.USE_MEME_SOUNDS && RollPercentage(GameServiceConfig.MEME_SOUNDS_CHANCE)) {
            EmitSoundOn(sound_darude, caster);
        } else {
            EmitSoundOn(sound_loop, caster);
        }
        this.new_cast = true;
        if (this.particle_sandstorm_fx) {
            ParticleManager.DestroyParticle(this.particle_sandstorm_fx, false);
            ParticleManager.ReleaseParticleIndex(this.particle_sandstorm_fx);
        }
        this.particle_sandstorm_fx = ResHelper.CreateParticleEx(particle_sandstorm, ParticleAttachment_t.PATTACH_WORLDORIGIN, caster);
        ParticleManager.SetParticleControl(this.particle_sandstorm_fx, 0, caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.particle_sandstorm_fx, 1, Vector(radius, radius, 0));
        let channel_time = super.GetChannelTime();
        caster.AddNewModifier(caster, ability, modifier_sandstorm, {});
        caster.AddNewModifier(caster, ability, modifier_invis, {});
        if (string.find(caster.GetUnitName(), "npc_imba_pugna_nether_ward")) {
            this.AddTimer(0.5, () => {
                if (!caster.IsAlive()) {
                    ability.OnChannelFinish(true);
                    return;
                }
                return 0.5;
            });
        }
    }
    OnChannelFinish(p_0: boolean,): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let sound_loop = "Ability.SandKing_SandStorm.loop";
        let sound_darude = "Imba.SandKingSandStorm";
        let modifier_sandstorm = "modifier_imba_sandstorm";
        let modifier_invis = "modifier_imba_sandstorm_invis";
        let invis_extend_time = ability.GetSpecialValueFor("invis_extend_time");
        this.new_cast = false;
        StopSoundOn(sound_loop, caster);
        StopSoundOn(sound_darude, caster);
        caster.RemoveModifierByName(modifier_sandstorm);
        this.AddTimer(invis_extend_time, () => {
            if (!this.new_cast && this.particle_sandstorm_fx) {
                ParticleManager.DestroyParticle(this.particle_sandstorm_fx, false);
                ParticleManager.ReleaseParticleIndex(this.particle_sandstorm_fx);
                this.particle_sandstorm_fx = undefined;
                caster.RemoveModifierByName(modifier_invis);
            }
        });
    }
}
@registerModifier()
export class modifier_imba_sandstorm extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public damage: number;
    public radius: number;
    public pull_speed: number;
    public pull_prevent_radius: number;
    public damage_interval: number;
    public damage_per_instance: number;
    public pull_per_think: any;
    public time_elapsed: number;
    public damage_instance_time: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.damage = this.ability.GetSpecialValueFor("damage");
            this.radius = this.ability.GetSpecialValueFor("radius");
            this.pull_speed = this.ability.GetSpecialValueFor("pull_speed");
            this.pull_prevent_radius = this.ability.GetSpecialValueFor("pull_prevent_radius");
            this.damage_interval = this.ability.GetSpecialValueFor("damage_interval");
            this.damage = this.damage + this.caster.GetTalentValue("special_bonus_imba_sand_king_2");
            this.damage_per_instance = this.damage * this.damage_interval;
            this.pull_per_think = this.pull_speed * FrameTime();
            this.time_elapsed = 0;
            this.damage_instance_time = this.damage_interval;
            this.StartIntervalThink(FrameTime());
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let damage_enemies = false;
            this.time_elapsed = this.time_elapsed + FrameTime();
            if (this.time_elapsed >= this.damage_instance_time) {
                damage_enemies = true;
                this.damage_instance_time = this.damage_instance_time + this.damage_interval;
            }
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (damage_enemies) {
                    let damageTable = {
                        victim: enemy,
                        attacker: this.caster,
                        damage: this.damage_per_instance,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                        ability: this.ability
                    }
                    ApplyDamage(damageTable);
                }
                let distance = (enemy.GetAbsOrigin() - this.caster.GetAbsOrigin() as Vector).Length2D();
                if (distance > this.pull_prevent_radius) {
                    let direction = (enemy.GetAbsOrigin() - this.caster.GetAbsOrigin() as Vector).Normalized();
                    let pull_location = this.caster.GetAbsOrigin() + direction * (distance - this.pull_per_think) as Vector;
                    enemy.SetAbsOrigin(pull_location);
                    ResolveNPCPositions(enemy.GetAbsOrigin(), enemy.GetHullRadius());
                }
            }
        }
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_2;
    }
}
@registerModifier()
export class modifier_imba_sandstorm_invis extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    CC_GetModifierInvisibilityLevel(): number {
        return 1;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVISIBLE]: true
        }
        return state;
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_NORMAL;
    }
}
@registerModifier()
export class modifier_imba_sandstorm_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public aura_talent: any;
    public ability: IBaseAbility_Plus;
    public particle_sandstorm: any;
    public damage: number;
    public radius: number;
    public pull_speed: number;
    public pull_prevent_radius: number;
    public damage_interval: number;
    public damage_per_instance: number;
    public pull_per_think: any;
    public time_elapsed: number;
    public damage_instance_time: number;
    public particle_sandstorm_fx: any;
    Init(p_0: any,): void {
        if (IsServer()) {
            this.AddTimer(0, () => {
                this.caster = this.GetCasterPlus();
                this.aura_talent = this.caster.HasTalent("special_bonus_imba_sand_king_7");
                if (this.aura_talent) {
                    this.ability = this.GetAbilityPlus();
                    this.particle_sandstorm = "particles/hero/sand_king/sandking_sandstorm_aura.vpcf";
                    this.damage = this.ability.GetSpecialValueFor("damage");
                    this.radius = this.ability.GetSpecialValueFor("radius");
                    this.pull_speed = this.ability.GetSpecialValueFor("pull_speed");
                    this.pull_prevent_radius = this.ability.GetSpecialValueFor("pull_prevent_radius");
                    this.damage_interval = this.ability.GetSpecialValueFor("damage_interval");
                    this.damage = this.damage * (1 - this.caster.GetTalentValue("special_bonus_imba_sand_king_7") * 0.01);
                    this.radius = this.radius * (1 - this.caster.GetTalentValue("special_bonus_imba_sand_king_7") * 0.01);
                    this.pull_speed = this.pull_speed * (1 - this.caster.GetTalentValue("special_bonus_imba_sand_king_7") * 0.01);
                    this.damage_per_instance = this.damage * this.damage_interval;
                    this.pull_per_think = this.pull_speed * FrameTime();
                    this.time_elapsed = 0;
                    this.damage_instance_time = this.damage_interval;
                    if (this.particle_sandstorm_fx) {
                        ParticleManager.DestroyParticle(this.particle_sandstorm_fx, false);
                        ParticleManager.ReleaseParticleIndex(this.particle_sandstorm_fx);
                    }
                    this.particle_sandstorm_fx = ResHelper.CreateParticleEx(this.particle_sandstorm, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.caster);
                    ParticleManager.SetParticleControl(this.particle_sandstorm_fx, 0, this.caster.GetAbsOrigin());
                    ParticleManager.SetParticleControl(this.particle_sandstorm_fx, 1, Vector(this.radius, this.radius, 1));
                    this.StartIntervalThink(FrameTime());
                    return undefined;
                } else {
                    return 2;
                }
            });
        }
    }
    IsHidden(): boolean {
        if (this.aura_talent) {
            return false;
        }
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (!this.caster.IsAlive()) {
                return;
            }
            ResolveNPCPositions(this.caster.GetAbsOrigin(), this.radius);
            let damage_enemies = false;
            this.time_elapsed = this.time_elapsed + FrameTime();
            if (this.time_elapsed >= this.damage_instance_time) {
                damage_enemies = true;
                this.damage_instance_time = this.damage_instance_time + this.damage_interval;
            }
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (damage_enemies) {
                    let damageTable = {
                        victim: enemy,
                        attacker: this.caster,
                        damage: this.damage_per_instance,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                        ability: this.ability
                    }
                    ApplyDamage(damageTable);
                }
                let distance = (enemy.GetAbsOrigin() - this.caster.GetAbsOrigin() as Vector).Length2D();
                if (distance > this.pull_prevent_radius) {
                    let direction = (enemy.GetAbsOrigin() - this.caster.GetAbsOrigin() as Vector).Normalized();
                    let pull_location = this.caster.GetAbsOrigin() + direction * (distance - this.pull_per_think) as Vector;
                    enemy.SetAbsOrigin(pull_location);
                }
            }
        }
    }

    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_DEATH,
            2: Enum_MODIFIER_EVENT.ON_RESPAWN
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(params: ModifierInstanceEvent): void {
        if (IsServer()) {
            if (params.unit == this.caster) {
                ParticleManager.DestroyParticle(this.particle_sandstorm_fx, false);
                ParticleManager.ReleaseParticleIndex(this.particle_sandstorm_fx);
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_RESPAWN)
    CC_OnRespawn(params: ModifierUnitEvent): void {
        if (IsServer()) {
            if (params.unit == this.caster) {
                this.particle_sandstorm_fx = ResHelper.CreateParticleEx(this.particle_sandstorm, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.caster);
                ParticleManager.SetParticleControl(this.particle_sandstorm_fx, 0, this.caster.GetAbsOrigin());
                ParticleManager.SetParticleControl(this.particle_sandstorm_fx, 1, Vector(this.radius, this.radius, 1));
            }
        }
    }
}
@registerAbility()
export class imba_sandking_caustic_finale extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "sandking_caustic_finale";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_caustic_finale_trigger";
    }
}
@registerModifier()
export class modifier_imba_caustic_finale_trigger extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public modifier_poison: any;
    public poison_duration: number;
    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.modifier_poison = "modifier_imba_caustic_finale_poison";
        this.poison_duration = this.ability.GetSpecialValueFor("poison_duration");
    }

    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            let target = keys.target;
            if (attacker == this.caster) {
                this.ApplyCausticFinale(attacker, target);
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            let target = keys.unit;
            let ability = keys.inflictor;
            if (this.caster.HasTalent("special_bonus_imba_sand_king_8")) {
                if (attacker == this.caster && !(ability == this.ability)) {
                    this.ApplyCausticFinale(attacker, target);
                }
            }
        }
    }
    ApplyCausticFinale(attacker: IBaseNpc_Plus, target: IBaseNpc_Plus) {
        if (this.caster.PassivesDisabled()) {
            return;
        }
        if (attacker.IsIllusion()) {
            return;
        }
        if (target.HasModifier(this.modifier_poison)) {
            return;
        }
        if (target.IsBuilding() || target.IsOther()) {
            return;
        }
        if (target.GetTeamNumber() == this.caster.GetTeamNumber()) {
            return;
        }
        target.AddNewModifier(this.caster, this.ability, this.modifier_poison, {
            duration: this.poison_duration
        });
    }
}
@registerModifier()
export class modifier_imba_caustic_finale_poison extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public sound_explode: any;
    public particle_explode: any;
    public particle_debuff: any;
    public modifier_poison: any;
    public modifier_slow: any;
    public damage: number;
    public radius: number;
    public slow_duration: number;
    public particle_debuff_fx: any;
    public particle_explode_fx: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.sound_explode = "Ability.SandKing_CausticFinale";
        this.particle_explode = "particles/units/heroes/hero_sandking/sandking_caustic_finale_explode.vpcf";
        this.particle_debuff = "particles/units/heroes/hero_sandking/sandking_caustic_finale_debuff.vpcf";
        this.modifier_poison = "modifier_imba_caustic_finale_poison";
        this.modifier_slow = "modifier_imba_caustic_finale_debuff";
        this.damage = this.ability.GetSpecialValueFor("damage");
        this.radius = this.ability.GetSpecialValueFor("radius");
        this.slow_duration = this.ability.GetSpecialValueFor("slow_duration");
        if (IsServer()) {
            this.AddTimer(0.3, () => {
                if (!this.IsNull()) {
                    this.particle_debuff_fx = ResHelper.CreateParticleEx(this.particle_debuff, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, this.parent);
                    ParticleManager.SetParticleControlEnt(this.particle_debuff_fx, 0, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
                    this.AddParticle(this.particle_debuff_fx, false, false, -1, false, false);
                    return 0.3;
                }
            });
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    BeDestroy(): void {
        if (IsServer()) {
            EmitSoundOn(this.sound_explode, this.parent);
            this.particle_explode_fx = ResHelper.CreateParticleEx(this.particle_explode, ParticleAttachment_t.PATTACH_ABSORIGIN, this.parent);
            ParticleManager.SetParticleControl(this.particle_explode_fx, 0, this.parent.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(this.particle_explode_fx);
            let slow_modifier = undefined;
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let damageTable = {
                    victim: enemy,
                    attacker: this.caster,
                    damage: this.damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    ability: this.ability
                }
                ApplyDamage(damageTable);
                if (enemy.HasModifier(this.modifier_poison)) {
                    let modifier_poison_handler = enemy.FindModifierByName(this.modifier_poison);
                    if (modifier_poison_handler) {
                        modifier_poison_handler.Destroy();
                    }
                }
                slow_modifier = enemy.AddNewModifier(this.caster, this.ability, this.modifier_slow, {
                    duration: this.slow_duration * (1 - enemy.GetStatusResistance())
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_caustic_finale_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public ms_slow_pct: number;
    public caustic_finale_slow_as: any;
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.ms_slow_pct = this.ability.GetSpecialValueFor("ms_slow_pct");
        this.caustic_finale_slow_as = this.GetSpecialValueFor("caustic_finale_slow_as");
        this.ms_slow_pct = this.ms_slow_pct + this.caster.GetTalentValue("special_bonus_imba_sand_king_5");
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.ms_slow_pct * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.caustic_finale_slow_as;
    }
}
@registerAbility()
export class imba_sandking_epicenter extends BaseAbility_Plus {
    public particle_sandblast_fx: any;
    GetAbilityTextureName(): string {
        return "sandking_epicenter";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CAST_ABILITY_4;
    }
    GetChannelTime(): number {
        let caster = this.GetCasterPlus();
        let ability = this;
        let scepter = caster.HasScepter();
        let channel_time = ability.GetSpecialValueFor("channel_time");
        let scepter_channel_time = ability.GetSpecialValueFor("scepter_channel_time");
        if (scepter) {
            return scepter_channel_time;
        } else {
            return channel_time;
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let sound_cast = "Ability.SandKing_Epicenter.spell";
        let particle_sandblast = "particles/units/heroes/hero_sandking/sandking_epicenter_tell.vpcf";
        let modifier_pulse = "modifier_imba_epicenter_pulse";
        let channel_time = ability.GetSpecialValueFor("channel_time");
        EmitSoundOnLocationWithCaster(caster.GetAbsOrigin(), sound_cast, caster);
        this.particle_sandblast_fx = ResHelper.CreateParticleEx(particle_sandblast, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, caster);
        ParticleManager.SetParticleControlEnt(this.particle_sandblast_fx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_tail", caster.GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(this.particle_sandblast_fx, 1, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_tail", caster.GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(this.particle_sandblast_fx, 2, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_tail", caster.GetAbsOrigin(), true);
        if (string.find(caster.GetUnitName(), "npc_imba_pugna_nether_ward")) {
            this.AddTimer(channel_time, () => {
                ParticleManager.DestroyParticle(this.particle_sandblast_fx, false);
                ParticleManager.ReleaseParticleIndex(this.particle_sandblast_fx);
                caster.AddNewModifier(caster, ability, modifier_pulse, {});
            });
        }
    }
    OnChannelFinish(interrupted: boolean): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let modifier_pulse = "modifier_imba_epicenter_pulse";
        let failed_response = "sandking_skg_ability_failure_0" + math.random(1, 6);
        ParticleManager.DestroyParticle(this.particle_sandblast_fx, false);
        ParticleManager.ReleaseParticleIndex(this.particle_sandblast_fx);
        if (interrupted) {
            EmitSoundOn(failed_response, caster);
            return undefined;
        }
        caster.StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_4);
        caster.AddNewModifier(caster, ability, modifier_pulse, {});
    }
}
@registerModifier()
export class modifier_imba_epicenter_pulse extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public sound_epicenter: any;
    public particle_epicenter: any;
    public scepter: any;
    public modifier_slow: any;
    public pulse_count: number;
    public damage: number;
    public slow_duration: number;
    public base_radius: number;
    public pulse_radius_increase: number;
    public max_pulse_radius: number;
    public pull_speed: number;
    public scepter_pulses_count_pct: number;
    public epicenter_duration: number;
    public radius: number;
    public pulses: any;
    public pulse_interval: number;
    public pull_radius: number;
    public particle_epicenter_fx: any;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.sound_epicenter = "Ability.SandKing_Epicenter";
            this.particle_epicenter = "particles/units/heroes/hero_sandking/sandking_epicenter.vpcf";
            this.scepter = this.caster.HasScepter();
            this.modifier_slow = "modifier_imba_epicenter_slow";
            this.pulse_count = this.ability.GetSpecialValueFor("pulse_count");
            this.damage = this.ability.GetSpecialValueFor("damage");
            this.slow_duration = this.ability.GetSpecialValueFor("slow_duration");
            this.base_radius = this.ability.GetSpecialValueFor("base_radius");
            this.pulse_radius_increase = this.ability.GetSpecialValueFor("pulse_radius_increase");
            this.max_pulse_radius = this.ability.GetSpecialValueFor("max_pulse_radius");
            this.pull_speed = this.ability.GetSpecialValueFor("pull_speed");
            this.scepter_pulses_count_pct = this.ability.GetSpecialValueFor("scepter_pulses_count_pct");
            this.epicenter_duration = this.ability.GetSpecialValueFor("epicenter_duration");
            EmitSoundOn(this.sound_epicenter, this.caster);
            this.radius = this.base_radius;
            this.pulses = 0;
            if (this.scepter) {
                this.pulse_count = this.pulse_count * (1 + this.scepter_pulses_count_pct * 0.01);
            }
            this.pulse_count = this.pulse_count + this.caster.GetTalentValue("special_bonus_imba_sand_king_6");
            this.pulse_interval = this.epicenter_duration / this.pulse_count;
            this.StartIntervalThink(this.pulse_interval);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            this.pull_radius = this.radius;
            this.pull_radius = this.pull_radius + this.caster.GetTalentValue("special_bonus_imba_sand_king_4");
            this.pulses = this.pulses + 1;
            this.particle_epicenter_fx = ResHelper.CreateParticleEx(this.particle_epicenter, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.caster);
            ParticleManager.SetParticleControl(this.particle_epicenter_fx, 0, this.caster.GetAbsOrigin());
            ParticleManager.SetParticleControl(this.particle_epicenter_fx, 1, Vector(this.radius, this.radius, 1));
            ParticleManager.ReleaseParticleIndex(this.particle_epicenter_fx);
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let damageTable = {
                    victim: enemy,
                    attacker: this.caster,
                    damage: this.damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    ability: this.ability
                }
                ApplyDamage(damageTable);
                enemy.AddNewModifier(this.caster, this.ability, this.modifier_slow, {
                    duration: this.slow_duration * (1 - enemy.GetStatusResistance())
                });
            }
            enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.pull_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let distance = (enemy.GetAbsOrigin() - this.caster.GetAbsOrigin() as Vector).Length2D();
                let direction = (enemy.GetAbsOrigin() - this.caster.GetAbsOrigin() as Vector).Normalized();
                if ((distance - this.pull_speed) > 50) {
                    let pull_point = this.caster.GetAbsOrigin() + direction * (distance - this.pull_speed) as Vector;
                    enemy.SetAbsOrigin(pull_point);
                    this.AddTimer(FrameTime(), () => {
                        ResolveNPCPositions(pull_point, 64);
                    });
                }
            }
            this.radius = this.radius + this.pulse_radius_increase;
            if (this.radius > this.max_pulse_radius) {
                this.radius = this.max_pulse_radius;
            }
            if (this.pulses >= this.pulse_count) {
                StopSoundOn(this.sound_epicenter, this.caster);
                this.Destroy();
            }
        }
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_epicenter_slow extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public ms_slow_pct: number;
    public as_slow: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.ms_slow_pct = this.ability.GetSpecialValueFor("ms_slow_pct");
        this.as_slow = this.ability.GetSpecialValueFor("as_slow");
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.ms_slow_pct * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.as_slow * (-1);
    }
}
@registerAbility()
export class imba_sandking_sand_storm_720 extends BaseAbility_Plus {
    public caster: IBaseNpc_Plus;
    public damage_tick_rate: number;
    public sand_storm_radius: number;
    public AbilityDuration: any;
    public sand_storm_damage: number;
    public fade_delay: number;
    public sand_storm: any;
    OnSpellStart(): void {
        this.caster = this.GetCasterPlus();
        this.damage_tick_rate = this.GetSpecialValueFor("damage_tick_rate");
        this.sand_storm_radius = this.GetSpecialValueFor("sand_storm_radius");
        this.AbilityDuration = this.GetSpecialValueFor("AbilityDuration");
        this.sand_storm_damage = this.GetSpecialValueFor("sand_storm_damage");
        this.fade_delay = this.GetSpecialValueFor("fade_delay");
        if (!IsServer()) {
            return;
        }
        this.caster.EmitSound("Ability.SandKing_SandStorm.start");
        if (this.sand_storm && this.sand_storm != undefined && !this.sand_storm.IsNull()) {
            this.caster.StopSound("Ability.SandKing_SandStorm.loop");
            this.sand_storm.Destroy();
        }
        this.caster.EmitSound("Ability.SandKing_SandStorm.loop");
        if (GameServiceConfig.USE_MEME_SOUNDS && RollPercentage(GameServiceConfig.MEME_SOUNDS_CHANCE) && this.sand_storm == undefined) {
            this.caster.EmitSound("Imba.SandKingSandStorm");
        }
        this.sand_storm = CreateModifierThinker(this.caster, this, "modifier_imba_sandking_sand_storm_720_thinker", {
            duration: this.AbilityDuration
        }, this.caster.GetAbsOrigin(), this.caster.GetTeamNumber(), false);
    }
    OnOwnerDied(): void {
        if (!IsServer()) {
            return;
        }
        if (this.sand_storm && this.sand_storm != undefined) {
            this.sand_storm.Destroy();
            this.sand_storm = undefined;
            this.caster.StopSound("Ability.SandKing_SandStorm.loop");
            this.caster.StopSound("Imba.SandKingSandStorm");
        }
    }
}
@registerModifier()
export class modifier_imba_sandking_sand_storm_720_thinker extends BaseModifier_Plus {
    public ability: imba_sandking_sand_storm_720;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public damage_tick_rate: number;
    public sand_storm_radius: number;
    public AbilityDuration: any;
    public sand_storm_damage: number;
    public fade_delay: number;
    public pull_speed: number;
    public damage_counter: number;
    public invis_counter: number;
    public particle: any;
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.damage_tick_rate = this.ability.GetSpecialValueFor("damage_tick_rate");
        this.sand_storm_radius = this.ability.GetSpecialValueFor("sand_storm_radius") + this.caster.GetTalentValue("special_bonus_imba_sand_king_9");
        this.AbilityDuration = this.ability.GetSpecialValueFor("AbilityDuration");
        this.sand_storm_damage = this.ability.GetSpecialValueFor("sand_storm_damage") + this.caster.GetTalentValue("special_bonus_imba_sand_king_2");
        this.fade_delay = this.ability.GetSpecialValueFor("fade_delay");
        this.pull_speed = this.ability.GetSpecialValueFor("pull_speed");
        this.damage_counter = 0;
        this.invis_counter = 0;
        if (!IsServer()) {
            return;
        }
        this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_sandking/sandking_sandstorm.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.caster);
        ParticleManager.SetParticleControl(this.particle, 0, this.caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.particle, 1, Vector(this.sand_storm_radius, this.sand_storm_radius, 0));
        this.AddParticle(this.particle, false, false, -1, false, false);
        this.caster.AddNewModifier(this.caster, this.ability, "modifier_invisible", {
            duration: this.AbilityDuration
        });
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.sand_storm_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        let frameTime = FrameTime();
        this.damage_counter = this.damage_counter + frameTime;
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (!AoiHelper.IsNearFountain(enemy.GetAbsOrigin(), 1200)) {
                let direction = (this.parent.GetAbsOrigin() - enemy.GetAbsOrigin() as Vector).Normalized();
                let pull_location = enemy.GetAbsOrigin() + (direction * this.pull_speed * frameTime) as Vector;
                enemy.SetAbsOrigin(pull_location);
                ResolveNPCPositions(enemy.GetAbsOrigin(), enemy.GetHullRadius());
            }
        }
        if (this.damage_counter >= this.damage_tick_rate) {
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let damageTable = {
                    victim: enemy,
                    damage: this.sand_storm_damage * this.damage_tick_rate,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.caster,
                    ability: this.ability
                }
                ApplyDamage(damageTable);
            }
            this.damage_counter = 0;
        }
        if ((this.caster.GetAbsOrigin() - this.parent.GetAbsOrigin() as Vector).Length() <= this.sand_storm_radius) {
            if (!this.caster.HasModifier("modifier_invisible")) {
                this.invis_counter = this.invis_counter + FrameTime();
                if (this.invis_counter >= this.fade_delay) {
                    this.caster.AddNewModifier(this.caster, this.ability, "modifier_invisible", {
                        duration: this.GetRemainingTime(),
                        cancelattack: false
                    });
                    this.invis_counter = 0;
                }
            }
        } else {
            this.caster.RemoveModifierByName("modifier_invisible");
            this.caster.StopSound("Ability.SandKing_SandStorm.loop");
            this.caster.StopSound("Imba.SandKingSandStorm");
            this.ability.sand_storm = undefined;
            this.Destroy();
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetRemainingTime() <= 0) {
            this.caster.StopSound("Ability.SandKing_SandStorm.loop");
            this.caster.StopSound("Imba.SandKingSandStorm");
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK,
            2: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.caster) {
            this.invis_counter = 0;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(keys: ModifierAbilityEvent): void {
        if (keys.unit == this.caster) {
            this.invis_counter = 0;
        }
    }
    IsAura(): boolean {
        return true;
    }
    GetAuraRadius(): number {
        return this.sand_storm_radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_sandking_sand_storm_720_thinker_aura";
    }
}
@registerModifier()
export class modifier_imba_sandking_sand_storm_720_invisible extends BaseModifier_Plus {
}
@registerModifier()
export class modifier_imba_sandking_sand_storm_720_thinker_aura extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public coarse_vision_pct: number;
    public coarse_movement_pct: number;
    public coarse_miss_pct: number;
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.ability = this.GetAbilityPlus();
        this.coarse_vision_pct = this.ability.GetSpecialValueFor("coarse_vision_pct");
        this.coarse_movement_pct = this.ability.GetSpecialValueFor("coarse_movement_pct");
        this.coarse_miss_pct = this.ability.GetSpecialValueFor("coarse_miss_pct");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_VISION_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_VISION_PERCENTAGE)
    CC_GetBonusVisionPercentage(): number {
        return this.coarse_vision_pct;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.coarse_movement_pct;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE)
    CC_GetModifierMiss_Percentage(): number {
        return this.coarse_miss_pct;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_sand_king_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_sand_king_2 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_sand_king_9 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_sand_king_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_sand_king_6 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_sand_king_8 extends BaseModifier_Plus {
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
