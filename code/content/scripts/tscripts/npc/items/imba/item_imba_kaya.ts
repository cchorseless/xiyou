
import { GameFunc } from "../../../GameFunc";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
const active_sword_sound = "DOTA_Item.IronTalon.Activate";

// 慧光
@registerAbility()
export class item_imba_kaya extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_kaya";
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
export class modifier_item_imba_kaya extends BaseModifier_Plus {
    public spell_amp: any;
    public bonus_cdr: number;
    public bonus_int: number;
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
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.spell_amp = this.GetItemPlus().GetSpecialValueFor("spell_amp");
        this.bonus_cdr = this.GetItemPlus().GetSpecialValueFor("bonus_cdr");
        this.bonus_int = this.GetItemPlus().GetSpecialValueFor("bonus_int");
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
            2: GPropertyConfig.EMODIFIER_PROPERTY.MANACOST_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE_UNIQUE)
    CC_GetModifierSpellAmplify_PercentageUnique(): number {
        return this.spell_amp;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANACOST_PERCENTAGE)
    CC_GetModifierPercentageManacost(p_0: ModifierAbilityEvent,): number {
        return this.bonus_cdr;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.bonus_int;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE)
    CC_GetModifierPercentageCooldown(p_0: ModifierAbilityEvent,): number {
        if (this.GetItemPlus() && this.GetItemPlus().GetSecondaryCharges() == 1 && !this.GetParentPlus().HasModifier("modifier_item_imba_yasha_and_kaya") && !this.GetParentPlus().HasModifier("modifier_item_imba_bloodstone_720") && !this.GetParentPlus().HasModifier("modifier_item_imba_kaya_and_sange") && !this.GetParentPlus().HasModifier("modifier_item_imba_the_triumvirate_v2") && !this.GetParentPlus().HasModifier("modifier_item_imba_arcane_nexus_passive")) {
            return this.bonus_cdr;
        }
    }
}
@registerModifier()
export class modifier_item_imba_kaya_active extends BaseModifier_Plus {
    public bonus_cdr_active: number;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/items2_fx/kaya_active_b0.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    GetTexture(): string {
        if (this.GetItemPlus().GetAbilityName() == "item_imba_kaya") {
            return "item_kaya";
        } else if (this.GetItemPlus().GetAbilityName() == "item_imba_arcane_nexus") {
            return "modifiers/imba_arcane_nexus";
        }
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.bonus_cdr_active = this.GetItemPlus().GetSpecialValueFor("bonus_cdr_active");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MANACOST_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE,
            3: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE)
    CC_GetModifierPercentageCooldown(p_0: ModifierAbilityEvent,): number {
        return this.bonus_cdr_active;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANACOST_PERCENTAGE)
    CC_GetModifierPercentageManacost(p_0: ModifierAbilityEvent,): number {
        return this.bonus_cdr_active;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(keys: ModifierAbilityEvent): void {
        if (keys.unit == this.GetParentPlus() && !keys.ability.IsItem() && !keys.ability.IsToggle()) {
            this.Destroy();
        }
    }
}
