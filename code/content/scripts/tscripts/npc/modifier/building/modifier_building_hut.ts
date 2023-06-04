import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

@registerModifier()
export class modifier_building_hut extends BaseModifier_Plus {
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

    Init(params: IModifierTable) {
        if (IsServer()) {
            let hParent = this.GetParentPlus();
            // let vColor = hParent.GetPlayerRoot().GetColor();
            // let info: ResHelper.IParticleInfo = {
            //     resPath: "particles/player_color.vpcf",
            //     iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
            //     owner: hParent,
            // };
            // let iParticleID = ResHelper.CreateParticle(info);
            // ParticleManager.SetParticleControl(iParticleID, 1, vColor);
            // this.AddParticle(iParticleID, false, false, -1, false, false);
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_ATTACK_RANGE_BONUS(): number {
        return 200;
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_ATTACKSPEED_BONUS_CONSTANT(): number {
        return 100;
    }
}
