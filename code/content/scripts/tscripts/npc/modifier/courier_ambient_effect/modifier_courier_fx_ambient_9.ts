import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

/**纯金末日小子 */
@registerModifier()
export class modifier_courier_fx_ambient_9 extends BaseModifier_Plus {
    IsHidden() {
        return true
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    RemoveOnDeath() {
        return false
    }
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN)
                    .set_resPath("particles/econ/courier/courier_golden_doomling/courier_golden_doomling_ambient.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_weapon", this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_wing_l", this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 2, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_wing_r", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}