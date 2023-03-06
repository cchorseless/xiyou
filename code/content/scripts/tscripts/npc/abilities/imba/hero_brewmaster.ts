
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_brewmaster_thunder_clap extends BaseAbility_Plus {
    public responses: { [k: string]: string };
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return this.GetSpecialValueFor("radius") - this.GetCasterPlus().GetCastRangeBonus();
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_Brewmaster.ThunderClap");
        let clap_particle = ResHelper.CreateParticleEx("particles/econ/items/brewmaster/brewmaster_offhand_elixir/brewmaster_thunder_clap_elixir.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControl(clap_particle, 1, Vector(this.GetSpecialValueFor("radius"), this.GetSpecialValueFor("radius"), this.GetSpecialValueFor("radius")));
        ParticleManager.ReleaseParticleIndex(clap_particle);
        let slow_duration = undefined;
        let debris_targets = 0;
        for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("radius") + this.GetSpecialValueFor("debris_buffer_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
            if (GFuncVector.AsVector((enemy.GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin()) * Vector(1, 1, 0)).Length2D() <= this.GetSpecialValueFor("radius")) {
                enemy.EmitSound("Hero_Brewmaster.ThunderClap.Target");
                if (this.GetCasterPlus().GetName().includes("brewmaster") && RollPercentage(75)) {
                    if (!this.responses) {
                        this.responses = {
                            "1": "brewmaster_brew_ability_thunderclap_01",
                            "2": "brewmaster_brew_ability_thunderclap_02",
                            "3": "brewmaster_brew_ability_thunderclap_03",
                            "4": "brewmaster_brew_ability_primalsplit_02",
                            "5": "brewmaster_brew_ability_primalsplit_03"
                        }
                    }
                    this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(this.responses));
                }
                if (enemy.IsRealUnit()) {
                    slow_duration = this.GetTalentSpecialValueFor("duration");
                } else {
                    slow_duration = this.GetTalentSpecialValueFor("duration_creeps");
                }
                enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_brewmaster_thunder_clap", {
                    duration: slow_duration * (1 - enemy.GetStatusResistance())
                });
                ApplyDamage({
                    victim: enemy,
                    damage: this.GetSpecialValueFor("damage"),
                    damage_type: this.GetAbilityDamageType(),
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this
                });
            } else if (debris_targets <= this.GetSpecialValueFor("debris_max_targets")) {
                debris_targets = debris_targets + 1;
                let v = this.GetCasterPlus().GetAbsOrigin() + GFuncVector.AsVector(enemy.GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin()).Normalized() * this.GetSpecialValueFor("radius") as Vector
                ProjectileManager.CreateTrackingProjectile({
                    EffectName: "particles/units/heroes/hero_brewmaster/brewmaster_hurl_boulder.vpcf",
                    Ability: this,
                    Source: this.GetCasterPlus(),
                    vSourceLoc: GetGroundPosition(v, undefined),
                    Target: enemy,
                    iMoveSpeed: this.GetSpecialValueFor("debris_projectile_speed"),
                    flExpireTime: GameRules.GetGameTime() + this.GetSpecialValueFor("debris_expiry_time"),
                    bDodgeable: true,
                    bIsAttack: false,
                    bReplaceExisting: false,
                    iSourceAttachment: undefined,
                    bDrawsOnMinimap: undefined,
                    bVisibleToEnemies: true,
                    bProvidesVision: false,
                    iVisionRadius: undefined,
                    iVisionTeamNumber: undefined,
                    ExtraData: {}
                });
            }
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        if (target && !target.IsMagicImmune()) {
            target.EmitSound("Brewmaster_Earth.Boulder.Target");
            target.AddNewModifier(this.GetCasterPlus(), this, "modifier_stunned", {
                duration: this.GetSpecialValueFor("debris_stun_duration") * (1 - target.GetStatusResistance())
            });
            ApplyDamage({
                victim: target,
                damage: this.GetSpecialValueFor("debris_damage"),
                damage_type: this.GetAbilityDamageType(),
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this
            });
        }
    }
}
@registerModifier()
export class modifier_imba_brewmaster_thunder_clap extends BaseModifier_Plus {
    public movement_slow: any;
    public attack_speed_slow: number;
    public conduction_chance: number;
    public conduction_max_targets: any;
    public conduction_damage: number;
    public conduction_distance: number;
    public conduction_interval: number;
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_brewmaster_thunder_clap.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.movement_slow = this.GetSpecialValueFor("movement_slow") * (-1);
        this.attack_speed_slow = this.GetSpecialValueFor("attack_speed_slow") * (-1);
        this.conduction_chance = this.GetSpecialValueFor("conduction_chance");
        this.conduction_max_targets = this.GetSpecialValueFor("conduction_max_targets");
        this.conduction_damage = this.GetSpecialValueFor("conduction_damage");
        this.conduction_distance = this.GetSpecialValueFor("conduction_distance");
        this.conduction_interval = this.GetSpecialValueFor("conduction_interval");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            3: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.movement_slow;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.attack_speed_slow;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && !keys.target.IsMagicImmune() && GFuncRandom.PRD(this.conduction_chance, this)) {
            CreateModifierThinker(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_brewmaster_thunder_clap_conductive_thinker", {
                starting_unit_entindex: this.GetParentPlus().entindex(),
                conduction_max_targets: this.conduction_max_targets,
                conduction_damage: this.conduction_damage,
                conduction_distance: this.conduction_distance,
                conduction_interval: this.conduction_interval
            }, keys.attacker.GetAbsOrigin(), this.GetCasterPlus().GetTeamNumber(), false);
        }
    }
}
@registerModifier()
export class modifier_imba_brewmaster_thunder_clap_conductive_thinker extends BaseModifier_Plus {
    public starting_unit_entindex: any;
    public conduction_max_targets: any;
    public conduction_damage: number;
    public conduction_distance: number;
    public conduction_interval: number;
    public units_affected: IBaseNpc_Plus[];
    public unit_counter: number;
    public current_unit: any;
    public zapped: any;
    public zap_particle: any;
    BeCreated(keys: any): void {
        if (!IsServer()) {
            return;
        }
        this.starting_unit_entindex = keys.starting_unit_entindex;
        this.conduction_max_targets = keys.conduction_max_targets;
        this.conduction_damage = keys.conduction_damage;
        this.conduction_distance = keys.conduction_distance;
        this.conduction_interval = keys.conduction_interval;
        this.units_affected = []
        this.unit_counter = 0;
        if (EntIndexToHScript(this.starting_unit_entindex)) {
            this.current_unit = EntIndexToHScript(this.starting_unit_entindex);
            this.units_affected.push(this.current_unit);
        } else {
            this.Destroy();
            return;
        }
        this.OnIntervalThink();
        this.StartIntervalThink(this.conduction_interval);
    }
    OnIntervalThink(): void {
        this.zapped = false;
        let npcs = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.current_unit.GetAbsOrigin(), undefined, this.conduction_distance, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
        for (const [_, enemy] of GameFunc.iPair(npcs)) {
            if (!this.units_affected.includes(enemy)) {
                enemy.EmitSound("Item.Maelstrom.Chain_Lightning.Jump");
                this.zap_particle = ResHelper.CreateParticleEx("particles/econ/events/ti6/maelstorm_ti6.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.current_unit);
                ParticleManager.SetParticleControlEnt(this.zap_particle, 0, this.current_unit, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.current_unit.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(this.zap_particle, 1, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
                ParticleManager.SetParticleControl(this.zap_particle, 2, Vector(10, 10, 10));
                ParticleManager.ReleaseParticleIndex(this.zap_particle);
                this.unit_counter = this.unit_counter + 1;
                this.current_unit = enemy;
                this.units_affected.push(this.current_unit);
                this.zapped = true;
                ApplyDamage({
                    victim: enemy,
                    damage: this.conduction_damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this.GetAbilityPlus()
                });
                return;
            }
        }
        if (this.unit_counter >= this.conduction_max_targets || !this.zapped) {
            this.StartIntervalThink(-1);
            this.Destroy();
        }
    }
}
@registerAbility()
export class imba_brewmaster_cinder_brew extends BaseAbility_Plus {
    public responses: { [k: string]: string };
    public projectiles: any;
    public brew_modifier: any;
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_Brewmaster.CinderBrew.Cast");
        let brew_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_brewmaster/brewmaster_cinder_brew_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControl(brew_particle, 1, this.GetCursorPosition());
        ParticleManager.ReleaseParticleIndex(brew_particle);
        if (this.GetCasterPlus().GetName().includes("brewmaster")) {
            if (!this.responses) {
                this.responses = {
                    "1": "brewmaster_brew_ability_drukenhaze_01",
                    "2": "brewmaster_brew_ability_drukenhaze_02",
                    "3": "brewmaster_brew_ability_drukenhaze_03",
                    "4": "brewmaster_brew_ability_drukenhaze_04",
                    "5": "brewmaster_brew_ability_drukenhaze_05",
                    "6": "brewmaster_brew_ability_drukenhaze_08"
                }
            }
            this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(this.responses));
        }
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
        }
        if (!this.projectiles) {
            this.projectiles = {}
        }
        let brew_projectile = ProjectileManager.CreateLinearProjectile({
            EffectName: "",
            Ability: this,
            Source: this.GetCasterPlus(),
            vSpawnOrigin: this.GetCasterPlus().GetAbsOrigin(),
            vVelocity: ((this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin()) * Vector(1, 1, 0) as Vector).Normalized() * 1600 as Vector,
            vAcceleration: undefined,
            fMaxSpeed: undefined,
            fDistance: (this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin() as Vector).Length2D(),
            fStartRadius: this.GetSpecialValueFor("radius"),
            fEndRadius: this.GetSpecialValueFor("radius"),
            fExpireTime: undefined,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            bIgnoreSource: true,
            bHasFrontalCone: false,
            bDrawsOnMinimap: false,
            bVisibleToEnemies: true,
            bProvidesVision: false,
            iVisionRadius: undefined,
            iVisionTeamNumber: undefined,
            ExtraData: {}
        });
        this.projectiles[brew_projectile] = {}
        this.projectiles[brew_projectile]["destination"] = this.GetCursorPosition();
    }
    OnProjectileThinkHandle(projectileHandle: ProjectileID): void {
        for (const [_, unit] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), ProjectileManager.GetLinearProjectileLocation(projectileHandle), undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
            if (this.projectiles[projectileHandle]["destination"] && ((this.projectiles[projectileHandle]["destination"] - ProjectileManager.GetLinearProjectileLocation(projectileHandle)) * Vector(1, 1, 0) as Vector).Length2D() <= this.GetSpecialValueFor("radius") && ((unit.GetAbsOrigin() - ProjectileManager.GetLinearProjectileLocation(projectileHandle)) * Vector(1, 1, 0) as Vector).Length2D() <= this.GetSpecialValueFor("radius") && !this.projectiles[projectileHandle][unit.entindex()]) {
                this.projectiles[projectileHandle][unit.entindex()] = true;
                if (unit.IsRealUnit()) {
                    unit.EmitSound("Hero_Brewmaster.CinderBrew.Target");
                } else {
                    unit.EmitSound("Hero_Brewmaster.CinderBrew.Target.Creep");
                }
                if (unit.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
                    unit.Purge(true, false, false, false, false);
                    unit.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_brewmaster_cinder_brew", {
                        duration: this.GetSpecialValueFor("duration") * (1 - unit.GetStatusResistance())
                    });
                } else if (this.GetCasterPlus().HasScepter()) {
                    let splash_particle = ResHelper.CreateParticleEx("particles/econ/events/ti9/blink_dagger_ti9_start_lvl2_splash.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, unit);
                    ParticleManager.ReleaseParticleIndex(splash_particle);
                    unit.Purge(false, true, false, true, true);
                }
            }
        }
    }
    OnProjectileHitHandle(target: IBaseNpc_Plus, location: Vector, projectileHandle: ProjectileID) {
        if (!target && location) {
            EmitSoundOnLocationWithCaster(location, "Hero_Brewmaster.CinderBrew", this.GetCasterPlus());
            for (const [_, unit] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), location, undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
                if (!this.projectiles[projectileHandle][unit.entindex()]) {
                    this.projectiles[projectileHandle][unit.entindex()] = true;
                    if (unit.IsRealUnit()) {
                        unit.EmitSound("Hero_Brewmaster.CinderBrew.Target");
                    } else {
                        unit.EmitSound("Hero_Brewmaster.CinderBrew.Target.Creep");
                    }
                    if (unit.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
                        unit.Purge(true, false, false, false, false);
                        unit.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_brewmaster_cinder_brew", {
                            duration: this.GetSpecialValueFor("duration") * (1 - unit.GetStatusResistance())
                        });
                    } else if (this.GetCasterPlus().HasScepter()) {
                        let splash_particle = ResHelper.CreateParticleEx("particles/econ/events/ti9/blink_dagger_ti9_start_lvl2_splash.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, unit);
                        ParticleManager.ReleaseParticleIndex(splash_particle);
                        unit.Purge(false, true, false, true, true);
                    }
                }
            }
            this.projectiles[projectileHandle] = undefined;
            this.brew_modifier = undefined;
        }
    }
}
@registerModifier()
export class modifier_imba_brewmaster_cinder_brew extends BaseModifier_Plus {
    public total_damage: number;
    public movement_slow: any;
    public extra_duration: number;
    public remnants_self_damage_chance: number;
    public damage_type: number;
    public bIgnited: any;
    public damage_per_instance: number;
    public tick_interval: number;
    public self_attack_particle: any;
    public self_damage: number;
    GetEffectName(): string {
        return "particles/units/heroes/hero_brewmaster/brewmaster_cinder_brew_debuff.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_brewmaster_cinder_brew.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_NORMAL;
    }
    BeCreated(p_0: any,): void {
        this.total_damage = this.GetSpecialValueFor("total_damage");
        this.movement_slow = this.GetSpecialValueFor("movement_slow") * (-1);
        this.extra_duration = this.GetSpecialValueFor("extra_duration");
        this.remnants_self_damage_chance = this.GetSpecialValueFor("remnants_self_damage_chance");
        if (!IsServer()) {
            return;
        }
        this.damage_type = this.GetAbilityPlus().GetAbilityDamageType();
    }
    OnIntervalThink(): void {
        ApplyDamage({
            victim: this.GetParentPlus(),
            damage: this.damage_per_instance,
            damage_type: this.damage_type,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.GetCasterPlus(),
            ability: this.GetAbilityPlus()
        });
        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, this.GetParentPlus(), this.damage_per_instance, undefined);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE,
            4: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.movement_slow;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetParentPlus() && !this.bIgnited && keys.damage_category == DamageCategory_t.DOTA_DAMAGE_CATEGORY_SPELL) {
            this.bIgnited = true;
            this.GetParentPlus().EmitSound("Hero_BrewMaster.CinderBrew.Ignite");
            let burn_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_brewmaster/brewmaster_drunkenbrawler_crit.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            this.AddParticle(burn_particle, false, false, -1, false, false);
            this.SetDuration(this.GetRemainingTime() + this.extra_duration, true);
            this.damage_per_instance = this.total_damage / 8;
            this.tick_interval = this.GetDuration() / 8;
            this.StartIntervalThink(this.tick_interval);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierTotalDamageOutgoing_Percentage(keys: ModifierAttackEvent): number {
        if (this.bIgnited && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS && GFuncRandom.PRD(this.remnants_self_damage_chance, this)) {
            this.GetParentPlus().EmitSound("Hero_BrewMaster.CinderBrew.SelfAttack");
            this.self_attack_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_brewmaster/brewmaster_cinder_brew_self_attack.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus());
            ParticleManager.ReleaseParticleIndex(this.self_attack_particle);
            this.self_damage = ApplyDamage({
                victim: this.GetParentPlus(),
                damage: keys.original_damage,
                damage_type: keys.damage_type,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NON_LETHAL + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION,
                attacker: this.GetParentPlus(),
                ability: this.GetAbilityPlus()
            });
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_OUTGOING_DAMAGE, this.GetParentPlus(), this.self_damage, undefined);
            return -100;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.remnants_self_damage_chance;
    }
}
@registerModifier()
export class modifier_imba_brewmaster_cinder_brew_thinker extends BaseModifier_Plus {
}
@registerModifier()
export class modifier_imba_brewmaster_cinder_brew_thinker_aura extends BaseModifier_Plus {
}
@registerAbility()
export class imba_brewmaster_drunken_brawler extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_brewmaster_drunken_brawler_passive";
    }
    GetAbilityTextureName(): string {
        if (!this.GetCasterPlus().HasModifier("modifier_imba_brewmaster_drunken_brawler_crit_cooldown") && !this.GetCasterPlus().HasModifier("modifier_imba_brewmaster_drunken_brawler_miss_cooldown")) {
            return "brewmaster/drunken_brawler_both";
        } else if (!this.GetCasterPlus().HasModifier("modifier_imba_brewmaster_drunken_brawler_crit_cooldown") && this.GetCasterPlus().HasModifier("modifier_imba_brewmaster_drunken_brawler_miss_cooldown")) {
            return "brewmaster/drunken_brawler_crit";
        } else if (this.GetCasterPlus().HasModifier("modifier_imba_brewmaster_drunken_brawler_crit_cooldown") && !this.GetCasterPlus().HasModifier("modifier_imba_brewmaster_drunken_brawler_miss_cooldown")) {
            return "brewmaster/drunken_brawler_miss";
        } else {
            return "brewmaster_drunken_brawler";
        }
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_Brewmaster.Brawler.Cast");
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_brewmaster_drunken_brawler", {
            duration: this.GetSpecialValueFor("duration")
        });
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_brewmaster_druken_brawler_damage") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_brewmaster_druken_brawler_damage")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_brewmaster_druken_brawler_damage"), "modifier_special_bonus_imba_brewmaster_druken_brawler_damage", {});
        }
    }
}
@registerModifier()
export class modifier_imba_brewmaster_drunken_brawler_passive extends BaseModifier_Plus {
    public bCrit: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT,
            3: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            4: Enum_MODIFIER_EVENT.ON_ATTACK_FAIL
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE)
    CC_GetModifierPreAttack_CriticalStrike(p_0: ModifierAttackEvent,): number {
        if (this.GetAbilityPlus()) {
            if (!this.GetParentPlus().HasModifier("modifier_imba_brewmaster_drunken_brawler_crit_cooldown") && !this.GetParentPlus().HasModifier("modifier_imba_brewmaster_drunken_brawler")) {
                this.bCrit = true;
                return this.GetSpecialValueFor("crit_multiplier");
            } else {
                this.bCrit = false;
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT)
    CC_GetModifierEvasion_Constant(p_0: ModifierAttackEvent,): number {
        if (this.GetAbilityPlus() && !this.GetParentPlus().HasModifier("modifier_imba_brewmaster_drunken_brawler_miss_cooldown") && !this.GetParentPlus().HasModifier("modifier_imba_brewmaster_drunken_brawler")) {
            return 100;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && this.bCrit) {
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_brewmaster_drunken_brawler_crit_cooldown", {
                duration: this.GetSpecialValueFor("certain_trigger_timer")
            });
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_FAIL)
    CC_OnAttackFail(keys: ModifierAttackEvent): void {
        if (keys.target == this.GetParentPlus() && !this.GetParentPlus().HasModifier("modifier_imba_brewmaster_drunken_brawler_miss_cooldown")) {
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_brewmaster_drunken_brawler_miss_cooldown", {
                duration: this.GetSpecialValueFor("certain_trigger_timer")
            });
        }
    }
}
@registerModifier()
export class modifier_imba_brewmaster_drunken_brawler_crit_cooldown extends BaseModifier_Plus {
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
export class modifier_imba_brewmaster_drunken_brawler_miss_cooldown extends BaseModifier_Plus {
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
export class modifier_imba_brewmaster_drunken_brawler extends BaseModifier_Plus {
    public dodge_chance: number;
    public crit_chance: number;
    public crit_multiplier: any;
    public min_movement: any;
    public max_movement: any;
    public redirective_damage: number;
    GetEffectName(): string {
        return "particles/units/heroes/hero_brewmaster/brewmaster_drunkenbrawler_crit.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_drunken_brawler.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_NORMAL;
    }
    BeCreated(p_0: any,): void {
        this.dodge_chance = this.GetSpecialValueFor("dodge_chance");
        this.crit_chance = this.GetSpecialValueFor("crit_chance");
        this.crit_multiplier = this.GetAbilityPlus().GetTalentSpecialValueFor("crit_multiplier");
        this.min_movement = this.GetSpecialValueFor("min_movement");
        this.max_movement = this.GetSpecialValueFor("max_movement");
        if (!IsServer()) {
            return;
        }
        let evade_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_brewmaster/brewmaster_drunkenbrawler_evade.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        this.AddParticle(evade_particle, false, false, -1, true, false);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            4: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP,
            5: Enum_MODIFIER_EVENT.ON_ATTACK_FAIL,
            6: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT)
    CC_GetModifierEvasion_Constant(p_0: ModifierAttackEvent,): number {
        return this.dodge_chance;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE)
    CC_GetModifierPreAttack_CriticalStrike(p_0: ModifierAttackEvent,): number {
        if (GFuncRandom.PRD(this.crit_chance, this)) {
            this.GetParentPlus().EmitSound("Hero_Brewmaster.Brawler.Crit");
            return this.crit_multiplier;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (math.floor(this.GetElapsedTime()) % 2 == 0) {
            return this.max_movement;
        } else {
            return this.min_movement;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip( /** keys */): number {
        // if (keys.fail_type == 1) {
        //     return this.crit_chance;
        // } else if (keys.fail_type == 2) {
        //     return this.crit_multiplier;
        // }
        return this.crit_chance;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_FAIL)
    CC_OnAttackFail(keys: ModifierAttackEvent): void {
        if (keys.target == this.GetParentPlus()) {
            this.SetStackCount(this.GetStackCount() + keys.damage);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage( /** keys */): number {
        if (this.GetStackCount() > 0) {
            this.redirective_damage = this.GetStackCount();
            this.SetStackCount(0);
            return this.redirective_damage;
        }
    }
}
@registerAbility()
export class imba_brewmaster_primal_split extends BaseAbility_Plus {
    public responses: any;
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_brewmaster_primal_split", this.GetCasterPlus()) == 0) {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_NONE, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_NONE, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, this.GetCasterPlus().GetTeamNumber());
        } else {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO, this.GetCasterPlus().GetTeamNumber());
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_brewmaster_primal_split";
    }
    GetCooldown(level: number): number {
        return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_brewmaster_primal_split_cooldown");
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_brewmaster_primal_split", this.GetCasterPlus()) == 0) {
            return tonumber(tostring(super.GetBehavior())) + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_brewmaster_primal_split", this.GetCasterPlus()) == 0) {
            return super.GetCastRange(location, target);
        } else {
            return this.GetSpecialValueFor("co-pilot_cast_range");
        }
    }
    OnAbilityPhaseStart(): boolean {
        if (this.GetCasterPlus().GetName().includes("brewmaster")) {
            if (!this.responses) {
                this.responses = {
                    "1": "brewmaster_brew_ability_primalsplit_06",
                    "2": "brewmaster_brew_ability_primalsplit_08",
                    "3": "brewmaster_brew_ability_primalsplit_09",
                    "4": "brewmaster_brew_ability_primalsplit_13"
                }
            }
            this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(this.responses));
        }
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_4);
        return true;
    }
    OnAbilityPhaseInterrupted(): void {
        this.GetCasterPlus().RemoveGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_4);
    }
    OnSpellStart(): void {
        if (!this.GetAutoCastState()) {
            this.GetCasterPlus().EmitSound("Hero_Brewmaster.PrimalSplit.Cast");
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_brewmaster_primal_split_split_delay", {
                duration: this.GetSpecialValueFor("split_duration")
            });
        } else {
            this.GetCasterPlus().EmitSound("Hero_Brewmaster.Primal_Split_Projectile_Cast");
            ProjectileManager.CreateTrackingProjectile({
                EffectName: "particles/hero/brewmaster/primal_split_co-pilot.vpcf",
                Ability: this,
                Source: this.GetCasterPlus(),
                vSourceLoc: this.GetCasterPlus().GetAbsOrigin(),
                Target: this.GetCursorTarget(),
                iMoveSpeed: this.GetSpecialValueFor("co-pilot_projectile_speed"),
                bDodgeable: false,
                bIsAttack: false,
                bReplaceExisting: false,
                iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION,
                bDrawsOnMinimap: undefined,
                bVisibleToEnemies: true,
                bProvidesVision: false,
                iVisionRadius: undefined,
                iVisionTeamNumber: undefined,
                ExtraData: {}
            });
        }
    }
    OnProjectileHitHandle(target: IBaseNpc_Plus, location: Vector, projectileHandle: ProjectileID) {
        if (target && target.IsAlive() && !target.IsInvulnerable()) {
            target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_brewmaster_primal_split_split_delay", {
                duration: this.GetSpecialValueFor("split_duration")
            });
        } else {
            this.EndCooldown();
            this.StartCooldown(this.GetCooldown(this.GetLevel()) * this.GetSpecialValueFor("co-pilot_fail_cooldown_pct") * 0.01 * this.GetCasterPlus().GetCooldownReduction());
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_brewmaster_primal_split_cooldown") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_brewmaster_primal_split_cooldown")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_brewmaster_primal_split_cooldown"), "modifier_special_bonus_imba_brewmaster_primal_split_cooldown", {});
        }
    }
}
@registerModifier()
export class modifier_imba_brewmaster_primal_split extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ORDER
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierAbilityEvent): void {
        if (!IsServer() || keys.unit != this.GetParentPlus() || keys.order_type != dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO || keys.ability != this.GetAbilityPlus()) {
            return;
        }
        if (this.GetAbilityPlus().GetAutoCastState()) {
            this.SetStackCount(0);
        } else {
            this.SetStackCount(1);
        }
    }
}
@registerModifier()
export class modifier_imba_brewmaster_primal_split_split_delay extends BaseModifier_Plus {
    public duration: number;
    public scepter_movementspeed: number;
    public pandas: IBaseNpc_Plus[];
    public pandas_entindexes: EntityIndex[];
    public standard_abilities: { [k: string]: string };
    public brewmaster_vanilla_abilities: { [k: string]: string };
    public brewmaster_abilities: { [k: string]: string };
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.duration = this.GetSpecialValueFor("duration");
        this.scepter_movementspeed = this.GetSpecialValueFor("scepter_movementspeed");
        if (!IsServer()) {
            return;
        }
        let split_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_brewmaster/brewmaster_primal_split.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(split_particle, 0, this.GetParentPlus().GetAbsOrigin());
        ParticleManager.SetParticleControlForward(split_particle, 0, this.GetParentPlus().GetForwardVector());
        this.AddParticle(split_particle, false, false, -1, false, false);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        };
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.pandas = []
        this.pandas_entindexes = []
        if (this.GetParentPlus().IsAlive() && this.GetAbilityPlus()) {
            this.GetParentPlus().EmitSound("Hero_Brewmaster.PrimalSplit.Spawn");
            let split_modifier = this.GetParentPlus().AddNewModifier(this.GetCasterPlus(),
                this.GetAbilityPlus(), "modifier_imba_brewmaster_primal_split_duration", {
                duration: this.duration
            }) as modifier_imba_brewmaster_primal_split_duration;
            let ability = this.GetAbilityPlus();
            let parent = this.GetParentPlus();
            let caster = this.GetCasterPlus();
            let earth_panda = BaseNpc_Plus.CreateUnitByName("npc_dota_brewmaster_earth_" + ability.GetLevel(), parent.GetAbsOrigin() + parent.GetForwardVector() * 100 as Vector, caster.GetTeamNumber(), true, parent, parent);
            let storm_panda = BaseNpc_Plus.CreateUnitByName("npc_dota_brewmaster_storm_" + ability.GetLevel(), RotatePosition(parent.GetAbsOrigin(), QAngle(0, 120, 0), parent.GetAbsOrigin() + parent.GetForwardVector() * 100 as Vector), caster.GetTeamNumber(), true, caster, caster);
            let fire_panda = BaseNpc_Plus.CreateUnitByName("npc_dota_brewmaster_fire_" + ability.GetLevel(), RotatePosition(parent.GetAbsOrigin(), QAngle(0, -120, 0), parent.GetAbsOrigin() + parent.GetForwardVector() * 100 as Vector), caster.GetTeamNumber(), true, caster, caster);
            this.standard_abilities = {
                "1": "brewmaster_earth_hurl_boulder",
                "2": "brewmaster_earth_spell_immunity",
                "3": "brewmaster_earth_pulverize",
                "4": "brewmaster_storm_dispel_magic",
                "5": "brewmaster_storm_cyclone",
                "6": "brewmaster_storm_wind_walk",
                "7": "brewmaster_fire_permanent_immolation"
            }
            this.brewmaster_vanilla_abilities = {
                "1": "brewmaster_thunder_clap",
                "2": "brewmaster_cinder_brew",
                "3": "brewmaster_drunken_brawler"
            }
            this.brewmaster_abilities = {
                "1": "imba_brewmaster_thunder_clap",
                "2": "imba_brewmaster_cinder_brew",
                "3": "imba_brewmaster_drunken_brawler"
            }
            this.pandas.push(earth_panda);
            this.pandas.push(storm_panda);
            this.pandas.push(fire_panda);
            this.pandas_entindexes.push(earth_panda.entindex());
            if (this.GetCasterPlus() == this.GetParentPlus()) {
                this.pandas_entindexes.push(storm_panda.entindex());
                this.pandas_entindexes.push(fire_panda.entindex());
            }
            this.GetParentPlus().FollowEntity(earth_panda, false);
            if (split_modifier) {
                split_modifier.pandas = this.pandas;
                split_modifier.pandas_entindexes = this.pandas_entindexes;
            }
            for (const panda of this.pandas) {
                panda.SetForwardVector(this.GetParentPlus().GetForwardVector());
                panda.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_brewmaster_primal_split_duration", {
                    duration: this.duration,
                    parent_entindex: this.GetParentPlus().entindex()
                });
                panda.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_kill", {
                    duration: this.duration
                });
                if (this.GetCasterPlus().HasTalent("special_bonus_imba_brewmaster_primal_split_health")) {
                    panda.SetBaseMaxHealth(panda.GetBaseMaxHealth() + this.GetCasterPlus().GetTalentValue("special_bonus_imba_brewmaster_primal_split_health"));
                    panda.SetMaxHealth(panda.GetMaxHealth() + this.GetCasterPlus().GetTalentValue("special_bonus_imba_brewmaster_primal_split_health"));
                    panda.SetHealth(panda.GetHealth() + this.GetCasterPlus().GetTalentValue("special_bonus_imba_brewmaster_primal_split_health"));
                }
                if (panda.GetName() == "npc_dota_brewmaster_earth") {
                    panda.SetControllableByPlayer(this.GetParentPlus().GetPlayerID(), true);
                } else {
                    panda.SetControllableByPlayer(this.GetCasterPlus().GetPlayerID(), true);
                }
                // PlayerResource.AddToSelection(this.GetParentPlus().GetPlayerID(), panda);
                for (const [_, ability] of GameFunc.Pair(this.standard_abilities)) {
                    if (panda.HasAbility(ability)) {
                        panda.FindAbilityByName(ability).SetLevel(this.GetAbilityPlus().GetLevel());
                    }
                }
                for (const [_, ability] of GameFunc.Pair(this.brewmaster_vanilla_abilities)) {
                    if (panda.HasAbility(ability)) {
                        panda.AddAbility(this.brewmaster_abilities[_]);
                        panda.SwapAbilities(this.brewmaster_abilities[_], ability, true, false);
                        panda.RemoveAbility(ability);
                    }
                }
                for (const [_, ability] of GameFunc.Pair(this.brewmaster_abilities)) {
                    if (panda.HasAbility(ability) && this.GetCasterPlus().HasAbility(ability)) {
                        panda.FindAbilityByName(ability).SetLevel(this.GetCasterPlus().FindAbilityByName(ability).GetLevel());
                    }
                }
            }
            let unison_ability = earth_panda.AddAbility("imba_brewmaster_primal_unison");
            if (unison_ability) {
                unison_ability.SetLevel(1);
                earth_panda.SwapAbilities("imba_brewmaster_primal_unison", "generic_hidden", true, false);
            }
            // PlayerResource.RemoveFromSelection(this.GetParentPlus().GetPlayerID(), this.GetParentPlus());
            // PlayerResource.SetDefaultSelectionEntities(this.GetParentPlus().GetPlayerID(), this.pandas_entindexes);
            this.GetParentPlus().AddNoDraw();
        }
    }
}
@registerModifier()
export class modifier_imba_brewmaster_primal_split_duration extends BaseModifier_Plus {
    public scepter_movementspeed: number;
    public scepter_attack_speed: number;
    public scepter_magic_resistance: any;
    public parent: IBaseNpc_Plus;
    public responses: string[];
    public death_particle: any;
    public pandas: IBaseNpc_Plus[];
    public pandas_entindexes: EntityIndex[];
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(keys: any): void {
        if (this.GetAbilityPlus()) {
            this.scepter_movementspeed = this.GetSpecialValueFor("scepter_movementspeed");
            this.scepter_attack_speed = this.GetSpecialValueFor("scepter_attack_speed");
            this.scepter_magic_resistance = this.GetSpecialValueFor("scepter_magic_resistance");
        } else {
            this.scepter_movementspeed = 150;
            this.scepter_attack_speed = 100;
            this.scepter_magic_resistance = 20;
        }
        if (!IsServer()) {
            return;
        }
        if (keys && keys.parent_entindex) {
            this.parent = EntIndexToHScript(keys.parent_entindex) as IBaseNpc_Plus;
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().IsRealUnit()) {
            this.GetParentPlus().EmitSound("Hero_Brewmaster.PrimalSplit.Return");
            if (this.GetRemainingTime() <= 0 && this.GetCasterPlus().GetName().includes("brewmaster")) {
                if (!this.responses) {
                    this.responses = [
                        "brewmaster_brew_ability_primalsplit_10",
                        "brewmaster_brew_ability_primalsplit_12",
                        "brewmaster_brew_ability_primalsplit_15",
                        "brewmaster_brew_ability_primalsplit_16",
                        "brewmaster_brew_ability_primalsplit_17",
                    ];

                }
                this.GetCasterPlus().EmitSound(GFuncRandom.RandomOne(this.responses));
            }
            this.GetParentPlus().FollowEntity(undefined, false);
            this.GetParentPlus().RemoveNoDraw();
            // PlayerResource.SetDefaultSelectionEntity(this.GetParentPlus().GetPlayerID(), -1);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: this.GetParentPlus().IsRealUnit(),
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: this.GetParentPlus().IsRealUnit(),
            [modifierstate.MODIFIER_STATE_STUNNED]: this.GetParentPlus().IsRealUnit(),
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: this.GetParentPlus().IsRealUnit(),
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: this.GetParentPlus().IsRealUnit() || this.GetCasterPlus().HasScepter() || this.GetParentPlus().GetName() == "npc_dota_brewmaster_fire",
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: this.GetParentPlus().IsRealUnit()
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_DEATH,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MOVESPEED_LIMIT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            5: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetParentPlus() && !this.GetParentPlus().IsRealUnit()) {
            if (this.GetParentPlus().GetName() == "npc_dota_brewmaster_earth") {
                this.death_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_brewmaster/brewmaster_earth_death.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
            } else if (this.GetParentPlus().GetName() == "npc_dota_brewmaster_storm") {
                this.death_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_brewmaster/brewmaster_storm_death.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
            } else if (this.GetParentPlus().GetName() == "npc_dota_brewmaster_fire") {
                this.death_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_brewmaster/brewmaster_fire_death.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
            }
            if (this.death_particle) {
                ParticleManager.SetParticleControl(this.death_particle, 0, this.GetParentPlus().GetAbsOrigin());
                if (this.GetAbilityPlus()) {
                    ParticleManager.SetParticleControl(this.death_particle, 1, Vector(this.GetAbilityPlus().GetLevel(), 0, 0));
                }
                ParticleManager.ReleaseParticleIndex(this.death_particle);
            }
            if (this.GetRemainingTime() > 0) {
                if (this.parent && !this.parent.IsNull() && this.parent.HasModifier("modifier_imba_brewmaster_primal_split_duration") && this.parent.findBuff<modifier_imba_brewmaster_primal_split_duration>("modifier_imba_brewmaster_primal_split_duration").pandas_entindexes) {
                    let pandas_entindexes = this.parent.findBuff<modifier_imba_brewmaster_primal_split_duration>("modifier_imba_brewmaster_primal_split_duration").pandas_entindexes;
                    for (let i = 0, len = pandas_entindexes.length; i < len; i++) {
                        let npc = EntIndexToHScript(pandas_entindexes[i]);
                        if (npc && npc.IsAlive()) {
                            continue;
                        }
                        else {
                            pandas_entindexes.splice(i, 1)
                            i--;
                            len--;
                        }
                    }
                    let bNoneAlive = true;
                    let pandas = this.parent.findBuff<modifier_imba_brewmaster_primal_split_duration>("modifier_imba_brewmaster_primal_split_duration").pandas;
                    for (const panda of pandas) {
                        if (!panda.IsNull() && panda.IsAlive()) {
                            bNoneAlive = false;
                            this.parent.FollowEntity(panda, false);
                            if (this.parent != this.GetCasterPlus()) {
                                this.parent.findBuff<modifier_imba_brewmaster_primal_split_duration>("modifier_imba_brewmaster_primal_split_duration").pandas_entindexes.push(panda.entindex());
                                panda.SetOwner(this.parent);
                                panda.SetControllableByPlayer(this.parent.GetPlayerID(), true);
                            }
                            return;
                        }
                    }
                    // PlayerResource.SetDefaultSelectionEntities(this.parent.GetPlayerID(), this.parent.findBuff<modifier_imba_brewmaster_primal_split_duration>("modifier_imba_brewmaster_primal_split_duration").pandas_entindexes);
                    if (bNoneAlive) {
                        this.parent.RemoveModifierByName("modifier_imba_brewmaster_primal_split_duration");
                        if (keys.attacker != this.GetParentPlus()) {
                            this.parent.Kill(this.GetAbilityPlus(), keys.attacker);
                        }
                    }
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        if (this.GetCasterPlus() && this.GetCasterPlus().HasScepter() && this.GetCasterPlus() != this.GetParentPlus()) {
            return this.scepter_movementspeed;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MOVESPEED_LIMIT)
    CC_GetModifierIgnoreMovespeedLimit(): 0 | 1 {
        if (this.GetCasterPlus() && this.GetCasterPlus().HasScepter() && this.GetCasterPlus() != this.GetParentPlus()) {
            return 1;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (this.GetCasterPlus() && this.GetCasterPlus().HasScepter() && this.GetCasterPlus() != this.GetParentPlus()) {
            return this.scepter_attack_speed;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        if (this.GetCasterPlus() && this.GetCasterPlus().HasScepter() && this.GetCasterPlus() != this.GetParentPlus()) {
            return this.scepter_magic_resistance;
        }
    }
}
@registerAbility()
export class imba_brewmaster_primal_unison extends BaseAbility_Plus {
    public particle: any;
    IsStealable(): boolean {
        return false;
    }
    OnSpellStart(): void {
        this.GetCasterPlus().StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_CAST_ABILITY_1, 0.25);
        this.particle = ResHelper.CreateParticleEx("particles/econ/items/windrunner/windrunner_ti6/windrunner_spell_powershot_channel_ti6.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(this.particle, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(this.particle, 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
    }
    OnChannelFinish(bInterrupted: boolean): void {
        this.GetCasterPlus().RemoveGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_1);
        ParticleManager.DestroyParticle(this.particle, false);
        ParticleManager.ReleaseParticleIndex(this.particle);
        if (!bInterrupted) {
            let owner = this.GetCasterPlus().GetOwner() as IBaseNpc_Plus;
            if (owner) {

                for (const [_, ent] of GameFunc.iPair(Entities.FindAllByName("npc_dota_brewmaster_fire"))) {
                    if (ent.GetOwner() == owner) {
                        GFuncEntity.SafeDestroyUnit(ent as IBaseNpc_Plus);
                    }
                }
                for (const [_, ent] of GameFunc.iPair(Entities.FindAllByName("npc_dota_brewmaster_storm"))) {
                    if (ent.GetOwner() == owner) {
                        GFuncEntity.SafeDestroyUnit(ent as IBaseNpc_Plus);
                    }
                }

                for (const [_, ent] of GameFunc.iPair(Entities.FindAllByName("npc_dota_brewmaster_earth"))) {
                    if (ent.GetOwner() == owner) {
                        FindClearSpaceForUnit(owner, ent.GetAbsOrigin(), true);
                        GFuncEntity.SafeDestroyUnit(ent as IBaseNpc_Plus);
                    }
                }
                owner.RemoveModifierByName("modifier_imba_brewmaster_primal_split_duration");
            }
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_brewmaster_thunder_clap_slow_duration extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_brewmaster_primal_split_health extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_brewmaster_druken_brawler_damage extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_brewmaster_primal_split_cooldown extends BaseModifier_Plus {
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
