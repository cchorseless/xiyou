
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

@registerModifier()
export class modifier_jiaoxie_wudi extends BaseModifier_Plus {

    IsHidden() {
        return true;
    }

    CheckState() {
        let state = {
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_ATTACK_IMMUNE]: true,
            // [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
        };
        return state;
    }
}

