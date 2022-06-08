import { reloadable } from "../../GameCache";
import { GameEnum } from "../../GameEnum";
import { LogHelper } from "../../helper/LogHelper";
import { BaseModifier_Plus, registerProp } from "../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../entityPlus/Base_Plus";

@registerModifier()
export class modifier_no_health_bar extends BaseModifier_Plus {
    IsHidden() {
        return true;
    }
    IsStunDebuff() {
        return false;
    }

    IsPurgable() {
        return false;
    }
    CheckState() {
        let state = {
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
        };
        return state;
    }
}

