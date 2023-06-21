import { AI_ability } from "../../../ai/AI_ability";
import { PropertyConfig } from "../../../shared/PropertyConfig";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

@registerAbility()
export class kingkong_4 extends BaseAbility_Plus {
    OnAbilityPhaseStart() {
        this.GetCasterPlus().ApplyTenacity(this, this.GetCasterPlus(), 10);
        return true
    }
    OnAbilityPhaseInterrupted() {
        this.GetCasterPlus().RemoveTenacityed();
    }
    OnSpellStart() {
        this.GetCasterPlus().RemoveTenacityed();
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_kingkong_4_regen", null)
    }
    OnChannelFinish(bInterrupted: boolean) {
        this.GetCasterPlus().RemoveModifierByName("modifier_kingkong_4_regen")
        if (bInterrupted == false) {
            this.GetCasterPlus().FindModifierByName("modifier_kingkong_3").SetStackCount(0)
        }
    }
    AutoSpellSelf(): boolean {
        let trigger_pct = this.GetSpecialValueFor("trigger_pct")
        let hCaster = this.GetCasterPlus();
        if (100 - hCaster.GetHealthLosePect() <= trigger_pct) {
            hCaster.Purge(false, true, false, true, true)
            return AI_ability.NO_TARGET_cast(this)
        }
        return false
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -

@registerModifier()
export class modifier_kingkong_4_regen extends BaseModifier_Plus {
    health_pct: number;
    regen_pct: number;
    BeCreated(params: IModifierTable) {
        this.health_pct = this.GetSpecialValueFor("health_pct")
        this.regen_pct = (this.health_pct - this.GetParentPlus().GetHealthPercent()) / this.GetAbilityPlus().GetChannelTime()
        if (IsServer()) {
            this.GetCasterPlus().ApplyTenacity(this.GetAbilityPlus(), this.GetCasterPlus(), this.GetDuration())
        } else {
            let iParticleID = ParticleManager.CreateParticle("particles/units/boss/kingkong/kingkong_4.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus())
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    @registerProp(PropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE)
    CC_GetHealthRegenPercentage() {
        return this.regen_pct
    }
}