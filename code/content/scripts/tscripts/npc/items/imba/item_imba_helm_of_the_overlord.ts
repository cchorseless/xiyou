
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 统御头盔
@registerAbility()
export class item_imba_helm_of_the_overlord extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "item_imba_helm_of_the_overlord_passive";
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        // let caster = this.GetCasterPlus();
        // let target = this.GetCursorTarget();
        // if (target.GetTeam() != caster.GetTeam()) {
        //     if (target.TriggerSpellAbsorb(this)) {
        //         return;
        //     }
        // }
        // if (target.IsMagicImmune()) {
        //     return;
        // }
        // let duration = this.GetSpecialValueFor("duration");
        // target.AddNewModifier(caster, this, "modifier_imba_medallion_of_courage_debuff", { duration: duration })
    }

}
@registerModifier()
export class item_imba_helm_of_the_overlord_passive extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_ALL_BONUS)
    CC_STATS_ALL_BONUS(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_stats");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_PHYSICAL_ARMOR_BONUS(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_armor");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_HEALTH_REGEN_CONSTANT(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_regen");
    }
}
@registerModifier()
export class item_imba_helm_of_the_overlord_buff extends BaseModifier_Plus {
    public IsDebuff(): boolean {
        return true
    }

    public IsPurgable(): boolean {
        return true
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    armor_reduction: number;
    public Init(params?: IModifierTable): void {
        this.armor_reduction = this.GetSpecialValueFor("armor_reduction")
        // todo 特效
    }

}