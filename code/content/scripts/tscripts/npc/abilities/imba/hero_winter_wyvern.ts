
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_winter_wyvern_arctic_burn extends BaseAbility_Plus {
    GetCooldown(nLevel: number): number {
        let cooldown = super.GetCooldown(nLevel);
        if (this.GetCasterPlus().HasScepter()) {
            return 0;
        } else {
            return cooldown;
        }
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        let caster = this.GetCasterPlus();
        if (caster.HasScepter() == true) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE;
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this;
            this.ToggleOn(caster, ability);
        }
    }
    OnToggle(): void {
        if (IsServer()) {
            let toggle = this.GetToggleState();
            let caster = this.GetCasterPlus();
            let ability = this;
            if (toggle == true) {
                this.ToggleOn(caster, ability);
            } else {
                caster.RemoveModifierByName("modifier_winter_wyvern_arctic_burn_flight");
                caster.RemoveModifierByName("modifier_imba_winter_wyvern_arctic_burn");
            }
        }
    }
    ToggleOn(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus) {
        let duration = ability.GetSpecialValueFor("duration");
        caster.RemoveModifierByName("modifier_winter_wyvern_arctic_burn_flight");
        caster.RemoveModifierByName("modifier_imba_winter_wyvern_arctic_burn");
        if (caster.HasScepter() == true) {
            duration = -1;
        }
        caster.EmitSound("Hero_Winter_Wyvern.ArcticBurn.Cast");
        caster.AddNewModifier(caster, ability, "modifier_winter_wyvern_arctic_burn_flight", {
            duration: duration
        });
        let start_flight_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_winter_wyvern/wyvern_arctic_burn_start.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
        ParticleManager.SetParticleControl(start_flight_particle, 0, caster.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(start_flight_particle);
        let attack_range_bonus = ability.GetSpecialValueFor("attack_range_bonus");
        let arctic_burn_modifier = caster.AddNewModifier(caster, ability, "modifier_imba_winter_wyvern_arctic_burn", {
            duration: duration
        });
        arctic_burn_modifier.SetStackCount(attack_range_bonus);
    }
    OnInventoryContentsChanged(): void {
        let caster = this.GetCasterPlus();
        if (!caster.HasScepter()) {
            // todo
            if (caster.HasModifier("modifier_winter_wyvern_arctic_burn_flight") && caster.findBuff("modifier_winter_wyvern_arctic_burn_flight").GetDuration() == -1) {
                caster.RemoveModifierByName("modifier_winter_wyvern_arctic_burn_flight");
            }
            if (caster.HasModifier("modifier_imba_winter_wyvern_arctic_burn") && caster.findBuff<modifier_imba_winter_wyvern_arctic_burn>("modifier_imba_winter_wyvern_arctic_burn").GetDuration() == -1) {
                caster.RemoveModifierByName("modifier_imba_winter_wyvern_arctic_burn");
                this.ToggleAbility();
            }
        }
    }
}
@registerModifier()
export class modifier_imba_winter_wyvern_arctic_burn extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_SPEED_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_POINT_CONSTANT,
            5: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (keys.attacker == caster && !keys.target.IsBuilding()) {
                let damage_duration = this.GetSpecialValueFor("damage_duration");
                if ((!keys.target.HasModifier("modifier_imba_winter_wyvern_arctic_burn_damage") || caster.HasScepter() == true) && !keys.target.IsMagicImmune()) {
                    let ability = this.GetAbilityPlus();
                    keys.target.AddNewModifier(caster, ability, "modifier_imba_winter_wyvern_arctic_burn_damage", {
                        duration: damage_duration * (1 - keys.target.GetStatusResistance())
                    });
                    let slow = ability.GetSpecialValueFor("move_slow");
                    let slow_modifier = keys.target.AddNewModifier(caster, this.GetAbilityPlus(), "modifier_imba_winter_wyvern_arctic_burn_slow", {
                        duration: damage_duration * (1 - keys.target.GetStatusResistance())
                    });
                    slow_modifier.SetStackCount(slow * -1);
                    EmitSoundOn("Hero_Winter_Wyvern.ArcticBurn.projectileImpact", keys.target);
                    if (RandomInt(1, 100) > 80) {
                        caster.EmitSound("winter_wyvern_winwyv_articburn_0" + RandomInt(1, 4));
                    }
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        return this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_SPEED_BONUS)
    CC_GetModifierProjectileSpeedBonus(): number {
        return this.GetSpecialValueFor("bonus_projectile_speed");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetSpecialValueFor("bonus_movespeed");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_POINT_CONSTANT)
    CC_GetModifierAttackPointConstant(): number {
        return this.GetSpecialValueFor("attack_point");
    }
}
@registerModifier()
export class modifier_imba_winter_wyvern_arctic_burn_slow extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return -this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_winter_wyvern_arctic_burn_damage extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public health_dmg_conversion: any;
    public scepter_dmg_pct: number;
    public slow_hit_particle: any;
    IsHidden(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.ability = this.GetAbilityPlus();
            this.health_dmg_conversion = this.ability.GetSpecialValueFor("percent_damage") / 100;
            this.scepter_dmg_pct = this.ability.GetSpecialValueFor("scepter_dmg_pct") / 100;
            this.slow_hit_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_winter_wyvern/wyvern_arctic_burn_slow.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            ParticleManager.SetParticleControl(this.slow_hit_particle, 0, this.GetParentPlus().GetAbsOrigin());
            this.StartIntervalThink(1.0);
        }
    }
    OnIntervalThink(): void {
        let parent = this.GetParentPlus();
        let caster = this.GetCasterPlus();
        let current_health = parent.GetHealth();
        let damage = current_health * this.health_dmg_conversion;
        let damage_type = DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL;
        if (caster.HasTalent("special_bonus_imba_winter_wyvern_5")) {
            damage_type = DAMAGE_TYPES.DAMAGE_TYPE_PURE;
        }
        let damage_table = {} as ApplyDamageOptions;
        damage_table.attacker = caster;
        damage_table.ability = this.ability;
        damage_table.damage_type = damage_type;
        damage_table.damage = damage;
        damage_table.victim = parent;
        ApplyDamage(damage_table);
        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, parent, damage, undefined);
    }
    BeRemoved(): void {
        if (IsServer()) {
            ParticleManager.DestroyParticle(this.slow_hit_particle, false);
        }
    }
}
@registerAbility()
export class imba_winter_wyvern_splinter_blast extends BaseAbility_Plus {
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            let secondary_projectile_speed = this.GetSpecialValueFor("secondary_projectile_speed");
            let split_radius = this.GetSpecialValueFor("split_radius");
            let slow_duration = this.GetSpecialValueFor("duration");
            let slow = this.GetSpecialValueFor("bonus_movespeed");
            let attack_slow = this.GetSpecialValueFor("attack_slow");
            let hero_cdr = this.GetSpecialValueFor("hero_cdr");
            let cdr_units = this.GetSpecialValueFor("cdr_units");
            let splinter_threshold = this.GetSpecialValueFor("threshold");
            let splinter_dmg_efficiency = this.GetSpecialValueFor("splinter_dmg_efficiency");
            let splinter_aoe_efficiency = this.GetSpecialValueFor("splinter_aoe_efficiency");
            let damage = this.GetAbilityDamage();
            let speed = this.GetSpecialValueFor("projectile_speed");
            caster.EmitSound("Hero_Winter_Wyvern.SplinterBlast.Cast");
            this.CreateTrackingProjectile({
                target: target,
                caster: caster,
                ability: this,
                iMoveSpeed: speed,
                iSourceAttachment: this.GetCasterPlus().ScriptLookupAttachment("attach_attack1"),
                EffectName: "particles/units/heroes/hero_winter_wyvern/wyvern_splinter.vpcf",
                secondary_projectile_speed: secondary_projectile_speed,
                split_radius: split_radius,
                slow_duration: slow_duration,
                slow: slow,
                attack_slow: attack_slow,
                hero_cdr: hero_cdr,
                cdr_units: cdr_units,
                splinter_threshold: splinter_threshold,
                splinter_dmg_efficiency: splinter_dmg_efficiency,
                splinter_aoe_efficiency: splinter_aoe_efficiency,
                damage: damage,
                splinter_proc: 0
            });
        }
    }
    CreateTrackingProjectile(keys: any) {
        let target = keys.target;
        let caster = keys.caster;
        let speed = keys.iMoveSpeed;
        keys.creation_time = GameRules.GetGameTime();
        let projectile = caster.GetAttachmentOrigin(keys.iSourceAttachment);
        let particle = ResHelper.CreateParticleEx(keys.EffectName, ParticleAttachment_t.PATTACH_POINT, caster);
        caster.EmitSound("Hero_Winter_Wyvern.SplinterBlast.Projectile");
        let arctic_flight_offset = Vector(0, 0, 0);
        if (caster.HasModifier("modifier_winter_wyvern_arctic_burn_flight")) {
            arctic_flight_offset = Vector(0, 0, 150);
        }
        ParticleManager.SetParticleControl(particle, 0, caster.GetAttachmentOrigin(keys.iSourceAttachment) + arctic_flight_offset);
        ParticleManager.SetParticleControlEnt(particle, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(particle, 2, Vector(speed, 0, 0));
        this.AddTimer(0, () => {
            let target_location = target.GetAbsOrigin();
            projectile = projectile + (target_location - projectile as Vector).Normalized() * speed * FrameTime();
            if ((target_location - projectile as Vector).Length2D() < speed * FrameTime()) {
                this.OnTrackingProjectileHit(keys);
                caster.StopSound("Hero_Winter_Wyvern.SplinterBlast.Projectile");
                ParticleManager.DestroyParticle(particle, false);
                ParticleManager.ReleaseParticleIndex(particle);
                return undefined;
            } else {
                speed = speed + 25;
                ParticleManager.SetParticleControl(particle, 2, Vector(speed, 0, 0));
                return 0;
            }
        });
    }
    OnTrackingProjectileHit(keys: any) {
        let nearby_enemy_units = FindUnitsInRadius(keys.caster.GetTeam(), keys.target.GetAbsOrigin(), undefined, keys.split_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        keys.caster.EmitSound("Hero_Winter_Wyvern.SplinterBlast.Target");
        for (const [_, enemy] of GameFunc.iPair(nearby_enemy_units)) {
            if (enemy != keys.target && enemy.IsAlive()) {
                let extra_data = {
                    damage: keys.damage,
                    slow_duration: keys.slow_duration,
                    slow: keys.slow,
                    attack_slow: keys.attack_slow,
                    hero_cdr: keys.hero_cdr,
                    cdr_units: keys.cdr_units,
                    split_radius: keys.split_radius,
                    splinter_threshold: keys.splinter_threshold,
                    secondary_projectile_speed: keys.secondary_projectile_speed,
                    splinter_dmg_efficiency: keys.splinter_dmg_efficiency,
                    splinter_aoe_efficiency: keys.splinter_aoe_efficiency,
                    splinter_proc: keys.splinter_proc
                }
                let projectile = {
                    Target: enemy,
                    Source: keys.target,
                    Ability: keys.ability,
                    EffectName: "particles/units/heroes/hero_winter_wyvern/wyvern_splinter_blast.vpcf",
                    iMoveSpeed: keys.secondary_projectile_speed,
                    vSourceLoc: keys.target.GetAbsOrigin(),
                    bDrawsOnMinimap: false,
                    bDodgeable: true,
                    bIsAttack: false,
                    bVisibleToEnemies: true,
                    bReplaceExisting: false,
                    flExpireTime: GameRules.GetGameTime() + 10,
                    bProvidesVision: true,
                    iVisionRadius: 400,
                    iVisionTeamNumber: keys.caster.GetTeamNumber(),
                    ExtraData: extra_data
                }
                ProjectileManager.CreateTrackingProjectile(projectile);
            }
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        if (target && target.IsAlive()) {
            let caster = this.GetCasterPlus();
            if (ExtraData.splinter_proc == 0) {
                let splinter_proj = {
                    caster: caster,
                    target: target,
                    ability: this,
                    damage: ExtraData.damage * (ExtraData.splinter_dmg_efficiency / 100),
                    slow_duration: ExtraData.slow_duration,
                    slow: ExtraData.slow,
                    attack_slow: ExtraData.attack_slow,
                    hero_cdr: ExtraData.hero_cdr,
                    cdr_units: ExtraData.cdr_units,
                    split_radius: ExtraData.split_radius * (ExtraData.splinter_aoe_efficiency / 100),
                    splinter_threshold: ExtraData.splinter_threshold,
                    secondary_projectile_speed: ExtraData.secondary_projectile_speed,
                    splinter_dmg_efficiency: ExtraData.splinter_dmg_efficiency,
                    splinter_aoe_efficiency: ExtraData.splinter_aoe_efficiency,
                    splinter_proc: ExtraData.splinter_proc + 1
                }
                this.OnTrackingProjectileHit(splinter_proj);
            }
            target.AddNewModifier(caster, this, "modifier_imba_winter_wyvern_splinter_blast_slow", {
                duration: ExtraData.slow_duration * (1 - target.GetStatusResistance()),
                slow: ExtraData.slow,
                attack_slow: ExtraData.attack_slow
            });
            if (caster.HasTalent("special_bonus_imba_unique_winter_wyvern_4")) {
                let stun_duration = caster.GetTalentValue("special_bonus_imba_unique_winter_wyvern_4", "value");
                target.AddNewModifier(caster, this, "modifier_stunned", {
                    duration: stun_duration * (1 - target.GetStatusResistance())
                });
            }
            caster.EmitSound("Hero_Winter_Wyvern.SplinterBlast.Splinter");
            let damage_table = {} as ApplyDamageOptions
            damage_table.attacker = caster;
            damage_table.ability = this;
            damage_table.damage_type = this.GetAbilityDamageType();
            damage_table.damage = ExtraData.damage;
            damage_table.victim = target;
            ApplyDamage(damage_table);
        }
    }
}
@registerModifier()
export class modifier_imba_winter_wyvern_splinter_blast_slow extends BaseModifier_Plus {
    public slow: any;
    public attack_slow: any;
    public slow_hit_particle: any;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.slow = keys.slow;
            this.attack_slow = keys.attack_slow;
            this.slow_hit_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_winter_wyvern/wyvern_splinter_blast_slow.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            ParticleManager.SetParticleControl(this.slow_hit_particle, 0, this.GetParentPlus().GetAbsOrigin());
        }
    }
    BeRemoved(): void {
        if (IsServer()) {
            ParticleManager.DestroyParticle(this.slow_hit_particle, false);
            ParticleManager.ReleaseParticleIndex(this.slow_hit_particle);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetSpecialValueFor("bonus_movespeed");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.GetSpecialValueFor("attack_slow");
    }
}
@registerAbility()
export class imba_winter_wyvern_cold_embrace extends BaseAbility_Plus {
    GetCooldown(nLevel: number): number {
        return super.GetCooldown(nLevel) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_winter_wyvern_6", "cooldown_reduction");
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            let duration = this.GetSpecialValueFor("duration");
            let damage_treshold_pct_hp = this.GetSpecialValueFor("damage_treshold_pct_hp");
            let freeze_duration = this.GetSpecialValueFor("freeze_duration");
            if (target != undefined) {
                caster.EmitSound("Hero_Winter_Wyvern.ColdEmbrace.Cast");
                if (RandomInt(1, 100) > 80) {
                    caster.EmitSound("winter_wyvern_winwyv_coldembrace_0" + RandomInt(1, 5));
                }
                if (caster.HasTalent("special_bonus_imba_winter_wyvern_4")) {
                    let magic_resistance = caster.GetTalentValue("special_bonus_imba_winter_wyvern_4", "magic_resitance");
                    let cold_embrace_modifier = caster.AddNewModifier(caster, this, "modifier_imba_winter_wyvern_cold_embrace_resistance", {
                        duration: duration
                    });
                    cold_embrace_modifier.SetStackCount(magic_resistance);
                }
                let cold_embrace_start_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_winter_wyvern/wyvern_cold_embrace_start.vpcf", ParticleAttachment_t.PATTACH_POINT, caster);
                ParticleManager.SetParticleControl(cold_embrace_start_particle, 0, caster.GetAbsOrigin());
                ParticleManager.SetParticleControl(cold_embrace_start_particle, 1, caster.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(cold_embrace_start_particle);
                target.AddNewModifier(caster, this, "modifier_winter_wyvern_cold_embrace", {
                    duration: duration
                });
                target.AddNewModifier(caster, this, "modifier_imba_winter_wyvern_cold_embrace", {
                    duration: duration,
                    damage_treshold_pct_hp: damage_treshold_pct_hp,
                    freeze_duration: freeze_duration
                });
            }
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_winter_wyvern_6") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_winter_wyvern_6")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_special_bonus_imba_winter_wyvern_6", {});
        }
    }
}
@registerModifier()
export class modifier_imba_winter_wyvern_cold_embrace extends BaseModifier_Plus {
    public damage_taken: number;
    public activated: any;
    public triggered: any;
    public freeze_duration: number;
    public damage_treshold: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            if (keys.target == parent && !keys.attacker.IsTower()) {
                this.damage_taken = this.damage_taken + keys.damage;
                if (this.damage_taken >= this.damage_treshold && !this.activated) {
                    if (!keys.attacker.IsMagicImmune()) {
                        keys.attacker.AddNewModifier(parent, undefined, "modifier_imba_winter_wyvern_cold_embrace_freeze", {
                            duration: this.freeze_duration * (1 - keys.attacker.GetStatusResistance())
                        });
                    }
                    parent.Heal(this.damage_treshold, this.GetAbilityPlus());
                    let curse_blast = ResHelper.CreateParticleEx("particles/units/heroes/hero_winter_wyvern/wyvern_winters_curse_blast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, parent);
                    ParticleManager.SetParticleControl(curse_blast, 2, Vector(1, 1, 1000));
                    ParticleManager.ReleaseParticleIndex(curse_blast);
                    if (this.GetCasterPlus().HasAbility("imba_winter_wyvern_splinter_blast")) {
                        let splinter_blast = this.GetCasterPlus().findAbliityPlus<imba_winter_wyvern_splinter_blast>("imba_winter_wyvern_splinter_blast");
                        if (splinter_blast.IsTrained()) {
                            splinter_blast.CreateTrackingProjectile({
                                target: this.GetCasterPlus(),
                                caster: this.GetCasterPlus(),
                                ability: splinter_blast,
                                iMoveSpeed: splinter_blast.GetSpecialValueFor("projectile_speed"),
                                iSourceAttachment: this.GetCasterPlus().ScriptLookupAttachment("attach_attack1"),
                                EffectName: "particles/units/heroes/hero_winter_wyvern/wyvern_splinter.vpcf",
                                secondary_projectile_speed: splinter_blast.GetSpecialValueFor("secondary_projectile_speed"),
                                split_radius: splinter_blast.GetSpecialValueFor("split_radius"),
                                slow_duration: splinter_blast.GetSpecialValueFor("duration"),
                                slow: splinter_blast.GetSpecialValueFor("bonus_movespeed"),
                                attack_slow: splinter_blast.GetSpecialValueFor("attack_slow"),
                                hero_cdr: splinter_blast.GetSpecialValueFor("hero_cdr"),
                                cdr_units: splinter_blast.GetSpecialValueFor("cdr_units"),
                                splinter_threshold: splinter_blast.GetSpecialValueFor("threshold"),
                                splinter_dmg_efficiency: splinter_blast.GetSpecialValueFor("splinter_dmg_efficiency"),
                                splinter_aoe_efficiency: splinter_blast.GetSpecialValueFor("splinter_aoe_efficiency"),
                                damage: splinter_blast.GetAbilityDamage() + this.damage_taken,
                                splinter_proc: 1
                            });
                        }
                    }
                    this.damage_taken = 0;
                    this.activated = true;
                }
            }
        }
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.triggered = false;
            this.damage_taken = 0;
            this.freeze_duration = keys.freeze_duration;
            this.damage_treshold = (this.GetCasterPlus().GetMaxHealth() / 100) * keys.damage_treshold_pct_hp;
        }
    }
    OnRefreshed(keys: any) {
        if (IsServer()) {
            this.triggered = false;
            this.damage_taken = 0;
            this.freeze_duration = keys.freeze_duration;
            this.damage_treshold = (this.GetCasterPlus().GetMaxHealth() / 100) * keys.damage_treshold_pct_hp;
        }
    }
}
@registerModifier()
export class modifier_imba_winter_wyvern_cold_embrace_resistance extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_winter_wyvern_cold_embrace_freeze extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_FROZEN]: true,
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
    }
    BeCreated(p_0: any,): void {
        EmitSoundOn("Hero_Ancient_Apparition.ColdFeetCast", this.GetParentPlus());
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_ancient_apparition/ancient_apparition_cold_feet_frozen.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerAbility()
export class imba_winter_wyvern_winters_curse extends BaseAbility_Plus {
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            let ability = this;
            let duration = this.GetSpecialValueFor("duration");
            if (target.TriggerSpellAbsorb(ability)) {
                return;
            }
            if (caster.HasTalent("special_bonus_imba_winter_wyvern_7")) {
                let bonus_duration = caster.GetTalentValue("special_bonus_imba_winter_wyvern_7", "duration");
                duration = duration + bonus_duration;
                target.AddNewModifier(caster, ability, "modifier_imba_winter_wyvern_winters_curse", {
                    duration: duration
                });
            }
            caster.EmitSound("Hero_Winter_Wyvern.WintersCurse.Cast");
            target.EmitSound("Hero_Winter_Wyvern.WintersCurse.Target");
            if (RandomInt(1, 100) > 80) {
                let random_sound = RandomInt(1, 14);
                if (random_sound < 10) {
                    caster.EmitSound("winter_wyvern_winwyv_winterscurse_0" + random_sound);
                } else {
                    caster.EmitSound("winter_wyvern_winwyv_winterscurse_" + random_sound);
                }
            }
            caster.AddNewModifier(caster, ability, "winter_wyvern_winters_curse_kill_credit", {});
            target.AddNewModifier(caster, ability, "modifier_winter_wyvern_winters_curse_aura", {
                duration: duration
            }).SetDuration(duration, true);
        }
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
}
@registerModifier()
export class modifier_imba_winter_wyvern_winters_curse extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_PASSIVES_DISABLED]: true
        }
        return state;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_winter_wyvern_4 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_winter_wyvern_5 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_winter_wyvern_6 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_winter_wyvern_7 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
}
