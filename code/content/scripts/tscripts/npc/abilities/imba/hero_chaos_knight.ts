
import { GameFunc } from "../../../GameFunc";
import { AnimationHelper } from "../../../helper/AnimationHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class imba_chaos_knight_reality_rift extends BaseAbility_Plus {
    random_point: Vector;
    fw: Vector;
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        let caster = this.GetCasterPlus();
        if (target.IsMagicImmune()) {
            let ability = caster.findAbliityPlus("special_bonus_unique_chaos_knight");
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
            let units = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_CLOSEST, false);
            for (const [_, unit] of GameFunc.iPair(units)) {
                if (unit.GetPlayerOwnerID() == caster.GetPlayerID()) {
                    AnimationHelper.StartAnimation(unit, {
                        duration: 0.4,
                        activity: GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_2,
                        rate: 1.0
                    });
                    let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_chaos_knight/chaos_knight_reality_rift.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, target);
                    ParticleManager.SetParticleControlEnt(particle, 0, unit, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", unit.GetAbsOrigin(), true);
                    ParticleManager.SetParticleControlEnt(particle, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target_location, true);
                    ParticleManager.SetParticleControl(particle, 2, target_point_vector);
                    ParticleManager.SetParticleControlOrientation(particle, 2, direction, Vector(0, 1, 0), Vector(1, 0, 0));
                    ParticleManager.ReleaseParticleIndex(particle);
                }
            }
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
                let units = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_CLOSEST, false);
                for (const [_, unit] of GameFunc.iPair(units)) {
                    if (unit.GetPlayerOwnerID() == caster.GetPlayerID()) {
                        FindClearSpaceForUnit(unit, this.random_point, true);
                        unit.Stop();
                        unit.SetForwardVector(this.fw * -1 as Vector);
                        let order = {
                            UnitIndex: unit.entindex(),
                            OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET,
                            TargetIndex: hTarget.entindex(),
                            Queue: true
                        }
                        ExecuteOrderFromTable(order);
                    }
                }
            }
        }
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
        return this.GetSpecialValueFor("armor_reduction") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_chaos_knight_2");
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
}
@registerAbility()
export class imba_chaos_knight_phantasm extends BaseAbility_Plus {

    phantasm_illusions: IBaseNpc_Plus[];
    OnSpellStart(): void {
        let extra_illusion_sound = "Hero_ChaosKnight.Phantasm.Plus";
        let unit = this.GetCursorTarget() || this.GetCasterPlus();
        unit.EmitSound("Hero_ChaosKnight.Phantasm");
        unit.Purge(false, true, false, false, false);
        ProjectileManager.ProjectileDodge(unit);
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
        this.phantasm_illusions = this.GetParentPlus().CreateIllusion(this.GetParentPlus(), {
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
            table.insert(ability.phantasm_illusions, illusion);
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
