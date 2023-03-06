
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class item_imba_satanic extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_satanic";
    }
    OnSpellStart(): void {
        EmitSoundOn("DOTA_Item.Satanic.Activate", this.GetCasterPlus());
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_satanic_active", {
            duration: this.GetSpecialValueFor("unholy_rage_duration")
        });
    }
}
@registerModifier()
export class modifier_imba_satanic extends BaseModifier_Plus {
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
        if (IsServer()) {
            GFuncEntity.ChangeAttackProjectileImba(this.GetCasterPlus());
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            GFuncEntity.ChangeAttackProjectileImba(this.GetCasterPlus());
        }
    }
    GetModifierLifesteal() {
        if (this.GetItemPlus() && this.GetParentPlus().FindAllModifiersByName(this.GetName())[0] == this) {
            if (this.GetParentPlus().HasModifier("modifier_imba_satanic_active")) {
                return this.GetItemPlus().GetSpecialValueFor("lifesteal_pct") + this.GetItemPlus().GetSpecialValueFor("unholy_rage_lifesteal_bonus");
            } else {
                return this.GetItemPlus().GetSpecialValueFor("lifesteal_pct");
            }
        } else {
            return 0;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING,
            4: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("damage_bonus");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("strength_bonus");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("status_resistance");
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (this.GetItemPlus() && keys.attacker == this.GetParentPlus() && keys.unit.IsRealUnit() && keys.attacker != keys.unit && !keys.inflictor) {
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_imba_satanic_soul_slaughter_counter", {
                duration: this.GetItemPlus().GetSpecialValueFor("soul_slaughter_duration")
            });
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_imba_satanic_soul_slaughter_stack", {
                duration: this.GetItemPlus().GetSpecialValueFor("soul_slaughter_duration"),
                stacks: keys.unit.GetMaxHealth() * this.GetItemPlus().GetSpecialValueFor("soul_slaughter_hp_increase_pct") * 0.01
            });
        }
    }
}
@registerModifier()
export class modifier_imba_satanic_active extends BaseModifier_Plus {
    GetEffectName(): string {
        return "particles/items2_fx/satanic_buff.vpcf";
    }
}
@registerModifier()
export class modifier_imba_satanic_soul_slaughter_counter extends BaseModifier_Plus {
    public soul_slaughter_damage_per_stack: number;
    public soul_slaughter_hp_per_stack: number;
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.soul_slaughter_damage_per_stack = this.GetItemPlus().GetSpecialValueFor("soul_slaughter_damage_per_stack");
        this.soul_slaughter_hp_per_stack = this.GetItemPlus().GetSpecialValueFor("soul_slaughter_hp_per_stack");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.soul_slaughter_damage_per_stack * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    CC_GetModifierHealthBonus(): number {
        return this.soul_slaughter_hp_per_stack * this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_satanic_soul_slaughter_stack extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(keys.stacks);
        if (this.GetParentPlus().HasModifier("modifier_imba_satanic_soul_slaughter_counter")) {
            this.GetParentPlus().findBuff<modifier_imba_satanic_soul_slaughter_counter>("modifier_imba_satanic_soul_slaughter_counter").SetStackCount(this.GetParentPlus().FindModifierByName("modifier_imba_satanic_soul_slaughter_counter").GetStackCount() + this.GetStackCount());
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().HasModifier("modifier_imba_satanic_soul_slaughter_counter")) {
            this.GetParentPlus().findBuff<modifier_imba_satanic_soul_slaughter_counter>("modifier_imba_satanic_soul_slaughter_counter").SetStackCount(this.GetParentPlus().FindModifierByName("modifier_imba_satanic_soul_slaughter_counter").GetStackCount() - this.GetStackCount());
        }
    }
}
