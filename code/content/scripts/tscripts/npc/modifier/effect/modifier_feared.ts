/*
 * @Author: Jaxh
 * @Date: 2021-05-11 16:57:41
 * @LastEditors: your name
 * @LastEditTime: 2021-06-16 11:05:02
 * @Description: 眩晕BUFF
 */
import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

/**恐惧BUFF */
@registerModifier()
export class modifier_feared extends BaseModifier_Plus {
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
    }
    IsPurgable() {
        return true
    }
    IsPurgeException() {
        return true
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params)
        if (IsServer()) {
            // let hParent = this.GetParentPlus()
            // if (hParent.Spawner_lastCornerName == null) {
            //     hParent.Stop()
            //     return
            // }
            // this.hCorner = Entities.FindByName(null, hParent.Spawner_lastCornerName)
            // if (this.hCorner) {
            //     hParent.MoveToPosition(this.hCorner.GetAbsOrigin())
            //     this.StartIntervalThink(0)
            // } else {
            //     hParent.Stop()
            // }
        } else {
            let iParticleID = ResHelper.CreateParticle(
                {
                    resPath: "particles/units/heroes/hero_lone_druid/lone_druid_savage_roar_debuff.vpcf",
                    iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                    owner: this.GetParentPlus(),
                    level: ResHelper.PARTICLE_DETAIL_LEVEL.PARTICLE_DETAIL_LEVEL_MEDIUM
                }
            );
            this.AddParticle(iParticleID, false, false, -1, false, false);
            iParticleID = ResHelper.CreateParticle(
                {
                    resPath: "particles/status_fx/status_effect_lone_druid_savage_roar.vpcf",
                    iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                    owner: this.GetParentPlus(),
                    level: ResHelper.PARTICLE_DETAIL_LEVEL.PARTICLE_DETAIL_LEVEL_MEDIUM
                }
            );
            this.AddParticle(iParticleID, false, true, 10, false, false)
        }
    }
    OnRefresh(params: IModifierTable) {
        super.OnRefresh(params)
        // if (IsServer()) {
        //     let hParent = this.GetParentPlus()
        //     if (hParent.Spawner_lastCornerName == null) {
        //         hParent.Stop()
        //         return
        //     }
        //     this.hCorner = Entities.FindByName(null, hParent.Spawner_lastCornerName)
        //     if (this.hCorner) {
        //         hParent.MoveToPosition(this.hCorner.GetAbsOrigin())
        //     } else {
        //         hParent.Stop()
        //     }
        // }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            // if (hParent.IsPositionInRange(this.hCorner.GetAbsOrigin(), 32)) {
            //     this.Destroy()
            // }
        }
    }
    OnDestroy() {
        super.OnDestroy()
        if (IsServer()) {
            // Spawner.MoveOrder(this.GetParentPlus())
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true,
            [modifierstate.MODIFIER_STATE_MUTED]: true,
            [modifierstate.MODIFIER_STATE_FEARED]: true
        }
    }
}

