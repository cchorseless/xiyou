
import { GameFunc } from "../../../GameFunc";
import { AoiHelper } from "../../../helper/AoiHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_tidehunter_gush extends BaseAbility_Plus {
    public projectile: any;
    GetIntrinsicModifierName(): string {
        return "modifier_imba_tidehunter_gush_handler";
    }
    GetAbilityTextureName(): string {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_tidehunter_gush_handler", this.GetCasterPlus()) < 3) {
            return "tidehunter_gush";
        } else {
            return "tidehunter_gush_filtration";
        }
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasScepter()) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_OPTIONAL_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
        } else {
            return tonumber(tostring(super.GetBehavior())) + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (!this.GetCasterPlus().HasScepter()) {
            return super.GetCastRange(location, target);
        } else {
            return this.GetSpecialValueFor("cast_range_scepter");
        }
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Ability.GushCast");
        let gush_handler_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_tidehunter_gush_handler", this.GetCasterPlus());
        let filtration_wave = gush_handler_modifier.GetStackCount() >= this.GetSpecialValueFor("casts_before_filtration");
        if (this.GetCursorTarget()) {
            let direction = (this.GetCursorTarget().GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized();
            let projectile = {
                Target: this.GetCursorTarget(),
                Source: this.GetCasterPlus(),
                Ability: this,
                EffectName: "particles/units/heroes/hero_tidehunter/tidehunter_gush.vpcf",
                iMoveSpeed: this.GetSpecialValueFor("projectile_speed"),
                vSourceLoc: this.GetCasterPlus().GetAbsOrigin(),
                bDrawsOnMinimap: false,
                bDodgeable: true,
                bIsAttack: false,
                bVisibleToEnemies: true,
                bReplaceExisting: false,
                flExpireTime: GameRules.GetGameTime() + 10.0,
                bProvidesVision: false,
                iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_ATTACK_2,
                ExtraData: {
                    bScepter: this.GetCasterPlus().HasScepter(),
                    bTargeted: true,
                    speed: this.GetSpecialValueFor("projectile_speed"),
                    x: direction.x,
                    y: direction.y,
                    z: direction.z,
                    bFiltrate: filtration_wave
                }
            }
            ProjectileManager.CreateTrackingProjectile(projectile);
        }
        if (this.GetCasterPlus().HasScepter()) {
            let gush_dummy = BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, undefined, {}, this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus().GetTeamNumber(), false);
            gush_dummy.EmitSound("Hero_Tidehunter.Gush.AghsProjectile");
            if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
                this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
            }
            let direction = (this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized();
            let linear_projectile = {
                Ability: this,
                EffectName: "particles/units/heroes/hero_tidehunter/tidehunter_gush_upgrade.vpcf",
                vSpawnOrigin: this.GetCasterPlus().GetAbsOrigin(),
                fDistance: this.GetSpecialValueFor("cast_range_scepter") + GPropertyCalculate.GetCastRangeBonus(this.GetCasterPlus()),
                fStartRadius: this.GetSpecialValueFor("aoe_scepter"),
                fEndRadius: this.GetSpecialValueFor("aoe_scepter"),
                Source: this.GetCasterPlus(),
                bHasFrontalCone: false,
                bReplaceExisting: false,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                fExpireTime: GameRules.GetGameTime() + 10.0,
                bDeleteOnHit: true,
                vVelocity: direction * this.GetSpecialValueFor("speed_scepter") as Vector,
                bProvidesVision: false,
                ExtraData: {
                    bScepter: true,
                    bTargeted: false,
                    speed: this.GetSpecialValueFor("speed_scepter"),
                    x: direction.x,
                    y: direction.y,
                    z: direction.z,
                    bFiltrate: filtration_wave,
                    gush_dummy: gush_dummy.entindex()
                }
            }
            this.projectile = ProjectileManager.CreateLinearProjectile(linear_projectile);
        }
        if (!filtration_wave) {
            gush_handler_modifier.IncrementStackCount();
        } else {
            gush_handler_modifier.SetStackCount(0);
        }
    }
    OnProjectileThink_ExtraData(location: Vector, data: any): void {
        if (!IsServer()) {
            return;
        }
        if (data.gush_dummy) {
            EntIndexToHScript(data.gush_dummy).SetAbsOrigin(location);
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, data: any): boolean | void {
        if (!IsServer()) {
            return;
        }
        if (target) {
            if (target.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
                if (data.bTargeted == 1 && target.TriggerSpellAbsorb(this)) {
                    target.AddNewModifier(this.GetCasterPlus(), this, "modifier_generic_stunned", {
                        duration: this.GetSpecialValueFor("shieldbreaker_stun") * (1 - target.GetStatusResistance())
                    });
                    return undefined;
                }
                target.EmitSound("Ability.GushImpact");
                if (data.bFiltrate == 1) {
                    target.Purge(true, false, false, false, false);
                }
                if (!(data.bScepter == 1 && data.bTargeted == 1)) {
                    target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_tidehunter_gush", {
                        duration: this.GetDuration() * (1 - target.GetStatusResistance())
                    });
                    if (data.bScepter == 1) {
                        this.CreateVisibilityNode(target.GetAbsOrigin(), 200, 2);
                    }
                    let damageTable = {
                        victim: target,
                        damage: this.GetTalentSpecialValueFor("gush_damage"),
                        damage_type: this.GetAbilityDamageType(),
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                        attacker: this.GetCasterPlus(),
                        ability: this
                    }
                    ApplyDamage(damageTable);
                    if (this.GetCasterPlus().GetUnitName().includes("tidehunter") && target.IsRealUnit() && !target.IsAlive() && RollPercentage(25)) {
                        this.GetCasterPlus().EmitSound("tidehunter_tide_ability_gush_0" + RandomInt(1, 2));
                    }
                }
            }
            if (this.GetAutoCastState() && target != this.GetCasterPlus() && (target.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber() || (target.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()))) {
                let surf_modifier = target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_tidehunter_gush_surf", {
                    duration: this.GetSpecialValueFor("surf_duration"),
                    speed: data.speed,
                    x: data.x,
                    y: data.y,
                    z: data.z
                });
                if (surf_modifier && target.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
                    surf_modifier.SetDuration(this.GetSpecialValueFor("surf_duration") * (1 - target.GetStatusResistance()), true);
                }
            }
        } else if (data.gush_dummy) {
            EntIndexToHScript(data.gush_dummy).StopSound("Hero_Tidehunter.Gush.AghsProjectile");
            EntIndexToHScript(data.gush_dummy).RemoveSelf();
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_tidehunter_gush_armor") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_tidehunter_gush_armor")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_tidehunter_gush_armor"), "modifier_special_bonus_imba_tidehunter_gush_armor", {});
        }
    }
}
@registerModifier()
export class modifier_imba_tidehunter_gush extends BaseModifier_Plus {
    public movement_speed: number;
    public negative_armor: any;
    GetEffectName(): string {
        return "particles/units/heroes/hero_tidehunter/tidehunter_gush_slow.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_gush.vpcf";
    }
    Init(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.movement_speed = this.GetSpecialValueFor("movement_speed");
            this.negative_armor = this.GetAbilityPlus().GetTalentSpecialValueFor("negative_armor");
        } else {
            this.Destroy();
        }
    }

    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.movement_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.negative_armor * (-1);
    }
}
@registerModifier()
export class modifier_imba_tidehunter_gush_handler extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
}
@registerModifier()
export class modifier_imba_tidehunter_gush_surf extends BaseModifier_Plus {
    public speed: number;
    public direction: any;
    public surf_speed_pct: number;
    Init(params: any): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus()) {
            this.speed = params.speed;
            this.direction = Vector(params.x, params.y, params.z);
            this.surf_speed_pct = this.GetSpecialValueFor("surf_speed_pct");
            this.StartIntervalThink(FrameTime());
        } else {
            this.Destroy();
        }
    }

    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        FindClearSpaceForUnit(this.GetParentPlus(), this.GetParentPlus().GetAbsOrigin() + (this.direction * this.speed * this.surf_speed_pct * 0.01 * FrameTime()) as Vector, false);
    }
}
@registerAbility()
export class imba_tidehunter_kraken_shell extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_tidehunter_kraken_shell";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_PSEUDO_QUEUE;
    }
    OnSpellStart(): void {
        this.GetCasterPlus().Purge(false, true, false, true, true);
        let kraken_shell_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_tidehunter/tidehunter_krakenshell_purge.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
        ParticleManager.ReleaseParticleIndex(kraken_shell_particle);
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_tidehunter_kraken_shell_backstroke", {
            duration: 3.6
        });
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_tidehunter_greater_hardening")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_tidehunter_kraken_shell_greater_hardening", {
                duration: this.GetCasterPlus().GetTalentValue("special_bonus_imba_tidehunter_greater_hardening", "duration")
            });
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_tidehunter_greater_hardening") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_tidehunter_greater_hardening")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_tidehunter_greater_hardening"), "modifier_special_bonus_imba_tidehunter_greater_hardening", {});
        }
    }
}
@registerModifier()
export class modifier_imba_tidehunter_kraken_shell extends BaseModifier_Plus {
    public reset_timer: number;
    public bInRiver: any;
    IsHidden(): boolean {
        return !(this.GetAbilityPlus() && this.GetAbilityPlus().GetLevel() >= 1);
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.reset_timer = GameRules.GetDOTATime(true, true);
        this.SetStackCount(0);
        this.StartIntervalThink(0.1);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (GameRules.GetDOTATime(true, true) - this.reset_timer >= this.GetSpecialValueFor("damage_reset_interval")) {
            this.SetStackCount(0);
            this.reset_timer = GameRules.GetDOTATime(true, true);
        }
        if (!this.bInRiver && this.GetParentPlus().GetAbsOrigin().z < 160) {
            // this.GetParentPlus().CalculateStatBonus(true);
            this.bInRiver = true;
        } else if (this.bInRiver && this.GetParentPlus().GetAbsOrigin().z >= 160) {
            // this.GetParentPlus().CalculateStatBonus(true);
            this.bInRiver = false;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_CONSTANT_BLOCK,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_CONSTANT_BLOCK)
    CC_GetModifierPhysical_ConstantBlock(p_0: ModifierAttackEvent,): number {
        return this.GetAbilityPlus().GetTalentSpecialValueFor("damage_reduction");
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetParentPlus() && !keys.attacker.IsOther() && (keys.attacker.GetOwnerEntity()) && !this.GetParentPlus().PassivesDisabled() && !this.GetParentPlus().IsIllusion() && this.GetAbilityPlus().IsTrained()) {
            this.SetStackCount(this.GetStackCount() + keys.damage);
            this.reset_timer = GameRules.GetDOTATime(true, true);
            if (this.GetStackCount() >= this.GetSpecialValueFor("damage_cleanse")) {
                this.GetParentPlus().EmitSound("Hero_Tidehunter.KrakenShell");
                let kraken_shell_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_tidehunter/tidehunter_krakenshell_purge.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetParentPlus());
                ParticleManager.ReleaseParticleIndex(kraken_shell_particle);
                this.GetParentPlus().Purge(false, true, false, true, true);
                this.SetStackCount(0);
                if (this.GetCasterPlus().HasTalent("special_bonus_imba_tidehunter_greater_hardening")) {
                    this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_tidehunter_kraken_shell_greater_hardening", {
                        duration: this.GetCasterPlus().GetTalentValue("special_bonus_imba_tidehunter_greater_hardening", "duration")
                    });
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (this.GetAbilityPlus() && this.GetParentPlus().GetAbsOrigin().z < 160 && !this.GetParentPlus().PassivesDisabled()) {
            return this.GetSpecialValueFor("aqueous_strength");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE)
    CC_GetModifierHealthRegenPercentage(): number {
        if (this.GetAbilityPlus() && this.GetParentPlus().GetAbsOrigin().z < 160 && !this.GetParentPlus().PassivesDisabled()) {
            return this.GetSpecialValueFor("aqueous_heal");
        }
    }
}
@registerModifier()
export class modifier_imba_tidehunter_kraken_shell_backstroke extends BaseModifier_Plus {
    public backstroke_movespeed: number;
    public backstroke_statusresist: any;
    BeCreated(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.backstroke_movespeed = this.GetSpecialValueFor("backstroke_movespeed");
            this.backstroke_statusresist = this.GetSpecialValueFor("backstroke_statusresist");
        } else {
            this.Destroy();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            4: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_TAUNT;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        return "backstroke_gesture";
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.GetParentPlus().GetAbsOrigin().z >= 160) {
            return this.backstroke_movespeed;
        } else {
            return this.backstroke_movespeed * 2;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        if (this.GetParentPlus().GetAbsOrigin().z >= 160) {
            return this.backstroke_statusresist;
        } else {
            return this.backstroke_statusresist * 2;
        }
    }
}
@registerModifier()
export class modifier_imba_tidehunter_kraken_shell_greater_hardening extends BaseModifier_Plus {
    public value: any;
    Init(p_0: any,): void {
        this.value = this.GetCasterPlus().GetTalentValue("special_bonus_imba_tidehunter_greater_hardening");
        if (!IsServer()) {
            return;
        }
        this.IncrementStackCount();
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.GetStackCount() * this.value;
    }
}
@registerAbility()
export class imba_tidehunter_anchor_smash extends BaseAbility_Plus {
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_tidehunter_anchor_smash_handler", this.GetCasterPlus()) == 0) {
            return super.GetCastRange(location, target) - this.GetCasterPlus().GetCastRangeBonus();
        } else {
            return this.GetSpecialValueFor("throw_range");
        }
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_tidehunter_anchor_smash_handler", this.GetCasterPlus()) == 0) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
        }
    }
    GetAOERadius(): number {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_tidehunter_anchor_smash_handler", this.GetCasterPlus()) == 0) {
            return 0;
        } else {
            return this.GetSpecialValueFor("throw_radius");
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_tidehunter_anchor_smash_handler";
    }
    OnSpellStart(): void {
        if (this.GetAutoCastState()) {
            if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
                this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
            }
            this.GetCasterPlus().EmitSound("Hero_ChaosKnight.idle_throw");
            let anchor_dummy = BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_imba_tidehunter_anchor_smash_throw", {
                x: this.GetCursorPosition().x,
                y: this.GetCursorPosition().y,
                z: this.GetCursorPosition().z
            }, this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus().GetTeamNumber(), false);
            let linear_projectile = {
                Ability: this,
                vSpawnOrigin: this.GetCasterPlus().GetAbsOrigin(),
                fDistance: this.GetCastRange(this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus()) + GPropertyCalculate.GetCastRangeBonus(this.GetCasterPlus()),
                fStartRadius: this.GetSpecialValueFor("throw_radius"),
                fEndRadius: this.GetSpecialValueFor("throw_radius"),
                Source: this.GetCasterPlus(),
                bHasFrontalCone: false,
                bReplaceExisting: false,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                fExpireTime: GameRules.GetGameTime() + 10.0,
                bDeleteOnHit: true,
                vVelocity: (this.GetCursorPosition() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized() * this.GetSpecialValueFor("throw_speed") as Vector,
                bProvidesVision: false,
                ExtraData: {
                    anchor_dummy: anchor_dummy.entindex()
                }
            }
            ProjectileManager.CreateLinearProjectile(linear_projectile);
        } else {
            this.GetCasterPlus().EmitSound("Hero_Tidehunter.AnchorSmash");
            let anchor_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_tidehunter/tidehunter_anchor_hero.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
            ParticleManager.ReleaseParticleIndex(anchor_particle);
            let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
            for (const enemy of (enemies)) {
                this.Smash(enemy);
            }
        }
    }
    Smash(enemy: IBaseNpc_Plus, bThrown = false) {
        if (!enemy.IsRoshan()) {
            if (bThrown && enemy.IsConsideredHero()) {
                this.GetCasterPlus().EmitSound("Hero_Tidehunter.AnchorSmash");
            }
            if (!enemy.IsMagicImmune()) {
                enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_tidehunter_anchor_smash", {
                    duration: this.GetSpecialValueFor("reduction_duration") * (1 - enemy.GetStatusResistance())
                });
            }
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_tidehunter_anchor_smash_suppression", {});
            this.GetCasterPlus().PerformAttack(enemy, false, true, true, false, false, false, true);
            this.GetCasterPlus().RemoveModifierByNameAndCaster("modifier_imba_tidehunter_anchor_smash_suppression", this.GetCasterPlus());
            if (!bThrown) {
                enemy.SetForwardVector(enemy.GetForwardVector() * (-1) as Vector);
                enemy.FaceTowards(enemy.GetAbsOrigin() + enemy.GetForwardVector() as Vector);
            }
        }
    }
    OnProjectileThink_ExtraData(location: Vector, data: any): void {
        if (!IsServer()) {
            return;
        }
        EntIndexToHScript(data.anchor_dummy).SetAbsOrigin(GetGroundPosition(location, undefined));
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, data: any): boolean | void {
        if (!IsServer()) {
            return;
        }
        if (target) {
            this.Smash(target, true);
        } else {
            EntIndexToHScript(data.anchor_dummy).RemoveSelf();
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_tidehunter_anchor_smash_damage_reduction") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_tidehunter_anchor_smash_damage_reduction")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_tidehunter_anchor_smash_damage_reduction"), "modifier_special_bonus_imba_tidehunter_anchor_smash_damage_reduction", {});
        }
    }
}
@registerModifier()
export class modifier_imba_tidehunter_anchor_smash extends BaseModifier_Plus {
    public damage_reduction: number;
    Init(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.damage_reduction = this.GetAbilityPlus().GetTalentSpecialValueFor("damage_reduction");
        } else {
            this.Destroy();
        }
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.damage_reduction;
    }
}
@registerModifier()
export class modifier_imba_tidehunter_anchor_smash_suppression extends BaseModifier_Plus {
    public attack_damage: number;
    BeCreated(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.attack_damage = this.GetSpecialValueFor("attack_damage");
        } else {
            this.Destroy();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.SUPPRESS_CLEAVE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.attack_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SUPPRESS_CLEAVE)
    CC_GetSuppressCleave() {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierTotalDamageOutgoing_Percentage(keys: ModifierAttackEvent): number {
        if (!keys.no_attack_cooldown && keys.damage_category == DamageCategory_t.DOTA_DAMAGE_CATEGORY_SPELL && keys.damage_flags == DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION) {
            return -100;
        }
    }
}
@registerModifier()
export class modifier_imba_tidehunter_anchor_smash_handler extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
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
export class modifier_imba_tidehunter_anchor_smash_throw extends BaseModifier_Plus {
    public selected_model: any;
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        let models = [
            "models/items/tidehunter/tidehunter_fish_skeleton_lod.vmdl",
            "models/items/tidehunter/tidehunter_mine_lod.vmdl",
            "models/items/tidehunter/ancient_leviathan_weapon/ancient_leviathan_weapon_fx.vmdl",
            "models/items/tidehunter/claddish_cudgel/claddish_cudgel.vmdl",
            "models/items/tidehunter/claddish_cudgel/claddish_cudgel_octopus.vmdl",
            "models/items/tidehunter/krakens_bane/krakens_bane.vmdl",
            "models/items/tidehunter/living_iceberg_collection_weapon/living_iceberg_collection_weapon.vmdl",
            "models/items/tidehunter/tidebreaker_weapon/tidebreaker_weapon.vmdl"
        ]

        let models_rotate = [
            180,
            180,
            0,
            0,
            180,
            0,
            0,
            0
        ];
        let randomSelection = RandomInt(0, models_rotate.length)
        let cursorPosition = Vector(params.x, params.y, params.z);
        this.selected_model = models[randomSelection];
        this.GetParentPlus().SetForwardVector(RotatePosition(Vector(0, 0, 0), QAngle(0, models_rotate[randomSelection], 0), ((cursorPosition - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized())));
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.VISUAL_Z_DELTA
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE)
    CC_GetModifierModelChange(): string {
        return this.selected_model || "models/heroes/tidehunter/tidehunter_anchor.vmdl";
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.VISUAL_Z_DELTA)
    CC_GetVisualZDelta(): number {
        return 150;
    }
}
@registerModifier()
export class modifier_imba_tidehunter_ravage_handler extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ORDER,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS
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
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        if (RollPercentage && RollPercentage(50)) {
            return "belly_flop";
        }
    }
}
@registerModifier()
export class modifier_imba_tidehunter_ravage_creeping_wave extends BaseModifier_Plus {
    public stun_duration: number;
    public creeping_radius: number;
    public ravage_particle: any;
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.stun_duration = params.stun_duration;
        this.creeping_radius = params.creeping_radius;
        let ability = this.GetAbilityPlus();
        let caster = this.GetCasterPlus();
        let damage = params.damage;
        let damage_type = this.GetAbilityPlus().GetAbilityDamageType();
        this.GetParentPlus().EmitSound("Ability.Ravage");
        this.ravage_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_tidehunter/tidehunter_spell_ravage.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
        ParticleManager.SetParticleControl(this.ravage_particle, 0, this.GetParentPlus().GetAbsOrigin());
        for (let i = 0; i < 5; i++) {
            ParticleManager.SetParticleControl(this.ravage_particle, i, Vector(this.creeping_radius, 0, 0));
        }
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.creeping_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const enemy of (enemies)) {
            enemy.EmitSound("Hero_Tidehunter.RavageDamage");
            let hit_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_tidehunter/tidehunter_spell_ravage_hit.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, enemy);
            ParticleManager.SetParticleControl(hit_particle, 0, GetGroundPosition(enemy.GetAbsOrigin(), undefined));
            ParticleManager.ReleaseParticleIndex(hit_particle);
            enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_generic_stunned", {
                duration: this.stun_duration * (1 - enemy.GetStatusResistance())
            });
            let knockback = {
                knockback_duration: 0.5 * (1 - enemy.GetStatusResistance()),
                duration: 0.5 * (1 - enemy.GetStatusResistance()),
                knockback_distance: 0,
                knockback_height: 350
            }
            enemy.RemoveModifierByName("modifier_knockback");
            enemy.AddNewModifier(this.GetCasterPlus(), ability, "modifier_knockback", knockback);
            enemy.AddNewModifier(this.GetCasterPlus(), ability, "modifier_imba_tidehunter_ravage_suggestive_compromise", {
                duration: params.suggestive_duration * (1 - enemy.GetStatusResistance())
            });
            this.AddTimer(0.5, () => {
                let damageTable = {
                    victim: enemy,
                    damage: damage,
                    damage_type: damage_type,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: caster,
                    ability: ability
                }
                ApplyDamage(damageTable);
                if (caster.GetUnitName().includes("tidehunter") && !enemy.IsAlive() && enemy.IsRealUnit() && RollPercentage(25)) {
                    caster.EmitSound("tidehunter_tide_ability_ravage_0" + RandomInt(1, 2));
                }
            });
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        ParticleManager.DestroyParticle(this.ravage_particle, false);
        ParticleManager.ReleaseParticleIndex(this.ravage_particle);
        this.GetParentPlus().RemoveSelf();
    }
}
@registerModifier()
export class modifier_imba_tidehunter_ravage_suggestive_compromise extends BaseModifier_Plus {
    public suggestive_armor_reduction: any;
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_monkey_king/monkey_king_jump_armor_debuff_model.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        this.suggestive_armor_reduction = this.GetSpecialValueFor("suggestive_armor_reduction") * (-1);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.suggestive_armor_reduction;
    }
}
@registerAbility()
export class imba_tidehunter_ravage extends BaseAbility_Plus {
    public particle_fx: any;
    GetIntrinsicModifierName(): string {
        return "modifier_imba_tidehunter_ravage_handler";
    }
    GetAOERadius(): number {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_tidehunter_ravage_handler", this.GetCasterPlus()) == 0) {
            return this.GetSpecialValueFor("radius");
        } else {
            return this.GetSpecialValueFor("creeping_radius");
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_tidehunter_ravage_handler", this.GetCasterPlus()) == 0) {
            return super.GetCastRange(location, target);
        } else {
            return this.GetSpecialValueFor("creeping_range");
        }
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().findBuffStack("modifier_imba_tidehunter_ravage_handler", this.GetCasterPlus()) == 0) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
        }
    }
    OnSpellStart(): void {
        if (!this.GetAutoCastState()) {
            let caster = this.GetCasterPlus();
            let caster_pos = caster.GetAbsOrigin();
            let cast_sound = "Ability.Ravage";
            let hit_sound = "Hero_Tidehunter.RavageDamage";
            let kill_responses = "tidehunter_tide_ability_ravage_0";
            let particle = "particles/units/heroes/hero_tidehunter/tidehunter_spell_ravage.vpcf";
            let end_radius = this.GetSpecialValueFor("radius");
            let stun_duration = this.GetSpecialValueFor("duration");
            let suggestive_duration = this.GetSpecialValueFor("suggestive_duration");
            caster.EmitSound(cast_sound);
            this.particle_fx = ResHelper.CreateParticleEx(particle, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(this.particle_fx, 0, caster_pos);
            for (let i = 0; i < 5; i++) {
                ParticleManager.SetParticleControl(this.particle_fx, i, Vector(end_radius * 0.2 * i, 0, 0));
            }
            ParticleManager.ReleaseParticleIndex(this.particle_fx);
            let radius = end_radius * 0.2;
            let ring = 1;
            let ring_width = end_radius * 0.2;
            let hit_units: IBaseNpc_Plus[] = []
            this.AddTimer(0, () => {
                let enemies = AoiHelper.FindUnitsInRing(caster.GetTeamNumber(), caster_pos, undefined, ring * radius, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    if (!hit_units.includes(enemy)) {
                        enemy.EmitSound(hit_sound);
                        enemy.AddNewModifier(caster, this, "modifier_generic_stunned", {
                            duration: stun_duration * (1 - enemy.GetStatusResistance())
                        });
                        let knockback = {
                            knockback_duration: 0.5 * (1 - enemy.GetStatusResistance()),
                            duration: 0.5 * (1 - enemy.GetStatusResistance()),
                            knockback_distance: 0,
                            knockback_height: 350
                        }
                        enemy.RemoveModifierByName("modifier_knockback");
                        enemy.AddNewModifier(caster, this, "modifier_knockback", knockback);
                        enemy.AddNewModifier(caster, this, "modifier_imba_tidehunter_ravage_suggestive_compromise", {
                            duration: suggestive_duration * (1 - enemy.GetStatusResistance())
                        });
                        this.AddTimer(0.5, () => {
                            let damageTable = {
                                victim: enemy,
                                damage: this.GetAbilityDamage(),
                                damage_type: this.GetAbilityDamageType(),
                                attacker: caster,
                                ability: this
                            }
                            ApplyDamage(damageTable);
                            if (!enemy.IsAlive() && enemy.IsRealUnit() && RollPercentage(25) && caster.GetUnitName().includes("tidehunter")) {
                                caster.EmitSound(kill_responses + RandomInt(1, 2));
                            }
                            enemy.RemoveGesture(GameActivity_t.ACT_DOTA_FLAIL);
                        });
                        hit_units.push(enemy);
                    }
                }
                if (ring < 5) {
                    ring = ring + 1;
                    return 0.2;
                }
            });
        } else {
            let stun_duration = this.GetSpecialValueFor("duration");
            let creeping_range = this.GetSpecialValueFor("creeping_range");
            let creeping_radius = this.GetSpecialValueFor("creeping_radius");
            let waves = (creeping_range / creeping_radius / 2);
            let counter = 0;
            let total_time = 1.38;
            let caster_pos = this.GetCasterPlus().GetAbsOrigin();
            let forward_vec = (this.GetCursorPosition() - caster_pos as Vector).Normalized();
            this.AddTimer(0, () => {
                BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_imba_tidehunter_ravage_creeping_wave", {
                    duration: 0.3,
                    damage: this.GetAbilityDamage(),
                    stun_duration: stun_duration,
                    creeping_radius: creeping_radius,
                    suggestive_duration: this.GetSpecialValueFor("suggestive_duration")
                }, caster_pos + (forward_vec * counter * creeping_radius * 2 * ((creeping_range + GPropertyCalculate.GetCastRangeBonus(this.GetCasterPlus())) / creeping_range)) as Vector, this.GetCasterPlus().GetTeamNumber(), false);
                counter = counter + 1;
                if (counter <= waves) {
                    return total_time / waves;
                }
            });
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_tidehunter_anchor_smash_damage_reduction extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_tidehunter_greater_hardening extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_tidehunter_gush_armor extends BaseModifier_Plus {
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
