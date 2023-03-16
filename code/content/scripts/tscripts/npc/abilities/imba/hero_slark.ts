
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionBoth_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_slark_dark_pact extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_slark_dark_pact_thinker";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().IsRealUnit()) {
            return tonumber(tostring(super.GetBehavior())) + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
        } else {
            return super.GetBehavior();
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return super.GetCastRange(location, target) - this.GetCasterPlus().GetCastRangeBonus();
    }
    OnSpellStart(): void {
        EmitSoundOnLocationForAllies(this.GetCasterPlus().GetAbsOrigin(), "Hero_Slark.DarkPact.PreCast", this.GetCasterPlus());
        let delay_modifier = this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_slark_dark_pact", {
            duration: this.GetSpecialValueFor("delay"),
            pulse_duration: this.GetSpecialValueFor("pulse_duration"),
            radius: this.GetSpecialValueFor("radius"),
            total_damage: this.GetTalentSpecialValueFor("total_damage"),
            total_pulses: this.GetSpecialValueFor("total_pulses"),
            pulse_interval: this.GetSpecialValueFor("pulse_interval"),
            premature_stack_activation: this.GetSpecialValueFor("premature_stack_activation"),
            premature_spawn_duration: this.GetSpecialValueFor("premature_spawn_duration"),
            premature_health_pct: this.GetSpecialValueFor("premature_health_pct"),
            premature_attack_pct: this.GetSpecialValueFor("premature_attack_pct"),
            premature_base_health: this.GetSpecialValueFor("premature_base_health"),
            premature_base_attack_min: this.GetSpecialValueFor("premature_base_attack_min"),
            premature_base_attack_max: this.GetSpecialValueFor("premature_base_attack_max")
        });
        if (delay_modifier) {
            let start_particle = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_slark/slark_dark_pact_start.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus().GetTeamNumber());
            ParticleManager.SetParticleControlEnt(start_particle, 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
            ParticleManager.SetParticleControl(start_particle, 61, Vector(0, 0, 0));
            delay_modifier.AddParticle(start_particle, false, false, -1, false, false);
        }
    }
}
@registerModifier()
export class modifier_imba_slark_dark_pact extends BaseModifier_Plus {
    public duration: number;
    public pulse_duration: number;
    public radius: number;
    public total_damage: number;
    public total_pulses: any;
    public pulse_interval: number;
    public premature_stack_activation: number;
    public premature_spawn_duration: number;
    public premature_health_pct: number;
    public premature_attack_pct: number;
    public premature_base_health: any;
    public premature_base_attack_min: any;
    public premature_base_attack_max: any;
    public ability_damage_type: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.duration = params.duration;
        this.pulse_duration = params.pulse_duration;
        this.radius = params.radius;
        this.total_damage = params.total_damage;
        this.total_pulses = params.total_pulses;
        this.pulse_interval = params.pulse_interval;
        this.premature_stack_activation = params.premature_stack_activation;
        this.premature_spawn_duration = params.premature_spawn_duration;
        this.premature_health_pct = params.premature_health_pct;
        this.premature_attack_pct = params.premature_attack_pct;
        this.premature_base_health = params.premature_base_health;
        this.premature_base_attack_min = params.premature_base_attack_min;
        this.premature_base_attack_max = params.premature_base_attack_max;
        this.ability_damage_type = this.GetAbilityPlus().GetAbilityDamageType();
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetRemainingTime() <= 0 && this.GetParentPlus().IsAlive()) {
            this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_1);
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_slark_dark_pact_pulses", {
                duration: this.pulse_duration,
                radius: this.radius,
                total_damage: this.total_damage,
                total_pulses: this.total_pulses,
                pulse_interval: this.pulse_interval,
                ability_damage_type: this.ability_damage_type,
                premature_stack_activation: this.premature_stack_activation,
                premature_spawn_duration: this.premature_spawn_duration,
                premature_health_pct: this.premature_health_pct,
                premature_attack_pct: this.premature_attack_pct,
                premature_base_health: this.premature_base_health,
                premature_base_attack_min: this.premature_base_attack_min,
                premature_base_attack_max: this.premature_base_attack_max
            });
        }
    }
}
@registerModifier()
export class modifier_imba_slark_dark_pact_pulses extends BaseModifier_Plus {
    public radius: number;
    public total_damage: number;
    public total_pulses: any;
    public pulse_interval: number;
    public ability_damage_type: number;
    public premature_stack_activation: number;
    public premature_spawn_duration: number;
    public premature_health_pct: number;
    public premature_attack_pct: number;
    public premature_base_health: any;
    public premature_base_attack_min: any;
    public premature_base_attack_max: any;
    public premature_modifier: any;
    public current_health: any;
    public current_health_pct: number;
    public damage_per_pulse: number;
    public damage_table: ApplyDamageOptions;
    public damage_table_self: ApplyDamageOptions;
    public pulses_particle: any;
    public bStoreHealth: any;
    public weapon_table: any;
    public weapon: any;
    public health_differential: any;
    public health_differential_pct: number;
    public store_health_loss: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.radius = params.radius;
        this.total_damage = params.total_damage;
        this.total_pulses = params.total_pulses;
        this.pulse_interval = params.pulse_interval;
        this.ability_damage_type = params.ability_damage_type;
        this.premature_stack_activation = params.premature_stack_activation;
        this.premature_spawn_duration = params.premature_spawn_duration;
        this.premature_health_pct = params.premature_health_pct;
        this.premature_attack_pct = params.premature_attack_pct;
        this.premature_base_health = params.premature_base_health;
        this.premature_base_attack_min = params.premature_base_attack_min;
        this.premature_base_attack_max = params.premature_base_attack_max;
        this.premature_modifier = this.GetCasterPlus().findBuff<modifier_imba_slark_dark_pact_thinker>("modifier_imba_slark_dark_pact_thinker");
        this.current_health = this.GetParentPlus().GetHealth();
        this.current_health_pct = this.GetParentPlus().GetHealthPercent();
        this.damage_per_pulse = this.total_damage / this.total_pulses;
        this.damage_table = {
            victim: undefined,
            damage: this.damage_per_pulse,
            damage_type: this.ability_damage_type,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.GetCasterPlus(),
            ability: this.GetAbilityPlus()
        }
        this.damage_table_self = {
            victim: this.GetParentPlus(),
            damage: this.damage_per_pulse * 0.5,
            damage_type: this.ability_damage_type,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NON_LETHAL,
            attacker: this.GetCasterPlus(),
            ability: this.GetAbilityPlus()
        }
        this.GetParentPlus().EmitSound("Hero_Slark.DarkPact.Cast");
        let visual_unit = BaseNpc_Plus.CreateUnitByName("npc_dota_slark_visual", this.GetParentPlus().GetAbsOrigin(), this.GetParentPlus(), true);
        visual_unit.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_slark_visual", {});
        visual_unit.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_kill", {
            duration: this.GetDuration()
        });
        this.pulses_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_slark/slark_dark_pact_pulses.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, visual_unit);
        ParticleManager.SetParticleControlEnt(this.pulses_particle, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(this.pulses_particle, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(this.pulses_particle, 2, Vector(this.radius, 0, 0));
        this.AddParticle(this.pulses_particle, false, false, -1, false, false);
        GridNav.DestroyTreesAroundPoint(this.GetParentPlus().GetAbsOrigin(), 75, true);
        if (this.premature_modifier) {
            if (this.premature_modifier.GetStackCount() < this.premature_stack_activation) {
                this.premature_modifier.IncrementStackCount();
                this.bStoreHealth = true;
            } else if (this.GetAbilityPlus() && this.GetAbilityPlus().GetAutoCastState()) {
                let spawn_unit = BaseNpc_Plus.CreateUnitByName("npc_dota_slark_spawn", this.GetParentPlus().GetAbsOrigin() + RandomVector(128) as Vector, this.GetParentPlus(), true);
                spawn_unit.SetControllableByPlayer(this.GetParentPlus().GetPlayerID(), false);
                spawn_unit.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_kill", {
                    duration: this.premature_spawn_duration
                });
                if (spawn_unit.HasAbility("imba_slark_dark_pact") && this.GetCasterPlus().HasAbility("imba_slark_dark_pact")) {
                    spawn_unit.findAbliityPlus<imba_slark_dark_pact>("imba_slark_dark_pact").SetLevel(this.GetCasterPlus().FindAbilityByName("imba_slark_dark_pact").GetLevel());
                }
                if (spawn_unit.HasAbility("imba_slark_pounce") && this.GetCasterPlus().HasAbility("imba_slark_pounce")) {
                    spawn_unit.findAbliityPlus<imba_slark_pounce>("imba_slark_pounce").SetLevel(this.GetCasterPlus().FindAbilityByName("imba_slark_pounce").GetLevel());
                }
                if (spawn_unit.HasAbility("imba_slark_essence_shift") && this.GetCasterPlus().HasAbility("imba_slark_essence_shift")) {
                    spawn_unit.findAbliityPlus<imba_slark_essence_shift>("imba_slark_essence_shift").SetLevel(this.GetCasterPlus().FindAbilityByName("imba_slark_essence_shift").GetLevel());
                }
                if (this.premature_modifier.store_health_loss) {
                    spawn_unit.SetBaseMaxHealth(this.premature_base_health + this.premature_modifier.store_health_loss * this.premature_health_pct * 0.01);
                    spawn_unit.SetMaxHealth(this.premature_base_health + this.premature_modifier.store_health_loss * this.premature_health_pct * 0.01);
                    spawn_unit.SetHealth(this.premature_base_health + this.premature_modifier.store_health_loss * this.premature_health_pct * 0.01);
                    spawn_unit.SetBaseDamageMin(this.premature_base_attack_min + this.premature_modifier.store_health_loss * this.premature_attack_pct * 0.01);
                    spawn_unit.SetBaseDamageMax(this.premature_base_attack_max + this.premature_modifier.store_health_loss * this.premature_attack_pct * 0.01);
                }
                this.premature_modifier.SetStackCount(0);
                this.premature_modifier.store_health_loss = 0;
                this.bStoreHealth = false;
                if (!this.weapon_table) {
                    this.weapon_table = {
                        "1": "models/heroes/slark/weapon.vmdl",
                        "2": "models/items/slark/ancient_imbued_spinal_blade/ancient_imbued_spinal_blade.vmdl",
                        "3": "models/items/slark/anuxi_encore_dagger/anuxi_encore_dagger.vmdl",
                        "4": "models/items/slark/barb_of_skadi/barb_of_skadi.vmdl",
                        "5": "models/items/slark/crawblade/crawblade.vmdl",
                        "6": "models/items/slark/dark_reef_weapon/dark_reef_weapon.vmdl",
                        "7": "models/items/slark/deep_warden_scimitar/deep_warden_scimitar.vmdl",
                        "8": "models/items/slark/deepscoundrel_weapon/deepscoundrel_weapon.vmdl",
                        "9": "models/items/slark/golden_barb_of_skadi/golden_barb_of_skadi.vmdl",
                        "10": "models/items/slark/hydrakan_latch/mesh/hydrkan_latch_model.vmdl",
                        "11": "models/items/slark/oceanconquerer_weapon/oceanconquerer_weapon.vmdl",
                        "12": "models/items/slark/pale_justice/pale_justice.vmdl",
                        "13": "models/items/slark/shell_dagger/shell_dagger.vmdl",
                        "14": "models/items/slark/slicer_of_the_depths/slicer_of_the_depths.vmdl",
                        "15": "models/items/slark/spanky_daggerfish/spanky_daggerfish.vmdl",
                        "16": "models/items/slark/the_silent_ripper/the_silent_ripper.vmdl",
                        "17": "models/items/slark/ti9_cache_slark_jungle_rule_weapon/ti9_cache_slark_jungle_rule_weapon.vmdl",
                        "18": "models/items/slark/tidal_blade/tidal_blade.vmdl"
                    }
                }
                this.weapon = SpawnEntityFromTableSynchronous("prop_dynamic", {
                    model: this.weapon_table[RandomInt(1, GameFunc.GetCount(this.weapon_table))]
                });
                this.weapon.FollowEntity(spawn_unit, true);
            } else {
                this.bStoreHealth = false;
            }
        }
        this.StartIntervalThink(this.pulse_interval);
    }
    OnIntervalThink(): void {
        this.GetParentPlus().Purge(false, true, false, true, true);
        for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
            this.damage_table.victim = enemy;
            ApplyDamage(this.damage_table);
        }
        ApplyDamage(this.damage_table_self);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.premature_modifier && !this.premature_modifier.IsNull() && this.premature_modifier.GetStackCount() != 0 && this.bStoreHealth) {
            this.health_differential = this.current_health - this.GetParentPlus().GetHealth();
            this.health_differential_pct = this.current_health_pct - this.GetParentPlus().GetHealthPercent();
            this.store_health_loss = math.max(this.total_damage * 0.5, math.min(this.health_differential, this.GetParentPlus().GetMaxHealth() * this.health_differential_pct * 0.01));
            if (!this.premature_modifier.store_health_loss) {
                this.premature_modifier.store_health_loss = 0;
            }
            this.premature_modifier.store_health_loss = this.premature_modifier.store_health_loss + this.store_health_loss;
        }
    }
}
@registerModifier()
export class modifier_imba_slark_dark_pact_thinker extends BaseModifier_Plus {
    public store_health_loss: any;
    IsHidden(): boolean {
        return this.GetStackCount() <= 0;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.store_health_loss = 0;
    }
}
@registerAbility()
export class imba_slark_pounce extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_slark_pounce_charge_counter";
    }
    GetCooldown(level: number): number {
        if (!this.GetCasterPlus().HasScepter()) {
            if (!this.GetCasterPlus().HasModifier("modifier_imba_slark_pounce") || IsClient()) {
                return super.GetCooldown(level);
            } else if (IsServer()) {
                return (super.GetCooldown(level) * (this.GetCasterPlus().GetCooldownReduction())) - this.GetCasterPlus().findBuff<modifier_imba_slark_pounce>("modifier_imba_slark_pounce").GetElapsedTime();
            }
        } else {
            return 0;
        }
    }
    GetManaCost(level: number): number {
        if (!this.GetCasterPlus().HasModifier("modifier_imba_slark_pounce")) {
            return super.GetManaCost(level);
        } else {
            return 0;
        }
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_Slark.Pounce.Cast");
        let pounce_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_slark/slark_pounce_start.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        ParticleManager.ReleaseParticleIndex(pounce_particle);
        if (this.GetCasterPlus().GetUnitName().includes("slark")) {
            this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_SLARK_POUNCE);
        }
        if (!this.GetCasterPlus().HasModifier("modifier_imba_slark_pounce")) {
            if (!this.GetCasterPlus().HasScepter()) {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_slark_pounce", {
                    duration: this.GetSpecialValueFor("pounce_distance") / this.GetSpecialValueFor("pounce_speed")
                });
            } else {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_slark_pounce", {
                    duration: this.GetSpecialValueFor("pounce_distance_scepter") / (this.GetSpecialValueFor("pounce_speed") * 2)
                });
            }
            this.EndCooldown();
            this.StartCooldown(0.1);
        } else {
            if (this.GetCasterPlus().findBuff<modifier_imba_slark_pounce>("modifier_imba_slark_pounce").redirect_pos) {
                this.GetCasterPlus().findBuff<modifier_imba_slark_pounce>("modifier_imba_slark_pounce").direction = (this.GetCasterPlus().findBuff<modifier_imba_slark_pounce>("modifier_imba_slark_pounce").redirect_pos - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized();
            } else {
                this.GetCasterPlus().findBuff<modifier_imba_slark_pounce>("modifier_imba_slark_pounce").direction = this.GetCasterPlus().GetForwardVector();
            }
            this.UseResources(false, false, true);
        }
    }
}
@registerModifier()
export class modifier_imba_slark_pounce extends BaseModifierMotionBoth_Plus {
    public pounce_speed: number;
    public pounce_radius: number;
    public leash_duration: number;
    public leash_radius: number;
    public duration: number;
    public direction: any;
    public redirection_commands: any;
    public vertical_velocity: any;
    public vertical_acceleration: any;
    public redirect_pos: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_slark/slark_pounce_trail.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.pounce_speed = this.GetSpecialValueFor("pounce_speed");
        this.pounce_radius = this.GetSpecialValueFor("pounce_radius");
        this.leash_duration = this.GetAbilityPlus().GetTalentSpecialValueFor("leash_duration");
        this.leash_radius = this.GetSpecialValueFor("leash_radius");
        this.duration = this.GetSpecialValueFor("pounce_distance") / this.pounce_speed;
        this.direction = this.GetParentPlus().GetForwardVector();
        if (this.GetCasterPlus().HasScepter()) {
            this.pounce_speed = this.GetSpecialValueFor("pounce_speed") * 2;
            this.duration = this.GetSpecialValueFor("pounce_distance_scepter") / this.pounce_speed;
        }
        this.redirection_commands = {
            [dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET]: true,
            [dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE]: true
        }
        this.vertical_velocity = 4 * 125 / this.duration;
        this.vertical_acceleration = -(8 * 125) / (this.duration * this.duration);
        this.BeginMotionOrDestroy()
    }

    BeRemoved(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus()) {
            if (!this.GetCasterPlus().HasScepter()) {
                this.GetAbilityPlus().UseResources(false, false, true);
            } else {
                if (this.GetCasterPlus().findBuffStack("modifier_imba_slark_pounce_charge_counter", this.GetCasterPlus()) == 0) {
                    this.GetAbilityPlus().StartCooldown(this.GetCasterPlus().findBuff<modifier_imba_slark_pounce_charge_counter>("modifier_imba_slark_pounce_charge_counter").GetRemainingTime());
                } else {
                    this.GetAbilityPlus().UseResources(false, false, true);
                }
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().RemoveHorizontalMotionController(this);
        this.GetParentPlus().RemoveVerticalMotionController(this);
        if (this.GetCasterPlus().GetUnitName().includes("slark")) {
            this.GetCasterPlus().FadeGesture(GameActivity_t.ACT_DOTA_SLARK_POUNCE);
        }
        GridNav.DestroyTreesAroundPoint(this.GetParentPlus().GetAbsOrigin(), 100, true);
    }
    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (!IsServer()) {
            return;
        }
        for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.pounce_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, FindOrder.FIND_CLOSEST, false))) {
            if (enemy.IsRealUnit() || enemy.IsClone() || enemy.IsTempestDouble()) {
                enemy.EmitSound("Hero_Slark.Pounce.Impact");
                if (this.GetParentPlus().GetUnitName().includes("slark")) {
                    this.GetParentPlus().EmitSound("slark_slark_pounce_0" + RandomInt(1, 6));
                }
                enemy.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_slark_pounce_leash", {
                    duration: this.leash_duration * (1 - enemy.GetStatusResistance()),
                    leash_radius: this.leash_radius
                });
                this.GetParentPlus().MoveToTargetToAttack(enemy);
                this.GetParentPlus().PerformAttack(enemy, true, true, true, false, false, false, false);
                this.Destroy();
                return;
            }
        }
        me.SetAbsOrigin(me.GetAbsOrigin() + this.pounce_speed * this.direction * dt as Vector);
    }
    OnHorizontalMotionInterrupted(): void {
        this.Destroy();
    }
    UpdateVerticalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (!IsServer()) {
            return;
        }
        me.SetAbsOrigin(me.GetAbsOrigin() + Vector(0, 0, this.vertical_velocity) * dt as Vector);
        this.vertical_velocity = this.vertical_velocity + (this.vertical_acceleration * dt);
    }
    OnVerticalMotionInterrupted(): void {
        this.Destroy();
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS,
            2: Enum_MODIFIER_EVENT.ON_ORDER
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        return "leash";
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierAbilityEvent): void {
        if (keys.unit == this.GetParentPlus()) {
            if (this.redirection_commands[keys.order_type]) {
                if (keys.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION && keys.new_pos) {
                    this.redirect_pos = keys.new_pos;
                } else if (keys.target) {
                    this.redirect_pos = keys.target.GetAbsOrigin();
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_slark_pounce_leash extends BaseModifier_Plus {
    public leash_radius: number;
    public begin_slow_radius: number;
    public leash_position: any;
    public ground_particle: any;
    public leash_particle: any;
    public limit: any;
    public move_speed: number;
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.leash_radius = params.leash_radius;
        this.begin_slow_radius = params.leash_radius * 80 * 0.01;
        this.leash_position = this.GetParentPlus().GetAbsOrigin();
        this.GetParentPlus().EmitSound("Hero_Slark.Pounce.Leash");
        this.ground_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_slark/slark_pounce_ground.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
        ParticleManager.SetParticleControl(this.ground_particle, 3, this.GetParentPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(this.ground_particle, 4, Vector(this.leash_radius));
        this.AddParticle(this.ground_particle, false, false, -1, false, false);
        this.leash_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_slark/slark_pounce_leash.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(this.leash_particle, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(this.leash_particle, 3, this.GetParentPlus().GetAbsOrigin());
        this.AddParticle(this.leash_particle, false, false, -1, false, false);
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        this.limit = 0;
        this.move_speed = this.GetParentPlus().GetMoveSpeedModifier(this.GetParentPlus().GetBaseMoveSpeed(), false);
        this.limit = ((this.leash_radius - (this.GetParentPlus().GetAbsOrigin() - this.leash_position as Vector).Length2D()) / this.leash_radius) * this.move_speed;
        if (this.limit == 0) {
            this.limit = -0.01;
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().StopSound("Hero_Slark.Pounce.Leash");
        this.GetParentPlus().EmitSound("Hero_Slark.Pounce.End");
        this.GetParentPlus().InterruptMotionControllers(true);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_TETHERED]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_LIMIT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_LIMIT)
    CC_GetModifierMoveSpeed_Limit(): number {
        if (!IsServer()) {
            return;
        }
        if ((this.GetParentPlus().GetAbsOrigin() - this.leash_position as Vector).Length2D() >= this.begin_slow_radius && math.abs(AngleDiff(VectorToAngles(this.GetParentPlus().GetAbsOrigin() - this.leash_position as Vector).y, VectorToAngles(this.GetParentPlus().GetForwardVector()).y)) <= 85) {
            return this.limit;
        }
    }
}
@registerModifier()
export class modifier_imba_slark_pounce_charge_counter extends BaseModifier_Plus {
    IsHidden(): boolean {
        return !this.GetCasterPlus().HasScepter();
    }
    DestroyOnExpire(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(math.max(this.GetSpecialValueFor("max_charges"), 2));
        this.CalculateCharge();
    }
    OnIntervalThink(): void {
        this.IncrementStackCount();
        this.StartIntervalThink(-1);
        this.CalculateCharge();
    }
    CalculateCharge() {
        if (this.GetStackCount() >= math.max(this.GetSpecialValueFor("max_charges"), 2)) {
            this.SetDuration(-1, true);
            this.StartIntervalThink(-1);
        } else {
            if (this.GetRemainingTime() <= 0.05) {
                this.StartIntervalThink(this.GetAbilityPlus().GetTalentSpecialValueFor("charge_restore_time") * this.GetParentPlus().GetCooldownReduction());
                this.SetDuration(this.GetAbilityPlus().GetTalentSpecialValueFor("charge_restore_time") * this.GetParentPlus().GetCooldownReduction(), true);
            }
            this.GetAbilityPlus().StartCooldown(0.1);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(params: ModifierAbilityEvent): void {
        if (params.unit != this.GetParentPlus() || !this.GetParentPlus().HasScepter()) {
            return;
        }
        if (params.ability == this.GetAbilityPlus()) {
            let wtf_mode = true;
            if (!GameRules.IsCheatMode()) {
                wtf_mode = false;
            } else {
                for (let ability = 0; ability <= 24 - 1; ability++) {
                    if (this.GetParentPlus().GetAbilityByIndex(ability) && this.GetParentPlus().GetAbilityByIndex(ability).GetCooldownTimeRemaining() > 0) {
                        wtf_mode = false;
                        break;
                    }
                }
                if (wtf_mode == false) {
                    for (let item = 0; item <= 15; item++) {
                        if (this.GetParentPlus().GetItemInSlot(item) && this.GetParentPlus().GetItemInSlot(item).GetCooldownTimeRemaining() > 0) {
                            wtf_mode = false;
                            return;
                        }
                    }
                }
            }
            if (wtf_mode == false) {
                this.DecrementStackCount();
                this.CalculateCharge();
            }
        } else if (params.ability.GetAbilityName() == "item_refresher" || params.ability.GetAbilityName() == "item_refresher_shard") {
            this.StartIntervalThink(-1);
            this.SetDuration(-1, true);
            this.SetStackCount(this.GetSpecialValueFor("max_charges"));
        }
    }
}
@registerAbility()
export class imba_slark_essence_shift extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_slark_essence_shift";
    }
    OnSpellStart(): void {
    }
}
@registerModifier()
export class modifier_imba_slark_essence_shift extends BaseModifier_Plus {
    public stack_table: any[];
    public shift_particle: any;
    DestroyOnExpire(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return this.GetStackCount() <= 0;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.stack_table = []
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        this.stack_table = this.stack_table.filter(i => {
            return this.stack_table[i].apply_game_time && this.stack_table[i].duration && GameRules.GetDOTATime(true, true) - this.stack_table[i].apply_game_time <= this.stack_table[i].duration;
        })

        if (GameFunc.GetCount(this.stack_table) != this.GetStackCount()) {
            this.SetStackCount(GameFunc.GetCount(this.stack_table));
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            2: Enum_MODIFIER_EVENT.ON_DEATH,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (this.GetAbilityPlus().IsTrained() && keys.attacker == this.GetParentPlus() && !this.GetParentPlus().PassivesDisabled() && !this.GetParentPlus().IsIllusion() && /** (keys.target.IsRealUnit() || keys.target.IsClone()) && **/ !keys.target.IsTempestDouble() && keys.attacker.GetTeam() != keys.target.GetTeam()) {
            this.shift_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_slark/slark_essence_shift.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, keys.target);
            ParticleManager.ReleaseParticleIndex(this.shift_particle);
            this.stack_table.push({
                apply_game_time: GameRules.GetDOTATime(true, true),
                duration: this.GetAbilityPlus().GetTalentSpecialValueFor("duration")
            });
            this.SetDuration(this.GetAbilityPlus().GetTalentSpecialValueFor("duration"), true);
            this.IncrementStackCount();
            keys.target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_slark_essence_shift_debuff_counter", {
                duration: this.GetAbilityPlus().GetTalentSpecialValueFor("duration") * (1 - keys.target.GetStatusResistance())
            });
            if (this.GetAbilityPlus().IsCooldownReady()) {
                this.GetAbilityPlus().StartCooldown(this.GetAbilityPlus().GetCooldown(this.GetAbilityPlus().GetLevel() - 1) * this.GetParentPlus().GetCooldownReduction());
                this.GetParentPlus().PerformAttack(keys.target, true, true, true, false, false, true, false);
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetParentPlus()) {
            this.stack_table = []
            this.SetStackCount(0);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.GetSpecialValueFor("agi_gain") * this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_slark_essence_shift_debuff_counter extends BaseModifier_Plus {
    public stat_loss: any;
    public stack_table: any[];
    public bStealAgi: any;
    DestroyOnExpire(): boolean {
        return this.GetParentPlus().GetHealthPercent() > 0;
    }
    IsHidden(): boolean {
        return this.GetParentPlus().GetHealthPercent() <= 0;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    Init(p_0: any,): void {
        if (!this.stat_loss) {
            this.stat_loss = this.GetSpecialValueFor("stat_loss");
        }
        if (!IsServer()) {
            return;
        }
        if (!this.stack_table) {
            this.stack_table = []
        }
        this.stack_table.push({
            apply_game_time: GameRules.GetDOTATime(true, true),
            duration: this.GetAbilityPlus().GetTalentSpecialValueFor("duration")
        });
        this.IncrementStackCount();
        this.StartIntervalThink(FrameTime());
    }

    OnIntervalThink(): void {
        this.stack_table = this.stack_table.filter((i) => {
            return this.stack_table[i].apply_game_time && this.stack_table[i].duration && GameRules.GetDOTATime(true, true) - this.stack_table[i].apply_game_time <= this.stack_table[i].duration;
        })

        if (GameFunc.GetCount(this.stack_table) != this.GetStackCount()) {
            this.SetStackCount(GameFunc.GetCount(this.stack_table));
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            2: Enum_MODIFIER_EVENT.ON_DEATH,
            3: Enum_MODIFIER_EVENT.ON_RESPAWN,
            4: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            5: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            6: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            7: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && !this.GetParentPlus().PassivesDisabled() && (keys.target.IsRealUnit() || keys.target.IsClone()) && !keys.target.IsTempestDouble()) {
            this.stack_table.push({
                apply_game_time: GameRules.GetDOTATime(true, true),
                duration: this.GetAbilityPlus().GetTalentSpecialValueFor("duration")
            });
            this.SetDuration(this.GetAbilityPlus().GetTalentSpecialValueFor("duration"), true);
            this.IncrementStackCount();
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetParentPlus() && (keys.unit == this.GetParentPlus() || keys.unit.GetTeamNumber() != keys.attacker.GetTeamNumber()) && this.GetCasterPlus().HasModifier("modifier_imba_slark_essence_shift") && ((keys.unit.GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Length2D() <= 300 || keys.attacker == this.GetCasterPlus()) && !this.GetCasterPlus().HasModifier("modifier_morphling_replicate")) {
            if (!this.GetParentPlus().IsReincarnating || (this.GetParentPlus().IsReincarnating && !this.GetParentPlus().IsReincarnating())) {
                this.bStealAgi = true;
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_slark_essence_shift_permanent_buff", {});
            } else {
                this.Destroy();
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_RESPAWN)
    CC_OnRespawn(keys: ModifierUnitEvent): void {
        if (keys.unit == this.GetParentPlus() && this.bStealAgi) {
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_slark_essence_shift_permanent_debuff", {});
        }
        this.Destroy();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.stat_loss * (-1) * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.stat_loss * (-1) * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.stat_loss * (-1) * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.stat_loss * (-1) * this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_slark_essence_shift_permanent_buff extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    Init(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.IncrementStackCount();
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_slark_essence_shift_permanent_debuff extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    Init(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.IncrementStackCount();
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.GetStackCount() * (-1);
    }
}
@registerAbility()
export class imba_slark_shadow_dance extends BaseAbility_Plus {
    public responses: any;
    GetIntrinsicModifierName(): string {
        return "modifier_imba_slark_shadow_dance_passive_regen";
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (this.GetCasterPlus().HasModifier("modifier_imba_slark_shadow_dance_dark_reef_handler")) {
            return this.GetSpecialValueFor("dark_reef_radius") - this.GetCasterPlus().GetCastRangeBonus();
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasModifier("modifier_imba_slark_shadow_dance_passive_regen") && this.GetAutoCastState() && !this.GetCasterPlus().HasModifier("modifier_imba_slark_shadow_dance_dark_reef_handler")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_slark_shadow_dance_dark_reef_handler", {});
        }
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_Slark.ShadowDance");
        if (this.GetCasterPlus().GetUnitName().includes("slark") && RollPercentage(30)) {
            if (!this.responses) {
                this.responses = {
                    "1": "slark_slark_dark_pact_05",
                    "2": "slark_slark_dark_pact_06",
                    "3": "slark_slark_shadow_dance_01",
                    "4": "slark_slark_shadow_dance_02",
                    "5": "slark_slark_shadow_dance_03",
                    "6": "slark_slark_shadow_dance_04"
                }
            }
            this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(this.responses));
        }
        if (!this.GetAutoCastState()) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_slark_shadow_dance_aura", {
                duration: this.GetTalentSpecialValueFor("duration")
            });
        } else {
            BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_imba_slark_shadow_dance_aura", {
                duration: this.GetTalentSpecialValueFor("duration"),
                bAutoCast: 1
            }, this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus().GetTeamNumber(), false);
        }
    }
}
@registerModifier()
export class modifier_imba_slark_shadow_dance_passive_regen extends BaseModifier_Plus {
    public bPassiveActive: any;
    public bVisible: any;
    public counter: number;
    public interval: number;
    public bHitByNeutral: any;
    public neutral_counter: number;
    public enemy_that_sees_me: any;
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return this.GetStackCount() < 0 && !this.GetParentPlus().HasModifier("modifier_imba_slark_shadow_dance");
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.bPassiveActive = true;
        this.bVisible = false;
        this.counter = 0;
        this.interval = 0.1;
        this.bHitByNeutral = false;
        this.neutral_counter = 0;
        this.StartIntervalThink(this.interval);
    }
    OnIntervalThink(): void {
        if (this.bHitByNeutral) {
            this.neutral_counter = this.neutral_counter + this.interval;
            if (this.neutral_counter >= this.GetSpecialValueFor("neutral_disable")) {
                this.bHitByNeutral = false;
                this.neutral_counter = 0;
            }
        }
        this.bVisible = false;
        let units = FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_ALL,
            DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD,
            FindOrder.FIND_FARTHEST, false) as IBaseNpc_Plus[];
        for (const enemy of units) {
            if (enemy.GetTeamNumber() != DOTATeam_t.DOTA_TEAM_NEUTRALS && !enemy.IsRoshan() && enemy.CanEntityBeSeenByMyTeam(this.GetParentPlus()) && !enemy.GetUnitName().includes("watch_tower")) {
                this.enemy_that_sees_me = enemy;
                this.bVisible = true;
                return;
            }
        }
        if (((this.bPassiveActive && this.bVisible) || this.bHitByNeutral) && !this.GetParentPlus().HasModifier("modifier_imba_slark_shadow_dance")) {
            if (!this.bHitByNeutral) {
                this.counter = this.counter + this.interval;
            }
            if (this.counter >= this.GetSpecialValueFor("activation_delay") || this.bHitByNeutral) {
                this.bPassiveActive = false;
                this.SetStackCount(-1);
                if (!this.bHitByNeutral) {
                    this.counter = 0;
                }
            }
        } else if (!this.bPassiveActive && !this.bVisible) {
            this.counter = this.counter + this.interval;
            if (this.counter >= this.GetSpecialValueFor("activation_delay") && !this.bHitByNeutral) {
                this.bPassiveActive = true;
                this.SetStackCount(0);
                this.counter = 0;
                this.enemy_that_sees_me = undefined;
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE,
            3: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE,
            4: Enum_MODIFIER_EVENT.ON_ORDER
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (!this.IsHidden() && !this.GetParentPlus().PassivesDisabled() && !this.GetParentPlus().IsIllusion()) {
            return this.GetSpecialValueFor("bonus_movement_speed");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE)
    CC_GetModifierHealthRegenPercentage(): number {
        if (!this.IsHidden() && !this.GetParentPlus().PassivesDisabled() && !this.GetParentPlus().IsIllusion()) {
            return this.GetSpecialValueFor("bonus_regen_pct");
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetParentPlus() && (keys.attacker.IsNeutralUnitType && keys.attacker.IsNeutralUnitType())) {
            this.bHitByNeutral = true;
            this.neutral_counter = 0;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierAbilityEvent): void {
        if (!IsServer() || keys.unit != this.GetParentPlus() || keys.order_type != dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO || keys.ability != this.GetAbilityPlus()) {
            return;
        }
        if (this.GetAbilityPlus().GetAutoCastState()) {
            this.GetParentPlus().RemoveModifierByName("modifier_imba_slark_shadow_dance_dark_reef_handler");
        } else {
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_slark_shadow_dance_dark_reef_handler", {});
        }
    }
}
@registerModifier()
export class modifier_imba_slark_shadow_dance_aura extends BaseModifier_Plus {
    public shadow_particle: any;
    public aoe: any;
    public shadow_dummy_particle: any;
    IsHidden(): boolean {
        return true;
    }
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.shadow_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_slark/slark_shadow_dance.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(this.shadow_particle, 3, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_eyeR", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(this.shadow_particle, 4, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_eyeL", this.GetCasterPlus().GetAbsOrigin(), true);
        this.AddParticle(this.shadow_particle, false, false, -1, false, false);
        if ((!params || params && params.bAutoCast != 1)) {
            ParticleManager.SetParticleControlEnt(this.shadow_particle, 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
            let visual_unit = BaseNpc_Plus.CreateUnitByName("npc_dota_slark_visual", this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus(), true);
            visual_unit.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_slark_visual", {});
            visual_unit.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_kill", {
                duration: this.GetAbilityPlus().GetTalentSpecialValueFor("duration") + 0.5
            });
            let shadow_particle_name = "particles/units/heroes/hero_slark/slark_shadow_dance_dummy.vpcf";
            this.aoe = 0;
            this.shadow_dummy_particle = ResHelper.CreateParticleEx(shadow_particle_name, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, visual_unit);
            ParticleManager.SetParticleControlEnt(this.shadow_dummy_particle, 1, visual_unit, ParticleAttachment_t.PATTACH_POINT_FOLLOW, undefined, visual_unit.GetAbsOrigin(), true);
            this.AddParticle(this.shadow_dummy_particle, false, false, -1, false, false);
        } else {
            ParticleManager.SetParticleControlEnt(this.shadow_particle, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "", this.GetParentPlus().GetAbsOrigin(), true);
            this.aoe = this.GetSpecialValueFor("dark_reef_radius");
            for (let arr = 1; arr <= 20; arr++) {
                this.shadow_dummy_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_slark/slark_shadow_dance_dummy_sceptor.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
                ParticleManager.SetParticleControl(this.shadow_dummy_particle, 1, GetGroundPosition(this.GetParentPlus().GetAbsOrigin() + RotatePosition(Vector(0, 0, 0), QAngle(0, (360 / 20) * arr, 0), Vector(800, 0, 0)) as Vector, undefined));
                this.AddParticle(this.shadow_dummy_particle, false, false, -1, false, false);
            }
            for (let arr = 1; arr <= 10; arr++) {
                this.shadow_dummy_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_slark/slark_shadow_dance_dummy_sceptor.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
                ParticleManager.SetParticleControl(this.shadow_dummy_particle, 1, GetGroundPosition(this.GetParentPlus().GetAbsOrigin() + RotatePosition(Vector(0, 0, 0), QAngle(0, (360 / 10) * arr, 0), Vector(300, 0, 0)) as Vector, undefined));
                this.AddParticle(this.shadow_dummy_particle, false, false, -1, false, false);
            }
        }
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.aoe || 0;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        if (this.GetParentPlus().GetUnitName() !== "npc_dota_thinker") {
            return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
        } else {
            return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH;
        }
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING;
    }
    GetModifierAura(): string {
        return "modifier_imba_slark_shadow_dance";
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        if (target.HasModifier("modifier_imba_slark_visual")) {
            return true;
        }
    }
}
@registerModifier()
export class modifier_imba_slark_shadow_dance extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_SUPER_ULTRA;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_slark_shadow_dance.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: true,
            [modifierstate.MODIFIER_STATE_TRUESIGHT_IMMUNE]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    CC_GetModifierInvisibilityLevel(): number {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        return "shadow_dance";
    }
}
@registerModifier()
export class modifier_imba_slark_shadow_dance_dark_reef_handler extends BaseModifier_Plus {
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
@registerModifier()
export class modifier_imba_slark_visual extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        this.GetParentPlus().SetAbsOrigin(this.GetCasterPlus().GetAbsOrigin());
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: false,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_LOW_ATTACK_PRIORITY]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_UNTARGETABLE]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true
        };
    }
}
