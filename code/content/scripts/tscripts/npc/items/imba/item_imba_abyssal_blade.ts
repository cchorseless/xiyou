
import { ResHelper } from "../../../helper/ResHelper";
import { GameServiceConfig } from "../../../shared/GameServiceConfig";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
// 深渊之刃
@registerAbility()
export class item_imba_abyssal_blade extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_abyssal_blade";
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target = this.GetCursorTarget();
        let sound_cast = "DOTA_Item.AbyssalBlade.Activate";
        let particle_abyssal = "particles/items_fx/abyssal_blade.vpcf";
        let modifier_bash = "modifier_imba_abyssal_blade_bash";
        let modifier_break = "modifier_imba_abyssal_blade_skull_break";
        let active_stun_duration = this.GetSpecialValueFor("active_stun_duration");
        let actual_break_duration = this.GetSpecialValueFor("actual_break_duration");
        EmitSoundOn(sound_cast, target);
        if (target.GetTeamNumber() != caster.GetTeamNumber()) {
            if (target.TriggerSpellAbsorb(this)) {
                return undefined;
            }
        }
        if (this.GetCasterPlus().HasModifier("modifier_imba_slark_pounce")) {
            this.GetCasterPlus().findBuff("modifier_imba_slark_pounce").Destroy();
        }
        let blink_start_particle = ResHelper.CreateParticleEx("particles/econ/events/ti9/blink_dagger_ti9_start_lvl2.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
        ParticleManager.ReleaseParticleIndex(blink_start_particle);
        FindClearSpaceForUnit(this.GetCasterPlus(), target.GetAbsOrigin() - this.GetCasterPlus().GetForwardVector() * 56 as Vector, false);
        let blink_end_particle = ResHelper.CreateParticleEx("particles/econ/events/ti9/blink_dagger_ti9_lvl2_end.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
        ParticleManager.ReleaseParticleIndex(blink_end_particle);
        let particle_abyssal_fx = ResHelper.CreateParticleEx(particle_abyssal, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
        ParticleManager.SetParticleControl(particle_abyssal_fx, 0, target.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(particle_abyssal_fx);
        let damageTable = {
            victim: target,
            attacker: this.GetCasterPlus(),
            damage: this.GetSpecialValueFor("bash_damage"),
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
            ability: this
        }
        ApplyDamage(damageTable);
        if (target.IsAlive()) {
            target.AddNewModifier(caster, this, modifier_bash, {
                duration: active_stun_duration * (1 - target.GetStatusResistance())
            });
            target.AddNewModifier(caster, this, modifier_break, {
                duration: actual_break_duration * (1 - target.GetStatusResistance())
            });
        }
    }
}
@registerModifier()
export class modifier_imba_abyssal_blade extends BaseModifier_Plus {
    public bash_proc: any;
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
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.HP_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            5: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_CONSTANT_BLOCK,
            6: Enum_MODIFIER_EVENT.ON_ATTACK,
            7: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (this.GetAbilityPlus()) {
            return this.GetSpecialValueFor("bonus_strength");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_BONUS)
    CC_GetModifierPreAttack_BonusDamage(): number {
        if (this.GetAbilityPlus()) {
            return this.GetSpecialValueFor("bonus_damage");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_BONUS)
    CC_GetModifierHealthBonus(): number {
        if (this.GetAbilityPlus()) {
            return this.GetSpecialValueFor("bonus_health");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        if (this.GetAbilityPlus()) {
            return this.GetSpecialValueFor("bonus_hp_regen");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_CONSTANT_BLOCK)
    CC_GetModifierPhysical_ConstantBlock(p_0: ModifierAttackEvent,): number {
        if (this.GetAbilityPlus() && GFuncRandom.PRD(this.GetSpecialValueFor("block_chance"), this)) {
            if (!this.GetParentPlus().IsRangedAttacker()) {
                return this.GetSpecialValueFor("block_damage_melee");
            } else {
                return this.GetSpecialValueFor("block_damage_ranged");
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (this.GetAbilityPlus() && keys.attacker == this.GetParentPlus() && keys.attacker.FindAllModifiersByName(this.GetName())[0] == this && this.GetAbilityPlus().IsCooldownReady() && !keys.attacker.IsIllusion() && !keys.target.IsBuilding() && !keys.target.IsOther() && !keys.attacker.HasModifier("modifier_monkey_king_fur_army_soldier") && !keys.attacker.HasModifier("modifier_monkey_king_fur_army_soldier_hidden") && !keys.attacker.HasModifier("modifier_imba_abyssal_blade_internal_cd")) {
            if (this.GetParentPlus().IsRangedAttacker()) {
                if (GFuncRandom.PRD(this.GetSpecialValueFor("bash_chance_ranged"), this)) {
                    this.bash_proc = true;
                }
            } else {
                if (GFuncRandom.PRD(this.GetSpecialValueFor("bash_chance_melee"), this)) {
                    this.bash_proc = true;
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (this.GetAbilityPlus() && keys.attacker == this.GetParentPlus() && this.bash_proc) {
            this.bash_proc = false;
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_abyssal_blade_internal_cd", {
                duration: this.GetSpecialValueFor("internal_bash_cd")
            });
            if (!GameServiceConfig.IMBA_DISABLED_SKULL_BASHER.includes(keys.attacker.GetUnitName())) {
                keys.target.EmitSound("DOTA_Item.SkullBasher");
                keys.target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_abyssal_blade_bash", {
                    duration: this.GetSpecialValueFor("stun_duration") * (1 - keys.target.GetStatusResistance())
                });
            }
            if (!keys.target.HasModifier("modifier_imba_abyssal_blade_skull_crash")) {
                if (RollPercentage(this.GetSpecialValueFor("insta_skull_break_chance_pct"))) {
                    keys.target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_abyssal_blade_skull_break", {
                        duration: this.GetSpecialValueFor("actual_break_duration") * (1 - keys.target.GetStatusResistance())
                    });
                } else {
                    keys.target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_abyssal_blade_skull_crash", {
                        duration: this.GetSpecialValueFor("skull_break_duration") * (1 - keys.target.GetStatusResistance())
                    });
                }
            } else {
                keys.target.RemoveModifierByName("modifier_imba_abyssal_blade_skull_crash");
                keys.target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_abyssal_blade_skull_break", {
                    duration: this.GetSpecialValueFor("actual_break_duration") * (1 - keys.target.GetStatusResistance())
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_abyssal_blade_bash extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_stunned.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_DISABLED;
    }
}
@registerModifier()
export class modifier_imba_abyssal_blade_skull_crash extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_abyssal_blade_skull_break extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_PASSIVES_DISABLED]: true
        };
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.Destroy();
            }
        }
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            let parent = this.GetParentPlus();
            let particle_break = "particles/item/skull_basher/skull_basher.vpcf";
            let particle_break_fx = ResHelper.CreateParticleEx(particle_break, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
            ParticleManager.SetParticleControl(particle_break_fx, 0, parent.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(particle_break_fx);
        }
    }
}
@registerModifier()
export class modifier_imba_abyssal_blade_internal_cd extends BaseModifier_Plus {
    IgnoreTenacity() {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
