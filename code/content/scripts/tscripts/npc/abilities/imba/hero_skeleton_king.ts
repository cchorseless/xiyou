
import { GameFunc } from "../../../GameFunc";
import { AI_ability } from "../../../ai/AI_ability";
import { ResHelper } from "../../../helper/ResHelper";
import { GameServiceConfig } from "../../../shared/GameServiceConfig";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

function LaunchWraithblastProjectile(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus,
    source: IBaseNpc_Plus, target: IBaseNpc_Plus, main: 0 | 1, bTalent = false) {
    let particle_projectile = "particles/units/heroes/hero_skeletonking/skeletonking_hellfireblast.vpcf";
    let projectile_speed = ability.GetSpecialValueFor("projectile_speed");
    let wraithblast_projectile: CreateTrackingProjectileOptions = {
        Target: target,
        Source: source,
        Ability: ability,
        EffectName: particle_projectile,
        iMoveSpeed: projectile_speed,
        bDodgeable: true,
        bVisibleToEnemies: true,
        bReplaceExisting: false,
        bProvidesVision: false,
        iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_ATTACK_2,
        ExtraData: {
            main_blast: main,
            bTalent: bTalent || false
        }
    }
    if (bTalent) {
        wraithblast_projectile.iMoveSpeed = 500;
    }
    ProjectileManager.CreateTrackingProjectile(wraithblast_projectile);
}
@registerModifier()
export class modifier_special_bonus_imba_skeleton_king_2 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().findAbliityPlus<imba_skeleton_king_kingdom_come>("imba_skeleton_king_kingdom_come")) {
            this.GetParentPlus().findAbliityPlus<imba_skeleton_king_kingdom_come>("imba_skeleton_king_kingdom_come").GetBehavior();
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_skeleton_king_5 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().findAbliityPlus<imba_skeleton_king_reincarnation>("imba_skeleton_king_reincarnation")) {
            this.GetParentPlus().findAbliityPlus<imba_skeleton_king_reincarnation>("imba_skeleton_king_reincarnation").GetBehavior();
        }
    }
}
@registerAbility()
export class imba_skeleton_king_hellfire_blast extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("secondary_targets_radius");
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = this.GetCursorTarget();
        let sound_cast = "Hero_SkeletonKing.Hellfire_Blast";
        let cast_response = {
            "1": "skeleton_king_wraith_ability_hellfire_05",
            "2": "skeleton_king_wraith_ability_hellfire_06",
            "3": "skeleton_king_wraith_ability_hellfire_07"
        }
        let rare_cast_response = {
            "1": "skeleton_king_wraith_ability_hellfire_03",
            "2": "skeleton_king_wraith_ability_hellfire_04"
        }
        let particle_warmup = "particles/units/heroes/hero_skeletonking/skeletonking_hellfireblast_warmup.vpcf";
        if (RollPercentage(5)) {
            EmitSoundOn(GFuncRandom.RandomValue(rare_cast_response), caster);
        } else if (RollPercentage(75)) {
            EmitSoundOn(GFuncRandom.RandomValue(cast_response), caster);
        }
        EmitSoundOn(sound_cast, caster);
        let particle_warmup_fx = ResHelper.CreateParticleEx(particle_warmup, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, caster, caster);
        ParticleManager.SetParticleControlEnt(particle_warmup_fx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", caster.GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(particle_warmup_fx);
        LaunchWraithblastProjectile(caster, ability, caster, target, 1);
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, extra_data: any): boolean | void {
        if (!target) {
            return undefined;
        }
        let caster = this.GetCasterPlus();
        let ability = this;
        let kill_response = "skeleton_king_wraith_ability_hellfire_01";
        let sound_hit = "Hero_SkeletonKing.Hellfire_BlastImpact";
        let modifier_stun = "modifier_imba_hellfire_blast_stun";
        let modifier_debuff = "modifier_imba_hellfire_blast_debuff";
        let main_target_stun_duration = ability.GetSpecialValueFor("main_target_stun_duration");
        let damage = ability.GetSpecialValueFor("damage");
        let secondary_targets_radius = ability.GetSpecialValueFor("secondary_targets_radius");
        let secondary_target_stun_duration = ability.GetSpecialValueFor("secondary_target_stun_duration");
        let debuff_duration = ability.GetSpecialValueFor("debuff_duration");
        let projectile_speed = ability.GetSpecialValueFor("projectile_speed");
        EmitSoundOn(sound_hit, caster);
        if (target.IsMagicImmune()) {
            return undefined;
        }
        if (extra_data.main_blast == 1) {
            if (target.GetTeam() != caster.GetTeam()) {
                if (target.TriggerSpellAbsorb(ability)) {
                    return undefined;
                }
            }
            if (caster.HasTalent("special_bonus_imba_skeleton_king_3")) {
                target.AddNewModifier(caster, ability, "modifier_imba_hellfire_blast_debuff_talent", {
                    duration: caster.GetTalentValue("special_bonus_imba_skeleton_king_3", "duration") * (1 - target.GetStatusResistance())
                });
            }
            let damageTable = {
                victim: target,
                attacker: caster,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: ability
            }
            ApplyDamage(damageTable);
            target.AddNewModifier(caster, ability, modifier_stun, {
                duration: main_target_stun_duration * (1 - target.GetStatusResistance())
            });
            if (extra_data.bTalent == 0) {
                let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, secondary_targets_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    if (enemy != target) {
                        LaunchWraithblastProjectile(caster, ability, target, enemy, 0);
                    }
                }
            }
        } else {
            target.AddNewModifier(caster, ability, modifier_stun, {
                duration: secondary_target_stun_duration * (1 - target.GetStatusResistance())
            });
        }
        this.AddTimer(FrameTime(), () => {
            if (!target.IsAlive()) {
                EmitSoundOn(kill_response, caster);
            }
        });
        target.AddNewModifier(caster, ability, modifier_debuff, {
            duration: debuff_duration * (1 - target.GetStatusResistance())
        });
        if (caster.HasTalent("special_bonus_imba_skeleton_king_7") && !extra_data.bTalent) {
            let direction = (target.GetAbsOrigin() - caster.GetAbsOrigin() as Vector).Normalized();
            let distance = (target.GetAbsOrigin() - caster.GetAbsOrigin() as Vector).Length2D();
            let summon_point = caster.GetAbsOrigin() + direction * distance - 100 as Vector;
            let duration = caster.findAbliityPlus<imba_skeleton_king_kingdom_come>("imba_skeleton_king_kingdom_come").GetSpecialValueFor("wraith_duration");
            let wraith = caster.CreateSummon("npc_imba_skeleton_king_wraith", summon_point, duration, true);
            let playerid = caster.GetPlayerID();
            if (playerid) {
                // wraith.SetControllableByPlayer(playerid, true);
            }
            wraith.SetBaseMaxHealth(target.GetBaseMaxHealth());
            wraith.SetMaxHealth(target.GetMaxHealth());
            wraith.SetHealth(wraith.GetMaxHealth());
            ResolveNPCPositions(target.GetAbsOrigin(), 164);
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_hellfire_blast_stun extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_stunned.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_hellfire_blast_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public particle_debuff: any;
    public particle_lifesteal: any;
    public ms_slow_pct: number;
    public damage_per_second: number;
    public attacker_lifesteal_pct: number;
    public damage_interval: number;
    public particle_debuff_fx: any;
    public particle_lifesteal_fx: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.particle_debuff = "particles/units/heroes/hero_skeletonking/skeletonking_hellfireblast_debuff.vpcf";
        this.particle_lifesteal = "particles/hero/skeleton_king/wraithblast_lifesteal.vpcf";
        this.ms_slow_pct = this.ability.GetSpecialValueFor("ms_slow_pct");
        this.damage_per_second = this.ability.GetSpecialValueFor("damage_per_second");
        this.attacker_lifesteal_pct = this.ability.GetSpecialValueFor("attacker_lifesteal_pct");
        this.damage_interval = this.ability.GetSpecialValueFor("damage_interval");
        if (IsServer()) {
            this.particle_debuff_fx = ResHelper.CreateParticleEx(this.particle_debuff, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent, this.caster);
            ParticleManager.SetParticleControl(this.particle_debuff_fx, 0, this.parent.GetAbsOrigin());
            this.AddParticle(this.particle_debuff_fx, false, false, -1, false, false);
            this.SetStackCount(this.ms_slow_pct * (1 - this.parent.GetStatusResistance()));
            this.StartIntervalThink(this.damage_interval);
        }
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
    IgnoreTenacity() {
        return true;
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let damage = this.damage_per_second * this.damage_interval;
            let damageTable = {
                victim: this.parent,
                attacker: this.caster,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: this.ability
            }
            ApplyDamage(damageTable);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetStackCount() * (-1);
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        let attacker = keys.attacker;
        let target = keys.target;
        let damage = keys.damage;
        if (this.parent == target) {
            if (attacker.GetTeamNumber() == target.GetTeamNumber()) {
                return undefined;
            }
            if (attacker.IsBuilding()) {
                return undefined;
            }
            this.particle_lifesteal_fx = ResHelper.CreateParticleEx(this.particle_lifesteal, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, attacker, this.caster);
            ParticleManager.SetParticleControl(this.particle_lifesteal_fx, 0, attacker.GetAbsOrigin());
            ParticleManager.SetParticleControl(this.particle_lifesteal_fx, 1, attacker.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(this.particle_lifesteal_fx);
            if (attacker.IsIllusion()) {
                return undefined;
            }
            let heal_amount = damage * this.attacker_lifesteal_pct * 0.01;
            attacker.ApplyHeal(heal_amount, this.GetAbilityPlus());
        }
    }
}
@registerModifier()
export class modifier_imba_hellfire_blast_debuff_talent extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/hero/skeleton_king/skeleton_king_wraithblast_talent_debuff.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.OnIntervalThink();
        this.StartIntervalThink(1.0);
    }
    OnIntervalThink(): void {
        if (!IsServer() || !this.GetParentPlus().IsAlive()) {
            return;
        }
        let num = 0;
        let caster = this.GetCasterPlus();
        let target = this.GetParentPlus();
        let radius = caster.GetTalentValue("special_bonus_imba_skeleton_king_3", "radius");
        let base_dmg = caster.GetTalentValue("special_bonus_imba_skeleton_king_3", "base_damge_per_sec");
        let additional_dmg = caster.GetTalentValue("special_bonus_imba_skeleton_king_3", "add_target_dmg");
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            let modifier = enemy.FindModifierByNameAndCaster("modifier_imba_hellfire_blast_debuff", this.GetCasterPlus());
            if (modifier && enemy != target) {
                num = num + 1;
            }
        }
        let damage = base_dmg + num * additional_dmg;
        let damage_targets = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, damage_target] of GameFunc.iPair(damage_targets)) {
            let damageTable = {
                victim: damage_target,
                attacker: caster,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: this.GetAbilityPlus()
            }
            ApplyDamage(damageTable);
        }
    }
}
@registerAbility()
export class imba_skeleton_king_vampiric_aura extends BaseAbility_Plus {
    public toggle_state: any;
    OnToggle(): void {
        return undefined;
    }
    IsStealable(): boolean {
        return false;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_vampiric_aura";
    }
    OnOwnerSpawned(): void {
        if (this.toggle_state) {
            this.ToggleAbility();
        }
    }
    OnOwnerDied(): void {
        this.toggle_state = this.GetToggleState();
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        if (!this.GetToggleState()) {
            this.ToggleAbility();
        }
        return false
    }
}
@registerModifier()
export class modifier_imba_vampiric_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public radius: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.radius = this.ability.GetSpecialValueFor("radius");
    }
    AllowIllusionDuplicate(): boolean {
        return true;
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
    GetAuraRadius(): number {
        return this.radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        if ((this.ability.GetToggleState() && !target.IsConsideredHero()) || target.IsRangedAttacker()) {
            return true;
        }
    }
    GetModifierAura(): string {
        return "modifier_imba_vampiric_aura_buff";
    }
    IsAura(): boolean {
        if (!this.caster || this.caster.IsNull() || this.caster.PassivesDisabled()) {
            return false;
        }
        return true;
    }
}
@registerModifier()
export class modifier_imba_vampiric_aura_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public particle_lifesteal: any;
    public particle_spellsteal: any;
    public radius: number;
    public lifesteal_pct: number;
    public spellsteal_pct: number;
    public caster_heal: any;
    public heal_delay: number;
    public damage: number;
    public self_bonus: number;
    public delay_particle_time: number;
    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.particle_lifesteal = "particles/units/heroes/hero_skeletonking/skeleton_king_vampiric_aura_lifesteal.vpcf";
        this.particle_spellsteal = "particles/hero/skeleton_king/skeleton_king_vampiric_aura_lifesteal.vpcf";
        this.radius = this.ability.GetSpecialValueFor("radius");
        this.lifesteal_pct = this.ability.GetSpecialValueFor("lifesteal_pct");
        this.spellsteal_pct = this.ability.GetSpecialValueFor("spellsteal_pct");
        this.caster_heal = this.ability.GetSpecialValueFor("caster_heal");
        this.heal_delay = this.ability.GetSpecialValueFor("heal_delay");
        this.damage = this.ability.GetSpecialValueFor("damage");
        this.self_bonus = this.ability.GetSpecialValueFor("self_bonus");
    }

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
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_BONUS,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_DAMAGE_BONUS)
    CC_GetModifierPreAttack_BonusDamage(): number {
        if (!this.GetParentPlus().HasModifier("modifier_imba_mortal_strike_skeleton") && !this.GetParentPlus().HasModifier("modifier_mortal_strike_skeleton")) {
            return this.damage;
        } else {
            return this.damage * 0.5;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            let damage = keys.damage;
            let damage_type = keys.damage_type;
            let target = keys.unit;
            if (this.parent == attacker) {
                let heal_amount = 0;
                if (attacker.GetTeamNumber() == target.GetTeamNumber()) {
                    return undefined;
                }
                if (target.IsBuilding() || target.IsOther()) {
                    return undefined;
                }
                if (bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) == DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) {
                    return undefined;
                }
                if (damage_type == DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL) {
                    let particle_lifesteal_fx = ResHelper.CreateParticleEx(this.particle_lifesteal, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, attacker, this.caster);
                    ParticleManager.SetParticleControlEnt(particle_lifesteal_fx, 0, attacker, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", attacker.GetAbsOrigin(), true);
                    ParticleManager.SetParticleControlEnt(particle_lifesteal_fx, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                    ParticleManager.ReleaseParticleIndex(particle_lifesteal_fx);
                    if (attacker.IsIllusion()) {
                        return undefined;
                    }
                    let lifesteal_pct = this.lifesteal_pct + this.caster.GetTalentValue("special_bonus_imba_skeleton_king_9");
                    heal_amount = damage * lifesteal_pct * 0.01;
                    if (this.parent == this.caster) {
                        heal_amount = heal_amount * this.self_bonus;
                    }
                    this.parent.ApplyHeal(heal_amount, this.GetAbilityPlus());
                } else {
                    if (!this.delay_particle_time || (GameRules.GetGameTime() - this.delay_particle_time > 1)) {
                        let particle_spellsteal_fx = ResHelper.CreateParticleEx(this.particle_spellsteal, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, attacker, this.caster);
                        ParticleManager.SetParticleControlEnt(particle_spellsteal_fx, 0, attacker, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", attacker.GetAbsOrigin(), true);
                        ParticleManager.SetParticleControlEnt(particle_spellsteal_fx, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                        ParticleManager.ReleaseParticleIndex(particle_spellsteal_fx);
                        this.delay_particle_time = GameRules.GetGameTime();
                    }
                    if (attacker.IsIllusion()) {
                        return undefined;
                    }
                    heal_amount = damage * this.spellsteal_pct * 0.01;
                    if (this.parent == this.caster) {
                        heal_amount = heal_amount * this.self_bonus;
                    }
                    this.parent.ApplyHeal(heal_amount, this.GetAbilityPlus());
                }
                this.AddTimer(this.heal_delay, () => {
                    let casters = FindUnitsInRadius(this.parent.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_ANY_ORDER, false);
                    for (const [_, caster] of GameFunc.iPair(casters)) {
                        if (caster.GetUnitName() == this.caster.GetUnitName() && attacker.GetUnitName() != this.caster.GetUnitName()) {
                            if (heal_amount > 0 && caster != attacker) {
                                let particle_lifesteal_fx = ResHelper.CreateParticleEx(this.particle_lifesteal, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, caster, this.caster);
                                ParticleManager.SetParticleControlEnt(particle_lifesteal_fx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true);
                                ParticleManager.SetParticleControlEnt(particle_lifesteal_fx, 1, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
                                ParticleManager.ReleaseParticleIndex(particle_lifesteal_fx);
                                if (caster.IsRealUnit()) {
                                    let caster_heal = heal_amount * this.caster_heal * 0.01;
                                    caster.ApplyHeal(caster_heal, this.GetAbilityPlus());
                                }
                            }
                        }
                    }
                });
            }
            if (this.parent == target && target != this.caster && this.GetCasterPlus().HasTalent("special_bonus_imba_skeleton_king_1")) {
                let heal_amount = 0;
                if (attacker.GetTeamNumber() == target.GetTeamNumber()) {
                    return undefined;
                }
                if (attacker.IsBuilding() || attacker.IsOther()) {
                    return undefined;
                }
                if (target.IsIllusion()) {
                    return undefined;
                }
                heal_amount = damage;
                this.AddTimer(this.heal_delay, () => {
                    if (!this.caster.IsAlive()) {
                        return undefined;
                    }
                    let casters = FindUnitsInRadius(this.parent.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_ANY_ORDER, false);
                    for (const [_, caster] of GameFunc.iPair(casters)) {
                        if (caster.GetUnitName() == this.caster.GetUnitName() && attacker.GetUnitName() != this.caster.GetUnitName()) {
                            if (heal_amount > 0 && caster != attacker) {
                                let particle_lifesteal_fx = ResHelper.CreateParticleEx(this.particle_lifesteal, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, caster, this.caster);
                                ParticleManager.SetParticleControlEnt(particle_lifesteal_fx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true);
                                ParticleManager.SetParticleControlEnt(particle_lifesteal_fx, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
                                ParticleManager.ReleaseParticleIndex(particle_lifesteal_fx);
                                if (caster.IsRealUnit()) {
                                    let caster_heal = heal_amount * this.caster.GetTalentValue("special_bonus_imba_skeleton_king_1") * 0.01;
                                    caster.ApplyHeal(caster_heal, this.GetAbilityPlus());
                                }
                            }
                        }
                    }
                });
            }
        }
    }
}
@registerAbility()
export class imba_skeleton_king_mortal_strike extends BaseAbility_Plus {
    public caster: IBaseNpc_Plus;
    public skeleton_duration: number;
    public max_skeleton_charges: any;
    public spawn_interval: number;
    public reincarnate_time: number;
    public skeletons_per_charge: any;
    GetIntrinsicModifierName(): string {
        return "modifier_imba_mortal_strike";
    }
    OnSpellStart(): void {
        this.caster = this.GetCasterPlus();
        this.skeleton_duration = this.GetSpecialValueFor("skeleton_duration");
        this.max_skeleton_charges = this.GetSpecialValueFor("max_skeleton_charges");
        this.spawn_interval = this.GetSpecialValueFor("spawn_interval");
        this.reincarnate_time = this.GetSpecialValueFor("reincarnate_time");
        this.skeletons_per_charge = this.GetSpecialValueFor("skeletons_per_charge");
        if (this.caster.HasModifier("modifier_imba_mortal_strike")) {
            let skeleton: IBaseNpc_Plus = undefined;
            let skeleton_modifier = this.caster.findBuff<modifier_imba_mortal_strike>("modifier_imba_mortal_strike");
            for (let unit = 0; unit <= skeleton_modifier.GetStackCount() - 1; unit++) {
                this.AddTimer(unit * this.spawn_interval, () => {
                    for (let units_per_charge = 1; units_per_charge <= this.skeletons_per_charge; units_per_charge++) {
                        skeleton = this.caster.CreateSummon("npc_imba_skeleton_king_skeleton_warrior", this.caster.GetAbsOrigin() + RandomVector(100) as Vector, this.skeleton_duration, true);
                        skeleton.AddNewModifier(this.caster, this, "modifier_imba_mortal_strike_skeleton", {
                            duration: this.skeleton_duration - FrameTime()
                        });
                        // skeleton.SetControllableByPlayer(this.caster.GetPlayerID(), true);
                        skeleton.SetOwner(this.caster);
                        ResolveNPCPositions(skeleton.GetAbsOrigin(), skeleton.GetHullRadius());
                        skeleton.SetMaximumGoldBounty(0);
                        skeleton.SetMinimumGoldBounty(0);
                        skeleton.SetDeathXP(0);
                        skeleton.TempData().fresh = true;
                        this.AddTimer(FrameTime(), () => {
                            if (this.caster.GetTeam() == DOTATeam_t.DOTA_TEAM_GOODGUYS) {
                                skeleton.MoveToPositionAggressive(Vector(5654, 4939, 0));
                            } else if (this.caster.GetTeam() == DOTATeam_t.DOTA_TEAM_BADGUYS) {
                                skeleton.MoveToPositionAggressive(Vector(-5864, -5340, 0));
                            }
                        });
                    }
                    skeleton_modifier.skeleton_counter = skeleton_modifier.skeleton_counter - 1;
                    skeleton_modifier.DecrementStackCount();
                    return;
                });
            }
        }
        this.caster.EmitSound("Hero_SkeletonKing.MortalStrike.Cast");
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.NO_TARGET_if_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_mortal_strike_skeleton extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public skeleton_duration: number;
    public max_skeleton_charges: any;
    public spawn_interval: number;
    public reincarnate_time: number;
    public remaining_time: number;
    public skeleton: IBaseNpc_Plus;
    RemoveOnDeath(): boolean {
        return;
    }
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.skeleton_duration = this.ability.GetSpecialValueFor("skeleton_duration");
        this.max_skeleton_charges = this.ability.GetSpecialValueFor("max_skeleton_charges");
        this.spawn_interval = this.ability.GetSpecialValueFor("spawn_interval");
        this.reincarnate_time = this.ability.GetSpecialValueFor("reincarnate_time");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (this.parent == keys.unit && this.GetParentPlus().TempData().fresh && this.parent != keys.attacker) {
            this.remaining_time = math.max(this.parent.findBuff("modifier_kill").GetRemainingTime() - this.reincarnate_time, 0);
            this.StartIntervalThink(this.reincarnate_time);
        }
    }
    OnIntervalThink(): void {
        this.skeleton = this.caster.CreateSummon("npc_imba_skeleton_king_skeleton_warrior", this.parent.GetOrigin(), this.remaining_time, true);
        this.skeleton.AddNewModifier(this.caster, this.ability, "modifier_imba_mortal_strike_skeleton", {
            duration: this.remaining_time - FrameTime()
        });
        // this.skeleton.SetControllableByPlayer(this.caster.GetPlayerID(), true);
        this.skeleton.SetOwner(this.caster);
        this.skeleton.TempData().fresh = false;
        GTimerHelper.AddFrameTimer(1, GHandler.create(this, () => {
            if (this.caster.GetTeamNumber() == DOTATeam_t.DOTA_TEAM_GOODGUYS) {
                this.skeleton.MoveToPositionAggressive(Vector(5654, 4939, 0));
            } else if (this.caster.GetTeamNumber() == DOTATeam_t.DOTA_TEAM_BADGUYS) {
                this.skeleton.MoveToPositionAggressive(Vector(-5864, -5340, 0));
            }
            return 1;
        }));
        this.StartIntervalThink(-1);
    }
    BeRemoved(): void {
        if (!IsServer()) {
            return;
        }
        this.parent.ForceKill(false);
    }
}
@registerModifier()
export class modifier_imba_mortal_strike extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public modifier_health: any;
    public modifier_strength: any;
    public crit_chance: number;
    public crit_damage_heroes: number;
    public crit_damage_creeps: number;
    public bonus_health_pct: number;
    public bonus_health_duration: number;
    public bonus_health_hero_mult: number;
    public stack_value: number;
    public skeleton_duration: number;
    public max_skeleton_charges: any;
    public spawn_interval: number;
    public reincarnate_time: number;
    public skeleton_counter: number;
    public mortal_critical_strike: any;
    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.modifier_health = "modifier_imba_mortal_strike_buff";
        this.modifier_strength = "modifier_imba_mortal_strike_buff_talent";
        this.crit_chance = this.ability.GetSpecialValueFor("crit_chance");
        this.crit_damage_heroes = this.ability.GetSpecialValueFor("crit_damage_heroes");
        this.crit_damage_creeps = this.ability.GetSpecialValueFor("crit_damage_creeps");
        this.bonus_health_pct = this.ability.GetSpecialValueFor("bonus_health_pct");
        this.bonus_health_duration = this.ability.GetSpecialValueFor("bonus_health_duration");
        this.bonus_health_hero_mult = this.ability.GetSpecialValueFor("bonus_health_hero_mult");
        this.stack_value = this.ability.GetSpecialValueFor("stack_value");
        this.skeleton_duration = this.ability.GetSpecialValueFor("skeleton_duration");
        this.max_skeleton_charges = this.ability.GetSpecialValueFor("max_skeleton_charges");
        this.spawn_interval = this.ability.GetSpecialValueFor("spawn_interval");
        this.reincarnate_time = this.ability.GetSpecialValueFor("reincarnate_time");
        this.skeleton_counter = this.skeleton_counter || 0;
    }

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
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            3: Enum_MODIFIER_EVENT.ON_DEATH
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE)
    CC_GetModifierPreAttack_CriticalStrike(keys: ModifierAttackEvent): number {
        if (IsServer()) {
            let attacker = keys.attacker;
            let target = keys.target;
            if (attacker == this.caster) {
                if (this.caster.PassivesDisabled()) {
                    return undefined;
                }
                if (target.GetTeamNumber() == this.caster.GetTeamNumber()) {
                    return undefined;
                }
                if (GFuncRandom.PRD(this.crit_chance, this)) {
                    this.mortal_critical_strike = true;
                    this.AddTimer(this.caster.GetAttackSpeed(), () => {
                        this.mortal_critical_strike = false;
                    });
                    this.caster.EmitSound("Hero_SkeletonKing.CriticalStrike");
                    if (target.IsRealUnit()) {
                        return this.crit_damage_heroes;
                    } else {
                        return this.crit_damage_creeps;
                    }
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            let target = keys.target;
            let damage = keys.damage;
            if (attacker == this.caster) {
                if (!this.mortal_critical_strike) {
                    return undefined;
                }
                this.mortal_critical_strike = false;
                let bonus_health_pct = this.bonus_health_pct;
                let new_stacks = damage * bonus_health_pct * 0.01;
                if (target.IsRealUnit()) {
                    new_stacks = new_stacks * this.bonus_health_hero_mult;
                }
                new_stacks = math.ceil(new_stacks / this.stack_value);
                let modifier_health_handler = this.caster.AddNewModifier(this.caster, this.ability, this.modifier_health, {
                    duration: this.bonus_health_duration
                });
                if (modifier_health_handler) {
                    for (let i = 0; i < new_stacks; i++) {
                        modifier_health_handler.IncrementStackCount();
                        modifier_health_handler.ForceRefresh();
                    }
                }
                if (this.caster.HasTalent("special_bonus_imba_skeleton_king_8")) {
                    if (target.IsRealUnit()) {
                        if (!this.caster.HasModifier(this.modifier_strength)) {
                            this.caster.AddNewModifier(this.caster, this.ability, this.modifier_strength, {
                                duration: this.bonus_health_duration
                            });
                        }
                        let modifier_strength_handler = this.caster.FindModifierByName(this.modifier_strength);
                        if (modifier_strength_handler) {
                            let strength_per_crit = this.caster.GetTalentValue("special_bonus_imba_skeleton_king_8");
                            for (let i = 0; i < strength_per_crit; i++) {
                                modifier_strength_handler.IncrementStackCount();
                                modifier_strength_handler.ForceRefresh();
                            }
                        }
                    }
                }
                if (target.IsCreep() && !target.IsAncient()) {
                    let damageTable = {
                        victim: target,
                        attacker: attacker,
                        damage: target.GetHealth() * (1 + 0.05 * math.abs(target.GetPhysicalArmorValue(false))) + 1,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                        ability: this.GetAbilityPlus()
                    }
                    ApplyDamage(damageTable);
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (this.caster == keys.attacker /**&& (!keys.unit.WillReincarnate || keys.unit.WillReincarnate && !keys.unit.WillReincarnate())*/) {
            this.skeleton_counter = math.min(this.skeleton_counter + 0.5, this.max_skeleton_charges);
            this.SetStackCount(this.skeleton_counter);
        }
    }
}
@registerModifier()
export class modifier_imba_mortal_strike_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public bonus_health_duration: number;
    public stack_value: number;
    public stacks_table: number[];
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.bonus_health_duration = this.ability.GetSpecialValueFor("bonus_health_duration");
            this.stack_value = this.ability.GetSpecialValueFor("stack_value");
            this.stacks_table = []
            this.StartIntervalThink(0.1);
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (GameFunc.GetCount(this.stacks_table) > 0) {
                for (let i = GameFunc.GetCount(this.stacks_table) - 1; i >= 0; i--) {
                    if (this.stacks_table[i] + this.bonus_health_duration < GameRules.GetGameTime()) {
                        this.stacks_table.splice(i, 1);
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
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HP_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_BONUS)
    CC_GetModifierHealthBonus(): number {
        if (this == undefined || this.caster == undefined) {
            return undefined;
        }
        if (this.caster.IsIllusion()) {
            return undefined;
        }
        return this.GetStackCount() * this.stack_value;
    }
}
@registerModifier()
export class modifier_imba_mortal_strike_buff_talent extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public bonus_health_duration: number;
    public stack_value: number;
    public stacks_table: number[];
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.bonus_health_duration = this.ability.GetSpecialValueFor("bonus_health_duration");
            this.stack_value = this.ability.GetSpecialValueFor("stack_value");
            this.stacks_table = []
            this.StartIntervalThink(0.1);
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (GameFunc.GetCount(this.stacks_table) > 0) {
                for (let i = GameFunc.GetCount(this.stacks_table) - 1; i >= 0; i--) {
                    if (this.stacks_table[i] + this.bonus_health_duration < GameRules.GetGameTime()) {
                        this.stacks_table.splice(i, 1);
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
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        if (this.caster.IsIllusion()) {
            return undefined;
        }
        if (this.caster.HasTalent("special_bonus_imba_skeleton_king_8")) {
            let stacks = this.GetStackCount();
            return stacks;
        }
    }
}
@registerAbility()
export class imba_skeleton_king_reincarnation extends BaseAbility_Plus {
    GetManaCost(level: number): number {
        if (!this.GetCasterPlus().HasTalent("special_bonus_imba_skeleton_king_6")) {
            return this.GetSpecialValueFor("reincarnate_mana_cost");
        } else {
            return this.GetCasterPlus().GetTalentValue("special_bonus_imba_skeleton_king_6");
        }
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_skeleton_king_5")) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
        }
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE;
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasAbility("special_bonus_imba_skeleton_king_5") && this.GetCasterPlus().findAbliityPlus("special_bonus_imba_skeleton_king_5").IsTrained() && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_skeleton_king_5")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_special_bonus_imba_skeleton_king_5", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_skeleton_king_6") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_skeleton_king_6")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_skeleton_king_6"), "modifier_special_bonus_imba_skeleton_king_6", {});
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_reincarnation";
    }
    TheWillOfTheKing(OnDeathKeys: ModifierInstanceEvent, BuffInfo: modifier_imba_reincarnation) {
        let unit = OnDeathKeys.unit;
        // let reincarnate = OnDeathKeys.reincarnate;
        if (/**reincarnate && */(!BuffInfo.caster.HasModifier("modifier_item_imba_aegis"))) {
            BuffInfo.reincarnation_death = true;
            BuffInfo.ability.UseResources(false, false, true);
            if (BuffInfo.caster == unit) {
                let heroes = FindUnitsInRadius(BuffInfo.caster.GetTeamNumber(), BuffInfo.caster.GetAbsOrigin(), undefined, BuffInfo.slow_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, FindOrder.FIND_ANY_ORDER, false);
                if (GameServiceConfig.USE_MEME_SOUNDS && GameFunc.GetCount(heroes) >= PlayerResource.GetPlayerCount() * 0.35) {
                    BuffInfo.caster.EmitSound(BuffInfo.sound_be_back);
                } else {
                    BuffInfo.caster.EmitSound(BuffInfo.sound_death);
                }
            }
            let particle_death_fx = ResHelper.CreateParticleEx(BuffInfo.particle_death, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, OnDeathKeys.unit, OnDeathKeys.unit);
            ParticleManager.SetParticleAlwaysSimulate(particle_death_fx);
            ParticleManager.SetParticleControl(particle_death_fx, 0, OnDeathKeys.unit.GetAbsOrigin());
            ParticleManager.SetParticleControl(particle_death_fx, 1, Vector(BuffInfo.reincarnate_delay, 0, 0));
            ParticleManager.SetParticleControl(particle_death_fx, 11, Vector(200, 0, 0));
            ParticleManager.ReleaseParticleIndex(particle_death_fx);
            if (GameRules.IsDaytime()) {
                AddFOWViewer(BuffInfo.caster.GetTeamNumber(), BuffInfo.caster.GetAbsOrigin(), BuffInfo.caster.GetDayTimeVisionRange(), BuffInfo.reincarnate_delay, true);
            } else {
                AddFOWViewer(BuffInfo.caster.GetTeamNumber(), BuffInfo.caster.GetAbsOrigin(), BuffInfo.caster.GetNightTimeVisionRange(), BuffInfo.reincarnate_delay, true);
            }
            if (BuffInfo.caster.HasTalent("special_bonus_imba_skeleton_king_10")) {
                let hellfire_blast = BuffInfo.caster.findAbliityPlus<imba_skeleton_king_hellfire_blast>("imba_skeleton_king_hellfire_blast");
                if (hellfire_blast && hellfire_blast.IsTrained()) {
                    let enemies = FindUnitsInRadius(BuffInfo.caster.GetTeamNumber(), unit.GetAbsOrigin(), undefined, 900, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                    for (const [_, enemy] of GameFunc.iPair(enemies)) {
                        LaunchWraithblastProjectile(BuffInfo.caster, hellfire_blast, unit, enemy, 1, true);
                    }
                }
            }
        } else {
            BuffInfo.reincarnation_death = false;
        }
    }
}
@registerModifier()
export class modifier_imba_reincarnation extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: imba_skeleton_king_reincarnation;
    public particle_death: string;
    public sound_death: any;
    public sound_reincarnation: any;
    public sound_be_back: any;
    public modifier_wraith: any;
    public reincarnate_delay: number;
    public passive_respawn_haste: any;
    public slow_radius: number;
    public slow_duration: number;
    public scepter_wraith_form_radius: number;
    public can_die: any;
    reincarnation_death: boolean;
    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.particle_death = "particles/units/heroes/hero_skeletonking/skeleton_king_reincarnate.vpcf";
        this.sound_death = "Hero_SkeletonKing.Reincarnate";
        this.sound_reincarnation = "Hero_SkeletonKing.Reincarnate.Stinger";
        this.sound_be_back = "Hero_WraithKing.IllBeBack";
        this.modifier_wraith = "modifier_imba_reincarnation_wraith_form";
        this.reincarnate_delay = this.ability.GetSpecialValueFor("reincarnate_delay");
        this.passive_respawn_haste = this.ability.GetSpecialValueFor("passive_respawn_haste");
        this.slow_radius = this.ability.GetSpecialValueFor("slow_radius");
        this.slow_duration = this.ability.GetSpecialValueFor("slow_duration");
        this.scepter_wraith_form_radius = this.ability.GetSpecialValueFor("scepter_wraith_form_radius");
        if (IsServer()) {
            this.can_die = false;
            this.StartIntervalThink(FrameTime());
        }
    }
    IsHidden(): boolean {
        if (this.GetParentPlus() == this.caster) {
            return true;
        } else {
            return false;
        }
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    OnIntervalThink(): void {
        if (!this.ability || this.ability.IsNull()) {
            this.Destroy();
            return;
        }
        if ((this.ability.IsOwnersManaEnough()) && (this.ability.IsCooldownReady()) && (!this.caster.HasModifier("modifier_item_imba_aegis"))) {
            this.can_die = false;
        } else {
            this.can_die = true;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_skeleton_king_5") && this.GetCasterPlus().IsAlive()) {
            if (CalcDistanceBetweenEntityOBB(this.GetParentPlus(), this.caster) > this.caster.GetTalentValue("special_bonus_imba_skeleton_king_5") || !this.GetCasterPlus().IsAlive() || (this.GetCasterPlus() != this.GetParentPlus() && !this.GetAbilityPlus().GetAutoCastState()) || (this.GetCasterPlus() != this.GetParentPlus() && !this.GetAbilityPlus().IsCooldownReady())) {
                this.Destroy();
                return;
            }
            if (this.GetAbilityPlus().GetAutoCastState() && this.GetAbilityPlus().IsCooldownReady()) {
                let units = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.caster.GetTalentValue("special_bonus_imba_skeleton_king_5"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, unit] of GameFunc.iPair(units)) {
                    if (unit != this.caster) {
                        unit.AddNewModifier(this.caster, this.ability, "modifier_imba_reincarnation", {});
                    }
                }
            }
        }
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.REINCARNATION,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS,
            3: Enum_MODIFIER_EVENT.ON_DEATH,
            4: GPropertyConfig.EMODIFIER_PROPERTY.RESPAWNTIME_STACKING
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.REINCARNATION)
    CC_ReincarnateTime(): number {
        if (IsServer()) {
            if (!this.can_die && this.caster.IsRealUnit()) {
                return this.reincarnate_delay;
            }
            return undefined;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        if (this.reincarnation_death) {
            return "reincarnate";
        }
        return undefined;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            let unit = keys.unit;
            // let reincarnate = keys.reincarnate;
            if (this.GetParentPlus() == unit) {
                this.ability.TheWillOfTheKing(keys, this);
            }
        }
    }
    GetAuraRadius(): number {
        return this.scepter_wraith_form_radius;
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        if (target.HasModifier(this.modifier_wraith) || (target.HasModifier("modifier_imba_phoenix_supernova_scepter_passive") && target.HasScepter() && !target.HasModifier("modifier_imba_phoenix_supernova_scepter_passive_cooldown"))) {
            return true;
        }
        return false;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetModifierAura(): string {
        return "modifier_imba_reincarnation_wraith_form_buff";
    }
    IsAura(): boolean {
        if (!this.caster.IsNull() && this.caster.IsRealUnit() && this.caster.HasScepter() && this.caster == this.GetParentPlus()) {
            return true;
        }
        return false;
    }
}
@registerModifier()
export class modifier_imba_reincarnation_wraith_form_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public modifier_wraith_form: any;
    public scepter_wraith_form_duration: number;
    public max_wraith_form_heroes: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.modifier_wraith_form = "modifier_imba_reincarnation_wraith_form";
        this.scepter_wraith_form_duration = this.ability.GetSpecialValueFor("scepter_wraith_form_duration");
        this.max_wraith_form_heroes = this.ability.GetSpecialValueFor("max_wraith_form_heroes");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MIN_HEALTH,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MIN_HEALTH)
    CC_GetMinHealth(): number {
        return 1;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            let target = keys.unit;
            let damage = keys.damage;
            if (this.parent == target) {
                if (damage >= this.parent.GetHealth()) {
                    if (this.parent.HasModifier("modifier_imba_dazzle_shallow_grave") || this.parent.HasModifier("modifier_imba_dazzle_nothl_protection")) {
                        return undefined;
                    }
                    if (this.parent.HasModifier("modifier_item_imba_aegis")) {
                        this.Destroy();
                        this.parent.Kill(this.ability, attacker);
                        return undefined;
                    }
                    if (this.parent.HasAbility(this.ability.GetAbilityName())) {
                        let reincarnation_ability = this.parent.FindAbilityByName(this.ability.GetAbilityName());
                        if (reincarnation_ability) {
                            if (this.parent.GetMana() >= reincarnation_ability.GetManaCost(-1) && reincarnation_ability.IsCooldownReady()) {
                                this.Destroy();
                                this.parent.Kill(this.ability, attacker);
                                return undefined;
                            }
                        }
                    }
                    let wraith_form_modifier_handler = this.parent.AddNewModifier(this.caster, this.ability, this.modifier_wraith_form, {
                        duration: this.scepter_wraith_form_duration
                    }) as modifier_imba_reincarnation_wraith_form;
                    if (wraith_form_modifier_handler) {
                        wraith_form_modifier_handler.original_killer = attacker;
                        wraith_form_modifier_handler.ability_killer = keys.inflictor as IBaseAbility_Plus;
                        if (keys.inflictor) {
                            if (keys.inflictor.GetAbilityName() == "imba_necrolyte_reapers_scythe") {
                                (keys.inflictor as any).ghost_death = true;
                            }
                        }
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_reincarnation_wraith_form extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public damage_pool: number;
    public max_hp: any;
    public threhold_hp: any;
    original_killer: IBaseNpc_Plus;
    ability_killer: IBaseAbility_Plus;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        if (IsServer()) {
            this.damage_pool = 0;
            this.max_hp = this.parent.GetMaxHealth();
            this.threhold_hp = this.ability.GetSpecialValueFor("scepter_hp_pct_threhold") * 0.01 * this.max_hp;
            this.StartIntervalThink(0.1);
        }
        this.SetStackCount(math.floor(this.GetDuration() + 0.5));
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_MAGICAL,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE,
            4: GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_HEALING,
            5: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE,
            6: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_MAGICAL)
    CC_GetAbsoluteNoDamageMagical(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PHYSICAL)
    CC_GetAbsoluteNoDamagePhysical(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABSOLUTE_NO_DAMAGE_PURE)
    CC_GetAbsoluteNoDamagePure(p_0: ModifierAttackEvent,): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_HEALING)
    CC_GetDisableHealing(): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_SCALE)
    CC_GetModifierModelScale(): number {
        return 105;
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(math.floor(this.GetRemainingTime() + 0.5));
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.unit != this.GetParentPlus()) {
            return;
        }
        if (keys.damage_type == DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL) {
            let source_dmg = keys.original_damage;
            let armor = keys.unit.GetPhysicalArmorValue(false);
            let multiplier = 1 - (0.06 * armor) / (1 + 0.06 * math.abs(armor));
            let actually_dmg = source_dmg * multiplier;
            this.damage_pool = this.damage_pool + actually_dmg;
        } else if (keys.damage_type == DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL) {
            let source_dmg = keys.original_damage;
            let multiplier = 1 - this.GetParentPlus().GetMagicalArmorValue();
            let actually_dmg = source_dmg * multiplier;
            this.damage_pool = this.damage_pool + actually_dmg;
        }
        if (keys.damage_type != DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL &&
            keys.damage_type != DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL) {
            let actually_dmg = keys.original_damage;
            this.damage_pool = this.damage_pool + actually_dmg;
        }
        if (this.damage_pool > this.threhold_hp) {
            let duration_reduce = math.floor(this.damage_pool / this.threhold_hp);
            let duration_ori = this.GetRemainingTime();
            this.damage_pool = this.damage_pool - this.threhold_hp * duration_reduce;
            if (duration_ori > duration_reduce) {
                this.SetDuration((duration_ori - duration_reduce), true);
                this.SetStackCount(math.floor(this.GetDuration() + 0.5));
            } else {
                this.Destroy();
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true
        }
        return state;
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.original_killer.TrueKilled(this.parent, this.ability_killer);
            if (this.parent.IsAlive()) {
                this.parent.Kill(this.ability_killer, this.original_killer);
            }
            if (this.parent.IsAlive()) {
                let damageTable = {
                    victim: this.parent,
                    attacker: this.original_killer,
                    damage: 100000000,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                    ability: this.ability_killer,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_BYPASSES_INVULNERABILITY + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_BYPASSES_BLOCK + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_DAMAGE_MULTIPLIERS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION
                }
                ApplyDamage(damageTable);
            }
            this.damage_pool = undefined;
            this.max_hp = undefined;
            this.threhold_hp = undefined;
        }
        this.caster = undefined;
        this.ability = undefined;
        this.parent = undefined;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_wraithking_ghosts.vpcf";
    }
}
@registerAbility()
export class imba_skeleton_king_kingdom_come extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return true;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_VICTORY;
    }
    IsNetherWardStealable() {
        return false;
    }
    IsInnateAbility() {
        return true;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_kingdom_come";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_skeleton_king_2")) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET;
        }
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE;
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasAbility("special_bonus_imba_skeleton_king_2") && this.GetCasterPlus().findAbliityPlus("special_bonus_imba_skeleton_king_2").IsTrained() && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_skeleton_king_2")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_special_bonus_imba_skeleton_king_2", {});
        }
    }
    GetCastPoint(): number {
        if (this.GetBehavior() != DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE) {
            return 1.0;
        }
        return undefined;
    }
    GetCooldown(p_0: number,): number {
        if (this.GetBehavior() != DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE) {
            return this.GetCasterPlus().GetTalentValue("special_bonus_imba_skeleton_king_2");
        }
        return 0;
    }
    OnAbilityPhaseStart(): boolean {
        this.GetCasterPlus().EmitSound("Hero_WraithKing.EruptionCast");
        return true;
    }
    OnAbilityPhaseInterrupted(): void {
        this.GetCasterPlus().StopSound("Hero_WraithKing.EruptionCast");
    }
    OnSpellStart(): void {
        let keys = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_kingdom_come", this.GetCasterPlus()) as modifier_imba_kingdom_come;
        keys.create_kingdom();
    }


}
@registerModifier()
export class modifier_imba_kingdom_come extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public particle_kingdom: any;
    public modifier_slow: any;
    public radius: number;
    public slow_duration: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.particle_kingdom = "particles/hero/skeleton_king/skeleton_king_hellfire_eruption_tell.vpcf";
        this.modifier_slow = "modifier_imba_kingdom_come_slow";
        this.radius = this.ability.GetSpecialValueFor("radius");
        this.slow_duration = this.ability.GetSpecialValueFor("slow_duration");
    }


    create_kingdom() {
        let enemy_units = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.radius,
            DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            FindOrder.FIND_ANY_ORDER, false);
        for (const enemy_unit of (enemy_units)) {
            enemy_unit.AddNewModifier(this.caster, this.ability, this.modifier_slow, {
                duration: this.slow_duration * (1 - enemy_unit.GetStatusResistance())
            });
        }
        let particle_kingdom_fx = ParticleManager.CreateParticle(this.particle_kingdom, ParticleAttachment_t.PATTACH_ABSORIGIN, this.caster);
        ParticleManager.SetParticleControl(particle_kingdom_fx, 0, this.caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_kingdom_fx, 1, Vector(this.radius, 1, 1));
        AddFOWViewer(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), this.radius, this.slow_duration, false);
        this.AddTimer(this.slow_duration, () => {
            ParticleManager.DestroyParticle(particle_kingdom_fx, false);
            ParticleManager.ReleaseParticleIndex(particle_kingdom_fx);
        });
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
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_DEATH
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (IsServer() && !this.GetParentPlus().PassivesDisabled()) {
            let unit = keys.unit;
            if (this.caster == unit && this.caster.IsRealUnit()) {
                this.create_kingdom();
            }
        }
    }
}
@registerModifier()
export class modifier_imba_kingdom_come_slow extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public particle_slow: any;
    public modifier_stun: any;
    public position: any;
    public ms_slow_pct: number;
    public as_slow: any;
    public stun_duration: number;
    public damage: number;
    public radius: number;
    public wraith_duration: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.particle_slow = "particles/units/heroes/hero_skeletonking/skeleton_king_reincarnate_slow_debuff.vpcf";
        this.modifier_stun = "modifier_imba_kingdom_come_stun";
        this.position = this.GetCasterPlus().GetAbsOrigin();
        this.ms_slow_pct = this.ability.GetSpecialValueFor("ms_slow_pct");
        this.as_slow = this.ability.GetSpecialValueFor("as_slow");
        this.stun_duration = this.ability.GetSpecialValueFor("stun_duration");
        this.damage = this.ability.GetSpecialValueFor("damage");
        this.radius = this.ability.GetSpecialValueFor("radius");
        this.wraith_duration = this.ability.GetSpecialValueFor("wraith_duration");
        if (IsServer()) {
            let particle_slow_fx = ResHelper.CreateParticleEx(this.particle_slow, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent, this.caster);
            ParticleManager.SetParticleControl(particle_slow_fx, 0, this.parent.GetAbsOrigin());
            this.AddParticle(particle_slow_fx, false, false, -1, false, false);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.ms_slow_pct * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.as_slow * (-1);
    }
    BeDestroy(): void {
        if (IsServer()) {
            let distance = (this.position - this.parent.GetAbsOrigin() as Vector).Length2D();
            if (distance > this.radius) {
                return undefined;
            }
            if (this.parent.IsRealUnit()) {
                this.parent.AddNewModifier(this.caster, this.ability, this.modifier_stun, {
                    duration: this.stun_duration * (1 - this.parent.GetStatusResistance())
                });
                let damageTable = {
                    victim: this.parent,
                    attacker: this.caster,
                    damage: this.damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    ability: this.ability
                }
                ApplyDamage(damageTable);
                let direction = (this.parent.GetAbsOrigin() - this.caster.GetAbsOrigin() as Vector).Normalized();
                let distance = (this.parent.GetAbsOrigin() - this.caster.GetAbsOrigin() as Vector).Length2D();
                let summon_point = this.caster.GetAbsOrigin() + direction * distance - 100 as Vector;
                let wraith = this.caster.CreateSummon("npc_imba_skeleton_king_wraith", summon_point, this.wraith_duration, true);
                let playerid = this.caster.GetPlayerID();
                if (playerid) {
                    // wraith.SetControllableByPlayer(playerid, true);
                }
                wraith.SetOwner(this.caster);
                wraith.SetBaseMaxHealth(this.parent.GetBaseMaxHealth());
                wraith.SetMaxHealth(this.parent.GetMaxHealth());
                wraith.SetHealth(wraith.GetMaxHealth());
                ResolveNPCPositions(this.parent.GetAbsOrigin(), 164);
            } else {
                if ((this.parent.IsCreep() && !this.parent.IsAncient())) {
                    this.parent.Kill(this.ability, this.caster);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_kingdom_come_stun extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
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
export class imba_skeleton_king_wraith_soul_strike extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "ghost_frost_attack";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_wraith_soul_strike";
    }
}
@registerModifier()
export class modifier_imba_wraith_soul_strike extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public owner: any;
    public modifier_slow: any;
    public wraiths_attacks: any;
    public max_hp_as_damage_pct: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.owner = this.caster.GetOwnerPlus();
            this.modifier_slow = "modifier_imba_wraith_soul_strike_slow";
            this.wraiths_attacks = this.ability.GetSpecialValueFor("wraiths_attacks");
            this.max_hp_as_damage_pct = this.ability.GetSpecialValueFor("max_hp_as_damage_pct");
            this.SetStackCount(this.wraiths_attacks);
            if (this.owner.HasTalent("special_bonus_imba_skeleton_king_4")) {
                this.GetParentPlus().AddNewModifier(this.owner, this.GetAbilityPlus(), "modifier_imba_wraith_soul_strike_talent", {});
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let target = keys.target;
            let attacker = keys.attacker;
            if (attacker == this.caster) {
                this.DecrementStackCount();
                let stacks = this.GetStackCount();
                if (stacks == 0) {
                    this.AddTimer(0.3, () => {
                        this.caster.Kill(this.ability, this.caster);
                    });
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        let target = keys.target;
        let attacker = keys.attacker;
        if (attacker == this.caster) {
            if (target.IsBuilding()) {
                return undefined;
            }
            let damage = this.caster.GetMaxHealth() * this.max_hp_as_damage_pct * 0.01;
            let damageTable = {
                victim: target,
                attacker: this.caster,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: this.ability
            }
            ApplyDamage(damageTable);
            if (this.owner.HasTalent("special_bonus_imba_skeleton_king_4")) {
                let duration = this.owner.GetTalentValue("special_bonus_imba_skeleton_king_4", "duration");
                target.AddNewModifier(this.caster, this.ability, this.modifier_slow, {
                    duration: duration * (1 - target.GetStatusResistance())
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_wraith_soul_strike_slow extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public owner: any;
    public ms_slow_pct: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.owner = this.caster.GetOwnerPlus();
            this.ms_slow_pct = this.owner.GetTalentValue("special_bonus_imba_skeleton_king_4", "ms_slow_pct");
            this.SetStackCount(this.ms_slow_pct * (-1));
            this.ability.SetRefCountsModifiers(true);
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_wraith_soul_strike_talent extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_skeleton_king_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_skeleton_king_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_skeleton_king_9 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_skeleton_king_10 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_skeleton_king_6 extends BaseModifier_Plus {
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
export class modifier_skeleton_king_ambient extends BaseModifier_Plus {
    public ambient_pfx: any;
    IsHidden(): boolean {
        return true;
    }
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
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.ambient_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_skeletonking/skeleton_king_ambient_custom.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus(), this.GetCasterPlus());
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        if (this.ambient_pfx) {
            ParticleManager.DestroyParticle(this.ambient_pfx, false);
            ParticleManager.ReleaseParticleIndex(this.ambient_pfx);
        }
    }
}
