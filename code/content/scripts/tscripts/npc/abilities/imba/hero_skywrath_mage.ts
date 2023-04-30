
import { GameFunc } from "../../../GameFunc";
import { AI_ability } from "../../../ai/AI_ability";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

function LaunchArcaneBolt(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus, target: IBaseNpc_Plus) {
    let modifier_wrath = "modifier_imba_arcane_bolt_buff";
    let projectile_speed = ability.GetSpecialValueFor("projectile_speed");
    let projectile_speed_per_stack = ability.GetSpecialValueFor("projectile_speed_per_stack");
    let vision_radius = ability.GetSpecialValueFor("vision_radius");
    let stacks = 0;
    if (caster.HasModifier(modifier_wrath)) {
        let modifier_wrath_handler = caster.FindModifierByName(modifier_wrath);
        if (modifier_wrath_handler) {
            stacks = modifier_wrath_handler.GetStackCount();
        }
    }
    projectile_speed = projectile_speed + projectile_speed_per_stack * stacks;
    let arcane_bolt_projectile = {
        Target: target,
        Source: caster,
        Ability: ability,
        EffectName: caster.TempData().arcane_bolt_pfx || "particles/units/heroes/hero_skywrath_mage/skywrath_mage_arcane_bolt.vpcf",
        iMoveSpeed: projectile_speed,
        bDodgeable: false,
        bVisibleToEnemies: true,
        bReplaceExisting: false,
        bProvidesVision: true,
        iVisionRadius: vision_radius,
        iVisionTeamNumber: caster.GetTeamNumber()
    }
    ProjectileManager.CreateTrackingProjectile(arcane_bolt_projectile);
}

function LaunchConcussiveShot(caster: IBaseNpc_Plus, source: IBaseNpc_Plus, ability: IBaseAbility_Plus, target: IBaseNpc_Plus, primary: boolean, bounces_left: number, bGhastlyPulse = false) {
    let bShouldBounce = true;
    if (bGhastlyPulse != undefined && bGhastlyPulse == false) {
        bShouldBounce = false;
    }
    let particle_projectile = "particles/units/heroes/hero_skywrath_mage/skywrath_mage_concussive_shot.vpcf";
    let projectile_speed = ability.GetSpecialValueFor("projectile_speed");
    let vision_radius = ability.GetSpecialValueFor("vision_radius");
    let concussive_projectile;
    concussive_projectile = {
        Target: target,
        Source: source,
        Ability: ability,
        EffectName: particle_projectile,
        iMoveSpeed: projectile_speed,
        bDodgeable: true,
        bVisibleToEnemies: true,
        bReplaceExisting: false,
        bProvidesVision: true,
        iVisionRadius: vision_radius,
        iVisionTeamNumber: caster.GetTeamNumber(),
        ExtraData: {
            bounces_left: bounces_left,
            primary_concussive: primary,
            bShouldBounce: bShouldBounce
        }
    }
    ProjectileManager.CreateTrackingProjectile(concussive_projectile);
}

function ApplyAncientSeal(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus, target: IBaseNpc_Plus) {
    let modifier_main_seal = "modifier_imba_ancient_seal_main";
    let modifier_thinker_aura = "modifier_imba_ancient_seal_aura";
    let seal_duration = ability.GetSpecialValueFor("seal_duration");
    seal_duration = seal_duration + caster.GetTalentValue("special_bonus_imba_skywrath_mage_2");
    target.AddNewModifier(caster, ability, modifier_main_seal, {
        duration: seal_duration * (1 - target.GetStatusResistance())
    });
    BaseModifier_Plus.CreateBuffThinker(caster, ability, modifier_thinker_aura, {
        duration: seal_duration
    }, target.GetAbsOrigin(), caster.GetTeamNumber(), false);
}

function ExecuteMysticFlare(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus, target_point: Vector) {
    let modifier_mystic = "modifier_imba_mystic_flare";
    let damage_duration = ability.GetSpecialValueFor("damage_duration");
    if (caster.HasTalent("special_bonus_imba_skywrath_mage_6")) {
        damage_duration = damage_duration * caster.GetTalentValue("special_bonus_imba_skywrath_mage_6");
    }
    BaseModifier_Plus.CreateBuffThinker(caster, ability, modifier_mystic, {
        duration: damage_duration
    }, target_point, caster.GetTeamNumber(), false);
}
@registerAbility()
export class imba_skywrath_mage_arcane_bolt extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    // GetManaCost(level: number): number {
    //     return super.GetManaCost(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_skywrath_mage_1");
    // }
    GetCooldown(level: number): number {
        return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_skywrath_mage_5");
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (!this.GetCasterPlus().HasTalent("special_bonus_imba_skywrath_mage_arcane_bolt_pierce")) {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, this.GetCasterPlus().GetTeamNumber());
        } else {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, this.GetCasterPlus().GetTeamNumber());
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = this.GetCursorTarget();
        let cast_responses = {
            "1": "skywrath_mage_drag_arcanebolt_02",
            "2": "skywrath_mage_drag_arcanebolt_03"
        }
        let rare_cast_response = "skywrath_mage_drag_arcanebolt_01";
        let sound_cast = "Hero_SkywrathMage.ArcaneBolt.Cast";
        let scepter = caster.HasScepter();
        let scepter_search_radius = ability.GetSpecialValueFor("scepter_search_radius");
        if (RollPercentage(5)) {
            EmitSoundOn(rare_cast_response, caster);
        } else if (RollPercentage(25)) {
            EmitSoundOn(GFuncRandom.RandomValue(cast_responses), caster);
        }
        EmitSoundOn(sound_cast, caster);
        LaunchArcaneBolt(caster, ability, target);
        let target_flags = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE;
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_skywrath_mage_arcane_bolt_pierce")) {
            target_flags = target_flags + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES;
        }
        if (scepter || caster.HasTalent("special_bonus_imba_skywrath_mage_9")) {
            let enemy_heroes = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, scepter_search_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, target_flags, FindOrder.FIND_ANY_ORDER, false);
            let extra_bolts = caster.GetTalentValue("special_bonus_imba_skywrath_mage_9");
            let counter = 0;
            if (scepter) {
                extra_bolts = extra_bolts + 1;
            }
            for (const [_, enemy_hero] of GameFunc.iPair(enemy_heroes)) {
                if (enemy_hero != target) {
                    LaunchArcaneBolt(caster, ability, enemy_hero);
                    counter = counter + 1;
                    if (counter >= extra_bolts) {
                        return undefined;
                    }
                }
            }
            let enemy_creeps = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, scepter_search_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, target_flags, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy_creep] of GameFunc.iPair(enemy_creeps)) {
                if (enemy_creep != target) {
                    LaunchArcaneBolt(caster, ability, enemy_creep);
                    counter = counter + 1;
                    if (counter >= extra_bolts) {
                        return undefined;
                    }
                }
            }
        }
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let sound_impact = "Hero_SkywrathMage.ArcaneBolt.Impact";
        let modifier_wrath = "modifier_imba_arcane_bolt_buff";
        let base_damage = ability.GetSpecialValueFor("base_damage");
        let intelligence_bonus_pct = ability.GetSpecialValueFor("intelligence_bonus_pct");
        let arcane_wrath_duration = ability.GetSpecialValueFor("arcane_wrath_duration");
        let intelligence_bonus_per_stack = ability.GetSpecialValueFor("intelligence_bonus_per_stack");
        let vision_radius = ability.GetSpecialValueFor("vision_radius");
        let impact_vision_duration = ability.GetSpecialValueFor("impact_vision_duration");
        if (!target) {
            return undefined;
        }
        if (target.IsMagicImmune() && !this.GetCasterPlus().HasTalent("special_bonus_imba_skywrath_mage_arcane_bolt_pierce")) {
            return undefined;
        }
        if (target.GetTeam() != caster.GetTeam()) {
            if (target.TriggerSpellAbsorb(ability)) {
                return undefined;
            }
        }
        AddFOWViewer(caster.GetTeamNumber(), location, vision_radius, impact_vision_duration, false);
        EmitSoundOn(sound_impact, caster);
        let intelligence = 0;
        if (caster.IsRealUnit()) {
            intelligence = caster.GetIntellect();
        }
        let stacks = 0;
        if (caster.HasModifier(modifier_wrath)) {
            let modifier_wrath_handler = caster.FindModifierByName(modifier_wrath);
            if (modifier_wrath_handler) {
                stacks = modifier_wrath_handler.GetStackCount();
            }
        }
        let int_damage_bonus = intelligence * ((intelligence_bonus_pct + intelligence_bonus_per_stack * stacks) * 0.01);
        let damage = base_damage + int_damage_bonus;
        let damageTable = {
            victim: target,
            attacker: caster,
            damage: damage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            ability: ability
        }
        ApplyDamage(damageTable);
        if (target.IsRealUnit()) {
            if (!caster.HasModifier(modifier_wrath)) {
                caster.AddNewModifier(caster, ability, modifier_wrath, {
                    duration: arcane_wrath_duration
                });
            }
            let modifier_wrath_handler = caster.FindModifierByName(modifier_wrath);
            if (modifier_wrath_handler) {
                modifier_wrath_handler.IncrementStackCount();
                modifier_wrath_handler.ForceRefresh();
            }
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_skywrath_mage_arcane_bolt_pierce") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_skywrath_mage_arcane_bolt_pierce")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_skywrath_mage_arcane_bolt_pierce"), "modifier_special_bonus_imba_skywrath_mage_arcane_bolt_pierce", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_skywrath_mage_10") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_skywrath_mage_10")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_skywrath_mage_10"), "modifier_special_bonus_imba_skywrath_mage_10", {});
        }
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }
    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this)
    }

}
@registerModifier()
export class modifier_imba_arcane_bolt_buff extends BaseModifier_Plus {
    public intelligence_bonus_per_stack: number;
    public projectile_speed_per_stack: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.intelligence_bonus_per_stack = this.GetSpecialValueFor("intelligence_bonus_per_stack");
        this.projectile_speed_per_stack = this.GetSpecialValueFor("projectile_speed_per_stack");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(keys?: any /** keys */): number {
        if (keys.fail_type == 0) {
            return this.intelligence_bonus_per_stack * this.GetStackCount();
        } else if (keys.fail_type == 1) {
            return this.projectile_speed_per_stack * this.GetStackCount();
        }
    }
}
@registerAbility()
export class imba_skywrath_mage_concussive_shot extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "skywrath_mage_concussive_shot";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let cast_response = "skywrath_mage_drag_concussive_shot_0" + math.random(1, 3);
        let sound_cast = "Hero_SkywrathMage.ConcussiveShot.Cast";
        let scepter = caster.HasScepter();
        let search_radius = ability.GetSpecialValueFor("search_radius");
        let max_bounces = ability.GetSpecialValueFor("max_bounces");
        let scepter_search_radius = ability.GetSpecialValueFor("scepter_search_radius");
        if (caster.HasTalent("special_bonus_imba_skywrath_mage_11")) {
            search_radius = FIND_UNITS_EVERYWHERE;
            scepter_search_radius = FIND_UNITS_EVERYWHERE;
        }
        if (RollPercentage(75)) {
            EmitSoundOn(cast_response, caster);
        }
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, search_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, FindOrder.FIND_CLOSEST, false);
        let basic_units = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, search_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_CLOSEST, false);
        if (GameFunc.GetCount(enemies) >= 1) {
            EmitSoundOn(sound_cast, caster);
            let cast_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_skywrath_mage/skywrath_mage_concussive_shot_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(cast_particle, 0, caster.GetAbsOrigin());
            ParticleManager.SetParticleControl(cast_particle, 1, enemies[0].GetAbsOrigin());
            ParticleManager.SetParticleControlEnt(cast_particle, 2, enemies[0], ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", enemies[0].GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(cast_particle);
            if ((enemies[0].GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Length2D() <= this.GetSpecialValueFor("search_radius")) {
                LaunchConcussiveShot(caster, caster, ability, enemies[0], true, max_bounces);
            } else {
                LaunchConcussiveShot(caster, caster, ability, enemies[0], true, max_bounces, false);
            }
            if (caster.HasTalent("special_bonus_imba_skywrath_mage_8")) {
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    if (enemy != enemies[0]) {
                        LaunchConcussiveShot(caster, caster, ability, enemy, true, max_bounces);
                    }
                }
                return undefined;
            }
        } else {
            if (GameFunc.GetCount(basic_units) >= 1) {
                EmitSoundOn(sound_cast, caster);
                let cast_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_skywrath_mage/skywrath_mage_concussive_shot_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
                ParticleManager.SetParticleControl(cast_particle, 0, caster.GetAbsOrigin());
                ParticleManager.SetParticleControl(cast_particle, 1, basic_units[0].GetAbsOrigin());
                ParticleManager.SetParticleControlEnt(cast_particle, 2, basic_units[0], ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", basic_units[0].GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(cast_particle);
                if ((basic_units[0].GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Length2D() <= this.GetSpecialValueFor("search_radius")) {
                    LaunchConcussiveShot(caster, caster, ability, basic_units[0], true, max_bounces);
                } else {
                    LaunchConcussiveShot(caster, caster, ability, basic_units[0], true, max_bounces, false);
                }
            } else {
                let particle_fail_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_skywrath_mage/skywrath_mage_concussive_shot_failure.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
                ParticleManager.SetParticleControl(particle_fail_fx, 0, caster.GetAbsOrigin());
                ParticleManager.SetParticleControl(particle_fail_fx, 1, caster.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(particle_fail_fx);
                return undefined;
            }
        }
        if (scepter) {
            for (const [_, enemy_hero] of GameFunc.iPair(enemies)) {
                if (enemy_hero != enemies[0] && !enemy_hero.IsMagicImmune()) {
                    if ((enemy_hero.GetAbsOrigin() - caster.GetAbsOrigin() as Vector).Length2D() <= ability.GetSpecialValueFor("scepter_search_radius")) {
                        LaunchConcussiveShot(caster, caster, ability, enemy_hero, true, max_bounces);
                    } else {
                        LaunchConcussiveShot(caster, caster, ability, enemy_hero, true, max_bounces, false);
                    }
                    return undefined;
                }
            }
            for (const [_, enemy_creep] of GameFunc.iPair(basic_units)) {
                if (enemy_creep != basic_units[0] && !enemy_creep.IsMagicImmune()) {
                    if ((enemy_creep.GetAbsOrigin() - caster.GetAbsOrigin() as Vector).Length2D() <= ability.GetSpecialValueFor("scepter_search_radius")) {
                        LaunchConcussiveShot(caster, caster, ability, enemy_creep, true, max_bounces);
                    } else {
                        LaunchConcussiveShot(caster, caster, ability, enemy_creep, true, max_bounces, false);
                    }
                    return undefined;
                }
            }
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, extra_data: any): boolean | void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let sound_impact = "Hero_SkywrathMage.ConcussiveShot.Target";
        let modifier_slow = "modifier_imba_concussive_shot_slow";
        let primary_concussive = extra_data.primary_concussive;
        let bounces_left = extra_data.bounces_left;
        let search_radius = ability.GetSpecialValueFor("search_radius");
        let damage = ability.GetSpecialValueFor("damage");
        let slow_duration = ability.GetSpecialValueFor("slow_duration");
        let impact_radius = ability.GetSpecialValueFor("impact_radius");
        let ghastly_delay = ability.GetSpecialValueFor("ghastly_delay");
        let ghastly_damage_pct = ability.GetSpecialValueFor("ghastly_damage_pct");
        let vision_radius = ability.GetSpecialValueFor("vision_radius");
        let impact_vision_duration = ability.GetSpecialValueFor("impact_vision_duration");
        if (!target) {
            return undefined;
        }
        AddFOWViewer(caster.GetTeamNumber(), location, vision_radius, impact_vision_duration, false);
        EmitSoundOn(sound_impact, caster);
        if (primary_concussive == 0) {
            damage = damage * (1 - (ghastly_damage_pct * 0.01));
        }
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, impact_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        let final_damage = undefined;
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (!enemy.IsMagicImmune()) {
                if (enemy.IsCreep()) {
                    final_damage = damage * this.GetSpecialValueFor("creep_damage_pct") * 0.01;
                } else {
                    final_damage = damage;
                }
                let damageTable = {
                    victim: enemy,
                    attacker: caster,
                    damage: final_damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    ability: ability
                }
                ApplyDamage(damageTable);
                enemy.AddNewModifier(caster, ability, modifier_slow, {
                    duration: slow_duration * (1 - enemy.GetStatusResistance())
                });
            }
        }
        if (extra_data.bShouldBounce == 1 && bounces_left > 0) {
            let target_pos = target.GetAbsOrigin();
            this.AddTimer(ghastly_delay, () => {
                let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target_pos, undefined, search_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST, false);
                if (GameFunc.GetCount(enemies) <= 1) {
                    return undefined;
                }
                bounces_left = bounces_left - 1;
                let enemy_target;
                if (enemies[0] == target) {
                    enemy_target = enemies[1];
                } else {
                    enemy_target = enemies[0];
                }
                LaunchConcussiveShot(caster, target, ability, enemy_target, false, bounces_left);
            });
        }
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }
    AutoSpellSelf() {
        return AI_ability.NO_TARGET_cast(this)
    }
}
@registerModifier()
export class modifier_imba_concussive_shot_slow extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public ms_slow_pct: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.ms_slow_pct = this.ability.GetSpecialValueFor("ms_slow_pct");
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
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.ms_slow_pct * (-1);
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_skywrath_mage/skywrath_mage_concussive_shot_slow_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerAbility()
export class imba_skywrath_mage_ancient_seal extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "skywrath_mage_ancient_seal";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetCooldown(level: number): number {
        let caster = this.GetCasterPlus();
        let cooldown = super.GetCooldown(level);
        cooldown = cooldown - caster.GetTalentValue("special_bonus_imba_skywrath_mage_3");
        return cooldown;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = this.GetCursorTarget();
        let cast_response = {
            "1": "skywrath_mage_drag_ancient_seal_01, skywrath_mage_drag_ancient_seal_03"
        }
        let rare_cast_response = "skywrath_mage_drag_ancient_seal_02";
        let sound_cast = "Hero_SkywrathMage.AncientSeal.Target";
        let scepter = caster.HasScepter();
        let scepter_search_radius = ability.GetSpecialValueFor("scepter_search_radius");
        if (RollPercentage(15)) {
            EmitSoundOn(rare_cast_response, caster);
        } else if (RollPercentage(25)) {
            EmitSoundOn(GFuncRandom.RandomValue(cast_response), caster);
        }
        EmitSoundOn(sound_cast, caster);
        if (target.GetTeam() != caster.GetTeam()) {
            if (target.TriggerSpellAbsorb(ability)) {
                return undefined;
            }
        }
        ApplyAncientSeal(caster, ability, target);
        if (scepter) {
            let enemy_heroes = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, scepter_search_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy_hero] of GameFunc.iPair(enemy_heroes)) {
                if (enemy_hero != target) {
                    ApplyAncientSeal(caster, ability, enemy_hero);
                    return undefined;
                }
            }
            let enemy_creeps = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, scepter_search_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy_creep] of GameFunc.iPair(enemy_creeps)) {
                if (enemy_creep != target) {
                    ApplyAncientSeal(caster, ability, enemy_creep);
                    return undefined;
                }
            }
        }
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_skywrath_mage_3") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_skywrath_mage_3")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_skywrath_mage_3"), "modifier_special_bonus_imba_skywrath_mage_3", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_skywrath_mage_10") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_skywrath_mage_10")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_skywrath_mage_10"), "modifier_special_bonus_imba_skywrath_mage_10", {});
        }
    }
    // GetManaCost(level: number): number {
    //     return 0;
    // }
    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_ancient_seal_main extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public particle_seal: any;
    public mr_reduction_pct: number;
    public particle_seal_fx: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.particle_seal = "particles/units/heroes/hero_skywrath_mage/skywrath_mage_ancient_seal_debuff.vpcf";
        this.mr_reduction_pct = this.ability.GetSpecialValueFor("mr_reduction_pct");
        this.particle_seal_fx = ResHelper.CreateParticleEx(this.particle_seal, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.parent);
        ParticleManager.SetParticleControlEnt(this.particle_seal_fx, 1, this.parent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
        this.AddParticle(this.particle_seal_fx, false, false, -1, false, true);
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.mr_reduction_pct * (-1);
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
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_SILENCED]: true
        };
    }
}
@registerModifier()
export class modifier_imba_ancient_seal_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public modifier_main_seal: any;
    public particle_sigil: any;
    public aura_linger: any;
    public sigil_radius: number;
    public particle_sigil_fx: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.modifier_main_seal = "modifier_imba_ancient_seal_main";
        this.particle_sigil = "particles/hero/skywrath_mage/skywrath_mage_ground_seal.vpcf";
        this.aura_linger = this.ability.GetSpecialValueFor("aura_linger");
        this.sigil_radius = this.ability.GetSpecialValueFor("sigil_radius");
        this.particle_sigil_fx = ResHelper.CreateParticleEx(this.particle_sigil, ParticleAttachment_t.PATTACH_WORLDORIGIN, this.caster);
        ParticleManager.SetParticleControl(this.particle_sigil_fx, 0, this.parent.GetAbsOrigin());
        ParticleManager.SetParticleControl(this.particle_sigil_fx, 1, Vector(80, 80, 1));
        ParticleManager.SetParticleControl(this.particle_sigil_fx, 2, Vector(this.sigil_radius, this.sigil_radius, 0));
        this.AddParticle(this.particle_sigil_fx, false, false, -1, false, false);
    }
    GetAuraDuration(): number {
        return this.aura_linger;
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        if (target.HasModifier(this.modifier_main_seal)) {
            return true;
        }
        return false;
    }
    GetAuraRadius(): number {
        return this.sigil_radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_ancient_seal_secondary";
    }
    IsAura(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_ancient_seal_secondary extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public particle_seal: any;
    public mr_reduction_pct: number;
    public particle_seal_fx: any;
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.particle_seal = "particles/units/heroes/hero_skywrath_mage/skywrath_mage_ancient_seal_debuff.vpcf";
        this.mr_reduction_pct = this.ability.GetSpecialValueFor("mr_reduction_pct");
        this.particle_seal_fx = ResHelper.CreateParticleEx(this.particle_seal, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.parent);
        ParticleManager.SetParticleControlEnt(this.particle_seal_fx, 1, this.parent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
        this.AddParticle(this.particle_seal_fx, false, false, -1, false, true);
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_skywrath_mage/skywrath_mage_ancient_seal_debuff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.mr_reduction_pct * (-1);
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
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_SILENCED]: true
        };
    }
}
@registerAbility()
export class imba_skywrath_mage_mystic_flare extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "skywrath_mage_mystic_flare";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetAOERadius(): number {
        let caster = this.GetCasterPlus();
        let ability = this;
        let damage_radius = ability.GetSpecialValueFor("damage_radius");
        damage_radius = damage_radius + caster.GetTalentValue("special_bonus_imba_skywrath_mage_4");
        return damage_radius;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target_point = this.GetCursorPosition();
        let cast_response = "skywrath_mage_drag_mystic_flare_0" + math.random(1, 5);
        let sound_cast = "Hero_SkywrathMage.MysticFlare.Cast";
        let scepter = caster.HasScepter();
        let damage_radius = this.GetSpecialValueFor("damage_radius");
        let scepter_search_radius = this.GetSpecialValueFor("scepter_search_radius");
        damage_radius = damage_radius + caster.GetTalentValue("special_bonus_imba_skywrath_mage_4");
        if (RollPercentage(75)) {
            EmitSoundOn(cast_response, caster);
        }
        EmitSoundOnLocationWithCaster(target_point, sound_cast, this.GetCasterPlus());
        ExecuteMysticFlare(caster, this, target_point);
        if (scepter) {
            let enemy_heroes = FindUnitsInRadius(caster.GetTeamNumber(), target_point, undefined, scepter_search_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy_hero] of GameFunc.iPair(enemy_heroes)) {
                let distance = (enemy_hero.GetAbsOrigin() - target_point as Vector).Length2D();
                if (distance > damage_radius) {
                    EmitSoundOnLocationWithCaster(enemy_hero.GetAbsOrigin(), "Hero_SkywrathMage.MysticFlare.Scepter", this.GetCasterPlus());
                    ExecuteMysticFlare(caster, this, enemy_hero.GetAbsOrigin());
                    break;
                }
            }
        }
    }
    GetManaCost(level: number): number {
        return 800;
    }
    AutoSpellSelf() {
        return AI_ability.POSITION_if_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_mystic_flare extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public core_particle: any;
    public particle_explosion: any;
    public particle_shockwave: any;
    public modifier_wrath: any;
    public damage_duration: number;
    public damage_radius: number;
    public damage: number;
    public damage_interval: number;
    public explosion_delay: number;
    public explosion_radius: number;
    public int_as_damage_pct: number;
    public int_increase_per_stack: number;
    public damage_per_interval: number;
    public parent_loc: any;
    public caster_int: any;
    public wrath_stacks: number;
    public modifier_wrath_handler: any;
    public explosion_damage: number;
    public instance_damage: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.core_particle = "particles/units/heroes/hero_skywrath_mage/skywrath_mage_mystic_flare_ambient.vpcf";
            this.particle_explosion = "particles/hero/skywrath_mage/skywrath_mage_mystic_flare_explosion.vpcf";
            this.particle_shockwave = "particles/hero/skywrath_mage/skywrath_mage_mystic_flare_explosion_shockwave.vpcf";
            this.modifier_wrath = "modifier_imba_arcane_bolt_buff";
            this.damage_duration = this.ability.GetSpecialValueFor("damage_duration");
            this.damage_radius = this.ability.GetSpecialValueFor("damage_radius");
            this.damage = this.ability.GetSpecialValueFor("damage");
            this.damage_interval = this.ability.GetSpecialValueFor("damage_interval");
            this.explosion_delay = this.ability.GetSpecialValueFor("explosion_delay");
            this.explosion_radius = this.ability.GetSpecialValueFor("explosion_radius");
            this.int_as_damage_pct = this.ability.GetSpecialValueFor("int_as_damage_pct");
            this.int_increase_per_stack = this.ability.GetSpecialValueFor("int_increase_per_stack");
            this.damage_radius = this.damage_radius + this.caster.GetTalentValue("special_bonus_imba_skywrath_mage_4");
            if (this.caster.HasTalent("special_bonus_imba_skywrath_mage_6")) {
                this.damage_duration = this.damage_duration * this.caster.GetTalentValue("special_bonus_imba_skywrath_mage_6");
                this.damage_interval = this.damage_interval * this.caster.GetTalentValue("special_bonus_imba_skywrath_mage_6");
            }
            this.damage_per_interval = this.damage / this.damage_duration * this.damage_interval;
            this.parent_loc = this.parent.GetAbsOrigin();
            EmitSoundOnLocationWithCaster(this.GetParentPlus().GetAbsOrigin(), "Hero_SkywrathMage.MysticFlare", this.GetCasterPlus());
            let core_particle_fx = ResHelper.CreateParticleEx(this.core_particle, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
            ParticleManager.SetParticleControl(core_particle_fx, 0, this.parent_loc);
            ParticleManager.SetParticleControl(core_particle_fx, 1, Vector(this.damage_radius, this.damage_duration, 0));
            ParticleManager.ClearParticle(core_particle_fx);
            this.StartIntervalThink(this.damage_interval);
            this.AddTimer(this.damage_duration, () => {
                // let particle_explosion_fx = ResHelper.CreateParticleEx(this.particle_explosion, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
                // ParticleManager.SetParticleControl(particle_explosion_fx, 0, this.parent_loc);
                // ParticleManager.SetParticleControl(particle_explosion_fx, 1, Vector(this.explosion_radius, 0, 0));
                // ParticleManager.ClearParticle(particle_explosion_fx);
                this.AddTimer(this.explosion_delay, () => {
                    // let particle_shockwave_fx = ResHelper.CreateParticleEx(this.particle_shockwave, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
                    // ParticleManager.SetParticleControl(particle_shockwave_fx, 0, this.parent_loc);
                    // ParticleManager.SetParticleControl(particle_shockwave_fx, 1, Vector(this.explosion_radius, this.explosion_radius, 2));
                    // ParticleManager.ClearParticle(particle_shockwave_fx);
                    this.caster_int = this.caster.GetIntellect();
                    this.wrath_stacks = 0;
                    if (this.caster.HasModifier(this.modifier_wrath)) {
                        this.modifier_wrath_handler = this.caster.FindModifierByName(this.modifier_wrath);
                        if (this.modifier_wrath_handler) {
                            this.wrath_stacks = this.modifier_wrath_handler.GetStackCount();
                        }
                    }
                    this.explosion_damage = this.caster_int * ((this.int_as_damage_pct + this.int_increase_per_stack * this.wrath_stacks) * 0.01);
                    let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent_loc, undefined, this.explosion_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                    for (const [_, enemy] of GameFunc.iPair(enemies)) {
                        if (!enemy.IsMagicImmune()) {
                            let damageTable = {
                                victim: enemy,
                                attacker: this.caster,
                                damage: this.explosion_damage,
                                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                                ability: this.ability
                            }
                            ApplyDamage(damageTable);
                        }
                    }
                });
            });
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent_loc, undefined, this.damage_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, FindOrder.FIND_ANY_ORDER, false);
            this.instance_damage = 0;
            if (GameFunc.GetCount(enemies) != 0) {
                this.instance_damage = this.damage_per_interval / GameFunc.GetCount(enemies);
            }
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (!enemy.IsMagicImmune()) {
                    enemy.EmitSound("Hero_SkywrathMage.MysticFlare.Target");
                    let damageTable = {
                        victim: enemy,
                        attacker: this.caster,
                        damage: this.instance_damage,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                        ability: this.ability
                    }
                    ApplyDamage(damageTable);
                }
            }
            if (GameFunc.GetCount(enemies) <= 0) {
                let basic_units = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.damage_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of GameFunc.iPair(basic_units)) {
                    enemy.EmitSound("Hero_SkywrathMage.MysticFlare.Target");
                    ApplyDamage({
                        victim: enemy,
                        attacker: this.GetCasterPlus(),
                        damage: this.damage_per_interval / GameFunc.GetCount(basic_units),
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                        ability: this.GetAbilityPlus()
                    });
                }
            }
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_skywrath_mage_9 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_skywrath_mage_11 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_skywrath_mage_6 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_skywrath_mage_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_skywrath_mage_10 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_skywrath_mage_arcane_bolt_pierce extends BaseModifier_Plus {
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
