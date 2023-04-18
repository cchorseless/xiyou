
import { AI_ability } from "../../../ai/AI_ability";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 治疗药膏
@registerAbility()
export class item_imba_flask extends BaseItem_Plus {
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target = this.GetCursorTarget();
        let cast_sound = "DOTA_Item.HealingSalve.Activate";
        let modifier_regen = "modifier_imba_flask";
        let duration = this.GetSpecialValueFor("duration");
        let break_stacks = this.GetSpecialValueFor("break_stacks");
        EmitSoundOn(cast_sound, target);
        let modifier_regen_modifier = target.AddNewModifier(caster, this, modifier_regen, {
            duration: duration
        });
        modifier_regen_modifier.SetStackCount(break_stacks);
        this.SpendCharge();
    }


    AutoSpellSelf(): boolean {
        if (this.GetCasterPlus().GetHealthLosePect() >= 50) {
            return AI_ability.NO_TARGET_cast(this);
        }
        return false
    }
}
@registerModifier()
export class modifier_imba_flask extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public hp_regen: any;
    public break_stacks: number;
    public flat_heal_reduction: any;
    public hp_threshold_pct: number;
    public heal_multiplier: any;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetTexture(): string {
        return "item_flask";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.hp_regen = this.GetItemPlus().GetSpecialValueFor("hp_regen");
        this.break_stacks = this.GetItemPlus().GetSpecialValueFor("break_stacks");
        this.flat_heal_reduction = this.GetItemPlus().GetSpecialValueFor("flat_heal_reduction");
        this.hp_threshold_pct = this.GetItemPlus().GetSpecialValueFor("hp_threshold_pct");
        this.heal_multiplier = this.GetItemPlus().GetSpecialValueFor("heal_multiplier");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(decFuncs);
    } */
    // @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    // CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
    //     if (!IsServer()) {
    //         return undefined;
    //     }
    //     let attacker = keys.attacker as IBaseNpc_Plus;
    //     let target = keys.unit as IBaseNpc_Plus;
    //     let damage = keys.original_damage;
    //     let damage_flags = keys.damage_flags;
    //     if (target != this.parent) {
    //         return undefined;
    //     }
    //     if (damage <= 0) {
    //         return undefined;
    //     }
    //     if (attacker == this.parent) {
    //         return undefined;
    //     }
    //     if (damage_flags == DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) {
    //         return undefined;
    //     }
    //     if ((attacker.GetTeamNumber() == target.GetOpposingTeamNumber() && attacker.IsRealUnit()) || (attacker.GetTeamNumber() == target.GetOpposingTeamNumber() && attacker.GetPlayerOwner() != undefined) || attacker.GetTeamNumber() == target.GetTeamNumber() || attacker.IsRoshan()) {
    //         if (this.GetStackCount() == 1) {
    //             this.Destroy();
    //         } else {
    //             this.SetStackCount(this.GetStackCount() - 1);
    //         }
    //     }
    // }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        let hp_regen = this.hp_regen;
        if ((this.parent.GetHealthPercent()) <= this.hp_threshold_pct) {
            hp_regen = hp_regen * this.heal_multiplier;
        }
        let flat_reduction = (this.break_stacks - this.GetStackCount()) * this.flat_heal_reduction;
        hp_regen = hp_regen - flat_reduction;
        return hp_regen;
    }
    GetEffectName(): string {
        return "particles/items_fx/healing_flask.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
