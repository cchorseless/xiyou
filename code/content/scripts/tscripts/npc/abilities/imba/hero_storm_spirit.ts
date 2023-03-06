
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_storm_spirit_static_remnant extends BaseAbility_Plus {
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let cast_sound = "Hero_StormSpirit.StaticRemnantPlant";
            let remnant_duration = this.GetSpecialValueFor("big_remnant_duration");
            let remnant_count = this.GetSpecialValueFor("remnant_count");
            if (caster.HasTalent("special_bonus_imba_storm_spirit_7")) {
                remnant_count = remnant_count + caster.GetTalentValue("special_bonus_imba_storm_spirit_7");
            }
            EmitSoundOn(cast_sound, caster);
            let far_distance = 250;
            let remnant_pos = [
                Vector(0, far_distance, 0),
                Vector(-far_distance, -far_distance, 0),
                Vector(far_distance, -far_distance, 0),
            ]

            if (remnant_count > 1) {
                for (let i = 0; i < remnant_count; i++) {
                    let dummy = BaseNpc_Plus.CreateUnitByName("npc_imba_dota_stormspirit_remnant", caster.GetAbsOrigin() + remnant_pos[i] as Vector, caster.GetTeamNumber(), false, caster, undefined);
                    dummy.AddNewModifier(caster, this, "modifier_imba_static_remnant", {
                        duration: remnant_duration
                    });
                }
            } else {
                let dummy = BaseNpc_Plus.CreateUnitByName("npc_imba_dota_stormspirit_remnant", caster.GetAbsOrigin(), caster.GetTeamNumber(), false, caster, undefined);
                dummy.AddNewModifier(caster, this, "modifier_imba_static_remnant", {
                    duration: remnant_duration
                });
            }
        }
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_static_remnant extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public dummy: any;
    public caster_location: any;
    public ballLightning: any;
    public activation_delay: number;
    public remnant_particle_fx: any;
    BeCreated(params: any): void {
        if (IsServer()) {
            this.ability = this.GetAbilityPlus();
            let remnant_particle = "particles/units/heroes/hero_stormspirit/stormspirit_static_remnant.vpcf";
            this.dummy = this.GetParentPlus();
            this.caster_location = this.dummy.GetAbsOrigin();
            this.ballLightning = params.ballLightning || false;
            this.activation_delay = this.ability.GetSpecialValueFor("big_remnant_activation_delay");
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_storm_spirit_6")) {
                this.activation_delay = this.activation_delay - 0.3;
            }
            let check_interval = this.ability.GetSpecialValueFor("explosion_check_interval");
            this.remnant_particle_fx = ResHelper.CreateParticleEx(remnant_particle, ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
            ParticleManager.SetParticleControl(this.remnant_particle_fx, 0, this.caster_location);
            ParticleManager.SetParticleControlEnt(this.remnant_particle_fx, 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.caster_location, true);
            ParticleManager.SetParticleControl(this.remnant_particle_fx, 2, Vector(RandomInt(37, 52), 1, 100));
            ParticleManager.SetParticleControl(this.remnant_particle_fx, 11, this.caster_location);
            this.StartIntervalThink(check_interval);
        }
    }
    OnIntervalThink(): void {
        if (this.GetElapsedTime() >= this.activation_delay) {
            if (this.ability.IsNull()) {
                this.StartIntervalThink(-1);
                return;
            }
            let remnant_location = this.dummy.GetAbsOrigin();
            let activation_range = this.ability.GetSpecialValueFor("big_remnant_activation_radius");
            let nearby_enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), remnant_location, undefined, activation_range, this.ability.GetAbilityTargetTeam(), this.ability.GetAbilityTargetType(), DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
            if (GameFunc.GetCount(nearby_enemies) > 0) {
                this.Destroy();
            }
        }
    }
    BeDestroy( /** params */): void {
        if (IsServer()) {
            if (this.ability.IsNull()) {
                ParticleManager.DestroyParticle(this.remnant_particle_fx, false);
                ParticleManager.ReleaseParticleIndex(this.remnant_particle_fx);
                UTIL_Remove(this.dummy);
                return;
            }
            let remnant_blowup_sound = "Hero_StormSpirit.StaticRemnantExplode";
            let remnant_location = this.dummy.GetAbsOrigin();
            let damage_radius = this.ability.GetSpecialValueFor("big_remnant_damage_radius");
            let damage = this.ability.GetSpecialValueFor("big_remnant_damage");
            EmitSoundOn(remnant_blowup_sound, this.dummy);
            let nearby_enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), remnant_location, undefined, damage_radius, this.ability.GetAbilityTargetTeam(), this.ability.GetAbilityTargetType(), this.ability.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false);
            let pull_duration = 0;
            let speed = 0;
            let electric_vortex_pull_distance = 0;
            if (this.GetCasterPlus().HasAbility("imba_storm_spirit_electric_vortex")) {
                pull_duration = this.GetCasterPlus().findAbliityPlus<imba_storm_spirit_electric_vortex>("imba_storm_spirit_electric_vortex").GetSpecialValueFor("pull_duration") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_storm_spirit_1");
                speed = this.GetCasterPlus().findAbliityPlus<imba_storm_spirit_electric_vortex>("imba_storm_spirit_electric_vortex").GetSpecialValueFor("pull_units_per_second");
                electric_vortex_pull_distance = this.GetCasterPlus().findAbliityPlus<imba_storm_spirit_electric_vortex>("imba_storm_spirit_electric_vortex").GetSpecialValueFor("electric_vortex_pull_distance");
                pull_duration = pull_duration * (100 - this.GetSpecialValueFor("vortex_time_pct")) / 100;
            }
            let lingering_sound = "Hero_StormSpirit.ElectricVortex";
            let cast_sound = "Hero_StormSpirit.ElectricVortexCast";
            let electric_sound = false;
            for (const [_, enemy] of GameFunc.iPair(nearby_enemies)) {
                let damageTable = {
                    victim: enemy,
                    damage: damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    attacker: this.GetCasterPlus(),
                    ability: this.ability
                }
                ApplyDamage(damageTable);
                if (enemy.IsAlive()) {
                    if (electric_sound == false) {
                        electric_sound = true;
                    }
                    if (pull_duration != 0 && !this.ballLightning) {
                        enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_vortex_root", {
                            duration: pull_duration * (1 - enemy.GetStatusResistance()),
                            speed: speed,
                            pos_x: remnant_location.x,
                            pos_y: remnant_location.y,
                            pos_z: remnant_location.z,
                            electric_vortex_pull_distance: electric_vortex_pull_distance
                        });
                    }
                }
            }
            if (pull_duration != 0 && !this.ballLightning && electric_sound == true) {
                this.GetCasterPlus().EmitSound(cast_sound);
                EmitSoundOn(lingering_sound, this.GetCasterPlus());
            }
            ParticleManager.DestroyParticle(this.remnant_particle_fx, false);
            ParticleManager.ReleaseParticleIndex(this.remnant_particle_fx);
            UTIL_Remove(this.dummy);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let frozen_state = {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_ATTACK_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true
        }
        return frozen_state;
    }
    /** DeclareFunctions():modifierfunction[] {
        funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_1;
    }
}
@registerAbility()
export class imba_storm_spirit_electric_vortex extends BaseAbility_Plus {
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let caster_loc = caster.GetAbsOrigin();
            let lingering_sound = "Hero_StormSpirit.ElectricVortex";
            let cast_sound = "Hero_StormSpirit.ElectricVortexCast";
            let pull_duration = this.GetSpecialValueFor("pull_duration") + caster.GetTalentValue("special_bonus_imba_storm_spirit_1");
            let self_slow_duration = this.GetSpecialValueFor("self_slow_duration");
            let speed = this.GetSpecialValueFor("pull_units_per_second");
            let electric_vortex_pull_distance = this.GetSpecialValueFor("electric_vortex_pull_distance");
            caster.EmitSound(cast_sound);
            EmitSoundOn(lingering_sound, caster);
            if (!caster.HasScepter()) {
                let target = this.GetCursorTarget();
                let direction = (caster.GetAbsOrigin() - target.GetAbsOrigin() as Vector).Normalized();
                if (target.TriggerSpellAbsorb(this)) {
                    return;
                }
                target.AddNewModifier(caster, this, "modifier_imba_vortex_pull", {
                    duration: pull_duration * (1 - target.GetStatusResistance()),
                    speed: speed,
                    electric_vortex_pull_distance: electric_vortex_pull_distance
                });
            } else {
                let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster_loc, undefined, this.GetCastRange(null, null), this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    let direction = (caster.GetAbsOrigin() - enemy.GetAbsOrigin() as Vector).Normalized();
                    enemy.AddNewModifier(caster, this, "modifier_imba_vortex_pull", {
                        duration: pull_duration * (1 - enemy.GetStatusResistance()),
                        speed: speed,
                        electric_vortex_pull_distance: electric_vortex_pull_distance
                    });
                }
            }
        }
    }
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        let caster = this.GetCasterPlus();
        let talent_bonus = caster.GetTalentValue("special_bonus_imba_storm_spirit_2");
        if (!caster.HasScepter()) {
            return this.GetSpecialValueFor("cast_range") + talent_bonus;
        } else {
            return this.GetSpecialValueFor("scepter_radius") + talent_bonus;
        }
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        let caster = this.GetCasterPlus();
        if (!caster.HasScepter()) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET;
        }
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_storm_spirit_2") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_storm_spirit_2")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_storm_spirit_2"), "modifier_special_bonus_imba_storm_spirit_2", {});
        }
    }
}
@registerModifier()
export class modifier_imba_vortex_pull extends BaseModifierMotionHorizontal_Plus {
    public vortex_loc: any;
    public vortex_particle_fx: any;
    public speed: number;
    public electric_vortex_pull_distance: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return true;
    }
    IsMotionController() {
        return true;
    }

    BeCreated(params: any): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let vortex_particle = "particles/units/heroes/hero_stormspirit/stormspirit_electric_vortex.vpcf";
            this.vortex_loc = this.GetCasterPlus().GetAbsOrigin();
            this.vortex_particle_fx = ResHelper.CreateParticleEx(vortex_particle, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
            ParticleManager.SetParticleControlEnt(this.vortex_particle_fx, 1, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true);
            this.speed = params.speed * FrameTime();
            this.electric_vortex_pull_distance = params.electric_vortex_pull_distance;
            this.speed = (this.electric_vortex_pull_distance / this.GetDuration()) * FrameTime();
            this.StartIntervalThink(FrameTime());
        }
    }
    BeRefresh(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.SetDuration(this.GetDuration() * (1 - this.GetParentPlus().GetStatusResistance()), true);
    }
    ApplyHorizontalMotionController() {
        if (!this.CheckMotionControllers()) {
            return false;;
        }
        return true;
    }

    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        }
        return state;
    }
    UpdateHorizontalMotion(unit: IBaseNpc_Plus, time: number) {
        if (IsServer()) {
            let set_point = unit.GetAbsOrigin() + (this.GetCasterPlus().GetAbsOrigin() - unit.GetAbsOrigin() as Vector).Normalized() * this.speed as Vector;
            unit.SetAbsOrigin(Vector(set_point.x, set_point.y, GetGroundPosition(set_point, unit).z));
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_FLAIL;
    }
    BeDestroy(): void {
        if (IsServer()) {
            ParticleManager.DestroyParticle(this.vortex_particle_fx, false);
            ParticleManager.ReleaseParticleIndex(this.vortex_particle_fx);
            StopSoundOn("Hero_StormSpirit.ElectricVortex", this.GetParentPlus());
            this.GetParentPlus().SetUnitOnClearGround();
        }
    }
}
@registerModifier()
export class modifier_imba_vortex_root extends BaseModifierMotionHorizontal_Plus {
    public vortex_loc: any;
    public vortex_particle_fx: any;
    public speed: number;
    public electric_vortex_pull_distance: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return true;
    }
    IsMotionController() {
        return true;
    }

    BeCreated(params: any): void {
        if (IsServer()) {
            let vortex_particle = "particles/units/heroes/hero_stormspirit/stormspirit_electric_vortex_root.vpcf";
            this.vortex_loc = Vector(params.pos_x, params.pos_y, params.pos_z);
            this.vortex_particle_fx = ResHelper.CreateParticleEx(vortex_particle, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            ParticleManager.SetParticleControlEnt(this.vortex_particle_fx, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.vortex_loc, true);
            this.speed = params.speed * FrameTime();
            this.electric_vortex_pull_distance = params.electric_vortex_pull_distance;
            this.speed = (this.electric_vortex_pull_distance / this.GetDuration()) * FrameTime();
            this.StartIntervalThink(FrameTime());
        }
    }
    BeRefresh(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.SetDuration(this.GetDuration() * (1 - this.GetParentPlus().GetStatusResistance()), true);
    }
    ApplyHorizontalMotionController() {
        if (!this.CheckMotionControllers()) {
            return false;
        }
        return true;
    }

    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_NORMAL;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        }
        return state;
    }
    UpdateHorizontalMotion(unit: IBaseNpc_Plus, time: number) {
        if (IsServer()) {
            let set_point = unit.GetAbsOrigin() + (this.vortex_loc - unit.GetAbsOrigin() as Vector).Normalized() * this.speed as Vector;
            unit.SetAbsOrigin(Vector(set_point.x, set_point.y, GetGroundPosition(set_point, unit).z));
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_FLAIL;
    }
    BeDestroy(): void {
        if (IsServer()) {
            ParticleManager.DestroyParticle(this.vortex_particle_fx, false);
            ParticleManager.ReleaseParticleIndex(this.vortex_particle_fx);
            StopSoundOn("Hero_StormSpirit.ElectricVortex", this.GetParentPlus());
            this.GetParentPlus().SetUnitOnClearGround();
        }
    }
}
@registerModifier()
export class modifier_imba_vortex_self_slow extends BaseModifier_Plus {
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
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        let ms = this.GetSpecialValueFor("self_slow");
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_storm_spirit_8")) {
            ms = ms + this.GetCasterPlus().GetTalentValue("special_bonus_imba_storm_spirit_8");
        }
        return ms;
    }
}
@registerAbility()
export class imba_storm_spirit_overload extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_overload";
    }
    GetAbilityTextureName(): string {
        return "storm_spirit_overload";
    }
}
@registerModifier()
export class modifier_imba_overload extends BaseModifier_Plus {
    IsPassive(): boolean {
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
    RemoveOnDeath(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    CC_OnAbilityExecuted(keys: ModifierAbilityEvent): void {
        if (IsServer()) {
            if (keys.ability && keys.ability.GetName() != "ability_capture") {
                let parent = this.GetParentPlus();
                if (keys.unit == parent) {
                    if (!parent.PassivesDisabled()) {
                        if ((!keys.ability.IsItem() && !keys.ability.IsToggle())) {
                            if (parent.findBuff<modifier_imba_overload_buff>("modifier_imba_overload_buff") && parent.FindModifierByName("modifier_imba_overload_buff").GetStackCount() < this.GetSpecialValueFor("max_stacks")) {
                                parent.findBuff<modifier_imba_overload_buff>("modifier_imba_overload_buff").SetStackCount(parent.FindModifierByName("modifier_imba_overload_buff").GetStackCount() + 1);
                            } else {
                                parent.AddNewModifier(parent, this.GetAbilityPlus(), "modifier_imba_overload_buff", {});
                            }
                        }
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_overload_buff extends BaseModifier_Plus {
    public particle_fx: any;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let particle = "particles/units/heroes/hero_stormspirit/stormspirit_overload_ambient.vpcf";
            this.particle_fx = ResHelper.CreateParticleEx(particle, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, parent);
            ParticleManager.SetParticleControlEnt(this.particle_fx, 0, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", parent.GetAbsOrigin(), true);
            this.SetStackCount(1);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            if (keys.attacker == this.GetParentPlus()) {
                if (!keys.target.IsBuilding() && keys.target.GetTeamNumber() != keys.attacker.GetTeamNumber()) {
                    let parent = this.GetParentPlus();
                    let ability = this.GetAbilityPlus();
                    let particle = "particles/units/heroes/hero_stormspirit/stormspirit_overload_discharge.vpcf";
                    let radius = ability.GetSpecialValueFor("aoe") + (ability.GetSpecialValueFor("bonus_aoe_stack") * this.GetStackCount());
                    let damage = ability.GetSpecialValueFor("damage") + (ability.GetSpecialValueFor("bonus_dmg_stack") * this.GetStackCount());
                    let slow_duration = ability.GetSpecialValueFor("slow_duration");
                    let target_flag = ability.GetAbilityTargetFlags();
                    if (this.GetParentPlus().HasTalent("special_bonus_unique_storm_spirit_3")) {
                        target_flag = target_flag + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES;
                    }
                    let particle_fx = ResHelper.CreateParticleEx(particle, ParticleAttachment_t.PATTACH_ABSORIGIN, parent);
                    ParticleManager.SetParticleControl(particle_fx, 0, keys.target.GetAbsOrigin());
                    ParticleManager.ReleaseParticleIndex(particle_fx);
                    keys.target.EmitSound("Hero_StormSpirit.Overload");
                    let enemies = FindUnitsInRadius(parent.GetTeamNumber(), keys.target.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, target_flag, FindOrder.FIND_ANY_ORDER, false);
                    for (const [_, enemy] of GameFunc.iPair(enemies)) {
                        let damageTable = {
                            victim: enemy,
                            damage: damage,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                            attacker: parent,
                            ability: ability
                        }
                        ApplyDamage(damageTable);
                        enemy.AddNewModifier(parent, ability, "modifier_imba_overload_debuff", {
                            duration: slow_duration * (1 - enemy.GetStatusResistance())
                        });
                        this.Destroy();
                    }
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        return "overload";
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_STORM_SPIRIT_OVERLOAD_RUN_OVERRIDE;
    }
    BeDestroy(): void {
        if (IsServer()) {
            ParticleManager.DestroyParticle(this.particle_fx, false);
            ParticleManager.ReleaseParticleIndex(this.particle_fx);
        }
    }
}
@registerModifier()
export class modifier_imba_overload_debuff extends BaseModifier_Plus {
    public move_slow: any;
    public attack_slow: any;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        let ability = this.GetAbilityPlus();
        this.move_slow = ability.GetSpecialValueFor("move_slow");
        this.attack_slow = ability.GetSpecialValueFor("attack_slow");
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.move_slow;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.attack_slow;
    }
}
@registerAbility()
export class imba_storm_spirit_ball_lightning extends BaseAbility_Plus {
    public remnant: any;
    public traveled_remnant: any;
    public traveled: any;
    public distance: number;
    public direction: any;
    public projectileID: any;
    public units_traveled_in_last_tick: any;
    OnSpellStart(): void {
        if (IsServer()) {
            if (this.GetCasterPlus().findBuff<modifier_imba_ball_lightning>("modifier_imba_ball_lightning")) {
                this.RefundManaCost();
                return;
            }
            if (this.GetCasterPlus().HasTalent("special_bonus_unique_storm_spirit_4")) {
                this.remnant = this.GetCasterPlus().findAbliityPlus<imba_storm_spirit_static_remnant>("imba_storm_spirit_static_remnant");
                this.traveled_remnant = 0;
            }
            let caster = this.GetCasterPlus();
            let target_loc = this.GetCursorPosition();
            let caster_loc = caster.GetAbsOrigin();
            let speed = this.GetSpecialValueFor("ball_speed");
            let damage_radius = this.GetSpecialValueFor("damage_radius");
            let vision = this.GetSpecialValueFor("ball_vision_radius");
            let tree_radius = 100;
            let damage = this.GetSpecialValueFor("damage_per_100_units");
            let base_mana_cost = this.GetSpecialValueFor("travel_mana_cost_base");
            let pct_mana_cost = this.GetSpecialValueFor("travel_mana_cost_pct") * caster.GetMaxMana();
            let total_mana_cost = base_mana_cost + pct_mana_cost;
            let max_spell_amp_range = this.GetSpecialValueFor("max_spell_amp_range");
            this.traveled = 0;
            this.distance = (target_loc - caster_loc as Vector).Length2D();
            this.direction = (target_loc - caster_loc as Vector).Normalized();
            caster.EmitSound("Hero_StormSpirit.BallLightning");
            if ((target_loc - caster_loc as Vector).Length2D() > 130) {
                caster.EmitSound("Hero_StormSpirit.BallLightning.Loop");
            }
            let projectile = {
                Ability: this,
                EffectName: "particles/hero/storm_spirit/no_particle_particle.vpcf",
                vSpawnOrigin: caster_loc,
                fDistance: this.distance,
                fStartRadius: damage_radius,
                fEndRadius: damage_radius,
                Source: caster,
                bHasFrontalCone: false,
                bReplaceExisting: false,
                iUnitTargetTeam: this.GetAbilityTargetTeam(),
                iUnitTargetFlags: this.GetAbilityTargetFlags(),
                iUnitTargetType: this.GetAbilityTargetType(),
                bDeleteOnHit: false,
                vVelocity: this.direction * speed * Vector(1, 1, 0) as Vector,
                bProvidesVision: true,
                iVisionRadius: vision,
                iVisionTeamNumber: caster.GetTeamNumber(),
                ExtraData: {
                    damage: damage,
                    tree_radius: tree_radius,
                    base_mana_cost: base_mana_cost,
                    pct_mana_cost: pct_mana_cost,
                    total_mana_cost: total_mana_cost,
                    speed: speed * FrameTime(),
                    max_spell_amp_range: max_spell_amp_range
                }
            }
            this.projectileID = ProjectileManager.CreateLinearProjectile(projectile);
            caster.AddNewModifier(caster, this, "modifier_imba_ball_lightning", {});
        }
    }
    OnProjectileThink_ExtraData(location: Vector, ExtraData: any): void {
        let caster = this.GetCasterPlus();
        if ((this.traveled + ExtraData.speed < this.distance) && caster.IsAlive() && (caster.GetMana() > ExtraData.total_mana_cost * 0.01)) {
            GridNav.DestroyTreesAroundPoint(location, ExtraData.tree_radius, false);
            caster.SetAbsOrigin(Vector(location.x, location.y, GetGroundPosition(location, caster).z));
            caster.Purge(false, true, true, true, true);
            caster.AddNewModifier(caster, this, "modifier_item_imba_lotus_orb_active", {
                duration: FrameTime()
            });
            this.traveled = this.traveled + ExtraData.speed;
            this.units_traveled_in_last_tick = ExtraData.speed;
            caster.ReduceMana(((ExtraData.pct_mana_cost * 0.01) + ExtraData.base_mana_cost) * this.units_traveled_in_last_tick * 0.01);
            if (this.traveled_remnant != undefined && this.remnant) {
                this.traveled_remnant = this.traveled_remnant + ExtraData.speed;
                let remant_interval = caster.GetTalentValue("special_bonus_unique_storm_spirit_4");
                if (this.traveled_remnant - remant_interval >= 0) {
                    this.traveled_remnant = this.traveled_remnant - remant_interval;
                    let cast_sound = "Hero_StormSpirit.StaticRemnantPlant";
                    EmitSoundOn(cast_sound, caster);
                    let dummy = BaseNpc_Plus.CreateUnitByName("npc_imba_dota_stormspirit_remnant", caster.GetAbsOrigin(), caster.GetTeamNumber(), false, caster, undefined);
                    dummy.AddNewModifier(caster, this.remnant, "modifier_imba_static_remnant", {
                        duration: this.remnant.GetSpecialValueFor("big_remnant_duration"),
                        ballLightning: true
                    });
                }
            }
        } else {
            let responses = {
                "1": "stormspirit_ss_ability_lightning_04",
                "2": "stormspirit_ss_ability_lightning_05",
                "3": "stormspirit_ss_ability_lightning_06",
                "4": "stormspirit_ss_ability_lightning_07",
                "5": "stormspirit_ss_ability_lightning_08",
                "6": "stormspirit_ss_ability_lightning_09",
                "7": "stormspirit_ss_ability_lightning_10",
                "8": "stormspirit_ss_ability_lightning_13",
                "9": "stormspirit_ss_ability_lightning_14",
                "10": "stormspirit_ss_ability_lightning_18",
                "11": "stormspirit_ss_ability_lightning_20",
                "12": "stormspirit_ss_ability_lightning_21",
                "13": "stormspirit_ss_ability_lightning_22",
                "14": "stormspirit_ss_ability_lightning_23",
                "15": "stormspirit_ss_ability_lightning_24",
                "16": "stormspirit_ss_ability_lightning_25",
                "17": "stormspirit_ss_ability_lightning_26",
                "18": "stormspirit_ss_ability_lightning_27",
                "19": "stormspirit_ss_ability_lightning_28",
                "20": "stormspirit_ss_ability_lightning_29",
                "21": "stormspirit_ss_ability_lightning_30",
                "22": "stormspirit_ss_ability_lightning_31",
                "23": "stormspirit_ss_ability_lightning_32"
            }
            // if (caster.GetName() .includes("storm_spirit")) {
            // }
            caster.EmitCasterSound(Object.values(responses), 100, ResHelper.EDOTA_CAST_SOUND.FLAG_BOTH_TEAMS, undefined, undefined);

            caster.SetUnitOnClearGround();
            if (caster.findBuff<modifier_imba_ball_lightning>("modifier_imba_ball_lightning")) {
                caster.findBuff<modifier_imba_ball_lightning>("modifier_imba_ball_lightning").Destroy();
            }
            ProjectileManager.DestroyLinearProjectile(this.projectileID);
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        if (IsServer()) {
            if (target) {
                let caster = this.GetCasterPlus();
                let damage = ExtraData.damage * math.floor(this.traveled * 0.01);
                let damage_flags = DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE;
                if (this.traveled > ExtraData.max_spell_amp_range) {
                    damage_flags = damage_flags + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION;
                    let damage_at_max_distance = ExtraData.damage * ExtraData.max_spell_amp_range * 0.01 * (1 + (caster.GetSpellAmplification(false) * 0.01));
                    if (damage < damage_at_max_distance) {
                        damage = damage_at_max_distance;
                    }
                }
                let damageTable = {
                    victim: target,
                    damage: damage,
                    damage_type: this.GetAbilityDamageType(),
                    attacker: caster,
                    ability: this,
                    damage_flags: damage_flags
                }
                ApplyDamage(damageTable);
                if (!target.IsAlive()) {
                    let responses = {
                        "1": "stormspirit_ss_ability_lightning_01",
                        "2": "stormspirit_ss_ability_lightning_03"
                    }
                    if (RollPercentage(10)) {
                        caster.EmitCasterSound(Object.values(responses), 100, ResHelper.EDOTA_CAST_SOUND.FLAG_BOTH_TEAMS, undefined, undefined);
                    }
                }
            }
        }
    }
    GetManaCost(p_0: number,): number {
        let caster = this.GetCasterPlus();
        let base_cost = this.GetSpecialValueFor("initial_mana_cost_base");
        let pct_cost = this.GetSpecialValueFor("initial_mana_cost_pct");
        return (base_cost + (caster.GetMaxMana() * pct_cost * 0.01));
    }
    IsHiddenWhenStolen(): boolean {
        return false;
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
    BeCreated(p_0: any,): void {
        this.StartIntervalThink(1);
    }
    OnIntervalThink(): void {
        if (!this.GetAbilityPlus() || this.GetAbilityPlus().IsNull()) {
            this.Destroy();
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().StopSound("Hero_StormSpirit.BallLightning.Loop");
        ProjectileManager.ProjectileDodge(this.GetParentPlus());
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
}
@registerModifier()
export class modifier_special_bonus_imba_storm_spirit_6 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_storm_spirit_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_storm_spirit_7 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_storm_spirit_2 extends BaseModifier_Plus {
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
