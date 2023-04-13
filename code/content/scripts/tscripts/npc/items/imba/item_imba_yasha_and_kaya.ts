
import { GameFunc } from "../../../GameFunc";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
const active_sword_sound = "DOTA_Item.IronTalon.Activate";

// 慧夜对剑
@registerAbility()
export class item_imba_yasha_and_kaya extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_yasha_and_kaya";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_yasha_and_kaya_active", {
                duration: this.GetSpecialValueFor("active_duration")
            });
            this.GetCasterPlus().EmitSound(active_sword_sound);
        }
    }
}
@registerModifier()
export class modifier_item_imba_yasha_and_kaya extends BaseModifier_Plus {
    public spell_amp: any;
    public bonus_cdr: number;
    public bonus_intellect: number;
    public bonus_agility: number;
    public bonus_attack_speed: number;
    public bonus_ms: number;
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
        this.spell_amp = this.GetItemPlus().GetSpecialValueFor("spell_amp");
        this.bonus_cdr = this.GetItemPlus().GetSpecialValueFor("bonus_cdr");
        this.bonus_intellect = this.GetItemPlus().GetSpecialValueFor("bonus_intellect");
        this.bonus_agility = this.GetItemPlus().GetSpecialValueFor("bonus_agility");
        this.bonus_attack_speed = this.GetItemPlus().GetSpecialValueFor("bonus_attack_speed");
        this.bonus_ms = this.GetItemPlus().GetSpecialValueFor("bonus_ms");
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
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE_UNIQUE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            5: GPropertyConfig.EMODIFIER_PROPERTY.MANACOST_PERCENTAGE,
            6: GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE,
            7: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE_UNIQUE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_attack_speed");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE_UNIQUE)
    CC_GetModifierMoveSpeedBonus_Percentage_Unique(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_ms");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_agility");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_intellect");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANACOST_PERCENTAGE)
    CC_GetModifierPercentageManacost(p_0: ModifierAbilityEvent,): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_cdr");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE)
    CC_GetModifierPercentageCooldown(p_0: ModifierAbilityEvent,): number {
        if (this.GetItemPlus() && this.GetItemPlus().GetSecondaryCharges() == 1 && !this.GetParentPlus().HasModifier("modifier_item_imba_bloodstone_720") && !this.GetParentPlus().HasModifier("modifier_item_imba_the_triumvirate_v2") && !this.GetParentPlus().HasModifier("modifier_item_imba_arcane_nexus_passive")) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_cdr");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE_UNIQUE)
    CC_GetModifierSpellAmplify_PercentageUnique(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("spell_amp");
        }
    }
}
@registerModifier()
export class modifier_item_imba_yasha_and_kaya_active extends BaseModifier_Plus {
    public bonus_cdr_active: number;
    public bonus_evasion_active: number;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/items2_fx/yasha_kaya_active.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.bonus_cdr_active = this.GetItemPlus().GetSpecialValueFor("bonus_cdr_active");
        this.bonus_evasion_active = this.GetItemPlus().GetSpecialValueFor("bonus_evasion_active");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MANACOST_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT
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
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT)
    CC_GetModifierEvasion_Constant(p_0: ModifierAttackEvent,): number {
        return this.bonus_evasion_active;
    }
}
