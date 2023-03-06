
import { GameFunc } from "../../../GameFunc";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class item_imba_the_triumvirate_v2 extends BaseItem_Plus {
    public caster: IBaseNpc_Plus;
    public active_duration: number;
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_the_triumvirate_v2";
    }
    OnSpellStart(): void {
        this.caster = this.GetCasterPlus();
        this.active_duration = this.GetSpecialValueFor("active_duration");
        if (!IsServer()) {
            return;
        }
        this.caster.EmitSound("DOTA_Item.IronTalon.Activate");
        this.caster.AddNewModifier(this.caster, this, "modifier_item_imba_the_triumvirate_v2_sange", {
            duration: this.active_duration
        });
        this.AddTimer(FrameTime(), () => {
            this.caster.AddNewModifier(this.caster, this, "modifier_item_imba_the_triumvirate_v2_yasha", {
                duration: this.active_duration
            });
            this.AddTimer(FrameTime(), () => {
                this.caster.AddNewModifier(this.caster, this, "modifier_item_imba_the_triumvirate_v2_kaya", {
                    duration: this.active_duration
                });
            });
        });
    }
}
@registerModifier()
export class modifier_item_imba_the_triumvirate_v2 extends BaseModifier_Plus {
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
export class modifier_item_imba_the_triumvirate_v2_sange extends BaseModifier_Plus {
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
        if (keys.target == this.GetParentPlus() && keys.attacker.IsRealHero() && keys.attacker.GetTeam() != keys.target.GetTeam()) {
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
export class modifier_item_imba_the_triumvirate_v2_yasha extends BaseModifier_Plus {
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
        if (keys.attacker == this.GetParentPlus() && keys.target.IsRealHero() && keys.attacker.GetTeam() != keys.target.GetTeam()) {
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
export class modifier_item_imba_the_triumvirate_v2_kaya extends BaseModifier_Plus {
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
        if (((keys.attacker == this.GetParentPlus() && keys.unit.IsRealHero()) || (keys.unit == this.GetParentPlus() && keys.attacker.IsRealHero())) && keys.damage_category == 0 && keys.attacker.GetTeam() != keys.unit.GetTeam()) {
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
