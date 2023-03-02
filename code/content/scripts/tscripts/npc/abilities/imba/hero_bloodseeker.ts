
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_bloodseeker_bloodrage extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "bloodseeker_bloodrage";
    }
    OnSpellStart(): void {
        let hTarget = this.GetCursorTarget();
        let caster = this.GetCasterPlus();
        if (hTarget.TriggerSpellAbsorb(this)) {
            return;
        }
        if (hTarget.GetTeamNumber() != caster.GetTeamNumber()) {
            hTarget.AddNewModifier(caster, this, "modifier_imba_bloodrage_buff_stats", {
                duration: this.GetSpecialValueFor("duration") * (1 - hTarget.GetStatusResistance())
            });
        } else {
            hTarget.AddNewModifier(caster, this, "modifier_imba_bloodrage_buff_stats", {
                duration: this.GetSpecialValueFor("duration")
            });
        }
        EmitSoundOn("hero_bloodseeker.bloodRage", hTarget);
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_bloodseeker_7") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_bloodseeker_7")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_bloodseeker_7"), "modifier_special_bonus_imba_bloodseeker_7", {});
        }
    }
}
@registerModifier()
export class modifier_imba_bloodrage_buff_stats extends BaseModifier_Plus {
    public health_bonus_pct: number;
    public modifier_frenzy: any;
    public damage_increase_outgoing_pct: number;
    public damage_increase_incoming_pct: number;
    public health_bonus_aoe: number;
    public health_bonus_share_percent: number;
    public damage: number;
    public radius: number;
    public alliedpct: number;
    public damage_type: number;
    GetEffectName(): string {
        return "particles/econ/items/bloodseeker/bloodseeker_eztzhok_weapon/bloodseeker_bloodrage_eztzhok.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_bloodrage.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return 8;
    }
    Init(p_0: any,): void {
        this.health_bonus_pct = this.GetSpecialValueFor("health_bonus_pct");
        if (!IsServer()) {
            return;
        }
        this.modifier_frenzy = "modifier_imba_bloodrage_blood_frenzy";
        this.damage_increase_outgoing_pct = this.GetSpecialValueFor("damage_increase_outgoing_pct");
        this.damage_increase_incoming_pct = this.GetSpecialValueFor("damage_increase_incoming_pct");
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_bloodseeker_1")) {
            if (this.GetParentPlus().GetTeam() == this.GetCasterPlus().GetTeam()) {
                this.damage_increase_incoming_pct = this.damage_increase_incoming_pct - this.GetCasterPlus().GetTalentValue("special_bonus_imba_bloodseeker_1");
                this.damage_increase_outgoing_pct = this.damage_increase_outgoing_pct + this.GetCasterPlus().GetTalentValue("special_bonus_imba_bloodseeker_1");
            } else {
                this.damage_increase_incoming_pct = this.damage_increase_incoming_pct + this.GetCasterPlus().GetTalentValue("special_bonus_imba_bloodseeker_1");
                this.damage_increase_outgoing_pct = this.damage_increase_outgoing_pct - this.GetCasterPlus().GetTalentValue("special_bonus_imba_bloodseeker_1");
            }
        }
        this.health_bonus_aoe = this.GetSpecialValueFor("health_bonus_aoe");
        this.health_bonus_share_percent = this.GetSpecialValueFor("health_bonus_share_percent");
        this.damage = this.GetSpecialValueFor("aoe_damage");
        this.radius = this.GetSpecialValueFor("aoe_radius");
        this.alliedpct = this.GetSpecialValueFor("allied_damage") / 100;
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        let tick_interval = 1;
        if (this.GetParentPlus().GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
            tick_interval = tick_interval * (1 - this.GetParentPlus().GetStatusResistance());
        }
        this.StartIntervalThink(tick_interval);
    }

    OnIntervalThink(): void {
        for (const [_, target] of ipairs(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0, false))) {
            ApplyDamage({
                victim: target,
                attacker: this.GetCasterPlus(),
                damage: this.damage,
                damage_type: this.damage_type,
                ability: this.GetAbilityPlus()
            });
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            3: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierTotalDamageOutgoing_Percentage(params: ModifierAttackEvent): number {
        if (!IsServer()) {
            return;
        }
        if (params.attacker == this.GetParentPlus() && bit.band(params.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) {
            let outamp = this.damage_increase_outgoing_pct;
            if (CalcDistanceBetweenEntityOBB(params.target, params.attacker) > this.GetSpecialValueFor("red_val_distance")) {
                outamp = outamp * this.GetSpecialValueFor("red_val_amount") / 100;
            }
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_bloodseeker_8")) {
                let ampPct = this.GetCasterPlus().GetTalentValue("special_bonus_imba_bloodseeker_8", "value") / this.GetCasterPlus().GetTalentValue("special_bonus_imba_bloodseeker_8", "value2");
                let hpPct = (1 - this.GetParentPlus().GetHealth() / this.GetParentPlus().GetMaxHealth()) * 100;
                outamp = outamp + ampPct * hpPct;
            }
            return outamp;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(params: ModifierAttackEvent): number {
        if (!IsServer()) {
            return;
        }
        if (params.target == this.GetParentPlus()) {
            let inamp = this.damage_increase_incoming_pct;
            if (CalcDistanceBetweenEntityOBB(params.target, params.attacker) > this.GetSpecialValueFor("red_val_distance")) {
                inamp = inamp * this.GetSpecialValueFor("red_val_amount") / 100;
            }
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_bloodseeker_8")) {
                let ampPct = this.GetCasterPlus().GetTalentValue("special_bonus_imba_bloodseeker_8", "value") / this.GetCasterPlus().GetTalentValue("special_bonus_imba_bloodseeker_8", "value2");
                let hpPct = (1 - this.GetParentPlus().GetHealth() / this.GetParentPlus().GetMaxHealth()) * 100;
                inamp = inamp + ampPct * hpPct;
            }
            return inamp;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(params: ModifierInstanceEvent): void {
        if (!params.unit.IsIllusion() && !params.unit.IsTempestDouble() && !params.unit.IsOther() && !params.unit.IsBuilding()) {
            if ((params.attacker == this.GetParentPlus() || params.unit == this.GetParentPlus()) && params.attacker != params.unit && !params.attacker.IsOther() && !params.attacker.IsBuilding()) {
                let heal = params.unit.GetMaxHealth() * this.health_bonus_pct / 100;
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, params.attacker, heal, undefined);
                params.attacker.Heal(heal, this.GetAbilityPlus());
                let healFX = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_lifesteal.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetParentPlus());
                ParticleManager.ReleaseParticleIndex(healFX);
            } else if (params.unit.IsRealHero() && GFuncVector.AsVector(this.GetParentPlus().GetAbsOrigin() - params.unit.GetAbsOrigin()).Length2D() <= this.health_bonus_aoe) {
                let heal = params.unit.GetMaxHealth() * (this.health_bonus_pct / 100) * (this.health_bonus_share_percent * 0.01);
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, this.GetParentPlus(), heal, undefined);
                this.GetParentPlus().Heal(heal, this.GetAbilityPlus());
                let healFX = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_lifesteal.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetParentPlus());
                ParticleManager.ReleaseParticleIndex(healFX);
            }
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_bloodseeker_7")) {
            if (params.unit == this.GetParentPlus() || params.attacker == this.GetParentPlus()) {
                let frenzy_duration = this.GetCasterPlus().GetTalentValue("special_bonus_imba_bloodseeker_7", "duration");
                params.attacker.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), this.modifier_frenzy, {
                    duration: frenzy_duration
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_bloodrage_blood_frenzy extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public particle_frenzy: any;
    public ms_bonus_pct: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.particle_frenzy = "particles/hero/bloodseeker/bloodseeker_blood_frenzy_ring.vpcf";
        this.ms_bonus_pct = this.caster.GetTalentValue("special_bonus_imba_bloodseeker_7", "ms_bonus_pct");
        let particle_frenzy_fx = ResHelper.CreateParticleEx(this.particle_frenzy, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
        ParticleManager.SetParticleControl(particle_frenzy_fx, 0, this.parent.GetAbsOrigin());
        this.AddParticle(particle_frenzy_fx, false, false, -1, false, false);
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(this.ms_bonus_pct);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetStackCount();
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
}
@registerAbility()
export class imba_bloodseeker_blood_bath extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "bloodseeker_blood_bath";
    }
    GetAOERadius(): number {
        let radius = this.GetSpecialValueFor("radius");
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_bloodseeker_5")) {
            radius = radius + this.GetCasterPlus().GetTalentValue("special_bonus_imba_bloodseeker_5", "distance");
        }
        return radius;
    }
    GetCooldown(level: number): number {
        let talent_reduction = 0;
        if (this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_bloodseeker_9")) {
            talent_reduction = this.GetSpecialValueFor("cooldown_reduction_talent");
        }
        return super.GetCooldown(level) - talent_reduction;
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasAbility("special_bonus_imba_bloodseeker_9") && this.GetCasterPlus().findAbliityPlus("special_bonus_imba_bloodseeker_9").IsTrained() && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_bloodseeker_9")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_special_bonus_imba_bloodseeker_9", {});
        }
    }
    OnSpellStart(): void {
        let vPos = this.GetCursorPosition();
        let caster = this.GetCasterPlus();
        if (!caster.HasTalent("special_bonus_imba_bloodseeker_5")) {
            this.FormBloodRiteCircle(caster, vPos);
        } else {
            let circles = caster.GetTalentValue("special_bonus_imba_bloodseeker_5", "circles");
            let distance = caster.GetTalentValue("special_bonus_imba_bloodseeker_5", "distance");
            let caster_pos = caster.GetAbsOrigin();
            let direction = GFuncVector.AsVector(vPos - caster_pos).Normalized();
            let front_point = vPos + direction * distance as Vector;
            this.FormBloodRiteCircle(caster, front_point);
            for (let i = 1; i <= circles - 1; i += 1) {
                let vector_direction;
                if (i % 2 == 0) {
                    vector_direction = this.Orthogonal(direction, false);
                } else {
                    vector_direction = this.Orthogonal(direction, true);
                }
                let final_circle_position = vPos + vector_direction * distance as Vector;
                this.FormBloodRiteCircle(caster, final_circle_position);
            }
        }
    }
    FormBloodRiteCircle(caster: IBaseNpc_Plus, vPos: Vector) {
        AddFOWViewer(caster.GetTeamNumber(), vPos, this.GetSpecialValueFor("vision_aoe"), this.GetSpecialValueFor("vision_duration"), true);
        let radius = this.GetSpecialValueFor("radius");
        EmitSoundOn("Hero_Bloodseeker.BloodRite.Cast", caster);
        EmitSoundOnLocationWithCaster(vPos, "Hero_Bloodseeker.BloodRite", caster);
        let bloodriteFX = ResHelper.CreateParticleEx("particles/units/heroes/hero_bloodseeker/bloodseeker_bloodritual_ring.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
        ParticleManager.SetParticleControl(bloodriteFX, 0, vPos);
        ParticleManager.SetParticleControl(bloodriteFX, 1, Vector(radius, radius, radius));
        ParticleManager.SetParticleControl(bloodriteFX, 3, vPos);
        this.AddTimer(this.GetSpecialValueFor("delay"), () => {
            EmitSoundOnLocationWithCaster(vPos, "hero_bloodseeker.bloodRite.silence", caster);
            ParticleManager.DestroyParticle(bloodriteFX, false);
            ParticleManager.ReleaseParticleIndex(bloodriteFX);
            let targets = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), vPos, undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0, false);
            if (GameFunc.GetCount(targets) > 0) {
                let overheal = caster.AddNewModifier(caster, this, "modifier_imba_blood_bath_buff_stats", {
                    duration: this.GetSpecialValueFor("overheal_duration")
                });
            }
            let rupture: imba_bloodseeker_rupture;
            if (caster.HasTalent("special_bonus_imba_bloodseeker_2") && caster.HasAbility("imba_bloodseeker_rupture")) {
                rupture = caster.findAbliityPlus<imba_bloodseeker_rupture>("imba_bloodseeker_rupture");
            }
            for (const [_, target] of ipairs(targets)) {
                let damage = this.GetSpecialValueFor("damage");
                target.AddNewModifier(caster, this, "modifier_imba_blood_bath_debuff_silence", {
                    duration: this.GetSpecialValueFor("silence_duration") * (1 - target.GetStatusResistance())
                });
                if (rupture) {
                    if (rupture.GetLevel() >= 1) {
                        rupture.from_blood_rite = true;
                        rupture.OnSpellStart(target);
                    }
                    let distance = radius - GFuncVector.AsVector(target.GetAbsOrigin() - vPos).Length2D();
                    let knockback = {
                        should_stun: false,
                        knockback_duration: 0.3,
                        duration: 0.3,
                        knockback_distance: distance,
                        knockback_height: 0,
                        center_x: vPos.x,
                        center_y: vPos.y,
                        center_z: vPos.z
                    }
                    target.RemoveModifierByName("modifier_knockback");
                    target.AddNewModifier(caster, this, "modifier_knockback", knockback);
                }
                ApplyDamage({
                    victim: target,
                    attacker: this.GetCasterPlus(),
                    damage: damage,
                    damage_type: this.GetAbilityDamageType(),
                    ability: this
                });
            }
        });
    }
    Orthogonal(vec: Vector, clockwise: boolean) {
        let vector = Vector(-vec.y, vec.x, 0);
        if (!clockwise) {
            vector = vector * (-1) as Vector;
        }
        return vector;
    }
}
@registerModifier()
export class modifier_imba_blood_bath_debuff_silence extends BaseModifier_Plus {
    public cdr: any;
    Init(p_0: any,): void {
        this.cdr = 1 - this.GetAbilityPlus().GetTalentSpecialValueFor("cooldown_reduction") / 100;
    }

    // DeclareFunctions = function () {
    //     let funcs = {
    //         1: Enum_MODIFIER_EVENT.ON_DEATH
    //     }
    //     return funcs;
    // }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(params: ModifierInstanceEvent) {
        if (params.unit == this.GetParentPlus() && params.unit.IsRealHero()) {
            for (let i = 0; i <= 16; i += 1) {
                let ability = this.GetCasterPlus().GetAbilityByIndex(i);
                if (ability && !ability.IsCooldownReady()) {
                    let cd = ability.GetCooldownTimeRemaining();
                    ability.EndCooldown();
                    ability.StartCooldown(cd * this.cdr);
                }
            }
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_bloodseeker_4")) {
            return false;
        }
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_SILENCED]: true
        };
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_silence.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
}
@registerModifier()
export class modifier_imba_blood_bath_buff_stats extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public overheal: any;
    public particle_overheal: any;
    IsHidden(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.overheal = this.GetSpecialValueFor("dmg_to_overheal") * 0.01;
        this.particle_overheal = "particles/hero/bloodseeker/blood_bath_power.vpcf";
        let particle_overheal_fx = ResHelper.CreateParticleEx(this.particle_overheal, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.caster);
        ParticleManager.SetParticleControl(particle_overheal_fx, 0, this.caster.GetAbsOrigin());
        this.AddParticle(particle_overheal_fx, false, false, -1, false, true);
    }
    BeRefresh(p_0: any,): void {
        this.overheal = this.GetSpecialValueFor("dmg_to_overheal") * 0.01;
        this.SetStackCount(0);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_HEALTH_BONUS,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(params: ModifierInstanceEvent): void {
        if (params.attacker == this.GetParentPlus() && params.inflictor == this.GetAbilityPlus()) {
            let bonusHP = params.damage * this.overheal;
            this.SetStackCount(this.GetStackCount() + bonusHP);
            // this.GetParentPlus().CalculateStatBonus(true);
            this.GetParentPlus().Heal(bonusHP, this.GetAbilityPlus());
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_HEALTH_BONUS)
    CC_GetModifierExtraHealthBonus( /** params */): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_special_bonus_imba_bloodseeker_9 extends BaseModifier_Plus {
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
export class imba_bloodseeker_thirst extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "bloodseeker_thirst";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_thirst_passive";
    }
}
@registerModifier()
export class modifier_imba_thirst_passive extends BaseModifier_Plus {
    public minhp: any;
    public maxhp: any;
    public movespeed: number;
    public damage: number;
    public deathstick: any;
    IsHidden(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        this.minhp = this.GetSpecialValueFor("max_threshold_pct");
        this.maxhp = this.GetSpecialValueFor("visibility_threshold_pct");
        this.movespeed = this.GetSpecialValueFor("bonus_movement_speed") / (this.minhp - this.maxhp);
        this.damage = this.GetSpecialValueFor("bonus_damage") / (this.minhp - this.maxhp);
        this.deathstick = this.GetSpecialValueFor("stick_time");
        if (!IsServer()) {
            return;
        }
        if (!this.GetCasterPlus().HasModifier("modifier_bloodseeker_thirst")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_bloodseeker_thirst", {});
        }
        this.StartIntervalThink(0.1);
    }
    BeRefresh(p_0: any,): void {
        this.minhp = this.GetSpecialValueFor("max_threshold_pct");
        this.maxhp = this.GetSpecialValueFor("visibility_threshold_pct");
        this.movespeed = this.GetSpecialValueFor("bonus_movement_speed") / (this.minhp - this.maxhp);
        this.damage = this.GetSpecialValueFor("bonus_damage") / (this.minhp - this.maxhp);
        this.deathstick = this.GetSpecialValueFor("stick_time");
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.GetParentPlus().PassivesDisabled()) {
                this.GetParentPlus().RemoveModifierByNameAndCaster("modifier_bloodseeker_thirst", this.GetCasterPlus());
            } else if (!this.GetParentPlus().HasModifier("modifier_bloodseeker_thirst") && this.GetAbilityPlus()) {
                this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_bloodseeker_thirst", {});
            }
            let enemies = FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_DEAD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_ANY_ORDER, false);
            let hpDeficit = 0;
            for (const [_, enemy] of ipairs(enemies)) {
                if (this.GetCasterPlus().PassivesDisabled() || !this.GetCasterPlus().IsAlive()) {
                    enemy.RemoveModifierByName("modifier_imba_thirst_debuff_vision");
                } else {
                    enemy.TempData().thirstDeathTimer = enemy.TempData().thirstDeathTimer || 0;
                    if (enemy && !enemy.IsNull() && (enemy.IsRealHero() || enemy.IsClone()) && enemy.IsAlive() || (!enemy.IsAlive() && enemy.TempData().thirstDeathTimer < this.deathstick)) {
                        if (enemy.GetHealthPercent() < this.minhp) {
                            let enemyHp = (this.minhp - enemy.GetHealthPercent());
                            if (enemyHp > (this.minhp - this.maxhp) && !enemy.IsMagicImmune()) {
                                enemyHp = (this.minhp - this.maxhp);
                                enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_thirst_debuff_vision", {});
                            } else if (enemy.HasModifier("modifier_imba_thirst_debuff_vision")) {
                                enemy.RemoveModifierByName("modifier_imba_thirst_debuff_vision");
                            }
                            if (!enemy.IsAlive()) {
                                enemy.TempData().thirstDeathTimer += 0.1;
                            } else {
                                enemy.TempData().thirstDeathTimer = 0;
                            }
                            hpDeficit = hpDeficit + enemyHp;
                        }
                    }
                    if (enemy.GetHealthPercent() > this.maxhp && enemy.HasModifier("modifier_imba_thirst_debuff_vision")) {
                        enemy.RemoveModifierByName("modifier_imba_thirst_debuff_vision");
                    }
                }
            }
            this.SetStackCount(hpDeficit);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            3: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant( /** params */): number {
        return this.GetStackCount() * this.damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage( /** params */): number {
        return this.GetStackCount() * this.movespeed;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_bloodseeker/bloodseeker_thirst_owner.vpcf";
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(params: ModifierInstanceEvent): void {
        if (IsServer()) {
            if (params.attacker && params.attacker.GetTeam() == this.GetCasterPlus().GetTeam() && params.unit.GetTeam() != this.GetCasterPlus().GetTeam() && params.attacker.IsRealHero() && params.unit.IsRealHero()) {
                let duration = this.GetAbilityPlus().GetTalentSpecialValueFor("atk_buff_duration");
                let attackList = this.GetCasterPlus().FindAllModifiersByName("modifier_imba_thirst_haste") as modifier_imba_thirst_haste[];
                let confirmTheKill = false;
                for (const [_, modifier] of ipairs(attackList)) {
                    if (modifier.sourceUnit == params.unit) {
                        let attackerCount = 1;
                        if (params.attacker == this.GetCasterPlus()) {
                            attackerCount = 2;
                        }
                        confirmTheKill = true;
                        if (modifier.GetStackCount() <= attackerCount) {
                            modifier.SetStackCount(attackerCount);
                        }
                        modifier.SetDuration(duration, true);
                        return;
                    }
                }
                if (!confirmTheKill) {
                    let modifier = this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_thirst_haste", {
                        duration: duration
                    }) as modifier_imba_thirst_haste;
                    if (modifier) {
                        modifier.sourceUnit = params.unit;
                        let attackerCount = 1;
                        if (params.attacker == this.GetCasterPlus()) {
                            attackerCount = 2;
                        }
                        if (modifier.GetStackCount() <= attackerCount) {
                            modifier.SetStackCount(attackerCount);
                        }
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_thirst_haste extends BaseModifier_Plus {
    public movespeed: number;
    public damage: number;
    public sourceUnit: CDOTA_BaseNPC;
    BeCreated(p_0: any,): void {
        this.movespeed = this.GetSpecialValueFor("bonus_movement_speed_atk");
        this.damage = this.GetSpecialValueFor("bonus_damage_atk");
    }
    BeRefresh(p_0: any,): void {
        this.movespeed = this.GetSpecialValueFor("bonus_movement_speed_atk");
        this.damage = this.GetSpecialValueFor("bonus_damage_atk");
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant( /** params */): number {
        return this.GetStackCount() * this.damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage( /** params */): number {
        return this.GetStackCount() * this.movespeed;
    }
    IsHidden(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_thirst_debuff_vision extends BaseModifier_Plus {
    public visibility_threshold_pct: number;
    BeCreated(p_0: any,): void {
        this.visibility_threshold_pct = this.GetSpecialValueFor("visibility_threshold_pct");
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
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.GetParentPlus().GetHealthPercent() > this.visibility_threshold_pct) {
            this.Destroy();
        } else {
            return {
                [modifierstate.MODIFIER_STATE_INVISIBLE]: false
            };
        }
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_bloodseeker/bloodseeker_vision.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_thirst_vision.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return 8;
    }
    IsPurgable(): boolean {
        return false;
    }
}
@registerAbility()
export class imba_bloodseeker_thirst_v2 extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_bloodseeker_thirst_v2";
    }
}
@registerModifier()
export class modifier_bloodseeker_thirst_v2 extends BaseModifier_Plus {
    public health_percent_sum: any;
    public max_thirst_enemies: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    OnIntervalThink(): void {
        this.health_percent_sum = 0;
        this.max_thirst_enemies = 0;
        if (!this.GetParentPlus().PassivesDisabled()) {
            for (const [_, enemy] of ipairs(FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_DEAD, FindOrder.FIND_ANY_ORDER, false))) {
                if ((enemy.IsRealHero() || enemy.IsClone() || enemy.IsTempestDouble()) && enemy.GetHealthPercent() <= this.GetSpecialValueFor("min_bonus_pct") && (enemy.IsAlive() || enemy.HasModifier("modifier_bloodseeker_thirst_v2_vision"))) {
                    this.health_percent_sum = this.health_percent_sum + (this.GetSpecialValueFor("min_bonus_pct") - math.max(enemy.GetHealthPercent(), this.GetSpecialValueFor("max_bonus_pct")));
                    if (enemy.GetHealthPercent() <= this.GetSpecialValueFor("visibility_threshold_pct")) {
                        this.max_thirst_enemies = this.max_thirst_enemies + 1;
                        enemy.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_bloodseeker_thirst_v2_vision", {});
                    }
                }
            }
        }
        if (this.max_thirst_enemies >= 1 && !this.GetParentPlus().PassivesDisabled()) {
            if (!this.GetParentPlus().HasModifier("modifier_bloodseeker_thirst_v2_speed")) {
                this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_bloodseeker_thirst_v2_speed", {});
            }
        } else {
            if (this.GetParentPlus().HasModifier("modifier_bloodseeker_thirst_v2_speed")) {
                this.GetParentPlus().RemoveModifierByName("modifier_bloodseeker_thirst_v2_speed");
            }
        }
        this.SetStackCount(this.health_percent_sum * 100);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return (this.GetSpecialValueFor("bonus_movement_speed") / (this.GetSpecialValueFor("min_bonus_pct") - this.GetSpecialValueFor("max_bonus_pct"))) * this.GetStackCount() * 0.01;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return (this.GetSpecialValueFor("bonus_attack_speed") / (this.GetSpecialValueFor("min_bonus_pct") - this.GetSpecialValueFor("max_bonus_pct"))) * this.GetStackCount() * 0.01;
    }
}
@registerModifier()
export class modifier_bloodseeker_thirst_v2_speed extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_bloodseeker_thirst_v2_vision extends BaseModifier_Plus {
    public visibility_threshold_pct: number;
    public linger_duration: number;
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_bloodseeker/bloodseeker_vision.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_thirst_vision.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return 8;
    }
    BeCreated(p_0: any,): void {
        this.visibility_threshold_pct = this.GetSpecialValueFor("visibility_threshold_pct");
        this.linger_duration = this.GetSpecialValueFor("linger_duration");
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.GetParentPlus().GetHealthPercent() > this.visibility_threshold_pct) {
            this.Destroy();
        } else {
            return {
                [modifierstate.MODIFIER_STATE_INVISIBLE]: false
            };
        }
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION,
            2: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
    CC_GetModifierProvidesFOWVision(): 0 | 1 {
        return 1;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetParentPlus()) {
            if (!this.GetParentPlus().IsReincarnating || !this.GetParentPlus().IsReincarnating()) {
                this.SetDuration(this.linger_duration, true);
            } else {
                this.Destroy();
            }
        }
    }
}
@registerAbility()
export class imba_bloodseeker_rupture extends BaseAbility_Plus {
    public from_blood_rite: any;
    GetAbilityTextureName(): string {
        return "bloodseeker_rupture";
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return super.GetCastRange(location, target) + this.GetCasterPlus().GetTalentValue("special_bonus_imba_bloodseeker_rupture_cast_range");
    }
    GetCooldown(nLevel: number): number {
        if (this.GetCasterPlus().HasScepter()) {
            return 0;
        }
        return super.GetCooldown(nLevel);
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_rupture_charges";
    }
    OnSpellStart(target?: IBaseNpc_Plus): void {
        let hTarget = target || this.GetCursorTarget();
        let caster = this.GetCasterPlus();
        let modifier_rupture_charges = "modifier_imba_rupture_charges";
        if (!IsServer()) {
            return;
        }
        if (target) {
            hTarget.AddNewModifier(caster, this, "modifier_imba_rupture_debuff_dot", {
                duration: 0.3
            });
        } else {
            if (hTarget.TriggerSpellAbsorb(this)) {
                return;
            }
            hTarget.AddNewModifier(caster, this, "modifier_imba_rupture_debuff_dot", {
                duration: this.GetSpecialValueFor("duration") * (1 - hTarget.GetStatusResistance())
            });
            EmitSoundOn("hero_bloodseeker.rupture.cast", caster);
            EmitSoundOn("hero_bloodseeker.rupture", hTarget);
            if (RollPercentage(15)) {
                EmitSoundOn("Imba.BloodseekerBadDay", hTarget);
            }
        }
        if (!target && hTarget.GetHealthPercent() > this.GetSpecialValueFor("damage_initial_pct")) {
            let hpBurn = hTarget.GetHealthPercent() - this.GetSpecialValueFor("damage_initial_pct");
            let damage = hTarget.GetMaxHealth() * hpBurn * 0.01;
            let damage_table = {
                victim: hTarget,
                attacker: caster,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                ability: this,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_DAMAGE_MULTIPLIERS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION
            }
            ApplyDamage(damage_table);
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_bloodseeker_3")) {
                caster.Heal(damage, this);
                let healFX = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_lifesteal.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, caster);
                ParticleManager.ReleaseParticleIndex(healFX);
            }
        }
        if (caster.HasScepter() && (!this.from_blood_rite || this.IsStolen()) && this.GetAbilityIndex() != 0) {
            let modifier_rupture_charges_handler = caster.FindModifierByName(modifier_rupture_charges);
            if (modifier_rupture_charges_handler) {
                modifier_rupture_charges_handler.DecrementStackCount();
                this.StartCooldown(0.25);
            }
        }
        this.from_blood_rite = false;
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_bloodseeker_rupture_cast_range") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_bloodseeker_rupture_cast_range")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_bloodseeker_rupture_cast_range"), "modifier_special_bonus_imba_bloodseeker_rupture_cast_range", {});
        }
    }
}
@registerModifier()
export class modifier_imba_rupture_debuff_dot extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public movedamage: number;
    public attackdamage: number;
    public castdamage: number;
    public damagecap: number;
    public prevLoc: any;
    public movedamage_think: number;
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.movedamage = this.GetParentPlus().GetHealth() * this.ability.GetSpecialValueFor("movement_damage_pct") / 100 / 100;
        this.attackdamage = this.ability.GetSpecialValueFor("attack_damage");
        this.castdamage = this.ability.GetSpecialValueFor("cast_damage");
        this.damagecap = this.ability.GetTalentSpecialValueFor("damage_cap_amount");
        this.prevLoc = this.parent.GetAbsOrigin();
        this.movedamage_think = this.ability.GetSpecialValueFor("movement_damage_pct") / 100;
        if (IsServer()) {
            this.StartIntervalThink(this.GetSpecialValueFor("damage_cap_interval"));
        }
    }

    OnIntervalThink() {
        let distance = GFuncVector.AsVector(this.prevLoc - this.parent.GetAbsOrigin()).Length2D();
        if (distance < this.damagecap) {
            this.movedamage = this.movedamage_think;
            let move_damage = distance * this.movedamage;
            if (move_damage > 0) {
                ApplyDamage({
                    victim: this.parent,
                    attacker: this.caster,
                    damage: move_damage,
                    damage_type: this.ability.GetAbilityDamageType(),
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    ability: this.ability
                });
                if (this.caster.HasTalent("special_bonus_imba_bloodseeker_3")) {
                    this.caster.Heal(move_damage, this.ability);
                    let healFX = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_lifesteal.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.caster);
                    ParticleManager.ReleaseParticleIndex(healFX);
                }
            }
        }
        this.prevLoc = this.GetParentPlus().GetAbsOrigin();
    }
    // DeclareFunctions = function () {
    //     return {
    //         1: Enum_MODIFIER_EVENT.ON_ABILITY_START,
    //         2: Enum_MODIFIER_EVENT.ON_ATTACK_START
    //     };
    // }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_START)
    CC_OnAbilityStart(params: ModifierAbilityEvent) {
        if (params.unit == this.parent) {
            ApplyDamage({
                victim: this.parent,
                attacker: this.caster,
                damage: this.castdamage,
                damage_type: this.ability.GetAbilityDamageType(),
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NON_LETHAL,
                ability: this.ability
            });
            if (this.caster.HasTalent("special_bonus_imba_bloodseeker_3")) {
                this.caster.Heal(this.castdamage, this.ability);
                let healFX = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_lifesteal.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.caster);
                ParticleManager.ReleaseParticleIndex(healFX);
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    CC_OnAttackStart(params: ModifierAttackEvent) {
        if (params.attacker == this.parent) {
            ApplyDamage({
                victim: this.parent,
                attacker: this.caster,
                damage: this.attackdamage,
                damage_type: this.ability.GetAbilityDamageType(),
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NON_LETHAL,
                ability: this.ability
            });
            if (this.caster.HasTalent("special_bonus_imba_bloodseeker_3")) {
                this.caster.Heal(this.castdamage, this.ability);
                let healFX = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_lifesteal.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.caster);
                ParticleManager.ReleaseParticleIndex(healFX);
            }
        }
    }
    BeDestroy() {
        StopSoundEvent("Imba.BloodseekerBadDay", this.parent);
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_bloodseeker/bloodseeker_rupture.vpcf";
    }
}
@registerModifier()
export class modifier_imba_rupture_charges extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public modifier_charge: any;
    public max_charge_count: number;
    public charge_replenish_rate: any;
    public modifier_charge_handler: any;
    public turned_on: any;
    IsHidden(): boolean {
        if (this.GetCasterPlus().HasScepter()) {
            return false;
        }
        return true;
    }
    IsDebuff(): boolean {
        return false;
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
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.modifier_charge = "modifier_imba_rupture_charges";
            this.max_charge_count = this.ability.GetSpecialValueFor("rupture_charges");
            this.charge_replenish_rate = this.ability.GetSpecialValueFor("scepter_charge_replenish_rate");
            this.SetStackCount(this.max_charge_count);

            // if (this.caster.IsRealHero()) {
            //     this.SetStackCount(this.max_charge_count);
            // } else {
            //     let playerid = this.caster.GetPlayerID();
            //     let real_hero = playerid.GetAssignedHero();
            //     if (hero.HasModifier(this.modifier_charge)) {
            //         this.modifier_charge_handler = hero.FindModifierByName(this.modifier_charge);
            //         if (this.modifier_charge_handler) {
            //             this.SetStackCount(this.modifier_charge_handler.GetStackCount());
            //             this.SetDuration(this.modifier_charge_handler.GetRemainingTime(), true);
            //         }
            //     }
            // }
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (!this.turned_on) {
                this.turned_on = true;
                this.BeCreated({});
            }
            let stacks = this.GetStackCount();
            if (stacks > 0) {
                this.ability.SetActivated(true);
            } else {
                this.ability.SetActivated(false);
            }
            if (stacks == this.max_charge_count) {
                return undefined;
            }
            if (this.GetRemainingTime() < 0) {
                this.IncrementStackCount();
            }
        }
    }
    OnStackCountChanged(old_stack_count: number): void {
        if (IsServer()) {
            if (!this.turned_on) {
                return undefined;
            }
            let stacks = this.GetStackCount();
            let true_replenish_cooldown = this.charge_replenish_rate;
            if (stacks == 0) {
                this.ability.EndCooldown();
                this.ability.StartCooldown(this.GetRemainingTime());
            }
            if (stacks == 1 && !this.ability.IsCooldownReady()) {
                this.ability.EndCooldown();
            }
            let lost_stack;
            if (old_stack_count > stacks) {
                lost_stack = true;
            } else {
                lost_stack = false;
            }
            if (!lost_stack) {
                if (stacks < this.max_charge_count) {
                    this.SetDuration(true_replenish_cooldown, true);
                } else {
                    this.SetDuration(-1, true);
                }
            } else {
                if (old_stack_count == this.max_charge_count) {
                    this.SetDuration(true_replenish_cooldown, true);
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(keys: ModifierAbilityEvent): void {
        if (IsServer()) {
            let ability = keys.ability;
            let unit = keys.unit;
            if (unit == this.caster && (ability.GetName() == "item_refresher" || ability.GetName() == "item_refresher_shard")) {
                this.SetStackCount(this.max_charge_count);
            }
        }
    }
    DestroyOnExpire(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_bloodseeker_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_bloodseeker_5 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_bloodseeker_7 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_bloodseeker_rupture_cast_range extends BaseModifier_Plus {
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
