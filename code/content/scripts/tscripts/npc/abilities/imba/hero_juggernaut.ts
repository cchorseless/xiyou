
import { GameFunc } from "../../../GameFunc";
import { AnimationHelper } from "../../../helper/AnimationHelper";
import { ProjectileHelper } from "../../../helper/ProjectileHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";


function IsTotem(unit: IBaseNpc_Plus) {
    return (!unit.HasMovementCapability());
}
function ArcanaKill(hero: IBaseNpc_Plus, kill_count = 0) {
    hero.AddNewModifier(hero, undefined, "modifier_juggernaut_arcana_kill", {
        duration: 2.0,
        kills: kill_count
    });
}

@registerAbility()
export class imba_juggernaut_blade_fury extends BaseAbility_Plus {
    IsNetherWardStealable() {
        return true;
    }
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        return this.GetSpecialValueFor("blade_fury_radius");
    }
    OnSpellStart(): void {
        this.GetCasterPlus().Purge(false, true, false, false, false);
        if (this.GetCasterPlus().HasModifier("modifier_imba_juggernaut_blade_fury")) {
            let buff = this.GetCasterPlus().findBuff<modifier_imba_juggernaut_blade_fury>("modifier_imba_juggernaut_blade_fury");
            if (buff.radius >= (this.GetSpecialValueFor("blade_fury_radius") * 2)) {
                buff.radius = this.GetSpecialValueFor("blade_fury_radius");
            }
        }
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_juggernaut_blade_fury", {
            duration: this.GetSpecialValueFor("duration")
        });
        let rand = RandomInt(2, 9);
        if ((rand >= 2 && rand <= 3) || (rand >= 5 && rand <= 9)) {
            this.GetCasterPlus().EmitSound("juggernaut_jug_ability_bladefury_0" + rand);
        } else if (rand >= 10 && rand <= 18) {
            this.GetCasterPlus().EmitSound("Imba.JuggernautBladeFury" + rand);
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_juggernaut_blade_fury_movement_speed") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_juggernaut_blade_fury_movement_speed")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_juggernaut_blade_fury_movement_speed"), "modifier_special_bonus_imba_juggernaut_blade_fury_movement_speed", {});
        }
    }
}
@registerModifier()
export class modifier_imba_juggernaut_blade_fury extends BaseModifier_Plus {
    public original_caster: IBaseNpc_Plus;
    public dps: any;
    public radius: number;
    public tick: any;
    public deflect_chance: number;
    public deflect: any;
    public shard_interval: number;
    public shard_interval_counter: number;
    public damage_penalty: number;
    public talent_movespeed: number;
    public shard_ms: any;
    public blade_fury_spin_pfx: any;
    public blade_fury_spin_pfx_2: any;
    public bladedance: any;
    public prng: any;
    IsAura(): boolean {
        if (this.original_caster.HasTalent("special_bonus_imba_juggernaut_1")) {
            return true;
        } else {
            return false;
        }
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetAuraRadius(): number {
        return this.radius + 250;
    }
    GetModifierAura(): string {
        return "modifier_imba_juggernaut_blade_fury_succ";
    }
    BeCreated(p_0: any,): void {
        this.original_caster = this.GetCasterPlus();
        this.dps = this.GetSpecialValueFor("blade_fury_damage") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_unique_juggernaut_3");
        this.radius = this.GetSpecialValueFor("blade_fury_radius");
        this.tick = this.GetSpecialValueFor("blade_fury_damage_tick");
        this.deflect_chance = this.GetAbilityPlus().GetTalentSpecialValueFor("deflect_chance");
        this.deflect = true;
        this.shard_interval = this.GetSpecialValueFor("shard_attack_interval");
        this.shard_interval_counter = this.shard_interval - 0.2;
        this.damage_penalty = -100;
        this.talent_movespeed = this.GetCasterPlus().GetTalentValue("special_bonus_imba_juggernaut_blade_fury_movement_speed");
        this.shard_ms = 0;
        if (this.GetCasterPlus().HasShard()) {
            this.shard_ms = this.GetSpecialValueFor("shard_bonus_ms");
        }
        if (IsServer()) {
            if (this.GetCasterPlus().IsAlive()) {
                this.blade_fury_spin_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_juggernaut/juggernaut_blade_fury.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus());
                ParticleManager.SetParticleControl(this.blade_fury_spin_pfx, 5, Vector(this.radius * 1.2, 0, 0));
                this.blade_fury_spin_pfx_2 = ResHelper.CreateParticleEx("particles/units/heroes/hero_juggernaut/juggernaut_blade_fury_null.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus());
                ParticleManager.SetParticleControl(this.blade_fury_spin_pfx_2, 1, Vector(this.radius * 1.2, 0, 0));
                this.StartIntervalThink(this.tick);
                this.GetCasterPlus().EmitSound("Hero_Juggernaut.BladeFuryStart");
                if (this.GetCasterPlus().HasAbility("imba_juggernaut_omni_slash")) {
                    this.GetCasterPlus().findAbliityPlus<imba_juggernaut_omni_slash>("imba_juggernaut_omni_slash").SetActivated(false);
                }
                if (this.GetCasterPlus().HasAbility("imba_juggernaut_blade_dance")) {
                    this.GetCasterPlus().findAbliityPlus<imba_juggernaut_blade_dance>("imba_juggernaut_blade_dance").SetActivated(false);
                }
            }
        }
    }
    OnIntervalThink(): void {
        let damage = this.dps * this.tick;
        let caster_loc = this.GetCasterPlus().GetAbsOrigin();
        let furyEnemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), caster_loc, undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        if (this.original_caster.HasTalent("special_bonus_imba_juggernaut_2")) {
            this.radius = this.radius + this.original_caster.GetTalentValue("special_bonus_imba_juggernaut_2");
            if (this.blade_fury_spin_pfx) {
                ParticleManager.SetParticleControl(this.blade_fury_spin_pfx, 5, Vector(this.radius * 1.2, 0, 0));
            }
            if (this.blade_fury_spin_pfx_2) {
                ParticleManager.SetParticleControl(this.blade_fury_spin_pfx_2, 5, Vector(this.radius * 1.2, 0, 0));
            }
        }
        for (const [_, enemy] of GameFunc.iPair(furyEnemies)) {
            enemy.EmitSound("Hero_Juggernaut.BladeFury.Impact");
            let slash_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_juggernaut/juggernaut_blade_fury_tgt.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy, this.GetCasterPlus());
            ParticleManager.SetParticleControl(slash_pfx, 0, enemy.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(slash_pfx);
            if (this.original_caster.HasTalent("special_bonus_imba_juggernaut_6") && this.GetCasterPlus().findAbliityPlus<imba_juggernaut_blade_dance>("imba_juggernaut_blade_dance")) {
                this.bladedance = this.bladedance || this.GetCasterPlus().findAbliityPlus<imba_juggernaut_blade_dance>("imba_juggernaut_blade_dance");
                this.prng = this.prng || 0;
                let wind_dance = this.original_caster.findBuff<modifier_imba_juggernaut_blade_dance_wind_dance>("modifier_imba_juggernaut_blade_dance_wind_dance");
                if (wind_dance) {
                    damage = damage + (wind_dance.GetStackCount() * this.original_caster.GetTalentValue("special_bonus_imba_juggernaut_6", "dps") * this.tick);
                }
                let crit = this.bladedance.GetSpecialValueFor("blade_dance_crit_mult") / 100;
                let chance = this.bladedance.GetSpecialValueFor("blade_dance_crit_chance");
                if (RollPercentage(chance + this.prng - math.floor((chance - 5) / chance))) {
                    this.prng = 0;
                    let crit_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_juggernaut/jugg_crit_blur.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
                    if (this.GetCasterPlus().HasModifier("modifier_juggernaut_arcana")) {
                        ParticleManager.SetParticleControl(crit_pfx, 1, enemy.GetAbsOrigin());
                        ParticleManager.SetParticleControl(crit_pfx, 3, enemy.GetAbsOrigin());
                    }
                    ParticleManager.SetParticleControl(crit_pfx, 0, this.GetParentPlus().GetAbsOrigin());
                    ParticleManager.ReleaseParticleIndex(crit_pfx);
                    this.GetParentPlus().EmitSound("Hero_Juggernaut.BladeDance");
                    this.GetParentPlus().EmitSound("Hero_Juggernaut.PreAttack");
                    damage = damage * crit;
                    let player = PlayerResource.GetPlayer(this.GetCasterPlus().GetPlayerOwnerID());
                    SendOverheadEventMessage(player, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_CRITICAL, enemy, damage, player);
                } else {
                    this.prng = this.prng + 1;
                }
            }
            ApplyDamage({
                attacker: this.GetCasterPlus(),
                victim: enemy,
                ability: this.GetAbilityPlus(),
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            });
        }
        if (this.GetCasterPlus().HasShard()) {
            this.shard_interval_counter = this.shard_interval_counter + this.tick;
            if (this.shard_interval_counter >= this.shard_interval) {
                this.shard_interval_counter = 0;
                let random_enemy = furyEnemies[RandomInt(1, GameFunc.GetCount(furyEnemies))];
                if (random_enemy && random_enemy.IsAlive()) {
                    let base_damage = this.GetCasterPlus().GetAttackDamage();
                    let bonus_damage = this.GetCasterPlus().GetAverageTrueAttackDamage(random_enemy);
                    let damage = ((base_damage + bonus_damage) * this.GetSpecialValueFor("shard_attack_damage")) / 100;
                    this.GetCasterPlus().PerformAttack(random_enemy, true, true, true, false, false, true, false);
                    ApplyDamage({
                        attacker: this.GetCasterPlus(),
                        victim: random_enemy,
                        ability: this.GetAbilityPlus(),
                        damage: damage,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
                    });
                }
            }
        }
    }
    BeRemoved(): void {
        if (IsServer()) {
            this.GetCasterPlus().StopSound("Hero_Juggernaut.BladeFuryStart");
            this.GetCasterPlus().EmitSound("Hero_Juggernaut.BladeFuryStop");
            if (this.GetCasterPlus().HasAbility("imba_juggernaut_omni_slash")) {
                this.GetCasterPlus().findAbliityPlus<imba_juggernaut_omni_slash>("imba_juggernaut_omni_slash").SetActivated(true);
            }
            if (this.GetCasterPlus().HasAbility("imba_juggernaut_blade_dance")) {
                this.GetCasterPlus().findAbliityPlus<imba_juggernaut_blade_dance>("imba_juggernaut_blade_dance").SetActivated(true);
            }
            if (this.GetCasterPlus().HasModifier("modifier_imba_omni_slash_caster")) {
                AnimationHelper.StartAnimation(this.GetCasterPlus(), {
                    activity: GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_4,
                    rate: 1.0,
                    duration: 10
                });
            } else {
                AnimationHelper.EndAnimation(this.GetCasterPlus());
            }
            if (this.blade_fury_spin_pfx) {
                ParticleManager.DestroyParticle(this.blade_fury_spin_pfx, false);
                ParticleManager.ReleaseParticleIndex(this.blade_fury_spin_pfx);
                this.blade_fury_spin_pfx = undefined;
            }
            if (this.blade_fury_spin_pfx_2) {
                ParticleManager.DestroyParticle(this.blade_fury_spin_pfx_2, false);
                ParticleManager.ReleaseParticleIndex(this.blade_fury_spin_pfx_2);
                this.blade_fury_spin_pfx_2 = undefined;
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION,
            4: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierDamageOutgoing_Percentage(keys: ModifierAttackEvent): number {
        if (keys.target && !keys.target.IsMagicImmune() && !keys.target.IsBuilding()) {
            return this.damage_penalty;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        return this.talent_movespeed + this.shard_ms;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_1;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            if (this.deflect || (CalcDistanceBetweenEntityOBB(keys.attacker, this.GetCasterPlus()) <= this.radius && RollPercentage(this.deflect_chance))) {
                let target = keys.target;
                let attacker = keys.attacker;
                let check_attack_capability = attacker.GetAttackCapability();
                let attacker_projectile_particle = attacker.GetRangedProjectileName();
                let attacker_projectile_speed = attacker.GetProjectileSpeed();
                if (target == this.GetCasterPlus() && check_attack_capability == 2) {
                    this.deflect = false;
                    this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_juggernaut_blade_fury_deflect_buff", {
                        duration: 0.01
                    });
                    this.GetCasterPlus().EmitSound("Hero_Juggernaut.BladeFury.Impact");
                    let slash_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_juggernaut/juggernaut_blade_fury_tgt.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus());
                    ParticleManager.SetParticleControl(slash_pfx, 0, this.GetCasterPlus().GetAbsOrigin());
                    ParticleManager.ReleaseParticleIndex(slash_pfx);
                    let enemy = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("deflect_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
                    if (enemy[0]) {
                        let deflected_target = enemy[0];
                        let projectile_deflected: ITrackingProjectile = {
                            hTarget: deflected_target,
                            hCaster: this.GetCasterPlus(),
                            hAbility: this.GetAbilityPlus(),
                            EffectName: attacker_projectile_particle,
                            iMoveSpeed: attacker_projectile_speed,
                            vSpawnOrigin: this.GetCasterPlus().GetAbsOrigin(),
                            bDodgeable: true,
                            flRadius: 1,
                            // bVisibleToEnemies: true,
                            bDestroyOnDodge: true,
                            // bReplaceExisting: false,
                            // bProvidesVision: false,
                            OnProjectileHitUnit: GHandler.create(this, (params, projectileID) => {
                                this.ProjectileHit(attacker, deflected_target);
                            })
                        }
                        ProjectileHelper.TrackingProjectiles.Projectile(projectile_deflected);
                    }
                }
            }
        }
    }

    ProjectileHit(attacker: IBaseNpc_Plus, target: IBaseNpc_Plus) {
        let ability = this.GetAbilityPlus();
        let deflector = this.GetCasterPlus();
        if (target.HasModifier("modifier_imba_juggernaut_blade_fury_deflect_on_kill_credit") || (!target.IsAlive())) {
        } else {
            target.AddNewModifier(deflector, ability, "modifier_imba_juggernaut_blade_fury_deflect_on_kill_credit", {
                duration: 0.01
            });
        }
        attacker.PerformAttack(target, false, true, true, false, false, false, false);
    }
}
@registerModifier()
export class modifier_imba_juggernaut_blade_fury_succ extends BaseModifierMotionHorizontal_Plus {
    public caster: IBaseNpc_Plus;
    public target: IBaseNpc_Plus;
    public succ_tick: any;
    public radius: number;
    IsPurgable(): boolean {
        return true;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }

    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_LOW;
    }
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.target = this.GetParentPlus();
        this.succ_tick = FrameTime();
        if (!this.BeginMotionOrDestroy()) {
            return;
        }
    }

    UpdateHorizontalMotion(me: IBaseNpc_Plus, dt: number): void {
        if (IsServer()) {
            if (!this.caster.HasModifier("modifier_imba_juggernaut_blade_fury")) {
                this.Destroy();
                return;
            }
            let enemy_position = this.target.GetAbsOrigin();
            let caster_position = this.caster.GetAbsOrigin();
            this.radius = this.GetSpecialValueFor("blade_fury_radius");
            let succ_radius = this.radius * this.caster.GetTalentValue("special_bonus_imba_juggernaut_1");
            let direction = (enemy_position - caster_position as Vector).Normalized() * (-1);
            let distance = (enemy_position - caster_position as Vector).Length2D();
            if (distance > 100) {
                let newPosition = enemy_position + direction * this.succ_tick * (succ_radius - distance) * this.caster.GetTalentValue("special_bonus_imba_juggernaut_1", "pull_strength") as Vector;
                let blade_fury_modifier = this.caster.findBuff<modifier_imba_juggernaut_blade_fury>("modifier_imba_juggernaut_blade_fury");
                if (blade_fury_modifier) {
                    if (distance < blade_fury_modifier.radius) {
                        newPosition = enemy_position + direction * this.succ_tick * (succ_radius - distance) * this.caster.GetTalentValue("special_bonus_imba_juggernaut_1", "pull_strength_fury") as Vector;
                    }
                }
                this.target.SetAbsOrigin(newPosition);
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.target.SetUnitOnClearGround();
        }
    }
}
@registerModifier()
export class modifier_imba_juggernaut_blade_fury_deflect_on_kill_credit extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.parent = this.GetParentPlus();
            let damage = keys.damage;
            let target = keys.unit;
            let attacker = keys.attacker;
            let parent_health = this.parent.GetHealth();
            if (keys.damage > parent_health && target == this.parent) {
                ApplyDamage({
                    attacker: this.caster,
                    victim: this.parent,
                    ability: this.GetAbilityPlus(),
                    damage: parent_health + 10,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_DAMAGE_MULTIPLIERS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_BYPASSES_BLOCK
                } as ApplyDamageOptions);
            }
        }
    }
    StatusEffectPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_ULTRA;
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_ULTRA;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
}
@registerModifier()
export class modifier_imba_juggernaut_blade_fury_deflect_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(params: ModifierAttackEvent): number {
        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BLOCK, this.caster, params.damage, undefined);
        return -100;
    }
}
@registerAbility()
export class imba_juggernaut_healing_ward extends BaseAbility_Plus {
    IsNetherWardStealable() {
        return false;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let targetPoint = this.GetCursorPosition();
        caster.EmitSound("Hero_Juggernaut.HealingWard.Cast");
        let healing_ward = BaseNpc_Plus.CreateUnitByName("npc_dota_juggernaut_healing_ward", targetPoint, caster, true);
        // SetCreatureHealth(healing_ward, this.GetTalentSpecialValueFor("health"), true);
        healing_ward.ModifyMaxHealth(this.GetTalentSpecialValueFor("health"))
        healing_ward.SetHealth(this.GetTalentSpecialValueFor("health"));
        healing_ward.AddNewModifier(caster, this, "modifier_kill", {
            duration: this.GetDuration()
        });
        healing_ward.AddAbility("imba_juggernaut_healing_ward_passive").SetLevel(this.GetLevel());
        healing_ward.SetControllableByPlayer(caster.GetPlayerOwnerID(), true);
        this.AddTimer(FrameTime(), () => {
            healing_ward.MoveToNPC(caster);
        });
    }
}
@registerAbility()
export class imba_juggernaut_healing_ward_passive extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_juggernaut_healing_ward_passive";
    }
    CastFilterResult(): UnitFilterResult {
        if (!IsTotem(this.GetCasterPlus())) {
            return UnitFilterResult.UF_SUCCESS;
        } else {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        }
    }
    GetCustomCastError(): string {
        return "Already totem";
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let targetPoint = this.GetCursorPosition();
        caster.EmitSound("Hero_Juggernaut.HealingWard.Cast");
        let healing_ward_ability = caster.GetOwnerPlus().findAbliityPlus<imba_juggernaut_healing_ward>("imba_juggernaut_healing_ward");
        let totem_health = healing_ward_ability.GetSpecialValueFor("health_totem");
        caster.SetMoveCapability(DOTAUnitMoveCapability_t.DOTA_UNIT_CAP_MOVE_NONE);
        // SetCreatureHealth(caster, totem_health, true);
        caster.findBuff<modifier_imba_juggernaut_healing_ward_passive>("modifier_imba_juggernaut_healing_ward_passive").ForceRefresh();
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_juggernaut_healing_ward_totem", {});
        this.SetActivated(false);
    }
}
@registerModifier()
export class modifier_imba_juggernaut_healing_ward_passive extends BaseModifier_Plus {
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let eruption_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_juggernaut/juggernaut_healing_ward_eruption.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.GetCasterPlus(), this.GetCasterPlus());
            ParticleManager.SetParticleControl(eruption_pfx, 0, this.GetCasterPlus().GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(eruption_pfx);
            caster.TempData().healing_ward_ambient_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_juggernaut/juggernaut_healing_ward.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus());
            ParticleManager.SetParticleControl(caster.TempData().healing_ward_ambient_pfx, 0, this.GetCasterPlus().GetAbsOrigin() + Vector(0, 0, 100) as Vector);
            ParticleManager.SetParticleControl(caster.TempData().healing_ward_ambient_pfx, 1, Vector(this.GetSpecialValueFor("healing_ward_aura_radius"), 1, 1));
            ParticleManager.SetParticleControlEnt(caster.TempData().healing_ward_ambient_pfx, 2, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
            EmitSoundOn("Hero_Juggernaut.HealingWard.Loop", this.GetParentPlus());
        }
    }
    BeRefresh(p_0: any,): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let eruption_pfx = ResHelper.CreateParticleEx("particles/econ/items/juggernaut/bladekeeper_healing_ward/juggernaut_healing_ward_eruption_dc.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.GetCasterPlus(), this.GetCasterPlus());
            ParticleManager.SetParticleControl(eruption_pfx, 0, this.GetCasterPlus().GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(eruption_pfx);
            ParticleManager.DestroyParticle(caster.TempData().healing_ward_ambient_pfx, false);
            ParticleManager.ReleaseParticleIndex(caster.TempData().healing_ward_ambient_pfx);
            caster.TempData().healing_ward_ambient_pfx = undefined;
            caster.TempData().healing_ward_ambient_pfx = ResHelper.CreateParticleEx("particles/econ/items/juggernaut/bladekeeper_healing_ward/juggernaut_healing_ward_dc.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus());
            ParticleManager.SetParticleControl(caster.TempData().healing_ward_ambient_pfx, 0, this.GetCasterPlus().GetAbsOrigin() + Vector(0, 0, 100) as Vector);
            ParticleManager.SetParticleControl(caster.TempData().healing_ward_ambient_pfx, 1, Vector(this.GetAbilityPlus().GetTalentSpecialValueFor("heal_radius_totem"), 1, 1));
            ParticleManager.SetParticleControlEnt(caster.TempData().healing_ward_ambient_pfx, 2, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
        }
    }
    IsHidden(): boolean {
        return true;
    }
    IsAura(): boolean {
        return true;
    }
    GetModifierAura(): string {
        return "modifier_imba_juggernaut_healing_ward_aura";
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP;
    }
    GetAuraRadius(): number {
        if (this.GetAbilityPlus()) {
            let healing_ward_ability = this.GetParentPlus().GetOwnerPlus().findAbliityPlus<imba_juggernaut_healing_ward>("imba_juggernaut_healing_ward");
            let radius = healing_ward_ability.GetSpecialValueFor("healing_ward_aura_radius");
            if (IsTotem(this.GetParentPlus())) {
                let totem_bonus_radius_pct = radius * healing_ward_ability.GetSpecialValueFor("radius_bonus_totem_pct") / 100;
                let totem_radius = radius + totem_bonus_radius_pct;
                return totem_radius;
            } else {
                return radius;
            }
        }
    }
    GetAuraDuration(): number {
        return 2.5;
    }
    IsPurgable(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_LOW_ATTACK_PRIORITY]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            3: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        return -100;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        if (params.target == this.GetParentPlus()) {
            if (this.GetParentPlus().GetHealth() > 1) {
                this.GetParentPlus().SetHealth(this.GetParentPlus().GetHealth() - 1);
            } else {
                this.GetParentPlus().Kill(undefined, params.attacker);
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(params: ModifierInstanceEvent): void {
        if (params.unit == this.GetParentPlus()) {
            ParticleManager.DestroyParticle(this.GetCasterPlus().TempData().healing_ward_ambient_pfx, false);
            ParticleManager.ReleaseParticleIndex(this.GetCasterPlus().TempData().healing_ward_ambient_pfx);
            this.GetCasterPlus().TempData().healing_ward_ambient_pfx = undefined;
            StopSoundOn("Hero_Juggernaut.HealingWard.Loop", this.GetParentPlus());
        }
    }
}
@registerModifier()
export class modifier_imba_juggernaut_healing_ward_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public heal_per_sec: any;
    public heal_per_sec_totem: any;
    Init(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.caster = this.GetCasterPlus();
        if (!IsServer()) {
            return;
        }
        let healing_ward_ability = this.caster.GetOwnerPlus().findAbliityPlus<imba_juggernaut_healing_ward>("imba_juggernaut_healing_ward");
        this.heal_per_sec = healing_ward_ability.GetSpecialValueFor("healing_ward_heal_amount");
        this.heal_per_sec_totem = this.heal_per_sec + (this.heal_per_sec * healing_ward_ability.GetSpecialValueFor("heal_per_sec_totem_pct") / 100);
        if (this.caster.GetOwnerPlus().HasTalent("special_bonus_imba_juggernaut_3")) {
            if (IsTotem(this.caster)) {
                this.SetStackCount(this.caster.GetOwnerPlus().GetTalentValue("special_bonus_imba_juggernaut_3", "totem_value"));
            } else {
                this.SetStackCount(this.caster.GetOwnerPlus().GetTalentValue("special_bonus_imba_juggernaut_3"));
            }
        }
        this.SetHasCustomTransmitterData(true);
    }
    AddCustomTransmitterData() {
        return {
            heal_per_sec: this.heal_per_sec,
            heal_per_sec_totem: this.heal_per_sec_totem
        };
    }
    // HandleCustomTransmitterData(data) {
    //     this.heal_per_sec = data.heal_per_sec;
    //     this.heal_per_sec_totem = data.heal_per_sec_totem;
    // }

    GetEffectName(): string {
        return "particles/units/heroes/hero_juggernaut/juggernaut_ward_heal.vpcf";
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE)
    CC_GetModifierHealthRegenPercentage(): number {
        if (this.GetCasterPlus() && this.GetCasterPlus().HasModifier && this.GetCasterPlus().HasModifier("modifier_imba_juggernaut_healing_ward_totem")) {
            return this.heal_per_sec_totem;
        } else {
            return this.heal_per_sec;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_juggernaut_healing_ward_totem extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE)
    CC_GetModifierModelChange(): string {
        return "models/items/juggernaut/ward/dc_wardupate/dc_wardupate.vmdl";
    }
}
@registerAbility()
export class imba_juggernaut_blade_dance extends BaseAbility_Plus {
    public endPoint: any;
    public initialPos: any;
    public second_dash: any;
    public third_dash: any;
    GetIntrinsicModifierName(): string {
        return "modifier_imba_juggernaut_blade_dance_passive";
    }
    CastFilterResultLocation(position: Vector): UnitFilterResult {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (caster.IsDisarmed()) {
                return UnitFilterResult.UF_FAIL_CUSTOM;
            }
        }
    }
    GetCustomCastErrorLocation(position: Vector): string {
        return "dota_hud_error_cant_use_disarmed";
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let position = this.GetCursorPosition();
        this.endPoint = position;
        this.initialPos = caster.GetAbsOrigin();
        this.second_dash = false;
        this.third_dash = false;
        caster.FaceTowards(position);
        caster.AddNewModifier(caster, this, "modifier_imba_juggernaut_blade_dance_empowered_slice", {});
    }
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        if (this.GetBehavior() != DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE) {
            return this.GetTalentSpecialValueFor("active_distance");
        }
        return 0;
    }
    GetCooldown(p_0: number,): number {
        return this.GetTalentSpecialValueFor("active_cooldown");
    }
}
@registerModifier()
export class modifier_imba_juggernaut_blade_dance_empowered_slice extends BaseModifierMotionHorizontal_Plus {
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public has_slice_enemy: any;
    public enemies_hit: IBaseNpc_Plus[];
    public initialPos: Vector;
    public endPoint: Vector;
    public target_position: Vector;
    public max_attack_count: number;
    public speed: number;
    public maxDistance: any;
    public distance_left: number;
    public direction: any;
    public distance_limit: number;
    public traveled: any;
    public secret_blade: any;
    public wind_dance: any;
    public frametime: number;
    public initialAngle: any;
    public attack_count: number;
    public targetted_enemy: any;
    public newPoint: any;
    public distance_travelled: number;
    public max_travel_distance: number;
    public second_dash: any;
    public third_dash: any;
    public qangle_angle: any;
    third_dash_finale: any;
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE)
    CC_GetModifierTurnRate_Percentage(): number {
        return 999999;
    }
    RemoveOnDeath(): boolean {
        return true;
    }

    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.parent = this.GetParentPlus();
            this.GetCasterPlus().EmitSound("Hero_Juggernaut.PreAttack");
            this.GetCasterPlus().EmitSound("Hero_EarthShaker.Attack");
            this.has_slice_enemy = false;
            this.enemies_hit = []
            if (this.second_dash || this.third_dash) {
                this.initialPos = this.initialPos;
                this.endPoint = this.endPoint;
            } else {
                this.initialPos = this.GetAbilityPlus<imba_juggernaut_blade_dance>().initialPos;
                this.endPoint = this.GetAbilityPlus<imba_juggernaut_blade_dance>().endPoint;
            }
            if (!this.max_attack_count) {
                this.max_attack_count = this.GetAbilityPlus().GetTalentSpecialValueFor("secret_blade_max_hits");
            }
            this.speed = this.GetAbilityPlus().GetTalentSpecialValueFor("active_speed");
            this.maxDistance = this.GetAbilityPlus().GetTalentSpecialValueFor("active_distance");
            this.distance_left = (this.endPoint - this.caster.GetAbsOrigin() as Vector).Length2D();
            this.direction = (this.endPoint - this.caster.GetAbsOrigin() as Vector).Normalized();
            this.distance_limit = this.maxDistance - (this.endPoint - this.initialPos as Vector).Length2D();
            this.traveled = 0;
            this.secret_blade = this.caster.findBuff<modifier_imba_juggernaut_blade_dance_secret_blade>("modifier_imba_juggernaut_blade_dance_secret_blade");
            this.wind_dance = this.caster.findBuff<modifier_imba_juggernaut_blade_dance_wind_dance>("modifier_imba_juggernaut_blade_dance_wind_dance");
            this.frametime = FrameTime();
            this.caster.FaceTowards(this.endPoint);
            this.initialAngle = this.parent.GetAnglesAsVector();
            this.AddTimer(0.02, () => {
                this.initialAngle = this.parent.GetAnglesAsVector();
            });
            if (this.secret_blade) {
                this.attack_count = this.secret_blade.GetStackCount();
                this.secret_blade.Destroy();
            }
            if (this.caster.HasTalent("special_bonus_imba_juggernaut_5") && this.wind_dance && this.max_attack_count) {
                let secret_blade_extra_hits = math.min(this.wind_dance.GetStackCount() / this.caster.GetTalentValue("special_bonus_imba_juggernaut_5"));
                this.max_attack_count = this.max_attack_count + secret_blade_extra_hits;
                this.wind_dance.Destroy();
            }
            if (!this.BeginMotionOrDestroy()) {
                return;
            }
        }
    }

    SeekAndDestroy() {
        if (IsServer()) {
            let sliceEnemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, 150, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_ANY_ORDER, false);
            let enemy_hit = false;
            for (const [_, enemy] of GameFunc.iPair(sliceEnemies)) {
                if (this.attack_count < 1) {
                    this.Destroy();
                    return;
                }
                enemy_hit = false;
                if (this.enemies_hit) {
                    for (const [_, hit_enemy] of GameFunc.iPair(this.enemies_hit)) {
                        if (hit_enemy == enemy) {
                            enemy_hit = true;
                        }
                    }
                }
                if (!enemy_hit) {
                    enemy.EmitSound("Hero_Juggernaut.BladeFury.Impact");
                    let slash_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_juggernaut/juggernaut_blade_fury_tgt.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy, this.GetCasterPlus());
                    ParticleManager.SetParticleControl(slash_pfx, 0, enemy.GetAbsOrigin());
                    ParticleManager.ReleaseParticleIndex(slash_pfx);
                    this.caster.PerformAttack(enemy, true, true, true, true, false, false, true);
                    this.has_slice_enemy = true;
                    if (this.caster.HasTalent("special_bonus_imba_juggernaut_4")) {
                        this.targetted_enemy = enemy;
                    }
                    this.attack_count = this.attack_count - 1;
                    if (this.enemies_hit) {
                        this.enemies_hit.push(enemy);
                    }
                }
            }
        }
    }
    UpdateHorizontalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            this.direction = (this.endPoint - this.caster.GetAbsOrigin() as Vector).Normalized();
            this.newPoint = this.caster.GetAbsOrigin() + this.direction * this.speed * dt;
            this.distance_travelled = (this.caster.GetAbsOrigin() - this.initialPos as Vector).Length2D();
            this.max_travel_distance = this.maxDistance - this.distance_travelled;
            if (this.distance_left > 100 && this.max_travel_distance > 100) {
                let oldPos = this.caster.GetAbsOrigin();
                this.caster.SetAbsOrigin(this.newPoint);
                this.distance_left = (this.endPoint - this.caster.GetAbsOrigin() as Vector).Length2D();
                this.max_travel_distance = this.distance_left - this.maxDistance;
                let sliceFX = ResHelper.CreateParticleEx("particles/econ/items/juggernaut/bladekeeper_omnislash/dc_juggernaut_omni_slash_rope.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.caster, this.caster);
                ParticleManager.SetParticleControl(sliceFX, 0, oldPos);
                ParticleManager.SetParticleControl(sliceFX, 2, oldPos);
                ParticleManager.SetParticleControl(sliceFX, 3, this.caster.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(sliceFX);
            } else {
                if (this.distance_limit > 0) {
                    this.newPoint = this.endPoint;
                }
                let sliceFX = ResHelper.CreateParticleEx("particles/econ/items/juggernaut/bladekeeper_omnislash/dc_juggernaut_omni_slash_rope.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.caster, this.caster);
                ParticleManager.SetParticleControl(sliceFX, 0, this.caster.GetAbsOrigin());
                ParticleManager.SetParticleControl(sliceFX, 2, this.caster.GetAbsOrigin());
                ParticleManager.SetParticleControl(sliceFX, 3, this.caster.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(sliceFX);
                FindClearSpaceForUnit(this.caster, this.newPoint, true);
                this.caster.FaceTowards(this.newPoint);
                this.caster.SetUnitOnClearGround();
                if (this.attack_count < 1) {
                    this.Destroy();
                }
                if (!this.has_slice_enemy) {
                    if (this.caster.HasTalent("special_bonus_imba_juggernaut_4") && (!this.third_dash_finale)) {
                        if (this.third_dash) {
                            this.SeekAndDestroyPtTweeDecimation();
                            return;
                        }
                        if (!this.second_dash) {
                            this.second_dash = true;
                            this.SeekAndDestroyPtTweeDecimation();
                            return;
                        }
                    } else {
                        this.Destroy();
                        return;
                    }
                } else {
                    this.SeekAndDestroyPtTooAnnihilation();
                }
            }
            this.SeekAndDestroy();
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true
        }
        return state;
    }
    StatusEffectPriority(): modifierpriority {
        return 20;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_omnislash.vpcf";
    }
    SeekAndDestroyPtTooAnnihilation() {
        if (IsServer()) {
            let enemy_hit = false;
            if ((!this.has_slice_enemy)) {
                this.Destroy();
                return;
            }
            for (let i = 0; i < this.max_attack_count; i++) {
                for (const [_, enemy] of GameFunc.iPair(this.enemies_hit)) {
                    if (this.attack_count < 1) {
                        this.Destroy();
                        return;
                    }
                    if (enemy.IsInvisible() || enemy.IsOutOfGame()) {
                        enemy_hit = true;
                    }
                    if (enemy.IsAttackImmune()) {
                        enemy_hit = true;
                    }
                    if (!enemy_hit) {
                        enemy.EmitSound("Hero_Juggernaut.BladeFury.Impact");
                        let slash_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_juggernaut/juggernaut_blade_fury_tgt.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy, this.GetCasterPlus());
                        ParticleManager.SetParticleControl(slash_pfx, 0, enemy.GetAbsOrigin());
                        ParticleManager.ReleaseParticleIndex(slash_pfx);
                        this.caster.PerformAttack(enemy, true, true, true, true, false, false, true);
                        this.attack_count = this.attack_count - 1;
                    }
                }
            }
            if (this.caster.HasTalent("special_bonus_imba_juggernaut_4") && (!this.third_dash_finale) && this.attack_count > 0) {
                if (this.third_dash) {
                    this.SeekAndDestroyPtTweeDecimation();
                    return;
                }
                if (!this.second_dash) {
                    this.second_dash = true;
                    this.SeekAndDestroyPtTweeDecimation();
                    return;
                }
            } else {
                this.Destroy();
                return;
            }
        }
    }
    SeekAndDestroyPtTweeDecimation() {
        if (IsServer()) {
            if (this.attack_count < 1) {
                if (this.second_dash || this.third_dash) {
                    this.caster.SetAbsOrigin(this.newPoint);
                    this.second_dash = false;
                    this.third_dash = false;
                }
                this.caster.SetUnitOnClearGround();
                this.Destroy();
            }
            if ((!this.targetted_enemy)) {
                this.target_position = this.newPoint;
            } else {
                this.target_position = this.targetted_enemy.GetAbsOrigin();
            }
            let direction: Vector;
            let final_location: Vector;
            let set_location: Vector;
            let initialPos = this.caster.GetAbsOrigin();
            if (this.second_dash) {
                this.qangle_angle = 90 + (this.initialAngle).y;
            }
            this.caster.SetAngles(0, this.qangle_angle, 0);
            if (this.second_dash) {
                this.caster.SetAbsOrigin(this.target_position);
                direction = this.caster.GetForwardVector();
                final_location = this.target_position + direction * this.maxDistance * 0.5 as Vector;
                set_location = this.target_position + direction * (-1) * this.maxDistance * 0.5 as Vector;
                this.caster.SetAbsOrigin(set_location);
            } else if (this.third_dash) {
                direction = this.caster.GetForwardVector();
                final_location = initialPos + direction * (-1) * this.maxDistance as Vector;
            }
            this.endPoint = final_location;
            this.initialPos = this.caster.GetAbsOrigin();
            this.attack_count = this.attack_count;
            this.Destroy();
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (this.second_dash) {
                let second_dash_handler = this.caster.AddNewModifier(this.caster, this.GetAbilityPlus(), "modifier_imba_juggernaut_blade_dance_empowered_slice", {}) as modifier_imba_juggernaut_blade_dance_empowered_slice;
                if (second_dash_handler) {
                    second_dash_handler.attack_count = this.attack_count;
                    second_dash_handler.second_dash = false;
                    second_dash_handler.third_dash = true;
                    second_dash_handler.initialPos = this.caster.GetAbsOrigin();
                    second_dash_handler.endPoint = this.endPoint;
                    second_dash_handler.target_position = this.target_position;
                    second_dash_handler.qangle_angle = this.qangle_angle;
                    second_dash_handler.max_attack_count = this.max_attack_count;
                }
                return;
            }
            if (this.third_dash) {
                let third_dash_handler = this.caster.AddNewModifier(this.caster, this.GetAbilityPlus(), "modifier_imba_juggernaut_blade_dance_empowered_slice", {}) as modifier_imba_juggernaut_blade_dance_empowered_slice;
                if (third_dash_handler) {
                    third_dash_handler.attack_count = this.attack_count;
                    third_dash_handler.third_dash = false;
                    third_dash_handler.third_dash_finale = true;
                    third_dash_handler.initialPos = this.caster.GetAbsOrigin();
                    third_dash_handler.endPoint = this.endPoint;
                    third_dash_handler.target_position = this.target_position;
                    third_dash_handler.qangle_angle = this.qangle_angle;
                    third_dash_handler.max_attack_count = this.max_attack_count;
                }
                return;
            }
            if (this.third_dash_finale) {
                if (this.target_position) {
                    this.caster.SetAbsOrigin(this.target_position);
                    this.caster.SetUnitOnClearGround();
                }
            }
            this.enemies_hit = undefined;
        }
    }
}
@registerModifier()
export class modifier_imba_juggernaut_blade_dance_passive extends BaseModifier_Plus {
    public critProc: any;
    IsHidden(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        this.StartIntervalThink(1);
        this.critProc = false;
        this.GetAbilityPlus().GetBehavior = () => {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE;
        }
        this.GetAbilityPlus().GetBehavior();
    }
    OnIntervalThink(): void {
        this.ForceRefresh();
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE)
    CC_GetModifierPreAttack_CriticalStrike(keys: ModifierAttackEvent): number {
        if (this.GetParentPlus().PassivesDisabled()) {
            return undefined;
        }
        if (this.GetAbilityPlus() && keys.attacker == this.GetParentPlus()) {
            this.critProc = false;
            if (GFuncRandom.PRD(this.GetSpecialValueFor("blade_dance_crit_chance"), this)) {
                this.GetParentPlus().StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_ATTACK_EVENT, this.GetParentPlus().GetSecondsPerAttack());
                let crit_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_juggernaut/jugg_crit_blur.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
                ParticleManager.SetParticleControl(crit_pfx, 0, this.GetParentPlus().GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(crit_pfx);
                this.critProc = true;
                this.GetParentPlus().EmitSound("Hero_Juggernaut.BladeDance");
                return this.GetSpecialValueFor("blade_dance_crit_mult");
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent) {
        if (params.attacker == this.GetParentPlus()) {
            this.HandleWindDance(this.critProc);
            if (this.GetAbilityPlus().IsActivated()) {
                this.HandleSecretBlade();
            }
            this.HandleJadeBlossom(this.critProc);
            if (this.critProc == true) {
                let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_juggernaut/juggernaut_crit_tgt.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, params.target, this.GetCasterPlus());
                ParticleManager.SetParticleControl(particle, 0, params.target.GetAbsOrigin());
                if (this.GetCasterPlus().HasModifier("modifier_juggernaut_arcana")) {
                    ParticleManager.SetParticleControl(particle, 1, params.target.GetAbsOrigin());
                    ParticleManager.SetParticleControl(particle, 3, params.target.GetAbsOrigin());
                }
                ParticleManager.ReleaseParticleIndex(particle);
                this.GetParentPlus().EmitSound("Hero_Juggernaut.BladeDance");
                this.critProc = false;
                if (this.GetCasterPlus().HasModifier("modifier_juggernaut_arcana")) {
                    this.AddTimer(FrameTime(), () => {
                        if (params.target.IsRealUnit() && !params.target.IsAlive()) {
                            ArcanaKill(this.GetParentPlus());
                        }
                    });
                }
            }
        }
    }
    HandleWindDance(bCrit: boolean) {
        if (this.GetCasterPlus().IsRealUnit()) {
            if (this.GetCasterPlus().HasModifier("modifier_imba_juggernaut_blade_dance_empowered_slice")) {
                return;
            }
            if (!this.GetCasterPlus().HasModifier("modifier_imba_omni_slash_caster") && !this.GetCasterPlus().HasModifier("modifier_juggernaut_omnislash")) {
                let wind_dance = this.GetCasterPlus().findBuff<modifier_imba_juggernaut_blade_dance_wind_dance>("modifier_imba_juggernaut_blade_dance_wind_dance");
                if (bCrit) {
                    if (!wind_dance) {
                        wind_dance = this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_juggernaut_blade_dance_wind_dance", {
                            duration: this.GetAbilityPlus().GetTalentSpecialValueFor("bonus_duration")
                        }) as modifier_imba_juggernaut_blade_dance_wind_dance;
                    }
                    wind_dance.ForceRefresh();
                } else if (wind_dance) {
                    wind_dance.SetDuration(wind_dance.GetDuration(), true);
                }
            }
        }
    }
    HandleSecretBlade() {
        if (this.GetCasterPlus().IsRealUnit()) {
            if (this.GetCasterPlus().HasModifier("modifier_imba_juggernaut_blade_dance_empowered_slice")) {
                return;
            }
            if (!this.GetCasterPlus().HasModifier("modifier_imba_omni_slash_caster") && !this.GetCasterPlus().HasModifier("modifier_juggernaut_omnislash")) {
                let secret_blade = this.GetCasterPlus().findBuff<modifier_imba_juggernaut_blade_dance_secret_blade>("modifier_imba_juggernaut_blade_dance_secret_blade");
                if (!secret_blade) {
                    secret_blade = this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_juggernaut_blade_dance_secret_blade", {
                        duration: this.GetAbilityPlus().GetTalentSpecialValueFor("secret_blade_duration")
                    }) as modifier_imba_juggernaut_blade_dance_secret_blade;
                }
                secret_blade.ForceRefresh();
            }
        }
    }
    HandleJadeBlossom(bCrit: boolean) {
        if (this.GetCasterPlus().IsRealUnit()) {
            if (bCrit) {
                if (this.GetCasterPlus().HasTalent("special_bonus_imba_juggernaut_8")) {
                    let jade_blossom = this.GetCasterPlus().findBuff<modifier_imba_juggernaut_blade_dance_jade_blossom>("modifier_imba_juggernaut_blade_dance_jade_blossom");
                    if (jade_blossom) {
                        jade_blossom.ForceRefresh();
                    } else {
                        jade_blossom = this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_juggernaut_blade_dance_jade_blossom", {
                            duration: this.GetCasterPlus().GetTalentValue("special_bonus_imba_juggernaut_8", "duration")
                        }) as modifier_imba_juggernaut_blade_dance_jade_blossom;
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_juggernaut_blade_dance_wind_dance extends BaseModifier_Plus {
    public agi: any;
    public ms: any;
    GetTexture(): string {
        return "juggernaut_blade_dance";
    }
    BeCreated(p_0: any,): void {
        this.agi = this.GetAbilityPlus().GetTalentSpecialValueFor("bonus_agi");
        this.ms = this.GetAbilityPlus().GetTalentSpecialValueFor("bonus_ms");
    }
    BeRefresh(p_0: any,): void {
        this.agi = this.GetAbilityPlus().GetTalentSpecialValueFor("bonus_agi");
        this.ms = this.GetAbilityPlus().GetTalentSpecialValueFor("bonus_ms");
        if (IsServer()) {
            this.IncrementStackCount();
            // this.GetParentPlus().CalculateStatBonus(true);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.ms * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.agi * this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_juggernaut_blade_dance_secret_blade extends BaseModifier_Plus {
    GetTexture(): string {
        return "juggernaut_secret_blade";
    }
    BeRefresh(p_0: any,): void {
        if (IsServer()) {
            this.IncrementStackCount();
            // this.GetParentPlus().CalculateStatBonus(true);
        }
    }
    OnStackCountChanged(p_0: number,): void {
        let serverCheck = 0;
        if (IsServer()) {
            // this.GetParentPlus().CalculateStatBonus(true);
            serverCheck = 1;
            if (this.GetStackCount() == this.GetAbilityPlus().GetTalentSpecialValueFor("active_min_stacks")) {
                this.GetParentPlus().EmitSound("Imba.JuggernautLightsaber");
            }
        }
        if (this.GetStackCount() + serverCheck >= this.GetAbilityPlus().GetTalentSpecialValueFor("active_min_stacks") && this.GetAbilityPlus().GetBehavior() != DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE) {
            this.GetAbilityPlus().GetBehavior = () => {
                return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE;
            }
            this.GetAbilityPlus().GetBehavior();
            this.GetAbilityPlus().GetCastRange(this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus());
            this.GetAbilityPlus().GetCooldown(this.GetAbilityPlus().GetLevel());
        } else if (this.GetStackCount() + serverCheck < this.GetAbilityPlus().GetTalentSpecialValueFor("active_min_stacks") && this.GetAbilityPlus().GetBehavior() == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE) {
            this.GetAbilityPlus().GetBehavior = () => {
                return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE;
            }
            this.GetAbilityPlus().GetBehavior();
            this.GetAbilityPlus().GetCastRange(this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus());
            this.GetAbilityPlus().GetCooldown(this.GetAbilityPlus().GetLevel());
        }
    }
    BeRemoved(): void {
        this.GetAbilityPlus().GetBehavior = () => {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE;
        }
        this.GetAbilityPlus().GetBehavior();
        this.GetAbilityPlus().GetCastRange(this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus());
        this.GetAbilityPlus().GetCooldown(this.GetAbilityPlus().GetLevel());
    }
}
@registerModifier()
export class modifier_imba_juggernaut_blade_dance_jade_blossom extends BaseModifier_Plus {
    public duration: number;
    GetTexture(): string {
        return "juggernaut_omni_slash";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.duration = this.GetCasterPlus().GetTalentValue("special_bonus_imba_juggernaut_8", "duration");
            this.NewStack();
        }
    }
    BeRefresh(p_0: any,): void {
        if (IsServer()) {
            this.NewStack();
            this.SetDuration(this.duration, true);
        }
    }
    NewStack() {
        if (IsServer()) {
            this.IncrementStackCount();
            this.AddTimer(this.duration, () => {
                this.ExpiredStack();
            });
        }
    }
    ExpiredStack() {
        if (IsServer()) {
            if ((!this.IsNull())) {
                if (this.GetStackCount() > 0) {
                    this.DecrementStackCount();
                } else {
                    this.Destroy();
                }
            }
        }
    }
}
@registerAbility()
export class imba_juggernaut_omni_slash extends BaseAbility_Plus {
    public omnislash_kill_count: number;
    public caster: IBaseNpc_Plus;
    public target: IBaseNpc_Plus;
    public previous_position: any;
    public current_position: any;
    IsNetherWardStealable() {
        return false;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_juggernaut_omni_slash_cdr";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnOwnerDied(): void {
        if (!this.IsActivated()) {
            this.SetActivated(true);
        }
    }

    OnUpgrade(): void {
        if (this.GetCasterPlus().findAbliityPlus<imba_juggernaut_omni_slash>("imba_juggernaut_omni_slash").GetLevel() == 1) {
            this.omnislash_kill_count = 0;
        }
        // todo juggernaut_omni_slash
        if (this.GetCasterPlus().HasAbility("juggernaut_omni_slash")) {
            this.GetCasterPlus().findAbliityPlus("juggernaut_omni_slash").SetLevel(this.GetLevel());
        }
    }
    OnAbilityPhaseStart(): boolean {
        let caster = this.GetCasterPlus();
        let rand = math.random;
        let im_the_juggernaut_lich = 10;
        let ryujinnokenwokurae = 10;
        if (caster.GetUnitName().includes("juggernaut")) {
            if (RollPercentage(im_the_juggernaut_lich)) {
                caster.EmitSound("juggernaut_jug_rare_17");
            } else if (RollPercentage(im_the_juggernaut_lich)) {
                caster.EmitSound("Imba.JuggernautGenji");
            } else {
                caster.EmitSound("juggernaut_jug_ability_omnislash_0" + rand(3));
            }
        }
        if (caster.HasTalent("special_bonus_imba_juggernaut_9")) {
            this.SetOverrideCastPoint(caster.GetTalentValue("special_bonus_imba_juggernaut_9", "cast_point"));
        }
        return true;
    }
    OnSpellStart(): void {
        this.caster = this.GetCasterPlus();
        this.target = this.GetCursorTarget();
        this.previous_position = this.caster.GetAbsOrigin();
        this.caster.Purge(false, true, false, false, false);
        if (this.caster.HasTalent("special_bonus_imba_juggernaut_7") && !this.IsStolen()) {
            let omnislash_image = BaseNpc_Plus.CreateUnitByName(this.caster.GetUnitName(), this.caster.GetAbsOrigin(), this.caster, true);
            let caster_level = this.caster.GetLevel();
            for (let i = 2; i <= caster_level; i++) {
                // omnislash_image.HeroLevelUp(false);
            }
            for (let ability_id = 0; ability_id <= 15; ability_id++) {
                let ability = omnislash_image.GetAbilityByIndex(ability_id);
                if (ability) {
                    let caster_ability = this.caster.FindAbilityByName(ability.GetAbilityName());
                    if (caster_ability) {
                        ability.SetLevel(caster_ability.GetLevel());
                    }
                }
            }
            for (let item_id = 0; item_id <= 5; item_id++) {
                let item_in_caster = this.caster.GetItemInSlot(item_id);
                if (item_in_caster != undefined) {
                    let item_name = item_in_caster.GetAbilityName();
                    if (!(item_name == "item_smoke_of_deceit" || item_name == "item_ward_observer" || item_name == "item_ward_sentry" || item_name == "item_imba_ironleaf_boots")) {
                        let item_created = BaseItem_Plus.CreateOneOnUnit(omnislash_image, item_in_caster.GetAbilityName());
                        omnislash_image.AddItem(item_created);
                        item_created.SetCurrentCharges(item_in_caster.GetCurrentCharges());
                    }
                }
            }
            let caster_modifiers = this.caster.FindAllModifiers();
            for (const [_, modifier] of GameFunc.iPair(caster_modifiers)) {
                if (modifier.GetName() == "modifier_imba_juggernaut_blade_fury") {
                    let caster_blade_fury_modifier = this.caster.findBuff<modifier_imba_juggernaut_blade_fury>("modifier_imba_juggernaut_blade_fury");
                    let blade_fury_modifier = omnislash_image.AddNewModifier(omnislash_image, modifier.GetAbilityPlus(), modifier.GetName(), {
                        duration: modifier.GetRemainingTime()
                    }) as modifier_imba_juggernaut_blade_fury;
                    if (blade_fury_modifier) {
                        blade_fury_modifier.original_caster = this.caster;
                        blade_fury_modifier.radius = caster_blade_fury_modifier.radius;
                    }
                } else if (modifier) {
                    if (modifier.GetAbilityPlus() && !modifier.GetAbilityPlus().IsPassive()) {
                        omnislash_image.AddNewModifier(modifier.GetCasterPlus(), modifier.GetAbilityPlus(), modifier.GetName(), {
                            duration: modifier.GetRemainingTime()
                        });
                    }
                }
            }
            // omnislash_image.SetAbilityPoints(0);
            omnislash_image.SetHasInventory(false);
            omnislash_image.SetCanSellItems(false);
            this.caster.AddNewModifier(this.caster, this, "modifier_imba_omni_slash_talent", {});
            omnislash_image.AddNewModifier(this.caster, this, "modifier_imba_omni_slash_image", {});
            let omnislash_modifier_handler = omnislash_image.AddNewModifier(this.caster, this, "modifier_imba_omni_slash_caster", {
                duration: this.GetSpecialValueFor("duration") + this.caster.GetTalentValue("special_bonus_imba_juggernaut_10")
            }) as modifier_imba_omni_slash_caster;
            if (omnislash_modifier_handler) {
                omnislash_modifier_handler.original_caster = this.caster;
            }
            FindClearSpaceForUnit(omnislash_image, this.target.GetAbsOrigin() + RandomVector(128) as Vector, false);
            omnislash_image.EmitSound("Hero_Juggernaut.OmniSlash");
            this.AddTimer(FrameTime(), () => {
                if ((!omnislash_image.IsNull())) {
                    AnimationHelper.StartAnimation(omnislash_image, {
                        activity: GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_4,
                        rate: 1.0,
                        duration: 0
                    });
                }
            });
            if (this.target.TriggerSpellAbsorb(this)) {
                return undefined;
            }
            this.AddTimer(FrameTime(), () => {
                if ((!omnislash_image.IsNull())) {
                    this.current_position = omnislash_image.GetAbsOrigin();
                    omnislash_image.PerformAttack(this.target, true, true, true, true, false, false, false);
                    let trail_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_juggernaut/juggernaut_omni_slash_trail.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, omnislash_image, this.GetCasterPlus());
                    ParticleManager.SetParticleControl(trail_pfx, 0, this.previous_position);
                    ParticleManager.SetParticleControl(trail_pfx, 1, this.current_position);
                    ParticleManager.ReleaseParticleIndex(trail_pfx);
                }
            });
        } else {
            let omnislash_modifier_handler = this.caster.AddNewModifier(this.caster, this, "modifier_imba_omni_slash_caster", {
                duration: this.GetSpecialValueFor("duration") + this.caster.GetTalentValue("special_bonus_imba_juggernaut_10")
            }) as modifier_imba_omni_slash_caster;
            if (omnislash_modifier_handler) {
                omnislash_modifier_handler.original_caster = this.caster;
            }
            this.SetActivated(false);
            if (this.caster.HasAbility("imba_juggernaut_blade_fury")) {
                this.caster.findAbliityPlus<imba_juggernaut_blade_fury>("imba_juggernaut_blade_fury").SetActivated(false);
            }
            // this.caster.CenterCameraOnEntity(this.caster);
            FindClearSpaceForUnit(this.caster, this.target.GetAbsOrigin() + RandomVector(128) as Vector, false);
            this.caster.EmitSound("Hero_Juggernaut.OmniSlash");
            AnimationHelper.StartAnimation(this.caster, {
                activity: GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_4,
                rate: 1.0
            });
            this.current_position = this.caster.GetAbsOrigin();
            let trail_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_juggernaut/juggernaut_omni_slash_trail.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.caster, this.caster);
            ParticleManager.SetParticleControl(trail_pfx, 0, this.previous_position);
            ParticleManager.SetParticleControl(trail_pfx, 1, this.current_position);
            ParticleManager.ReleaseParticleIndex(trail_pfx);
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_juggernaut_7") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_juggernaut_7")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_juggernaut_7"), "modifier_special_bonus_imba_juggernaut_7", {});
        }
    }
}
@registerModifier()
export class modifier_imba_omni_slash_image extends BaseModifier_Plus {
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE
        });
    } */
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
        };
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.StartIntervalThink(0.5);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetParentPlus();
        if (!caster.HasModifier("modifier_imba_omni_slash_caster")) {
            this.Destroy();
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        let image_outgoing_damage_percent = (100 - this.GetCasterPlus().GetTalentValue("special_bonus_imba_juggernaut_7")) * (-1);
        return image_outgoing_damage_percent;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT;
    }
}
@registerModifier()
export class modifier_imba_omni_slash_talent extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public hero_agility: any;
    public base_bonus_damage: number;
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE
        });
    } */
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
        }
        return state;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    CC_GetModifierBaseAttack_BonusDamage(): number {
        this.caster = this.GetCasterPlus();
        this.hero_agility = this.caster.GetAgility();
        this.base_bonus_damage = this.GetAbilityPlus().GetTalentSpecialValueFor("bonus_damage_att");
        if (this.hero_agility) {
            let bonus_damage = this.hero_agility * this.base_bonus_damage * 0.01;
            if (this.caster.HasTalent("special_bonus_imba_juggernaut_8")) {
                let jade_blossom = this.caster.findBuff<modifier_imba_juggernaut_blade_dance_jade_blossom>("modifier_imba_juggernaut_blade_dance_jade_blossom");
                if (jade_blossom) {
                    let blossomed_damage = this.hero_agility + jade_blossom.GetStackCount();
                    bonus_damage = blossomed_damage * this.base_bonus_damage * 0.01;
                }
            }
            return bonus_damage;
        }
        return 0;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        let caster_outgoing_damage_percent = (100 - this.GetCasterPlus().GetTalentValue("special_bonus_imba_juggernaut_7", "caster_outgoing_damage")) * (-1);
        return caster_outgoing_damage_percent;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_omnislash.vpcf";
    }
}
@registerModifier()
export class modifier_imba_omni_slash_caster extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public ability: imba_juggernaut_omni_slash;
    public base_bonus_damage: number;
    public last_enemy: any;
    public slash: any;
    public bounce_range: number;
    public hero_agility: any;
    public nearby_enemies: IBaseNpc_Plus[];
    public previous_pos: any;
    public current_pos: any;
    public original_caster: IBaseNpc_Plus;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.ability = this.GetAbilityPlus();
        this.base_bonus_damage = this.GetAbilityPlus().GetTalentSpecialValueFor("bonus_damage_att");
        this.last_enemy = undefined;
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return undefined;
        }
        this.slash = true;
        if (IsServer()) {
            this.AddTimer(FrameTime(), () => {
                if ((!this.parent.IsNull())) {
                    this.bounce_range = this.GetSpecialValueFor("omni_slash_radius");
                    this.hero_agility = this.original_caster.GetAgility();
                    this.GetAbilityPlus().SetRefCountsModifiers(false);
                    this.BounceAndSlaughter(true);
                    let slash_rate = (this.caster.GetSecondsPerAttack() / (math.max(this.GetSpecialValueFor("attack_rate_multiplier"), 1))) / math.max(this.caster.GetTalentValue("special_bonus_imba_juggernaut_9"), 1);
                    this.StartIntervalThink(slash_rate);
                }
            });
        }
    }
    OnIntervalThink(): void {
        this.hero_agility = this.original_caster.GetAgility();
        this.BounceAndSlaughter();
        let slash_rate = (this.caster.GetSecondsPerAttack() / (math.max(this.GetSpecialValueFor("attack_rate_multiplier"), 1))) / math.max(this.caster.GetTalentValue("special_bonus_imba_juggernaut_9"), 1);
        this.StartIntervalThink(-1);
        this.StartIntervalThink(slash_rate);
    }
    BounceAndSlaughter(first_slash = false) {
        let ability = this.GetAbilityPlus<imba_juggernaut_omni_slash>();
        let order = FindOrder.FIND_ANY_ORDER;
        if (first_slash) {
            order = FindOrder.FIND_CLOSEST;
        }
        this.nearby_enemies = FindUnitsInRadius(this.parent.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.bounce_range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, order, false);
        for (let count = GameFunc.GetCount(this.nearby_enemies) - 1; count >= 0; count--) {
            if (this.nearby_enemies[count] && (this.nearby_enemies[count].GetUnitName().includes("undying_zombie") || this.nearby_enemies[count].GetUnitName().includes("elder_titan_ancestral_spirit"))) {
                this.nearby_enemies.splice(count, 1);
            }
        }
        if (GameFunc.GetCount(this.nearby_enemies) >= 1) {
            for (const [_, enemy] of GameFunc.iPair(this.nearby_enemies)) {
                let previous_position = this.parent.GetAbsOrigin();
                FindClearSpaceForUnit(this.parent, enemy.GetAbsOrigin() + RandomVector(100) as Vector, false);
                if (!this.GetAbilityPlus()) {
                    return;
                }
                let current_position = this.parent.GetAbsOrigin();
                this.parent.FaceTowards(enemy.GetAbsOrigin());
                AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), enemy.GetAbsOrigin(), 200, 1, false);
                this.slash = true;
                if (first_slash && enemy.TriggerSpellAbsorb(this.GetAbilityPlus())) {
                    return;
                } else {
                    this.parent.PerformAttack(enemy, true, true, true, true, true, false, false);
                }
                if (enemy.IsConsideredHero() || enemy.IsRoshan() || enemy.GetUnitName() == "npc_dota_mutation_golem") {
                    if (!enemy.IsAlive() && ability.omnislash_kill_count) {
                        ability.omnislash_kill_count = ability.omnislash_kill_count + 1;
                    }
                } else {
                    enemy.Kill(ability, this.original_caster);
                }
                enemy.EmitSound("Hero_Juggernaut.OmniSlash.Damage");
                let hit_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_juggernaut/juggernaut_omni_slash_tgt.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy, this.GetCasterPlus());
                ParticleManager.SetParticleControl(hit_pfx, 0, current_position);
                ParticleManager.SetParticleControl(hit_pfx, 1, current_position);
                ParticleManager.ReleaseParticleIndex(hit_pfx);
                let trail_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_juggernaut/juggernaut_omni_slash_trail.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.parent, this.GetCasterPlus());
                ParticleManager.SetParticleControl(trail_pfx, 0, previous_position);
                ParticleManager.SetParticleControl(trail_pfx, 1, current_position);
                ParticleManager.ReleaseParticleIndex(trail_pfx);
                if (this.last_enemy != enemy) {
                    let dash_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_juggernaut/juggernaut_omni_dash.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.parent, this.GetCasterPlus());
                    ParticleManager.SetParticleControl(dash_pfx, 0, previous_position);
                    ParticleManager.SetParticleControl(dash_pfx, 2, current_position);
                    ParticleManager.ReleaseParticleIndex(dash_pfx);
                }
                this.last_enemy = enemy;
                if (this.parent.HasModifier("modifier_imba_omni_slash_image")) {
                    if ((!this.original_caster.HasModifier("modifier_imba_omni_slash_talent"))) {
                        this.original_caster.AddNewModifier(this.original_caster, this.GetAbilityPlus(), "modifier_imba_omni_slash_talent", {});
                    }
                    this.previous_pos = previous_position;
                    this.current_pos = current_position;
                }
                return;
            }
        } else {
            this.Destroy();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    CC_GetModifierBaseAttack_BonusDamage(): number {
        if (this.hero_agility) {
            let bonus_damage = this.hero_agility * this.base_bonus_damage * 0.01;
            if (this.original_caster.HasTalent("special_bonus_imba_juggernaut_8")) {
                let jade_blossom = this.original_caster.findBuff<modifier_imba_juggernaut_blade_dance_jade_blossom>("modifier_imba_juggernaut_blade_dance_jade_blossom");
                if (jade_blossom) {
                    let blossomed_damage = this.hero_agility + jade_blossom.GetStackCount();
                    bonus_damage = blossomed_damage * this.base_bonus_damage * 0.01;
                }
            }
            return bonus_damage;
        }
        return 0;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage( /** kv */): number {
        return this.GetSpecialValueFor("bonus_damage");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_4;
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.GetAbilityPlus().SetActivated(true);
            if (this.caster.HasModifier("modifier_juggernaut_arcana")) {
                this.AddTimer(0.1, () => {
                    if (this.ability.omnislash_kill_count && this.ability.omnislash_kill_count > 0) {
                        ArcanaKill(this.caster, this.ability.omnislash_kill_count);
                        this.ability.omnislash_kill_count = 0;
                    }
                });
            }
            if (this.caster.HasAbility("imba_juggernaut_blade_fury")) {
                this.caster.findAbliityPlus<imba_juggernaut_blade_fury>("imba_juggernaut_blade_fury").SetActivated(true);
            }
            this.parent.FadeGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_4);
            this.parent.MoveToPositionAggressive(this.parent.GetAbsOrigin());
            if (this.parent.HasModifier("modifier_imba_omni_slash_image")) {
                if (this.parent.HasModifier("modifier_imba_juggernaut_blade_fury")) {
                    this.parent.RemoveModifierByName("modifier_imba_juggernaut_blade_fury");
                }
                if (this.original_caster.HasModifier("modifier_imba_omni_slash_talent")) {
                    this.original_caster.RemoveModifierByName("modifier_imba_omni_slash_talent");
                }
                if (this.previous_pos) {
                    BaseModifier_Plus.CreateBuffThinker(this.original_caster, this.GetAbilityPlus(), "modifier_omnislash_image_afterimage_fade", {
                        duration: 1.0,
                        previous_position_x: this.previous_pos.x,
                        previous_position_y: this.previous_pos.y,
                        previous_position_z: this.previous_pos.z
                    }, this.current_pos, this.original_caster.GetTeamNumber(), false);
                } else {
                    print("No previous pos!");
                }
                this.GetParentPlus().MakeIllusion();
                this.GetParentPlus().RemoveModifierByName("modifier_imba_omni_slash_image");
                for (let item_id = 0; item_id <= 5; item_id++) {
                    let item_in_caster = this.parent.GetItemInSlot(item_id);
                    if (item_in_caster != undefined) {
                        GFuncEntity.SafeDestroyItem(item_in_caster as IBaseItem_Plus);
                    }
                }
                let caster_modifiers = this.parent.FindAllModifiers();
                for (const [_, modifier] of GameFunc.iPair(caster_modifiers)) {
                    if (modifier) {
                        modifier.Destroy();
                    }
                }
                if ((!this.GetParentPlus().IsNull())) {
                    let iparent = this.GetParentPlus();
                    GFuncEntity.SafeDestroyUnit(iparent);
                }
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
        return state;
    }
    StatusEffectPriority(): modifierpriority {
        return 20;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_omnislash.vpcf";
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_omnislash_image_afterimage_fade extends BaseModifier_Plus {
    BeCreated(keys: any): void {
        if (!IsServer()) {
            return;
        }
        let trail_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_juggernaut/juggernaut_omni_slash_trail.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.GetCasterPlus(), this.GetCasterPlus());
        ParticleManager.SetParticleControl(trail_pfx, 0, Vector(keys.previous_position_x, keys.previous_position_y, keys.previous_position_z));
        ParticleManager.SetParticleControl(trail_pfx, 1, this.GetCasterPlus().GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(trail_pfx);
    }
}
@registerModifier()
export class modifier_imba_juggernaut_omni_slash_cdr extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        if (params.attacker == this.GetParentPlus() && params.target.IsRealUnit() && !this.GetAbilityPlus().IsCooldownReady()) {
            let cd = this.GetAbilityPlus().GetCooldownTimeRemaining();
            this.GetAbilityPlus().EndCooldown();
            this.GetAbilityPlus().StartCooldown(cd);
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_juggernaut_7 extends BaseModifier_Plus {
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
export class modifier_juggernaut_arcana extends BaseModifier_Plus {
    public kill_count: number;
    public timer_running: boolean;
    RemoveOnDeath(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return !IsInToolsMode();
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.kill_count = 0;
            this.timer_running = false;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_HERO_KILLED
        });
    } */
    OnIntervalThink(): void {
        if (this.kill_count > 0) {
            this.kill_count = 0;
        }
        this.timer_running = false;
        this.StartIntervalThink(-1);
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_HERO_KILLED)
    CC_OnHeroKilled(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            if (keys.attacker == this.GetParentPlus() && !this.GetParentPlus().HasModifier("modifier_imba_omni_slash_caster")) {
                if (this.timer_running == false) {
                    this.timer_running = true;
                    this.StartIntervalThink(20.0);
                }
                this.kill_count = this.kill_count + 1;
                if (this.kill_count >= 3) {
                    ArcanaKill(this.GetParentPlus());
                }
            }
        }
    }
}
@registerModifier()
export class modifier_juggernaut_arcana_kill extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let table = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS
        }
        return Object.values(table);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        return "arcana_style";
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_OVERRIDE_ARCANA;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.GetParentPlus().EmitSound("Hero_Juggernaut.ArcanaTrigger");
            if (keys.kills == undefined) {
                keys.kills = 0;
            }
            let pfx = ResHelper.CreateParticleEx("particles/econ/items/juggernaut/jugg_arcana/juggernaut_arcana_trigger.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
            ParticleManager.SetParticleControl(pfx, 3, Vector(math.min(keys.kills, 5), 0, 0));
            if (keys.kills > 0) {
                let pfx = ResHelper.CreateParticleEx("particles/econ/items/juggernaut/jugg_arcana/juggernaut_arcana_counter.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetCasterPlus());
                ParticleManager.SetParticleControl(pfx, 1, Vector(10, math.min(keys.kills, 9), 0));
            }
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_juggernaut_2 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_juggernaut_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_juggernaut_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_juggernaut_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_juggernaut_10 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_juggernaut_blade_fury_movement_speed extends BaseModifier_Plus {
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
