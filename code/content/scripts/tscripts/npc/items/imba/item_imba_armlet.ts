
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_armlet extends BaseItem_Plus {

    GetIntrinsicModifierName(): string {
        return "modifier_imba_armlet_basic";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (caster.HasModifier("modifier_imba_armlet_toggle_prevention")) {
                return undefined;
            }
            caster.AddNewModifier(caster, this, "modifier_imba_armlet_toggle_prevention", {
                duration: 0.05
            });
            if (caster.HasModifier("modifier_imba_armlet_unholy_strength")) {
                caster.EmitSound("DOTA_Item.Armlet.Activate");
                caster.RemoveModifierByName("modifier_imba_armlet_unholy_strength");
            } else {
                caster.EmitSound("DOTA_Item.Armlet.DeActivate");
                caster.AddNewModifier(caster, this, "modifier_imba_armlet_unholy_strength", {});
            }
        }
    }
    GetAbilityTextureName(): string {
        if (this.GetCasterPlus().HasModifier("modifier_imba_armlet_unholy_strength")) {
            return "imba_armlet_active";
        } else {
            return "imba_armlet";
        }
    }
}
@registerModifier()
export class modifier_imba_armlet_basic extends BaseModifier_Plus {
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
        if (this.GetParentPlus().IsIllusion() && this.GetParentPlus().GetPlayerOwner().GetAssignedHero().HasModifier("modifier_imba_armlet_unholy_strength")) {
            this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetItemPlus(), "modifier_imba_armlet_unholy_strength", {});
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_damage");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_attack_speed");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_armor");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_health_regen");
    }
}
@registerModifier()
export class modifier_imba_armlet_unholy_strength extends BaseModifier_Plus {
    public unholy_bonus_strength: number;
    public unholy_health_drain: any;
    public health_per_stack: number;
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/items_fx/armlet.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.unholy_bonus_strength = this.GetItemPlus().GetSpecialValueFor("unholy_bonus_strength");
        this.unholy_health_drain = this.GetItemPlus().GetSpecialValueFor("unholy_health_drain");
        this.health_per_stack = this.GetItemPlus().GetSpecialValueFor("health_per_stack");
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let bonus_health = this.GetItemPlus().GetSpecialValueFor("unholy_bonus_strength") * 20;
            let health_before_activation = caster.GetHealth();
            if (!this.GetParentPlus().IsIllusion()) {
                this.AddTimer(0.01, () => {
                    caster.SetHealth(health_before_activation + bonus_health);
                });
            }
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        if (!this.GetParentPlus().HasModifier("modifier_imba_armlet_basic")) {
            this.GetParentPlus().RemoveModifierByName("modifier_imba_armlet_unholy_strength_visual_effect");
            this.Destroy();
            return;
        }
        this.GetParentPlus().SetHealth(math.max(this.GetParentPlus().GetHealth() - this.unholy_health_drain * 0.1, 1));
        let unholy_stacks = math.floor((this.GetParentPlus().GetMaxHealth() - this.GetParentPlus().GetHealth()) / this.health_per_stack);
        this.SetStackCount(unholy_stacks);
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (this.GetCasterPlus().IsAlive()) {
                let caster = this.GetCasterPlus();
                let bonus_health = this.unholy_bonus_strength * 20;
                let health_before_deactivation = caster.GetHealthPercent() * (caster.GetMaxHealth() + bonus_health) * 0.01;
                caster.SetHealth(math.max(health_before_deactivation - bonus_health, 1));
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            5: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.GetItemPlus().GetSpecialValueFor("unholy_bonus_strength");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.GetItemPlus().GetSpecialValueFor("unholy_bonus_damage") + this.GetStackCount() * this.GetItemPlus().GetSpecialValueFor("stack_damage");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.GetItemPlus().GetSpecialValueFor("unholy_bonus_armor") + this.GetStackCount() * this.GetItemPlus().GetSpecialValueFor("stack_armor");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (IsClient() || !this.GetParentPlus().IsIllusion()) {
            return this.GetStackCount() * this.GetItemPlus().GetSpecialValueFor("stack_as");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.unholy_health_drain;
    }
}
@registerModifier()
export class modifier_imba_armlet_toggle_prevention extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
}
