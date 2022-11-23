/*
 * @Author: Jaxh
 * @Date: 2021-05-11 16:57:41
 * @LastEditors: your name
 * @LastEditTime: 2021-06-16 11:05:02
 * @Description: 眩晕BUFF
 */
import { GameEnum } from "../../../shared/GameEnum";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

@registerModifier()
export class modifier_stunned extends BaseModifier_Plus {
    IsHidden() { return false }
    IsDebuff() { return true }
    IsPurgable() { return false }
    IsPurgeException() { return true }
    IsStunDebuff() { return true }
    AllowIllusionDuplicate() { return false }

    GetEffectName() { return "particles/generic_gameplay/generic_stunned.vpcf" }
    GetEffectAttachType() { return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    g_OverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_DISABLED;
    }
}

