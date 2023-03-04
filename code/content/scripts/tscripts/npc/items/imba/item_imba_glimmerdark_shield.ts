
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_glimmerdark_shield extends BaseItem_Plus {
    public prism_duration: number;
    OnSpellStart(): void {
        this.prism_duration = this.GetSpecialValueFor("prism_duration");
        if (IsServer()) {
            let hCaster = this.GetCasterPlus();
            hCaster.AddNewModifier(hCaster, this, "modifier_item_imba_glimmerdark_shield_prism", {
                duration: this.prism_duration
            });
            hCaster.AddNewModifier(hCaster, this, "modifier_item_imba_gem_of_true_sight", {
                duration: this.prism_duration
            });
            EmitSoundOn("DOTA_Item.GhostScepter.Activate", this.GetCasterPlus());
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_glimmerdark_shield";
    }
}
@registerModifier()
export class modifier_item_imba_glimmerdark_shield_prism extends BaseModifier_Plus {
    public prism_bonus_magic_dmg: number;
    public luminate_radius: number;
    public nFXIndex: any;
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_ghost.vpcf";
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(kv: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.prism_bonus_magic_dmg = this.GetItemPlus().GetSpecialValueFor("prism_bonus_magic_dmg");
        this.luminate_radius = this.GetItemPlus().GetSpecialValueFor("luminate_radius");
        if (IsServer()) {
            this.nFXIndex = ResHelper.CreateParticleEx("particles/item/glimmerdark_shield/gleam.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            ParticleManager.SetParticleControlEnt(this.nFXIndex, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetOrigin(), true);
            ParticleManager.SetParticleControl(this.nFXIndex, 3, Vector(100, 100, 100));
            this.StartIntervalThink(FrameTime());
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), this.luminate_radius, FrameTime(), false);
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            ParticleManager.DestroyParticle(this.nFXIndex, false);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_DECREPIFY_UNIQUE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_CAST_ANGLE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL)
    CC_GetAbsoluteNoDamagePhysical(params: ModifierAttackEvent): 0 | 1 {
        if (!this.GetParentPlus().IsMagicImmune()) {
            return 1;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_DECREPIFY_UNIQUE)
    CC_GetModifierMagicalResistanceDecrepifyUnique(params: ModifierAttackEvent): number {
        return this.prism_bonus_magic_dmg;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_CAST_ANGLE)
    CC_GetModifierIgnoreCastAngle(): 0 | 1 {
        if (this.GetParentPlus().GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            return 1;
        }
    }
}
@registerModifier()
export class modifier_item_imba_glimmerdark_shield extends BaseModifier_Plus {
    public bonus_strength: number;
    public bonus_agility: number;
    public bonus_intellect: number;
    public bonus_health_regen: number;
    public bonus_armor: number;
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
    BeCreated(kv: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.bonus_strength = this.GetItemPlus().GetSpecialValueFor("bonus_strength");
        this.bonus_agility = this.GetItemPlus().GetSpecialValueFor("bonus_agility");
        this.bonus_intellect = this.GetItemPlus().GetSpecialValueFor("bonus_intellect");
        this.bonus_health_regen = this.GetItemPlus().GetSpecialValueFor("bonus_health_regen");
        this.bonus_armor = this.GetItemPlus().GetSpecialValueFor("bonus_armor");
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            5: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength( /** params */): number {
        return this.bonus_strength;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility( /** params */): number {
        return this.bonus_agility;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect( /** params */): number {
        return this.bonus_intellect;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen( /** params */): number {
        return this.bonus_health_regen;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(params: ModifierAttackEvent): number {
        return this.bonus_armor;
    }
}
