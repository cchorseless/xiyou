import { PropertyConfig } from "../../../shared/PropertyConfig";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

@registerAbility()
export class kingkong_8 extends BaseAbility_Plus {
    OnAbilityPhaseStart() {
        let hCaster = this.GetCasterPlus()
        let vCasterLoc = hCaster.GetAbsOrigin()
        //  播放动作
        hCaster.StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_DEFEAT, 2)
        if (IsServer()) {
            //  播放伤害预警
            let flDistance = this.GetSpecialValueFor("distance")
            let flRadius = this.GetSpecialValueFor("radius")
            let vForward = hCaster.GetForwardVector()
            let tPosition = [
                vCasterLoc + GFuncVector.Rotation2D(vForward, math.rad(0)) * flDistance,
                vCasterLoc + GFuncVector.Rotation2D(vForward, math.rad(90)) * flDistance,
                vCasterLoc + GFuncVector.Rotation2D(vForward, math.rad(180)) * flDistance,
                vCasterLoc + GFuncVector.Rotation2D(vForward, math.rad(270)) * flDistance,
            ] as Vector[];
            this.tParticleID = []
            for (let i = 0; i < tPosition.length; i++) {
                let iParticleID = ParticleManager.CreateParticle("particles/units/boss/damage_line.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, null)
                ParticleManager.SetParticleControl(iParticleID, 0, vCasterLoc)
                ParticleManager.SetParticleControl(iParticleID, 1, tPosition[i])
                ParticleManager.SetParticleControl(iParticleID, 2, Vector(flRadius, 0, 0))
                table.insert(this.tParticleID, iParticleID)
            }
            hCaster.ApplyTenacity(this, hCaster, this.GetCastPoint())
        }
        return true
    }

    tParticleID: ParticleID[];
    OnAbilityPhaseInterrupted() {
        //  清空特效
        for (let iParticleID of (this.tParticleID)) {
            ParticleManager.DestroyParticle(iParticleID, false)
        }
        this.GetCasterPlus().FadeGesture(GameActivity_t.ACT_DOTA_DEFEAT)
    }
    OnSpellStart() {
        //  清空特效
        for (let iParticleID of (this.tParticleID)) {
            ParticleManager.DestroyParticle(iParticleID, false)
        }
        this.GetCasterPlus().FadeGesture(GameActivity_t.ACT_DOTA_DEFEAT)
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let vCasterLoc = hCaster.GetAbsOrigin()
        let vForward = hCaster.GetForwardVector()
        let flDistance = this.GetSpecialValueFor("distance")
        let tPosition = [
            vCasterLoc + GFuncVector.Rotation2D(vForward, math.rad(0)) * flDistance,
            vCasterLoc + GFuncVector.Rotation2D(vForward, math.rad(90)) * flDistance,
            vCasterLoc + GFuncVector.Rotation2D(vForward, math.rad(180)) * flDistance,
            vCasterLoc + GFuncVector.Rotation2D(vForward, math.rad(270)) * flDistance,
        ] as Vector[];

        for (let i = 0; i < tPosition.length; i++) {
            let hIllusion = hCaster.CreateIllusion(hCaster, { duration: 30 }, 1, vCasterLoc, false)[0]
            hIllusion.SetForwardVector((tPosition[i] - vCasterLoc as Vector).Normalized())
            hIllusion.AddNewModifier(hCaster, this, "modifier_kingkong_8_rush", { vPosX: tPosition[i].x, vPosY: tPosition[i].y })
        }
        hCaster.EmitSound("Hero_Magnataur.Skewer.Cast")
    }
    GetIntrinsicModifierName() {
        return "modifier_kingkong_8"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_kingkong_8 extends BaseModifier_Plus {
    IsHidden() {
        return true
    }
    trigger_time: number;
    OnCreated(params: IModifierTable) {
        this.trigger_time = this.GetSpecialValueFor("trigger_time")
        if (IsServer()) {
            this.StartIntervalThink(this.trigger_time)
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(params: IModifierTable) {
        if (IsServer() && params.unit.IsFriendly(this.GetParentPlus()) == false) {
            this.StartIntervalThink(this.trigger_time)
        }
    }
    OnIntervalThink() {
        let hParent = this.GetParentPlus()
        if (this.GetAbilityPlus().IsAbilityReady()) {
            ExecuteOrderFromTable({
                UnitIndex: this.GetParentPlus().entindex(),
                OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                AbilityIndex: this.GetAbilityPlus().entindex(),
                Position: this.GetParentPlus().GetAbsOrigin() + this.GetParentPlus().GetForwardVector() as Vector
            })
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -

@registerModifier()
export class modifier_kingkong_7_thinker extends BaseModifierMotionHorizontal_Plus {
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
    }
    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }

    distance: number;
    fSpeed: number;
    vS: Vector;
    vV: Vector;
    radius: number;
    impact_damage: number;
    knockback_duration: number;
    knockback_distance: number;
    knockback_height: number;
    tTargets: IBaseNpc_Plus[];
    BeCreated(params: IModifierTable) {
        if (IsServer()) {
            if (!this.ApplyHorizontalMotionController()) {
                this.Destroy()
                return
            }
            this.distance = this.GetSpecialValueFor('distance')
            this.fSpeed = this.GetSpecialValueFor('speed')
            this.vS = this.GetParentPlus().GetAbsOrigin()
            this.vV = (Vector(params.vPosX, params.vPosY, 0) - this.vS as Vector).Normalized() * this.fSpeed as Vector
            this.radius = this.GetSpecialValueFor('radius')
            this.impact_damage = this.GetSpecialValueFor("damage")
            this.knockback_duration = this.GetSpecialValueFor("knockback_duration")
            this.knockback_distance = this.GetSpecialValueFor("knockback_distance")
            this.knockback_height = this.GetSpecialValueFor("knockback_height")
            this.tTargets = []
        } else {
            let iParticleID = ParticleManager.CreateParticle("particles/units/boss/kingkong/kingkong_6.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus())
            this.AddParticle(iParticleID, false, false, -1, false, false)
            iParticleID = ParticleManager.CreateParticle("particles/units/boss/kingkong/kingkong_6_rush.vpcf", ParticleAttachment_t.PATTACH_CENTER_FOLLOW, this.GetParentPlus())
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    BeDestroy() {
        if (IsServer()) {
            this.GetParentPlus().RemoveHorizontalMotionController(this)
            for (let hUnit of (this.tTargets)) {

                if (IsValid(hUnit)) {
                    FindClearSpaceForUnit(hUnit, hUnit.GetAbsOrigin(), true)
                }
            }
            if (this.GetParentPlus().IsIllusion()) {
                this.GetParentPlus().AddNoDraw()
                this.GetParentPlus().ForceKill(false)
            }
        }
    }
    UpdateHorizontalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            let vPos = this.vV * dt + this.GetParentPlus().GetAbsOrigin() as Vector
            let fDis = (vPos - this.vS as Vector).Length2D()
            if (fDis > this.distance || GridNav.CanFindPath(this.GetParentPlus().GetAbsOrigin(), vPos) == false) {
                fDis = this.distance
            }
            me.SetAbsOrigin(vPos)
            let tTargets = FindUnitsInRadius(me.GetTeamNumber(), vPos, null, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false)
            for (let hUnit of (tTargets)) {
                if (this.tTargets.includes(hUnit) == false) {
                    table.insert(this.tTargets, hUnit)
                    let tDamageInfo = {
                        attacker: this.GetCasterPlus(),
                        victim: hUnit,
                        ability: this.GetAbilityPlus(),
                        damage: this.impact_damage,
                        damage_type: this.GetAbilityPlus().GetAbilityDamageType()
                    }
                    ApplyDamage(tDamageInfo)

                    hUnit.ApplyKnockBack(this.GetAbilityPlus(), me, {
                        distance: this.knockback_distance,
                        height: this.knockback_height,
                        duration: this.knockback_duration,
                        IsStun: true
                    })
                    let iParticleID = ParticleManager.CreateParticle("particles/units/heroes/hero_spirit_breaker/spirit_breaker_greater_bash.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, hUnit)
                    this.AddParticle(iParticleID, false, false, -1, false, false)
                }
            }

            if (fDis == this.distance) {
                this.Destroy()
            }
        }
    }
    OnHorizontalMotionInterrupted() {
        if (IsServer()) {
            this.Destroy()
        }
    }

    @registerProp(PropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION,)
    CC_GetOverrideAnimation(params: IModifierTable) {
        return GameActivity_t.ACT_DOTA_RUN
    }
    @registerProp(PropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION_RATE,)
    CC_GetOverrideAnimationRate(params: IModifierTable) {
        return 2.5
    }
    @registerProp(PropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(params: IModifierTable) {
        return "haste"
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_UNTARGETABLE]: true,
        }
    }
}