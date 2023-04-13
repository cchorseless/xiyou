
import { GameFunc } from "../../../GameFunc";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
// 代达罗斯之殇
@registerAbility()
export class item_imba_greater_crit extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_greater_crit";
    }
}
@registerModifier()
export class modifier_item_imba_greater_crit extends BaseModifier_Plus {
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
    BeCreated(keys: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (!this.GetItemPlus() || !IsServer()) {
            return;
        }
        if (!this.GetParentPlus().HasModifier("modifier_item_imba_greater_crit_buff")) {
            this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetItemPlus(), "modifier_item_imba_greater_crit_buff", {});
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (!this.GetParentPlus().HasModifier("modifier_item_imba_greater_crit")) {
            this.GetParentPlus().RemoveModifierByName("modifier_item_imba_greater_crit_buff");
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_BONUS)
    CC_GetModifierPreAttack_BonusDamage(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_damage");
        }
    }
}
@registerModifier()
export class modifier_item_imba_greater_crit_buff extends BaseModifier_Plus {
    public crit_multiplier: any;
    public crit_increase: any;
    public crit_chance: number;
    public bCrit: any;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.crit_multiplier = this.GetItemPlus().GetSpecialValueFor("crit_multiplier");
        this.crit_increase = this.GetItemPlus().GetSpecialValueFor("crit_increase");
        this.crit_chance = this.GetItemPlus().GetSpecialValueFor("crit_chance");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE)
    CC_GetModifierPreAttack_CriticalStrike(keys: ModifierAttackEvent): number {
        if (this.GetItemPlus() && (keys.target && !keys.target.IsOther() && !keys.target.IsBuilding() && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber())) {
            let multiplicative_chance = (1 - ((1 - (this.crit_chance * 0.01)) ^ GameFunc.GetCount(this.GetParentPlus().FindAllModifiersByName("modifier_item_imba_greater_crit")))) * 100;
            if (GFuncRandom.PRD(math.ceil(multiplicative_chance), this)) {
                this.bCrit = true;
                let stacks = this.GetStackCount();
                this.SetStackCount(0);
                return this.crit_multiplier + stacks;
            } else {
                this.bCrit = false;
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (this.GetItemPlus() && keys.attacker == this.GetParentPlus() && (keys.target && !keys.target.IsOther() && !keys.target.IsBuilding() && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber())) {
            if (!this.bCrit && keys.original_damage > 0) {
                this.SetStackCount(this.GetStackCount() + (this.crit_increase * GameFunc.GetCount(this.GetParentPlus().FindAllModifiersByName("modifier_item_imba_greater_crit"))));
            } else if (this.bCrit) {
                keys.target.EmitSound("DOTA_Item.Daedelus.Crit");
            }
        }
    }
}
