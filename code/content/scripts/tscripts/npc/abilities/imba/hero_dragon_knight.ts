
import { GameFunc } from "../../../GameFunc";
import { AoiHelper } from "../../../helper/AoiHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_dragon_knight_breathe_fire extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "dragon_knight_breathe_fire";
    }
    OnSpellStart(): void {
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
        }
        let ability = this;
        let target = this.GetCursorTarget();
        let target_point = this.GetCursorPosition();
        let speed = this.GetSpecialValueFor("speed");
        EmitSoundOn("Hero_DragonKnight.BreathFire", this.GetCasterPlus());
        let projectile: CreateLinearProjectileOptions = {
            Ability: this,
            EffectName: "particles/units/heroes/hero_dragon_knight/dragon_knight_breathe_fire.vpcf",
            vSpawnOrigin: this.GetCasterPlus().GetAbsOrigin(),
            fDistance: this.GetSpecialValueFor("range"),
            fStartRadius: this.GetSpecialValueFor("start_radius"),
            fEndRadius: this.GetSpecialValueFor("end_radius"),
            Source: this.GetCasterPlus(),
            bHasFrontalCone: false,
            // bReplaceExisting: false,
            iUnitTargetTeam: this.GetAbilityTargetTeam(),
            iUnitTargetType: this.GetAbilityTargetType(),
            // bDeleteOnHit: false,
            vVelocity: (((target_point - this.GetCasterPlus().GetAbsOrigin()) * Vector(1, 1, 0) as Vector).Normalized()) * speed as Vector,
            bProvidesVision: false
        }
        ProjectileManager.CreateLinearProjectile(projectile);
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_dragon_knight_5")) {
            this.GetCasterPlus().Purge(false, true, false, true, true);
        }
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (IsServer()) {
            let debuff_duration = this.GetSpecialValueFor("duration");
            let damage = this.GetSpecialValueFor("damage");
            let health_as_damage = this.GetCasterPlus().GetHealth() / 100 * this.GetSpecialValueFor("health_as_damage");
            let damage_type = DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL;
            if (!target) {
                return undefined;
            }
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_dragon_knight_1")) {
                health_as_damage = this.GetCasterPlus().GetMaxHealth() / 100 * this.GetSpecialValueFor("health_as_damage");
            }
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_dragon_knight_4")) {
                damage_type = DAMAGE_TYPES.DAMAGE_TYPE_PURE;
            }
            ApplyDamage({
                victim: target,
                damage: damage + health_as_damage,
                damage_type: damage_type,
                attacker: this.GetCasterPlus(),
                ability: this
            });
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, target, health_as_damage, undefined);
            target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_breathe_fire_debuff", {
                duration: debuff_duration * (1 - target.GetStatusResistance())
            });
        }
    }
}
@registerModifier()
export class modifier_imba_breathe_fire_debuff extends BaseModifier_Plus {
    public strength_reduction: any;
    BeCreated(p_0: any,): void {
        this.strength_reduction = 0;
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_dragon_knight_3") && this.GetParentPlus().GetStrength) {
            this.strength_reduction = this.GetCasterPlus().GetTalentValue("special_bonus_imba_dragon_knight_3") / 100;
            this.strength_reduction = -this.GetParentPlus().GetStrength() * this.strength_reduction;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.GetSpecialValueFor("reduction");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.strength_reduction;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_dragon_knight/dragon_knight_breathe_fire_trail.vpcf";
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
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
}
@registerAbility()
export class imba_dragon_knight_dragon_tail extends BaseAbility_Plus {
    public cast_range: number;
    public main_target: any;
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        this.cast_range = 150;
        if (this.GetCasterPlus() && this.GetCasterPlus().HasModifier && this.GetCasterPlus().HasModifier("modifier_dragon_knight_dragon_form")) {
            this.cast_range = this.GetSpecialValueFor("dragon_cast_range");
        }
        return this.cast_range;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            if (this.GetCursorTarget().TriggerSpellAbsorb(this)) {
                return;
            }
            this.main_target = this.GetCursorTarget();
            let speed = this.GetSpecialValueFor("projectile_speed");
            if (this.main_target) {
                if (!this.GetCasterPlus().HasModifier("modifier_dragon_knight_dragon_form")) {
                    if (this.main_target.TriggerSpellAbsorb(this)) {
                        return;
                    }
                    this.main_target.EmitSound("Hero_DragonKnight.DragonTail.Target");
                    ResHelper.CreateParticleEx("particles/units/heroes/hero_dragon_knight/dragon_knight_dragon_tail.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.main_target);
                    this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_dragon_tail", {
                        duration: this.GetSpecialValueFor("duration_instances")
                    });
                    this.main_target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_dragon_tail_debuff", {
                        duration: this.GetSpecialValueFor("stun_duration") * (1 - this.main_target.GetStatusResistance())
                    });
                    ApplyDamage({
                        attacker: this.GetCasterPlus(),
                        victim: this.main_target,
                        damage_type: this.GetAbilityDamageType(),
                        damage: this.GetAbilityDamage(),
                        ability: this
                    });
                } else {
                    this.GetCasterPlus().EmitSound("Hero_DragonKnight.DragonTail.DragonFormCast");
                    let cleave_particle = "particles/item/silver_edge/silver_edge_shadow_rip.vpcf";
                    let particle_fx = ResHelper.CreateParticleEx(cleave_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
                    ParticleManager.SetParticleControl(particle_fx, 0, this.GetCasterPlus().GetAbsOrigin());
                    ParticleManager.ReleaseParticleIndex(particle_fx);
                    let enemies_to_cleave = AoiHelper.FindUnitsInCone(this.GetCasterPlus().GetTeamNumber(), GFuncVector.CalculateDirection(this.main_target, this.GetCasterPlus()), this.GetCasterPlus().GetAbsOrigin(), this.GetSpecialValueFor("start_radius"), this.GetSpecialValueFor("end_radius"), this.GetSpecialValueFor("dragon_cast_range"), undefined, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false);
                    for (const [_, enemy] of GameFunc.iPair(enemies_to_cleave)) {
                        this.main_target.EmitSound("Hero_DragonKnight.DragonTail.Target");
                        ResHelper.CreateParticleEx("particles/units/heroes/hero_dragon_knight/dragon_knight_dragon_tail.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.main_target);
                        if (!enemy.HasModifier("modifier_imba_dragon_tail_debuff")) {
                            ApplyDamage({
                                attacker: this.GetCasterPlus(),
                                victim: enemy,
                                ability: this,
                                damage: this.GetAbilityDamage(),
                                damage_type: this.GetAbilityDamageType()
                            });
                        }
                        enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_dragon_tail_debuff", {
                            duration: (this.GetSpecialValueFor("stun_duration") / 2) * (1 - enemy.GetStatusResistance())
                        });
                    }
                    let info = {
                        Target: this.main_target,
                        Source: this.GetCasterPlus(),
                        Ability: this,
                        EffectName: "particles/units/heroes/hero_dragon_knight/dragon_knight_dragon_tail_dragonform_proj.vpcf",
                        iMoveSpeed: speed
                    }
                    ProjectileManager.CreateTrackingProjectile(info);
                }
            }
        }
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector /** , ExtraData */): boolean | void {
        if (IsServer()) {
            if (target) {
                if (target.TriggerSpellAbsorb(this)) {
                    return;
                }
                target.EmitSound("Hero_DragonKnight.DragonTail.Target");
                ResHelper.CreateParticleEx("particles/units/heroes/hero_dragon_knight/dragon_knight_dragon_tail.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                if (!target.HasModifier("modifier_imba_dragon_tail_debuff")) {
                    ApplyDamage({
                        attacker: this.GetCasterPlus(),
                        victim: target,
                        damage_type: this.GetAbilityDamageType(),
                        damage: this.GetAbilityDamage(),
                        ability: this
                    });
                }
                target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_dragon_tail_debuff", {
                    duration: this.GetSpecialValueFor("stun_duration") * (1 - target.GetStatusResistance())
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_dragon_tail extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    Init(p_0: any,): void {
        if (IsServer()) {
            if (this.GetAbilityPlus().IsStolen()) {
                this.Destroy();
            }
            this.GetCasterPlus().SetModifierStackCount("modifier_imba_dragon_tail", this.GetCasterPlus(), this.GetSpecialValueFor("instances"));
        }
    }

    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_CONSTANT_BLOCK,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_CONSTANT_BLOCK)
    CC_GetModifierPhysical_ConstantBlock(keys: ModifierAttackEvent): number {
        return keys.damage;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (this.GetParentPlus() == keys.target && !this.IsNull()) {
            this.DecrementStackCount();
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BLOCK, this.GetParentPlus(), keys.damage, undefined);
            if (this.GetStackCount() <= 0) {
                this.AddTimer(FrameTime(), () => {
                    this.Destroy();
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_dragon_tail_debuff extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state: Partial<Record<modifierstate, boolean>> = {}
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_dragon_knight_7")) {
            state[modifierstate.MODIFIER_STATE_PASSIVES_DISABLED] = true;
        }
        state[modifierstate.MODIFIER_STATE_STUNNED] = true;
        return state;
    }
    BeRefresh(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.SetDuration(this.GetDuration() * (1 - this.GetParentPlus().GetStatusResistance()), true);
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_DISABLED;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_stunned.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
}
@registerAbility()
export class imba_dragon_knight_dragon_blood extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_dragon_blood";
    }
}
@registerModifier()
export class modifier_imba_dragon_blood extends BaseModifier_Plus {
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.StartIntervalThink(0.5);
    }
    OnIntervalThink(): void {
        // if (this.GetParentPlus().GetGold) {
        //     this.SetStackCount(this.GetParentPlus().GetGold() / this.GetSpecialValueFor("gold_hoard_amount_per_inc"));
        // }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        if (this.GetCasterPlus().PassivesDisabled()) {
            return;
        }
        if (this.GetCasterPlus().HasModifier("modifier_dragon_knight_dragon_form")) {
            return this.GetSpecialValueFor("bonus_health_regen") * 2 + this.GetStackCount();
        } else {
            return this.GetSpecialValueFor("bonus_health_regen") + this.GetStackCount();
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        if (this.GetCasterPlus().PassivesDisabled()) {
            return;
        }
        if (this.GetCasterPlus().HasModifier("modifier_dragon_knight_dragon_form")) {
            return this.GetSpecialValueFor("bonus_armor") * 2 + this.GetStackCount();
        } else {
            return this.GetSpecialValueFor("bonus_armor") + this.GetStackCount();
        }
    }
}
@registerAbility()
export class imba_dragon_knight_elder_dragon_charge extends BaseAbility_Plus {
    IsInnateAbility() {
        return true;
    }
    GetAssociatedSecondaryAbilities(): string {
        return "imba_dragon_knight_elder_dragon_form";
    }
    OnUpgrade(): void {
        this.SetActivated(false);
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (!this.GetCasterPlus().HasModifier("modifier_dragon_knight_dragon_form")) {
            this.SetActivated(false);
        }
    }
    OnSpellStart(): void {
        let caster_loc = this.GetCasterPlus().GetAbsOrigin();
        let direction = this.GetCasterPlus().GetForwardVector();
        let initial_radius = this.GetSpecialValueFor("initial_radius");
        let final_radius = this.GetSpecialValueFor("final_radius");
        let cone_length = this.GetSpecialValueFor("cone_length");
        let fire_speed = this.GetSpecialValueFor("fire_speed");
        let rush_distance = this.GetSpecialValueFor("rush_distance") + GPropertyCalculate.GetCastRangeBonus(this.GetCasterPlus()) + this.GetCasterPlus().GetTalentValue("special_bonus_imba_dragon_knight_2");
        let rush_speed = rush_distance / this.GetSpecialValueFor("rush_duration");
        this.GetCasterPlus().EmitSound("Hero_DragonKnight.BreathFire");
        let jet_projectile: CreateLinearProjectileOptions = {
            Ability: this,
            EffectName: "particles/units/heroes/hero_dragon_knight/dragon_knight_breathe_fire.vpcf",
            vSpawnOrigin: caster_loc + Vector(0, 0, 100) as Vector,
            fDistance: cone_length,
            fStartRadius: initial_radius,
            fEndRadius: final_radius,
            Source: this.GetCasterPlus(),
            bHasFrontalCone: true,
            // bReplaceExisting: false,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            fExpireTime: GameRules.GetGameTime() + 10.0,
            // bDeleteOnHit: false,
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
            Source: this.GetCasterPlus(),
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
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_elder_dragon_charge", {
            duration: this.GetSpecialValueFor("rush_duration"),
            distance: rush_distance
        });
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (!target) {
            return;
        }
        if (IsServer()) {
            let breathe_fire = this.GetCasterPlus().findAbliityPlus<imba_dragon_knight_breathe_fire>("imba_dragon_knight_breathe_fire");
            let dragon_tail = this.GetCasterPlus().findAbliityPlus<imba_dragon_knight_dragon_tail>("imba_dragon_knight_dragon_tail");
            let health_as_damage = this.GetCasterPlus().GetHealth() / 100;
            if (breathe_fire) {
                health_as_damage = health_as_damage * breathe_fire.GetSpecialValueFor("health_as_damage");
            }
            let dmg_type = DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL;
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_dragon_knight_4")) {
                dmg_type = DAMAGE_TYPES.DAMAGE_TYPE_PURE;
            }
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_dragon_knight_1")) {
                health_as_damage = this.GetCasterPlus().GetMaxHealth() / 100 * breathe_fire.GetSpecialValueFor("health_as_damage");
            }
            ApplyDamage({
                attacker: this.GetCasterPlus(),
                victim: target,
                damage: breathe_fire.GetSpecialValueFor("damage") + health_as_damage,
                damage_type: dmg_type,
                ability: breathe_fire
            });
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, target, health_as_damage, undefined);
            target.AddNewModifier(this.GetCasterPlus(), breathe_fire, "modifier_imba_breathe_fire_debuff", {
                duration: breathe_fire.GetSpecialValueFor("duration") * (1 - target.GetStatusResistance())
            });
            if (dragon_tail) {
                ApplyDamage({
                    attacker: this.GetCasterPlus(),
                    victim: target,
                    damage: dragon_tail.GetAbilityDamage(),
                    damage_type: dragon_tail.GetAbilityDamageType(),
                    ability: dragon_tail
                });
                target.AddNewModifier(this.GetCasterPlus(), dragon_tail, "modifier_imba_dragon_tail_debuff", {
                    duration: dragon_tail.GetSpecialValueFor("stun_duration") * (1 - target.GetStatusResistance())
                });
            }
            target.EmitSound("Hero_DragonKnight.DragonTail.Target");
            ResHelper.CreateParticleEx("particles/units/heroes/hero_dragon_knight/dragon_knight_dragon_tail.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_dragon_knight_5")) {
                this.GetCasterPlus().Purge(false, true, false, true, true);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_elder_dragon_charge extends BaseModifierMotionHorizontal_Plus {
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
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.direction = this.GetParentPlus().GetForwardVector();
            this.movement_tick = this.direction * keys.distance / (this.GetDuration() / FrameTime());
            this.BeginMotionOrDestroy();
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

    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        let position = me.GetAbsOrigin();
        GridNav.DestroyTreesAroundPoint(position, 100, false);
        me.SetAbsOrigin(GetGroundPosition(position + this.movement_tick, me));
    }
}
@registerAbility()
export class imba_dragon_knight_elder_dragon_form extends BaseAbility_Plus {
    GetAssociatedPrimaryAbilities(): string {
        return "imba_dragon_knight_elder_dragon_charge";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasScepter()) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE;
        }
        return super.GetBehavior();
    }
    GetCooldown(level: number): number {
        if (this.GetCasterPlus().HasScepter()) {
            return 0;
        }
        return super.GetCooldown(level);
    }
    GetManaCost(level: number): number {
        if (this.GetCasterPlus().HasScepter()) {
            return 0;
        }
        return super.GetManaCost(level);
    }
    OnSpellStart(): void {
        let buff = this.GetCasterPlus().findBuff<modifier_imba_elder_dragon_form>("modifier_imba_elder_dragon_form")
        buff.AddElderForm(this.GetCasterPlus(), this, this.GetLevel(), this.GetSpecialValueFor("duration"));
    }
    OnToggle(): void {
        if (this.GetToggleState()) {
            let buff = this.GetCasterPlus().findBuff<modifier_imba_elder_dragon_form>("modifier_imba_elder_dragon_form")
            buff.AddElderForm(this.GetCasterPlus(), this, this.GetLevel());
        } else {
            this.GetCasterPlus().RemoveModifierByName("modifier_dragon_knight_dragon_form");
            this.GetCasterPlus().RemoveModifierByName("modifier_dragon_knight_corrosive_breath");
            this.GetCasterPlus().RemoveModifierByName("modifier_dragon_knight_splash_attack");
            this.GetCasterPlus().RemoveModifierByName("modifier_dragon_knight_frost_breath");
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_elder_dragon_form";
    }
    OnInventoryContentsChanged(): void {
        if (this.GetCasterPlus().HasScepter()) {
        } else {
            if (this.GetCasterPlus().HasModifier("modifier_dragon_knight_dragon_form") && this.GetCasterPlus().findBuff("modifier_dragon_knight_dragon_form").GetDuration() == -1) {
                this.GetCasterPlus().RemoveModifierByName("modifier_dragon_knight_dragon_form");
                this.GetCasterPlus().RemoveModifierByName("modifier_dragon_knight_corrosive_breath");
                this.GetCasterPlus().RemoveModifierByName("modifier_dragon_knight_splash_attack");
                this.GetCasterPlus().RemoveModifierByName("modifier_dragon_knight_frost_breath");
            }
        }
    }
}
@registerModifier()
export class modifier_imba_elder_dragon_form extends BaseModifier_Plus {
    public bonus_ms: number;
    public level: any;
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(event: any): void {
        if (IsServer()) {
            this.StartIntervalThink(0.5);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT
        }
        return Object.values(funcs);
    } */
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.GetParentPlus().HasAbility("imba_dragon_knight_elder_dragon_charge")) {
                if (this.GetParentPlus().HasModifier("modifier_dragon_knight_dragon_form")) {
                    this.GetParentPlus().findAbliityPlus<imba_dragon_knight_elder_dragon_charge>("imba_dragon_knight_elder_dragon_charge").SetActivated(true);
                } else {
                    this.GetParentPlus().findAbliityPlus<imba_dragon_knight_elder_dragon_charge>("imba_dragon_knight_elder_dragon_charge").SetActivated(false);
                }
            }
            if (this.GetParentPlus().HasTalent("special_bonus_imba_dragon_knight_6") && this.GetParentPlus().HasModifier("modifier_dragon_knight_dragon_form")) {
                let enemies = FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.GetParentPlus().GetTalentValue("special_bonus_imba_dragon_knight_6", "radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    enemy.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_elder_dragon_form_debuff", {
                        duration: 1.0
                    });
                }
            }
            if (this.GetParentPlus().HasScepter()) {
                if (!this.GetParentPlus().HasModifier("modifier_dragon_knight_dragon_form") && this.GetAbilityPlus() && this.GetAbilityPlus().GetToggleState()) {
                    this.AddElderForm(this.GetParentPlus(), this.GetAbilityPlus(), this.GetAbilityPlus().GetLevel());
                }
            }
            if (this.GetParentPlus().HasTalent("special_bonus_imba_dragon_knight_8") && this.GetParentPlus().HasModifier("modifier_dragon_knight_dragon_form")) {
                this.bonus_ms = this.GetCasterPlus().GetHealth() * 0.01 * this.GetParentPlus().GetTalentValue("special_bonus_imba_dragon_knight_8");
                this.SetStackCount(this.bonus_ms);
            } else {
                this.SetStackCount(0);
            }
        }
    }
    AddElderForm(hero: IBaseNpc_Plus, ability: IBaseAbility_Plus, level: number, duration: number = 0) {
        if (IsServer()) {
            let modifier_duration = -1;
            if (!this.level) {
                this.level = 0;
            }
            if (duration) {
                modifier_duration = duration;
            }
            // todo modifier_dragon_knight_dragon_form need override
            if (hero.HasModifier("modifier_dragon_knight_dragon_form") && hero.findBuff("modifier_dragon_knight_dragon_form").GetDuration() == -1 && modifier_duration == -1 && this.level == level) {
                return;
            }
            if (level >= 1) {
                hero.AddNewModifier(hero, ability, "modifier_dragon_knight_dragon_form", {
                    duration: modifier_duration
                });
                hero.AddNewModifier(hero, ability, "modifier_dragon_knight_corrosive_breath", {
                    duration: modifier_duration
                });
            }
            if (level >= 2) {
                hero.AddNewModifier(hero, ability, "modifier_dragon_knight_splash_attack", {
                    duration: modifier_duration
                });
            }
            if (level >= 3) {
                hero.AddNewModifier(hero, ability, "modifier_dragon_knight_frost_breath", {
                    duration: modifier_duration
                });
            }
            this.level = level;
            if (hero.HasModifier("modifier_imba_dragon_tail")) {
                hero.RemoveModifierByName("modifier_imba_dragon_tail");
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_elder_dragon_form_debuff extends BaseModifier_Plus {

    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.GetCasterPlus().GetTalentValue("special_bonus_imba_dragon_knight_6", "reduction");
    }
    GetEffectName(): string {
        return "particles/econ/items/windrunner/windrunner_cape_cascade/windrunner_windrun_slow_cascade.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_dragon_knight_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_dragon_knight_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_dragon_knight_5 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_dragon_knight_7 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_dragon_knight_4 extends BaseModifier_Plus {
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
