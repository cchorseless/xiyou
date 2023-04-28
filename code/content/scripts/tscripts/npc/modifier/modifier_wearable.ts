
import { BaseModifier_Plus } from "../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../entityPlus/Base_Plus";

/**饰品 */
@registerModifier()
export class modifier_wearable extends BaseModifier_Plus {
    IsPurgable() { return false; }
    IsHidden() { return true; }
    IsStunDebuff() { return false; }
    IsDebuff() { return false; }
    IsPurgeException() { return false; }
    Init(params: IModifierTable) {

    }

    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
        }
    }
}