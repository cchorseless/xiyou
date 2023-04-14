
import { GameFunc } from "../../../GameFunc";
import { AI_ability } from "../../../ai/AI_ability";
import { ResHelper } from "../../../helper/ResHelper";
import { GameServiceConfig } from "../../../shared/GameServiceConfig";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_bounty_hunter_shuriken_toss extends BaseAbility_Plus {
    public money_particle: any;
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("scepter_cast_range");
        } else {
            return super.GetCastRange(location, target);
        }
    }
    GetCooldown(level: number): number {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("scepter_cooldown");
        } else {
            return super.GetCooldown(level);
        }
    }
    GetAbilityTextureName(): string {
        return "bounty_hunter_shuriken_toss";
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = this.GetCursorTarget();
        let particle_projectile = "particles/units/heroes/hero_bounty_hunter/bounty_hunter_suriken_toss.vpcf";
        let sound_cast = "Hero_BountyHunter.Shuriken";
        let cast_response = "bounty_hunter_bount_ability_shur_0" + RandomInt(2, 3);
        let projectile_speed = ability.GetSpecialValueFor("projectile_speed");
        let scepter_throw_delay = ability.GetSpecialValueFor("scepter_throw_delay");
        if (RollPercentage(25)) {
            EmitSoundOn(cast_response, caster);
        }
        EmitSoundOn(sound_cast, caster);
        let enemy_table: EntityIndex[] = [];
        enemy_table.push(target.GetEntityIndex());
        // #4 Talent: Jinada is applied to the shuriken if ready
        let shuriken_crit = false
        if (caster.HasTalent("special_bonus_imba_bounty_hunter_4")) {
            let jinada_ability_name = "imba_bounty_hunter_jinada"
            let jinada_ability = caster.FindAbilityByName(jinada_ability_name)
            if (caster.HasModifier("modifier_imba_jinada_buff_crit") && jinada_ability && jinada_ability.GetLevel() > 0) {
                // Jinada goes on cooldown
                jinada_ability.UseResources(false, false, true)
                // Consumes Jinada's buff
                caster.RemoveModifierByName("modifier_imba_jinada_buff_crit")
                // Set the shuriken to be a critical shuriken
                shuriken_crit = true
            }
        }

        let enemy_table_string = GToJson(enemy_table);
        let shuriken_projectile: CreateTrackingProjectileOptions = {
            Target: target,
            Source: caster,
            Ability: ability,
            EffectName: particle_projectile,
            iMoveSpeed: projectile_speed,
            bDodgeable: true,
            bVisibleToEnemies: true,
            bReplaceExisting: false,
            bProvidesVision: false,
            ExtraData: {
                enemy_table_string: enemy_table_string,
                shuriken_crit: shuriken_crit
            }
        }
        ProjectileManager.CreateTrackingProjectile(shuriken_projectile);
    }
    OnProjectileHit_ExtraData(target: IBaseNpc_Plus | undefined, location: Vector, extradata: any): boolean | void {
        if (IsServer()) {
            if (target && !target.IsRealUnit()) { return }
            let caster = this.GetCasterPlus();
            let ability = this;
            let particle_projectile = "particles/units/heroes/hero_bounty_hunter/bounty_hunter_suriken_toss.vpcf";
            let enemy_table_string: string = extradata.enemy_table_string;
            let enemy_table = GFromJson(enemy_table_string) as EntityIndex[];
            let shuriken_crit = extradata.shuriken_crit;
            let projectile_speed = ability.GetSpecialValueFor("projectile_speed");
            let damage = ability.GetSpecialValueFor("damage");
            let bounce_radius = ability.GetSpecialValueFor("bounce_radius");
            let stun_duration = ability.GetSpecialValueFor("stun_duration");
            let pull_duration = ability.GetSpecialValueFor("pull_duration");
            bounce_radius = bounce_radius + caster.GetTalentValue("special_bonus_imba_bounty_hunter_5");
            if (!target) {
                return;
            }
            target.EmitSound("Hero_BountyHunter.Shuriken.Impact");
            if (target.IsMagicImmune()) {
                return;
            }
            if (caster.GetTeamNumber() != target.GetTeamNumber()) {
                if (target.TriggerSpellAbsorb(ability)) {
                    return;
                }
            }
            target.AddNewModifier(caster, ability, "modifier_imba_shuriken_toss_stunned", {
                duration: stun_duration * (1 - target.GetStatusResistance())
            });
            if (target.IsAlive() && this.GetCasterPlus().HasScepter() && this.GetCasterPlus().HasAbility("imba_bounty_hunter_jinada") && this.GetCasterPlus().findAbliityPlus<imba_bounty_hunter_jinada>("imba_bounty_hunter_jinada").IsTrained()) {
                let jinada_ability = this.GetCasterPlus().findAbliityPlus<imba_bounty_hunter_jinada>("imba_bounty_hunter_jinada");
                damage = damage + jinada_ability.GetSpecialValueFor("bonus_damage");
                this.GetCasterPlus().EmitSound("Hero_BountyHunter.Jinada");
                if (target.IsRealUnit() && target.GetPlayerID()) {
                    let actual_gold_to_steal = math.min(jinada_ability.GetTalentSpecialValueFor("bonus_gold"), PlayerResource.GetUnreliableGold(target.GetPlayerID()));
                    if (actual_gold_to_steal > 0) {
                        this.money_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_bounty_hunter/bounty_hunter_jinada.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                        ParticleManager.SetParticleControlEnt(this.money_particle, 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
                        ParticleManager.ReleaseParticleIndex(this.money_particle);
                    }
                    // target.ModifyGold(-actual_gold_to_steal, false, EDOTA_ModifyGold_Reason.DOTA_ModifyGold_Unspecified);
                    let playerid = this.GetCasterPlus().GetPlayerID()
                    let playerroot = GGameScene.GetPlayer(playerid);
                    playerroot.PlayerDataComp().ModifyGold(actual_gold_to_steal, false, EDOTA_ModifyGold_Reason.DOTA_ModifyGold_Unspecified);
                    SendOverheadEventMessage(PlayerResource.GetPlayer(playerid), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_GOLD, this.GetCasterPlus(), actual_gold_to_steal, undefined);
                    if (this.GetCasterPlus().HasModifier("modifier_imba_jinada_gold_tracker")) {
                        this.GetCasterPlus().findBuff<modifier_imba_jinada_gold_tracker>("modifier_imba_jinada_gold_tracker").SetStackCount(this.GetCasterPlus().FindModifierByName("modifier_imba_jinada_gold_tracker").GetStackCount() + actual_gold_to_steal);
                    }
                }
            }
            ApplyDamage({
                victim: target,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                attacker: caster,
                ability: ability
            });
            target.AddNewModifier(caster, ability, "modifier_imba_shuriken_toss_debuff_pull", {
                duration: pull_duration * (1 - target.GetStatusResistance())
            });
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, bounce_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
            let projectile_fired = false;
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let enemy_found = false;
                for (const [_, enemy_in_table] of GameFunc.iPair(enemy_table)) {
                    if (enemy.GetEntityIndex() == enemy_in_table) {
                        enemy_found = true;
                        break;
                    }
                }
                if (enemy.HasModifier("modifier_imba_track_debuff_mark") && !enemy_found) {
                    enemy_table.push(enemy.GetEntityIndex());
                    enemy_table_string = GToJson(enemy_table);
                    let shuriken_projectile;
                    shuriken_projectile = {
                        Target: enemy,
                        Source: target,
                        Ability: ability,
                        EffectName: particle_projectile,
                        iMoveSpeed: projectile_speed,
                        bDodgeable: true,
                        bVisibleToEnemies: true,
                        bReplaceExisting: false,
                        bProvidesVision: false,
                        ExtraData: {
                            enemy_table_string: enemy_table_string,
                            shuriken_crit: shuriken_crit
                        }
                    }
                    ProjectileManager.CreateTrackingProjectile(shuriken_projectile);
                    projectile_fired = true;
                    return;
                }
            }
        }
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

}
@registerModifier()
export class modifier_imba_shuriken_toss_stunned extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
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
@registerModifier()
export class modifier_imba_shuriken_toss_debuff_pull extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public particle_leash: any;
    public particle_hook: any;
    public minimum_pull_power: any;
    public minimum_pull_distance: number;
    public maximum_pull_power: any;
    public pull_power_increase: any;
    public pull_increase_distance: number;
    public toss_hit_location: any;
    public particle_leash_fx: any;
    public particle_hook_fx: any;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.parent = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.particle_leash = "particles/hero/bounty_hunter/shuriken_toss_leash.vpcf";
            this.particle_hook = "particles/units/heroes/hero_bounty_hunter/bounty_hunter_shuriken_dummy.vpcf";
            this.minimum_pull_power = this.ability.GetSpecialValueFor("minimum_pull_power");
            this.minimum_pull_distance = this.ability.GetSpecialValueFor("minimum_pull_distance");
            this.maximum_pull_power = this.ability.GetSpecialValueFor("maximum_pull_power");
            this.pull_power_increase = this.ability.GetSpecialValueFor("pull_power_increase");
            this.pull_increase_distance = this.ability.GetSpecialValueFor("pull_increase_distance");
            this.toss_hit_location = this.parent.GetAbsOrigin();
            this.particle_leash_fx = ResHelper.CreateParticleEx(this.particle_leash, ParticleAttachment_t.PATTACH_ABSORIGIN, this.parent);
            ParticleManager.SetParticleControl(this.particle_leash_fx, 3, this.parent.GetAbsOrigin());
            ParticleManager.SetParticleControlEnt(this.particle_leash_fx, 1, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
            this.particle_hook_fx = ResHelper.CreateParticleEx(this.particle_hook, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.parent);
            ParticleManager.SetParticleControl(this.particle_hook_fx, 0, Vector(this.parent.GetAbsOrigin().x, this.parent.GetAbsOrigin().y, 2000));
            ParticleManager.SetParticleControl(this.particle_hook_fx, 6, this.parent.GetAbsOrigin());
            this.StartIntervalThink(FrameTime());
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let distance = GFuncVector.AsVector(this.parent.GetAbsOrigin() - this.toss_hit_location).Length2D();
            let direction = GFuncVector.AsVector(this.toss_hit_location - this.parent.GetAbsOrigin()).Normalized();
            if (distance <= this.minimum_pull_distance) {
                return undefined;
            }
            let velocity = this.minimum_pull_power + (distance / this.pull_increase_distance) * this.pull_power_increase;
            if (velocity > this.maximum_pull_power) {
                velocity = this.maximum_pull_power;
            }
            this.parent.SetAbsOrigin(this.parent.GetAbsOrigin() + direction * velocity * FrameTime() as Vector);
            ResolveNPCPositions(this.parent.GetAbsOrigin(), 128);
        }
    }
    BeRemoved(): void {
        if (IsServer()) {
            ParticleManager.ClearParticle(this.particle_leash_fx, false);
            ParticleManager.ClearParticle(this.particle_hook_fx, true);
        }
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
}
@registerAbility()
export class imba_bounty_hunter_jinada extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "bounty_hunter_jinada";
    }
    IsNetherWardStealable() {
        return false;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_jinada_passive";
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (caster.HasTalent("special_bonus_imba_bounty_hunter_3")) {
                if (target != caster && caster.GetTeamNumber() == target.GetTeamNumber()) {
                    let nResult = UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber());
                    return nResult;
                }
            }
            if (target.GetTeamNumber() == caster.GetTeamNumber()) {
                return UnitFilterResult.UF_FAIL_FRIENDLY;
            }
            if (caster.HasTalent("special_bonus_imba_bounty_hunter_7") && target.HasModifier("modifier_imba_headhunter_debuff_handler")) {
                let nResult = UnitFilter(target, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber());
                return nResult;
            }
            if (!target.HasModifier("modifier_imba_track_debuff_mark")) {
                return UnitFilterResult.UF_FAIL_CUSTOM;
            }
            let nResult = UnitFilter(target, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber());
            return nResult;
        }
    }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        return "#dota_hud_error_shadow_jaunt_track";
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        let caster = this.GetCasterPlus();
        if (caster.HasTalent("special_bonus_imba_bounty_hunter_7")) {
            if (target && target.HasModifier("modifier_imba_headhunter_debuff_handler")) {
                return caster.GetTalentValue("special_bonus_imba_bounty_hunter_7", "cast_range");
            }
        }
        return this.GetSpecialValueFor("cast_range");
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            if (target.GetTeamNumber() != caster.GetTeamNumber()) {
                this.ShadowJaunt(caster, this, target);
            } else {
                caster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_4);
                EmitSoundOnLocationWithCaster(target.GetAbsOrigin(), "Hero_Enchantress.EnchantCast", caster);
                let duration = caster.GetTalentValue("special_bonus_imba_bounty_hunter_3", "jinada_buff_duration");
                target.AddNewModifier(caster, this, "modifier_imba_jinada_buff_crit", {
                    duration: duration
                });
                if (caster.HasModifier("modifier_imba_jinada_buff_crit")) {
                    caster.RemoveModifierByName("modifier_imba_jinada_buff_crit");
                }
            }
        }
    }
    ShadowJaunt(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus, target: IBaseNpc_Plus) {
        if (caster.GetTeamNumber() != target.GetTeamNumber()) {
            if (target.TriggerSpellAbsorb(ability)) {
                return;
            }
        }
        let blink_direction = GFuncVector.AsVector(target.GetAbsOrigin() - caster.GetAbsOrigin()).Normalized();
        let target_pos = target.GetAbsOrigin() + blink_direction * (-50) as Vector;
        FindClearSpaceForUnit(caster, target_pos, false);
        caster.SetForwardVector(GFuncVector.AsVector(target.GetAbsOrigin() - caster.GetAbsOrigin()).Normalized());
        ability.UseResources(false, false, true);
        this.AddTimer(1, () => {
            if (caster.HasModifier("modifier_imba_jinada_buff_crit")) {
                caster.RemoveModifierByName("modifier_imba_jinada_buff_crit");
            }
        });
        this.AddTimer(FrameTime(), () => {
            caster.MoveToTargetToAttack(target);
        });
    }
    IsStealable(): boolean {
        return false;
    }

    GetManaCost(level: number): number {
        return 0;
    }

    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_jinada_passive extends BaseModifier_Plus {
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_jinada_gold_tracker", {});
        this.StartIntervalThink(0.2);
    }
    OnIntervalThink(): void {
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        let crit_modifier = "modifier_imba_jinada_buff_crit";
        if (ability.IsCooldownReady() && !caster.HasModifier(crit_modifier)) {
            caster.AddNewModifier(caster, ability, crit_modifier, {});
        }
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_jinada_debuff_slow extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public ms_slow_pct: number;
    public as_slow: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.ms_slow_pct = this.ability.GetSpecialValueFor("ms_slow_pct");
        this.as_slow = this.ability.GetSpecialValueFor("as_slow");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.ms_slow_pct * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.as_slow * (-1);
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_jinada_buff_crit extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public particle_glow: any;
    public particle_hit: any;
    public modifier_slow: any;
    public crit_damage: number;
    public slow_duration: number;
    public caster_buff: any;
    public particle_glow_fx: any;
    public particle_hit_fx: any;
    public money_particle: any;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.particle_glow = "particles/units/heroes/hero_bounty_hunter/bounty_hunter_hand_l.vpcf";
            this.particle_hit = "particles/units/heroes/hero_bounty_hunter/bounty_hunter_jinda_slow.vpcf";
            this.modifier_slow = "modifier_imba_jinada_debuff_slow";
            this.crit_damage = this.ability.GetSpecialValueFor("crit_damage");
            this.slow_duration = this.ability.GetSpecialValueFor("slow_duration");
            if (this.caster == this.parent) {
                this.caster_buff = true;
            } else {
                this.caster_buff = false;
            }
            if (this.caster_buff) {
                this.particle_glow_fx = ResHelper.CreateParticleEx(this.particle_glow, ParticleAttachment_t.PATTACH_ABSORIGIN, this.parent);
                ParticleManager.SetParticleControlEnt(this.particle_glow_fx, 0, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_weapon1", this.parent.GetAbsOrigin(), true);
                this.AddParticle(this.particle_glow_fx, false, false, -1, false, false);
                this.particle_glow_fx = ResHelper.CreateParticleEx(this.particle_glow, ParticleAttachment_t.PATTACH_ABSORIGIN, this.parent);
                ParticleManager.SetParticleControlEnt(this.particle_glow_fx, 0, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_weapon2", this.parent.GetAbsOrigin(), true);
                this.AddParticle(this.particle_glow_fx, false, false, -1, false, false);
            } else {
                this.particle_glow_fx = ResHelper.CreateParticleEx("particles/hero/bounty_hunter/bounty_hunter_jinada_ally.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.parent);
                ParticleManager.SetParticleControl(this.particle_glow_fx, 0, this.parent.GetAbsOrigin());
                this.AddParticle(this.particle_glow_fx, false, false, -1, false, false);
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage( /** keys */): number {
        if (!this.GetParentPlus().PassivesDisabled()) {
            return this.GetSpecialValueFor("bonus_damage");
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker as IBaseNpc_Plus;
            let target = keys.target as IBaseNpc_Plus;
            if (!attacker.IsRealUnit()) {
                return;
            }
            if (attacker.PassivesDisabled()) {
                return;
            }
            if (this.parent == attacker && target.GetTeamNumber() != this.parent.GetTeamNumber()) {
                this.parent.EmitSound("Hero_BountyHunter.Jinada");
                this.particle_hit_fx = ResHelper.CreateParticleEx(this.particle_hit, ParticleAttachment_t.PATTACH_ABSORIGIN, this.parent);
                ParticleManager.SetParticleControl(this.particle_hit_fx, 0, target.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(this.particle_hit_fx);
                if (this.ability.IsCooldownReady()) {
                    this.ability.UseResources(false, false, true);
                }
                if (target.IsRealUnit() && target.GetPlayerID()) {
                    let actual_gold_to_steal = math.min(this.GetAbilityPlus().GetTalentSpecialValueFor("bonus_gold"), PlayerResource.GetUnreliableGold(target.GetPlayerID()));
                    if (actual_gold_to_steal > 0) {
                        this.money_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_bounty_hunter/bounty_hunter_jinada.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                        ParticleManager.SetParticleControlEnt(this.money_particle, 1, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
                        ParticleManager.ReleaseParticleIndex(this.money_particle);
                    }
                    // target.ModifyGold(-actual_gold_to_steal, false, EDOTA_ModifyGold_Reason.DOTA_ModifyGold_Unspecified);
                    let playerroot = GGameScene.GetPlayer(attacker.GetPlayerID());
                    playerroot.PlayerDataComp().ModifyGold(actual_gold_to_steal, false, EDOTA_ModifyGold_Reason.DOTA_ModifyGold_Unspecified);
                    SendOverheadEventMessage(PlayerResource.GetPlayer(playerroot.BelongPlayerid), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_GOLD, attacker, actual_gold_to_steal, undefined);
                    if (this.GetCasterPlus().HasModifier("modifier_imba_jinada_gold_tracker")) {
                        this.GetCasterPlus().findBuff<modifier_imba_jinada_gold_tracker>("modifier_imba_jinada_gold_tracker").SetStackCount(this.GetCasterPlus().FindModifierByName("modifier_imba_jinada_gold_tracker").GetStackCount() + actual_gold_to_steal);
                    }
                }
                this.Destroy();
            }
        }
    }
    IsHidden(): boolean {
        if (this.caster_buff) {
            return true;
        }
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_jinada_gold_tracker extends BaseModifier_Plus {
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
@registerAbility()
export class imba_bounty_hunter_shadow_walk extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "bounty_hunter_wind_walk";
    }
    IsNetherWardStealable() {
        return false;
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        let caster = this.GetCasterPlus();
        let ability = this;
        let true_sight_radius = ability.GetSpecialValueFor("true_sight_radius");
        return true_sight_radius;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this;
            let sound_cast = "Hero_BountyHunter.WindWalk";
            let cast_response = "bounty_hunter_bount_ability_windwalk_0" + RandomInt(1, 8);
            let particle_smoke = "particles/units/heroes/hero_bounty_hunter/bounty_hunter_windwalk.vpcf";
            let particle_invis_start = "particles/generic_hero_status/status_invisibility_start.vpcf";
            let modifier_invis = "modifier_imba_shadow_walk_buff_invis";
            let duration = ability.GetSpecialValueFor("duration");
            let fade_time = ability.GetSpecialValueFor("fade_time");
            let cast_response_chance = 75;
            let cast_response_roll = RandomInt(1, 100);
            if (cast_response_roll <= cast_response_chance) {
                EmitSoundOn(cast_response, caster);
            }
            EmitSoundOn(sound_cast, caster);
            let particle_smoke_fx = ResHelper.CreateParticleEx(particle_smoke, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(particle_smoke_fx, 0, caster.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(particle_smoke_fx);
            this.AddTimer(fade_time, () => {
                let particle_invis_start_fx = ResHelper.CreateParticleEx(particle_invis_start, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
                ParticleManager.SetParticleControl(particle_invis_start_fx, 0, caster.GetAbsOrigin());
                caster.AddNewModifier(caster, ability, modifier_invis, {
                    duration: duration
                });
            });
        }
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_shadow_walk_buff_invis extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public bonus_damage: number;
    public invis_ms_bonus: number;
    public true_sight_radius: number;
    public ms_bonus_per_check_pct: number;
    public check_interval: number;
    public last_movement_time: number;
    public movespeed_bonus_pct: number;
    public approved_checks: any;
    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.bonus_damage = this.ability.GetSpecialValueFor("bonus_damage");
        this.invis_ms_bonus = this.ability.GetSpecialValueFor("invis_ms_bonus");
        this.true_sight_radius = this.ability.GetSpecialValueFor("true_sight_radius");
        if (IsServer()) {
            if (this.caster.HasTalent("special_bonus_imba_bounty_hunter_6")) {
                this.ms_bonus_per_check_pct = this.caster.GetTalentValue("special_bonus_imba_bounty_hunter_6", "ms_bonus_per_check_pct");
                this.check_interval = this.caster.GetTalentValue("special_bonus_imba_bounty_hunter_6", "check_interval");
                this.last_movement_time = GameRules.GetGameTime();
                this.movespeed_bonus_pct = 0;
                this.approved_checks = 0;
                this.StartIntervalThink(0.1);
            }
        }
    }

    OnIntervalThink(): void {
        if (IsServer()) {
            let current_gametime = GameRules.GetGameTime();
            if (current_gametime - this.last_movement_time > this.check_interval) {
                this.movespeed_bonus_pct = 0;
                this.approved_checks = 0;
            } else {
                this.approved_checks = this.approved_checks + 1;
            }
            if (this.approved_checks >= 10) {
                this.movespeed_bonus_pct = this.movespeed_bonus_pct + this.ms_bonus_per_check_pct;
                this.approved_checks = 0;
            }
            this.SetStackCount(this.movespeed_bonus_pct);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        }
        return state;
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_NORMAL;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL,
            3: Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED,
            4: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            5: Enum_MODIFIER_EVENT.ON_UNIT_MOVED,
            6: MODIFIER_PROPERTY_MOVESPEED_MAX
        }
        return Object.values(decFuncs);
    } */
    GetModifierMoveSpeed_Max() {
        return 550 * (1 + this.GetStackCount() * 0.01);
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_UNIT_MOVED)
    CC_OnUnitMoved(keys: ModifierUnitEvent): void {
        if (IsServer()) {
            if (keys.unit == this.parent) {
                this.last_movement_time = GameRules.GetGameTime();
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    CC_GetModifierInvisibilityLevel(): number {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.invis_ms_bonus + this.GetStackCount();
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    CC_OnAbilityExecuted(keys: ModifierAbilityEvent): void {
        if (IsServer()) {
            let ability = keys.ability;
            let caster = keys.unit;
            if (caster == this.caster) {
                if (ability.GetAbilityName() == "imba_bounty_hunter_jinada" || ability.GetAbilityName() == "imba_bounty_hunter_track") {
                    return undefined;
                }
                this.Destroy();
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            let target = keys.target;
            if (this.caster == attacker) {
                let damageTable = {
                    victim: target,
                    damage: this.bonus_damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                    attacker: this.caster,
                    ability: this.ability
                }
                ApplyDamage(damageTable);
                this.Destroy();
            }
        }
    }
    GetAuraRadius(): number {
        return this.true_sight_radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_ALL + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CUSTOM + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_TREE;
    }
    GetModifierAura(): string {
        return "modifier_imba_shadow_walk_vision";
    }
    IsAura(): boolean {
        return true;
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
export class modifier_imba_shadow_walk_vision extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: false
        }
        return state;
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
}
@registerAbility()
export class imba_bounty_hunter_track extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "bounty_hunter_track";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            let particle_projectile = "particles/units/heroes/hero_bounty_hunter/bounty_hunter_track_cast.vpcf";
            let cast_response = "bounty_hunter_bount_ability_track_0" + RandomInt(2, 3);
            let sound_cast = "Hero_BountyHunter.Target";
            let modifier_track = "modifier_imba_track_debuff_mark";
            let projectile_speed = this.GetSpecialValueFor("projectile_speed");
            let duration = this.GetSpecialValueFor("duration");
            let cast_response_chance = 10;
            let cast_response_roll = RandomInt(1, 100);
            if (cast_response_roll <= cast_response_chance) {
                EmitSoundOn(cast_response, caster);
            }
            EmitSoundOnLocationForAllies(caster.GetAbsOrigin(), sound_cast, caster);
            let smell_probability = 5;
            if (RollPercentage(smell_probability)) {
                EmitSoundOnLocationForAllies(caster.GetAbsOrigin(), "Imba.BountyHunterSmell", caster);
            } else {
                EmitSoundOnLocationForAllies(caster.GetAbsOrigin(), sound_cast, caster);
            }
            let particle_projectile_fx = ParticleManager.CreateParticleForTeam(particle_projectile, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, caster, caster.GetTeamNumber());
            ParticleManager.SetParticleControlEnt(particle_projectile_fx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(particle_projectile_fx, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(particle_projectile_fx);
            if (caster.GetTeamNumber() != target.GetTeamNumber()) {
                if (target.TriggerSpellAbsorb(this)) {
                    return;
                }
            }
            target.AddNewModifier(caster, this, modifier_track, {
                duration: duration * (1 - target.GetStatusResistance())
            });
        }
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetManaCost(level: number): number {
        return 100;
    }

    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_track_debuff_mark extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public particle_shield: any;
    public particle_trail: any;
    public bonus_gold_self: number;
    public bonus_gold_allies: number;
    public haste_radius: number;
    public haste_linger: any;
    public target_crit_multiplier: number;
    public particle_shield_fx: any;
    public particle_trail_fx: any;
    public has_talent_2: any;
    public talent_2_vision_radius: number;
    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.particle_shield = "particles/units/heroes/hero_bounty_hunter/bounty_hunter_track_shield.vpcf";
        this.particle_trail = "particles/units/heroes/hero_bounty_hunter/bounty_hunter_track_trail.vpcf";
        this.bonus_gold_self = this.ability.GetSpecialValueFor("bonus_gold_self");
        this.bonus_gold_allies = this.ability.GetSpecialValueFor("bonus_gold_allies");
        this.haste_radius = this.ability.GetSpecialValueFor("haste_radius");
        this.haste_linger = this.ability.GetSpecialValueFor("haste_linger");
        this.target_crit_multiplier = this.ability.GetSpecialValueFor("target_crit_multiplier");
        if (IsServer()) {
            let custom_gold_bonus = GameServiceConfig.GAME_bounty_multiplier;
            this.bonus_gold_self = this.bonus_gold_self * (custom_gold_bonus / 100);
            this.bonus_gold_allies = this.bonus_gold_allies * (custom_gold_bonus / 100);
            this.particle_shield_fx = ParticleManager.CreateParticleForTeam(this.particle_shield, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.parent, this.caster.GetTeamNumber());
            ParticleManager.SetParticleControl(this.particle_shield_fx, 0, this.parent.GetAbsOrigin());
            this.AddParticle(this.particle_shield_fx, false, false, -1, false, true);
            this.particle_trail_fx = ParticleManager.CreateParticleForTeam(this.particle_trail, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent, this.caster.GetTeamNumber());
            ParticleManager.SetParticleControl(this.particle_trail_fx, 0, this.parent.GetAbsOrigin());
            ParticleManager.SetParticleControlEnt(this.particle_trail_fx, 1, this.parent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, undefined, this.parent.GetAbsOrigin(), true);
            ParticleManager.SetParticleControl(this.particle_trail_fx, 8, Vector(1, 0, 0));
            this.AddParticle(this.particle_trail_fx, false, false, -1, false, false);
            if (this.caster.HasTalent("special_bonus_imba_bounty_hunter_2")) {
                this.has_talent_2 = true;
                this.talent_2_vision_radius = this.caster.GetTalentValue("special_bonus_imba_bounty_hunter_2");
            }
            this.StartIntervalThink(FrameTime());
        }
    }

    OnIntervalThink(): void {
        if (!IsValid(this.caster)) {
            this.Destroy();
            return;
        }
        // this.SetStackCount(this.parent.GetPlayerRoot().PlayerDataComp().GetGold());
        if (this.has_talent_2) {
            AddFOWViewer(this.caster.GetTeamNumber(), this.parent.GetAbsOrigin(), this.talent_2_vision_radius, FrameTime(), false);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.GetParentPlus().HasModifier("modifier_slark_shadow_dance")) {
            return undefined;
        }
        let state = {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: false
        }
        return state;
    }
    GetAuraDuration(): number {
        return this.haste_linger;
    }
    GetAuraRadius(): number {
        return this.haste_radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_track_buff_ms";
    }
    IsAura(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        if (this.caster.HasTalent("special_bonus_imba_bounty_hunter_8")) {
            return false;
        }
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_TARGET_CRITICALSTRIKE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION,
            3: Enum_MODIFIER_EVENT.ON_DEATH,
            4: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            5: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_TARGET_CRITICALSTRIKE)
    CC_GetModifierPreAttack_Target_CriticalStrike( /** keys */): number {
        // if (keys.attacker == this.GetCasterPlus()) {
        //     return this.target_crit_multiplier;
        // } else {
        //     return 0;
        // }
        return this.target_crit_multiplier;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        if (this.caster.HasTalent("special_bonus_imba_bounty_hunter_1")) {
            let bonus_damage_pct = this.caster.GetTalentValue("special_bonus_imba_bounty_hunter_1", "bonus_damage_pct");
            return bonus_damage_pct;
        }
        return undefined;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            let target = keys.unit;
            // let reincarnate = keys.reincarnate;
            if (target == this.parent) {
                if (!target.IsRealUnit()) {
                    this.Destroy();
                    return undefined;
                }
                // if (reincarnate) {
                //     this.Destroy();
                //     return undefined;
                // }
                let playerroot = GGameScene.GetPlayer(this.caster.GetPlayerID());
                playerroot.PlayerDataComp().ModifyGold(this.bonus_gold_self, true, EDOTA_ModifyGold_Reason.DOTA_ModifyGold_Unspecified);
                SendOverheadEventMessage(PlayerResource.GetPlayer(playerroot.BelongPlayerid), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_GOLD, this.caster, this.bonus_gold_self, undefined);
                let allies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.haste_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, ally] of GameFunc.iPair(allies)) {
                    if (ally != this.caster) {
                        // ally.ModifyGold(this.bonus_gold_allies, true, EDOTA_ModifyGold_Reason.DOTA_ModifyGold_Unspecified);
                        // SendOverheadEventMessage(ally, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_GOLD, ally, this.bonus_gold_allies, undefined);
                    }
                }
                this.Destroy();
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
    CC_GetModifierProvidesFOWVision(): 0 | 1 {
        if (this.has_talent_2) {
            return 0;
        }
        return 1;
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
}
@registerModifier()
export class modifier_imba_track_buff_ms extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public particle_haste: any;
    public ms_bonus_allies_pct: number;
    public particle_haste_fx: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.particle_haste = "particles/units/heroes/hero_bounty_hunter/bounty_hunter_track_haste.vpcf";
        this.ms_bonus_allies_pct = this.ability.GetSpecialValueFor("ms_bonus_allies_pct");
        if (IsServer()) {
            this.particle_haste_fx = ResHelper.CreateParticleEx(this.particle_haste, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
            ParticleManager.SetParticleControl(this.particle_haste_fx, 0, this.parent.GetAbsOrigin());
            ParticleManager.SetParticleControl(this.particle_haste_fx, 1, this.parent.GetAbsOrigin());
            ParticleManager.SetParticleControl(this.particle_haste_fx, 2, this.parent.GetAbsOrigin());
            this.AddParticle(this.particle_haste_fx, false, false, -1, false, false);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.ms_bonus_allies_pct;
    }
}
@registerAbility()
export class imba_bounty_hunter_headhunter extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "bounty_hunter_headhunter";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_headhunter_passive";
    }
    IsInnateAbility() {
        return true;
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let modifier_contract_buff = "modifier_imba_headhunter_buff_handler";
        let modifier_contract_debuff = "modifier_imba_headhunter_debuff_handler";
        let duration = ability.GetSpecialValueFor("duration");
        let vision_radius = ability.GetSpecialValueFor("vision_radius");
        let vision_linger_time = ability.GetSpecialValueFor("vision_linger_time");
        if (!target) {
            return undefined;
        }
        caster.AddNewModifier(caster, ability, modifier_contract_buff, {
            duration: duration
        });
        target.AddNewModifier(caster, ability, modifier_contract_debuff, {
            duration: duration * (1 - target.GetStatusResistance())
        });
        AddFOWViewer(caster.GetTeamNumber(), target.GetAbsOrigin(), vision_radius, vision_linger_time, false);
    }
}
@registerModifier()
export class modifier_imba_headhunter_passive extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public modifier_contract: any;
    public particle_projectile: any;
    public projectile_speed: number;
    public starting_cd: any;
    public vision_radius: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.modifier_contract = "modifier_imba_headhunter_debuff_handler";
            this.particle_projectile = "particles/units/heroes/hero_bounty_hunter/bounty_hunter_track_cast.vpcf";
            this.projectile_speed = this.ability.GetSpecialValueFor("projectile_speed");
            this.starting_cd = this.ability.GetSpecialValueFor("starting_cd");
            this.vision_radius = this.ability.GetSpecialValueFor("vision_radius");
            this.ability.StartCooldown(this.starting_cd);
            this.StartIntervalThink(3);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (!this.ability.IsCooldownReady()) {
                return undefined;
            }
            if (this.caster.PassivesDisabled()) {
                return undefined;
            }
            // if (IsNearFriendlyClass(this.caster, 1360, "ent_dota_fountain")) {
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, 50000, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (enemy.HasModifier(this.modifier_contract)) {
                    return;
                }
            }
            if (!enemies[0]) {
                return;
            }
            let contract_enemy = enemies[0];
            let contract_projectile;
            contract_projectile = {
                Target: contract_enemy,
                Source: this.caster,
                Ability: this.ability,
                EffectName: this.particle_projectile,
                iMoveSpeed: this.projectile_speed,
                bDodgeable: false,
                bVisibleToEnemies: true,
                bReplaceExisting: false,
                bProvidesVision: true,
                iVisionRadius: this.vision_radius,
                iVisionTeamNumber: this.caster.GetTeamNumber()
            }
            ProjectileManager.CreateTrackingProjectile(contract_projectile);
            // }
        }
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_headhunter_buff_handler extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_headhunter_debuff_handler extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public particle_contract: any;
    public modifier_contract_buff: any;
    public track_debuff: any;
    public track_ability_name: any;
    public modifier_dummy: any;
    public gold_minimum: any;
    public contract_vision_timer: number;
    public contract_vision_linger: any;
    public vision_radius: number;
    public contract_gold_mult: any;
    public projectile_speed: number;
    public particle_contract_fx: any;
    public time_passed: number;
    public track_ability: any;
    public contract_gold: any;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.particle_contract = "particles/hero/bounty_hunter/bounty_hunter_headhunter_scroll.vpcf";
            this.modifier_contract_buff = "modifier_imba_headhunter_buff_handler";
            this.track_debuff = "modifier_imba_track_debuff_mark";
            this.track_ability_name = "imba_bounty_hunter_track";
            this.modifier_dummy = "modifier_imba_headhunter_debuff_illu";
            this.gold_minimum = this.ability.GetSpecialValueFor("gold_minimum");
            this.contract_vision_timer = this.ability.GetSpecialValueFor("contract_vision_timer");
            this.contract_vision_linger = this.ability.GetSpecialValueFor("contract_vision_linger");
            this.vision_radius = this.ability.GetSpecialValueFor("vision_radius");
            this.contract_gold_mult = this.ability.GetSpecialValueFor("contract_gold_mult");
            this.projectile_speed = this.ability.GetSpecialValueFor("projectile_speed");
            this.particle_contract_fx = ParticleManager.CreateParticleForTeam(this.particle_contract, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.parent, this.caster.GetTeamNumber());
            ParticleManager.SetParticleControl(this.particle_contract_fx, 0, this.parent.GetAbsOrigin());
            ParticleManager.SetParticleControl(this.particle_contract_fx, 2, this.parent.GetAbsOrigin());
            this.AddParticle(this.particle_contract_fx, false, false, -1, false, true);
            this.time_passed = 0;
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (!this.GetAbilityPlus()) {
                this.StartIntervalThink(-1);
                this.Destroy();
                return;
            }
            let heroes = FindUnitsInRadius(this.parent.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, hero] of GameFunc.iPair(heroes)) {
                if (this.parent.GetPlayerID() == hero.GetPlayerID() && this.parent.GetUnitName() == hero.GetUnitName() && hero.IsIllusion()) {
                    hero.AddNewModifier(this.caster, this.ability, this.modifier_dummy, {
                        duration: this.GetRemainingTime()
                    });
                }
            }
            this.time_passed = this.time_passed + 0.1;
            if (this.time_passed >= this.contract_vision_timer) {
                this.time_passed = 0;
                ProjectileManager.CreateTrackingProjectile({
                    Target: this.parent,
                    Source: this.caster,
                    Ability: this.ability,
                    EffectName: "particles/units/heroes/hero_bounty_hunter/bounty_hunter_track_cast.vpcf",
                    iMoveSpeed: this.projectile_speed,
                    bDodgeable: false,
                    bVisibleToEnemies: false,
                    bReplaceExisting: false
                });
                AddFOWViewer(this.caster.GetTeamNumber(), this.parent.GetAbsOrigin(), this.vision_radius, this.contract_vision_linger, false);
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_HERO_KILLED
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_HERO_KILLED)
    CC_OnHeroKilled(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            let target = keys.target;
            if (this.parent == target) {
                if (this.caster == attacker || this.parent.HasModifier(this.track_debuff)) {
                    if (this.caster.HasAbility(this.track_ability_name)) {
                        this.track_ability = this.caster.findAbliityPlus<imba_bounty_hunter_track>("imba_bounty_hunter_track");
                        if (this.track_ability.GetLevel() > 0) {
                            this.contract_gold = this.track_ability.GetSpecialValueFor("bonus_gold_allies");
                        }
                    }
                    if (!this.contract_gold) {
                        this.contract_gold = this.gold_minimum;
                    }
                    this.contract_gold = this.contract_gold * this.contract_gold_mult;
                    let playerroot = GGameScene.GetPlayer(this.caster.GetPlayerID());
                    playerroot.PlayerDataComp().ModifyGold(this.contract_gold, true, EDOTA_ModifyGold_Reason.DOTA_ModifyGold_Unspecified);
                    SendOverheadEventMessage(PlayerResource.GetPlayer(playerroot.BelongPlayerid), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_GOLD, this.caster, this.contract_gold, undefined);
                    if (this.caster.HasModifier(this.modifier_contract_buff)) {
                        this.caster.RemoveModifierByName(this.modifier_contract_buff);
                    }
                }
                this.Destroy();
            }
        }
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_headhunter_debuff_illu extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public particle_contract: any;
    public particle_contract_fx: any;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.parent = this.GetParentPlus();
            this.particle_contract = "particles/hero/bounty_hunter/bounty_hunter_headhunter_scroll.vpcf";
            this.particle_contract_fx = ParticleManager.CreateParticleForTeam(this.particle_contract, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.parent, this.caster.GetTeamNumber());
            ParticleManager.SetParticleControl(this.particle_contract_fx, 0, this.parent.GetAbsOrigin());
            ParticleManager.SetParticleControl(this.particle_contract_fx, 2, this.parent.GetAbsOrigin());
            this.AddParticle(this.particle_contract_fx, false, false, -1, false, true);
        }
    }
    IsDebuff(): boolean {
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
export class modifier_special_bonus_imba_bounty_hunter_6 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_bounty_hunter_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_bounty_hunter_2 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_bounty_hunter_7 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_bounty_hunter_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_bounty_hunter_9 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_bounty_hunter_8 extends BaseModifier_Plus {
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
