
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
// 疯狂面具
@registerAbility()
export class item_imba_mask_of_madness extends BaseItem_Plus {

    GetIntrinsicModifierName(): string {
        return "modifier_imba_mask_of_madness";
    }
    OnSpellStart(): void {
        EmitSoundOn("DOTA_Item.MaskOfMadness.Activate", this.GetCasterPlus());
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_mask_of_madness_berserk", {
            duration: this.GetSpecialValueFor("berserk_duration")
        });
    }
}
@registerModifier()
export class modifier_imba_mask_of_madness extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
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
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        if (this.GetItemPlus() && IsServer()) {
            GFuncEntity.ChangeAttackProjectileImba(this.caster);
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (!this.caster.IsNull() && !this.caster.HasModifier("modifier_imba_mask_of_madness")) {
                GFuncEntity.ChangeAttackProjectileImba(this.caster);
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_BONUS)
    CC_GetModifierPreAttack_BonusDamage(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("damage_bonus");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("attack_speed_bonus");
        }
    }
    GetModifierLifesteal() {
        if (this.GetItemPlus() && this.GetParentPlus().FindAllModifiersByName(this.GetName())[0] == this) {
            return this.GetItemPlus().GetSpecialValueFor("lifesteal_pct");
        }
    }
}
@registerModifier()
export class modifier_imba_mask_of_madness_berserk extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public berserk_attack_speed: number;
    public berserk_ms_bonus_pct: number;
    public berserk_armor_reduction: any;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetItemPlus();
        this.berserk_attack_speed = this.ability.GetSpecialValueFor("berserk_attack_speed");
        this.berserk_ms_bonus_pct = this.ability.GetSpecialValueFor("berserk_ms_bonus_pct");
        this.berserk_armor_reduction = this.ability.GetSpecialValueFor("berserk_armor_reduction");
    }
    OnIntervalThink(): void {
        if (IsServer()) {
        }
    }
    GetEffectName(): string {
        return "particles/items2_fx/mask_of_madness.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFunc = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            4: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(decFunc);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.berserk_ms_bonus_pct;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.berserk_attack_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.berserk_armor_reduction * (-1);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_SILENCED]: true
        }
        return state;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
    }
    BeDestroy(): void {
        if (IsServer()) {
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
}
