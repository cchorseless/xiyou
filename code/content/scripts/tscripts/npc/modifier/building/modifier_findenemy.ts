import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

@registerModifier()
export class modifier_findenemy extends BaseModifier_Plus {
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
    AllowIllusionDuplicate() {
        return false;
    }
    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_SUPER_ULTRA;
    }
    Init(params: IModifierTable) {
        if (IsServer()) {
        }
    }


}
