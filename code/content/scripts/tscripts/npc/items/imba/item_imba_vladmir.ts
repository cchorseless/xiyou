
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
// 祭品
@registerAbility()
export class item_imba_vladmir extends BaseItem_Plus {

    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AURA;
    }
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        return this.GetSpecialValueFor("aura_radius") - this.GetCasterPlus().GetCastRangeBonus();
    }
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_vladmir";
    }
}
@registerModifier()
export class modifier_item_imba_vladmir extends BaseModifier_Plus {
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
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("aura_radius");
        }
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_item_imba_vladmir_aura";
    }
    GetAuraEntityReject(hTarget: CDOTA_BaseNPC): boolean {
        return hTarget.HasModifier("modifier_item_imba_vladmir_blood_aura");
    }
}
@registerModifier()
export class modifier_item_imba_vladmir_aura extends BaseModifier_Plus {
    public damage_aura: number;
    public armor_aura: any;
    public hp_regen_aura: any;
    public mana_regen_aura: any;
    public vampiric_aura: any;
    public lifesteal_pfx: any;
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetTexture(): string {
        return "imba_vladmir";
    }
    BeCreated(keys: any): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.damage_aura = this.GetItemPlus().GetSpecialValueFor("damage_aura");
        this.armor_aura = this.GetItemPlus().GetSpecialValueFor("armor_aura");
        this.hp_regen_aura = this.GetItemPlus().GetSpecialValueFor("hp_regen_aura");
        this.mana_regen_aura = this.GetItemPlus().GetSpecialValueFor("mana_regen_aura");
        this.vampiric_aura = this.GetItemPlus().GetSpecialValueFor("vampiric_aura");
        if (IsServer() && this.GetParentPlus().IsRealUnit()) {
            GFuncEntity.ChangeAttackProjectileImba(this.GetParentPlus());
        }
    }
    BeDestroy(): void {
        if (IsServer() && this.GetParentPlus().IsRealUnit()) {
            GFuncEntity.ChangeAttackProjectileImba(this.GetParentPlus());
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.LIFESTEAL_PERCENTAGE)
    CC_LIFESTEAL_AMPLIFY_PERCENTAGE() {
        return this.GetItemPlus().GetSpecialValueFor("vampiric_aura");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_ATTACK_DAMAGE_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS_UNIQUE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT,
            5: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_ATTACK_DAMAGE_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        if (this.GetParentPlus().HasModifier("modifier_item_imba_vladmir_blood_aura")) {
            return 0;
        } else {
            if (this.damage_aura) {
                return this.damage_aura;
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS_UNIQUE)
    CC_GetModifierPhysicalArmorBonusUnique(p_0: ModifierAttackEvent,): number {
        return this.armor_aura;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        if (this.GetParentPlus().HasModifier("modifier_item_imba_vladmir_blood_aura")) {
            return 0;
        } else {
            if (this.hp_regen_aura) {
                return this.hp_regen_aura;
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        if (this.GetParentPlus().HasModifier("modifier_item_imba_vladmir_blood_aura")) {
            return 0;
        } else {
            if (this.mana_regen_aura) {
                return this.mana_regen_aura;
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (!keys.attacker.HasModifier("modifier_item_imba_vladmir_blood_aura") && !keys.attacker.HasModifier("modifier_custom_mechanics") && keys.attacker == this.GetParentPlus() && !keys.unit.IsBuilding() && !keys.unit.IsOther() && keys.unit.GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
            if (keys.damage_category == DamageCategory_t.DOTA_DAMAGE_CATEGORY_SPELL && keys.inflictor && GPropertyCalculate.GetSpellLifeStealPercent(this.GetParentPlus()) > 0 && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL) {
                this.lifesteal_pfx = ResHelper.CreateParticleEx("particles/items3_fx/octarine_core_lifesteal.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, keys.attacker);
                ParticleManager.SetParticleControl(this.lifesteal_pfx, 0, keys.attacker.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(this.lifesteal_pfx);
                keys.attacker.ApplyHeal(math.max(keys.damage, 0) * this.vampiric_aura * 0.01, this.GetItemPlus());
            } else if (keys.damage_category == DamageCategory_t.DOTA_DAMAGE_CATEGORY_ATTACK && GPropertyCalculate.GetLifeStealPercent(this.GetParentPlus()) > 0) {
                this.lifesteal_pfx = ResHelper.CreateParticleEx("particles/item/vladmir/vladmir_blood_lifesteal.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, keys.attacker);
                ParticleManager.SetParticleControl(this.lifesteal_pfx, 0, keys.attacker.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(this.lifesteal_pfx);
                keys.attacker.ApplyHeal(keys.damage * this.vampiric_aura * 0.01, this.GetItemPlus());
            }
        }
    }
}
// 祭品2级
@registerAbility()
export class item_imba_vladmir_2 extends BaseItem_Plus {

    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AURA;
    }
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        return this.GetSpecialValueFor("aura_radius") - this.GetCasterPlus().GetCastRangeBonus();
    }
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_vladmir_blood";
    }
}
@registerModifier()
export class modifier_item_imba_vladmir_blood extends BaseModifier_Plus {
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
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("aura_radius");
        }
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_item_imba_vladmir_blood_aura";
    }
}
@registerModifier()
export class modifier_item_imba_vladmir_blood_aura extends BaseModifier_Plus {
    public damage_aura: number;
    public armor_aura: any;
    public hp_regen_aura: any;
    public mana_regen_aura: any;
    public vampiric_aura: any;
    public lifesteal_pfx: any;
    GetTexture(): string {
        return "imba_vladmir_2";
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.damage_aura = this.GetItemPlus().GetSpecialValueFor("damage_aura");
        this.armor_aura = this.GetItemPlus().GetSpecialValueFor("armor_aura");
        this.hp_regen_aura = this.GetItemPlus().GetSpecialValueFor("hp_regen_aura");
        this.mana_regen_aura = this.GetItemPlus().GetSpecialValueFor("mana_regen_aura");
        this.vampiric_aura = this.GetItemPlus().GetSpecialValueFor("vampiric_aura");
        if (IsServer() && this.GetParentPlus().IsRealUnit()) {
            GFuncEntity.ChangeAttackProjectileImba(this.GetParentPlus());
        }
    }
    BeDestroy(): void {
        if (IsServer() && this.GetParentPlus().IsRealUnit()) {
            let parent = this.GetParentPlus();
            GFuncEntity.ChangeAttackProjectileImba(parent);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.LIFESTEAL_PERCENTAGE)
    CC_LIFESTEAL_AMPLIFY_PERCENTAGE() {
        return this.vampiric_aura;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_LIFESTEAL_PERCENTAGE)
    CC_SPELL_LIFESTEAL_AMPLIFY_PERCENTAGE() {
        return this.vampiric_aura;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_ATTACK_DAMAGE_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS_UNIQUE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT,
            5: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_ATTACK_DAMAGE_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.damage_aura;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS_UNIQUE)
    CC_GetModifierPhysicalArmorBonusUnique(p_0: ModifierAttackEvent,): number {
        return this.armor_aura;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.hp_regen_aura;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        return this.mana_regen_aura;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (!keys.attacker.HasModifier("modifier_custom_mechanics") && keys.attacker == this.GetParentPlus() && !keys.unit.IsBuilding() && !keys.unit.IsOther() && keys.unit.GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
            if (keys.damage_category == DamageCategory_t.DOTA_DAMAGE_CATEGORY_SPELL && keys.inflictor && GPropertyCalculate.GetSpellLifeStealPercent(this.GetParentPlus()) > 0 && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL) {
                this.lifesteal_pfx = ResHelper.CreateParticleEx("particles/items3_fx/octarine_core_lifesteal.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, keys.attacker);
                ParticleManager.SetParticleControl(this.lifesteal_pfx, 0, keys.attacker.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(this.lifesteal_pfx);
                keys.attacker.ApplyHeal(math.max(keys.damage, 0) * this.vampiric_aura * 0.01, this.GetItemPlus());
            } else if (keys.damage_category == DamageCategory_t.DOTA_DAMAGE_CATEGORY_ATTACK && GPropertyCalculate.GetLifeStealPercent(this.GetParentPlus()) > 0) {
                this.lifesteal_pfx = ResHelper.CreateParticleEx("particles/item/vladmir/vladmir_blood_lifesteal.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, keys.attacker);
                ParticleManager.SetParticleControl(this.lifesteal_pfx, 0, keys.attacker.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(this.lifesteal_pfx);
                keys.attacker.ApplyHeal(keys.damage * this.vampiric_aura * 0.01, this.GetItemPlus());
            }
        }
    }
}
