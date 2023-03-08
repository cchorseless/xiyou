
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionBoth_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_rubick_telekinesis extends BaseAbility_Plus {
    public telekinesis_marker_pfx: any;
    public target: IBaseNpc_Plus;
    public target_origin: any;
    public target_modifier: modifier_imba_telekinesis;
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
    OnSpellStart( /** params */): void {
        let caster = this.GetCasterPlus();
        if (caster.HasModifier("modifier_imba_telekinesis_caster")) {
            let target_loc = this.GetCursorPosition();
            let maximum_distance;
            if (this.target.GetTeam() == caster.GetTeam()) {
                maximum_distance = this.GetSpecialValueFor("ally_range") + GPropertyCalculate.GetCastRangeBonus(caster) + caster.GetTalentValue("special_bonus_unique_rubick");
            } else {
                maximum_distance = this.GetSpecialValueFor("enemy_range") + GPropertyCalculate.GetCastRangeBonus(caster) + caster.GetTalentValue("special_bonus_unique_rubick");
            }
            if (this.telekinesis_marker_pfx) {
                ParticleManager.DestroyParticle(this.telekinesis_marker_pfx, false);
                ParticleManager.ReleaseParticleIndex(this.telekinesis_marker_pfx);
            }
            let marked_distance = (target_loc - this.target_origin as Vector).Length2D();
            if (marked_distance > maximum_distance) {
                target_loc = this.target_origin + (target_loc - this.target_origin as Vector).Normalized() * maximum_distance;
            }
            this.telekinesis_marker_pfx = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_rubick/rubick_telekinesis_marker.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster, caster.GetTeam());
            ParticleManager.SetParticleControl(this.telekinesis_marker_pfx, 0, target_loc);
            ParticleManager.SetParticleControl(this.telekinesis_marker_pfx, 1, Vector(3, 0, 0));
            ParticleManager.SetParticleControl(this.telekinesis_marker_pfx, 2, this.target_origin);
            ParticleManager.SetParticleControl(this.target_modifier.tele_pfx, 1, target_loc);
            this.target_modifier.final_loc = target_loc;
            this.target_modifier.changed_target = true;
            this.EndCooldown();
        } else {
            this.target = this.GetCursorTarget();
            this.target_origin = this.target.GetAbsOrigin();
            let duration;
            let is_ally = true;
            if (this.target.GetTeam() != caster.GetTeam()) {
                if (this.target.TriggerSpellAbsorb(this)) {
                    return undefined;
                }
                duration = this.GetSpecialValueFor("enemy_lift_duration") * (1 - this.target.GetStatusResistance());
                this.target.AddNewModifier(caster, this, "modifier_imba_telekinesis_stun", {
                    duration: duration
                });
                is_ally = false;
            } else {
                duration = this.GetSpecialValueFor("ally_lift_duration");
                this.target.AddNewModifier(caster, this, "modifier_imba_telekinesis_root", {
                    duration: duration
                });
            }
            this.target_modifier = this.target.AddNewModifier(caster, this, "modifier_imba_telekinesis", {
                duration: duration
            }) as modifier_imba_telekinesis;
            if (is_ally) {
                this.target_modifier.is_ally = true;
            }
            this.target_modifier.tele_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_rubick/rubick_telekinesis.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster);
            ParticleManager.SetParticleControlEnt(this.target_modifier.tele_pfx, 0, this.target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.target.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(this.target_modifier.tele_pfx, 1, this.target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.target.GetAbsOrigin(), true);
            ParticleManager.SetParticleControl(this.target_modifier.tele_pfx, 2, Vector(duration, 0, 0));
            this.target_modifier.AddParticle(this.target_modifier.tele_pfx, false, false, 1, false, false);
            caster.EmitSound("Hero_Rubick.Telekinesis.Cast");
            this.target.EmitSound("Hero_Rubick.Telekinesis.Target");
            this.target_modifier.final_loc = this.target_origin;
            this.target_modifier.changed_target = false;
            caster.AddNewModifier(caster, this, "modifier_imba_telekinesis_caster", {
                duration: duration + FrameTime()
            });
            this.EndCooldown();
        }
    }
    GetAbilityTextureName(): string {
        if (this.GetCasterPlus().HasModifier("modifier_imba_telekinesis_caster")) {
            return "rubick_telekinesis_land";
        }
        return "rubick_telekinesis";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasModifier("modifier_imba_telekinesis_caster")) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT;
        }
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET;
    }
    GetManaCost(target: number): number {
        if (this.GetCasterPlus().HasModifier("modifier_imba_telekinesis_caster")) {
            return 0;
        } else {
            return super.GetManaCost(target);
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (this.GetCasterPlus().HasModifier("modifier_imba_telekinesis_caster")) {
            return 25000;
        }
        return this.GetSpecialValueFor("cast_range");
    }
}
@registerModifier()
export class modifier_imba_telekinesis_caster extends BaseModifier_Plus {
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
    BeDestroy(): void {
        let ability = this.GetAbilityPlus<imba_rubick_telekinesis>();
        if (ability.telekinesis_marker_pfx) {
            ParticleManager.DestroyParticle(ability.telekinesis_marker_pfx, false);
            ParticleManager.ReleaseParticleIndex(ability.telekinesis_marker_pfx);
        }
    }
}
@registerModifier()
export class modifier_imba_telekinesis extends BaseModifierMotionBoth_Plus {
    public parent: IBaseNpc_Plus;
    public z_height: any;
    public duration: number;
    public lift_animation: any;
    public fall_animation: any;
    public current_time: number;
    public transition_end_commenced: any;
    public distance: number;
    public changed_target: any;
    is_ally: boolean;
    tele_pfx: ParticleID;
    final_loc: Vector;
    IsDebuff(): boolean {
        if (this.GetParentPlus().GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
            return true;
        }
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
    IgnoreTenacity() {
        return true;
    }
    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.z_height = 0;
            this.duration = params.duration;
            this.lift_animation = ability.GetSpecialValueFor("lift_animation");
            this.fall_animation = ability.GetSpecialValueFor("fall_animation");
            this.current_time = 0;
            this.BeginMotionOrDestroy();
        }
    }

    EndTransition() {
        if (IsServer()) {
            if (this.transition_end_commenced) {
                return;
            }
            this.transition_end_commenced = true;
            let caster = this.GetCasterPlus();
            let parent = this.GetParentPlus();
            let ability = this.GetAbilityPlus();
            parent.SetUnitOnClearGround();
            parent.RemoveModifierByName("modifier_imba_telekinesis_stun");
            parent.RemoveModifierByName("modifier_imba_telekinesis_root");
            let parent_pos = parent.GetAbsOrigin();
            let impact_radius = ability.GetSpecialValueFor("impact_radius");
            GridNav.DestroyTreesAroundPoint(parent_pos, impact_radius, true);
            let damage = ability.GetSpecialValueFor("damage");
            let impact_stun_duration = ability.GetSpecialValueFor("impact_stun_duration");
            let cooldown;
            if (this.is_ally) {
                cooldown = ability.GetSpecialValueFor("ally_cooldown");
            } else {
                cooldown = ability.GetCooldown(ability.GetLevel());
            }
            cooldown = (cooldown - caster.GetTalentValue("special_bonus_unique_rubick_4")) - this.GetDuration();
            parent.StopSound("Hero_Rubick.Telekinesis.Target");
            parent.EmitSound("Hero_Rubick.Telekinesis.Target.Land");
            ParticleManager.ReleaseParticleIndex(this.tele_pfx);
            let landing_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_rubick/rubick_telekinesis_land.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.GetCasterPlus());
            ParticleManager.SetParticleControl(landing_pfx, 0, parent_pos);
            ParticleManager.SetParticleControl(landing_pfx, 1, parent_pos);
            ParticleManager.ReleaseParticleIndex(landing_pfx);
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), parent_pos, undefined, impact_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (enemy != parent) {
                    enemy.AddNewModifier(caster, ability, "modifier_stunned", {
                        duration: impact_stun_duration * (1 - enemy.GetStatusResistance())
                    });
                }
                ApplyDamage({
                    attacker: caster,
                    victim: enemy,
                    ability: ability,
                    damage: damage,
                    damage_type: ability.GetAbilityDamageType()
                });
            }
            if (GameFunc.GetCount(enemies) > 0 && this.is_ally) {
                parent.EmitSound("Hero_Rubick.Telekinesis.Target.Stun");
            } else if (GameFunc.GetCount(enemies) > 1 && !this.is_ally) {
                parent.EmitSound("Hero_Rubick.Telekinesis.Target.Stun");
            }
            ability.StartCooldown(cooldown);
        }
    }
    UpdateVerticalMotion(unit: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            this.current_time = this.current_time + dt;
            let max_height = this.GetSpecialValueFor("max_height");
            if (this.current_time <= this.lift_animation) {
                this.z_height = this.z_height + ((dt / this.lift_animation) * max_height);
                unit.SetAbsOrigin(GetGroundPosition(unit.GetAbsOrigin(), unit) + Vector(0, 0, this.z_height) as Vector);
            } else if (this.current_time > (this.duration - this.fall_animation)) {
                this.z_height = this.z_height - ((dt / this.fall_animation) * max_height);
                if (this.z_height < 0) {
                    this.z_height = 0;
                }
                unit.SetAbsOrigin(GetGroundPosition(unit.GetAbsOrigin(), unit) + Vector(0, 0, this.z_height) as Vector);
            } else {
                max_height = this.z_height;
            }
            if (this.current_time >= this.duration) {
                this.EndTransition();
                this.Destroy();
            }
        }
    }
    UpdateHorizontalMotion(unit: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            this.distance = this.distance || 0;
            if ((this.current_time > (this.duration - this.fall_animation))) {
                if (this.changed_target) {
                    let frames_to_end = math.ceil((this.duration - this.current_time) / dt);
                    this.distance = (unit.GetAbsOrigin() - this.final_loc as Vector).Length2D() / frames_to_end;
                    this.changed_target = false;
                }
                if ((this.current_time + dt) >= this.duration) {
                    unit.SetAbsOrigin(this.final_loc);
                    this.EndTransition();
                } else {
                    unit.SetAbsOrigin(unit.GetAbsOrigin() + ((this.final_loc - unit.GetAbsOrigin() as Vector).Normalized() * this.distance) as Vector);
                }
            }
        }
    }
    GetTexture(): string {
        return "rubick_telekinesis";
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (!this.parent.IsAlive()) {
                this.parent.SetUnitOnClearGround();
            }
        }
    }
}
@registerModifier()
export class modifier_imba_telekinesis_stun extends BaseModifier_Plus {
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
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuns = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        }
        return Object.values(decFuns);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_FLAIL;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }
}
@registerModifier()
export class modifier_imba_telekinesis_root extends BaseModifier_Plus {
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
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
        return state;
    }
}
@registerAbility()
export class imba_rubick_spell_steal_controller extends BaseAbility_Plus {
    IsInnateAbility() {
        return true;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_rubick_spell_steal_controller";
    }
}
@registerModifier()
export class modifier_imba_rubick_spell_steal_controller extends BaseModifier_Plus {
    public talent_ability: IBaseAbility_Plus[];
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
        if (!IsServer()) {
            return;
        }
        this.talent_ability = []
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(keys: ModifierAbilityEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.unit != this.GetParentPlus()) {
            return;
        }
        let rubick = keys.unit;
        let ability = keys.ability;
        if (ability.GetAbilityName() != "rubick_spell_steal") {
            return;
        }
        let target = keys.target;
        for (const [_, ex_talent] of GameFunc.iPair(this.talent_ability)) {
            if (!ex_talent.IsNull()) {
                rubick.RemoveAbility(ex_talent.GetAbilityName());
            }
        }
        for (let i = 0; i <= 23; i++) {
            let talent = target.GetAbilityByIndex(i);
            if (talent != undefined) {
                let name = talent.GetAbilityName();
                if (string.find(name, "special_bonus_")) {
                    if (talent.GetLevel() > 0) {
                        rubick.AddAbility(name);
                        this.talent_ability.push(rubick.FindAbilityByName(name) as IBaseAbility_Plus);
                    }
                }
            }
        }
        for (let i = 0; i <= 23; i++) {
            let talent = rubick.GetAbilityByIndex(i);
            if (talent != undefined) {
                let name = talent.GetAbilityName();
                if (string.find(name, "special_bonus_")) {
                    for (const [_, ex_talent] of GameFunc.iPair(this.talent_ability)) {
                        if (!ex_talent.IsNull() && talent == ex_talent) {
                            ex_talent.SetLevel(1);
                        }
                    }
                }
            }
        }
    }
}
