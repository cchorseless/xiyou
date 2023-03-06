
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerModifier()
export class modifier_special_bonus_imba_vengefulspirit_4 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsAura(): boolean {
        return true;
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        if (IsServer()) {
            if (target == this.GetCasterPlus()) {
                return true;
            }
            return false;
        }
    }
    GetModifierAura(): string {
        return "modifier_imba_rancor_allies";
    }
    GetAuraRadius(): number {
        let caster = this.GetCasterPlus();
        if (caster.IsRealUnit()) {
            return this.GetCasterPlus().GetTalentValue("special_bonus_imba_vengefulspirit_4", "radius");
        } else {
            return 0;
        }
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
}
@registerAbility()
export class imba_vengefulspirit_rancor extends BaseAbility_Plus {
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
        return "vengeful_rancor";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_rancor";
    }
}
@registerModifier()
export class modifier_imba_rancor extends BaseModifier_Plus {
    public dmg_received_pct: number;
    public max_stacks: number;
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
        this.dmg_received_pct = this.dmg_received_pct || 0;
        this.max_stacks = this.GetSpecialValueFor("max_stacks");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(params: ModifierInstanceEvent): void {
        if (this.GetAbilityPlus() && ((this.GetParentPlus() == params.unit) || params.unit.HasModifier("modifier_imba_rancor_allies")) && params.damage > 0 && !this.GetParentPlus().PassivesDisabled() && params.unit.IsRealUnit()) {
            if (params.unit.HasModifier("modifier_imba_rancor_allies") && !(this.GetParentPlus() == params.unit)) {
                if (params.unit.FindModifierByNameAndCaster("modifier_imba_rancor_allies", this.GetParentPlus())) {
                    this.dmg_received_pct = this.dmg_received_pct + ((100 / this.GetParentPlus().GetMaxHealth()) * math.min(params.damage, this.GetParentPlus().GetHealth())) * (this.GetParentPlus().GetTalentValue("special_bonus_imba_vengefulspirit_4", "rate_pct") / 100);
                }
            } else {
                this.dmg_received_pct = this.dmg_received_pct + ((100 / this.GetParentPlus().GetMaxHealth()) * math.min(params.damage, this.GetParentPlus().GetHealth()));
            }
            while ((this.dmg_received_pct >= this.GetSpecialValueFor("stack_receive_pct"))) {
                if (this.GetParentPlus().HasModifier("modifier_imba_rancor_stack")) {
                    let modifier = this.GetParentPlus().findBuff<modifier_imba_rancor_stack>("modifier_imba_rancor_stack");
                    if (modifier.GetStackCount() < this.max_stacks) {
                        modifier.IncrementStackCount();
                    }
                } else {
                    let modifier = this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_rancor_stack", {});
                    modifier.SetStackCount(1);
                }
                this.dmg_received_pct = this.dmg_received_pct - this.GetSpecialValueFor("stack_receive_pct");
            }
        }
    }
}
@registerModifier()
export class modifier_imba_rancor_allies extends BaseModifier_Plus {
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
}
@registerModifier()
export class modifier_imba_rancor_stack extends BaseModifier_Plus {
    public aura_radius: number;
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
        return false;
    }
    BeCreated(p_0: any,): void {
        this.aura_radius = this.GetSpecialValueFor("aura_radius");
        if (IsServer()) {
            this.StartIntervalThink(this.GetSpecialValueFor("stack_duration"));
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.GetParentPlus().IsAlive()) {
                if (this.GetStackCount() == 1) {
                    this.Destroy();
                } else {
                    this.DecrementStackCount();
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        if (this.GetAbilityPlus()) {
            return (this.GetSpecialValueFor("spell_power") * this.GetStackCount());
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        if (this.GetAbilityPlus()) {
            return (this.GetSpecialValueFor("damage_pct") * this.GetStackCount());
        }
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return true;
    }
    GetModifierAura(): string {
        return "modifier_imba_rancor_ally_aura";
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        if (target == this.GetCasterPlus()) {
            return true;
        }
    }
    GetAuraRadius(): number {
        if (this.GetCasterPlus().IsRealUnit() && this.GetAbilityPlus()) {
            return this.GetSpecialValueFor("aura_radius");
        }
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
}
@registerModifier()
export class modifier_imba_rancor_ally_aura extends BaseModifier_Plus {
    public spell_power: any;
    public damage_pct: number;
    public modifier: any;
    BeCreated(p_0: any,): void {
        this.spell_power = this.GetSpecialValueFor("spell_power") * this.GetSpecialValueFor("aura_efficiency") * 0.01;
        this.damage_pct = this.GetSpecialValueFor("damage_pct") * this.GetSpecialValueFor("aura_efficiency") * 0.01;
        if (!IsServer()) {
            return;
        }
        this.modifier = this.GetAuraOwner().findBuff<modifier_imba_rancor_stack>("modifier_imba_rancor_stack");
        if (!this.modifier) {
            this.Destroy();
        }
        this.StartIntervalThink(0.1);
    }
    OnIntervalThink(): void {
        if (this.modifier && !this.modifier.IsNull()) {
            this.SetStackCount(this.modifier.GetStackCount());
        } else {
            this.StartIntervalThink(-1);
            this.Destroy();
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        return (this.spell_power * this.GetStackCount());
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return (this.damage_pct * this.GetStackCount());
    }
}
@registerAbility()
export class imba_vengefulspirit_magic_missile extends BaseAbility_Plus {
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
    GetAOERadius(): number {
        return this.GetTalentSpecialValueFor("split_radius");
    }
    GetCooldown(level: number): number {
        return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_vengefulspirit_11");
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (!this.GetCasterPlus().HasTalent("special_bonus_imba_vengefulspirit_5")) {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, this.GetCasterPlus().GetTeamNumber());
        } else {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, this.GetCasterPlus().GetTeamNumber());
        }
    }
    OnSpellStart(params?: IBaseNpc_Plus, reduce_pct?: number, target_loc?: IBaseNpc_Plus, ix?: string /** params */  /** , reduce_pct */  /** , target_loc */  /** , ix */): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target;
            if (params) {
                target = params;
            } else {
                target = this.GetCursorTarget();
            }
            let damage = this.GetTalentSpecialValueFor("damage");
            let stun_duration = this.GetSpecialValueFor("stun_duration");
            let split_radius = this.GetSpecialValueFor("split_radius");
            let split_reduce_pct = this.GetSpecialValueFor("split_reduce_pct");
            let split_amount = this.GetSpecialValueFor("split_amount");
            let projectile_speed = this.GetSpecialValueFor("projectile_speed");
            let index = "";
            if (ix) {
                index = ix;
            } else {
                index = DoUniqueString("projectile");
                let proj_index = "projectile_" + index;
                this.tempdata[index] = 0;
                this.tempdata[proj_index] = []
                table.insert(this.tempdata[proj_index], target);
            }
            if (reduce_pct) {
                damage = math.ceil(damage - (damage * (reduce_pct / 100)));
                stun_duration = stun_duration - (stun_duration * (reduce_pct / 100));
                split_reduce_pct = reduce_pct + (reduce_pct * (split_reduce_pct / 100));
            } else {
                caster.EmitSound("Hero_VengefulSpirit.MagicMissile");
                if ((math.random(1, 100) <= 5) && (caster.GetName().includes("vengefulspirit"))) {
                    caster.EmitSound("vengefulspirit_vng_cast_05");
                }
            }
            let projectile: CreateTrackingProjectileOptions;
            if (params) {
                projectile = {
                    Target: target,
                    Source: target_loc,
                    Ability: this,
                    EffectName: "particles/units/heroes/hero_vengeful/vengeful_magic_missle.vpcf",
                    iMoveSpeed: projectile_speed,
                    bDrawsOnMinimap: false,
                    bDodgeable: true,
                    bIsAttack: false,
                    bVisibleToEnemies: true,
                    bReplaceExisting: false,
                    flExpireTime: GameRules.GetGameTime() + 10,
                    bProvidesVision: false,
                    ExtraData: {
                        index: index,
                        target_index: target.GetEntityIndex(),
                        damage: damage,
                        stun_duration: stun_duration,
                        split_radius: split_radius,
                        split_reduce_pct: split_reduce_pct,
                        split_amount: split_amount
                    }
                }
            } else {
                projectile = {
                    Target: target,
                    Source: caster,
                    Ability: this,
                    EffectName: "particles/units/heroes/hero_vengeful/vengeful_magic_missle.vpcf",
                    iMoveSpeed: projectile_speed,
                    // vSpawnOrigin: caster.GetAbsOrigin(),
                    bDrawsOnMinimap: false,
                    bDodgeable: true,
                    bIsAttack: false,
                    bVisibleToEnemies: true,
                    bReplaceExisting: false,
                    flExpireTime: GameRules.GetGameTime() + 10,
                    bProvidesVision: false,
                    iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_ATTACK_2,
                    ExtraData: {
                        index: index,
                        target_index: target.GetEntityIndex(),
                        damage: damage,
                        stun_duration: stun_duration,
                        split_radius: split_radius,
                        split_reduce_pct: split_reduce_pct,
                        split_amount: split_amount
                    }
                }
            }
            ProjectileManager.CreateTrackingProjectile(projectile);
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let proj_index = "projectile_" + ExtraData.index;
            this.tempdata[ExtraData.index] = this.tempdata[ExtraData.index] + 1;
            if (target) {
                if (GameFunc.GetCount(this.tempdata[proj_index]) == 1) {
                    if (target.TriggerSpellAbsorb(this)) {
                        return undefined;
                    }
                }
                ApplyDamage({
                    victim: target,
                    attacker: caster,
                    ability: this,
                    damage: ExtraData.damage,
                    damage_type: this.GetAbilityDamageType()
                });
                if ((!target.IsMagicImmune()) || caster.HasTalent("special_bonus_imba_vengefulspirit_5")) {
                    target.AddNewModifier(caster, this, "modifier_stunned", {
                        duration: ExtraData.stun_duration * (1 - target.GetStatusResistance())
                    });
                }
            }
            EmitSoundOnLocationWithCaster(location, "Hero_VengefulSpirit.MagicMissileImpact", caster);
            let valid_targets: IBaseNpc_Plus[] = []
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), location, undefined, ExtraData.split_radius, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let already_hit = false;
                for (const [_, stored_target] of GameFunc.iPair(this.tempdata[proj_index])) {
                    if (stored_target == enemy) {
                        already_hit = true;
                        return;
                    }
                }
                if (!already_hit) {
                    table.insert(valid_targets, enemy);
                }
            }
            let target_missiles = math.min(GameFunc.GetCount(valid_targets), ExtraData.split_amount);
            if (target) {
                for (let i = 0; i < target_missiles; i++) {
                    this.OnSpellStart(valid_targets[i], ExtraData.split_reduce_pct, target, ExtraData.index);
                    table.insert(this.tempdata[proj_index], valid_targets[i]);
                }
            }
            if (this.tempdata[ExtraData.index] == GameFunc.GetCount(this.tempdata[proj_index])) {
                this.tempdata[ExtraData.index] = undefined;
                this.tempdata[proj_index] = undefined;
            }
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_vengefulspirit_5") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_vengefulspirit_5")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_vengefulspirit_5"), "modifier_special_bonus_imba_vengefulspirit_5", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_vengefulspirit_11") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_vengefulspirit_11")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_vengefulspirit_11"), "modifier_special_bonus_imba_vengefulspirit_11", {});
        }
    }
}
@registerAbility()
export class imba_vengefulspirit_wave_of_terror extends BaseAbility_Plus {
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
        return "vengefulspirit_wave_of_terror";
    }
    GetCooldown(level: number): number {
        return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_vengefulspirit_10");
    }
    OnSpellStart(): void {
        if (IsServer()) {
            if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
                this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
            }
            let caster = this.GetCasterPlus();
            let target_loc = this.GetCursorPosition();
            let caster_loc = caster.GetAbsOrigin();
            let damage = this.GetSpecialValueFor("damage");
            let speed = this.GetSpecialValueFor("wave_speed");
            let wave_width = this.GetSpecialValueFor("wave_width");
            let duration = this.GetSpecialValueFor("duration");
            let primary_distance = this.GetCastRange(caster_loc, caster) + GPropertyCalculate.GetCastRangeBonus(caster);
            let vision_aoe = this.GetSpecialValueFor("vision_aoe");
            let vision_duration = this.GetSpecialValueFor("vision_duration");
            let dummy = CreateModifierThinker(this.GetCasterPlus(), this, undefined, {}, this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus().GetTeamNumber(), false);
            dummy.EmitSound("Hero_VengefulSpirit.WaveOfTerror");
            if (caster.GetName().includes("vengefulspirit")) {
                caster.EmitSound("vengefulspirit_vng_ability_0" + math.random(1, 9));
            }
            let direction = (target_loc - caster_loc as Vector).Normalized();
            let velocity = direction * speed as Vector;
            let projectile = {
                Ability: this,
                EffectName: "particles/units/heroes/hero_vengeful/vengeful_wave_of_terror.vpcf",
                vSpawnOrigin: caster_loc,
                fDistance: primary_distance,
                fStartRadius: wave_width,
                fEndRadius: wave_width,
                Source: caster,
                bHasFrontalCone: false,
                bReplaceExisting: false,
                iUnitTargetTeam: this.GetAbilityTargetTeam(),
                iUnitTargetFlags: this.GetAbilityTargetFlags(),
                iUnitTargetType: this.GetAbilityTargetType(),
                fExpireTime: GameRules.GetGameTime() + 10.0,
                bDeleteOnHit: false,
                vVelocity: Vector(velocity.x, velocity.y, 0),
                bProvidesVision: true,
                iVisionRadius: vision_aoe,
                iVisionTeamNumber: caster.GetTeamNumber(),
                ExtraData: {
                    damage: damage,
                    duration: duration,
                    dummy_entindex: dummy.entindex()
                }
            }
            ProjectileManager.CreateLinearProjectile(projectile);
            let current_distance = vision_aoe / 2;
            let tick_rate = vision_aoe / speed / 2;
        }
    }
    OnProjectileThink_ExtraData(location: Vector, ExtraData: any): void {
        if (ExtraData.dummy_entindex) {
            AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), location, this.GetSpecialValueFor("vision_aoe"), this.GetSpecialValueFor("vision_duration"), false);
            EntIndexToHScript(ExtraData.dummy_entindex).SetAbsOrigin(location);
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        if (target) {
            let caster = this.GetCasterPlus();
            ApplyDamage({
                victim: target,
                attacker: caster,
                ability: this,
                damage: ExtraData.damage,
                damage_type: this.GetAbilityDamageType()
            });
            target.AddNewModifier(caster, this, "modifier_imba_wave_of_terror", {
                duration: ExtraData.duration * (1 - target.GetStatusResistance())
            });
        } else {
            if (ExtraData.dummy_entindex) {
                (EntIndexToHScript(ExtraData.dummy_entindex) as IBaseNpc_Plus).ForceKill(false);
            }
        }
        return false;
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_vengefulspirit_9") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_vengefulspirit_9")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_vengefulspirit_9"), "modifier_special_bonus_imba_vengefulspirit_9", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_vengefulspirit_10") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_vengefulspirit_10")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_vengefulspirit_10"), "modifier_special_bonus_imba_vengefulspirit_10", {});
        }
    }
}
@registerModifier()
export class modifier_imba_wave_of_terror extends BaseModifier_Plus {
    public armor_reduction: any;
    public atk_reduction_pct: number;
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
    BeCreated(params: any): void {
        let ability = this.GetAbilityPlus();
        if (!ability) {
            this.Destroy();
            return;
        }
        this.armor_reduction = ability.GetTalentSpecialValueFor("armor_reduction") * (-1);
        this.atk_reduction_pct = ability.GetSpecialValueFor("atk_reduction_pct") * (-1);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.armor_reduction;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.atk_reduction_pct;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_vengeful/vengeful_wave_of_terror_recipient.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_POINT_FOLLOW;
    }
}
@registerAbility()
export class imba_vengefulspirit_command_aura extends BaseAbility_Plus {
    enemy_modifier: modifier_imba_command_aura_negative_aura
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
        return "vengefulspirit_command_aura";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_command_aura_positive_aura";
    }
    OnOwnerDied(): void {
        if (this.IsTrained() && !this.GetCasterPlus().IsIllusion() && !this.GetCasterPlus().PassivesDisabled()) {
            let num_illusions_on_death = this.GetSpecialValueFor("num_illusions_on_death");
            let bounty_base = this.GetCasterPlus().GetIllusionBounty();
            if (this.GetCasterPlus().GetLevel() >= this.GetSpecialValueFor("illusion_upgrade_level")) {
                num_illusions_on_death = this.GetSpecialValueFor("num_illusions_on_death_upgrade");
            }
            if (this.GetCasterPlus().HasScepter()) {
                bounty_base = 0;
            }
            let super_illusions = this.GetCasterPlus().CreateIllusion(this.GetCasterPlus(), {
                outgoing_damage: 100 - this.GetSpecialValueFor("illusion_damage_out_pct"),
                incoming_damage: this.GetSpecialValueFor("illusion_damage_in_pct") - 100,
                bounty_base: bounty_base,
                bounty_growth: undefined,
                outgoing_damage_structure: undefined,
                outgoing_damage_roshan: undefined,
                duration: undefined
            }, num_illusions_on_death);
            for (const [_, illusion] of GameFunc.iPair(super_illusions)) {
                illusion.SetHealth(illusion.GetMaxHealth());
                illusion.AddNewModifier(this.GetCasterPlus(), this, "modifier_vengefulspirit_hybrid_special", {});
                FindClearSpaceForUnit(illusion, this.GetCasterPlus().GetAbsOrigin() + Vector(RandomInt(0, 1), RandomInt(0, 1), 0) * 108 as Vector, true);
                // PlayerResource.NewSelection(this.GetCasterPlus().GetPlayerID(), super_illusions);
            }
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_vengefulspirit_3") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_vengefulspirit_3")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_vengefulspirit_3"), "modifier_special_bonus_imba_vengefulspirit_3", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_vengefulspirit_8") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_vengefulspirit_8")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_vengefulspirit_8"), "modifier_special_bonus_imba_vengefulspirit_8", {});
        }
    }
}
@registerModifier()
export class modifier_imba_command_aura_positive extends BaseModifier_Plus {
    public spell_power: any;
    public bonus_damage_pct: number;
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
        return false;
    }
    BeCreated(p_0: any,): void {
        this.spell_power = this.GetSpecialValueFor("spell_power") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_vengefulspirit_3", "spell_power");
        this.bonus_damage_pct = this.GetSpecialValueFor("bonus_damage_pct") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_vengefulspirit_3", "bonus_damage_pct");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        return this.spell_power;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        if (this.GetCasterPlus()) {
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_vengefulspirit_8")) {
                return 0;
            } else {
                return this.bonus_damage_pct;
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        if (this.GetCasterPlus()) {
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_vengefulspirit_8")) {
                return this.bonus_damage_pct;
            } else {
                return 0;
            }
        }
    }
}
@registerModifier()
export class modifier_imba_command_aura_positive_aura extends BaseModifier_Plus {
    IsAura(): boolean {
        return true;
    }
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
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_DEATH
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(params: ModifierInstanceEvent): void {
        if (IsServer()) {
            if (params.unit == this.GetParentPlus()) {
                if (!params.unit.IsRealUnit()) {
                    return undefined;
                }
                let ability = this.GetAbilityPlus<imba_vengefulspirit_command_aura>();
                ability.enemy_modifier = params.attacker.AddNewModifier(params.unit, ability, "modifier_imba_command_aura_negative_aura", {}) as modifier_imba_command_aura_negative_aura;
            }
        }
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        if (IsServer()) {
            if (this.GetParentPlus().PassivesDisabled()) {
                return true;
            }
            return false;
        }
    }
    GetModifierAura(): string {
        return "modifier_imba_command_aura_positive";
    }
    GetAuraRadius(): number {
        return this.GetSpecialValueFor("aura_radius");
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
}
@registerModifier()
export class modifier_imba_command_aura_negative extends BaseModifier_Plus {
    public spell_power: any;
    public bonus_damage_pct: number;
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
        return false;
    }
    BeCreated(p_0: any,): void {
        this.spell_power = (this.GetSpecialValueFor("spell_power") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_vengefulspirit_3", "spell_power")) * (-1);
        this.bonus_damage_pct = (this.GetSpecialValueFor("bonus_damage_pct") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_vengefulspirit_3", "bonus_damage_pct")) * (-1);
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        return this.spell_power;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_vengefulspirit_8")) {
            return 0;
        } else {
            return this.bonus_damage_pct;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_vengefulspirit_8")) {
            return this.bonus_damage_pct;
        } else {
            return 0;
        }
    }
}
@registerModifier()
export class modifier_imba_command_aura_negative_aura extends BaseModifier_Plus {
    public aura_radius: number;
    IsAura(): boolean {
        return true;
    }
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
        return false;
    }
    BeCreated(p_0: any,): void {
        this.aura_radius = this.GetSpecialValueFor("aura_radius");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuns = {
            1: Enum_MODIFIER_EVENT.ON_RESPAWN
        }
        return Object.values(decFuns);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_RESPAWN)
    CC_OnRespawn(params: ModifierUnitEvent): void {
        if (IsServer()) {
            if ((this.GetCasterPlus() == params.unit)) {
                this.Destroy();
            }
        }
    }
    GetModifierAura(): string {
        return "modifier_imba_command_aura_negative";
    }
    GetAuraRadius(): number {
        return this.aura_radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
}
@registerAbility()
export class imba_vengefulspirit_command_aura_723 extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_vengefulspirit_command_aura_723";
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_vengefulspirit_command_aura_attributes") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_vengefulspirit_command_aura_attributes")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_vengefulspirit_command_aura_attributes"), "modifier_special_bonus_imba_vengefulspirit_command_aura_attributes", {});
        }
    }
}
@registerModifier()
export class modifier_imba_vengefulspirit_command_aura_723 extends BaseModifier_Plus {
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetParentPlus() && keys.unit.IsRealUnit()) {
            keys.attacker.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_vengefulspirit_command_negative_aura_723", {});
            this.GetCasterPlus().SetContextThink(DoUniqueString(this.GetName()), () => {
                for (const [_, unit] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_ANY_ORDER, false))) {
                    if (unit.GetName() == this.GetCasterPlus().GetName() && unit != this.GetCasterPlus() && unit.GetOwnerPlus() && unit.GetOwnerPlus() && unit.GetOwnerPlus() == this.GetCasterPlus()) {
                        if (unit.HasTalent("special_bonus_imba_vengefulspirit_5") && !unit.HasModifier("modifier_special_bonus_imba_vengefulspirit_5")) {
                            unit.AddNewModifier(unit, unit.findAbliityPlus("special_bonus_imba_vengefulspirit_5"), "modifier_special_bonus_imba_vengefulspirit_5", {});
                        }
                        if (unit.HasTalent("special_bonus_imba_vengefulspirit_11") && !unit.HasModifier("modifier_special_bonus_imba_vengefulspirit_11")) {
                            unit.AddNewModifier(unit, unit.findAbliityPlus("special_bonus_imba_vengefulspirit_11"), "modifier_special_bonus_imba_vengefulspirit_11", {});
                        }
                    }
                }
                return undefined;
            }, FrameTime());
        }
    }
    IsHidden(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_vengefulspirit_command_aura_effect_723 extends BaseModifier_Plus {
    public initialized: any;
    public hero_primary_attribute: any;
    BeCreated(p_0: any,): void {
        this.initialized = false;
        this.StartIntervalThink(FrameTime());
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().GetPrimaryAttribute) {
            this.SetStackCount(this.GetParentPlus().GetPrimaryAttribute() || 0);
        }
    }
    OnIntervalThink(): void {
        if (!this.initialized) {
            this.hero_primary_attribute = this.GetStackCount();
            this.SetStackCount(0);
            this.initialized = true;
            if (IsServer()) {
                this.StartIntervalThink(0.5);
            } else {
                this.StartIntervalThink(-1);
            }
        }
        // if (IsServer() && this.GetParentPlus().CalculateStatBonus) {
        //     this.GetParentPlus().CalculateStatBonus(true);
        // }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS,
            5: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (this.GetAbilityPlus() && this.hero_primary_attribute == Attributes.DOTA_ATTRIBUTE_STRENGTH) {
            return this.GetSpecialValueFor("bonus_attributes") + this.GetAbilityPlus().GetTalentValue("special_bonus_unique_vengeful_spirit_2");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        print(this.hero_primary_attribute, Attributes.DOTA_ATTRIBUTE_AGILITY);
        if (this.GetAbilityPlus() && this.hero_primary_attribute == Attributes.DOTA_ATTRIBUTE_AGILITY) {
            print(this.GetSpecialValueFor("bonus_attributes"), this.GetAbilityPlus().GetTalentValue("special_bonus_unique_vengeful_spirit_2"));
            return this.GetSpecialValueFor("bonus_attributes") + this.GetAbilityPlus().GetTalentValue("special_bonus_unique_vengeful_spirit_2");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        if (this.GetAbilityPlus() && this.hero_primary_attribute == Attributes.DOTA_ATTRIBUTE_INTELLECT) {
            return this.GetSpecialValueFor("bonus_attributes") + this.GetAbilityPlus().GetTalentValue("special_bonus_unique_vengeful_spirit_2");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        if (this.GetAbilityPlus() && this.GetParentPlus().IsRangedAttacker()) {
            return this.GetSpecialValueFor("bonus_attack_range");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        if (this.GetAbilityPlus()) {
            return this.GetSpecialValueFor("bonus_attributes") + this.GetAbilityPlus().GetTalentValue("special_bonus_unique_vengeful_spirit_2");
        }
    }
}
@registerModifier()
export class modifier_imba_vengefulspirit_command_negative_aura_723 extends BaseModifier_Plus {
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_RESPAWN
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_RESPAWN)
    CC_OnRespawn(keys: ModifierUnitEvent): void {
        if (keys.unit == this.GetCasterPlus()) {
            this.Destroy();
        }
    }
    IsHidden(): boolean {
        return true;
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.GetSpecialValueFor("aura_radius");
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_vengefulspirit_command_negative_aura_effect_723";
    }
}
@registerModifier()
export class modifier_imba_vengefulspirit_command_negative_aura_effect_723 extends BaseModifier_Plus {
    public bonus_attributes: number;
    public bonus_attack_range: number;
    public initialized: any;
    public hero_primary_attribute: any;
    BeCreated(p_0: any,): void {
        this.bonus_attributes = this.GetAbilityPlus().GetTalentSpecialValueFor("bonus_attributes") * (-1);
        this.bonus_attack_range = this.GetSpecialValueFor("bonus_attack_range") * (-1);
        this.initialized = false;
        this.StartIntervalThink(FrameTime());
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().GetPrimaryAttribute) {
            this.SetStackCount(this.GetParentPlus().GetPrimaryAttribute() || 0);
        }
    }
    OnIntervalThink(): void {
        if (!this.initialized) {
            this.hero_primary_attribute = this.GetStackCount();
            this.SetStackCount(0);
            this.initialized = true;
            if (IsServer()) {
                this.StartIntervalThink(0.5);
            } else {
                this.StartIntervalThink(-1);
            }
        }
        // if (IsServer() && this.GetParentPlus().CalculateStatBonus) {
        //     this.GetParentPlus().CalculateStatBonus(true);
        // }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS,
            5: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (this.hero_primary_attribute == Attributes.DOTA_ATTRIBUTE_STRENGTH) {
            return this.bonus_attributes;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        if (this.hero_primary_attribute == Attributes.DOTA_ATTRIBUTE_AGILITY) {
            return this.bonus_attributes;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        if (this.hero_primary_attribute == Attributes.DOTA_ATTRIBUTE_INTELLECT) {
            return this.bonus_attributes;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        if (this.GetParentPlus().IsRangedAttacker()) {
            return this.bonus_attack_range;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.bonus_attributes;
    }
}
@registerAbility()
export class imba_vengefulspirit_nether_swap extends BaseAbility_Plus {
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
        return "vengefulspirit_nether_swap";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_generic_charges";
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (target != undefined && target == this.GetCasterPlus()) {
            return UnitFilterResult.UF_FAIL_OTHER;
        }
        if (target != undefined && (!target.IsRealUnit()) && (!this.GetCasterPlus().HasScepter())) {
            return UnitFilterResult.UF_FAIL_CREEP;
        }
        return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, this.GetCasterPlus().GetTeamNumber());
    }
    GetAOERadius(): number {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("scepter_radius");
        }
    }
    GetCooldown(nLevel: number): number {
        if (IsServer()) {
            return 0.25;
        }
    }
    CastTalentMeteor(target: IBaseNpc_Plus) {
        let caster = this.GetCasterPlus();
        let projectile = {
            Target: target,
            Source: caster,
            Ability: this,
            EffectName: "particles/hero/vengefulspirit/rancor_magic_missile.vpcf",
            iMoveSpeed: 1250,
            vSpawnOrigin: caster.GetAbsOrigin(),
            bDrawsOnMinimap: false,
            bDodgeable: true,
            bIsAttack: false,
            bVisibleToEnemies: true,
            bReplaceExisting: false,
            flExpireTime: GameRules.GetGameTime() + 10,
            bProvidesVision: false
        }
        ProjectileManager.CreateTrackingProjectile(projectile);
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            let swapback_delay = this.GetTalentSpecialValueFor("swapback_delay");
            let swapback_duration = this.GetSpecialValueFor("swapback_duration");
            let tree_radius = this.GetSpecialValueFor("tree_radius");
            if (target.GetTeam() != caster.GetTeam()) {
                if (target.TriggerSpellAbsorb(this)) {
                    return undefined;
                }
            }
            if (target.GetTeamNumber() != caster.GetTeamNumber()) {
                target.AddNewModifier(caster, this, "modifier_stunned", {
                    duration: 0.1
                });
            }
            caster.EmitSound("Hero_VengefulSpirit.NetherSwap");
            target.EmitSound("Hero_VengefulSpirit.NetherSwap");
            ProjectileManager.ProjectileDodge(caster);
            if (target.GetTeamNumber() == caster.GetTeamNumber()) {
                ProjectileManager.ProjectileDodge(target);
            }
            let caster_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_vengeful/vengeful_nether_swap.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControlEnt(caster_pfx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(caster_pfx, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
            let target_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_vengeful/vengeful_nether_swap_target.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, target);
            ParticleManager.SetParticleControlEnt(target_pfx, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(target_pfx, 1, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true);
            let target_loc = target.GetAbsOrigin();
            let caster_loc = caster.GetAbsOrigin();
            let fountain_loc;
            if (target.GetTeam() == DOTATeam_t.DOTA_TEAM_GOODGUYS) {
                fountain_loc = Vector(7472, 6912, 512);
            } else {
                fountain_loc = Vector(-7456, -6938, 528);
            }
            if ((caster_loc - fountain_loc as Vector).Length2D() < 1700) {
                caster_loc = fountain_loc + (target_loc - fountain_loc as Vector).Normalized() * 1700 as Vector;
            }
            FindClearSpaceForUnit(caster, target_loc, true);
            FindClearSpaceForUnit(target, caster_loc, true);
            if (caster.HasTalent("special_bonus_imba_vengefulspirit_6")) {
                let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target_loc, undefined, caster.GetTalentValue("special_bonus_imba_vengefulspirit_6", "radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    this.CastTalentMeteor(enemy);
                }
                if (GameFunc.GetCount(enemies) >= 1) {
                    caster.EmitSound("Hero_VengefulSpirit.MagicMissile");
                }
            }
            if (this.GetCasterPlus().HasScepter()) {
                for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), target_loc, undefined, this.GetSpecialValueFor("scepter_radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
                    enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_vengefulspirit_wave_of_terror_fear", {
                        duration: this.GetSpecialValueFor("scepter_duration") * (1 - enemy.GetStatusResistance())
                    });
                }
            }
            GridNav.DestroyTreesAroundPoint(caster_loc, tree_radius, false);
            GridNav.DestroyTreesAroundPoint(target_loc, tree_radius, false);
            let ability_handle = caster.findAbliityPlus<imba_vengefulspirit_swap_back>("imba_vengefulspirit_swap_back");
            this.AddTimer(swapback_delay, () => {
                caster.AddNewModifier(caster, this, "modifier_imba_nether_swap", {
                    duration: swapback_duration
                });
                ability_handle.position = caster_loc;
            });
        }
    }
    OnUpgrade(): void {
        let ability_handle = this.GetCasterPlus().findAbliityPlus<imba_vengefulspirit_swap_back>("imba_vengefulspirit_swap_back");
        if (ability_handle) {
            if (ability_handle.GetLevel() < 1) {
                ability_handle.SetLevel(1);
                ability_handle.SetActivated(false);
            }
        }
    }
    GetAssociatedSecondaryAbilities(): string {
        return "imba_vengefulspirit_swap_back";
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        let caster = this.GetCasterPlus();
        if (target) {
            let damage = caster.GetTalentValue("special_bonus_imba_vengefulspirit_6", "damage");
            let stun_duration = caster.GetTalentValue("special_bonus_imba_vengefulspirit_6", "stun_duration");
            ApplyDamage({
                victim: target,
                attacker: caster,
                ability: this,
                damage: damage,
                damage_type: this.GetAbilityDamageType()
            });
            if (!target.IsMagicImmune()) {
                target.AddNewModifier(caster, this, "modifier_stunned", {
                    duration: stun_duration * (1 - target.GetStatusResistance())
                });
            }
        }
        EmitSoundOnLocationWithCaster(location, "Hero_VengefulSpirit.MagicMissileImpact", caster);
    }
}
@registerModifier()
export class modifier_imba_nether_swap extends BaseModifier_Plus {
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
            let ability_handle = this.GetCasterPlus().findAbliityPlus<imba_vengefulspirit_swap_back>("imba_vengefulspirit_swap_back");
            if (ability_handle) {
                ability_handle.SetActivated(true);
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            let ability_handle = this.GetCasterPlus().findAbliityPlus<imba_vengefulspirit_swap_back>("imba_vengefulspirit_swap_back");
            if (ability_handle) {
                ability_handle.SetActivated(false);
            }
        }
    }
}
@registerAbility()
export class imba_vengefulspirit_swap_back extends BaseAbility_Plus {
    position: Vector;
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
        return "vengeful_swap_back";
    }
    GetAssociatedPrimaryAbilities(): string {
        return "imba_vengefulspirit_nether_swap";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target_loc = this.position;
            let ability_handle = caster.findAbliityPlus<imba_vengefulspirit_nether_swap>("imba_vengefulspirit_nether_swap");
            let tree_radius = ability_handle.GetSpecialValueFor("tree_radius");
            caster.EmitSound("Hero_VengefulSpirit.NetherSwap");
            ProjectileManager.ProjectileDodge(caster);
            let swap_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_vengeful/vengeful_nether_swap.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(swap_pfx, 0, caster.GetAbsOrigin());
            ParticleManager.SetParticleControlEnt(swap_pfx, 1, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true);
            FindClearSpaceForUnit(caster, target_loc, true);
            if (caster.HasTalent("special_bonus_imba_vengefulspirit_6")) {
                let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target_loc, undefined, caster.GetTalentValue("special_bonus_imba_vengefulspirit_6", "radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    ability_handle.CastTalentMeteor(enemy);
                }
            }
            GridNav.DestroyTreesAroundPoint(target_loc, tree_radius, false);
            if (caster.HasModifier("modifier_imba_nether_swap")) {
                caster.RemoveModifierByNameAndCaster("modifier_imba_nether_swap", caster);
            }
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_swap_back";
    }
}
@registerModifier()
export class modifier_imba_swap_back extends BaseModifier_Plus {
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
            this.GetAbilityPlus().SetActivated(false);
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_vengefulspirit_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_vengefulspirit_2 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_vengefulspirit_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_vengefulspirit_5 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_vengefulspirit_8 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_vengefulspirit_9 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_vengefulspirit_10 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_vengefulspirit_11 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_vengefulspirit_command_aura_attributes extends BaseModifier_Plus {
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
