
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_valiance extends BaseItem_Plus {
    FindModifierByName: string;
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_valiance";
    }
    GetAbilityTextureName(): string {
        if (!this.GetCasterPlus().HasModifier("modifier_item_imba_valiance_counter")) {
            return "item_valiance";
        } else {
            return "item_valiance_counter";
        }
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (!this.GetCasterPlus().HasModifier("modifier_item_imba_valiance_counter") && !this.GetCasterPlus().HasModifier("modifier_item_imba_valiance_guard")) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_OPTIONAL_POINT;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT;
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (this.GetCasterPlus().HasModifier("modifier_item_imba_valiance_counter") || this.GetCasterPlus().HasModifier("modifier_item_imba_valiance_guard")) {
            return this.GetSpecialValueFor("counter_cast_range");
        }
    }
    GetCooldown(level: number): number {
        if (IsClient() || !this.GetCasterPlus().HasModifier("modifier_item_imba_valiance_counter")) {
            return super.GetCooldown(level);
        } else if (this.FindModifierByName && this.GetParentPlus().findBuff<modifier_item_imba_valiance_counter>("modifier_item_imba_valiance_counter").GetElapsedTime) {
            return super.GetCooldown(level) - this.GetParentPlus().findBuff<modifier_item_imba_valiance_counter>("modifier_item_imba_valiance_counter").GetElapsedTime();
        }
    }
    GetManaCost(level: number): number {
        if (this.GetCasterPlus() && this.GetCasterPlus().HasModifier && !this.GetCasterPlus().HasModifier("modifier_item_imba_valiance_counter")) {
            return super.GetManaCost(level);
        } else {
            return this.GetSpecialValueFor("counter_mana_cost");
        }
    }
    CastFilterResultLocation(vLocation: Vector): UnitFilterResult {
        if (!this.GetCasterPlus().IsRooted() || (this.GetCasterPlus().IsRooted() && (vLocation - this.GetCasterPlus().GetAbsOrigin() as Vector).Length2D() <= this.GetSpecialValueFor("counter_distance"))) {
            return UnitFilterResult.UF_SUCCESS;
        } else {
            return UnitFilterResult.UF_FAIL_OTHER;
        }
    }
    OnAbilityPhaseStart(): boolean {
        if (this.GetCasterPlus().HasModifier("modifier_item_imba_valiance_counter") || this.GetCasterPlus().HasModifier("modifier_item_imba_valiance_guard")) {
            this.SetOverrideCastPoint(this.GetSpecialValueFor("counter_castpoint"));
        } else {
            this.SetOverrideCastPoint(0);
        }
        return true;
    }
    OnSpellStart(): void {
        if (!this.GetCasterPlus().HasModifier("modifier_item_imba_valiance_counter")) {
            this.GetCasterPlus().EmitSound("Valiance.Cast");
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_valiance_guard", {
                duration: this.GetSpecialValueFor("guard_duration")
            });
        } else {
            this.GetCasterPlus().EmitSound("Valiance.Dash");
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_valiance_dash", {
                duration: math.max(((this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin() as Vector).Length2D() - this.GetSpecialValueFor("counter_distance")) / this.GetSpecialValueFor("counter_dash_speed"), 0),
                damage_counter: this.GetCasterPlus().findBuff<modifier_item_imba_valiance_counter>("modifier_item_imba_valiance_counter").damage_counter
            });
            this.GetCasterPlus().findBuff<modifier_item_imba_valiance_counter>("modifier_item_imba_valiance_counter").Destroy();
        }
    }
}
@registerModifier()
export class modifier_item_imba_valiance extends BaseModifier_Plus {
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
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_CONSTANT_BLOCK
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    CC_GetModifierHealthBonus(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_health");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("bonus_health_regen");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_CONSTANT_BLOCK)
    CC_GetModifierPhysical_ConstantBlock(p_0: ModifierAttackEvent,): number {
        if (this.GetItemPlus() && GFuncRandom.PRD(this.GetItemPlus().GetSpecialValueFor("block_chance"), this)) {
            if (!this.GetParentPlus().IsRangedAttacker()) {
                return this.GetItemPlus().GetSpecialValueFor("block_damage_melee");
            } else {
                return this.GetItemPlus().GetSpecialValueFor("block_damage_ranged");
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_valiance_guard extends BaseModifier_Plus {
    public guard_damage_reduction: number;
    public guard_angle: any;
    public guard_status_resistance: any;
    public counter_duration: number;
    public shield_particle: any;
    public damage_counter: number;
    IsPurgable(): boolean {
        return false;
    }
    GetTexture(): string {
        return "item_valiance";
    }
    GetStatusEffectName(): string {
        return "particles/status_effect_gold_armor.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.guard_damage_reduction = this.GetItemPlus().GetSpecialValueFor("guard_damage_reduction") * (-1);
        this.guard_angle = this.GetItemPlus().GetSpecialValueFor("guard_angle");
        this.guard_status_resistance = this.GetItemPlus().GetSpecialValueFor("guard_status_resistance");
        this.counter_duration = this.GetItemPlus().GetSpecialValueFor("counter_duration");
        if (!IsServer()) {
            return;
        }
        this.shield_particle = ResHelper.CreateParticleEx("particles/econ/items/chaos_knight/chaos_knight_ti7_shield/chaos_knight_ti7_golden_reality_rift.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(this.shield_particle, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(this.shield_particle, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(this.shield_particle, 2, this.GetParentPlus().GetAbsOrigin() + this.GetParentPlus().GetForwardVector() * 100 as Vector);
        ParticleManager.SetParticleControlForward(this.shield_particle, 2, this.GetParentPlus().GetForwardVector());
        this.AddParticle(this.shield_particle, false, false, -1, false, false);
        this.damage_counter = 0;
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetItemPlus()) {
            this.GetItemPlus().EndCooldown();
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_item_imba_valiance_counter", {
                duration: this.counter_duration,
                damage_counter: this.damage_counter
            });
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_MAGICAL,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE,
            4: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL)
    CC_GetAbsoluteNoDamagePhysical(keys: ModifierAttackEvent): 0 | 1 {
        if (keys.attacker && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS && math.abs(AngleDiff(VectorToAngles(this.GetParentPlus().GetForwardVector()).y, VectorToAngles(keys.attacker.GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).y)) <= this.guard_angle) {
            return 1;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_MAGICAL)
    CC_GetAbsoluteNoDamageMagical(keys: ModifierAttackEvent): 0 | 1 {
        if (keys.attacker && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS && math.abs(AngleDiff(VectorToAngles(this.GetParentPlus().GetForwardVector()).y, VectorToAngles(keys.attacker.GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).y)) <= this.guard_angle) {
            return 1;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE)
    CC_GetAbsoluteNoDamagePure(keys: ModifierAttackEvent): 0 | 1 {
        if (keys.attacker && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS && math.abs(AngleDiff(VectorToAngles(this.GetParentPlus().GetForwardVector()).y, VectorToAngles(keys.attacker.GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).y)) <= this.guard_angle) {
            this.damage_counter = this.damage_counter + keys.original_damage;
            this.SetStackCount(this.damage_counter);
            return 1;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.guard_status_resistance;
    }
}
@registerModifier()
export class modifier_item_imba_valiance_counter extends BaseModifier_Plus {
    public damage_counter: number;
    IsPurgable(): boolean {
        return false;
    }
    GetTexture(): string {
        return "item_valiance_counter";
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (!IsServer()) {
            return;
        }
        this.damage_counter = params.damage_counter;
        this.SetStackCount(this.damage_counter);
    }
    OnRemoved(): void {
        if (!IsServer() || !this.GetItemPlus()) {
            return;
        }
        this.GetItemPlus().UseResources(false, false, true);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetItemPlus()) {
            this.GetItemPlus().UseResources(false, false, true);
        }
    }
}
@registerModifier()
export class modifier_item_imba_valiance_dash extends BaseModifierMotionHorizontal_Plus {
    public guard_angle: any;
    public counter_cast_range: number;
    public counter_dash_speed: number;
    public counter_distance: number;
    public counter_damage_percent: number;
    public counter_knockback_distance: number;
    public counter_knockback_height: number;
    public counter_knockback_duration: number;
    public counter_tree_radius: number;
    public counter_stun_threshold: number;
    public damage_counter: number;
    public cursor_position: any;
    public velocity: any;
    public bash_particle: any;
    IsPurgable(): boolean {
        return false;
    }
    GetStatusEffectName(): string {
        return "particles/status_effect_gold_armor.vpcf";
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.guard_angle = this.GetItemPlus().GetSpecialValueFor("guard_angle");
        this.counter_cast_range = this.GetItemPlus().GetSpecialValueFor("counter_cast_range");
        this.counter_dash_speed = this.GetItemPlus().GetSpecialValueFor("counter_dash_speed");
        this.counter_distance = this.GetItemPlus().GetSpecialValueFor("counter_distance");
        this.counter_damage_percent = this.GetItemPlus().GetSpecialValueFor("counter_damage_percent");
        this.counter_knockback_distance = this.GetItemPlus().GetSpecialValueFor("counter_knockback_distance");
        this.counter_knockback_height = this.GetItemPlus().GetSpecialValueFor("counter_knockback_height");
        this.counter_knockback_duration = this.GetItemPlus().GetSpecialValueFor("counter_knockback_duration");
        this.counter_tree_radius = this.GetItemPlus().GetSpecialValueFor("counter_tree_radius");
        this.counter_stun_threshold = this.GetItemPlus().GetSpecialValueFor("counter_stun_threshold");
        if (!IsServer()) {
            return;
        }
        this.damage_counter = params.damage_counter || 0;
        this.cursor_position = this.GetItemPlus().GetCursorPosition();
        this.velocity = (this.cursor_position - this.GetParentPlus().GetAbsOrigin() as Vector).Normalized() * this.counter_dash_speed;
        this.SetStackCount(this.damage_counter);
        this.GetParentPlus().SetForwardVector((this.cursor_position - this.GetParentPlus().GetAbsOrigin() as Vector).Normalized());
        if (this.ApplyHorizontalMotionController() == false) {
            this.Destroy();
        }
    }
    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (!IsServer()) {
            return;
        }
        me.SetAbsOrigin(me.GetAbsOrigin() + this.velocity * dt as Vector);
        me.FaceTowards((this.cursor_position - me.GetAbsOrigin() as Vector).Normalized());
    }
    OnHorizontalMotionInterrupted(): void {
        this.Destroy();
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().InterruptMotionControllers(true);
        this.GetParentPlus().SetForwardVector((this.cursor_position - this.GetParentPlus().GetAbsOrigin() as Vector).Normalized());
        this.bash_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_mars/mars_shield_bash.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(this.bash_particle, 1, Vector(this.counter_distance, this.counter_distance, this.counter_distance));
        ParticleManager.SetParticleControl(this.bash_particle, 60, Vector(212, 175, 37));
        ParticleManager.SetParticleControl(this.bash_particle, 61, Vector(1, 0, 0));
        ParticleManager.ReleaseParticleIndex(this.bash_particle);
        let enemies = FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.counter_distance, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
        if (GameFunc.GetCount(enemies) > 0) {
            this.GetParentPlus().EmitSound("Valiance.Shield.Cast");
            this.GetParentPlus().EmitSound("Valiance.Shield.Crit");
        } else {
            this.GetParentPlus().EmitSound("Valiance.Shield.Cast.Small");
        }
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (math.abs(AngleDiff(VectorToAngles(this.GetParentPlus().GetForwardVector()).y, VectorToAngles(enemy.GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).y)) <= this.guard_angle) {
                ApplyDamage({
                    victim: enemy,
                    damage: this.damage_counter * (this.counter_damage_percent * 0.01),
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION,
                    attacker: this.GetParentPlus(),
                    ability: this.GetItemPlus()
                });
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_CRITICAL, enemy, this.damage_counter * (this.counter_damage_percent * 0.01), undefined);
                let pos = (enemy.GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin()) as Vector;
                enemy.AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_generic_motion_controller", {
                    distance: this.counter_knockback_distance,
                    direction_x: pos.x,
                    direction_y: pos.y,
                    direction_z: pos.z,
                    duration: this.counter_knockback_duration,
                    height: this.counter_knockback_height,
                    bGroundStop: true,
                    bDecelerate: true,
                    bInterruptible: false,
                    bIgnoreTenacity: true,
                    treeRadius: this.counter_tree_radius,
                    bStun: true
                });
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true
        };
    }
}
