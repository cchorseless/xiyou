
import { GameFunc } from "../../../GameFunc";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 幽魂权杖
@registerAbility()
export class item_imba_ghost extends BaseItem_Plus {
    public caster: IBaseNpc_Plus;
    public duration: number;
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_ghost";
    }
    OnSpellStart(): void {
        this.caster = this.GetCasterPlus();
        this.duration = this.GetSpecialValueFor("duration");
        if (!IsServer()) {
            return;
        }
        this.caster.EmitSound("DOTA_Item.GhostScepter.Activate");
        this.caster.AddNewModifier(this.caster, this, "modifier_imba_ghost_state", {
            duration: this.duration
        });
        this.caster.AddNewModifier(this.caster, this, "modifier_item_imba_gem_of_true_sight", {
            duration: this.duration
        });
    }
}
@registerModifier()
export class modifier_item_imba_ghost extends BaseModifier_Plus {
    public ability: IBaseItem_Plus;
    public bonus_all_stats: number;
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
        this.ability = this.GetItemPlus();
        this.bonus_all_stats = this.ability.GetSpecialValueFor("bonus_all_stats");
        if (!IsServer()) {
            return;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.bonus_all_stats;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.bonus_all_stats;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.bonus_all_stats;
    }
}
@registerModifier()
export class modifier_imba_ghost_state extends BaseModifier_Plus {
    public ability: IBaseItem_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public extra_spell_damage_percent: number;
    public luminate_radius: number;
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_ghost.vpcf";
    }
    Init(p_0: any,): void {
        this.ability = this.GetItemPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.extra_spell_damage_percent = this.ability.GetSpecialValueFor("extra_spell_damage_percent");
        this.luminate_radius = this.ability.GetSpecialValueFor("luminate_radius");
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        AddFOWViewer(this.caster.GetTeam(), this.parent.GetAbsOrigin(), this.luminate_radius, FrameTime(), false);
        if (this.parent.IsMagicImmune()) {
            let truesight_modifiers = this.parent.FindAllModifiersByName("modifier_item_imba_gem_of_true_sight");
            for (const [_, truesight_mod] of GameFunc.iPair(truesight_modifiers)) {
                if (truesight_mod.GetItemPlus() == this.ability) {
                    truesight_mod.Destroy();
                }
            }
            this.Destroy();
        }
    }

    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_ATTACK_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_DECREPIFY_UNIQUE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL,
            3: GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_CAST_ANGLE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_DECREPIFY_UNIQUE)
    CC_GetModifierMagicalResistanceDecrepifyUnique(p_0: ModifierAttackEvent,): number {
        return this.extra_spell_damage_percent;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL)
    CC_GetAbsoluteNoDamagePhysical(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_CAST_ANGLE)
    CC_GetModifierIgnoreCastAngle(): 0 | 1 {
        if (this.GetParentPlus().GetTeam() == this.GetCasterPlus().GetTeam()) {
            return 1;
        }
    }
}
