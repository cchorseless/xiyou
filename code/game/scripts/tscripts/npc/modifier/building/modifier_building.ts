import { GameEnum } from "../../../GameEnum";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

/**建造系统 */
@registerModifier()
export class modifier_building extends BaseModifier_Plus {
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
    DestroyOnExpire() {
        return false
    }
    IsPermanent() {
        return true
    }
    OnCreated(params: ModifierTable) {
        // super.OnCreated(params);
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            let vColor = GameRules.Addon.ETRoot.PlayerSystem().GetPlayer(hParent.GetPlayerOwnerID()).PlayerComp().playerColor;
            let info: ResHelper.IParticleInfo = {
                resPath: "particles/player_color.vpcf",
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            }
            let iParticleID = ResHelper.CreateParticle(info);
            ParticleManager.SetParticleControl(iParticleID, 1, vColor)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.IS_SCEPTER)
    GetScepter() {
        return 1
    }

}

