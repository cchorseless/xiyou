
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 虚灵之刃
@registerAbility()
export class item_imba_ethereal_blade extends BaseItem_Plus {
    public caster: IBaseNpc_Plus;
    public blast_movement_slow: any;
    public duration: number;
    public blast_agility_multiplier: any;
    public blast_damage_base: number;
    public duration_ally: number;
    public ethereal_damage_bonus: number;
    public projectile_speed: number;
    public tooltip_range: number;
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_ethereal_blade";
    }
    OnSpellStart(): void {
        this.caster = this.GetCasterPlus();
        this.blast_movement_slow = this.GetSpecialValueFor("blast_movement_slow");
        this.duration = this.GetSpecialValueFor("duration");
        this.blast_agility_multiplier = this.GetSpecialValueFor("blast_agility_multiplier");
        this.blast_damage_base = this.GetSpecialValueFor("blast_damage_base");
        this.duration_ally = this.GetSpecialValueFor("duration_ally");
        this.ethereal_damage_bonus = this.GetSpecialValueFor("ethereal_damage_bonus");
        this.projectile_speed = this.GetSpecialValueFor("projectile_speed");
        this.tooltip_range = this.GetSpecialValueFor("tooltip_range");
        if (!IsServer()) {
            return;
        }
        let target = this.GetCursorTarget();
        this.caster.EmitSound("DOTA_Item.EtherealBlade.Activate");
        let projectile: CreateTrackingProjectileOptions = {
            Target: target,
            Source: this.caster,
            Ability: this,
            EffectName: "particles/items_fx/ethereal_blade.vpcf",
            iMoveSpeed: this.projectile_speed,
            vSourceLoc: this.GetCursorPosition(),
            bDrawsOnMinimap: false,
            bDodgeable: true,
            bIsAttack: false,
            bVisibleToEnemies: true,
            bReplaceExisting: false,
            flExpireTime: GameRules.GetGameTime() + 20,
            bProvidesVision: false
        }
        ProjectileManager.CreateTrackingProjectile(projectile);
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (!IsServer()) {
            return;
        }
        if (target && !target.IsMagicImmune()) {
            if (target.TriggerSpellAbsorb(this)) {
                return undefined;
            }
            target.EmitSound("DOTA_Item.EtherealBlade.Target");
            if (target.GetTeam() == this.caster.GetTeam()) {
                target.AddNewModifier(this.caster, this, "modifier_item_imba_ethereal_blade_ethereal", {
                    duration: this.duration_ally
                });
                target.AddNewModifier(this.caster, this, "modifier_item_imba_gem_of_true_sight", {
                    duration: this.duration
                });
            } else {
                target.AddNewModifier(this.caster, this, "modifier_item_imba_ethereal_blade_ethereal", {
                    duration: this.duration * (1 - target.GetStatusResistance())
                });
                let damageTable = {
                    victim: target,
                    damage: this.caster.GetPrimaryStatValue() * this.blast_agility_multiplier + this.blast_damage_base,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.caster,
                    ability: this
                }
                ApplyDamage(damageTable);
                if (target.IsAlive()) {
                    target.AddNewModifier(this.caster, this, "modifier_item_imba_ethereal_blade_slow", {
                        duration: this.duration * (1 - target.GetStatusResistance())
                    });
                }
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_ethereal_blade extends BaseModifier_Plus {
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
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_strength");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_agility");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_intellect");
        }
    }
}
@registerModifier()
export class modifier_item_imba_ethereal_blade_ethereal extends BaseModifier_Plus {
    public ability: IBaseItem_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public ethereal_damage_bonus: number;
    public luminate_radius: number;
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_ghost.vpcf";
    }
    Init(p_0: any,): void {
        this.ability = this.GetItemPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.ethereal_damage_bonus = this.ability.GetSpecialValueFor("ethereal_damage_bonus");
        this.luminate_radius = this.ability.GetSpecialValueFor("luminate_radius");
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        AddFOWViewer(this.caster.GetTeam(), this.parent.GetAbsOrigin(), this.luminate_radius, FrameTime(), false);
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
        return this.ethereal_damage_bonus;
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
@registerModifier()
export class modifier_item_imba_ethereal_blade_slow extends BaseModifier_Plus {
    public blast_movement_slow: any;
    public realms_grasp_turn_rate_reduction: any;
    public realms_grasp_cast_time_lag: number;
    Init(p_0: any,): void {
        this.blast_movement_slow = this.GetItemPlus().GetSpecialValueFor("blast_movement_slow");
        this.realms_grasp_turn_rate_reduction = this.GetItemPlus().GetSpecialValueFor("realms_grasp_turn_rate_reduction");
        this.realms_grasp_cast_time_lag = this.GetItemPlus().GetSpecialValueFor("realms_grasp_cast_time_lag");
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.CASTTIME_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.blast_movement_slow;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE)
    CC_GetModifierTurnRate_Percentage(): number {
        return this.realms_grasp_turn_rate_reduction;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CASTTIME_PERCENTAGE)
    CC_GetModifierPercentageCasttime(p_0: ModifierAbilityEvent,): number {
        return this.realms_grasp_cast_time_lag;
    }
}
