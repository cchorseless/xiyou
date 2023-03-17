import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
@registerModifier()
export class modifier_generic_frozen extends BaseModifier_Plus {
    BeCreated(table: any): void {
        if (this.GetParentPlus().HasModifier("modifier_status_immunity")) {
            this.Destroy();
            return;
        }
        if (IsServer()) {
            this.StartIntervalThink(FrameTime());
        }
    }
    OnIntervalThink(): void {
        if (this.GetParentPlus().IsChilled()) {
            this.GetParentPlus().RemoveChilled();
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (!this.GetParentPlus().IsBoss()) {
            let state = {
                [modifierstate.MODIFIER_STATE_STUNNED]: true,
                [modifierstate.MODIFIER_STATE_FROZEN]: true
            }
            return state;
        } else {
            let state = {
                [modifierstate.MODIFIER_STATE_ROOTED]: true,
                [modifierstate.MODIFIER_STATE_INVISIBLE]: false
            }
            return state;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.CASTTIME_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant( /** params */): number {
        if (this.GetParentPlus().IsBoss()) {
            return -1000;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CASTTIME_PERCENTAGE)
    CC_GetModifierPercentageCasttime(p_0: ModifierAbilityEvent,): number {
        return -95;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE)
    CC_GetModifierTurnRate_Percentage(): number {
        return -95;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    GetStatusEffectName(): string {
        return "particles/econ/items/effigies/status_fx_effigies/status_effect_effigy_frosty_l2_dire.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return 11;
    }
    GetEffectName(): string {
        return "particles/generic/generic_frozen.vpcf";
    }
    GetTexture(): string {
        return "winter_wyvern_cold_embrace";
    }
}
