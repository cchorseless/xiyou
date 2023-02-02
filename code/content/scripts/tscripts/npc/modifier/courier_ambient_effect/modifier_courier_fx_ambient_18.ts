import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

/**灵犀弗拉尔 */
@registerModifier()
export class modifier_courier_fx_ambient_18 extends BaseModifier_Plus {
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params)
        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_frull_ambient/courier_frull_ambient.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_pot", this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_box", this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 2, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}