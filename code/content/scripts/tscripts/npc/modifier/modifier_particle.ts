/*
 * @Author: Jaxh
 * @Date: 2021-05-11 14:49:01
 * @LastEditors: your name
 * @LastEditTime: 2021-05-19 14:36:43
 * @Description:出生自带BUFF标签
 */
import { GameFunc } from "../../GameFunc";
import { BaseModifier_Plus } from "../entityPlus/BaseModifier_Plus";

export class modifier_particle extends BaseModifier_Plus {

    IsHidden() {
        return true
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
}
export class modifier_particle_thinker extends modifier_particle {
    OnDestroy() {
        super.OnDestroy()
        if (IsServer()) {
            if (GameFunc.IsValid(this.GetParentPlus())) {
                GDestroyUnit(this.GetParentPlus())
            }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true
        }
    }

}
