
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 强袭胸甲
@registerAbility()
export class item_imba_assault extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_assault_cuirass";
    }


}
@registerModifier()
export class modifier_imba_assault_cuirass extends BaseModifier_Plus {
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
        if (!IsServer()) {
            return;
        }
        if (!this.GetCasterPlus().HasModifier("modifier_imba_assault_cuirass_aura_positive")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_imba_assault_cuirass_aura_positive", {});
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_imba_assault_cuirass_aura_negative", {});
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_as");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_armor");
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (!this.GetCasterPlus().HasModifier("modifier_imba_assault_cuirass")) {
                this.GetCasterPlus().RemoveModifierByName("modifier_imba_assault_cuirass_aura_positive");
                this.GetCasterPlus().RemoveModifierByName("modifier_imba_assault_cuirass_aura_negative");
            }
        }
    }
}
@registerModifier()
export class modifier_imba_assault_cuirass_aura_positive extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    AllowIllusionDuplicate(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("radius");
        }
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        if (target.HasModifier("modifier_imba_siege_cuirass_aura_positive_effect") || target.HasModifier("modifier_imba_sogat_cuirass_aura_positive")) {
            return true;
        }
        return false;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING;
    }
    GetModifierAura(): string {
        return "modifier_imba_assault_cuirass_aura_positive_effect";
    }
    IsAura(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_assault_cuirass_aura_positive_effect extends BaseModifier_Plus {
    public aura_as_ally: any;
    public aura_armor_ally: any;
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            if (IsServer()) {
                this.Destroy();
            }
            return;
        }
        this.aura_as_ally = this.GetItemPlus().GetSpecialValueFor("aura_as_ally");
        this.aura_armor_ally = this.GetItemPlus().GetSpecialValueFor("aura_armor_ally");
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
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.aura_as_ally;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.aura_armor_ally;
    }
    GetEffectName(): string {
        return "particles/items_fx/aura_assault.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerModifier()
export class modifier_imba_assault_cuirass_aura_negative extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    AllowIllusionDuplicate(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("radius");
        }
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        if (target.HasModifier("modifier_imba_siege_cuirass_aura_negative_effect") || target.HasModifier("modifier_imba_sogat_cuirass_aura_negative")) {
            return true;
        }
        return false;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING;
    }
    GetModifierAura(): string {
        return "modifier_imba_assault_cuirass_aura_negative_effect";
    }
    IsAura(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_assault_cuirass_aura_negative_effect extends BaseModifier_Plus {
    public aura_armor_reduction_enemy: any;
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.aura_armor_reduction_enemy = this.GetItemPlus().GetSpecialValueFor("aura_armor_reduction_enemy") * (-1);
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.aura_armor_reduction_enemy;
    }
}
