import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

@registerModifier()
export class modifier_generic_blind extends BaseModifier_Plus {
    GetEffectName(): string {
        return "particles/units/heroes/hero_keeper_of_the_light/keeper_of_the_light_blinding_light_debuff.vpcf"
    }
    GetTexture() {
        return "keeper_of_the_light_blinding_light"
    }

    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_BLIND]: true
        }
        return state;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    miss: number = 0;
    public BeCreated(params?: IModifierTable): void {
        this.miss = params.miss || 0
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE)
    CC_GetModifierMiss_Percentage() {
        return this.miss
    }
}
