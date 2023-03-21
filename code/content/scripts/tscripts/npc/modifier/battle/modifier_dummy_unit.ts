
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

@registerModifier()
export class modifier_dummy_unit extends BaseModifier_Plus {

    IsPurgable() {
        return false;
    }
    IsPurgeException() {
        return false;
    }

    IsHidden(): boolean {
        return true;
    }


    CheckState() {
        let state = {
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
        };
        return state
    }

}

