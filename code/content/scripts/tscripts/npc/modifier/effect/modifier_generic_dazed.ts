import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
// 混乱
@registerModifier()
export class modifier_generic_dazed extends BaseModifier_Plus {
    BeCreated(p_0: any,): void {
        this.StartIntervalThink(0.5);
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (RollPercentage(20)) {
                this.GetParentPlus().SetInitialGoalEntity(undefined);
                this.GetParentPlus().Stop();
                this.GetParentPlus().Interrupt();
                if (RollPercentage(20)) {
                    this.GetParentPlus().MoveToPosition(this.GetParentPlus().GetAbsOrigin() + GFuncVector.ActualRandomVector(500, 125) as Vector);
                }
            }
        }
    }
    GetEffectName(): string {
        return "particles/generic/generic_dazed_side.vpcf";
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    BeRemoved(): void {
        if (IsServer()) {
            this.GetParentPlus().Stop();
        }
    }
}
