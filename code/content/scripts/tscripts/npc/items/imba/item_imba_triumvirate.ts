
import { GameFunc } from "../../../GameFunc";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

// 自定义
@registerAbility()
export class item_imba_triumvirate extends BaseItem_Plus {

    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_triumvirate";
    }
}
@registerModifier()
export class modifier_item_imba_triumvirate extends BaseModifier_Plus {
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
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE_UNIQUE,
            4: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            5: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            6: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            7: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_damage");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE)
    CC_GetModifierPercentageCooldown(p_0: ModifierAbilityEvent,): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_cdr");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_attack_speed");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE_UNIQUE)
    CC_GetModifierMoveSpeedBonus_Percentage_Unique(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_ms");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_str");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_agi");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        if (!this.GetItemPlus()) {
            return;
        }
        return this.GetItemPlus().GetSpecialValueFor("bonus_int");
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let owner = this.GetParentPlus();
            let target = keys.target;
            if (owner != keys.attacker) {
                return;
            }
            this.TriumAttack(owner, keys.target, this.GetItemPlus(), "modifier_item_imba_triumvirate_stacks_debuff", "modifier_item_imba_triumvirate_stacks_buff", "modifier_item_imba_triumvirate_proc_debuff", "modifier_item_imba_triumvirate_proc_buff");
        }
    }

    TriumAttack(attacker: IBaseNpc_Plus, target: IBaseNpc_Plus, ability: IBaseItem_Plus,
        modifier_enemy_stacks: string, modifier_self_stacks: string, modifier_enemy_proc: string, modifier_self_proc: string) {
        let modifier_as = attacker.AddNewModifier(attacker, ability, modifier_self_stacks, {
            duration: ability.GetSpecialValueFor("stack_duration")
        });
        if (modifier_as && modifier_as.GetStackCount() < ability.GetSpecialValueFor("max_stacks")) {
            modifier_as.SetStackCount(modifier_as.GetStackCount() + 1);
            attacker.EmitSound("Imba.YashaStack");
        }
        if (attacker.IsIllusion()) {
            return;
        }
        // if (target.IsMagicImmune() || (!target.IsHeroOrCreep())) {
        //     return;
        // }
        if (ability.IsCooldownReady() && RollPercentage(ability.GetSpecialValueFor("proc_chance"))) {
            attacker.AddNewModifier(attacker, ability, modifier_self_proc, {
                duration: ability.GetSpecialValueFor("proc_duration_self")
            });
            attacker.EmitSound("Imba.YashaProc");
            target.AddNewModifier(attacker, ability, modifier_enemy_proc, {
                duration: ability.GetSpecialValueFor("proc_duration_enemy") * (1 - target.GetStatusResistance())
            });
            target.EmitSound("Imba.SangeProc");
            target.EmitSound("Imba.kayaProc");
            ability.UseResources(false, false, true);
        }
        let modifier_maim = target.AddNewModifier(attacker, ability, modifier_enemy_stacks, {
            duration: ability.GetSpecialValueFor("stack_duration") * (1 - target.GetStatusResistance())
        });
        if (modifier_maim && modifier_maim.GetStackCount() < ability.GetSpecialValueFor("max_stacks")) {
            modifier_maim.SetStackCount(modifier_maim.GetStackCount() + 1);
            target.EmitSound("Imba.SangeStack");
            target.EmitSound("Imba.kayaStack");
        }
    }

}
@registerModifier()
export class modifier_item_imba_triumvirate_stacks_debuff extends BaseModifier_Plus {
    public ability: IBaseItem_Plus;
    public maim_stack: number;
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
        return "particles/item/swords/sange_kaya_debuff.vpcf";
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
        this.ability = this.GetItemPlus();
        if (!this.ability) {
            this.Destroy();
            return undefined;
        }
        this.maim_stack = this.ability.GetSpecialValueFor("maim_stack");
        this.amp_stack = this.ability.GetSpecialValueFor("amp_stack");
        if (IsServer()) {
            let owner = this.GetParentPlus();
            let lower_tier_modifiers = {
                "1": "modifier_item_imba_sange_active",
                "2": "modifier_item_imba_sange_yasha_active",
                "3": "modifier_item_imba_yasha_and_kaya_active",
                "4": "modifier_item_imba_sange_kaya_active"
            }
            let stack_count = this.GetStackCount();
            for (const [_, modifier] of GameFunc.Pair(lower_tier_modifiers)) {
                let modifier_to_remove = owner.FindModifierByName(modifier);
                if (modifier_to_remove) {
                    stack_count = math.max(stack_count, modifier_to_remove.GetStackCount());
                    modifier_to_remove.Destroy();
                }
            }
            this.SetStackCount(stack_count);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        if (!this.amp_stack) {
            return undefined;
        }
        return this.amp_stack * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (!this.maim_stack) {
            return undefined;
        }
        return this.maim_stack * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (!this.maim_stack) {
            return undefined;
        }
        return this.maim_stack * this.GetStackCount();
    }
}
@registerModifier()
export class modifier_item_imba_triumvirate_proc_debuff extends BaseModifier_Plus {
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
        return "particles/item/swords/sange_kaya_proc.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let states = {
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_SILENCED]: true
        }
        return states;
    }
}
@registerModifier()
export class modifier_item_imba_triumvirate_stacks_buff extends BaseModifier_Plus {
    public as_stack: number;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/item/swords/yasha_buff.vpcf";
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
        this.as_stack = this.GetItemPlus().GetSpecialValueFor("as_stack");
        if (IsServer()) {
            let owner = this.GetParentPlus();
            let lower_tier_modifiers = {
                "1": "modifier_item_imba_yasha_active",
                "2": "modifier_item_imba_kaya_yasha_stacks",
                "3": "modifier_item_imba_sange_yasha_stacks"
            }
            let stack_count = this.GetStackCount();
            for (const [_, modifier] of GameFunc.Pair(lower_tier_modifiers)) {
                let modifier_to_remove = owner.FindModifierByName(modifier);
                if (modifier_to_remove) {
                    stack_count = math.max(stack_count, modifier_to_remove.GetStackCount());
                    modifier_to_remove.Destroy();
                }
            }
            this.SetStackCount(stack_count);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.as_stack * this.GetStackCount();
    }
}
@registerModifier()
export class modifier_item_imba_triumvirate_proc_buff extends BaseModifier_Plus {
    public proc_ms: any;
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/item/swords/yasha_proc.vpcf";
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
        this.proc_ms = this.GetItemPlus().GetSpecialValueFor("proc_ms");
        if (IsServer()) {
            let owner = this.GetParentPlus();
            let lower_tier_modifiers = {
                "1": "modifier_item_imba_yasha_proc",
                "2": "modifier_item_imba_sange_yasha_proc",
                "3": "modifier_item_imba_kaya_yasha_proc"
            }
            for (const [_, modifier] of GameFunc.Pair(lower_tier_modifiers)) {
                owner.RemoveModifierByName(modifier);
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.proc_ms;
    }
}

// 自定义
@registerAbility()
export class item_imba_triumvirate_v2 extends BaseItem_Plus {
    public caster: IBaseNpc_Plus;
    public active_duration: number;
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_triumvirate_v2";
    }
    OnSpellStart(): void {
        this.caster = this.GetCasterPlus();
        this.active_duration = this.GetSpecialValueFor("active_duration");
        if (!IsServer()) {
            return;
        }
        this.caster.EmitSound("DOTA_Item.IronTalon.Activate");
        this.caster.AddNewModifier(this.caster, this, "modifier_item_imba_triumvirate_v2_sange", {
            duration: this.active_duration
        });
        this.AddTimer(FrameTime(), () => {
            this.caster.AddNewModifier(this.caster, this, "modifier_item_imba_triumvirate_v2_yasha", {
                duration: this.active_duration
            });
            this.AddTimer(FrameTime(), () => {
                this.caster.AddNewModifier(this.caster, this, "modifier_item_imba_triumvirate_v2_kaya", {
                    duration: this.active_duration
                });
            });
        });
    }
}
@registerModifier()
export class modifier_item_imba_triumvirate_v2 extends BaseModifier_Plus {
    public ability: IBaseItem_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public bonus_strength: number;
    public bonus_agility: number;
    public bonus_intellect: number;
    public bonus_attack_speed: number;
    public spell_amp: any;
    public status_resistance: any;
    public movement_speed_percent_bonus: number;
    public hp_regen_amp: any;
    public mp_regen_amp: any;
    public lifesteal_amp: any;
    public spell_lifesteal_amp: any;
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
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.bonus_strength = this.ability.GetSpecialValueFor("bonus_strength");
        this.bonus_agility = this.ability.GetSpecialValueFor("bonus_agility");
        this.bonus_intellect = this.ability.GetSpecialValueFor("bonus_intellect");
        this.bonus_attack_speed = this.ability.GetSpecialValueFor("bonus_attack_speed");
        this.spell_amp = this.ability.GetSpecialValueFor("spell_amp");
        this.status_resistance = this.ability.GetSpecialValueFor("status_resistance");
        this.movement_speed_percent_bonus = this.ability.GetSpecialValueFor("movement_speed_percent_bonus");
        this.hp_regen_amp = this.ability.GetSpecialValueFor("hp_regen_amp");
        this.mp_regen_amp = this.ability.GetSpecialValueFor("mp_regen_amp");
        this.lifesteal_amp = this.ability.GetSpecialValueFor("lifesteal_amp");
        this.spell_lifesteal_amp = this.ability.GetSpecialValueFor("spell_lifesteal_amp");
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
        for (const [_, mod] of GameFunc.iPair(this.GetParentPlus().FindAllModifiersByName(this.GetName()))) {
            mod.GetItemPlus().SetSecondaryCharges(_);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            5: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE_UNIQUE,
            6: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING,
            7: GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE,
            8: GPropertyConfig.EMODIFIER_PROPERTY.MP_REGEN_AMPLIFY_PERCENTAGE,
            9: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE_UNIQUE
        });
    } */
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
        return this.bonus_attack_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE_UNIQUE)
    CC_GetModifierMoveSpeedBonus_Percentage_Unique(): number {
        return this.movement_speed_percent_bonus;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.status_resistance;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE)
    CC_GetModifierHPRegenAmplify_Percentage(): number {
        return this.hp_regen_amp;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MP_REGEN_AMPLIFY_PERCENTAGE)
    CC_GetModifierMPRegenAmplify_Percentage(): number {
        return this.mp_regen_amp;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE_UNIQUE)
    CC_GetModifierSpellAmplify_PercentageUnique(): number {
        return this.spell_amp;
    }
    GetModifierLifestealAmplify() {
        return this.lifesteal_amp;
    }
    GetModifierSpellLifestealAmplify() {
        return this.spell_lifesteal_amp;
    }
}
@registerModifier()
export class modifier_item_imba_triumvirate_v2_sange extends BaseModifier_Plus {
    public ability: IBaseItem_Plus;
    public sange_extension: any;
    public bonus_status_resistance_active: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.ability = this.GetItemPlus();
        this.sange_extension = this.ability.GetSpecialValueFor("sange_extension");
        this.bonus_status_resistance_active = this.ability.GetSpecialValueFor("bonus_status_resistance_active");
    }
    GetEffectName(): string {
        return "particles/items2_fx/sange_active.vpcf";
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.bonus_status_resistance_active;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.target == this.GetParentPlus() && keys.attacker.IsRealUnit() && keys.attacker.GetTeam() != keys.target.GetTeam()) {
            this.IncrementStackCount();
            // this.GetParentPlus().CalculateStatBonus(true);
            this.SetDuration(this.GetRemainingTime() + this.sange_extension, true);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength( /** keys */): number {
        return this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_item_imba_triumvirate_v2_yasha extends BaseModifier_Plus {
    public ability: IBaseItem_Plus;
    public yasha_extension: any;
    public bonus_evasion_active: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.ability = this.GetItemPlus();
        this.yasha_extension = this.ability.GetSpecialValueFor("yasha_extension");
        this.bonus_evasion_active = this.ability.GetSpecialValueFor("bonus_evasion_active");
    }
    GetEffectName(): string {
        return "particles/items2_fx/yasha_active.vpcf";
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT)
    CC_GetModifierEvasion_Constant(p_0: ModifierAttackEvent,): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_evasion_active");
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && keys.target.IsRealUnit() && keys.attacker.GetTeam() != keys.target.GetTeam()) {
            this.IncrementStackCount();
            // this.GetParentPlus().CalculateStatBonus(true);
            this.SetDuration(this.GetRemainingTime() + this.yasha_extension, true);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility( /** keys */): number {
        return this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_item_imba_triumvirate_v2_kaya extends BaseModifier_Plus {
    public ability: IBaseItem_Plus;
    public kaya_extension: any;
    public kaya_min_health_dmg: any;
    public bonus_cdr_active: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.ability = this.GetItemPlus();
        this.kaya_extension = this.ability.GetSpecialValueFor("kaya_extension");
        this.kaya_min_health_dmg = this.ability.GetSpecialValueFor("kaya_min_health_dmg");
        this.bonus_cdr_active = this.ability.GetSpecialValueFor("bonus_cdr_active");
    }
    GetEffectName(): string {
        return "particles/items2_fx/kaya_active.vpcf";
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MANACOST_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE,
            3: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE,
            4: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            5: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.COOLDOWN_PERCENTAGE)
    CC_GetModifierPercentageCooldown(p_0: ModifierAbilityEvent,): number {
        return this.bonus_cdr_active;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANACOST_PERCENTAGE)
    CC_GetModifierPercentageManacost(p_0: ModifierAbilityEvent,): number {
        return this.bonus_cdr_active;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (((keys.attacker == this.GetParentPlus() && keys.unit.IsRealUnit()) || (keys.unit == this.GetParentPlus() && keys.attacker.IsRealUnit())) && keys.damage_category == 0 && keys.attacker.GetTeam() != keys.unit.GetTeam()) {
            if ((keys.damage >= this.kaya_min_health_dmg)) {
                this.IncrementStackCount();
                // this.GetParentPlus().CalculateStatBonus(true);
                this.SetDuration(this.GetRemainingTime() + this.kaya_extension, true);
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.GetStackCount();
    }
}
