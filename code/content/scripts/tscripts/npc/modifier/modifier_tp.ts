
import { ResHelper } from "../../helper/ResHelper";
import { BaseModifier_Plus } from "../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../entityPlus/Base_Plus";

/**传送 */
@registerModifier()
export class modifier_tp extends BaseModifier_Plus {
    finishCB: () => void = null;

    Init(params: IModifierTable) {
        let hCaster = this.GetCasterPlus();
        let hParent = this.GetParentPlus();
        let vPosition = hCaster.GetAbsOrigin();
        let tPosition = hParent.GetAbsOrigin();
        if (IsServer()) {
            hCaster.EmitSound("Portal.Loop_Disappear");
            hParent.EmitSound("Portal.Loop_Appear");
        } else {
            let vColor = Vector(255, 255, 255);
            let info: ResHelper.IParticleInfo = {
                // resPath: "particles/items2_fx/teleport_start.vpcf",
                resPath: "particles/econ/events/fall_major_2015/teleport_start_fallmjr_2015.vpcf",
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            };
            let iParticleID = ResHelper.CreateParticle(info);
            ParticleManager.SetParticleControl(iParticleID, 0, vPosition);
            ParticleManager.SetParticleControl(iParticleID, 2, vColor);
            this.AddParticle(iParticleID, false, false, -1, false, false);
            if (tPosition) {
                let infoend = {
                    // resPath: "particles/items2_fx/teleport_end.vpcf",
                    resPath: "particles/econ/events/fall_major_2015/teleport_end_fallmjr_2015.vpcf",
                    iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                    owner: hParent
                };
                let iParticleID = ResHelper.CreateParticle(infoend);
                ParticleManager.SetParticleControl(iParticleID, 0, tPosition);
                ParticleManager.SetParticleControl(iParticleID, 1, tPosition);
                ParticleManager.SetParticleControl(iParticleID, 2, vColor);
                ParticleManager.SetParticleControlEnt(iParticleID, 3, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN, null, tPosition, true);
                ParticleManager.SetParticleControl(iParticleID, 4, Vector(0, 0, 0));
                ParticleManager.SetParticleControl(iParticleID, 5, tPosition);
                this.AddParticle(iParticleID, false, false, -1, false, false);
            }
        }
    }
    BeRemoved() {
        let hCaster = this.GetCasterPlus();
        let hParent = this.GetParentPlus();
        let vPosition = hCaster.GetAbsOrigin();
        let tPosition = hParent.GetAbsOrigin();
        if (IsServer()) {
            if (IsValid(hCaster)) {
                hCaster.StopSound("Portal.Loop_Disappear");
                EmitSoundOnLocationWithCaster(hCaster.GetAbsOrigin(), "Portal.Hero_Disappear", hCaster);
                if (vPosition != null) {
                    EmitSoundOnLocationWithCaster(vPosition, "Portal.Hero_Appear", hCaster);
                }
            }
            hParent.StopSound("Portal.Loop_Appear");
            if (tPosition) {
                hCaster.SetAbsOrigin(GetGroundPosition(tPosition, hParent));
            }
            SafeDestroyUnit(hParent)
            if (this.finishCB) {
                this.finishCB();
                this.finishCB = null;
            }
        }
    }

    /**
     * 传送
     * @param hCaster
     * @param ability
     * @param position
     */
    static TeleportToPoint(hCaster: IBaseNpc_Plus, position: Vector, duration = 1, finishCB: () => void = null) {
        if (!IsServer() || !IsValid(hCaster)) {
            return;
        }
        let npc = modifier_tp.applyThinker(position, hCaster, null, { duration: duration });
        if (npc) {
            let buff = npc.findBuff<modifier_tp>("modifier_tp");
            if (buff) buff.finishCB = finishCB;
        }
    }
}
