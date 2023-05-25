import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

// 自由行动的标识
@registerModifier()
export class modifier_unit_freedom extends BaseModifier_Plus {
    IsPurgable() {
        return false;
    }
    IsPurgeException() {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
}
