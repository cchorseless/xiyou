
import { GameFunc } from "../../../GameFunc";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
// 摄魂怪的臂章
@registerAbility()
export class item_imba_armlet_of_dementor extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        this.AddTimer(FrameTime(), () => {
            if (!this.IsNull()) {
                for (const [_, modifier] of GameFunc.iPair(this.GetParentPlus().FindAllModifiersByName("modifier_item_imba_armlet_of_dementor"))) {
                    modifier.SetStackCount(_);
                }
            }
        });
        return "modifier_item_imba_armlet_of_dementor";
    }
    GetAbilityTextureName(): string {
        if (this.GetCasterPlus().HasModifier("modifier_item_imba_armlet_of_dementor_active")) {
            return "imba/armlet_of_dementor";
        } else {
            return "imba/armlet_of_dementor_inactive";
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        if (!IsServer()) {
            return;
        }
        if (!caster.HasModifier("modifier_item_imba_armlet_of_dementor_active")) {
            caster.EmitSound("DOTA_Item.Armlet.Activate");
            caster.AddNewModifier(caster, this, "modifier_item_imba_armlet_of_dementor_active", {});
        } else if (caster.HasModifier("modifier_item_imba_armlet_of_dementor_active")) {
            caster.EmitSound("DOTA_Item.Armlet.DeActivate");
            caster.RemoveModifierByName("modifier_item_imba_armlet_of_dementor_active");
        }
    }
}
@registerModifier()
export class modifier_item_imba_armlet_of_dementor extends BaseModifier_Plus {
    public ability: IBaseItem_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public bonus_spell_amp: number;
    public bonus_spell_cd: number;
    public bonus_magic_res: number;
    public bonus_mana_regen: number;
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
        this.ability = this.GetItemPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.bonus_spell_amp = this.ability.GetSpecialValueFor("bonus_spell_amp");
        this.bonus_spell_cd = this.ability.GetSpecialValueFor("bonus_spell_cd");
        this.bonus_magic_res = this.ability.GetSpecialValueFor("bonus_magic_res");
        this.bonus_mana_regen = this.ability.GetSpecialValueFor("bonus_mana_regen");
        if (!IsServer()) {
            return;
        }
        if (this.parent.IsIllusion() && this.parent.GetPlayerOwner().GetAssignedHero().HasModifier("modifier_item_imba_armlet_of_dementor_active")) {
            this.parent.AddNewModifier(this.parent, this.ability, "modifier_item_imba_armlet_of_dementor_active", {});
        }
        for (const [_, mod] of GameFunc.iPair(this.GetParentPlus().FindAllModifiersByName(this.GetName()))) {
            mod.GetItemPlus().SetSecondaryCharges(_);
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        for (const [_, modifier] of GameFunc.iPair(this.GetParentPlus().FindAllModifiersByName(this.GetName()))) {
            modifier.SetStackCount(_);
            modifier.GetItemPlus().SetSecondaryCharges(_);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE_STACKING,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        if (this.GetItemPlus().GetSecondaryCharges() == 1 && !this.GetParentPlus().HasModifier("modifier_item_imba_arcane_nexus_passive")) {
            return this.bonus_spell_amp;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE_STACKING)
    CC_GetModifierPercentageCooldownStacking(p_0: ModifierAbilityEvent,): number {
        if (this.GetItemPlus().GetSecondaryCharges() == 1) {
            return this.bonus_spell_cd;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.bonus_magic_res;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        return this.bonus_mana_regen;
    }
}
@registerModifier()
export class modifier_item_imba_armlet_of_dementor_active extends BaseModifier_Plus {
    public ability: IBaseItem_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public mind_bonus_int: number;
    public mind_bonus_magic_res: number;
    public mind_bonus_spell_amp: number;
    public mind_mana_drain_mult: any;
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/item/armlet_of_dementor/armlet_of_dementor.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.ability = this.GetItemPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.mind_bonus_int = this.ability.GetSpecialValueFor("mind_bonus_int");
        this.mind_bonus_magic_res = this.ability.GetSpecialValueFor("mind_bonus_magic_res");
        this.mind_bonus_spell_amp = this.ability.GetSpecialValueFor("mind_bonus_spell_amp");
        this.mind_mana_drain_mult = this.ability.GetSpecialValueFor("mind_mana_drain_mult");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE,
            4: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT,
            5: GPropertyConfig.EMODIFIER_PROPERTY.MP_REGEN_AMPLIFY_PERCENTAGE,
            6: Enum_MODIFIER_EVENT.ON_MANA_GAINED
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.mind_bonus_int;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        if (IsClient() || !this.parent.IsIllusion()) {
            return this.mind_bonus_magic_res;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        if (IsClient() || !this.parent.IsIllusion()) {
            return this.mind_bonus_spell_amp;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_MANA_GAINED)
    CC_OnManaGained(keys: ModifierHealEvent): void {
        if (keys.unit == this.GetParentPlus()) {
            this.GetParentPlus().SpendMana(keys.gain * this.mind_mana_drain_mult, this.ability);
            if (keys.gain >= this.GetParentPlus().GetMana()) {
            }
        }
    }
}
