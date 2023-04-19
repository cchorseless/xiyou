
import { GameFunc } from "../../../GameFunc";
import { AI_ability } from "../../../ai/AI_ability";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
// todo
@registerAbility()
export class imba_batrider_sticky_napalm extends BaseAbility_Plus {
    public napalm_impact_particle: any;
    public enemies: IBaseNpc_Plus[];
    GetIntrinsicModifierName(): string {
        return "modifier_imba_batrider_sticky_napalm_handler";
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_Batrider.StickyNapalm.Cast");
        EmitSoundOnLocationWithCaster(this.GetCursorPosition(), "Hero_Batrider.StickyNapalm.Impact", this.GetCasterPlus());
        this.napalm_impact_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_batrider/batrider_stickynapalm_impact.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(this.napalm_impact_particle, 0, this.GetCursorPosition());
        ParticleManager.SetParticleControl(this.napalm_impact_particle, 1, Vector(this.GetSpecialValueFor("radius"), 0, 0));
        ParticleManager.SetParticleControl(this.napalm_impact_particle, 2, this.GetCasterPlus().GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(this.napalm_impact_particle);
        this.napalm_impact_particle = undefined;
        this.enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetCursorPosition(), undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(this.enemies)) {
            enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_batrider_sticky_napalm", {
                duration: this.GetSpecialValueFor("duration") * (1 - enemy.GetStatusResistance())
            });
        }
        AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), this.GetCursorPosition(), 400, 2, false);
        this.napalm_impact_particle = undefined;
        this.enemies = undefined;
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }

    AutoSpellSelf() {
        return AI_ability.POSITION_most_enemy(this);
    }



}
@registerModifier()
export class modifier_imba_batrider_sticky_napalm_handler extends BaseModifier_Plus {
    public bActive: any;
    IsHidden(): boolean {
        return true;
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus().GetAutoCastState() && this.GetAbilityPlus().IsFullyCastable() && !this.GetAbilityPlus().IsInAbilityPhase() && !this.GetCasterPlus().IsHexed() && !this.GetCasterPlus().IsNightmared() && !this.GetCasterPlus().IsOutOfGame() && !this.GetCasterPlus().IsSilenced() && !this.GetCasterPlus().IsStunned() && !this.GetCasterPlus().IsChanneling()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCasterPlus().GetAbsOrigin());
            this.GetAbilityPlus().CastAbility();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ORDER,
            2: GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_CAST_ANGLE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_TURNING
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierAbilityEvent): void {
        if (!IsServer() || keys.unit != this.GetParentPlus()) {
            return;
        }
        if (keys.ability == this.GetAbilityPlus()) {
            if (keys.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION && GFuncVector.AsVector(keys.new_pos - this.GetCasterPlus().GetAbsOrigin()).Length2D() <= this.GetAbilityPlus().GetCastRange(this.GetCasterPlus().GetCursorPosition(), this.GetCasterPlus()) + this.GetCasterPlus().GetCastRangeBonus()) {
                this.bActive = true;
            } else {
                this.bActive = false;
            }
            if (keys.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO) {
                if (this.GetAbilityPlus().GetAutoCastState()) {
                    this.SetStackCount(0);
                    this.StartIntervalThink(-1);
                } else {
                    this.StartIntervalThink(0.1);
                    this.SetStackCount(1);
                }
            }
        } else {
            this.bActive = false;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_CAST_ANGLE)
    CC_GetModifierIgnoreCastAngle(): 0 | 1 {
        if (!IsServer() || this.bActive == false) {
            return;
        }
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_TURNING)
    CC_GetModifierDisableTurning(): 0 | 1 {
        if (!IsServer() || this.bActive == false) {
            return;
        }
        return 1;
    }
}
@registerModifier()
export class modifier_imba_batrider_sticky_napalm extends BaseModifier_Plus {
    public max_stacks: number;
    public movement_speed_pct: number;
    public turn_rate_pct: number;
    public damage: number;
    public damage_table: ApplyDamageOptions;
    public non_trigger_inflictors: any;
    public stack_particle: ParticleID;
    public damage_debuff_particle: ParticleID;
    GetEffectName(): string {
        return "particles/units/heroes/hero_batrider/batrider_napalm_damage_debuff.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_stickynapalm.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.max_stacks = this.GetSpecialValueFor("max_stacks");
        this.movement_speed_pct = this.GetSpecialValueFor("movement_speed_pct");
        this.turn_rate_pct = this.GetSpecialValueFor("turn_rate_pct");
        this.damage = this.GetSpecialValueFor("damage");
        if (!IsServer()) {
            return;
        }
        this.damage_table = {
            victim: this.GetParentPlus(),
            damage: undefined,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.GetCasterPlus(),
            ability: this.GetAbilityPlus()
        }
        this.non_trigger_inflictors = {
            ["imba_batrider_sticky_napalm"]: true,
            ["item_imba_cloak_of_flames"]: true,
            ["item_imba_radiance"]: true,
            ["item_imba_urn_of_shadows"]: true,
            ["item_imba_spirit_vessel"]: true
        }
        this.SetStackCount(1);
        this.stack_particle = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_batrider/batrider_stickynapalm_stack.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus(), this.GetCasterPlus().GetTeamNumber());
        ParticleManager.SetParticleControl(this.stack_particle, 1, Vector(math.floor(this.GetStackCount() / 10), this.GetStackCount() % 10, 0));
        this.AddParticle(this.stack_particle, false, false, -1, false, false);
    }
    BeRefresh(p_0: any,): void {
        this.max_stacks = this.GetSpecialValueFor("max_stacks");
        this.movement_speed_pct = this.GetSpecialValueFor("movement_speed_pct");
        this.turn_rate_pct = this.GetSpecialValueFor("turn_rate_pct");
        this.damage = this.GetSpecialValueFor("damage");
        if (!IsServer()) {
            return;
        }
        if (this.GetStackCount() < this.max_stacks) {
            this.IncrementStackCount();
        }
        if (this.stack_particle) {
            ParticleManager.SetParticleControl(this.stack_particle, 1, Vector(math.floor(this.GetStackCount() / 10), this.GetStackCount() % 10, 0));
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE,
            3: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return math.min(this.GetStackCount(), this.max_stacks) * this.movement_speed_pct;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE)
    CC_GetModifierTurnRate_Percentage(): number {
        return this.turn_rate_pct;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (keys.attacker == this.GetCasterPlus() && keys.unit == this.GetParentPlus() && (!keys.inflictor || !this.non_trigger_inflictors[keys.inflictor.GetAbilityName()]) && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) {
            this.damage_debuff_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_batrider/batrider_napalm_damage_debuff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetParentPlus());
            ParticleManager.ReleaseParticleIndex(this.damage_debuff_particle);
            this.damage_debuff_particle = undefined;
            if (this.GetParentPlus().IsRealUnit()) {
                this.damage_table.damage = this.damage * this.GetStackCount();
            } else {
                this.damage_table.damage = this.damage * 0.5 * this.GetStackCount();
            }
            ApplyDamage(this.damage_table);
        }
    }
}
@registerAbility()
export class imba_batrider_flamebreak extends BaseAbility_Plus {
    public projectile_table: any;
    public initial_damage_table: ApplyDamageOptions;
    GetAOERadius(): number {
        return this.GetSpecialValueFor("explosion_radius");
    }
    GetCooldown(level: number): number {
        return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_unique_batrider_flamebreak_cooldown");
    }
    OnSpellStart(): void {
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
        }
        let flamebreak_dummy = BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, undefined, {}, this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus().GetTeamNumber(), false);
        flamebreak_dummy.EmitSound("Hero_Batrider.Flamebreak");
        let flamebreak_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_batrider/batrider_flamebreak.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(flamebreak_particle, 0, this.GetCasterPlus().GetAbsOrigin() + Vector(0, 0, 128) as Vector);
        ParticleManager.SetParticleControl(flamebreak_particle, 1, Vector(this.GetSpecialValueFor("speed")));
        ParticleManager.SetParticleControl(flamebreak_particle, 5, this.GetCursorPosition());
        if (!this.projectile_table) {
            this.projectile_table = {
                Ability: this,
                EffectName: undefined,
                vSpawnOrigin: undefined,
                fDistance: undefined,
                fStartRadius: 0,
                fEndRadius: 0,
                Source: this.GetCasterPlus(),
                bHasFrontalCone: false,
                bReplaceExisting: false,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_NONE,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_NONE,
                fExpireTime: undefined,
                bDeleteOnHit: false,
                vVelocity: undefined,
                bProvidesVision: true,
                iVisionRadius: 175,
                iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber(),
                ExtraData: undefined
            }
        }
        this.projectile_table.vSpawnOrigin = this.GetCasterPlus().GetAbsOrigin();
        this.projectile_table.fDistance = GFuncVector.AsVector(this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin()).Length2D();
        this.projectile_table.fExpireTime = GameRules.GetGameTime() + 10.0;
        this.projectile_table.vVelocity = GFuncVector.AsVector(this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin()).Normalized() * this.GetSpecialValueFor("speed") * Vector(1, 1, 0);
        this.projectile_table.ExtraData = {
            flamebreak_dummy_entindex: flamebreak_dummy.entindex(),
            flamebreak_particle: flamebreak_particle
        }
        ProjectileManager.CreateLinearProjectile(this.projectile_table);
    }
    OnProjectileThink_ExtraData(location: Vector, data: any): void {
        if (data.flamebreak_dummy_entindex) {
            EntIndexToHScript(data.flamebreak_dummy_entindex).SetAbsOrigin(location);
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, data: any): boolean | void {
        if (target && !target.IsRealUnit()) { return }
        EmitSoundOnLocationWithCaster(location, "Hero_Batrider.Flamebreak.Impact", this.GetCasterPlus());
        if (data.flamebreak_dummy_entindex) {
            EntIndexToHScript(data.flamebreak_dummy_entindex).StopSound("Hero_Batrider.Flamebreak");
            EntIndexToHScript(data.flamebreak_dummy_entindex).RemoveSelf();
        }
        if (data.flamebreak_particle) {
            ParticleManager.ClearParticle(data.flamebreak_particle, false);
        }
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), location, undefined, this.GetSpecialValueFor("explosion_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        if (!this.initial_damage_table) {
            this.initial_damage_table = {
                victim: undefined,
                damage: this.GetSpecialValueFor("damage_impact"),
                damage_type: this.GetAbilityDamageType(),
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this
            }
        }
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            this.initial_damage_table.victim = enemy;
            ApplyDamage(this.initial_damage_table);
            let v = GFuncVector.AsVector(enemy.GetAbsOrigin() - location).Normalized()
            enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_generic_motion_controller", {
                distance: this.GetSpecialValueFor("knockback_distance"),
                direction_x: v.x,
                direction_y: v.y,
                direction_z: v.z,
                duration: this.GetSpecialValueFor("knockback_duration"),
                height: this.GetSpecialValueFor("knockback_height") * (GFuncVector.AsVector(enemy.GetAbsOrigin() - location).Length2D() / this.GetSpecialValueFor("knockback_distance")),
                bGroundStop: false,
                bDecelerate: false,
                bInterruptible: false,
                bIgnoreTenacity: true,
                bStun: true,
                bTreeRadius: undefined,
                bDestroyTreesAlongPath: true
            });
            enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_batrider_flamebreak_damage", {
                duration: this.GetTalentSpecialValueFor("damage_duration") * (1 - enemy.GetStatusResistance()),
                damage_per_second: this.GetSpecialValueFor("damage_per_second"),
                damage_type: this.GetAbilityDamageType()
            });
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_unique_batrider_flamebreak_cooldown") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_unique_batrider_flamebreak_cooldown")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_unique_batrider_flamebreak_cooldown"), "modifier_special_bonus_imba_unique_batrider_flamebreak_cooldown", {});
        }
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }

    AutoSpellSelf() {
        return AI_ability.POSITION_most_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_batrider_flamebreak_damage extends BaseModifier_Plus {
    public damage_per_second: number;
    public damage_type: number;
    public damage_table: ApplyDamageOptions;
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_batrider/batrider_flamebreak_debuff.vpcf";
    }
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.damage_per_second = params.damage_per_second;
        this.damage_type = params.damage_type;
        this.damage_table = {
            victim: this.GetParentPlus(),
            damage: this.damage_per_second,
            damage_type: this.damage_type,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.GetCasterPlus(),
            ability: this.GetAbilityPlus()
        }
        this.StartIntervalThink(1);
    }
    OnIntervalThink(): void {
        ApplyDamage(this.damage_table);
        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, this.GetParentPlus(), this.damage_per_second, undefined);
        if (this.GetParentPlus().IsRealUnit() && !this.GetParentPlus().IsAlive() && this.GetCasterPlus().GetUnitName().includes("batrider") && RollPercentage(50)) {
            this.GetCasterPlus().EmitSound("batrider_bat_ability_firefly_0" + RandomInt(1, 6));
        }
    }
}
@registerModifier()
export class modifier_imba_batrider_flamebreak_damage_thinker extends BaseModifier_Plus {
}
@registerAbility()
export class imba_batrider_firefly extends BaseAbility_Plus {
    public methane_boost_ability: imba_batrider_methane_boost;
    public responses: any;
    GetAssociatedSecondaryAbilities(): string {
        return "imba_batrider_methane_boost";
    }
    OnOwnerDied(): void {
        let firefly_modifiers = this.GetCasterPlus().FindAllModifiersByName("modifier_imba_batrider_firefly") as modifier_imba_batrider_firefly[];
        for (const [_, mod] of GameFunc.iPair(firefly_modifiers)) {
            if (!mod.firefly_thinker) {
                mod.Destroy();
            } else {
                mod.firefly_thinker.FollowEntity(undefined, false);
                mod.SetStackCount(-1);
                ParticleManager.ClearParticle(mod.ember_particle, false);
            }
            if (mod.truesight_modifier) {
                mod.truesight_modifier.Destroy();
            }
        }
        if (GameFunc.GetCount(firefly_modifiers) >= 1) {
            this.GetCasterPlus().StopSound("Hero_Batrider.Firefly.loop");
        }
    }
    OnUpgrade(): void {
        if (!this.methane_boost_ability || this.methane_boost_ability.IsNull()) {
            this.methane_boost_ability = this.GetCasterPlus().findAbliityPlus<imba_batrider_methane_boost>("imba_batrider_methane_boost");
        }
        if (this.methane_boost_ability) {
            if (!this.methane_boost_ability.IsTrained()) {
                this.methane_boost_ability.SetActivated(false);
                this.methane_boost_ability.SetLevel(1);
            }
        }
    }
    OnSpellStart(): void {
        if (!this.methane_boost_ability || this.methane_boost_ability.IsNull()) {
            this.methane_boost_ability = this.GetCasterPlus().findAbliityPlus<imba_batrider_methane_boost>("imba_batrider_methane_boost");
        }
        if (this.methane_boost_ability) {
            if (!this.methane_boost_ability.IsTrained()) {
                this.methane_boost_ability.SetLevel(1);
            }
            this.methane_boost_ability.SetActivated(true);
        }
        this.GetCasterPlus().EmitSound("Hero_Batrider.Firefly.Cast");
        if (this.GetCasterPlus().GetUnitName().includes("batrider")) {
            if (!this.responses) {
                this.responses = {
                    "1": "batrider_bat_ability_firefly_01",
                    "2": "batrider_bat_ability_firefly_04",
                    "3": "batrider_bat_ability_firefly_07",
                    "4": "batrider_bat_ability_firefly_08",
                    "5": "batrider_bat_ability_firefly_09"
                }
            }
            this.GetCasterPlus().EmitSound(GFuncRandom.RandomOne(Object.values(this.responses)));
        }
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_batrider_firefly", {
            duration: this.GetTalentSpecialValueFor("duration")
        });
    }

    // GetManaCost(level: number): number {
    //     return 0;
    // }

    AutoSpellSelf() {
        return AI_ability.NO_TARGET_cast(this);
    }
}
@registerModifier()
export class modifier_imba_batrider_firefly extends BaseModifier_Plus {
    public movement_speed: number;
    public bonus_vision: number;
    public quiet_flight_multi: any;
    public damage_per_second: number;
    public radius: number;
    public tick_interval: number;
    public tree_radius: number;
    public damage_type: number;
    public damage_table: ApplyDamageOptions;
    public damage_spots: Vector[];
    public damaged_enemies: IBaseNpc_Plus[];
    public think_interval: number;
    public counter: number;
    public time_to_tick: number;
    public firefly_debuff_particle: any;
    public truesight_modifier: any;
    public ember_particle: any;
    public firefly_thinker: any;
    public enemies: IBaseNpc_Plus[];
    public responses: any;
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.movement_speed = this.GetSpecialValueFor("movement_speed");
        this.bonus_vision = this.GetSpecialValueFor("bonus_vision");
        this.quiet_flight_multi = this.GetSpecialValueFor("quiet_flight_multi");
        if (!IsServer()) {
            return;
        }
        this.damage_per_second = this.GetSpecialValueFor("damage_per_second");
        this.radius = this.GetSpecialValueFor("radius");
        this.tick_interval = this.GetSpecialValueFor("tick_interval");
        this.tree_radius = this.GetSpecialValueFor("tree_radius");
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        this.damage_table = {
            victim: undefined,
            damage: this.damage_per_second * this.tick_interval,
            damage_type: this.damage_type,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.GetCasterPlus(),
            ability: this.GetAbilityPlus()
        }
        this.damage_spots = []
        this.damaged_enemies = []
        this.think_interval = 0.1;
        this.counter = 0;
        this.time_to_tick = 0.1;
        this.firefly_debuff_particle = undefined;
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_unique_batrider_firefly_truesight")) {
            this.truesight_modifier = this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_item_imba_gem_of_true_sight", {
                duration: this.GetRemainingTime()
            });
        }
        if (!this.GetAbilityPlus().GetAutoCastState()) {
            this.GetParentPlus().EmitSound("Hero_Batrider.Firefly.loop");
            this.ember_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_batrider/batrider_firefly_ember.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            ParticleManager.SetParticleControl(this.ember_particle, 11, Vector(1, 0, 0));
            this.AddParticle(this.ember_particle, false, false, -1, false, false);
            this.firefly_thinker = BaseModifier_Plus.CreateBuffThinker(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_batrider_firefly_thinker", {
                duration: this.GetRemainingTime()
            }, this.GetParentPlus().GetAbsOrigin(), this.GetCasterPlus().GetTeamNumber(), false);
            this.SetStackCount(1);
            this.StartIntervalThink(this.think_interval);
        }
    }
    OnIntervalThink(): void {
        this.counter = this.counter + this.think_interval;
        if (this.GetStackCount() >= 0) {
            this.damage_spots.push(this.GetParentPlus().GetAbsOrigin());
            GridNav.DestroyTreesAroundPoint(this.GetParentPlus().GetAbsOrigin(), this.tree_radius, true);
        }
        if (this.counter >= this.time_to_tick) {
            for (let damage_spot = 0; damage_spot < this.damage_spots.length; damage_spot++) {
                this.enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(),
                    this.damage_spots[damage_spot], undefined, this.radius,
                    DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                    DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                    DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of GameFunc.iPair(this.enemies)) {
                    if (!this.damaged_enemies.includes(enemy)) {
                        this.damage_table.victim = enemy;
                        this.firefly_debuff_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_batrider/batrider_firefly_debuff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy);
                        ParticleManager.ReleaseParticleIndex(this.firefly_debuff_particle);
                        ApplyDamage(this.damage_table);
                        this.damaged_enemies.push(enemy);
                        if (enemy.IsRealUnit() && !enemy.IsAlive() && RollPercentage(50)) {
                            if (!this.responses) {
                                this.responses = {
                                    "1": "batrider_bat_ability_firefly_02",
                                    "2": "batrider_bat_ability_firefly_05",
                                    "3": "batrider_bat_ability_firefly_06"
                                }
                            }
                            this.GetCasterPlus().EmitSound(GFuncRandom.RandomOne(Object.values(this.responses)));
                        }
                    }
                }
            }
            this.counter = 0;
            this.damaged_enemies = []
        }
        if (this.GetElapsedTime() < this.tick_interval) {
            this.time_to_tick = 0.4;
        } else {
            this.time_to_tick = 0.5;
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetStackCount() >= 0) {
            this.GetParentPlus().StopSound("Hero_Batrider.Firefly.loop");
        }
        let ability = this.GetAbilityPlus<imba_batrider_firefly>()
        if (ability && ability.methane_boost_ability && GameFunc.GetCount(this.GetParentPlus().FindAllModifiersByName(this.GetName())) == 0) {
            ability.methane_boost_ability.SetActivated(false);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.GetStackCount() == 1) {
            return {
                [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true
            };
        } else if (this.GetStackCount() == 0) {
            return {
                [modifierstate.MODIFIER_STATE_FLYING]: true
            };
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION,
            3: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION,
            4: Enum_MODIFIER_EVENT.ON_ORDER,
            5: GPropertyConfig.EMODIFIER_PROPERTY.VISUAL_Z_DELTA
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.VISUAL_Z_DELTA)
    CC_GetVisualZDelta(): number {
        return 240;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.GetStackCount() == 1) {
            return this.movement_speed;
        } else if (this.GetStackCount() == 0) {
            return this.movement_speed * this.quiet_flight_multi;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_DAY_VISION)
    CC_GetBonusDayVision(): number {
        return this.bonus_vision;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION)
    CC_GetBonusNightVision(): number {
        return this.bonus_vision;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierAbilityEvent): void {
        if (!IsServer() || keys.unit != this.GetParentPlus() || keys.order_type != dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO || keys.ability != this.GetAbilityPlus()) {
            return;
        }
        if (this.GetAbilityPlus().GetAutoCastState() && !this.firefly_thinker && this.GetStackCount() != -1) {
            this.GetParentPlus().EmitSound("Hero_Batrider.Firefly.loop");
            this.ember_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_batrider/batrider_firefly_ember.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            ParticleManager.SetParticleControl(this.ember_particle, 11, Vector(1, 0, 0));
            this.AddParticle(this.ember_particle, false, false, -1, false, false);
            this.firefly_thinker = BaseModifier_Plus.CreateBuffThinker(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_batrider_firefly_thinker", {
                duration: this.GetRemainingTime()
            }, this.GetParentPlus().GetAbsOrigin(), this.GetCasterPlus().GetTeamNumber(), false);
            this.SetStackCount(1);
            this.StartIntervalThink(this.think_interval);
        }
    }
}
@registerModifier()
export class modifier_imba_batrider_firefly_thinker extends BaseModifier_Plus {
    public firefly_particle: any;
    IsPurgable(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_PROVIDES_VISION]: true
        };
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.firefly_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_batrider/batrider_firefly.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(this.firefly_particle, 11, Vector(1, 0, 0));
        this.AddParticle(this.firefly_particle, false, false, -1, false, false);
        this.StartIntervalThink(0.1);
    }
    OnIntervalThink(): void {
        this.GetParentPlus().SetAbsOrigin(this.GetCasterPlus().GetAbsOrigin());
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().RemoveSelf();
    }
}
@registerAbility()
export class imba_batrider_methane_boost extends BaseAbility_Plus {
    GetAssociatedPrimaryAbilities(): string {
        return "imba_batrider_firefly";
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_Batrider.Methane_Boost_Cast");
        let smoke_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_batrider/batrider_stickynapalm_smoke.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(smoke_particle, 3, this.GetCasterPlus().GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(smoke_particle);
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_generic_motion_controller", {
            distance: this.GetTalentSpecialValueFor("distance"),
            direction_x: this.GetCasterPlus().GetForwardVector().x,
            direction_y: this.GetCasterPlus().GetForwardVector().y,
            direction_z: this.GetCasterPlus().GetForwardVector().z,
            duration: this.GetSpecialValueFor("duration"),
            height: undefined,
            bGroundStop: false,
            bDecelerate: true,
            bInterruptible: false,
            bIgnoreTenacity: true,
            bStun: false,
            bTreeRadius: undefined,
            bDestroyTreesAlongPath: false
        });
        this.SetActivated(false);
    }
}
@registerAbility()
export class imba_batrider_flaming_lasso extends BaseAbility_Plus {
    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        if (target.TriggerSpellAbsorb(this)) {
            return;
        }
        this.GetCasterPlus().EmitSound("Hero_Batrider.FlamingLasso.Cast");
        if (this.GetCasterPlus().GetUnitName().includes("batrider")) {
            let random_int = RandomInt(1, 11);
            if (random_int <= 9) {
                this.GetCasterPlus().EmitSound("batrider_bat_ability_lasso_0" + random_int);
            } else {
                this.GetCasterPlus().EmitSound("batrider_bat_ability_lasso_" + random_int);
            }
        }
        target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_batrider_flaming_lasso", {
            duration: this.GetSpecialValueFor("duration") * (1 - target.GetStatusResistance()),
            attacker_entindex: this.GetCasterPlus().entindex()
        });
        if (this.GetCasterPlus().HasScepter()) {
            let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), target.GetAbsOrigin(), undefined, this.GetSpecialValueFor("grab_radius_scepter"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (enemy != target && enemy.IsConsideredHero()) {
                    enemy.AddNewModifier(target, this, "modifier_imba_batrider_flaming_lasso", {
                        duration: this.GetSpecialValueFor("duration") * (1 - enemy.GetStatusResistance()),
                        attacker_entindex: this.GetCasterPlus().entindex()
                    });
                    return;
                }
            }
        }
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_batrider_flaming_lasso_self", {
            duration: this.GetSpecialValueFor("duration") * (1 - target.GetStatusResistance())
        });
    }
    GetManaCost(level: number): number {
        return 800;
    }

    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_batrider_flaming_lasso extends BaseModifier_Plus {
    public attacker: any;
    public drag_distance: number;
    public break_distance: number;
    public damage: number;
    public counter: number;
    public damage_instances: number;
    public interval: number;
    public chariot_max_length: any;
    public vector: any;
    public current_position: any;
    public damage_table: ApplyDamageOptions;
    public lasso_particle: any;
    IsDebuff(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_batrider/batrider_flaming_lasso_generic_smoke.vpcf";
    }
    Init(params: any): void {
        if (!IsServer()) {
            return;
        }
        if (params.attacker_entindex) {
            this.attacker = EntIndexToHScript(params.attacker_entindex);
        } else {
            this.attacker = this.GetCasterPlus();
        }
        this.drag_distance = this.GetSpecialValueFor("drag_distance");
        this.break_distance = this.GetSpecialValueFor("break_distance");
        if (this.GetCasterPlus().HasScepter()) {
            this.damage = this.GetSpecialValueFor("scepter_damage");
        } else {
            this.damage = this.GetSpecialValueFor("damage");
        }
        this.counter = 0;
        this.damage_instances = 1 - this.GetParentPlus().GetStatusResistance();
        this.interval = FrameTime();
        this.chariot_max_length = this.GetAbilityPlus().GetCastRange(this.GetParentPlus().GetAbsOrigin(), this.GetParentPlus());
        this.vector = this.GetParentPlus().GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin();
        this.current_position = this.GetCasterPlus().GetAbsOrigin();
        this.damage_table = {
            victim: this.GetParentPlus(),
            damage: this.damage,
            damage_type: this.GetAbilityPlus().GetAbilityDamageType(),
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.attacker,
            ability: this.GetAbilityPlus()
        }
        this.GetParentPlus().EmitSound("Hero_Batrider.FlamingLasso.Loop");
        this.lasso_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_batrider/batrider_flaming_lasso.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        if (this.GetCasterPlus().GetUnitName().includes("batrider")) {
            ParticleManager.SetParticleControlEnt(this.lasso_particle, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "lasso_attack", this.GetCasterPlus().GetAbsOrigin(), true);
        } else {
            ParticleManager.SetParticleControlEnt(this.lasso_particle, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
        }
        ParticleManager.SetParticleControlEnt(this.lasso_particle, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        this.AddParticle(this.lasso_particle, false, false, -1, false, false);
        this.StartIntervalThink(this.interval);
    }

    OnIntervalThink(): void {
        if (GFuncVector.AsVector(this.GetCasterPlus().GetAbsOrigin() - this.current_position).Length2D() > this.break_distance || !this.GetCasterPlus().IsAlive()) {
            this.Destroy();
        } else {
            this.vector = this.GetParentPlus().GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin();
            this.current_position = this.GetCasterPlus().GetAbsOrigin();
            if (GFuncVector.AsVector(this.GetParentPlus().GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin()).Length2D() > this.drag_distance) {
                this.GetParentPlus().SetAbsOrigin(GetGroundPosition(this.GetCasterPlus().GetAbsOrigin() + this.vector.Normalized() * this.drag_distance as Vector, undefined));
            }
        }
        this.counter = this.counter + this.interval;
        if (this.counter >= this.damage_instances) {
            ApplyDamage(this.damage_table);
            this.counter = 0;
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().StopSound("Hero_Batrider.FlamingLasso.Loop");
        this.GetParentPlus().EmitSound("Hero_Batrider.FlamingLasso.End");
        let self_lasso_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_batrider_flaming_lasso_self", this.GetCasterPlus());
        if (self_lasso_modifier) {
            self_lasso_modifier.Destroy();
        }
        FindClearSpaceForUnit(this.GetParentPlus(), this.GetParentPlus().GetAbsOrigin(), false);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION,
            2: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_FLAIL;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(keys: ModifierAbilityEvent): void {
        if (keys.target == this.GetParentPlus() && keys.ability && (keys.ability.GetAbilityName() == "pudge_dismember" || keys.ability.GetAbilityName() == "imba_pudge_dismember" || keys.ability.GetAbilityName() == "tusk_walrus_kick" || keys.ability.GetAbilityName() == "imba_tusk_walrus_kick")) {
            this.Destroy();
        }
    }
}
@registerModifier()
export class modifier_imba_batrider_flaming_lasso_self extends BaseModifier_Plus {
    public bat_attacks_dmg_pct: number;
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.bat_attacks_dmg_pct = this.GetSpecialValueFor("bat_attacks_dmg_pct");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION,
            2: GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_LASSO_LOOP;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return (100 - this.bat_attacks_dmg_pct) * (-1);
    }
}
@registerModifier()
export class modifier_special_bonus_imba_unique_batrider_flamebreak_cooldown extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
