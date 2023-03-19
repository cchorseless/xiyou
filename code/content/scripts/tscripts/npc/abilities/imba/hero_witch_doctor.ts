
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { GameServiceConfig } from "../../../shared/GameServiceConfig";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_witch_doctor_paralyzing_cask extends BaseAbility_Plus {
    public cursed_casket: any;
    tempdata: { [k: string]: any } = {}
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return true;
    }
    GetAbilityTextureName(): string {
        return "witch_doctor_paralyzing_cask";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let hTarget = this.GetCursorTarget();
            let speed = this.GetSpecialValueFor("speed");
            let index = DoUniqueString("index");
            this.tempdata["split_" + index] = this.GetSpecialValueFor("split_amount");
            this.tempdata[index] = 1;
            if ((this.GetCasterPlus().GetUnitName().includes("witch_doctor"))) {
                this.GetCasterPlus().EmitSound("witchdoctor_wdoc_ability_cask_0" + math.random(1, 8));
            }
            let projectile = {
                Target: hTarget,
                Source: this.GetCasterPlus(),
                Ability: this,
                EffectName: "particles/units/heroes/hero_witchdoctor/witchdoctor_cask.vpcf",
                bDodgable: false,
                bProvidesVision: false,
                iMoveSpeed: speed,
                iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION,
                ExtraData: {
                    hero_duration: this.GetSpecialValueFor("hero_duration"),
                    creep_duration: this.GetSpecialValueFor("creep_duration"),
                    hero_damage: this.GetSpecialValueFor("hero_damage"),
                    creep_damage: this.GetSpecialValueFor("creep_damage"),
                    bounce_range: this.GetSpecialValueFor("bounce_range"),
                    bounces: this.GetSpecialValueFor("bounces"),
                    speed: speed,
                    bounce_delay: this.GetSpecialValueFor("bounce_delay"),
                    index: index,
                    bFirstCast: 1
                }
            }
            EmitSoundOn("Hero_WitchDoctor.Paralyzing_Cask_Cast", this.GetCasterPlus());
            ProjectileManager.CreateTrackingProjectile(projectile);
        }
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus | undefined, vLocation: Vector, ExtraData: any): boolean | void {
        EmitSoundOn("Hero_WitchDoctor.Paralyzing_Cask_Bounce", hTarget);
        if (hTarget) {
            if (hTarget.IsRealUnit() || hTarget.IsConsideredHero() || hTarget.IsRoshan()) {
                if (hTarget.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
                    if (!hTarget.IsMagicImmune() && (ExtraData.bFirstCast == 0 || !hTarget.TriggerSpellAbsorb(this))) {
                        if (IsServer() && this.GetCasterPlus().HasTalent("special_bonus_imba_witch_doctor_4")) {
                            let maledict_ability = this.GetCasterPlus().findAbliityPlus<imba_witch_doctor_maledict>("imba_witch_doctor_maledict");
                            if (hTarget.findBuff<modifier_imba_maledict>("modifier_imba_maledict")) {
                                this.cursed_casket = true;
                            } else {
                                this.cursed_casket = false;
                            }
                            if (ExtraData.cursed_casket == 1 && maledict_ability) {
                                hTarget.AddNewModifier(this.GetCasterPlus(), maledict_ability, "modifier_imba_maledict", {
                                    duration: maledict_ability.GetSpecialValueFor("duration") + FrameTime()
                                });
                            }
                        }
                        hTarget.AddNewModifier(hTarget, this, "modifier_generic_stunned", {
                            duration: ExtraData.hero_duration * (1 - hTarget.GetStatusResistance())
                        });
                        ApplyDamage({
                            victim: hTarget,
                            attacker: this.GetCasterPlus(),
                            damage: ExtraData.hero_damage,
                            damage_type: this.GetAbilityDamageType()
                        });
                    }
                } else {
                    let heal = ExtraData.hero_damage;
                    hTarget.ApplyHeal(heal, this);
                }
            } else {
                if (hTarget.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
                    if (!hTarget.IsMagicImmune() && (ExtraData.bFirstCast == 0 || !hTarget.TriggerSpellAbsorb(this))) {
                        hTarget.AddNewModifier(hTarget, this, "modifier_generic_stunned", {
                            duration: ExtraData.creep_duration * (1 - hTarget.GetStatusResistance())
                        });
                        ApplyDamage({
                            victim: hTarget,
                            attacker: this.GetCasterPlus(),
                            damage: ExtraData.creep_damage,
                            damage_type: this.GetAbilityDamageType()
                        });
                    }
                } else {
                    let heal = ExtraData.creep_damage;
                    hTarget.ApplyHeal(heal, this);
                }
            }
        } else {
        }
        if (ExtraData.bounces >= 1) {
            this.AddTimer(ExtraData.bounce_delay, () => {
                let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), hTarget.GetAbsOrigin(), undefined, ExtraData.bounce_range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, this.GetAbilityTargetType(), DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, 0, false);
                let allies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), hTarget.GetAbsOrigin(), undefined, ExtraData.bounce_range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, this.GetAbilityTargetType(), DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, 0, false);
                let tJumpTargets: IBaseNpc_Plus[] = []
                if (hTarget.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
                    for (const [_, unit] of GameFunc.iPair(enemies)) {
                        if (hTarget) {
                            if ((unit != hTarget) && (!unit.IsOther()) && ((this.tempdata["split_" + ExtraData.index] >= 1) || GameFunc.GetCount(tJumpTargets) == 0)) {
                                tJumpTargets.push(unit);
                                if (GameFunc.GetCount(tJumpTargets) == 2) {
                                    this.tempdata[ExtraData.index] = this.tempdata[ExtraData.index] + 1;
                                    return;
                                }
                            }
                        }
                    }
                } else {
                    if (GameFunc.GetCount(tJumpTargets) == 0) {
                        for (const [_, unit] of GameFunc.iPair(allies)) {
                            if (hTarget) {
                                if ((unit != hTarget) && (!unit.IsOther())) {
                                    tJumpTargets.push(unit);
                                    return;
                                }
                            }
                        }
                    }
                }
                if (GameFunc.GetCount(tJumpTargets) == 0) {
                    this.cursed_casket = false;
                    if (this.tempdata[ExtraData.index] == 1) {
                        this.tempdata[ExtraData.index] = undefined;
                        this.tempdata["split_" + ExtraData.index] = undefined;
                    } else {
                        this.tempdata[ExtraData.index] = this.tempdata[ExtraData.index] - 1;
                    }
                    return undefined;
                } else if (GameFunc.GetCount(tJumpTargets) >= 2) {
                    this.tempdata["split_" + ExtraData.index] = this.tempdata["split_" + ExtraData.index] - 1;
                }
                for (const [_, hJumpTarget] of GameFunc.iPair(tJumpTargets)) {
                    let projectile = {
                        Target: hJumpTarget,
                        Source: hTarget,
                        Ability: this,
                        EffectName: "particles/units/heroes/hero_witchdoctor/witchdoctor_cask.vpcf",
                        bDodgable: false,
                        bProvidesVision: false,
                        iMoveSpeed: ExtraData.speed,
                        iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION,
                        ExtraData: {
                            hero_duration: ExtraData.hero_duration,
                            creep_duration: ExtraData.creep_duration,
                            hero_damage: ExtraData.hero_damage,
                            creep_damage: ExtraData.creep_damage,
                            bounce_range: ExtraData.bounce_range,
                            bounces: ExtraData.bounces - 1,
                            speed: ExtraData.speed,
                            bounce_delay: ExtraData.bounce_delay,
                            index: ExtraData.index,
                            cursed_casket: this.cursed_casket,
                            bFirstCast: 0
                        }
                    }
                    ProjectileManager.CreateTrackingProjectile(projectile);
                }
            });
        } else {
            this.cursed_casket = false;
            if (this.tempdata[ExtraData.index] == 1) {
                this.tempdata[ExtraData.index] = undefined;
                this.tempdata["split_" + ExtraData.index] = undefined;
            } else {
                this.tempdata[ExtraData.index] = this.tempdata[ExtraData.index] - 1;
            }
            return undefined;
        }
    }
}
@registerAbility()
export class imba_witch_doctor_voodoo_restoration extends BaseAbility_Plus {
    static VOODOO = false;
    public previous_dispell_time: number;
    GetAbilityTextureName(): string {
        return "witch_doctor_voodoo_restoration";
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        return this.GetSpecialValueFor("radius");
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_witch_doctor_6")) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL;
        }
    }
    GetManaCost(hTarget: number): number {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_witch_doctor_6")) {
            return 0;
        } else {
            return super.GetManaCost(hTarget);
        }
    }
    OnUpgrade(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_witch_doctor_6")) {
            if (this.GetCasterPlus().HasModifier("modifier_imba_voodoo_restoration")) {
                this.GetCasterPlus().RemoveModifierByName("modifier_imba_voodoo_restoration");
            }
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_voodoo_restoration", {});
        }
    }
    OnToggle(): void {
        if (this.GetToggleState()) {
            EmitSoundOn("Hero_WitchDoctor.Voodoo_Restoration", this.GetCasterPlus());
            EmitSoundOn("Hero_WitchDoctor.Voodoo_Restoration.Loop", this.GetCasterPlus());
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_voodoo_restoration", {});
            if ((!imba_witch_doctor_voodoo_restoration.VOODOO) && (this.GetCasterPlus().GetUnitName().includes("witch_doctor"))) {
                imba_witch_doctor_voodoo_restoration.VOODOO = true;
                this.GetCasterPlus().EmitSound("witchdoctor_wdoc_ability_voodoo_0" + math.random(1, 5));
                this.AddTimer(10, () => {
                    imba_witch_doctor_voodoo_restoration.VOODOO = false;
                });
            }
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_witch_doctor_2")) {
                if (!this.previous_dispell_time) {
                    this.previous_dispell_time = GameRules.GetGameTime() + this.GetCasterPlus().GetTalentValue("special_bonus_imba_witch_doctor_2");
                }
                if (GameRules.GetGameTime() >= this.previous_dispell_time + this.GetCasterPlus().GetTalentValue("special_bonus_imba_witch_doctor_2")) {
                    this.previous_dispell_time = GameRules.GetGameTime();
                    let allies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("radius"), this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), 0, false);
                    for (const [_, hAlly] of GameFunc.iPair(allies)) {
                        let bRemoveStuns = false;
                        let bRemoveExceptions = false;
                        if (this.GetCasterPlus().HasTalent("special_bonus_imba_witch_doctor_3")) {
                            bRemoveStuns = true;
                            bRemoveExceptions = true;
                        }
                        hAlly.Purge(false, true, false, bRemoveStuns, bRemoveExceptions);
                        let cleanse_pfc = ResHelper.CreateParticleEx("particles/hero/witch_doctor/voodoo_cleanse.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetCasterPlus());
                        ParticleManager.SetParticleControlEnt(cleanse_pfc, 0, hAlly, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hAlly.GetAbsOrigin(), true);
                        ParticleManager.ReleaseParticleIndex(cleanse_pfc);
                        if (hAlly == this.GetCasterPlus()) {
                            EmitSoundOn("Imba.WitchDoctorDispel", this.GetCasterPlus());
                        }
                    }
                }
            }
        } else {
            EmitSoundOn("Hero_WitchDoctor.Voodoo_Restoration.Off", this.GetCasterPlus());
            StopSoundEvent("Hero_WitchDoctor.Voodoo_Restoration.Loop", this.GetCasterPlus());
            this.GetCasterPlus().RemoveModifierByName("modifier_imba_voodoo_restoration");
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_witch_doctor_6 extends BaseModifier_Plus {
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
        if (IsServer()) {
            let ability = this.GetParentPlus().findAbliityPlus<imba_witch_doctor_voodoo_restoration>("imba_witch_doctor_voodoo_restoration");
            if (!ability) {
                return;
            }
            this.AddTimer(0, () => {
                if (ability.GetLevel() > 0) {
                    this.GetParentPlus().AddNewModifier(this.GetParentPlus(), ability, "modifier_imba_voodoo_restoration", {});
                    return;
                }
                if (!ability.IsTrained() || this.GetParentPlus().IsIllusion()) {
                    return;
                }
                return 1.0;
            });
        }
    }
}
@registerModifier()
export class modifier_imba_voodoo_restoration extends BaseModifier_Plus {
    public interval: number;
    public cleanse_interval: number;
    public manacost: any;
    public radius: number;
    public mainParticle: any;
    public cleanse_counter: number;
    BeCreated(p_0: any,): void {
        if (IsServer() && this.GetAbilityPlus().IsTrained()) {
            let ability = this.GetAbilityPlus();
            this.interval = ability.GetSpecialValueFor("heal_interval");
            this.cleanse_interval = ability.GetSpecialValueFor("cleanse_interval");
            this.manacost = ability.GetSpecialValueFor("mana_per_second") * this.interval;
            this.radius = ability.GetSpecialValueFor("radius");
            this.StartIntervalThink(this.interval);
            this.mainParticle = ResHelper.CreateParticleEx("particles/units/heroes/hero_witchdoctor/witchdoctor_voodoo_restoration.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetCasterPlus());
            ParticleManager.SetParticleControlEnt(this.mainParticle, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_staff", this.GetCasterPlus().GetAbsOrigin(), true);
            ParticleManager.SetParticleControl(this.mainParticle, 1, Vector(this.radius, this.radius, this.radius));
            ParticleManager.SetParticleControlEnt(this.mainParticle, 2, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_staff", this.GetCasterPlus().GetAbsOrigin(), true);
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.StartIntervalThink(-1);
            if (this.mainParticle) {
                ParticleManager.DestroyParticle(this.mainParticle, false);
                ParticleManager.ReleaseParticleIndex(this.mainParticle);
            }
        }
    }
    OnIntervalThink(): void {
        if (!this.GetAbilityPlus() || this.GetAbilityPlus().IsNull()) {
            this.Destroy();
            return;
        }
        let hAbility = this.GetAbilityPlus();
        if (!this.GetCasterPlus().IsAlive()) {
            return;
        }
        this.cleanse_counter = this.cleanse_counter || 0;
        this.cleanse_counter = this.cleanse_counter + this.interval;
        if (this.cleanse_counter >= this.cleanse_interval) {
            this.cleanse_counter = 0;
            let allies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.radius, hAbility.GetAbilityTargetTeam(), hAbility.GetAbilityTargetType(), hAbility.GetAbilityTargetFlags(), 0, false);
            for (const [_, hAlly] of GameFunc.iPair(allies)) {
                let bRemoveStuns = false;
                let bRemoveExceptions = false;
                if (this.GetCasterPlus().HasTalent("special_bonus_imba_witch_doctor_3")) {
                    bRemoveStuns = true;
                    bRemoveExceptions = true;
                }
                hAlly.Purge(false, true, false, bRemoveStuns, bRemoveExceptions);
                let cleanse_pfc = ResHelper.CreateParticleEx("particles/hero/witch_doctor/voodoo_cleanse.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetCasterPlus());
                ParticleManager.SetParticleControlEnt(cleanse_pfc, 0, hAlly, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hAlly.GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(cleanse_pfc);
                if (hAlly == this.GetCasterPlus()) {
                    EmitSoundOn("Imba.WitchDoctorDispel", this.GetCasterPlus());
                }
            }
        }
        if (!this.GetCasterPlus().HasTalent("special_bonus_imba_witch_doctor_6")) {
            if (this.GetCasterPlus().GetMana() >= hAbility.GetManaCost(-1)) {
                this.GetCasterPlus().ReduceMana(this.manacost);
            } else {
                hAbility.ToggleAbility();
            }
        }
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
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_voodoo_restoration_heal";
    }
    IsHidden(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_voodoo_restoration_heal extends BaseModifier_Plus {
    public heal: any;
    public heal_spell_amp_pct: number;
    public int_to_heal: any;
    public interval: number;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus() || this.GetAbilityPlus().IsNull()) {
            this.Destroy();
            return;
        }
        this.heal = this.GetSpecialValueFor("heal");
        this.heal_spell_amp_pct = this.GetSpecialValueFor("heal_spell_amp_pct");
        this.int_to_heal = this.GetSpecialValueFor("int_to_heal");
        if (IsServer()) {
            this.interval = this.GetSpecialValueFor("heal_interval");
            this.StartIntervalThink(this.interval);
        }
    }
    OnIntervalThink(): void {
        if (!this.GetAbilityPlus() || this.GetAbilityPlus().IsNull()) {
            this.Destroy();
            return;
        }
        let hParent = this.GetParentPlus();
        let heal_amp = 1 + (this.GetCasterPlus().GetSpellAmplification(false) * this.heal_spell_amp_pct * 0.01);
        let heal = (this.heal + (this.GetCasterPlus().GetIntellect() * this.int_to_heal * 0.01)) * heal_amp * this.interval;
        hParent.ApplyHeal(heal, this.GetAbilityPlus());
    }
}
@registerAbility()
export class imba_witch_doctor_maledict extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return true;
    }
    GetAbilityTextureName(): string {
        return "witch_doctor_maledict";
    }
    OnSpellStart(): void {
        let vPosition = this.GetCursorPosition();
        let radius = this.GetTalentSpecialValueFor("radius");
        let duration = this.GetTalentSpecialValueFor("duration");
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), vPosition, undefined, radius, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, 0, false);
        let aoe_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_witchdoctor/witchdoctor_maledict_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(aoe_pfx, 0, vPosition);
        ParticleManager.SetParticleControl(aoe_pfx, 1, Vector(radius, radius, radius));
        if (GameFunc.GetCount(enemies) > 0) {
            EmitSoundOn("Hero_WitchDoctor.Maledict_Cast", this.GetCasterPlus());
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_maledict", {
                    duration: duration + (FrameTime())
                });
            }
        } else {
            EmitSoundOn("Hero_WitchDoctor.Maledict_CastFail", this.GetCasterPlus());
        }
    }
    GetAOERadius(): number {
        return this.GetTalentSpecialValueFor("radius");
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_witch_doctor_9") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_witch_doctor_9")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_witch_doctor_9"), "modifier_special_bonus_imba_witch_doctor_9", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_witch_doctor_maledict_radius") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_witch_doctor_maledict_radius")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_witch_doctor_maledict_radius"), "modifier_special_bonus_imba_witch_doctor_maledict_radius", {});
        }
    }
}
@registerModifier()
export class modifier_imba_maledict extends BaseModifier_Plus {
    static MALEDICT_KILL = false;
    static MALEDICT_POP = false;

    public main_damage: number;
    public bonus_damage_pct: number;
    public tick_time_sec: number;
    public tick_time_main: number;
    public heal_reduce_pct: number;
    public counter: number;
    public burstParticle: any;
    public healthComparator: any;
    public damage_type: number;
    public soundcount: number;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    IgnoreTenacity() {
        return true;
    }
    BeCreated(p_0: any,): void {
        let hAbility = this.GetAbilityPlus();
        let hParent = this.GetParentPlus();
        this.main_damage = hAbility.GetSpecialValueFor("main_damage");
        this.bonus_damage_pct = hAbility.GetSpecialValueFor("bonus_damage_pct") * 0.01;
        this.tick_time_sec = hAbility.GetSpecialValueFor("tick_time_sec");
        this.tick_time_main = hAbility.GetSpecialValueFor("tick_time_main");
        this.heal_reduce_pct = hAbility.GetTalentSpecialValueFor("heal_reduce_pct") * (-1);
        this.counter = 0;
        this.burstParticle = ResHelper.CreateParticleEx("particles/hero/witch_doctor/imba_witchdoctor_maledict.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(this.burstParticle, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(this.burstParticle, 1, Vector(this.tick_time_sec, 0, 0));
        if (!this.GetCasterPlus().HasTalent("special_bonus_imba_witch_doctor_1")) {
            ParticleManager.SetParticleControl(this.burstParticle, 2, Vector(128, 1, 1));
        } else {
            ParticleManager.SetParticleControl(this.burstParticle, 2, Vector(this.GetCasterPlus().GetTalentValue("special_bonus_imba_witch_doctor_1"), 1, 1));
        }
        if (IsServer()) {
            this.healthComparator = hParent.GetHealth();
            this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
            this.StartIntervalThink(this.tick_time_main);
        }
        EmitSoundOn("Hero_WitchDoctor.Maledict_Loop", hParent);
    }
    BeRefresh(p_0: any,): void {
        let hAbility = this.GetAbilityPlus();
        this.bonus_damage_pct = hAbility.GetSpecialValueFor("bonus_damage_pct") * 0.01;
        this.tick_time_sec = hAbility.GetSpecialValueFor("tick_time_sec");
        this.tick_time_main = hAbility.GetSpecialValueFor("tick_time_main");
        this.heal_reduce_pct = hAbility.GetTalentSpecialValueFor("heal_reduce_pct") * (-1);
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.StartIntervalThink(-1);
        }
        if (this.soundcount) {
            if (this.soundcount < this.GetSpecialValueFor("duration") / this.tick_time_sec) {
                this.DealHPBurstDamage(this.GetParentPlus());
                EmitSoundOn("Hero_WitchDoctor.Maledict_Tick", this.GetParentPlus());
            }
        }
        StopSoundEvent("Hero_WitchDoctor.Maledict_Loop", this.GetParentPlus());
        ParticleManager.DestroyParticle(this.burstParticle, false);
        ParticleManager.ReleaseParticleIndex(this.burstParticle);
    }
    OnIntervalThink(): void {
        let hParent = this.GetParentPlus();
        this.counter = this.counter + this.tick_time_main;
        if (!this.GetParentPlus().IsMagicImmune()) {
            ApplyDamage({
                victim: hParent,
                attacker: this.GetCasterPlus(),
                damage: this.main_damage,
                damage_type: this.damage_type
            });
        }
        if (this.counter >= this.tick_time_sec) {
            this.counter = 0;
            this.DealHPBurstDamage(hParent);
        }
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_maledict.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return 5;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE,
            2: Enum_MODIFIER_EVENT.ON_DEATH
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE)
    CC_GetModifierHPRegenAmplify_Percentage(): number {
        return this.heal_reduce_pct;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(params: ModifierInstanceEvent): void {
        if ((!modifier_imba_maledict.MALEDICT_KILL) && (this.GetParentPlus() == params.unit) && this.GetCasterPlus().GetUnitName().includes("witch_doctor")) {
            modifier_imba_maledict.MALEDICT_KILL = true;
            this.GetCasterPlus().EmitSound("witchdoctor_wdoc_ability_maledict_0" + math.random(1, 4));
            this.AddTimer(30, () => {
                modifier_imba_maledict.MALEDICT_KILL = false;
            });
        }
    }
    DealHPBurstDamage(hTarget: IBaseNpc_Plus) {
        this.soundcount = this.soundcount || 0;
        this.soundcount = this.soundcount + 1;
        let hAbility = this.GetAbilityPlus();
        let newHP = hTarget.GetHealth();
        let maxHP_pct = newHP / hTarget.GetMaxHealth();
        if (newHP > this.healthComparator) {
            return;
        }
        if ((!modifier_imba_maledict.MALEDICT_POP) && (maxHP_pct < 0.2) && (this.soundcount == 2) && (this.GetCasterPlus().GetUnitName().includes("witch_doctor"))) {
            modifier_imba_maledict.MALEDICT_POP = true;
            this.GetCasterPlus().EmitSound("witchdoctor_wdoc_killspecial_0" + math.random(1, 3));
            this.AddTimer(30, () => {
                modifier_imba_maledict.MALEDICT_POP = undefined;
            });
        }
        let hpDiffDamage = (this.healthComparator - newHP) * this.bonus_damage_pct;
        ApplyDamage({
            victim: hTarget,
            attacker: this.GetCasterPlus(),
            damage: hpDiffDamage,
            damage_type: hAbility.GetAbilityDamageType()
        });
        EmitSoundOn("Hero_WitchDoctor.Maledict_Tick", hTarget);
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_witch_doctor_1")) {
            let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), hTarget.GetAbsOrigin(), undefined, this.GetCasterPlus().GetTalentValue("special_bonus_imba_witch_doctor_1"), hAbility.GetAbilityTargetTeam(), hAbility.GetAbilityTargetType(), hAbility.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (enemy != hTarget) {
                    let DamageTable = {
                        victim: enemy,
                        attacker: this.GetCasterPlus(),
                        damage: hpDiffDamage / (GameFunc.GetCount(enemies) - 1),
                        damage_type: hAbility.GetAbilityDamageType()
                    }
                    ApplyDamage(DamageTable);
                }
            }
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_witch_doctor_7")) {
            hTarget.AddNewModifier(this.GetCasterPlus(), hAbility, "modifier_imba_maledict_talent", {
                duration: this.GetCasterPlus().GetTalentValue("special_bonus_imba_witch_doctor_7") * (1 - hTarget.GetStatusResistance())
            });
        }
    }
}
@registerModifier()
export class modifier_imba_maledict_talent extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE)
    CC_GetModifierHPRegenAmplify_Percentage(): number {
        return -100;
    }
}
@registerAbility()
export class imba_witch_doctor_death_ward extends BaseAbility_Plus {
    public death_ward: IBaseNpc_Plus;
    public dance: any;
    public mod_caster: modifier_imba_death_ward_caster;
    tempdata: { [k: string]: IBaseNpc_Plus } = {};
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return false;
    }
    GetAbilityTextureName(): string {
        return "witch_doctor_death_ward";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let vPosition = this.GetCursorPosition();
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_witch_doctor_8")) {
                let distance = this.GetCasterPlus().GetTalentValue("special_bonus_imba_witch_doctor_8");
                let spawn_line_direction = GFuncVector.RotateVector2D((vPosition - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized(), 90, true);
                let talent_ward = this.CreateWard(vPosition - ((distance / 2) * spawn_line_direction) as Vector);
                talent_ward.TempData().bIsTalentWard = true;
                vPosition = vPosition + ((distance / 2) * spawn_line_direction) as Vector;
                talent_ward.EmitSound("Hero_WitchDoctor.Death_WardBuild");
                this.AddTimer(this.GetChannelTime(), () => {
                    GFuncEntity.SafeDestroyUnit(talent_ward);
                    if (this.GetCasterPlus().HasTalent("special_bonus_imba_witch_doctor_5")) {
                        let units = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_OTHER, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_ANY_ORDER, false);
                        for (const [_, unit] of GameFunc.iPair(units)) {
                            if (unit.TempData().bIsMiniDeathWard) {
                                GFuncEntity.SafeDestroyUnit(unit);
                            }
                        }
                    }
                });

            }
            this.death_ward = this.CreateWard(vPosition);
            if (GameServiceConfig.USE_MEME_SOUNDS && RollPercentage(GameServiceConfig.MEME_SOUNDS_CHANCE)) {
                this.dance = true;
                this.death_ward.EmitSound("Imba.WitchDoctorSingsASong");
            } else {
                this.death_ward.EmitSound("Hero_WitchDoctor.Death_WardBuild");
                this.dance = undefined;
            }
        }
    }
    CreateWard(vPosition: Vector, bIsMiniWard = false) {
        let damage = this.GetSpecialValueFor("damage") + this.GetCasterPlus().GetIntellect() * this.GetSpecialValueFor("int_to_dmg_pct") / 100;
        if (bIsMiniWard) {
            damage = damage * this.GetCasterPlus().GetTalentValue("special_bonus_imba_witch_doctor_5") * 0.01;
        }
        let death_ward = BaseNpc_Plus.CreateUnitByName("npc_imba_witch_doctor_death_ward", vPosition, this.GetCasterPlus());
        this.AddTimer(FrameTime(), () => {
            ResolveNPCPositions(vPosition, 128);
        });
        // death_ward.SetControllableByPlayer(this.GetCasterPlus().GetPlayerID(), true);
        death_ward.SetOwner(this.GetCasterPlus());
        death_ward.SetCanSellItems(false);
        death_ward.SetBaseAttackTime(this.GetSpecialValueFor("base_attack_time"));
        let death_ward_mod = death_ward.AddNewModifier(this.GetCasterPlus(), this,
            "modifier_imba_death_ward", {
            duration: this.GetChannelTime()
        }) as modifier_imba_death_ward;
        let exceptionList: { [k: string]: boolean } = {
            "item_imba_bfury": true,
            "item_imba_butterfly": true,
            "item_imba_echo_sabre": true,
            "item_imba_reverb_rapier": true,
            "item_imba_rapier": true,
            "item_imba_rapier_2": true,
            "item_imba_rapier_magic": true,
            "item_imba_rapier_magic_2": true,
            "item_imba_rapier_cursed": true
        }
        for (let i = 0; i <= 5; i++) {
            let item = this.GetCasterPlus().GetItemInSlot(i);
            if (item && !exceptionList[item.GetAbilityName()]) {
                death_ward.AddItemByName(item.GetAbilityName());
            }
            if (this.GetCasterPlus().HasModifier("modifier_item_imba_spell_fencer_unique")) {
                death_ward.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_spell_fencer_unique", {});
            }
        }
        let damageOffset = death_ward.GetAverageTrueAttackDamage(death_ward);
        for (let iteration = 1; iteration <= 100; iteration++) {
            let temp = death_ward.GetAverageTrueAttackDamage(death_ward);
            if (temp < damageOffset) {
                damageOffset = temp;
            }
        }
        death_ward.SetBaseDamageMax(damage - damageOffset);
        death_ward.SetBaseDamageMin(damage - damageOffset);
        this.mod_caster = this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_death_ward_caster", {
            duration: this.GetChannelTime()
        }) as modifier_imba_death_ward_caster;
        this.mod_caster.death_ward_mod = death_ward_mod;
        let index = DoUniqueString("index");
        death_ward.TempData().index = index;
        this.tempdata[index] = death_ward;
        return death_ward;
    }
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CAST_ABILITY_4;
    }
    GetChannelAnimation(): GameActivity_t {
        if (this.dance) {
            return GameActivity_t.ACT_DOTA_VICTORY;
        }
    }
    OnChannelFinish(p_0: boolean,): void {
        if (IsServer()) {
            StopSoundOn("Hero_WitchDoctor.Death_WardBuild", this.death_ward);
            StopSoundOn("Imba.WitchDoctorSingsASong", this.death_ward);
            GFuncEntity.SafeDestroyUnit(this.death_ward);
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_witch_doctor_5")) {
                let units = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_OTHER, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, unit] of GameFunc.iPair(units)) {
                    if (unit.TempData().bIsMiniDeathWard) {
                        GFuncEntity.SafeDestroyUnit(unit);
                    }
                }
            }
            if (this.mod_caster) {
                this.mod_caster.Destroy();
            }
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, vLocation: Vector, ExtraData: any): boolean | void {
        if (this.tempdata[ExtraData.index]) {
            if (!this.tempdata[ExtraData.index].IsNull()) {
                if (this.GetCasterPlus().HasScepter()) {
                    this.tempdata[ExtraData.index].PerformAttack(target, false, true, true, true, false, false, true);
                } else {
                    this.tempdata[ExtraData.index].PerformAttack(target, false, true, true, true, false, false, false);
                }
                if (ExtraData.bounces_left >= 0 && this.GetCasterPlus().HasScepter()) {
                    ExtraData.bounces_left = ExtraData.bounces_left - 1;
                    ExtraData[tostring(target.GetEntityIndex())] = 1;
                    this.CreateBounceAttack(target, ExtraData);
                }
            }
        }
    }
    CreateBounceAttack(originalTarget: IBaseNpc_Plus, extraData: any) {
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), originalTarget.GetAbsOrigin(), undefined, this.GetSpecialValueFor("bounce_radius_scepter"), this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST, false);
        let target = originalTarget;
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (extraData[tostring(enemy.GetEntityIndex())] != 1 && !enemy.IsAttackImmune() && extraData.bounces_left > 0) {
                extraData[tostring(enemy.GetEntityIndex())] = 1;
                let projectile = {
                    Target: enemy,
                    Source: originalTarget,
                    Ability: this,
                    EffectName: "particles/units/heroes/hero_witchdoctor/witchdoctor_ward_attack.vpcf",
                    bDodgable: true,
                    bProvidesVision: false,
                    iMoveSpeed: 1500,
                    iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_ATTACK_1,
                    ExtraData: extraData
                }
                ProjectileManager.CreateTrackingProjectile(projectile);
                return;
            }
        }
        EmitSoundOn("Hero_Jakiro.Attack", originalTarget);
    }
}
@registerModifier()
export class modifier_imba_death_ward_caster extends BaseModifier_Plus {
    death_ward_mod: modifier_imba_death_ward;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_death_ward extends BaseModifier_Plus {
    public wardParticle: ParticleID;
    public attack_range_bonus: number;
    public attack_target: any;
    ability: imba_witch_doctor_death_ward;
    parent: IBaseNpc_Plus;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        this.wardParticle = ResHelper.CreateParticleEx("particles/units/heroes/hero_witchdoctor/witchdoctor_ward_skull.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(this.wardParticle, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetParentPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(this.wardParticle, 2, this.GetParentPlus().GetAbsOrigin());
        this.attack_range_bonus = this.GetSpecialValueFor("attack_range") - this.GetParentPlus().Script_GetAttackRange();
        this.ability = this.GetAbilityPlus<imba_witch_doctor_death_ward>();
        this.parent = this.GetParentPlus();
        if (IsServer()) {
            this.StartIntervalThink(this.GetParentPlus().GetBaseAttackTime());
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            delete this.ability.tempdata[this.parent.TempData().index];
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let hParent = this.GetParentPlus();
            let hAbility = this.GetAbilityPlus();
            let bounces = 0;
            if (this.GetCasterPlus().HasScepter()) {
                bounces = hAbility.GetSpecialValueFor("bounces_scepter") + 1;
            }
            let range = hParent.Script_GetAttackRange();
            if (this.attack_target) {
                if (!((((this.attack_target.GetAbsOrigin() - hParent.GetAbsOrigin() as Vector).Length2D()) <= range) && UnitFilter(this.attack_target, hAbility.GetAbilityTargetTeam(), hAbility.GetAbilityTargetType(), hAbility.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber()) == 0)) {
                    this.attack_target = undefined;
                }
            }
            if (!this.attack_target) {
                let units = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), hParent.GetAbsOrigin(), undefined, range, hAbility.GetAbilityTargetTeam(), hAbility.GetAbilityTargetType(), hAbility.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false);
                this.attack_target = units[0];
            }
            if (this.attack_target) {
                let projectile = {
                    Target: this.attack_target,
                    Source: hParent,
                    Ability: hAbility,
                    EffectName: "particles/units/heroes/hero_witchdoctor/witchdoctor_ward_attack.vpcf",
                    bDodgable: true,
                    bProvidesVision: false,
                    iMoveSpeed: hParent.GetProjectileSpeed(),
                    iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_ATTACK_1,
                    ExtraData: {
                        index: hParent.TempData().index,
                        bounces_left: bounces,
                        [tostring(this.attack_target.GetEntityIndex())]: 1,
                        bIsTalentWard: hParent.TempData().bIsTalentWard
                    }
                }
                EmitSoundOn("Hero_WitchDoctor_Ward.Attack", hParent);
                ProjectileManager.CreateTrackingProjectile(projectile);
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(params: ModifierInstanceEvent): void {
        if (params.attacker == this.GetParentPlus()) {
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_witch_doctor_5")) {
                if (!params.unit.IsAlive()) {
                    if (params.unit.IsRealUnit()) {
                        let talent_ward = this.GetAbilityPlus<imba_witch_doctor_death_ward>().CreateWard(params.unit.GetAbsOrigin(), true);
                        talent_ward.TempData().bIsMiniDeathWard = true;
                        talent_ward.EmitSound("Hero_WitchDoctor.Death_WardBuild");
                    }
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        return this.attack_range_bonus;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_ATTACK_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_MUTED]: true
        }
        return state;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_witch_doctor_5 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_witch_doctor_maledict_duration extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_witch_doctor_8 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_witch_doctor_9 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_witch_doctor_maledict_radius extends BaseModifier_Plus {
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
