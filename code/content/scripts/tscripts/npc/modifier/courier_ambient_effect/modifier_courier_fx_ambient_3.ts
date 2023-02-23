import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

/**金鲲咬人箱 */
@registerModifier()
export class modifier_courier_fx_ambient_3 extends BaseModifier_Plus {
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
            let respath = "particles/econ/courier/courier_donkey_ti7/courier_donkey_ti7_ambient.vpcf"
            let iParticleID = ResHelper.CreateParticle(
                new ResHelper.ParticleInfo()
                    .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN)
                    .set_resPath(respath)
                    .set_owner(this.GetParentPlus())
            );
            ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 4, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_omni_head", this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticleID, 16, Vector(1, 0, 0))
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}