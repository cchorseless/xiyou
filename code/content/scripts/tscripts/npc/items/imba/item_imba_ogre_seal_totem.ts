
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifierMotionBoth_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
const OGRE_MINIMUM_HEIGHT_ABOVE_LOWEST = 150;
const OGRE_MINIMUM_HEIGHT_ABOVE_HIGHEST = 33;
const OGRE_ACCELERATION_Z = 1250;
const OGRE_MAX_HORIZONTAL_ACCELERATION = 800;
@registerAbility()
export class item_imba_ogre_seal_totem extends BaseItem_Plus {
    public stun_duration: number;
    nPreviewFXIndex: ParticleID;
    radius: number;
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_ogre_seal_totem";
    }
    OnAbilityPhaseStart(): boolean {
        if (IsServer()) {
        }
        return true;
    }
    OnAbilityPhaseInterrupted(): void {
        if (IsServer()) {
            if (this.nPreviewFXIndex) {
                ParticleManager.DestroyParticle(this.nPreviewFXIndex, true);
            }
            this.GetCasterPlus().RemoveModifierByName("modifier_techies_suicide_leap_animation");
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            if (this.nPreviewFXIndex) {
                ParticleManager.DestroyParticle(this.nPreviewFXIndex, true);
            }
            this.stun_duration = this.GetSpecialValueFor("stun_duration");
            let vToTarget = this.GetCursorPosition() - this.GetCasterPlus().GetOrigin() as Vector;
            vToTarget = vToTarget.Normalized();
            let vLocation = this.GetCasterPlus().GetOrigin() + vToTarget * 25 as Vector;;
            let kv = {
                vLocX: vLocation.x,
                vLocY: vLocation.y,
                vLocZ: vLocation.z
            }
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_ogreseal_flop", kv);
            EmitSoundOn("Hero_Techies.BlastOff.Cast", this.GetCasterPlus());
        }
    }
    TryToDamage() {
        if (IsServer()) {
            let radius = this.GetSpecialValueFor("radius");
            let damage = this.GetSpecialValueFor("damage");
            let silence_duration = this.GetSpecialValueFor("silence_duration");
            let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetOrigin(), this.GetCasterPlus(), radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS, 0, false);
            if (GameFunc.GetCount(enemies) > 0) {
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    if (enemy != undefined && (!enemy.IsMagicImmune()) && (!enemy.IsInvulnerable())) {
                        let DamageInfo = {
                            victim: enemy,
                            attacker: this.GetCasterPlus(),
                            ability: this,
                            damage: damage,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
                        }
                        ApplyDamage(DamageInfo);
                        if (enemy.IsAlive() == false && enemy.GetUnitName() != "npc_dota_crate" && enemy.GetUnitName() != "npc_dota_vase") {
                            let nFXIndex = ResHelper.CreateParticleEx("particles/units/heroes/hero_phantom_assassin/phantom_assassin_crit_impact.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
                            ParticleManager.SetParticleControlEnt(nFXIndex, 0, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetOrigin(), true);
                            ParticleManager.SetParticleControl(nFXIndex, 1, enemy.GetOrigin());
                            ParticleManager.SetParticleControlForward(nFXIndex, 1, -this.GetCasterPlus().GetForwardVector() as Vector);
                            ParticleManager.SetParticleControlEnt(nFXIndex, 10, enemy, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, undefined, enemy.GetOrigin(), true);
                            ParticleManager.ReleaseParticleIndex(nFXIndex);
                            EmitSoundOn("Dungeon.BloodSplatterImpact", enemy);
                        } else {
                            enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_generic_stunned", {
                                duration: this.stun_duration * (1 - enemy.GetStatusResistance())
                            });
                        }
                    }
                }
            }
            EmitSoundOnLocationWithCaster(this.GetCasterPlus().GetOrigin(), "OgreTank.GroundSmash", this.GetCasterPlus());
            let nFXIndex = ResHelper.CreateParticleEx("particles/item/ogre_seal_totem/ogre_melee_smash.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
            ParticleManager.SetParticleControl(nFXIndex, 0, this.GetCasterPlus().GetOrigin());
            ParticleManager.SetParticleControl(nFXIndex, 1, Vector(this.radius, this.radius, this.radius));
            ParticleManager.ReleaseParticleIndex(nFXIndex);
            GridNav.DestroyTreesAroundPoint(this.GetCasterPlus().GetOrigin(), radius, false);
        }
    }
}
@registerModifier()
export class modifier_ogreseal_flop extends BaseModifierMotionBoth_Plus {
    public nHopCount: any;
    public flop_distances: { [k: string]: number };
    public bHorizontalMotionInterrupted: any;
    public bDamageApplied: any;
    public bTargetTeleported: any;
    public flTimer: any;
    public vStartPosition: any;
    public flCurrentTimeHoriz: any;
    public flCurrentTimeVert: any;
    public vLoc: any;
    public vLastKnownTargetPos: any;
    public flInitialVelocityZ: any;
    public flPredictedTotalTime: any;
    public vHorizontalVelocity: any;
    IsStunDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    Init(kv: any): void {
        if (IsServer()) {
            if (!this.BeginMotionOrDestroy()) { return };
            if (this.nHopCount == undefined) {
                this.nHopCount = 1;
                this.flop_distances = {
                    1: 200,
                    2: 400,
                    3: 400
                }
                if (this.GetParentPlus().GetUnitName() == "npc_dota_creature_undead_ogre_seal") {
                    this.flop_distances = {
                        1: 300,
                        2: 600,
                        3: 600
                    }
                }
                let nFXIndex = ResHelper.CreateParticleEx("particles/item/ogre_seal_totem/ogre_seal_warcry.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
                ParticleManager.SetParticleControlEnt(nFXIndex, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetOrigin(), true);
                this.AddParticle(nFXIndex, false, false, -1, false, false);
            }
            if (this.GetCasterPlus().IsRealUnit()) {
                this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_FLAIL);
            }
            this.bHorizontalMotionInterrupted = false;
            this.bDamageApplied = false;
            this.bTargetTeleported = false;
            this.flTimer = 0.0;
            this.vStartPosition = GetGroundPosition(this.GetParentPlus().GetOrigin(), this.GetParentPlus());
            this.flCurrentTimeHoriz = 0.0;
            this.flCurrentTimeVert = 0.0;
            this.vLoc = Vector(kv.vLocX, kv.vLocY, kv.vLocZ);
            this.vLastKnownTargetPos = this.vLoc;
            let duration = this.GetItemPlus().GetSpecialValueFor("duration");
            let flDesiredHeight = OGRE_MINIMUM_HEIGHT_ABOVE_LOWEST * this.nHopCount * duration * duration;
            let flLowZ = math.min(this.vLastKnownTargetPos.z, this.vStartPosition.z);
            let flHighZ = math.max(this.vLastKnownTargetPos.z, this.vStartPosition.z);
            let flArcTopZ = math.max(flLowZ + flDesiredHeight, flHighZ + OGRE_MINIMUM_HEIGHT_ABOVE_HIGHEST * this.nHopCount);
            let flArcDeltaZ = flArcTopZ - this.vStartPosition.z;
            this.flInitialVelocityZ = math.sqrt(2.0 * flArcDeltaZ * OGRE_ACCELERATION_Z * this.nHopCount);
            let flDeltaZ = this.vLastKnownTargetPos.z - this.vStartPosition.z;
            let flSqrtDet = math.sqrt(math.max(0, (this.flInitialVelocityZ * this.flInitialVelocityZ) - 2.0 * OGRE_ACCELERATION_Z * this.nHopCount * flDeltaZ));
            this.flPredictedTotalTime = math.max((this.flInitialVelocityZ + flSqrtDet) / (OGRE_ACCELERATION_Z * this.nHopCount), (this.flInitialVelocityZ - flSqrtDet) / (OGRE_ACCELERATION_Z * this.nHopCount));
            this.vHorizontalVelocity = (this.vLastKnownTargetPos - this.vStartPosition) / this.flPredictedTotalTime;
            this.vHorizontalVelocity.z = 0.0;
        }
    }

    BeDestroy(): void {
        if (IsServer()) {
            this.GetParentPlus().RemoveHorizontalMotionController(this);
            this.GetParentPlus().RemoveVerticalMotionController(this);
            if (this.GetCasterPlus().IsRealUnit()) {
                this.GetCasterPlus().RemoveGesture(GameActivity_t.ACT_DOTA_FLAIL);
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {}
        return Object.values(funcs);
    } */
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }
    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (IsServer()) {
            this.flTimer = this.flTimer + dt;
            this.flCurrentTimeHoriz = math.min(this.flCurrentTimeHoriz + dt, this.flPredictedTotalTime);
            let t = this.flCurrentTimeHoriz / this.flPredictedTotalTime;
            let vStartToTarget = this.vLastKnownTargetPos - this.vStartPosition;
            let vDesiredPos = this.vStartPosition + t * vStartToTarget;
            if (me.IsRealUnit()) {
                if ((!GridNav.CanFindPath(me.GetOrigin(), vDesiredPos))) {
                    this.Destroy();
                    return;
                }
            }
            let vOldPos = me.GetOrigin();
            let vToDesired = vDesiredPos - vOldPos as Vector;
            vToDesired.z = 0.0;
            let vDesiredVel = vToDesired / dt as Vector;
            let vVelDif = vDesiredVel - this.vHorizontalVelocity as Vector;
            let flVelDif = vVelDif.Length2D();
            vVelDif = vVelDif.Normalized();
            let flVelDelta = math.min(flVelDif, OGRE_MAX_HORIZONTAL_ACCELERATION * this.nHopCount);
            this.vHorizontalVelocity = this.vHorizontalVelocity + vVelDif * flVelDelta * dt;
            let vNewPos = vOldPos + this.vHorizontalVelocity * dt as Vector;
            me.SetOrigin(vNewPos);
        }
    }
    UpdateVerticalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (IsServer()) {
            this.flCurrentTimeVert = this.flCurrentTimeVert + dt;
            let bGoingDown = (-OGRE_ACCELERATION_Z * this.nHopCount * this.flCurrentTimeVert + this.flInitialVelocityZ) < 0;
            let vNewPos = me.GetOrigin();
            vNewPos.z = this.vStartPosition.z + (-0.5 * OGRE_ACCELERATION_Z * this.nHopCount * (this.flCurrentTimeVert * this.flCurrentTimeVert) + this.flInitialVelocityZ * this.flCurrentTimeVert);
            let flGroundHeight = GetGroundHeight(vNewPos, this.GetParentPlus());
            let bLanded = false;
            if ((vNewPos.z < flGroundHeight && bGoingDown == true)) {
                vNewPos.z = flGroundHeight;
                bLanded = true;
            }
            me.SetOrigin(vNewPos);
            if (bLanded == true) {
                let bDoneHopping = this.nHopCount == 3;
                if (this.bHorizontalMotionInterrupted == false) {
                    if (this.nHopCount > 1) {
                        this.GetItemPlus<item_imba_ogre_seal_totem>().TryToDamage();
                        this.flTimer = 0.0;
                    }
                } else {
                    bDoneHopping = true;
                }
                if (bDoneHopping) {
                    this.Destroy();
                } else {
                    this.nHopCount = this.nHopCount + 1;
                    this.vLoc = this.vLoc + this.GetCasterPlus().GetForwardVector() * this.flop_distances[this.nHopCount];
                    let kv = {
                        vLocX: this.vLoc.x,
                        vLocY: this.vLoc.y,
                        vLocZ: this.vLoc.z
                    }
                    this.Init(kv);
                }
            }
        }
    }
    OnHorizontalMotionInterrupted(): void {
        if (IsServer()) {
            this.bHorizontalMotionInterrupted = true;
        }
    }
    OnVerticalMotionInterrupted(): void {
        if (IsServer()) {
            this.Destroy();
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation( /** params */): GameActivity_t {
        return GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_2;
    }
}
@registerModifier()
export class modifier_item_imba_ogre_seal_totem extends BaseModifier_Plus {
    public bonus_strength: number;
    public bonus_hp: number;
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
    BeCreated(kv: any): void {
        this.bonus_strength = this.GetItemPlus().GetSpecialValueFor("bonus_strength");
        this.bonus_hp = this.GetItemPlus().GetSpecialValueFor("bonus_hp");
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength( /** params */): number {
        return this.bonus_strength;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    CC_GetModifierHealthBonus( /** params */): number {
        return this.bonus_hp;
    }
}
