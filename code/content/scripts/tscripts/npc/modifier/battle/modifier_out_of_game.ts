import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

@registerModifier()
export class modifier_out_of_game extends BaseModifier_Plus {
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
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: this.isMoveFinished,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            // [modifierstate.MODIFIER_STATE_FROZEN]: true,
        };
        return state
    }

    isMoveFinished: boolean = false;
    old_pos: Vector;
    public Init(params?: object): void {
        this.old_pos = this.GetParent().GetAbsOrigin();
        if (IsServer()) {
            this.GetParent().SetAbsOrigin(this.old_pos - Vector(0, 0, 2000) as Vector);
            this.GetParent().AddNoDraw();
            this.AddTimer(0.1, () => {
                this.isMoveFinished = true;
            });
        }
    }

    BeDestroy(): void {
        if (IsServer()) {
            this.GetParent().RemoveNoDraw()
            this.GetParent().SetAbsOrigin(this.old_pos);
        }
    }
}
