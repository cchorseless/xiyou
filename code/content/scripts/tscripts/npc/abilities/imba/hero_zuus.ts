
import { AI_ability } from "../../../ai/AI_ability";
import { GameFunc } from "../../../GameFunc";
import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_zuus_arc_lightning extends BaseAbility_Plus {
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return super.GetCastRange(location, target) + this.GetCasterPlus().GetTalentValue("special_bonus_imba_zuus_2", "bonus_cast_range");
    }
    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        this.GetCasterPlus().EmitSound("Hero_Zuus.ArcLightning.Cast");
        if (!target.TriggerSpellAbsorb(this)) {
            let head_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_zuus/zuus_arc_lightning_head.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
            ParticleManager.SetParticleControlEnt(head_particle, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetCasterPlus().GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(head_particle, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
            ParticleManager.SetParticleControl(head_particle, 62, Vector(2, 0, 2));
            ParticleManager.ReleaseParticleIndex(head_particle);
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_zuus_arc_lightning", {
                starting_unit_entindex: target.entindex()
            });
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_zuus_arc_lightning extends BaseModifier_Plus {
    public arc_damage: number;
    public radius: number;
    public jump_count: number;
    public jump_delay: number;
    public static_chain_mult: any;
    public starting_unit_entindex: any;
    public units_affected: { [k: string]: number };
    public current_unit: IBaseNpc_Plus;
    public unit_counter: number;
    public zapped: any;
    public lightning_particle: any;
    public previous_unit: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(keys: any): void {
        if (!IsServer() || !this.GetAbilityPlus()) {
            return;
        }
        this.arc_damage = this.GetSpecialValueFor("arc_damage");
        this.radius = this.GetSpecialValueFor("radius");
        this.jump_count = this.GetSpecialValueFor("jump_count");
        this.jump_delay = this.GetSpecialValueFor("jump_delay");
        this.static_chain_mult = this.GetSpecialValueFor("static_chain_mult");
        this.starting_unit_entindex = keys.starting_unit_entindex;
        this.units_affected = {}
        if (this.starting_unit_entindex && EntIndexToHScript(this.starting_unit_entindex)) {
            this.current_unit = EntIndexToHScript(this.starting_unit_entindex) as IBaseNpc_Plus;
            this.units_affected[this.current_unit.GetEntityIndex() + ""] = 1;
            if (this.GetCasterPlus().HasModifier("modifier_imba_zuus_static_field")) {
                this.GetCasterPlus().findBuff<modifier_imba_zuus_static_field>("modifier_imba_zuus_static_field").Apply(this.current_unit);
            }
            ApplyDamage({
                victim: this.current_unit,
                damage: this.arc_damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this.GetAbilityPlus()
            });
        } else {
            this.Destroy();
            return;
        }
        this.unit_counter = 0;
        this.StartIntervalThink(this.jump_delay);
    }
    OnIntervalThink(): void {
        this.zapped = false;
        for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.current_unit.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST, false))) {
            if (!this.units_affected[enemy.GetEntityIndex() + ""] || (this.GetCasterPlus().HasTalent("special_bonus_imba_zuus_8") && this.units_affected[enemy.GetEntityIndex() + ""] < this.GetCasterPlus().GetTalentValue("special_bonus_imba_zuus_8", "additional_hits")) && enemy != this.current_unit && enemy != this.previous_unit) {
                enemy.EmitSound("Hero_Zuus.ArcLightning.Target");
                this.lightning_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_zuus/zuus_arc_lightning_.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.current_unit);
                ParticleManager.SetParticleControlEnt(this.lightning_particle, 0, this.current_unit, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.current_unit.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(this.lightning_particle, 1, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
                ParticleManager.SetParticleControl(this.lightning_particle, 62, Vector(2, 0, 2));
                ParticleManager.ReleaseParticleIndex(this.lightning_particle);
                this.unit_counter = this.unit_counter + 1;
                this.previous_unit = this.current_unit;
                this.current_unit = enemy;
                if (this.units_affected[this.current_unit.GetEntityIndex() + ""]) {
                    this.units_affected[this.current_unit.GetEntityIndex() + ""] += 1;
                } else {
                    this.units_affected[this.current_unit.GetEntityIndex() + ""] = 1;
                }
                this.zapped = true;
                if (this.GetCasterPlus().HasModifier("modifier_imba_zuus_static_field")) {
                    this.GetCasterPlus().findBuff<modifier_imba_zuus_static_field>("modifier_imba_zuus_static_field").Apply(enemy);
                }
                ApplyDamage({
                    victim: enemy,
                    damage: this.arc_damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this.GetAbilityPlus()
                });
                return;
            }
        }
        if ((this.unit_counter >= this.jump_count && this.jump_count > 0) || !this.zapped) {
            for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.current_unit.GetAbsOrigin(), undefined, this.radius * this.static_chain_mult, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST, false))) {
                if ((!this.units_affected[enemy.GetEntityIndex() + ""] || (this.GetCasterPlus().HasTalent("special_bonus_imba_zuus_8") && this.units_affected[enemy.GetEntityIndex() + ""] < this.GetCasterPlus().GetTalentValue("special_bonus_imba_zuus_8", "additional_hits"))) && enemy != this.current_unit && enemy != this.previous_unit && enemy.HasModifier("modifier_imba_zuus_static_charge")) {
                    enemy.EmitSound("Hero_Zuus.ArcLightning.Target");
                    this.lightning_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_zuus/zuus_arc_lightning_.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.current_unit);
                    ParticleManager.SetParticleControlEnt(this.lightning_particle, 0, this.current_unit, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.current_unit.GetAbsOrigin(), true);
                    ParticleManager.SetParticleControlEnt(this.lightning_particle, 1, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
                    ParticleManager.SetParticleControl(this.lightning_particle, 62, Vector(2, 0, 2));
                    ParticleManager.ReleaseParticleIndex(this.lightning_particle);
                    this.unit_counter = this.unit_counter + 1;
                    this.previous_unit = this.current_unit;
                    this.current_unit = enemy;
                    if (this.units_affected[this.current_unit.GetEntityIndex() + ""]) {
                        this.units_affected[this.current_unit.GetEntityIndex() + ""] += 1;
                    } else {
                        this.units_affected[this.current_unit.GetEntityIndex() + ""] = 1;
                    }
                    this.zapped = true;
                    ApplyDamage({
                        victim: enemy,
                        damage: this.arc_damage,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                        attacker: this.GetCasterPlus(),
                        ability: this.GetAbilityPlus()
                    });
                    return;
                }
            }
            if ((this.unit_counter >= this.jump_count && this.jump_count > 0) || !this.zapped) {
                this.StartIntervalThink(-1);
                this.Destroy();
            }
        }
    }
}
@registerAbility()
export class imba_zuus_lightning_bolt extends BaseAbility_Plus {
    OnAbilityPhaseStart(): boolean {
        this.GetCasterPlus().EmitSound("Hero_Zuus.LightningBolt.Cast");
        return true;
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (IsServer()) {
            if (target != undefined && target.IsMagicImmune() && !(this.GetCasterPlus().HasTalent("special_bonus_imba_zuus_7") && (this.GetCasterPlus().HasModifier("modifier_imba_zuus_thundergods_focus") && this.GetCasterPlus().findBuffStack("modifier_imba_zuus_thundergods_focus", this.GetCasterPlus()) >= this.GetCasterPlus().GetTalentValue("special_bonus_imba_zuus_7", "value")))) {
                return UnitFilterResult.UF_FAIL_MAGIC_IMMUNE_ENEMY;
            }
            let nResult = UnitFilter(target, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber());
            return nResult;
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            let target_point = this.GetCursorPosition();
            let reduced_magic_resistance = caster.findAbliityPlus<imba_zuus_static_field>("imba_zuus_static_field").GetSpecialValueFor("reduced_magic_resistance");
            if (caster.HasAbility("imba_zuus_static_field")) {
                if (this.GetCasterPlus().HasTalent("special_bonus_imba_zuus_3")) {
                    reduced_magic_resistance = reduced_magic_resistance + caster.GetTalentValue("special_bonus_imba_zuus_3", "reduced_magic_resistance");
                }
            }
            let movement_speed = 10;
            let turn_rate = 1;
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_zuus_4")) {
                movement_speed = movement_speed + caster.GetTalentValue("special_bonus_imba_zuus_4", "movement_speed");
                turn_rate = caster.GetTalentValue("special_bonus_imba_zuus_4", "turn_rate");
            }
            NetTablesHelper.SetDotaEntityData(this.GetEntityIndex(), {
                reduced_magic_resistance: reduced_magic_resistance,
                movement_speed: movement_speed,
                turn_rate: turn_rate
            });
            imba_zuus_lightning_bolt.CastLightningBolt(caster, this, target, target_point);
        }
    }
    static CastLightningBolt(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus, target: IBaseNpc_Plus, target_point: Vector, nimbus: IBaseNpc_Plus = null) {
        if (IsServer()) {
            let spread_aoe = ability.GetSpecialValueFor("spread_aoe");
            let true_sight_radius = ability.GetSpecialValueFor("true_sight_radius");
            let sight_radius_day = ability.GetSpecialValueFor("sight_radius_day");
            let sight_radius_night = ability.GetSpecialValueFor("sight_radius_night");
            let sight_duration = ability.GetSpecialValueFor("sight_duration");
            let stun_duration = ability.GetSpecialValueFor("stun_duration");
            let pierce_spellimmunity = false;
            let z_pos = 2000;
            if (nimbus) {
                nimbus.EmitSound("Hero_Zuus.LightningBolt");
            } else {
                caster.EmitSound("Hero_Zuus.LightningBolt");
            }
            if (caster.HasTalent("special_bonus_imba_zuus_1")) {
                spread_aoe = spread_aoe + caster.GetTalentValue("special_bonus_imba_zuus_1", "spread_aoe");
            }
            if (caster.HasTalent("special_bonus_imba_zuus_7")) {
                if (caster.HasModifier("modifier_imba_zuus_thundergods_focus") && caster.findBuff<modifier_imba_zuus_thundergods_focus>("modifier_imba_zuus_thundergods_focus").GetStackCount() >= caster.GetTalentValue("special_bonus_imba_zuus_7", "value")) {
                    pierce_spellimmunity = true;
                }
            }
            AddFOWViewer(caster.GetTeam(), target_point, true_sight_radius, sight_duration, false);
            if (target != undefined) {
                target_point = target.GetAbsOrigin();
                if (target == caster) {
                    z_pos = 950;
                }
            }
            if (target == undefined) {
                let target_flags = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
                if (pierce_spellimmunity == true) {
                    target_flags = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES;
                }
                let nearby_enemy_units = FindUnitsInRadius(caster.GetTeamNumber(), target_point, undefined, spread_aoe, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, target_flags, FindOrder.FIND_CLOSEST, false);
                // let closest = radius;
                for (const [i, unit] of GameFunc.iPair(nearby_enemy_units)) {
                    if (!unit.IsMagicImmune() || pierce_spellimmunity) {
                        target = unit;
                        return;
                    }
                }
            }
            if (!nimbus && target) {
                if (target.GetTeam() != caster.GetTeam()) {
                    if (target.TriggerSpellAbsorb(ability)) {
                        return;
                    }
                }
            }
            if (target == undefined) {
                let nearby_enemy_units = FindUnitsInRadius(caster.GetTeamNumber(), target_point, undefined, spread_aoe, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, ability.GetAbilityTargetType(), DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
                for (const [i, unit] of GameFunc.iPair(nearby_enemy_units)) {
                    target = unit;
                    return;
                }
            }
            let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_zuus/zuus_lightning_bolt.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, target, caster);
            if (target == undefined) {
                ParticleManager.SetParticleControl(particle, 0, Vector(target_point.x, target_point.y, target_point.z));
                ParticleManager.SetParticleControl(particle, 1, Vector(target_point.x, target_point.y, z_pos));
                ParticleManager.SetParticleControl(particle, 2, Vector(target_point.x, target_point.y, target_point.z));
            } else if (target.IsMagicImmune() == false || pierce_spellimmunity) {
                target_point = target.GetAbsOrigin();
                ParticleManager.SetParticleControl(particle, 0, Vector(target_point.x, target_point.y, target_point.z));
                ParticleManager.SetParticleControl(particle, 1, Vector(target_point.x, target_point.y, z_pos));
                ParticleManager.SetParticleControl(particle, 2, Vector(target_point.x, target_point.y, target_point.z));
            }
            let dummy_unit = caster.CreateDummyUnit(Vector(target_point.x, target_point.y, 0), sight_duration + 1);
            let true_sight = dummy_unit.AddNewModifier(caster, ability, "modifier_imba_zuus_lightning_true_sight", {
                duration: sight_duration
            });
            true_sight.SetStackCount(true_sight_radius);
            dummy_unit.SetDayTimeVisionRange(sight_radius_day);
            dummy_unit.SetNightTimeVisionRange(sight_radius_night);
            dummy_unit.AddNewModifier(caster, ability, "modifier_imba_zuus_lightning_dummy", {});
            if (target == caster) {
                let thundergods_focus_modifier = caster.AddNewModifier(caster, ability, "modifier_imba_zuus_thundergods_focus", {
                    duration: ability.GetSpecialValueFor("thundergods_focus_duration")
                });
                thundergods_focus_modifier.SetStackCount(thundergods_focus_modifier.GetStackCount() + 1);
            } else if (target != undefined && target.GetTeam() != caster.GetTeam()) {
                if (caster.HasAbility("imba_zuus_static_field") && caster.findAbliityPlus<imba_zuus_static_field>("imba_zuus_static_field").IsTrained()) {
                    let static_charge_modifier = target.AddNewModifier(caster, caster.findAbliityPlus<imba_zuus_static_field>("imba_zuus_static_field"), "modifier_imba_zuus_static_charge", {
                        duration: 5.0 * (1 - target.GetStatusResistance())
                    });
                    if (static_charge_modifier != undefined) {
                        static_charge_modifier.SetStackCount(static_charge_modifier.GetStackCount() + ability.GetSpecialValueFor("static_charge_stacks"));
                    }
                }
                target.AddNewModifier(caster, ability, "modifier_generic_stunned", {
                    duration: stun_duration * (1 - target.GetStatusResistance())
                });
                if (caster.HasTalent("special_bonus_imba_zuus_5")) {
                    let root_duration = 0.5;
                    let thundergod_focus_modifier = caster.findBuff<modifier_imba_zuus_thundergods_focus>("modifier_imba_zuus_thundergods_focus");
                    if (thundergod_focus_modifier != undefined) {
                        root_duration = 0.5 + (thundergod_focus_modifier.GetStackCount() * 0.25);
                    }
                    target.AddNewModifier(caster, ability, "modifier_rooted", {
                        duration: root_duration * (1 - target.GetStatusResistance())
                    });
                }
                if (caster.HasModifier("modifier_imba_zuus_static_field")) {
                    caster.findBuff<modifier_imba_zuus_static_field>("modifier_imba_zuus_static_field").Apply(target);
                }
                let damage_table: ApplyDamageOptions = {} as ApplyDamageOptions;
                damage_table.attacker = caster;
                damage_table.ability = ability;
                damage_table.damage_type = ability.GetAbilityDamageType();
                damage_table.damage = ability.GetAbilityDamage();
                damage_table.victim = target;
                if (pierce_spellimmunity) {
                    damage_table.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_PURE;
                }
                ApplyDamage(damage_table);
            }
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_zuus_lightning_dummy extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_NO_TEAM_MOVE_TO]: true,
            [modifierstate.MODIFIER_STATE_NO_TEAM_SELECT]: true,
            [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true,
            [modifierstate.MODIFIER_STATE_ATTACK_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_FLYING]: true
        }
        return state;
    }
}
@registerModifier()
export class modifier_imba_zuus_lightning_true_sight extends BaseModifier_Plus {
    IsAura(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        if (this.GetParentPlus().GetClassname() == "npc_dota_creep_neutral") {
            return this.GetStackCount();
        } else {
            return 1;
        }
    }
    GetModifierAura(): string {
        return "modifier_truesight";
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        if (this.GetParentPlus().GetClassname() == "npc_dota_creep_neutral") {
            return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
        } else {
            return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
        }
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_OTHER;
    }
    GetAuraDuration(): number {
        return 0.5;
    }
}
@registerModifier()
export class modifier_imba_zuus_lightning_fow extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    public radius: number;
    IsHidden(): boolean {
        return true;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.parent = this.GetParentPlus();
            this.radius = keys.radius;
            this.StartIntervalThink(FrameTime());
        }
    }
    OnIntervalThink(): void {
        AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), this.parent.GetAbsOrigin(), this.radius, FrameTime(), false);
    }
}
@registerAbility()
export class imba_zuus_static_field extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_zuus_static_field";
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_zuus_3") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_zuus_3")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_special_bonus_imba_zuus_3", {});
        }
    }
}
@registerModifier()
export class modifier_imba_zuus_static_field extends BaseModifier_Plus {
    RemoveOnDeath(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {}
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    CC_OnAbilityExecuted(keys: ModifierAbilityEvent): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (keys.unit == caster && !keys.ability.IsItem()) {
                let ability = this.GetAbilityPlus();
                let radius = ability.GetSpecialValueFor("radius");
                let damage_health_pct = ability.GetSpecialValueFor("damage_health_pct");
                let duration = ability.GetSpecialValueFor("duration");
                let nearby_enemy_units = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                let caster_position = caster.GetAbsOrigin();
                let zuus_static_field = ResHelper.CreateParticleEx("particles/units/heroes/hero_zuus/zuus_static_field.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster, caster);
                ParticleManager.SetParticleControl(zuus_static_field, 0, Vector(caster_position.x, caster_position.y, caster_position.z));
                ParticleManager.SetParticleControl(zuus_static_field, 1, Vector(caster_position.x, caster_position.y, caster_position.z) * 100 as Vector);
                let damage_table: ApplyDamageOptions = {} as ApplyDamageOptions;
                damage_table.attacker = this.GetCasterPlus();
                damage_table.ability = ability;
                damage_table.damage_type = ability.GetAbilityDamageType();
                for (const [_, unit] of GameFunc.iPair(nearby_enemy_units as IBaseNpc_Plus[])) {
                    if (unit.IsAlive() && unit != caster && !unit.IsRoshan()) {
                        let current_health = unit.GetHealth();
                        damage_table.damage = (current_health / 100) * damage_health_pct;
                        damage_table.victim = unit;
                        ApplyDamage(damage_table);
                        let static_charge_modifier = unit.AddNewModifier(caster, ability, "modifier_imba_zuus_static_charge", {
                            duration: duration * (1 - unit.GetStatusResistance())
                        });
                        if (static_charge_modifier != undefined) {
                            static_charge_modifier.SetStackCount(static_charge_modifier.GetStackCount() + 1);
                        }
                    }
                }
            }
        }
    }
    Apply(target: IBaseNpc_Plus) {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().PassivesDisabled() || !target.IsAlive() || target == this.GetCasterPlus() || target.IsRoshan()) {
            return;
        }
        let ability = this.GetAbilityPlus();
        let caster = this.GetCasterPlus();
        let damage_health_pct = ability.GetSpecialValueFor("damage_health_pct");
        let duration = ability.GetSpecialValueFor("duration");
        let zuus_static_field = ResHelper.CreateParticleEx("particles/units/heroes/hero_zuus/zuus_static_field.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target, this.GetCasterPlus());
        ParticleManager.SetParticleControl(zuus_static_field, 1, target.GetAbsOrigin() * 100 as Vector);
        let current_health = target.GetHealth();
        let damage_table: ApplyDamageOptions = {} as ApplyDamageOptions;
        damage_table.attacker = this.GetCasterPlus();
        damage_table.ability = ability;
        damage_table.damage_type = ability.GetAbilityDamageType();
        damage_table.damage_flags = DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS;
        damage_table.damage = (current_health / 100) * damage_health_pct;
        damage_table.victim = target;
        ApplyDamage(damage_table);
        let static_charge_modifier = target.AddNewModifier(caster, ability, "modifier_imba_zuus_static_charge", {
            duration: duration * (1 - target.GetStatusResistance())
        });
        if (static_charge_modifier) {
            static_charge_modifier.SetStackCount(static_charge_modifier.GetStackCount() + 1);
        }
    }
}
@registerModifier()
export class modifier_imba_zuus_static_charge extends BaseModifier_Plus {
    public reduced_magic_resistance: any;
    public stacks_to_reveal: number;
    public stacks_to_mute: number;
    IsHidden(): boolean {
        return this.GetStackCount() <= 0;
    }
    IsDebuff(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        let caster = this.GetCasterPlus();
        this.reduced_magic_resistance = this.GetSpecialValueFor("reduced_magic_resistance");
        this.stacks_to_reveal = this.GetSpecialValueFor("stacks_to_reveal");
        this.stacks_to_mute = this.GetSpecialValueFor("stacks_to_mute");
        if (caster.HasTalent("special_bonus_imba_zuus_3")) {
            this.reduced_magic_resistance = this.reduced_magic_resistance + caster.GetTalentValue("special_bonus_imba_zuus_3", "reduced_magic_resistance");
        }
    }
    GetTexture(): string {
        return "zuus_static_field";
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        });
    } */
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state: Partial<Record<modifierstate, boolean>> = {}
        let stacks = this.GetStackCount();
        if (stacks >= this.stacks_to_reveal) {
            state[modifierstate.MODIFIER_STATE_INVISIBLE] = false;
        }
        if (stacks >= this.stacks_to_mute) {
            state[modifierstate.MODIFIER_STATE_MUTED] = true;
        }
        return state;
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.GetStackCount() * this.reduced_magic_resistance * -1;
    }
}
@registerAbility()
export class imba_zuus_cloud extends BaseAbility_Plus {
    public target_point: any;
    public zuus_nimbus_unit: any;
    IsInnateAbility() {
        return true;
    }
    GetAssociatedPrimaryAbilities(): string {
        return "imba_zuus_lightning_bolt";
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("cloud_radius");
    }
    OnInventoryContentsChanged(): void {
        if (IsServer()) {
            if (this.GetCasterPlus().HasScepter()) {
                this.SetHidden(false);
            } else {
                this.SetHidden(true);
            }
        }
    }
    OnHeroCalculateStatBonus(): void {
        this.OnInventoryContentsChanged();
    }
    OnSpellStart(): void {
        if (IsServer()) {
            this.target_point = this.GetCursorPosition();
            let caster = this.GetCasterPlus();
            let cloud_bolt_interval = this.GetSpecialValueFor("cloud_bolt_interval");
            let cloud_duration = this.GetSpecialValueFor("cloud_duration");
            let cloud_radius = this.GetSpecialValueFor("cloud_radius");
            EmitSoundOnLocationWithCaster(this.target_point, "Hero_Zuus.Cloud.Cast", caster);
            caster.RemoveModifierByName("modifier_imba_zuus_on_nimbus");
            this.zuus_nimbus_unit = caster.CreateSummon("npc_imba_zeus_cloud", Vector(this.target_point.x, this.target_point.y, 450), cloud_duration, false);
            this.zuus_nimbus_unit.SetControllableByPlayer(caster.GetPlayerID(), true);
            this.zuus_nimbus_unit.SetModelScale(0.7);
            this.zuus_nimbus_unit.AddNewModifier(this.zuus_nimbus_unit, this, "modifier_phased", {});
            this.zuus_nimbus_unit.AddNewModifier(caster, this, "modifier_zuus_nimbus_storm", {
                duration: cloud_duration,
                cloud_bolt_interval: cloud_bolt_interval,
                cloud_radius: cloud_radius
            });
            if (caster.HasAbility("imba_zuus_nimbus_zap")) {
                caster.findAbliityPlus<imba_zuus_nimbus_zap>("imba_zuus_nimbus_zap").SetActivated(true);
            }
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.POSITION_most_enemy(this)
    }
}
@registerModifier()
export class modifier_zuus_nimbus_storm extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public cloud_radius: number;
    public cloud_bolt_interval: number;
    public lightning_bolt: any;
    public original_z: any;
    public counter: number;
    public zuus_nimbus_particle: any;
    IsHidden(): boolean {
        return true;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.ability = this.GetAbilityPlus();
            this.cloud_radius = keys.cloud_radius;
            this.cloud_bolt_interval = keys.cloud_bolt_interval;
            this.lightning_bolt = this.GetCasterPlus().findAbliityPlus<imba_zuus_lightning_bolt>("imba_zuus_lightning_bolt");
            let target_point = GetGroundPosition(this.GetParentPlus().GetAbsOrigin(), this.GetParentPlus());
            this.original_z = target_point.z;
            this.SetStackCount(this.original_z);
            this.counter = this.cloud_bolt_interval;
            this.zuus_nimbus_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_zeus/zeus_cloud.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
            ParticleManager.SetParticleControl(this.zuus_nimbus_particle, 0, Vector(target_point.x, target_point.y, 450));
            ParticleManager.SetParticleControl(this.zuus_nimbus_particle, 1, Vector(this.cloud_radius, 0, 0));
            ParticleManager.SetParticleControl(this.zuus_nimbus_particle, 2, Vector(target_point.x, target_point.y, target_point.z + 450));
            this.StartIntervalThink(FrameTime());
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.VISUAL_Z_DELTA,
            2: Enum_MODIFIER_EVENT.ON_ATTACKED,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL,
            4: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_MAGICAL,
            5: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.VISUAL_Z_DELTA)
    CC_GetVisualZDelta(): number {
        return 450;
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.lightning_bolt.GetLevel() > 0 && this.counter >= this.cloud_bolt_interval) {
                let nearby_enemy_units = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.cloud_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, this.lightning_bolt.GetAbilityTargetType(), DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
                for (const [_, unit] of GameFunc.iPair(nearby_enemy_units)) {
                    if (unit.IsAlive()) {
                        imba_zuus_lightning_bolt.CastLightningBolt(this.GetCasterPlus(), this.lightning_bolt, unit, unit.GetAbsOrigin(), this.GetParentPlus());
                        this.counter = 0;
                        return;
                    }
                }
            }
            this.counter = this.counter + FrameTime();
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACKED)
    CC_OnAttacked(params: ModifierAttackEvent): void {
        if (params.target == this.GetParentPlus()) {
            if (params.attacker.IsRealUnit()) {
                if (params.attacker.IsRangedAttacker()) {
                    this.GetParentPlus().SetHealth(this.GetParentPlus().GetHealth() - this.GetParentPlus().GetMaxHealth() / this.GetSpecialValueFor("ranged_hero_attack"));
                } else {
                    this.GetParentPlus().SetHealth(this.GetParentPlus().GetHealth() - (this.GetParentPlus().GetMaxHealth() / this.GetSpecialValueFor("melee_hero_attack")));
                }
            } else {
                this.GetParentPlus().SetHealth(this.GetParentPlus().GetHealth() - (this.GetParentPlus().GetMaxHealth() / this.GetSpecialValueFor("non_hero_attack")));
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL)
    CC_GetAbsoluteNoDamagePhysical(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_MAGICAL)
    CC_GetAbsoluteNoDamageMagical(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE)
    CC_GetAbsoluteNoDamagePure(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
    BeRemoved(): void {
        if (IsServer()) {
            ParticleManager.DestroyParticle(this.zuus_nimbus_particle, false);
            let caster = this.GetCasterPlus();
            let nimbusRemaining = false;
            if (caster.HasModifier("modifier_imba_zuus_nimbus_z")) {
                caster.RemoveModifierByName("modifier_imba_zuus_nimbus_z");
                FindClearSpaceForUnit(caster, this.GetCasterPlus().GetAbsOrigin(), false);
            }
            for (const [_, nimbus] of GameFunc.iPair(caster.FindChildByName("npc_imba_zeus_cloud"))) {
                if (nimbus.IsAlive()) {
                    nimbusRemaining = true;
                    break;
                }
            }
            if (!nimbusRemaining) {
                if (caster.HasAbility("imba_zuus_leave_nimbus") && caster.HasAbility("imba_zuus_nimbus_zap")) {
                    if (!caster.findAbliityPlus<imba_zuus_leave_nimbus>("imba_zuus_leave_nimbus").IsHidden()) {
                        caster.SwapAbilities("imba_zuus_leave_nimbus", "imba_zuus_nimbus_zap", false, true);
                    }
                    this.GetCasterPlus().findAbliityPlus<imba_zuus_nimbus_zap>("imba_zuus_nimbus_zap").SetActivated(false);
                }
            }
        }
    }
}
@registerAbility()
export class imba_zuus_nimbus_zap extends BaseAbility_Plus {
    public nimbus: any;
    public traveled: any;
    public distance: number;
    public direction: any;
    public target_loc: any;
    public nimbus_z: any;
    public projectileID: any;
    public units_traveled_in_last_tick: any;
    IsInnateAbility() {
        return true;
    }
    IsStealable(): boolean {
        return false;
    }
    OnUpgrade(): void {
        this.SetActivated(false);
    }
    OnInventoryContentsChanged(): void {
        if (IsServer()) {
            if (this.GetCasterPlus().HasScepter()) {
                this.SetHidden(false);
            } else {
                this.SetHidden(true);
            }
        }
    }
    OnHeroCalculateStatBonus(): void {
        this.OnInventoryContentsChanged();
    }
    GetManaCost(nLevel: number): number {
        return this.GetCasterPlus().GetMana() * this.GetSpecialValueFor("mana_cost_pct") / 100;
    }
    OnSpellStart(target?: IBaseNpc_Plus): void {
        if (IsServer()) {
            let target_point = this.GetCursorPosition();
            let caster_loc = GetGroundPosition(this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus());
            let target_loc = undefined;
            let distance = math.huge;
            if (target != undefined) {
                target_point = target.GetAbsOrigin();
            }
            let nimbus_ability = this.GetCasterPlus().findAbliityPlus<imba_zuus_cloud>("imba_zuus_cloud");
            this.nimbus = nimbus_ability.zuus_nimbus_unit;
            for (const [_, nimbus] of GameFunc.iPair(this.GetCasterPlus().FindChildByName("npc_imba_zeus_cloud"))) {
                if (nimbus.IsAlive() && (target_point - nimbus.GetAbsOrigin() as Vector).Length2D() < distance) {
                    distance = (target_point - nimbus.GetAbsOrigin() as Vector).Length2D();
                    target_loc = nimbus.GetAbsOrigin();
                }
            }
            if (target_loc == undefined) {
                this.SetActivated(false);
                return;
            }
            target_loc.z = target_loc.z + 100;
            let max_height = target_loc.z + 100;
            let speed = this.GetSpecialValueFor("ball_speed");
            let damage_radius = this.GetSpecialValueFor("damage_radius");
            let vision = this.GetSpecialValueFor("ball_vision_radius");
            this.traveled = 0;
            this.distance = (target_loc - caster_loc as Vector).Length2D();
            if (this.distance == 0) {
                return;
            }
            this.direction = (target_loc - caster_loc as Vector).Normalized();
            let add_height = ((target_loc.z) - caster_loc.z) / (this.distance / speed / FrameTime());
            let add_stacks = 450 / (math.abs(target_loc.z - caster_loc.z) / math.abs(add_height));
            this.target_loc = target_loc;
            this.GetCasterPlus().EmitSound("Hero_Zuus.LightningBolt");
            this.GetCasterPlus().EmitSound("Hero_StormSpirit.BallLightning");
            this.GetCasterPlus().EmitSound("Hero_StormSpirit.BallLightning.Loop");
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_ball_lightning", {});
            this.nimbus_z = this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_zuus_nimbus_z", {});
            let projectile = {
                Ability: this,
                EffectName: "particles/hero/storm_spirit/no_particle_particle.vpcf",
                vSpawnOrigin: caster_loc,
                fDistance: this.distance,
                fStartRadius: damage_radius,
                fEndRadius: damage_radius,
                Source: this.GetCasterPlus(),
                bHasFrontalCone: false,
                bReplaceExisting: false,
                iUnitTargetTeam: this.GetAbilityTargetTeam(),
                iUnitTargetFlags: this.GetAbilityTargetFlags(),
                iUnitTargetType: this.GetAbilityTargetType(),
                bDeleteOnHit: false,
                vVelocity: this.direction * speed * Vector(1, 1, 0) as Vector,
                bProvidesVision: true,
                iVisionRadius: vision,
                iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber(),
                ExtraData: {
                    speed: speed * FrameTime(),
                    add_stacks: add_stacks,
                    add_height: add_height,
                    max_height: max_height,
                    target_loc: target_loc
                }
            }
            this.projectileID = ProjectileManager.CreateLinearProjectile(projectile);
        }
    }
    OnProjectileThink_ExtraData(location: Vector, ExtraData: any): void {
        if (this.nimbus_z.IsNull()) {
            this.GetCasterPlus().RemoveModifierByName("modifier_imba_ball_lightning");
            ResolveNPCPositions(this.GetCasterPlus().GetAbsOrigin(), 128);
            return;
        }
        if ((this.traveled + ExtraData.speed < this.distance) && this.GetCasterPlus().IsAlive()) {
            let tmp = this.GetCasterPlus().GetAbsOrigin();
            if (tmp.z > ExtraData.max_height) {
                this.GetCasterPlus().SetAbsOrigin(Vector(location.x, location.y, ExtraData.max_height));
            } else {
                this.GetCasterPlus().SetAbsOrigin(Vector(location.x, location.y, tmp.z + ExtraData.add_height));
            }
            this.nimbus_z.SetStackCount(this.nimbus_z.GetStackCount() + ExtraData.add_stacks);
            this.traveled = this.traveled + ExtraData.speed;
            this.units_traveled_in_last_tick = ExtraData.speed;
        } else {
            this.GetCasterPlus().SetAbsOrigin(this.target_loc);
            this.nimbus_z.SetStackCount(450);
            if (this.GetCasterPlus().HasAbility("imba_zuus_leave_nimbus") && this.GetCasterPlus().HasAbility("imba_zuus_nimbus_zap") && this.nimbus != undefined && this.GetCasterPlus().findAbliityPlus<imba_zuus_leave_nimbus>("imba_zuus_leave_nimbus").IsHidden()) {
                this.GetCasterPlus().SwapAbilities("imba_zuus_nimbus_zap", "imba_zuus_leave_nimbus", false, true);
            }
            this.GetCasterPlus().StopSound("Hero_StormSpirit.BallLightning.Loop");
            this.GetCasterPlus().RemoveModifierByName("modifier_imba_ball_lightning");
            ProjectileManager.DestroyLinearProjectile(this.projectileID);
        }
    }
}
@registerAbility()
export class imba_zuus_leave_nimbus extends BaseAbility_Plus {
    IsInnateAbility() {
        return true;
    }
    IsStealable(): boolean {
        return false;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            caster.RemoveModifierByName("modifier_imba_zuus_on_nimbus");
            caster.RemoveModifierByName("modifier_imba_zuus_nimbus_z");
            ResolveNPCPositions(this.GetCasterPlus().GetAbsOrigin(), 128);
            this.GetCasterPlus().SwapAbilities("imba_zuus_leave_nimbus", "imba_zuus_nimbus_zap", false, true);
        }
    }
}
@registerModifier()
export class modifier_imba_ball_lightning extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_stormspirit/stormspirit_ball_lightning.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ROOTBONE_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_MAGICAL,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL)
    CC_GetAbsoluteNoDamagePhysical(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_MAGICAL)
    CC_GetAbsoluteNoDamageMagical(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE)
    CC_GetAbsoluteNoDamagePure(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
    BeRemoved(): void {
        if (IsServer()) {
            this.GetCasterPlus().AddNewModifier(undefined, undefined, "modifier_imba_zuus_on_nimbus", {});
        }
    }
}
@registerModifier()
export class modifier_imba_zuus_nimbus_z extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.VISUAL_Z_DELTA,
            2: GPropertyConfig.EMODIFIER_PROPERTY.CAST_RANGE_BONUS_STACKING
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.VISUAL_Z_DELTA)
    CC_GetVisualZDelta(): number {
        return this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CAST_RANGE_BONUS_STACKING)
    CC_GetModifierCastRangeBonusStacking(p_0: ModifierAbilityEvent,): number {
        return this.GetStackCount() / 3;
    }
}
@registerModifier()
export class modifier_imba_zuus_on_nimbus extends BaseModifier_Plus {
}
@registerAbility()
export class imba_zuus_thundergods_wrath extends BaseAbility_Plus {
    public thundergod_spell_cast: any;
    OnAbilityPhaseStart(): boolean {
        this.GetCasterPlus().EmitSound("Hero_Zuus.GodsWrath.PreCast");
        let attack_lock = this.GetCasterPlus().GetAttachmentOrigin(this.GetCasterPlus().ScriptLookupAttachment("attach_attack1"));
        this.thundergod_spell_cast = ResHelper.CreateParticleEx("particles/units/heroes/hero_zuus/zuus_thundergods_wrath_start.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus());
        ParticleManager.SetParticleControl(this.thundergod_spell_cast, 0, Vector(attack_lock.x, attack_lock.y, attack_lock.z));
        ParticleManager.SetParticleControl(this.thundergod_spell_cast, 1, Vector(attack_lock.x, attack_lock.y, attack_lock.z));
        ParticleManager.SetParticleControl(this.thundergod_spell_cast, 2, Vector(attack_lock.x, attack_lock.y, attack_lock.z));
        return true;
    }
    OnAbilityPhaseInterrupted(): void {
        if (this.thundergod_spell_cast) {
            ParticleManager.DestroyParticle(this.thundergod_spell_cast, true);
            ParticleManager.ReleaseParticleIndex(this.thundergod_spell_cast);
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let ability = this;
            let caster = this.GetCasterPlus();
            let true_sight_radius = ability.GetSpecialValueFor("true_sight_radius");
            let sight_radius_day = ability.GetSpecialValueFor("sight_radius_day");
            let sight_radius_night = ability.GetSpecialValueFor("sight_radius_night");
            let sight_duration = ability.GetSpecialValueFor("sight_duration");
            let pierce_spellimmunity = false;
            let position = this.GetCasterPlus().GetAbsOrigin();
            if (this.thundergod_spell_cast) {
                ParticleManager.ReleaseParticleIndex(this.thundergod_spell_cast);
            }
            if (caster.HasTalent("special_bonus_imba_zuus_7")) {
                if (caster.HasModifier("modifier_imba_zuus_thundergods_focus") && caster.findBuff<modifier_imba_zuus_thundergods_focus>("modifier_imba_zuus_thundergods_focus").GetStackCount() >= caster.GetTalentValue("special_bonus_imba_zuus_7", "value")) {
                    pierce_spellimmunity = true;
                }
            }
            let thundergods_focus_stacks = 0;
            if (caster.HasModifier("modifier_imba_zuus_thundergods_focus")) {
                thundergods_focus_stacks = caster.findBuff<modifier_imba_zuus_thundergods_focus>("modifier_imba_zuus_thundergods_focus").GetStackCount();
                caster.findBuff<modifier_imba_zuus_thundergods_focus>("modifier_imba_zuus_thundergods_focus").Destroy();
            }
            EmitSoundOnLocationForAllies(this.GetCasterPlus().GetAbsOrigin(), "Hero_Zuus.GodsWrath", this.GetCasterPlus());
            let damage_table: ApplyDamageOptions = {} as ApplyDamageOptions;
            damage_table.attacker = this.GetCasterPlus();
            damage_table.ability = ability;
            damage_table.damage_type = ability.GetAbilityDamageType();
            let team = this.GetCasterPlus().GetTeam() == DOTATeam_t.DOTA_TEAM_GOODGUYS ? DOTATeam_t.DOTA_TEAM_BADGUYS : DOTATeam_t.DOTA_TEAM_GOODGUYS;
            const enemyList: IBaseNpc_Plus[] = caster.GetPlayerRoot().BattleUnitManagerComp().GetAllBattleUnitAliveNpc(team);
            for (const [_, hero] of GameFunc.iPair(enemyList)) {
                if (hero.IsAlive() && hero.GetTeam() != caster.GetTeam() && (!hero.IsIllusion()) && !hero.IsClone()) {
                    let target_point = hero.GetAbsOrigin();
                    let thundergod_strike_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_zuus/zuus_thundergods_wrath.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, hero, this.GetCasterPlus());
                    ParticleManager.SetParticleControl(thundergod_strike_particle, 0, Vector(target_point.x, target_point.y, target_point.z + hero.GetBoundingMaxs().z));
                    ParticleManager.SetParticleControl(thundergod_strike_particle, 1, Vector(target_point.x, target_point.y, 2000));
                    ParticleManager.SetParticleControl(thundergod_strike_particle, 2, Vector(target_point.x, target_point.y, target_point.z + hero.GetBoundingMaxs().z));
                    if (caster.HasAbility("imba_zuus_static_field") && caster.findAbliityPlus<imba_zuus_static_field>("imba_zuus_static_field").IsTrained() && (caster.GetAbsOrigin() - hero.GetAbsOrigin() as Vector).Length2D() <= 2500) {
                        let static_charge_modifier = hero.AddNewModifier(caster, caster.findAbliityPlus<imba_zuus_static_field>("imba_zuus_static_field"), "modifier_imba_zuus_static_charge", {
                            duration: 5.0 * (1 - hero.GetStatusResistance())
                        });
                        if (static_charge_modifier != undefined) {
                            static_charge_modifier.SetStackCount(static_charge_modifier.GetStackCount() + 1);
                            static_charge_modifier.SetStackCount(static_charge_modifier.GetStackCount() + thundergods_focus_stacks);
                            static_charge_modifier.SetDuration(5.0 * (1 - hero.GetStatusResistance()), true);
                        }
                    }
                    if (pierce_spellimmunity) {
                        damage_table.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_PURE;
                    }
                    if ((!hero.IsMagicImmune() || pierce_spellimmunity) && (!hero.IsInvisible() || caster.CanEntityBeSeenByMyTeam(hero))) {
                        if (caster.HasModifier("modifier_imba_zuus_static_field")) {
                            caster.findBuff<modifier_imba_zuus_static_field>("modifier_imba_zuus_static_field").Apply(hero);
                        }
                        damage_table.damage = this.GetAbilityDamage();
                        damage_table.victim = hero;
                        ApplyDamage(damage_table);
                        this.AddTimer(FrameTime(), () => {
                            if (!hero.IsAlive()) {
                                let thundergod_kill_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_zeus/zues_kill_empty.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined, this.GetCasterPlus());
                                ParticleManager.SetParticleControl(thundergod_kill_particle, 0, hero.GetAbsOrigin());
                                ParticleManager.SetParticleControl(thundergod_kill_particle, 1, hero.GetAbsOrigin());
                                ParticleManager.SetParticleControl(thundergod_kill_particle, 2, hero.GetAbsOrigin());
                                ParticleManager.SetParticleControl(thundergod_kill_particle, 3, hero.GetAbsOrigin());
                                ParticleManager.SetParticleControl(thundergod_kill_particle, 6, hero.GetAbsOrigin());
                            }
                        });
                    }
                    hero.EmitSound("Hero_Zuus.GodsWrath.Target");
                    hero.AddNewModifier(caster, ability, "modifier_imba_zuus_lightning_fow", {
                        duration: sight_duration,
                        radius: true_sight_radius
                    });
                    let true_sight = hero.AddNewModifier(caster, this, "modifier_imba_zuus_lightning_true_sight", {
                        duration: sight_duration * (1 - hero.GetStatusResistance())
                    });
                    if (true_sight != undefined) {
                        true_sight.SetStackCount(true_sight_radius);
                    }
                    if (hero.HasModifier("modifier_imba_zuus_static_charge")) {
                        hero.findBuff<modifier_imba_zuus_static_charge>("modifier_imba_zuus_static_charge").SetStackCount(math.floor(hero.FindModifierByName("modifier_imba_zuus_static_charge").GetStackCount() / 2));
                    }
                    if (!hero.IsAlive() && caster.HasTalent("special_bonus_imba_zuus_9") && caster.HasAbility("imba_zuus_cloud")) {
                        caster.findAbliityPlus<imba_zuus_cloud>("imba_zuus_cloud").EndCooldown();
                        if (caster.HasAbility("imba_zuus_nimbus_zap")) {
                            caster.findAbliityPlus<imba_zuus_nimbus_zap>("imba_zuus_nimbus_zap").EndCooldown();
                        }
                        if (caster.HasAbility("imba_zuus_lightning_bolt")) {
                            let thundergods_focus_modifier = caster.AddNewModifier(caster, this, "modifier_imba_zuus_thundergods_focus", {
                                duration: caster.findAbliityPlus<imba_zuus_lightning_bolt>("imba_zuus_lightning_bolt").GetSpecialValueFor("thundergods_focus_duration")
                            });
                            thundergods_focus_modifier.SetStackCount(thundergods_focus_modifier.GetStackCount() + caster.GetTalentValue("special_bonus_imba_zuus_9"));
                        }
                    }
                }
            }
            if (thundergods_focus_stacks >= this.GetSpecialValueFor("stacks_to_awaken")) {
                ScreenShake(caster.GetAbsOrigin(), 50, 1, 1.0, 1000, 0, true);
                caster.AddNewModifier(caster, this, "modifier_imba_zuus_thundergods_awakening", {
                    duration: math.min(thundergods_focus_stacks * 3, 42)
                });
            }
        }
    }
    GetManaCost(level: number): number {
        return 100;
    }
    AutoSpellSelf() {
        return AI_ability.NO_TARGET_cast(this)
    }
}
@registerModifier()
export class modifier_imba_zuus_thundergods_focus extends BaseModifier_Plus {
    public bonus_movement_speed: number;
    public bonus_turn_rate: number;
    IsBuff() {
        return true;
    }
    BeCreated(p_0: any,): void {
        this.bonus_movement_speed = 10;
        this.bonus_turn_rate = 1;
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_zuus_4")) {
                this.bonus_movement_speed = this.bonus_movement_speed + caster.GetTalentValue("special_bonus_imba_zuus_4", "movement_speed");
                this.bonus_turn_rate = caster.GetTalentValue("special_bonus_imba_zuus_4", "turn_rate");
            }
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_zuus_6")) {
                for (let i = 0; i <= 7; i++) {
                    let ability = this.GetParentPlus().GetAbilityByIndex(i);
                    if (ability) {
                        let remaining_cooldown = ability.GetCooldownTimeRemaining();
                        ability.EndCooldown();
                        if (remaining_cooldown > 1) {
                            ability.StartCooldown(remaining_cooldown - 1);
                        }
                    }
                }
            }
        } else {

            let net_table = NetTablesHelper.GetDotaEntityData(this.GetCasterPlus().GetEntityIndex()) || {};
            this.bonus_movement_speed = net_table.movement_speed || 10;
            this.bonus_turn_rate = net_table.turn_rate || 1;
        }
    }
    GetTexture(): string {
        return "zuus_lightning_bolt";
    }
    /** DeclareFunctions():modifierfunction[] {
        decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        return this.bonus_movement_speed * this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE)
    CC_GetModifierTurnRate_Percentage(): number {
        return this.bonus_turn_rate * this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_zuus_pierce_spellimmunity extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_zuus_thundergods_awakening extends BaseModifier_Plus {
    public static_field: any;
    public ability: IBaseAbility_Plus;
    public arc_damage: number;
    IsHidden(): boolean {
        return false;
    }
    IsBuff() {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.static_field = ResHelper.CreateParticleEx("particles/units/heroes/hero_stormspirit/stormspirit_ball_lightning_sphere.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus());
            let caster = this.GetCasterPlus();
            this.ability = caster.findAbliityPlus<imba_zuus_arc_lightning>("imba_zuus_arc_lightning");
            this.arc_damage = this.ability.GetSpecialValueFor("arc_damage");
            if (this.arc_damage == undefined || this.arc_damage == 0) {
                this.arc_damage = 85;
            }
        }
    }
    GetTexture(): string {
        return "zuus_thundergods_wrath";
    }
    /** DeclareFunctions():modifierfunction[] {
        decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.CASTTIME_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_VISION_PERCENTAGE,
            3: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CASTTIME_PERCENTAGE)
    CC_GetModifierPercentageCasttime(p_0: ModifierAbilityEvent,): number {
        return this.GetSpecialValueFor("cast_time_increase_pct");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_VISION_PERCENTAGE)
    CC_GetBonusVisionPercentage(): number {
        return this.GetSpecialValueFor("vision_increase_pct");
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (keys.attacker.GetTeam() != caster.GetTeam() && keys.attacker.IsAlive() && keys.target == caster && !keys.attacker.IsBuilding() && !keys.attacker.IsMagicImmune()) {
                let lightningBolt = ResHelper.CreateParticleEx("particles/units/heroes/hero_zuus/zuus_arc_lightning_.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, caster, caster);
                ParticleManager.SetParticleControl(lightningBolt, 0, Vector(caster.GetAbsOrigin().x, caster.GetAbsOrigin().y, caster.GetAbsOrigin().z + caster.GetBoundingMaxs().z));
                ParticleManager.SetParticleControl(lightningBolt, 1, Vector(keys.attacker.GetAbsOrigin().x, keys.attacker.GetAbsOrigin().y, keys.attacker.GetAbsOrigin().z + keys.attacker.GetBoundingMaxs().z));
                let damage_table: ApplyDamageOptions = {} as any;
                damage_table.attacker = caster;
                damage_table.ability = this.ability;
                damage_table.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL;
                damage_table.damage = this.arc_damage;
                damage_table.victim = keys.attacker;
                keys.attacker.EmitSound("Hero_Zuus.ArcLightning.Target");
                ApplyDamage(damage_table);
            }
        }
    }
    BeRemoved(): void {
        if (IsServer()) {
            ParticleManager.DestroyParticle(this.static_field, true);
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_zuus_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_zuus_9 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_zuus_8 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_zuus_3 extends BaseModifier_Plus {
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
