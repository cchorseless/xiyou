
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_aeon_disk extends BaseItem_Plus {

    GetIntrinsicModifierName(): string {
        return "modifier_imba_aeon_disk_basic";
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Item.DropGemWorld");
        for (const [_, mod] of ipairs(this.GetCasterPlus().FindAllModifiersByName("modifier_imba_aeon_disk_basic"))) {
            if (mod.GetStackCount() == 2) {
                mod.SetStackCount(1);
            } else {
                mod.SetStackCount(2);
            }
        }
        this.EndCooldown();
    }
    GetAbilityTextureName(): string {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_aeon_disk_basic", this.GetCasterPlus()) == 1) {
            return "imba_aeon_disk_icon_off";
        } else {
            return "imba_aeon_disk_icon";
        }
    }
}
@registerModifier()
export class modifier_imba_aeon_disk_basic extends BaseModifier_Plus {
    public bonus_health: number;
    public bonus_mana: number;
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
        if (this.GetItemPlus()) {
            this.bonus_health = this.GetItemPlus().GetSpecialValueFor("bonus_health");
            this.bonus_mana = this.GetItemPlus().GetSpecialValueFor("bonus_mana");
        } else {
            this.bonus_health = 0;
            this.bonus_mana = 0;
        }
        if (IsServer()) {
            this.SetStackCount(2);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
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
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(kv: ModifierAttackEvent): number {
        if (this.GetParentPlus().FindAllModifiersByName("modifier_imba_aeon_disk_basic")[1] == this && this.GetStackCount() == 2 && this.GetItemPlus() && this.GetItemPlus().IsCooldownReady() && kv.attacker != this.GetParentPlus() && !this.GetParentPlus().HasModifier("modifier_imba_aeon_disk") && !this.GetParentPlus().IsIllusion()) {
            let buff_duration = this.GetItemPlus().GetSpecialValueFor("buff_duration");
            let health_threshold_pct = this.GetItemPlus().GetSpecialValueFor("health_threshold_pct") / 100.0;
            let health_threshold = this.GetParentPlus().GetHealth() / this.GetParentPlus().GetMaxHealth();
            if ((health_threshold < health_threshold_pct || ((this.GetParentPlus().GetHealth() - kv.damage) / this.GetParentPlus().GetMaxHealth()) <= health_threshold_pct) && bit.band(kv.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) {
                this.GetParentPlus().EmitSound("DOTA_Item.ComboBreaker");
                this.GetParentPlus().Purge(false, true, false, true, true);
                let aeon_disc = this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetItemPlus(), "modifier_imba_aeon_disk", {
                    duration: buff_duration
                });
                this.GetParentPlus().SetHealth(math.min(this.GetParentPlus().GetHealth(), this.GetParentPlus().GetMaxHealth() * health_threshold_pct));
                this.GetItemPlus().UseResources(false, false, true);
                return -100;
            }
        }
    }
}
@registerModifier()
export class modifier_imba_aeon_disk extends BaseModifier_Plus {
    public damage_reduction: number;
    public status_resistance: any;
    public ability: IBaseItem_Plus;
    GetTexture(): string {
        return "item_aeon_disk";
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        });
    } */
    BeCreated(kv: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.damage_reduction = this.GetItemPlus().GetSpecialValueFor("damage_reduction");
        this.status_resistance = this.GetItemPlus().GetSpecialValueFor("status_resistance");
        if (IsServer()) {
            let parent = this.GetParentPlus();
            this.ability = this.GetItemPlus();
            let combo_breaker_particle = ResHelper.CreateParticleEx("particles/items4_fx/combo_breaker_buff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            ParticleManager.SetParticleControlEnt(combo_breaker_particle, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
            this.AddParticle(combo_breaker_particle, false, false, -1, true, false);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        return -100;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierTotalDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.damage_reduction * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.status_resistance;
    }
}
