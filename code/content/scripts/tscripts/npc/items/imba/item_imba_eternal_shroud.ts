
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 永世法衣
@registerAbility()
export class item_imba_eternal_shroud extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_eternal_shroud";
    }
}
@registerModifier()
export class modifier_item_imba_eternal_shroud extends BaseModifier_Plus {
    public spell_lifesteal: any;
    public mana_to_hp_pct: number;
    public mana_to_hp_damage: number;
    public flBonusHP: any;
    public flBonusHPRegen: any;
    public mana_pct: number;
    public mana_raw: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(kv: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.spell_lifesteal = this.GetItemPlus().GetSpecialValueFor("spell_lifesteal");
        this.mana_to_hp_pct = (100 + this.GetItemPlus().GetSpecialValueFor("mana_to_hp_pct")) / 100;
        this.mana_to_hp_damage = this.GetItemPlus().GetSpecialValueFor("mana_to_hp_damage");
        this.flBonusHP = this.GetParentPlus().GetMaxMana() * this.mana_to_hp_pct;
        this.flBonusHPRegen = this.GetParentPlus().GetManaRegen() * this.mana_to_hp_pct;
        this.StartIntervalThink(FrameTime());
        if (!IsServer()) {
            return;
        }
        this.mana_pct = this.GetParentPlus().GetManaPercent();
        this.mana_raw = this.GetParentPlus().GetMana();
    }
    OnIntervalThink(): void {
        this.flBonusHP = this.GetParentPlus().GetMaxMana() * this.mana_to_hp_pct;
        this.flBonusHPRegen = this.GetParentPlus().GetManaRegen() * this.mana_to_hp_pct;
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().GetManaPercent() < this.mana_pct && this.GetParentPlus().GetMana() < this.mana_raw) {
            this.GetParentPlus().SetHealth(math.max(this.GetParentPlus().GetHealth() - (this.mana_raw - this.GetParentPlus().GetMana()) * this.mana_to_hp_damage, 1));
            if (this.GetParentPlus().GetHealth() <= 1) {
                this.GetParentPlus().Kill(this.GetItemPlus(), this.GetParentPlus());
            }
            this.GetParentPlus().SetMana(math.min(math.max(this.mana_raw, 0), this.GetParentPlus().GetMaxMana()));
        }
        this.mana_raw = this.GetParentPlus().GetMana();
        this.mana_pct = this.GetParentPlus().GetManaPercent();
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    CC_GetModifierHealthBonus( /** params */): number {
        return this.flBonusHP;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen( /** params */): number {
        return this.flBonusHPRegen;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_LIFESTEAL_PERCENTAGE)
    CC_SPELL_LIFESTEAL_AMPLIFY_PERCENTAGE() {
        return this.spell_lifesteal;
    }
}
