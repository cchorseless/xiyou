
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_phantom_lancer_spirit_lance extends BaseAbility_Plus {
    public responses: any;
    public spawn_particle: any;
    GetIntrinsicModifierName(): string {
        return "modifier_imba_phantom_lancer_spirit_lance_handler";
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_phantom_lancer_spirit_lance_handler", this.GetCasterPlus()) == 0) {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, this.GetCasterPlus().GetTeamNumber());
        } else if (target != this.GetCasterPlus()) {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, this.GetCasterPlus().GetTeamNumber());
        } else {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        }
    }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        if (target == this.GetCasterPlus()) {
            return "#dota_hud_error_cant_cast_on_self";
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (!target || (target && !target.HasModifier("modifier_imba_phantom_lancer_sun_catcher_aura"))) {
            return super.GetCastRange(location, target);
        } else {
            return 0;
        }
    }
    OnAbilityPhaseStart(): boolean {
        for (const [_, unit] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("fake_lance_distance"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_ANY_ORDER, false))) {
            if (unit.GetPlayerOwnerID() == this.GetCasterPlus().GetPlayerOwnerID() && unit != this.GetCasterPlus()) {
                unit.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_1);
                if (unit.IsIdle()) {
                    unit.FaceTowards(this.GetCursorTarget().GetAbsOrigin());
                }
            }
        }
        return true;
    }
    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        this.GetCasterPlus().EmitSound("Hero_PhantomLancer.SpiritLance.Throw");
        if (this.GetCasterPlus().GetName().includes("phantom_lancer")) {
            if (!this.responses) {
                this.responses = {
                    "1": "phantom_lancer_plance_ability_spiritlance_01",
                    "2": "phantom_lancer_plance_ability_spiritlance_03",
                    "3": "phantom_lancer_plance_ability_spiritlance_05",
                    "4": "phantom_lancer_plance_ability_spiritlance_06",
                    "5": "phantom_lancer_plance_ability_spiritlance_08"
                }
            }
            this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(this.responses));
        }
        let lance_speed = this.GetSpecialValueFor("lance_speed");
        if (target.HasModifier("modifier_imba_phantom_lancer_sun_catcher_aura")) {
            lance_speed = this.GetSpecialValueFor("sun_catcher_lance_speed");
        }
        ProjectileManager.CreateTrackingProjectile({
            Target: target,
            Source: this.GetCasterPlus(),
            Ability: this,
            EffectName: "particles/units/heroes/hero_phantom_lancer/phantomlancer_spiritlance_projectile.vpcf",
            iMoveSpeed: lance_speed,
            bDodgeable: true,
            bVisibleToEnemies: true,
            bReplaceExisting: false,
            bProvidesVision: false
        });
        for (const [_, unit] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("fake_lance_distance"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_ANY_ORDER, false))) {
            if (unit.GetPlayerOwnerID() == this.GetCasterPlus().GetPlayerOwnerID() && unit != this.GetCasterPlus() && unit.IsIllusion()) {
                ProjectileManager.CreateTrackingProjectile({
                    Target: target,
                    Source: unit,
                    Ability: unit.findAbliityPlus<imba_phantom_lancer_spirit_lance>("imba_phantom_lancer_spirit_lance"),
                    EffectName: "particles/units/heroes/hero_phantom_lancer/phantomlancer_spiritlance_projectile.vpcf",
                    iMoveSpeed: lance_speed * ((unit.GetAbsOrigin() - target.GetAbsOrigin() as Vector).Length2D() / (this.GetCasterPlus().GetAbsOrigin() - target.GetAbsOrigin() as Vector).Length2D()),
                    bDodgeable: true,
                    bVisibleToEnemies: true,
                    bReplaceExisting: false,
                    bProvidesVision: false
                });
            }
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, extradata: any): boolean | void {
        if (!target || (target.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber() && target.IsMagicImmune())) {
            return undefined;
        }
        if (target.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
            if (!this.GetCasterPlus().IsIllusion()) {
                EmitSoundOn("Hero_PhantomLancer.SpiritLance.Impact", target);
                if (this.GetCasterPlus().GetTeamNumber() != target.GetTeamNumber()) {
                    if (target.TriggerSpellAbsorb(this)) {
                        return undefined;
                    }
                }
                target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_phantom_lancer_spirit_lance", {
                    duration: this.GetSpecialValueFor("duration") * (1 - target.GetStatusResistance())
                });
                ApplyDamage({
                    victim: target,
                    damage: this.GetTalentSpecialValueFor("lance_damage"),
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this
                });
                let illusions = this.GetCasterPlus().CreateIllusion(this.GetCasterPlus(), {
                    outgoing_damage: this.GetSpecialValueFor("illusion_damage_out_pct"),
                    incoming_damage: this.GetSpecialValueFor("illusion_damage_in_pct"),
                    bounty_base: 5,
                    bounty_growth: undefined,
                    outgoing_damage_structure: undefined,
                    outgoing_damage_roshan: undefined,
                    duration: this.GetSpecialValueFor("illusion_duration")
                });
                for (const [_, illusion] of GameFunc.iPair(illusions)) {
                    this.spawn_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_phantom_lancer/phantom_lancer_spawn_illusion.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, illusion);
                    ParticleManager.SetParticleControlEnt(this.spawn_particle, 0, illusion, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", illusion.GetAbsOrigin(), true);
                    ParticleManager.SetParticleControlEnt(this.spawn_particle, 1, illusion, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", illusion.GetAbsOrigin(), true);
                    ParticleManager.ReleaseParticleIndex(this.spawn_particle);
                    illusion.AddNewModifier(this.GetCasterPlus(), this, "modifier_phantom_lancer_juxtapose_illusion", {});
                    FindClearSpaceForUnit(illusion, target.GetAbsOrigin() + RandomVector(58) as Vector, true);
                }
            } else if (this.GetCasterPlus().IsAlive()) {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_phantom_lancer_spirit_lance_phantom_pain", {});
                this.GetCasterPlus().PerformAttack(target, false, true, true, false, false, false, true);
                this.GetCasterPlus().RemoveModifierByName("modifier_imba_phantom_lancer_spirit_lance_phantom_pain");
            }
        } else {
            if (!this.GetCasterPlus().IsIllusion()) {
                let illusion_type = target;
                if (!target.IsRealUnit()) {
                    illusion_type = this.GetCasterPlus();
                }
                let illusions = this.GetCasterPlus().CreateIllusion(illusion_type, {
                    outgoing_damage: this.GetSpecialValueFor("illusion_damage_out_pct"),
                    incoming_damage: this.GetSpecialValueFor("illusion_damage_in_pct"),
                    bounty_base: 5,
                    bounty_growth: undefined,
                    outgoing_damage_structure: undefined,
                    outgoing_damage_roshan: undefined,
                    duration: this.GetSpecialValueFor("illusion_duration") + this.GetSpecialValueFor("illusory_heart_bonus_duration")
                });
                for (const [_, illusion] of GameFunc.iPair(illusions)) {
                    this.spawn_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_phantom_lancer/phantom_lancer_spawn_illusion.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, illusion);
                    ParticleManager.SetParticleControlEnt(this.spawn_particle, 0, illusion, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", illusion.GetAbsOrigin(), true);
                    ParticleManager.SetParticleControlEnt(this.spawn_particle, 1, illusion, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", illusion.GetAbsOrigin(), true);
                    ParticleManager.ReleaseParticleIndex(this.spawn_particle);
                    illusion.AddNewModifier(this.GetCasterPlus(), this, "modifier_phantom_lancer_juxtapose_illusion", {});
                    FindClearSpaceForUnit(illusion, target.GetAbsOrigin() + RandomVector(58) as Vector, true);
                }
            }
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_phantom_lancer_spirit_lance_damage") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_phantom_lancer_spirit_lance_damage")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_phantom_lancer_spirit_lance_damage"), "modifier_special_bonus_imba_phantom_lancer_spirit_lance_damage", {});
        }
    }
}
@registerModifier()
export class modifier_imba_phantom_lancer_spirit_lance_handler extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
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
            this.SetStackCount(0);
        } else {
            this.SetStackCount(1);
        }
    }
}
@registerModifier()
export class modifier_imba_phantom_lancer_spirit_lance extends BaseModifier_Plus {
    public movement_speed_pct: number;
    GetEffectName(): string {
        return "particles/units/heroes/hero_phantom_lancer/phantomlancer_spiritlance_target.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_phantoml_slowlance.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.movement_speed_pct = this.GetSpecialValueFor("movement_speed_pct");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.movement_speed_pct;
    }
}
@registerModifier()
export class modifier_imba_phantom_lancer_spirit_lance_phantom_pain extends BaseModifier_Plus {
    public phantom_pain_damage_pct: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.phantom_pain_damage_pct = this.GetSpecialValueFor("phantom_pain_damage_pct") * (-1);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.phantom_pain_damage_pct;
    }
}
@registerModifier()
export class modifier_imba_phantom_lancer_illusion extends BaseModifier_Plus {
}
@registerAbility()
export class imba_phantom_lancer_doppelwalk extends BaseAbility_Plus {
    public rare_responses: any;
    public responses: any;
    public first_unit: any;
    public new_pos: any;
    public illusion_1: IBaseNpc_Plus;
    public illusion_2: IBaseNpc_Plus;
    public illusion_3: IBaseNpc_Plus;
    GetCooldown(level: number): number {
        return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_phantom_lancer_doppelwalk_cooldown");
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("target_aoe");
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_PhantomLancer.Doppelganger.Cast");
        let doppleganger_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_phantom_lancer/phantom_lancer_doppleganger_aoe.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(doppleganger_particle, 0, this.GetCasterPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(doppleganger_particle, 2, Vector(this.GetSpecialValueFor("target_aoe"), this.GetSpecialValueFor("target_aoe"), this.GetSpecialValueFor("target_aoe")));
        ParticleManager.SetParticleControl(doppleganger_particle, 3, Vector(this.GetSpecialValueFor("delay"), 0, 0));
        ParticleManager.ReleaseParticleIndex(doppleganger_particle);
        if (this.GetCasterPlus().GetName().includes("phantom_lancer")) {
            if (RollPercentage(5)) {
                if (!this.rare_responses) {
                    this.rare_responses = {
                        "1": "phantom_lancer_plance_ability_dopplewalk_01",
                        "2": "phantom_lancer_plance_ability_dopplewalk_06"
                    }
                }
                this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(this.rare_responses));
            } else {
                if (!this.responses) {
                    this.responses = {
                        "1": "phantom_lancer_plance_ability_dopplewalk_02",
                        "2": "phantom_lancer_plance_ability_dopplewalk_04",
                        "3": "phantom_lancer_plance_ability_dopplewalk_05",
                        "4": "phantom_lancer_plance_ability_juxtapose_02"
                    }
                }
                this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(this.responses));
            }
        }
        this.first_unit = undefined;
        this.new_pos = undefined;
        let affected_units = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("search_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_ANY_ORDER, false);
        if (!this.illusion_1 || this.illusion_1.IsNull() || !this.illusion_1.IsAlive()) {
            this.illusion_1 = this.GetCasterPlus().CreateIllusion(this.GetCasterPlus(), {
                outgoing_damage: this.GetSpecialValueFor("illusion_1_damage_out_pct"),
                incoming_damage: this.GetSpecialValueFor("illusion_1_damage_in_pct"),
                bounty_base: 5,
                bounty_growth: undefined,
                outgoing_damage_structure: undefined,
                outgoing_damage_roshan: undefined,
                duration: this.GetSpecialValueFor("illusion_duration") + this.GetSpecialValueFor("delay")
            })[0];
            this.illusion_1.AddNewModifier(this.GetCasterPlus(), this, "modifier_phantom_lancer_doppelwalk_illusion", {});
            this.illusion_1.AddNewModifier(this.GetCasterPlus(), this, "modifier_phantom_lancer_juxtapose_illusion", {});
        } else {
            this.illusion_1.SetHealth(this.GetCasterPlus().GetHealth());
            this.illusion_1.findBuff("modifier_illusion").SetDuration(this.GetSpecialValueFor("illusion_duration") + this.GetSpecialValueFor("delay"), true);
        }
        affected_units.push(this.illusion_1);
        if (!this.illusion_2 || this.illusion_2.IsNull() || !this.illusion_2.IsAlive()) {
            this.illusion_2 = this.GetCasterPlus().CreateIllusion(this.GetCasterPlus(), {
                outgoing_damage: this.GetSpecialValueFor("illusion_2_damage_out_pct"),
                incoming_damage: this.GetSpecialValueFor("illusion_2_damage_in_pct"),
                bounty_base: 5,
                bounty_growth: undefined,
                outgoing_damage_structure: undefined,
                outgoing_damage_roshan: undefined,
                duration: this.GetSpecialValueFor("illusion_duration") + this.GetSpecialValueFor("delay")
            })[0];
            this.illusion_2.AddNewModifier(this.GetCasterPlus(), this, "modifier_phantom_lancer_doppelwalk_illusion", {});
            this.illusion_2.AddNewModifier(this.GetCasterPlus(), this, "modifier_phantom_lancer_juxtapose_illusion", {});
        } else {
            this.illusion_2.SetHealth(this.GetCasterPlus().GetHealth());
            this.illusion_2.findBuff("modifier_illusion").SetDuration(this.GetSpecialValueFor("illusion_duration") + this.GetSpecialValueFor("delay"), true);
        }
        affected_units.push(this.illusion_2);
        if (this.illusion_3 && !this.illusion_3.IsNull() && this.illusion_3.IsAlive()) {
            this.illusion_3.ForceKill(false);
        }
        for (const [_, unit] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCursorPosition(), undefined, this.GetSpecialValueFor("search_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_CLOSEST, false))) {
            if (unit.GetName() != this.GetCasterPlus().GetName() && (unit.IsRealUnit() || unit.IsClone() || unit.IsTempestDouble() || unit.IsIllusion())) {
                this.illusion_3 = this.GetCasterPlus().CreateIllusion(unit, {
                    outgoing_damage: -100,
                    incoming_damage: 0,
                    bounty_base: 5,
                    bounty_growth: undefined,
                    outgoing_damage_structure: undefined,
                    outgoing_damage_roshan: undefined,
                    duration: this.GetSpecialValueFor("illusion_duration") + this.GetSpecialValueFor("delay")
                })[0];
                if (this.illusion_3) {
                    this.illusion_3.AddNewModifier(this.GetCasterPlus(), this, "modifier_phantom_lancer_doppelwalk_illusion", {});
                    this.illusion_3.AddNewModifier(this.GetCasterPlus(), this, "modifier_phantom_lancer_juxtapose_illusion", {});
                }
                return;
            }
        }
        affected_units.push(this.illusion_3);
        for (const [_, unit] of GameFunc.iPair(affected_units)) {
            if (unit.GetPlayerOwnerID() == this.GetCasterPlus().GetPlayerOwnerID() && (unit == this.GetCasterPlus() || unit.IsIllusion())) {
                unit.Purge(false, true, false, false, false);
                ProjectileManager.ProjectileDodge(unit);
                if (!this.first_unit) {
                    this.first_unit = unit.entindex();
                    this.new_pos = this.GetCursorPosition();
                } else {
                    if (RollPercentage(50)) {
                        this.new_pos = this.GetCursorPosition() + Vector(RandomInt(-this.GetSpecialValueFor("target_aoe"), this.GetSpecialValueFor("target_aoe")), 0, 0);
                    } else {
                        this.new_pos = this.GetCursorPosition() + Vector(0, RandomInt(-this.GetSpecialValueFor("target_aoe"), this.GetSpecialValueFor("target_aoe")), 0);
                    }
                }
                unit.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_phantom_lancer_doppelwalk_phase", {
                    duration: this.GetSpecialValueFor("delay"),
                    pos_x: this.GetCursorPosition().x,
                    pos_y: this.GetCursorPosition().y,
                    pos_z: this.GetCursorPosition().z,
                    new_pos_x: this.new_pos.x,
                    new_pos_y: this.new_pos.y,
                    new_pos_z: this.new_pos.z
                });
            }
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_phantom_lancer_doppelwalk_cooldown") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_phantom_lancer_doppelwalk_cooldown")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_phantom_lancer_doppelwalk_cooldown"), "modifier_special_bonus_imba_phantom_lancer_doppelwalk_cooldown", {});
        }
    }
}
@registerModifier()
export class modifier_imba_phantom_lancer_doppelwalk_phase extends BaseModifier_Plus {
    public new_pos: any;
    public spawn_particle: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(keys: any): void {
        if (!IsServer()) {
            return;
        }
        this.new_pos = Vector(keys.new_pos_x, keys.new_pos_y, keys.new_pos_z);
        this.GetParentPlus().AddNoDraw();
        let doppleganger_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_phantom_lancer/phantom_lancer_doppleganger_illlmove.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
        ParticleManager.SetParticleControl(doppleganger_particle, 0, this.GetParentPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(doppleganger_particle, 1, this.new_pos);
        this.AddParticle(doppleganger_particle, false, false, -1, false, false);
        if (this.GetParentPlus().IsIllusion() && this.GetParentPlus().HasModifier("modifier_illusion")) {
            this.GetParentPlus().findBuff("modifier_illusion").SetDuration(this.GetParentPlus().FindModifierByName("modifier_illusion").GetRemainingTime() + this.GetSpecialValueFor("illusion_extended_duration"), true);
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().EmitSound("Hero_PhantomLancer.Doppelganger.Appear");
        this.GetParentPlus().RemoveNoDraw();
        if (this.GetParentPlus().IsAlive()) {
            FindClearSpaceForUnit(this.GetParentPlus(), this.new_pos, true);
            GridNav.DestroyTreesAroundPoint(this.new_pos, 200, false);
        }
        this.spawn_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_phantom_lancer/phantom_lancer_spawn_illusion.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(this.spawn_particle, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(this.spawn_particle, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(this.spawn_particle);
        // PlayerResource.AddToSelection(this.GetCasterPlus().GetPlayerID(), this.GetParentPlus());
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
    }
}
@registerAbility()
export class imba_phantom_lancer_phantom_edge extends BaseAbility_Plus {
    public toggle_state: any;
    IsStealable(): boolean {
        return false;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_phantom_lancer_phantom_edge";
    }
    OnToggle(): void {
        if (this.GetToggleState()) {
            this.EndCooldown();
        }
    }

    OnOwnerDied(): void {
        this.toggle_state = this.GetToggleState();
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_phantom_lancer_phantom_edge_distance") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_phantom_lancer_phantom_edge_distance")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_phantom_lancer_phantom_edge_distance"), "modifier_special_bonus_imba_phantom_lancer_phantom_edge_distance", {});
        }
    }
}
@registerModifier()
export class modifier_imba_phantom_lancer_phantom_edge extends BaseModifier_Plus {
    public rush_modifier: any;
    public bRushChecking: any;
    public target: IBaseNpc_Plus;
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
        this.StartIntervalThink(0.1);
    }
    OnIntervalThink(): void {
        if (this.bRushChecking && this.GetParentPlus().GetAggroTarget() == this.target && ((this.target.GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).Length2D() <= this.GetAbilityPlus().GetTalentSpecialValueFor("max_distance") || this.target.HasModifier("modifier_imba_phantom_lancer_sun_catcher_aura")) && ((this.target.GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).Length2D() >= this.GetAbilityPlus().GetTalentSpecialValueFor("min_distance") || this.GetCasterPlus().HasScepter())) {
            this.GetParentPlus().EmitSound("Hero_PhantomLancer.PhantomEdge");
            this.rush_modifier = this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_phantom_lancer_phantom_edge_boost", {
                duration: 5
            });
            if (this.rush_modifier) {
                this.rush_modifier.SetStackCount(-this.target.entindex());
            }
            this.GetAbilityPlus().UseResources(true, false, true);
            this.bRushChecking = false;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ORDER,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_RECORD
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierAbilityEvent): void {
        if (keys.unit == this.GetParentPlus() && this.GetAbilityPlus() && !this.GetAbilityPlus().GetToggleState() && (this.GetAbilityPlus().IsCooldownReady() || this.GetCasterPlus().HasScepter()) && !this.GetParentPlus().PassivesDisabled() && keys.target) {
            if (keys.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET) {
                if (((keys.target.GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).Length2D() <= this.GetAbilityPlus().GetTalentSpecialValueFor("max_distance") || keys.target.HasModifier("modifier_imba_phantom_lancer_sun_catcher_aura")) && ((keys.target.GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).Length2D() >= this.GetAbilityPlus().GetTalentSpecialValueFor("min_distance") || this.GetCasterPlus().HasScepter())) {
                    this.GetParentPlus().EmitSound("Hero_PhantomLancer.PhantomEdge");
                    if (this.GetAbilityPlus().IsCooldownReady()) {
                        this.rush_modifier = this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_phantom_lancer_phantom_edge_boost", {
                            duration: 5,
                            bAgility: true
                        });
                        this.GetAbilityPlus().UseResources(true, false, true);
                    } else {
                        this.rush_modifier = this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_phantom_lancer_phantom_edge_boost", {
                            duration: 5,
                            bAgility: false
                        });
                    }
                    if (this.rush_modifier) {
                        this.rush_modifier.SetStackCount(-keys.target.entindex());
                    }
                } else {
                    this.target = keys.target;
                    this.bRushChecking = true;
                }
            } else {
                this.target = undefined;
                this.bRushChecking = false;
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    CC_OnAttackRecord(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && this.GetAbilityPlus() && !this.GetAbilityPlus().GetToggleState() && this.GetAbilityPlus().IsCooldownReady() && this.GetParentPlus().HasScepter() && !keys.no_attack_cooldown && !this.GetParentPlus().PassivesDisabled()) {
            if (!this.GetParentPlus().HasModifier("modifier_imba_phantom_lancer_phantom_edge_boost")) {
                this.GetParentPlus().EmitSound("Hero_PhantomLancer.PhantomEdge");
                this.rush_modifier = this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_phantom_lancer_phantom_edge_boost", {
                    duration: 5,
                    bAgility: true
                });
                if (this.rush_modifier) {
                    this.rush_modifier.SetStackCount(-keys.target.entindex());
                }
                this.GetAbilityPlus().UseResources(true, false, true);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_phantom_lancer_phantom_edge_boost extends BaseModifier_Plus {
    public bonus_speed: number;
    public bonus_agility: number;
    public agility_duration: number;
    public mob_mentality_radius: number;
    public mob_mentality_additional_agility: any;
    public sun_catcher_bonus_speed: number;
    public bAgility: 0 | 1;
    public destroy_orders: any;
    public target: IBaseNpc_Plus;
    bFading: boolean;
    GetEffectName(): string {
        return "particles/units/heroes/hero_phantom_lancer/phantomlancer_edge_boost.vpcf";
    }
    BeCreated(keys: any): void {
        this.bonus_speed = this.GetSpecialValueFor("bonus_speed");
        this.bonus_agility = this.GetSpecialValueFor("bonus_agility");
        this.agility_duration = this.GetSpecialValueFor("agility_duration");
        this.mob_mentality_radius = this.GetSpecialValueFor("mob_mentality_radius");
        this.mob_mentality_additional_agility = this.GetSpecialValueFor("mob_mentality_additional_agility");
        this.sun_catcher_bonus_speed = this.GetSpecialValueFor("sun_catcher_bonus_speed");
        this.StartIntervalThink(FrameTime());
        if (!IsServer()) {
            return;
        }
        this.bAgility = keys.bAgility;
        this.destroy_orders = {
            [dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_STOP]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CONTINUE]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_HOLD_POSITION]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_DROP_ITEM]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_GIVE_ITEM]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_ITEM]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_RUNE]: true
        }
    }
    OnIntervalThink(): void {
        this.target = EntIndexToHScript(-this.GetStackCount() as EntityIndex) as IBaseNpc_Plus;
        this.StartIntervalThink(-1);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE_MIN,
            2: Enum_MODIFIER_EVENT.ON_ORDER,
            3: Enum_MODIFIER_EVENT.ON_STATE_CHANGED,
            4: Enum_MODIFIER_EVENT.ON_ATTACK_START
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE_MIN)
    CC_GetModifierMoveSpeed_AbsoluteMin(): number {
        if (!this.target || !this.target.HasModifier || !this.target.HasModifier("modifier_imba_phantom_lancer_sun_catcher_aura")) {
            return this.bonus_speed;
        } else {
            return this.sun_catcher_bonus_speed;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierUnitEvent): void {
        if (keys.unit == this.GetParentPlus() && this.destroy_orders[keys.order_type] && !this.bFading) {
            this.Destroy();
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_STATE_CHANGED)
    CC_OnStateChanged(keys: ModifierUnitEvent): void {
        if (keys.unit == this.GetParentPlus() && (this.GetParentPlus().IsStunned() || this.GetParentPlus().IsNightmared() || this.GetParentPlus().IsHexed() || this.GetParentPlus().IsOutOfGame())) {
            this.Destroy();
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    CC_OnAttackStart(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && !keys.no_attack_cooldown && this.bAgility && this.bAgility == 1) {
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_phantom_lancer_phantom_edge_agility", {
                duration: this.agility_duration,
                bonus_agility: this.bonus_agility,
                mob_mentality_radius: this.mob_mentality_radius,
                mob_mentality_additional_agility: this.mob_mentality_additional_agility
            });
            this.Destroy();
        }
    }
}
@registerModifier()
export class modifier_imba_phantom_lancer_phantom_edge_agility extends BaseModifier_Plus {
    public bonus_agility: number;
    public mob_mentality_radius: number;
    public mob_mentality_additional_agility: any;
    BeCreated(keys: any): void {
        if (this.GetAbilityPlus()) {
            this.bonus_agility = this.GetSpecialValueFor("bonus_agility");
            this.mob_mentality_radius = this.GetSpecialValueFor("mob_mentality_radius");
            this.mob_mentality_additional_agility = this.GetSpecialValueFor("mob_mentality_additional_agility");
        } else if (keys && keys.bonus_agility) {
            this.bonus_agility = keys.bonus_agility;
            this.mob_mentality_radius = keys.mob_mentality_radius;
            this.mob_mentality_additional_agility = keys.mob_mentality_additional_agility;
        } else {
            this.bonus_agility = 11;
            this.mob_mentality_radius = 400;
            this.mob_mentality_additional_agility = 3;
        }
        if (!IsServer()) {
            return;
        }
        for (const [_, unit] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.mob_mentality_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_ANY_ORDER, false))) {
            if (unit != this.GetParentPlus() && unit.GetPlayerOwnerID() == this.GetCasterPlus().GetPlayerOwnerID()) {
                this.bonus_agility = this.bonus_agility + this.mob_mentality_additional_agility;
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.bonus_agility;
    }
}
@registerAbility()
export class imba_phantom_lancer_sun_catcher extends BaseAbility_Plus {
    IsInnateAbility() {
        return true;
    }
    OnSpellStart(): void {
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
        }
        let linear_particle = ResHelper.CreateParticleEx("particles/hero/phantom_lancer/sun_catcher_projectile.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
        ParticleManager.SetParticleControl(linear_particle, 0, this.GetCasterPlus().GetAbsOrigin() + Vector(0, 0, 700) as Vector);
        ParticleManager.SetParticleControl(linear_particle, 1, (this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized() * this.GetSpecialValueFor("speed") * Vector(1, 1, 0) as Vector);
        ParticleManager.SetParticleControl(linear_particle, 14, Vector(1, this.GetSpecialValueFor("radius"), this.GetSpecialValueFor("radius")));
        ParticleManager.SetParticleControl(linear_particle, 15, Vector(255, 255, 128));
        ParticleManager.SetParticleControl(linear_particle, 16, Vector(255, 255, 0));
        let sun_thinker = CreateModifierThinker(this.GetCasterPlus(), this, "modifier_imba_phantom_lancer_sun_catcher_thinker", {
            duration: this.GetSpecialValueFor("duration")
        }, this.GetCursorPosition(), this.GetCasterPlus().GetTeamNumber(), false);
        sun_thinker.EmitSound("Hero_Phantom_Lancer.Sun_Catcher");
        ProjectileManager.CreateLinearProjectile({
            Ability: this,
            vSpawnOrigin: this.GetCasterPlus().GetAbsOrigin(),
            fDistance: this.GetSpecialValueFor("speed") * this.GetSpecialValueFor("duration"),
            fStartRadius: this.GetSpecialValueFor("radius"),
            fEndRadius: this.GetSpecialValueFor("radius"),
            Source: this.GetCasterPlus(),
            bHasFrontalCone: false,
            // bReplaceExisting: false,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            fExpireTime: GameRules.GetGameTime() + this.GetSpecialValueFor("duration"),
            bDrawsOnMinimap: true,
            // bDeleteOnHit: false,
            vVelocity: (this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized() * this.GetSpecialValueFor("speed") * Vector(1, 1, 0) as Vector,
            bProvidesVision: true,
            iVisionRadius: this.GetSpecialValueFor("radius"),
            iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber(),
            ExtraData: {
                linear_particle: linear_particle,
                sun_thinker_entindex: sun_thinker.entindex()
            }
        });
    }
    OnProjectileThink_ExtraData(vLocation: Vector, ExtraData: any): void {
        if (!IsServer()) {
            return;
        }
        EntIndexToHScript(ExtraData.sun_thinker_entindex).SetAbsOrigin(vLocation);
    }
    OnProjectileHit_ExtraData(hTarget: CDOTA_BaseNPC | undefined, vLocation: Vector, ExtraData: any): boolean | void {
        if (!IsServer()) {
            return;
        }
        if (!hTarget) {
            ParticleManager.ReleaseParticleIndex(ExtraData.linear_particle);
        }
    }
}
@registerModifier()
export class modifier_imba_phantom_lancer_sun_catcher_thinker extends BaseModifier_Plus {
    public radius: number;
    public aura_duration: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.radius = this.GetSpecialValueFor("radius");
        this.aura_duration = this.GetSpecialValueFor("aura_duration");
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.radius;
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
        return "modifier_imba_phantom_lancer_sun_catcher_aura";
    }
    GetAuraDuration(): number {
        return this.aura_duration;
    }
}
@registerModifier()
export class modifier_imba_phantom_lancer_sun_catcher_aura extends BaseModifier_Plus {
    GetEffectName(): string {
        return "particles/units/heroes/hero_keeper_of_the_light/keeper_of_the_light_blinding_light_debuff.vpcf";
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE)
    CC_GetModifierMiss_Percentage(): number {
        return 100;
    }
}
@registerAbility()
export class imba_phantom_lancer_juxtapose extends BaseAbility_Plus {
    public toggle_state: any;
    IsStealable(): boolean {
        return false;
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL;
    }
    GetCooldown(level: number): number {
        return this.GetSpecialValueFor("confusion_cooldown");
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_phantom_lancer_juxtapose";
    }
    OnToggle(): void {
        if (this.GetToggleState()) {
            this.EndCooldown();
        }
    }
    OnOwnerSpawned(): void {
        if (this.toggle_state) {
            this.ToggleAbility();
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_phantom_lancer_juxtapose_assault_delimiter") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_phantom_lancer_juxtapose_assault_delimiter")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_phantom_lancer_juxtapose_assault_delimiter"), "modifier_special_bonus_imba_phantom_lancer_juxtapose_assault_delimiter", {});
        }
    }
    OnOwnerDied(): void {
        this.toggle_state = this.GetToggleState();
    }

}
@registerModifier()
export class modifier_imba_phantom_lancer_juxtapose extends BaseModifier_Plus {
    public duration: number;
    public directional_vectors: any;
    public owner: IBaseNpc_Plus;
    public spawn_particle: any;
    public confusion_positions: Vector[];
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
        this.duration = 0;
        this.directional_vectors = {
            1: Vector(72, 0, 0),
            2: Vector(0, -72, 0),
            3: Vector(-72, 0, 0),
            4: Vector(0, 72, 0)
        }
        if (!IsServer()) {
            return;
        }
        this.owner = this.GetParentPlus();
        this.owner.TempData().juxtapose_table = []
        // if (this.GetParentPlus().IsRealUnit()) {
        //     this.owner = this.GetParentPlus();
        //     this.owner.juxtapose_table = {}
        // } else if (!this.GetParentPlus().IsRealUnit() && this.GetParentPlus().GetOwnerPlus() &&
        //     this.GetParentPlus().GetOwnerPlus().GetAssignedHero()) {
        //     this.owner = this.GetParentPlus().GetOwnerPlus().GetAssignedHero();
        // }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            2: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && !this.GetParentPlus().PassivesDisabled() && !keys.target.IsBuilding() && this.owner && this.owner.TempData().juxtapose_table && !this.owner.PassivesDisabled()) {
            if (this.GetParentPlus().IsRealUnit() && GFuncRandom.PRD(this.GetSpecialValueFor("proc_chance_pct"), this.owner.findBuff<modifier_imba_phantom_lancer_juxtapose>("modifier_imba_phantom_lancer_juxtapose"))) {
                this.duration = this.GetSpecialValueFor("illusion_duration");
            } else if (!this.GetParentPlus().IsRealUnit() && GFuncRandom.PRD(this.GetSpecialValueFor("illusion_proc_chance_pct"), this.owner.findBuff<modifier_imba_phantom_lancer_juxtapose>("modifier_imba_phantom_lancer_juxtapose"))) {
                this.duration = this.GetSpecialValueFor("illusion_from_illusion_duration");
            }
            if (GameFunc.GetCount((this.owner.TempData().juxtapose_table)) < this.GetAbilityPlus().GetTalentSpecialValueFor("max_illusions") && this.duration > 0 && this.owner.TempData().juxtapose_table) {
                let illusions = this.owner.CreateIllusion(this.GetParentPlus(), {
                    outgoing_damage: this.GetSpecialValueFor("illusion_damage_out_pct"),
                    incoming_damage: this.GetSpecialValueFor("illusion_damage_in_pct"),
                    bounty_base: 5,
                    bounty_growth: undefined,
                    outgoing_damage_structure: undefined,
                    outgoing_damage_roshan: undefined,
                    duration: this.duration
                });
                for (const illusion of (illusions)) {
                    this.spawn_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_phantom_lancer/phantom_lancer_spawn_illusion.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, illusion);
                    ParticleManager.SetParticleControlEnt(this.spawn_particle, 0, illusion, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", illusion.GetAbsOrigin(), true);
                    ParticleManager.SetParticleControlEnt(this.spawn_particle, 1, illusion, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", illusion.GetAbsOrigin(), true);
                    ParticleManager.ReleaseParticleIndex(this.spawn_particle);
                    illusion.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_phantom_lancer_juxtapose_illusion", {});
                    illusion.SetAggroTarget(keys.target);
                    this.owner.TempData<EntityIndex[]>().juxtapose_table.push(illusion.entindex());
                }
                if (this.owner.findAbliityPlus<imba_phantom_lancer_juxtapose>("imba_phantom_lancer_juxtapose") && this.owner.FindAbilityByName("imba_phantom_lancer_juxtapose").GetToggleState() && this.owner.FindAbilityByName("imba_phantom_lancer_juxtapose").IsCooldownReady()) {
                    this.confusion_positions = []
                    for (const [_, unit] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.owner.findAbliityPlus<imba_phantom_lancer_juxtapose>("imba_phantom_lancer_juxtapose").GetSpecialValueFor("confusion_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_ANY_ORDER, false))) {
                        this.confusion_positions.push(unit.GetAbsOrigin());
                    }
                    for (const [_, unit] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.owner.findAbliityPlus<imba_phantom_lancer_juxtapose>("imba_phantom_lancer_juxtapose").GetSpecialValueFor("confusion_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_ANY_ORDER, false))) {
                        FindClearSpaceForUnit(unit, this.confusion_positions[_], true);
                    }
                    this.confusion_positions = undefined;
                    this.owner.findAbliityPlus<imba_phantom_lancer_juxtapose>("imba_phantom_lancer_juxtapose").UseResources(true, false, true);
                }
            }
            if (this.duration > 0 && (GameFunc.GetCount((this.owner.TempData().juxtapose_table)) >= this.GetAbilityPlus().GetTalentSpecialValueFor("max_illusions"))) {
                for (const [_, unit] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_ANY_ORDER, false))) {
                    if (unit.GetPlayerOwnerID() == this.GetCasterPlus().GetPlayerOwnerID()) {
                        let assault_modifier = unit.AddNewModifier(this.GetParentPlus().GetOwnerPlus(), this.GetAbilityPlus(), "modifier_imba_phantom_lancer_juxtapose_assault", {
                            duration: this.GetSpecialValueFor("assault_duration")
                        });
                        if (this.owner.HasModifier("modifier_imba_phantom_lancer_juxtapose_assault") && this.owner.findBuff<modifier_imba_phantom_lancer_juxtapose_assault>("modifier_imba_phantom_lancer_juxtapose_assault").GetStackCount() != assault_modifier.GetStackCount()) {
                            assault_modifier.SetStackCount(this.owner.findBuff<modifier_imba_phantom_lancer_juxtapose_assault>("modifier_imba_phantom_lancer_juxtapose_assault").GetStackCount());
                        }
                    }
                }
            }
            this.duration = 0;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetParentPlus() && this.owner && !this.owner.IsNull() && this.owner.TempData().juxtapose_table) {
            this.owner.TempData<EntityIndex[]>().juxtapose_table.filter((i, j) => {
                return i != this.GetParentPlus().entindex();
            });

        }
    }
}
@registerModifier()
export class modifier_imba_phantom_lancer_juxtapose_assault extends BaseModifier_Plus {
    public assault_attack_speed: number;
    public assault_armor: any;
    BeCreated(p_0: any,): void {
        this.assault_attack_speed = this.GetSpecialValueFor("assault_attack_speed") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_phantom_lancer_juxtapose_assault_delimiter");
        this.assault_armor = this.GetSpecialValueFor("assault_armor") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_phantom_lancer_juxtapose_assault_delimiter", "value2");
        if (!IsServer()) {
            return;
        }
        this.IncrementStackCount();
    }
    BeRefresh(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.IncrementStackCount();
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.assault_attack_speed * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.assault_armor * this.GetStackCount();
    }
}
@registerModifier()
export class modifier_special_bonus_imba_phantom_lancer_spirit_lance_damage extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_phantom_lancer_juxtapose_assault_delimiter extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_phantom_lancer_phantom_edge_distance extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_phantom_lancer_doppelwalk_cooldown extends BaseModifier_Plus {
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
