
import { GameFunc } from "../../../GameFunc";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
const active_sword_sound = "DOTA_Item.IronTalon.Activate"
@registerAbility()
export class item_imba_sange extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_sange";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_sange_active", {
                duration: this.GetSpecialValueFor("active_duration")
            });
            this.GetCasterPlus().EmitSound(active_sword_sound);
        }
    }
}
@registerModifier()
export class modifier_item_imba_sange extends BaseModifier_Plus {
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
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_damage");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_strength");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_status_resistance");
    }
}
@registerModifier()
export class modifier_item_imba_sange_active extends BaseModifier_Plus {
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
        return "particles/items2_fx/sange_active.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_status_resistance_active");
    }
}
@registerAbility()
export class item_imba_heavens_halberd extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_heavens_halberd";
    }
    OnSpellStart( /** keys */): void {
        if (IsServer() && !this.GetCursorTarget().TriggerSpellAbsorb(this)) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            let duration = this.GetSpecialValueFor("disarm_melee_duration");
            if (target.IsRangedAttacker()) {
                duration = this.GetSpecialValueFor("disarm_range_duration");
            }
            if (target.GetTeamNumber() == caster.GetTeamNumber()) {
                target.AddNewModifier(caster, this, "modifier_item_imba_heavens_halberd_ally_buff", {
                    duration: this.GetSpecialValueFor("buff_duration")
                });
                this.GetCasterPlus().EmitSound(active_sword_sound);
            } else {
                target.AddNewModifier(caster, this, "modifier_item_imba_heavens_halberd_active_disarm", {
                    duration: duration * (1 - target.GetStatusResistance())
                });
                target.EmitSound("DOTA_Item.HeavensHalberd.Activate");
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_heavens_halberd extends BaseModifier_Plus {
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
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_damage");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_strength");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT)
    CC_GetModifierEvasion_Constant(p_0: ModifierAttackEvent,): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_evasion");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_status_resistance");
    }
}
@registerModifier()
export class modifier_item_imba_heavens_halberd_ally_buff extends BaseModifier_Plus {
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
        return "particles/items2_fx/sange_active.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_status_resistance_active");
    }
}
@registerModifier()
export class modifier_item_imba_heavens_halberd_active_disarm extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/items2_fx/heavens_halberd.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let states = {
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        }
        return states;
    }
}
@registerAbility()
export class item_imba_yasha extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_yasha";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_yasha_active", {
                duration: this.GetSpecialValueFor("active_duration")
            });
            this.GetCasterPlus().EmitSound(active_sword_sound);
        }
    }
}
@registerModifier()
export class modifier_item_imba_yasha extends BaseModifier_Plus {
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
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE_UNIQUE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_attack_speed");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE_UNIQUE)
    CC_GetModifierMoveSpeedBonus_Percentage_Unique(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_ms");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_agility");
    }
}
@registerModifier()
export class modifier_item_imba_yasha_active extends BaseModifier_Plus {
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
        return "particles/items2_fx/yasha_active.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT)
    CC_GetModifierEvasion_Constant(p_0: ModifierAttackEvent,): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_evasion_active");
    }
}
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
        if (this.GetItemPlus().GetName() == "item_imba_kaya") {
            return "item_kaya";
        } else if (this.GetItemPlus().GetName() == "item_imba_arcane_nexus") {
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
@registerAbility()
export class item_imba_sange_yasha extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_sange_yasha";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_sange_yasha_active", {
                duration: this.GetSpecialValueFor("active_duration")
            });
            this.GetCasterPlus().EmitSound(active_sword_sound);
        }
    }
}
@registerModifier()
export class modifier_item_imba_sange_yasha extends BaseModifier_Plus {
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
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE_UNIQUE,
            4: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            5: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            6: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_damage");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_attack_speed");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE_UNIQUE)
    CC_GetModifierMoveSpeedBonus_Percentage_Unique(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_ms");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_agility");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_strength");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_status_resistance");
    }
}
@registerModifier()
export class modifier_item_imba_sange_yasha_active extends BaseModifier_Plus {
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
        return "particles/items2_fx/sange_yasha_active.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_status_resistance_active");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT)
    CC_GetModifierEvasion_Constant(p_0: ModifierAttackEvent,): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_evasion_active");
    }
}
@registerAbility()
export class item_imba_kaya_and_sange extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_kaya_and_sange";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_kaya_and_sange_active", {
                duration: this.GetSpecialValueFor("active_duration")
            });
            this.GetCasterPlus().EmitSound(active_sword_sound);
        }
    }
}
@registerModifier()
export class modifier_item_imba_kaya_and_sange extends BaseModifier_Plus {
    public spell_amp: any;
    public bonus_cdr: number;
    public bonus_intellect: number;
    public bonus_damage: number;
    public bonus_strength: number;
    public bonus_status_resistance: number;
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
        this.bonus_damage = this.GetItemPlus().GetSpecialValueFor("bonus_damage");
        this.bonus_strength = this.GetItemPlus().GetSpecialValueFor("bonus_strength");
        this.bonus_status_resistance = this.GetItemPlus().GetSpecialValueFor("bonus_status_resistance");
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
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE,
            5: GPropertyConfig.EMODIFIER_PROPERTY.MANACOST_PERCENTAGE,
            6: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING,
            7: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE_UNIQUE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE_UNIQUE)
    CC_GetModifierSpellAmplify_PercentageUnique(): number {
        return this.spell_amp;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.bonus_intellect;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.bonus_strength;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.bonus_status_resistance;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANACOST_PERCENTAGE)
    CC_GetModifierPercentageManacost(p_0: ModifierAbilityEvent,): number {
        return this.bonus_cdr;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE)
    CC_GetModifierPercentageCooldown(p_0: ModifierAbilityEvent,): number {
        if (this.GetItemPlus().GetSecondaryCharges() == 1 && !this.GetParentPlus().HasModifier("modifier_item_imba_yasha_and_kaya") && !this.GetParentPlus().HasModifier("modifier_item_imba_bloodstone_720") && !this.GetParentPlus().HasModifier("modifier_item_imba_the_triumvirate_v2") && !this.GetParentPlus().HasModifier("modifier_item_imba_arcane_nexus_passive")) {
            return this.bonus_cdr;
        }
    }
}
@registerModifier()
export class modifier_item_imba_kaya_and_sange_active extends BaseModifier_Plus {
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
        return "particles/items2_fx/kaya_sange_active.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MANACOST_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_status_resistance_active");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE)
    CC_GetModifierPercentageCooldown(p_0: ModifierAbilityEvent,): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_cdr_active");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANACOST_PERCENTAGE)
    CC_GetModifierPercentageManacost(p_0: ModifierAbilityEvent,): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_cdr_active");
    }
}
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
@registerAbility()
export class item_imba_triumvirate extends BaseItem_Plus {
    GetAbilityTextureName(): string {
        return "imba_sange_and_kaya_and_yasha";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_triumvirate";
    }
}
@registerModifier()
export class modifier_item_imba_triumvirate extends BaseModifier_Plus {
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
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE_UNIQUE,
            4: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            5: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            6: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            7: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_damage");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE)
    CC_GetModifierPercentageCooldown(p_0: ModifierAbilityEvent,): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_cdr");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_attack_speed");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE_UNIQUE)
    CC_GetModifierMoveSpeedBonus_Percentage_Unique(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_ms");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_str");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_agi");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_int");
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let owner = this.GetParentPlus();
            let target = keys.target;
            if (owner != keys.attacker) {
                return;
            }
            this.TriumAttack(owner, keys.target, this.GetItemPlus(), "modifier_item_imba_triumvirate_stacks_debuff", "modifier_item_imba_triumvirate_stacks_buff", "modifier_item_imba_triumvirate_proc_debuff", "modifier_item_imba_triumvirate_proc_buff");
        }
    }

    TriumAttack(attacker: IBaseNpc_Plus, target: IBaseNpc_Plus, ability: IBaseItem_Plus,
        modifier_enemy_stacks: string, modifier_self_stacks: string, modifier_enemy_proc: string, modifier_self_proc: string) {
        let modifier_as = attacker.AddNewModifier(attacker, ability, modifier_self_stacks, {
            duration: ability.GetSpecialValueFor("stack_duration")
        });
        if (modifier_as && modifier_as.GetStackCount() < ability.GetSpecialValueFor("max_stacks")) {
            modifier_as.SetStackCount(modifier_as.GetStackCount() + 1);
            attacker.EmitSound("Imba.YashaStack");
        }
        if (attacker.IsIllusion()) {
            return;
        }
        // if (target.IsMagicImmune() || (!target.IsHeroOrCreep())) {
        //     return;
        // }
        if (ability.IsCooldownReady() && RollPercentage(ability.GetSpecialValueFor("proc_chance"))) {
            attacker.AddNewModifier(attacker, ability, modifier_self_proc, {
                duration: ability.GetSpecialValueFor("proc_duration_self")
            });
            attacker.EmitSound("Imba.YashaProc");
            target.AddNewModifier(attacker, ability, modifier_enemy_proc, {
                duration: ability.GetSpecialValueFor("proc_duration_enemy") * (1 - target.GetStatusResistance())
            });
            target.EmitSound("Imba.SangeProc");
            target.EmitSound("Imba.kayaProc");
            ability.UseResources(false, false, true);
        }
        let modifier_maim = target.AddNewModifier(attacker, ability, modifier_enemy_stacks, {
            duration: ability.GetSpecialValueFor("stack_duration") * (1 - target.GetStatusResistance())
        });
        if (modifier_maim && modifier_maim.GetStackCount() < ability.GetSpecialValueFor("max_stacks")) {
            modifier_maim.SetStackCount(modifier_maim.GetStackCount() + 1);
            target.EmitSound("Imba.SangeStack");
            target.EmitSound("Imba.kayaStack");
        }
    }

}
@registerModifier()
export class modifier_item_imba_triumvirate_stacks_debuff extends BaseModifier_Plus {
    public ability: IBaseItem_Plus;
    public maim_stack: number;
    public amp_stack: number;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/item/swords/sange_kaya_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.ability = this.GetItemPlus();
        if (!this.ability) {
            this.Destroy();
            return undefined;
        }
        this.maim_stack = this.ability.GetSpecialValueFor("maim_stack");
        this.amp_stack = this.ability.GetSpecialValueFor("amp_stack");
        if (IsServer()) {
            let owner = this.GetParentPlus();
            let lower_tier_modifiers = {
                "1": "modifier_item_imba_sange_active",
                "2": "modifier_item_imba_sange_yasha_active",
                "3": "modifier_item_imba_yasha_and_kaya_active",
                "4": "modifier_item_imba_sange_kaya_active"
            }
            let stack_count = this.GetStackCount();
            for (const [_, modifier] of GameFunc.Pair(lower_tier_modifiers)) {
                let modifier_to_remove = owner.FindModifierByName(modifier);
                if (modifier_to_remove) {
                    stack_count = math.max(stack_count, modifier_to_remove.GetStackCount());
                    modifier_to_remove.Destroy();
                }
            }
            this.SetStackCount(stack_count);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        if (!this.amp_stack) {
            return undefined;
        }
        return this.amp_stack * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (!this.maim_stack) {
            return undefined;
        }
        return this.maim_stack * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (!this.maim_stack) {
            return undefined;
        }
        return this.maim_stack * this.GetStackCount();
    }
}
@registerModifier()
export class modifier_item_imba_triumvirate_proc_debuff extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/item/swords/sange_kaya_proc.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let states = {
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_SILENCED]: true
        }
        return states;
    }
}
@registerModifier()
export class modifier_item_imba_triumvirate_stacks_buff extends BaseModifier_Plus {
    public as_stack: number;
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
        return "particles/item/swords/yasha_buff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.as_stack = this.GetItemPlus().GetSpecialValueFor("as_stack");
        if (IsServer()) {
            let owner = this.GetParentPlus();
            let lower_tier_modifiers = {
                "1": "modifier_item_imba_yasha_active",
                "2": "modifier_item_imba_kaya_yasha_stacks",
                "3": "modifier_item_imba_sange_yasha_stacks"
            }
            let stack_count = this.GetStackCount();
            for (const [_, modifier] of GameFunc.Pair(lower_tier_modifiers)) {
                let modifier_to_remove = owner.FindModifierByName(modifier);
                if (modifier_to_remove) {
                    stack_count = math.max(stack_count, modifier_to_remove.GetStackCount());
                    modifier_to_remove.Destroy();
                }
            }
            this.SetStackCount(stack_count);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.as_stack * this.GetStackCount();
    }
}
@registerModifier()
export class modifier_item_imba_triumvirate_proc_buff extends BaseModifier_Plus {
    public proc_ms: any;
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/item/swords/yasha_proc.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.proc_ms = this.GetItemPlus().GetSpecialValueFor("proc_ms");
        if (IsServer()) {
            let owner = this.GetParentPlus();
            let lower_tier_modifiers = {
                "1": "modifier_item_imba_yasha_proc",
                "2": "modifier_item_imba_sange_yasha_proc",
                "3": "modifier_item_imba_kaya_yasha_proc"
            }
            for (const [_, modifier] of GameFunc.Pair(lower_tier_modifiers)) {
                owner.RemoveModifierByName(modifier);
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.proc_ms;
    }
}
