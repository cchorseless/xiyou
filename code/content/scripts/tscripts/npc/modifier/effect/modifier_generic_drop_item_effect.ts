import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

@registerModifier()
export class modifier_generic_drop_item_effect extends BaseModifier_Plus {
    IsHidden() { return false }
    IsDebuff() { return true }
    IsPurgable() { return true }
    IsPurgeException() { return true }
    IsStunDebuff() { return true }
    AllowIllusionDuplicate() { return false }


    public BeCreated(params?: IModifierTable): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            "particles/neutral_fx/neutral_item_drop_flash.vpcf"
            let r = ResHelper.CreateParticleEx("particles/neutral_fx/neutral_item_drop.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, parent);
            this.AddParticle(r, false, false, -1, false, false);
        }
    }




}

