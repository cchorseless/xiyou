
import { GameFunc } from "../../../GameFunc";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_nether_wand extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_item_nether_wand_passive";
    }
    GetAbilityTextureName(): string {
        return "imba_nether_wand";
    }
}
@registerModifier()
export class modifier_imba_item_nether_wand_passive extends BaseModifier_Plus {
    public item: any;
    public parent: IBaseNpc_Plus;
    public spell_amp: any;
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
            }
        }
        this.item = this.GetItemPlus();
        this.parent = this.GetParentPlus();
        if (this.parent.IsHero() && this.item) {
            this.spell_amp = this.item.GetSpecialValueFor("spell_amp");
        }
        if (!IsServer()) {
            return;
        }
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
            1: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        if (this.GetItemPlus().GetSecondaryCharges() == 1 && !this.GetParentPlus().HasModifier("modifier_imba_aether_lens_passive") && !this.GetParentPlus().HasModifier("modifier_item_imba_aether_specs") && !this.GetParentPlus().HasModifier("modifier_item_imba_cyclone_2") && !this.GetParentPlus().HasModifier("modifier_item_imba_armlet_of_dementor") && !this.GetParentPlus().HasModifier("modifier_item_imba_arcane_nexus_passive")) {
            return this.spell_amp;
        }
    }
}
@registerAbility()
export class item_imba_arcane_nexus extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_arcane_nexus_passive";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_kaya_active", {
                duration: this.GetSpecialValueFor("active_duration")
            });
            this.GetCasterPlus().EmitSound("DOTA_Item.Pipe.Activate");
        }
    }
}
@registerModifier()
export class modifier_item_imba_arcane_nexus_passive extends BaseModifier_Plus {
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
            }
        }
        if (!IsServer()) {
            return;
        }
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
            1: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE_UNIQUE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            5: GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE,
            6: GPropertyConfig.EMODIFIER_PROPERTY.MANACOST_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE_UNIQUE)
    CC_GetModifierSpellAmplify_PercentageUnique(): number {
        if (this.GetItemPlus() && this.GetItemPlus().GetSecondaryCharges() == 1) {
            return this.GetItemPlus().GetSpecialValueFor("spell_amp");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_damage");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_as");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_intellect");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE)
    CC_GetModifierPercentageCooldown(p_0: ModifierAbilityEvent,): number {
        if (this.GetItemPlus() && this.GetItemPlus().GetSecondaryCharges() == 1 && !this.GetParentPlus().HasModifier("modifier_imba_octarine_core_unique")) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_cdr");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANACOST_PERCENTAGE)
    CC_GetModifierPercentageManacost(p_0: ModifierAbilityEvent,): number {
        if (this.GetItemPlus() && this.GetItemPlus().GetSecondaryCharges() == 1) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_cdr");
        }
    }
}
