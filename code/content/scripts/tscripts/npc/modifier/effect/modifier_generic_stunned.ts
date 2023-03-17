import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

@registerModifier()
export class modifier_generic_stunned extends BaseModifier_Plus {
    IsHidden() { return false }
    IsDebuff() { return true }
    IsPurgable() { return true }
    IsPurgeException() { return true }
    IsStunDebuff() { return true }
    AllowIllusionDuplicate() { return false }

    GetEffectName() { return "particles/generic_gameplay/generic_stunned.vpcf" }
    GetEffectAttachType() { return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_PASSIVES_DISABLED]: true,
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_OverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_DISABLED;
    }
    public BeCreated(params?: IModifierTable): void {
        if (IsServer()) {
            this.GetParent().Interrupt()
            this.GetParent().Stop()
        }
    }

    public BeRemoved(): void {
        if (IsServer()) {
            this.GetParent().RemoveGesture(GameActivity_t.ACT_DOTA_DISABLED)
        }
    }

    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }

}

