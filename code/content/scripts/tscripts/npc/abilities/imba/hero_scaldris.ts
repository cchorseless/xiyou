
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
function AntipodeColorChange(caster: IBaseNpc_Plus, fire: boolean, ice: boolean) {
    let antipode_modifier = caster.FindModifierByName("modifier_imba_antipode_passive") as modifier_imba_antipode_passive;
    if (fire) {
        antipode_modifier.fire_strength = antipode_modifier.fire_strength + 1;
        antipode_modifier.AddTimer(5.0, () => {
            antipode_modifier.fire_strength = antipode_modifier.fire_strength - 1;
        });
    }
    if (ice) {
        antipode_modifier.ice_strength = antipode_modifier.ice_strength + 1;
        antipode_modifier.AddTimer(5.0, () => {
            antipode_modifier.ice_strength = antipode_modifier.ice_strength - 1;
        });
    }
}
function AntipodeFireProc(caster: IBaseNpc_Plus, target: IBaseNpc_Plus) {
    let actual_damage = 0;
    if (target.FindModifierByName("modifier_imba_cold_front_dps")) {
        let modifier = target.FindModifierByName("modifier_imba_cold_front_dps") as modifier_imba_cold_front_dps;
        actual_damage = actual_damage + ApplyDamage({
            victim: target,
            attacker: caster,
            damage: modifier.dps * math.ceil(modifier.GetRemainingTime()),
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
        });
        target.RemoveModifierByName("modifier_imba_cold_front_dps");
    }
    if (target.FindModifierByName("modifier_imba_freeze_dps")) {
        let modifier = target.FindModifierByName("modifier_imba_freeze_dps") as modifier_imba_freeze_dps;
        actual_damage = actual_damage + ApplyDamage({
            victim: target,
            attacker: caster,
            damage: modifier.dps * math.ceil(modifier.GetRemainingTime()),
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
        });
        target.RemoveModifierByName("modifier_imba_freeze_dps");
    }
    if (target.FindModifierByName("modifier_imba_ice_floes_dps")) {
        let modifier = target.FindModifierByName("modifier_imba_ice_floes_dps") as modifier_imba_ice_floes_dps;
        actual_damage = actual_damage + ApplyDamage({
            victim: target,
            attacker: caster,
            damage: modifier.dps * math.ceil(modifier.GetRemainingTime()),
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
        });
        target.RemoveModifierByName("modifier_imba_ice_floes_dps");
    }
    if (target.FindModifierByName("modifier_imba_absolute_zero_dps")) {
        let modifier = target.FindModifierByName("modifier_imba_absolute_zero_dps") as modifier_imba_absolute_zero_dps;
        actual_damage = actual_damage + ApplyDamage({
            victim: target,
            attacker: caster,
            damage: modifier.dps * math.ceil(modifier.GetRemainingTime()),
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
        });
        target.RemoveModifierByName("modifier_imba_absolute_zero_dps");
    }
    if (actual_damage > 0) {
        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_DAMAGE, target, actual_damage, undefined);
    }
}
function AntipodeIceProc(caster: IBaseNpc_Plus, target: IBaseNpc_Plus) {
    let actual_damage = 0;
    if (target.FindModifierByName("modifier_imba_heatwave_dps")) {
        let modifier = target.FindModifierByName("modifier_imba_heatwave_dps") as modifier_imba_heatwave_dps;
        actual_damage = actual_damage + ApplyDamage({
            victim: target,
            attacker: caster,
            damage: modifier.dps * math.ceil(modifier.GetRemainingTime()),
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
        });
        target.RemoveModifierByName("modifier_imba_heatwave_dps");
    }
    if (target.FindModifierByName("modifier_imba_scorch_dps")) {
        let modifier = target.FindModifierByName("modifier_imba_scorch_dps") as modifier_imba_scorch_dps;
        actual_damage = actual_damage + ApplyDamage({
            victim: target,
            attacker: caster,
            damage: modifier.dps * math.ceil(modifier.GetRemainingTime()),
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
        });
        target.RemoveModifierByName("modifier_imba_scorch_dps");
    }
    if (target.FindModifierByName("modifier_imba_jet_blaze_dps")) {
        let modifier = target.FindModifierByName("modifier_imba_jet_blaze_dps") as modifier_imba_jet_blaze_dps;
        actual_damage = actual_damage + ApplyDamage({
            victim: target,
            attacker: caster,
            damage: modifier.dps * math.ceil(modifier.GetRemainingTime()),
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
        });
        target.RemoveModifierByName("modifier_imba_jet_blaze_dps");
    }
    if (target.FindModifierByName("modifier_imba_living_flame_dps")) {
        let modifier = target.FindModifierByName("modifier_imba_living_flame_dps") as modifier_imba_living_flame_dps;
        LivingFlameSpreadAttempt(modifier);
        target.RemoveModifierByName("modifier_imba_living_flame_dps");
        actual_damage = actual_damage + ApplyDamage({
            victim: target,
            attacker: caster,
            damage: modifier.dps * math.ceil(modifier.GetRemainingTime()),
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
        });
    }
    if (actual_damage > 0) {
        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_DAMAGE, target, actual_damage, undefined);
    }
}

function LivingFlameSpreadAttempt(modifier: modifier_imba_living_flame_dps) {
    let enemies = FindUnitsInRadius(modifier.GetCaster().GetTeamNumber(), modifier.GetParent().GetAbsOrigin(), undefined, modifier.jump_radius,
        DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
        DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
        DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
    for (const enemy of (enemies as IBaseNpc_Plus[])) {
        if (enemy != modifier.GetParentPlus()) {
            modifier.GetParent().EmitSound("Scaldris.LivingFlame.Spread");
            let spread_pfx = ParticleManager.CreateParticle("particles/hero/scaldris/living_flame.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy);
            ParticleManager.SetParticleControlEnt(spread_pfx, 0, modifier.GetParent(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", modifier.GetParent().GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(spread_pfx, 1, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(spread_pfx);
            enemy.AddNewModifier(modifier.GetCaster(), modifier.GetAbility(), "modifier_imba_living_flame_dps", {
                duration: modifier.GetDuration(),
                jump_radius: modifier.jump_radius,
                dps: modifier.dps
            });
            return;
        }
    }
}
@registerAbility()
export class imba_scaldris_antipode extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return false;
    }
    IsStealable(): boolean {
        return false;
    }
    IsNetherWardStealable() {
        return false;
    }
    IsInnateAbility() {
        return true;
    }
    GetAbilityTextureName(): string {
        return "scaldris_antipode";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_antipode_passive";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasScepter()) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE;
        }
    }
    ScepterSwap(ability1: string, ability2: string) {
        let caster = this.GetCasterPlus();
        let active_ability = ability1;
        if (caster.FindAbilityByName(ability1) && caster.FindAbilityByName(ability2)) {
            if (caster.FindAbilityByName(ability1).IsHidden()) {
                caster.SwapAbilities(ability1, ability2, true, false);
            } else {
                caster.SwapAbilities(ability1, ability2, false, true);
                active_ability = ability2;
            }
        }
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let antipode_modifier = caster.findBuff<modifier_imba_antipode_passive>("modifier_imba_antipode_passive");
        if (antipode_modifier) {
            this.ScepterSwap("imba_scaldris_heatwave", "imba_scaldris_cold_front");
            this.ScepterSwap("imba_scaldris_scorch", "imba_scaldris_freeze");
            this.ScepterSwap("imba_scaldris_jet_blaze", "imba_scaldris_ice_floes");
            this.ScepterSwap("imba_scaldris_living_flame", "imba_scaldris_absolute_zero");
        }
        let particle = ResHelper.CreateParticleEx("particles/econ/items/doom/doom_ti8_immortal_arms/doom_ti8_immortal_devour_ring.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
        ParticleManager.ReleaseParticleIndex(particle);
    }
}
@registerModifier()
export class modifier_imba_antipode_passive extends BaseModifier_Plus {
    public fire_strength: any;
    public ice_strength: any;
    public last_ability_cast: any;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.fire_strength = 0;
            this.ice_strength = 0;
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus().IsStolen()) {
                this.GetParentPlus().SetRenderColor(63 + math.min(this.fire_strength, 4) * 48, 64, 63 + math.min(this.ice_strength, 4) * 48);
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST,
            2: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(keys: ModifierAbilityEvent): void {
        if (keys.unit == this.GetParentPlus() && !keys.ability.IsItem() && !keys.ability.IsToggle()) {
            this.last_ability_cast = keys.ability;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (keys.attacker == this.GetParentPlus() && this.GetCasterPlus().HasScepter() && keys.unit.IsRealUnit() && this.last_ability_cast && !this.last_ability_cast.IsNull() && this.GetParentPlus().HasAbility(this.last_ability_cast.GetName())) {
            this.last_ability_cast.EndCooldown();
        }
    }
}
@registerAbility()
export class imba_scaldris_heatwave extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return true;
    }
    GetAbilityTextureName(): string {
        return "scaldris_heatwave";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_antipode_passive";
    }
    GetAssociatedSecondaryAbilities(): string {
        return "imba_scaldris_cold_front";
    }
    OnUpgrade(): void {
        if (IsServer()) {
            if (this.GetCasterPlus().findAbliityPlus<imba_scaldris_cold_front>("imba_scaldris_cold_front")) {
                let paired_ability = this.GetCasterPlus().findAbliityPlus<imba_scaldris_cold_front>("imba_scaldris_cold_front");
                if (paired_ability.GetLevel() < this.GetLevel()) {
                    paired_ability.SetLevel(this.GetLevel());
                }
            }
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let caster_loc = caster.GetAbsOrigin();
            let target_loc = this.GetCursorPosition();
            if (target_loc == caster_loc) {
                target_loc = caster_loc + caster.GetForwardVector() * 100 as Vector;
            }
            let direction = (target_loc - caster_loc as Vector).Normalized();
            let wave_radius = this.GetSpecialValueFor("wave_radius");
            let wave_speed = this.GetSpecialValueFor("wave_speed");
            let wave_distance = this.GetSpecialValueFor("wave_distance") + GPropertyCalculate.GetCastRangeBonus(caster);
            AntipodeColorChange(caster, true, false);
            caster.EmitSound("Hero_Invoker.DeafeningBlast");
            caster.SwapAbilities("imba_scaldris_heatwave", "imba_scaldris_cold_front", false, true);
            let wave_projectile: CreateLinearProjectileOptions = {
                Ability: this,
                EffectName: "particles/hero/scaldris/heatwave.vpcf",
                vSpawnOrigin: caster_loc + Vector(0, 0, 100) as Vector,
                fDistance: wave_distance,
                fStartRadius: wave_radius,
                fEndRadius: wave_radius,
                Source: caster,
                bHasFrontalCone: true,
                // bReplaceExisting: false,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                fExpireTime: GameRules.GetGameTime() + 10.0,
                // bDeleteOnHit: false,
                vVelocity: Vector(direction.x, direction.y, 0) * wave_speed as Vector,
                bProvidesVision: true,
                iVisionRadius: wave_radius + 150,
                iVisionTeamNumber: caster.GetTeamNumber()
            }
            ProjectileManager.CreateLinearProjectile(wave_projectile);
        }
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (IsServer()) {
            if (target) {
                target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_heatwave_dps", {
                    duration: this.GetSpecialValueFor("duration"),
                    dps: this.GetSpecialValueFor("dps")
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_heatwave_dps extends BaseModifier_Plus {
    public dps: any;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    IgnoreTenacity() {
        return true;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.dps = keys.dps;
            AntipodeFireProc(this.GetCasterPlus(), this.GetParentPlus());
            this.StartIntervalThink(1.0);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let actual_damage = ApplyDamage({
                victim: this.GetParentPlus(),
                attacker: this.GetCasterPlus(),
                ability: this.GetAbilityPlus(),
                damage: this.dps,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            });
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, this.GetParentPlus(), actual_damage, undefined);
        }
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_jakiro/jakiro_liquid_fire_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerAbility()
export class imba_scaldris_cold_front extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return true;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return true;
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("blast_radius");
    }
    GetAbilityTextureName(): string {
        return "scaldris_cold_front";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_antipode_passive";
    }
    GetAssociatedPrimaryAbilities(): string {
        return "imba_scaldris_heatwave";
    }
    OnUpgrade(): void {
        if (IsServer()) {
            if (this.GetCasterPlus().findAbliityPlus<imba_scaldris_heatwave>("imba_scaldris_heatwave")) {
                let paired_ability = this.GetCasterPlus().findAbliityPlus<imba_scaldris_heatwave>("imba_scaldris_heatwave");
                if (paired_ability.GetLevel() < this.GetLevel()) {
                    paired_ability.SetLevel(this.GetLevel());
                }
            }
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let caster_loc = caster.GetAbsOrigin();
            let target_loc = this.GetCursorPosition();
            if (target_loc == caster_loc) {
                target_loc = caster_loc + caster.GetForwardVector() * 100 as Vector;
            }
            let direction = (target_loc - caster_loc as Vector).Normalized();
            let distance = (target_loc - caster_loc as Vector).Length2D();
            let projectile_speed = this.GetSpecialValueFor("projectile_speed");
            AntipodeColorChange(caster, false, true);
            caster.EmitSound("Scaldris.ColdFrontLaunch");
            caster.SwapAbilities("imba_scaldris_heatwave", "imba_scaldris_cold_front", true, false);
            let ice_projectile = {
                Ability: this,
                EffectName: "particles/hero/scaldris/ice_spell_projectile.vpcf",
                vSpawnOrigin: caster_loc + Vector(0, 0, 100) as Vector,
                fDistance: distance,
                fStartRadius: 0,
                fEndRadius: 0,
                Source: caster,
                bHasFrontalCone: true,
                bReplaceExisting: false,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                fExpireTime: GameRules.GetGameTime() + 10.0,
                bDeleteOnHit: false,
                vVelocity: Vector(direction.x, direction.y, 0) * projectile_speed as Vector,
                bProvidesVision: false,
                ExtraData: {
                    x: target_loc.x,
                    y: target_loc.y
                }
            }
            ProjectileManager.CreateLinearProjectile(ice_projectile);
        }
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (IsServer()) {
        }
    }
    OnProjectileThink_ExtraData(location: Vector, extra_data: any): void {
        if (IsServer()) {
            if ((location - Vector(extra_data.x, extra_data.y, location.z) as Vector).Length2D() <= 16) {
                this.GetCasterPlus().EmitSound("Scaldris.ColdFrontImpact");
                AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), location, this.GetSpecialValueFor("blast_radius") + 200, 3.0, false);
                let blast_pfx = ResHelper.CreateParticleEx("particles/hero/scaldris/cold_front_blast.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
                ParticleManager.SetParticleControl(blast_pfx, 0, location + Vector(0, 0, 100) as Vector);
                ParticleManager.SetParticleControl(blast_pfx, 3, location + Vector(0, 0, 100) as Vector);
                ParticleManager.ReleaseParticleIndex(blast_pfx);
                let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), location, undefined, this.GetSpecialValueFor("blast_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_cold_front_root", {
                        duration: this.GetSpecialValueFor("root_duration") * (1 - enemy.GetStatusResistance())
                    });
                    enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_cold_front_dps", {
                        duration: this.GetSpecialValueFor("damage_duration"),
                        dps: this.GetSpecialValueFor("dps")
                    });
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_cold_front_root extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        }
        return state;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_crystalmaiden/maiden_frostbite_buff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerModifier()
export class modifier_imba_cold_front_dps extends BaseModifier_Plus {
    public dps: any;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    IgnoreTenacity() {
        return true;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.dps = keys.dps;
            AntipodeIceProc(this.GetCasterPlus(), this.GetParentPlus());
            this.StartIntervalThink(1.0);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let actual_damage = ApplyDamage({
                victim: this.GetParentPlus(),
                attacker: this.GetCasterPlus(),
                ability: this.GetAbilityPlus(),
                damage: this.dps,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            });
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, this.GetParentPlus(), actual_damage, undefined);
        }
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_frost_lich.vpcf";
    }
}
@registerAbility()
export class imba_scaldris_scorch extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return true;
    }
    GetAbilityTextureName(): string {
        return "scaldris_scorch";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_antipode_passive";
    }
    GetAssociatedSecondaryAbilities(): string {
        return "imba_scaldris_freeze";
    }
    OnUpgrade(): void {
        if (IsServer()) {
            if (this.GetCasterPlus().findAbliityPlus<imba_scaldris_freeze>("imba_scaldris_freeze")) {
                let paired_ability = this.GetCasterPlus().findAbliityPlus<imba_scaldris_freeze>("imba_scaldris_freeze");
                if (paired_ability.GetLevel() < this.GetLevel()) {
                    paired_ability.SetLevel(this.GetLevel());
                }
            }
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let caster_loc = caster.GetAbsOrigin();
            let effect_radius = this.GetSpecialValueFor("effect_radius");
            AntipodeColorChange(caster, true, false);
            caster.EmitSound("Scaldris.Scorch");
            caster.SwapAbilities("imba_scaldris_scorch", "imba_scaldris_freeze", false, true);
            AddFOWViewer(caster.GetTeamNumber(), caster_loc, effect_radius, 3.0, false);
            let scorch_pfx = ResHelper.CreateParticleEx("particles/hero/scaldris/scorch.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
            ParticleManager.SetParticleControl(scorch_pfx, 0, caster_loc + Vector(0, 0, 25) as Vector);
            ParticleManager.SetParticleControl(scorch_pfx, 1, Vector(effect_radius, 1, 1));
            this.AddTimer(0.45, () => {
                ParticleManager.DestroyParticle(scorch_pfx, false);
                ParticleManager.ReleaseParticleIndex(scorch_pfx);
            });
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster_loc, undefined, effect_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                enemy.AddNewModifier(caster, this, "modifier_imba_scorch_blind", {
                    duration: this.GetSpecialValueFor("blind_duration") * (1 - enemy.GetStatusResistance())
                });
                enemy.AddNewModifier(caster, this, "modifier_imba_scorch_dps", {
                    duration: this.GetSpecialValueFor("duration"),
                    dps: this.GetSpecialValueFor("dps")
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_scorch_blind extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MISS_PERCENTAGE)
    CC_GetModifierMiss_Percentage(): number {
        return this.GetSpecialValueFor("blind_amount");
    }
    GetEffectName(): string {
        return "particles/hero/scaldris/scorch_blind.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
}
@registerModifier()
export class modifier_imba_scorch_dps extends BaseModifier_Plus {
    public dps: any;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    IgnoreTenacity() {
        return true;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.dps = keys.dps;
            AntipodeFireProc(this.GetCasterPlus(), this.GetParentPlus());
            this.StartIntervalThink(1.0);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let actual_damage = ApplyDamage({
                victim: this.GetParentPlus(),
                attacker: this.GetCasterPlus(),
                ability: this.GetAbilityPlus(),
                damage: this.dps,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            });
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, this.GetParentPlus(), actual_damage, undefined);
        }
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_jakiro/jakiro_liquid_fire_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerAbility()
export class imba_scaldris_freeze extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return true;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return true;
    }
    GetAbilityTextureName(): string {
        return "scaldris_freeze";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_antipode_passive";
    }
    GetAssociatedPrimaryAbilities(): string {
        return "imba_scaldris_scorch";
    }
    OnUpgrade(): void {
        if (IsServer()) {
            if (this.GetCasterPlus().findAbliityPlus<imba_scaldris_scorch>("imba_scaldris_scorch")) {
                let paired_ability = this.GetCasterPlus().findAbliityPlus<imba_scaldris_scorch>("imba_scaldris_scorch");
                if (paired_ability.GetLevel() < this.GetLevel()) {
                    paired_ability.SetLevel(this.GetLevel());
                }
            }
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let caster_loc = caster.GetAbsOrigin();
            let target_loc = this.GetCursorPosition();
            if (target_loc == caster_loc) {
                target_loc = caster_loc + caster.GetForwardVector() * 100 as Vector;
            }
            let direction = (target_loc - caster_loc as Vector).Normalized();
            let initial_radius = this.GetSpecialValueFor("initial_radius");
            let final_radius = this.GetSpecialValueFor("final_radius");
            let wave_speed = this.GetSpecialValueFor("wave_speed");
            let wave_distance = this.GetSpecialValueFor("wave_distance") + GPropertyCalculate.GetCastRangeBonus(caster);
            AntipodeColorChange(caster, false, true);
            caster.EmitSound("Scaldris.Freeze");
            caster.SwapAbilities("imba_scaldris_scorch", "imba_scaldris_freeze", true, false);
            let wave_projectile = {
                Ability: this,
                EffectName: "particles/hero/scaldris/freeze.vpcf",
                vSpawnOrigin: caster_loc + Vector(0, 0, 100) as Vector,
                fDistance: wave_distance,
                fStartRadius: initial_radius,
                fEndRadius: final_radius,
                Source: caster,
                bHasFrontalCone: true,
                bReplaceExisting: false,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                fExpireTime: GameRules.GetGameTime() + 10.0,
                bDeleteOnHit: false,
                vVelocity: Vector(direction.x, direction.y, 0) * wave_speed as Vector,
                bProvidesVision: false
            }
            ProjectileManager.CreateLinearProjectile(wave_projectile);
        }
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (IsServer()) {
            if (target) {
                target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_freeze_slow", {
                    duration: this.GetSpecialValueFor("slow_duration") * (1 - target.GetStatusResistance())
                });
                target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_freeze_dps", {
                    duration: this.GetSpecialValueFor("damage_duration"),
                    dps: this.GetSpecialValueFor("dps")
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_freeze_slow extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetSpecialValueFor("slow_amount");
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_frost_lich.vpcf";
    }
}
@registerModifier()
export class modifier_imba_freeze_dps extends BaseModifier_Plus {
    public dps: any;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    IgnoreTenacity() {
        return true;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.dps = keys.dps;
            AntipodeIceProc(this.GetCasterPlus(), this.GetParentPlus());
            this.StartIntervalThink(1.0);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let actual_damage = ApplyDamage({
                victim: this.GetParentPlus(),
                attacker: this.GetCasterPlus(),
                ability: this.GetAbilityPlus(),
                damage: this.dps,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            });
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, this.GetParentPlus(), actual_damage, undefined);
        }
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_frost_lich.vpcf";
    }
}
@registerAbility()
export class imba_scaldris_jet_blaze extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return true;
    }
    GetAbilityTextureName(): string {
        return "scaldris_jet_blaze";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_antipode_passive";
    }
    GetAssociatedSecondaryAbilities(): string {
        return "imba_scaldris_ice_floes";
    }
    OnUpgrade(): void {
        if (IsServer()) {
            if (this.GetCasterPlus().findAbliityPlus<imba_scaldris_ice_floes>("imba_scaldris_ice_floes")) {
                let paired_ability = this.GetCasterPlus().findAbliityPlus<imba_scaldris_ice_floes>("imba_scaldris_ice_floes");
                if (paired_ability.GetLevel() < this.GetLevel()) {
                    paired_ability.SetLevel(this.GetLevel());
                }
            }
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let caster_loc = caster.GetAbsOrigin();
            let direction = caster.GetForwardVector();
            let initial_radius = this.GetSpecialValueFor("initial_radius");
            let final_radius = this.GetSpecialValueFor("final_radius");
            let cone_length = this.GetSpecialValueFor("cone_length");
            let fire_speed = this.GetSpecialValueFor("fire_speed");
            let rush_distance = this.GetSpecialValueFor("rush_distance") + GPropertyCalculate.GetCastRangeBonus(caster);
            let rush_speed = rush_distance / this.GetSpecialValueFor("rush_duration");
            AntipodeColorChange(caster, true, false);
            caster.EmitSound("Hero_DragonKnight.BreathFire");
            caster.SwapAbilities("imba_scaldris_jet_blaze", "imba_scaldris_ice_floes", false, true);
            let jet_projectile = {
                Ability: this,
                EffectName: "particles/units/heroes/hero_dragon_knight/dragon_knight_breathe_fire.vpcf",
                vSpawnOrigin: caster_loc + Vector(0, 0, 100) as Vector,
                fDistance: cone_length,
                fStartRadius: initial_radius,
                fEndRadius: final_radius,
                Source: caster,
                bHasFrontalCone: true,
                bReplaceExisting: false,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                fExpireTime: GameRules.GetGameTime() + 10.0,
                bDeleteOnHit: false,
                vVelocity: Vector(direction.x, direction.y, 0) * (-1) * fire_speed as Vector,
                bProvidesVision: false
            }
            let rush_projectile: CreateLinearProjectileOptions = {
                Ability: this,
                EffectName: "particles/units/heroes/hero_dragon_knight/dragon_knight_breathe_fire.vpcf",
                vSpawnOrigin: caster_loc + Vector(0, 0, 100) as Vector,
                fDistance: rush_distance,
                fStartRadius: initial_radius,
                fEndRadius: initial_radius,
                Source: caster,
                bHasFrontalCone: true,
                // bReplaceExisting: false,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                fExpireTime: GameRules.GetGameTime() + 10.0,
                // bDeleteOnHit: false,
                vVelocity: Vector(direction.x, direction.y, 0) * rush_speed as Vector,
                bProvidesVision: false
            }
            ProjectileManager.CreateLinearProjectile(jet_projectile);
            this.AddTimer(0.1, () => {
                ProjectileManager.CreateLinearProjectile(rush_projectile);
            });
            caster.AddNewModifier(caster, this, "modifier_imba_jet_blaze_rush", {
                duration: this.GetSpecialValueFor("rush_duration"),
                distance: rush_distance
            });
        }
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (IsServer()) {
            if (target) {
                target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_jet_blaze_dps", {
                    duration: this.GetSpecialValueFor("damage_duration"),
                    dps: this.GetSpecialValueFor("dps")
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_jet_blaze_dps extends BaseModifier_Plus {
    public dps: any;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    IgnoreTenacity() {
        return true;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.dps = keys.dps;
            AntipodeFireProc(this.GetCasterPlus(), this.GetParentPlus());
            this.StartIntervalThink(1.0);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let actual_damage = ApplyDamage({
                victim: this.GetParentPlus(),
                attacker: this.GetCasterPlus(),
                ability: this.GetAbilityPlus(),
                damage: this.dps,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            });
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, this.GetParentPlus(), actual_damage, undefined);
        }
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_jakiro/jakiro_liquid_fire_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerModifier()
export class modifier_imba_jet_blaze_rush extends BaseModifierMotionHorizontal_Plus {
    public direction: any;
    public movement_tick: any;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CAST_GHOST_WALK;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.StartIntervalThink(0.03);
            this.direction = this.GetParentPlus().GetForwardVector();
            this.movement_tick = this.direction * keys.distance / (this.GetDuration() / 0.03);
        }
    }
    GetEffectName(): string {
        return "particles/hero/scaldris/jet_blaze.vpcf";
    }
    BeDestroy(): void {
        if (IsServer()) {
            ResolveNPCPositions(this.GetParentPlus().GetAbsOrigin(), 128);
        }
    }
    ApplyHorizontalMotionController() {
        if (IsServer()) {
            if (!this.CheckMotionControllers()) {
                this.Destroy();
                return false;
            }

        }
        return true;
    }

    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        let unit = this.GetParentPlus();
        let position = unit.GetAbsOrigin();
        GridNav.DestroyTreesAroundPoint(position, 100, false);
        unit.SetAbsOrigin(GetGroundPosition(position + this.movement_tick, unit));
    }
}
@registerAbility()
export class imba_scaldris_ice_floes extends BaseAbility_Plus {
    public hit_check: any;
    IsHiddenWhenStolen(): boolean {
        return true;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return true;
    }
    GetAbilityTextureName(): string {
        return "scaldris_ice_floes";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_antipode_passive";
    }
    GetAssociatedPrimaryAbilities(): string {
        return "imba_scaldris_jet_blaze";
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("effect_radius");
    }
    OnUpgrade(): void {
        if (IsServer()) {
            if (this.GetCasterPlus().findAbliityPlus<imba_scaldris_jet_blaze>("imba_scaldris_jet_blaze")) {
                let paired_ability = this.GetCasterPlus().findAbliityPlus<imba_scaldris_jet_blaze>("imba_scaldris_jet_blaze");
                if (paired_ability.GetLevel() < this.GetLevel()) {
                    paired_ability.SetLevel(this.GetLevel());
                }
            }
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let caster_loc = caster.GetAbsOrigin();
            let target_loc = this.GetCursorPosition();
            if (target_loc == caster_loc) {
                target_loc = caster_loc + caster.GetForwardVector() * 100 as Vector;
            }
            let direction = (target_loc - caster_loc as Vector).Normalized();
            let distance = (target_loc - caster_loc as Vector).Length2D();
            let projectile_speed = this.GetSpecialValueFor("projectile_speed");
            AntipodeColorChange(caster, false, true);
            caster.EmitSound("Scaldris.ColdFrontLaunch");
            caster.SwapAbilities("imba_scaldris_jet_blaze", "imba_scaldris_ice_floes", true, false);
            let ice_projectile = {
                Ability: this,
                EffectName: "particles/hero/scaldris/ice_spell_projectile.vpcf",
                vSpawnOrigin: caster_loc + Vector(0, 0, 100) as Vector,
                fDistance: distance,
                fStartRadius: 0,
                fEndRadius: 0,
                Source: caster,
                bHasFrontalCone: true,
                bReplaceExisting: false,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                fExpireTime: GameRules.GetGameTime() + 10.0,
                bDeleteOnHit: false,
                vVelocity: Vector(direction.x, direction.y, 0) * projectile_speed as Vector,
                bProvidesVision: false,
                ExtraData: {
                    x: target_loc.x,
                    y: target_loc.y,
                    has_hit: false
                }
            }
            this.hit_check = false;
            ProjectileManager.CreateLinearProjectile(ice_projectile);
        }
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (IsServer()) {
        }
    }
    OnProjectileThink_ExtraData(location: Vector, extra_data: any): void {
        if (IsServer()) {
            if ((location - Vector(extra_data.x, extra_data.y, location.z) as Vector).Length2D() <= 16 && this.hit_check == false) {
                this.hit_check = true;
                let caster = this.GetCasterPlus();
                caster.EmitSound("Scaldris.IceFloes.Teleport");
                let teleport_pfx = ResHelper.CreateParticleEx("particles/econ/items/wisp/wisp_relocate_marker_ti7_endpoint.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
                ParticleManager.SetParticleControl(teleport_pfx, 0, location);
                this.AddTimer(1.5, () => {
                    ParticleManager.DestroyParticle(teleport_pfx, false);
                    ParticleManager.ReleaseParticleIndex(teleport_pfx);
                });
                let enemies = FindUnitsInRadius(caster.GetTeamNumber(), location, undefined, this.GetSpecialValueFor("effect_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    enemy.AddNewModifier(caster, this, "modifier_imba_ice_floes_stun", {
                        duration: this.GetSpecialValueFor("stun_duration") * (1 - enemy.GetStatusResistance())
                    });
                    enemy.AddNewModifier(caster, this, "modifier_imba_ice_floes_dps", {
                        duration: this.GetSpecialValueFor("damage_duration"),
                        dps: this.GetSpecialValueFor("dps")
                    });
                }
                ProjectileManager.ProjectileDodge(caster);
                FindClearSpaceForUnit(caster, location, true);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_ice_floes_stun extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_FROZEN]: true
        }
        return state;
    }
    GetEffectName(): string {
        return "particles/hero/lich/cold_front_freeze.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerModifier()
export class modifier_imba_ice_floes_dps extends BaseModifier_Plus {
    public dps: any;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    IgnoreTenacity() {
        return true;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.dps = keys.dps;
            AntipodeIceProc(this.GetCasterPlus(), this.GetParentPlus());
            this.StartIntervalThink(1.0);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let actual_damage = ApplyDamage({
                victim: this.GetParentPlus(),
                attacker: this.GetCasterPlus(),
                ability: this.GetAbilityPlus(),
                damage: this.dps,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            });
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, this.GetParentPlus(), actual_damage, undefined);
        }
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_frost_lich.vpcf";
    }
}
@registerAbility()
export class imba_scaldris_living_flame extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return true;
    }
    GetAbilityTextureName(): string {
        return "scaldris_living_flame";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_antipode_passive";
    }
    GetAssociatedSecondaryAbilities(): string {
        return "imba_scaldris_absolute_zero";
    }
    OnUpgrade(): void {
        if (IsServer()) {
            if (this.GetCasterPlus().findAbliityPlus<imba_scaldris_absolute_zero>("imba_scaldris_absolute_zero")) {
                let paired_ability = this.GetCasterPlus().findAbliityPlus<imba_scaldris_absolute_zero>("imba_scaldris_absolute_zero");
                if (paired_ability.GetLevel() < this.GetLevel()) {
                    paired_ability.SetLevel(this.GetLevel());
                }
            }
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            let jump_radius = this.GetSpecialValueFor("jump_radius");
            let duration = this.GetSpecialValueFor("duration");
            let dps = this.GetSpecialValueFor("dps");
            AntipodeColorChange(caster, true, false);
            caster.EmitSound("Scaldris.LivingFlame.Spread");
            caster.SwapAbilities("imba_scaldris_living_flame", "imba_scaldris_absolute_zero", false, true);
            if (target.GetTeam() != this.GetCasterPlus().GetTeam()) {
                if (target.TriggerSpellAbsorb(this)) {
                    return undefined;
                }
            }
            let spread_pfx = ResHelper.CreateParticleEx("particles/hero/scaldris/living_flame.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
            ParticleManager.SetParticleControlEnt(spread_pfx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", caster.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(spread_pfx, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(spread_pfx);
            target.AddNewModifier(caster, this, "modifier_imba_living_flame_dps", {
                duration: duration,
                jump_radius: jump_radius,
                dps: dps
            });
        }
    }
}
@registerModifier()
export class modifier_imba_living_flame_dps extends BaseModifier_Plus {
    public jump_radius: number;
    public dps: any;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    IgnoreTenacity() {
        return true;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.jump_radius = keys.jump_radius;
            this.dps = keys.dps;
            AntipodeFireProc(this.GetCasterPlus(), this.GetParentPlus());
            this.StartIntervalThink(1.0);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        if (IsServer()) {
            let funcs = {
                1: GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION,
                2: Enum_MODIFIER_EVENT.ON_DEATH
            }
            return Object.values(funcs);
        }
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
    CC_GetModifierProvidesFOWVision(): 0 | 1 {
        return 1;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            if (this.GetParentPlus() == keys.unit) {
                LivingFlameSpreadAttempt(this);
            }
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let actual_damage = ApplyDamage({
                victim: this.GetParentPlus(),
                attacker: this.GetCasterPlus(),
                ability: this.GetAbilityPlus(),
                damage: this.dps,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            });
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, this.GetParentPlus(), actual_damage, undefined);
            this.GetParentPlus().EmitSound("Scaldris.FireTick");
        }
    }
    GetEffectName(): string {
        return "particles/hero/scaldris/living_flame_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerAbility()
export class imba_scaldris_absolute_zero extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return true;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return true;
    }
    GetAbilityTextureName(): string {
        return "scaldris_absolute_zero";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_antipode_passive";
    }
    GetAssociatedPrimaryAbilities(): string {
        return "imba_scaldris_living_flame";
    }
    OnUpgrade(): void {
        if (IsServer()) {
            if (this.GetCasterPlus().findAbliityPlus<imba_scaldris_living_flame>("imba_scaldris_living_flame")) {
                let paired_ability = this.GetCasterPlus().findAbliityPlus<imba_scaldris_living_flame>("imba_scaldris_living_flame");
                if (paired_ability.GetLevel() < this.GetLevel()) {
                    paired_ability.SetLevel(this.GetLevel());
                }
            }
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            let projectile_speed = this.GetSpecialValueFor("projectile_speed");
            let stun_duration = this.GetSpecialValueFor("stun_duration");
            let initial_slow = this.GetSpecialValueFor("initial_slow");
            let damage_duration = this.GetSpecialValueFor("damage_duration");
            let dps = this.GetSpecialValueFor("dps");
            AntipodeColorChange(caster, false, true);
            caster.EmitSound("Scaldris.ColdFrontLaunch");
            caster.SwapAbilities("imba_scaldris_living_flame", "imba_scaldris_absolute_zero", true, false);
            let ice_projectile = {
                Target: target,
                Source: caster,
                Ability: this,
                EffectName: "particles/hero/scaldris/ice_spell_projectile_tracking.vpcf",
                iMoveSpeed: projectile_speed,
                vSpawnOrigin: caster.GetAbsOrigin(),
                bDrawsOnMinimap: false,
                bDodgeable: false,
                bIsAttack: false,
                bVisibleToEnemies: true,
                bReplaceExisting: false,
                flExpireTime: GameRules.GetGameTime() + 30,
                bProvidesVision: true,
                iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_ATTACK_2,
                iVisionRadius: 150,
                iVisionTeamNumber: caster.GetTeamNumber()
            }
            ProjectileManager.CreateTrackingProjectile(ice_projectile);
        }
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (IsServer()) {
            if (target) {
                if (target.GetTeam() != this.GetCasterPlus().GetTeam()) {
                    if (target.TriggerSpellAbsorb(this)) {
                        return undefined;
                    }
                }
                target.EmitSound("Scaldris.AbsoluteZero.Impact");
                target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_absolute_zero_stun", {
                    duration: this.GetSpecialValueFor("stun_duration") * (1 - target.GetStatusResistance()),
                    initial_slow: this.GetSpecialValueFor("initial_slow")
                });
                target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_absolute_zero_dps", {
                    duration: this.GetSpecialValueFor("damage_duration"),
                    dps: this.GetSpecialValueFor("dps")
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_absolute_zero_stun extends BaseModifier_Plus {
    public initial_slow: any;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.initial_slow = keys.initial_slow;
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_absolute_zero_slow", {
                initial_slow: this.initial_slow * (1 - this.GetParentPlus().GetStatusResistance())
            });
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_FROZEN]: true
        }
        return state;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_winter_wyvern/wyvern_winters_curse.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerModifier()
export class modifier_imba_absolute_zero_slow extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.SetStackCount((-1) * keys.initial_slow);
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            this.SetStackCount(this.GetStackCount() - 1);
            if (this.GetStackCount() <= 0) {
                this.GetParentPlus().RemoveModifierByName("modifier_imba_absolute_zero_slow");
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return (-1) * this.GetStackCount();
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_frost_lich.vpcf";
    }
}
@registerModifier()
export class modifier_imba_absolute_zero_dps extends BaseModifier_Plus {
    public dps: any;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    IgnoreTenacity() {
        return true;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.dps = keys.dps;
            AntipodeIceProc(this.GetCasterPlus(), this.GetParentPlus());
            this.StartIntervalThink(1.0);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let actual_damage = ApplyDamage({
                victim: this.GetParentPlus(),
                attacker: this.GetCasterPlus(),
                ability: this.GetAbilityPlus(),
                damage: this.dps,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            });
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, this.GetParentPlus(), actual_damage, undefined);
            this.GetParentPlus().EmitSound("Scaldris.IceTick");
        }
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_frost_lich.vpcf";
    }
}
