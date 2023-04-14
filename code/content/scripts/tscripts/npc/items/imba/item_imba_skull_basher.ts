
import { ResHelper } from "../../../helper/ResHelper";
import { GameServiceConfig } from "../../../shared/GameServiceConfig";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
// 碎颅锤
@registerAbility()
export class item_imba_skull_basher extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_skull_basher";
    }
}
@registerModifier()
export class modifier_imba_skull_basher extends BaseModifier_Plus {
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
            2: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            3: Enum_MODIFIER_EVENT.ON_ATTACK,
            4: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            5: GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_MAGICAL
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_strength");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_damage");
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (this.GetItemPlus() && keys.attacker == this.GetParentPlus() && keys.attacker.FindAllModifiersByName(this.GetName())[0] == this && this.GetItemPlus().IsCooldownReady() && !keys.attacker.IsIllusion() && !keys.target.IsBuilding() && !keys.target.IsOther() && !keys.attacker.HasModifier("modifier_monkey_king_fur_army_soldier") && !keys.attacker.HasModifier("modifier_monkey_king_fur_army_soldier_hidden") && !keys.attacker.HasItemInInventory("item_imba_abyssal_blade")) {
            if (this.GetParentPlus().IsRangedAttacker()) {
                if (GFuncRandom.PRD(this.GetItemPlus().GetSpecialValueFor("bash_chance_ranged"), this)) {
                    this.bash_proc = true;
                }
            } else {
                if (GFuncRandom.PRD(this.GetItemPlus().GetSpecialValueFor("bash_chance_melee"), this)) {
                    this.bash_proc = true;
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (this.GetItemPlus() && keys.attacker == this.GetParentPlus() && this.bash_proc) {
            this.bash_proc = false;
            this.GetItemPlus().UseResources(false, false, true);
            if (!GameServiceConfig.IMBA_DISABLED_SKULL_BASHER.includes(keys.attacker.GetUnitName())) {
                keys.target.EmitSound("DOTA_Item.SkullBasher");
                keys.target.AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(),
                    "modifier_imba_skull_basher_bash", {
                    duration: this.GetItemPlus().GetSpecialValueFor("stun_duration") * (1 - keys.target.GetStatusResistance())
                });
            }
            if (!keys.target.HasModifier("modifier_imba_skull_basher_skull_crash")) {
                keys.target.AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_imba_skull_basher_skull_crash", {
                    duration: this.GetItemPlus().GetSpecialValueFor("skull_break_duration") * (1 - keys.target.GetStatusResistance())
                });
            } else {
                keys.target.RemoveModifierByName("modifier_imba_skull_basher_skull_crash");
                keys.target.AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_imba_skull_basher_skull_break", {
                    duration: this.GetItemPlus().GetSpecialValueFor("actual_break_duration") * (1 - keys.target.GetStatusResistance())
                });
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_MAGICAL)
    CC_GetModifierProcAttack_BonusDamage_Magical(p_0: ModifierAttackEvent,): number {
        if (this.GetItemPlus() && this.bash_proc) {
            return this.GetItemPlus().GetSpecialValueFor("bash_damage");
        }
    }
}
@registerModifier()
export class modifier_imba_skull_basher_bash extends BaseModifier_Plus {
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
export class modifier_imba_skull_basher_skull_crash extends BaseModifier_Plus {
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
export class modifier_imba_skull_basher_skull_break extends BaseModifier_Plus {
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
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetItemPlus();
            let parent = this.GetParentPlus();
            let particle_break = "particles/item/skull_basher/skull_basher.vpcf";
            let particle_break_fx = ResHelper.CreateParticleEx(particle_break, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
            ParticleManager.SetParticleControl(particle_break_fx, 0, parent.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(particle_break_fx);
        }
    }
}
