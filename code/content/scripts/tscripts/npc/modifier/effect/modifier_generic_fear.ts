/*
 * @Author: Jaxh
 * @Date: 2021-05-11 16:57:41
 * @LastEditors: your name
 * @LastEditTime: 2021-06-16 11:05:02
 * @Description: 眩晕BUFF
 */
import { GameFunc } from "../../../GameFunc";
import { AoiHelper } from "../../../helper/AoiHelper";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

/**恐惧BUFF */
@registerModifier()
export class modifier_generic_fear extends BaseModifier_Plus {
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
    }
    IsPurgable() {
        return true
    }
    IsPurgeException() {
        return true
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }

    public oldPos: Vector;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.OnIntervalThink();
            this.StartIntervalThink(0.5);
        }
    }
    OnIntervalThink() {
        let caster = this.GetCasterPlus();
        let parent = this.GetParentPlus();
        if (caster == parent) {
            let enemy = AoiHelper.FindOneUnitsInRadius(parent.GetTeam(), parent.GetAbsOrigin(), parent.GetIdealSpeed() * 2)
            if (enemy) {
                caster = enemy;
            }
        }
        let checkPos = (caster.GetAbsOrigin() + parent.GetAbsOrigin()) / 2;
        if (caster == parent) {
            return;
        }
        if (!checkPos) {
            return;
        }
        let direction = GFuncVector.CalculateDirection(parent, caster);
        let oldPos = parent.GetAbsOrigin();
        let newPos = oldPos + direction * this.GetParentPlus().GetIdealSpeed() * 0.5 as Vector;
        if (!GridNav.CanFindPath(oldPos, newPos)) {
            let iteration = 50;
            let angleCheck = 360 / iteration;
            while (!GridNav.CanFindPath(oldPos, newPos) && iteration > 0) {
                let newDirection1 = GFuncVector.RotateVector2D(direction, GameFunc.ToRadians(angleCheck * (51 - iteration)));
                let newDirection2 = -GFuncVector.RotateVector2D(direction, GameFunc.ToRadians(angleCheck * (51 - iteration)));
                let newPos1 = oldPos + newDirection1 * parent.GetIdealSpeed() * 0.5 as Vector;
                let newPos2 = oldPos + newDirection2 * parent.GetIdealSpeed() * 0.5 as Vector;
                newPos = newPos1;
                if (GridNav.CanFindPath(oldPos, newPos2) && GridNav.FindPathLength(oldPos, newPos2) < GridNav.FindPathLength(oldPos, newPos1) &&
                    GFuncVector.CalculateDistance(caster, newPos2) > GFuncVector.CalculateDistance(caster, newPos1)) {
                    newPos = newPos2;
                }
                iteration = iteration - 1;
            }
        }
        if (GFuncVector.CalculateDistance(caster, this.oldPos || caster) < GFuncVector.CalculateDistance(caster, newPos || caster)) {
            this.GetParentPlus().MoveToPosition(newPos);
            this.oldPos = newPos;
        }
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_lone_druid/lone_druid_savage_roar_debuff.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_lone_druid_savage_roar.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return 10;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_SILENCED]: true,
            [modifierstate.MODIFIER_STATE_PROVIDES_VISION]: true
        };
    }
}

