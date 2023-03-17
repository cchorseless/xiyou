import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

@registerModifier()
export class modifier_generic_disarm extends BaseModifier_Plus {
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_disarm.vpcf";
    }
    GetTexture(): string {
        return "filler_ability";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        }
        return state;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
}
