
import { GameFunc } from "../../../GameFunc";
import { AI_ability } from "../../../ai/AI_ability";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerModifier()
export class modifier_special_bonus_imba_lina_8 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let target = params.target;
            if (parent == params.attacker && target.GetTeamNumber() != parent.GetTeamNumber()) {
                let int = parent.GetIntellect();
                let ticks = parent.GetTalentValue("special_bonus_imba_lina_8", "ticks_amount");
                let duration = parent.GetTalentValue("special_bonus_imba_lina_8", "duration");
                let dmg_int_pct = parent.GetTalentValue("special_bonus_imba_lina_8", "dmg_int_pct");
                let dmg_per_tick = (int * dmg_int_pct / 100) / (duration / ticks);
                let tick_duration = duration / ticks;
                target.AddNewModifier(parent, undefined, "modifier_imba_blazing_fire", {
                    duration: duration * (1 - target.GetStatusResistance()),
                    dmg_per_tick: dmg_per_tick,
                    tick_duration: tick_duration
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_blazing_fire extends BaseModifier_Plus {
    public dmg_per_tick: any;
    public counter: number;
    public particle_fx: any;
    BeCreated(params: any): void {
        if (IsServer()) {
            this.dmg_per_tick = params.dmg_per_tick;
            this.counter = 10;
            let parent = this.GetParentPlus();
            this.StartIntervalThink(params.tick_duration);
            this.particle_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_lina/lina_fiery_soul.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus());
            ParticleManager.SetParticleControlEnt(this.particle_fx, 0, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true);
            ParticleManager.SetParticleControl(this.particle_fx, 1, Vector(1, 0, 0));
        }
    }
    BeRefresh(params: any): void {
        if (IsServer()) {
            this.dmg_per_tick = params.dmg_per_tick;
            this.counter = 10;
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            ApplyDamage({
                victim: this.GetParentPlus(),
                attacker: this.GetCasterPlus(),
                ability: undefined,
                damage: this.dmg_per_tick,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            });
            this.counter = this.counter - 1;
        }
    }
    BeDestroy( /** params */): void {
        if (IsServer()) {
            ApplyDamage({
                victim: this.GetParentPlus(),
                attacker: this.GetCasterPlus(),
                ability: undefined,
                damage: (this.dmg_per_tick * this.counter),
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            });
            ParticleManager.DestroyParticle(this.particle_fx, false);
            ParticleManager.ReleaseParticleIndex(this.particle_fx);
        }
    }
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    GetTexture(): string {
        return "lina_fiery_soul";
    }
}
@registerAbility()
export class imba_lina_dragon_slave extends BaseAbility_Plus {
    public cast_point: any;
    GetCooldown(level: number): number {
        return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_lina_10");
    }
    OnUpgrade(): void {
        this.cast_point = this.cast_point || this.GetCastPoint();
    }
    OnSpellStart(): void {
        if (IsServer()) {
            if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
                this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
            }
            let caster = this.GetCasterPlus();
            let target_loc = this.GetCursorPosition();
            let caster_loc = caster.GetAbsOrigin();
            let primary_damage = this.GetSpecialValueFor("primary_damage");
            let secondary_damage = this.GetSpecialValueFor("secondary_damage");
            let spread_angle = this.GetSpecialValueFor("spread_angle");
            let secondary_amount = this.GetSpecialValueFor("secondary_amount");
            let speed = this.GetSpecialValueFor("speed");
            let width_initial = this.GetSpecialValueFor("width_initial");
            let width_end = this.GetSpecialValueFor("width_end");
            let primary_distance = this.GetCastRange(caster_loc, caster) + GPropertyCalculate.GetCastRangeBonus(caster);
            let secondary_distance = this.GetSpecialValueFor("secondary_distance");
            let split_delay = this.GetSpecialValueFor("split_delay");
            let secondary_width_initial = this.GetSpecialValueFor("secondary_width_initial");
            let secondary_width_end = this.GetSpecialValueFor("secondary_width_end");
            let cdr_hero = this.GetSpecialValueFor("cdr_hero");
            let cdr_units = this.GetSpecialValueFor("cdr_units");
            let direction = (target_loc - caster_loc as Vector).Normalized();
            let primary_direction = (target_loc - caster_loc as Vector).Normalized();
            let split_timer = (GFuncVector.CalculateDistance(caster_loc, target_loc) / speed);
            let velocity = direction * speed as Vector;
            let primary_velocity = primary_direction * speed as Vector;
            let projectile = {
                Ability: this,
                EffectName: "particles/units/heroes/hero_lina/lina_spell_dragon_slave.vpcf",
                vSpawnOrigin: caster_loc,
                fDistance: primary_distance,
                fStartRadius: width_initial,
                fEndRadius: width_end,
                Source: caster,
                bHasFrontalCone: true,
                bReplaceExisting: false,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                fExpireTime: GameRules.GetGameTime() + 10.0,
                bDeleteOnHit: false,
                vVelocity: Vector(velocity.x, velocity.y, 0),
                bProvidesVision: false,
                ExtraData: {
                    damage: primary_damage,
                    cdr_hero: cdr_hero,
                    cdr_units: cdr_units
                }
            }
            ProjectileManager.CreateLinearProjectile(projectile);
            if (secondary_amount == 0) {
                return;
            }
            caster.EmitSound("Hero_Lina.DragonSlave");
            this.AddTimer(split_timer - 0.1, () => {
                let res = "particles/units/heroes/hero_lina/lina_spell_dragon_slave_destruction.vpcf"
                let particle_fx = ResHelper.CreateParticleEx(res, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
                ParticleManager.SetParticleControl(particle_fx, 0, (target_loc + Vector(0, 0, 50)) as Vector);
                ParticleManager.SetParticleControl(particle_fx, 1, (target_loc + Vector(0, 0, 50)) as Vector);
                ParticleManager.SetParticleControl(particle_fx, 3, (target_loc + Vector(0, 0, 50)) as Vector);
                this.AddTimer(split_delay + 0.1, () => {
                    ParticleManager.DestroyParticle(particle_fx, false);
                    ParticleManager.ReleaseParticleIndex(particle_fx);
                    let particle_fx2 = ResHelper.CreateParticleEx("particles/econ/items/shadow_fiend/sf_fire_arcana/sf_fire_arcana_loadout.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
                    ParticleManager.SetParticleControl(particle_fx2, 0, target_loc);
                    this.AddTimer(1, () => {
                        ParticleManager.DestroyParticle(particle_fx2, false);
                        ParticleManager.ReleaseParticleIndex(particle_fx2);
                    });
                });
            });
            this.AddTimer((split_timer + split_delay), () => {
                EmitSoundOnLocationWithCaster(target_loc, "Hero_Lina.DragonSlave", caster);
                let start_angle;
                let interval_angle = 0;
                if (secondary_amount == 1) {
                    start_angle = 0;
                } else {
                    start_angle = spread_angle * (-1);
                    interval_angle = spread_angle * 2 / (secondary_amount - 1);
                }
                for (let i = 0; i < secondary_amount; i++) {
                    let angle = start_angle + (i - 1) * interval_angle;
                    velocity = GFuncVector.RotateVector2D(direction, angle, true) * speed as Vector;
                    let projectile = {
                        Ability: this,
                        EffectName: "particles/units/heroes/hero_lina/lina_spell_dragon_slave.vpcf",
                        vSpawnOrigin: target_loc,
                        fDistance: secondary_distance,
                        fStartRadius: secondary_width_initial,
                        fEndRadius: secondary_width_end,
                        Source: caster,
                        bHasFrontalCone: true,
                        bReplaceExisting: false,
                        iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                        iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                        iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                        fExpireTime: GameRules.GetGameTime() + 10.0,
                        bDeleteOnHit: false,
                        vVelocity: Vector(velocity.x, velocity.y, 0),
                        bProvidesVision: false,
                        ExtraData: {
                            damage: secondary_damage,
                            cdr_hero: cdr_hero,
                            cdr_units: cdr_units
                        }
                    }
                    ProjectileManager.CreateLinearProjectile(projectile);
                }
            });
            if (caster.HasTalent("special_bonus_imba_lina_2")) {
                let new_loc = target_loc + primary_direction * secondary_distance as Vector;
                let new_timer = (GFuncVector.CalculateDistance(caster_loc, new_loc) / speed);
                this.AddTimer((new_timer + split_delay), () => {
                    EmitSoundOnLocationWithCaster(new_loc, "Hero_Lina.DragonSlave", caster);
                    let projectile = {
                        Ability: this,
                        EffectName: "particles/units/heroes/hero_lina/lina_spell_dragon_slave.vpcf",
                        vSpawnOrigin: new_loc,
                        fDistance: primary_distance,
                        fStartRadius: width_initial,
                        fEndRadius: width_end,
                        Source: caster,
                        bHasFrontalCone: true,
                        bReplaceExisting: false,
                        iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                        iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                        iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                        fExpireTime: GameRules.GetGameTime() + 10.0,
                        bDeleteOnHit: false,
                        vVelocity: Vector(primary_velocity.x, primary_velocity.y, 0),
                        bProvidesVision: false,
                        ExtraData: {
                            damage: primary_damage,
                            cdr_hero: cdr_hero,
                            cdr_units: cdr_units
                        }
                    }
                    ProjectileManager.CreateLinearProjectile(projectile);
                });
            }
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        let caster = this.GetCasterPlus();
        if (target) {
            if (target && !target.IsRealUnit()) { return }
            let ability_laguna = this.GetCasterPlus().findAbliityPlus<imba_lina_laguna_blade>("imba_lina_laguna_blade");
            let pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_lina/lina_spell_dragon_slave_impact.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus());
            ParticleManager.SetParticleControl(pfx, 0, target.GetAbsOrigin());
            ParticleManager.SetParticleControl(pfx, 1, target.GetAbsOrigin());
            ApplyDamage({
                victim: target,
                attacker: this.GetCasterPlus(),
                ability: this,
                damage: ExtraData.damage,
                damage_type: this.GetAbilityDamageType()
            });
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_lina_5")) {
                let blaze_burn = target.findBuff<modifier_imba_fiery_soul_blaze_burn>("modifier_imba_fiery_soul_blaze_burn");
                if (blaze_burn) {
                    blaze_burn.ForceRefresh();
                } else {
                    let fiery_soul = this.GetCasterPlus().findAbliityPlus<imba_lina_fiery_soul>("imba_lina_fiery_soul");
                    if (fiery_soul.GetLevel() > 0) {
                        target.AddNewModifier(caster, fiery_soul, "modifier_imba_fiery_soul_blaze_burn", {
                            duration: caster.GetTalentValue("special_bonus_imba_lina_5", "duration") * (1 - target.GetStatusResistance())
                        });
                    }
                }
            }
            target.RemoveModifierByName("modifier_imba_blazing_fire");
            if (ability_laguna && !ability_laguna.IsCooldownReady()) {
                let cdr;
                if (target.IsRealUnit() && !target.IsIllusion()) {
                    cdr = ExtraData.cdr_hero;
                } else {
                    cdr = ExtraData.cdr_units;
                }
                let current_cooldown = ability_laguna.GetCooldownTimeRemaining();
                ability_laguna.EndCooldown();
                ability_laguna.StartCooldown(current_cooldown - cdr);
            }
        }
        return false;
    }
    IsStealable(): boolean {
        return true;
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_lina_10") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_lina_10")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_lina_10"), "modifier_special_bonus_imba_lina_10", {});
        }
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }
    AutoSpellSelf() {
        return AI_ability.POSITION_if_enemy(this)
    }

}
@registerAbility()
export class imba_lina_light_strike_array extends BaseAbility_Plus {
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target_loc = this.GetCursorPosition();
            let caster_loc = caster.GetAbsOrigin();
            let radius = this.GetSpecialValueFor("aoe_radius");
            let cast_delay = this.GetSpecialValueFor("cast_delay");
            let stun_duration = this.GetSpecialValueFor("stun_duration");
            let damage = this.GetSpecialValueFor("damage");
            let secondary_delay = this.GetSpecialValueFor("secondary_delay");
            let array_count = this.GetSpecialValueFor("array_count");
            let array_rings_count = this.GetSpecialValueFor("array_rings_count");
            let rings_radius = this.GetSpecialValueFor("rings_radius");
            let rings_delay = this.GetSpecialValueFor("rings_delay");
            let rings_distance = this.GetSpecialValueFor("rings_distance");
            let direction = (target_loc - caster_loc as Vector).Normalized();
            caster.EmitSound("Ability.PreLightStrikeArray");
            if ((math.random(1, 5) < 2) && (caster.GetUnitName().includes("lina"))) {
                caster.EmitSound("lina_lina_ability_lightstrike_0" + math.random(1, 6));
            }
            this.CreateStrike(target_loc, 0, cast_delay, radius, damage, stun_duration);
            if (caster.HasTalent("special_bonus_imba_lina_7")) {
                let nuclear_radius = radius;
                let nuclear_stun_duration = stun_duration;
                for (let k = 1; k <= caster.GetTalentValue("special_bonus_imba_lina_7") - 1; k++) {
                    nuclear_radius = nuclear_radius + caster.GetTalentValue("special_bonus_imba_lina_7", "add_radius") * k;
                    nuclear_stun_duration = nuclear_stun_duration * (1 / (caster.GetTalentValue("special_bonus_imba_lina_7", "stun_reduct") * k));
                    this.CreateStrike(target_loc, (cast_delay * k), cast_delay, nuclear_radius, damage, nuclear_stun_duration);
                }
            }
            for (let i = 0; i <= array_count - 1; i++) {
                let array_strike = i + 1;
                let rings_direction = direction;
                for (let j = 1; j <= array_rings_count; j++) {
                    rings_direction = GFuncVector.RotateVector2D(rings_direction, ((360 / array_rings_count)), true);
                    let ring_distance = rings_radius * (array_strike + 1);
                    let ring_delay = math.abs((radius * (i + cast_delay + rings_distance)) / (rings_radius * 2)) * cast_delay;
                    let ring_position = target_loc + ring_distance * rings_direction as Vector;
                    this.CreateStrike(ring_position, (cast_delay + ring_delay), (cast_delay + rings_delay), rings_radius, damage, stun_duration);
                }
            }
        }
    }
    CreateStrike(position: Vector, delay: number, cast_delay: number, radius: number, damage: number, stun_duration: number) {
        let caster = this.GetCasterPlus();
        this.AddTimer(delay, () => {
            let cast_pfx = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_lina/lina_spell_light_strike_array_ray_team.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, caster, caster.GetTeam());
            ParticleManager.SetParticleControl(cast_pfx, 0, position);
            ParticleManager.SetParticleControl(cast_pfx, 1, Vector(radius * 2, 0, 0));
            ParticleManager.ReleaseParticleIndex(cast_pfx);
        });
        this.AddTimer((delay + cast_delay), () => {
            let blast_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_lina/lina_spell_light_strike_array.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined, caster);
            ParticleManager.SetParticleControl(blast_pfx, 0, position);
            ParticleManager.SetParticleControl(blast_pfx, 1, Vector(radius, 0, 0));
            ParticleManager.ReleaseParticleIndex(blast_pfx);
            EmitSoundOnLocationWithCaster(position, "Ability.LightStrikeArray", caster);
            GridNav.DestroyTreesAroundPoint(position, radius, false);
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), position, undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                this.OnHit(enemy, damage, stun_duration);
            }
            if (caster.HasTalent("special_bonus_imba_lina_4")) {
                BaseModifier_Plus.CreateBuffThinker(caster, this, "modifier_imba_lsa_talent_magma", {
                    duration: stun_duration,
                    radius: radius
                }, position, caster.GetTeamNumber(), false);
            }
        });
    }
    OnHit(target: IBaseNpc_Plus, damage: number, stun_duration: number) {
        let caster = this.GetCasterPlus();
        ApplyDamage({
            attacker: caster,
            victim: target,
            ability: this,
            damage: damage,
            damage_type: this.GetAbilityDamageType()
        });
        if (caster.HasTalent("special_bonus_imba_lina_5")) {
            let blaze_burn = target.findBuff<modifier_imba_fiery_soul_blaze_burn>("modifier_imba_fiery_soul_blaze_burn");
            if (blaze_burn) {
                blaze_burn.ForceRefresh();
            } else {
                let fiery_soul = caster.findAbliityPlus<imba_lina_fiery_soul>("imba_lina_fiery_soul");
                if (fiery_soul.GetLevel() > 0) {
                    target.AddNewModifier(caster, fiery_soul, "modifier_imba_fiery_soul_blaze_burn", {
                        duration: caster.GetTalentValue("special_bonus_imba_lina_5", "duration") * (1 - target.GetStatusResistance())
                    });
                }
            }
        }
        target.RemoveModifierByName("modifier_imba_blazing_fire");
        if (target.IsAlive()) {
            target.AddNewModifier(caster, this, "modifier_generic_stunned", {
                duration: stun_duration * (1 - target.GetStatusResistance())
            });
        }
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("aoe_radius");
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }
    AutoSpellSelf() {
        return AI_ability.POSITION_most_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_lsa_talent_magma extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public radius: number;
    public damage: number;
    public tick_interval: number;
    public damage_per_tick: number;
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.radius = kv.radius;
            this.damage = this.caster.GetTalentValue("special_bonus_imba_lina_4", "damage");
            this.tick_interval = this.caster.GetTalentValue("special_bonus_imba_lina_4", "tick_interval");
            let particle_magma = ResHelper.CreateParticleEx("particles/hero/lina/from_the_ash.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined, this.caster);
            ParticleManager.SetParticleControl(particle_magma, 0, this.parent.GetAbsOrigin());
            ParticleManager.SetParticleControl(particle_magma, 1, this.parent.GetAbsOrigin());
            ParticleManager.SetParticleControl(particle_magma, 2, Vector(1, 0, 0));
            ParticleManager.SetParticleControl(particle_magma, 3, this.parent.GetAbsOrigin());
            this.AddParticle(particle_magma, false, false, -1, false, false);
            this.damage_per_tick = this.damage * this.tick_interval;
            this.StartIntervalThink(this.tick_interval);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let damage_table = ({
                    victim: enemy,
                    attacker: this.caster,
                    ability: this.ability,
                    damage: this.damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                });
                ApplyDamage(damage_table);
            }
        }
    }
}
@registerAbility()
export class imba_lina_light_strike_array_v2 extends BaseAbility_Plus {
    GetAOERadius(): number {
        return this.GetSpecialValueFor("light_strike_array_aoe");
    }
    OnSpellStart(): void {
        BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_imba_lina_light_strike_array_v2_thinker", {
            duration: this.GetSpecialValueFor("light_strike_array_delay_time")
        }, this.GetCursorPosition(), this.GetCasterPlus().GetTeamNumber(), false);
    }
}
@registerModifier()
export class modifier_imba_lina_light_strike_array_v2_thinker extends BaseModifier_Plus {
    public light_strike_array_aoe: any;
    public light_strike_array_delay_time: number;
    public light_strike_array_stun_duration: number;
    public light_strike_array_damage: number;
    public damage_type: number;
    BeCreated(p_0: any,): void {
        this.light_strike_array_aoe = this.GetSpecialValueFor("light_strike_array_aoe");
        this.light_strike_array_delay_time = this.GetSpecialValueFor("light_strike_array_delay_time");
        this.light_strike_array_stun_duration = this.GetSpecialValueFor("light_strike_array_stun_duration");
        if (!IsServer()) {
            return;
        }
        this.light_strike_array_damage = this.GetAbilityPlus().GetSpecialValueFor("light_strike_array_damage");
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        EmitSoundOnLocationForAllies(this.GetParentPlus().GetAbsOrigin(), "Ability.PreLightStrikeArray", this.GetCasterPlus());
        let ray_team_particle = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_lina/lina_spell_light_strike_array_ray_team.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus(), this.GetCasterPlus().GetTeamNumber());
        ParticleManager.SetParticleControl(ray_team_particle, 0, this.GetParentPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(ray_team_particle, 1, Vector(this.light_strike_array_aoe, 0, 0));
        ParticleManager.ReleaseParticleIndex(ray_team_particle);
        this.OnIntervalThink();
    }
    OnIntervalThink(): void {
        BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_lina_light_strike_array_v2_thinker_single", {
            duration: this.light_strike_array_delay_time,
            light_strike_array_aoe: this.light_strike_array_aoe,
            light_strike_array_stun_duration: this.light_strike_array_stun_duration,
            light_strike_array_damage: this.light_strike_array_damage,
            damage_type: this.damage_type
        }, this.GetParentPlus().GetAbsOrigin(), this.GetCasterPlus().GetTeamNumber(), false);
    }
}
@registerModifier()
export class modifier_imba_lina_light_strike_array_v2_thinker_single extends BaseModifier_Plus {
    public light_strike_array_aoe: any;
    public light_strike_array_stun_duration: number;
    public light_strike_array_damage: number;
    public damage_type: number;
    BeCreated(keys: any): void {
        if (!IsServer()) {
            return;
        }
        this.light_strike_array_aoe = keys.light_strike_array_aoe;
        this.light_strike_array_stun_duration = keys.light_strike_array_stun_duration;
        this.light_strike_array_damage = keys.light_strike_array_damage;
        this.damage_type = keys.damage_type;
        EmitSoundOnLocationForAllies(this.GetParentPlus().GetAbsOrigin(), "Ability.PreLightStrikeArray", this.GetCasterPlus());
        let ray_team_particle = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_lina/lina_spell_light_strike_array_ray_team.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus(), this.GetCasterPlus().GetTeamNumber());
        ParticleManager.SetParticleControl(ray_team_particle, 0, this.GetParentPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(ray_team_particle, 1, Vector(this.light_strike_array_aoe, 0, 0));
        ParticleManager.ReleaseParticleIndex(ray_team_particle);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        EmitSoundOnLocationWithCaster(this.GetParentPlus().GetAbsOrigin(), "Ability.LightStrikeArray", this.GetCasterPlus());
        let array_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_lina/lina_spell_light_strike_array.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
        ParticleManager.SetParticleControl(array_particle, 0, this.GetParentPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(array_particle, 1, Vector(this.light_strike_array_aoe, 1, 1));
        ParticleManager.ReleaseParticleIndex(array_particle);
        GridNav.DestroyTreesAroundPoint(this.GetParentPlus().GetAbsOrigin(), this.light_strike_array_aoe, false);
        for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.light_strike_array_aoe, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
            enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_generic_stunned", {
                duration: this.light_strike_array_stun_duration * (1 - enemy.GetStatusResistance())
            });
            ApplyDamage({
                victim: enemy,
                damage: this.light_strike_array_damage,
                damage_type: this.damage_type,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this.GetAbilityPlus()
            });
        }
    }
}
@registerAbility()
export class imba_lina_fiery_soul extends BaseAbility_Plus {
    IsStealable(): boolean {
        return false;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_fiery_soul";
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return this.GetSpecialValueFor("immolation_aoe") - this.GetCasterPlus().GetCastRangeBonus();
    }
    GetCooldown(p_0: number,): number {
        return this.GetSpecialValueFor("active_cooldown");
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let caster_loc = caster.GetAbsOrigin();
            this.AddTimer(FrameTime(), () => {
                let fiery_modifier = caster.findBuff<modifier_imba_fiery_soul_counter>("modifier_imba_fiery_soul_counter");
                if (fiery_modifier) {
                    fiery_modifier.Destroy();
                }
            });
            let immolation_damage_min = this.GetSpecialValueFor("immolation_damage_min");
            let immolation_damage_max = this.GetSpecialValueFor("immolation_damage_max");
            let immolation_aoe = this.GetSpecialValueFor("immolation_aoe");
            let min_damage_aoe = this.GetSpecialValueFor("min_damage_aoe");
            let max_damage_aoe = this.GetSpecialValueFor("max_damage_aoe");
            EmitSoundOnLocationWithCaster(caster_loc, "Hero_Phoenix.SuperNova.Explode", caster);
            let blast_pfx = ResHelper.CreateParticleEx("particles/hero/lina/lina_immolation.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined, caster);
            ParticleManager.SetParticleControl(blast_pfx, 0, caster_loc);
            ParticleManager.SetParticleControl(blast_pfx, 1, Vector(1.5, 1.5, 1.5));
            ParticleManager.SetParticleControl(blast_pfx, 3, caster_loc);
            ParticleManager.SetParticleControl(blast_pfx, 13, Vector(immolation_aoe, 0, 0));
            ParticleManager.SetParticleControl(blast_pfx, 15, caster_loc);
            ParticleManager.ReleaseParticleIndex(blast_pfx);
            GridNav.DestroyTreesAroundPoint(caster_loc, immolation_aoe, false);
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster_loc, undefined, immolation_aoe, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let distance = (caster_loc - enemy.GetAbsOrigin() as Vector).Length2D();
                let immolation_damage;
                if (distance >= min_damage_aoe) {
                    immolation_damage = immolation_damage_min;
                } else if (distance <= max_damage_aoe) {
                    immolation_damage = immolation_damage_max;
                } else {
                    immolation_damage = immolation_damage_min + math.floor((immolation_damage_max - immolation_damage_min) * ((min_damage_aoe - distance) / (min_damage_aoe - max_damage_aoe)));
                }
                enemy.RemoveModifierByName("modifier_imba_blazing_fire");
                ApplyDamage({
                    attacker: caster,
                    victim: enemy,
                    ability: this,
                    damage: immolation_damage,
                    damage_type: this.GetAbilityDamageType()
                });
                if (caster.HasTalent("special_bonus_imba_lina_5")) {
                    let blaze_burn = enemy.findBuff<modifier_imba_fiery_soul_blaze_burn>("modifier_imba_fiery_soul_blaze_burn");
                    if (blaze_burn) {
                        blaze_burn.ForceRefresh();
                    } else {
                        let fiery_soul = caster.findAbliityPlus<imba_lina_fiery_soul>("imba_lina_fiery_soul");
                        if (fiery_soul.GetLevel() > 0) {
                            enemy.AddNewModifier(caster, fiery_soul, "modifier_imba_fiery_soul_blaze_burn", {
                                duration: caster.GetTalentValue("special_bonus_imba_lina_5", "duration") * (1 - enemy.GetStatusResistance())
                            });
                        }
                    }
                }
            }
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_lina_9") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_lina_9")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_lina_9"), "modifier_special_bonus_imba_lina_9", {});
        }
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }
    // AutoSpellSelf() {
    //     return AI_ability.NO_TARGET_cast(this)
    // }
}
@registerModifier()
export class modifier_imba_fiery_soul extends BaseModifier_Plus {
    BeCreated(p_0: any,): void {
        this.GetAbilityPlus().GetBehavior = () => {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE;
        }
        this.GetAbilityPlus().GetBehavior();
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(params: ModifierAbilityEvent): void {
        if (IsServer()) {
            let item = params.ability.IsItem();
            if (item) {
                return;
            }
            let parent = this.GetParentPlus();
            let caster = params.ability.GetCaster();
            if ((caster == parent) && params.ability.GetAbilityName() != "ability_capture") {
                parent.AddNewModifier(parent, this.GetAbilityPlus(), "modifier_imba_fiery_soul_counter", {
                    duration: this.GetSpecialValueFor("duration")
                });
                for (let ability_id = 0; ability_id <= 15; ability_id++) {
                    let caster_ability = caster.GetAbilityByIndex(ability_id);
                    if (caster_ability) {
                        let ability_name = caster_ability.GetAbilityName();
                        if (params.ability.GetAbilityName() == ability_name) {
                        } else {
                            let fiery_counter = caster.findBuff<modifier_imba_fiery_soul_counter>("modifier_imba_fiery_soul_counter");
                            if (fiery_counter) {
                                let cooldown_remaining = caster_ability.GetCooldownTimeRemaining();
                                let cooldown_reduction = this.GetSpecialValueFor("cdr_pct");
                                caster_ability.EndCooldown();
                                if (cooldown_remaining > cooldown_reduction) {
                                    caster_ability.StartCooldown(cooldown_remaining - cooldown_reduction);
                                }
                            }
                        }
                    }
                }
            }
            return;
        }
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_fiery_soul_talent extends BaseModifier_Plus {
    IsPassive(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_fiery_soul_counter extends BaseModifier_Plus {
    public bonus_as: number;
    public bonus_ms_pct: number;
    public animation_pct: number;
    public particle: any;
    BeCreated(p_0: any,): void {
        this.bonus_as = this.GetAbilityPlus().GetSpecialValueFor("bonus_as");
        this.bonus_ms_pct = this.GetSpecialValueFor("bonus_ms_pct") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_lina_9", "value2");
        this.animation_pct = this.GetAbilityPlus().GetSpecialValueFor("animation_pct");
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            this.SetStackCount(1);
            this.particle = ResHelper.CreateParticleEx("particles/hero/lina/fiery_soul.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster, caster);
            ParticleManager.SetParticleControl(this.particle, 0, caster.GetAbsOrigin());
            ParticleManager.SetParticleControlEnt(this.particle, 1, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, undefined, caster.GetAbsOrigin(), true);
            ParticleManager.SetParticleControl(this.particle, 3, Vector(1, 0, 0));
            ParticleManager.SetParticleControl(this.particle, 4, Vector(1, 0, 0));
            caster.AddNewModifier(caster, this.GetAbilityPlus(), "modifier_imba_fiery_soul_talent", {});
        }
    }
    BeRefresh(p_0: any,): void {
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        let stacks = this.GetStackCount();
        let max_stacks = ability.GetSpecialValueFor("max_stacks");
        this.bonus_as = this.GetAbilityPlus().GetSpecialValueFor("bonus_as");
        this.bonus_ms_pct = this.GetSpecialValueFor("bonus_ms_pct") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_lina_9", "value2");
        this.animation_pct = this.GetAbilityPlus().GetSpecialValueFor("animation_pct");
        if (IsServer()) {
            if (stacks < max_stacks && !caster.PassivesDisabled()) {
                this.SetStackCount(stacks + 1);
                ParticleManager.SetParticleControl(this.particle, 3, Vector(stacks, 0, 0));
                ParticleManager.SetParticleControl(this.particle, 4, Vector(stacks, 0, 3));
            }
            caster.AddNewModifier(caster, ability, "modifier_imba_fiery_soul_talent", {});
        }
        if (stacks == max_stacks) {
            ability.GetBehavior = () => {
                return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE;
            }
            ability.GetBehavior();
            // ability.GetCooldown();
            if (IsClient()) {
                ability.GetBehavior();
            }
        } else if (stacks < max_stacks) {
            ability.GetBehavior = () => {
                return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE;
            }
            ability.GetBehavior();
            // ability.GetCooldown();
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            ParticleManager.DestroyParticle(this.particle, false);
            ParticleManager.ReleaseParticleIndex(this.particle);
        }
        this.GetAbilityPlus().GetBehavior = () => {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE;
        }
        this.GetAbilityPlus().GetBehavior();
        this.GetAbilityPlus().GetCooldown(this.GetAbilityPlus().GetLevel());
    }
    GetTexture(): string {
        return "lina_fiery_soul";
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.CASTTIME_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_as * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.bonus_ms_pct * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CASTTIME_PERCENTAGE)
    CC_GetModifierPercentageCasttime(p_0: ModifierAbilityEvent,): number {
        return this.animation_pct * this.GetStackCount();
    }
}
@registerModifier()
export class modifier_special_bonus_imba_lina_3 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let fiery_soul = this.GetParentPlus().findAbliityPlus<imba_lina_fiery_soul>("imba_lina_fiery_soul");
            if (fiery_soul.GetLevel() > 0) {
                let fiery_soul_modifier = this.GetParentPlus().findBuff<modifier_imba_fiery_soul_counter>("modifier_imba_fiery_soul_counter");
                if (fiery_soul_modifier) {
                    fiery_soul_modifier.DecrementStackCount();
                    fiery_soul_modifier.ForceRefresh();
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_fiery_soul_blaze_burn extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public tick: any;
    public particle_flame: any;
    public particle_flame_fx: any;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.ability = this.GetAbilityPlus();
        this.tick = this.caster.GetTalentValue("special_bonus_imba_lina_5", "tick");
        this.particle_flame = "particles/units/heroes/hero_clinkz/clinkz_searing_arrow_launch.vpcf";
        if (IsServer()) {
            this.particle_flame_fx = ResHelper.CreateParticleEx(this.particle_flame, ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.parent, this.caster);
            ParticleManager.SetParticleControlEnt(this.particle_flame_fx, 0, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
            this.AddParticle(this.particle_flame_fx, false, false, -1, false, false);
            this.parent.SetRenderColor(255, 86, 1);
            this.StartIntervalThink(this.tick);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let fiery_soul_counter = this.caster.findBuff<modifier_imba_fiery_soul_counter>("modifier_imba_fiery_soul_counter");
            if (fiery_soul_counter) {
                let damage = fiery_soul_counter.GetStackCount() * this.caster.GetTalentValue("special_bonus_imba_lina_5");
                ApplyDamage({
                    attacker: this.caster,
                    victim: this.parent,
                    ability: this.ability,
                    damage: damage,
                    damage_type: this.ability.GetAbilityDamageType()
                });
                this.parent.RemoveModifierByName("modifier_imba_blazing_fire");
            }
        }
    }
    BeRefresh(p_0: any,): void {
        if (IsServer()) {
            this.SetDuration(this.caster.GetTalentValue("special_bonus_imba_lina_5", "duration"), true);
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (this.parent.HasModifier("modifier_imba_lion_hex")) {
            } else {
                this.parent.SetRenderColor(255, 255, 255);
            }
        }
    }
}
@registerAbility()
export class imba_lina_laguna_blade extends BaseAbility_Plus {
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            let target_loc = target.GetAbsOrigin();
            let caster_loc = caster.GetAbsOrigin();
            let damage_type = this.GetAbilityDamageType();
            let damage = this.GetSpecialValueFor("damage");
            let effect_delay = this.GetSpecialValueFor("effect_delay");
            let bounce_amount = this.GetSpecialValueFor("bounce_amount");
            let bounce_range = this.GetSpecialValueFor("bounce_range");
            let bounce_delay = this.GetSpecialValueFor("bounce_delay");
            caster.EmitSound("Ability.LagunaBlade");
            let blade_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_lina/lina_spell_laguna_blade.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster, caster);
            ParticleManager.SetParticleControlEnt(blade_pfx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", caster_loc, true);
            ParticleManager.SetParticleControlEnt(blade_pfx, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target_loc, true);
            ParticleManager.ReleaseParticleIndex(blade_pfx);
            if (target.GetTeam() != caster.GetTeam()) {
                if (target.TriggerSpellAbsorb(this)) {
                    return undefined;
                }
            }
            this.AddTimer(effect_delay, () => {
                ApplyDamage({
                    victim: target,
                    attacker: caster,
                    ability: this,
                    damage: damage,
                    damage_type: damage_type
                });
                if (caster.HasTalent("special_bonus_imba_lina_5")) {
                    let blaze_burn = target.findBuff<modifier_imba_fiery_soul_blaze_burn>("modifier_imba_fiery_soul_blaze_burn");
                    if (blaze_burn) {
                        blaze_burn.ForceRefresh();
                    } else {
                        let fiery_soul = caster.findAbliityPlus<imba_lina_fiery_soul>("imba_lina_fiery_soul");
                        if (fiery_soul.GetLevel() > 0) {
                            target.AddNewModifier(caster, fiery_soul, "modifier_imba_fiery_soul_blaze_burn", {
                                duration: caster.GetTalentValue("special_bonus_imba_lina_5", "duration") * (1 - target.GetStatusResistance())
                            });
                        }
                    }
                }
                target.RemoveModifierByName("modifier_imba_blazing_fire");
                if (caster.HasTalent("special_bonus_imba_lina_6")) {
                    target.AddNewModifier(caster, this, "modifier_generic_stunned", {
                        duration: caster.GetTalentValue("special_bonus_imba_lina_6") * (1 - target.GetStatusResistance())
                    });
                }
                let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target_loc, undefined, bounce_range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (let [i, v] of GameFunc.iPair(enemies)) {
                    if (v == target) {
                        enemies.splice(i, 1);
                    }
                }
                this.AddTimer(bounce_delay, () => {
                    for (let i = 0; i < math.min(GameFunc.GetCount(enemies), bounce_amount) - 1; i++) {
                        let bounce_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_lina/lina_spell_laguna_blade.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster, caster);
                        ParticleManager.SetParticleControlEnt(bounce_pfx, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target_loc, true);
                        ParticleManager.SetParticleControlEnt(bounce_pfx, 1, enemies[i], ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemies[i].GetAbsOrigin(), true);
                        ParticleManager.ReleaseParticleIndex(bounce_pfx);
                        this.AddTimer(effect_delay, () => {
                            ApplyDamage({
                                victim: enemies[i],
                                attacker: caster,
                                ability: this,
                                damage: damage,
                                damage_type: damage_type
                            });
                            if (caster.HasTalent("special_bonus_imba_lina_5")) {
                                let blaze_burn = enemies[i].findBuff<modifier_imba_fiery_soul_blaze_burn>("modifier_imba_fiery_soul_blaze_burn");
                                if (blaze_burn) {
                                    blaze_burn.ForceRefresh();
                                } else {
                                    let fiery_soul = caster.findAbliityPlus<imba_lina_fiery_soul>("imba_lina_fiery_soul");
                                    if (fiery_soul.GetLevel() > 0) {
                                        enemies[i].AddNewModifier(caster, fiery_soul, "modifier_imba_fiery_soul_blaze_burn", {
                                            duration: caster.GetTalentValue("special_bonus_imba_lina_5", "duration") * (1 - enemies[i].GetStatusResistance())
                                        });
                                    }
                                }
                            }
                            enemies[i].RemoveModifierByName("modifier_imba_blazing_fire");
                            if (caster.HasTalent("special_bonus_imba_lina_6")) {
                                enemies[i].AddNewModifier(caster, this, "modifier_generic_stunned", {
                                    duration: caster.GetTalentValue("special_bonus_imba_lina_6") * (1 - enemies[i].GetStatusResistance())
                                });
                            }
                        });
                    }
                });
            });
        }
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (IsServer()) {
            if (target != undefined && target.IsMagicImmune() && (!this.GetCasterPlus().HasScepter())) {
                return UnitFilterResult.UF_FAIL_MAGIC_IMMUNE_ENEMY;
            }
            let nResult = UnitFilter(target, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber());
            return nResult;
        }
    }
    GetAbilityDamageType(): DAMAGE_TYPES {
        if (this.GetCasterPlus().HasScepter()) {
            return DAMAGE_TYPES.DAMAGE_TYPE_PURE;
        }
        return DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL;
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("bounce_range");
    }
    GetCooldown(nLevel: number): number {
        let cooldown = super.GetCooldown(nLevel);
        let caster = this.GetCasterPlus();
        return cooldown;
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetManaCost(level: number): number {
        return 800;
    }
    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this)
    }
}
@registerModifier()
export class modifier_special_bonus_imba_lina_6 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_lina_7 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_lina_9 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_lina_10 extends BaseModifier_Plus {
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
