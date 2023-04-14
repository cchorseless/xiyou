
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 自定义
@registerAbility()
export class item_imba_initiate_robe extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_initiate_robe_passive";
    }

}
@registerModifier()
export class modifier_imba_initiate_robe_passive extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    public shield_pfx: any;
    public mana_pct: number;
    public mana_raw: any;
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS,
            5: GPropertyConfig.EMODIFIER_PROPERTY.TOTAL_CONSTANT_BLOCK
        });
    } */
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (IsServer()) {
            let item = this.GetItemPlus();
            this.parent = this.GetParentPlus();
            if (this.parent.IsRealUnit() && item) {
                this.shield_pfx = undefined;
                this.CheckUnique(true);
                this.mana_pct = this.GetParentPlus().GetManaPercent();
                this.mana_raw = this.GetParentPlus().GetMana();
                this.StartIntervalThink(0.03);
            }
        }
    }
    OnIntervalThink(): void {
        if (this.GetItemPlus() && this.parent.GetManaPercent() < this.mana_pct && this.GetParentPlus().GetMana() < this.mana_raw) {
            this.SetStackCount(math.min(this.GetStackCount() + (this.mana_raw - this.GetParentPlus().GetMana()) * (this.GetItemPlus().GetSpecialValueFor("mana_conversion_rate") * 0.01), this.GetItemPlus().GetSpecialValueFor("max_stacks")));
        }
        this.mana_raw = this.GetParentPlus().GetMana();
        this.mana_pct = this.GetParentPlus().GetManaPercent();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    CC_GetModifierHealthBonus(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_health");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    CC_GetModifierManaBonus(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_mana");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("mana_regen");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("magic_resist");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTAL_CONSTANT_BLOCK)
    CC_GetModifierTotal_ConstantBlock(keys: ModifierAttackEvent): number {
        let blocked = this.GetStackCount();
        if (blocked > 0 && keys.damage > 0) {
            SendOverheadEventMessage(this.GetParentPlus().GetPlayerOwner(), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_MAGICAL_BLOCK, this.GetParentPlus(), math.min(this.GetStackCount(), keys.damage), this.GetParentPlus().GetPlayerOwner());
            this.SetStackCount(math.max(this.GetStackCount() - keys.damage, 0));
        }
        return blocked;
    }
}
