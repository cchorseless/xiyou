
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
// 否决坠饰
@registerAbility()
export class item_imba_nullifier extends BaseItem_Plus {
    public target: IBaseNpc_Plus;
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_nullifier";
    }
    OnSpellStart(): void {
        this.target = this.GetCursorTarget();
        this.GetCasterPlus().EmitSound("DOTA_Item.Nullifier.Cast");
        let effectName = "particles/items4_fx/nullifier_proj.vpcf";
        if (this.GetLevel() == 2) {
            effectName = "particles/items4_fx/nullifier_proj_2.vpcf";
        }
        let projectile = {
            Target: this.GetCursorTarget(),
            Source: this.GetCasterPlus(),
            Ability: this,
            EffectName: effectName,
            iMoveSpeed: this.GetSpecialValueFor("projectile_speed"),
            vSourceLoc: this.GetCasterPlus().GetAbsOrigin(),
            bDrawsOnMinimap: false,
            bDodgeable: true,
            bIsAttack: false,
            bVisibleToEnemies: true,
            bReplaceExisting: false,
            flExpireTime: GameRules.GetGameTime() + 10,
            bProvidesVision: false
        }
        ProjectileManager.CreateTrackingProjectile(projectile);
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (target && !target.IsMagicImmune()) {
            if (target.TriggerSpellAbsorb(this)) {
                return undefined;
            }
            target.EmitSound("DOTA_Item.Nullifier.Target");
            target.Purge(true, false, false, false, false);
            target.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_nullifier_dispel", {
                duration: this.GetSpecialValueFor("mute_duration") * (1 - target.GetStatusResistance())
            });
            if (this.GetLevel() >= 2) {
                target.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_nullifier_mute", {
                    duration: this.GetSpecialValueFor("mute_duration") * (1 - target.GetStatusResistance())
                });
            }
        }
        this.target = undefined;
    }
}
@registerModifier()
export class modifier_item_imba_nullifier extends BaseModifier_Plus {
    public ability: IBaseItem_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public bonus_damage: number;
    public bonus_armor: number;
    public bonus_regen: number;
    public bonus_health: number;
    public bonus_mana: number;
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
        this.bonus_damage = this.GetItemPlus().GetSpecialValueFor("bonus_damage");
        this.bonus_armor = this.GetItemPlus().GetSpecialValueFor("bonus_armor");
        this.bonus_regen = this.GetItemPlus().GetSpecialValueFor("bonus_regen");
        this.bonus_health = this.GetItemPlus().GetSpecialValueFor("bonus_health");
        this.bonus_mana = this.GetItemPlus().GetSpecialValueFor("bonus_mana");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS,
            5: GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.bonus_armor;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.bonus_regen;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    CC_GetModifierHealthBonus(): number {
        return this.bonus_health;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    CC_GetModifierManaBonus(): number {
        return this.bonus_mana;
    }
}
@registerModifier()
export class modifier_item_imba_nullifier_dispel extends BaseModifier_Plus {
    public level: any;
    public slow_interval_duration: number;
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    GetEffectName(): string {
        if ((this.GetItemPlus() && this.GetItemPlus().GetLevel() == 2) || this.level == 2) {
            return "particles/items4_fx/nullifier_mute_debuff_2.vpcf";
        } else {
            return "particles/items4_fx/nullifier_mute_debuff.vpcf";
        }
    }

    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.level = this.GetItemPlus().GetLevel();
        if (this.GetItemPlus()) {
            this.slow_interval_duration = this.GetItemPlus().GetSpecialValueFor("slow_interval_duration");
        } else {
            this.Destroy();
            return;
        }
        if (!IsServer()) {
            return;
        }
        let overhead_particle = "particles/items4_fx/nullifier_mute.vpcf";
        if ((this.GetItemPlus() && this.GetItemPlus().GetLevel() == 2) || this.level == 2) {
            overhead_particle = "particles/items4_fx/nullifier_mute_2.vpcf";
        }
        let overhead_particleid = ResHelper.CreateParticleEx(overhead_particle, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus());
        this.AddParticle(overhead_particleid, false, false, -1, false, false);
        this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_item_imba_nullifier_slow", {
            duration: this.slow_interval_duration * (1 - this.GetParentPlus().GetStatusResistance())
        });
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (IsServer()) {
            this.GetParentPlus().Purge(true, false, false, false, false);
        }
        return {};
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.target == this.GetParentPlus()) {
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_item_imba_nullifier_slow", {
                duration: this.slow_interval_duration * (1 - this.GetParentPlus().GetStatusResistance())
            });
        }
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_nullifier_slow.vpcf";
    }
}
@registerModifier()
export class modifier_item_imba_nullifier_mute extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_MUTED]: true
        };
    }
}
@registerModifier()
export class modifier_item_imba_nullifier_slow extends BaseModifier_Plus {
    public slow_pct: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.slow_pct = 0;
        if (this.GetItemPlus()) {
            this.slow_pct = this.GetItemPlus().GetSpecialValueFor("slow_pct") * (-1);
        }
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().EmitSound("DOTA_Item.Nullifier.Slow");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.slow_pct;
    }
}
@registerModifier()
export class modifier_item_imba_nullifier_shudder extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true
        };
    }
}
@registerModifier()
export class modifier_item_imba_nullifier_objection_index extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IgnoreTenacity() {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (!IsServer()) {
            return;
        }
        for (let shop_type = 1; shop_type <= 7; shop_type++) {
            if (this.GetParentPlus().IsInRangeOfShop(shop_type, true)) {
                this.Destroy();
                return;
            }
        }
    }
}


// 否决坠饰2级
@registerAbility()
export class item_imba_nullifier_2 extends item_imba_nullifier { }