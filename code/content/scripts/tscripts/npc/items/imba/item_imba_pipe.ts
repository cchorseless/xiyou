
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

// 洞察烟斗
@registerAbility()
export class item_imba_pipe extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_pipe";
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let shield_health = this.GetSpecialValueFor("shield_health");
        let duration = this.GetSpecialValueFor("duration");
        let search_radius = this.GetSpecialValueFor("aura_radius");
        let unreducable_magic_resist = this.GetSpecialValueFor("unreducable_magic_resist");
        let activation_particle = "particles/items2_fx/pipe_of_insight_launch.vpcf";
        EmitSoundOn("DOTA_Item.Pipe.Activate", caster);
        let particle = ResHelper.CreateParticleEx(activation_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
        ParticleManager.ReleaseParticleIndex(particle);
        let allies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, search_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, unit] of GameFunc.iPair(allies)) {
            unit.RemoveModifierByName("modifier_item_imba_hood_of_defiance_barrier");
            unit.AddNewModifier(caster, this, "modifier_item_imba_hood_of_defiance_barrier", {
                duration: duration
            });
            if (unit.IsRealUnit()) {
                unit.AddNewModifier(caster, this, "modifier_imba_pipe_active_bonus", {
                    duration: duration,
                    unreducable_magic_resist: unreducable_magic_resist
                });
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_pipe extends BaseModifier_Plus {
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
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_health_regen");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_magic_resist");
        }
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
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_pipe_aura";
    }
}
@registerModifier()
export class modifier_imba_pipe_aura extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    public caster: IBaseNpc_Plus;
    public bonus_health_regen: number;
    public bonus_magic_resist: number;
    public aura_tenacity_pct: number;
    public active_tenacity_pct: number;
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        if (!this.GetItemPlus()) {
            this.Destroy();
            return;
        }
        this.parent = this.GetParentPlus();
        this.caster = this.GetCasterPlus();
        this.bonus_health_regen = this.GetItemPlus().GetSpecialValueFor("aura_bonus_health_regen");
        this.bonus_magic_resist = this.GetItemPlus().GetSpecialValueFor("aura_bonus_magic_resist");
        this.aura_tenacity_pct = this.GetItemPlus().GetSpecialValueFor("aura_tenacity_pct");
        this.active_tenacity_pct = this.GetItemPlus().GetSpecialValueFor("active_tenacity_pct");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.bonus_health_regen;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        if (!this.GetParentPlus().IsIllusion()) {
            return this.bonus_magic_resist;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        if (this.parent.HasModifier("modifier_imba_pipe_active_bonus")) {
            return this.active_tenacity_pct;
        }
        return this.aura_tenacity_pct;
    }
}
@registerModifier()
export class modifier_imba_pipe_active_bonus extends BaseModifier_Plus {
    public magic_resist_compensation: any;
    public precision: any;
    public parent: IBaseNpc_Plus;
    public unreducable_magic_resist: any;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.magic_resist_compensation = 0;
        this.precision = 0.5 / 100;
        this.parent = this.GetParentPlus();
        this.unreducable_magic_resist = this.GetItemPlus().GetSpecialValueFor("unreducable_magic_resist");
        this.unreducable_magic_resist = this.unreducable_magic_resist / 100;
        this.StartIntervalThink(0.1);
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        }
        return Object.values(funcs);
    } */
    OnIntervalThink(): void {
        let current_res = this.parent.GetMagicalReductionPect();
        if (current_res < (this.unreducable_magic_resist - this.precision)) {
            if (this.magic_resist_compensation > 0) {
                let current_compensation = this.magic_resist_compensation / 100;
                let compensation = (this.unreducable_magic_resist - 1) * (1 - current_compensation) / (1 - current_res) + 1;
                this.magic_resist_compensation = compensation * 100;
            } else {
                let compensation = 1 + (this.unreducable_magic_resist - 1) / (1 - current_res);
                this.magic_resist_compensation = compensation * 100;
            }
        } else if (this.magic_resist_compensation > 0 && current_res > (this.unreducable_magic_resist + this.precision)) {
            let current_compensation = this.magic_resist_compensation / 100;
            let compensation = (this.unreducable_magic_resist - 1) * (1 - current_compensation) / (1 - current_res) + 1;
            this.magic_resist_compensation = math.max(compensation * 100, 0);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        if (IsClient()) {
            return this.unreducable_magic_resist * 100;
        } else {
            return this.magic_resist_compensation;
        }
    }
}
