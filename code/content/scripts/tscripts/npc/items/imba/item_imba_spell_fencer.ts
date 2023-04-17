
import { GameFunc } from "../../../GameFunc";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
// 自定义
@registerAbility()
export class item_imba_spell_fencer extends BaseItem_Plus {

    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_ITEM;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_spell_fencer";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            if (this.GetCasterPlus().HasModifier("modifier_item_imba_spell_fencer_unique")) {
                this.GetCasterPlus().RemoveModifierByName("modifier_item_imba_spell_fencer_unique");
            } else {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_spell_fencer_unique", {});
            }
        }
    }
    GetAbilityTextureName(): string {
        if (this.GetCasterPlus().HasModifier("modifier_item_imba_spell_fencer_unique")) {
            return "imba/spell_fencer";
        }
        return "imba/spell_fencer_off";
    }
}
@registerModifier()
export class modifier_item_imba_spell_fencer extends BaseModifier_Plus {
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
    BeCreated(keys: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (IsServer()) {
            let parent = this.GetParentPlus();
            if (!parent.HasModifier("modifier_item_imba_spell_fencer_passive_silence")) {
                parent.AddNewModifier(parent, this.GetItemPlus(), "modifier_item_imba_spell_fencer_passive_silence", {});
            }
        }
    }
    BeDestroy( /** keys */): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            if (parent.HasModifier("modifier_item_imba_spell_fencer_passive_silence")) {
                parent.RemoveModifierByName("modifier_item_imba_spell_fencer_passive_silence");
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE,
            5: GPropertyConfig.EMODIFIER_PROPERTY.MANACOST_PERCENTAGE,
            6: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE,
            7: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE)
    CC_GetModifierPercentageCooldown(p_0: ModifierAbilityEvent,): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_cdr");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        return this.GetItemPlus().GetSpecialValueFor("spell_amp");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANACOST_PERCENTAGE)
    CC_GetModifierPercentageManacost(p_0: ModifierAbilityEvent,): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_cdr");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_damage");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_attack_speed");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_int");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_mana_regen");
    }
}
@registerModifier()
export class modifier_item_imba_spell_fencer_unique extends BaseModifier_Plus {
    public damage_reduce_pct: number;
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
    BeCreated(params: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.damage_reduce_pct = this.GetItemPlus().GetSpecialValueFor("damage_reduce_pct");
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            2: GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let owner = this.GetParentPlus();
            if ((!owner) || (!owner.HasModifier("modifier_item_imba_spell_fencer"))) {
                this.Destroy();
                return undefined;
            }
            if (owner != keys.attacker) {
                return;
            }
            if (owner.IsIllusion()) {
                return;
            }
            let target = keys.target;
            // if ((!target.IsHeroOrCreep())) {
            //     return;
            // }
            let ability = this.GetItemPlus();
            owner.AddNewModifier(owner, ability, "modifier_item_imba_spell_fencer_buff", {
                duration: 0.01
            });
            target.AddNewModifier(owner, ability, "modifier_item_imba_spell_fencer_buff", {
                duration: 0.01
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
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.damage_reduce_pct * (-1);
    }
}
@registerModifier()
export class modifier_item_imba_spell_fencer_passive_silence extends BaseModifier_Plus {
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
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let owner = this.GetParentPlus();
            let ability = this.GetItemPlus();
            if ((!owner) || (!owner.HasModifier("modifier_item_imba_spell_fencer"))) {
                this.Destroy();
                return undefined;
            }
            if (owner != keys.attacker) {
                return;
            }
            if (owner.IsIllusion()) {
                return;
            }
            let target = keys.target;
            // if ((!target.IsHeroOrCreep())) {
            //     return;
            // }
            if ((!owner) || (!owner.HasModifier("modifier_item_imba_spell_fencer"))) {
                this.Destroy();
                return undefined;
            }
            let priority_sword_modifiers = {
                "1": "modifier_item_imba_sange_kaya",
                "2": "modifier_item_imba_kaya_yasha",
                "3": "modifier_item_imba_triumvirate"
            }
            for (const [_, sword_modifier] of GameFunc.Pair(priority_sword_modifiers)) {
                if (owner.HasModifier(sword_modifier)) {
                    return undefined;
                }
            }
            if (target.IsMagicImmune() || owner.GetTeam() == target.GetTeam()) {
                return;
            }
            let modifier_amp = target.AddNewModifier(owner, ability, "modifier_item_imba_spell_fencer_soul_rend", {
                duration: ability.GetSpecialValueFor("stack_duration")
            });
            if (modifier_amp && modifier_amp.GetStackCount() < ability.GetSpecialValueFor("max_stacks")) {
                modifier_amp.SetStackCount(modifier_amp.GetStackCount() + 1);
                target.EmitSound("Imba.AzuraStack");
            }
            if (!owner.HasModifier("modifier_item_imba_spell_fencer_cooldown") && RollPercentage(ability.GetSpecialValueFor("proc_chance"))) {
                target.AddNewModifier(owner, ability, "modifier_item_imba_spell_fencer_spirit_strike", {
                    duration: ability.GetSpecialValueFor("proc_duration")
                });
                target.EmitSound("Imba.AzuraProc");
                owner.AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_item_imba_spell_fencer_cooldown", {
                    duration: this.GetItemPlus().GetSpecialValueFor("proc_cooldown")
                });
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_spell_fencer_buff extends BaseModifier_Plus {
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
@registerModifier()
export class modifier_item_imba_spell_fencer_soul_rend extends BaseModifier_Plus {
    public amp_stack: number;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/item/swords/azura_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.amp_stack = this.GetItemPlus().GetSpecialValueFor("amp_stack");
        if (IsServer()) {
            let owner = this.GetParentPlus();
            let higher_tier_modifiers = {
                "1": "modifier_item_imba_sange_kaya_stacks",
                "2": "modifier_item_imba_triumvirate_stacks_debuff"
            }
            for (const [_, modifier] of GameFunc.Pair(higher_tier_modifiers)) {
                if (owner.FindModifierByName(modifier)) {
                    this.Destroy();
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.amp_stack * this.GetStackCount();
    }
}
@registerModifier()
export class modifier_item_imba_spell_fencer_spirit_strike extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/item/swords/azura_proc.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let states = {
            [modifierstate.MODIFIER_STATE_SILENCED]: true
        }
        return states;
    }
}
@registerModifier()
export class modifier_item_imba_spell_fencer_cooldown extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
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
    GetTexture(): string {
        return "imba_spell_fencer";
    }
}
