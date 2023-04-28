import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

@registerModifier()
export class modifier_generic_invis extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        let particle = ResHelper.CreateParticleEx("particles/generic_hero_status/status_invisibility_start.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetParentPlus());
        ParticleManager.ReleaseParticleIndex(particle);
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    CC_GetModifierInvisibilityLevel(): number {
        return 1;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: true
        }
        return state;
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_SUPER_ULTRA;
    }
}