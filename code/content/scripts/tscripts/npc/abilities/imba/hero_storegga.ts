
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionBoth_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class storegga_arm_slam extends BaseAbility_Plus {
    public animation_time: number;
    public initial_delay: number;
    ProcsMagicStick(): boolean {
        return false;
    }
    OnAbilityPhaseStart(): boolean {
        if (IsServer()) {
            this.animation_time = this.GetSpecialValueFor("animation_time");
            this.initial_delay = this.GetSpecialValueFor("initial_delay");
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_storegga_arm_slam", {
                duration: this.animation_time,
                initial_delay: this.initial_delay
            });
        }
        return true;
    }
    OnAbilityPhaseInterrupted(): void {
        if (IsServer()) {
            this.GetCasterPlus().RemoveModifierByName("modifier_storegga_arm_slam");
        }
    }
    GetPlaybackRateOverride(): number {
        return 0.5;
    }
    GetCastRange(vLocation: Vector, hTarget: CDOTA_BaseNPC | undefined): number {
        if (IsServer()) {
            if (this.GetCasterPlus().findBuff<modifier_storegga_arm_slam>("modifier_storegga_arm_slam") != undefined) {
                return 99999;
            }
        }
        return super.GetCastRange(vLocation, hTarget);
    }
}
@registerAbility()
export class storegga_avalanche extends BaseAbility_Plus {
    public nChannelFX: any;
    public flChannelTime: any;
    public hThinker: any;
    public bStartedGesture: any;
    ProcsMagicStick(): boolean {
        return false;
    }
    GetChannelAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CHANNEL_ABILITY_1;
    }
    GetPlaybackRateOverride(): number {
        return 1;
    }
    OnAbilityPhaseStart(): boolean {
        if (IsServer()) {
            this.nChannelFX = ResHelper.CreateParticleEx("particles/act_2/storegga_channel.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        }
        return true;
    }
    OnAbilityPhaseInterrupted(): void {
        if (IsServer()) {
            ParticleManager.DestroyParticle(this.nChannelFX, false);
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            this.flChannelTime = 0.0;
            this.hThinker = BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_storegga_avalanche_thinker", {
                duration: this.GetChannelTime()
            }, this.GetCasterPlus().GetOrigin(), this.GetCasterPlus().GetTeamNumber(), false);
        }
    }
    OnChannelThink(flInterval: number): void {
        if (IsServer()) {
            this.flChannelTime = this.flChannelTime + flInterval;
            if (this.flChannelTime > 9.2 && this.bStartedGesture != true) {
                this.bStartedGesture = true;
                this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2_END);
            }
        }
    }
    OnChannelFinish(bInterrpted: boolean): void {
        if (IsServer()) {
            ParticleManager.DestroyParticle(this.nChannelFX, false);
            if (this.hThinker != undefined && this.hThinker.IsNull() == false) {
                this.hThinker.ForceKill(false);
            }
        }
    }
}
@registerAbility()
export class storegga_grab extends BaseAbility_Plus {
    public animation_time: number;
    public initial_delay: number;
    ProcsMagicStick(): boolean {
        return false;
    }
    OnAbilityPhaseStart(): boolean {
        if (IsServer()) {
            if (this.GetCasterPlus().findBuff("modifier_storegga_grabbed_buff") != undefined) {
                return;
            }
            this.animation_time = this.GetSpecialValueFor("animation_time");
            this.initial_delay = this.GetSpecialValueFor("initial_delay");
            let hBuff = this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_storegga_grab", {
                duration: this.animation_time,
                initial_delay: this.initial_delay
            }) as modifier_storegga_grab;
            if (hBuff != undefined) {
                hBuff.hTarget = this.GetCursorTarget();
            }
        }
        return true;
    }
    OnAbilityPhaseInterrupted(): void {
        if (IsServer()) {
            this.GetCasterPlus().RemoveModifierByName("modifier_storegga_grab");
        }
    }
    GetPlaybackRateOverride(): number {
        return 0.35;
    }
    GetCastRange(vLocation: Vector, hTarget: CDOTA_BaseNPC | undefined): number {
        if (IsServer()) {
            if (this.GetCasterPlus().findBuff<modifier_storegga_grab>("modifier_storegga_grab") != undefined) {
                return 99999;
            }
        }
        return super.GetCastRange(vLocation, hTarget);
    }
}
@registerAbility()
export class storegga_grab_throw extends BaseAbility_Plus {
    public hBuff: any;
    public hThrowTarget: IBaseNpc_Plus;
    public hThrowBuff: modifier_storegga_grabbed_debuff;
    public throw_speed: number;
    public impact_radius: number;
    public stun_duration: number;
    public knockback_duration: number;
    public knockback_distance: number;
    public knockback_damage: number;
    public knockback_height: any;
    public vDirection: any;
    public flDist: any;
    public attach: any;
    public vSpawnLocation: any;
    public vEndPos: any;
    ProcsMagicStick(): boolean {
        return false;
    }
    OnAbilityPhaseStart(): boolean {
        if (IsServer()) {
        }
        return true;
    }
    OnAbilityPhaseInterrupted(): void {
        if (IsServer()) {
        }
    }
    GetPlaybackRateOverride(): number {
        return 0.7;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            this.hBuff = this.GetCasterPlus().findBuff<modifier_storegga_grabbed_buff>("modifier_storegga_grabbed_buff");
            if (this.hBuff == undefined) {
                return;
            }
            this.hThrowTarget = this.hBuff.hThrowObject;
            if (this.hThrowTarget == undefined) {
                this.GetCasterPlus().RemoveModifierByName("modifier_storegga_grabbed_buff");
                return;
            }
            this.hThrowBuff = this.hThrowTarget.findBuff<modifier_storegga_grabbed_debuff>("modifier_storegga_grabbed_debuff");
            if (this.hThrowBuff == undefined) {
                this.GetCasterPlus().RemoveModifierByName("modifier_storegga_grabbed_buff");
                return;
            }
            this.throw_speed = this.GetSpecialValueFor("throw_speed");
            this.impact_radius = this.GetSpecialValueFor("impact_radius");
            this.stun_duration = this.GetSpecialValueFor("stun_duration");
            this.knockback_duration = this.GetSpecialValueFor("knockback_duration");
            this.knockback_distance = this.GetSpecialValueFor("knockback_distance");
            this.knockback_damage = this.GetSpecialValueFor("knockback_damage");
            this.knockback_height = this.GetSpecialValueFor("knockback_height");
            if (this.hThrowTarget.GetUnitName() == "npc_dota_storegga_rock") {
                this.throw_speed = this.throw_speed * 1.5;
                this.impact_radius = this.impact_radius * 0.75;
                this.knockback_damage = this.knockback_damage * 0.75;
            }
            if (this.hThrowTarget.GetUnitName() == "npc_dota_storegga_rock2") {
                this.throw_speed = this.throw_speed * 1;
                this.impact_radius = this.impact_radius * 1.25;
                this.knockback_damage = this.knockback_damage * 1.5;
            }
            if (this.hThrowTarget.GetUnitName() == "npc_dota_storegga_rock3") {
                this.throw_speed = this.throw_speed * 0.5;
                this.impact_radius = this.impact_radius * 1.5;
                this.knockback_damage = this.knockback_damage * 3;
            }
            this.vDirection = this.GetCursorPosition() - this.GetCasterPlus().GetOrigin();
            this.flDist = this.vDirection.Length2D() - 300;
            this.vDirection.z = 0.0;
            this.vDirection = this.vDirection.Normalized();
            this.attach = this.GetCasterPlus().ScriptLookupAttachment("attach_attack2");
            this.vSpawnLocation = this.GetCasterPlus().GetAttachmentOrigin(this.attach);
            this.vEndPos = this.vSpawnLocation + this.vDirection * this.flDist;
            let info: CreateLinearProjectileOptions = {
                EffectName: "",
                Ability: this,
                vSpawnOrigin: this.vSpawnLocation,
                fStartRadius: this.impact_radius,
                fEndRadius: this.impact_radius,
                vVelocity: this.vDirection * this.throw_speed as Vector,
                fDistance: this.flDist,
                Source: this.GetCasterPlus(),
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
            }
            this.hThrowBuff.nProjHandle = ProjectileManager.CreateLinearProjectile(info);
            this.hThrowBuff.flHeight = this.vSpawnLocation.z - GetGroundHeight(this.GetCasterPlus().GetOrigin(), this.GetCasterPlus());
            this.hThrowBuff.flTime = this.flDist / this.throw_speed;
            this.GetCasterPlus().RemoveModifierByName("modifier_storegga_grabbed_buff");
            EmitSoundOn("Hero_Tiny.Toss.Target", this.GetCasterPlus());
        }
    }
    OnProjectileHit(hTarget: CDOTA_BaseNPC | undefined, vLocation: Vector): boolean | void {
        if (IsServer()) {
            if (hTarget != undefined) {
                return;
            }
            EmitSoundOnLocationWithCaster(vLocation, "Ability.TossImpact", this.GetCasterPlus());
            if (this.hThrowTarget != undefined) {
                this.hThrowBuff.Destroy();
                if (this.hThrowTarget.IsRealUnit()) {
                    let damageInfo = {
                        victim: this.hThrowTarget,
                        attacker: this.GetCasterPlus(),
                        damage: this.knockback_damage / 3,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                        ability: this
                    }
                    ApplyDamage(damageInfo);
                    if (this.hThrowTarget.IsAlive() == false) {
                        let nFXIndex = ResHelper.CreateParticleEx("particles/units/heroes/hero_phantom_assassin/phantom_assassin_crit_impact.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
                        ParticleManager.SetParticleControlEnt(nFXIndex, 0, this.hThrowTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.hThrowTarget.GetOrigin(), true);
                        ParticleManager.SetParticleControl(nFXIndex, 1, this.hThrowTarget.GetOrigin());
                        ParticleManager.SetParticleControlForward(nFXIndex, 1, -this.GetCasterPlus().GetForwardVector() as Vector)
                        ParticleManager.SetParticleControlEnt(nFXIndex, 10, this.hThrowTarget, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, undefined, this.hThrowTarget.GetOrigin(), true);
                        ParticleManager.ReleaseParticleIndex(nFXIndex);
                        EmitSoundOn("Hero_PhantomAssassin.Spatter", this.hThrowTarget);
                    } else {
                        this.hThrowTarget.AddNewModifier(this.GetCasterPlus(), this, "modifier_stunned", {
                            duration: this.stun_duration * (1 - this.hThrowTarget.GetStatusResistance())
                        });
                    }
                }
                let nFXIndex = ResHelper.CreateParticleEx("particles/test_particle/ogre_melee_smash.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
                ParticleManager.SetParticleControl(nFXIndex, 0, GetGroundPosition(vLocation, this.hThrowTarget));
                ParticleManager.SetParticleControl(nFXIndex, 1, Vector(this.impact_radius, this.impact_radius, this.impact_radius));
                ParticleManager.ReleaseParticleIndex(nFXIndex);
                let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), vLocation, this.GetCasterPlus(), this.impact_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, 0, false);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    if (enemy != undefined && enemy.IsInvulnerable() == false && enemy != this.hThrowTarget) {
                        let damageInfo = {
                            victim: enemy,
                            attacker: this.GetCasterPlus(),
                            damage: this.knockback_damage,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                            ability: this
                        }
                        ApplyDamage(damageInfo);
                        if (enemy.IsAlive() == false) {
                            let nFXIndex = ResHelper.CreateParticleEx("particles/units/heroes/hero_phantom_assassin/phantom_assassin_crit_impact.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
                            ParticleManager.SetParticleControlEnt(nFXIndex, 0, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetOrigin(), true);
                            ParticleManager.SetParticleControl(nFXIndex, 1, enemy.GetOrigin());
                            ParticleManager.SetParticleControlForward(nFXIndex, 1, -this.GetCasterPlus().GetForwardVector() as Vector);
                            ParticleManager.SetParticleControlEnt(nFXIndex, 10, enemy, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, undefined, enemy.GetOrigin(), true);
                            ParticleManager.ReleaseParticleIndex(nFXIndex);
                            EmitSoundOn("Hero_PhantomAssassin.Spatter", enemy);
                        } else {
                            let kv = {
                                center_x: vLocation.x,
                                center_y: vLocation.y,
                                center_z: vLocation.z,
                                should_stun: true,
                                duration: this.knockback_duration,
                                knockback_duration: this.knockback_duration,
                                knockback_distance: this.knockback_distance,
                                knockback_height: this.knockback_height
                            }
                            enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_stunned", {
                                duration: this.knockback_duration * (1 - enemy.GetStatusResistance())
                            });
                        }
                    }
                }
            }
            return false;
        }
    }
}
@registerAbility()
export class storegga_passive extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_storegga_passive";
    }
}
@registerModifier()
export class modifier_storegga_arm_slam extends BaseModifier_Plus {
    public damage_radius: number;
    public damage: number;
    public stun_duration: number;
    public bAttackBegin: any;
    public hHitTargets: IBaseNpc_Plus[];
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.damage_radius = this.GetSpecialValueFor("damage_radius");
            this.damage = this.GetSpecialValueFor("damage");
            this.stun_duration = this.GetSpecialValueFor("stun_duration");
            this.bAttackBegin = false;
            this.hHitTargets = []
            this.StartIntervalThink(kv["initial_delay"] / 2);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.bAttackBegin == false) {
                this.bAttackBegin = true;
                return;
            }
            let attach1 = this.GetParentPlus().ScriptLookupAttachment("attach_attack1");
            let attach2 = this.GetParentPlus().ScriptLookupAttachment("attach_attack1_2");
            let vLocation1 = this.GetParentPlus().GetAttachmentOrigin(attach1);
            vLocation1 = GetGroundPosition(vLocation1, this.GetParentPlus());
            let vLocation2 = this.GetParentPlus().GetAttachmentOrigin(attach2);
            vLocation2 = GetGroundPosition(vLocation2, this.GetParentPlus());
            let Locations = [] as Vector[]
            Locations.push(vLocation1);
            Locations.push(vLocation2);
            for (const [_, vPos] of GameFunc.iPair(Locations)) {
                let nFXIndex = ResHelper.CreateParticleEx("particles/test_particle/ogre_melee_smash.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
                ParticleManager.SetParticleControl(nFXIndex, 0, vPos);
                ParticleManager.SetParticleControl(nFXIndex, 1, Vector(this.damage_radius, this.damage_radius, this.damage_radius));
                ParticleManager.ReleaseParticleIndex(nFXIndex);
                let enemies = FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), vPos, this.GetParentPlus(), this.damage_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, 0, false);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    if (enemy != undefined && enemy.IsInvulnerable() == false && this.HasHitTarget(enemy) == false) {
                        let damageInfo: ApplyDamageOptions = {
                            victim: enemy,
                            attacker: this.GetCasterPlus(),
                            damage: this.damage,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                            ability: this.GetAbilityPlus()
                        }
                        ApplyDamage(damageInfo);
                        this.AddHitTarget(enemy);
                        if (enemy.IsAlive() == false) {
                            let nFXIndex = ResHelper.CreateParticleEx("particles/units/heroes/hero_phantom_assassin/phantom_assassin_crit_impact.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
                            ParticleManager.SetParticleControlEnt(nFXIndex, 0, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetOrigin(), true);
                            ParticleManager.SetParticleControl(nFXIndex, 1, enemy.GetOrigin());
                            ParticleManager.SetParticleControlForward(nFXIndex, 1, -this.GetCasterPlus().GetForwardVector() as Vector)
                            ParticleManager.SetParticleControlEnt(nFXIndex, 10, enemy, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, undefined, enemy.GetOrigin(), true);
                            ParticleManager.ReleaseParticleIndex(nFXIndex);
                            EmitSoundOn("Dungeon.BloodSplatterImpact", enemy);
                            EmitSoundOn("Hero_PhantomAssassin.Spatter", enemy);
                        } else {
                            enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_stunned", {
                                duration: this.stun_duration
                            });
                        }
                    }
                }
            }
            EmitSoundOnLocationWithCaster(vLocation1, "Ability.TossImpact", this.GetCasterPlus());
            this.StartIntervalThink(-1);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_TURNING,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_TURNING)
    CC_GetModifierDisableTurning( /** params */): 0 | 1 {
        if (IsServer()) {
            if (this.bAttackBegin == true) {
                return 1;
            }
        }
        return 0;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE)
    CC_GetModifierTurnRate_Percentage( /** params */): number {
        return -99;
    }
    HasHitTarget(hTarget: IBaseNpc_Plus) {
        for (const [_, target] of GameFunc.iPair(this.hHitTargets)) {
            if (target == hTarget) {
                return true;
            }
        }
        return false;
    }
    AddHitTarget(hTarget: IBaseNpc_Plus) {
        this.hHitTargets.push(hTarget);
    }
}
@registerModifier()
export class modifier_storegga_avalanche_thinker extends BaseModifier_Plus {
    public interval: number;
    public slow_duration: number;
    public damage: number;
    public radius: number;
    public movement: any;
    public Avalanches: any[];
    public hAvalancheTarget: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.interval = this.GetSpecialValueFor("interval");
            this.slow_duration = this.GetSpecialValueFor("slow_duration");
            this.damage = this.GetSpecialValueFor("damage");
            this.radius = this.GetSpecialValueFor("radius");
            this.movement = this.GetSpecialValueFor("movement");
            this.Avalanches = []
            let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST, false);
            this.hAvalancheTarget = enemies[RandomInt(1, GameFunc.GetCount(enemies))];
            this.OnIntervalThink();
            this.StartIntervalThink(this.interval);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.GetCasterPlus().IsNull()) {
                this.Destroy();
                return;
            }
            let vNewAvalancheDir1 = RandomVector(1);
            let vNewAvalancheDir2 = RandomVector(1);
            if (this.hAvalancheTarget != undefined && this.hAvalancheTarget.IsAlive()) {
                vNewAvalancheDir2 = this.hAvalancheTarget.GetOrigin() - this.GetCasterPlus().GetOrigin() as Vector;
            } else {
                let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST, false);
                this.hAvalancheTarget = enemies[RandomInt(1, GameFunc.GetCount(enemies))];
                if (this.hAvalancheTarget != undefined) {
                    vNewAvalancheDir2 = this.hAvalancheTarget.GetOrigin() - this.GetCasterPlus().GetOrigin() as Vector;
                }
            }
            EmitSoundOnLocationWithCaster(this.GetParentPlus().GetOrigin(), "Ability.Avalanche", this.GetCasterPlus());
            vNewAvalancheDir1 = vNewAvalancheDir1.Normalized();
            vNewAvalancheDir2 = vNewAvalancheDir2.Normalized();
            let vRadius = Vector(this.radius * .72, this.radius * .72, this.radius * .72);
            let nFXIndex1 = ResHelper.CreateParticleEx("particles/units/heroes/hero_tiny/tiny_avalanche.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
            ParticleManager.SetParticleControl(nFXIndex1, 0, this.GetParentPlus().GetOrigin());
            ParticleManager.SetParticleControl(nFXIndex1, 1, vRadius);
            ParticleManager.SetParticleControlForward(nFXIndex1, 0, vNewAvalancheDir1);
            this.AddParticle(nFXIndex1, false, false, -1, false, false);
            let nFXIndex2 = ResHelper.CreateParticleEx("particles/units/heroes/hero_tiny/tiny_avalanche.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
            ParticleManager.SetParticleControl(nFXIndex2, 0, this.GetParentPlus().GetOrigin());
            ParticleManager.SetParticleControl(nFXIndex2, 1, vRadius);
            ParticleManager.SetParticleControlForward(nFXIndex2, 0, vNewAvalancheDir2);
            this.AddParticle(nFXIndex2, false, false, -1, false, false);
            let Avalanche1 = {
                vCurPos: this.GetCasterPlus().GetOrigin(),
                vDir: vNewAvalancheDir1,
                nFX: nFXIndex1
            }
            let Avalanche2 = {
                vCurPos: this.GetCasterPlus().GetOrigin(),
                vDir: vNewAvalancheDir2,
                nFX: nFXIndex2
            }
            this.Avalanches.push(Avalanche1);
            this.Avalanches.push(Avalanche2);
            for (const [_, ava] of GameFunc.iPair(this.Avalanches)) {
                let vNewPos = ava.vCurPos + ava.vDir * this.movement;
                ava.vCurPos = vNewPos;
                ParticleManager.SetParticleControl(ava.nFX, 0, vNewPos);
                let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), vNewPos, undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST, false);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    if (enemy != undefined && enemy.IsInvulnerable() == false && enemy.IsMagicImmune() == false) {
                        let damageInfo = {
                            victim: enemy,
                            attacker: this.GetCasterPlus(),
                            damage: this.damage,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                            ability: this.GetAbilityPlus()
                        }
                        ApplyDamage(damageInfo);
                        enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_polar_furbolg_ursa_warrior_thunder_clap", {
                            duration: this.slow_duration
                        });
                    }
                }
            }
        }
    }
}

@registerModifier()
export class modifier_storegga_grab extends BaseModifier_Plus {
    public grab_radius: number;
    public min_hold_time: number;
    public max_hold_time: number;
    hTarget: IBaseNpc_Plus;


    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.grab_radius = this.GetSpecialValueFor("grab_radius");
            this.min_hold_time = this.GetSpecialValueFor("min_hold_time");
            this.max_hold_time = this.GetSpecialValueFor("max_hold_time");
            this.StartIntervalThink(kv["initial_delay"]);
            let nFXIndex = ResHelper.CreateParticleEx("particles/test_particle/generic_attack_crit_blur.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.GetParentPlus());
            ParticleManager.SetParticleControlEnt(nFXIndex, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", this.GetParentPlus().GetOrigin(), true);
            ParticleManager.ReleaseParticleIndex(nFXIndex);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.hTarget == undefined) {
                return;
            }
            let flDist = (this.hTarget.GetOrigin() - this.GetParentPlus().GetOrigin() as Vector).Length2D();
            if (flDist > 700) {
                return;
            }
            let hBuff = this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_storegga_grabbed_buff", {}) as modifier_storegga_grabbed_buff;
            if (hBuff != undefined) {
                this.GetCasterPlus().TempData().flThrowTimer = GameRules.GetGameTime() + RandomFloat(this.min_hold_time, this.max_hold_time);
                hBuff.hThrowObject = this.hTarget;
                this.hTarget.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_storegga_grabbed_debuff", {});
            }
            this.Destroy();
            return;
        }
    }
}
@registerModifier()
export class modifier_storegga_grabbed_buff extends BaseModifier_Plus {
    hThrowObject: IBaseNpc_Plus;
}

@registerModifier()
export class modifier_storegga_grabbed_debuff extends BaseModifierMotionBoth_Plus {
    public nProjHandle: any;
    public flTime: any;
    public flHeight: any;
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_IGNORE_INVULNERABLE;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.nProjHandle = -1;
            this.flTime = 0.0;
            this.flHeight = 0.0;
            if (!this.BeginMotionOrDestroy()) { return };
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION,
            2: Enum_MODIFIER_EVENT.ON_DEATH
        }
        return Object.values(funcs);
    } */
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true
        }
        return state;
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.GetParentPlus().RemoveHorizontalMotionController(this);
            this.GetParentPlus().RemoveVerticalMotionController(this);
        }
    }


    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (IsServer()) {
            let vLocation = undefined;
            if (this.nProjHandle == -1) {
                let attach = this.GetCasterPlus().ScriptLookupAttachment("attach_attack2");
                vLocation = this.GetCasterPlus().GetAttachmentOrigin(attach);
            } else {
                vLocation = ProjectileManager.GetLinearProjectileLocation(this.nProjHandle);
            }
            vLocation.z = 0.0;
            me.SetOrigin(vLocation);
        }
    }
    UpdateVerticalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (IsServer()) {
            let vMyPos = me.GetOrigin();
            if (this.nProjHandle == -1) {
                let attach = this.GetCasterPlus().ScriptLookupAttachment("attach_attack2");
                let vLocation = this.GetCasterPlus().GetAttachmentOrigin(attach);
                vMyPos.z = vLocation.z;
            } else {
                let flGroundHeight = GetGroundHeight(vMyPos, me);
                let flHeightChange = dt * this.flTime * this.flHeight * 1.3;
                vMyPos.z = math.max(vMyPos.z - flHeightChange, flGroundHeight);
            }
            me.SetOrigin(vMyPos);
        }
    }
    OnHorizontalMotionInterrupted(): void {
        if (IsServer()) {
            this.Destroy();
        }
    }
    OnVerticalMotionInterrupted(): void {
        if (IsServer()) {
            this.Destroy();
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation( /** params */): GameActivity_t {
        return GameActivity_t.ACT_DOTA_FLAIL;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(params: ModifierInstanceEvent): void {
        if (IsServer()) {
            if (params.unit == this.GetCasterPlus()) {
                this.Destroy();
            }
        }
    }
}
@registerModifier()
export class modifier_storegga_passive extends BaseModifier_Plus {
}
