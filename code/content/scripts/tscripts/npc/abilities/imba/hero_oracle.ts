
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_oracle_fortunes_end extends BaseAbility_Plus {
    public target: IBaseNpc_Plus;
    public channel_sound: any;
    public attack_sound: any;
    public target_sound: any;
    public channel_particle: any;
    public tgt_particle: any;
    public effect_name: any;
    public aoe_particle_name: any;
    public modifier_name: any;
    public autocast_state: any;
    public fortunes_particle: any;
    public target_particle: any;
    public aoe_particle: any;
    public damage_particle: ParticleID;
    GetAbilityTextureName(): string {
        if (!this.GetCasterPlus().HasModifier("modifier_imba_oracle_alter_self")) {
            return "oracle_fortunes_end";
        } else {
            return "oracle/fortunes_end_alter";
        }
    }
    GetAOERadius(): number {
        if (!this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("radius");
        } else {
            return this.GetSpecialValueFor("radius") + this.GetSpecialValueFor("scepter_bonus_radius");
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (!this.GetCasterPlus().HasScepter()) {
            return super.GetCastRange(location, target);
        } else {
            return super.GetCastRange(location, target) + this.GetSpecialValueFor("scepter_bonus_range");
        }
    }
    OnSpellStart(): void {
        this.target = this.GetCursorTarget();
        this.channel_sound = "Hero_Oracle.FortunesEnd.Channel";
        this.attack_sound = "Hero_Oracle.FortunesEnd.Attack";
        this.target_sound = "Hero_Oracle.FortunesEnd.Target";
        this.channel_particle = "particles/units/heroes/hero_oracle/oracle_fortune_channel.vpcf";
        this.tgt_particle = "particles/units/heroes/hero_oracle/oracle_fortune_cast_tgt.vpcf";
        this.effect_name = "particles/units/heroes/hero_oracle/oracle_fortune_prj.vpcf";
        this.aoe_particle_name = "particles/units/heroes/hero_oracle/oracle_fortune_aoe.vpcf";
        this.modifier_name = "modifier_imba_oracle_fortunes_end_purge";
        if (this.GetCasterPlus().HasModifier("modifier_imba_oracle_alter_self")) {
            this.channel_sound = "Hero_Oracle.FortunesEnd.Channel_Alter";
            this.attack_sound = "Hero_Oracle.FortunesEnd.Attack_Alter";
            this.target_sound = "Hero_Oracle.FortunesEnd.Target_Alter";
            this.channel_particle = "particles/econ/items/oracle/oracle_fortune_ti7/oracle_fortune_ti7_channel.vpcf";
            this.tgt_particle = "particles/econ/items/oracle/oracle_fortune_ti7/oracle_fortune_ti7_cast_tgt.vpcf";
            this.effect_name = "particles/econ/items/oracle/oracle_fortune_ti7/oracle_fortune_ti7_proj.vpcf";
            this.aoe_particle_name = "particles/econ/items/oracle/oracle_fortune_ti7/oracle_fortune_ti7_aoe.vpcf";
            this.modifier_name = "modifier_imba_oracle_fortunes_end_purge_alter";
        }
        this.autocast_state = this.GetAutoCastState();
        this.GetCasterPlus().EmitSound(this.channel_sound);
        if (this.GetCasterPlus().GetUnitName().includes("oracle") && RollPercentage(50)) {
            this.GetCasterPlus().EmitSound("oracle_orac_fortunesend_0" + RandomInt(1, 6));
        }
        if (this.fortunes_particle) {
            ParticleManager.DestroyParticle(this.fortunes_particle, false);
            ParticleManager.ReleaseParticleIndex(this.fortunes_particle);
        }
        this.fortunes_particle = ResHelper.CreateParticleEx(this.channel_particle, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(this.fortunes_particle, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetCasterPlus().GetAbsOrigin(), true);
        this.target_particle = ResHelper.CreateParticleEx(this.tgt_particle, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCursorTarget());
        ParticleManager.ReleaseParticleIndex(this.target_particle);
    }
    OnChannelFinish(bInterrupted: boolean): void {
        this.GetCasterPlus().StopSound(this.channel_sound);
        this.GetCasterPlus().EmitSound(this.attack_sound);
        if (this.fortunes_particle) {
            ParticleManager.DestroyParticle(this.fortunes_particle, false);
            ParticleManager.ReleaseParticleIndex(this.fortunes_particle);
        }
        ProjectileManager.CreateTrackingProjectile({
            Target: this.target,
            Source: this.GetCasterPlus(),
            Ability: this,
            EffectName: this.effect_name,
            iMoveSpeed: this.GetSpecialValueFor("bolt_speed"),
            vSourceLoc: this.GetCasterPlus().GetAbsOrigin(),
            bDrawsOnMinimap: false,
            bDodgeable: false,
            bIsAttack: false,
            bVisibleToEnemies: true,
            bReplaceExisting: false,
            flExpireTime: GameRules.GetGameTime() + 10.0,
            bProvidesVision: false,
            iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_ATTACK_1,
            ExtraData: {
                charge_pct: ((GameRules.GetGameTime() - this.GetChannelStartTime()) / this.GetChannelTime()),
                target_sound: this.target_sound,
                aoe_particle_name: this.aoe_particle_name,
                modifier_name: this.modifier_name,
                autocast_state: this.autocast_state
            }
        });
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, data: any): boolean | void {
        if (target && data.charge_pct && !target.TriggerSpellAbsorb(this)) {
            if (!data.autocast_state || data.autocast_state == 0) {
                this.ApplyFortunesEnd(target, data.target_sound, data.aoe_particle_name, data.modifier_name, data.charge_pct);
            } else {
                target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_oracle_fortunes_end_delay", {
                    duration: this.GetSpecialValueFor("mergence_delay"),
                    target_sound: data.target_sound,
                    aoe_particle_name: data.aoe_particle_name,
                    modifier_name: data.modifier_name,
                    charge_pct: data.charge_pct
                });
            }
        }
    }
    ApplyFortunesEnd(target: IBaseNpc_Plus, target_sound: string, aoe_particle_name: string, modifier_name: string, charge_pct: number) {
        let radius = this.GetSpecialValueFor("radius");
        if (this.GetCasterPlus().HasScepter()) {
            radius = this.GetSpecialValueFor("radius") + this.GetSpecialValueFor("scepter_bonus_radius");
        }
        EmitSoundOnLocationWithCaster(target.GetAbsOrigin(), target_sound, this.GetCasterPlus());
        if (aoe_particle_name) {
            this.aoe_particle = ResHelper.CreateParticleEx(aoe_particle_name, ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
            ParticleManager.SetParticleControl(this.aoe_particle, 0, target.GetAbsOrigin());
            ParticleManager.SetParticleControl(this.aoe_particle, 2, Vector(radius, radius, radius));
            ParticleManager.ReleaseParticleIndex(this.aoe_particle);
        }
        if (target.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            target.Purge(false, true, false, false, false);
        }
        if (target.HasModifier("modifier_imba_oracle_fates_edict")) {
            target.RemoveModifierByName("modifier_imba_oracle_fates_edict");
        }
        if (target.HasModifier("modifier_imba_oracle_fates_edict_alter")) {
            target.RemoveModifierByName("modifier_imba_oracle_fates_edict_alter");
        }
        for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), target.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
            this.damage_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_oracle/oracle_fortune_dmg.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy);
            ParticleManager.SetParticleControl(this.damage_particle, 1, target.GetAbsOrigin());
            ParticleManager.SetParticleControl(this.damage_particle, 3, enemy.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(this.damage_particle);
            enemy.Purge(true, false, false, false, false);
            enemy.AddNewModifier(this.GetCasterPlus(), this, modifier_name, {
                duration: (math.max(this.GetTalentSpecialValueFor("maximum_purge_duration") * math.min(charge_pct, 1), this.GetSpecialValueFor("minimum_purge_duration")) * (1 - enemy.GetStatusResistance()))
            });
            ApplyDamage({
                victim: enemy,
                damage: this.GetSpecialValueFor("damage"),
                damage_type: this.GetAbilityDamageType(),
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this
            });
        }
    }
}
@registerModifier()
export class modifier_imba_oracle_fortunes_end_delay extends BaseModifier_Plus {
    public texture_name: any;
    public target_sound: any;
    public aoe_particle_name: any;
    public modifier_name: any;
    public charge_pct: number;
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    IgnoreTenacity() {
        return true;
    }
    GetTexture(): string {
        if (this.texture_name) {
            return this.texture_name;
        } else {
            return "oracle_fortunes_end";
        }
    }
    BeCreated(params: any): void {
        this.texture_name = "oracle_fortunes_end";
        if (this.GetCasterPlus().HasModifier("modifier_imba_oracle_alter_self")) {
            this.texture_name = "oracle/fortunes_end_alter";
        }
        if (!IsServer()) {
            return;
        }
        this.target_sound = params.target_sound;
        this.aoe_particle_name = params.aoe_particle_name;
        this.modifier_name = params.modifier_name;
        this.charge_pct = params.charge_pct;
    }
    BeDestroy(): void {
        if (!IsServer() || !this.GetAbilityPlus() || !this.GetParentPlus().IsAlive() || this.GetRemainingTime() > 0) {
            return;
        }
        this.GetAbilityPlus<imba_oracle_fortunes_end>().ApplyFortunesEnd(this.GetParentPlus(), this.target_sound, this.aoe_particle_name, this.modifier_name, this.charge_pct);
    }
}
@registerModifier()
export class modifier_imba_oracle_fortunes_end_purge extends BaseModifier_Plus {
    GetTexture(): string {
        return "oracle_fortunes_end";
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_oracle/oracle_fortune_purge.vpcf";
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.GetAbilityPlus() && this.GetCasterPlus().HasScepter() && (this.GetElapsedTime() / (this.GetElapsedTime() + this.GetRemainingTime())) <= this.GetSpecialValueFor("scepter_stun_percentage") * 0.01) {
            return {
                [modifierstate.MODIFIER_STATE_STUNNED]: true,
                [modifierstate.MODIFIER_STATE_ROOTED]: true,
                [modifierstate.MODIFIER_STATE_INVISIBLE]: false
            };
        } else {
            return {
                [modifierstate.MODIFIER_STATE_ROOTED]: true,
                [modifierstate.MODIFIER_STATE_INVISIBLE]: false
            };
        }
    }
}
@registerModifier()
export class modifier_imba_oracle_fortunes_end_purge_alter extends BaseModifier_Plus {
    public particle: any;
    GetTexture(): string {
        return "oracle/fortunes_end_alter";
    }
    GetEffectName(): string {
        return "particles/econ/items/oracle/oracle_fortune_ti7/oracle_fortune_ti7_purge.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_dark_willow/dark_willow_wisp_spell_fear_debuff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(this.particle, 60, Vector(255, 0, 0));
        ParticleManager.SetParticleControl(this.particle, 61, Vector(1, 0, 0));
        this.AddParticle(this.particle, false, false, -1, true, true);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.GetAbilityPlus() && this.GetCasterPlus().HasScepter() && (this.GetElapsedTime() / (this.GetElapsedTime() + this.GetRemainingTime())) <= this.GetSpecialValueFor("scepter_stun_percentage") * 0.01) {
            return {
                [modifierstate.MODIFIER_STATE_STUNNED]: true,
                [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true,
                [modifierstate.MODIFIER_STATE_INVISIBLE]: false
            };
        } else {
            return {
                [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true,
                [modifierstate.MODIFIER_STATE_INVISIBLE]: false
            };
        }
    }
}
@registerAbility()
export class imba_oracle_fates_edict extends BaseAbility_Plus {
    public cast_sound: any;
    public modifier_name: any;
    public edict_modifier: any;
    GetAbilityTextureName(): string {
        if (!this.GetCasterPlus().HasModifier("modifier_imba_oracle_alter_self")) {
            return "oracle_fates_edict";
        } else {
            return "oracle/fates_edict_alter";
        }
    }
    GetCooldown(level: number): number {
        return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_oracle_fates_edict_cooldown");
    }
    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        if (target.TriggerSpellAbsorb(this)) {
            return;
        }
        this.cast_sound = "Hero_Oracle.FatesEdict.Cast";
        this.modifier_name = "modifier_imba_oracle_fates_edict";
        if (this.GetCasterPlus().HasModifier("modifier_imba_oracle_alter_self")) {
            this.cast_sound = "Hero_Oracle.FatesEdict.Cast_Alter";
            this.modifier_name = "modifier_imba_oracle_fates_edict_alter";
        }
        if (!this.GetAutoCastState()) {
            this.ApplyFatesEdict(target, this.cast_sound, this.modifier_name);
        } else {
            target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_oracle_fates_edict_delay", {
                duration: this.GetSpecialValueFor("decree_delay"),
                cast_sound: this.cast_sound,
                modifier_name: this.modifier_name
            });
        }
    }
    ApplyFatesEdict(target: IBaseNpc_Plus, cast_sound: string, modifier_name: string) {
        this.GetCasterPlus().EmitSound(cast_sound);
        target.EmitSound("Hero_Oracle.FatesEdict");
        if (this.GetCasterPlus().GetUnitName().includes("oracle") && RollPercentage(50)) {
            if (target.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
                if (target != this.GetCasterPlus()) {
                    this.GetCasterPlus().EmitSound("oracle_orac_fatesedict_0" + RandomInt(1, 6));
                } else {
                    this.GetCasterPlus().EmitSound("oracle_orac_fatesedict_1" + RandomInt(0, 7));
                }
            } else {
                this.GetCasterPlus().EmitSound("oracle_orac_fatesedict_0" + RandomInt(7, 9));
            }
        }
        this.edict_modifier = target.AddNewModifier(this.GetCasterPlus(), this, this.modifier_name, {
            duration: this.GetSpecialValueFor("duration")
        });
        if (this.edict_modifier && target.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
            this.edict_modifier.SetDuration(this.GetSpecialValueFor("duration") * (1 - target.GetStatusResistance()), true);
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_oracle_fates_edict_cooldown") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_oracle_fates_edict_cooldown")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_oracle_fates_edict_cooldown"), "modifier_special_bonus_imba_oracle_fates_edict_cooldown", {});
        }
    }
}
@registerModifier()
export class modifier_imba_oracle_fates_edict_delay extends BaseModifier_Plus {
    public texture_name: any;
    public cast_sound: any;
    public modifier_name: any;
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    IgnoreTenacity() {
        return true;
    }
    GetTexture(): string {
        if (this.texture_name) {
            return this.texture_name;
        } else {
            return "oracle_fates_edict";
        }
    }
    BeCreated(params: any): void {
        this.texture_name = "oracle_fates_edict";
        if (this.GetCasterPlus().HasModifier("modifier_imba_oracle_alter_self")) {
            this.texture_name = "oracle/fates_edict_alter";
        }
        if (!IsServer()) {
            return;
        }
        this.cast_sound = params.cast_sound;
        this.modifier_name = params.modifier_name;
    }
    BeDestroy(): void {
        if (!IsServer() || !this.GetAbilityPlus() || !this.GetParentPlus().IsAlive() || this.GetRemainingTime() > 0) {
            return;
        }
        this.GetAbilityPlus<imba_oracle_fates_edict>().ApplyFatesEdict(this.GetParentPlus(), this.cast_sound, this.modifier_name);
    }
}
@registerModifier()
export class modifier_imba_oracle_fates_edict extends BaseModifier_Plus {
    public magic_damage_resistance_pct_tooltip: number;
    public disarm_particle: any;
    IgnoreTenacity() {
        return this.GetParentPlus().GetTeamNumber() == this.GetCasterPlus().GetTeamNumber();
    }
    IsDebuff(): boolean {
        return true;
    }
    GetTexture(): string {
        return "oracle_fates_edict";
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_oracle/oracle_fatesedict.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.magic_damage_resistance_pct_tooltip = this.GetSpecialValueFor("magic_damage_resistance_pct_tooltip");
        if (!IsServer()) {
            return;
        }
        this.disarm_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_oracle/oracle_fatesedict_disarm.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus());
        this.AddParticle(this.disarm_particle, false, false, -1, true, true);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().StopSound("Hero_Oracle.FatesEdict");
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.magic_damage_resistance_pct_tooltip;
    }
}
@registerModifier()
export class modifier_imba_oracle_fates_edict_alter extends BaseModifier_Plus {
    public flash_particle: any;
    public mute_particle: any;
    IgnoreTenacity() {
        return this.GetParentPlus().GetTeamNumber() == this.GetCasterPlus().GetTeamNumber();
    }
    IsDebuff(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_oracle/oracle_fatesedict_alter.vpcf";
    }
    GetTexture(): string {
        return "oracle/fates_edict_alter";
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.flash_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_oracle/oracle_fatesedict_disarm_impact.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.ReleaseParticleIndex(this.flash_particle);
        this.mute_particle = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_muted.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus());
        this.AddParticle(this.mute_particle, false, false, -1, true, true);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().StopSound("Hero_Oracle.FatesEdict");
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_MUTED]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL)
    CC_GetAbsoluteNoDamagePhysical(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
}
@registerAbility()
export class imba_oracle_purifying_flames extends BaseAbility_Plus {
    public damage_sound: string;
    public hit_particle: any;
    public modifier_name: any;
    public target: IBaseNpc_Plus;
    public responses_allied: any;
    public responses_enemy: any;
    public purifying_particle: any;
    public purifying_cast_particle: any;
    public damage_flag: number;
    GetAbilityTextureName(): string {
        if (!this.GetCasterPlus().HasModifier("modifier_imba_oracle_alter_self")) {
            return "oracle_purifying_flames";
        } else {
            return "oracle/purifying_flames_alter";
        }
    }
    GetCastPoint(): number {
        if (!this.GetCasterPlus().HasScepter()) {
            return super.GetCastPoint();
        } else {
            return this.GetSpecialValueFor("castpoint_scepter");
        }
    }
    GetCooldown(level: number): number {
        return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_oracle_purifying_flames_cooldown");
    }
    OnSpellStart(): void {
        this.damage_sound = "Hero_Oracle.PurifyingFlames.Damage";
        this.hit_particle = "particles/units/heroes/hero_oracle/oracle_purifyingflames_hit.vpcf";
        this.modifier_name = "modifier_imba_oracle_purifying_flames";
        if (this.GetCasterPlus().HasModifier("modifier_imba_oracle_alter_self")) {
            this.damage_sound = "Hero_Oracle.PurifyingFlames.Damage_Alter";
            this.hit_particle = "particles/units/heroes/hero_oracle/oracle_purifyingflames_hit_alter.vpcf";
            this.modifier_name = "modifier_imba_oracle_purifying_flames_alter";
        }
        this.target = this.GetCursorTarget();
        if (this.target.TriggerSpellAbsorb(this)) {
            return;
        }
        this.target.EmitSound(this.damage_sound);
        this.target.EmitSound("Hero_Oracle.PurifyingFlames");
        if (this.GetCasterPlus().GetUnitName().includes("oracle")) {
            if (this.target.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
                if (RollPercentage(30)) {
                    if (!this.responses_allied) {
                        this.responses_allied = {
                            "1": "oracle_orac_purifyingflames_01",
                            "2": "oracle_orac_purifyingflames_02",
                            "3": "oracle_orac_purifyingflames_03",
                            "4": "oracle_orac_purifyingflames_04",
                            "5": "oracle_orac_purifyingflames_05",
                            "6": "oracle_orac_purifyingflames_08",
                            "7": "oracle_orac_purifyingflames_09",
                            "8": "oracle_orac_purifyingflames_11"
                        }
                    }
                    this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(this.responses_allied));
                }
            } else {
                if (RollPercentage(25)) {
                    if (!this.responses_enemy) {
                        this.responses_enemy = {
                            "1": "oracle_orac_purifyingflames_06",
                            "2": "oracle_orac_purifyingflames_07",
                            "3": "oracle_orac_purifyingflames_10",
                            "4": "oracle_orac_purifyingflames_12"
                        }
                    }
                    this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(this.responses_enemy));
                }
            }
        }
        this.purifying_particle = ResHelper.CreateParticleEx(this.hit_particle, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.target);
        ParticleManager.SetParticleControlEnt(this.purifying_particle, 1, this.target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.target.GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(this.purifying_particle);
        this.purifying_cast_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_oracle/oracle_purifyingflames_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(this.purifying_cast_particle, 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(this.purifying_cast_particle);
        if (this.target.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
            this.damage_flag = DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE;
        } else {
            this.damage_flag = DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NON_LETHAL;
        }
        if (!this.GetCasterPlus().HasModifier("modifier_imba_oracle_alter_self")) {
            ApplyDamage({
                victim: this.target,
                damage: this.GetSpecialValueFor("damage"),
                damage_type: this.GetAbilityDamageType(),
                damage_flags: this.damage_flag,
                attacker: this.GetCasterPlus(),
                ability: this
            });
        } else {
            this.target.ApplyHeal(this.GetSpecialValueFor("damage"), this);
        }
        this.target.AddNewModifier(this.GetCasterPlus(), this, this.modifier_name, {
            duration: this.GetSpecialValueFor("duration")
        });
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_oracle_purifying_flames_cooldown") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_oracle_purifying_flames_cooldown")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_oracle_purifying_flames_cooldown"), "modifier_special_bonus_imba_oracle_purifying_flames_cooldown", {});
        }
    }
}
@registerModifier()
export class modifier_imba_oracle_purifying_flames extends BaseModifier_Plus {
    public heal_per_second: any;
    public tick_rate: any;
    IgnoreTenacity() {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    GetTexture(): string {
        return "oracle_purifying_flames";
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_oracle/oracle_purifyingflames.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.heal_per_second = this.GetSpecialValueFor("heal_per_second");
        this.tick_rate = this.GetSpecialValueFor("tick_rate");
        if (!IsServer()) {
            return;
        }
        this.StartIntervalThink(this.tick_rate);
    }
    OnIntervalThink(): void {
        this.GetParentPlus().ApplyHeal(this.heal_per_second, this.GetAbilityPlus());
    }
}
@registerModifier()
export class modifier_imba_oracle_purifying_flames_alter extends BaseModifier_Plus {
    public heal_per_second: any;
    public tick_rate: any;
    public damage_flags: number;
    IgnoreTenacity() {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    GetTexture(): string {
        return "oracle/purifying_flames_alter";
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_oracle/oracle_purifyingflames_alter.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.heal_per_second = this.GetSpecialValueFor("heal_per_second");
        this.tick_rate = this.GetSpecialValueFor("tick_rate");
        if (!IsServer()) {
            return;
        }
        this.damage_flags = DOTADamageFlag_t.DOTA_DAMAGE_FLAG_IGNORES_PHYSICAL_ARMOR;
        if (this.GetParentPlus().GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            this.damage_flags = this.damage_flags + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NON_LETHAL;
        }
        this.StartIntervalThink(this.tick_rate);
    }
    OnIntervalThink(): void {
        if (!this.GetParentPlus().HasModifier("modifier_imba_oracle_fates_edict_alter")) {
            ApplyDamage({
                victim: this.GetParentPlus(),
                damage: this.heal_per_second,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                damage_flags: this.damage_flags,
                attacker: this.GetCasterPlus(),
                ability: this.GetAbilityPlus()
            });
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, this.GetParentPlus(), this.heal_per_second, undefined);
        }
    }
}
@registerAbility()
export class imba_oracle_alter_self extends BaseAbility_Plus {
    public particle: any;
    public particle_2: any;
    IsInnateAbility() {
        return true;
    }
    IsStealable(): boolean {
        return false;
    }
    GetAbilityTextureName(): string {
        if (!this.GetCasterPlus().HasModifier("modifier_imba_oracle_alter_self")) {
            return "oracle/alter_self";
        } else {
            return "oracle/alter_self_return";
        }
    }
    OnSpellStart(): void {
        if (!this.GetCasterPlus().HasModifier("modifier_imba_oracle_alter_self")) {
            this.GetCasterPlus().EmitSound("Hero_Oracle.Alter_Self");
            this.particle = ResHelper.CreateParticleEx("particles/econ/events/league_teleport_2014/teleport_end_ground_flash_league.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
            ParticleManager.ReleaseParticleIndex(this.particle);
            this.particle_2 = ResHelper.CreateParticleEx("particles/econ/events/ti9/hero_levelup_ti9_flash_hit_magic.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
            ParticleManager.ReleaseParticleIndex(this.particle_2);
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_oracle_alter_self", {});
        } else {
            this.GetCasterPlus().EmitSound("Hero_Oracle.Alter_Self_Base");
            this.particle = ResHelper.CreateParticleEx("particles/econ/events/league_teleport_2014/teleport_start_l_flash_league.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
            ParticleManager.ReleaseParticleIndex(this.particle);
            this.GetCasterPlus().RemoveModifierByName("modifier_imba_oracle_alter_self");
        }
        if (this.GetCasterPlus().HasAbility("imba_oracle_fortunes_end")) {
            this.GetCasterPlus().findAbliityPlus<imba_oracle_fortunes_end>("imba_oracle_fortunes_end").EndCooldown();
        }
        if (this.GetCasterPlus().HasAbility("imba_oracle_fates_edict")) {
            this.GetCasterPlus().findAbliityPlus<imba_oracle_fates_edict>("imba_oracle_fates_edict").EndCooldown();
        }
        if (this.GetCasterPlus().HasAbility("imba_oracle_purifying_flames")) {
            this.GetCasterPlus().findAbliityPlus<imba_oracle_purifying_flames>("imba_oracle_purifying_flames").EndCooldown();
        }
        this.particle = undefined;
        this.particle_2 = undefined;
    }
}
@registerModifier()
export class modifier_imba_oracle_alter_self extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetTexture(): string {
        return "oracle/alter_self";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_teleport_image.vpcf";
    }
}
@registerAbility()
export class imba_oracle_false_promise_alter extends BaseAbility_Plus {
    public responses: any;
    public false_promise_cast_particle: any;
    public false_promise_target_particle: any;
    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        if (!this.GetAutoCastState()) {
            if (target.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber() && !target.TriggerSpellAbsorb(this)) {
                this.ApplyFalsePromise(target);
            }
        } else {
            target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_oracle_false_promise_delay", {
                duration: this.GetSpecialValueFor("future_delay")
            });
        }
    }
    ApplyFalsePromise(target: IBaseNpc_Plus) {
        target.EmitSound("Hero_Oracle.FalsePromise.Target");
        EmitSoundOnClient("Hero_Oracle.FalsePromise.FP", target.GetPlayerOwner());
        if (this.GetCasterPlus().GetUnitName().includes("oracle") && target.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber() && RollPercentage(50)) {
            if (!this.responses) {
                this.responses = {
                    "1": "oracle_orac_falsepromise_01",
                    "2": "oracle_orac_falsepromise_02",
                    "3": "oracle_orac_falsepromise_03",
                    "4": "oracle_orac_falsepromise_04",
                    "5": "oracle_orac_falsepromise_06",
                    "6": "oracle_orac_falsepromise_11"
                }
            }
            this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(this.responses));
        }
        this.false_promise_cast_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_oracle/oracle_false_promise_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
        ParticleManager.SetParticleControl(this.false_promise_cast_particle, 2, this.GetCasterPlus().GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(this.false_promise_cast_particle);
        this.false_promise_target_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_oracle/oracle_false_promise_cast_enemy.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
        ParticleManager.ReleaseParticleIndex(this.false_promise_target_particle);
        this.GetCasterPlus().EmitSound("Hero_Oracle.False_Promise_Alter");
        target.Purge(true, false, false, false, false);
        target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_oracle_false_promise_timer_alter", {
            duration: this.GetTalentSpecialValueFor("duration")
        });
        if (this.GetCasterPlus().HasAbility("imba_oracle_false_promise")) {
            this.GetCasterPlus().findAbliityPlus<imba_oracle_false_promise>("imba_oracle_false_promise").StartCooldown(this.GetSpecialValueFor("alter_cooldown") * this.GetCasterPlus().GetCooldownReduction());
        }
    }
}
@registerAbility()
export class imba_oracle_false_promise extends BaseAbility_Plus {
    public responses: any;
    public false_promise_cast_particle: any;
    public false_promise_target_particle: any;
    OnUpgrade(): void {
        if (this.GetCasterPlus().HasAbility("imba_oracle_false_promise_alter")) {
            this.GetCasterPlus().findAbliityPlus<imba_oracle_false_promise_alter>("imba_oracle_false_promise_alter").SetLevel(this.GetLevel());
        }
    }
    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        if (!this.GetAutoCastState()) {
            this.ApplyFalsePromise(target);
        } else {
            target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_oracle_false_promise_delay", {
                duration: this.GetSpecialValueFor("future_delay")
            });
        }
    }
    ApplyFalsePromise(target: IBaseNpc_Plus) {
        target.EmitSound("Hero_Oracle.FalsePromise.Target");
        EmitSoundOnClient("Hero_Oracle.FalsePromise.FP", target.GetPlayerOwner());
        if (this.GetCasterPlus().GetUnitName().includes("oracle") && target.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber() && RollPercentage(50)) {
            if (!this.responses) {
                this.responses = {
                    "1": "oracle_orac_falsepromise_01",
                    "2": "oracle_orac_falsepromise_02",
                    "3": "oracle_orac_falsepromise_03",
                    "4": "oracle_orac_falsepromise_04",
                    "5": "oracle_orac_falsepromise_06",
                    "6": "oracle_orac_falsepromise_11"
                }
            }
            this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(this.responses));
        }
        this.false_promise_cast_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_oracle/oracle_false_promise_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
        ParticleManager.SetParticleControl(this.false_promise_cast_particle, 2, this.GetCasterPlus().GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(this.false_promise_cast_particle);
        this.false_promise_target_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_oracle/oracle_false_promise_cast_enemy.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
        ParticleManager.ReleaseParticleIndex(this.false_promise_target_particle);
        this.GetCasterPlus().EmitSound("Hero_Oracle.FalsePromise.Cast");
        target.Purge(false, true, false, true, true);
        target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_oracle_false_promise_timer", {
            duration: this.GetTalentSpecialValueFor("duration")
        });
        if (this.GetCasterPlus().HasAbility("imba_oracle_false_promise_alter")) {
            this.GetCasterPlus().findAbliityPlus<imba_oracle_false_promise_alter>("imba_oracle_false_promise_alter").StartCooldown(this.GetSpecialValueFor("alter_cooldown") * this.GetCasterPlus().GetCooldownReduction());
        }
    }
}
@registerModifier()
export class modifier_imba_oracle_false_promise_delay extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    IgnoreTenacity() {
        return true;
    }
    GetTexture(): string {
        if (this.GetParentPlus().GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            return "oracle_false_promise";
        } else {
            return "oracle/false_promise_alter";
        }
    }
    BeDestroy(): void {
        if (!IsServer() || !this.GetAbilityPlus() || !this.GetParentPlus().IsAlive() || this.GetRemainingTime() > 0) {
            return;
        }
        this.GetAbilityPlus<imba_oracle_false_promise_alter>().ApplyFalsePromise(this.GetParentPlus());
    }
}
@registerModifier()
export class modifier_imba_oracle_false_promise_timer extends BaseModifier_Plus {
    public overhead_particle: any;
    public heal_counter: number;
    public damage_instances: any[];
    public damage_counter: number;
    public invis_fade_delay: number;
    public invis_modifier: any;
    public responses: { [key: string]: string };
    public end_particle: any;
    public attacked_particle: any;
    DestroyOnExpire(): boolean {
        return !this.GetParentPlus().IsInvulnerable() && !this.GetParentPlus().HasModifier("modifier_imba_ball_lightning");
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_ULTRA;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetTexture(): string {
        return "oracle_false_promise";
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_oracle/oracle_false_promise.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.overhead_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_oracle/oracle_false_promise_indicator.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus());
        this.AddParticle(this.overhead_particle, false, false, -1, true, true);
        this.heal_counter = 0;
        this.damage_instances = []
        this.damage_counter = 0;
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_oracle_false_promise_invisibility")) {
            this.invis_fade_delay = 0.6;
            this.StartIntervalThink(this.invis_fade_delay);
        }
    }
    BeRefresh(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.heal_counter = this.heal_counter || 0;
        this.damage_instances = this.damage_instances || []
        this.damage_counter = this.damage_counter || 0;
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_oracle_false_promise_invisibility")) {
            this.invis_fade_delay = 0.6;
            this.StartIntervalThink(this.invis_fade_delay);
        }
    }
    OnIntervalThink(): void {
        this.invis_modifier = this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_generic_invisible", {});
        if (this.GetParentPlus().GetAggroTarget()) {
            this.GetParentPlus().MoveToTargetToAttack(this.GetParentPlus().GetAggroTarget());
        }
        this.StartIntervalThink(-1);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.damage_counter < this.heal_counter) {
            this.GetParentPlus().EmitSound("Hero_Oracle.FalsePromise.Healed");
            if (this.GetCasterPlus().GetUnitName().includes("oracle") && RollPercentage(25)) {
                this.responses = {
                    "1": "oracle_orac_falsepromise_14",
                    "2": "oracle_orac_falsepromise_15",
                    "3": "oracle_orac_falsepromise_17",
                    "4": "oracle_orac_falsepromise_18",
                    "5": "oracle_orac_falsepromise_19"
                }
                this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(this.responses));
            }
            this.end_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_oracle/oracle_false_promise_heal.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            ParticleManager.ReleaseParticleIndex(this.end_particle);
            this.GetParentPlus().ApplyHeal(this.heal_counter - this.damage_counter, this.GetAbilityPlus());
        } else {
            this.GetParentPlus().EmitSound("Hero_Oracle.FalsePromise.Damaged");
            this.end_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_oracle/oracle_false_promise_dmg.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            ParticleManager.ReleaseParticleIndex(this.end_particle);
            let divine_favor_modifier = this.GetParentPlus().findBuff("modifier_imba_chen_divine_favor");
            let divine_favor_ability = undefined;
            let divine_favor_caster = undefined;
            let divine_favor_duration = undefined;
            if (divine_favor_modifier) {
                divine_favor_ability = divine_favor_modifier.GetAbilityPlus();
                divine_favor_caster = divine_favor_modifier.GetCasterPlus();
                divine_favor_duration = divine_favor_modifier.GetRemainingTime();
                divine_favor_modifier.Destroy();
            }
            for (const [_, instance] of GameFunc.iPair(this.damage_instances)) {
                if (this.heal_counter > 0) {
                    if (this.heal_counter < instance.damage) {
                        instance.damage = instance.damage - this.heal_counter;
                        ApplyDamage(instance);
                    }
                    let subtraction_value = math.min(instance.damage, this.heal_counter);
                    this.heal_counter = this.heal_counter - subtraction_value;
                    this.damage_counter = this.damage_counter - subtraction_value;
                } else {
                    ApplyDamage(instance);
                }
            }
            if (divine_favor_ability && divine_favor_caster) {
                this.GetParentPlus().AddNewModifier(divine_favor_caster, divine_favor_ability, "modifier_imba_chen_divine_favor", {
                    duration: divine_favor_duration
                });
            }
            if (this.GetCasterPlus().GetUnitName().includes("oracle")) {
                if (!this.GetParentPlus().IsAlive() && RollPercentage(15)) {
                    this.responses = {
                        "1": "oracle_orac_falsepromise_05",
                        "2": "oracle_orac_falsepromise_07",
                        "3": "oracle_orac_falsepromise_08",
                        "4": "oracle_orac_falsepromise_09",
                        "5": "oracle_orac_falsepromise_10",
                        "6": "oracle_orac_falsepromise_12",
                        "7": "oracle_orac_falsepromise_13",
                        "8": "oracle_failure_01"
                    }
                } else if (this.GetParentPlus().GetHealth() >= 100) {
                    this.responses = {
                        "1": "oracle_orac_falsepromise_14",
                        "2": "oracle_orac_falsepromise_15",
                        "3": "oracle_orac_falsepromise_17",
                        "4": "oracle_orac_falsepromise_18",
                        "5": "oracle_orac_falsepromise_19"
                    }
                }
                if (this.responses) {
                    this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(this.responses));
                }
            }
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, this.GetParentPlus(), this.damage_counter, undefined);
        }
        if (this.invis_modifier && !this.invis_modifier.IsNull()) {
            this.invis_modifier.Destroy();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            2: Enum_MODIFIER_EVENT.ON_HEAL_RECEIVED,
            3: GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_HEALING,
            4: Enum_MODIFIER_EVENT.ON_ATTACK,
            5: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(keys: ModifierAttackEvent): number {
        if (keys.attacker && this.GetRemainingTime() >= 0) {
            this.attacked_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_oracle/oracle_false_promise_attacked.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            ParticleManager.ReleaseParticleIndex(this.attacked_particle);
            let damage_flags = keys.damage_flags;
            if (bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) {
                damage_flags = damage_flags + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS;
            }
            if (bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION) {
                damage_flags = damage_flags + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION;
            }
            this.damage_instances.push({
                victim: this.GetParentPlus(),
                damage: keys.damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                damage_flags: damage_flags,
                attacker: keys.attacker,
                ability: keys.inflictor
            })
            this.damage_counter = this.damage_counter + keys.damage;
            ParticleManager.SetParticleControl(this.overhead_particle, 1, Vector(this.damage_counter - this.heal_counter, 0, 0));
            ParticleManager.SetParticleControl(this.overhead_particle, 2, Vector(this.heal_counter - this.damage_counter, 0, 0));
            this.SetStackCount(math.abs(this.damage_counter - this.heal_counter));
        }
        return -99999999;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_HEAL_RECEIVED)
    CC_OnHealReceived(keys: ModifierHealEvent): void {
        if (keys.unit == this.GetParentPlus() && this.GetRemainingTime() >= 0) {
            this.heal_counter = this.heal_counter + (keys.gain * 2);
            ParticleManager.SetParticleControl(this.overhead_particle, 1, Vector(this.damage_counter - this.heal_counter, 0, 0));
            ParticleManager.SetParticleControl(this.overhead_particle, 2, Vector(this.heal_counter - this.damage_counter, 0, 0));
            this.SetStackCount(math.abs(this.damage_counter - this.heal_counter));
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_HEALING)
    CC_GetDisableHealing( /** keys */): 0 | 1 {
        return 1;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_oracle_false_promise_invisibility") && keys.attacker == this.GetParentPlus() && !keys.no_attack_cooldown && this.invis_modifier && !this.invis_modifier.IsNull()) {
            this.StartIntervalThink(this.invis_fade_delay);
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(keys: ModifierAbilityEvent): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_oracle_false_promise_invisibility") && keys.unit == this.GetParentPlus() && this.invis_modifier && !this.invis_modifier.IsNull()) {
            this.StartIntervalThink(this.invis_fade_delay);
        }
    }
}
@registerModifier()
export class modifier_imba_oracle_false_promise_timer_alter extends BaseModifier_Plus {
    public alter_heal_pct: number;
    public false_promise_particle: any;
    public attacked_particle: any;
    IsPurgable(): boolean {
        return false;
    }
    IgnoreTenacity() {
        return true;
    }
    GetTexture(): string {
        return "oracle/false_promise_alter";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_electrical.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.alter_heal_pct = this.GetSpecialValueFor("alter_heal_pct");
        if (!IsServer()) {
            return;
        }
        this.false_promise_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_oracle/oracle_false_promise.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(this.false_promise_particle, 60, Vector(255, 0, 0));
        ParticleManager.SetParticleControl(this.false_promise_particle, 61, Vector(1, 0, 0));
        this.AddParticle(this.false_promise_particle, false, false, -1, true, true);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (keys.attacker == this.GetParentPlus()) {
            let alter_targets_modifier = keys.unit.FindModifierByNameAndCaster("modifier_imba_oracle_false_promise_timer_alter_targets", this.GetParentPlus()) as modifier_imba_oracle_false_promise_timer_alter_targets;
            if (!alter_targets_modifier) {
                alter_targets_modifier = keys.unit.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_oracle_false_promise_timer_alter_targets", {
                    duration: this.GetRemainingTime() + FrameTime(),
                    alter_heal_pct: this.alter_heal_pct
                }) as modifier_imba_oracle_false_promise_timer_alter_targets;
            }
            if (alter_targets_modifier.damage_instances) {
                this.attacked_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_oracle/oracle_false_promise_attacked.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, keys.unit);
                ParticleManager.SetParticleControl(this.attacked_particle, 60, Vector(255, 0, 0));
                ParticleManager.SetParticleControl(this.attacked_particle, 61, Vector(1, 0, 0));
                ParticleManager.ReleaseParticleIndex(this.attacked_particle);
                let damage_flags = keys.damage_flags;
                if (bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) {
                    damage_flags = damage_flags + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS;
                }
                if (bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION) {
                    damage_flags = damage_flags + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION;
                }
                alter_targets_modifier.damage_instances.push({
                    victim: keys.unit,
                    damage: keys.damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                    damage_flags: damage_flags,
                    attacker: keys.attacker,
                    ability: keys.inflictor
                });
                if (alter_targets_modifier.damage_counter) {
                    alter_targets_modifier.damage_counter = alter_targets_modifier.damage_counter + keys.damage;
                    alter_targets_modifier.SetStackCount(alter_targets_modifier.damage_counter);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_oracle_false_promise_timer_alter_targets extends BaseModifier_Plus {
    public alter_heal_pct: number;
    public damage_counter: number;
    public damage_instances: any[];
    public end_particle: any;
    DestroyOnExpire(): boolean {
        return !this.GetParentPlus().IsInvulnerable() && !this.GetParentPlus().HasModifier("modifier_imba_ball_lightning");
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    IsHidden(): boolean {
        return this.GetStackCount() <= 0;
    }
    IsPurgable(): boolean {
        return false;
    }
    IgnoreTenacity() {
        return true;
    }
    GetTexture(): string {
        return "oracle/false_promise_alter";
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_oracle/oracle_false_promise_indicator.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.alter_heal_pct = params.alter_heal_pct;
        this.damage_counter = 0;
        this.damage_instances = []
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().EmitSound("Hero_Oracle.FalsePromise.Damaged");
        this.end_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_oracle/oracle_false_promise_dmg.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.ReleaseParticleIndex(this.end_particle);
        let divine_favor_modifier = this.GetParentPlus().findBuff("modifier_imba_chen_divine_favor");
        let divine_favor_ability = undefined;
        let divine_favor_caster = undefined;
        let divine_favor_duration = undefined;
        if (divine_favor_modifier) {
            divine_favor_ability = divine_favor_modifier.GetAbilityPlus();
            divine_favor_caster = divine_favor_modifier.GetCasterPlus();
            divine_favor_duration = divine_favor_modifier.GetRemainingTime();
            divine_favor_modifier.Destroy();
        }
        for (const [_, instance] of GameFunc.iPair(this.damage_instances)) {
            ApplyDamage(instance);
        }
        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, this.GetParentPlus(), this.damage_counter, undefined);
        if (divine_favor_ability && divine_favor_caster) {
            this.GetParentPlus().AddNewModifier(divine_favor_caster, divine_favor_ability, "modifier_imba_chen_divine_favor", {
                duration: divine_favor_duration
            });
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_HEAL_RECEIVED
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_HEAL_RECEIVED)
    CC_OnHealReceived(keys: ModifierHealEvent): void {
        if (keys.unit == this.GetParentPlus() && this.GetRemainingTime() >= 0) {
            let heal_split_amount = (keys.gain * this.alter_heal_pct * 0.01) / GameFunc.GetCount(this.damage_instances);
            for (let instance = 0; instance < GameFunc.GetCount(this.damage_instances); instance++) {
                this.damage_instances[instance].damage = this.damage_instances[instance].damage - heal_split_amount;
            }
            this.damage_counter = this.damage_counter - (keys.gain * this.alter_heal_pct * 0.01);
            this.SetStackCount(this.damage_counter);
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_oracle_fortunes_end_max_duration extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_oracle_false_promise_invisibility extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_oracle_false_promise_duration extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_oracle_purifying_flames_cooldown extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_oracle_fates_edict_cooldown extends BaseModifier_Plus {
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
