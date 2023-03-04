
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerModifier()
export class modifier_imba_poison_sting_v2_ward extends BaseModifier_Plus {
    public damage: number;
    public hp_regen_reduction: any;
    IgnoreTenacity() {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_venomancer/venomancer_poison_debuff.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.damage = this.GetSpecialValueFor("damage") * 0.5;
        this.hp_regen_reduction = this.GetSpecialValueFor("hp_regen_reduction") * (-1);
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(this.GetAbilityPlus().GetTalentSpecialValueFor("movement_speed_pct") * (1 - this.GetParentPlus().GetStatusResistance()) * (-1) * 100);
        this.OnIntervalThink();
        this.StartIntervalThink(1);
    }
    BeRefresh(p_0: any,): void {
        this.damage = this.damage + (this.GetSpecialValueFor("stack_damage") * 0.5);
        this.hp_regen_reduction = this.GetSpecialValueFor("hp_regen_reduction") * (-1);
        if (!IsServer()) {
            return;
        }
        this.OnIntervalThink();
    }
    OnIntervalThink(): void {
        if (!this.GetParentPlus().HasModifier("modifier_imba_poison_sting_debuff")) {
            ApplyDamage({
                victim: this.GetParentPlus(),
                damage: this.damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS,
                attacker: this.GetCasterPlus(),
                ability: this.GetAbilityPlus()
            });
            SendOverheadEventMessage(this.GetCasterPlus().GetPlayerOwner(), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, this.GetParentPlus(), this.damage, undefined);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (!this.GetParentPlus().HasModifier("modifier_imba_poison_sting_debuff")) {
            return this.GetStackCount() * 0.01;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE)
    CC_GetModifierHPRegenAmplify_Percentage(): number {
        if (!this.GetParentPlus().HasModifier("modifier_imba_poison_sting_debuff")) {
            return this.hp_regen_reduction;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        if (!this.GetParentPlus().HasModifier("modifier_imba_poison_sting_debuff")) {
            return this.damage;
        } else {
            return 0;
        }
    }
}
@registerAbility()
export class imba_venomancer_plague_ward_v2 extends BaseAbility_Plus {
    public responses: { [k: string]: number };
    OnSpellStart(talent_spawn_location?: Vector /** talent_spawn_location */): void {
        let spawn_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_venomancer/venomancer_ward_cast.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(spawn_fx, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(spawn_fx, 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(spawn_fx);
        let plague_ward = BaseNpc_Plus.CreateUnitByName("npc_dota_venomancer_plague_ward_" + math.min(this.GetLevel(), 4), talent_spawn_location || this.GetCursorPosition(), this.GetCasterPlus().GetTeamNumber(), true, this.GetCasterPlus(), this.GetCasterPlus());
        plague_ward.EmitSound("Hero_Venomancer.Plague_Ward");
        if (this.GetCasterPlus().HasAbility("imba_venomancer_venomous_gale")) {
            GFuncEntity.AddRangeIndicator(plague_ward, this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus<imba_venomancer_venomous_gale>("imba_venomancer_venomous_gale"), "ward_range", undefined, 183, 247, 33, false, false, true);
        }
        plague_ward.SetForwardVector(this.GetCasterPlus().GetForwardVector());
        plague_ward.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_venomancer_plague_ward_v2", {});
        plague_ward.AddNewModifier(this.GetCasterPlus(), this, "modifier_kill", {
            duration: this.GetSpecialValueFor("duration")
        });
        plague_ward.AddNewModifier(this.GetCasterPlus(), this, "modifier_neutral_spell_immunity_visible", {
            duration: this.GetSpecialValueFor("duration")
        });
        plague_ward.SetBaseMaxHealth(this.GetSpecialValueFor("ward_hp_tooltip") * math.max(this.GetCasterPlus().GetTalentValue("special_bonus_imba_venomancer_plague_ward_upgrade"), 1));
        plague_ward.SetMaxHealth(this.GetSpecialValueFor("ward_hp_tooltip") * math.max(this.GetCasterPlus().GetTalentValue("special_bonus_imba_venomancer_plague_ward_upgrade"), 1));
        plague_ward.SetHealth(this.GetSpecialValueFor("ward_hp_tooltip") * math.max(this.GetCasterPlus().GetTalentValue("special_bonus_imba_venomancer_plague_ward_upgrade"), 1));
        plague_ward.SetBaseDamageMin((this.GetSpecialValueFor("ward_damage_tooltip") * math.max(this.GetCasterPlus().GetTalentValue("special_bonus_imba_venomancer_plague_ward_upgrade"), 1)) - 1);
        plague_ward.SetBaseDamageMax((this.GetSpecialValueFor("ward_damage_tooltip") * math.max(this.GetCasterPlus().GetTalentValue("special_bonus_imba_venomancer_plague_ward_upgrade"), 1)) + 1);
        if (this.GetCasterPlus().GetPlayerID) {
            plague_ward.SetControllableByPlayer(this.GetCasterPlus().GetPlayerID(), true);
        } else if (this.GetCasterPlus().GetOwnerPlus() && this.GetCasterPlus().GetOwnerPlus().GetPlayerID) {
            plague_ward.SetControllableByPlayer(this.GetCasterPlus().GetOwnerPlus().GetPlayerID(), true);
        }
        if (!talent_spawn_location && this.GetCasterPlus().GetName() == "npc_dota_hero_venomancer" && RollPercentage(25)) {
            if (!this.responses) {
                this.responses = {
                    "venomancer_venm_ability_ward_01": 0,
                    "venomancer_venm_ability_ward_02": 0,
                    "venomancer_venm_ability_ward_03": 0,
                    "venomancer_venm_ability_ward_04": 0,
                    "venomancer_venm_ability_ward_05": 0,
                    "venomancer_venm_ability_ward_06": 0
                }
            }
            for (const [response, timer] of GameFunc.Pair(this.responses)) {
                if (GameRules.GetDOTATime(true, true) - timer >= 60) {
                    this.GetCasterPlus().EmitSound(response);
                    this.responses[response] = GameRules.GetDOTATime(true, true);
                    return;
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_venomancer_plague_ward_v2 extends BaseModifier_Plus {
    public split_count: number;
    public poison_sting_ability: any;
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
        this.split_count = this.GetSpecialValueFor("split_count");
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().GetOwnerPlus() && this.GetParentPlus().GetOwnerPlus() && this.GetParentPlus().GetOwnerPlus().HasAbility("imba_venomancer_poison_sting") && this.GetParentPlus().GetOwnerPlus().findAbliityPlus<imba_venomancer_poison_sting>("imba_venomancer_poison_sting").IsTrained()) {
            this.poison_sting_ability = this.GetParentPlus().GetOwnerPlus().findAbliityPlus<imba_venomancer_poison_sting>("imba_venomancer_poison_sting");
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && keys.target && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber() && !keys.no_attack_cooldown && !this.GetParentPlus().PassivesDisabled()) {
            let target_number = 0;
            for (const [_, enemy] of ipairs(FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.GetParentPlus().Script_GetAttackRange(), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_ANY_ORDER, false))) {
                if (enemy != keys.target) {
                    if (target_number >= this.split_count) {
                        return;
                    } else {
                        this.GetParentPlus().PerformAttack(enemy, false, true, true, false, true, false, false);
                        target_number = target_number + 1;
                    }
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && keys.target && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber() && !keys.target.IsMagicImmune() && !keys.target.IsBuilding() && !keys.target.IsOther() && !this.GetParentPlus().PassivesDisabled()) {
            if (!this.poison_sting_ability) {
                if (this.GetParentPlus().GetOwnerPlus() && this.GetParentPlus().GetOwnerPlus().HasAbility("imba_venomancer_poison_sting") && this.GetParentPlus().GetOwnerPlus().findAbliityPlus<imba_venomancer_poison_sting>("imba_venomancer_poison_sting").IsTrained()) {
                    this.poison_sting_ability = this.GetParentPlus().GetOwnerPlus().findAbliityPlus<imba_venomancer_poison_sting>("imba_venomancer_poison_sting");
                }
            }
            if (this.poison_sting_ability && this.GetParentPlus().GetOwnerPlus() && !this.GetParentPlus().GetOwnerPlus().PassivesDisabled()) {
                keys.target.AddNewModifier(this.GetParentPlus().GetOwnerPlus(), this.poison_sting_ability, "modifier_imba_poison_sting_v2_ward", {
                    duration: (this.poison_sting_ability.GetSpecialValueFor("duration") - FrameTime()) * (1 - keys.target.GetStatusResistance())
                });
            }
        }
    }
}
@registerAbility()
export class imba_venomancer_toxicity extends BaseAbility_Plus {
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
        return "venomancer_toxicity";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_toxicity";
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_venomancer_3") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_venomancer_3")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_venomancer_3"), "modifier_special_bonus_imba_venomancer_3", {});
        }
    }
}
@registerModifier()
export class modifier_imba_toxicity extends BaseModifier_Plus {
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
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.StartIntervalThink(1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, ability.GetAbilityTargetTeam(), ability.GetAbilityTargetType(), ability.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of ipairs(enemies)) {
                let debuff = enemy.FindModifierByNameAndCaster("modifier_imba_toxicity_debuff", caster);
                let poisons: IBaseModifier_Plus[] = []
                table.insert(poisons, enemy.FindModifierByNameAndCaster("modifier_imba_venomous_gale", caster));
                table.insert(poisons, enemy.FindModifierByNameAndCaster("modifier_imba_poison_sting_debuff", caster));
                table.insert(poisons, enemy.FindModifierByNameAndCaster("modifier_imba_poison_sting_debuff_ward", caster));
                table.insert(poisons, enemy.FindModifierByNameAndCaster("modifier_imba_poison_sting_v2_ward", caster));
                let novas = enemy.FindAllModifiersByName("modifier_imba_poison_nova");
                for (const [_, nova] of ipairs(novas)) {
                    if (nova.GetCasterPlus() == this.GetCasterPlus()) {
                        table.insert(poisons, nova);
                    }
                }
                if (!caster.PassivesDisabled()) {
                    for (const [_, poison] of ipairs(poisons)) {
                        if (debuff) {
                            debuff.IncrementStackCount();
                        } else {
                            debuff = enemy.AddNewModifier(caster, ability, "modifier_imba_toxicity_debuff", {});
                        }
                    }
                }
                if (debuff && (GameFunc.GetCount(poisons) == 0)) {
                    debuff.Destroy();
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_toxicity_debuff extends BaseModifier_Plus {
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
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        this.SetStackCount(1);
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuns = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        }
        return Object.values(decFuns);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        if (this.GetAbilityPlus()) {
            return (this.GetAbilityPlus().GetTalentSpecialValueFor("magic_amp_pct") * this.GetStackCount()) * (-1);
        }
    }
}
@registerAbility()
export class imba_venomancer_venomous_gale extends BaseAbility_Plus {
    public bWardCaster: any;
    tempdata: { [k: string]: any } = {}
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
        return "venomancer_venomous_gale";
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (IsClient()) {
            return super.GetCastRange(location, target);
        } else {
            for (const [_, ally] of ipairs(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), location, undefined, this.GetSpecialValueFor("ward_range") + this.GetCasterPlus().GetCastRangeBonus(), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_OTHER, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false))) {
                if (ally.GetName() == "npc_dota_venomancer_plagueward" && ally.GetOwnerPlus() == this.GetCasterPlus()) {
                    return 25000;
                }
            }
            return super.GetCastRange(location, target);
        }
    }
    GetCastAnimation(): GameActivity_t {
        if (this.bWardCaster) {
            return 0;
        } else {
            return GameActivity_t.ACT_DOTA_CAST_ABILITY_1;
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target_loc = this.GetCursorPosition();
        let caster_loc;
        let cast_range = this.GetSpecialValueFor("cast_range");
        let ward_range = this.GetSpecialValueFor("ward_range") + GPropertyCalculate.GetCastRangeBonus(caster);
        if ((this.GetCasterPlus().GetAbsOrigin() - this.GetCursorPosition() as Vector).Length2D() > this.GetSpecialValueFor("cast_range") + this.GetCasterPlus().GetCastRangeBonus()) {
            for (const [_, ally] of ipairs(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCursorPosition(), undefined, this.GetSpecialValueFor("ward_range") + this.GetCasterPlus().GetCastRangeBonus(), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_OTHER, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false))) {
                if (ally.GetName() == "npc_dota_venomancer_plagueward" && ally.GetOwnerPlus() == this.GetCasterPlus() && (ally.GetAbsOrigin() - this.GetCursorPosition() as Vector).Length2D() < (this.GetCasterPlus().GetAbsOrigin() - this.GetCursorPosition() as Vector).Length2D()) {
                    this.bWardCaster = ally;
                    return;
                }
            }
        }
        let mouth_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_venomancer/venomancer_venomous_gale_mouth.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
        if (this.bWardCaster) {
            caster_loc = this.bWardCaster.GetAbsOrigin();
            ParticleManager.SetParticleControlEnt(mouth_pfx, 0, this.bWardCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.bWardCaster.GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(mouth_pfx);
            this.bWardCaster.AddNewModifier(caster, this, "modifier_imba_venomous_gale_wardcast", {
                duration: 0.4
            });
            this.bWardCaster.FadeGesture(GameActivity_t.ACT_DOTA_ATTACK);
            this.bWardCaster.StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_ATTACK, 2.3);
            this.bWardCaster.SetForwardVector((target_loc - caster_loc as Vector).Normalized());
        } else {
            caster_loc = caster.GetAbsOrigin();
            ParticleManager.SetParticleControlEnt(mouth_pfx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_mouth", caster.GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(mouth_pfx);
        }
        let duration = this.GetSpecialValueFor("duration");
        let strike_damage = this.GetSpecialValueFor("strike_damage");
        let tick_damage = this.GetSpecialValueFor("tick_damage");
        let tick_interval = this.GetSpecialValueFor("tick_interval");
        let projectile_speed = this.GetSpecialValueFor("speed");
        let radius = this.GetSpecialValueFor("radius");
        let direction;
        if (target_loc == caster_loc) {
            direction = caster.GetForwardVector();
        } else {
            direction = (target_loc - caster_loc as Vector).Normalized();
        }
        let index = DoUniqueString("index");
        this.tempdata[index] = {}
        let travel_distance;
        caster.EmitSound("Hero_Venomancer.VenomousGale");
        let projectile_count = 1;
        if (caster.HasTalent("special_bonus_imba_venomancer_7")) {
            projectile_count = caster.GetTalentValue("special_bonus_imba_venomancer_7");
        }
        ParticleManager.SetParticleControlEnt(mouth_pfx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_mouth", caster.GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(mouth_pfx);
        for (let i = 1; i <= projectile_count; i += 1) {
            let angle = 360 - (360 / projectile_count) * i;
            let velocity = GFuncVector.RotateVector2D(direction, angle, true);
            let projectile;
            if (this.bWardCaster) {
                travel_distance = this.GetSpecialValueFor("ward_range") + GPropertyCalculate.GetCastRangeBonus(caster);
                projectile = {
                    Ability: this,
                    EffectName: "particles/units/heroes/hero_venomancer/venomancer_venomous_gale.vpcf",
                    vSpawnOrigin: this.bWardCaster.GetAbsOrigin(),
                    fDistance: travel_distance,
                    fStartRadius: radius,
                    fEndRadius: radius,
                    Source: caster,
                    bHasFrontalCone: true,
                    // bReplaceExisting: false,
                    iUnitTargetTeam: this.GetAbilityTargetTeam(),
                    iUnitTargetFlags: this.GetAbilityTargetFlags(),
                    iUnitTargetType: this.GetAbilityTargetType(),
                    fExpireTime: GameRules.GetGameTime() + 10.0,
                    // bDeleteOnHit: true,
                    vVelocity: Vector(velocity.x, velocity.y, 0) * projectile_speed as Vector,
                    bProvidesVision: true,
                    iVisionRadius: 280,
                    iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber(),
                    ExtraData: {
                        index: index,
                        strike_damage: strike_damage,
                        duration: duration,
                        projectile_count: projectile_count
                    }
                }
            } else {
                travel_distance = super.GetCastRange(target_loc, undefined) + GPropertyCalculate.GetCastRangeBonus(caster);
                projectile = {
                    Ability: this,
                    EffectName: "particles/units/heroes/hero_venomancer/venomancer_venomous_gale.vpcf",
                    vSpawnOrigin: caster.GetAttachmentOrigin(caster.ScriptLookupAttachment("attach_mouth")),
                    fDistance: travel_distance,
                    fStartRadius: radius,
                    fEndRadius: radius,
                    Source: caster,
                    bHasFrontalCone: true,
                    // bReplaceExisting: false,
                    iUnitTargetTeam: this.GetAbilityTargetTeam(),
                    iUnitTargetFlags: this.GetAbilityTargetFlags(),
                    iUnitTargetType: this.GetAbilityTargetType(),
                    fExpireTime: GameRules.GetGameTime() + 10.0,
                    // bDeleteOnHit: true,
                    vVelocity: Vector(velocity.x, velocity.y, 0) * projectile_speed as Vector,
                    bProvidesVision: true,
                    iVisionRadius: 280,
                    iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber(),
                    ExtraData: {
                        index: index,
                        strike_damage: strike_damage,
                        duration: duration,
                        projectile_count: projectile_count
                    }
                }
            }
            ProjectileManager.CreateLinearProjectile(projectile);
        }
        this.bWardCaster = undefined;
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        let caster = this.GetCasterPlus();
        if (target) {
            let was_hit = false;
            for (const [_, stored_target] of ipairs(this.tempdata[ExtraData.index])) {
                if (target == stored_target) {
                    was_hit = true;
                    return;
                }
            }
            if (was_hit) {
                return undefined;
            } else {
                table.insert(this.tempdata[ExtraData.index], target);
            }
            ApplyDamage({
                victim: target,
                attacker: caster,
                ability: this,
                damage: ExtraData.strike_damage,
                damage_type: this.GetAbilityDamageType()
            });
            target.AddNewModifier(caster, this, "modifier_imba_venomous_gale", {
                duration: ExtraData.duration * (1 - target.GetStatusResistance())
            });
            target.EmitSound("Hero_Venomancer.VenomousGaleImpact");
            if ((target.IsRealHero() || target.IsClone()) && this.GetCasterPlus().HasTalent("special_bonus_imba_venomancer_venomous_gale_plague_wards") && this.GetCasterPlus().HasAbility("imba_venomancer_plague_ward_v2") && this.GetCasterPlus().findAbliityPlus<imba_venomancer_plague_ward_v2>("imba_venomancer_plague_ward_v2").IsTrained()) {
                let starting_position = target.GetAbsOrigin() + RandomVector(100) as Vector;
                for (let num = 1; num <= this.GetCasterPlus().GetTalentValue("special_bonus_imba_venomancer_venomous_gale_plague_wards"); num += 1) {
                    this.GetCasterPlus().findAbliityPlus<imba_venomancer_plague_ward_v2>("imba_venomancer_plague_ward_v2").OnSpellStart(RotatePosition(target.GetAbsOrigin(), QAngle(0, (360 / this.GetCasterPlus().GetTalentValue("special_bonus_imba_venomancer_venomous_gale_plague_wards")) * num, 0), starting_position));
                }
            }
        } else {
            this.tempdata[ExtraData.index]["count"] = this.tempdata[ExtraData.index]["count"] || 0;
            this.tempdata[ExtraData.index]["count"] = this.tempdata[ExtraData.index]["count"] + 1;
            if (this.tempdata[ExtraData.index]["count"] == ExtraData.projectile_count) {
                if ((GameFunc.GetCount(this.tempdata[ExtraData.index]) > 0) && (caster.GetName() == "npc_dota_hero_venomancer")) {
                    caster.EmitSound("venomancer_venm_cast_0" + math.random(1, 2));
                }
                this.tempdata[ExtraData.index] = undefined;
            }
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_venomancer_1") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_venomancer_1")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_venomancer_1"), "modifier_special_bonus_imba_venomancer_1", {});
        }
    }
}
@registerModifier()
export class modifier_imba_venomous_gale extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public tick_interval: number;
    public tick_damage: number;
    public movement_slow: any;
    public slow_recover_instances: any;
    public recover_per_instance: any;
    public counter: number;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
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
    GetEffectName(): string {
        return "particles/units/heroes/hero_venomancer/venomancer_gale_poison_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_POINT_FOLLOW;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_poison_venomancer.vpcf";
    }
    Init(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.tick_interval = this.ability.GetSpecialValueFor("tick_interval");
        this.tick_damage = this.ability.GetSpecialValueFor("tick_damage");
        if (!IsServer()) {
            return;
        }
        this.movement_slow = this.ability.GetTalentSpecialValueFor("movement_slow");
        this.SetStackCount(this.movement_slow * (1 - this.GetParentPlus().GetStatusResistance()) * (-1) * 100);
        this.slow_recover_instances = 50;
        this.recover_per_instance = (this.movement_slow * (1 - this.GetParentPlus().GetStatusResistance())) / this.slow_recover_instances;
        this.counter = 0;
        this.StartIntervalThink(0.3);
    }

    OnIntervalThink(): void {
        this.counter = this.counter + 1;
        let parent = this.GetParentPlus();
        if (this.counter >= (this.tick_interval / 0.3)) {
            this.counter = 0;
            ApplyDamage({
                victim: parent,
                attacker: this.GetCasterPlus(),
                ability: this.ability,
                damage: this.tick_damage,
                damage_type: this.ability.GetAbilityDamageType()
            });
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, parent, this.tick_damage, undefined);
        }
        if (this.GetStackCount() <= 0) {
            this.SetStackCount(this.GetStackCount() + (this.recover_per_instance * 100));
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.GetParentPlus().GetHealthPercent() < 25) {
            return {
                [modifierstate.MODIFIER_STATE_SPECIALLY_DENIABLE]: true
            };
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetStackCount() * 0.01;
    }
}
@registerModifier()
export class modifier_imba_venomous_gale_wardcast extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
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
    RemoveOnDeath(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuns = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_TURNING
        }
        return Object.values(decFuns);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_TURNING)
    CC_GetModifierDisableTurning(): 0 | 1 {
        return 1;
    }
}
@registerAbility()
export class imba_venomancer_poison_sting extends BaseAbility_Plus {
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
    GetAbilityTextureName(): string {
        return "venomancer_poison_sting";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_poison_sting";
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_venomancer_2") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_venomancer_2")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_venomancer_2"), "modifier_special_bonus_imba_venomancer_2", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_venomancer_poison_sting_slow") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_venomancer_poison_sting_slow")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_venomancer_poison_sting_slow"), "modifier_special_bonus_imba_venomancer_poison_sting_slow", {});
        }
    }
}
@registerModifier()
export class modifier_imba_poison_sting extends BaseModifier_Plus {
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
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            2: Enum_MODIFIER_EVENT.ON_ATTACK
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(params: ModifierAttackEvent): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if ((caster == params.target) && (params.attacker.IsCreep || params.attacker.IsHero)) {
                if (!params.attacker.IsBuilding() && caster.HasTalent("special_bonus_imba_venomancer_6")) {
                    let ability = this.GetAbilityPlus();
                    let duration = ability.GetSpecialValueFor("duration");
                    let mod = params.attacker.AddNewModifier(caster, ability, "modifier_imba_poison_sting_debuff", {
                        duration: (duration - FrameTime()) * (1 - params.attacker.GetStatusResistance())
                    });
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            let duration = ability.GetSpecialValueFor("duration");
            if (caster.PassivesDisabled()) {
                return;
            }
            if ((caster == params.attacker) && (params.target.IsCreep || params.target.IsHero)) {
                if (!params.target.IsBuilding() && !params.target.IsMagicImmune()) {
                    let mod = params.target.AddNewModifier(caster, ability, "modifier_imba_poison_sting_debuff", {
                        duration: (duration - FrameTime()) * (1 - params.target.GetStatusResistance())
                    });
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_poison_sting_debuff extends BaseModifier_Plus {
    public damage: number;
    public stack_damage: number;
    public hp_regen_reduction: any;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
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
    GetEffectName(): string {
        return "particles/units/heroes/hero_venomancer/venomancer_poison_debuff.vpcf";
    }
    BeCreated(params: any): void {
        this.damage = this.GetSpecialValueFor("damage");
        this.stack_damage = this.GetSpecialValueFor("stack_damage");
        this.hp_regen_reduction = this.GetSpecialValueFor("hp_regen_reduction") * (-1);
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(this.GetAbilityPlus().GetTalentSpecialValueFor("movement_speed_pct") * (1 - this.GetParentPlus().GetStatusResistance()) * (-1) * 100);
        this.OnIntervalThink();
        this.StartIntervalThink(1);
    }
    BeRefresh(params: any): void {
        this.damage = this.damage + this.GetSpecialValueFor("stack_damage");
        this.hp_regen_reduction = this.GetSpecialValueFor("hp_regen_reduction") * (-1);
        if (!IsServer()) {
            return;
        }
        this.OnIntervalThink();
    }
    OnIntervalThink(): void {
        ApplyDamage({
            victim: this.GetParentPlus(),
            damage: this.damage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS,
            attacker: this.GetCasterPlus(),
            ability: this.GetAbilityPlus()
        });
        SendOverheadEventMessage(this.GetCasterPlus().GetPlayerOwner(), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, this.GetParentPlus(), this.damage, undefined);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetStackCount() * 0.01;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_REGEN_AMPLIFY_PERCENTAGE)
    CC_GetModifierHPRegenAmplify_Percentage(): number {
        return this.hp_regen_reduction;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.damage;
    }
}
@registerModifier()
export class modifier_imba_poison_sting_debuff_ward extends BaseModifier_Plus {
    public damage: number;
    public movement_speed_pct: number;
    public stack_damage: number;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    BeCreated(params: any): void {
        let ability = this.GetAbilityPlus();
        this.damage = ability.GetSpecialValueFor("damage");
        this.movement_speed_pct = ability.GetSpecialValueFor("movement_speed_pct");
        this.stack_damage = ability.GetSpecialValueFor("stack_damage");
        this.StartIntervalThink(1);
        this.DamageTick(true);
    }
    BeRefresh(params: any): void {
        this.OnCreated(params);
    }
    DamageTick(bFirstHit = false) {
        let damage;
        if (bFirstHit) {
            damage = this.damage + this.stack_damage * this.GetStackCount();
        } else {
            damage = this.damage + this.stack_damage * (this.GetStackCount() - 1);
        }
        let parent = this.GetParentPlus();
        if (IsServer()) {
            let final_damage = ApplyDamage({
                attacker: this.GetCasterPlus(),
                victim: parent,
                ability: this.GetAbilityPlus(),
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS
            });
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_POISON_DAMAGE, parent, final_damage, undefined);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return (this.movement_speed_pct + (this.GetCasterPlus().GetTalentValue("special_bonus_imba_venomancer_2") * this.GetStackCount())) * (-1);
    }
    OnIntervalThink(): void {
        this.DamageTick();
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_venomancer/venomancer_poison_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_POINT_FOLLOW;
    }
}
@registerAbility()
export class imba_venomancer_plague_ward extends BaseAbility_Plus {
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
        return false;
    }
    GetAbilityTextureName(): string {
        return "venomancer_plague_ward";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target_loc = this.GetCursorPosition();
            let caster_loc = caster.GetAbsOrigin();
            let direction;
            if (target_loc == caster_loc) {
                direction = caster.GetForwardVector();
            } else {
                direction = (target_loc - caster_loc as Vector).Normalized();
            }
            let duration = this.GetSpecialValueFor("duration");
            let scourge_hp = this.GetSpecialValueFor("scourge_hp");
            let scourge_damage = this.GetSpecialValueFor("scourge_damage");
            let scourge_gold = this.GetSpecialValueFor("scourge_gold");
            let scourge_xp = this.GetSpecialValueFor("scourge_xp");
            let plague_count = this.GetSpecialValueFor("plague_count");
            let plague_hp = this.GetSpecialValueFor("plague_hp");
            let plague_damage = this.GetSpecialValueFor("plague_damage");
            let plague_radius = this.GetSpecialValueFor("plague_radius");
            scourge_hp = scourge_hp + (scourge_hp * caster.GetTalentValue("special_bonus_imba_venomancer_5") / 100);
            scourge_damage = scourge_damage + (scourge_damage * caster.GetTalentValue("special_bonus_imba_venomancer_5") / 100);
            plague_hp = plague_hp + (plague_hp * caster.GetTalentValue("special_bonus_imba_venomancer_5") / 100);
            plague_damage = plague_damage + (plague_damage * caster.GetTalentValue("special_bonus_imba_venomancer_5") / 100);
            let scourge_ward = BaseNpc_Plus.CreateUnitByName("npc_imba_venomancer_scourge_ward", target_loc, caster.GetTeamNumber(), true, caster, caster);
            scourge_ward.EmitSound("Hero_Venomancer.Plague_Ward");
            let spawn_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_venomancer/venomancer_ward_cast.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, caster);
            ParticleManager.SetParticleControlEnt(spawn_fx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", caster.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(spawn_fx, 1, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", caster.GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(spawn_fx);
            if ((math.random(1, 100) <= 20) && (caster.GetName() == "npc_dota_hero_venomancer")) {
                caster.EmitSound("venomancer_venm_ability_ward_0" + math.random(1, 6));
            }
            let ability_gale = caster.findAbliityPlus<imba_venomancer_venomous_gale>("imba_venomancer_venomous_gale");
            if (ability_gale) {
                GFuncEntity.AddRangeIndicator(scourge_ward, caster, ability_gale, "ward_range", undefined, 183, 247, 33, false, false, true);
            }
            scourge_ward.SetControllableByPlayer(caster.GetPlayerID(), true);
            scourge_ward.SetForwardVector(direction);
            scourge_ward.AddNewModifier(caster, this, "modifier_kill", {
                duration: duration
            });
            scourge_ward.AddNewModifier(caster, this, "modifier_magic_immune", {
                duration: duration
            });
            scourge_ward.SetBaseMaxHealth(scourge_hp);
            scourge_ward.SetMaxHealth(scourge_hp);
            scourge_ward.SetHealth(scourge_hp);
            scourge_ward.SetDeathXP(scourge_xp);
            scourge_ward.SetMaximumGoldBounty(scourge_gold);
            scourge_ward.SetMinimumGoldBounty(scourge_gold);
            scourge_ward.SetBaseDamageMin(scourge_damage);
            scourge_ward.SetBaseDamageMax(scourge_damage);
            scourge_ward.TempData().bIsScourge = true;
            if (plague_count >= 1) {
                let start_angle = math.random() * 360;
                let angle = 360 / plague_count;
                let mod_ward = scourge_ward.AddNewModifier(caster, this, "modifier_imba_plague_ward", {
                    duration: duration
                }) as modifier_imba_plague_ward;
                mod_ward.ward_list = []
                for (let i = 1; i <= plague_count; i += 1) {
                    let plague_loc = target_loc + GFuncVector.RotateVector2D(direction, start_angle + (angle * i), true) * plague_radius as Vector;
                    let plague_ward = BaseNpc_Plus.CreateUnitByName("npc_imba_venomancer_plague_ward", plague_loc, caster.GetTeamNumber(), true, caster, caster);
                    plague_ward.SetControllableByPlayer(caster.GetPlayerID(), true);
                    plague_ward.SetForwardVector(direction);
                    let mod_kill = plague_ward.AddNewModifier(caster, this, "modifier_kill", {
                        duration: duration
                    });
                    plague_ward.AddNewModifier(caster, this, "modifier_magic_immune", {
                        duration: duration
                    });
                    plague_ward.SetBaseMaxHealth(plague_hp);
                    plague_ward.SetMaxHealth(plague_hp);
                    plague_ward.SetHealth(plague_hp);
                    plague_ward.SetBaseDamageMin(plague_damage);
                    plague_ward.SetBaseDamageMax(plague_damage);
                    table.insert(mod_ward.ward_list, plague_ward);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_plague_ward extends BaseModifier_Plus {
    ward_list: any[]
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
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
    RemoveOnDeath(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/items_fx/black_king_bar_avatar.vpcf";
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuns = {
            1: Enum_MODIFIER_EVENT.ON_DEATH
        }
        return Object.values(decFuns);
    } */
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true
        }
        return state;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(params: ModifierInstanceEvent): void {
        if (IsServer()) {
            for (let i = 1; i <= GameFunc.GetCount(this.ward_list); i += 1) {
                if (params.unit == this.ward_list[i]) {
                    table.remove(this.ward_list, i);
                }
                if (GameFunc.GetCount(this.ward_list) == 0) {
                    this.Destroy();
                }
            }
        }
    }
}
@registerAbility()
export class imba_venomancer_poison_nova extends BaseAbility_Plus {
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
        return "venomancer_poison_nova";
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return this.GetTalentSpecialValueFor("radius") - this.GetCasterPlus().GetCastRangeBonus();
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let caster_loc = caster.GetAbsOrigin();
            let index = "";
            let radius = this.GetTalentSpecialValueFor("radius");
            let duration = this.GetTalentSpecialValueFor("duration");
            let main_damage;
            if (caster.HasScepter()) {
                main_damage = this.GetSpecialValueFor("main_damage_scepter");
                index = DoUniqueString("index");
            } else {
                main_damage = this.GetSpecialValueFor("main_damage");
            }
            let damage_pct = this.GetSpecialValueFor("damage_pct") / 100;
            let health_pct = this.GetSpecialValueFor("health_pct") / 100;
            let health_threshold_pct = this.GetSpecialValueFor("health_threshold_pct") / 100;
            let contagion_radius = this.GetSpecialValueFor("contagion_radius");
            let contagion_min_duration = this.GetSpecialValueFor("contagion_min_duration");
            caster.MakeVisibleToTeam(DOTATeam_t.DOTA_TEAM_GOODGUYS, 1.0);
            caster.MakeVisibleToTeam(DOTATeam_t.DOTA_TEAM_BADGUYS, 1.0);
            let line = math.random(1, 21);
            if (line >= 10) {
                caster.EmitSound("venomancer_venm_ability_nova_" + line);
            } else {
                caster.EmitSound("venomancer_venm_ability_nova_0" + line);
            }
            caster.EmitSound("Hero_Venomancer.PoisonNova");
            let nova_caster_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_venomancer/venomancer_poison_nova_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(nova_caster_pfx, 0, caster.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(nova_caster_pfx);
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_poison_nova_ring", {
                duration: ((this.GetTalentSpecialValueFor("radius") - this.GetSpecialValueFor("start_radius")) / this.GetSpecialValueFor("speed"))
            });
        }
    }
    GetCooldown(nLevel: number): number {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("cooldown_scepter");
        }
        return super.GetCooldown(nLevel);
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_venomancer_poison_nova_radius") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_venomancer_poison_nova_radius")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_venomancer_poison_nova_radius"), "modifier_special_bonus_imba_venomancer_poison_nova_radius", {});
        }
    }
}
@registerModifier()
export class modifier_imba_poison_nova_ring extends BaseModifier_Plus {
    public radius: number;
    public start_radius: number;
    public speed: number;
    public duration: number;
    public main_damage: number;
    public index: any;
    public damage_pct: number;
    public health_pct: number;
    public health_threshold_pct: number;
    public contagion_radius: number;
    public contagion_min_duration: number;
    public cast_location: any;
    public hit_enemies: any;
    public nova_particle: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.radius = this.GetAbilityPlus().GetTalentSpecialValueFor("radius");
        this.start_radius = this.GetSpecialValueFor("start_radius");
        this.speed = this.GetSpecialValueFor("speed");
        this.duration = this.GetAbilityPlus().GetTalentSpecialValueFor("duration");
        this.main_damage = this.GetSpecialValueFor("main_damage");
        this.index = 0;
        this.damage_pct = this.GetSpecialValueFor("damage_pct") / 100;
        this.health_pct = this.GetSpecialValueFor("health_pct") / 100;
        this.health_threshold_pct = this.GetSpecialValueFor("health_threshold_pct") / 100;
        this.contagion_radius = this.GetSpecialValueFor("contagion_radius");
        this.contagion_min_duration = this.GetSpecialValueFor("contagion_min_duration");
        if (this.GetCasterPlus().HasScepter()) {
            this.main_damage = this.GetSpecialValueFor("main_damage_scepter");
            this.index = DoUniqueString("index");
        }
        this.cast_location = this.GetParentPlus().GetAbsOrigin();
        this.hit_enemies = {}
        this.nova_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_venomancer/venomancer_poison_nova.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(this.nova_particle, 1, Vector(this.radius, (this.radius - this.start_radius) / this.speed, this.speed));
        this.AddParticle(this.nova_particle, false, false, -1, false, false);
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        for (const [_, enemy] of ipairs(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.cast_location, undefined, math.min(this.start_radius + (this.GetElapsedTime() * this.speed), this.radius), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false))) {
            if (!this.hit_enemies[enemy.entindex()]) {
                enemy.EmitSound("Hero_Venomancer.PoisonNovaImpact");
                enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_poison_nova", {
                    duration: this.duration + 2 * FrameTime(),
                    main_damage: this.main_damage,
                    damage_pct: this.damage_pct,
                    health_pct: this.health_pct,
                    health_threshold_pct: this.health_threshold_pct,
                    contagion_radius: this.contagion_radius,
                    contagion_min_duration: this.contagion_min_duration,
                    index: this.index
                });
                this.hit_enemies[enemy.entindex()] = true;
            }
        }
    }
}
@registerModifier()
export class modifier_imba_poison_nova extends BaseModifier_Plus {
    public main_damage: number;
    public damage_pct: number;
    public health_pct: number;
    public health_threshold_pct: number;
    public contagion_radius: number;
    public contagion_min_duration: number;
    public index: any;
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
        return false;
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
    BeCreated(params: any): void {
        if (IsServer()) {
            this.main_damage = params.main_damage;
            this.damage_pct = params.damage_pct;
            this.health_pct = params.health_pct;
            this.health_threshold_pct = params.health_threshold_pct;
            this.contagion_radius = params.contagion_radius;
            this.contagion_min_duration = params.contagion_min_duration;
            this.index = params.index;
            this.DealDamage(true);
            this.StartIntervalThink(1);
        }
    }
    DealDamage(bFirst = false): void {
        let parent = this.GetParentPlus();
        let caster = this.GetCasterPlus();
        let current_health_pct = parent.GetHealth() / parent.GetMaxHealth();
        if (!parent.IsMagicImmune()) {
            let damage = this.main_damage * (1 + ((math.max(0, current_health_pct - this.health_threshold_pct) / this.health_pct) * this.damage_pct));
            ApplyDamage({
                victim: parent,
                attacker: caster,
                ability: this.GetAbilityPlus(),
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NON_LETHAL
            });
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, parent, damage, undefined);
        }
        if (!bFirst) {
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), parent.GetAbsOrigin(), undefined, this.contagion_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of ipairs(enemies)) {
                if (!(enemy == parent)) {
                    let bAlreadyAffected = false;
                    let nova_poison = enemy.FindAllModifiersByName("modifier_imba_poison_nova") as modifier_imba_poison_nova[];
                    for (const [_, poison] of ipairs(nova_poison)) {
                        if (poison.index == this.index) {
                            bAlreadyAffected = true;
                            return;
                        }
                    }
                    if (!bAlreadyAffected) {
                        enemy.AddNewModifier(caster, this.GetAbilityPlus(), "modifier_imba_poison_nova", {
                            duration: math.max(this.GetRemainingTime(), this.contagion_min_duration) + 2 * FrameTime(),
                            main_damage: this.main_damage,
                            damage_pct: this.damage_pct,
                            health_pct: this.health_pct,
                            health_threshold_pct: this.health_threshold_pct,
                            contagion_radius: this.contagion_radius,
                            contagion_min_duration: this.contagion_min_duration,
                            index: this.index
                        });
                    }
                }
            }
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            this.DealDamage(false);
        }
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_poison_venomancer.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return 10;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_venomancer/venomancer_poison_debuff_nova.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_venomancer_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_venomancer_venomous_gale_plague_wards extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_venomancer_6 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_venomancer_plague_ward_upgrade extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_venomancer_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_venomancer_2 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_venomancer_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_venomancer_poison_sting_slow extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_venomancer_poison_nova_radius extends BaseModifier_Plus {
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
