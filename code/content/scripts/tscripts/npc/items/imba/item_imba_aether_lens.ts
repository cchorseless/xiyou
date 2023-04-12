
import { GameFunc } from "../../../GameFunc";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_aether_lens extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_aether_lens_passive";
    }
}
@registerModifier()
export class modifier_imba_aether_lens_passive extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    public bonus_mana: number;
    public bonus_mana_regen: number;
    public cast_range_bonus: number;
    public spell_power: any;
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

    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
                return;
            }
        }
        let item = this.GetItemPlus();
        this.parent = this.GetParentPlus();
        if (this.parent.IsRealUnit() && item) {
            this.bonus_mana = item.GetSpecialValueFor("bonus_mana");
            this.bonus_mana_regen = item.GetSpecialValueFor("bonus_mana_regen");
            this.cast_range_bonus = item.GetSpecialValueFor("cast_range_bonus");
            this.spell_power = item.GetSpecialValueFor("spell_power");
        }
        if (!IsServer()) {
            return;
        }
        this.CheckUnique(true);
        for (const [_, mod] of GameFunc.iPair(this.GetParentPlus().FindAllModifiersByName(this.GetName()))) {
            mod.GetItemPlus().SetSecondaryCharges(_);
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        for (const [_, mod] of GameFunc.iPair(this.GetParentPlus().FindAllModifiersByName(this.GetName()))) {
            mod.GetItemPlus().SetSecondaryCharges(_);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.CAST_RANGE_BONUS_STACKING,
            2: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        if (this.GetItemPlus().GetSecondaryCharges() == 1 && !this.GetParentPlus().HasModifier("modifier_item_imba_aether_specs") && !this.GetParentPlus().HasModifier("modifier_item_imba_cyclone_2") && !this.GetParentPlus().HasModifier("modifier_item_imba_armlet_of_dementor") && !this.GetParentPlus().HasModifier("modifier_item_imba_arcane_nexus_passive")) {
            return this.spell_power;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        return this.bonus_mana_regen;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    CC_GetModifierManaBonus(): number {
        return this.bonus_mana;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CAST_RANGE_BONUS)
    CC_GetModifierCastRangeBonusStacking(p_0: ModifierAbilityEvent,): number {
        return this.CheckUniqueValue(this.cast_range_bonus, [
            "modifier_imba_elder_staff",
            "modifier_item_imba_aether_specs"
        ]);
    }
}
