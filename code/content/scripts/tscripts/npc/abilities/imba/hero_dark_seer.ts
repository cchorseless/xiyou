
import { GameFunc } from "../../../GameFunc";
import { AoiHelper } from "../../../helper/AoiHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_dark_seer_vacuum extends BaseAbility_Plus {
    public cursor_position: any;
    public swap_timer: ITimerTask;
    GetAssociatedSecondaryAbilities(): string {
        return "imba_dark_seer_wormhole";
    }
    CastFilterResultLocation(vLocation: Vector): UnitFilterResult {
        if (!IsServer()) {
            return;
        }
        if (AoiHelper.IsNearFountain(vLocation, 1700 + this.GetSpecialValueFor("radius"))) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        }
    }
    GetCustomCastErrorLocation(p_0: Vector,): string {
        return "#dota_hud_error_cant_cast_near_fountain";
    }
    OnUpgrade(): void {
        if (!IsServer()) {
            return;
        }
        let wormhole_ability = this.GetCasterPlus().findAbliityPlus<imba_dark_seer_wormhole>("imba_dark_seer_wormhole");
        if (wormhole_ability) {
            wormhole_ability.SetLevel(this.GetLevel());
        }
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    GetCooldown(level: number): number {
        if (!this.GetCasterPlus().HasScepter()) {
            return super.GetCooldown(level);
        } else {
            return this.GetSpecialValueFor("scepter_cooldown");
        }
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        this.cursor_position = this.GetCursorPosition();
        let wormhole_ability = this.GetCasterPlus().findAbliityPlus<imba_dark_seer_wormhole>("imba_dark_seer_wormhole");
        EmitSoundOnLocationWithCaster(this.GetCursorPosition(), "Hero_Dark_Seer.Vacuum", this.GetCasterPlus());
        let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_dark_seer/dark_seer_vacuum.vpcf", ParticleAttachment_t.PATTACH_POINT, this.GetCasterPlus());
        ParticleManager.SetParticleControl(particle, 0, this.GetCursorPosition());
        ParticleManager.SetParticleControl(particle, 1, Vector(this.GetSpecialValueFor("radius"), 1, 1));
        ParticleManager.ReleaseParticleIndex(particle);
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCursorPosition(), undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (!enemy.IsCourier || !enemy.IsCourier()) {
                if (enemy.IsInvulnerable() && !enemy.HasModifier("modifier_eul_cyclone")) {
                    enemy.AddNewModifier(enemy, this, "modifier_imba_dark_seer_vacuum", {
                        duration: this.GetTalentSpecialValueFor("duration"),
                        x: this.GetCursorPosition().x,
                        y: this.GetCursorPosition().y,
                        caster_entindex: this.GetCasterPlus().entindex()
                    });
                } else {
                    enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_dark_seer_vacuum", {
                        duration: this.GetTalentSpecialValueFor("duration"),
                        x: this.GetCursorPosition().x,
                        y: this.GetCursorPosition().y
                    });
                }
                if (wormhole_ability) {
                    enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_dark_seer_vacuum_wormhole", {
                        duration: this.GetSpecialValueFor("wormhole_duration")
                    });
                    wormhole_ability.SetLevel(this.GetLevel());
                    if (!wormhole_ability.enemy_tracker) {
                        wormhole_ability.enemy_tracker = []
                    }
                    wormhole_ability.enemy_tracker.push(enemy);
                }
            }
        }
        GridNav.DestroyTreesAroundPoint(this.GetCursorPosition(), this.GetSpecialValueFor("radius_tree"), true);
        if (wormhole_ability) {
            wormhole_ability.EndCooldown();
            this.GetCasterPlus().SwapAbilities("imba_dark_seer_vacuum", "imba_dark_seer_wormhole", false, true);
            wormhole_ability.SetHidden(false);
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_dark_seer_vacuum_refresh_tracker", {
                duration: this.GetSpecialValueFor("wormhole_duration")
            });
            if (this.swap_timer) {
                this.swap_timer.Clear();
                this.swap_timer = null;
            }
            this.swap_timer = GTimerHelper.AddTimer(this.GetSpecialValueFor("wormhole_duration"),
                GHandler.create(this, () => {
                    if (this && this.GetCasterPlus() && this.IsHidden()) {
                        this.GetCasterPlus().SwapAbilities("imba_dark_seer_vacuum", "imba_dark_seer_wormhole", true, false);
                    }
                    this.swap_timer = undefined;
                }));
        }
    }
}
@registerModifier()
export class modifier_imba_dark_seer_vacuum extends BaseModifierMotionHorizontal_Plus {
    public damage: number;
    public caster: IBaseNpc_Plus;
    public duration: number;
    public x: any;
    public y: any;
    public vacuum_pos: any;
    public distance: Vector;
    public speed: number;
    IsDebuff(): boolean {
        return true;
    }
    IgnoreTenacity() {
        return true;
    }
    Init(params: any): void {
        this.damage = this.GetSpecialValueFor("damage");
        if (!IsServer()) {
            return;
        }
        if (params.caster_entindex) {
            this.caster = EntIndexToHScript(params.caster_entindex) as IBaseNpc_Plus;
        } else {
            this.caster = this.GetCasterPlus();
        }
        this.duration = params.duration;
        this.x = params.x;
        this.y = params.y;
        this.vacuum_pos = GetGroundPosition(Vector(this.x, this.y, 0), undefined);
        this.distance = this.GetParentPlus().GetAbsOrigin() - this.vacuum_pos as Vector;
        this.speed = this.distance.Length2D() / this.duration;
        if (this.BeginMotionOrDestroy() == false) {
            return;
        }
    }

    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (!IsServer()) {
            return;
        }
        let distance = (this.vacuum_pos - me.GetAbsOrigin() as Vector).Normalized();
        me.SetOrigin(me.GetAbsOrigin() + distance * this.speed * dt as Vector);
    }
    OnHorizontalMotionInterrupted(): void {
        this.Destroy();
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        // this.GetParentPlus().RemoveHorizontalMotionController();
        this.GetParentPlus().SetAbsOrigin(this.vacuum_pos);
        ResolveNPCPositions(this.vacuum_pos, 128);
        let damageTable = {
            victim: this.GetParentPlus(),
            damage: this.damage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_BYPASSES_INVULNERABILITY,
            attacker: this.caster,
            ability: this.GetAbilityPlus()
        }
        ApplyDamage(damageTable);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_FLAIL;
    }
}
@registerModifier()
export class modifier_imba_dark_seer_vacuum_wormhole extends BaseModifier_Plus {
    IgnoreTenacity() {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_dark_seer_vacuum_refresh_tracker extends BaseModifier_Plus {
    public vacuum_ability: any;
    public wormhole_ability: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.vacuum_ability = this.GetCasterPlus().findAbliityPlus<imba_dark_seer_vacuum>("imba_dark_seer_vacuum");
        this.wormhole_ability = this.GetCasterPlus().findAbliityPlus<imba_dark_seer_wormhole>("imba_dark_seer_wormhole");
        if (this.vacuum_ability && this.wormhole_ability && this.vacuum_ability.GetCooldownTimeRemaining() > 0) {
            this.StartIntervalThink(0.1);
        } else {
            this.Destroy();
        }
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (this.vacuum_ability.GetCooldownTimeRemaining() == 0 && this.vacuum_ability && this.wormhole_ability && this.vacuum_ability.IsHidden()) {
            this.GetCasterPlus().SwapAbilities("imba_dark_seer_vacuum", "imba_dark_seer_wormhole", true, false);
            this.Destroy();
        }
    }
}
@registerAbility()
export class imba_dark_seer_wormhole extends BaseAbility_Plus {
    public enemy_tracker: IBaseNpc_Plus[];
    OnUpgrade(): void {
        if (!IsServer()) {
            return;
        }
        if (!this.GetCasterPlus().GetUnitName().includes("dark_seer")) {
            this.SetHidden(true);
        }
    }
    GetAssociatedPrimaryAbilities(): string {
        return "imba_dark_seer_vacuum";
    }
    CastFilterResultLocation(vLocation: Vector): UnitFilterResult {
        if (!IsServer()) {
            return;
        }
        if (AoiHelper.IsNearFountain(vLocation, 1700 + this.GetSpecialValueFor("radius"))) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        }
    }
    GetCustomCastErrorLocation(p_0: Vector,): string {
        return "#dota_hud_error_cant_cast_near_fountain";
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        if (!this.enemy_tracker) {
            this.enemy_tracker = []
        }
        let vacuum_ability = this.GetCasterPlus().findAbliityPlus<imba_dark_seer_vacuum>("imba_dark_seer_vacuum");
        EmitSoundOnLocationWithCaster(this.GetCursorPosition(), "Hero_Dark_Seer.Wormhole", this.GetCasterPlus());
        let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_dark_seer/dark_seer_vacuum.vpcf", ParticleAttachment_t.PATTACH_POINT, this.GetCasterPlus());
        ParticleManager.SetParticleControl(particle, 0, this.GetCursorPosition());
        ParticleManager.SetParticleControl(particle, 1, Vector(this.GetSpecialValueFor("radius"), 1, 1));
        ParticleManager.ReleaseParticleIndex(particle);
        GridNav.DestroyTreesAroundPoint(this.GetCursorPosition(), this.GetSpecialValueFor("radius_tree"), true);
        let exit_portal = BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_imba_dark_seer_vacuum_exit_portal", {
            duration: vacuum_ability.GetSpecialValueFor("teleport_duration")
        }, this.GetCursorPosition(), this.GetCasterPlus().GetTeamNumber(), false);
        let entry_portal = BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), vacuum_ability, "modifier_imba_dark_seer_vacuum_entry_portal", {
            duration: vacuum_ability.GetSpecialValueFor("teleport_duration"),
            exit_portal_entindex: exit_portal.entindex(),
            enemy_tracker: this.enemy_tracker
        }, vacuum_ability.cursor_position, this.GetCasterPlus().GetTeamNumber(), false);
        if (this.GetCasterPlus().HasAbility("imba_dark_seer_close_portal")) {
            this.GetCasterPlus().findAbliityPlus<imba_dark_seer_close_portal>("imba_dark_seer_close_portal").exit_portal = exit_portal;
            this.GetCasterPlus().findAbliityPlus<imba_dark_seer_close_portal>("imba_dark_seer_close_portal").entry_portal = entry_portal;
            this.GetCasterPlus().findAbliityPlus<imba_dark_seer_close_portal>("imba_dark_seer_close_portal").SetActivated(true);
        }
        if (vacuum_ability && vacuum_ability.IsHidden()) {
            this.GetCasterPlus().SwapAbilities("imba_dark_seer_vacuum", "imba_dark_seer_wormhole", true, false);
        }
        this.enemy_tracker = []
    }
}
@registerModifier()
export class modifier_imba_dark_seer_wormhole extends BaseModifierMotionHorizontal_Plus {
    public damage: number;
    public duration: number;
    public x: any;
    public y: any;
    public vacuum_pos: any;
    public caster: IBaseNpc_Plus;
    public distance: number;
    public speed: number;
    IsDebuff(): boolean {
        return true;
    }
    IgnoreTenacity() {
        return true;
    }
    Init(params: any): void {
        this.damage = this.GetSpecialValueFor("damage");
        if (!IsServer()) {
            return;
        }
        this.duration = params.duration;
        this.x = params.x;
        this.y = params.y;
        this.vacuum_pos = GetGroundPosition(Vector(this.x, this.y, 0), undefined);
        if (params.caster_entindex) {
            this.caster = EntIndexToHScript(params.caster_entindex) as IBaseNpc_Plus;
        } else {
            this.caster = this.GetCasterPlus();
        }
        this.GetParentPlus().SetAbsOrigin(this.vacuum_pos);
        this.distance = this.GetParentPlus().GetAbsOrigin() + RandomVector(this.GetSpecialValueFor("radius"));
        this.speed = this.GetSpecialValueFor("radius") / this.duration;
        this.BeginMotionOrDestroy();

    }

    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (!IsServer()) {
            return;
        }
        let distance = (me.GetAbsOrigin() - this.distance as Vector).Normalized();
        me.SetOrigin(me.GetAbsOrigin() + distance * this.speed * dt as Vector);
    }
    OnHorizontalMotionInterrupted(): void {
        this.Destroy();
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        // this.GetParentPlus().RemoveHorizontalMotionController();
        let damageTable = {
            victim: this.GetParentPlus(),
            damage: this.damage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_BYPASSES_INVULNERABILITY,
            attacker: this.caster,
            ability: this.GetAbilityPlus()
        }
        ApplyDamage(damageTable);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_FLAIL;
    }
}
@registerModifier()
export class modifier_imba_dark_seer_vacuum_entry_portal extends BaseModifier_Plus {
    public teleport_radius: number;
    public entry_particle: any;
    public exit_portal: any;
    public ported_units: {
        [k: string]: boolean
    };
    public enemy_tracker: EntityIndex[];
    public camera_tracker: any;
    BeCreated(keys: any): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        if (!IsServer()) {
            return;
        }
        this.teleport_radius = this.GetSpecialValueFor("teleport_radius");
        this.entry_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_void_spirit/void_spirit_entryportal.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        this.AddParticle(this.entry_particle, false, false, -1, false, false);
        this.exit_portal = EntIndexToHScript(keys.exit_portal_entindex);
        this.ported_units = {}
        this.enemy_tracker = []
        this.camera_tracker = {}
        if (this.GetCasterPlus().HasAbility("imba_dark_seer_wormhole") && this.GetCasterPlus().findAbliityPlus<imba_dark_seer_wormhole>("imba_dark_seer_wormhole").enemy_tracker) {
            for (const [_, enemy] of GameFunc.iPair(this.GetCasterPlus().findAbliityPlus<imba_dark_seer_wormhole>("imba_dark_seer_wormhole").enemy_tracker)) {
                this.enemy_tracker.push(enemy.entindex());
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (!IsServer()) {
            return;
        }
        let units = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.teleport_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false) as IBaseNpc_Plus[];
        for (const [_, unit] of GameFunc.iPair(units)) {
            if (this.GetElapsedTime() >= 0.1 && !this.ported_units[unit.entindex() + ""] && !unit.HasModifier("modifier_imba_dark_seer_wormhole") && (unit.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber() || !AoiHelper.IsNearFountain(this.exit_portal.GetAbsOrigin(), 1700))) {
                if (unit.IsRealUnit()) {
                    EmitSoundOnLocationWithCaster(unit.GetAbsOrigin(), "Wormhole.Disappear", this.GetCasterPlus());
                } else {
                    EmitSoundOnLocationWithCaster(unit.GetAbsOrigin(), "Wormhole.CreepDisappear", this.GetCasterPlus());
                }
                FindClearSpaceForUnit(unit, this.exit_portal.GetAbsOrigin(), true);
                if (unit.GetPlayerOwnerID) {
                    PlayerResource.SetCameraTarget(unit.GetPlayerOwnerID(), unit);
                    unit.AddNewModifier(unit, this.GetAbilityPlus(), "modifier_imba_dark_seer_vacuum_camera_track", {
                        duration: FrameTime()
                    });
                }
                if (unit.IsRealUnit()) {
                    EmitSoundOnLocationWithCaster(unit.GetAbsOrigin(), "Wormhole.Appear", this.GetCasterPlus());
                } else {
                    EmitSoundOnLocationWithCaster(unit.GetAbsOrigin(), "Wormhole.CreepAppear", this.GetCasterPlus());
                }
                this.ported_units[unit.entindex() + ""] = true;
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasAbility("imba_dark_seer_close_portal")) {
            this.GetCasterPlus().findAbliityPlus<imba_dark_seer_close_portal>("imba_dark_seer_close_portal").SetActivated(false);
        }
    }
}
@registerModifier()
export class modifier_imba_dark_seer_vacuum_exit_portal extends BaseModifier_Plus {
    public exit_particle: any;
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.exit_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_void_spirit/void_spirit_exitportal_edge.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        this.AddParticle(this.exit_particle, false, false, -1, false, false);
    }
}
@registerModifier()
export class modifier_imba_dark_seer_vacuum_camera_track extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IgnoreTenacity() {
        return true;
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        PlayerResource.SetCameraTarget(this.GetParentPlus().GetPlayerOwnerID(), undefined);
    }
}
@registerAbility()
export class imba_dark_seer_ion_shell extends BaseAbility_Plus {
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        this.GetCursorTarget().EmitSound("Hero_Dark_Seer.Ion_Shield_Start");
        if (this.GetCasterPlus().GetUnitName().includes("dark_seer") && RollPercentage(50)) {
            this.GetCasterPlus().EmitSound("dark_seer_dkseer_ability_surge_0" + math.random(1, 2));
        }
        if (this.GetAutoCastState() && this.GetCursorTarget().GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
            this.GetCursorTarget().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_dark_seer_ion_shell_negation", {
                duration: this.GetSpecialValueFor("duration") * (1 - this.GetCursorTarget().GetStatusResistance())
            });
        } else {
            this.GetCursorTarget().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_dark_seer_ion_shell", {
                duration: this.GetSpecialValueFor("duration")
            });
        }
    }
}
@registerModifier()
export class modifier_imba_dark_seer_ion_shell extends BaseModifier_Plus {
    public damage_per_second: number;
    public proton_explosion_radius: number;
    public proton_damage_pct: number;
    public interval: number;
    public radius: number;
    public particle: any;
    BeCreated(p_0: any,): void {
        this.damage_per_second = this.GetAbilityPlus().GetTalentSpecialValueFor("damage_per_second");
        this.proton_explosion_radius = this.GetSpecialValueFor("proton_explosion_radius");
        this.proton_damage_pct = this.GetSpecialValueFor("proton_damage_pct");
        this.interval = 0.1;
        if (!IsServer()) {
            return;
        }
        this.radius = this.GetAbilityPlus().GetTalentSpecialValueFor("radius");
        this.GetParentPlus().EmitSound("Hero_Dark_Seer.Ion_Shield_lp");
        this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_dark_seer/dark_seer_ion_shell.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(this.particle, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(this.particle, 1, Vector(50, 50, 50));
        this.AddParticle(this.particle, false, false, -1, false, false);
        this.SetStackCount(0);
        this.StartIntervalThink(this.interval);
    }
    BeRefresh(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.damage_per_second = this.GetAbilityPlus().GetTalentSpecialValueFor("damage_per_second");
        if (!IsServer()) {
            return;
        }
        this.radius = this.GetSpecialValueFor("radius");
        this.SetStackCount(0);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (enemy != this.GetParentPlus()) {
                let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_dark_seer/dark_seer_ion_shell_damage.vpcf", ParticleAttachment_t.PATTACH_POINT, this.GetParentPlus(), this.GetCasterPlus());
                ParticleManager.SetParticleControlEnt(particle, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(particle, 1, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(particle);
                if (this.GetAbilityPlus()) {
                    this.damage_per_second = this.GetAbilityPlus().GetTalentSpecialValueFor("damage_per_second");
                }
                let damageTable = {
                    victim: enemy,
                    damage: this.damage_per_second * this.interval,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this.GetAbilityPlus()
                }
                let damage_dealt = ApplyDamage(damageTable) * this.proton_damage_pct * 0.01;
                this.SetStackCount(this.GetStackCount() + math.floor(damage_dealt));
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().EmitSound("Hero_Dark_Seer.Ion_Shield_end");
        if (this.GetRemainingTime() <= 0) {
            this.GetParentPlus().EmitSound("Hero_Abaddon.AphoticShield.Destroy");
            let particle = ResHelper.CreateParticleEx("particles/econ/items/abaddon/abaddon_alliance/abaddon_aphotic_shield_alliance_explosion.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            ParticleManager.ReleaseParticleIndex(particle);
            let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.proton_explosion_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (enemy != this.GetParentPlus()) {
                    let damageTable = {
                        victim: enemy,
                        damage: this.GetStackCount(),
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                        attacker: this.GetCasterPlus(),
                        ability: this.GetAbilityPlus()
                    }
                    ApplyDamage(damageTable);
                    if (this.GetCasterPlus() && this.GetAbilityPlus() && !enemy.FindModifierByNameAndCaster("modifier_imba_dark_seer_ion_shell", this.GetCasterPlus())) {
                        enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_dark_seer_ion_shell", {
                            duration: this.GetSpecialValueFor("duration") * (1 - enemy.GetStatusResistance())
                        });
                    }
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
    CC_GetModifierProvidesFOWVision(): 0 | 1 {
        if (this.GetParentPlus().GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
            return 1;
        } else {
            return 0;
        }
    }
}
@registerModifier()
export class modifier_imba_dark_seer_ion_shell_negation extends BaseModifier_Plus {
    public damage_per_second: number;
    public proton_explosion_radius: number;
    public proton_damage_pct: number;
    public interval: number;
    public radius: number;
    public damage_table: ApplyDamageOptions;
    public particle: any;
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.damage_per_second = this.GetAbilityPlus().GetTalentSpecialValueFor("damage_per_second");
        this.proton_explosion_radius = this.GetSpecialValueFor("proton_explosion_radius");
        this.proton_damage_pct = this.GetSpecialValueFor("proton_damage_pct");
        this.interval = 0.1;
        if (!IsServer()) {
            return;
        }
        this.radius = this.GetAbilityPlus().GetTalentSpecialValueFor("radius");
        this.damage_table = {
            victim: this.GetParentPlus(),
            damage: this.damage_per_second * this.interval,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.GetCasterPlus(),
            ability: this.GetAbilityPlus()
        }
        this.GetParentPlus().EmitSound("Hero_Dark_Seer.Ion_Shield_lp");
        this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_dark_seer/dark_seer_ion_shell.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(this.particle, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(this.particle, 1, Vector(this.radius, this.radius, this.radius));
        this.AddParticle(this.particle, false, false, -1, false, false);
        this.SetStackCount(0);
        this.StartIntervalThink(this.interval);
    }
    BeRefresh(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.damage_per_second = this.GetAbilityPlus().GetTalentSpecialValueFor("damage_per_second");
        if (!IsServer()) {
            return;
        }
        this.radius = this.GetSpecialValueFor("radius");
        ParticleManager.SetParticleControl(this.particle, 1, Vector(this.radius, this.radius, this.radius));
        this.SetStackCount(0);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        let units = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, unit] of GameFunc.iPair(units)) {
            if (unit != this.GetParentPlus()) {
                let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_dark_seer/dark_seer_ion_shell_damage.vpcf", ParticleAttachment_t.PATTACH_POINT, this.GetParentPlus(), this.GetCasterPlus());
                ParticleManager.SetParticleControlEnt(particle, 0, unit, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", unit.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(particle, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(particle);
                if (this.GetAbilityPlus()) {
                    this.damage_per_second = this.GetAbilityPlus().GetTalentSpecialValueFor("damage_per_second");
                }
                if (unit.GetTeamNumber() == this.GetParentPlus().GetTeamNumber()) {
                    this.damage_table.damage = this.damage_per_second * this.interval;
                } else {
                    this.damage_table.damage = this.damage_per_second * this.interval * 0.5;
                }
                this.SetStackCount(this.GetStackCount() + math.floor(ApplyDamage(this.damage_table) * this.proton_damage_pct * 0.01));
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().EmitSound("Hero_Dark_Seer.Ion_Shield_end");
        if (this.GetRemainingTime() <= 0) {
            this.GetParentPlus().EmitSound("Hero_Abaddon.AphoticShield.Destroy");
            let particle = ResHelper.CreateParticleEx("particles/econ/items/abaddon/abaddon_alliance/abaddon_aphotic_shield_alliance_explosion.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            ParticleManager.ReleaseParticleIndex(particle);
            let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.proton_explosion_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (enemy != this.GetParentPlus()) {
                    ApplyDamage({
                        victim: enemy,
                        damage: this.GetStackCount(),
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                        attacker: this.GetCasterPlus(),
                        ability: this.GetAbilityPlus()
                    });
                    if (this.GetCasterPlus() && this.GetAbilityPlus() && !enemy.FindModifierByNameAndCaster("modifier_imba_dark_seer_ion_shell_negation", this.GetCasterPlus())) {
                        enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_dark_seer_ion_shell_negation", {
                            duration: this.GetSpecialValueFor("duration") * (1 - enemy.GetStatusResistance())
                        });
                    }
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
    CC_GetModifierProvidesFOWVision(): 0 | 1 {
        return 1;
    }
}
@registerAbility()
export class imba_dark_seer_surge extends BaseAbility_Plus {
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return super.GetCastRange(location, target) + this.GetCasterPlus().GetTalentValue("special_bonus_imba_dark_seer_surge_cast_range");
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("surge_radius");
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let allies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCursorPosition(), undefined, this.GetSpecialValueFor("surge_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        if (GameFunc.GetCount(allies) > 0) {
            EmitSoundOnLocationWithCaster(this.GetCursorPosition(), "Hero_Dark_Seer.Surge", this.GetCasterPlus());
        }
        for (const [_, ally] of GameFunc.iPair(allies)) {
            ally.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_dark_seer_surge", {
                duration: this.GetSpecialValueFor("duration")
            });
        }
        for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCursorPosition(), undefined, this.GetSpecialValueFor("surge_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
            enemy.EmitSound("Hero_Dark_Seer.Surge_Sonic_Boom");
            enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_generic_motion_controller", {
                distance: this.GetSpecialValueFor("sonic_boom_knockback_speed") * this.GetSpecialValueFor("sonic_boom_knockback_duration"),
                direction_x: (enemy.GetAbsOrigin() - this.GetCursorPosition() as Vector).Normalized().x,
                direction_y: (enemy.GetAbsOrigin() - this.GetCursorPosition() as Vector).Normalized().y,
                direction_z: (enemy.GetAbsOrigin() - this.GetCursorPosition() as Vector).Normalized().z,
                duration: this.GetSpecialValueFor("sonic_boom_knockback_duration"),
                height: 0,
                bGroundStop: false,
                bDecelerate: false,
                bInterruptible: false,
                bIgnoreTenacity: true,
                bTreeRadius: enemy.GetHullRadius(),
                bStun: false,
                bDestroyTreesAlongPath: true
            });
            enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_dark_seer_surge_slow", {
                duration: this.GetSpecialValueFor("sonic_boom_move_speed_duration") * (1 - enemy.GetStatusResistance())
            });
            ApplyDamage({
                victim: enemy,
                damage: this.GetSpecialValueFor("sonic_boom_damage"),
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this
            });
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_dark_seer_surge_cast_range") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_dark_seer_surge_cast_range")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_dark_seer_surge_cast_range"), "modifier_special_bonus_imba_dark_seer_surge_cast_range", {});
        }
    }
}
@registerModifier()
export class modifier_imba_dark_seer_surge extends BaseModifier_Plus {
    public speed_boost: number;
    public speed: number;
    GetEffectName(): string {
        return "particles/units/heroes/hero_dark_seer/dark_seer_surge.vpcf";
    }
    Init(p_0: any,): void {
        this.speed_boost = this.GetSpecialValueFor("speed_boost");
        this.speed = this.GetParentPlus().GetIdealSpeedNoSlows();
    }

    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_UNSLOWABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MOVESPEED_LIMIT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        return this.speed_boost;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MOVESPEED_LIMIT)
    CC_GetModifierIgnoreMovespeedLimit(): 0 | 1 {
        return 1;
    }
}
@registerModifier()
export class modifier_imba_dark_seer_surge_slow extends BaseModifier_Plus {
    public sonic_boom_move_speed_slow: number;
    public sonic_boom_miss_percentage: any;
    GetEffectName(): string {
        return "particles/units/heroes/hero_keeper_of_the_light/keeper_of_the_light_blinding_light_debuff.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.sonic_boom_move_speed_slow = this.GetSpecialValueFor("sonic_boom_move_speed_slow") * (-1);
        this.sonic_boom_miss_percentage = this.GetSpecialValueFor("sonic_boom_miss_percentage");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.sonic_boom_move_speed_slow;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE)
    CC_GetModifierMiss_Percentage(): number {
        return this.sonic_boom_miss_percentage;
    }
}
@registerAbility()
export class imba_dark_seer_close_portal extends BaseAbility_Plus {
    public entry_portal: any;
    public exit_portal: any;
    IsInnateAbility() {
        return true;
    }
    IsStealable(): boolean {
        return false;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_dark_seer_close_portal";
    }
    OnSpellStart(): void {
        if (this.entry_portal && !this.entry_portal.IsNull()) {
            this.entry_portal.Destroy();
            this.entry_portal = undefined;
        }
        if (this.exit_portal && !this.exit_portal.IsNull()) {
            this.exit_portal.Destroy();
            this.exit_portal = undefined;
        }
        this.SetActivated(false);
    }
}
@registerModifier()
export class modifier_imba_dark_seer_close_portal extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus()) {
            this.GetAbilityPlus().SetActivated(false);
        }
    }
}
@registerAbility()
export class imba_dark_seer_wall_of_replica extends BaseAbility_Plus {
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let duration = this.GetSpecialValueFor("duration");
        EmitSoundOnLocationWithCaster(this.GetCursorPosition(), "Hero_Dark_Seer.Wall_of_Replica_Start", this.GetCasterPlus());
        BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_imba_dark_seer_wall_of_replica", {
            duration: duration,
            x: this.GetCursorPosition().x,
            y: this.GetCursorPosition().y,
            rotation: 45
        }, this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus().GetTeamNumber(), false);
        BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_imba_dark_seer_wall_of_replica", {
            duration: duration,
            x: this.GetCursorPosition().x,
            y: this.GetCursorPosition().y,
            rotation: -45
        }, this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus().GetTeamNumber(), false);
    }
}
@registerModifier()
export class modifier_imba_dark_seer_wall_of_replica extends BaseModifier_Plus {
    public width: any;
    public thickness: any;
    public slow_duration: number;
    public movement_slow: any;
    public scepter_rotation_speed: number;
    public minimum_interval: number;
    public scepter: any;
    public rotation: any;
    public cursor_position: any;
    public distance_vector: Vector;
    public wall_vector: any;
    public wall_start: any;
    public wall_end: any;
    public particle: any;
    public random_int_1: any;
    public random_int_2: any;
    public random_int_3: any;
    public scale_1: any;
    public scale_2: any;
    public scale_3: any;
    public wall_slow_modifier: any;
    BeCreated(params: any): void {
        this.width = this.GetSpecialValueFor("width");
        this.thickness = 50;
        this.slow_duration = this.GetAbilityPlus().GetTalentSpecialValueFor("slow_duration");
        this.movement_slow = this.GetSpecialValueFor("movement_slow");
        this.scepter_rotation_speed = this.GetSpecialValueFor("scepter_rotation_speed");
        this.minimum_interval = this.GetSpecialValueFor("minimum_interval");
        this.scepter = this.GetCasterPlus().HasScepter();
        if (this.scepter) {
            this.width = this.GetSpecialValueFor("scepter_width");
        }
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().EmitSound("Hero_Dark_Seer.Wall_of_Replica_lp");
        this.rotation = params.rotation;
        this.cursor_position = GetGroundPosition(Vector(params.x, params.y, 0), undefined);
        this.distance_vector = this.cursor_position - this.GetCasterPlus().GetAbsOrigin() as Vector;
        this.wall_vector = RotatePosition(Vector(0, 0, 0), QAngle(0, params.rotation, 0), this.distance_vector.Normalized());
        this.wall_start = this.cursor_position + this.wall_vector * this.width * 0.5;
        this.wall_end = this.cursor_position - this.wall_vector * this.width * 0.5;
        this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_dark_seer/dark_seer_wall_of_replica.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(this.particle, 0, this.wall_start);
        ParticleManager.SetParticleControl(this.particle, 1, this.wall_end);
        this.random_int_1 = RandomInt(0, 255);
        this.random_int_2 = RandomInt(0, 255);
        this.random_int_3 = RandomInt(0, 255);
        this.scale_1 = RandomInt(3, 6);
        this.scale_2 = RandomInt(3, 6);
        this.scale_3 = RandomInt(3, 6);
        ParticleManager.SetParticleControl(this.particle, 60, Vector(this.random_int_1, this.random_int_2, this.random_int_3));
        ParticleManager.SetParticleControl(this.particle, 61, Vector(1, 0, 0));
        this.AddParticle(this.particle, false, false, -1, false, false);
        this.StartIntervalThink(0.1);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus()) {
            this.slow_duration = this.GetAbilityPlus().GetTalentSpecialValueFor("slow_duration");
        }
        for (const [_, enemy] of GameFunc.iPair(FindUnitsInLine(this.GetCasterPlus().GetTeamNumber(), this.wall_start, this.wall_end, undefined, this.thickness, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES))) {
            this.wall_slow_modifier = enemy.FindModifierByNameAndCaster("modifier_imba_dark_seer_wall_of_replica_slow", this.GetParentPlus());
            if (this.wall_slow_modifier) {
                this.wall_slow_modifier.SetDuration(this.slow_duration * (1 - enemy.GetStatusResistance()), true);
            } else {
                enemy.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_dark_seer_wall_of_replica_slow", {
                    duration: this.slow_duration * (1 - enemy.GetStatusResistance()),
                    movement_slow: this.movement_slow,
                    minimum_interval: this.minimum_interval
                });
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().StopSound("Hero_Dark_Seer.Wall_of_Replica_lp");
        this.GetParentPlus().RemoveSelf();
    }
}
@registerModifier()
export class modifier_imba_dark_seer_wall_of_replica_slow extends BaseModifier_Plus {
    public minimum_interval: number;
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_dark_seer_illusion.vpcf";
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.minimum_interval = params.minimum_interval;
        this.SetStackCount(params.movement_slow * (-1));
        this.StartIntervalThink(math.max(this.GetParentPlus().GetSecondsPerAttack(), this.minimum_interval));
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (!this.GetParentPlus().IsInvulnerable()) {
            this.GetParentPlus().PerformAttack(this.GetParentPlus(), true, true, true, true, true, false, false);
        }
        this.StartIntervalThink(math.max(this.GetParentPlus().GetSecondsPerAttack(), this.minimum_interval));
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE_KILLCREDIT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetStackCount();
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE_KILLCREDIT)
    CC_OnTakeDamageKillCredit(keys: ModifierAttackEvent): void {
        if (keys.target == this.GetParentPlus() && this.GetParentPlus().GetHealth() <= keys.damage) {
            if (keys.attacker == this.GetParentPlus()) {
                this.GetParentPlus().Kill(this.GetAbilityPlus(), this.GetCasterPlus());
            } else {
                this.GetParentPlus().Kill(this.GetAbilityPlus(), keys.attacker);
            }
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_dark_seer_ion_shell_radius extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_dark_seer_vacuum_increased_duration extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_dark_seer_wall_of_replica_increased_slow_duration extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_dark_seer_ion_shell_damage extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_dark_seer_surge_cast_range extends BaseModifier_Plus {
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
