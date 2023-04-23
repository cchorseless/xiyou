import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

/**建造系统 */
@registerModifier()
export class modifier_building extends BaseModifier_Plus {
    IsHidden() {
        return true;
    }
    IsDebuff() {
        return false;
    }
    IsPurgable() {
        return false;
    }
    IsPurgeException() {
        return false;
    }
    AllowIllusionDuplicate() {
        return false;
    }
    DestroyOnExpire() {
        return false;
    }
    IsPermanent() {
        return true;
    }
    Init(params: IModifierTable) {
        if (IsServer()) {
            let hParent = this.GetParentPlus();
            let vColor = hParent.GetPlayerRoot().GetColor();
            let info: ResHelper.IParticleInfo = {
                resPath: "particles/player_color.vpcf",
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent,
            };
            let iParticleID = ResHelper.CreateParticle(info);
            ParticleManager.SetParticleControl(iParticleID, 1, vColor);
            this.AddParticle(iParticleID, false, false, -1, false, false);
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
        };
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IS_SCEPTER)
    GetScepter() {
        return 1;
    }
}
