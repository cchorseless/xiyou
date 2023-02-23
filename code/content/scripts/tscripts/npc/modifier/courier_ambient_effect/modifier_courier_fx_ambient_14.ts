import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

/**腥红蝾小螈 */
@registerModifier()
export class modifier_courier_fx_ambient_14 extends BaseModifier_Plus {
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
                    .set_iAttachment(ParticleAttachment_t.PATTACH_CUSTOMORIGIN)
                    .set_resPath("particles/econ/courier/courier_axolotl_ambient/courier_axolotl_ambient_lvl3.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_head", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}