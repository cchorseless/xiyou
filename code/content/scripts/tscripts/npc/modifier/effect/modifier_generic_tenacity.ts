import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

// 霸体
@registerModifier()
export class modifier_generic_tenacity extends BaseModifier_Plus {
    GetTexture() {
        return "armadillo/ti8_immortal_head/pangolier_shield_crash_immortal"
    }

    // GetEffectName(): string {
    //     return "particles/generic/generic_dazed_side.vpcf";
    // }

    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_STATUS_RESISTANCE_STACKING() {
        return 100;
    }
}
