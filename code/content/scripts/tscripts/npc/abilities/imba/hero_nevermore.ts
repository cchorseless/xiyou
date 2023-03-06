
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { GameServiceConfig } from "../../../shared/GameServiceConfig";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

function UpgradeShadowRazes(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus) {
    let raze_close = "imba_nevermore_shadowraze_close";
    let raze_medium = "imba_nevermore_shadowraze_medium";
    let raze_far = "imba_nevermore_shadowraze_far";
    let raze_close_handler;
    let raze_medium_handler;
    let raze_far_handler;
    if (caster.HasAbility(raze_close)) {
        raze_close_handler = caster.FindAbilityByName(raze_close);
    }
    if (caster.HasAbility(raze_medium)) {
        raze_medium_handler = caster.FindAbilityByName(raze_medium);
    }
    if (caster.HasAbility(raze_far)) {
        raze_far_handler = caster.FindAbilityByName(raze_far);
    }
    let leveled_ability_level = ability.GetLevel();
    if (raze_close_handler && raze_close_handler.GetLevel() < leveled_ability_level) {
        raze_close_handler.SetLevel(leveled_ability_level);
    }
    if (raze_medium_handler && raze_medium_handler.GetLevel() < leveled_ability_level) {
        raze_medium_handler.SetLevel(leveled_ability_level);
    }
    if (raze_far_handler && raze_far_handler.GetLevel() < leveled_ability_level) {
        raze_far_handler.SetLevel(leveled_ability_level);
    }
}
function CastShadowRazeOnPoint(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus & { enemies_hit: IBaseNpc_Plus[] }, point: Vector, radius: number) {
    let particle_raze = "particles/hero/nevermore/nevermore_shadowraze.vpcf";
    let modifier_harvest = "modifier_imba_reqiuem_harvest";
    let requiem_debuff = "modifier_imba_reqiuem_debuff";
    let pool_modifier = "modifier_imba_shadow_raze_pool";
    let modifier_combo = "modifier_shadow_raze_combo";
    let modifier_prevention = "modifier_shadow_raze_prevention";
    let shadow_combo_duration = ability.GetSpecialValueFor("shadow_combo_duration");
    let pool_duration = caster.GetTalentValue("special_bonus_imba_nevermore_1", "duration");
    let pool_radius = caster.GetTalentValue("special_bonus_imba_nevermore_1", "radius");
    let particle_raze_fx = ResHelper.CreateParticleEx(particle_raze, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
    ParticleManager.SetParticleControl(particle_raze_fx, 0, point);
    ParticleManager.SetParticleControl(particle_raze_fx, 1, Vector(radius, 1, 1));
    ParticleManager.ReleaseParticleIndex(particle_raze_fx);
    let enemies = FindUnitsInRadius(caster.GetTeamNumber(), point, undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
    for (const enemy of (enemies)) {
        if (!enemy.IsMagicImmune()) {
            if (ability.enemies_hit) {
                let enemy_marked = false;
                for (const enemy_hit of (ability.enemies_hit)) {
                    if (enemy == enemy_hit) {
                        enemy_marked = true;
                    }
                }
                if (!enemy_marked) {
                    table.insert(ability.enemies_hit, enemy);
                }
                if (!enemy_marked) {
                    ApplyShadowRazeDamage(caster, ability, enemy);
                    if (caster.HasTalent("special_bonus_imba_nevermore_6") && enemy.HasModifier("modifier_imba_reqiuem_debuff")) {
                        let modifier_handler = enemy.FindModifierByName(requiem_debuff) as modifier_imba_reqiuem_debuff;
                        if (modifier_handler) {
                            let new_duration = modifier_handler.duration;
                            enemy.RemoveModifierByName(requiem_debuff);
                            enemy.AddNewModifier(caster, modifier_handler.ability, requiem_debuff, {
                                duration: new_duration * (1 - enemy.GetStatusResistance())
                            });
                        }
                    }
                }
            } else {
                ApplyShadowRazeDamage(caster, ability, enemy);
                if (caster.HasTalent("special_bonus_imba_nevermore_6") && enemy.HasModifier("modifier_imba_reqiuem_debuff")) {
                    let modifier_handler = enemy.FindModifierByName(requiem_debuff) as modifier_imba_reqiuem_debuff;
                    if (modifier_handler) {
                        let new_duration = modifier_handler.duration;
                        enemy.RemoveModifierByName(requiem_debuff);
                        enemy.AddNewModifier(caster, modifier_handler.ability, requiem_debuff, {
                            duration: new_duration * (1 - enemy.GetStatusResistance())
                        });
                    }
                }
            }
        }
    }
    if (caster.HasTalent("special_bonus_imba_nevermore_1")) {
        CreateModifierThinker(caster, ability, pool_modifier, {
            duration: pool_duration,
            radius: pool_radius
        }, point, caster.GetTeamNumber(), false);
    }
    if (GameFunc.GetCount(enemies) > 0) {
        if (!caster.HasModifier(modifier_combo) && !caster.HasModifier(modifier_prevention)) {
            caster.AddNewModifier(caster, ability, modifier_combo, {
                duration: shadow_combo_duration
            });
        }
        let modifier_combo_handler = caster.FindModifierByName(modifier_combo);
        if (modifier_combo_handler) {
            modifier_combo_handler.IncrementStackCount();
            modifier_combo_handler.ForceRefresh();
        }
        if (caster.HasModifier(modifier_harvest)) {
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (enemy.IsRealUnit()) {
                    return true;
                }
            }
        }
        return false;
    }
}
function ApplyShadowRazeDamage(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus, enemy: IBaseNpc_Plus) {
    let particle_soul = "particles/units/heroes/hero_nevermore/nevermore_necro_souls.vpcf";
    let modifier_souls = "modifier_imba_necromastery_souls";
    let modifier_dark_lord = "modifier_imba_dark_lord_debuff";
    let modifier_debuff = "modifier_imba_shadowraze_debuff";
    let damage = ability.GetSpecialValueFor("damage");
    let damage_per_soul = ability.GetSpecialValueFor("damage_per_soul");
    let souls_per_raze = ability.GetSpecialValueFor("souls_per_raze");
    let soul_projectile_speed = ability.GetSpecialValueFor("soul_projectile_speed");
    let stack_bonus_damage = ability.GetSpecialValueFor("stack_bonus_damage");
    let duration = ability.GetSpecialValueFor("duration");
    let debuff_boost = 0;
    if (enemy.HasModifier(modifier_debuff)) {
        debuff_boost = stack_bonus_damage * enemy.FindModifierByName(modifier_debuff).GetStackCount();
        damage = damage + debuff_boost;
    }
    if (caster.HasModifier(modifier_souls)) {
        let stacks = caster.findBuffStack(modifier_souls, caster);
        damage = damage + (stacks * damage_per_soul) + debuff_boost;
        if (enemy.IsRealUnit()) {
            AddNecromasterySouls(caster, souls_per_raze);
        }
        if (!caster.PassivesDisabled()) {
            let soul_projectile = {
                Target: caster,
                Source: enemy,
                Ability: ability,
                EffectName: particle_soul,
                bDodgeable: false,
                bProvidesVision: false,
                iMoveSpeed: soul_projectile_speed,
                iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION
            }
            ProjectileManager.CreateTrackingProjectile(soul_projectile);
        }
    }
    if (enemy.HasModifier(modifier_dark_lord)) {
        let modifier_dark_lord_handler = enemy.FindModifierByName(modifier_dark_lord);
        if (modifier_dark_lord_handler) {
            modifier_dark_lord_handler.IncrementStackCount();
        }
    }
    let damageTable = {
        victim: enemy,
        damage: damage,
        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
        attacker: caster,
        ability: ability
    }
    let actualy_damage = ApplyDamage(damageTable);
    if (!enemy.HasModifier(modifier_debuff)) {
        enemy.AddNewModifier(caster, ability, modifier_debuff, {
            duration: duration * (1 - enemy.GetStatusResistance())
        });
    }
    let modifier_debuff_counter = enemy.FindModifierByName(modifier_debuff);
    if (modifier_debuff_counter) {
        modifier_debuff_counter.IncrementStackCount();
        modifier_debuff_counter.ForceRefresh();
    }
}
function AddNecromasterySouls(caster: IBaseNpc_Plus, soul_count: number) {
    let modifier_souls = "modifier_imba_necromastery_souls";
    if (caster.PassivesDisabled()) {
        return;
    }
    if (caster.HasModifier(modifier_souls)) {
        let modifier_souls_handler = caster.FindModifierByName(modifier_souls);
        if (modifier_souls_handler) {
            for (let i = 0; i < soul_count; i++) {
                modifier_souls_handler.IncrementStackCount();
            }
        }
    }
}
function RemoveNecromasterySouls(caster: IBaseNpc_Plus, soul_count: number) {
    let modifier_souls = "modifier_imba_necromastery_souls";
    if (caster.HasModifier(modifier_souls)) {
        let modifier_souls_handler = caster.FindModifierByName(modifier_souls);
        if (modifier_souls_handler) {
            for (let i = 0; i < soul_count; i++) {
                modifier_souls_handler.DecrementStackCount();
            }
        }
    }
}

function CreateRequiemSoulLine(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus, line_end_position: Vector, death_cast = false) {
    let particle_lines = "particles/units/heroes/hero_nevermore/nevermore_requiemofsouls_line.vpcf";
    let scepter = caster.HasScepter();
    let travel_distance = ability.GetSpecialValueFor("travel_distance");
    let lines_starting_width = ability.GetSpecialValueFor("lines_starting_width");
    let lines_end_width = ability.GetSpecialValueFor("lines_end_width");
    let lines_travel_speed = ability.GetSpecialValueFor("lines_travel_speed");
    let max_distance_time = travel_distance / lines_travel_speed;
    let velocity = (line_end_position - caster.GetAbsOrigin() as Vector).Normalized() * lines_travel_speed as Vector;
    let projectile_info: CreateLinearProjectileOptions = {
        Ability: ability,
        EffectName: particle_lines,
        vSpawnOrigin: caster.GetAbsOrigin(),
        fDistance: travel_distance,
        fStartRadius: lines_starting_width,
        fEndRadius: lines_end_width,
        Source: caster,
        bHasFrontalCone: false,
        // bReplaceExisting: false,
        iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
        iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
        iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
        // bDeleteOnHit: false,
        vVelocity: velocity,
        bProvidesVision: false,
        ExtraData: {
            scepter_line: false,
            death_cast: death_cast
        }
    }
    ProjectileManager.CreateLinearProjectile(projectile_info);
    let particle_lines_fx = ResHelper.CreateParticleEx(particle_lines, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
    ParticleManager.SetParticleControl(particle_lines_fx, 0, caster.GetAbsOrigin());
    ParticleManager.SetParticleControl(particle_lines_fx, 1, velocity);
    ParticleManager.SetParticleControl(particle_lines_fx, 2, Vector(0, max_distance_time, 0));
    ParticleManager.ReleaseParticleIndex(particle_lines_fx);
    if (scepter && !death_cast) {
        ability.AddTimer(max_distance_time, () => {
            let velocity = (caster.GetAbsOrigin() - line_end_position as Vector).Normalized() * lines_travel_speed as Vector;
            projectile_info = {
                Ability: ability,
                EffectName: particle_lines,
                vSpawnOrigin: line_end_position,
                fDistance: travel_distance,
                fStartRadius: lines_end_width,
                fEndRadius: lines_starting_width,
                Source: caster,
                bHasFrontalCone: false,
                // bReplaceExisting: false,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                // bDeleteOnHit: false,
                vVelocity: velocity,
                bProvidesVision: false,
                ExtraData: {
                    scepter_line: true
                }
            }
            ProjectileManager.CreateLinearProjectile(projectile_info);
            let particle_lines_fx = ResHelper.CreateParticleEx(particle_lines, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(particle_lines_fx, 0, line_end_position);
            ParticleManager.SetParticleControl(particle_lines_fx, 1, velocity);
            ParticleManager.SetParticleControl(particle_lines_fx, 2, Vector(0, max_distance_time, 0));
            ParticleManager.ReleaseParticleIndex(particle_lines_fx);
        });
    }
}
@registerAbility()
export class imba_nevermore_shadowraze_close extends BaseAbility_Plus {
    public enemies_hit: IBaseNpc_Plus[];
    GetAbilityTextureName(): string {
        return "nevermore_shadowraze1";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetManaCost(level: number): number {
        let caster = this.GetCasterPlus();
        let manacost = super.GetManaCost(level);
        return manacost;
    }
    GetCooldown(level: number): number {
        let caster = this.GetCasterPlus();
        let modifier_harvest = "modifier_imba_reqiuem_harvest";
        if (caster.HasModifier(modifier_harvest)) {
            return 0;
        }
        let cooldown = super.GetCooldown(level);
        return cooldown;
    }
    OnUpgrade(): void {
        let caster = this.GetCasterPlus();
        UpgradeShadowRazes(caster, this);
    }
    GetCastPoint(): number {
        let cast_point = super.GetCastPoint();
        let caster = this.GetCasterPlus();
        if (caster.HasTalent("special_bonus_imba_nevermore_8") && caster.HasModifier("modifier_imba_reqiuem_harvest") && caster.IsAlive()) {
            cast_point = cast_point / 2;
        }
        return cast_point;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let cast_response = {
            "1": "nevermore_nev_ability_shadow_07",
            "2": "nevermore_nev_ability_shadow_18",
            "3": "nevermore_nev_ability_shadow_21"
        }
        let sound_raze = "Hero_Nevermore.Shadowraze";
        let modifier_harvest = "modifier_imba_reqiuem_harvest";
        let raze_radius = ability.GetSpecialValueFor("raze_radius");
        let raze_distance = ability.GetSpecialValueFor("raze_distance");
        EmitSoundOn(GFuncRandom.RandomValue(cast_response), caster);
        EmitSoundOn(sound_raze, caster);
        let raze_point = caster.GetAbsOrigin() + caster.GetForwardVector() * raze_distance as Vector;
        let raze_hit_hero = CastShadowRazeOnPoint(caster, ability, raze_point, raze_radius);
        if (caster.HasModifier(modifier_harvest) && !raze_hit_hero) {
            caster.RemoveModifierByName(modifier_harvest);
        }
    }
}
@registerAbility()
export class imba_nevermore_shadowraze_medium extends BaseAbility_Plus {
    public enemies_hit: IBaseNpc_Plus[];

    GetAbilityTextureName(): string {
        return "nevermore_shadowraze2";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetManaCost(level: number): number {
        let caster = this.GetCasterPlus();
        let manacost = super.GetManaCost(level);
        return manacost;
    }
    GetCooldown(level: number): number {
        let caster = this.GetCasterPlus();
        let modifier_harvest = "modifier_imba_reqiuem_harvest";
        if (caster.HasModifier(modifier_harvest)) {
            return 0;
        }
        let cooldown = super.GetCooldown(level);
        return cooldown;
    }
    OnUpgrade(): void {
        let caster = this.GetCasterPlus();
        UpgradeShadowRazes(caster, this);
    }
    GetCastPoint(): number {
        let caster = this.GetCasterPlus();
        let cast_point = super.GetCastPoint();
        if (caster.HasTalent("special_bonus_imba_nevermore_8") && caster.HasModifier("modifier_imba_reqiuem_harvest")) {
            cast_point = cast_point / 2;
        }
        return cast_point;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let cast_response = {
            "1": "nevermore_nev_ability_shadow_08",
            "2": "nevermore_nev_ability_shadow_20",
            "3": "nevermore_nev_ability_shadow_22"
        }
        let sound_raze = "Hero_Nevermore.Shadowraze";
        let modifier_combo = "modifier_shadow_raze_combo";
        let modifier_harvest = "modifier_imba_reqiuem_harvest";
        let raze_radius = ability.GetSpecialValueFor("raze_radius");
        let raze_distance = ability.GetSpecialValueFor("raze_distance");
        let additional_raze_count = ability.GetSpecialValueFor("additional_raze_count");
        let raze_angle = ability.GetSpecialValueFor("raze_angle");
        EmitSoundOn(GFuncRandom.RandomValue(cast_response), caster);
        EmitSoundOn(sound_raze, caster);
        this.enemies_hit = []
        let main_raze_point = caster.GetAbsOrigin() + caster.GetForwardVector() * raze_distance as Vector;
        let raze_hit_hero = CastShadowRazeOnPoint(caster, ability, main_raze_point, raze_radius);
        let extra_razes_did_hit = false;
        if (additional_raze_count > 0) {
            let last_left_raze_point = main_raze_point;
            let last_right_raze_point = main_raze_point;
            for (let i = 2; i <= additional_raze_count; i += 2) {
                let left_qangle = QAngle(0, raze_angle, 0);
                let right_qangle = QAngle(0, raze_angle * (-1), 0);
                last_left_raze_point = RotatePosition(caster.GetAbsOrigin(), left_qangle, last_left_raze_point);
                last_right_raze_point = RotatePosition(caster.GetAbsOrigin(), right_qangle, last_right_raze_point);
                let extra_hit_1 = CastShadowRazeOnPoint(caster, ability, last_left_raze_point, raze_radius);
                let extra_hit_2 = CastShadowRazeOnPoint(caster, ability, last_right_raze_point, raze_radius);
                if (extra_hit_1 || extra_hit_2) {
                    extra_razes_did_hit = true;
                }
            }
        }
        if (caster.HasModifier(modifier_harvest) && !raze_hit_hero && !extra_razes_did_hit) {
            caster.RemoveModifierByName(modifier_harvest);
        }
    }
}
@registerAbility()
export class imba_nevermore_shadowraze_far extends BaseAbility_Plus {
    public enemies_hit: IBaseNpc_Plus[];
    GetAbilityTextureName(): string {
        return "nevermore_shadowraze3";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetManaCost(level: number): number {
        let caster = this.GetCasterPlus();
        let manacost = super.GetManaCost(level);
        return manacost;
    }
    GetCooldown(level: number): number {
        let caster = this.GetCasterPlus();
        let modifier_harvest = "modifier_imba_reqiuem_harvest";
        if (caster.HasModifier(modifier_harvest)) {
            return 0;
        }
        let cooldown = super.GetCooldown(level);
        return cooldown;
    }
    GetCastPoint(): number {
        let caster = this.GetCasterPlus();
        let cast_point = super.GetCastPoint();
        if (caster.HasTalent("special_bonus_imba_nevermore_8") && caster.HasModifier("modifier_imba_reqiuem_harvest")) {
            cast_point = cast_point / 2;
        }
        return cast_point;
    }
    OnUpgrade(): void {
        let caster = this.GetCasterPlus();
        UpgradeShadowRazes(caster, this);
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let cast_response = {
            "1": "nevermore_nev_ability_shadow_11",
            "2": "nevermore_nev_ability_shadow_19",
            "3": "nevermore_nev_ability_shadow_23"
        }
        let sound_raze = "Hero_Nevermore.Shadowraze";
        let modifier_combo = "modifier_shadow_raze_combo";
        let modifier_harvest = "modifier_imba_reqiuem_harvest";
        let main_raze_radius = ability.GetSpecialValueFor("main_raze_radius");
        let main_raze_distance = ability.GetSpecialValueFor("main_raze_distance");
        let level_5_raze_radius = ability.GetSpecialValueFor("level_5_raze_radius");
        let level_5_raze_distance = ability.GetSpecialValueFor("level_5_raze_distance");
        let level_6_raze_radius = ability.GetSpecialValueFor("level_6_raze_radius");
        let level_6_raze_distance = ability.GetSpecialValueFor("level_6_raze_distance");
        let level_7_raze_radius = ability.GetSpecialValueFor("level_7_raze_radius");
        let level_7_raze_distance = ability.GetSpecialValueFor("level_7_raze_distance");
        let level_of_ability = ability.GetLevel();
        EmitSoundOn(GFuncRandom.RandomValue(cast_response), caster);
        EmitSoundOn(sound_raze, caster);
        this.enemies_hit = []
        let main_raze_point = caster.GetAbsOrigin() + (caster.GetForwardVector() * main_raze_distance) - (caster.GetRightVector() * main_raze_radius * (this.GetLevel() - 1)) as Vector;
        let raze_hit_hero = CastShadowRazeOnPoint(caster, ability, main_raze_point, main_raze_radius);
        let lvl_5_raze_hit_hero = false;
        if (level_of_ability >= 2) {
            let level_5_raze_point = caster.GetAbsOrigin() + (caster.GetForwardVector() * main_raze_distance) + (caster.GetRightVector() * main_raze_radius) - (caster.GetRightVector() * (main_raze_radius * (this.GetLevel() - 2))) as Vector;
            lvl_5_raze_hit_hero = CastShadowRazeOnPoint(caster, ability, level_5_raze_point, main_raze_radius);
        }
        let lvl_6_raze_hit_hero = false;
        if (level_of_ability >= 3) {
            let level_6_raze_point = caster.GetAbsOrigin() + (caster.GetForwardVector() * main_raze_distance) + (caster.GetRightVector() * main_raze_radius * 2) - (caster.GetRightVector() * (main_raze_radius * (this.GetLevel() - 3))) as Vector;
            lvl_6_raze_hit_hero = CastShadowRazeOnPoint(caster, ability, level_6_raze_point, main_raze_radius);
        }
        let lvl_7_raze_hit_hero = false;
        if (level_of_ability == 4) {
            let level_7_raze_point = caster.GetAbsOrigin() + (caster.GetForwardVector() * main_raze_distance) + (caster.GetRightVector() * main_raze_radius * 3) as Vector;
            let lvl_7_raze_hit_hero = CastShadowRazeOnPoint(caster, ability, level_7_raze_point, main_raze_radius);
        }
        if (caster.HasModifier(modifier_harvest) && !raze_hit_hero && !lvl_5_raze_hit_hero && !lvl_6_raze_hit_hero && !lvl_7_raze_hit_hero) {
            caster.RemoveModifierByName(modifier_harvest);
        }
    }
}
@registerModifier()
export class modifier_shadow_raze_combo extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public razes: any;
    public modifier_prevention: any;
    public combo_prevention_duration: number;
    public combo_threshold: any;
    public raze_close_handler: any;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.razes = {}
            this.razes[0] = "imba_nevermore_shadowraze_close";
            this.razes[2] = "imba_nevermore_shadowraze_medium";
            this.razes[3] = "imba_nevermore_shadowraze_far";
            this.modifier_prevention = "modifier_shadow_raze_prevention";
            this.combo_prevention_duration = this.ability.GetSpecialValueFor("combo_prevention_duration");
            this.combo_threshold = this.ability.GetSpecialValueFor("combo_threshold");
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    OnStackCountChanged(p_0: number,): void {
        if (IsServer()) {
            let stacks = this.GetStackCount();
            if (this.caster.HasModifier(this.modifier_prevention)) {
                return undefined;
            }
            if (stacks < this.combo_threshold) {
                return undefined;
            }
            this.AddTimer(FrameTime(), () => {
                for (let i = 0; i < GameFunc.GetCount(this.razes); i++) {
                    if (this.caster.HasAbility(this.razes[i])) {
                        this.raze_close_handler = this.caster.FindAbilityByName(this.razes[i]);
                        if (this.raze_close_handler) {
                            this.raze_close_handler.EndCooldown();
                        }
                    }
                }
            });
            this.caster.AddNewModifier(this.caster, this.ability, this.modifier_prevention, {
                duration: this.combo_prevention_duration
            });
            this.Destroy();
        }
    }
}
@registerModifier()
export class modifier_shadow_raze_prevention extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_shadow_raze_pool extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public particle_effect: any;
    public radius: number;
    public flat_damage: number;
    public percent_damage: number;
    public tick_interval: number;
    public percent_damage_per_tick: number;
    public flat_damage_per_tick: number;
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.particle_effect = "particles/hero/nevermore/nevermore_shadowraze_talent_pool.vpcf";
            this.radius = kv.radius;
            this.flat_damage = this.caster.GetTalentValue("special_bonus_imba_nevermore_1", "flat_dmg_per_sec");
            this.percent_damage = this.caster.GetTalentValue("special_bonus_imba_nevermore_1", "pc_dmg_per_sec");
            this.tick_interval = this.caster.GetTalentValue("special_bonus_imba_nevermore_1", "tick_interval");
            let particle_pool = ResHelper.CreateParticleEx(this.particle_effect, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
            ParticleManager.SetParticleControl(particle_pool, 2, (this.parent.GetAbsOrigin() + Vector(0, 0, 10)) as Vector);
            this.AddParticle(particle_pool, false, false, -1, false, false);
            this.percent_damage_per_tick = this.percent_damage * this.tick_interval;
            this.flat_damage_per_tick = this.flat_damage * this.tick_interval;
            this.StartIntervalThink(this.tick_interval);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let damage_table = ({
                    victim: enemy,
                    attacker: this.caster,
                    ability: this.ability,
                    damage: this.flat_damage_per_tick,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                });
                ApplyDamage(damage_table);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_shadowraze_debuff extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
}
@registerAbility()
export class imba_nevermore_necromastery extends BaseAbility_Plus {
    hero_killed: number = 0;
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasAbility("special_bonus_imba_nevermore_2") && this.GetCasterPlus().findAbliityPlus("special_bonus_imba_nevermore_2").IsTrained() && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_nevermore_2")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_special_bonus_imba_nevermore_2", {});
        }
    }
    GetAbilityTextureName(): string {
        return "nevermore_necromastery";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_necromastery_souls";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_nevermore_2")) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING;
        }
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE;
    }
    IsHiddenWhenStolen(): boolean {
        return true;
    }
    OnUnStolen(): void {
        let caster = this.GetCasterPlus();
        let modifier_souls = "modifier_imba_necromastery_souls";
        if (caster.HasModifier(modifier_souls)) {
            caster.RemoveModifierByName(modifier_souls);
        }
    }
    OnUpgrade(): void {
        let caster = this.GetCasterPlus();
        let upgrade_response = "nevermore_nev_ability_mastery_01";
        EmitSoundOn(upgrade_response, caster);
    }
    GetManaCost(level: number): number {
        return 0;
    }
    GetCooldown(level: number): number {
        let cooldown = this.GetCasterPlus().GetTalentValue("special_bonus_imba_nevermore_2", "cooldown");
        return cooldown;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let particle_one = "particles/hero/nevermore/nevermore_necromastery_heal_1.vpcf";
        let particle_two = "particles/hero/nevermore/nevermore_necromastery_heal_2.vpcf";
        let necromastery_heal_one = undefined;
        let necromastery_heal_two = undefined;
        let souls_modifier = "modifier_imba_necromastery_souls";
        let heal_per_soul = caster.GetTalentValue("special_bonus_imba_nevermore_2", "heal_per_soul");
        if (IsServer()) {
            let max_health = caster.GetMaxHealth();
            let current_health = caster.GetHealth();
            let missing_health = max_health - current_health;
            if (missing_health <= 0) {
                return;
            }
            necromastery_heal_one = ResHelper.CreateParticleEx(particle_one, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
            necromastery_heal_two = ResHelper.CreateParticleEx(particle_two, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
            ParticleManager.SetParticleControl(necromastery_heal_one, 0, (caster.GetAbsOrigin() + Vector(0, 0, -290)) as Vector);
            ParticleManager.SetParticleControl(necromastery_heal_two, 0, caster.GetAbsOrigin());
            ParticleManager.SetParticleControl(necromastery_heal_two, 1, (caster.GetAbsOrigin() + (caster.GetForwardVector().Normalized() * caster.GetBaseMoveSpeed()) + Vector(0, 0, 30)) as Vector);
            ParticleManager.ReleaseParticleIndex(necromastery_heal_one);
            ParticleManager.ReleaseParticleIndex(necromastery_heal_two);
            let souls_needed = (missing_health / heal_per_soul) + 1;
            let soul_stacks = 0;
            if (!caster.HasModifier(souls_modifier)) {
                soul_stacks = 0;
            } else {
                soul_stacks = caster.findBuffStack(souls_modifier, caster);
            }
            if (soul_stacks < souls_needed) {
                caster.SetHealth(current_health + (soul_stacks * heal_per_soul));
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, caster, soul_stacks * heal_per_soul, undefined);
                caster.SetModifierStackCount(souls_modifier, caster, 0);
            } else {
                caster.SetHealth(max_health);
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, caster, souls_needed * heal_per_soul, undefined);
                caster.SetModifierStackCount(souls_modifier, caster, soul_stacks - souls_needed);
            }
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_nevermore_2 extends BaseModifier_Plus {

    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().findAbliityPlus<imba_nevermore_necromastery>("imba_nevermore_necromastery")) {
            this.GetParentPlus().findAbliityPlus<imba_nevermore_necromastery>("imba_nevermore_necromastery").GetBehavior();
        }
    }
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
export class modifier_imba_necromastery_souls extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: imba_nevermore_necromastery;
    public particle_soul_creep: any;
    public particle_soul_hero: any;
    public requiem_ability: any;
    public extra_cap_modifier: any;
    public creep_kill_soul_count: number;
    public hero_kill_soul_count: number;
    public hero_attack_soul_count: number;
    public shadowraze_soul_count: number;
    public damage_per_soul: number;
    public base_max_souls: any;
    public scepter_max_souls: any;
    public max_souls: any;
    public total_max_souls: any;
    public temporary_soul_duration: number;
    public max_temporary_souls_pct: number;
    public soul_projectile_speed: number;
    public souls_lost_on_death_pct: number;
    public max_souls_inc_temp: any;
    public soul_table: number[];
    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.particle_soul_creep = "particles/units/heroes/hero_nevermore/nevermore_necro_souls.vpcf";
        this.particle_soul_hero = "particles/hero/nevermore/nevermore_soul_projectile.vpcf";
        this.requiem_ability = "imba_nevermore_requiem";
        this.extra_cap_modifier = "modifier_imba_necromastery_talent_extra_cap";
        this.creep_kill_soul_count = this.ability.GetSpecialValueFor("creep_kill_soul_count");
        this.hero_kill_soul_count = this.ability.GetSpecialValueFor("hero_kill_soul_count");
        this.hero_attack_soul_count = this.ability.GetSpecialValueFor("hero_attack_soul_count");
        this.shadowraze_soul_count = this.ability.GetSpecialValueFor("shadowraze_soul_count");
        this.damage_per_soul = this.ability.GetSpecialValueFor("damage_per_soul");
        this.base_max_souls = this.ability.GetSpecialValueFor("max_souls");
        this.scepter_max_souls = this.ability.GetSpecialValueFor("scepter_max_souls");
        this.max_souls = this.base_max_souls;
        this.total_max_souls = this.base_max_souls;
        this.temporary_soul_duration = this.ability.GetSpecialValueFor("temporary_soul_duration");
        this.max_temporary_souls_pct = this.ability.GetSpecialValueFor("max_temporary_souls_pct");
        this.soul_projectile_speed = this.ability.GetSpecialValueFor("soul_projectile_speed");
        this.souls_lost_on_death_pct = this.ability.GetSpecialValueFor("souls_lost_on_death_pct");
        if (IsServer()) {
            if (this.ability.IsStolen()) {
                let enemy_heroes = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, 5000, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_DEAD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST, false);
                let modifier_souls = "modifier_imba_necromastery_souls";
                for (const [_, enemy_hero] of GameFunc.iPair(enemy_heroes)) {
                    if (enemy_hero.HasModifier(modifier_souls)) {
                        let modifier_souls_handler = enemy_hero.FindModifierByName(modifier_souls);
                        if (modifier_souls_handler) {
                            let stacks = modifier_souls_handler.GetStackCount();
                            this.SetStackCount(stacks);
                            return;
                        }
                    }
                }
                return;
            }
            this.max_souls_inc_temp = this.base_max_souls * (1 + (this.max_temporary_souls_pct * 0.01));
            if (!this.soul_table) {
                this.soul_table = []
            }
            this.StartIntervalThink(0.1);
        }
    }
    GetHeroEffectName(): string {
        return "particles/units/heroes/hero_nevermore/nevermore_souls_hero_effect.vpcf";
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.caster.HasScepter()) {
                this.max_souls = this.scepter_max_souls;
            } else {
                this.max_souls = this.base_max_souls;
            }
            if (this.caster.HasTalent("special_bonus_imba_nevermore_3") && this.ability.hero_killed) {
                if (this.total_max_souls != this.max_souls + this.ability.hero_killed) {
                    this.total_max_souls = this.max_souls + this.ability.hero_killed;
                }
            } else {
                this.total_max_souls = this.max_souls;
            }
            this.max_souls_inc_temp = this.total_max_souls * (1 + (this.max_temporary_souls_pct * 0.01));
            let stacks = this.GetStackCount();
            if (stacks <= this.total_max_souls) {
                this.SetDuration(-1, true);
            }
            if (stacks < GameFunc.GetCount(this.soul_table)) {
                for (let i = this.soul_table.length - 1; i > (stacks + 1); i--) {
                    this.soul_table.pop();
                }
            }
            if (GameFunc.GetCount(this.soul_table) > this.total_max_souls) {
                for (let i = GameFunc.GetCount(this.soul_table) - 1; i > (this.total_max_souls + 1); i += -1) {
                    if (this.soul_table[i] + this.temporary_soul_duration < GameRules.GetGameTime()) {
                        table.remove(this.soul_table, i);
                        this.DecrementStackCount();
                    }
                }
            }
        }
    }

    OnStackCountChanged(old_stack_count: number): void {
        if (IsServer()) {
            if (this.ability.IsStolen()) {
                return undefined;
            }
            let stacks = this.GetStackCount();
            if (stacks > old_stack_count) {
                if (stacks > this.max_souls_inc_temp) {
                    this.SetStackCount(this.max_souls_inc_temp);
                    return undefined;
                }
                if (stacks > this.total_max_souls) {
                    this.SetDuration(this.temporary_soul_duration, true);
                }
                table.insert(this.soul_table, GameRules.GetGameTime());
            }
        }
    }
    DestroyOnExpire(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            3: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        let stacks = this.GetStackCount();
        return this.damage_per_soul * stacks;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            let target = keys.target;
            if (this.ability.IsStolen()) {
                return undefined;
            }
            if (this.caster == attacker) {
                if (this.caster.PassivesDisabled()) {
                    return undefined;
                }
                if (this.caster.HasTalent("special_bonus_imba_nevermore_4")) {
                    if (target.GetTeamNumber() != this.caster.GetTeamNumber() && target.IsCreep() || target.IsRealUnit()) {
                        let particle_lifesteal = "particles/generic_gameplay/generic_lifesteal.vpcf";
                        if (this.caster.IsRealUnit()) {
                            let damage = keys.damage;
                            let stacks = this.GetStackCount();
                            let lifesteal_per_soul = this.caster.GetTalentValue("special_bonus_imba_nevermore_4");
                            let lifesteal = lifesteal_per_soul * stacks;
                            let heal_amount = damage * lifesteal * 0.01;
                            this.caster.Heal(heal_amount, this.GetAbilityPlus());
                            let particle_lifesteal_fx = ResHelper.CreateParticleEx(particle_lifesteal, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.caster);
                            ParticleManager.SetParticleControl(particle_lifesteal_fx, 0, this.caster.GetAbsOrigin());
                        } else {
                            let particle_lifesteal_fx = ResHelper.CreateParticleEx(particle_lifesteal, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.caster);
                            ParticleManager.SetParticleControl(particle_lifesteal_fx, 0, this.caster.GetAbsOrigin());
                        }
                    }
                }
                if (!target.IsRealUnit() || attacker.GetTeam() == target.GetTeam()) {
                    return undefined;
                }
                AddNecromasterySouls(this.caster, this.hero_attack_soul_count);
                if (!this.caster.PassivesDisabled() && !this.caster.IsInvisiblePlus()) {
                    let soul_projectile = {
                        Target: this.caster,
                        Source: target,
                        Ability: this.ability,
                        EffectName: this.particle_soul_hero,
                        bDodgeable: false,
                        bProvidesVision: false,
                        iMoveSpeed: this.soul_projectile_speed,
                        iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION
                    }
                    ProjectileManager.CreateTrackingProjectile(soul_projectile);
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            let target = keys.unit;
            let attacker = keys.attacker;
            if (this.ability.IsStolen()) {
                return undefined;
            }
            if (string.find(this.caster.GetUnitName(), "npc_imba_pugna_nether_ward")) {
                return;
            }
            if (this.caster == attacker && this.caster != target) {
                if (target.IsIllusion()) {
                    return;
                }
                if (target.IsTempestDouble()) {
                    return;
                }
                if (target.IsBuilding()) {
                    return;
                }
                if (this.IsGinger(target)) {
                    return;
                }
                let soul_count = 0;
                if (target.IsRealUnit()) {
                    // todo GetKills?
                    // this.ability.hero_killed = (this.ability.hero_killed || (this.caster.GetKills() - 1)) + 1;
                    soul_count = this.hero_kill_soul_count;
                } else {
                    soul_count = this.creep_kill_soul_count;
                }
                AddNecromasterySouls(this.caster, soul_count);
                if (!this.caster.PassivesDisabled() && !this.caster.IsInvisiblePlus()) {
                    if (soul_count == this.hero_kill_soul_count) {
                        let soul_projectile = {
                            Target: this.caster,
                            Source: target,
                            Ability: this.ability,
                            EffectName: this.particle_soul_hero,
                            bDodgeable: false,
                            bProvidesVision: false,
                            iMoveSpeed: this.soul_projectile_speed,
                            iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION
                        }
                        ProjectileManager.CreateTrackingProjectile(soul_projectile);
                    } else {
                        let soul_projectile = {
                            Target: this.caster,
                            Source: target,
                            Ability: this.ability,
                            EffectName: this.particle_soul_creep,
                            bDodgeable: false,
                            bProvidesVision: false,
                            iMoveSpeed: this.soul_projectile_speed,
                            iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION
                        }
                        ProjectileManager.CreateTrackingProjectile(soul_projectile);
                    }
                }
            }
            if (this.caster == target && !target.IsIllusion() && (!this.caster.IsReincarnating || (this.caster.IsReincarnating && !this.caster.IsReincarnating()))) {
                let stacks = this.GetStackCount();
                let stacks_lost = math.floor(stacks * (this.souls_lost_on_death_pct * 0.01));
                if (!this.caster.HasTalent("special_bonus_imba_nevermore_7")) {
                    RemoveNecromasterySouls(this.caster, stacks_lost);
                }
                if (this.caster.HasAbility(this.requiem_ability)) {
                    let requiem_ability_handler = this.caster.FindAbilityByName(this.requiem_ability) as imba_nevermore_requiem;
                    if (requiem_ability_handler) {
                        if (requiem_ability_handler.GetLevel() >= 1) {
                            requiem_ability_handler.OnSpellStart(true);
                        }
                    }
                }
            }
        }
    }
    RemoveOnDeath(): boolean {
        return false;
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
    AllowIllusionDuplicate(): boolean {
        return true;
    }
    IsGinger(unit: IBaseNpc_Plus) {
        let ginger_hero_names = {
            "1": "enchantress",
            "2": "lina",
            "3": "windrunner"
        }
        let unit_name = unit.GetName();
        for (const [_, name] of GameFunc.Pair(ginger_hero_names)) {
            if (unit_name.includes(name)) {
                return true;
            }
        }
        return false;
    }
}
@registerAbility()
export class imba_nevermore_dark_lord extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "nevermore_dark_lord";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_dark_lord_aura";
    }
    OnUpgrade(): void {
        let caster = this.GetCasterPlus();
        let upgrade_response = "nevermore_nev_ability_presence_0" + math.random(1, 3);
        EmitSoundOn(upgrade_response, caster);
    }
}
@registerModifier()
export class modifier_imba_dark_lord_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public particle_soul_hero: any;
    public modifier_souls: any;
    public aura_radius: number;
    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.particle_soul_hero = "particles/hero/nevermore/nevermore_soul_projectile.vpcf";
        this.modifier_souls = "modifier_imba_necromastery_souls";
        this.aura_radius = this.ability.GetSpecialValueFor("aura_radius");
        this.StartIntervalThink(1);
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.caster.HasTalent("special_bonus_imba_nevermore_5") && this.caster.HasModifier(this.modifier_souls) && this.caster.IsAlive()) {
                let soul_drain_count = this.caster.GetTalentValue("special_bonus_imba_nevermore_5");
                let soul_projectile_speed;
                let modifier_souls_handler = this.caster.FindModifierByName(this.modifier_souls);
                if (!modifier_souls_handler) {
                    return;
                } else {
                    soul_projectile_speed = modifier_souls_handler.GetSpecialValueFor("soul_projectile_speed");
                }
                let enemy_heroes = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.aura_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy_hero] of GameFunc.iPair(enemy_heroes)) {
                    if (!this.caster.IsInvisiblePlus()) {
                        let soul_projectile = {
                            Target: this.caster,
                            Source: enemy_hero,
                            Ability: this.ability,
                            EffectName: this.particle_soul_hero,
                            bDodgeable: false,
                            bProvidesVision: false,
                            iMoveSpeed: soul_projectile_speed,
                            iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION
                        }
                        ProjectileManager.CreateTrackingProjectile(soul_projectile);
                    }
                    if (enemy_hero.IsRealUnit()) {
                        AddNecromasterySouls(this.caster, soul_drain_count);
                    }
                }
            }
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

    AllowIllusionDuplicate(): boolean {
        return true;
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        if (!target.CanEntityBeSeenByMyTeam(this.caster)) {
            return true;
        }
        return false;
    }
    GetAuraRadius(): number {
        return this.aura_radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_ALL;
    }
    GetModifierAura(): string {
        return "modifier_imba_dark_lord_debuff";
    }
    IsAura(): boolean {
        if (this.caster.PassivesDisabled()) {
            return false;
        }
        return true;
    }
}
@registerModifier()
export class modifier_imba_dark_lord_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public armor_reduction: any;
    public raze_armor_reduction: any;
    public raze_reduction_duration: number;
    public max_stacks: number;
    public last_stack: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.armor_reduction = this.ability.GetSpecialValueFor("armor_reduction");
        this.raze_armor_reduction = this.ability.GetSpecialValueFor("raze_armor_reduction");
        this.raze_reduction_duration = this.ability.GetSpecialValueFor("raze_reduction_duration");
        this.max_stacks = this.ability.GetSpecialValueFor("max_stacks");
        if (IsServer()) {
            if (!this.last_stack) {
                this.last_stack = GameRules.GetGameTime();
            }
            this.StartIntervalThink(0.25);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let stacks = this.GetStackCount();
            if (stacks > 0) {
                if (this.last_stack + this.raze_reduction_duration < GameRules.GetGameTime()) {
                    this.SetStackCount(0);
                }
            }
        }
    }
    OnStackCountChanged(p_0: number,): void {
        if (IsServer()) {
            let stacks = this.GetStackCount();
            if (stacks > this.max_stacks) {
                this.SetStackCount(this.max_stacks);
            }
            this.last_stack = GameRules.GetGameTime();
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
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        let stacks = this.GetStackCount();
        let total_armor_reduction = this.armor_reduction + stacks * this.raze_armor_reduction;
        return total_armor_reduction * (-1);
    }
}
@registerAbility()
export class imba_nevermore_requiem extends BaseAbility_Plus {
    public sound: any;
    public wings_particle: any;
    GetAbilityTextureName(): string {
        return "nevermore_requiem";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetAssociatedSecondaryAbilities(): string {
        return "imba_nevermore_necromastery";
    }
    OnAbilityPhaseStart(): boolean {
        if (GameServiceConfig.USE_MEME_SOUNDS && RollPercentage(GameServiceConfig.MEME_SOUNDS_CHANCE) && this.GetCasterPlus().HasModifier("modifier_imba_necromastery_souls") && this.GetCasterPlus().findBuff<modifier_imba_necromastery_souls>("modifier_imba_necromastery_souls").GetStackCount() >= this.GetCasterPlus().findBuff<modifier_imba_necromastery_souls>("modifier_imba_necromastery_souls").base_max_souls) {
            this.sound = "Imba.NevermoreJohnCena";
        } else {
            this.sound = "Hero_Nevermore.RequiemOfSoulsCast";
        }
        if (this.GetCasterPlus().IsInvisiblePlus()) {
            EmitSoundOnLocationForAllies(this.GetCasterPlus().GetAbsOrigin(), this.sound, this.GetCasterPlus());
        } else {
            this.GetCasterPlus().EmitSound(this.sound);
        }
        this.wings_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_nevermore/nevermore_wings.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_6);
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_reqiuem_phase_buff", {});
        return true;
    }
    OnAbilityPhaseInterrupted(): void {
        this.GetCasterPlus().FadeGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_6);
        this.GetCasterPlus().RemoveModifierByName("modifier_imba_reqiuem_phase_buff");
        this.GetCasterPlus().StopSound(this.sound);
        if (this.wings_particle) {
            ParticleManager.DestroyParticle(this.wings_particle, true);
            ParticleManager.ReleaseParticleIndex(this.wings_particle);
        }
    }
    OnSpellStart(death_cast = false): void {
        let caster = this.GetCasterPlus();
        let cast_response = {
            "1": "nevermore_nev_ability_requiem_01",
            "2": "nevermore_nev_ability_requiem_02",
            "3": "nevermore_nev_ability_requiem_03",
            "4": "nevermore_nev_ability_requiem_04",
            "5": "nevermore_nev_ability_requiem_05",
            "6": "nevermore_nev_ability_requiem_06",
            "7": "nevermore_nev_ability_requiem_07",
            "8": "nevermore_nev_ability_requiem_08",
            "9": "nevermore_nev_ability_requiem_11",
            "10": "nevermore_nev_ability_requiem_12",
            "11": "nevermore_nev_ability_requiem_13",
            "12": "nevermore_nev_ability_requiem_14"
        }
        let sound_cast = "Hero_Nevermore.RequiemOfSouls";
        let particle_caster_souls = "particles/units/heroes/hero_nevermore/nevermore_requiemofsouls_a.vpcf";
        let particle_caster_ground = "particles/units/heroes/hero_nevermore/nevermore_requiemofsouls.vpcf";
        let modifier_phase = "modifier_imba_reqiuem_phase_buff";
        let modifier_souls = "modifier_imba_necromastery_souls";
        let modifier_harvest = "modifier_imba_reqiuem_harvest";
        let harvest_base_cd = this.GetSpecialValueFor("harvest_base_cd");
        let souls_per_line = this.GetSpecialValueFor("souls_per_line");
        let travel_distance = this.GetSpecialValueFor("travel_distance");
        EmitSoundOn(GFuncRandom.RandomValue(cast_response), caster);
        EmitSoundOn(sound_cast, caster);
        if (this.wings_particle) {
            ParticleManager.ReleaseParticleIndex(this.wings_particle);
        }
        caster.RemoveModifierByName(modifier_phase);
        // todo lines?
        let lines = 1;
        let particle_caster_souls_fx = ResHelper.CreateParticleEx(particle_caster_souls, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
        ParticleManager.SetParticleControl(particle_caster_souls_fx, 0, caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_caster_souls_fx, 1, Vector(lines, 0, 0));
        ParticleManager.SetParticleControl(particle_caster_souls_fx, 2, caster.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(particle_caster_souls_fx);
        let particle_caster_ground_fx = ResHelper.CreateParticleEx(particle_caster_ground, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
        ParticleManager.SetParticleControl(particle_caster_ground_fx, 0, caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_caster_ground_fx, 1, Vector(lines, 0, 0));
        ParticleManager.ReleaseParticleIndex(particle_caster_ground_fx);
        let modifier_souls_handler;
        let stacks;
        let necro_ability;
        let max_souls;
        if (caster.HasModifier(modifier_souls)) {
            modifier_souls_handler = caster.FindModifierByName(modifier_souls) as modifier_imba_necromastery_souls;
            if (modifier_souls_handler) {
                stacks = modifier_souls_handler.GetStackCount();
                necro_ability = modifier_souls_handler.GetAbilityPlus();
                max_souls = modifier_souls_handler.total_max_souls;
            }
        }
        if (!modifier_souls_handler) {
            return undefined;
        }
        let line_count;
        if (death_cast && !caster.HasTalent("special_bonus_imba_nevermore_7")) {
            if (stacks > max_souls) {
                let temp_souls_count = stacks - max_souls;
                RemoveNecromasterySouls(caster, temp_souls_count);
                stacks = max_souls;
            }
            line_count = math.floor(stacks / souls_per_line);
        } else {
            line_count = math.floor(stacks / souls_per_line);
            if (stacks > max_souls) {
                let temp_souls_count = stacks - max_souls;
                RemoveNecromasterySouls(caster, temp_souls_count);
            }
        }
        caster.AddNewModifier(caster, this, modifier_harvest, {
            duration: harvest_base_cd
        });
        let line_position = caster.GetAbsOrigin() + caster.GetForwardVector() * travel_distance as Vector;
        if (stacks >= 1) {
            CreateRequiemSoulLine(caster, this, line_position, death_cast);
        }
        let qangle_rotation_rate = 360 / line_count;
        for (let i = 0; i < line_count - 1; i++) {
            let qangle = QAngle(0, qangle_rotation_rate, 0);
            line_position = RotatePosition(caster.GetAbsOrigin(), qangle, line_position);
            CreateRequiemSoulLine(caster, this, line_position, death_cast);
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, extra_data: any): boolean | void {
        if (!target) {
            return undefined;
        }
        let caster = this.GetCasterPlus();
        let ability = this;
        let modifier_debuff = "modifier_imba_reqiuem_debuff";
        let modifier_harvest = "modifier_imba_reqiuem_harvest";
        let scepter_line = extra_data.scepter_line;
        let death_cast = extra_data.death_cast;
        let damage = ability.GetSpecialValueFor("damage");
        let slow_duration = ability.GetSpecialValueFor("slow_duration");
        let harvest_line_duration_inc = ability.GetSpecialValueFor("harvest_line_duration_inc");
        let scepter_line_damage_pct = ability.GetSpecialValueFor("scepter_line_damage_pct");
        if (scepter_line == 0) {
            scepter_line = false;
        } else {
            scepter_line = true;
        }
        target.AddNewModifier(caster, ability, modifier_debuff, {
            duration: slow_duration * (1 - target.GetStatusResistance())
        });
        if (caster.HasModifier(modifier_harvest) && target.IsRealUnit()) {
            let modifier_harvest_handler = caster.FindModifierByName(modifier_harvest);
            if (modifier_harvest_handler) {
                modifier_harvest_handler.SetDuration(modifier_harvest_handler.GetRemainingTime() + harvest_line_duration_inc, true);
            }
        }
        if (scepter_line) {
            damage = damage * (scepter_line_damage_pct * 0.01);
        }
        target.EmitSound("Hero_Nevermore.RequiemOfSouls.Damage");
        let damageTable = {
            victim: target,
            damage: damage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            attacker: caster,
            ability: ability
        }
        let damage_dealt = ApplyDamage(damageTable);
        if (scepter_line) {
            caster.Heal(damage_dealt, this);
        }
        if (!death_cast) {
            if (!target.HasModifier("modifier_nevermore_requiem_fear")) {
                target.AddNewModifier(this.GetCasterPlus(), this, "modifier_nevermore_requiem_fear", {
                    duration: this.GetSpecialValueFor("requiem_slow_duration") * (1 - target.GetStatusResistance())
                });
            } else {
                target.findBuff("modifier_nevermore_requiem_fear").SetDuration(math.min(target.FindModifierByName("modifier_nevermore_requiem_fear").GetRemainingTime() + this.GetSpecialValueFor("requiem_slow_duration"), this.GetSpecialValueFor("requiem_slow_duration_max")) * (1 - target.GetStatusResistance()), true);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_reqiuem_phase_buff extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        }
        return state;
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
export class modifier_imba_reqiuem_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public duration: number;
    public particle_black_screen: any;
    public damage_reduction_pct: number;
    public ms_slow_pct: number;
    public scepter: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.duration = this.GetDuration();
        this.particle_black_screen = "particles/hero/nevermore/screen_requiem_indicator.vpcf";
        this.damage_reduction_pct = this.ability.GetSpecialValueFor("damage_reduction_pct") * (-1);
        this.ms_slow_pct = this.ability.GetSpecialValueFor("ms_slow_pct") * (-1);
        if (IsServer()) {
            this.scepter = this.caster.HasScepter();
            if (this.scepter && this.parent.IsRealUnit()) {
                let requiem_screen_particle = ParticleManager.CreateParticleForPlayer(this.particle_black_screen, ParticleAttachment_t.PATTACH_EYES_FOLLOW, this.parent, PlayerResource.GetPlayer(this.parent.GetPlayerID()));
                this.AddParticle(requiem_screen_particle, false, false, -1, false, false);
            }
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
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.damage_reduction_pct;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.ms_slow_pct;
    }
}
@registerModifier()
export class modifier_imba_reqiuem_harvest extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public razes: any;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.razes = {}
            this.razes[0] = "imba_nevermore_shadowraze_close";
            this.razes[2] = "imba_nevermore_shadowraze_medium";
            this.razes[3] = "imba_nevermore_shadowraze_far";
            for (let i = 0; i < GameFunc.GetCount(this.razes); i++) {
                if (this.caster.HasAbility(this.razes[i])) {
                    let raze_handler = this.caster.FindAbilityByName(this.razes[i]);
                    if (raze_handler) {
                        raze_handler.EndCooldown();
                    }
                }
            }
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
}
@registerModifier()
export class modifier_special_bonus_imba_nevermore_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_nevermore_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_nevermore_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_nevermore_5 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_nevermore_6 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_nevermore_7 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_nevermore_8 extends BaseModifier_Plus {
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
