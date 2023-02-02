import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

/**纯金赏小金 */
@registerModifier()
export class modifier_courier_fx_ambient_31 extends BaseModifier_Plus {
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
                    .set_resPath("particles/econ/courier/courier_huntling_gold/courier_huntling_gold_ambient.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            let hParent = this.GetParentPlus()
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}