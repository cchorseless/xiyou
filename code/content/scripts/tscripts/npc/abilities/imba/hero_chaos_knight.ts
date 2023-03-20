
import { AI_ability } from "../../../ai/AI_ability";
import { GameFunc } from "../../../GameFunc";
import { AnimationHelper } from "../../../helper/AnimationHelper";
import { AoiHelper } from "../../../helper/AoiHelper";
import { ProjectileHelper } from "../../../helper/ProjectileHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";


@registerAbility()
export class imba_chaos_knight_chaos_bolt extends BaseAbility_Plus {
    IsStealable(): boolean {
        return true;
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetManaCost(level: number): number {
        return 0;
    }

    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this);
    }
    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        let caster = this.GetCasterPlus();
        this.ThrowChaosBolt(target);
        if (caster.HasTalent("special_bonus_imba_unique_chaos_knight_chaos_bolt_2") && GFuncRandom.PRD(this.GetSpecialValueFor("special_bonus_unique_chaos_knight_chaos_bolt_2"), this)) {
            let randomTarget = AoiHelper.FindOneUnitsInRadius(caster.GetTeam(), caster.GetAbsOrigin(), this.GetCastRangePlus()) || target;
            this.AddTimer(this.GetCastPoint(), () => {
                this.ThrowChaosBolt(randomTarget);
            });
        }
    }
    ThrowChaosBolt(target: IBaseNpc_Plus, origin: IBaseNpc_Plus = null) {
        let source = origin || this.GetCasterPlus();
        let projectile = {
            Target: target || this.GetCursorTarget(),
            Source: source,
            Ability: this,
            vSourceLoc: source.GetAbsOrigin(),
            EffectName: "particles/units/heroes/hero_chaos_knight/chaos_knight_chaos_bolt.vpcf",
            bDodgable: true,
            bProvidesVision: false,
            iMoveSpeed: this.GetSpecialValueFor("chaos_bolt_speed"),
            iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_ATTACK_1
        }
        ProjectileManager.CreateTrackingProjectile(projectile);
        EmitSoundOn("Hero_ChaosKnight.ChaosBolt.Cast", this.GetCasterPlus());
    }
    OnProjectileHit(target: IBaseNpc_Plus, position: Vector) {
        let caster = this.GetCasterPlus();
        if (target.TriggerSpellAbsorb(this)) {
            return;
        }
        let target_location = target.GetAbsOrigin();
        EmitSoundOn("Hero_ChaosKnight.ChaosBolt.Impact", target);
        let stun_min = this.GetSpecialValueFor("stun_min");
        let stun_max = this.GetSpecialValueFor("stun_max");
        let damage_min = this.GetSpecialValueFor("damage_min");
        let damage_max = this.GetSpecialValueFor("damage_max");
        let chaos_bolt_particle = "particles/units/heroes/hero_chaos_knight/chaos_knight_bolt_msg.vpcf";
        let random = RandomFloat(0, 1);
        let stun = stun_min + (stun_max - stun_min) * random;
        let damage = damage_min + (damage_max - damage_min) * (1 - random);
        let stun_digits = string.len(tostring(math.floor(stun))) + 1;
        let damage_digits = string.len(tostring(math.floor(damage))) + 1;
        let particle = ResHelper.CreateParticleEx(chaos_bolt_particle, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, target);
        ParticleManager.SetParticleControl(particle, 0, target_location);
        ParticleManager.SetParticleControl(particle, 1, Vector(9, math.floor(damage + 0.5), 4));
        ParticleManager.SetParticleControl(particle, 2, Vector(2, damage_digits, 0));
        ParticleManager.SetParticleControl(particle, 3, Vector(8, math.floor(stun + 0.5), 0));
        ParticleManager.SetParticleControl(particle, 4, Vector(2, 1, 0));
        ParticleManager.ReleaseParticleIndex(particle);
        target.ApplyStunned(this, caster, stun);
        damage = ApplyDamage({
            victim: target,
            attacker: caster,
            damage: damage,
            damage_type: this.GetAbilityDamageType(),
            ability: this
        });
        if (caster.HasTalent("special_bonus_imba_unique_chaos_knight_chaos_bolt_1")) {
            let buff = caster.AddNewModifier(caster, this, "modifier_chaos_knight_chaos_bolt_talent", {
                duration: caster.GetTalentValue("special_bonus_imba_unique_chaos_knight_chaos_bolt_1", "duration")
            });
            buff.IncrementStackCount(math.floor(damage * caster.GetTalentValue("special_bonus_imba_unique_chaos_knight_chaos_bolt_1") / 100));
        }
        if (GFuncRandom.PRD(this.GetSpecialValueFor("bounce_chance"), this)) {
            this.AddTimer(0.25, () => {
                let units = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, this.GetCastRange(target.GetAbsOrigin(), target), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0, false);
                if (GameFunc.GetCount(units) > 0) {
                    for (const [_, unit] of ipairs(units)) {
                        let projectile = {
                            Target: unit,
                            Source: target,
                            Ability: this,
                            EffectName: "particles/units/heroes/hero_chaos_knight/chaos_knight_chaos_bolt.vpcf",
                            bDodgable: true,
                            bProvidesVision: false,
                            iMoveSpeed: this.GetSpecialValueFor("chaos_bolt_speed"),
                            iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_ATTACK_1
                        }
                        ProjectileManager.CreateTrackingProjectile(projectile);
                        return;
                    }
                }
            });
        }
    }
}
@registerModifier()
export class modifier_chaos_knight_chaos_bolt_talent extends BaseModifier_Plus {
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.GetStackCount();
    }
}


@registerAbility()
export class imba_chaos_knight_reality_rift extends BaseAbility_Plus {
    random_point: Vector;
    fw: Vector;
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        let caster = this.GetCasterPlus();
        if (target.IsMagicImmune()) {
            let ability = caster.findAbliityPlus("special_bonus_imba_unique_chaos_knight");
            if (ability && ability.GetLevel() > 0) {
                return UnitFilterResult.UF_SUCCESS;
            } else {
                return UnitFilterResult.UF_FAIL_MAGIC_IMMUNE_ENEMY;
            }
        } else if (target.IsBuilding()) {
            return UnitFilterResult.UF_FAIL_BUILDING;
        } else if (target.GetTeamNumber() == caster.GetTeamNumber()) {
            return UnitFilterResult.UF_FAIL_FRIENDLY;
        } else if (target.IsAncient()) {
            return UnitFilterResult.UF_FAIL_ANCIENT;
        }
    }
    OnAbilityPhaseStart(): boolean {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            let caster_location = caster.GetAbsOrigin();
            let target_location = target.GetAbsOrigin();
            let min_range = 0.25;
            let max_range = 0.75;
            let distance = (target_location - caster_location as Vector).Length2D();
            let direction = (target_location - caster_location as Vector).Normalized();
            let target_point = RandomFloat(min_range, max_range) * distance;
            let target_point_vector = caster_location + direction * target_point as Vector;
            this.random_point = target_point_vector;
            this.fw = direction;
            AnimationHelper.StartAnimation(caster, {
                duration: 0.4,
                activity: GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_2,
                rate: 1.0
            });
            let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_chaos_knight/chaos_knight_reality_rift.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, target);
            ParticleManager.SetParticleControlEnt(particle, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster_location, true);
            ParticleManager.SetParticleControlEnt(particle, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target_location, true);
            ParticleManager.SetParticleControl(particle, 2, target_point_vector);
            ParticleManager.SetParticleControlOrientation(particle, 2, direction, Vector(0, 1, 0), Vector(1, 0, 0));
            ParticleManager.ReleaseParticleIndex(particle);
            // let units = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_CLOSEST, false);
            // for (const [_, unit] of GameFunc.iPair(units)) {
            //     if (unit.GetPlayerID() == caster.GetPlayerID()) {
            //         AnimationHelper.StartAnimation(unit, {
            //             duration: 0.4,
            //             activity: GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_2,
            //             rate: 1.0
            //         });
            //         let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_chaos_knight/chaos_knight_reality_rift.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, target);
            //         ParticleManager.SetParticleControlEnt(particle, 0, unit, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", unit.GetAbsOrigin(), true);
            //         ParticleManager.SetParticleControlEnt(particle, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target_location, true);
            //         ParticleManager.SetParticleControl(particle, 2, target_point_vector);
            //         ParticleManager.SetParticleControlOrientation(particle, 2, direction, Vector(0, 1, 0), Vector(1, 0, 0));
            //         ParticleManager.ReleaseParticleIndex(particle);
            //     }
            // }
            EmitSoundOn("Hero_ChaosKnight.RealityRift", caster);
        }
        return true;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let hTarget = this.GetCursorTarget();
        let duration = this.GetSpecialValueFor("armor_duration");
        if (hTarget) {
            if ((!hTarget.TriggerSpellAbsorb(this))) {
                hTarget.SetAbsOrigin(this.random_point);
                FindClearSpaceForUnit(caster, this.random_point, true);
                FindClearSpaceForUnit(hTarget, this.random_point, true);
                EmitSoundOn("Hero_ChaosKnight.RealityRift.Target", caster);
                hTarget.AddNewModifier(caster, this, "modifier_reality_rift_armor_reduction_debuff", {
                    duration: duration * (1 - hTarget.GetStatusResistance())
                });
                hTarget.SetForwardVector(this.fw);
                caster.Stop();
                caster.SetForwardVector(this.fw * -1 as Vector);
                let order = {
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET,
                    TargetIndex: hTarget.entindex(),
                    Queue: true
                }
                ExecuteOrderFromTable(order);
                // let units = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_CLOSEST, false);
                // for (const [_, unit] of GameFunc.iPair(units)) {
                //     if (unit.GetPlayerID() == caster.GetPlayerID()) {
                //         FindClearSpaceForUnit(unit, this.random_point, true);
                //         unit.Stop();
                //         unit.SetForwardVector(this.fw * -1 as Vector);
                //         let order = {
                //             UnitIndex: unit.entindex(),
                //             OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET,
                //             TargetIndex: hTarget.entindex(),
                //             Queue: true
                //         }
                //         ExecuteOrderFromTable(order);
                //     }
                // }
            }
        }
    }

    GetManaCost(level: number): number {
        return 0;
    }

    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this);
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(decFuncs);
    } */
}
@registerModifier()
export class modifier_reality_rift_armor_reduction_debuff extends BaseModifier_Plus {
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        }
        return Object.values(decFuncs);
    } */
    BeCreated(p_0: any,): void {
        let parent = this.GetParentPlus();
        parent.TempData().ArmorDebuff = ResHelper.CreateParticleEx("particles/econ/items/templar_assassin/templar_assassin_focal/templar_meld_focal_overhead_model.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
    }
    BeDestroy(): void {
        let parent = this.GetParentPlus();
        ParticleManager.DestroyParticle(parent.TempData().ArmorDebuff, false);
        ParticleManager.ReleaseParticleIndex(parent.TempData().ArmorDebuff);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.GetSpecialValueFor("armor_reduction") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_unique_chaos_knight_2");
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
}

@registerAbility()
export class imba_chaos_knight_chaos_strike extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_chaos_knight_chaos_strike";
    }
    GetAbilityTextureName(): string {
        if (this.GetCasterPlus().HasModifier("modifier_imba_chaos_knight_chaos_strike_actCrit")) {
            return "custom/chaos_knight_chaos_strike_active";
        } else {
            return "chaos_knight_chaos_strike";
        }
    }
}
@registerModifier()
export class modifier_imba_chaos_knight_chaos_strike_actCrit extends BaseModifier_Plus {
    public crit: boolean;
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE,
            3: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE)
    CC_GetModifierPreAttack_CriticalStrike(params: ModifierAttackEvent): number {
        let parent = this.GetParentPlus();
        EmitSoundOn("Hero_ChaosKnight.ChaosStrike", parent);
        let p = ResHelper.CreateParticleEx("particles/units/heroes/hero_chaos_knight/chaos_knight_weapon_blur_critical.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        ParticleManager.ReleaseParticleIndex(p);
        this.crit = true;
        return this.GetSpecialValueFor("crit_damage");
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        if (params.attacker == this.GetParentPlus() && this.crit) {
            if (params.attacker.HasTalent("special_bonus_unique_chaos_knight_chaos_strike_1") && !params.attacker.PassivesDisabled()) {
                let damage = params.original_damage * params.attacker.GetTalentValue("special_bonus_unique_chaos_knight_chaos_strike_1") / 100;
                DoCleaveAttack(params.attacker, params.target, this.GetAbilityPlus(), damage, 150, 330, 625, "particles/items_fx/battlefury_cleave.vpcf");
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(params: ModifierInstanceEvent): void {
        if (params.attacker == this.GetParentPlus() && !params.inflictor) {
            this.GetParentPlus().Lifesteal(this.GetAbilityPlus(), this.GetSpecialValueFor("lifesteal"), params.damage, params.unit);
            this.Destroy();
        }
    }
}
@registerModifier()
export class modifier_imba_chaos_knight_chaos_strike extends BaseModifier_Plus {
    public crit_min: number;
    public crit_max: number;
    public crit_chance: number;
    public talent: boolean;
    public on_crit: boolean;

    Init(p_0: any,): void {
        this.crit_min = this.GetSpecialValueFor("crit_min");
        this.crit_max = this.GetSpecialValueFor("crit_max");
        this.crit_chance = this.GetSpecialValueFor("chance");
        this.talent = this.GetParentPlus().HasTalent("special_bonus_unique_chaos_knight_chaos_strike_1") == null;
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */


    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        let parent = this.GetParentPlus();
        let ability = this.GetAbilityPlus();
        if (!params.attacker.PassivesDisabled() && ability.IsCooldownReady() && GFuncRandom.PRD(this.crit_chance, this) && !this.GetParentPlus().HasModifier("modifier_imba_chaos_knight_chaos_strike_actCrit")) {
            this.on_crit = true;
            EmitSoundOn("Hero_ChaosKnight.ChaosStrike", parent);
            let p = ResHelper.CreateParticleEx("particles/units/heroes/hero_chaos_knight/chaos_knight_weapon_blur_critical.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
            ParticleManager.ReleaseParticleIndex(p);
        } else {
            this.on_crit = false;
        }
        if (this.on_crit) {
            let crit = RandomInt(this.crit_min, this.crit_max);
            ability.UseResources(true, false, true)
            // 造成伤害
            let damage = crit / 100 * parent.GetAttackDamage()
            let tDamageTable = {
                ability: ability,
                victim: params.target,
                attacker: parent,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
            }
            ApplyDamage(tDamageTable)
            if (this.talent) {
                let damage = params.original_damage * params.attacker.GetTalentValue("special_bonus_unique_chaos_knight_chaos_strike_1") / 100;
                DoCleaveAttack(params.attacker, params.target, this.GetAbilityPlus(), damage, 150, 330, 625, "particles/items_fx/battlefury_cleave.vpcf");
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(params: ModifierInstanceEvent): void {
        if (this.on_crit && params.attacker == this.GetParentPlus() && !params.inflictor) {
            this.GetParentPlus().Lifesteal(this.GetAbilityPlus(), this.GetSpecialValueFor("lifesteal"), params.damage, params.unit);
            this.on_crit = false;
        }
    }
    IsHidden(): boolean {
        return true;
    }
}

@registerAbility()
export class imba_chaos_knight_phantasm extends BaseAbility_Plus {
    GetManaCost(level: number): number {
        return 100;
    }

    AutoSpellSelf() {
        return AI_ability.NO_TARGET_cast(this);
    }
    phantasm_illusions: IBaseNpc_Plus[];
    OnSpellStart(): void {
        let extra_illusion_sound = "Hero_ChaosKnight.Phantasm.Plus";
        let unit = this.GetCursorTarget() || this.GetCasterPlus();
        unit.EmitSound("Hero_ChaosKnight.Phantasm");
        unit.Purge(false, true, false, false, false);
        ProjectileHelper.ProjectileDodgePlus(unit);
        unit.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_chaos_knight_phantasm_cast", {
            duration: this.GetSpecialValueFor("invuln_duration")
        });
    }
}
@registerModifier()
export class modifier_imba_chaos_knight_phantasm_cast extends BaseModifier_Plus {
    public images_count: number;
    public illusion_duration: number;
    public outgoing_damage: number;
    public outgoing_damage_tooltip: number;
    public incoming_damage: number;
    public incoming_damage_tooltip: number;
    public invuln_duration: number;
    public vision_radius: number;
    public magic_resistance: any;
    public scepter_images_count_extra: number;
    public phantasm_illusions: IBaseNpc_Plus[];
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_chaos_knight/chaos_knight_phantasm.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.images_count = this.GetSpecialValueFor("images_count");
        this.illusion_duration = this.GetSpecialValueFor("illusion_duration");
        this.outgoing_damage = this.GetSpecialValueFor("outgoing_damage");
        this.outgoing_damage_tooltip = this.GetSpecialValueFor("outgoing_damage_tooltip");
        this.incoming_damage = this.GetSpecialValueFor("incoming_damage");
        this.incoming_damage_tooltip = this.GetSpecialValueFor("incoming_damage_tooltip");
        this.invuln_duration = this.GetSpecialValueFor("invuln_duration");
        this.vision_radius = this.GetSpecialValueFor("vision_radius");
        this.magic_resistance = this.GetSpecialValueFor("magic_resistance");
        this.images_count = this.GetSpecialValueFor("images_count");
        this.scepter_images_count_extra = this.GetSpecialValueFor("scepter_images_count_extra");
        if (this.GetCasterPlus().HasScepter()) {
            this.images_count = this.images_count + this.scepter_images_count_extra;
        }
    }
    BeDestroy(): void {
        let ability = this.GetAbilityPlus<imba_chaos_knight_phantasm>();
        if (!IsServer() || !this.GetParentPlus().IsAlive() || !ability) {
            return;
        }
        if (this.GetParentPlus() == this.GetCasterPlus()) {
            this.GetParentPlus().Stop();
        }
        AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), this.vision_radius, 1, false);
        if (ability.phantasm_illusions) {
            for (const [_, illusion] of GameFunc.iPair(ability.phantasm_illusions)) {
                if (illusion && !illusion.IsNull()) {
                    illusion.ForceKill(false);
                }
            }
        }
        ability.phantasm_illusions = [];
        this.phantasm_illusions = this.GetCasterPlus().CreateIllusion(this.GetParentPlus(), {
            outgoing_damage: this.outgoing_damage,
            incoming_damage: this.incoming_damage,
            bounty_base: this.GetParentPlus().GetLevel() * 2,
            bounty_growth: undefined,
            outgoing_damage_structure: undefined,
            outgoing_damage_roshan: undefined,
            duration: this.illusion_duration
        }, this.images_count);
        for (const [_, illusion] of GameFunc.iPair(this.phantasm_illusions)) {
            illusion.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_chaos_knight_phantasm_illusion", {});
            ability.phantasm_illusions.push(illusion);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
    }
}
@registerModifier()
export class modifier_imba_chaos_knight_phantasm_illusion extends BaseModifier_Plus {
    public magic_resistance: any;
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(keys: any): void {
        if (this.GetAbilityPlus()) {
            this.magic_resistance = this.GetSpecialValueFor("magic_resistance");
        } else if (keys) {
            this.magic_resistance = keys.magic_resistance;
        } else {
            this.magic_resistance = 0;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.magic_resistance;
    }
}

