
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
// 腐蚀之球
@registerAbility()
export class item_imba_orb_of_corrosion extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_orb_of_corrosion";
    }
}
@registerModifier()
export class modifier_item_imba_orb_of_corrosion extends BaseModifier_Plus {

    poison_duration: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    health_bonus: number
    public Init(params?: IModifierTable): void {
        this.poison_duration = this.GetSpecialValueFor("duration");
        this.health_bonus = this.GetSpecialValueFor("health_bonus");
    }


    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (!IsServer()) { return }
        if (keys.target != this.GetParent() && keys.target.IsMagicImmune() == false) {
            keys.target.AddNewModifier(this.GetParent(), this.GetItemPlus(), "modifier_item_imba_orb_of_corrosion_debuff", {
                duration: this.poison_duration
            })
        }
    }
}

@registerModifier()
export class modifier_item_imba_orb_of_corrosion_debuff extends BaseModifier_Plus {
    damage: number;
    slow_melee: number;
    slow_range: number;
    public Init(params?: IModifierTable): void {
        this.armor = this.GetSpecialValueFor("armor") * -1;
        this.damage = this.GetSpecialValueFor("damage");
        this.slow_melee = this.GetSpecialValueFor("slow_melee");
        this.slow_range = this.GetSpecialValueFor("slow_range");
        this.OnIntervalThink();
        this.StartIntervalThink(1);
    }


    OnIntervalThink(): void {
        if (!IsServer()) { return }
        ApplyDamage({
            victim: this.GetParent(),
            attacker: this.GetCaster(),
            damage: this.damage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            ability: this.GetAbility(),
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
        })
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    armor: number;

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_REDUCTION_PERCENTAGE)
    CC_MOVESPEED_REDUCTION_PERCENTAGE(): number {
        if (this.GetParentPlus().IsRangedAttacker()) {
            return this.slow_range
        } else {
            return this.slow_melee
        }
    }
}