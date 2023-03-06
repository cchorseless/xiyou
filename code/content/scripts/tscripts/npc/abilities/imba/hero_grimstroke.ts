
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_grimstroke_dark_artistry extends BaseAbility_Plus {
    public precast_particle: any;
    public responses: { [key: string]: number };
    GetIntrinsicModifierName(): string {
        return "modifier_imba_grimstroke_dark_artistry_extend";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return this.GetTalentSpecialValueFor("range_tooltip") + this.GetCasterPlus().findBuffStack("modifier_imba_grimstroke_dark_artistry_extend", this.GetCasterPlus());
    }
    GetCooldown(level: number): number {
        if (this.GetCasterPlus().HasModifier("modifier_imba_grimstroke_dark_artistry_ink_line")) {
            return super.GetCooldown(level) + this.GetSpecialValueFor("ink_lines_cd_increase");
        } else {
            return super.GetCooldown(level);
        }
    }
    OnAbilityPhaseStart(): boolean {
        this.GetCasterPlus().EmitSound("Hero_Grimstroke.DarkArtistry.PreCastPoint");
        this.precast_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_grimstroke/grimstroke_cast2_ground.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(this.precast_particle, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", this.GetCasterPlus().GetAbsOrigin(), true);
        return true;
    }
    OnAbilityPhaseInterrupted(): void {
        this.GetCasterPlus().StopSound("Hero_Grimstroke.DarkArtistry.PreCastPoint");
        if (this.precast_particle) {
            ParticleManager.DestroyParticle(this.precast_particle, true);
            ParticleManager.ReleaseParticleIndex(this.precast_particle);
            this.precast_particle = undefined;
        }
    }
    OnSpellStart(): void {
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
        }
        this.GetCasterPlus().StopSound("Hero_Grimstroke.DarkArtistry.PreCastPoint");
        this.GetCasterPlus().EmitSound("Hero_Grimstroke.DarkArtistry.Cast");
        this.GetCasterPlus().EmitSound("Hero_Grimstroke.DarkArtistry.Cast.Layer");
        if (this.GetCasterPlus().GetName().includes("grimstroke") && RollPercentage(50)) {
            if (!this.responses) {
                this.responses = {
                    "grimstroke_grimstroke_attack_12_02": 0,
                    "grimstroke_grimstroke_ability3_01": 0,
                    "grimstroke_grimstroke_ability3_02": 0,
                    "grimstroke_grimstroke_ability3_04": 0,
                    "grimstroke_grimstroke_ability3_05": 0,
                    "grimstroke_grimstroke_ability3_06": 0,
                    "grimstroke_grimstroke_ability3_07": 0,
                    "grimstroke_grimstroke_ability3_08": 0,
                    "grimstroke_grimstroke_ability3_09": 0,
                    "grimstroke_grimstroke_ability3_10": 0,
                    "grimstroke_grimstroke_ability3_11": 0
                }
            }
            for (const response in (this.responses)) {
                const timer = this.responses[response];
                if (GameRules.GetDOTATime(true, true) - timer >= 120) {
                    this.GetCasterPlus().EmitSound(response);
                    this.responses[response] = GameRules.GetDOTATime(true, true);
                    return;
                }
            }
        }
        if (this.precast_particle) {
            ParticleManager.ReleaseParticleIndex(this.precast_particle);
            this.precast_particle = undefined;
        }
        let offset_start_vector = this.GetCasterPlus().GetRightVector() * 120 * (-1);
        let projectile_start_location = this.GetCasterPlus().GetAbsOrigin() + offset_start_vector as Vector;
        this.Stroke(projectile_start_location, this.GetCursorPosition(), true, this.GetAutoCastState());
        if (this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_grimstroke_ink_gods_incarnation", this.GetCasterPlus())) {
            for (let extra_strokes = 0; extra_strokes < 3; extra_strokes++) {
                let start_position = RotatePosition(this.GetCasterPlus().GetAbsOrigin(), QAngle(0, 90 * extra_strokes, 0), projectile_start_location);
                let end_position = RotatePosition(this.GetCasterPlus().GetAbsOrigin(), QAngle(0, 90 * extra_strokes, 0), this.GetCursorPosition());
                this.Stroke(start_position, end_position, true);
            }
        }
    }
    Stroke(start_location: Vector, end_position: Vector, bPrimary: boolean, bMain = false) {
        if (start_location == end_position) {
            end_position = end_position + this.GetCasterPlus().GetForwardVector() as Vector;
        }
        let stroke_dummy = CreateModifierThinker(this.GetCasterPlus(), this, undefined, {}, this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus().GetTeamNumber(), false);
        stroke_dummy.EmitSound("Hero_Grimstroke.DarkArtistry.Projectile");
        stroke_dummy.TempData().hit_units = 0;
        let velocity = (end_position - start_location as Vector).Normalized() * this.GetSpecialValueFor("projectile_speed") as Vector;
        let info = {
            Ability: this,
            EffectName: "particles/units/heroes/hero_grimstroke/grimstroke_darkartistry_proj.vpcf",
            vSpawnOrigin: start_location,
            fDistance: this.GetTalentSpecialValueFor("range_tooltip") + GPropertyCalculate.GetCastRangeBonus(this.GetCasterPlus()) + this.GetCasterPlus().findBuffStack("modifier_imba_grimstroke_dark_artistry_extend", this.GetCasterPlus()),
            fStartRadius: this.GetSpecialValueFor("start_radius"),
            fEndRadius: this.GetSpecialValueFor("end_radius"),
            Source: this.GetCasterPlus(),
            bHasFrontalCone: false,
            bReplaceExisting: false,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            fExpireTime: GameRules.GetGameTime() + 10.0,
            bDeleteOnHit: false,
            vVelocity: Vector(velocity.x, velocity.y, 0),
            bProvidesVision: true,
            iVisionRadius: this.GetSpecialValueFor("end_radius"),
            iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber(),
            ExtraData: {
                stroke_dummy: stroke_dummy.entindex(),
                bPrimary: bPrimary,
                bMain: bMain
            }
        }
        let projectile = ProjectileManager.CreateLinearProjectile(info);
    }
    OnProjectileThink_ExtraData(location: Vector, data: any): void {
        if (!IsServer()) {
            return;
        }
        if (data.stroke_dummy) {
            EntIndexToHScript(data.stroke_dummy).SetAbsOrigin(location);
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, data: any): boolean | void {
        if (!IsServer()) {
            return;
        }
        this.CreateVisibilityNode(location, this.GetSpecialValueFor("end_radius"), 2);
        if (target) {
            if (!target.IsCreep()) {
                target.EmitSound("Hero_Grimstroke.DarkArtistry.Damage");
            } else {
                target.EmitSound("Hero_Grimstroke.DarkArtistry.Damage.Creep");
            }
            let stroke_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_demonartist/demonartist_darkartistry_dmg.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, target);
            ParticleManager.ReleaseParticleIndex(stroke_particle);
            let unitnpc = EntIndexToHScript(data.stroke_dummy) as IBaseNpc_Plus;
            let damageTable = {
                victim: target,
                damage: (this.GetSpecialValueFor("damage") + (this.GetSpecialValueFor("bonus_damage_per_target") * unitnpc.TempData<number>().hit_units)) * math.max(1 + (this.GetCasterPlus().GetTalentValue("special_bonus_imba_grimstroke_stroke_of_fate_damage") * 0.01), 1),
                damage_type: this.GetAbilityDamageType(),
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this
            }
            ApplyDamage(damageTable);
            unitnpc.TempData<number>().hit_units += 1;
            target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_grimstroke_dark_artistry_slow", {
                duration: this.GetSpecialValueFor("slow_duration") * (1 - target.GetStatusResistance())
            });
            if (data.bPrimary == 1) {
                if (unitnpc.TempData<number>().hit_units == 1) {
                    let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), target.GetAbsOrigin(), undefined, this.GetSpecialValueFor("stain_spread_max_distance"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_FARTHEST, false);
                    for (const [_, enemy] of GameFunc.iPair(enemies)) {
                        if (target != enemy && target.FindModifierByNameAndCaster("modifier_grimstroke_soul_chain", this.GetCasterPlus()) && enemy.FindModifierByNameAndCaster("modifier_grimstroke_soul_chain", this.GetCasterPlus())) {
                            this.Stroke(target.GetAbsOrigin(), enemy.GetAbsOrigin(), false);
                        }
                    }
                }
                if ((target.IsRealHero() || target.IsClone()) && this.GetIntrinsicModifierName()) {
                    let brush_extend_modifier = this.GetCasterPlus().FindModifierByNameAndCaster(this.GetIntrinsicModifierName(), this.GetCasterPlus());
                    if (brush_extend_modifier) {
                        brush_extend_modifier.SetStackCount(brush_extend_modifier.GetStackCount() + this.GetSpecialValueFor("brush_extend_range_per_hero"));
                    }
                }
            }
        } else if (data.stroke_dummy) {
            EntIndexToHScript(data.stroke_dummy).RemoveSelf();
            if (location && data.bMain == 1) {
                let warp_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_grimstroke/grimstroke_ink_lines_warp.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
                ParticleManager.SetParticleControl(warp_particle, 0, this.GetCasterPlus().GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(warp_particle);
                FindClearSpaceForUnit(this.GetCasterPlus(), location, false);
                warp_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_grimstroke/grimstroke_ink_lines_warp.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
                ParticleManager.SetParticleControl(warp_particle, 0, this.GetCasterPlus().GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(warp_particle);
            }
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_grimstroke_stroke_of_fate_cast_range") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_grimstroke_stroke_of_fate_cast_range")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_grimstroke_stroke_of_fate_cast_range"), "modifier_special_bonus_imba_grimstroke_stroke_of_fate_cast_range", {});
        }
    }
}
@registerModifier()
export class modifier_imba_grimstroke_dark_artistry_extend extends BaseModifier_Plus {
    IsHidden(): boolean {
        return this.GetAbilityPlus().GetLevel() == 0;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(0);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ORDER
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierAbilityEvent): void {
        if (!IsServer() || keys.unit != this.GetParentPlus() || keys.order_type != dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO || keys.ability != this.GetAbilityPlus()) {
            return;
        }
        if (this.GetAbilityPlus().GetAutoCastState()) {
            this.GetParentPlus().RemoveModifierByName("modifier_imba_grimstroke_dark_artistry_ink_line");
        } else {
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_grimstroke_dark_artistry_ink_line", {});
        }
    }
}
@registerModifier()
export class modifier_imba_grimstroke_dark_artistry_slow extends BaseModifier_Plus {
    public movement_slow_pct: number;
    GetEffectName(): string {
        return "particles/units/heroes/hero_grimstroke/grimstroke_dark_artistry_debuff.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_grimstroke_dark_artistry.vpcf";
    }
    Init(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.movement_slow_pct = this.GetSpecialValueFor("movement_slow_pct");
        } else {
            this.Destroy();
        }
    }

    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.movement_slow_pct * (-1);
    }
}
@registerModifier()
export class modifier_imba_grimstroke_dark_artistry_ink_line extends BaseModifier_Plus {
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
@registerAbility()
export class imba_grimstroke_ink_creature extends BaseAbility_Plus {
    public responses: { [key: string]: number };
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
    }
    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        if (target.TriggerSpellAbsorb(this)) {
            return;
        }
        let vision_modifier = target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_grimstroke_ink_creature_vision", {});
        if (this.GetCasterPlus().GetName().includes("grimstroke") && RollPercentage(50)) {
            if (!this.responses) {
                this.responses = {
                    ["grimstroke_grimstroke_ability1_01"]: 0,
                    ["grimstroke_grimstroke_ability1_02"]: 0,
                    ["grimstroke_grimstroke_ability1_03"]: 0,
                    ["grimstroke_grimstroke_ability1_04"]: 0,
                    ["grimstroke_grimstroke_ability1_05"]: 0,
                    ["grimstroke_grimstroke_ability1_06"]: 0,
                    ["grimstroke_grimstroke_ability1_07"]: 0,
                    ["grimstroke_grimstroke_ability1_08"]: 0,
                    ["grimstroke_grimstroke_ability1_09"]: 0,
                    ["grimstroke_grimstroke_ability1_10"]: 0,
                    ["grimstroke_grimstroke_ability1_11"]: 0,
                    ["grimstroke_grimstroke_ability1_12"]: 0
                }
            }
            for (const response in (this.responses)) {
                const timer = this.responses[response];
                if (GameRules.GetDOTATime(true, true) - timer >= 120) {
                    this.GetCasterPlus().EmitSound(response);
                    this.responses[response] = GameRules.GetDOTATime(true, true);
                    return;
                }
            }
        }
        let ability = this;
        let caster = this.GetCasterPlus();
        let _target = target;
        let speed = this.GetSpecialValueFor("speed");
        let latch_unit_offset_short = this.GetSpecialValueFor("latched_unit_offset_short");
        this.AddTimer(this.GetSpecialValueFor("spawn_time"), () => {
            caster.EmitSound("Hero_Grimstroke.InkCreature.Cast");
            let ink_unit = BaseNpc_Plus.CreateUnitByName("npc_dota_grimstroke_ink_creature", this.GetCasterPlus().GetAbsOrigin() + this.GetCasterPlus().GetForwardVector() * this.GetSpecialValueFor("latched_unit_offset_short") as Vector, this.GetCasterPlus().GetTeamNumber(), false, this.GetCasterPlus(), this.GetCasterPlus());
            ink_unit.EmitSound("Hero_Grimstroke.InkCreature.Cast");
            ink_unit.AddNewModifier(caster, ability, "modifier_imba_grimstroke_ink_creature_thinker", {
                destroy_attacks: this.GetTalentSpecialValueFor("destroy_attacks"),
                hero_attack_multiplier: this.GetSpecialValueFor("hero_attack_multiplier"),
                target_entindex: _target.entindex()
            });
            ink_unit.SetForwardVector((_target.GetAbsOrigin() - ink_unit.GetAbsOrigin() as Vector).Normalized());
            let phantoms_embrace_particle = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_grimstroke/grimstroke_phantom_marker.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, _target, this.GetCasterPlus().GetTeamNumber());
            let projectile: CreateTrackingProjectileOptions = {
                Target: _target,
                Source: caster,
                Ability: ability,
                iMoveSpeed: speed,
                vSourceLoc: caster.GetAbsOrigin() + caster.GetForwardVector() * latch_unit_offset_short as Vector,
                bDrawsOnMinimap: false,
                bDodgeable: false,
                bIsAttack: false,
                bVisibleToEnemies: true,
                bReplaceExisting: false,
                flExpireTime: GameRules.GetGameTime() + 10.0,
                bProvidesVision: true,
                iVisionRadius: 400,
                iVisionTeamNumber: caster.GetTeamNumber(),
                ExtraData: {
                    ink_unit_entindex: ink_unit.entindex(),
                    target_entindex: _target.entindex(),
                    phantoms_embrace_particle: phantoms_embrace_particle
                }
            }
            ProjectileManager.CreateTrackingProjectile(projectile);
        });
    }
    OnProjectileThink_ExtraData(location: Vector, data: any): void {
        if (!IsServer()) {
            return;
        }
        let target = EntIndexToHScript(data.target_entindex) as IBaseNpc_Plus;
        if (!data.returning && data.ink_unit_entindex && target) {
            if (target.IsAlive()) {
                target.SetAbsOrigin(location);
                target.FaceTowards(EntIndexToHScript(data.target_entindex).GetAbsOrigin());
            } else {
                ParticleManager.DestroyParticle(data.phantoms_embrace_particle, false);
                ParticleManager.ReleaseParticleIndex(data.phantoms_embrace_particle);
            }
        }
    }
    OnProjectileHit_ExtraData(_target: CDOTA_BaseNPC | undefined, location: Vector, data: any): boolean | void {
        if (!IsServer()) {
            return;
        }
        if (data.phantoms_embrace_particle) {
            ParticleManager.DestroyParticle(data.phantoms_embrace_particle, false);
            ParticleManager.ReleaseParticleIndex(data.phantoms_embrace_particle);
        }
        if (_target) {
            let unit = EntIndexToHScript(data.ink_unit_entindex) as IBaseNpc_Plus;
            if (_target != this.GetCasterPlus() && data.ink_unit_entindex && unit && unit.IsAlive()) {
                if (_target.IsInvulnerable() || _target.IsOutOfGame() || !_target.IsAlive()) {
                    let projectile = {
                        Target: this.GetCasterPlus(),
                        Source: unit,
                        Ability: this,
                        EffectName: "particles/units/heroes/hero_grimstroke/grimstroke_phantom_return.vpcf",
                        iMoveSpeed: this.GetSpecialValueFor("return_projectile_speed"),
                        vSourceLoc: unit.GetAbsOrigin(),
                        bDrawsOnMinimap: false,
                        bDodgeable: true,
                        bIsAttack: false,
                        bVisibleToEnemies: true,
                        bReplaceExisting: false,
                        flExpireTime: GameRules.GetGameTime() + 10.0,
                        bProvidesVision: false,
                        ExtraData: {
                            returning: true
                        }
                    }
                    ProjectileManager.CreateTrackingProjectile(projectile);
                    unit.ForceKill(false);
                    unit.AddNoDraw();
                } else {
                    _target.EmitSound("Hero_Grimstroke.InkCreature.Attach");
                    _target.AddNewModifier(unit, this, "modifier_imba_grimstroke_ink_creature", {
                        duration: this.GetSpecialValueFor("latch_duration") * (1 - _target.GetStatusResistance()),
                        latched_unit_offset: this.GetSpecialValueFor("latched_unit_offset"),
                        ink_unit_entindex: data.ink_unit_entindex
                    });
                    let ink_modifier = unit.FindModifierByNameAndCaster("modifier_imba_grimstroke_ink_creature_thinker", this.GetCasterPlus());
                    if (ink_modifier) {
                        ink_modifier.SetStackCount(0);
                    }
                    _target.AddNewModifier(unit, this, "modifier_imba_grimstroke_ink_creature_debuff", {
                        duration: this.GetSpecialValueFor("latch_duration") * (1 - _target.GetStatusResistance())
                    });
                }
            } else {
                this.GetCasterPlus().EmitSound("Hero_Grimstroke.InkCreature.Returned");
                this.EndCooldown();
            }
        } else {
        }
    }
}
@registerModifier()
export class modifier_imba_grimstroke_ink_creature_thinker extends BaseModifier_Plus {
    public destroy_attacks: any;
    public hero_attack_multiplier: any;
    public target: IBaseNpc_Plus;
    public health_increments: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.destroy_attacks = params.destroy_attacks;
        this.hero_attack_multiplier = params.hero_attack_multiplier;
        this.target = EntIndexToHScript(params.target_entindex) as IBaseNpc_Plus;
        this.health_increments = this.GetParentPlus().GetMaxHealth() / this.destroy_attacks;
        if (this.GetAbilityPlus() && this.GetCasterPlus().FindAbilityByName(this.GetAbilityPlus().GetName()).GetAutoCastState()) {
            this.SetStackCount(2);
        } else {
            this.SetStackCount(1);
        }
        let phantoms_embrace_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_grimstroke/grimstroke_phantom_ambient.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(phantoms_embrace_particle, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        this.AddParticle(phantoms_embrace_particle, false, false, -1, false, false);
    }
    GetStatusEffectName(): string {
        if (this.GetStackCount() == 2) {
            return "particles/status_fx/status_effect_dark_willow_wisp_fear.vpcf";
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.target && this.target.FindModifierByNameAndCaster("modifier_imba_grimstroke_ink_creature", this.GetParentPlus())) {
            this.target.RemoveModifierByNameAndCaster("modifier_imba_grimstroke_ink_creature", this.GetParentPlus());
        }
        if (this.target && this.target.FindModifierByNameAndCaster("modifier_imba_grimstroke_ink_creature_vision", this.GetCasterPlus())) {
            this.target.RemoveModifierByNameAndCaster("modifier_imba_grimstroke_ink_creature_vision", this.GetCasterPlus());
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_MAGICAL,
            4: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL,
            5: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE,
            6: Enum_MODIFIER_EVENT.ON_ATTACKED
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        if (this.GetStackCount() == 0) {
            return GameActivity_t.ACT_DOTA_ATTACK;
        } else {
            return GameActivity_t.ACT_DOTA_RUN;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        if (this.GetStackCount() == 0) {
            return "ink_creature_latched";
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_MAGICAL)
    CC_GetAbsoluteNoDamageMagical(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL)
    CC_GetAbsoluteNoDamagePhysical(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE)
    CC_GetAbsoluteNoDamagePure(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACKED)
    CC_OnAttacked(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.target == this.GetParentPlus()) {
            if (keys.attacker.IsRealUnit()) {
                this.GetParentPlus().SetHealth(this.GetParentPlus().GetHealth() - (this.health_increments * this.hero_attack_multiplier));
            } else {
                this.GetParentPlus().SetHealth(this.GetParentPlus().GetHealth() - this.health_increments);
            }
            if (this.GetParentPlus().GetHealth() <= 0) {
                this.GetParentPlus().EmitSound("Hero_Grimstroke.InkCreature.Death");
                this.GetParentPlus().Kill(undefined, keys.attacker);
                this.Destroy();
            }
        }
    }
}
@registerModifier()
export class modifier_imba_grimstroke_ink_creature_vision extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
    CC_GetModifierProvidesFOWVision(): 0 | 1 {
        return 1;
    }
}
@registerModifier()
export class modifier_imba_grimstroke_ink_creature extends BaseModifier_Plus {
    public return_projectile_speed: number;
    public pop_damage: number;
    public damage_type: number;
    public latched_unit_offset: any;
    public ink_unit: IBaseNpc_Plus;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(params: any): void {
        this.return_projectile_speed = this.GetSpecialValueFor("return_projectile_speed");
        this.pop_damage = this.GetSpecialValueFor("pop_damage");
        if (!IsServer()) {
            return;
        }
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        this.latched_unit_offset = params.latched_unit_offset;
        this.ink_unit = EntIndexToHScript(params.ink_unit_entindex) as IBaseNpc_Plus;
        if (this.ink_unit && this.ink_unit.findBuff<modifier_imba_grimstroke_ink_creature_thinker>("modifier_imba_grimstroke_ink_creature_thinker")) {
            this.SetStackCount(this.ink_unit.findBuff<modifier_imba_grimstroke_ink_creature_thinker>("modifier_imba_grimstroke_ink_creature_thinker").GetStackCount());
        }
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (this.ink_unit && this.ink_unit.IsAlive()) {
            if (this.GetParentPlus().IsInvulnerable() || this.GetParentPlus().IsMagicImmune() || this.GetParentPlus().IsOutOfGame()) {
                this.Destroy();
            } else {
                this.ink_unit.SetAbsOrigin(this.GetParentPlus().GetAbsOrigin() + this.GetParentPlus().GetForwardVector() * this.latched_unit_offset as Vector);
                this.ink_unit.SetForwardVector((this.GetParentPlus().GetAbsOrigin() - this.ink_unit.GetAbsOrigin() as Vector).Normalized());
            }
        } else {
            this.StartIntervalThink(-1);
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        let ink_creature_counter = this.GetParentPlus().findBuff<modifier_imba_grimstroke_ink_creature_debuff>("modifier_imba_grimstroke_ink_creature_debuff");
        if (ink_creature_counter) {
            ink_creature_counter.DecrementStackCount();
            if (ink_creature_counter.GetStackCount() == 0) {
                ink_creature_counter.Destroy();
            }
        }
        if (this.ink_unit && this.ink_unit.IsAlive()) {
            this.Return();
        }
        if (this.GetRemainingTime() <= 0) {
            this.GetParentPlus().EmitSound("Hero_Grimstroke.InkCreature.Damage");
            let damageTable: ApplyDamageOptions = {
                victim: this.GetParentPlus(),
                damage: this.pop_damage,
                damage_type: this.damage_type,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus().GetOwner() as IBaseNpc_Plus,
                ability: this.GetAbilityPlus()
            }
            ApplyDamage(damageTable);
        }
    }
    Return() {
        if (this.ink_unit && this.ink_unit.IsAlive() && this.GetCasterPlus().GetOwner()) {
            let projectile: CreateTrackingProjectileOptions = {
                Target: this.GetCasterPlus().GetOwner() as IBaseNpc_Plus,
                Source: this.ink_unit,
                Ability: this.GetAbilityPlus(),
                EffectName: "particles/units/heroes/hero_grimstroke/grimstroke_phantom_return.vpcf",
                iMoveSpeed: this.return_projectile_speed,
                vSourceLoc: this.ink_unit.GetAbsOrigin(),
                bDrawsOnMinimap: false,
                bDodgeable: true,
                bIsAttack: false,
                bVisibleToEnemies: true,
                bReplaceExisting: false,
                flExpireTime: GameRules.GetGameTime() + 10.0,
                bProvidesVision: false,
                ExtraData: {
                    returning: true
                }
            }
            ProjectileManager.CreateTrackingProjectile(projectile);
            this.ink_unit.ForceKill(false);
            this.ink_unit.AddNoDraw();
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state: Partial<Record<modifierstate, boolean>> = {}
        if (this.GetStackCount() == 1) {
            state[modifierstate.MODIFIER_STATE_SILENCED] = true;
        } else {
            state[modifierstate.MODIFIER_STATE_MUTED] = true;
        }
        return state;
    }
}
@registerModifier()
export class modifier_imba_grimstroke_ink_creature_debuff extends BaseModifier_Plus {
    public damage_per_tick: number;
    public tick_interval: number;
    public damage_type: number;
    Init(params: any): void {
        this.damage_per_tick = this.GetSpecialValueFor("damage_per_tick");
        this.tick_interval = this.GetSpecialValueFor("tick_interval");
        if (!IsServer()) {
            return;
        }
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        this.IncrementStackCount();
        this.StartIntervalThink(this.tick_interval * (1 - this.GetParentPlus().GetStatusResistance()));
    }

    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().EmitSound("Hero_Grimstroke.InkCreature.Attack");
        let damageTable: ApplyDamageOptions = {
            victim: this.GetParentPlus(),
            damage: this.damage_per_tick * this.GetStackCount(),
            damage_type: this.damage_type,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.GetCasterPlus().GetOwner() as IBaseNpc_Plus,
            ability: this.GetAbilityPlus()
        }
        ApplyDamage(damageTable);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        let vision_modifier = this.GetParentPlus().FindModifierByNameAndCaster("modifier_imba_grimstroke_ink_creature_vision", this.GetCasterPlus());
        if (vision_modifier) {
            vision_modifier.Destroy();
        }
    }
}
@registerAbility()
export class imba_grimstroke_spirit_walk extends BaseAbility_Plus {
    public responses_target: { [k: string]: number };
    public responses_self: { [k: string]: number };;
    CastFilterResultTarget(_target: CDOTA_BaseNPC): UnitFilterResult {
        if (_target.HasModifier("modifier_imba_grimstroke_ink_gods_incarnation")) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        }
        return UnitFilter(_target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, this.GetCasterPlus().GetTeamNumber());
    }
    GetCustomCastErrorTarget(_target: CDOTA_BaseNPC): string {
        if (_target.HasModifier("modifier_imba_grimstroke_ink_gods_incarnation")) {
            return "#dota_hud_error_target_has_ink_gods_incarnation";
        }
    }
    OnSpellStart(): void {
        let _target = this.GetCursorTarget();
        if (_target.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber() && _target.TriggerSpellAbsorb(this)) {
            return;
        }
        this.GetCasterPlus().EmitSound("Hero_Grimstroke.InkSwell.Cast");
        let ink_swell_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_grimstroke/grimstroke_cast_ink_swell.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(ink_swell_particle, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(ink_swell_particle);
        if (this.GetCasterPlus().GetName().includes("grimstroke") && RollPercentage(50)) {
            if (!this.responses_target || !this.responses_self) {
                this.responses_target = {
                    ["grimstroke_grimstroke_ability2_01"]: 0,
                    ["grimstroke_grimstroke_ability2_02"]: 0,
                    ["grimstroke_grimstroke_ability2_04"]: 0,
                    ["grimstroke_grimstroke_ability2_06"]: 0,
                    ["grimstroke_grimstroke_ability2_07"]: 0,
                    ["grimstroke_grimstroke_ability2_11"]: 0,
                    ["grimstroke_grimstroke_ability3_03"]: 0,
                    ["grimstroke_grimstroke_ability2_08"]: 0
                }
                this.responses_self = {
                    ["grimstroke_grimstroke_ability2_01"]: 0,
                    ["grimstroke_grimstroke_ability2_02"]: 0,
                    ["grimstroke_grimstroke_ability2_04"]: 0,
                    ["grimstroke_grimstroke_ability2_06"]: 0,
                    ["grimstroke_grimstroke_ability2_07"]: 0,
                    ["grimstroke_grimstroke_ability2_11"]: 0,
                    ["grimstroke_grimstroke_ability3_03"]: 0,
                    ["grimstroke_grimstroke_ability2_03"]: 0,
                    ["grimstroke_grimstroke_ability2_09"]: 0,
                    ["grimstroke_grimstroke_ability2_10"]: 0
                }
            }
            if (_target != this.GetCasterPlus()) {
                for (const response in (this.responses_target)) {
                    const timer = this.responses_target[response];
                    if (GameRules.GetDOTATime(true, true) - timer >= 120) {
                        this.GetCasterPlus().EmitSound(response);
                        this.responses_target[response] = GameRules.GetDOTATime(true, true);
                        return;
                    }
                }
            } else {
                for (const response in (this.responses_self)) {
                    const timer = this.responses_self[response];
                    if (GameRules.GetDOTATime(true, true) - timer >= 120) {
                        this.GetCasterPlus().EmitSound(response);
                        this.responses_self[response] = GameRules.GetDOTATime(true, true);
                        return;
                    }
                }
            }
        }
        _target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_grimstroke_spirit_walk_buff", {
            duration: this.GetSpecialValueFor("buff_duration")
        });
    }
}
@registerModifier()
export class modifier_imba_grimstroke_spirit_walk_buff extends BaseModifier_Plus {
    public buff_duration: number;
    public movespeed_bonus_pct: number;
    public radius: number;
    public max_damage: number;
    public max_stun: any;
    public damage_per_tick: number;
    public tick_rate: any;
    public coat_of_armor_amount: number;
    public counter: number;
    public ticks: any;
    public total_ticks: any;
    IgnoreTenacity() {
        return true;
    }
    GetStatusEffectName(): string {
        if (!this.GetCasterPlus().HasModifier("modifier_imba_grimstroke_ink_gods_incarnation")) {
            return "particles/status_fx/status_effect_grimstroke_ink_swell.vpcf";
        }
    }
    BeCreated(p_0: any,): void {
        this.buff_duration = this.GetSpecialValueFor("buff_duration");
        this.movespeed_bonus_pct = this.GetSpecialValueFor("movespeed_bonus_pct");
        this.radius = this.GetAbilityPlus().GetTalentSpecialValueFor("radius");
        this.max_damage = this.GetAbilityPlus().GetTalentSpecialValueFor("max_damage");
        this.max_stun = this.GetSpecialValueFor("max_stun");
        this.damage_per_tick = this.GetSpecialValueFor("damage_per_tick");
        this.tick_rate = this.GetSpecialValueFor("tick_rate");
        this.coat_of_armor_amount = this.GetSpecialValueFor("coat_of_armor_amount");
        if (!IsServer()) {
            return;
        }
        this.counter = 0;
        this.ticks = 0;
        this.total_ticks = this.buff_duration / this.tick_rate;
        let ink_swell_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_grimstroke/grimstroke_ink_swell_buff.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(ink_swell_particle, 2, Vector(this.radius, this.radius, this.radius));
        ParticleManager.SetParticleControlEnt(ink_swell_particle, 3, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, undefined, this.GetParentPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(ink_swell_particle, 6, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", this.GetCasterPlus().GetAbsOrigin(), true);
        this.AddParticle(ink_swell_particle, false, false, -1, false, false);
        this.OnIntervalThink();
        this.StartIntervalThink(this.tick_rate);
    }
    BeRefresh(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.ticks = 0;
    }
    OnIntervalThink(): void {
        if (!IsServer() || this.ticks >= this.total_ticks) {
            return;
        }
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (this.GetParentPlus() != enemy) {
                enemy.EmitSound("Hero_Grimstroke.InkSwell.Damage");
                let ink_swell_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_grimstroke/grimstroke_ink_swell_tick_damage.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
                ParticleManager.SetParticleControl(ink_swell_particle, 1, enemy.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(ink_swell_particle);
                let damageTable = {
                    victim: enemy,
                    damage: this.damage_per_tick,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this.GetAbilityPlus()
                }
                ApplyDamage(damageTable);
            }
        }
        if (GameFunc.GetCount(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, FindOrder.FIND_ANY_ORDER, false)) >= 1 || (this.GetParentPlus().FindModifierByNameAndCaster("modifier_imba_grimstroke_ink_gods_incarnation", this.GetCasterPlus()) && GameFunc.GetCount(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false)) >= 1)) {
            this.counter = math.min(this.counter + 1, this.total_ticks);
        }
        this.ticks = this.ticks + 1;
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().EmitSound("Hero_Grimstroke.InkSwell.Stun");
        let ink_swell_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_grimstroke/grimstroke_ink_swell_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(ink_swell_particle, 2, Vector(this.radius, this.radius, this.radius));
        ParticleManager.ReleaseParticleIndex(ink_swell_particle);
        if (GameFunc.GetCount(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false)) >= 1 || this.GetParentPlus().FindModifierByNameAndCaster("modifier_imba_grimstroke_ink_gods_incarnation", this.GetCasterPlus())) {
            let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            let ink_gods_incarnation_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_grimstroke_ink_gods_incarnation", this.GetCasterPlus()) as modifier_imba_grimstroke_ink_gods_incarnation;
            let stunned_table: IBaseNpc_Plus[] = []
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (this.GetParentPlus() != enemy) {
                    enemy.EmitSound("Hero_Grimstroke.InkSwell.Target");
                    let damageTable = {
                        victim: enemy,
                        damage: (this.max_damage / this.total_ticks) * this.counter,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                        attacker: this.GetCasterPlus(),
                        ability: this.GetAbilityPlus()
                    }
                    ApplyDamage(damageTable);
                    if (!ink_gods_incarnation_modifier || (ink_gods_incarnation_modifier && ink_gods_incarnation_modifier.stunned && !ink_gods_incarnation_modifier.stunned.includes(enemy))) {
                        enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_grimstroke_spirit_walk_debuff", {
                            duration: ((this.max_stun / this.total_ticks) * this.counter) * (1 - enemy.GetStatusResistance())
                        });
                        stunned_table.push(enemy);
                    }
                }
            }
            if (ink_gods_incarnation_modifier) {
                ink_gods_incarnation_modifier.stunned = stunned_table;
            }
            stunned_table = []
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state: Partial<Record<modifierstate, boolean>> = {}
        if (this.GetParentPlus().GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            state[modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY] = true;
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.GetParentPlus().GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            return this.movespeed_bonus_pct;
        } else {
            return this.movespeed_bonus_pct * (-1);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        if (this.GetParentPlus().GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            return this.coat_of_armor_amount;
        } else {
            return this.coat_of_armor_amount * (-1);
        }
    }
}
@registerModifier()
export class modifier_imba_grimstroke_spirit_walk_debuff extends BaseModifier_Plus {
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
        return GameActivity_t.ACT_DOTA_DISABLED;
    }
}
@registerAbility()
export class imba_grimstroke_ink_gods_incarnation extends BaseAbility_Plus {
    OnHeroLevelUp(): void {
        this.SetLevel(math.min(math.floor(this.GetCasterPlus().GetLevel() / 6), 3));
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_Grimstroke.Stinger");
        let ink_swell_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_grimstroke/grimstroke_ink_swell_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControl(ink_swell_particle, 2, Vector(250, 250, 250));
        ParticleManager.ReleaseParticleIndex(ink_swell_particle);
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_grimstroke_ink_gods_incarnation", {
            duration: this.GetSpecialValueFor("duration")
        });
    }
}
@registerModifier()
export class modifier_imba_grimstroke_ink_gods_incarnation extends BaseModifier_Plus {
    public ink_swell_ability: any;
    public ink_swell_ability_duration: number;
    public ink_swell_modifier: any;
    public stunned: IBaseNpc_Plus[];
    IsPurgable(): boolean {
        return false;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_phantom_assassin_active_blur.vpcf";
    }
    Init(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.ink_swell_ability = this.GetCasterPlus().findAbliityPlus<imba_grimstroke_spirit_walk>("imba_grimstroke_spirit_walk");
        if (this.ink_swell_ability && this.ink_swell_ability.IsTrained()) {
            this.ink_swell_ability_duration = this.ink_swell_ability.GetSpecialValueFor("buff_duration");
            this.ink_swell_modifier = this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.ink_swell_ability, "modifier_imba_grimstroke_spirit_walk_buff", {
                duration: this.ink_swell_ability.GetSpecialValueFor("buff_duration")
            });
            this.stunned = []
            this.StartIntervalThink(this.ink_swell_ability_duration);
        }
    }

    OnIntervalThink(): void {
        if (!IsServer() || this.GetRemainingTime() <= 0.1) {
            return;
        }
        if (this.ink_swell_modifier) {
            this.ink_swell_modifier.Destroy();
        }
        this.ink_swell_modifier = this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.ink_swell_ability, "modifier_imba_grimstroke_spirit_walk_buff", {
            duration: this.ink_swell_ability.GetSpecialValueFor("buff_duration")
        });
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().StopSound("Hero_Grimstroke.Stinger");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE)
    CC_GetModifierModelScale(): number {
        return 30;
    }
}
@registerAbility()
export class imba_grimstroke_soul_chain_vanilla_enhancer extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_grimstroke_soul_chain_vanilla_enhancer";
    }
    OnHeroLevelUp(): void {
        this.SetLevel(math.min(math.floor(this.GetCasterPlus().GetLevel() / 6), 3));
    }
}
@registerModifier()
export class modifier_imba_grimstroke_soul_chain_vanilla_enhancer extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_MODIFIER_ADDED
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_MODIFIER_ADDED)
    CC_OnModifierAdded(keys: ModifierAddedEvent): void {
        if (keys.unit.FindModifierByNameAndCaster("modifier_grimstroke_soul_chain", this.GetCasterPlus()) && !keys.unit.FindModifierByNameAndCaster("modifier_imba_grimstroke_soul_chain_vanilla_enhancer_slow", this.GetCasterPlus()) && keys.unit.FindModifierByNameAndCaster("modifier_grimstroke_soul_chain", this.GetCasterPlus()).GetElapsedTime() <= FrameTime()) {
            let soulbind_modifier = keys.unit.FindModifierByNameAndCaster("modifier_grimstroke_soul_chain", this.GetCasterPlus());
            if (keys.unit == soulbind_modifier.GetAbility().GetCursorTarget()) {
                soulbind_modifier.SetDuration(soulbind_modifier.GetAbility().GetSpecialValueFor("chain_duration"), true);
            }
            keys.unit.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_grimstroke_soul_chain_vanilla_enhancer_slow", {
                duration: soulbind_modifier.GetRemainingTime()
            });
        }
    }
}
@registerModifier()
export class modifier_imba_grimstroke_soul_chain_vanilla_enhancer_slow extends BaseModifier_Plus {
    public movement_slow: any;
    IgnoreTenacity() {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetTexture(): string {
        return "grimstroke_soul_chain";
    }
    BeCreated(p_0: any,): void {
        this.movement_slow = this.GetSpecialValueFor("movement_slow");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.movement_slow * (-1);
    }
}
@registerModifier()
export class modifier_special_bonus_imba_grimstroke_ink_swell_max_damage extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_grimstroke_phantoms_embrace_extra_hits extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_grimstroke_ink_swell_radius extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_grimstroke_stroke_of_fate_damage extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_grimstroke_stroke_of_fate_cast_range extends BaseModifier_Plus {
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
