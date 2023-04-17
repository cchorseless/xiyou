
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
import { modifier_item_imba_javelin } from "./item_imba_javelin";
// 金箍棒
@registerAbility()
export class item_imba_monkey_king_bar extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_monkey_king_bar";
    }
}

@registerModifier()
export class modifier_item_imba_monkey_king_bar extends modifier_item_imba_javelin {

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
        this.ability = this.GetItemPlus()
        this.parent = this.GetParentPlus()
        // AbilitySpecials
        this.bonus_damage = this.ability.GetSpecialValueFor("bonus_damage")
        this.bonus_range = this.ability.GetSpecialValueFor("bonus_range")
        this.bonus_chance = this.ability.GetSpecialValueFor("bonus_chance")
        this.bonus_chance_damage = this.ability.GetSpecialValueFor("bonus_chance_damage")
        this.bonus_attack_speed = this.ability.GetSpecialValueFor("bonus_attack_speed")
        // Tracking when to give the true strike + bonus magical damage
        this.pierce_proc = true
        this.pierce_records = {}

        if (IsServer()) {
            this.parent.FindAllModifiersByName(this.GetName()).forEach((modifier, index) => {
                this.ability.SetSecondaryCharges(index + 1)
            });
        }
    }


    public BeDestroy(): void {
        if (IsServer()) {
            this.parent.FindAllModifiersByName(this.GetName()).forEach((modifier, index) => {
                this.ability.SetSecondaryCharges(index + 1)
            });
        }
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    bonus_attack_speed: number;

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_ATTACK_RANGE_BONUS() {
        if (!this.parent.IsRangedAttacker() && this.ability.GetSecondaryCharges() == 1) {
            return this.bonus_range
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_MAGICAL)
    CC_PROCATTACK_BONUS_DAMAGE_MAGICAL(keys: ModifierAttackEvent) {
        if (IsServer()) {
            if (this.pierce_records[keys.record + ""]) {
                delete this.pierce_records[keys.record + ""];
                if (this.parent.IsRealUnit() && this.ability.GetSecondaryCharges() == 1) {
                    SendOverheadEventMessage(null, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, keys.target, this.bonus_chance_damage, null)
                    return this.bonus_chance_damage
                }
            }

        }

    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    CC_ON_ATTACK_RECORD(keys: ModifierAttackEvent) {
        if (this.pierce_proc) {
            this.pierce_records[keys.record + ""] = true;
            this.pierce_proc = false
        }
        if (GFuncRandom.PRD(this.bonus_chance, this)) {
            this.pierce_proc = true
        }
    }

}