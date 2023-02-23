import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

/**白小虎*/
@registerModifier()
export class modifier_courier_fx_ambient_24 extends BaseModifier_Plus {
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
                    .set_resPath("particles/econ/courier/courier_baekho/courier_baekho_ambient.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}