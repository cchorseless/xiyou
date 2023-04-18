
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 勇气勋章
@registerAbility()
export class item_imba_medallion_of_courage extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_medallion_of_courage_passive";
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let target = this.GetCursorTarget();
        if (target.GetTeam() != caster.GetTeam()) {
            if (target.TriggerSpellAbsorb(this)) {
                return;
            }
        }
        if (target.IsMagicImmune()) {
            return;
        }
        let duration = this.GetSpecialValueFor("duration");
        target.AddNewModifier(caster, this, "modifier_imba_medallion_of_courage_debuff", { duration: duration })
    }

}
@registerModifier()
export class modifier_imba_medallion_of_courage_passive extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_PHYSICAL_ARMOR_BONUS(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_armor");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_AMPLIFY_PERCENTAGE)
    CC_MANA_REGEN_AMPLIFY_PERCENTAGE(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_mana_regen_pct");
    }

}
@registerModifier()
export class modifier_imba_medallion_of_courage_debuff extends BaseModifier_Plus {
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
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_disarm.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
}