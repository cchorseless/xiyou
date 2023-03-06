
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_generic_knockback_lua } from "../../modifier/generic/modifier_generic_knockback_lua";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_snapfire_scatterblast extends BaseAbility_Plus {
    public effect_cast: any;
    public first_target: any;
    custom_indicator: any
    GetIntrinsicModifierName(): string {
        return "modifier_generic_custom_indicator";
    }
    CastFilterResultLocation(vLoc: Vector): UnitFilterResult {
        if (IsClient()) {
            if (this.custom_indicator) {
                this.custom_indicator.Register(vLoc);
            }
        }
        return UnitFilterResult.UF_SUCCESS;
    }
    CreateCustomIndicator() {
        let particle_cast = "particles/units/heroes/hero_snapfire/hero_snapfire_shotgun_range_finder_aoe.vpcf";
        this.effect_cast = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
    }
    UpdateCustomIndicator(loc: Vector) {
        let origin = this.GetCasterPlus().GetAbsOrigin();
        let point_blank = this.GetSpecialValueFor("point_blank_range");
        let direction = loc - origin as Vector;
        direction.z = 0;
        direction = direction.Normalized();
        ParticleManager.SetParticleControl(this.effect_cast, 0, origin);
        ParticleManager.SetParticleControl(this.effect_cast, 1, origin + direction * (this.GetCastRange(loc, undefined) + 200) as Vector);
        ParticleManager.SetParticleControl(this.effect_cast, 6, origin + direction * point_blank as Vector);
    }
    DestroyCustomIndicator() {
        ParticleManager.DestroyParticle(this.effect_cast, false);
        ParticleManager.ReleaseParticleIndex(this.effect_cast);
    }
    OnAbilityPhaseStart(): boolean {
        let sound_cast = "Hero_Snapfire.Shotgun.Load";
        EmitSoundOn(sound_cast, this.GetCasterPlus());
        return true;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let point = this.GetCursorPosition();
        let origin = caster.GetOrigin();
        this.first_target = undefined;
        let projectile_name = "particles/units/heroes/hero_snapfire/hero_snapfire_shotgun.vpcf";
        let projectile_distance = this.GetCastRange(point, undefined);
        let projectile_start_radius = this.GetSpecialValueFor("blast_width_initial") / 2;
        let projectile_end_radius = this.GetSpecialValueFor("blast_width_end") / 2;
        let projectile_speed = this.GetSpecialValueFor("blast_speed");
        let projectile_direction = point - origin as Vector;
        projectile_direction.z = 0;
        projectile_direction = projectile_direction.Normalized();
        let info = {
            Source: caster,
            Ability: this,
            vSpawnOrigin: caster.GetAbsOrigin(),
            bDeleteOnHit: false,
            iUnitTargetTeam: this.GetAbilityTargetTeam(),
            iUnitTargetFlags: this.GetAbilityTargetFlags(),
            iUnitTargetType: this.GetAbilityTargetType(),
            EffectName: projectile_name,
            fDistance: projectile_distance,
            fStartRadius: projectile_start_radius,
            fEndRadius: projectile_end_radius,
            vVelocity: projectile_direction * projectile_speed as Vector,
            bProvidesVision: false,
            ExtraData: {
                pos_x: origin.x,
                pos_y: origin.y
            }
        }
        ProjectileManager.CreateLinearProjectile(info);
        let sound_cast = "Hero_Snapfire.Shotgun.Fire";
        EmitSoundOn(sound_cast, caster);
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, loc: Vector, extraData: any): boolean | void {
        if (!target) {
            return;
        }
        let caster = this.GetCasterPlus();
        let location = target.GetOrigin();
        let point_blank_range = this.GetSpecialValueFor("point_blank_range");
        let point_blank_mult = this.GetSpecialValueFor("point_blank_dmg_bonus_pct") / 100;
        let damage = this.GetSpecialValueFor("damage") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_snapfire_7");
        let slow = this.GetSpecialValueFor("slow_duration");
        let modifier_name = "modifier_imba_snapfire_scatterblast_slow";
        let origin = Vector(extraData.pos_x, extraData.pos_y, 0);
        let length = (location - origin as Vector).Length2D();
        let point_blank = (length <= point_blank_range);
        if (point_blank) {
            damage = damage + point_blank_mult * damage;
            modifier_name = "modifier_stunned";
        }
        let damageTable = {
            victim: target,
            attacker: caster,
            damage: damage,
            damage_type: this.GetAbilityDamageType(),
            ability: this
        }
        ApplyDamage(damageTable);
        target.AddNewModifier(caster, this, modifier_name, {
            duration: slow
        });
        if (!this.first_target) {
            this.first_target = true;
            let debuff_modifier = "modifier_disarmed";
            if (RollPercentage(50)) {
                debuff_modifier = "modifier_imba_snapfire_scatterblast_silence";
            }
            target.AddNewModifier(caster, this, debuff_modifier, {
                duration: this.GetSpecialValueFor("debuff_duration")
            });
        }
        this.PlayEffects(target, point_blank);
    }
    PlayEffects(target: IBaseNpc_Plus, point_blank = false) {
        let particle_cast = "particles/units/heroes/hero_snapfire/hero_snapfire_shotgun_impact.vpcf";
        let particle_cast2 = "particles/units/heroes/hero_snapfire/hero_snapfire_shells_impact.vpcf";
        let particle_cast3 = "particles/units/heroes/hero_snapfire/hero_snapfire_shotgun_pointblank_impact_sparks.vpcf";
        let sound_target = "Hero_Snapfire.Shotgun.Target";
        let effect_cast = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
        ParticleManager.ReleaseParticleIndex(effect_cast);
        if (point_blank) {
            let effect_cast = ResHelper.CreateParticleEx(particle_cast2, ParticleAttachment_t.PATTACH_POINT_FOLLOW, target);
            ParticleManager.SetParticleControlEnt(effect_cast, 3, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", Vector(0, 0, 0), true);
            ParticleManager.ReleaseParticleIndex(effect_cast);
            effect_cast = ResHelper.CreateParticleEx(particle_cast3, ParticleAttachment_t.PATTACH_POINT_FOLLOW, target);
            ParticleManager.SetParticleControlEnt(effect_cast, 4, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", Vector(0, 0, 0), true);
            ParticleManager.ReleaseParticleIndex(effect_cast);
        }
        EmitSoundOn(sound_target, target);
    }
}
@registerModifier()
export class modifier_imba_snapfire_scatterblast_slow extends BaseModifier_Plus {
    public slow: any;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(kv: any): void {
        this.slow = -this.GetSpecialValueFor("movement_slow_pct");
    }
    BeRefresh(kv: any): void {
        this.slow = -this.GetSpecialValueFor("movement_slow_pct");
    }
    OnRemoved(): void {
    }
    BeDestroy(): void {
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.slow;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_snapfire/hero_snapfire_shotgun_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_snapfire_slow.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_NORMAL;
    }
}
@registerModifier()
export class modifier_imba_snapfire_scatterblast_silence extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let funcs = {
            [modifierstate.MODIFIER_STATE_SILENCED]: true
        }
        return funcs;
    }
}
@registerAbility()
export class imba_snapfire_firesnap_cookie extends BaseAbility_Plus {
    public toggle_state: any;
    GetCastPoint(): number {
        if (IsServer() && this.GetCursorTarget() == this.GetCasterPlus()) {
            return this.GetSpecialValueFor("self_cast_delay");
        }
        return 0.2;
    }
    CastFilterResultTarget(hTarget: CDOTA_BaseNPC): UnitFilterResult {
        if (IsServer() && hTarget.IsChanneling()) {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        }
        let nResult = UnitFilter(hTarget, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, 0, this.GetCasterPlus().GetTeamNumber());
        if (nResult != UnitFilterResult.UF_SUCCESS) {
            return nResult;
        }
        return UnitFilterResult.UF_SUCCESS;
    }
    GetCustomCastErrorTarget(hTarget: CDOTA_BaseNPC): string {
        if (IsServer() && hTarget.IsChanneling()) {
            return "#dota_hud_error_is_channeling";
        }
        return "";
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return super.GetCastRange(location, target);
    }
    OnAbilityPhaseInterrupted(): void {
    }
    OnAbilityPhaseStart(): boolean {
        if (this.GetCursorTarget() == this.GetCasterPlus()) {
            this.PlayEffects1();
        }
        this.toggle_state = this.GetAutoCastState();
        return true;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target = this.GetCursorTarget();
        let projectile_name = "particles/units/heroes/hero_snapfire/hero_snapfire_cookie_projectile.vpcf";
        let projectile_speed = this.GetSpecialValueFor("projectile_speed");
        if (caster.GetTeam() != target.GetTeam()) {
            projectile_name = "particles/units/heroes/hero_snapfire/hero_snapfire_cookie_enemy_projectile.vpcf";
        }
        let info = {
            Target: target,
            Source: caster,
            Ability: this,
            EffectName: projectile_name,
            iMoveSpeed: projectile_speed,
            bDodgeable: false
        }
        ProjectileManager.CreateTrackingProjectile(info);
        let sound_cast = "Hero_Snapfire.FeedCookie.Cast";
        EmitSoundOn(sound_cast, this.GetCasterPlus());
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (!target) {
            return;
        }
        if (target.IsChanneling() || target.IsOutOfGame()) {
            return;
        }
        if (target.GetTeam() != this.GetCasterPlus().GetTeam()) {
            if (target.TriggerSpellAbsorb(this)) {
                return undefined;
            }
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_unique_snapfire_5")) {
            if (target.GetTeam() == this.GetCasterPlus().GetTeam()) {
                target.Heal(this.GetCasterPlus().GetTalentValue("special_bonus_unique_snapfire_5"), this);
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, target, this.GetCasterPlus().GetTalentValue("special_bonus_unique_snapfire_5"), undefined);
            }
        }
        let duration = this.GetSpecialValueFor("jump_duration");
        let height = this.GetSpecialValueFor("jump_height");
        let distance = this.GetSpecialValueFor("jump_horizontal_distance");
        let stun = this.GetSpecialValueFor("impact_stun_duration");
        let damage = this.GetSpecialValueFor("impact_damage");
        let radius = this.GetSpecialValueFor("impact_radius");
        if (this.toggle_state) {
            distance = distance + distance * this.GetSpecialValueFor("auto_cast_range_increase") / 100;
        }
        let effect_cast = this.PlayEffects2(target);
        let knockback = target.AddNewModifier(this.GetCasterPlus(), this, "modifier_generic_knockback_lua", {
            distance: distance,
            height: height,
            duration: duration,
            direction_x: target.GetForwardVector().x,
            direction_y: target.GetForwardVector().y,
            IsStun: true
        }) as modifier_generic_knockback_lua;

        knockback.SetEndCallback(GHandler.create(this, () => {
            let damageTable: ApplyDamageOptions = {
                attacker: this.GetCasterPlus(),
                damage: damage,
                damage_type: this.GetAbilityDamageType(),
                ability: this,
                victim: null,
            }
            let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), target.GetOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                damageTable.victim = enemy;
                ApplyDamage(damageTable);
                if (!this.toggle_state) {
                    enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_stunned", {
                        duration: stun
                    });
                }
            }
            GridNav.DestroyTreesAroundPoint(target.GetOrigin(), radius, true);
            ParticleManager.DestroyParticle(effect_cast, false);
            ParticleManager.ReleaseParticleIndex(effect_cast);
            this.PlayEffects3(target, radius);
        }));
    }
    PlayEffects1() {
        let particle_cast = "particles/units/heroes/hero_snapfire/hero_snapfire_cookie_selfcast.vpcf";
        let effect_cast = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        ParticleManager.ReleaseParticleIndex(effect_cast);
    }
    PlayEffects2(target: IBaseNpc_Plus) {
        let particle_cast = "particles/units/heroes/hero_snapfire/hero_snapfire_cookie_buff.vpcf";
        let particle_cast2 = "particles/units/heroes/hero_snapfire/hero_snapfire_cookie_receive.vpcf";
        let sound_target = "Hero_Snapfire.FeedCookie.Consume";
        let effect_cast = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
        ParticleManager.ReleaseParticleIndex(effect_cast);
        effect_cast = ResHelper.CreateParticleEx(particle_cast2, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
        EmitSoundOn(sound_target, target);
        return effect_cast;
    }
    PlayEffects3(target: IBaseNpc_Plus, radius: number) {
        let particle_cast = "particles/units/heroes/hero_snapfire/hero_snapfire_cookie_landing.vpcf";
        let sound_location = "Hero_Snapfire.FeedCookie.Impact";
        let effect_cast = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_WORLDORIGIN, target);
        ParticleManager.SetParticleControl(effect_cast, 0, target.GetOrigin());
        ParticleManager.SetParticleControl(effect_cast, 1, Vector(radius, radius, radius));
        ParticleManager.ReleaseParticleIndex(effect_cast);
        EmitSoundOn(sound_location, target);
    }
}
@registerAbility()
export class imba_snapfire_lil_shredder extends BaseAbility_Plus {
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let duration = this.GetDuration();
        caster.AddNewModifier(caster, this, "modifier_imba_snapfire_lil_shredder", {
            duration: duration
        });
    }
}
@registerModifier()
export class modifier_imba_snapfire_lil_shredder extends BaseModifier_Plus {
    public attacks: any;
    public damage: number;
    public as_bonus: number;
    public range_bonus: number;
    public bat: any;
    public slow: any;
    public damage_per_stack: number;
    public toggle_state: any;
    public records: any;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(kv: any): void {
        this.attacks = this.GetSpecialValueFor("buffed_attacks");
        this.damage = this.GetSpecialValueFor("damage");
        this.as_bonus = this.GetSpecialValueFor("attack_speed_bonus");
        this.range_bonus = this.GetSpecialValueFor("attack_range_bonus");
        this.bat = this.GetSpecialValueFor("base_attack_time");
        this.slow = this.GetSpecialValueFor("slow_duration");
        this.damage_per_stack = this.GetSpecialValueFor("damage_per_stack");
        if (this.GetCasterPlus().HasTalent("special_bonus_unique_snapfire_6")) {
            this.damage = this.GetCasterPlus().GetAverageTrueAttackDamage(undefined);
        }
        if (!IsServer()) {
            return;
        }
        this.toggle_state = this.GetAbilityPlus().GetAutoCastState();
        if (this.toggle_state) {
            this.SetStackCount(1);
            this.damage = this.damage * this.GetSpecialValueFor("buffed_attacks");
        } else {
            this.SetStackCount(this.attacks);
        }
        this.records = {}
        this.PlayEffects();
        let sound_cast = "Hero_Snapfire.ExplosiveShells.Cast";
        EmitSoundOn(sound_cast, this.GetParentPlus());
    }
    BeRefresh(kv: any): void {
        this.attacks = this.GetSpecialValueFor("buffed_attacks");
        this.damage = this.GetSpecialValueFor("damage");
        this.as_bonus = this.GetSpecialValueFor("attack_speed_bonus");
        this.range_bonus = this.GetSpecialValueFor("attack_range_bonus");
        this.bat = this.GetSpecialValueFor("base_attack_time");
        this.damage_per_stack = this.GetSpecialValueFor("damage_per_stack");
        this.slow = this.GetSpecialValueFor("slow_duration");
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(this.attacks);
        let sound_cast = "Hero_Snapfire.ExplosiveShells.Cast";
        EmitSoundOn(sound_cast, this.GetParentPlus());
    }
    OnRemoved(): void {
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        let sound_cast = "Hero_Snapfire.ExplosiveShells.Cast";
        StopSoundOn(sound_cast, this.GetParentPlus());
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            3: Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY,
            4: GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_NAME,
            5: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ATTACK_DAMAGE,
            6: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS,
            7: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            8: GPropertyConfig.EMODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(params: ModifierAttackEvent): void {
        if (params.attacker != this.GetParentPlus()) {
            return;
        }
        if (this.GetStackCount() <= 0) {
            return;
        }
        this.records[params.record] = true;
        let sound_cast = "Hero_Snapfire.ExplosiveShellsBuff.Attack";
        EmitSoundOn(sound_cast, this.GetParentPlus());
        if (this.GetStackCount() > 0) {
            this.DecrementStackCount();
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        if (this.records[params.record]) {
            params.target.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_snapfire_lil_shredder_debuff", {
                duration: this.slow
            });
        }
        let sound_cast = "Hero_Snapfire.ExplosiveShellsBuff.Target";
        EmitSoundOn(sound_cast, params.target);
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY)
    CC_OnAttackRecordDestroy(params: ModifierAttackEvent): void {
        if (this.records[params.record]) {
            this.records[params.record] = undefined;
            if (next(this.records) == undefined && this.GetStackCount() <= 0) {
                this.Destroy();
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_NAME)
    CC_GetModifierProjectileName(): string {
        if (this.GetStackCount() <= 0) {
            return;
        }
        return "particles/units/heroes/hero_snapfire/hero_snapfire_shells_projectile.vpcf";
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ATTACK_DAMAGE)
    CC_GetModifierOverrideAttackDamage(keys?: any/** keys */): number {
        if (this.GetStackCount() <= 0) {
            return;
        }
        if (!IsServer()) {
            return;
        }
        if (!keys) {
            return;

        }
        let target = keys.target;
        let bonus_damage = 0;
        if (target.IsBuilding() || target.IsOther() || target.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            return;
        }
        let fury_shredder_handle = target.findBuff("modifier_imba_snapfire_lil_shredder_debuff");
        if (fury_shredder_handle) {
            let fury_shredder_stacks = fury_shredder_handle.GetStackCount();
            bonus_damage = this.damage_per_stack * fury_shredder_stacks;
        }
        return this.damage + bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        if (this.GetStackCount() <= 0) {
            return;
        }
        return this.range_bonus;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (this.GetStackCount() <= 0) {
            return;
        }
        return this.as_bonus;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT)
    CC_GetModifierBaseAttackTimeConstant(): number {
        if (this.GetStackCount() <= 0) {
            return;
        }
        return this.bat;
    }
    PlayEffects() {
        let particle_cast = "particles/units/heroes/hero_snapfire/hero_snapfire_shells_buff.vpcf";
        let effect_cast = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(effect_cast, 3, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", Vector(0, 0, 0), true);
        ParticleManager.SetParticleControlEnt(effect_cast, 4, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", Vector(0, 0, 0), true);
        ParticleManager.SetParticleControlEnt(effect_cast, 5, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", Vector(0, 0, 0), true);
        this.AddParticle(effect_cast, false, false, -1, false, false);
    }
}
@registerModifier()
export class modifier_imba_snapfire_lil_shredder_debuff extends BaseModifier_Plus {
    public slow: any;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(kv: any): void {
        this.slow = -this.GetSpecialValueFor("attack_speed_slow_per_stack");
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(1);
    }
    BeRefresh(kv: any): void {
        if (!IsServer()) {
            return;
        }
        this.IncrementStackCount();
    }
    OnRemoved(): void {
    }
    BeDestroy(): void {
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.slow * this.GetStackCount();
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_sniper/sniper_headshot_slow.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
}
@registerAbility()
export class imba_snapfire_mortimer_kisses extends BaseAbility_Plus {
    GetAOERadius(): number {
        return this.GetSpecialValueFor("impact_radius");
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let point = this.GetCursorPosition();
        let duration = this.GetDuration();
        caster.AddNewModifier(caster, this, "modifier_imba_snapfire_mortimer_kisses", {
            duration: duration,
            pos_x: point.x,
            pos_y: point.y
        });
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (!target) {
            return;
        }
        let damage = this.GetSpecialValueFor("damage_per_impact");
        let duration = this.GetSpecialValueFor("burn_ground_duration");
        let impact_radius = this.GetSpecialValueFor("impact_radius");
        if (target.TempData().secondary) {
            impact_radius = this.GetSpecialValueFor("rings_radius");
        }
        let vision = this.GetSpecialValueFor("projectile_vision");
        let damageTable: ApplyDamageOptions = {
            attacker: this.GetCasterPlus(),
            damage: damage,
            damage_type: this.GetAbilityDamageType(),
            ability: this,
            victim: null,
        }
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), location, undefined, impact_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            damageTable.victim = enemy;
            ApplyDamage(damageTable);
        }
        let mod = target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_snapfire_mortimer_kisses_thinker", {
            duration: duration,
            slow: 1
        });
        GridNav.DestroyTreesAroundPoint(location, impact_radius, true);
        AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), location, vision, duration, false);
        this.PlayEffects(location);
        if (target.TempData().secondary) {
            return;
        }
        if (target.TempData().mega_blob) {
            let forward = target.GetForwardVector();
            let blob_rings_count = this.GetSpecialValueFor("blob_rings_count");
            let rings_distance = this.GetSpecialValueFor("rings_distance");
            let angle_diff = 360 / blob_rings_count;
            for (let i = 0; i < blob_rings_count; i++) {
                let blob_pos = RotatePosition(location, QAngle(0, angle_diff * i, 0), location + (forward * rings_distance) as Vector);
                let target_pos = GetGroundPosition(blob_pos, undefined);
                let travel_time = this.GetSpecialValueFor("rings_delay");
                let thinker = CreateModifierThinker(this.GetCasterPlus(), this, "modifier_imba_snapfire_mortimer_kisses_thinker", {
                    travel_time: travel_time
                }, target_pos, this.GetCasterPlus().GetTeamNumber(), false);
                thinker.TempData().secondary = true;
                let min_range = this.GetSpecialValueFor("min_range");
                let max_range = this.GetCastRange(Vector(0, 0, 0), undefined);
                let vec = (location - target_pos as Vector).Length2D();
                let info = {
                    Target: thinker,
                    Source: target,
                    Ability: this,
                    iMoveSpeed: vec / travel_time,
                    EffectName: "particles/units/heroes/hero_snapfire/snapfire_lizard_blobs_arced.vpcf",
                    bDodgeable: false,
                    vSourceLoc: location,
                    bDrawsOnMinimap: false,
                    bVisibleToEnemies: true,
                    bProvidesVision: true,
                    iVisionRadius: this.GetSpecialValueFor("projectile_vision"),
                    iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber()
                }
                ProjectileManager.CreateTrackingProjectile(info);
                AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), thinker.GetOrigin(), 100, 1, false);
                EmitSoundOn("Hero_Snapfire.MortimerBlob.Launch", target);
            }
        }
    }
    PlayEffects(loc: Vector) {
        let particle_cast = "particles/units/heroes/hero_snapfire/hero_snapfire_ultimate_impact.vpcf";
        let particle_cast2 = "particles/units/heroes/hero_snapfire/hero_snapfire_ultimate_linger.vpcf";
        let sound_cast = "Hero_Snapfire.MortimerBlob.Impact";
        let effect_cast = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(effect_cast, 3, loc);
        ParticleManager.ReleaseParticleIndex(effect_cast);
        effect_cast = ResHelper.CreateParticleEx(particle_cast2, ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(effect_cast, 0, loc);
        ParticleManager.SetParticleControl(effect_cast, 1, loc);
        ParticleManager.ReleaseParticleIndex(effect_cast);
        let sound_location = "Hero_Snapfire.MortimerBlob.Impact";
        EmitSoundOnLocationWithCaster(loc, sound_location, this.GetCasterPlus());
    }
}
@registerModifier()
export class modifier_imba_snapfire_mortimer_kisses extends BaseModifier_Plus {
    public min_range: number;
    public max_range: number;
    public range: number;
    public min_travel: any;
    public max_travel: any;
    public travel_range: number;
    public turn_rate: any;
    public blob_count: number;
    public info: any;
    public target: Vector;
    public vector: any;
    public travel_time: number;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
        this.min_range = this.GetSpecialValueFor("min_range");
        this.max_range = this.GetAbilityPlus().GetCastRange(Vector(0, 0, 0), undefined);
        this.range = this.max_range - this.min_range;
        this.min_travel = this.GetSpecialValueFor("min_lob_travel_time");
        this.max_travel = this.GetSpecialValueFor("max_lob_travel_time");
        this.travel_range = this.max_travel - this.min_travel;
        let projectile_vision = this.GetSpecialValueFor("projectile_vision");
        this.turn_rate = this.GetSpecialValueFor("turn_rate");
        this.blob_count = 0;
        if (!IsServer()) {
            return;
        }
        let projectile_speed = this.GetSpecialValueFor("projectile_speed") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_snapfire_1");
        let projectile_count = this.GetSpecialValueFor("projectile_count") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_snapfire_1");
        let interval = this.GetAbilityPlus().GetDuration() / projectile_count + 0.01;
        this.SetValidTarget(Vector(kv.pos_x, kv.pos_y, 0));
        let projectile_start_radius = 0;
        let projectile_end_radius = 0;
        this.info = {
            Source: this.GetCasterPlus(),
            Ability: this.GetAbilityPlus(),
            EffectName: "particles/units/heroes/hero_snapfire/snapfire_lizard_blobs_arced.vpcf",
            iMoveSpeed: projectile_speed,
            bDodgeable: false,
            vSourceLoc: this.GetCasterPlus().GetOrigin(),
            bDrawsOnMinimap: false,
            bVisibleToEnemies: true,
            bProvidesVision: true,
            iVisionRadius: projectile_vision,
            iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber()
        }
        this.StartIntervalThink(interval);
        this.OnIntervalThink();
    }
    BeRefresh(kv: any): void {
    }

    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_ORDER,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_LIMIT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(params: ModifierAbilityEvent): void {
        if (params.unit != this.GetParentPlus()) {
            return;
        }
        if (params.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION) {
            this.SetValidTarget(params.new_pos);
        } else if (params.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET || params.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET) {
            this.SetValidTarget(params.target.GetOrigin());
        } else if (params.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_STOP || params.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_HOLD_POSITION) {
            this.Destroy();
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_LIMIT)
    CC_GetModifierMoveSpeed_Limit(): number {
        return 0.1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE)
    CC_GetModifierTurnRate_Percentage(): number {
        return -this.turn_rate;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        }
        return state;
    }
    OnIntervalThink(): void {
        this.CreateBlob();
    }
    CreateBlob(kv?: any) {
        if (!kv) {
            kv = {}
        }
        let travel_time = this.travel_time;
        let target_pos = this.target;
        if (kv.pos) {
            target_pos = GetGroundPosition(this.target + kv.pos, undefined);
        }
        if (kv.travel_time) {
            travel_time = kv.travel_time;
        }
        let thinker = CreateModifierThinker(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_snapfire_mortimer_kisses_thinker", {
            travel_time: travel_time
        }, target_pos, this.GetParentPlus().GetTeamNumber(), false);
        this.blob_count = this.blob_count + 1;
        if (this.blob_count == this.GetSpecialValueFor("mini_blob_counter")) {
            this.blob_count = 0;
            thinker.TempData().mega_blob = true;
        }
        this.info.iMoveSpeed = this.vector.Length2D() / travel_time;
        this.info.Target = thinker;
        ProjectileManager.CreateTrackingProjectile(this.info);
        AddFOWViewer(this.GetParentPlus().GetTeamNumber(), thinker.GetOrigin(), 100, 1, false);
        EmitSoundOn("Hero_Snapfire.MortimerBlob.Launch", this.GetParentPlus());
    }
    SetValidTarget(location: Vector) {
        let origin = this.GetParentPlus().GetOrigin();
        let vec = location - origin as Vector;
        let direction = vec;
        direction.z = 0;
        direction = direction.Normalized();
        if (vec.Length2D() < this.min_range) {
            vec = direction * this.min_range as Vector;
        } else if (vec.Length2D() > this.max_range) {
            vec = direction * this.max_range as Vector;
        }
        this.target = GetGroundPosition(origin + vec as Vector, undefined);
        this.vector = vec;
        this.travel_time = (vec.Length2D() - this.min_range) / this.range * this.travel_range + this.min_travel;
    }
}
@registerModifier()
export class modifier_imba_snapfire_magma_burn_slow extends BaseModifier_Plus {
    public dps: any;
    public damageTable: ApplyDamageOptions;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(kv: any): void {
        this.dps = this.GetSpecialValueFor("burn_damage");
        let interval = this.GetSpecialValueFor("burn_interval");
        if (!IsServer()) {
            return;
        }
        let distance = (this.GetCasterPlus().GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).Length2D();
        let distance_travel = math.min(distance / 3000, 1);
        let min_slow = this.GetSpecialValueFor("min_slow_pct") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_snapfire_4");
        let max_slow = this.GetSpecialValueFor("max_slow_pct") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_snapfire_4");
        this.SetStackCount(math.max(max_slow * distance_travel, min_slow));
        this.damageTable = {
            victim: this.GetParentPlus(),
            attacker: this.GetCasterPlus(),
            damage: this.dps * interval,
            damage_type: this.GetAbilityPlus().GetAbilityDamageType(),
            ability: this.GetAbilityPlus()
        }
        this.StartIntervalThink(interval);
        this.OnIntervalThink();
    }
    BeRefresh(kv: any): void {
    }
    OnRemoved(): void {
    }
    BeDestroy(): void {
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetStackCount() * (-1);
    }
    OnIntervalThink(): void {
        ApplyDamage(this.damageTable);
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_snapfire/hero_snapfire_burn_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_snapfire_magma.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_NORMAL;
    }
}
@registerModifier()
export class modifier_imba_snapfire_mortimer_kisses_thinker extends BaseModifier_Plus {
    public max_travel: any;
    public radius: number;
    public linger: any;
    public start: any;
    public effect_cast: any;
    BeCreated(kv: any): void {
        this.max_travel = this.GetSpecialValueFor("max_lob_travel_time");
        this.radius = this.GetSpecialValueFor("impact_radius");
        this.linger = this.GetSpecialValueFor("burn_linger_duration");
        if (!IsServer()) {
            return;
        }
        this.start = false;
        this.PlayEffects(kv.travel_time);
    }
    BeRefresh(kv: any): void {
        this.max_travel = this.GetSpecialValueFor("max_lob_travel_time");
        this.radius = this.GetSpecialValueFor("impact_radius");
        this.linger = this.GetSpecialValueFor("burn_linger_duration");
        if (!IsServer()) {
            return;
        }
        this.start = true;
        this.StopEffects();
    }
    OnRemoved(): void {
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        UTIL_Remove(this.GetParentPlus());
    }
    IsAura(): boolean {
        return this.start;
    }
    GetModifierAura(): string {
        return "modifier_imba_snapfire_magma_burn_slow";
    }
    GetAuraRadius(): number {
        return this.radius;
    }
    GetAuraDuration(): number {
        return this.linger;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    PlayEffects(time: number) {
        let particle_cast = "particles/units/heroes/hero_snapfire/hero_snapfire_ultimate_calldown.vpcf";
        this.effect_cast = ParticleManager.CreateParticleForTeam(particle_cast, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.GetCasterPlus(), this.GetCasterPlus().GetTeamNumber());
        ParticleManager.SetParticleControl(this.effect_cast, 0, this.GetParentPlus().GetOrigin());
        ParticleManager.SetParticleControl(this.effect_cast, 1, Vector(this.radius, 0, -this.radius * (this.max_travel / time)));
        ParticleManager.SetParticleControl(this.effect_cast, 2, Vector(time, 0, 0));
    }
    StopEffects() {
        ParticleManager.DestroyParticle(this.effect_cast, true);
        ParticleManager.ReleaseParticleIndex(this.effect_cast);
    }
}
