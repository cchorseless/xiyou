
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class item_imba_transient_boots extends BaseItem_Plus {
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public target: IBaseNpc_Plus;
    public duration: number;
    public particle: any;
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_transient_boots";
    }
    GetAbilityTextureName(): string {
        if (!this.GetCasterPlus().HasModifier("modifier_item_imba_transient_boots_break")) {
            return "imba/transient_boots";
        } else {
            return "imba/transient_boots_broken";
        }
    }
    OnSpellStart(): void {
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.target = this.GetCursorTarget();
        this.duration = this.GetSpecialValueFor("duration");
        if (!IsServer()) {
            return;
        }
        this.caster.EmitSound("Item.GlimmerCape.Activate");
        this.particle = ResHelper.CreateParticleEx("particles/items3_fx/glimmer_cape_initial_flash.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.target);
        ParticleManager.ReleaseParticleIndex(this.particle);
        this.target.AddNewModifier(this.caster, this, "modifier_item_imba_transient_boots_invis", {
            duration: this.duration
        });
    }
}
@registerModifier()
export class modifier_item_imba_transient_boots extends BaseModifier_Plus {
    public ability: IBaseItem_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public bonus_movement_speed: number;
    public bonus_health_regen: number;
    public bonus_attack_speed: number;
    public bonus_magical_armor: number;
    public break_time: number;
    public broken_movement_speed: number;
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
        this.bonus_movement_speed = this.ability.GetSpecialValueFor("bonus_movement_speed");
        this.bonus_health_regen = this.ability.GetSpecialValueFor("bonus_health_regen");
        this.bonus_attack_speed = this.ability.GetSpecialValueFor("bonus_attack_speed");
        this.bonus_magical_armor = this.ability.GetSpecialValueFor("bonus_magical_armor");
        this.break_time = this.ability.GetSpecialValueFor("break_time");
        this.broken_movement_speed = this.ability.GetSpecialValueFor("broken_movement_speed");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_UNIQUE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS,
            5: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_UNIQUE)
    CC_GetModifierMoveSpeedBonus_Special_Boots(): number {
        if (!this.parent.HasModifier("modifier_item_imba_transient_boots_break")) {
            return this.bonus_movement_speed;
        } else {
            return this.broken_movement_speed;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        if (!this.parent.HasModifier("modifier_item_imba_transient_boots_break")) {
            return this.bonus_health_regen;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_attack_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.bonus_magical_armor;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if ((keys.attacker == this.parent && keys.target.IsRealUnit()) || keys.target == this.parent) {
            this.parent.AddNewModifier(this.parent, this.ability, "modifier_item_imba_transient_boots_break", {
                duration: this.break_time * this.ability.GetEffectiveCooldown(this.ability.GetLevel()) / this.ability.GetCooldown(this.ability.GetLevel())
            });
        }
    }
}
@registerModifier()
export class modifier_item_imba_transient_boots_invis extends BaseModifier_Plus {
    public ability: IBaseItem_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public fade_delay: number;
    public active_magical_armor: any;
    public bonus_movement_speed: number;
    public bonus_health_regen: number;
    public counter: number;
    GetEffectName(): string {
        return "particles/items3_fx/glimmer_cape_initial.vpcf";
    }
    Init(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.ability = this.GetItemPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.fade_delay = this.ability.GetSpecialValueFor("fade_delay");
        this.active_magical_armor = this.ability.GetSpecialValueFor("active_magical_armor");
        this.bonus_movement_speed = this.ability.GetSpecialValueFor("bonus_movement_speed");
        this.bonus_health_regen = this.ability.GetSpecialValueFor("bonus_health_regen");
        if (!IsServer()) {
            return;
        }
        this.counter = 0;
        this.StartIntervalThink(FrameTime());
    }

    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        let present_mod = false;
        for (const [_, modifier] of GameFunc.iPair(this.parent.FindAllModifiersByName("modifier_generic_invisible"))) {
            if (modifier.GetItemPlus() == this.ability) {
                present_mod = true;
                return;
            }
        }
        if (!present_mod) {
            this.counter = this.counter + FrameTime();
            if (this.counter >= this.fade_delay) {
                this.parent.AddNewModifier(this.caster, this.ability, "modifier_generic_invisible", {
                    duration: this.GetRemainingTime(),
                    cancelattack: false
                });
                this.counter = 0;
                if (this.GetParentPlus().GetAggroTarget()) {
                    this.GetParentPlus().MoveToTargetToAttack(this.GetParentPlus().GetAggroTarget());
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_UNIQUE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        if (this.parent.HasModifier("modifier_generic_invisible")) {
            return this.active_magical_armor;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_UNIQUE)
    CC_GetModifierMoveSpeedBonus_Special_Boots(): number {
        if (!this.caster.HasModifier("modifier_item_imba_transient_boots_break") && this.caster != this.parent && this.parent.HasModifier("modifier_generic_invisible")) {
            return this.bonus_movement_speed;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        if (!this.caster.HasModifier("modifier_item_imba_transient_boots_break") && this.caster != this.parent && this.parent.HasModifier("modifier_generic_invisible")) {
            return this.bonus_health_regen;
        }
    }
}
@registerModifier()
export class modifier_item_imba_transient_boots_break extends BaseModifier_Plus {
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
