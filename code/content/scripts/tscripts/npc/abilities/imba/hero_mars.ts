
import { GameFunc } from "../../../GameFunc";
import { AI_ability } from "../../../ai/AI_ability";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionBoth_Plus, BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_mars_spear extends BaseAbility_Plus {
    public autocast: any;
    public trailblazer_particles: any;
    public trailblazer_thinker: any;
    public projectiles: { [k: string]: any };

    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.POSITION_if_enemy(this)
    }


    GetAOERadius(): number {
        if (this.GetAutoCastState()) {
            return this.GetSpecialValueFor("heaven_spear_radius");
        }
        return 0;
    }
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        if (IsClient()) {
            return this.GetSpecialValueFor("spear_range");
        }
    }
    OnAbilityPhaseStart(): boolean {
        this.autocast = this.GetAutoCastState();
        if (this.autocast) {
            this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_1);
        }
        return true;
    }

    addProjectile(iProjectileHandle: ProjectileID) {
        this.projectiles[iProjectileHandle + ""] = {};
        let pos = ProjectileManager.GetLinearProjectileLocation(iProjectileHandle);
        this.projectiles[iProjectileHandle + ""].location = pos;
        this.projectiles[iProjectileHandle + ""].init_pos = pos;
        let direction = ProjectileManager.GetLinearProjectileVelocity(iProjectileHandle);
        direction.z = 0
        direction = direction.Normalized()
        this.projectiles[iProjectileHandle + ""].direction = direction;
    }
    OnSpellStart(): void {
        let point = this.GetCursorPosition();
        let projectile_name = "particles/units/heroes/hero_mars/mars_spear.vpcf";
        let projectile_distance = this.GetSpecialValueFor("spear_range");
        let projectile_speed = this.GetSpecialValueFor("spear_speed");
        let projectile_radius = this.GetSpecialValueFor("spear_width");
        let projectile_vision = this.GetSpecialValueFor("spear_vision");
        let heaven_spear_delay = this.GetSpecialValueFor("heaven_spear_delay");
        this.trailblazer_particles = {}
        this.projectiles = {}
        if (!IsServer()) {
            return;
        }
        if (this.autocast) {
            let duration = projectile_distance / projectile_speed + heaven_spear_delay;
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_mars_spear_heaven_spear", {
                duration: duration
            });
        } else {
            let direction = point - this.GetCasterPlus().GetOrigin() as Vector;
            direction.z = 0;
            direction = direction.Normalized();
            let info: CreateLinearProjectileOptions = {
                Source: this.GetCasterPlus(),
                Ability: this,
                vSpawnOrigin: this.GetCasterPlus().GetOrigin(),
                // bDeleteOnHit: false,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                EffectName: projectile_name,
                fDistance: projectile_distance,
                fStartRadius: projectile_radius,
                fEndRadius: projectile_radius,
                vVelocity: direction * projectile_speed as Vector,
                bHasFrontalCone: false,
                // bReplaceExisting: false,
                bProvidesVision: true,
                iVisionRadius: projectile_vision,
                // fVisionDuration: 10,
                iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber()
            }
            ProjectileManager.CreateLinearProjectile(info);
            this.trailblazer_thinker = BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_imba_mars_spear_trailblazer_thinker", {
                duration: this.GetSpecialValueFor("trailblazer_duration")
            }, this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus().GetTeamNumber(), false);
        }
        EmitSoundOn("Hero_Mars.Spear.Cast", this.GetCasterPlus());
        EmitSoundOn("Hero_Mars.Spear", this.GetCasterPlus());
    }
    OnProjectileThink(vLocation: Vector): void {
        if (!IsServer()) {
            return;
        }
        if (this.trailblazer_thinker && vLocation) {
            this.trailblazer_thinker.SetAbsOrigin(vLocation);
        }
    }
    OnProjectileHitHandle(target: IBaseNpc_Plus, location: Vector, _iProjectileHandle: ProjectileID) {
        let iProjectileHandle = _iProjectileHandle + "";
        if (!this.projectiles[iProjectileHandle]) {
            this.addProjectile(_iProjectileHandle);
        }
        if (!target || !target.IsRealUnit()) {
            let projectile_vision = this.GetSpecialValueFor("spear_vision");
            AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), location, projectile_vision, 1, false);
            delete this.projectiles[iProjectileHandle];
            return;
        }
        let stun = this.GetSpecialValueFor("stun_duration") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_unique_mars_spear_stun_duration");
        let damage = this.GetSpecialValueFor("damage") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_unique_mars_spear_bonus_damage");
        let damageTable = {
            victim: target,
            attacker: this.GetCasterPlus(),
            damage: damage,
            damage_type: this.GetAbilityDamageType(),
            ability: this,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE
        }
        ApplyDamage(damageTable);
        if (this.projectiles[iProjectileHandle].unit) {
            let direction = this.projectiles[iProjectileHandle].direction;
            let proj_angle = VectorToAngles(direction).y;
            let unit_angle = VectorToAngles(target.GetOrigin() - location as Vector).y;
            let angle_diff = unit_angle - proj_angle;
            if (AngleDiff(unit_angle, proj_angle) >= 0) {
                direction = RotatePosition(Vector(0, 0, 0), QAngle(0, 90, 0), direction);
            } else {
                direction = RotatePosition(Vector(0, 0, 0), QAngle(0, -90, 0), direction);
            }
            let knockback_duration = this.GetSpecialValueFor("knockback_duration");
            let knockback_distance = this.GetSpecialValueFor("knockback_distance");
            target.AddNewModifier(this.GetCasterPlus(), this, "modifier_generic_knockback", {
                duration: knockback_duration,
                distance: knockback_distance,
                direction_x: direction.x,
                direction_y: direction.y,
                IsFlail: false
            });
            let sound_cast = "Hero_Mars.Spear.Knockback";
            EmitSoundOn(sound_cast, target);
            return false;
        }
        let modifier = target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_mars_spear", {
            projectile: iProjectileHandle
        });
        this.projectiles[iProjectileHandle].unit = target;
        this.projectiles[iProjectileHandle].modifier = modifier;
        this.projectiles[iProjectileHandle].active = false;
        let sound_cast = "Hero_Mars.Spear.Target";
        EmitSoundOn(sound_cast, target);
    }
    OnProjectileThinkHandle(_iProjectileHandle: ProjectileID): void {
        let iProjectileHandle = "" + _iProjectileHandle;
        if (!this.projectiles[iProjectileHandle]) {
            this.addProjectile(_iProjectileHandle);
        }
        let data = this.projectiles[iProjectileHandle];
        let tree_radius = 120;
        let wall_radius = 50;
        let building_radius = 30;
        let blocker_radius = 70;
        let location = ProjectileManager.GetLinearProjectileLocation(_iProjectileHandle);
        data.location = location;
        if (!data.unit) {
            return;
        }
        if (!data.active) {
            let difference = (data.unit.GetOrigin() - data.init_pos as Vector).Length2D() - (data.location - data.init_pos as Vector).Length2D();
            if (difference > 0) {
                return;
            }
            data.active = true;
        }
        let arena_walls = Entities.FindAllByClassnameWithin("npc_dota_phantomassassin_gravestone", data.location, wall_radius) as IBaseNpc_Plus[];
        for (const arena_wall of (arena_walls)) {
            if (arena_wall.HasModifier("modifier_imba_mars_arena_of_blood_blocker")) {
                this.Pinned(_iProjectileHandle);
                return;
            }
        }
        let thinkers = Entities.FindAllByClassnameWithin("npc_dota_thinker", data.location, wall_radius) as IBaseNpc_Plus[];
        for (const [_, thinker] of GameFunc.iPair(thinkers)) {
            if (thinker.IsPhantomBlocker()) {
                this.Pinned(_iProjectileHandle);
                return;
            }
        }
        let base_loc = GetGroundPosition(data.location, data.unit);
        let search_loc = GetGroundPosition(base_loc + data.direction * wall_radius as Vector, data.unit);
        if (search_loc.z - base_loc.z > 10 && (!GridNav.IsTraversable(search_loc))) {
            this.Pinned(_iProjectileHandle);
            return;
        }
        if (GridNav.IsNearbyTree(data.location, tree_radius, false)) {
            this.Pinned(_iProjectileHandle);
            return;
        }
        let buildings = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), data.location, undefined, building_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, 0, false);
        if (GameFunc.GetCount(buildings) > 0) {
            this.Pinned(_iProjectileHandle);
            return;
        }
    }
    Pinned(_iProjectileHandle: ProjectileID) {
        let iProjectileHandle = "" + _iProjectileHandle;
        let data = this.projectiles[iProjectileHandle];
        let duration = this.GetSpecialValueFor("stun_duration");
        let projectile_vision = this.GetSpecialValueFor("spear_vision");
        AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), data.unit.GetOrigin(), projectile_vision, duration, false);
        ProjectileManager.DestroyLinearProjectile(_iProjectileHandle);
        if (data.modifier && !data.modifier.IsNull()) {
            data.modifier.Destroy();
            data.unit.SetOrigin(GetGroundPosition(data.location, data.unit));
        }
        data.unit.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_mars_spear_debuff", {
            duration: duration,
            projectile: iProjectileHandle
        });
        this.PlayEffects(_iProjectileHandle, duration);
        delete this.projectiles[iProjectileHandle];
    }
    PlayEffects(projID: ProjectileID, duration: number) {
        let projID_str = "" + projID;
        let particle_cast = "particles/units/heroes/hero_mars/mars_spear_impact.vpcf";
        let sound_cast = "Hero_Mars.Spear.Root";
        let data = this.projectiles[projID_str];
        let delta = 50;
        let location = GetGroundPosition(data.location, data.unit) + data.direction * delta as Vector;
        let effect_cast = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
        ParticleManager.SetParticleControl(effect_cast, 0, location);
        ParticleManager.SetParticleControl(effect_cast, 1, data.direction * 1000 as Vector);
        ParticleManager.SetParticleControl(effect_cast, 2, Vector(duration, 0, 0));
        ParticleManager.SetParticleControlForward(effect_cast, 0, data.direction);
        ParticleManager.ReleaseParticleIndex(effect_cast);
        EmitSoundOn(sound_cast, data.unit);
    }
}
@registerModifier()
export class modifier_imba_mars_spear_heaven_spear extends BaseModifier_Plus {
    public origin: any;
    public radius: number;
    public knockback_radius: number;
    public stun_duration: number;
    public knockback_duration: number;
    public delay: number;
    public height: any;
    public travel_time: number;
    public trailblazer_thinker: any;
    RemoveOnDeath(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.origin = this.GetAbilityPlus().GetCursorPosition();
        this.radius = this.GetSpecialValueFor("heaven_spear_radius");
        this.knockback_radius = this.GetSpecialValueFor("heaven_spear_knockback");
        this.stun_duration = this.GetSpecialValueFor("stun_duration");
        this.knockback_duration = this.GetSpecialValueFor("heaven_spear_duration");
        this.delay = this.GetSpecialValueFor("heaven_spear_delay");
        this.height = 700;
        this.travel_time = this.GetDuration() - this.delay;
        AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), this.origin, this.radius, this.stun_duration, false);
        let pre_spear = ResHelper.CreateParticleEx("particles/units/hero/hero_mars/mars_sky_spear.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(pre_spear, 1, Vector(this.height, this.delay, this.travel_time));
        ParticleManager.SetParticleControl(pre_spear, 2, this.origin);
        this.AddParticle(pre_spear, false, false, -1, false, false);
    }
    BeRemoved(): void {
        if (!IsServer()) {
            return;
        }
        let units = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.origin, undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
        let hero_found = 0;
        if (GameFunc.GetCount(units) > 0) {
            for (const v of (units)) {
                if (v.IsConsideredHero() && hero_found < 1) {
                    hero_found = hero_found + 1;
                    v.SetAbsOrigin(this.origin);
                    v.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_mars_spear_debuff", {
                        duration: this.stun_duration,
                        heaven_spear: 1
                    });
                    EmitSoundOn("Hero_Mars.Spear.Root", v);
                } else {
                    let enemy_direction = (v.GetOrigin() - this.origin as Vector).Normalized();
                    if (!v.HasModifier("modifier_imba_mars_spear_debuff")) {
                        v.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_generic_knockback", {
                            duration: this.knockback_duration,
                            distance: this.knockback_radius,
                            height: 50,
                            direction_x: enemy_direction.x,
                            direction_y: enemy_direction.y
                        });
                    }
                }
                let damageTable = {
                    victim: v,
                    attacker: this.GetCasterPlus(),
                    damage: this.GetSpecialValueFor("damage"),
                    damage_type: this.GetAbilityPlus().GetAbilityDamageType(),
                    ability: this.GetAbilityPlus(),
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE
                }
                ApplyDamage(damageTable);
            }
        }
        this.trailblazer_thinker = BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_mars_spear_trailblazer_thinker", {
            duration: this.GetSpecialValueFor("trailblazer_duration"),
            heaven_spear: 1
        }, this.origin, this.GetCasterPlus().GetTeamNumber(), false);
        this.trailblazer_thinker.EmitSound("Hero_Mars.Spear.Target", this.GetCasterPlus());
    }
}
@registerModifier()
export class modifier_imba_mars_spear_trailblazer_thinker extends BaseModifier_Plus {
    public heaven_spear: any;
    public tick_time: number;
    public start_pos: any;
    public end_pos: any;
    public pfx: any;
    IsPurgable(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_PROVIDES_VISION]: true
        };
    }
    BeCreated(keys: any): void {
        if (!IsServer()) {
            return;
        }
        if (keys.heaven_spear) {
            this.heaven_spear = keys.heaven_spear;
        }
        this.tick_time = this.GetSpecialValueFor("trailblazer_tick_time");
        this.start_pos = this.GetParentPlus().GetAbsOrigin();
        let direction = (this.GetCasterPlus().GetCursorPosition() - this.start_pos as Vector).Normalized();
        if (this.heaven_spear && this.heaven_spear == 1) {
            this.end_pos = this.start_pos;
        } else {
            let direction = (this.GetCasterPlus().GetCursorPosition() - this.start_pos as Vector).Normalized();
            this.end_pos = this.start_pos + direction * this.GetSpecialValueFor("spear_range");
        }
        if (this.heaven_spear && this.heaven_spear == 1) {
            let ground_pfx = ResHelper.CreateParticleEx("particles/units/hero/hero_mars/mars_sky_spear_ground.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
            ParticleManager.SetParticleControl(ground_pfx, 0, this.start_pos);
            ParticleManager.ReleaseParticleIndex(ground_pfx);
        }
        this.pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_mars/mars_spear_burning_trail.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.GetParentPlus());
        ParticleManager.SetParticleControl(this.pfx, 0, this.start_pos);
        ParticleManager.SetParticleControl(this.pfx, 1, this.end_pos);
        ParticleManager.SetParticleControl(this.pfx, 2, Vector(this.GetSpecialValueFor("trailblazer_duration"), 0, 0));
        ParticleManager.SetParticleControl(this.pfx, 3, Vector(this.GetSpecialValueFor("heaven_spear_radius"), 0, 0));
        this.StartIntervalThink(this.tick_time);
    }
    OnIntervalThink(): void {
        if (!GFuncEntity.IsValid(this.GetCasterPlus())) {
            this.Destroy();
            return;
        }
        let damage = this.GetSpecialValueFor("damage") * this.tick_time;
        let enemies = undefined;
        if (this.heaven_spear && this.heaven_spear == 1) {
            enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.start_pos, undefined, this.GetSpecialValueFor("trailblazer_radius"), this.GetAbilityPlus().GetAbilityTargetTeam(), this.GetAbilityPlus().GetAbilityTargetType(), this.GetAbilityPlus().GetAbilityTargetFlags(), 0, false);
        } else {
            enemies = FindUnitsInLine(this.GetCasterPlus().GetTeamNumber(), this.start_pos, this.GetParentPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("trailblazer_radius"), this.GetAbilityPlus().GetAbilityTargetTeam(), this.GetAbilityPlus().GetAbilityTargetType(), this.GetAbilityPlus().GetAbilityTargetFlags());
        }
        if (GameFunc.GetCount(enemies) > 0) {
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                ApplyDamage({
                    attacker: this.GetCasterPlus(),
                    victim: enemy,
                    damage: damage,
                    damage_type: this.GetAbilityPlus().GetAbilityDamageType(),
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE
                });
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().RemoveSelf();
        if (this.GetAbilityPlus()) {
            this.GetAbilityPlus<imba_mars_spear>().trailblazer_thinker = undefined;
        }
        if (this.pfx) {
            ParticleManager.DestroyParticle(this.pfx, false);
            ParticleManager.ReleaseParticleIndex(this.pfx);
        }
    }
}
@registerModifier()
export class modifier_imba_mars_spear extends BaseModifierMotionHorizontal_Plus {
    public projectile: any;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    Init(kv: any): void {
        if (IsServer()) {
            this.projectile = kv.projectile;
            let ability = this.GetAbilityPlus<imba_mars_spear>();
            this.GetParentPlus().SetForwardVector(-ability.projectiles[kv.projectile].direction as Vector);
            this.GetParentPlus().FaceTowards(ability.projectiles[this.projectile].init_pos);
            if (!this.BeginMotionOrDestroy()) {
                return;
            }
        }
    }

    BeRemoved(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().InterruptMotionControllers(false);
    }

    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation( /** params */): GameActivity_t {
        return GameActivity_t.ACT_DOTA_FLAIL;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }

    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (!this.GetAbilityPlus<imba_mars_spear>().projectiles[this.projectile]) {
            this.Destroy();
            return;
        }
        let data = this.GetAbilityPlus<imba_mars_spear>().projectiles[this.projectile];
        if (!data.active) {
            return;
        }
        this.GetParentPlus().SetOrigin(data.location + data.direction * 60);
    }
    OnHorizontalMotionInterrupted(): void {
        if (IsServer()) {
            this.Destroy();
        }
    }
}
@registerModifier()
export class modifier_imba_mars_spear_debuff extends BaseModifier_Plus {
    public projectile: any;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
    BeCreated(kv: any): void {
        if (!IsServer()) {
            return;
        }
        this.projectile = kv.projectile;
    }
    BeRefresh(kv: any): void {
    }
    BeRemoved(): void {
        if (!IsServer()) {
            return;
        }
        GridNav.DestroyTreesAroundPoint(this.GetParentPlus().GetOrigin(), 120, false);
    }
    BeDestroy(): void {
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation( /** params */): GameActivity_t {
        return GameActivity_t.ACT_DOTA_DISABLED;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_INVISIBLE]: false
        }
        return state;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_mars/mars_spear_impact_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_mars_spear.vpcf";
    }
}
@registerAbility()
export class imba_mars_gods_rebuke extends BaseAbility_Plus {
    GetCooldown(iLevel: number): number {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("imba_scepter_cooldown");
        }
        return super.GetCooldown(iLevel);
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let point = this.GetCursorPosition();
        let mod = caster.findBuff<modifier_imba_mars_bulwark_active>("modifier_imba_mars_bulwark_active");
        if (mod) {
            point = caster.GetAbsOrigin() + mod.forward_vector;
        }
        let radius = this.GetSpecialValueFor("radius");
        let angle = this.GetSpecialValueFor("angle") / 2;
        let duration = this.GetSpecialValueFor("knockback_duration");
        let distance = this.GetSpecialValueFor("knockback_distance");
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, 0, false);
        let buff = caster.AddNewModifier(caster, this, "modifier_imba_mars_gods_rebuke", {});
        let origin = caster.GetOrigin();
        let cast_direction = (point - origin as Vector).Normalized();
        let cast_angle = VectorToAngles(cast_direction).y;
        let caught = false;
        let heroes_count = 0;
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            let enemy_direction = (enemy.GetOrigin() - origin as Vector).Normalized();
            let enemy_angle = VectorToAngles(enemy_direction).y;
            let angle_diff = math.abs(AngleDiff(cast_angle, enemy_angle));
            if (angle_diff <= angle || this.GetCasterPlus().HasTalent("special_bonus_imba_mars_1")) {
                caster.PerformAttack(enemy, true, true, true, true, true, false, true);
                if (!enemy.HasModifier("modifier_imba_mars_spear_debuff")) {
                    enemy.AddNewModifier(caster, this, "modifier_generic_knockback", {
                        duration: duration,
                        distance: distance,
                        height: 30,
                        direction_x: enemy_direction.x,
                        direction_y: enemy_direction.y,
                        IsStun: this.GetCasterPlus().HasTalent("special_bonus_imba_mars_2")
                    });
                }
                if (enemy.IsRealUnit()) {
                    heroes_count = heroes_count + 1;
                }
                this.PlayEffects2(enemy, origin, cast_direction);
            }
        }
        if (GameFunc.GetCount(enemies) > 0) {
            if (heroes_count > 0) {
                caught = true;
                let stacks = heroes_count * this.GetSpecialValueFor("strong_argument_bonus_strength");
                caster.AddNewModifier(caster, this, "modifier_imba_mars_gods_rebuke_strong_argument", {
                    duration: this.GetSpecialValueFor("strong_argument_duration")
                }).SetStackCount(stacks);
                // caster.CalculateStatBonus(true);
            }
        }
        buff.Destroy();
        this.PlayEffects1(caught, (point - origin as Vector).Normalized());
    }
    PlayEffects1(caught: boolean, direction: Vector) {
        let sound_cast = "Hero_Mars.Shield.Cast";
        if (caught == false) {
            let sound_cast = "Hero_Mars.Shield.Cast.Small";
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_mars_1")) {
            let effect_cast = ResHelper.CreateParticleEx("particles/units/heroes/hero_mars/mars_shield_bash_full_circle.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
            ParticleManager.SetParticleControl(effect_cast, 0, this.GetCasterPlus().GetOrigin());
            ParticleManager.SetParticleControlForward(effect_cast, 0, direction);
            ParticleManager.ReleaseParticleIndex(effect_cast);
        } else {
            let effect_cast = ResHelper.CreateParticleEx("particles/units/heroes/hero_mars/mars_shield_bash.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
            ParticleManager.SetParticleControl(effect_cast, 0, this.GetCasterPlus().GetOrigin());
            ParticleManager.SetParticleControlForward(effect_cast, 0, direction);
            ParticleManager.ReleaseParticleIndex(effect_cast);
        }
        EmitSoundOnLocationWithCaster(this.GetCasterPlus().GetOrigin(), sound_cast, this.GetCasterPlus());
    }
    PlayEffects2(target: IBaseNpc_Plus, origin: Vector, direction: Vector) {
        let particle_cast = "particles/units/heroes/hero_mars/mars_shield_bash_crit.vpcf";
        let sound_cast = "Hero_Mars.Shield.Crit";
        let effect_cast = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_WORLDORIGIN, target);
        ParticleManager.SetParticleControl(effect_cast, 0, target.GetOrigin());
        ParticleManager.SetParticleControl(effect_cast, 1, target.GetOrigin());
        ParticleManager.SetParticleControlForward(effect_cast, 1, direction);
        ParticleManager.ReleaseParticleIndex(effect_cast);
        EmitSoundOn(sound_cast, target);
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.POSITION_if_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_mars_gods_rebuke extends BaseModifier_Plus {
    public bonus_damage: number;
    public bonus_crit: number;
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage_vs_heroes");
        this.bonus_crit = this.GetSpecialValueFor("crit_mult") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_unique_mars_gods_rebuke_extra_crit");
        let mod = this.GetParentPlus().findBuff<modifier_imba_mars_bulwark_jupiters_strength>("modifier_imba_mars_bulwark_jupiters_strength");
        if (mod) {
            this.bonus_damage = this.bonus_damage + mod.GetStackCount();
            mod.stack_table = []
            mod.SetStackCount(0);
        } else {
            this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_mars_bulwark_jupiters_strength", {});
        }
    }
    BeRefresh(kv: any): void {
    }
    BeRemoved(): void {
    }
    BeDestroy(): void {
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE_POST_CRIT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE_POST_CRIT)
    CC_GetModifierPreAttack_BonusDamagePostCrit(params: ModifierAttackEvent): number {
        if (!IsServer()) {
            return;
        }
        print("Bonus Damage:", this.bonus_damage);
        return this.bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE)
    CC_GetModifierPreAttack_CriticalStrike(params: ModifierAttackEvent): number {
        print("Bonus Crit:", this.bonus_crit);
        return this.bonus_crit;
    }
}
@registerModifier()
export class modifier_imba_mars_gods_rebuke_strong_argument extends BaseModifier_Plus {
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.GetStackCount();
    }
}
@registerAbility()
export class imba_mars_bulwark extends BaseAbility_Plus {
    IsStealable(): boolean {
        return false;
    }
    ResetToggleOnRespawn(): boolean {
        return true;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_mars_bulwark";
    }
    OnToggle(): void {
        if (this.GetToggleState()) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_mars_bulwark_active", {});
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_mars_bulwark_active", {});
        } else {
            this.GetCasterPlus().RemoveModifierByName("modifier_mars_bulwark_active");
            this.GetCasterPlus().RemoveModifierByName("modifier_imba_mars_bulwark_active");
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        if (this.GetToggleState()) {
            return false;
        }
        if (this.GetCasterPlus().GetHealthLosePect() > 80) {
            this.ToggleAbility();
            return false
        }
        return false
    }
}
@registerModifier()
export class modifier_imba_mars_bulwark extends BaseModifier_Plus {
    public reduction_front: any;
    public reduction_side: any;
    public angle_front: any;
    public angle_side: any;
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
        this.reduction_front = this.GetSpecialValueFor("physical_damage_reduction");
        this.reduction_side = this.GetSpecialValueFor("physical_damage_reduction_side");
        this.angle_front = this.GetSpecialValueFor("forward_angle") / 2;
        this.angle_side = this.GetSpecialValueFor("side_angle") / 2;
        if (IsServer()) {
            this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_mars_bulwark_jupiters_strength", {});
        }
    }
    BeRefresh(kv: any): void {
        this.reduction_front = this.GetSpecialValueFor("physical_damage_reduction");
        this.reduction_side = this.GetSpecialValueFor("physical_damage_reduction_side");
        this.angle_front = this.GetSpecialValueFor("forward_angle") / 2;
        this.angle_side = this.GetSpecialValueFor("side_angle") / 2;
    }
    BeRemoved(): void {
    }
    BeDestroy(): void {
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_CONSTANT_BLOCK
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_CONSTANT_BLOCK)
    CC_GetModifierPhysical_ConstantBlock(params: ModifierAttackEvent): number {
        if (params.inflictor) {
            return 0;
        }
        if (params.target.PassivesDisabled()) {
            return 0;
        }
        let parent = params.target;
        let attacker = params.attacker;
        let reduction = 0;
        let facing_direction = parent.GetAnglesAsVector().y;
        let attacker_vector = (attacker.GetOrigin() - parent.GetOrigin()) as Vector;
        let attacker_direction = VectorToAngles(attacker_vector).y;
        let angle_diff = math.abs(AngleDiff(facing_direction, attacker_direction));
        if (angle_diff < this.angle_front) {
            reduction = this.reduction_front;
            this.PlayEffects(true, attacker_vector);
        } else if (angle_diff < this.angle_side) {
            reduction = this.reduction_side;
            this.PlayEffects(false, attacker_vector);
        }
        let damage_blocked = reduction * params.damage / 100;
        let stacks = damage_blocked * this.GetSpecialValueFor("jupiters_strength_stored_damage_pct") / 100;
        let mod = this.GetParentPlus().findBuff<modifier_imba_mars_bulwark_jupiters_strength>("modifier_imba_mars_bulwark_jupiters_strength");
        if (mod) {
            mod.SetStackCount(mod.GetStackCount() + stacks);
        } else {
            this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_mars_bulwark_jupiters_strength", {}).SetStackCount(stacks);
        }
        return damage_blocked;
    }
    PlayEffects(front: boolean, pos: Vector) {
        let particle_cast = "particles/units/heroes/hero_mars/mars_shield_of_mars.vpcf";
        let sound_cast = "Hero_Mars.Shield.Block";
        if (!front) {
            particle_cast = "particles/units/heroes/hero_mars/mars_shield_of_mars_small.vpcf";
            sound_cast = "Hero_Mars.Shield.BlockSmall";
        }
        let effect_cast = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.ReleaseParticleIndex(effect_cast);
        this.GetParentPlus().EmitSound(sound_cast);
    }
}
@registerModifier()
export class modifier_imba_mars_bulwark_active extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public forward_vector: any;
    public angle_front: any;
    public angle_side: any;
    public spiked_shield_return_pct: number;
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.ability = this.GetAbilityPlus();
        this.forward_vector = this.GetParentPlus().GetForwardVector();
        this.angle_front = this.ability.GetSpecialValueFor("forward_angle") / 2;
        this.angle_side = this.ability.GetSpecialValueFor("side_angle") / 2;
        this.spiked_shield_return_pct = this.ability.GetSpecialValueFor("spiked_shield_return_pct");
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        this.GetParentPlus().SetForwardVector(this.forward_vector);
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(params: ModifierAbilityEvent): void {
        if (!IsServer()) {
            return;
        }
        if (params.ability && params.ability.GetAbilityName && params.unit == this.GetParentPlus()) {
            if (params.ability.GetAbilityName() == "imba_mars_spear") {
                this.ability.ToggleAbility();
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        let attacker = keys.attacker;
        let target = keys.unit;
        let original_damage = keys.original_damage;
        let damage_type = keys.damage_type;
        let damage_flags = keys.damage_flags;
        let damage = keys.damage;
        if (keys.unit == this.GetParentPlus() && !keys.attacker.IsBuilding() && keys.attacker.GetTeamNumber() != this.GetParentPlus().GetTeamNumber() && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) {
            if (!keys.unit.IsOther()) {
                let facing_direction = this.GetParentPlus().GetAnglesAsVector().y;
                let attacker_vector = (attacker.GetOrigin() - this.GetParentPlus().GetOrigin()) as Vector;
                let attacker_direction = VectorToAngles(attacker_vector).y;
                let angle_diff = math.abs(AngleDiff(facing_direction, attacker_direction));
                let bonus_damage = 0;
                if (angle_diff < this.angle_front) {
                    bonus_damage = this.spiked_shield_return_pct;
                } else if (angle_diff < this.angle_side) {
                    bonus_damage = this.spiked_shield_return_pct;
                }
                if (bonus_damage > 0) {
                    let damageTable = {
                        victim: keys.attacker,
                        damage: keys.original_damage / 100 * bonus_damage,
                        damage_type: keys.damage_type,
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
                        attacker: this.GetParentPlus(),
                        ability: this.ability
                    }
                    ApplyDamage(damageTable);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_mars_bulwark_jupiters_strength extends BaseModifier_Plus {
    public duration: number;
    public stack_table: [number, number][];
    RemoveOnDeath(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        if (this.GetStackCount() == 0) {
            return true;
        }
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.duration = this.GetSpecialValueFor("jupiters_strength_duration");
            this.stack_table = []
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        if (this.stack_table.length == 0) {
            return;
        }
        let item_time = this.stack_table[0][0];
        let stacks = this.stack_table[0][0];
        if (item_time) {
            if (GameRules.GetGameTime() - item_time >= this.duration) {
                this.stack_table.shift();
                this.SetStackCount(this.GetStackCount() - stacks);
                // this.GetParentPlus().CalculateStatBonus(true);
            }
        }
    }
    OnStackCountChanged(prev_stacks: number): void {
        if (!IsServer()) {
            return;
        }
        let stacks = this.GetStackCount();
        if (stacks > prev_stacks) {
            this.stack_table.push([GameRules.GetGameTime(), stacks - prev_stacks]);
            this.SetDuration(this.duration, true);
        }
    }
}
@registerAbility()
export class imba_mars_arena_of_blood extends BaseAbility_Plus {
    projectiles: { [k: string]: any } = {};
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    GetCastRange(vLocation: Vector, hTarget: CDOTA_BaseNPC | undefined): number {
        return super.GetCastRange(vLocation, hTarget);
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let cast_position = this.GetCursorPosition();
        BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_imba_mars_arena_of_blood_thinker", {}, cast_position, this.GetCasterPlus().GetTeamNumber(), false);
    }
    OnProjectileHitHandle(target: IBaseNpc_Plus, location: Vector, id: number) {
        let data = this.projectiles[id];
        delete this.projectiles[id];
        if (data.destroyed) {
            return;
        }
        let attacker = EntIndexToHScript(data.entindex_source_const) as IBaseNpc_Plus;
        attacker.PerformAttack(target, true, true, true, true, false, false, true);
    }
    GetManaCost(level: number): number {
        return 100;
    }
    AutoSpellSelf() {
        return AI_ability.POSITION_if_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_mars_arena_of_blood extends BaseModifier_Plus {
    radius: number;
    interval: number;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE + DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_IGNORE_INVULNERABLE;
    }
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.StartIntervalThink(this.interval);
            this.OnIntervalThink();
        }
    }
    BeRefresh(kv: any): void {
    }
    BeRemoved(): void {
    }
    BeDestroy(): void {
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE,
            2: Enum_MODIFIER_EVENT.ON_ATTACKED
        }
        return Object.values(funcs);
    } */
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true
        }
        return state;
    }
    OnIntervalThink(): void {
    }
    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
    }
    OnHorizontalMotionInterrupted(): void {
    }
    IsAura(): boolean {
        return true;
    }
    GetModifierAura(): string {
        return "modifier_imba_mars_arena_of_blood_effect";
    }
    GetAuraRadius(): number {
        return this.radius;
    }
    GetAuraDuration(): number {
        return this.radius;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES;
    }
    GetAuraEntityReject(hEntity: CDOTA_BaseNPC): boolean {
        if (IsServer()) {
        }
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_heroname/heroname_ability.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    GetStatusEffectName(): string {
        return "status/effect/here.vpcf";
    }
    PlayEffects() {
        // let particle_cast = "particles/units/heroes/hero_heroname/heroname_ability.vpcf";
        // let sound_cast = "string";
        // let effect_cast = ResHelper.CreateParticleEx(particle_cast,ParticleAttachment_t. PATTACH_NAME, hOwner);
        // ParticleManager.SetParticleControl(effect_cast, iControlPoint, vControlVector);
        // ParticleManager.SetParticleControlEnt(effect_cast, iControlPoint, hTarget, PATTACH_NAME, "attach_name", vOrigin, bool);
        // ParticleManager.SetParticleControlForward(effect_cast, iControlPoint, vForward);
        // SetParticleControlOrientation(effect_cast, iControlPoint, vForward, vRight, vUp);
        // ParticleManager.ReleaseParticleIndex(effect_cast);
        // this.AddParticle(effect_cast, false, false, -1, false, false);
        // EmitSoundOnLocationWithCaster(vTargetPosition, sound_location, this.GetCasterPlus());
        // EmitSoundOn(sound_target, target);
    }
}
@registerModifier()
export class modifier_imba_mars_arena_of_blood_blocker extends BaseModifier_Plus {
    public fade_min: any;
    public fade_max: any;
    public fade_range: number;
    public origin: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
        if (!IsServer()) {
            return;
        }
        if (kv.model == 1) {
            this.fade_min = this.GetSpecialValueFor("warrior_fade_min_dist");
            this.fade_max = this.GetSpecialValueFor("warrior_fade_max_dist");
            this.fade_range = this.fade_max - this.fade_min;
            this.origin = this.GetParentPlus().GetOrigin();
            this.GetParentPlus().SetOriginalModel("models/heroes/mars/mars_soldier.vmdl");
            this.GetParentPlus().SetRenderAlpha(0);
            this.GetParentPlus().TempData().model = 1;
            this.StartIntervalThink(0.1);
        }
    }
    BeRefresh(kv: any): void {
    }
    BeRemoved(): void {
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().ForceKill(false);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_NO_TEAM_MOVE_TO]: true,
            [modifierstate.MODIFIER_STATE_NO_TEAM_SELECT]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_UNTARGETABLE]: true
        }
        return state;
    }
    OnIntervalThink(): void {
        let alpha = 0;
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.origin, undefined, this.fade_max, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST, false);
        if (GameFunc.GetCount(enemies) > 0) {
            let enemy = enemies[0];
            let range = math.max(this.GetParentPlus().GetRangeToUnit(enemy), this.fade_min);
            range = math.min(range, this.fade_max) - this.fade_min;
            alpha = this.Interpolate(range / this.fade_range, 255, 0);
        }
        this.GetParentPlus().SetRenderAlpha(alpha);
    }
    Interpolate(value: number, min: number, max: number) {
        return value * (max - min) + min;
    }
}
@registerModifier()
export class modifier_imba_mars_arena_of_blood_coliseum_aura extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsAura(): boolean {
        return true;
    }
    GetModifierAura(): string {
        return "modifier_imba_mars_arena_of_blood_coliseum";
    }
    GetAuraRadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    GetAuraDuration(): number {
        return 0.0;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {

        }
    }

}
@registerModifier()
export class modifier_imba_mars_arena_of_blood_coliseum extends BaseModifier_Plus {
    public bonus_damage: number;
    public bonus_attack_speed: number;
    public health_regen: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT
        });
    } */
    BeCreated(p_0: any,): void {
        this.bonus_damage = this.GetSpecialValueFor("coliseum_bonus_damage");
        this.bonus_attack_speed = this.GetSpecialValueFor("coliseum_bonus_attack_speed");
        if (!IsServer()) {
            return;
        }
        this.health_regen = this.GetCasterPlus().GetOwnerPlus().GetTalentValue("special_bonus_imba_unique_mars_arena_of_blood_hp_regen") || 0;
        this.SetHasCustomTransmitterData(true);
        this.StartIntervalThink(0.2);
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (!this.GetCasterPlus() || this.GetCasterPlus() && !this.GetCasterPlus().IsAlive()) {
                this.Destroy();
                return;
            }
            let heroes = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, FindOrder.FIND_ANY_ORDER, false);
            this.SetStackCount(GameFunc.GetCount(heroes));
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.bonus_damage * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_attack_speed * this.GetStackCount();
    }
    AddCustomTransmitterData() {
        return {
            health_regen: this.health_regen
        };
    }
    HandleCustomTransmitterData(data: any) {
        this.health_regen = data.health_regen;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.health_regen;
    }
}
@registerModifier()
export class modifier_imba_mars_arena_of_blood_projectile_aura extends BaseModifier_Plus {
    public radius: number;
    public width: any;
    public owner: any;
    public lock: any;
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
        this.radius = this.GetSpecialValueFor("radius");
        this.width = this.GetSpecialValueFor("width");
        if (!IsServer()) {
            return;
        }
        this.owner = kv.isProvidedByAura != 1;
        if (!this.owner) {
            return;
        }
        this.StartIntervalThink(0.03);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (!this.owner) {
            return;
        }
    }
    ProjectileFilter(data: any) {
        let attacker = EntIndexToHScript(data.entindex_source_const) as IBaseNpc_Plus;
        let target = EntIndexToHScript(data.entindex_target_const) as IBaseNpc_Plus;
        let ability = EntIndexToHScript(data.entindex_ability_const);
        let isAttack = data.is_attack;
        if (this.lock) {
            return true;
        }
        if (!data.is_attack) {
            return true;
        }
        if (attacker.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            return true;
        }
        let mod1 = attacker.FindModifierByNameAndCaster('modifier_imba_mars_arena_of_blood_projectile_aura', this.GetCasterPlus());
        let mod2 = target.FindModifierByNameAndCaster('modifier_imba_mars_arena_of_blood_projectile_aura', this.GetCasterPlus());
        if ((!mod1) && (!mod2)) {
            return true;
        }
        let info = {
            Target: target,
            Source: attacker,
            Ability: this.GetAbilityPlus(),
            EffectName: attacker.GetRangedProjectileName(),
            iMoveSpeed: data.move_speed,
            bDodgeable: true,
            vSourceLoc: attacker.GetAbsOrigin(),
            bIsAttack: true,
            ExtraData: data
        }
        this.lock = true;
        let id = ProjectileManager.CreateTrackingProjectile(info);
        this.lock = false;
        this.GetAbilityPlus<imba_mars_arena_of_blood>().projectiles[id] = data;
        return false;
    }
    OnIntervalThink(): void {
        let origin = this.GetParentPlus().GetOrigin();
        for (const [id, _] of GameFunc.Pair(this.GetAbilityPlus<imba_mars_arena_of_blood>().projectiles)) {
            let pid = tonumber(id) as ProjectileID;
            let pos = ProjectileManager.GetTrackingProjectileLocation(pid);
            let distance = (pos - origin as Vector).Length2D();
            if (math.abs(distance - this.radius) < this.width) {
                this.GetAbilityPlus<imba_mars_arena_of_blood>().projectiles[id].destroyed = true;
                ProjectileManager.DestroyTrackingProjectile(pid);
                this.PlayEffects(pos);
            }
        }
    }
    IsAura(): boolean {
        return this.owner;
    }
    GetModifierAura(): string {
        return "modifier_imba_mars_arena_of_blood_projectile_aura";
    }
    GetAuraRadius(): number {
        return this.radius;
    }
    GetAuraDuration(): number {
        return 0.3;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_ALL;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE;
    }
    GetAuraEntityReject(hEntity: CDOTA_BaseNPC): boolean {
        if (IsServer()) {
        }
        return false;
    }
    PlayEffects(loc: Vector) {
        let particle_cast = "particles/units/heroes/hero_mars/mars_arena_of_blood_impact.vpcf";
        let sound_cast = "Hero_Mars.Block_Projectile";
        let effect_cast = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
        ParticleManager.SetParticleControl(effect_cast, 0, loc);
        ParticleManager.ReleaseParticleIndex(effect_cast);
        EmitSoundOnLocationWithCaster(loc, sound_cast, this.GetCasterPlus());
    }
}
@registerModifier()
export class modifier_imba_mars_arena_of_blood_spear_aura extends BaseModifier_Plus {
    public radius: number;
    public width: any;
    public duration: number;
    public damage: number;
    public knockback_duration: number;
    public spear_radius: number;
    public owner: any;
    public aura_origin: any;
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(kv: any): void {
        this.radius = this.GetSpecialValueFor("radius");
        this.width = this.GetSpecialValueFor("spear_distance_from_wall");
        this.duration = this.GetSpecialValueFor("spear_attack_interval");
        this.damage = this.GetSpecialValueFor("spear_damage");
        this.knockback_duration = 0.2;
        this.spear_radius = this.radius - this.width;
        if (!IsServer()) {
            return;
        }
        this.owner = kv.isProvidedByAura != 1;
        this.aura_origin = this.GetParentPlus().GetOrigin();
        if (!this.owner) {
            this.aura_origin = Vector(kv.aura_origin_x, kv.aura_origin_y, 0);
            let direction = this.aura_origin - this.GetParentPlus().GetOrigin() as Vector;
            direction.z = 0;
            let damageTable = {
                victim: this.GetParentPlus(),
                attacker: this.GetCasterPlus(),
                damage: this.damage,
                damage_type: this.GetAbilityPlus().GetAbilityDamageType(),
                ability: this.GetAbilityPlus()
            }
            ApplyDamage(damageTable);
            let arena_walls = Entities.FindAllByClassnameWithin("npc_dota_phantomassassin_gravestone", this.GetParentPlus().GetOrigin(), 160) as IBaseNpc_Plus[];
            for (const arena_wall of arena_walls) {
                if (arena_wall.HasModifier("modifier_imba_mars_arena_of_blood_blocker") && arena_wall.TempData().model) {
                    arena_wall.FadeGesture(GameActivity_t.ACT_DOTA_ATTACK);
                    arena_wall.StartGesture(GameActivity_t.ACT_DOTA_ATTACK);
                    return;
                }
            }
            this.PlayEffects(direction.Normalized());
            if (this.GetParentPlus().HasModifier("modifier_imba_mars_spear")) {
                return;
            }
            if (this.GetParentPlus().HasModifier("modifier_imba_mars_spear_debuff")) {
                return;
            }
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_generic_knockback", {
                duration: this.knockback_duration,
                distance: this.width,
                height: 30,
                direction_x: direction.x,
                direction_y: direction.y
            });
        }
    }
    BeRefresh(kv: any): void {
    }
    BeRemoved(): void {
    }
    BeDestroy(): void {
    }
    IsAura(): boolean {
        return this.owner;
    }
    GetModifierAura(): string {
        return "modifier_imba_mars_arena_of_blood_spear_aura";
    }
    GetAuraRadius(): number {
        return this.radius;
    }
    GetAuraDuration(): number {
        return this.duration;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return 0;
    }
    GetAuraEntityReject(unit: CDOTA_BaseNPC): boolean {
        if (!IsServer()) {
            return;
        }
        if (unit.HasFlyMovementCapability()) {
            return true;
        }
        if (unit.IsCurrentlyVerticalMotionControlled()) {
            return true;
        }
        if (unit.FindModifierByNameAndCaster("modifier_imba_mars_arena_of_blood_spear_aura", this.GetCasterPlus())) {
            return true;
        }
        let distance = (unit.GetOrigin() - this.aura_origin as Vector).Length2D();
        if ((distance - this.spear_radius) < 0) {
            return true;
        }
        return false;
    }
    PlayEffects(direction: Vector) {
        let particle_cast = "particles/units/heroes/hero_mars/mars_arena_of_blood_spear.vpcf";
        let sound_cast = "Hero_Mars.Phalanx.Attack";
        let sound_target = "Hero_Mars.Phalanx.Target";
        let effect_cast = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
        ParticleManager.SetParticleControl(effect_cast, 0, this.GetParentPlus().GetOrigin());
        ParticleManager.SetParticleControlForward(effect_cast, 0, direction);
        ParticleManager.ReleaseParticleIndex(effect_cast);
        EmitSoundOnLocationWithCaster(this.GetParentPlus().GetOrigin(), sound_cast, this.GetCasterPlus());
        EmitSoundOn(sound_target, this.GetParentPlus());
    }
}
@registerModifier()
export class modifier_imba_mars_arena_of_blood_thinker extends BaseModifier_Plus {
    public delay: number;
    public duration: number;
    public radius: number;
    public thinkers: any;
    public phase_delay: boolean;
    public phase_duration: boolean;
    IsHidden(): boolean {
        return true;
    }
    BeCreated(kv: any): void {
        this.delay = this.GetSpecialValueFor("formation_time");
        this.duration = this.GetSpecialValueFor("duration");
        this.radius = this.GetSpecialValueFor("radius");
        if (IsServer()) {
            this.thinkers = {}
            this.phase_delay = true;
            this.StartIntervalThink(this.delay);
            this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_mars_arena_of_blood_coliseum_aura", {});
            this.PlayEffects();
        }
    }
    BeRemoved(): void {
        if (!IsServer()) {
            return;
        }
        let sound_stop = "Hero_Mars.ArenaOfBlood.End";
        let sound_loop = "Hero_Mars.ArenaOfBlood";
        EmitSoundOn(sound_stop, this.GetParentPlus());
        StopSoundOn(sound_loop, this.GetParentPlus());
    }
    BeDestroy(): void {
        GFuncEntity.SafeDestroyUnit(this.GetParentPlus());
    }
    OnIntervalThink(): void {
        if (this.phase_delay) {
            this.phase_delay = false;
            AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetOrigin(), this.radius, this.duration, false);
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_mars_arena_of_blood_wall_aura", {});
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_mars_arena_of_blood_spear_aura", {});
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_mars_arena_of_blood_projectile_aura", {});
            this.SummonBlockers();
            let sound_loop = "Hero_Mars.ArenaOfBlood";
            EmitSoundOn(sound_loop, this.GetParentPlus());
            this.StartIntervalThink(this.duration);
            this.phase_duration = true;
            return;
        }
        if (this.phase_duration) {
            this.Destroy();
            return;
        }
    }
    SummonBlockers() {
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        let teamnumber = caster.GetTeamNumber();
        let origin = this.GetParentPlus().GetOrigin();
        let angle = 0;
        let vector = origin + Vector(this.radius, 0, 0) as Vector;
        let zero = Vector(0, 0, 0);
        let one = Vector(1, 0, 0);
        let count = 28;
        let angle_diff = 360 / count;
        for (let i = 0; i <= count - 1; i++) {
            let location = RotatePosition(origin, QAngle(0, angle_diff * i, 0), vector);
            let facing = RotatePosition(zero, QAngle(0, 200 + angle_diff * i, 0), one);
            BaseNpc_Plus.CreateUnitByNameAsync("npc_imba_mars_arena_of_blood_soldier", location, caster,
                GHandler.create(this, (unit: IBaseNpc_Plus) => {
                    unit.SetForwardVector(facing);
                    unit.SetNeverMoveToClearSpace(true);
                    unit.AddNewModifier(caster, this.GetAbilityPlus(), "modifier_imba_mars_arena_of_blood_blocker", {
                        duration: this.duration,
                        model: i % 2 == 0
                    })
                }), false,);
        }
    }
    PlayEffects() {
        let particle_cast = "particles/units/heroes/hero_mars/mars_arena_of_blood.vpcf";
        let sound_cast = "Hero_Mars.ArenaOfBlood.Start";
        let radius = this.radius + 50;
        let effect_cast = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
        ParticleManager.SetParticleControl(effect_cast, 0, this.GetParentPlus().GetOrigin());
        ParticleManager.SetParticleControl(effect_cast, 1, Vector(radius, 0, 0));
        ParticleManager.SetParticleControl(effect_cast, 2, this.GetParentPlus().GetOrigin());
        ParticleManager.SetParticleControl(effect_cast, 3, this.GetParentPlus().GetOrigin());
        this.AddParticle(effect_cast, false, false, -1, false, false);
        EmitSoundOn(sound_cast, this.GetParentPlus());
    }
}
@registerModifier()
export class modifier_imba_mars_arena_of_blood_wall_aura extends BaseModifier_Plus {
    public radius: number;
    public width: any;
    public twice_width: any;
    public aura_radius: number;
    public MAX_SPEED: any;
    public MIN_SPEED: any;
    public arena_offset: any;
    public owner: any;
    public aura_origin: any;
    public position: any;
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(kv: any): void {
        if (!IsServer()) {
            return;
        }
        this.radius = this.GetSpecialValueFor("radius");
        this.width = this.GetSpecialValueFor("width");
        this.twice_width = this.width * 2;
        this.aura_radius = this.radius + this.twice_width;
        this.MAX_SPEED = 550;
        this.MIN_SPEED = 1;
        this.arena_offset = 200;
        this.owner = kv.isProvidedByAura != 1;
        if (!this.owner) {
            this.aura_origin = Vector(kv.aura_origin_x, kv.aura_origin_y, 0);
        } else {
            this.aura_origin = this.GetParentPlus().GetOrigin();
        }
        this.position = this.GetParentPlus().GetAbsOrigin();
        this.OnIntervalThink();
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        if (this.GetAuraOwner()) {
            if ((this.GetParentPlus().GetAbsOrigin() - this.GetAuraOwner().GetAbsOrigin() as Vector).Length2D() > this.aura_radius - this.arena_offset && (this.position - this.GetParentPlus().GetAbsOrigin() as Vector).Length2D() < this.aura_radius) {
                FindClearSpaceForUnit(this.GetParentPlus(), this.GetAuraOwner().GetAbsOrigin() + ((this.GetParentPlus().GetAbsOrigin() - this.GetAuraOwner().GetAbsOrigin() as Vector).Normalized() * this.radius) as Vector, false);
            }
            if ((this.GetParentPlus().GetAbsOrigin() - this.GetAuraOwner().GetAbsOrigin() as Vector).Length2D() <= this.aura_radius - this.arena_offset) {
                this.position = this.GetParentPlus().GetAbsOrigin();
            }
        }
    }
    BeRefresh(kv: any): void {
    }
    BeRemoved(): void {
    }
    BeDestroy(): void {
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_LIMIT
        }
        return Object.values(funcs);
    } */
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_TETHERED]: true
        };
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_LIMIT)
    CC_GetModifierMoveSpeed_Limit( /** params */): number {
        if (!IsServer()) {
            return;
        }
        if (this.owner) {
            return 0;
        }
        let parent_vector = this.GetParentPlus().GetOrigin() - this.aura_origin as Vector;
        let parent_direction = parent_vector.Normalized();
        let actual_distance = parent_vector.Length2D();
        let wall_distance = actual_distance - this.radius;
        let isInside = (wall_distance) < 0;
        wall_distance = math.min(math.abs(wall_distance), this.twice_width);
        wall_distance = math.max(wall_distance, this.width) - this.width;
        let parent_angle = 0;
        if (isInside) {
            parent_angle = VectorToAngles(parent_direction).y;
        } else {
            parent_angle = VectorToAngles(-parent_direction as Vector).y;
        }
        let unit_angle = this.GetParentPlus().GetAnglesAsVector().y;
        let wall_angle = math.abs(AngleDiff(parent_angle, unit_angle));
        let limit = 0;
        if (wall_angle > 90) {
            limit = 0;
        } else {
            limit = this.Interpolate(wall_distance / this.width, this.MIN_SPEED, this.MAX_SPEED);
        }
        return limit;
    }
    Interpolate(value: number, min: number, max: number) {
        return value * (max - min) + min;
    }
    IsAura(): boolean {
        return this.owner;
    }
    GetModifierAura(): string {
        return "modifier_imba_mars_arena_of_blood_wall_aura";
    }
    GetAuraRadius(): number {
        return this.aura_radius;
    }
    GetAuraDuration(): number {
        return 0.3;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE;
    }
    GetAuraEntityReject(unit: CDOTA_BaseNPC): boolean {
        if (!IsServer()) {
            return;
        }
        if (unit.HasFlyMovementCapability()) {
            return true;
        }
        return false;
    }
}
@registerModifier()
export class modifier_imba_mars_arena_of_blood_scepter extends BaseModifierMotionBoth_Plus {
    public target_point: any;
    public max_height: any;
    public time_elapsed: number;
    public leap_z: any;
    public jump_speed: number;
    public distance: number;
    public jump_time: number;
    public direction: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IgnoreTenacity() {
        return true;
    }

    GetPriority() {
        return 2;
    }
    BeCreated(keys: any): void {
        if (!IsServer()) {
            return;
        }
        // if (this.GetAbilityPlus(). scepter_cast_position) {
        //     this.target_point = this.GetAbilityPlus().scepter_cast_position;
        // } else {
        this.target_point = this.GetParentPlus().GetAbsOrigin();
        // }
        this.max_height = this.GetSpecialValueFor("scepter_max_height");
        this.time_elapsed = 0;
        this.leap_z = 0;
        this.jump_speed = this.GetSpecialValueFor("scepter_jump_speed");
        // this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_CAST1_STATUE);

        this.AddTimer(FrameTime(), () => {
            this.distance = (this.GetParentPlus().GetAbsOrigin() - this.target_point as Vector).Length2D();
            this.jump_time = this.distance / this.jump_speed;
            this.direction = (this.target_point - this.GetParentPlus().GetAbsOrigin() as Vector).Normalized();
            if (!this.BeginMotionOrDestroy()) { return; }
        });
    }

    UpdateVerticalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            if (this.time_elapsed < this.jump_time) {
                if (this.time_elapsed <= this.jump_time / 2) {
                    this.leap_z = this.leap_z + 30;
                    this.GetParentPlus().SetAbsOrigin(GetGroundPosition(this.GetParentPlus().GetAbsOrigin(), this.GetParentPlus()) + Vector(0, 0, this.leap_z) as Vector);
                } else {
                    this.leap_z = this.leap_z - 30;
                    if (this.leap_z > 0) {
                        this.GetParentPlus().SetAbsOrigin(GetGroundPosition(this.GetParentPlus().GetAbsOrigin(), this.GetParentPlus()) + Vector(0, 0, this.leap_z) as Vector);
                    }
                }
            }
        }
    }
    UpdateHorizontalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            this.time_elapsed = this.time_elapsed + dt;
            if (this.time_elapsed < this.jump_time) {
                let new_location = this.GetParentPlus().GetAbsOrigin() + this.direction * this.jump_speed * dt as Vector;
                this.GetParentPlus().SetAbsOrigin(new_location);
            } else {
                this.Destroy();
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        BaseModifier_Plus.CreateBuffThinker(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_mars_arena_of_blood_thinker", {}, this.target_point, this.GetCasterPlus().GetTeamNumber(), false);
        this.GetParentPlus().SetUnitOnClearGround();
        // this.GetParentPlus().FadeGesture(GameActivity_t.ACT_DOTA_CAST1_STATUE);
    }
}
