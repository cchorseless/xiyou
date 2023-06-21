import { AI_ability } from "../../../ai/AI_ability";
import { PropertyConfig } from "../../../shared/PropertyConfig";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionHorizontal_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

@registerAbility()
export class kingkong_6 extends BaseAbility_Plus {
    OnAbilityPhaseStart() {
        this.GetCasterPlus().StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_DEFEAT, 3)
        if (IsServer()) {
            this.GetCasterPlus().ApplyTenacity(this, this.GetCasterPlus(), 10)
        }
        return true
    }
    OnAbilityPhaseInterrupted() {
        this.GetCasterPlus().FadeGesture(GameActivity_t.ACT_DOTA_DEFEAT)
    }
    OnSpellStart() {
        this.GetCasterPlus().RemoveTenacityed();
        this.GetCasterPlus().FadeGesture(GameActivity_t.ACT_DOTA_DEFEAT)
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        hCaster.AddNewModifier(hCaster, this, "modifier_kingkong_6_rush", null)
        hCaster.EmitSound("Hero_Magnataur.Skewer.Cast")
    }
    AutoSpellSelf(): boolean {
        let trigger_pct = this.GetSpecialValueFor("trigger_pct")
        let hCaster = this.GetCasterPlus();
        if (100 - hCaster.GetHealthLosePect() <= trigger_pct) {
            return AI_ability.POSITION_if_enemy(this)
        }
        return false
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -

@registerModifier()
export class modifier_kingkong_6_rush extends BaseModifierMotionHorizontal_Plus {
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
    }
    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_SUPER_ULTRA
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
            this.vV = this.GetParentPlus().GetForwardVector() * this.fSpeed as Vector
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
            if (this.tTargets) {
                for (let hUnit of (this.tTargets)) {
                    if (IsValid(hUnit)) {
                        FindClearSpaceForUnit(hUnit, hUnit.GetAbsOrigin(), true)
                    }
                }
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
                    this.tTargets.push(hUnit)
                    let tDamageInfo = {
                        attacker: me,
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
        }
    }
}