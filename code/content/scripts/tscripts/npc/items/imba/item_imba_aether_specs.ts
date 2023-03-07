
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_aether_specs extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        this.AddTimer(FrameTime(), () => {
            if (!this.IsNull()) {
                for (const [_, modifier] of GameFunc.iPair(this.GetParentPlus().FindAllModifiersByName("modifier_item_imba_aether_specs"))) {
                    modifier.SetStackCount(_);
                }
            }
        });
        return "modifier_item_imba_aether_specs";
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    OnSpellStart(): void {
        let ward = BaseNpc_Plus.CreateUnitByName("npc_dota_aether_spec_ward", this.GetCursorPosition(), this.GetCasterPlus(), false);
        ward.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_buff_ward", {
            duration: this.GetSpecialValueFor("ward_duration")
        });
        ward.AddNewModifier(this.GetCasterPlus(), this, "modifier_truesight", {
            duration: this.GetSpecialValueFor("ward_duration")
        });
        ward.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_ward_true_sight", {
            duration: this.GetSpecialValueFor("ward_duration")
        });
        ward.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_gem_of_true_sight", {
            duration: this.GetSpecialValueFor("ward_duration")
        });
        ward.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_aether_specs_ward", {
            duration: this.GetSpecialValueFor("ward_duration")
        });
        ward.SetBaseMaxHealth(this.GetSpecialValueFor("hits_to_kill") * 4);
        ward.SetMaxHealth(this.GetSpecialValueFor("hits_to_kill") * 4);
        ward.SetHealth(this.GetSpecialValueFor("hits_to_kill") * 4);
        EmitSoundOnLocationForAllies(this.GetParentPlus().GetAbsOrigin(), "DOTA_Item.ObserverWard.Activate", this.GetCasterPlus());
    }
}
@registerModifier()
export class modifier_item_imba_aether_specs_ward extends BaseModifier_Plus {
    public radius: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
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
        this.radius = this.GetItemPlus().GetSpecialValueFor("radius");
        let aura_particle = ResHelper.CreateParticleEx("particles/items_fx/aether_specs_ward_aura.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(aura_particle, 1, Vector(this.radius, 0, 0));
        this.AddParticle(aura_particle, false, false, -1, false, false);
    }
}
@registerModifier()
export class modifier_item_imba_aether_specs extends BaseModifier_Plus {
    public bonus_mana: number;
    public bonus_mana_regen: number;
    public cast_range_bonus: number;
    public spell_power: any;
    public bonus_damage: number;
    public bonus_strength: number;
    public bonus_agility: number;
    public bonus_intellect: number;
    public bonus_aspd: number;
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
        if (this.GetItemPlus()) {
            this.bonus_mana = this.GetItemPlus().GetSpecialValueFor("bonus_mana");
            this.bonus_mana_regen = this.GetItemPlus().GetSpecialValueFor("bonus_mana_regen");
            this.cast_range_bonus = this.GetItemPlus().GetSpecialValueFor("cast_range_bonus");
            this.spell_power = this.GetItemPlus().GetSpecialValueFor("spell_power");
            this.bonus_damage = this.GetItemPlus().GetSpecialValueFor("bonus_damage");
            this.bonus_strength = this.GetItemPlus().GetSpecialValueFor("bonus_strength");
            this.bonus_agility = this.GetItemPlus().GetSpecialValueFor("bonus_agility");
            this.bonus_intellect = this.GetItemPlus().GetSpecialValueFor("bonus_intellect");
            this.bonus_aspd = this.GetItemPlus().GetSpecialValueFor("bonus_aspd");
        } else {
            this.bonus_mana = 0;
            this.bonus_mana_regen = 0;
            this.cast_range_bonus = 0;
            this.spell_power = 0;
            this.bonus_damage = 0;
            this.bonus_strength = 0;
            this.bonus_agility = 0;
            this.bonus_intellect = 0;
            this.bonus_aspd = 0;
        }
        if (!IsServer()) {
            return;
        }
        for (const [_, mod] of GameFunc.iPair(this.GetParentPlus().FindAllModifiersByName(this.GetName()))) {
            mod.GetItemPlus().SetSecondaryCharges(_);
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        for (const [_, modifier] of GameFunc.iPair(this.GetParentPlus().FindAllModifiersByName(this.GetName()))) {
            modifier.SetStackCount(_);
            modifier.GetItemPlus().SetSecondaryCharges(_);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.CAST_RANGE_BONUS_STACKING,
            4: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE,
            5: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            6: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            7: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            8: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            9: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    CC_GetModifierManaBonus(): number {
        return this.bonus_mana;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        return this.bonus_mana_regen;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CAST_RANGE_BONUS_STACKING)
    CC_GetModifierCastRangeBonusStacking(p_0: ModifierAbilityEvent,): number {
        if (this.GetStackCount() != 1) {
            return 0;
        } else {
            return this.cast_range_bonus;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        if (this.GetItemPlus().GetSecondaryCharges() == 1 && !this.GetParentPlus().HasModifier("modifier_item_imba_cyclone_2") && !this.GetParentPlus().HasModifier("modifier_item_imba_armlet_of_dementor") && !this.GetParentPlus().HasModifier("modifier_item_imba_arcane_nexus_passive")) {
            return this.spell_power;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.bonus_strength;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.bonus_agility;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.bonus_intellect;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_aspd;
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.GetItemPlus().GetSpecialValueFor("aura_radius");
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_item_imba_aether_specs_aura_bonus";
    }
}
@registerModifier()
export class modifier_item_imba_aether_specs_aura_bonus extends BaseModifier_Plus {
    public aura_mana_regen: any;
    public aura_bonus_armor: number;
    public aura_bonus_vision: number;
    public aura_bonus_cast_range: number;
    BeCreated(p_0: any,): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.aura_mana_regen = this.GetItemPlus().GetSpecialValueFor("aura_mana_regen");
        this.aura_bonus_armor = this.GetItemPlus().GetSpecialValueFor("aura_bonus_armor");
        this.aura_bonus_vision = this.GetItemPlus().GetSpecialValueFor("aura_bonus_vision");
        this.aura_bonus_cast_range = this.GetItemPlus().GetSpecialValueFor("aura_bonus_cast_range");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT_UNIQUE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS_UNIQUE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION,
            4: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION,
            5: GPropertyConfig.EMODIFIER_PROPERTY.CAST_RANGE_BONUS_STACKING
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT_UNIQUE)
    CC_GetModifierConstantManaRegenUnique(): number {
        return this.aura_mana_regen;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS_UNIQUE)
    CC_GetModifierPhysicalArmorBonusUnique(p_0: ModifierAttackEvent,): number {
        if (!this.GetParentPlus().IsIllusion()) {
            return this.aura_bonus_armor;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION)
    CC_GetBonusDayVision(): number {
        if (!this.GetParentPlus().IsIllusion()) {
            return this.aura_bonus_vision;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION)
    CC_GetBonusNightVision(): number {
        if (!this.GetParentPlus().IsIllusion()) {
            return this.aura_bonus_vision;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CAST_RANGE_BONUS_STACKING)
    CC_GetModifierCastRangeBonusStacking(p_0: ModifierAbilityEvent,): number {
        return this.aura_bonus_cast_range;
    }
}
