
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
// 不朽尸王的头盔
@registerAbility()
export class item_imba_hellblade extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_helm_of_the_undying_addendum";
    }
}



@registerModifier()
export class modifier_item_imba_helm_of_the_undying_addendum extends BaseModifier_Plus {
    public health_damage_pct_threshold: number;
    public duration_reduction_per_threshold: number;
    public damage_taken: number;
    public max_health: any;
    public threshold_intervals: number;
    public last_attacker: IBaseNpc_Plus;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.health_damage_pct_threshold = this.GetItemPlus().GetSpecialValueFor("health_damage_pct_threshold");
        this.duration_reduction_per_threshold = this.GetItemPlus().GetSpecialValueFor("duration_reduction_per_threshold");
        if (!IsServer()) {
            return;
        }
        this.damage_taken = 0;
        this.max_health = this.GetParentPlus().GetMaxHealth();
        this.threshold_intervals = this.GetParentPlus().GetMaxHealth() * (this.health_damage_pct_threshold * 0.01);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().IsAlive() && this.last_attacker) {
            this.last_attacker.TrueKilled(this.GetParentPlus(), undefined);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE, false, true)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetParentPlus()) {
            this.last_attacker = keys.attacker;
            this.damage_taken = this.damage_taken + keys.damage;
            if (this.damage_taken >= this.threshold_intervals) {
                while (this.damage_taken >= this.threshold_intervals && this.GetParentPlus().HasModifier("modifier_item_helm_of_the_undying_active")) {
                    this.damage_taken = this.damage_taken - this.threshold_intervals;
                    if (this.GetParentPlus().HasModifier("modifier_item_helm_of_the_undying_active")) {
                        this.GetParentPlus().findBuff("modifier_item_helm_of_the_undying_active").SetDuration(math.max(this.GetParentPlus().FindModifierByName("modifier_item_helm_of_the_undying_active").GetRemainingTime() - this.duration_reduction_per_threshold, 0), true);
                    }
                    this.SetDuration(this.GetParentPlus().findBuff("modifier_item_helm_of_the_undying_active").GetRemainingTime(), true);
                }
            }
        }
    }
}
