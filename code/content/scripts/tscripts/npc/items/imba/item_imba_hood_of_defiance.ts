
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_hood_of_defiance extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_hood_of_defiance_passive";
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("DOTA_Item.Pipe.Activate");
        this.GetCasterPlus().RemoveModifierByName("modifier_item_imba_hood_of_defiance_barrier");
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_hood_of_defiance_barrier", {
            duration: this.GetSpecialValueFor("duration"),
            shield_health: this.GetSpecialValueFor("shield_health")
        });
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_hood_of_defiance_active_bonus", {
            duration: this.GetSpecialValueFor("duration"),
            unreducable_magic_resist: this.GetSpecialValueFor("unreducable_magic_resist")
        });
    }
}
@registerModifier()
export class modifier_imba_hood_of_defiance_passive extends BaseModifier_Plus {
    public active_tenacity_pct: number;
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
    BeCreated(params: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.active_tenacity_pct = this.GetItemPlus().GetSpecialValueFor("active_tenacity_pct");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_health_regen");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_magic_resist");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        if (this.GetParentPlus().HasModifier("modifier_imba_hood_of_defiance_active_bonus")) {
            return this.active_tenacity_pct;
        } else if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("passive_tenacity_pct");
        }
    }
}
@registerModifier()
export class modifier_item_imba_hood_of_defiance_barrier extends BaseModifier_Plus {
    public barrier_block: any;
    public barrier_health: any;
    public particle: any;
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
    BeCreated(params: any): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.barrier_block = this.GetItemPlus().GetSpecialValueFor("barrier_block");
        this.barrier_health = this.barrier_block;
        this.particle = ResHelper.CreateParticleEx("particles/items2_fx/pipe_of_insight.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(this.particle, 0, this.GetParentPlus().GetAbsOrigin());
        ParticleManager.SetParticleControlEnt(this.particle, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_origin", this.GetParentPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(this.particle, 2, Vector(this.GetParentPlus().GetModelRadius() * 1.2, 0, 0));
        this.AddParticle(this.particle, false, false, -1, false, false);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_SPELL_DAMAGE_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_SPELL_DAMAGE_CONSTANT)
    CC_GetModifierIncomingSpellDamageConstant(keys: ModifierAttackEvent): number {
        if (IsClient()) {
            return this.barrier_block;
        } else {
            if (keys.damage_type == DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL) {
                if (keys.original_damage >= this.barrier_health) {
                    SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_MAGICAL_BLOCK, this.GetParentPlus(), this.barrier_health, undefined);
                    this.Destroy();
                    return this.barrier_health * (-1);
                } else {
                    SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_MAGICAL_BLOCK, this.GetParentPlus(), keys.original_damage, undefined);
                    this.barrier_health = this.barrier_health - keys.original_damage;
                    return keys.original_damage * (-1);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_hood_of_defiance_active_bonus extends BaseModifier_Plus {
    public magic_resist_compensation: any;
    public precision: any;
    public parent: IBaseNpc_Plus;
    public unreducable_magic_resist: any;
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
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.magic_resist_compensation = 0;
        this.precision = 0.5 / 100;
        this.parent = this.GetParentPlus();
        this.unreducable_magic_resist = this.GetItemPlus().GetSpecialValueFor("unreducable_magic_resist");
        this.unreducable_magic_resist = this.unreducable_magic_resist / 100;
        this.StartIntervalThink(0.1);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        });
    } */
    OnIntervalThink(): void {
        if (!this.parent.HasModifier("modifier_imba_hood_of_defiance_passive")) {
            this.StartIntervalThink(-1);
            this.Destroy();
            return;
        }
        if (this.parent.HasModifier("modifier_imba_pipe_active_bonus")) {
            this.magic_resist_compensation = 0;
            return;
        }
        let current_res = this.parent.GetMagicalArmorValue();
        if (current_res < (this.unreducable_magic_resist - this.precision)) {
            if (this.magic_resist_compensation > 0) {
                let current_compensation = this.magic_resist_compensation / 100;
                let compensation = (this.unreducable_magic_resist - 1) * (1 - current_compensation) / (1 - current_res) + 1;
                this.magic_resist_compensation = compensation * 100;
            } else {
                let compensation = 1 + (this.unreducable_magic_resist - 1) / (1 - current_res);
                this.magic_resist_compensation = compensation * 100;
            }
        } else if (this.magic_resist_compensation > 0 && current_res > (this.unreducable_magic_resist + this.precision)) {
            let current_compensation = this.magic_resist_compensation / 100;
            let compensation = (this.unreducable_magic_resist - 1) * (1 - current_compensation) / (1 - current_res) + 1;
            this.magic_resist_compensation = math.max(compensation * 100, 0);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        if (IsClient()) {
            return this.unreducable_magic_resist * 100;
        } else {
            return this.magic_resist_compensation;
        }
    }
}
