import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

/**灵动虎小喵 */
@registerModifier()
export class modifier_courier_fx_ambient_38 extends BaseModifier_Plus {
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
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ROOTBONE_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_ti10/courier_ti10_lvl6_ambient.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            let hParent = this.GetParentPlus()
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_fx_ball", hParent.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}