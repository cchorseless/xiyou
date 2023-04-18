
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
// 淬毒之珠
@registerAbility()
export class item_imba_orb_of_venom extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_orb_of_venom";
    }
}
@registerModifier()
export class modifier_item_imba_orb_of_venom extends BaseModifier_Plus {

    poison_duration: number
    public Init(params?: IModifierTable): void {
        this.poison_duration = this.GetSpecialValueFor("poison_duration");
    }


    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (!IsServer()) { return }
        if (keys.target != this.GetParent() && keys.target.IsMagicImmune() == false) {
            keys.target.AddNewModifier(this.GetParent(), this.GetItemPlus(), "modifier_item_imba_orb_of_venom_debuff", {
                duration: this.poison_duration
            })
        }
    }
}

@registerModifier()
export class modifier_item_imba_orb_of_venom_debuff extends BaseModifier_Plus {
    poison_damage_melee: number;
    poison_damage_range: number;
    poison_movement_speed_melee: number;
    poison_movement_speed_range: number;
    public Init(params?: IModifierTable): void {
        this.poison_damage_melee = this.GetSpecialValueFor("poison_damage_melee");
        this.poison_damage_range = this.GetSpecialValueFor("poison_damage_range");
        this.poison_movement_speed_melee = this.GetSpecialValueFor("poison_movement_speed_melee");
        this.poison_movement_speed_range = this.GetSpecialValueFor("poison_movement_speed_range");
        this.OnIntervalThink();
        this.StartIntervalThink(1);
    }


    OnIntervalThink(): void {
        if (!IsServer()) { return }
        let damage = this.GetParentPlus().IsRangedAttacker() ? this.poison_damage_range : this.poison_damage_melee
        ApplyDamage({
            victim: this.GetParent(),
            attacker: this.GetCaster(),
            damage: damage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            ability: this.GetAbility(),
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
        })
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_REDUCTION_PERCENTAGE)
    CC_MOVESPEED_REDUCTION_PERCENTAGE(): number {
        if (this.GetParentPlus().IsRangedAttacker()) {
            return this.poison_movement_speed_range
        } else {
            return this.poison_movement_speed_melee
        }
    }
}