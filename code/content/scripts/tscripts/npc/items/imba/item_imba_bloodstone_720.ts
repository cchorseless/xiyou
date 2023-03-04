
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class item_imba_bloodstone_720 extends BaseItem_Plus {
    public caster: IBaseNpc_Plus;
    public restore_duration: number;
    initialized: boolean = false;
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_bloodstone_720";
    }
    GetManaCost(p_0: number,): number {
        if (this && !this.IsNull() && this.GetCaster && this.GetCasterPlus() != undefined) {
            return this.GetCasterPlus().GetMaxMana() * (this.GetSpecialValueFor("mana_cost_percentage") / 100);
        }
    }
    OnSpellStart(): void {
        this.caster = this.GetCasterPlus();
        this.restore_duration = this.GetSpecialValueFor("restore_duration");
        if (!IsServer()) {
            return;
        }
        this.caster.EmitSound("DOTA_Item.Bloodstone.Cast");
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_bloodstone_active_720", {
            duration: this.restore_duration
        });
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_bloodstone_active_cdr_720", {
            duration: this.GetSpecialValueFor("active_duration")
        });
    }
}
@registerModifier()
export class modifier_item_imba_bloodstone_720 extends BaseModifier_Plus {
    public ability: item_imba_bloodstone_720;
    public parent: IBaseNpc_Plus;
    public bonus_health: number;
    public bonus_mana: number;
    public bonus_intellect: number;
    public manacost_reduction: any;
    public spell_amp: any;
    public mana_regen_multiplier: any;
    public regen_per_charge: any;
    public amp_per_charge: any;
    public death_charges: any;
    public kill_charges: any;
    public charge_range: number;
    public initial_charges_tooltip: any;
    public bonus_cdr: number;
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
        this.ability = this.GetItemPlus();
        this.parent = this.GetParentPlus();
        this.bonus_health = this.ability.GetSpecialValueFor("bonus_health");
        this.bonus_mana = this.ability.GetSpecialValueFor("bonus_mana");
        this.bonus_intellect = this.ability.GetSpecialValueFor("bonus_intellect");
        this.manacost_reduction = this.ability.GetSpecialValueFor("manacost_reduction");
        this.spell_amp = this.ability.GetSpecialValueFor("spell_amp");
        this.mana_regen_multiplier = this.ability.GetSpecialValueFor("mana_regen_multiplier");
        this.regen_per_charge = this.ability.GetSpecialValueFor("regen_per_charge");
        this.amp_per_charge = this.ability.GetSpecialValueFor("amp_per_charge");
        this.death_charges = this.ability.GetSpecialValueFor("death_charges");
        this.kill_charges = this.ability.GetSpecialValueFor("kill_charges");
        this.charge_range = this.ability.GetSpecialValueFor("charge_range");
        this.initial_charges_tooltip = this.ability.GetSpecialValueFor("initial_charges_tooltip");
        this.bonus_cdr = this.ability.GetSpecialValueFor("bonus_cdr");
        if (!IsServer()) {
            return;
        }
        if (!this.ability.initialized) {
            this.ability.SetCurrentCharges(this.initial_charges_tooltip);
            this.ability.initialized = true;
        }
        this.SetStackCount(this.ability.GetCurrentCharges());
        for (const [_, mod] of ipairs(this.GetCasterPlus().FindAllModifiersByName(this.GetName()))) {
            mod.GetItemPlus().SetSecondaryCharges(_);
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        for (const [_, mod] of ipairs(this.GetCasterPlus().FindAllModifiersByName(this.GetName()))) {
            mod.GetItemPlus().SetSecondaryCharges(_);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_TOTAL_PERCENTAGE,
            4: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE_UNIQUE,
            5: GPropertyConfig.EMODIFIER_PROPERTY.MANACOST_PERCENTAGE,
            6: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            7: GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE,
            8: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT,
            9: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE,
            10: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    CC_GetModifierHealthBonus(): number {
        return this.bonus_health;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    CC_GetModifierManaBonus(): number {
        return this.bonus_mana;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_TOTAL_PERCENTAGE)
    CC_GetModifierTotalPercentageManaRegen(): number {
        return this.mana_regen_multiplier / 100;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE_UNIQUE)
    CC_GetModifierSpellAmplify_PercentageUnique(): number {
        return this.spell_amp;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANACOST_PERCENTAGE)
    CC_GetModifierPercentageManacost(p_0: ModifierAbilityEvent,): number {
        if (this.GetItemPlus().GetSecondaryCharges() == 1) {
            return this.manacost_reduction;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.bonus_intellect;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE)
    CC_GetModifierPercentageCooldown(p_0: ModifierAbilityEvent,): number {
        if (this.GetItemPlus().GetSecondaryCharges() == 1) {
            return this.bonus_cdr;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        return this.regen_per_charge * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        return this.amp_per_charge * this.GetStackCount();
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (keys.unit.IsRealHero() && this.parent.IsRealHero()) {
            if (this.parent.GetTeam() != keys.unit.GetTeam() && ((keys.unit.GetAbsOrigin() - this.parent.GetAbsOrigin() as Vector).Length2D() <= this.charge_range || this.parent == keys.attacker) && this.parent.IsAlive()) {
                if (this == this.parent.FindAllModifiersByName(this.GetName())[1]) {
                    for (let itemSlot = 0; itemSlot <= 5; itemSlot += 1) {
                        let item = this.parent.GetItemInSlot(itemSlot);
                        if (item && item.GetName() == this.ability.GetName()) {
                            item.SetCurrentCharges(item.GetCurrentCharges() + this.kill_charges);
                            return;
                        }
                    }
                }
            } else if (this.parent == keys.unit && (!keys.unit.IsReincarnating || (keys.unit.IsReincarnating && !keys.unit.IsReincarnating()))) {
                this.ability.SetCurrentCharges(math.max(this.ability.GetCurrentCharges() - this.death_charges, 0));
            }
            this.SetStackCount(this.ability.GetCurrentCharges());
        }
    }
}
@registerModifier()
export class modifier_item_imba_bloodstone_active_720 extends BaseModifier_Plus {
    public ability: IBaseItem_Plus;
    public parent: IBaseNpc_Plus;
    public restore_duration: number;
    public mana_cost: any;
    public cooldown_remaining: number;
    public particle: any;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.ability = this.GetItemPlus();
        this.parent = this.GetParentPlus();
        this.restore_duration = this.ability.GetSpecialValueFor("restore_duration");
        this.mana_cost = this.ability.GetManaCost(this.ability.GetLevel());
        if (!IsServer()) {
            return;
        }
        this.cooldown_remaining = math.max(this.GetItemPlus().GetCooldownTimeRemaining() - this.GetRemainingTime(), 0);
        this.particle = ResHelper.CreateParticleEx("particles/items_fx/bloodstone_heal.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.parent);
        ParticleManager.SetParticleControlEnt(this.particle, 2, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
        this.AddParticle(this.particle, false, false, -1, false, false);
        this.StartIntervalThink(this.GetRemainingTime());
    }
    OnIntervalThink(): void {
        if (!this.GetParentPlus().HasModifier("modifier_item_imba_bloodstone_min_health_null_720")) {
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_item_imba_bloodstone_min_health_null_720", {
                duration: this.cooldown_remaining
            });
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MIN_HEALTH,
            3: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.mana_cost / this.restore_duration;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MIN_HEALTH)
    CC_GetMinHealth(): number {
        if (!this.GetParentPlus().HasModifier("modifier_item_imba_bloodstone_min_health_null_720")) {
            return this.mana_cost;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.mana_cost;
    }
}
@registerModifier()
export class modifier_item_imba_bloodstone_active_cdr_720 extends BaseModifier_Plus {
    public active_cdr: any;
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/items2_fx/kaya_active_b0.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.active_cdr = this.GetItemPlus().GetSpecialValueFor("active_cdr");
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
        return this.active_cdr;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANACOST_PERCENTAGE)
    CC_GetModifierPercentageManacost(p_0: ModifierAbilityEvent,): number {
        return this.active_cdr;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(keys: ModifierAbilityEvent): void {
        if (keys.unit == this.GetParentPlus() && !keys.ability.IsItem() && !keys.ability.IsToggle()) {
            this.Destroy();
        }
    }
}
@registerModifier()
export class modifier_item_imba_bloodstone_min_health_null_720 extends BaseModifier_Plus {
    IgnoreTenacity() {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetTexture(): string {
        return "item_bloodstone";
    }
}
