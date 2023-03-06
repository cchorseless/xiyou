
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_sly_king_burrow_blast extends BaseAbility_Plus {
    public target_point: any;
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsNetherWardStealable() {
        return false;
    }
    OnSpellStart(): void {
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
        }
        let caster = this.GetCasterPlus();
        let ability = this;
        let target_point = this.GetCursorPosition();
        let sound_cast = "Hero_NyxAssassin.Impale";
        let particle_burrow = "particles/heroes/hero_slyli/sly_king_burrowblast.vpcf";
        let modifier_burrow = "modifier_imba_burrowblast_burrow";
        let burrow_speed = ability.GetSpecialValueFor("speed");
        let burrow_radius = ability.GetSpecialValueFor("radius");
        burrow_radius = burrow_radius + caster.GetTalentValue("special_bonus_imba_sand_king_1");
        EmitSoundOn(sound_cast, caster);
        ProjectileManager.ProjectileDodge(caster);
        let distance = (caster.GetAbsOrigin() - target_point as Vector).Length2D();
        let direction = (target_point - caster.GetAbsOrigin() as Vector).Normalized();
        let particle_burrow_fx = ResHelper.CreateParticleEx(particle_burrow, ParticleAttachment_t.PATTACH_WORLDORIGIN, caster);
        ParticleManager.SetParticleControl(particle_burrow_fx, 0, caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_burrow_fx, 1, target_point);
        let burrow_projectile = {
            Ability: ability,
            vSpawnOrigin: caster.GetAbsOrigin(),
            fDistance: distance,
            fStartRadius: burrow_radius,
            fEndRadius: burrow_radius,
            Source: caster,
            bHasFrontalCone: false,
            bReplaceExisting: false,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            bDeleteOnHit: false,
            vVelocity: direction * burrow_speed * Vector(1, 1, 0) as Vector,
            bProvidesVision: false
        }
        ProjectileManager.CreateLinearProjectile(burrow_projectile);
        this.target_point = target_point;
        caster.SetAbsOrigin(target_point);
        this.AddTimer(FrameTime(), () => {
            ResolveNPCPositions(target_point, 128);
        });
        caster.AddNewModifier(caster, ability, modifier_burrow, {
            duration: this.GetSpecialValueFor("delay_burrow")
        });
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (!target) {
            return undefined;
        }
        if (target.IsMagicImmune()) {
            return undefined;
        }
        let caster = this.GetCasterPlus();
        let ability = this;
        let target_point = this.target_point;
        let modifier_stun = "modifier_stunned";
        let knockback_duration = ability.GetSpecialValueFor("knockback_duration");
        let stun_duration = ability.GetSpecialValueFor("stun_duration");
        let damage = ability.GetSpecialValueFor("damage");
        let max_push_distance = ability.GetSpecialValueFor("max_push_distance");
        let knockup_height = ability.GetSpecialValueFor("knockup_height");
        let knockup_duration = ability.GetSpecialValueFor("knockup_duration");
        let caustic_ability;
        let poison_duration;
        let push_distance = (target.GetAbsOrigin() - target_point as Vector).Length2D();
        if (push_distance > max_push_distance) {
            push_distance = max_push_distance;
        }
        let distance = (target.GetAbsOrigin() - caster.GetAbsOrigin() as Vector).Length2D();
        let direction = (target.GetAbsOrigin() - caster.GetAbsOrigin() as Vector).Normalized();
        let bump_point = caster.GetAbsOrigin() + direction * (distance + 150) as Vector;
        let knockbackProperties = {
            center_x: bump_point.x,
            center_y: bump_point.y,
            center_z: bump_point.z,
            duration: knockup_duration * (1 - target.GetStatusResistance()),
            knockback_duration: knockup_duration * (1 - target.GetStatusResistance()),
            knockback_distance: push_distance,
            knockback_height: knockup_height
        }
        target.RemoveModifierByName("modifier_knockback");
        target.AddNewModifier(target, undefined, "modifier_knockback", knockbackProperties);
        target.AddNewModifier(caster, ability, modifier_stun, {
            duration: stun_duration * (1 - target.GetStatusResistance())
        });
        let damageTable = {
            victim: target,
            attacker: caster,
            damage: damage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            ability: ability
        }
        ApplyDamage(damageTable);
        this.AddTimer(knockup_duration + FrameTime(), () => {
            ResolveNPCPositions(target_point, 128);
        });
    }
}
@registerModifier()
export class modifier_imba_burrowblast_burrow extends BaseModifier_Plus {
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.GetCasterPlus().AddNoDraw();
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true
        }
        return state;
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.GetCasterPlus().RemoveNoDraw();
        }
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
}
@registerAbility()
export class imba_sly_king_frost_gale extends BaseAbility_Plus {
    tempdata: { [k: string]: any } = {}
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        return this.GetSpecialValueFor("cast_range");
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target_loc = this.GetCursorPosition();
            let caster_loc = caster.GetAbsOrigin();
            let set_in_time = this.GetSpecialValueFor("set_in_time");
            let chill_damage = this.GetSpecialValueFor("chill_damage");
            let radius = this.GetSpecialValueFor("radius");
            let projectile_speed = this.GetSpecialValueFor("projectile_speed");
            let projectile_count = this.GetSpecialValueFor("projectile_count");
            let direction: Vector;
            if (target_loc == caster_loc) {
                direction = caster.GetForwardVector();
            } else {
                direction = (target_loc - caster_loc as Vector).Normalized();
            }
            let index = DoUniqueString("index");
            this.tempdata[index] = []
            let travel_distance;
            caster.EmitSound("Hero_Venomancer.VenomousGale");
            for (let i = 0; i < projectile_count; i++) {
                let angle = 360 - (360 / projectile_count) * i;
                let velocity = GFuncVector.RotateVector2D(direction, angle, true);
                travel_distance = this.GetSpecialValueFor("cast_range") + GPropertyCalculate.GetCastRangeBonus(caster);
                let projectile = {
                    Ability: this,
                    EffectName: "particles/heroes/hero_slyli/frost_gale.vpcf",
                    vSpawnOrigin: caster.GetAbsOrigin(),
                    fDistance: travel_distance,
                    fStartRadius: radius,
                    fEndRadius: radius,
                    Source: caster,
                    bHasFrontalCone: true,
                    bReplaceExisting: false,
                    iUnitTargetTeam: this.GetAbilityTargetTeam(),
                    iUnitTargetFlags: this.GetAbilityTargetFlags(),
                    iUnitTargetType: this.GetAbilityTargetType(),
                    fExpireTime: GameRules.GetGameTime() + 10.0,
                    bDeleteOnHit: true,
                    vVelocity: Vector(velocity.x, velocity.y, 0) * projectile_speed as Vector,
                    bProvidesVision: false,
                    ExtraData: {
                        index: index,
                        duration: set_in_time,
                        projectile_count: projectile_count
                    }
                }
                ProjectileManager.CreateLinearProjectile(projectile);
            }
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        let caster = this.GetCasterPlus();
        if (target) {
            let was_hit = false;
            for (const [_, stored_target] of GameFunc.iPair(this.tempdata[ExtraData.index])) {
                if (target == stored_target) {
                    was_hit = true;
                    break;
                }
            }
            if (was_hit) {
                return;
            } else {
                table.insert(this.tempdata[ExtraData.index], target);
            }
            target.AddNewModifier(caster, this, "modifier_imba_frost_gale_setin", {
                duration: ExtraData.duration
            });
            target.EmitSound("Hero_Venomancer.VenomousGaleImpact");
        }
        else {
            this.tempdata[ExtraData.index + "count"] = this.tempdata[ExtraData.index + "count"] || 0;
            this.tempdata[ExtraData.index + "count"] += 1;
            if (this.tempdata[ExtraData.index + "count"] == ExtraData.projectile_count) {
                if ((GameFunc.GetCount(this.tempdata[ExtraData.index]) > 0) && (caster.GetName() == "npc_dota_hero_venomancer")) {
                    caster.EmitSound("venomancer_venm_cast_0" + math.random(1, 2));
                }
                delete this.tempdata[ExtraData.index];
            }
        }
    }
}
@registerModifier()
export class modifier_imba_frost_gale_setin extends BaseModifier_Plus {
    public root_modifier: any;
    public chill_damage: number;
    public minimum_slow: any;
    public maximum_slow: any;
    public chill_duration: number;
    public interval_think: number;
    IsPurgable(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    GetEffectName(): string {
        return "particles/econ/courier/courier_greevil_blue/courier_greevil_blue_ambient_3.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    BeCreated(p_0: any,): void {
        this.root_modifier = "modifier_imba_frost_gale_debuff";
        this.chill_damage = this.GetSpecialValueFor("chill_damage");
        this.minimum_slow = this.GetSpecialValueFor("minimum_slow");
        this.maximum_slow = this.GetSpecialValueFor("maximum_slow");
        this.chill_duration = this.GetSpecialValueFor("chill_duration");
        this.interval_think = 0.5;
        if (IsServer()) {
            this.StartIntervalThink(this.interval_think);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            EmitSoundOn("Hero_Ancient_Apparition.ColdFeetTick", this.GetParentPlus());
            let damage = ApplyDamage({
                victim: this.GetParentPlus(),
                attacker: this.GetCasterPlus(),
                damage: this.chill_damage * this.interval_think,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: this.GetAbilityPlus()
            });
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, this.GetParentPlus(), damage, undefined);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (IsServer()) {
            let duration = this.GetDuration();
            let elapsed = math.floor(this.GetElapsedTime());
            let totalSlow = (this.maximum_slow - this.minimum_slow) / duration * elapsed + this.minimum_slow;
            return totalSlow * -1;
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (this.GetParentPlus().IsAlive() && !this.GetParentPlus().IsMagicImmune()) {
                if (this.GetElapsedTime() >= this.GetDuration()) {
                    let mod = this.GetParentPlus().AddNewModifier(this.GetAbilityPlus().GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_frost_gale_debuff", {
                        duration: this.chill_duration * (1 - this.GetParentPlus().GetStatusResistance())
                    });
                    mod.SetStackCount(this.GetStackCount());
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_frost_gale_debuff extends BaseModifier_Plus {
    public chill_damage: number;
    public tick_interval_base: number;
    public tick_interval: number;
    IsPurgable(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    GetTexture(): string {
        return "sly_king_frost_gale";
    }
    GetEffectName(): string {
        return "particles/hero/sly_king/sly_king_frost_gale_freeze.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
        return state;
    }
    BeCreated(p_0: any,): void {
        this.chill_damage = this.GetSpecialValueFor("chill_damage");
        this.tick_interval_base = this.GetSpecialValueFor("tick_interval");
        if (IsServer()) {
            this.tick_interval = this.tick_interval_base * (1 - this.GetParentPlus().GetStatusResistance());
            this.StartIntervalThink(this.tick_interval);
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), undefined, "modifier_rooted", {
                duration: this.GetSpecialValueFor("chill_duration") * (1 - this.GetParentPlus().GetStatusResistance())
            });
            this.GetParentPlus().EmitSound("Hero_Crystal.Frostbite");
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let damage_per_tick = this.chill_damage * this.tick_interval_base;
            ApplyDamage({
                victim: this.GetParentPlus(),
                attacker: this.GetCasterPlus(),
                damage: damage_per_tick,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            });
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, this.GetParentPlus(), damage_per_tick, undefined);
        }
    }
}
@registerAbility()
export class imba_sly_king_frozen_skin extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_frozen_skin_passive";
    }
}
@registerModifier()
export class modifier_imba_frozen_skin_passive extends BaseModifier_Plus {
    public frostbite_modifier: any;
    public chance: number;
    public duration: number;
    public stun_duration: number;
    public prng: any;
    public damage: number;
    public armor: any;
    public reduction_duration: number;
    BeCreated(p_0: any,): void {
        this.frostbite_modifier = "modifier_imba_frozen_skin_debuff";
        this.chance = this.GetSpecialValueFor("chance");
        this.duration = this.GetSpecialValueFor("duration");
        this.stun_duration = this.GetSpecialValueFor("stun_duration");
        this.prng = -10;
    }
    BeRefresh(p_0: any,): void {
        this.chance = this.GetSpecialValueFor("chance");
        this.damage = this.GetSpecialValueFor("damage");
        this.duration = this.GetSpecialValueFor("duration");
        this.armor = this.GetSpecialValueFor("bonus_armor");
        this.reduction_duration = this.GetSpecialValueFor("reduction_duration");
    }
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
        if (IsServer()) {
            if (params.target == this.GetParentPlus()) {
                if (this.GetCasterPlus().PassivesDisabled() || params.attacker.IsBuilding() || params.attacker.IsMagicImmune()) {
                    return;
                }
                if (GFuncRandom.PRD(this.chance, this)) {
                    params.attacker.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_stunned", {
                        duration: this.stun_duration
                    });
                    params.attacker.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), this.frostbite_modifier, {
                        duration: this.duration
                    });
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_frozen_skin_debuff extends BaseModifier_Plus {
    public damage_interval: number;
    public damage_per_second: number;
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return true;
    }
    IsPurgeException(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        };
    }
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.damage_interval = this.GetSpecialValueFor("damage_interval") * (1 - this.GetParentPlus().GetStatusResistance());
            this.damage_per_second = this.GetSpecialValueFor("damage_per_second");
            this.OnIntervalThink();
            this.GetParentPlus().EmitSound("Hero_Crystal.Frostbite");
            this.StartIntervalThink(this.damage_interval);
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), undefined, "modifier_rooted", {
                duration: this.GetSpecialValueFor("duration") * (1 - this.GetParentPlus().GetStatusResistance())
            });
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let tick_damage = this.damage_per_second * this.damage_interval;
            ApplyDamage({
                attacker: this.GetCasterPlus(),
                victim: this.GetParentPlus(),
                ability: this.GetAbilityPlus(),
                damage: tick_damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            });
        }
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_crystalmaiden/maiden_frostbite_buff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerAbility()
export class imba_sly_king_hypothermic_wisdom extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_sly_king_hypothermic_wisdom";
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_unique_sly_king_1") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_unique_sly_king_1")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_special_bonus_imba_unique_sly_king_1", {});
        }
    }
}
@registerModifier()
export class modifier_imba_sly_king_hypothermic_wisdom extends BaseModifier_Plus {
    public int_modifier: any;
    IsHidden(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.int_modifier = this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_sly_king_hypothermic_wisdom_int_tracker", {});
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.int_modifier) {
            this.int_modifier.Destroy();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        if (!this.GetParentPlus().PassivesDisabled() && this.GetParentPlus().GetHealthPercent() > 0) {
            let talent_value = 0;
            if (this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_unique_sly_king_1")) {
                talent_value = this.GetParentPlus().findBuffStack("modifier_special_bonus_imba_unique_sly_king_1", this.GetParentPlus()) / 100;
            }
            return (100 - this.GetParentPlus().GetHealthPercent()) * (this.GetSpecialValueFor("int_per_health_pct_loss") + talent_value);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        if (this.GetParentPlus().HasModifier("modifier_imba_sly_king_hypothermic_wisdom_int_tracker") && !this.GetParentPlus().PassivesDisabled() && this.GetParentPlus().GetHealthPercent() > 0) {
            return this.GetParentPlus().findBuffStack("modifier_imba_sly_king_hypothermic_wisdom_int_tracker", this.GetParentPlus()) * this.GetSpecialValueFor("spell_amp_per_int");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        if (!this.GetParentPlus().PassivesDisabled() && this.GetParentPlus().GetHealthPercent() > 0 && this.GetCasterPlus().HasScepter()) {
            return (100 - this.GetParentPlus().GetHealthPercent()) * (this.GetSpecialValueFor("armor_per_health_pct_loss"));
        }
    }
}
@registerModifier()
export class modifier_imba_sly_king_hypothermic_wisdom_int_tracker extends BaseModifier_Plus {
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
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        this.SetStackCount(this.GetParentPlus().GetIntellect());
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().PassivesDisabled() || this.GetParentPlus().GetHealthPercent() == 0) {
            this.GetParentPlus().SetRenderColor(255, 255, 255);
        } else {
            this.GetParentPlus().SetRenderColor((this.GetParentPlus().GetHealthPercent() / 100) * 255, (this.GetParentPlus().GetHealthPercent() / 100) * 255, (this.GetParentPlus().GetHealthPercent() / 100) * 255);
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_unique_sly_king_1 extends BaseModifier_Plus {
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
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(this.GetParentPlus().findAbliityPlus("special_bonus_imba_unique_sly_king_1").GetSpecialValueFor("value") * 100);
    }
}
@registerAbility()
export class imba_sly_king_winterbringer extends BaseAbility_Plus {
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_DISABLED;
    }
    GetPlaybackRateOverride(): number {
        return 0.01;
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnSpellStart(): void {
        let sound_cast = "Hero_KeeperOfTheLight.Illuminate.Charge";
        let duration = this.GetSpecialValueFor("duration") - this.GetSpecialValueFor("pulse_interval");
        let radius = this.GetSpecialValueFor("radius");
        EmitSoundOnLocationWithCaster(this.GetCasterPlus().GetAbsOrigin(), sound_cast, this.GetCasterPlus());
        CreateModifierThinker(this.GetCasterPlus(), this, "modifier_imba_winterbringer_pulse", {
            duration: duration
        }, this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus().GetTeamNumber(), false);
    }
}
@registerModifier()
export class modifier_imba_winterbringer_pulse extends BaseModifier_Plus {
    public sound_channeling: any;
    public sound_wave_1: any;
    public sound_wave_2: any;
    public particle_epicenter: any;
    public modifier_slow: any;
    public damage: number;
    public slow_duration: number;
    public radius: number;
    public pull_speed: number;
    public pulse_interval: number;
    public pos: any;
    public pulse_talent: any;
    public wave_fx_played: any;
    public pull_radius: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.sound_channeling = "Hero_KeeperOfTheLight.Illuminate.Charge";
            this.sound_wave_1 = "Hero_Crystal.CrystalNova";
            this.sound_wave_2 = "Hero_Crystal.CrystalNova.Yulsaria";
            this.particle_epicenter = "particles/units/heroes/hero_sly_king/sly_king_epicenter.vpcf";
            this.modifier_slow = "modifier_imba_winterbringer_slow";
            this.damage = this.GetSpecialValueFor("damage");
            this.slow_duration = this.GetSpecialValueFor("slow_duration");
            this.radius = this.GetSpecialValueFor("radius");
            this.pull_speed = this.GetSpecialValueFor("pull_speed");
            this.pulse_interval = this.GetSpecialValueFor("pulse_interval");
            this.pos = this.GetCasterPlus().GetAbsOrigin();
            this.pulse_talent = this.GetCasterPlus().findAbliityPlus("special_bonus_imba_unique_sly_king_2");
            if (this.pulse_talent && this.pulse_talent.IsTrained()) {
                this.pulse_interval = this.pulse_interval - this.pulse_talent.GetSpecialValueFor("value");
            }
            this.wave_fx_played = 0;
            EmitSoundOn(this.sound_channeling, this.GetCasterPlus());
            this.OnIntervalThink();
            this.StartIntervalThink(this.pulse_interval);
            this.AddTimer(5, () => {
                EmitSoundOn(this.sound_channeling, this.GetCasterPlus());
            });
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            this.pull_radius = this.radius;
            let particle = ResHelper.CreateParticleEx("particles/heroes/hero_slyli/ice_route.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
            ParticleManager.SetParticleControl(particle, 0, this.pos);
            ParticleManager.SetParticleControl(particle, 1, Vector(this.radius, this.radius, this.radius));
            if (this.wave_fx_played) {
                EmitSoundOn(this.sound_wave_2, this.GetCasterPlus());
            } else {
                EmitSoundOn(this.sound_wave_1, this.GetCasterPlus());
            }
            let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.pos, undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let damageTable = {
                    victim: enemy,
                    attacker: this.GetCasterPlus(),
                    damage: this.damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    ability: this.GetAbilityPlus()
                }
                ApplyDamage(damageTable);
                enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), this.modifier_slow, {
                    duration: this.slow_duration * (1 - enemy.GetStatusResistance())
                });
            }
            enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.pos, undefined, this.pull_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let distance = (enemy.GetAbsOrigin() - this.pos as Vector).Length2D();
                let direction = (enemy.GetAbsOrigin() - this.pos as Vector).Normalized();
                if ((distance - this.pull_speed) > 50) {
                    let pull_point = this.pos + direction * (distance - this.pull_speed);
                    enemy.SetAbsOrigin(pull_point);
                    this.AddTimer(FrameTime(), () => {
                        ResolveNPCPositions(pull_point, 64);
                    });
                }
            }
        }
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
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_winterbringer_slow extends BaseModifier_Plus {
    public ms_slow_pct: number;
    public as_slow: any;
    BeCreated(p_0: any,): void {
        this.ms_slow_pct = this.GetSpecialValueFor("ms_slow_pct");
        this.as_slow = this.GetSpecialValueFor("as_slow");
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.ms_slow_pct * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.as_slow * (-1);
    }
}
@registerModifier()
export class modifier_special_bonus_imba_sly_king_2 extends BaseModifier_Plus {
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
