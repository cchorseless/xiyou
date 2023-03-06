
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class item_nokrash_blade extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_nokrash_blade";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            if (this.GetCasterPlus().HasModifier("modifier_item_nokrash_blade_unique")) {
                this.GetCasterPlus().RemoveModifierByName("modifier_item_nokrash_blade_unique");
            } else {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_item_nokrash_blade_unique", {});
            }
        }
    }
    GetAbilityTextureName(): string {
        if (this.GetCasterPlus().HasModifier("modifier_item_nokrash_blade_unique")) {
            return "nokrash_blade_active";
        } else {
            return "nokrash_blade";
        }
    }
}
@registerModifier()
export class modifier_item_nokrash_blade extends BaseModifier_Plus {
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
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MANACOST_PERCENTAGE,
            4: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_intellect");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_spell_amp");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANACOST_PERCENTAGE)
    CC_GetModifierPercentageManacost(p_0: ModifierAbilityEvent,): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_manacost_reduction");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_intellect");
    }
}
@registerModifier()
export class modifier_item_nokrash_blade_unique extends BaseModifier_Plus {
    public magicAttack: any;
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPermanent(): boolean {
        return true;
    }
    ActivateNokrahProjectile() {
        if (IsServer()) {
            this.GetParentPlus().SetRangedProjectileName("particles/items_fx/nokrahs_blade.vpcf");
        }
    }
    DeactivateNokrahProjectile() {
        if (IsServer()) {
            let owner = this.GetParentPlus();
            // if (NPC_HEROES_CUSTOM[owner.GetUnitName()]) {
            //     if (NPC_HEROES_CUSTOM[owner.GetUnitName()]["ProjectileModel"]) {
            //         owner.SetRangedProjectileName(NPC_HEROES_CUSTOM[owner.GetUnitName()]["ProjectileModel"]);
            //     }
            // } else if (NPC_HEROES[owner.GetUnitName()]) {
            //     if (NPC_HEROES[owner.GetUnitName()]["ProjectileModel"]) {
            //         owner.SetRangedProjectileName(NPC_HEROES[owner.GetUnitName()]["ProjectileModel"]);
            //     }
            // }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_START,
            2: Enum_MODIFIER_EVENT.ON_ATTACK,
            3: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    CC_OnAttackStart(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            if (this.GetParentPlus() == keys.attacker) {
                let owner = this.GetParentPlus();
                if ((!owner) || (!owner.HasModifier("modifier_item_nokrash_blade"))) {
                    this.DeactivateNokrahProjectile();
                    this.Destroy();
                    return undefined;
                }
                if (owner.IsIllusion()) {
                    return undefined;
                }
                let target = keys.target;
                if (target.IsBuilding()) {
                    return undefined;
                }
                let ability = this.GetItemPlus();
                if (owner.GetMana() < ability.GetSpecialValueFor("mana_cost")) {
                    return undefined;
                } else {
                    this.ActivateNokrahProjectile();
                    this.AddTimer(0.01, () => {
                        this.DeactivateNokrahProjectile();
                    });
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            if (this.GetParentPlus() == keys.attacker) {
                let owner = this.GetParentPlus();
                this.magicAttack = false;
                if (owner.IsIllusion()) {
                    return undefined;
                }
                let target = keys.target;
                if (target.IsBuilding()) {
                    return undefined;
                }
                if (keys.no_attack_cooldown) {
                    return undefined;
                }
                let ability = this.GetItemPlus();
                if (owner.GetMana() < ability.GetSpecialValueFor("mana_cost")) {
                    return undefined;
                } else {
                    this.magicAttack = true;
                    owner.SpendMana(ability.GetSpecialValueFor("mana_cost"), ability);
                    owner.EmitSound("DOTA_Item.Nokrahs_Blade.Attack");
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            if (this.GetParentPlus() == keys.attacker) {
                let owner = this.GetParentPlus();
                let target = keys.target;
                let ability = this.GetItemPlus();
                if (owner.IsIllusion()) {
                    return undefined;
                }
                if (target.IsBuilding()) {
                    return undefined;
                }
                if (!this.magicAttack) {
                    return undefined;
                }
                if (!owner.IsRangedAttacker()) {
                    let impact_pfx = ResHelper.CreateParticleEx("particles/items_fx/nokrahs_blade_explosion_flash.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, target);
                    ParticleManager.SetParticleControl(impact_pfx, 3, target.GetAbsOrigin());
                    ParticleManager.ReleaseParticleIndex(impact_pfx);
                }
                target.EmitSound("DOTA_Item.Nokrahs_Blade.Hit");
                owner.AddNewModifier(owner, ability, "modifier_item_nokrash_blade_buff", {
                    duration: 0.01
                });
                target.AddNewModifier(owner, ability, "modifier_item_nokrash_blade_buff", {
                    duration: 0.01
                });
                target.AddNewModifier(owner, ability, "modifier_item_nokrash_blade_debuff", {
                    duration: ability.GetSpecialValueFor("duration")
                });
                ApplyDamage({
                    attacker: owner,
                    victim: target,
                    ability: ability,
                    damage: keys.original_damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_DAMAGE_MULTIPLIERS
                });
            }
        }
    }
}
@registerModifier()
export class modifier_item_nokrash_blade_debuff extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetTexture(): string {
        return "nokrash_blade_active";
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.GetItemPlus().GetSpecialValueFor("magic_resist_debuff");
    }
}
@registerModifier()
export class modifier_item_nokrash_blade_buff extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL)
    CC_GetAbsoluteNoDamagePhysical(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
}
