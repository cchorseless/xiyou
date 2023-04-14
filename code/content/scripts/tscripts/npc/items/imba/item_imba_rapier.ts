
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

export class rapier_base_class extends BaseItem_Plus {
    owner_entindex: EntityIndex;
    corruption_total_time: number;
    OnOwnerDied( /** params */): void {
        let hOwner = this.GetOwnerPlus();
        if (!hOwner.IsRealUnit()) {
            hOwner.DropItem(this, true,);
            return;
        }
        // if (!hOwner.IsReincarnating()) {
        //     hOwner.DropItem(this, true,);
        // }
    }
    IsRapier() {
        return true;
    }
}
export class modifier_rapier_base_class extends BaseModifier_Plus {
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
    BeDestroy(): void {
        if (IsServer()) {
            this.StartIntervalThink(-1);
        }
    }
}
//  圣剑
@registerAbility()
export class item_imba_rapier extends rapier_base_class {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_divine_rapier";
    }
}
@registerModifier()
export class modifier_imba_divine_rapier extends modifier_rapier_base_class {
    public bonus_damage: number;
    /** DeclareFunctions():modifierfunction[] {
    let decFuns = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE
    }
    return Object.values(decFuns);
    } */
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        let item = this.GetItemPlus();
        if (item && !this.GetParentPlus().IsCourier() && !this.GetParentPlus().IsIllusion()) {
            this.bonus_damage = item.GetSpecialValueFor("bonus_damage");
        } else {
            this.bonus_damage = 0;
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_CANNOT_MISS]: true
        };
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_ATTACK_DAMAGE_BONUS(keys?: { target: IBaseNpc_Plus } /** keys */): number {
        return this.bonus_damage;
    }
}
// 2级圣剑
@registerAbility()
export class item_imba_rapier_2 extends rapier_base_class {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_divine_rapier_2";
    }

}
@registerModifier()
export class modifier_imba_divine_rapier_2 extends modifier_rapier_base_class {
    public parent: IBaseNpc_Plus;
    public bonus_damage: number;
    /** DeclareFunctions():modifierfunction[] {
    let decFuns = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
        2: GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION,
        3: GPropertyConfig.EMODIFIER_PROPERTY.FORCE_DRAW_MINIMAP
    }
    return Object.values(decFuns);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.FORCE_DRAW_MINIMAP)
    CC_GetForceDrawOnMinimap(): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
    CC_GetModifierProvidesFOWVision(): 0 | 1 {
        return 1;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        let item = this.GetItemPlus();
        this.parent = this.GetParentPlus();
        if (item && !this.GetParentPlus().IsCourier() && !this.GetParentPlus().IsIllusion()) {
            this.bonus_damage = item.GetSpecialValueFor("bonus_damage");
        } else {
            this.bonus_damage = 0;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.bonus_damage;
    }
    GetEffectName(): string {
        return "particles/item/rapier/rapier_trail_regular.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_CANNOT_MISS]: true
        };
    }
}
// 魔法圣剑
@registerAbility()
export class item_imba_rapier_magic extends rapier_base_class {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_arcane_rapier";
    }

}
@registerModifier()
export class modifier_imba_arcane_rapier extends modifier_rapier_base_class {
    public spell_power: any;
    /** DeclareFunctions():modifierfunction[] {
    let decFuns = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE
    }
    return Object.values(decFuns);
    } */
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        let item = this.GetItemPlus();
        if (item && !this.GetParentPlus().IsCourier() && !this.GetParentPlus().IsIllusion()) {
            this.spell_power = item.GetSpecialValueFor("spell_power");
        } else {
            this.spell_power = 0;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        return this.spell_power;
    }
}
// 2级魔法圣剑
@registerAbility()
export class item_imba_rapier_magic_2 extends rapier_base_class {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_arcane_rapier_2";
    }

}
@registerModifier()
export class modifier_imba_arcane_rapier_2 extends modifier_rapier_base_class {
    public parent: IBaseNpc_Plus;
    public spell_power: any;
    /** DeclareFunctions():modifierfunction[] {
    let decFuns = {
        1: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE,
        2: GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION,
        3: GPropertyConfig.EMODIFIER_PROPERTY.FORCE_DRAW_MINIMAP
    }
    return Object.values(decFuns);
    } */
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        let item = this.GetItemPlus();
        this.parent = this.GetParentPlus();
        if (item && !this.GetParentPlus().IsCourier() && !this.GetParentPlus().IsIllusion()) {
            this.spell_power = item.GetSpecialValueFor("spell_power");
        } else {
            this.spell_power = 0;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        return this.spell_power;
    }
    GetEffectName(): string {
        return "particles/item/rapier/rapier_trail_arcane.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
    CC_GetModifierProvidesFOWVision(): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.FORCE_DRAW_MINIMAP)
    CC_GetForceDrawOnMinimap(): 0 | 1 {
        return 1;
    }
}
// 诅咒圣剑
@registerAbility()
export class item_imba_rapier_cursed extends rapier_base_class {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_rapier_cursed";
    }

}
@registerModifier()
export class modifier_imba_rapier_cursed extends modifier_rapier_base_class {
    public parent: IBaseNpc_Plus;
    public spell_power: any;
    public bonus_damage: number;
    public tenacity_pct: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        let item = this.GetItemPlus();
        this.parent = this.GetParentPlus();
        if (item && !this.GetParentPlus().IsCourier() && !this.GetParentPlus().IsIllusion()) {
            this.spell_power = item.GetSpecialValueFor("spell_power");
            this.bonus_damage = item.GetSpecialValueFor("bonus_damage");
            this.tenacity_pct = item.GetSpecialValueFor("tenacity_pct");
            if (IsServer()) {
                if (!this.parent.HasModifier("modifier_imba_rapier_cursed_damage_reduction")) {
                    this.parent.AddNewModifier(this.parent, item, "modifier_imba_rapier_cursed_damage_reduction", {});
                }
                if (!this.parent.HasModifier("modifier_imba_rapier_cursed_curse")) {
                    this.parent.AddNewModifier(this.parent, item, "modifier_imba_rapier_cursed_curse", {});
                }
            }
        } else {
            this.spell_power = 0;
            this.bonus_damage = 0;
        }
    }
    BeDestroy(): void {
        if (!this.parent.HasModifier("modifier_imba_rapier_cursed") && IsServer()) {
            this.parent.RemoveModifierByName("modifier_imba_rapier_cursed_damage_reduction");
            this.parent.RemoveModifierByName("modifier_imba_rapier_cursed_curse");
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_CANNOT_MISS]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE,
        2: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
        3: GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION,
        4: GPropertyConfig.EMODIFIER_PROPERTY.FORCE_DRAW_MINIMAP,
        5: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
        6: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.tenacity_pct;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        return this.spell_power;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
    CC_GetModifierProvidesFOWVision(): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.FORCE_DRAW_MINIMAP)
    CC_GetForceDrawOnMinimap(): 0 | 1 {
        return 1;
    }
    GetEffectName(): string {
        return "particles/item/rapier/item_rapier_cursed.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerModifier()
export class modifier_imba_rapier_cursed_damage_reduction extends BaseModifier_Plus {
    public damage_reduction: number;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.damage_reduction = this.GetItemPlus().GetSpecialValueFor("damage_reduction");
    }
    /** DeclareFunctions():modifierfunction[] {
    return Object.values({
        1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
    });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        return this.damage_reduction * (-1);
    }
}
@registerModifier()
export class modifier_imba_rapier_cursed_curse extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    public interval: number;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.parent = this.GetParentPlus();
        if (IsServer()) {
            this.interval = 0.1;
            if (this.GetItemPlus<item_imba_rapier_magic>().owner_entindex != this.GetParentPlus().entindex()) {
                this.GetItemPlus<item_imba_rapier_magic>().corruption_total_time = 0;
            }
            this.GetItemPlus<item_imba_rapier_magic>().owner_entindex = this.GetParentPlus().entindex();
            this.StartIntervalThink(this.interval);
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.StartIntervalThink(-1);
        }
    }
    OnIntervalThink(): void {
        if (this.GetItemPlus()) {
            this.GetItemPlus<item_imba_rapier_magic>().corruption_total_time = this.GetItemPlus<item_imba_rapier_magic>().corruption_total_time + this.interval;
            ApplyDamage({
                attacker: this.parent,
                victim: this.parent,
                ability: this.GetItemPlus(),
                damage: this.GetItemPlus().GetSpecialValueFor("base_corruption") * this.parent.GetMaxHealth() * (this.GetItemPlus<item_imba_rapier_magic>().corruption_total_time / this.GetItemPlus().GetSpecialValueFor("time_to_double")) * 0.01 * this.interval,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NON_LETHAL + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_DAMAGE_MULTIPLIERS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL
            });
        }
    }
}
