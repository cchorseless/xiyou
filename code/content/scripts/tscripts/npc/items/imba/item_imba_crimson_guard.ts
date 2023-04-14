
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 赤红甲
@registerAbility()
export class item_imba_crimson_guard extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_crimson_guard";
    }
    OnSpellStart( /** keys */): void {
        let caster = this.GetCasterPlus();
        let caster_loc = caster.GetAbsOrigin();
        let active_radius = this.GetSpecialValueFor("active_radius");
        let duration = this.GetSpecialValueFor("duration");
        let non_relevant_units: { [k: string]: boolean } = {
            "npc_imba_alchemist_greevil": true
        }
        caster.EmitSound("Item.CrimsonGuard.Cast");
        let cast_pfx = ResHelper.CreateParticleEx("particles/items2_fx/vanguard_active_launch.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
        ParticleManager.SetParticleControl(cast_pfx, 0, caster_loc);
        ParticleManager.SetParticleControl(cast_pfx, 1, caster_loc);
        ParticleManager.SetParticleControl(cast_pfx, 2, Vector(active_radius, 0, 0));
        ParticleManager.ReleaseParticleIndex(cast_pfx);
        let nearby_allies = FindUnitsInRadius(caster.GetTeamNumber(), caster_loc, undefined, active_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, ally] of GameFunc.iPair(nearby_allies)) {
            if (!ally.HasModifier("modifier_item_imba_sogat_cuirass_buff")) {
                if (!non_relevant_units[ally.GetUnitName()] && !ally.HasModifier("modifier_item_imba_sogat_cuirass_nostack")) {
                    ally.AddNewModifier(caster, this, "modifier_item_imba_crimson_guard_buff", {
                        duration: duration
                    });
                    ally.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_sogat_cuirass_nostack", {
                        duration: this.GetEffectiveCooldown(this.GetLevel() - 1)
                    });
                }
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_crimson_guard extends BaseModifier_Plus {
    public health: any;
    public health_regen: any;
    public armor: any;
    public block_damage_melee: number;
    public block_damage_ranged: number;
    public block_chance: number;
    public damage_reduction: number;
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
        this.health = this.GetItemPlus().GetSpecialValueFor("health");
        this.health_regen = this.GetItemPlus().GetSpecialValueFor("health_regen");
        this.armor = this.GetItemPlus().GetSpecialValueFor("armor");
        this.block_damage_melee = this.GetItemPlus().GetSpecialValueFor("block_damage_melee");
        this.block_damage_ranged = this.GetItemPlus().GetSpecialValueFor("block_damage_ranged");
        this.block_chance = this.GetItemPlus().GetSpecialValueFor("block_chance");
        this.damage_reduction = this.GetItemPlus().GetSpecialValueFor("damage_reduction");
    }
    GetCustomIncomingDamageReductionUnique() {
        return this.damage_reduction;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_CONSTANT_BLOCK
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    CC_GetModifierHealthBonus(): number {
        return this.health;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.health_regen;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.armor;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_CONSTANT_BLOCK)
    CC_GetModifierPhysical_ConstantBlock(p_0: ModifierAttackEvent,): number {
        if (GFuncRandom.PRD(this.block_chance, this)) {
            if (!this.GetParentPlus().IsRangedAttacker()) {
                return this.block_damage_melee;
            } else {
                return this.block_damage_ranged;
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_crimson_guard_buff extends BaseModifier_Plus {
    public active_armor: any;
    public block_damage_melee_active: number;
    public block_damage_ranged_active: number;
    public block_chance_active: number;
    public damage_reduction: number;
    public crimson_guard_pfx: any;
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.active_armor = this.GetItemPlus().GetSpecialValueFor("active_armor");
        this.block_damage_melee_active = this.GetItemPlus().GetSpecialValueFor("block_damage_melee_active");
        this.block_damage_ranged_active = this.GetItemPlus().GetSpecialValueFor("block_damage_ranged_active");
        this.block_chance_active = this.GetItemPlus().GetSpecialValueFor("block_chance_active");
        this.damage_reduction = this.GetItemPlus().GetSpecialValueFor("damage_reduction");
        if (IsServer()) {
            this.crimson_guard_pfx = ResHelper.CreateParticleEx("particles/items2_fx/vanguard_active.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus());
            ParticleManager.SetParticleControl(this.crimson_guard_pfx, 0, this.GetParentPlus().GetAbsOrigin());
            ParticleManager.SetParticleControlEnt(this.crimson_guard_pfx, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
            this.AddParticle(this.crimson_guard_pfx, false, false, -1, false, false);
        }
    }
    GetCustomIncomingDamageReductionUnique() {
        return this.damage_reduction;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_CONSTANT_BLOCK,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS_UNIQUE_ACTIVE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS_UNIQUE_ACTIVE)
    CC_GetModifierPhysicalArmorBonusUniqueActive(p_0: ModifierAttackEvent,): number {
        return this.active_armor;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_CONSTANT_BLOCK)
    CC_GetModifierPhysical_ConstantBlock(p_0: ModifierAttackEvent,): number {
        if (IsClient()) {
            return this.block_damage_melee_active;
        }
        if (GFuncRandom.PRD(this.block_chance_active, this)) {
            if (!this.GetParentPlus().IsRangedAttacker()) {
                return this.block_damage_melee_active;
            } else {
                return this.block_damage_ranged_active;
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.damage_reduction;
    }
}
