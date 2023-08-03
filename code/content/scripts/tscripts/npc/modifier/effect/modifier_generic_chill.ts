import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
// 冰冻
@registerModifier()
export class modifier_generic_chill extends BaseModifier_Plus {
    BeCreated(table: any): void {
        if (IsServer()) {
            if (this.GetStackCount() > 99) {
                this.GetParentPlus().ApplyFreeze(this.GetAbilityPlus(), this.GetCasterPlus(), 1.5);
                this.Destroy();
            }
            this.StartIntervalThink(0.33);
        }
    }
    BeRefresh(table: any): void {
        if (IsServer()) {
            if (this.GetStackCount() > 99) {
                this.GetParentPlus().ApplyFreeze(this.GetAbilityPlus(), this.GetCasterPlus(), 1.5);
                this.Destroy();
            }
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.GetStackCount() > 99) {
                this.GetParentPlus().ApplyFreeze(this.GetAbilityPlus(), this.GetCasterPlus(), 1.5);
                this.Destroy();
            }
        }
    }
    GetTexture(): string {
        return "ancient_apparition_cold_feet";
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return -1 * this.GetStackCount();
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_slowed_cold.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/econ/items/effigies/status_fx_effigies/status_effect_effigy_frosty_dire.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return 4;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
}
