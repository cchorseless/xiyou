
import { AI_ability } from "../../../ai/AI_ability";
import { GameFunc } from "../../../GameFunc";
import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { ProjectileHelper } from "../../../helper/ProjectileHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_phantom_assassin_stifling_dagger extends BaseAbility_Plus {
    public scepter_knives_interval: number;
    public cast_range: number;
    public playbackrate: any;
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target = this.GetCursorTarget();
        let scepter = caster.HasScepter();
        this.scepter_knives_interval = this.GetSpecialValueFor("scepter_knives_interval");
        this.cast_range = this.GetSpecialValueFor("cast_range") + GPropertyCalculate.GetCastRangeBonus(caster);
        this.playbackrate = 1 + this.scepter_knives_interval;
        let bonus_damage: number;
        if (caster.HasTalent("special_bonus_imba_phantom_assassin_1")) {
            bonus_damage = this.GetSpecialValueFor("bonus_damage") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_phantom_assassin_1");
        } else {
            bonus_damage = this.GetSpecialValueFor("bonus_damage");
        }
        let ability_crit = caster.findBuff<modifier_imba_coup_de_grace>("modifier_imba_coup_de_grace");
        let ps_coup_modifier = "modifier_imba_phantom_strike_coup_de_grace";
        StartSoundEvent("Hero_PhantomAssassin.Dagger.Cast", caster);
        let extra_data = {
            main_dagger: true
        }
        this.LaunchDagger(target, extra_data);
        if (scepter || caster.HasTalent("special_bonus_imba_phantom_assassin_3")) {
            let secondary_knives_thrown = 0;
            let scepter_dagger_count = 0;
            if (!scepter && caster.HasTalent("special_bonus_imba_phantom_assassin_3")) {
                scepter_dagger_count = this.GetCasterPlus().GetTalentValue("special_bonus_imba_phantom_assassin_3");
            } else if (scepter && caster.HasTalent("special_bonus_imba_phantom_assassin_3")) {
                scepter_dagger_count = this.GetSpecialValueFor("scepter_dagger_count") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_phantom_assassin_3");
            } else {
                scepter_dagger_count = this.GetSpecialValueFor("scepter_dagger_count");
            }
            extra_data = {
                main_dagger: false
            }
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, this.cast_range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FIND_UNITS_EVERYWHERE, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (enemy != target) {
                    this.LaunchDagger(enemy, extra_data);
                    secondary_knives_thrown = secondary_knives_thrown + 1;
                }
                if (secondary_knives_thrown >= scepter_dagger_count) {
                    return;
                }
            }
        }
    }
    LaunchDagger(enemy: IBaseNpc_Plus, extra_data: any) {
        if (enemy == undefined) {
            return;
        }
        let dagger_projectile = {
            EffectName: "particles/units/heroes/hero_phantom_assassin/phantom_assassin_stifling_dagger.vpcf",
            Dodgeable: true,
            Ability: this,
            ProvidesVision: true,
            VisionRadius: this.GetSpecialValueFor("dagger_vision"),
            bVisibleToEnemies: true,
            iMoveSpeed: this.GetSpecialValueFor("dagger_speed"),
            Source: this.GetCasterPlus(),
            iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber(),
            Target: enemy,
            iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_ATTACK_1,
            bReplaceExisting: false,
            ExtraData: extra_data
        }
        ProjectileManager.CreateTrackingProjectile(dagger_projectile);
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        let caster = this.GetCasterPlus();
        if (!target) {
            return false;
        }
        let responses = {
            "1": "phantom_assassin_phass_ability_stiflingdagger_01",
            "2": "phantom_assassin_phass_ability_stiflingdagger_02",
            "3": "phantom_assassin_phass_ability_stiflingdagger_03",
            "4": "phantom_assassin_phass_ability_stiflingdagger_04"
        }
        caster.EmitCasterSound(Object.values(responses), 20, ResHelper.EDOTA_CAST_SOUND.FLAG_NONE, 20, "stifling_dagger");
        if (target.GetTeamNumber() != caster.GetTeamNumber()) {
            if (target.TriggerSpellAbsorb(this)) {
                return false;
            }
        }
        if (!target.IsMagicImmune()) {
            target.AddNewModifier(caster, this, "modifier_imba_stifling_dagger_silence", {
                duration: this.GetSpecialValueFor("silence_duration") * (1 - target.GetStatusResistance())
            });
            target.AddNewModifier(caster, this, "modifier_imba_stifling_dagger_slow", {
                duration: this.GetSpecialValueFor("slow_duration") * (1 - target.GetStatusResistance())
            });
        }
        caster.AddNewModifier(caster, this, "modifier_imba_stifling_dagger_dmg_reduction", {});
        caster.AddNewModifier(caster, this, "modifier_imba_stifling_dagger_bonus_damage", {});
        if (caster.HasModifier("modifier_imba_phantom_strike_coup_de_grace")) {
            caster.SetModifierStackCount("modifier_imba_phantom_strike_coup_de_grace", caster, caster.findBuffStack("modifier_imba_phantom_strike_coup_de_grace", caster) + 1);
        }
        let initial_pos = caster.GetAbsOrigin();
        let target_pos = target.GetAbsOrigin();
        let offset = 100;
        let distance_vector = Vector(target_pos.x - initial_pos.x, target_pos.y - initial_pos.y, 0);
        distance_vector = distance_vector.Normalized();
        target_pos.x = target_pos.x - offset * distance_vector.x;
        target_pos.y = target_pos.y - offset * distance_vector.y;
        caster.SetAbsOrigin(target_pos);
        caster.PerformAttack(target, true, true, true, true, true, false, true);
        caster.SetAbsOrigin(initial_pos);
        caster.RemoveModifierByName("modifier_imba_stifling_dagger_bonus_damage");
        caster.RemoveModifierByName("modifier_imba_stifling_dagger_dmg_reduction");
        return true;
    }
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        return this.GetSpecialValueFor("cast_range");
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_stifling_dagger_slow extends BaseModifier_Plus {
    public pfx: any;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
    CC_GetModifierProvidesFOWVision(): 0 | 1 {
        return 1;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let dagger_vision = this.GetSpecialValueFor("dagger_vision");
            let duration = this.GetSpecialValueFor("slow_duration");
            this.pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_phantom_assassin/phantom_assassin_stifling_dagger_debuff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), caster);
            AddFOWViewer(caster.GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), dagger_vision, 3.34, false);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: modifierstate.MODIFIER_STATE_PROVIDES_VISION
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetSpecialValueFor("move_slow");
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.pfx) {
            ParticleManager.DestroyParticle(this.pfx, false);
            ParticleManager.ReleaseParticleIndex(this.pfx);
        }
    }
}
@registerModifier()
export class modifier_imba_stifling_dagger_silence extends BaseModifier_Plus {
    public stifling_dagger_modifier_silence_particle: ParticleID;
    BeCreated(p_0: any,): void {
        this.stifling_dagger_modifier_silence_particle = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_silenced.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetCasterPlus());
        ParticleManager.ReleaseParticleIndex(this.stifling_dagger_modifier_silence_particle);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_SILENCED]: true
        };
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_stifling_dagger_bonus_damage extends BaseModifier_Plus {
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.GetSpecialValueFor("bonus_damage");
    }
    IsBuff() {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_stifling_dagger_dmg_reduction extends BaseModifier_Plus {
    public damage_reduction: number;
    BeCreated(p_0: any,): void {
        this.damage_reduction = this.GetSpecialValueFor("damage_reduction");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFunc = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE
        }
        return Object.values(decFunc);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.damage_reduction * (-1);
    }
}
@registerAbility()
export class imba_phantom_assassin_phantom_strike extends BaseAbility_Plus {
    public caster: IBaseNpc_Plus;
    public target: IBaseNpc_Plus;
    public bonus_attack_speed: number;
    public buff_duration: number;
    public projectile_speed: number;
    public projectile_width: any;
    public attacks: any;
    public caster_pos: any;
    public target_pos: any;
    public direction: any;
    public distance: number;
    public blink_projectile: any;
    IsNetherWardStealable() {
        return false;
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let casterID = caster.GetPlayerID();
            let targetID = target.GetPlayerID();
            if (target == caster) {
                return UnitFilterResult.UF_FAIL_CUSTOM;
            }
            let nResult = UnitFilter(target, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber());
            return nResult;
        }
    }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        return "dota_hud_error_cant_cast_on_self";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.target = this.GetCursorTarget();
            this.bonus_attack_speed = this.GetSpecialValueFor("bonus_attack_speed");
            this.buff_duration = this.GetSpecialValueFor("buff_duration");
            this.projectile_speed = this.GetSpecialValueFor("projectile_speed");
            this.projectile_width = this.GetSpecialValueFor("projectile_width");
            this.attacks = this.GetSpecialValueFor("attacks");
            if (this.caster.HasTalent("special_bonus_imba_phantom_assassin_2")) {
                this.bonus_attack_speed = this.GetSpecialValueFor("bonus_attack_speed") + this.caster.GetTalentValue("special_bonus_imba_phantom_assassin_2");
            } else {
                this.bonus_attack_speed = this.GetSpecialValueFor("bonus_attack_speed");
            }
            this.caster_pos = this.caster.GetAbsOrigin();
            this.target_pos = this.target.GetAbsOrigin();
            this.direction = (this.target_pos - this.caster_pos as Vector).Normalized();
            this.distance = (this.target_pos - this.caster_pos as Vector).Length2D();
            if (this.target.GetTeamNumber() != this.caster.GetTeamNumber()) {
                if (this.target.TriggerSpellAbsorb(this)) {
                    return undefined;
                }
            }
            let blink_start_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_phantom_assassin/phantom_assassin_phantom_strike_start.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.caster, this.caster);
            ParticleManager.ReleaseParticleIndex(blink_start_pfx);
            this.blink_projectile = {
                Ability: this,
                vSpawnOrigin: this.caster_pos,
                fDistance: this.distance,
                fStartRadius: this.projectile_width,
                fEndRadius: this.projectile_width,
                Source: this.caster,
                bHasFrontalCone: false,
                bReplaceExisting: false,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP,
                bDeleteOnHit: false,
                vVelocity: Vector(this.direction.x, this.direction.y, 0) * this.projectile_speed,
                bProvidesVision: false
            }
            ProjectileManager.CreateLinearProjectile(this.blink_projectile);
            StartSoundEvent("Hero_PhantomAssassin.Strike.Start", this.GetCasterPlus());
            let distance = (this.target.GetAbsOrigin() - this.caster.GetAbsOrigin() as Vector).Length2D();
            let direction = (this.target.GetAbsOrigin() - this.caster.GetAbsOrigin() as Vector).Normalized();
            let blink_point = this.caster.GetAbsOrigin() + direction * (distance - 128) as Vector;
            this.caster.SetAbsOrigin(blink_point);
            this.AddTimer(FrameTime(), () => {
                FindClearSpaceForUnit(this.caster, blink_point, true);
            });
            this.caster.SetForwardVector(direction);
            ProjectileHelper.ProjectileDodgePlus(this.caster);
            let blink_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_phantom_assassin/phantom_assassin_phantom_strike_end.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.caster, this.caster);
            ParticleManager.ReleaseParticleIndex(blink_pfx);
            this.target.EmitSound("Hero_PhantomAssassin.Strike.End");
            if (this.target.GetTeamNumber() != this.caster.GetTeamNumber()) {
                this.caster.AddNewModifier(this.caster, this, "modifier_imba_phantom_strike", {
                    duration: this.buff_duration
                });
                this.caster.AddNewModifier(this.caster, this, "modifier_imba_phantom_strike_coup_de_grace", {
                    duration: this.buff_duration
                });
                let attacks_count = 0;
                if (this.caster.HasTalent("special_bonus_imba_phantom_assassin_6")) {
                    attacks_count = this.caster.GetTalentValue("special_bonus_imba_phantom_assassin_6") + 4;
                } else {
                    attacks_count = this.attacks;
                }
                this.caster.SetModifierStackCount("modifier_imba_phantom_strike_coup_de_grace", this.caster, attacks_count);
                this.caster.MoveToTargetToAttack(this.target);
            }
        }
    }
    OnProjectileHit(hTarget: CDOTA_BaseNPC | undefined, vLocation: Vector): boolean | void {
        if (hTarget && hTarget != this.target) {
            this.GetCasterPlus().PerformAttack(hTarget, true, true, true, true, false, false, false);
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
export class modifier_imba_phantom_strike extends BaseModifier_Plus {
    public speed_bonus: number;
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        let caster = this.GetCasterPlus();
        this.speed_bonus = this.GetSpecialValueFor("bonus_attack_speed");
        return this.speed_bonus;
    }
    IsBuff() {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_phantom_strike_coup_de_grace extends BaseModifier_Plus {
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let owner = this.GetParentPlus();
            let modifier_speed = "modifier_imba_phantom_strike";
            let stackcount = this.GetStackCount();
            if (owner != keys.attacker) {
                return;
            }
            if (stackcount == 1) {
                this.Destroy();
            } else {
                this.DecrementStackCount();
            }
        }
    }
    IsBuff() {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
}
@registerAbility()
export class imba_phantom_assassin_blur extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_blur";
    }
    GetCastPoint(): number {
        if (!this.GetCasterPlus().HasScepter()) {
            return super.GetCastPoint();
        } else {
            return 0;
        }
    }
    GetCooldown(level: number): number {
        if (!this.GetCasterPlus().HasScepter()) {
            return super.GetCooldown(level);
        } else {
            return 12;
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            ProjectileHelper.ProjectileDodgePlus(this.GetCasterPlus());
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_blur_smoke", {
                duration: this.GetSpecialValueFor("duration")
            });
            if (this.GetCasterPlus().HasScepter()) {
                this.GetCasterPlus().Purge(false, true, false, false, false);
            }
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_phantom_assassin_10") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_phantom_assassin_10")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_phantom_assassin_10"), "modifier_special_bonus_imba_phantom_assassin_10", {});
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.NO_TARGET_if_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_blur extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public modifier_aura: any;
    public modifier_speed: string;
    public radius: number;
    public evasion: any;
    public ms_duration: number;
    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.modifier_aura = "modifier_imba_blur_blur";
        this.modifier_speed = "modifier_imba_blur_speed";
        this.radius = this.GetSpecialValueFor("radius");
        this.evasion = this.GetAbilityPlus().GetTalentSpecialValueFor("evasion");
        this.ms_duration = this.GetSpecialValueFor("speed_bonus_duration");
        if (IsServer()) {
            this.StartIntervalThink(0.2);
        }
    }

    OnIntervalThink(): void {
        if (IsServer()) {
            let nearby_enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
            if (GameFunc.GetCount(nearby_enemies) > 0 && this.caster.HasModifier(this.modifier_aura)) {
                this.caster.RemoveModifierByName(this.modifier_aura);
            } else if (GameFunc.GetCount(nearby_enemies) == 0 && !this.caster.HasModifier(this.modifier_aura)) {
                this.caster.AddNewModifier(this.caster, this.GetAbilityPlus(), this.modifier_aura, {});
                let responses = {
                    "1": "phantom_assassin_phass_ability_blur_01",
                    "2": "phantom_assassin_phass_ability_blur_02",
                    "3": "phantom_assassin_phass_ability_blur_03"
                }
                this.caster.EmitCasterSound(Object.values(responses), 10, ResHelper.EDOTA_CAST_SOUND.FLAG_NONE, 50, "blur");
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_FAIL,
            3: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            4: Enum_MODIFIER_EVENT.ON_HERO_KILLED
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT)
    CC_GetModifierEvasion_Constant(p_0: ModifierAttackEvent,): number {
        if (!this.GetParentPlus().PassivesDisabled()) {
            return this.evasion;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        if (GFuncRandom.PRD(this.caster.GetTalentValue("special_bonus_imba_phantom_assassin_8"), this)) {
            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_EVADE, this.caster, 0, undefined);
            return -100;
        }
        return undefined;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_FAIL)
    CC_OnAttackFail(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            if (keys.target == this.GetParentPlus()) {
                if (!this.caster.HasModifier(this.modifier_speed)) {
                    this.caster.AddNewModifier(this.caster, this.GetAbilityPlus(), this.modifier_speed, {
                        duration: this.ms_duration
                    });
                }
                let modifier_speed_handler = this.caster.FindModifierByName(this.modifier_speed);
                if (modifier_speed_handler) {
                    modifier_speed_handler.IncrementStackCount();
                    modifier_speed_handler.ForceRefresh();
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_HERO_KILLED)
    CC_OnHeroKilled(keys: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.attacker == this.GetParentPlus() && keys.target.GetTeamNumber() != this.GetParentPlus().GetTeamNumber() && this.GetAbilityPlus().IsTrained()) {
            for (let abilities = 0; abilities <= 23; abilities++) {
                let ability = this.GetParentPlus().GetAbilityByIndex(abilities);
                if (ability && ability.GetAbilityType() != ABILITY_TYPES.ABILITY_TYPE_ULTIMATE) {
                    ability.EndCooldown();
                }
            }
        }
    }
    IsHidden(): boolean {
        return true;
    }
    IsBuff() {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_blur_speed extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public speed_bonus_duration: number;
    public blur_ms: any;
    public stacks_table: number[];
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.speed_bonus_duration = this.GetSpecialValueFor("speed_bonus_duration");
        this.blur_ms = this.GetSpecialValueFor("blur_ms");
        if (IsServer()) {
            this.stacks_table = []
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (GameFunc.GetCount(this.stacks_table) > 0) {
                for (let i = GameFunc.GetCount(this.stacks_table) - 1; i >= 0; i--) {
                    if (this.stacks_table[i] + this.speed_bonus_duration < GameRules.GetGameTime()) {
                        this.stacks_table.slice(i, 1);

                    }
                }
                if (GameFunc.GetCount(this.stacks_table) == 0) {
                    this.Destroy();
                } else {
                    this.SetStackCount(GameFunc.GetCount(this.stacks_table));
                }
                // this.GetParentPlus().CalculateStatBonus(true);
            } else {
                this.Destroy();
            }
        }
    }
    BeRefresh(p_0: any,): void {
        if (IsServer()) {
            this.stacks_table.push(GameRules.GetGameTime());
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        return this.blur_ms * this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_blur_blur extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    StatusEffectPriority(): modifierpriority {
        return 11;
    }
    GetStatusEffectName(): string {
        return "particles/hero/phantom_assassin/blur_status_fx.vpcf";
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP_FOR_ENEMIES]: true
        };
    }
}
@registerModifier()
export class modifier_imba_blur_smoke extends BaseModifier_Plus {
    public vanish_radius: number;
    public fade_duration: number;
    public linger: any;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_phantom_assassin/phantom_assassin_active_blur.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    Init(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.vanish_radius = this.GetSpecialValueFor("vanish_radius");
        this.fade_duration = this.GetSpecialValueFor("fade_duration");
        if (IsServer()) {
            this.GetParentPlus().EmitSound("Hero_PhantomAssassin.Blur");
            this.linger = false;
            this.OnIntervalThink();
            this.StartIntervalThink(FrameTime());
        }
    }

    OnIntervalThink(): void {
        if (this.linger == true) {
            return;
        }
        if (GameFunc.GetCount(FindUnitsInRadius(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.vanish_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_ANY_ORDER, false)) > 0) {
            this.linger = true;
            this.StartIntervalThink(-1);
            this.SetDuration(this.fade_duration, true);
        }
    }
    BeDestroy(): void {
        if (IsServer() && (this.GetParentPlus().IsConsideredHero() || this.GetParentPlus().IsBuilding() || this.GetParentPlus().IsCreep())) {
            this.GetParentPlus().EmitSound("Hero_PhantomAssassin.Blur.Break");
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: true,
            [modifierstate.MODIFIER_STATE_TRUESIGHT_IMMUNE]: true
        };
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_SUPER_ULTRA;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    CC_GetModifierInvisibilityLevel(): number {
        return 1;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && (keys.target as IBaseNpc_Plus).IsRoshan()) {
            this.SetDuration(math.min(this.fade_duration, this.GetRemainingTime()), true);
        }
    }
}
@registerAbility()
export class imba_phantom_assassin_coup_de_grace extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_coup_de_grace";
    }
}
@registerModifier()
export class modifier_imba_coup_de_grace extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public ps_coup_modifier: any;
    public modifier_stacks: string;
    public crit_increase_duration: number;
    public crit_bonus: number;
    public crit_strike: any;
    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        if (this.caster.IsIllusion()) {
            return;
        }
        this.parent = this.GetParentPlus();
        this.ps_coup_modifier = "modifier_imba_phantom_strike_coup_de_grace";
        this.modifier_stacks = "modifier_imba_coup_de_grace_crit";
        this.crit_increase_duration = this.GetSpecialValueFor("crit_increase_duration");
        this.crit_bonus = this.GetSpecialValueFor("crit_bonus");
    }

    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE)
    CC_GetModifierPreAttack_CriticalStrike(keys: ModifierAttackEvent): number {
        if (!this.GetParentPlus().PassivesDisabled()) {
            let target = keys.target;
            let crit_duration = this.crit_increase_duration + this.caster.GetTalentValue("special_bonus_imba_phantom_assassin_7");
            let crit_chance_total = this.GetAbilityPlus().GetTalentSpecialValueFor("crit_chance");
            if (target.IsBuilding() || target.IsOther() || keys.target.GetTeamNumber() == keys.attacker.GetTeamNumber()) {
                return;
            }
            if (this.caster.HasModifier(this.ps_coup_modifier)) {
                let ps_coup_modifier_handler = this.caster.FindModifierByName(this.ps_coup_modifier);
                if (ps_coup_modifier_handler) {
                    let bonus_coup_de_grace_chance = ps_coup_modifier_handler.GetSpecialValueFor("bonus_coup_de_grace");
                    bonus_coup_de_grace_chance = bonus_coup_de_grace_chance + this.GetCasterPlus().GetTalentValue("special_bonus_imba_phantom_assassin_4");
                    crit_chance_total = crit_chance_total + bonus_coup_de_grace_chance;
                }
            }
            if (GFuncRandom.PRD(crit_chance_total, this)) {
                target.EmitSound("Hero_PhantomAssassin.CoupDeGrace");
                let responses = {
                    "1": "phantom_assassin_phass_ability_coupdegrace_01",
                    "2": "phantom_assassin_phass_ability_coupdegrace_02",
                    "3": "phantom_assassin_phass_ability_coupdegrace_03",
                    "4": "phantom_assassin_phass_ability_coupdegrace_04"
                }
                this.caster.EmitCasterSound(Object.values(responses), 50, ResHelper.EDOTA_CAST_SOUND.FLAG_BOTH_TEAMS, 20, "coup_de_grace");
                let crit_bonus = this.crit_bonus + this.caster.GetTalentValue("special_bonus_imba_phantom_assassin_5");
                this.crit_strike = true;
                return crit_bonus;
            } else {
                this.crit_strike = false;
            }
            return undefined;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let target = keys.target as IBaseNpc_Plus;
            let attacker = keys.attacker;
            let fatality = this.GetSpecialValueFor("fatality_chance");
            if (this.GetCasterPlus() == attacker) {
                if (target.IsBuilding() || target.IsRoshan() || keys.target.GetTeamNumber() == keys.attacker.GetTeamNumber()) {
                    return;
                }
                if (RandomInt(1, 100) <= fatality) {
                    if (target.GetHealthPercent() >= this.GetSpecialValueFor("fatality_threshold")) {
                        return;
                    }
                    target.TrueKilled(this.caster, this.GetAbilityPlus());
                    SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_CRITICAL, target, 999999, undefined);
                    if (target.IsRealUnit()) {
                        let blood_pfx = ResHelper.CreateParticleEx("particles/hero/phantom_assassin/screen_blood_splatter.vpcf", ParticleAttachment_t.PATTACH_EYES_FOLLOW, target, attacker);
                        // Notifications.BottomToAll({
                        //     text: "FATALITY!",
                        //     duration: 4.0,
                        //     style: {
                        //         ["font-size"]: "50px",
                        //         color: "Red"
                        //     }
                        // });
                        target.EmitSound("Hero_PhantomAssassin.CoupDeGrace");
                        this.GetCasterPlus().EmitSound("Imba.PhantomAssassinFatality");
                        if (this.GetParentPlus().HasModifier("modifier_phantom_assassin_arcana")) {
                            this.KillingBlowDamage("Fatality!");
                        }
                        let coup_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_phantom_assassin/phantom_assassin_crit_impact.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target, this.caster);
                        ParticleManager.SetParticleControlEnt(coup_pfx, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                        ParticleManager.SetParticleControl(coup_pfx, 1, target.GetAbsOrigin());
                        ParticleManager.SetParticleControlOrientation(coup_pfx, 1, this.GetParentPlus().GetForwardVector() * (-1) as Vector, this.GetParentPlus().GetRightVector(), this.GetParentPlus().GetUpVector());
                        ParticleManager.ReleaseParticleIndex(coup_pfx);
                        return undefined;
                    }
                }
                if (this.crit_strike != false) {
                    let coup_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_phantom_assassin/phantom_assassin_crit_impact.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target, this.caster);
                    ParticleManager.SetParticleControlEnt(coup_pfx, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                    ParticleManager.SetParticleControl(coup_pfx, 1, target.GetAbsOrigin());
                    ParticleManager.SetParticleControlOrientation(coup_pfx, 1, this.GetParentPlus().GetForwardVector() * (-1) as Vector, this.GetParentPlus().GetRightVector(), this.GetParentPlus().GetUpVector());
                    ParticleManager.ReleaseParticleIndex(coup_pfx);
                    if (this.GetParentPlus().HasModifier("modifier_phantom_assassin_arcana")) {
                        this.KillingBlowDamage(tostring(keys.damage));
                    }
                }
            }
        }
    }
    KillingBlowDamage(damage_count: string) {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().TempData().cdp_damage = damage_count;
        this.StartIntervalThink(0.1);
    }
    OnIntervalThink(): void {
        this.StartIntervalThink(-1);
        this.GetParentPlus().TempData().cdp_damage = undefined;
    }
    IsPassive(): boolean {
        return true;
    }
    IsHidden(): boolean {
        let stacks = this.GetStackCount();
        if (stacks > 0) {
            return false;
        }
        return true;
    }
}
@registerModifier()
export class modifier_imba_coup_de_grace_crit extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public crit_increase_duration: number;
    public crit_increase_damage: number;
    public stacks_table: number[];
    BeCreated(params: any): void {
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.crit_increase_duration = params.duration;
        this.crit_increase_damage = this.GetSpecialValueFor("crit_increase_damage");
        if (IsServer()) {
            this.stacks_table = []
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (GameFunc.GetCount(this.stacks_table) > 0) {
                for (let i = GameFunc.GetCount(this.stacks_table) - 1; i >= 0; i--) {
                    if (this.stacks_table[i] + this.crit_increase_duration < GameRules.GetGameTime()) {
                        this.stacks_table.splice(i, 1)
                    }
                }
                if (GameFunc.GetCount(this.stacks_table) == 0) {
                    this.Destroy();
                } else {
                    this.SetStackCount(GameFunc.GetCount(this.stacks_table));
                }
                // this.GetParentPlus().CalculateStatBonus(true);
            } else {
                this.Destroy();
            }
        }
    }
    BeRefresh(p_0: any,): void {
        if (IsServer()) {
            this.stacks_table.push(GameRules.GetGameTime());
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFunc = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE
        }
        return Object.values(decFunc);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.crit_increase_damage * this.GetStackCount();
    }
}
@registerModifier()
export class modifier_special_bonus_imba_phantom_assassin_10 extends BaseModifier_Plus {
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
export class modifier_phantom_assassin_gravestone extends BaseModifier_Plus {
    public cdp_damage: number;
    IsHidden(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_IGNORING_MOVE_AND_ATTACK_ORDERS]: true,
            [modifierstate.MODIFIER_STATE_IGNORING_STOP_ORDERS]: true
        };
    }
    BeCreated(keys: any): void {
        if (!IsServer()) {
            return;
        }
        this.cdp_damage = keys.cdp_damage;
        this.StartIntervalThink(0.25);
    }
    OnIntervalThink(): void {
        NetTablesHelper.SetDotaEntityData("update_pa_arcana_tooltips", {
            victim: this.GetStackCount(),
            victim_id: this.GetParentPlus().TempData().victim_id,
            killer_id: this.GetParentPlus().entindex(),
            epitaph: this.GetParentPlus().TempData().epitaph_number,
            cdp_damage: this.cdp_damage
        })
    }
}
@registerModifier()
export class modifier_phantom_assassin_arcana extends BaseModifier_Plus {
    RemoveOnDeath(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    GetTexture(): string {
        return "phantom_assassin_arcana_coup_de_grace";
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_HERO_KILLED
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_HERO_KILLED)
    CC_OnHeroKilled(params: ModifierAttackEvent): void {
        if (!IsServer()) {
            return;
        }
        if (params.attacker == this.GetParentPlus() && params.target.IsRealUnit() && params.attacker.GetTeam() != params.target.GetTeam()) {
            this.IncrementStackCount();
            let gravestone = BaseNpc_Plus.CreateUnitByName("npc_imba_phantom_assassin_gravestone", params.target.GetAbsOrigin(), this.GetParentPlus(), true, DOTATeam_t.DOTA_TEAM_NEUTRALS);
            gravestone.SetOwner(this.GetParentPlus());
            this.AddTimer(FrameTime(), () => {
                gravestone.AddNewModifier(gravestone, undefined,
                    "modifier_phantom_assassin_gravestone", {
                    cdp_damage: params.attacker.TempData().cdp_damage
                }).SetStackCount(params.target.entindex());
            });
            gravestone.TempData().epitaph_number = RandomInt(1, 13);
            gravestone.TempData().victim_id = (params.target as IBaseNpc_Plus).GetPlayerID();
            for (let i = 0; i <= PlayerResource.GetPlayerCount() - 1; i++) {
                // gravestone.SetControllableByPlayer(i as PlayerID, false);
            }
            if (this.GetStackCount() == 400) {
                // Wearable._WearProp(this.GetParentPlus(), "7247", "weapon", 1);
                // Notifications.Bottom(this.GetParentPlus().GetPlayerID(), {
                //     image: "file://{images}/econ/items/phantom_assassin/manifold_paradox/arcana_pa_style1.png",
                //     duration: 5.0
                // });
                // Notifications.Bottom(this.GetParentPlus().GetPlayerID(), {
                //     text: "Style 1 unlocked!",
                //     duration: 10.0
                // });
            } else if (this.GetStackCount() == 1000) {
                // Wearable._WearProp(this.GetParentPlus(), "7247", "weapon", 2);
                // Notifications.Bottom(this.GetParentPlus().GetPlayerID(), {
                //     image: "file://{images}/econ/items/phantom_assassin/manifold_paradox/arcana_pa_style2.png",
                //     duration: 5.0
                // });
                // Notifications.Bottom(this.GetParentPlus().GetPlayerID(), {
                //     text: "Style 2 unlocked!",
                //     duration: 10.0
                // });
            }
            let style = 0;
            if (this.GetStackCount() >= 400 && this.GetStackCount() < 1000) {
                style = 1;
            } else if (this.GetStackCount() >= 1000) {
                style = 2;
            }
            gravestone.SetMaterialGroup(tostring(style));
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_phantom_assassin_9 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_phantom_assassin_3 extends BaseModifier_Plus {
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
