import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

/**小鸡粑粑 */
@registerModifier()
export class modifier_courier_fx_ambient_1 extends BaseModifier_Plus {
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
                    .set_iAttachment(ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW)
                    .set_resPath("particles/econ/courier/courier_cluckles/courier_cluckles_ambient.vpcf")
                    .set_owner(this.GetParentPlus())
            );
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(1, 0, 0))
            this.AddParticle(iParticleID, true, false, -1, false, false)
        }
    }
}