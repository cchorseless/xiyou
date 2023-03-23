
import { AI_ability } from "../../../ai/AI_ability";
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionBoth_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

function StarfallWave(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus, caster_position: Vector, radius: number, damage: number) {
    let particle_starfall = "particles/units/heroes/hero_mirana/mirana_starfall_attack.vpcf";
    let hit_delay = ability.GetSpecialValueFor("hit_delay");
    let sound_impact = "Ability.StarfallImpact";
    let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster_position, undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_ANY_ORDER, false);
    for (const [_, enemy] of GameFunc.iPair(enemies)) {
        if (!enemy.IsMagicImmune()) {
            let particle_starfall_fx = ResHelper.CreateParticleEx(particle_starfall, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy);
            ParticleManager.SetParticleControl(particle_starfall_fx, 0, enemy.GetAbsOrigin());
            ParticleManager.SetParticleControl(particle_starfall_fx, 1, enemy.GetAbsOrigin());
            ParticleManager.SetParticleControl(particle_starfall_fx, 3, enemy.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(particle_starfall_fx);
            ability.AddTimer(hit_delay, () => {
                if (!enemy.IsMagicImmune()) {
                    EmitSoundOn(sound_impact, enemy);
                    let damageTable = {
                        victim: enemy,
                        damage: damage,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                        attacker: caster,
                        ability: ability
                    }
                    ApplyDamage(damageTable);
                    if (caster.HasTalent("special_bonus_imba_mirana_8")) {
                        let seed_duration = caster.GetTalentValue("special_bonus_imba_mirana_8");
                        enemy.AddNewModifier(caster, ability, "modifier_imba_starfall_talent_seed_debuff", {
                            duration: seed_duration * (1 - enemy.GetStatusResistance())
                        });
                    }
                }
            });
        }
    }
}
function SecondaryStarfall(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus, caster_position: Vector, radius: number, damage: number) {
    let secondary_delay = ability.GetSpecialValueFor("secondary_delay");
    let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster_position, undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST, false);
    if (enemies[0]) {
        ability.AddTimer(secondary_delay, () => {
            SecondaryStarfallTarget(caster, ability, enemies[0], damage);
        });
    }
}
function SecondaryStarfallTarget(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus, target: IBaseNpc_Plus, damage: number) {
    let particle_starfall = "particles/units/heroes/hero_mirana/mirana_starfall_attack.vpcf";
    let hit_delay = ability.GetSpecialValueFor("hit_delay");
    let sound_impact = "Ability.StarfallImpact";
    let particle_starfall_fx = ResHelper.CreateParticleEx(particle_starfall, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
    ParticleManager.SetParticleControl(particle_starfall_fx, 0, target.GetAbsOrigin());
    ParticleManager.SetParticleControl(particle_starfall_fx, 1, target.GetAbsOrigin());
    ParticleManager.SetParticleControl(particle_starfall_fx, 3, target.GetAbsOrigin());
    ParticleManager.ReleaseParticleIndex(particle_starfall_fx);
    ability.AddTimer(hit_delay, () => {
        if (!target.IsMagicImmune()) {
            EmitSoundOn(sound_impact, target);
            let damageTable = {
                victim: target,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                attacker: caster,
                ability: ability
            }
            ApplyDamage(damageTable);
        }
    });
}
function FireSacredArrow(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus, spawn_point: Vector, direction: Vector) {
    let particle_arrow = "particles/units/heroes/hero_mirana/mirana_spell_arrow.vpcf";
    let arrow_radius;
    let arrow_speed;
    let vision_radius;
    let arrow_distance;
    if (ability.GetLevel() == 0) {
        arrow_radius = ability.GetLevelSpecialValueFor("arrow_radius", 1);
        arrow_speed = ability.GetLevelSpecialValueFor("arrow_speed", 1);
        vision_radius = ability.GetLevelSpecialValueFor("vision_radius", 1);
        arrow_distance = ability.GetLevelSpecialValueFor("arrow_distance", 1);
    } else {
        arrow_radius = ability.GetSpecialValueFor("arrow_radius");
        arrow_speed = ability.GetSpecialValueFor("arrow_speed");
        vision_radius = ability.GetSpecialValueFor("vision_radius");
        arrow_distance = ability.GetSpecialValueFor("arrow_distance");
    }
    let arrow_projectile: CreateLinearProjectileOptions = {
        Ability: ability,
        EffectName: particle_arrow,
        vSpawnOrigin: spawn_point,
        fDistance: arrow_distance,
        fStartRadius: arrow_radius,
        fEndRadius: arrow_radius,
        Source: caster,
        bHasFrontalCone: false,
        // bReplaceExisting: false,
        iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
        iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
        // bDeleteOnHit: true,
        vVelocity: direction * (arrow_speed + caster.GetTalentValue("special_bonus_imba_mirana_10")) * Vector(1, 1, 0) as Vector,
        fExpireTime: GameRules.GetGameTime() + 10.0,
        bProvidesVision: true,
        iVisionRadius: vision_radius,
        iVisionTeamNumber: caster.GetTeamNumber(),
        ExtraData: {
            cast_loc_x: tostring(caster.GetAbsOrigin().x),
            cast_loc_y: tostring(caster.GetAbsOrigin().y),
            cast_loc_z: tostring(caster.GetAbsOrigin().z)
        }
    }
    ProjectileManager.CreateLinearProjectile(arrow_projectile);
}

@registerAbility()
export class imba_mirana_starfall extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "mirana_starfall";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_starfall_scepter_thinker";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnUnStolen(): void {
        let modifier_agh_starfall = "modifier_imba_starfall_scepter_thinker";
        if (this.GetCasterPlus().HasModifier(modifier_agh_starfall)) {
            this.GetCasterPlus().RemoveModifierByName(modifier_agh_starfall);
        }
    }
    OnSpellStart(): void {
        let ability = this;
        let particle_circle = "particles/units/heroes/hero_mirana/mirana_starfall_circle.vpcf";
        let particle_moon = "particles/units/heroes/hero_mirana/mirana_moonlight_owner.vpcf";
        let cast_response = "mirana_mir_ability_star_0";
        let sound_cast = "Ability.Starfall";
        let radius = ability.GetSpecialValueFor("radius");
        let damage = ability.GetSpecialValueFor("damage");
        let secondary_damage_pct = ability.GetSpecialValueFor("secondary_damage_pct");
        let additional_waves_count = ability.GetSpecialValueFor("additional_waves_count");
        let additional_waves_dmg_pct = ability.GetSpecialValueFor("additional_waves_dmg_pct");
        let additional_waves_interval = ability.GetSpecialValueFor("additional_waves_interval");
        if (RollPercentage(10)) {
            cast_response = cast_response + 3;
            EmitSoundOn(cast_response, this.GetCasterPlus());
        } else if (RollPercentage(75)) {
            cast_response = cast_response + math.random(1, 2);
            EmitSoundOn(cast_response, this.GetCasterPlus());
        }
        EmitSoundOn(sound_cast, this.GetCasterPlus());
        let caster_position = this.GetCasterPlus().GetAbsOrigin();
        let repeats = additional_waves_count * additional_waves_interval;
        let current_instance = 0;
        this.AddTimer(0, () => {
            let particle_circle_fx = ResHelper.CreateParticleEx(particle_circle, ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
            ParticleManager.SetParticleControl(particle_circle_fx, 0, caster_position);
            ParticleManager.ReleaseParticleIndex(particle_circle_fx);
            current_instance = current_instance + 1;
            if (current_instance <= repeats) {
                return 1;
            } else {
                return undefined;
            }
        });
        let particle_moon_fx = ResHelper.CreateParticleEx(particle_moon, ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(particle_moon_fx, 0, Vector(caster_position.x, caster_position.y, caster_position.z + 400));
        this.AddTimer(repeats, () => {
            ParticleManager.DestroyParticle(particle_moon_fx, false);
            ParticleManager.ReleaseParticleIndex(particle_moon_fx);
        });
        StarfallWave(this.GetCasterPlus(), ability, caster_position, radius, damage);
        let secondary_wave_damage = damage * (secondary_damage_pct * 0.01);
        SecondaryStarfall(this.GetCasterPlus(), ability, caster_position, radius, secondary_wave_damage);
        let current_wave = 1;
        let additional_wave_damage = damage * (additional_waves_dmg_pct * 0.01);
        let additional_secondary_damage = additional_wave_damage * (secondary_damage_pct * 0.01);
        this.AddTimer(additional_waves_interval, () => {
            StarfallWave(this.GetCasterPlus(), ability, caster_position, radius, additional_wave_damage);
            SecondaryStarfall(this.GetCasterPlus(), ability, caster_position, radius, additional_secondary_damage);
            current_wave = current_wave + 1;
            if (current_wave <= additional_waves_count) {
                return additional_waves_interval;
            } else {
                return undefined;
            }
        });
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.NO_TARGET_if_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_starfall_scepter_thinker extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public radius: number;
    public damage: number;
    public scepter_starfall_cd: any;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.StartIntervalThink(1);
        }
    }
    IsHidden(): boolean {
        if (this.GetCasterPlus().HasScepter()) {
            return false;
        }
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    DestroyOnExpire(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            this.radius = this.ability.GetSpecialValueFor("radius");
            this.damage = this.ability.GetSpecialValueFor("damage");
            this.scepter_starfall_cd = this.ability.GetSpecialValueFor("scepter_starfall_cd");
            if (this.GetRemainingTime() > 0.5) {
                return undefined;
            } else {
                this.SetDuration(-1, true);
            }
            if (!this.caster.IsAlive()) {
                return undefined;
            }
            if (!this.caster.HasScepter()) {
                return undefined;
            }
            if (this.caster.IsInvisiblePlus()) {
                return undefined;
            }
            let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.radius - 50, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_ANY_ORDER, false);
            if (GameFunc.GetCount(enemies) == 0) {
                return undefined;
            }
            StarfallWave(this.caster, this.ability, this.caster.GetAbsOrigin(), this.radius, this.damage);
            this.SetDuration(this.scepter_starfall_cd, true);
        }
    }
}
@registerModifier()
export class modifier_imba_starfall_talent_seed_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public damage: number;
    public secondary_damage_pct: number;
    public secondary_damage: number;
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
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.damage = this.ability.GetSpecialValueFor("damage");
        this.secondary_damage_pct = this.ability.GetSpecialValueFor("secondary_damage_pct");
        this.secondary_damage = this.damage * this.secondary_damage_pct * 0.01;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        let target = keys.target;
        let attacker = keys.attacker;
        if ((attacker == this.caster) && (target == this.parent)) {
            if (target.IsMagicImmune()) {
                return undefined;
            }
            SecondaryStarfallTarget(this.caster, this.ability, target, this.secondary_damage);
        }
    }
}
@registerAbility()
export class imba_mirana_arrow extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "mirana_arrow";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnSpellStart(): void {
        if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
            this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
        }
        let caster = this.GetCasterPlus();
        let ability = this;
        let target_point = this.GetCursorPosition();
        let sound_cast = "Hero_Mirana.ArrowCast";
        let spawn_distance = ability.GetSpecialValueFor("spawn_distance");
        EmitSoundOn(sound_cast, caster);
        let direction = (target_point - caster.GetAbsOrigin() as Vector).Normalized();
        let spawn_point = caster.GetAbsOrigin() + direction * spawn_distance as Vector;
        FireSacredArrow(caster, ability, spawn_point, direction);
        if (caster.HasTalent("special_bonus_imba_mirana_4")) {
            let left_QAngle = QAngle(0, 30, 0);
            let right_QAngle = QAngle(0, -30, 0);
            let left_spawn_point = RotatePosition(caster.GetAbsOrigin(), left_QAngle, spawn_point);
            let left_direction = (left_spawn_point - caster.GetAbsOrigin() as Vector).Normalized();
            let right_spawn_point = RotatePosition(caster.GetAbsOrigin(), right_QAngle, spawn_point);
            let right_direction = (right_spawn_point - caster.GetAbsOrigin() as Vector).Normalized();
            FireSacredArrow(caster, ability, left_spawn_point, left_direction);
            FireSacredArrow(caster, ability, right_spawn_point, right_direction);
        }
    }
    OnProjectileHit_ExtraData(target: IBaseNpc_Plus | undefined, location: Vector, extra_data: any): boolean | void {
        if (!target) {
            return undefined;
        }
        let caster = this.GetCasterPlus();
        let ability = this;
        let cast_response_hero = {
            "1": "mirana_mir_ability_arrow_01",
            "2": "mirana_mir_ability_arrow_07",
            "3": "mirana_mir_lasthit_03"
        }
        let cast_response_hero_perfect = "mirana_mir_ability_arrow_02";
        let cast_response_creep = {
            "1": "mirana_mir_ability_arrow_03",
            "2": "mirana_mir_ability_arrow_04",
            "3": "mirana_mir_ability_arrow_05",
            "4": "mirana_mir_ability_arrow_06",
            "5": "mirana_mir_ability_arrow_08"
        }
        let cast_response_roshan = {
            "1": "mirana_mir_ability_arrow_09",
            "2": "mirana_mir_ability_arrow_10",
            "3": "mirana_mir_ability_arrow_11",
            "4": "mirana_mir_ability_arrow_12"
        }
        let sound_impact = "Hero_Mirana.ArrowImpact";
        let modifier_stun = "modifier_imba_sacred_arrow_stun";
        let base_damage = ability.GetSpecialValueFor("base_damage");
        let distance_tick = ability.GetSpecialValueFor("distance_tick");
        let stun_increase_per_tick = ability.GetSpecialValueFor("stun_increase_per_tick");
        let damage_increase_per_tick = ability.GetSpecialValueFor("damage_increase_per_tick");
        let max_bonus_damage = ability.GetSpecialValueFor("max_bonus_damage");
        let max_stun_duration = ability.GetSpecialValueFor("max_stun_duration");
        let base_stun = ability.GetSpecialValueFor("base_stun");
        let vision_radius = ability.GetSpecialValueFor("vision_radius");
        let vision_linger_duration = ability.GetSpecialValueFor("vision_linger_duration");
        if (target.IsCreep() && !target.IsRoshan()) {
            let chosen_response = GFuncRandom.RandomValue(cast_response_creep);
            EmitSoundOn(chosen_response, caster);
        }
        if (target.IsRoshan()) {
            let chosen_response = GFuncRandom.RandomValue(cast_response_roshan);
            EmitSoundOn(chosen_response, caster);
        }
        EmitSoundOn(sound_impact, target);
        AddFOWViewer(caster.GetTeamNumber(), location, vision_radius, vision_linger_duration, false);
        if (target.IsCreep() && !target.IsRoshan() && !target.IsAncient()) {
            target.Kill(ability, caster);
            return true;
        }
        if (target.IsIllusion()) {
            target.Kill(ability, caster);
            return true;
        }
        let cast_location = Vector(tonumber(extra_data.cast_loc_x), tonumber(extra_data.cast_loc_y), tonumber(extra_data.cast_loc_z));
        let distance = (target.GetAbsOrigin() - cast_location as Vector).Length2D();
        let damage = base_damage + (distance / distance_tick * damage_increase_per_tick);
        let damageTable = {
            victim: target,
            damage: damage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            attacker: caster,
            ability: ability
        }
        ApplyDamage(damageTable);
        let stun_duration = base_stun + (distance / distance_tick * stun_increase_per_tick);
        if (stun_duration > max_stun_duration) {
            stun_duration = max_stun_duration;
        }
        if (target.IsRealUnit()) {
            if (stun_duration >= max_stun_duration) {
                EmitSoundOn(cast_response_hero_perfect, caster);
            } else {
                let chosen_response = GFuncRandom.RandomValue(cast_response_hero);
                EmitSoundOn(chosen_response, caster);
            }
        }
        target.AddNewModifier(caster, ability, modifier_stun, {
            duration: stun_duration * (1 - target.GetStatusResistance())
        });
        return true;
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.POSITION_if_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_sacred_arrow_stun extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public modifier_arrow_stun: any;
    public modifier_haste: any;
    public attackers_table: IBaseNpc_Plus[];
    public on_prow_crit_damage: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.modifier_arrow_stun = "modifier_imba_sacred_arrow_stun";
            this.modifier_haste = "modifier_imba_sacred_arrow_haste";
            this.attackers_table = []
            this.on_prow_crit_damage = this.ability.GetSpecialValueFor("on_prow_crit_damage");
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return true;
    }
    IsPurgeException(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_stunned.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ORDER,
            2: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierAbilityEvent): void {
        if (IsServer()) {
            let unit = keys.unit;
            let order_type = keys.order_type;
            let target = keys.target;
            if (unit.GetTeamNumber() == this.caster.GetTeamNumber()) {
                if ((order_type == dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET || order_type == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET) && target.HasModifier(this.modifier_arrow_stun)) {
                    unit.AddNewModifier(this.caster, this.ability, this.modifier_haste, {});
                } else {
                    if (unit.HasModifier(this.modifier_haste)) {
                        unit.RemoveModifierByName(this.modifier_haste);
                    }
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            let target = keys.unit;
            if (target == this.parent && target.GetTeamNumber() != attacker.GetTeamNumber()) {
                if (GameFunc.GetCount(this.attackers_table) > 0) {
                    for (let i = 0; i < GameFunc.GetCount(this.attackers_table); i++) {
                        if (attacker == this.attackers_table[i]) {
                            return undefined;
                        }
                    }
                }
                this.attackers_table.push(attacker);
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            let enemies = FindUnitsInRadius(this.parent.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (enemy.HasModifier(this.modifier_haste)) {
                    enemy.RemoveModifierByName(this.modifier_haste);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_sacred_arrow_haste extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public on_prowl_movespeed: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.on_prowl_movespeed = this.ability.GetSpecialValueFor("on_prowl_movespeed");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BASE_OVERRIDE,
            2: MODIFIER_PROPERTY_MOVESPEED_MAX
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BASE_OVERRIDE)
    CC_GetModifierMoveSpeedOverride(): number {
        return this.on_prowl_movespeed;
    }
    GetModifierMoveSpeed_Max() {
        return this.on_prowl_movespeed;
    }
    GetEffectName(): string {
        return "particles/hero/mirana/mirana_sacred_boost.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
}
@registerAbility()
export class imba_mirana_leap extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "mirana_leap";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_mirana_leap";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES;
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (IsClient()) {
            if (GameRules.IsDaytimePlus()) {
                return this.GetSpecialValueFor("leap_range") + this.GetCasterPlus().GetCastRangeBonus();
            } else {
                return this.GetSpecialValueFor("leap_range") + this.GetSpecialValueFor("night_leap_range_bonus") + this.GetCasterPlus().GetCastRangeBonus();
            }
        }
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnOwnerDied(): void {
        this.SetActivated(true);
    }
    OnOwnerSpawned(): void {
        this.SetActivated(true);
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target_point = this.GetCursorPosition();
        let modifier_movement = "modifier_imba_leap_movement";
        let sound_cast = "Ability.Leap";
        if (target_point == caster.GetAbsOrigin() && !this.GetAutoCastState()) {
            if (GameRules.IsDaytimePlus()) {
                target_point = caster.GetAbsOrigin() + (caster.GetForwardVector() * this.GetSpecialValueFor("leap_range")) as Vector;
            } else {
                target_point = caster.GetAbsOrigin() + (caster.GetForwardVector() * (this.GetSpecialValueFor("leap_range") + this.GetSpecialValueFor("night_leap_range_bonus"))) as Vector;
            }
        } else {
            let selected_distance = (this.GetCasterPlus().GetAbsOrigin() - target_point as Vector).Length2D();
            let leap_range = this.GetSpecialValueFor("leap_range");
            if (!GameRules.IsDaytimePlus()) {
                leap_range = leap_range + this.GetSpecialValueFor("night_leap_range_bonus");
            }
            let new_distance = math.min(selected_distance, leap_range + GPropertyCalculate.GetCastRangeBonus(caster));
            let new_target_point = this.GetCasterPlus().GetAbsOrigin() + (target_point - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized() * new_distance as Vector;
            target_point = new_target_point;
        }
        caster.StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_3);
        EmitSoundOn(sound_cast, caster);
        caster.FaceTowards(target_point);
        let modifier_movement_handler = caster.AddNewModifier(caster, this, modifier_movement, {}) as modifier_imba_leap_movement;
        if (modifier_movement_handler) {
            modifier_movement_handler.target_point = target_point;
        }
        if (caster.HasTalent("special_bonus_imba_mirana_6")) {
            let jump_speed = this.GetSpecialValueFor("jump_speed");
            if (target_point == this.GetCasterPlus().GetAbsOrigin()) {
                target_point = this.GetCasterPlus().GetAbsOrigin() + this.GetCasterPlus().GetForwardVector() as Vector;
            }
            let distance = (caster.GetAbsOrigin() - target_point as Vector).Length2D();
            let jump_time = distance / jump_speed;
            let direction = (target_point - caster.GetAbsOrigin() as Vector).Normalized();
            let caster_location = caster.GetAbsOrigin();
            this.AddTimer(jump_time, () => {
                let sacred_arrow_ability = caster.findAbliityPlus<imba_mirana_arrow>("imba_mirana_arrow");
                let spawn_distance;
                if (sacred_arrow_ability.GetLevel() > 0) {
                    spawn_distance = sacred_arrow_ability.GetSpecialValueFor("spawn_distance");
                } else {
                    spawn_distance = sacred_arrow_ability.GetLevelSpecialValueFor("spawn_distance", sacred_arrow_ability.GetLevel() + 1);
                }
                let spawn_point = caster_location + direction * (spawn_distance + distance) as Vector;
                FireSacredArrow(caster, sacred_arrow_ability, spawn_point, direction);
            });
        }
        this.SetActivated(false);
    }
    OnUpgrade(): void {
        if (this.GetCasterPlus().HasModifier("modifier_imba_mirana_leap")) {
            if (this.GetCasterPlus().findBuff<modifier_imba_mirana_leap>("modifier_imba_mirana_leap").GetDuration() == -1 && this.GetCasterPlus().FindModifierByName("modifier_imba_mirana_leap").GetStackCount() < this.GetSpecialValueFor("max_charges")) {
                this.GetCasterPlus().findBuff<modifier_imba_mirana_leap>("modifier_imba_mirana_leap").SetDuration(this.GetSpecialValueFor("charge_restore_time"), true);
                this.GetCasterPlus().findBuff<modifier_imba_mirana_leap>("modifier_imba_mirana_leap").StartIntervalThink(this.GetSpecialValueFor("charge_restore_time"));
            }
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.POSITION_if_friend(this, null, (unit) => unit != this.GetCasterPlus())
    }
}
@registerModifier()
export class modifier_imba_mirana_leap extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    DestroyOnExpire(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.SetStackCount(this.GetSpecialValueFor("max_charges"));
    }
    OnIntervalThink(): void {
        this.IncrementStackCount();
        if (this.GetStackCount() < this.GetSpecialValueFor("max_charges")) {
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_mirana_9")) {
                this.IncrementStackCount();
            }
            this.SetDuration(this.GetSpecialValueFor("charge_restore_time"), true);
        } else {
            this.SetDuration(-1, true);
            this.StartIntervalThink(-1);
        }
    }
}
@registerModifier()
export class modifier_imba_leap_movement extends BaseModifierMotionBoth_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public modifier_aura: any;
    public jump_speed: number;
    public aura_duration: number;
    public time_elapsed: number;
    public leap_z: any;
    public distance: number;
    public jump_time: number;
    public direction: any;
    public frametime: number;
    target_point: Vector;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.modifier_aura = "modifier_imba_leap_aura";
        this.jump_speed = this.ability.GetSpecialValueFor("jump_speed");
        this.aura_duration = this.ability.GetSpecialValueFor("aura_duration");
        if (IsServer()) {
            this.time_elapsed = 0;
            this.leap_z = 0;
            this.AddTimer(FrameTime(), () => {
                this.distance = (this.caster.GetAbsOrigin() - this.target_point as Vector).Length2D();
                this.jump_time = this.distance / this.jump_speed;
                this.direction = (this.target_point - this.caster.GetAbsOrigin() as Vector).Normalized();
                this.frametime = FrameTime();
                if (!this.BeginMotionOrDestroy()) { return };
            });
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
    IgnoreTenacity() {
        return true;
    }

    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
    UpdateVerticalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            if (this.time_elapsed < this.jump_time) {
                if (this.time_elapsed <= this.jump_time / 2) {
                    this.leap_z = this.leap_z + 30;
                    this.caster.SetAbsOrigin(GetGroundPosition(this.caster.GetAbsOrigin(), this.caster) + Vector(0, 0, this.leap_z) as Vector);
                } else {
                    this.leap_z = this.leap_z - 30;
                    if (this.leap_z > 0) {
                        this.caster.SetAbsOrigin(GetGroundPosition(this.caster.GetAbsOrigin(), this.caster) + Vector(0, 0, this.leap_z) as Vector);
                    }
                }
            }
        }
        this.ability.StartCooldown(0);
    }
    UpdateHorizontalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            this.time_elapsed = this.time_elapsed + dt;
            if (this.time_elapsed < this.jump_time) {
                let new_location = this.caster.GetAbsOrigin() + this.direction * this.jump_speed * dt as Vector;
                this.caster.SetAbsOrigin(new_location);
            }
            else {
                if (this.GetCasterPlus().HasModifier("modifier_imba_mirana_leap")) {
                    this.ability.EndCooldown();
                    if (this.GetCasterPlus().findBuff<modifier_imba_mirana_leap>("modifier_imba_mirana_leap").GetStackCount() == this.ability.GetSpecialValueFor("max_charges")) {
                        this.GetCasterPlus().findBuff<modifier_imba_mirana_leap>("modifier_imba_mirana_leap").SetDuration(this.ability.GetSpecialValueFor("charge_restore_time"), true);
                        this.GetCasterPlus().findBuff<modifier_imba_mirana_leap>("modifier_imba_mirana_leap").StartIntervalThink(this.ability.GetSpecialValueFor("charge_restore_time"));
                    } else if (this.GetCasterPlus().findBuff<modifier_imba_mirana_leap>("modifier_imba_mirana_leap").GetStackCount() <= 1) {
                        this.ability.StartCooldown(this.GetCasterPlus().findBuff<modifier_imba_mirana_leap>("modifier_imba_mirana_leap").GetRemainingTime());
                    }
                    this.GetCasterPlus().findBuff<modifier_imba_mirana_leap>("modifier_imba_mirana_leap").DecrementStackCount();
                }
                this.Destroy();
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    CC_GetModifierInvisibilityLevel(): number {
        if (this.caster.HasTalent("special_bonus_imba_mirana_7")) {
            return 1;
        }
        return undefined;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state;
        if (this.caster.HasTalent("special_bonus_imba_mirana_7")) {
            state = {
                [modifierstate.MODIFIER_STATE_INVISIBLE]: true
            }
        }
        return state;
    }
    BeRemoved(): void {
        if (IsServer()) {
            this.caster.SetUnitOnClearGround();
            this.caster.AddNewModifier(this.caster, this.ability, this.modifier_aura, {
                duration: this.aura_duration
            });
            this.ability.SetActivated(true);
        }
    }
}
@registerModifier()
export class modifier_imba_leap_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public aura_aoe: any;
    public aura_linger_duration: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.aura_aoe = this.ability.GetSpecialValueFor("aura_aoe");
        this.aura_linger_duration = this.ability.GetSpecialValueFor("aura_linger_duration");
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
    GetAuraDuration(): number {
        return this.aura_linger_duration;
    }
    GetAuraRadius(): number {
        return this.aura_aoe;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_leap_speed_boost";
    }
    IsAura(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_leap_speed_boost extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public move_speed_pct: number;
    public attack_speed: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.move_speed_pct = this.ability.GetSpecialValueFor("move_speed_pct");
        this.attack_speed = this.ability.GetSpecialValueFor("attack_speed");
    }
    IsHidden(): boolean {
        if (this.parent == this.caster && this.caster.HasModifier("modifier_imba_leap_aura")) {
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
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.move_speed_pct;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.attack_speed;
    }
}
@registerModifier()
export class modifier_imba_leap_talent_cast_angle_handler extends BaseModifier_Plus {
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_CAST_ANGLE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_TURNING
        }
        return Object.values(decFuncs);
    } */

    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_CAST_ANGLE)
    CC_GetModifierIgnoreCastAngle(): 0 | 1 {
        return 1;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_TURNING)
    CC_GetModifierDisableTurning(): 0 | 1 {
        return 1;
    }
    IsHidden(): boolean {
        return false;
    }
}
@registerAbility()
export class imba_mirana_moonlight_shadow extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "mirana_invis";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let cast_response = {
            "1": "mirana_mir_ability_moon_02",
            "2": "mirana_mir_ability_moon_03",
            "3": "mirana_mir_ability_moon_04",
            "4": "mirana_mir_ability_moon_07",
            "5": "mirana_mir_ability_moon_08"
        }
        let sound_cast = "Ability.MoonlightShadow";
        let particle_moon = "particles/units/heroes/hero_mirana/mirana_moonlight_cast.vpcf";
        let modifier_main = "modifier_imba_moonlight_shadow";
        let modifier_talent_starstorm = "modifier_imba_moonlight_shadow_talent_starstorm";
        let duration = ability.GetSpecialValueFor("duration");
        EmitSoundOn(GFuncRandom.RandomValue(cast_response), caster);
        EmitSoundOn(sound_cast, caster);
        let particle_moon_fx = ResHelper.CreateParticleEx(particle_moon, ParticleAttachment_t.PATTACH_POINT_FOLLOW, caster);
        ParticleManager.SetParticleControlEnt(particle_moon_fx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(particle_moon_fx);
        caster.AddNewModifier(caster, ability, modifier_main, {
            duration: duration
        });
        if (caster.HasTalent("special_bonus_imba_mirana_1")) {
            if (!caster.HasAbility("imba_mirana_starfall")) {
                return undefined;
            }
            let starstorm_ability = caster.findAbliityPlus<imba_mirana_starfall>("imba_mirana_starfall");
            if (starstorm_ability) {
                let allies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, ally] of GameFunc.iPair(allies)) {
                    if (!ally.HasModifier("modifier_monkey_king_fur_army_soldier") && !ally.HasModifier("modifier_monkey_king_fur_army_soldier_hidden")) {
                        ally.AddNewModifier(caster, starstorm_ability, modifier_talent_starstorm, {
                            duration: duration
                        });
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_moonlight_shadow extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public modifier_invis: any;
    public modifier_dummy: any;
    public fade_delay: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.modifier_invis = "modifier_imba_moonlight_shadow_invis";
            this.modifier_dummy = "modifier_imba_moonlight_shadow_invis_dummy";
            this.fade_delay = this.ability.GetSpecialValueFor("fade_delay");
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
            let duration = this.GetRemainingTime();
            let allies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, ally] of GameFunc.iPair(allies)) {
                if (!ally.HasModifier(this.modifier_invis) && !ally.HasModifier("modifier_monkey_king_fur_army_soldier") && !ally.HasModifier("modifier_monkey_king_fur_army_soldier_hidden")) {
                    ally.AddNewModifier(this.caster, this.ability, this.modifier_dummy, {
                        duration: duration
                    });
                    ally.AddNewModifier(this.caster, this.ability, this.modifier_invis, {
                        duration: duration
                    });
                    if (this.GetDuration() < (duration + this.fade_delay)) {
                        ally.AddNewModifier(this.caster, this.ability, "modifier_imba_moonlight_shadow_invis_fade_time", {
                            duration: this.fade_delay
                        });
                    }
                }
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            let allies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, ally] of GameFunc.iPair(allies)) {
                if (ally.HasModifier(this.modifier_invis)) {
                    ally.RemoveModifierByName(this.modifier_invis);
                    ally.RemoveModifierByName(this.modifier_dummy);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_moonlight_shadow_invis extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public modifier_dummy_name: any;
    public fade_delay: number;
    public truesight_immunity_radius: number;
    public modifier_dummy: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.modifier_dummy_name = "modifier_imba_moonlight_shadow_invis_dummy";
        if (this.ability) {
            this.fade_delay = this.ability.GetSpecialValueFor("fade_delay");
            this.truesight_immunity_radius = this.ability.GetSpecialValueFor("truesight_immunity_radius");
        } else {
            this.fade_delay = 0;
            this.truesight_immunity_radius = 1;
        }
        if (IsServer()) {
            this.modifier_dummy = this.parent.findBuff<modifier_imba_moonlight_shadow_invis_dummy>("modifier_imba_moonlight_shadow_invis_dummy");
            let enemies = FindUnitsInRadius(this.parent.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.truesight_immunity_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, FindOrder.FIND_ANY_ORDER, false);
            if (GameFunc.GetCount(enemies) > 0) {
                this.SetStackCount(1);
            } else {
                this.SetStackCount(2);
            }
            this.StartIntervalThink(0.1);
            if (this.GetParentPlus().GetAggroTarget()) {
                this.GetParentPlus().MoveToTargetToAttack(this.GetParentPlus().GetAggroTarget());
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
    OnIntervalThink(): void {
        let enemies = FindUnitsInRadius(this.parent.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.truesight_immunity_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, FindOrder.FIND_ANY_ORDER, false);
        if (this.GetStackCount() == 0) {
            return undefined;
        }
        if (GameFunc.GetCount(enemies) > 0) {
            this.SetStackCount(1);
        } else {
            this.SetStackCount(2);
        }
        if (this.GetStackCount() >= 1) {
            AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), this.GetParentPlus().GetCurrentVisionRange(), 0.1, false);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            3: Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED,
            4: Enum_MODIFIER_EVENT.ON_ATTACK
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.GetStackCount() > 0) {
            return this.ability.GetSpecialValueFor("bonus_movement_speed") + this.caster.GetTalentValue("special_bonus_imba_mirana_3");
        }
        return 0;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    CC_GetModifierInvisibilityLevel(): number {
        if (this.GetStackCount() >= 1) {
            return 1;
        } else {
            return 0;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    CC_OnAbilityExecuted(keys: ModifierAbilityEvent): void {
        if (IsServer()) {
            let unit = keys.unit;
            if (this.parent == unit) {
                this.SetStackCount(0);
                this.SetDuration(this.fade_delay, true);
                this.modifier_dummy.SetDuration(this.fade_delay, true);
                this.parent.AddNewModifier(this.caster, this.ability, this.GetName(), {
                    duration: this.fade_delay
                });
                this.parent.AddNewModifier(this.caster, this.ability, this.modifier_dummy_name, {
                    duration: this.fade_delay
                });
                this.parent.AddNewModifier(this.caster, this.ability, "modifier_imba_moonlight_shadow_invis_fade_time", {
                    duration: this.fade_delay
                });
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            if (this.parent == attacker) {
                this.SetStackCount(0);
                this.SetDuration(this.fade_delay, true);
                this.modifier_dummy.SetDuration(this.fade_delay, true);
                this.parent.AddNewModifier(this.caster, this.ability, this.GetName(), {
                    duration: this.fade_delay
                });
                this.parent.AddNewModifier(this.caster, this.ability, this.modifier_dummy_name, {
                    duration: this.fade_delay
                });
                this.parent.AddNewModifier(this.caster, this.ability, "modifier_imba_moonlight_shadow_invis_fade_time", {
                    duration: this.fade_delay
                });
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (this.GetStackCount() == 0) {
            return undefined;
        }
        return {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: true
        };
    }
}
@registerModifier()
export class modifier_imba_moonlight_shadow_invis_dummy extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_mirana/mirana_moonlight_owner.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
}
@registerModifier()
export class modifier_imba_moonlight_shadow_invis_fade_time extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_moonlight_shadow_talent_starstorm extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public delay_time: number;
    public radius: number;
    public damage: number;
    public secondary_damage_pct: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.delay_time = this.caster.GetTalentValue("special_bonus_imba_mirana_1", "delay_time");
            this.radius = this.ability.GetSpecialValueFor("radius");
            this.damage = this.ability.GetSpecialValueFor("damage");
            this.secondary_damage_pct = this.ability.GetSpecialValueFor("secondary_damage_pct");
            this.AddTimer(this.delay_time, () => {
                if (!this.IsNull()) {
                    this.OnIntervalThink();
                    this.StartIntervalThink(0.5);
                }
            });
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.parent.IsInvisible()) {
                return undefined;
            }
            let enemies = FindUnitsInRadius(this.parent.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.radius - 50, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_ANY_ORDER, false);
            if (GameFunc.GetCount(enemies) == 0) {
                return undefined;
            }
            StarfallWave(this.parent, this.ability, this.parent.GetAbsOrigin(), this.radius, this.damage);
            let secondary_wave_damage = this.damage * (this.secondary_damage_pct * 0.01);
            SecondaryStarfall(this.parent, this.ability, this.parent.GetAbsOrigin(), this.radius, secondary_wave_damage);
            this.Destroy();
        }
    }
}
@registerModifier()
export class modifier_imba_mirana_silence_stance extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    public stand_time: number;
    public last_position: any;
    public last_time_tick: number;
    IsHidden(): boolean {
        return true;
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
            this.parent = this.GetParentPlus();
            this.stand_time = this.parent.GetTalentValue("special_bonus_imba_mirana_5");
            this.last_position = this.parent.GetAbsOrigin();
            this.last_time_tick = GameRules.GetGameTime();
            this.SetStackCount(0);
            this.StartIntervalThink(0.2);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (GameRules.IsDaytime()) {
                this.SetStackCount(0);
                this.last_time_tick = GameRules.GetGameTime();
                this.last_position = this.parent.GetAbsOrigin();
                return undefined;
            }
            if (this.last_position != this.parent.GetAbsOrigin()) {
                this.SetStackCount(0);
                this.last_position = this.parent.GetAbsOrigin();
                this.last_time_tick = GameRules.GetGameTime();
            } else {
                if (this.GetStackCount() == 0) {
                    if ((GameRules.GetGameTime() - this.last_time_tick) >= this.stand_time) {
                        this.SetStackCount(1);
                    }
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK,
            2: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            if (attacker == this.parent) {
                this.SetStackCount(0);
                this.last_time_tick = GameRules.GetGameTime();
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state;
        if (this.GetStackCount() == 1) {
            state = {
                [modifierstate.MODIFIER_STATE_INVISIBLE]: true
            }
        }
        return state;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    CC_GetModifierInvisibilityLevel(): number {
        if (this.GetStackCount() == 1) {
            return 1;
        }
    }
}
@registerModifier()
export class modifier_imba_mirana_silence_stance_visible extends BaseModifier_Plus {
    GetTexture(): string {
        return "mirana_princess_of_the_night";
    }
    IsHidden(): boolean {
        let stacks = this.GetParentPlus().findBuffStack("modifier_imba_mirana_silence_stance", this.GetParentPlus());
        if (stacks == 1) {
            return false;
        }
        return true;
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
}
@registerModifier()
export class modifier_special_bonus_imba_mirana_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_mirana_9 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_mirana_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_mirana_8 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_mirana_10 extends BaseModifier_Plus {
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
