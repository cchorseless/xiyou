
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class item_imba_octarine_core extends BaseItem_Plus {

    GetIntrinsicModifierName(): string {
        return "modifier_imba_octarine_core_basic";
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Item.DropGemWorld");
        if (this.GetCasterPlus().findBuffStack("modifier_imba_octarine_core_basic", this.GetCasterPlus()) == 1) {
            for (const [_, mod] of GameFunc.iPair(this.GetParentPlus().FindAllModifiersByName(this.GetIntrinsicModifierName()))) {
                mod.SetStackCount(2);
            }
        } else {
            for (const [_, mod] of GameFunc.iPair(this.GetParentPlus().FindAllModifiersByName(this.GetIntrinsicModifierName()))) {
                mod.SetStackCount(1);
            }
        }
        this.EndCooldown();
    }
    GetAbilityTextureName(): string {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_octarine_core_basic", this.GetCasterPlus()) == 1) {
            return "imba_octarine_core_off";
        } else {
            return "imba_octarine_core";
        }
    }
}
@registerModifier()
export class modifier_imba_octarine_core_basic extends BaseModifier_Plus {
    public lifesteal_pfx: any;
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
        this.SetStackCount(2);
        for (const [_, mod] of GameFunc.iPair(this.GetParentPlus().FindAllModifiersByName(this.GetName()))) {
            mod.GetItemPlus().SetSecondaryCharges(_);
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        for (const [_, mod] of GameFunc.iPair(this.GetParentPlus().FindAllModifiersByName(this.GetName()))) {
            mod.GetItemPlus().SetSecondaryCharges(_);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            4: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE,
            5: GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE,
            6: Enum_MODIFIER_EVENT.ON_SPENT_MANA
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    CC_GetModifierManaBonus(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_mana");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    CC_GetModifierHealthBonus(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_health");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_intelligence");
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (keys.attacker == this.GetParentPlus() && !keys.unit.IsBuilding() && !keys.unit.IsOther()) {
            if (this.GetParentPlus().FindAllModifiersByName(this.GetName())[0] == this && keys.damage_category == DamageCategory_t.DOTA_DAMAGE_CATEGORY_SPELL && keys.inflictor && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_LIFESTEAL) {
                this.lifesteal_pfx = ResHelper.CreateParticleEx("particles/items3_fx/octarine_core_lifesteal.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, keys.attacker);
                ParticleManager.SetParticleControl(this.lifesteal_pfx, 0, keys.attacker.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(this.lifesteal_pfx);
                if (keys.unit.IsIllusion()) {
                    if (keys.damage_type == DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL && keys.unit.GetPhysicalArmorValue) {
                        keys.damage = keys.original_damage * (1 - GPropertyCalculate.GetPhysicalReductionPect(keys.unit, null) / 100);
                    } else if (keys.damage_type == DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL && keys.unit.GetMagicalArmorValue) {
                        keys.damage = keys.original_damage * (1 - GPropertyCalculate.GetMagicalReductionPect(keys.unit, null) / 100);
                    } else if (keys.damage_type == DAMAGE_TYPES.DAMAGE_TYPE_PURE) {
                        keys.damage = keys.original_damage;
                    }
                }
                if (keys.unit.IsCreep()) {
                    keys.attacker.ApplyHeal(math.max(keys.damage, 0) * this.GetItemPlus().GetSpecialValueFor("creep_lifesteal") * 0.01, keys.inflictor);
                } else {
                    keys.attacker.ApplyHeal(math.max(keys.damage, 0) * this.GetItemPlus().GetSpecialValueFor("hero_lifesteal") * 0.01, keys.inflictor);
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE)
    CC_GetModifierPercentageCooldown(p_0: ModifierAbilityEvent,): number {
        if (this.GetItemPlus() && this.GetItemPlus().GetSecondaryCharges() == 1) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_cooldown");
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_SPENT_MANA)
    CC_OnSpentMana(keys: ModifierAbilityEvent & { cost: number }): void {
        if (this.GetItemPlus() && keys.unit == this.GetParentPlus() && keys.unit.FindAllModifiersByName(this.GetName())[0] == this && this.GetStackCount() == 2 && this.GetItemPlus().IsCooldownReady() && keys.cost > 0) {
            this.GetItemPlus().UseResources(false, false, true);
            let blast_duration = 0.75 * 0.75;
            let blast_speed = this.GetItemPlus().GetSpecialValueFor("blast_radius") / blast_duration;
            let damage = keys.cost * this.GetItemPlus().GetSpecialValueFor("blast_damage") * 0.01;
            let blast_pfx = ResHelper.CreateParticleEx("particles/item/octarine_core/octarine_core_active.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            ParticleManager.SetParticleControl(blast_pfx, 1, Vector(100, 0, blast_speed));
            ParticleManager.ReleaseParticleIndex(blast_pfx);
            this.GetParentPlus().EmitSound("Hero_Zuus.StaticField");
            for (const [_, target] of GameFunc.iPair(FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.GetItemPlus().GetSpecialValueFor("blast_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
                ApplyDamage({
                    attacker: this.GetParentPlus(),
                    victim: target,
                    ability: this.GetItemPlus(),
                    damage: damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                });
                let hit_pfx = ResHelper.CreateParticleEx("particles/item/octarine_core/octarine_core_hit.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                ParticleManager.SetParticleControl(hit_pfx, 0, target.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(hit_pfx);
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, target, damage, undefined);
            }
        }
    }
}
