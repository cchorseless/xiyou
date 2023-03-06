
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionBoth_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_ursa_earthshock extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "ursa_earthshock";
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return this.GetSpecialValueFor("radius") - this.GetCasterPlus().GetCastRangeBonus();
    }
    OnSpellStart(): void {
        if (!this.GetCasterPlus().HasModifier("modifier_imba_earthshock_movement")) {
            this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_1);
            let direction_vector = this.GetCasterPlus().GetForwardVector() * this.GetSpecialValueFor("hop_distance") as Vector;
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_earthshock_movement", {
                duration: this.GetSpecialValueFor("hop_duration"),
                distance: this.GetSpecialValueFor("hop_distance"),
                direction_x: direction_vector.x,
                direction_y: direction_vector.y,
                diretion_z: direction_vector.z,
                height: this.GetSpecialValueFor("hop_height")
            });
        }
    }
    ApplyEarthShock() {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this;
            let sound_cast = "Hero_Ursa.Earthshock";
            let earthshock_particle = "particles/units/heroes/hero_ursa/ursa_earthshock.vpcf";
            let earthshock_debuff = "modifier_imba_earthshock_slow";
            let trembling_steps_buff = "modifier_imba_trembling_steps_buff";
            let trembling_steps_prevent = "modifier_imba_trembling_steps_prevent";
            let enrage_buff = "modifier_imba_enrage_buff";
            let enrage_ability = caster.findAbliityPlus<imba_ursa_enrage>("imba_ursa_enrage");
            let enrage_particle = "particles/hero/ursa/enrage_ursa_earthshock.vpcf";
            let radius = ability.GetSpecialValueFor("radius");
            let duration = ability.GetSpecialValueFor("duration");
            let base_damage = ability.GetSpecialValueFor("base_damage");
            let values_increase_distance = ability.GetSpecialValueFor("values_increase_distance");
            let values_increase_pct = ability.GetSpecialValueFor("values_increase_pct");
            let slow_pct = ability.GetSpecialValueFor("slow_pct");
            let trembling_steps_cooldown = ability.GetSpecialValueFor("trembling_steps_cooldown");
            let trembling_steps_duration = ability.GetSpecialValueFor("trembling_steps_duration");
            let bonus_effects_radius = ability.GetSpecialValueFor("bonus_effects_radius");
            let bonus_damage_pct = ability.GetSpecialValueFor("bonus_damage_pct");
            let bonus_slow_pct = ability.GetSpecialValueFor("bonus_slow_pct");
            let enrage_bonus_radius = 0;
            if (enrage_ability) {
                enrage_bonus_radius = enrage_ability.GetSpecialValueFor("bonus_radius_skills");
            } else {
                enrage_bonus_radius = 0;
            }
            let enrage_bonus_dmg_pct = ability.GetSpecialValueFor("enrage_bonus_dmg_pct");
            if (caster.HasModifier(enrage_buff)) {
                radius = radius + enrage_bonus_radius;
                earthshock_particle = enrage_particle;
                bonus_damage_pct = bonus_damage_pct + enrage_bonus_dmg_pct;
            }
            EmitSoundOn(sound_cast, caster);
            let earthshock_particle_fx = ResHelper.CreateParticleEx(earthshock_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(earthshock_particle_fx, 0, caster.GetAbsOrigin());
            ParticleManager.SetParticleControl(earthshock_particle_fx, 1, Vector(1, 1, 1));
            ParticleManager.ReleaseParticleIndex(earthshock_particle_fx);
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (!enemy.IsMagicImmune()) {
                    let distance = (enemy.GetAbsOrigin() - caster.GetAbsOrigin() as Vector).Length2D();
                    let edge_distance = radius - distance;
                    let earthshock_debuff_slow_pct;
                    let damage;
                    if (distance <= bonus_effects_radius) {
                        damage = base_damage * (1 + (bonus_damage_pct * 0.01));
                        earthshock_debuff_slow_pct = slow_pct + bonus_slow_pct;
                    } else {
                        let scale_increase_for_distance = math.floor(edge_distance / values_increase_distance);
                        let pct_increase_for_distance = values_increase_pct * scale_increase_for_distance;
                        damage = base_damage * (1 + pct_increase_for_distance);
                        earthshock_debuff_slow_pct = slow_pct * (1 + pct_increase_for_distance);
                    }
                    let damageTable = {
                        victim: enemy,
                        attacker: caster,
                        damage: damage,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                        ability: ability
                    }
                    ApplyDamage(damageTable);
                    enemy.AddNewModifier(caster, ability, earthshock_debuff, {
                        duration: duration * (1 - enemy.GetStatusResistance())
                    });
                }
            }
            caster.AddNewModifier(caster, ability, trembling_steps_buff, {
                duration: trembling_steps_duration
            });
            caster.AddNewModifier(caster, ability, trembling_steps_prevent, {
                duration: trembling_steps_cooldown
            });
        }
    }
}
@registerModifier()
export class modifier_imba_earthshock_slow extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public enemy: any;
    public radius: number;
    public bonus_effects_radius: number;
    public slow_pct: number;
    public bonus_slow_pct: number;
    public values_increase_distance: number;
    public values_increase_pct: number;
    public distance: number;
    public edge_distance: number;
    public earthshock_debuff_slow_pct: number;
    public scale_increase_for_distance: number;
    public pct_increase_for_distance: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.enemy = this.GetParentPlus();
        this.radius = this.ability.GetSpecialValueFor("radius");
        this.bonus_effects_radius = this.ability.GetSpecialValueFor("bonus_effects_radius");
        this.slow_pct = this.ability.GetSpecialValueFor("slow_pct");
        this.bonus_slow_pct = this.ability.GetSpecialValueFor("bonus_slow_pct");
        this.values_increase_distance = this.ability.GetSpecialValueFor("values_increase_distance");
        this.values_increase_pct = this.ability.GetSpecialValueFor("values_increase_pct");
        this.distance = (this.enemy.GetAbsOrigin() - this.caster.GetAbsOrigin() as Vector).Length2D();
        this.edge_distance = this.radius - this.distance;
        if (this.distance <= this.bonus_effects_radius) {
            this.earthshock_debuff_slow_pct = this.slow_pct + this.bonus_slow_pct;
        } else {
            this.scale_increase_for_distance = math.floor(this.edge_distance / this.values_increase_distance);
            this.pct_increase_for_distance = this.values_increase_pct * this.scale_increase_for_distance;
            this.earthshock_debuff_slow_pct = this.slow_pct * (1 + this.pct_increase_for_distance);
        }
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_ursa/ursa_earthshock_modifier.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        let enemy = this.GetParentPlus();
        return this.earthshock_debuff_slow_pct * (-1);
    }
}
@registerModifier()
export class modifier_imba_earthshock_movement extends BaseModifierMotionBoth_Plus {
    public distance: number;
    public direction: any;
    public duration: number;
    public height: any;
    public velocity: any;
    public vertical_velocity: any;
    public vertical_acceleration: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.distance = params.distance;
        this.direction = Vector(params.direction_x, params.direction_y, params.direction_z as Vector).Normalized();
        this.duration = params.duration;
        this.height = params.height;
        this.velocity = this.direction * this.distance / this.duration;
        this.vertical_velocity = 4 * this.height / this.duration;
        this.vertical_acceleration = -(8 * this.height) / (this.duration * this.duration);
        if (this.GetParentPlus().IsRooted()) {
            return;
        }
        if (this.ApplyVerticalMotionController() == false) {
            this.Destroy();
        }
        if (this.ApplyHorizontalMotionController() == false) {
            this.Destroy();
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().RemoveHorizontalMotionController(this);
        this.GetParentPlus().RemoveVerticalMotionController(this);
        let ability = this.GetAbilityPlus<imba_ursa_earthshock>();
        if (ability && ability.ApplyEarthShock && this.GetRemainingTime() <= 0) {
            ability.ApplyEarthShock();
        }
    }
    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (!IsServer()) {
            return;
        }
        me.SetAbsOrigin(me.GetAbsOrigin() + this.velocity * dt as Vector);
    }
    OnHorizontalMotionInterrupted(): void {
        this.Destroy();
    }
    UpdateVerticalMotion(me: CDOTA_BaseNPC, dt: number): void {
        if (!IsServer()) {
            return;
        }
        me.SetAbsOrigin(me.GetAbsOrigin() + Vector(0, 0, this.vertical_velocity) * dt as Vector);
        this.vertical_velocity = this.vertical_velocity + (this.vertical_acceleration * dt);
    }
    OnVerticalMotionInterrupted(): void {
        this.Destroy();
    }
}
@registerModifier()
export class modifier_imba_trembling_steps_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public sound_step: any;
    public particle_step: any;
    public trembling_steps_prevent: any;
    public trembling_steps_debuff: any;
    public base_radius: number;
    public trembling_steps_duration: number;
    public trembling_steps_slow_pct: number;
    public trembling_steps_radius_pct: number;
    public trembling_steps_damage: number;
    public trembling_steps_cooldown: number;
    public radius: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.sound_step = "Imba.UrsaTremblingSteps";
            this.particle_step = "particles/hero/ursa/ursa_trembling_steps_elixir.vpcf";
            this.trembling_steps_prevent = "modifier_imba_trembling_steps_prevent";
            this.trembling_steps_debuff = "modifier_imba_trembling_steps_debuff";
            this.base_radius = this.ability.GetSpecialValueFor("radius");
            this.trembling_steps_duration = this.ability.GetSpecialValueFor("trembling_steps_duration");
            this.trembling_steps_slow_pct = this.ability.GetSpecialValueFor("trembling_steps_slow_pct");
            this.trembling_steps_radius_pct = this.ability.GetSpecialValueFor("trembling_steps_radius_pct");
            this.trembling_steps_damage = this.ability.GetSpecialValueFor("trembling_steps_damage");
            this.trembling_steps_cooldown = this.ability.GetSpecialValueFor("trembling_steps_cooldown");
            this.radius = this.base_radius * this.trembling_steps_radius_pct;
            if (this.caster.HasTalent("special_bonus_imba_ursa_2")) {
                let cooldown_improvement = this.caster.GetTalentValue("special_bonus_imba_ursa_2", "cooldown_improvement");
                let strength_per_cd = this.caster.GetTalentValue("special_bonus_imba_ursa_2", "strength_per_cd");
                let threshold = this.caster.GetTalentValue("special_bonus_imba_ursa_2", "threshold");
                let strength = this.caster.GetStrength();
                let cd_reduction = math.floor(strength / strength_per_cd) * cooldown_improvement;
                if (cd_reduction > threshold) {
                    cd_reduction = threshold;
                }
                this.trembling_steps_cooldown = this.trembling_steps_cooldown - cd_reduction;
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_UNIT_MOVED
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_UNIT_MOVED)
    CC_OnUnitMoved(p_0: ModifierUnitEvent,): void {
        if (IsServer()) {
            if (this.caster.TempData().last_position == undefined) {
                this.caster.TempData().last_position = this.caster.GetAbsOrigin();
            } else {
                if (this.caster.GetAbsOrigin() - this.caster.TempData().last_position == Vector(0, 0, 0)) {
                    return undefined;
                } else {
                    this.caster.TempData().last_position = this.caster.GetAbsOrigin();
                }
            }
            if (this.caster.HasModifier(this.trembling_steps_prevent)) {
                return undefined;
            }
            this.caster.AddNewModifier(this.caster, this.ability, this.trembling_steps_prevent, {
                duration: this.trembling_steps_cooldown
            });
            EmitSoundOn(this.sound_step, this.caster);
            let particle_step_fx = ResHelper.CreateParticleEx(this.particle_step, ParticleAttachment_t.PATTACH_ABSORIGIN, this.caster);
            ParticleManager.SetParticleControl(particle_step_fx, 0, this.caster.GetAbsOrigin());
            ParticleManager.SetParticleControl(particle_step_fx, 1, Vector(1, 1, 1));
            ParticleManager.ReleaseParticleIndex(particle_step_fx);
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (!enemy.IsMagicImmune()) {
                    let damageTable = {
                        victim: enemy,
                        attacker: this.caster,
                        damage: this.trembling_steps_damage,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                        ability: this.ability
                    }
                    ApplyDamage(damageTable);
                }
                enemy.AddNewModifier(this.caster, this.ability, this.trembling_steps_debuff, {
                    duration: this.trembling_steps_duration * (1 - enemy.GetStatusResistance())
                });
            }
        }
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_trembling_steps_prevent extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_trembling_steps_debuff extends BaseModifier_Plus {
    GetEffectName(): string {
        return "particles/units/heroes/hero_ursa/ursa_earthshock_modifier.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        let ability = this.GetAbilityPlus();
        let trembling_steps_slow_pct = ability.GetSpecialValueFor("trembling_steps_slow_pct");
        return trembling_steps_slow_pct * (-1);
    }
}
@registerAbility()
export class imba_ursa_overpower extends BaseAbility_Plus {
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_ursa_8")) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING;
        }
    }
    GetIntrinsicModifierName(): string {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_ursa_8")) {
            return "modifier_imba_overpower_talent_fangs";
        } else {
            return undefined;
        }
    }
    GetManaCost(level: number): number {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_ursa_8")) {
            return undefined;
        } else {
            return super.GetManaCost(level);
        }
    }
    GetAbilityTextureName(): string {
        return "ursa_overpower";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this;
            let aspd_buff = "modifier_imba_overpower_buff";
            let sound_cast = "Hero_Ursa.Overpower";
            let attacks_num = ability.GetSpecialValueFor("attacks_num");
            let aspd_duration = ability.GetSpecialValueFor("aspd_duration");
            EmitSoundOn(sound_cast, caster);
            caster.StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_3);
            if (caster.HasModifier(aspd_buff)) {
                caster.RemoveModifierByName(aspd_buff);
            }
            caster.AddNewModifier(caster, ability, aspd_buff, {
                duration: aspd_duration
            });
            caster.SetModifierStackCount(aspd_buff, caster, attacks_num);
            this.DisarmEnemies(caster, ability);
        }
    }
    DisarmEnemies(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus) {
        if (IsServer()) {
            let disarm_debuff = "modifier_imba_overpower_disarm";
            let enrage_ability = caster.findAbliityPlus<imba_ursa_enrage>("imba_ursa_enrage");
            let enrage_buff = "modifier_imba_enrage_buff";
            let disarm_particle = "particles/hero/ursa/enrage_overpower.vpcf";
            let disarm_radius = ability.GetSpecialValueFor("disarm_radius");
            let disarm_duration = ability.GetSpecialValueFor("disarm_duration");
            let enrage_disarm_radius = 0;
            if (enrage_ability) {
                enrage_disarm_radius = enrage_ability.GetSpecialValueFor("bonus_radius_skills");
            }
            if (caster.HasModifier(enrage_buff)) {
                disarm_radius = disarm_radius + enrage_disarm_radius;
            }
            let disarm_particle_fx = ResHelper.CreateParticleEx(disarm_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(disarm_particle_fx, 0, caster.GetAbsOrigin());
            ParticleManager.SetParticleControl(disarm_particle_fx, 1, Vector(disarm_radius, 0, 0));
            ParticleManager.SetParticleControl(disarm_particle_fx, 3, caster.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(disarm_particle_fx);
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, disarm_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (!enemy.IsMagicImmune()) {
                    enemy.AddNewModifier(caster, ability, disarm_debuff, {
                        duration: disarm_duration * (1 - enemy.GetStatusResistance())
                    });
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_overpower_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public ursa_overpower_buff_particle: any;
    public overpower_talent: any;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.ursa_overpower_buff_particle = "particles/units/heroes/hero_ursa/ursa_overpower_buff.vpcf";
            let ursa_overpower_buff_particle_fx = ResHelper.CreateParticleEx(this.ursa_overpower_buff_particle, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.caster);
            ParticleManager.SetParticleControlEnt(ursa_overpower_buff_particle_fx, 0, this.caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_head", this.caster.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(ursa_overpower_buff_particle_fx, 1, this.caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.caster.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(ursa_overpower_buff_particle_fx, 2, this.caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.caster.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(ursa_overpower_buff_particle_fx, 3, this.caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.caster.GetAbsOrigin(), true);
            this.AddParticle(ursa_overpower_buff_particle_fx, false, false, -1, false, false);
            if (this.caster.HasTalent("special_bonus_imba_ursa_8")) {
                this.overpower_talent = true;
            }
        }
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_overpower.vpcf";
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    StatusEffectPriority(): modifierpriority {
        return 10;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: Enum_MODIFIER_EVENT.ON_ATTACK
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        let ability = this.GetAbilityPlus();
        let attack_speed_bonus = ability.GetSpecialValueFor("attack_speed_bonus");
        return attack_speed_bonus;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        let caster = this.GetCasterPlus();
        if (this.overpower_talent) {
            return undefined;
        }
        if (keys.attacker == caster) {
            let current_stacks = this.GetStackCount();
            if (current_stacks > 1) {
                this.DecrementStackCount();
            } else {
                this.Destroy();
            }
        }
    }
}
@registerModifier()
export class modifier_imba_overpower_disarm extends BaseModifier_Plus {
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_disarm.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state;
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_ursa_6")) {
            state = {
                [modifierstate.MODIFIER_STATE_DISARMED]: true,
                [modifierstate.MODIFIER_STATE_ROOTED]: true
            }
        } else {
            state = {
                [modifierstate.MODIFIER_STATE_DISARMED]: true
            }
        }
        return state;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_ursa_8 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let ability = this.GetCasterPlus().findAbliityPlus<imba_ursa_overpower>("imba_ursa_overpower");
            if (ability) {
                this.GetParentPlus().AddNewModifier(this.GetParentPlus(), ability, "modifier_imba_overpower_talent_fangs", {});
            }
        }
    }
}
@registerModifier()
export class modifier_imba_overpower_talent_fangs extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: imba_ursa_overpower;
    public sound_cast: any;
    public modifier_overpower: any;
    public duration: number;
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
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.sound_cast = "Hero_Ursa.Overpower";
            this.modifier_overpower = "modifier_imba_overpower_buff";
            this.duration = this.caster.GetTalentValue("special_bonus_imba_ursa_8");
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_START
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    CC_OnAttackStart(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            if (attacker == this.caster) {
                if (!this.ability.IsCooldownReady()) {
                    return undefined;
                }
                if (this.caster.PassivesDisabled()) {
                    return undefined;
                }
                this.caster.AddNewModifier(this.caster, this.ability, this.modifier_overpower, {
                    duration: this.duration
                });
                EmitSoundOn(this.sound_cast, this.caster);
                this.ability.DisarmEnemies(this.caster, this.ability);
                this.ability.UseResources(false, false, true);
            }
        }
    }
}
@registerAbility()
export class imba_ursa_fury_swipes extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "ursa_fury_swipes";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_fury_swipes";
    }
}
@registerModifier()
export class modifier_imba_fury_swipes_debuff extends BaseModifier_Plus {
    GetEffectName(): string {
        return "particles/units/heroes/hero_ursa/ursa_fury_swipes_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    Init(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus() && this.GetParentPlus().IsRoshan()) {
            this.SetDuration(this.GetSpecialValueFor("roshan_stack_duration"), true);
        }
    }

}
@registerModifier()
export class modifier_imba_fury_swipes extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PHYSICAL
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PHYSICAL)
    CC_GetModifierProcAttack_BonusDamage_Physical(keys: ModifierAttackEvent): number {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = keys.target;
            let ability = this.GetAbilityPlus();
            let swipes_particle = "particles/units/heroes/hero_ursa/ursa_fury_swipes.vpcf";
            let fury_swipes_debuff = "modifier_imba_fury_swipes_debuff";
            let deep_strike_particle = "particles/units/heroes/hero_bloodseeker/bloodseeker_bloodritual_impact.vpcf";
            let sound_deep_strike = "Imba.UrsaDeepStrike";
            let enrage_ability = caster.findAbliityPlus<imba_ursa_enrage>("imba_ursa_enrage");
            let enrage_buff = "modifier_imba_enrage_buff";
            let damage_per_stack = ability.GetSpecialValueFor("damage_per_stack");
            let stack_duration = ability.GetSpecialValueFor("stack_duration");
            let roshan_stack_duration = ability.GetSpecialValueFor("roshan_stack_duration");
            let deep_stack_multiplier = ability.GetSpecialValueFor("deep_stack_multiplier");
            let deep_stack_attacks = ability.GetSpecialValueFor("deep_stack_attacks");
            let enrage_swipes_multiplier = enrage_ability.GetSpecialValueFor("fury_swipes_multiplier");
            if (caster.PassivesDisabled()) {
                return undefined;
            }
            if (caster.IsIllusion()) {
                return undefined;
            }
            if (keys.attacker == caster) {
                if ((target as IBaseNpc_Plus).IsRoshan()) {
                    stack_duration = roshan_stack_duration;
                }
                if (target.IsBuilding() || target.IsOther() || target.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
                    return undefined;
                }
                let fury_swipes_debuff_handler = target.AddNewModifier(caster, ability, fury_swipes_debuff, {
                    duration: stack_duration * (1 - target.GetStatusResistance())
                });
                if (fury_swipes_debuff_handler) {
                    fury_swipes_debuff_handler.IncrementStackCount();
                }
                fury_swipes_debuff_handler.ForceRefresh();
                let swipes_particle_fx = ResHelper.CreateParticleEx(swipes_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, target);
                ParticleManager.SetParticleControl(swipes_particle_fx, 0, target.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(swipes_particle_fx);
                let fury_swipes_stacks = fury_swipes_debuff_handler.GetStackCount();
                let damage = damage_per_stack * fury_swipes_stacks;
                if (fury_swipes_stacks % deep_stack_attacks == 0) {
                    damage = damage * (deep_stack_multiplier * 0.01);
                    if (caster.HasTalent("special_bonus_imba_ursa_5")) {
                        let maximum_health_dmg = caster.GetTalentValue("special_bonus_imba_ursa_5", "maximum_health_dmg");
                        let health_threshold_pct = caster.GetTalentValue("special_bonus_imba_ursa_5", "health_threshold_pct");
                        let health_pct = target.GetHealthPercent();
                        if (health_pct >= health_threshold_pct) {
                            let maximum_health = target.GetMaxHealth();
                            damage = damage + maximum_health * maximum_health_dmg * 0.01;
                        }
                    }
                    let deep_strike_particle_fx = ResHelper.CreateParticleEx(deep_strike_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, target);
                    ParticleManager.SetParticleControl(deep_strike_particle_fx, 0, target.GetAbsOrigin());
                    ParticleManager.SetParticleControl(deep_strike_particle_fx, 1, target.GetAbsOrigin());
                    ParticleManager.SetParticleControl(deep_strike_particle_fx, 3, target.GetAbsOrigin());
                    ParticleManager.ReleaseParticleIndex(deep_strike_particle_fx);
                    EmitSoundOn(sound_deep_strike, caster);
                    if (caster.HasTalent("special_bonus_imba_ursa_4")) {
                        let talent_duration = caster.GetTalentValue("special_bonus_imba_ursa_4", "duration");
                        let armor_reduction = caster.GetTalentValue("special_bonus_imba_ursa_4", "armor_reduction");
                        if (!target.HasModifier("modifier_imba_fury_swipes_talent_ripper")) {
                            target.AddNewModifier(caster, ability, "modifier_imba_fury_swipes_talent_ripper", {
                                duration: talent_duration * (1 - target.GetStatusResistance())
                            });
                        }
                        let modifier_ripper_handler = target.findBuff<modifier_imba_fury_swipes_talent_ripper>("modifier_imba_fury_swipes_talent_ripper");
                        if (modifier_ripper_handler) {
                            modifier_ripper_handler.SetStackCount(modifier_ripper_handler.GetStackCount() + armor_reduction);
                            modifier_ripper_handler.ForceRefresh();
                        }
                    }
                }
                return damage;
            }
        }
    }
}
@registerModifier()
export class modifier_imba_fury_swipes_talent_ripper extends BaseModifier_Plus {
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
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.GetStackCount() * (-1);
    }
}
@registerAbility()
export class imba_ursa_enrage extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "ursa_enrage";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_talent_enrage_damage";
    }
    GetCooldown(level: number): number {
        let caster = this.GetCasterPlus();
        let ability = this;
        let scepter = caster.HasScepter();
        let cooldown = super.GetCooldown(level);
        let scepter_cooldown = ability.GetSpecialValueFor("scepter_cooldown");
        if (scepter) {
            return scepter_cooldown;
        }
        return cooldown;
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        let scepter = this.GetCasterPlus().HasScepter();
        if (!scepter) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_PSEUDO_QUEUE;
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let sound_cast = "Hero_Ursa.Enrage";
        let enrage_buff = "modifier_imba_enrage_buff";
        let enrage_talent_buff = "modifier_imba_enrage_talent_buff";
        let duration = ability.GetSpecialValueFor("duration");
        caster.StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_4);
        caster.Purge(false, true, false, true, true);
        EmitSoundOn(sound_cast, caster);
        caster.AddNewModifier(caster, ability, enrage_buff, {
            duration: duration
        });
        if (caster.HasTalent("special_bonus_imba_ursa_7")) {
            caster.AddNewModifier(caster, ability, enrage_talent_buff, {
                duration: duration
            });
        }
    }
}
@registerModifier()
export class modifier_imba_enrage_buff extends BaseModifier_Plus {
    AllowIllusionDuplicate(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_ursa/ursa_enrage_buff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        let reduce_cd_interval = ability.GetSpecialValueFor("reduce_cd_interval");
        if (IsServer()) {
            caster.SetRenderColor(255, 0, 0);
        }
        this.StartIntervalThink(reduce_cd_interval);
    }
    BeDestroy(): void {
        let caster = this.GetCasterPlus();
        if (IsServer()) {
            caster.SetRenderColor(255, 255, 255);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            let ability_earthshock = caster.findAbliityPlus<imba_ursa_earthshock>("imba_ursa_earthshock");
            let ability_overpower = caster.findAbliityPlus<imba_ursa_overpower>("imba_ursa_overpower");
            let reduce_cd_amount = ability.GetSpecialValueFor("reduce_cd_amount");
            if (ability_earthshock) {
                let ability_earthshock_cd = ability_earthshock.GetCooldownTimeRemaining();
                ability_earthshock.EndCooldown();
                if (ability_earthshock_cd > reduce_cd_amount) {
                    ability_earthshock.StartCooldown(ability_earthshock_cd - reduce_cd_amount);
                }
            }
            if (ability_overpower) {
                let ability_overpower_cd = ability_overpower.GetCooldownTimeRemaining();
                ability_overpower.EndCooldown();
                if (ability_overpower_cd > reduce_cd_amount) {
                    ability_overpower.StartCooldown(ability_overpower_cd - reduce_cd_amount);
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE)
    CC_GetModifierModelScale(): number {
        return 40;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        let ability = this.GetAbilityPlus();
        let damage_reduction = ability.GetSpecialValueFor("damage_reduction");
        return damage_reduction * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.GetSpecialValueFor("status_resist");
    }
}
@registerModifier()
export class modifier_imba_enrage_talent_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public health_to_damage_pct: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.health_to_damage_pct = this.caster.GetTalentValue("special_bonus_imba_ursa_7");
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let current_health = this.caster.GetHealth();
            let damage_bonus = this.health_to_damage_pct * current_health * 0.01;
            this.SetStackCount(damage_bonus);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage( /** keys */): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_special_bonus_imba_ursa_1 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let ability = this.GetParentPlus().findAbliityPlus<imba_ursa_enrage>("imba_ursa_enrage");
            if (ability) {
                this.GetParentPlus().AddNewModifier(this.GetParentPlus(), ability, "modifier_imba_talent_enrage_damage", {}).SetStackCount(this.GetCasterPlus().GetTalentValue("special_bonus_imba_ursa_1", "damage_threshold"));
            }
        }
    }
}
@registerModifier()
export class modifier_imba_talent_enrage_damage extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public prevent_modifier: any;
    public damage_threshold: number;
    public damage_reset: number;
    public enrage_cooldown: number;
    public last_damage_instance_time: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.prevent_modifier = "modifier_imba_talent_enrage_prevent";
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let gametime = GameRules.GetGameTime();
            if ((gametime - this.last_damage_instance_time) > this.damage_reset) {
                this.SetStackCount(this.damage_threshold);
                this.StartIntervalThink(-1);
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(decFuncs);
    } */
    IsHidden(): boolean {
        if (!this.GetCasterPlus().HasTalent("special_bonus_imba_ursa_1")) {
            return true;
        }
        if (!this.GetCasterPlus().HasModifier("modifier_imba_talent_enrage_prevent")) {
            return false;
        }
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            let target = keys.unit;
            let damage_taken = keys.damage;
            if (target == this.caster && !this.caster.IsIllusion()) {
                if (!this.caster.HasTalent("special_bonus_imba_ursa_1")) {
                    return undefined;
                }
                if (!this.damage_threshold || !this.damage_reset || !this.enrage_cooldown) {
                    this.damage_threshold = this.caster.GetTalentValue("special_bonus_imba_ursa_1", "damage_threshold");
                    this.damage_reset = this.caster.GetTalentValue("special_bonus_imba_ursa_1", "damage_reset");
                    this.enrage_cooldown = this.caster.GetTalentValue("special_bonus_imba_ursa_1", "enrage_cooldown");
                }
                if (this.caster.PassivesDisabled()) {
                    return undefined;
                }
                if (this.ability.GetLevel() <= 0) {
                    return undefined;
                }
                if (this.caster.HasModifier(this.prevent_modifier)) {
                    this.StartIntervalThink(-1);
                    return undefined;
                }
                this.last_damage_instance_time = GameRules.GetGameTime();
                if (this.GetStackCount() > damage_taken) {
                    this.SetStackCount(this.GetStackCount() - damage_taken);
                    this.StartIntervalThink(0.25);
                } else {
                    this.caster.AddNewModifier(this.caster, this.ability, this.prevent_modifier, {
                        duration: this.enrage_cooldown
                    });
                    this.ability.OnSpellStart();
                    this.SetStackCount(this.damage_threshold);
                    this.StartIntervalThink(-1);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_talent_enrage_prevent extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
}
@registerAbility()
export class imba_ursa_territorial_hunter extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "territorial_hunter";
    }
    IsInnateAbility() {
        return true;
    }
    territorial_aura_modifier: IBaseNpc_Plus;
    territorial_tree: CDOTA_MapTree;
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target = this.GetCursorTarget();
        let aura = "modifier_terrorital_hunter_aura";
        if (this.territorial_aura_modifier && !this.territorial_aura_modifier.IsNull()) {
            if (this.territorial_aura_modifier.ForceKill) {
                this.territorial_aura_modifier.ForceKill(false);
            }
            if (this.territorial_aura_modifier.RemoveSelf) {
                this.territorial_aura_modifier.RemoveSelf();
            }
        }
        this.territorial_tree = target as any;
        this.territorial_aura_modifier = CreateModifierThinker(caster, this, aura, {}, this.territorial_tree.GetAbsOrigin(), caster.GetTeamNumber(), false);
        GFuncEntity.AddRangeIndicator(this.territorial_aura_modifier, caster, this, "vision_range", undefined, 200, 160, 100, true, true, false);
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_ursa_3") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_ursa_3")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_ursa_3"), "modifier_special_bonus_imba_ursa_3", {});
        }
    }
}
@registerModifier()
export class modifier_terrorital_hunter_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: imba_ursa_territorial_hunter;
    public vision_range: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.vision_range = this.ability.GetSpecialValueFor("vision_range");
        this.StartIntervalThink(0.2);
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (!this.ability || !this.ability.territorial_tree.IsStanding()) {
                this.StartIntervalThink(-1);
                this.GetParentPlus().ForceKill(false);
                this.Destroy();
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.GetParentPlus().RemoveSelf();
        }
    }
    GetAuraRadius(): number {
        return this.vision_range;
    }
    IsAura(): boolean {
        return true;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_terrorital_hunter_fogvision";
    }
    GetAuraEntityReject(hTarget: CDOTA_BaseNPC): boolean {
        return hTarget.GetTeamNumber() == this.GetParentPlus().GetTeamNumber() && !hTarget.HasTalent("special_bonus_imba_ursa_3");
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_ursa/ursa_fury_swipes_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.VISUAL_Z_DELTA
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.VISUAL_Z_DELTA)
    CC_GetVisualZDelta(): number {
        return 350;
    }
}
@registerModifier()
export class modifier_terrorital_hunter_fogvision extends BaseModifier_Plus {
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    IsHidden(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_ursa/ursa_fury_swipes_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (this.GetCasterPlus().GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
                this.StartIntervalThink(FrameTime());
            } else {
                this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_terrorital_hunter_talent_tenacity", {});
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (this.GetCasterPlus().GetTeamNumber() == this.GetParentPlus().GetTeamNumber() && this.GetParentPlus().HasModifier("modifier_terrorital_hunter_talent_tenacity") && !this.GetParentPlus().HasModifier("modifier_terrorital_hunter_fogvision")) {
                this.GetParentPlus().RemoveModifierByName("modifier_terrorital_hunter_talent_tenacity");
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION,
            2: Enum_MODIFIER_EVENT.ON_HERO_KILLED
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
    CC_GetModifierProvidesFOWVision(): 0 | 1 {
        if (this.GetCasterPlus().GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
            return 1;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_HERO_KILLED)
    CC_OnHeroKilled(keys: ModifierAttackEvent): void {
        if (IsServer() && this.GetCasterPlus().GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
            let attacker = keys.attacker;
            let target = keys.target;
            if (attacker == this.GetCasterPlus() && target == this.GetParentPlus() && this.GetCasterPlus().HasTalent("special_bonus_imba_ursa_3")) {
                this.GetAbilityPlus().EndCooldown();
            }
        }
    }
}
@registerModifier()
export class modifier_terrorital_hunter_talent_tenacity extends BaseModifier_Plus {
    public tenacity_bonus: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        });
    } */
    BeCreated(p_0: any,): void {
        this.tenacity_bonus = this.GetCasterPlus().GetTalentValue("special_bonus_imba_ursa_3", "tenacity_bonus");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.tenacity_bonus;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_ursa_2 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_ursa_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_ursa_5 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_ursa_6 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_ursa_7 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_ursa_3 extends BaseModifier_Plus {
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
