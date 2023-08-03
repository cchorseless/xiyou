import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";


// 魅惑
@registerModifier()
export class modifier_generic_charm extends BaseModifier_Plus {
    BeCreated(p_0: any,): void {
        let nfx = ResHelper.CreateParticleEx("particles/generic/charm_debuff/charm_generic_overhead.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(nfx, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(nfx, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        this.AddParticle(nfx, false, false, 0, false, false)
        this.StartIntervalThink(0.5);
    }
    OnIntervalThink() {
        if (this.GetParentPlus().HasModifier("modifier_generic_fear")) {
            return;
        }
        this.GetParentPlus().MoveToPosition(this.GetCasterPlus().GetAbsOrigin());
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_SILENCED]: true,
            [modifierstate.MODIFIER_STATE_TAUNTED]: true,
            [modifierstate.MODIFIER_STATE_PROVIDES_VISION]: true
        };
    }
}