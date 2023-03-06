
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_sogat_cuirass extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_sogat_cuirass";
    }
    OnSpellStart( /** keys */): void {
        if (IsServer()) {
            let non_relevant_units: { [k: string]: boolean } = {
                ["npc_imba_alchemist_greevil"]: true
            }
            this.GetCasterPlus().EmitSound("Item.CrimsonGuard.Cast");
            let cast_pfx = ResHelper.CreateParticleEx("particles/items2_fx/sogat_cuirass_active_launch.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
            ParticleManager.SetParticleControl(cast_pfx, 0, this.GetCasterPlus().GetAbsOrigin());
            ParticleManager.SetParticleControl(cast_pfx, 1, this.GetCasterPlus().GetAbsOrigin());
            ParticleManager.SetParticleControl(cast_pfx, 2, Vector(this.GetSpecialValueFor("active_radius"), 0, 0));
            ParticleManager.ReleaseParticleIndex(cast_pfx);
            let nearby_allies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, ally] of GameFunc.iPair(nearby_allies)) {
                if (!non_relevant_units[ally.GetUnitName()] && !ally.HasModifier("modifier_item_imba_sogat_cuirass_nostack")) {
                    ally.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_sogat_cuirass_buff", {
                        duration: this.GetSpecialValueFor("duration")
                    });
                    ally.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_sogat_cuirass_nostack", {
                        duration: this.GetEffectiveCooldown(this.GetLevel()) - 1
                    });
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_sogat_cuirass extends BaseModifier_Plus {
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
        if (IsServer() && this.GetItemPlus()) {
            if (!this.GetCasterPlus().HasModifier("modifier_imba_sogat_cuirass_aura_positive")) {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_imba_sogat_cuirass_aura_positive", {});
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_imba_sogat_cuirass_aura_negative", {});
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (!this.GetCasterPlus().HasModifier("modifier_imba_sogat_cuirass")) {
                this.GetCasterPlus().RemoveModifierByName("modifier_imba_sogat_cuirass_aura_positive");
                this.GetCasterPlus().RemoveModifierByName("modifier_imba_sogat_cuirass_aura_negative");
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            5: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_CONSTANT_BLOCK
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    CC_GetModifierHealthBonus(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_health");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_health_regen");
        }
    }
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
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_CONSTANT_BLOCK)
    CC_GetModifierPhysical_ConstantBlock(p_0: ModifierAttackEvent,): number {
        if (this.GetItemPlus()) {
            if (GFuncRandom.PRD(this.GetItemPlus().GetSpecialValueFor("block_chance"), this)) {
                if (!this.GetParentPlus().IsRangedAttacker()) {
                    return this.GetItemPlus().GetSpecialValueFor("block_damage_melee");
                } else {
                    return this.GetItemPlus().GetSpecialValueFor("block_damage_ranged");
                }
            }
        }
    }
    GetCustomIncomingDamageReductionUnique() {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("damage_reduction_pct_passive");
        }
    }
}
@registerModifier()
export class modifier_imba_sogat_cuirass_aura_positive extends BaseModifier_Plus {
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
        if (target.HasModifier("modifier_imba_siege_cuirass_aura_positive_effect")) {
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
        return "modifier_imba_sogat_cuirass_aura_positive_effect";
    }
    IsAura(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_sogat_cuirass_aura_positive_effect extends BaseModifier_Plus {
    public aura_as_ally: any;
    public aura_armor_ally: any;
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return undefined;
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
}
@registerModifier()
export class modifier_imba_sogat_cuirass_aura_negative extends BaseModifier_Plus {
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
        return "modifier_imba_sogat_cuirass_aura_negative_effect";
    }
    IsAura(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_sogat_cuirass_aura_negative_effect extends BaseModifier_Plus {
    public aura_armor_reduction_enemy: any;
    GetTexture(): string {
        return "/imba_sogat_cuirass";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (this.GetItemPlus()) {
            this.aura_armor_reduction_enemy = this.GetItemPlus().GetSpecialValueFor("aura_armor_reduction_enemy") * (-1);
        } else {
            this.aura_armor_reduction_enemy = 0;
        }
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
@registerModifier()
export class modifier_item_imba_sogat_cuirass_buff extends BaseModifier_Plus {
    public active_armor: any;
    public block_damage_melee_active: number;
    public block_damage_ranged_active: number;
    public block_chance_active: number;
    public damage_reduction_pct: number;
    public sogat_active_pfx: any;
    IsHidden(): boolean {
        return false;
    }
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
        this.damage_reduction_pct = this.GetItemPlus().GetSpecialValueFor("damage_reduction_pct");
        if (IsServer()) {
            this.damage_reduction_pct = this.GetItemPlus().GetSpecialValueFor("damage_reduction_pct");
            this.sogat_active_pfx = ResHelper.CreateParticleEx("particles/items2_fx/sogat_cuirass_active.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus());
            ParticleManager.SetParticleControl(this.sogat_active_pfx, 0, this.GetParentPlus().GetAbsOrigin());
            ParticleManager.SetParticleControlEnt(this.sogat_active_pfx, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
            this.AddParticle(this.sogat_active_pfx, false, false, -1, false, false);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_CONSTANT_BLOCK,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
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
        return this.damage_reduction_pct;
    }
    GetCustomIncomingDamageReductionUnique() {
        return this.damage_reduction_pct;
    }
}
@registerModifier()
export class modifier_item_imba_sogat_cuirass_nostack extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
