import { AI_ability } from "../../../ai/AI_ability";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { kingkong_3 } from "./kingkong_3";

@registerAbility()
export class kingkong_7 extends BaseAbility_Plus {
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        hCaster.AddNewModifier(hCaster, this, "modifier_kingkong_7_buff", { duration: this.GetChannelTime() })
        hCaster.ApplyTenacity(this, hCaster, this.GetChannelTime())
        this.tTargets = hCaster.findAbliityPlus<kingkong_3>("kingkong_3").Summon()
    }
    tTargets: IBaseNpc_Plus[];
    OnChannelThink(flInterval: number) {
        if (this.tTargets) {
            let bEnd = true
            for (let hUnit of (this.tTargets)) {
                if (IsValid(hUnit) && hUnit.IsAlive()) {
                    bEnd = false
                }
            }
            if (bEnd) {
                this.GetCasterPlus().InterruptChannel()
                this.GetCasterPlus().Stop()
            }
        }
    }
    OnChannelFinish(bInterrupted: boolean) {
        if (bInterrupted) {
            this.GetCasterPlus().RemoveModifierByName("modifier_kingkong_7_buff")
            this.GetCasterPlus().RemoveTenacityed()
        }
    }
    AutoSpellSelf(): boolean {
        let trigger_pct = this.GetSpecialValueFor("trigger_pct")
        let enemy_count = this.GetSpecialValueFor("enemy_count")
        let hCaster = this.GetCasterPlus();
        if (100 - hCaster.GetHealthLosePect() <= trigger_pct) {
            return AI_ability.NO_TARGET_cast(this)
        }
        return false
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -

@registerModifier()
export class modifier_kingkong_7_buff extends BaseModifier_Plus {
    delay: number;
    interval: number;
    radius: number;
    stone_min: number;
    stone_max: number;
    BeCreated(params: IModifierTable) {
        this.delay = this.GetSpecialValueFor("delay")
        this.interval = this.GetSpecialValueFor("interval")
        this.radius = this.GetSpecialValueFor("radius")
        this.stone_min = this.GetSpecialValueFor("stone_min")
        this.stone_max = this.GetSpecialValueFor("stone_max")
        if (IsServer()) {
            this.OnIntervalThink()
            this.StartIntervalThink(this.interval)
        } else {
            let iParticleID = ParticleManager.CreateParticle("particles/units/boss/kingkong/kingkong_7_bubble.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus())
            //  ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "", this.GetParentPlus().GetAbsOrigin(), false)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    OnIntervalThink() {
        undefined
        let vPosition = this.GetParentPlus().GetAbsOrigin() + RandomVector(RandomInt(0, this.radius)) as Vector
        modifier_kingkong_7_thinker.applyThinker(vPosition, this.GetParentPlus(), this.GetAbilityPlus(), { duration: this.delay }, this.GetParentPlus().GetTeamNumber(), false)
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_ATTACK_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -


@registerModifier()
export class modifier_kingkong_7_thinker extends BaseModifier_Plus {
    damage_radius: number;
    stun_duration: number;
    delay: number;
    BeCreated(params: IModifierTable) {
        this.damage_radius = this.GetSpecialValueFor("damage_radius")
        this.stun_duration = this.GetSpecialValueFor("stun_duration")
        this.delay = this.GetSpecialValueFor("delay")
        if (IsServer()) {
        } else {
            let iParticleID = ParticleManager.CreateParticle("particles/units/boss/kingkong/kingkong_1.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, null)
            ParticleManager.SetParticleControl(iParticleID, 0, this.GetParentPlus().GetAbsOrigin() + Vector(300, 0, 2000) as Vector)
            ParticleManager.SetParticleControl(iParticleID, 1, this.GetParentPlus().GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(2000 / this.delay, 0, 0))
            this.AddParticle(iParticleID, false, false, -1, false, false)
            iParticleID = ParticleManager.CreateParticle("particles/units/boss/damage_circle.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, null)
            ParticleManager.SetParticleControl(iParticleID, 0, this.GetParentPlus().GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.damage_radius, this.delay, 0))
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    BeDestroy() {
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            let tTargets = this.FindEnemyInRadius(this.damage_radius, hParent.GetAbsOrigin())
            for (let hUnit of (tTargets)) {
                ApplyDamage({
                    victim: hUnit,
                    attacker: hParent,
                    damage: this.GetAbilityPlus().GetAbilityDamage(),
                    damage_type: this.GetAbilityPlus().GetAbilityDamageType(),
                    ability: this.GetAbilityPlus()
                })
                hUnit.ApplyStunned(this.GetAbilityPlus(), hParent, this.stun_duration)
            }
            hParent.EmitSound("n_creep_Thunderlizard_Big.Stomp")
            if (IsValid(this.GetParentPlus())) {
                let hParent = this.GetParentPlus()
                GTimerHelper.AddFrameTimer(1, GHandler.create(hParent, () => {
                    hParent.RemoveSelf()
                }))
            }
        } else {
            //  落地特效
            let iParticleID = ParticleManager.CreateParticle("particles/econ/items/brewmaster/brewmaster_offhand_elixir/brewmaster_thunder_clap_elixir.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, null)
            ParticleManager.SetParticleControl(iParticleID, 0, this.GetParentPlus().GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.damage_radius, this.damage_radius, this.damage_radius))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}