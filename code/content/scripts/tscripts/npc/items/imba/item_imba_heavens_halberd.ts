
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
const active_sword_sound = "DOTA_Item.IronTalon.Activate";
// 天堂之戟
@registerAbility()
export class item_imba_heavens_halberd extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_heavens_halberd";
    }
    OnSpellStart( /** keys */): void {
        if (IsServer() && !this.GetCursorTarget().TriggerSpellAbsorb(this)) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            let duration = this.GetSpecialValueFor("disarm_melee_duration");
            if (target.IsRangedAttacker()) {
                duration = this.GetSpecialValueFor("disarm_range_duration");
            }
            if (target.GetTeamNumber() == caster.GetTeamNumber()) {
                target.AddNewModifier(caster, this, "modifier_item_imba_heavens_halberd_ally_buff", {
                    duration: this.GetSpecialValueFor("buff_duration")
                });
                this.GetCasterPlus().EmitSound(active_sword_sound);
            } else {
                target.AddNewModifier(caster, this, "modifier_item_imba_heavens_halberd_active_disarm", {
                    duration: duration * (1 - target.GetStatusResistance())
                });
                target.EmitSound("DOTA_Item.HeavensHalberd.Activate");
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_heavens_halberd extends BaseModifier_Plus {
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
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_damage");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_strength");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT)
    CC_GetModifierEvasion_Constant(p_0: ModifierAttackEvent,): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_evasion");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_status_resistance");
    }
}
@registerModifier()
export class modifier_item_imba_heavens_halberd_ally_buff extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/items2_fx/sange_active.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_status_resistance_active");
    }
}
@registerModifier()
export class modifier_item_imba_heavens_halberd_active_disarm extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/items2_fx/heavens_halberd.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let states = {
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        }
        return states;
    }
}
