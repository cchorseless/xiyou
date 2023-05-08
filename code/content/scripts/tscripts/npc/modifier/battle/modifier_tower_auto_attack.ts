
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

@registerModifier()
export class modifier_tower_auto_attack extends BaseModifier_Plus {

    IsHidden() {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }

    particlePath: string;
    public Init(params?: IModifierTable): void {
        if (IsServer()) {
            if (RollPercentage(50)) {
                this.particlePath = "particles/base_attacks/ranged_tower_bad.vpcf"
            } else {
                this.particlePath = "particles/base_attacks/ranged_tower_good.vpcf"
            }
        }
    }
    iParticleID: ParticleID;
    allParticleID: { [k: string]: ParticleID } = {};
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    CC_ON_ATTACK_START(event: ModifierAttackEvent) {
        let parent = this.GetParentPlus();
        let target = event.target;
        parent.StartGestureWithFadeAndPlaybackRate(GameActivity_t.ACT_DOTA_CUSTOM_TOWER_ATTACK, 0.1, 0.1, parent.GetAttackSpeed());
        this.AddTimer(0.3 / parent.GetAttackSpeed(), () => {
            if (!IsValid(parent) || !IsValid(target)) { return }
            const iParticleID = ParticleManager.CreateParticle(this.particlePath, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
            this.allParticleID[event.record + ""] = (iParticleID);
            let vstartPos = parent.GetAbsOrigin() + Vector(0, 0, 500) as Vector;
            if (parent.HasAttachment("attach_palm")) {
                vstartPos = parent.GetAttachmentPosition("attach_palm");
            } else if (parent.HasAttachment("attach_mouth")) {
                vstartPos = parent.GetAttachmentPosition("attach_mouth");
            } else if (parent.HasAttachment("attach_attack1")) {
                vstartPos = parent.GetAttachmentPosition("attach_attack1");
            } else if (parent.HasAttachment("attach_hitloc")) {
                vstartPos = parent.GetAttachmentPosition("attach_hitloc");
            }
            let dir = (vstartPos - parent.GetAbsOrigin()) as Vector;
            ParticleManager.SetParticleControl(iParticleID, 0, vstartPos);
            ParticleManager.SetParticleControlForward(iParticleID, 0, dir.Normalized());
            ParticleManager.SetParticleControlEnt(iParticleID, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), false);
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(750, 0, 0));
            // 改变HSV颜色
        });
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_ON_ATTACK_LANDED(event: ModifierAttackEvent) {
        if (this.allParticleID[event.record + ""]) {
            ParticleManager.ClearParticle(this.allParticleID[event.record + ""]);
            delete this.allParticleID[event.record + ""];
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_FAIL)
    CC_ON_ATTACK_FAIL(event: ModifierAttackEvent) {
        if (this.allParticleID[event.record + ""]) {
            ParticleManager.ClearParticle(this.allParticleID[event.record + ""]);
            delete this.allParticleID[event.record + ""];
        }
    }

    public OnDestroy(): void {
        if (IsServer()) {
            for (let k in this.allParticleID) {
                ParticleManager.ClearParticle(this.allParticleID[k]);
            }
            this.allParticleID = {};
        }
    }

}

