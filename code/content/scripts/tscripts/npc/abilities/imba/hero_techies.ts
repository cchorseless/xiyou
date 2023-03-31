
import { AI_ability } from "../../../ai/AI_ability";
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { GameServiceConfig } from "../../../shared/GameServiceConfig";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionBoth_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

function PlantProximityMine(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus, spawn_point: Vector, big_boom = false) {
    let mine_name;
    if (big_boom) {
        mine_name = "npc_imba_techies_land_mines_big_boom";
    } else {
        mine_name = "npc_imba_techies_land_mines";
    }
    let mine = caster.CreateSummon(mine_name, spawn_point, 60, true);
    GFuncEntity.AddRangeIndicator(mine, caster, undefined, undefined, ability.GetAOERadius(), 150, 22, 22);
    let playerID = caster.GetPlayerID();
    // mine.SetControllableByPlayer(playerID, true);
    mine.SetOwner(caster);
    mine.AddNewModifier(caster, ability, "modifier_imba_proximity_mine", {});
}
function RefreshElectroCharge(unit: IBaseNpc_Plus) {
    let modifier_electrocharge = "modifier_imba_statis_trap_electrocharge";
    let modifier_electrocharge_handler = unit.FindModifierByName(modifier_electrocharge);
    if (modifier_electrocharge_handler) {
        modifier_electrocharge_handler.IncrementStackCount();
        modifier_electrocharge_handler.ForceRefresh();
    }
}

function ApplyInflammableToRemoteMines(caster: IBaseNpc_Plus, range: number, remote_mines: IBaseNpc_Plus[]) {
    if (!remote_mines) {
        remote_mines = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, range,
            DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY,
            DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_OTHER,
            DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            FindOrder.FIND_ANY_ORDER, false);
    }
    let modifier_inflammable = "modifier_imba_remote_mine_inflammable";
    let detonate_ability = "imba_techies_remote_mines_pinpoint_detonation";
    for (const remote_mine of (remote_mines)) {
        if (remote_mine.GetUnitName() == "npc_imba_techies_remote_mines") {
            let modifier_inflammable_handler = remote_mine.FindModifierByName(modifier_inflammable);
            if (!modifier_inflammable_handler) {
                let detonate_ability_handler = remote_mine.FindAbilityByName(detonate_ability);
                if (detonate_ability_handler) {
                    let inflammable_duration = detonate_ability_handler.GetSpecialValueFor("inflammable_duration");
                    modifier_inflammable_handler = remote_mine.AddNewModifier(caster, detonate_ability_handler, modifier_inflammable, {
                        duration: inflammable_duration
                    });
                }
            }
            if (modifier_inflammable_handler) {
                modifier_inflammable_handler.IncrementStackCount();
                modifier_inflammable_handler.ForceRefresh();
            }
        }
    }
}
@registerAbility()
export class imba_techies_land_mines extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsNetherWardStealable() {
        return false;
    }
    // GetIntrinsicModifierName(): string {
    //     return "modifier_generic_charges";
    // }
    // GetManaCost(level: number): number {
    //     let caster = this.GetCasterPlus();
    //     // let initial_mana_cost = this.GetSpecialValueFor("AbilityManaCost");
    //     let initial_mana_cost = 0;
    //     let modifier_charges = "modifier_generic_charges";
    //     let mana_increase_per_stack = this.GetSpecialValueFor("mana_increase_per_stack");
    //     let stacks = caster.findBuffStack(modifier_charges, caster);
    //     let mana_cost = initial_mana_cost + mana_increase_per_stack * stacks;
    //     return mana_cost;
    // }
    CastFilterResultLocation(location: Vector): UnitFilterResult {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this;
            let mine_distance = ability.GetSpecialValueFor("mine_distance");
            let trigger_range = ability.GetSpecialValueFor("radius");
            trigger_range = trigger_range + caster.GetTalentValue("special_bonus_imba_techies_1");
            let radius = mine_distance + trigger_range;
            let friendly_units = FindUnitsInRadius(caster.GetTeamNumber(), location, undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_OTHER, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            let mine_found = false;
            for (const [_, unit] of GameFunc.iPair(friendly_units)) {
                let unitName = unit.GetUnitName();
                if (unitName == "npc_imba_techies_land_mines" || unitName == "npc_imba_techies_land_mines_big_boom") {
                    mine_found = true;
                    return;
                }
            }
            if (mine_found) {
                return UnitFilterResult.UF_FAIL_CUSTOM;
            } else {
                return UnitFilterResult.UF_SUCCESS;
            }
        }
    }
    GetCustomCastErrorLocation(location: Vector): string {
        return "Cannot place mine in range of other mines";
    }
    GetAOERadius(): number {
        let caster = this.GetCasterPlus();
        let ability = this;
        let trigger_range = ability.GetSpecialValueFor("radius");
        let mine_distance = ability.GetSpecialValueFor("mine_distance");
        trigger_range = trigger_range + caster.GetTalentValue("special_bonus_imba_techies_1");
        return trigger_range + mine_distance;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target_point = this.GetCursorPosition();
        let cast_response = {
            "1": "techies_tech_setmine_01",
            "2": "techies_tech_setmine_02",
            "3": "techies_tech_setmine_04",
            "4": "techies_tech_setmine_08",
            "5": "techies_tech_setmine_09",
            "6": "techies_tech_setmine_10",
            "7": "techies_tech_setmine_11",
            "8": "techies_tech_setmine_13",
            "9": "techies_tech_setmine_16",
            "10": "techies_tech_setmine_17",
            "11": "techies_tech_setmine_18",
            "12": "techies_tech_setmine_19",
            "13": "techies_tech_setmine_20",
            "14": "techies_tech_setmine_30",
            "15": "techies_tech_setmine_32",
            "16": "techies_tech_setmine_33",
            "17": "techies_tech_setmine_34",
            "18": "techies_tech_setmine_38",
            "19": "techies_tech_setmine_45",
            "20": "techies_tech_setmine_46",
            "21": "techies_tech_setmine_47",
            "22": "techies_tech_setmine_48",
            "23": "techies_tech_setmine_50",
            "24": "techies_tech_setmine_51",
            "25": "techies_tech_setmine_54",
            "26": "techies_tech_cast_02",
            "27": "techies_tech_cast_03",
            "28": "techies_tech_setmine_05",
            "29": "techies_tech_setmine_06",
            "30": "techies_tech_setmine_07",
            "31": "techies_tech_setmine_14",
            "32": "techies_tech_setmine_21",
            "33": "techies_tech_setmine_22",
            "34": "techies_tech_setmine_23",
            "35": "techies_tech_setmine_24",
            "36": "techies_tech_setmine_25",
            "37": "techies_tech_setmine_26",
            "38": "techies_tech_setmine_28",
            "39": "techies_tech_setmine_29",
            "40": "techies_tech_setmine_35",
            "41": "techies_tech_setmine_36",
            "42": "techies_tech_setmine_37",
            "43": "techies_tech_setmine_39",
            "44": "techies_tech_setmine_41",
            "45": "techies_tech_setmine_42",
            "46": "techies_tech_setmine_43",
            "47": "techies_tech_setmine_44",
            "48": "techies_tech_setmine_52"
        }
        let sound_cast = "Hero_Techies.LandMine.Plant";
        let modifier_charges = "modifier_generic_charges";
        let initial_mines = ability.GetSpecialValueFor("initial_mines");
        let mine_distance = ability.GetSpecialValueFor("mine_distance");
        EmitSoundOn(GFuncRandom.RandomValue(cast_response), caster);
        EmitSoundOn(sound_cast, caster);
        let mine_placement_count = 0;
        let modifier_charges_handler = caster.FindModifierByName(modifier_charges);
        if (modifier_charges_handler) {
            mine_placement_count = modifier_charges_handler.GetStackCount();
            if (modifier_charges_handler.GetStackCount() > 0) {
                modifier_charges_handler.SetStackCount(0);
            }
        }
        let direction = (target_point - caster.GetAbsOrigin() as Vector).Normalized();
        let big_boom = false;
        if (caster.HasTalent("special_bonus_imba_techies_7")) {
            big_boom = true;
        }
        PlantProximityMine(caster, ability, target_point, big_boom);
        if (mine_placement_count > 0) {
            let degree = 360 / mine_placement_count;
            let mine_spawn_point = target_point + direction * mine_distance as Vector;
            for (let i = 0; i < mine_placement_count; i++) {
                let qangle = QAngle(0, (i - 1) * degree, 0);
                let mine_point = RotatePosition(target_point, qangle, mine_spawn_point);
                PlantProximityMine(caster, ability, mine_point, false);
            }
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }


    AutoSpellSelf() {
        return AI_ability.POSITION_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_proximity_mine extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public owner: IBaseNpc_Plus;
    public ability: imba_techies_land_mines;
    public explosion_delay: number;
    public mine_damage: number;
    public trigger_range: number;
    public activation_delay: number;
    public building_damage_pct: number;
    public buidling_damage_duration: number;
    public tick_interval: number;
    public fow_radius: number;
    public fow_duration: number;
    public big_boom_mine_bonus_dmg: number;
    public big_boom_shrapnel_duration: number;
    public active: any;
    public triggered: any;
    public trigger_time: number;
    public is_big_boom: any;
    public hidden_by_sign: any;
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.caster = this.GetParentPlus();
        this.owner = this.caster.GetOwnerPlus();
        this.ability = this.owner.findAbliityPlus<imba_techies_land_mines>("imba_techies_land_mines");
        this.explosion_delay = this.ability.GetSpecialValueFor("proximity_threshold");
        this.mine_damage = this.ability.GetSpecialValueFor("damage");
        this.trigger_range = this.ability.GetSpecialValueFor("radius");
        this.activation_delay = this.ability.GetSpecialValueFor("activation_delay");
        this.building_damage_pct = this.ability.GetSpecialValueFor("building_damage_pct");
        this.buidling_damage_duration = this.ability.GetSpecialValueFor("buidling_damage_duration");
        this.tick_interval = this.ability.GetSpecialValueFor("tick_interval");
        this.fow_radius = this.ability.GetSpecialValueFor("fow_radius");
        this.fow_duration = this.ability.GetSpecialValueFor("fow_duration");
        this.big_boom_mine_bonus_dmg = this.ability.GetSpecialValueFor("big_boom_mine_bonus_dmg");
        this.big_boom_shrapnel_duration = this.ability.GetSpecialValueFor("big_boom_shrapnel_duration");
        this.trigger_range = this.trigger_range + this.caster.GetTalentValue("special_bonus_imba_techies_1");
        this.active = false;
        this.triggered = false;
        this.trigger_time = 0;
        let particle_mine = "particles/units/heroes/hero_techies/techies_land_mine.vpcf";
        let particle_mine_fx = ResHelper.CreateParticleEx(particle_mine, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.caster);
        ParticleManager.SetParticleControl(particle_mine_fx, 0, this.caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_mine_fx, 3, this.caster.GetAbsOrigin());
        this.AddParticle(particle_mine_fx, false, false, -1, false, false);
        if (this.caster.GetUnitName() == "npc_imba_techies_land_mines_big_boom") {
            this.is_big_boom = true;
        }
        this.AddTimer(this.activation_delay, () => {
            this.active = true;
            this.StartIntervalThink(this.tick_interval);
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
    OnIntervalThink(): void {
        if (IsServer()) {
            let caster = this.caster;
            if (!caster.IsAlive()) {
                this.Destroy();
            }
            let modifier_sign = "modifier_imba_minefield_sign_detection";
            if (caster.HasModifier(modifier_sign)) {
                this.triggered = false;
                this.trigger_time = 0;
                this.hidden_by_sign = true;
                return;
            }
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, this.trigger_range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
            let enemy_found = false;
            if (GameFunc.GetCount(enemies) > 0) {
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    if (!enemy.HasFlyMovementCapability()) {
                        enemy_found = true;
                        break;
                    }
                }
            }
            if (!this.triggered) {
                if (enemy_found) {
                    this.triggered = true;
                    this.trigger_time = 0;
                    let sound_prime = "Hero_Techies.LandMine.Priming";
                    EmitSoundOn(sound_prime, caster);
                }
            } else {
                if (enemy_found) {
                    this.trigger_time = this.trigger_time + this.tick_interval;
                    if (this.trigger_time >= this.explosion_delay) {
                        this._Explode();
                    }
                } else {
                    this.triggered = false;
                    this.trigger_time = 0;
                }
            }
        }
    }
    _Explode() {
        let enemy_killed = false;
        let caster = this.caster;
        let trigger_range = this.trigger_range;
        let sound_explosion = "Hero_Techies.LandMine.Detonate";
        EmitSoundOn(sound_explosion, caster);
        let casterAbsOrigin = caster.GetAbsOrigin();
        let particle_explosion = "particles/units/heroes/hero_techies/techies_land_mine_explode.vpcf";
        let particle_explosion_fx = ResHelper.CreateParticleEx(particle_explosion, ParticleAttachment_t.PATTACH_WORLDORIGIN, caster);
        ParticleManager.SetParticleControl(particle_explosion_fx, 0, casterAbsOrigin);
        ParticleManager.SetParticleControl(particle_explosion_fx, 1, casterAbsOrigin);
        ParticleManager.SetParticleControl(particle_explosion_fx, 2, Vector(trigger_range, 1, 1));
        ParticleManager.ReleaseParticleIndex(particle_explosion_fx);
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), casterAbsOrigin, undefined, trigger_range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
        let modifier_building_res = "modifier_imba_proximity_mine_building_res";
        let modifier_talent_shrapnel = "modifier_imba_proximity_mine_talent";
        if (this.is_big_boom) {
            BaseModifier_Plus.CreateBuffThinker(caster, this.ability, modifier_talent_shrapnel, {
                duration: this.big_boom_shrapnel_duration
            }, casterAbsOrigin, caster.GetTeamNumber(), false);
        }
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (!enemy.HasFlyMovementCapability()) {
                let damage = this.mine_damage;
                if (this.is_big_boom) {
                    damage = damage + this.big_boom_mine_bonus_dmg;
                }
                if (enemy.IsBuilding()) {
                    damage = damage * this.building_damage_pct / 100;
                }
                let damageTable = {
                    victim: enemy,
                    attacker: caster,
                    damage: damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    ability: this.ability
                }
                ApplyDamage(damageTable);
                if (enemy.IsBuilding() && !enemy.HasModifier(modifier_building_res)) {
                    enemy.AddNewModifier(caster, this.ability, modifier_building_res, {
                        duration: this.buidling_damage_duration
                    });
                }
                RefreshElectroCharge(enemy);
                this.AddTimer(FrameTime(), () => {
                    if (!enemy.IsAlive()) {
                        enemy_killed = true;
                    }
                });
            }
        }
        ApplyInflammableToRemoteMines(caster, this.trigger_range, undefined);
        if (RollPercentage(25)) {
            this.AddTimer(FrameTime() * 2, () => {
                let kill_response = {
                    "1": "techies_tech_mineblowsup_01",
                    "2": "techies_tech_mineblowsup_02",
                    "3": "techies_tech_mineblowsup_03",
                    "4": "techies_tech_mineblowsup_04",
                    "5": "techies_tech_mineblowsup_05",
                    "6": "techies_tech_mineblowsup_06",
                    "7": "techies_tech_mineblowsup_08",
                    "8": "techies_tech_mineblowsup_09",
                    "9": "techies_tech_minekill_01",
                    "10": "techies_tech_minekill_02",
                    "11": "techies_tech_minekill_03"
                }
                if (enemy_killed) {
                    EmitSoundOn(GFuncRandom.RandomValue(kill_response), this.owner);
                }
            });
        }
        AddFOWViewer(caster.GetTeamNumber(), casterAbsOrigin, this.fow_radius, this.fow_duration, false);
        caster.ForceKill(false);
        this.Destroy();
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state;
        if (this.active && !this.triggered) {
            state = {
                [modifierstate.MODIFIER_STATE_INVISIBLE]: true,
                [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
            }
        } else {
            state = {
                [modifierstate.MODIFIER_STATE_INVISIBLE]: false,
                [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
            }
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        return -100;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        let unit = keys.unit;
        let attacker = keys.attacker;
        if (unit == this.caster) {
            let mine_health = this.caster.GetHealth();
            if (mine_health > 1) {
                this.caster.SetHealth(mine_health - 1);
            } else {
                this.caster.Kill(this.ability, attacker);
            }
        }
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_NORMAL;
    }
}
@registerModifier()
export class modifier_imba_proximity_mine_building_res extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public building_magic_resistance: any;
    BeCreated(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.building_magic_resistance = this.ability.GetSpecialValueFor("building_magic_resistance");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.building_magic_resistance;
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
export class modifier_imba_proximity_mine_talent extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public parent_team: any;
    public parent_pos: any;
    public ability: IBaseAbility_Plus;
    public big_boom_shrapnel_aoe: any;
    public big_boom_shrapnel_damage: number;
    public big_boom_shrapnel_interval: number;
    public damage: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.parent = this.GetParentPlus();
            this.parent_team = this.parent.GetTeamNumber();
            let parentAbsOrigin = this.parent.GetAbsOrigin();
            this.parent_pos = parentAbsOrigin;
            this.ability = this.GetAbilityPlus();
            this.big_boom_shrapnel_aoe = this.ability.GetSpecialValueFor("big_boom_shrapnel_aoe");
            this.big_boom_shrapnel_damage = this.ability.GetSpecialValueFor("big_boom_shrapnel_damage");
            this.big_boom_shrapnel_interval = this.ability.GetSpecialValueFor("big_boom_shrapnel_interval");
            let particle_rain = "particles/hero/techies/techies_big_boom_explosions.vpcf";
            let particle_rain_fx = ResHelper.CreateParticleEx(particle_rain, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
            ParticleManager.SetParticleControl(particle_rain_fx, 0, parentAbsOrigin);
            ParticleManager.SetParticleControl(particle_rain_fx, 1, parentAbsOrigin);
            ParticleManager.SetParticleControl(particle_rain_fx, 3, parentAbsOrigin);
            this.AddParticle(particle_rain_fx, false, false, -1, false, false);
            this.damage = this.big_boom_shrapnel_damage * this.big_boom_shrapnel_interval;
            this.StartIntervalThink(this.big_boom_shrapnel_interval);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let enemies = FindUnitsInRadius(this.parent_team, this.parent_pos, undefined, this.big_boom_shrapnel_aoe, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
                DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let damageTable = {
                    victim: enemy,
                    attacker: this.caster,
                    damage: this.damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    ability: this.ability
                }
                ApplyDamage(damageTable);
            }
        }
    }
}
@registerAbility()
export class imba_techies_stasis_trap extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "techies_stasis_trap";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsNetherWardStealable() {
        return false;
    }
    GetAOERadius(): number {
        let root_range = this.GetSpecialValueFor("stun_radius");
        return root_range;
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        let caster = this.GetCasterPlus();
        if (caster.HasTalent("special_bonus_imba_techies_2")) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE;
        }
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (caster.HasTalent("special_bonus_imba_techies_2") && target.IsCreep() && caster.GetTeamNumber() == target.GetTeamNumber()) {
                return UnitFilterResult.UF_SUCCESS;
            }
            if (target.GetTeamNumber() != caster.GetTeamNumber()) {
                return UnitFilterResult.UF_FAIL_ENEMY;
            }
            if (target.IsRealUnit()) {
                return UnitFilterResult.UF_FAIL_HERO;
            }
            if (target.IsBuilding()) {
                return UnitFilterResult.UF_FAIL_BUILDING;
            }
            let nResult = UnitFilter(target, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), this.GetCasterPlus().GetTeamNumber());
            return nResult;
        }
    }
    OnAbilityPhaseStart(): boolean {
        let target = this.GetCursorTarget();
        if (target) {
            let particle_creep = "particles/hero/techies/techies_stasis_trap_plant_creep.vpcf";
            let particle_creep_fx = ResHelper.CreateParticleEx(particle_creep, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
            ParticleManager.SetParticleControl(particle_creep_fx, 0, target.GetAbsOrigin());
            ParticleManager.SetParticleControl(particle_creep_fx, 1, target.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(particle_creep_fx);
        } else {
            let caster = this.GetCasterPlus();
            let target_point = this.GetCursorPosition();
            let particle_cast = "particles/units/heroes/hero_techies/techies_stasis_trap_plant.vpcf";
            let particle_cast_fx = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(particle_cast_fx, 0, target_point);
            ParticleManager.SetParticleControl(particle_cast_fx, 1, target_point);
            ParticleManager.ReleaseParticleIndex(particle_cast_fx);
        }
        return true;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = this.GetCursorTarget();
        let target_point = this.GetCursorPosition();
        let particle_creep = "particles/hero/techies/techies_stasis_trap_plant_creep.vpcf";
        let cast_response = {
            "1": "techies_tech_settrap_01",
            "2": "techies_tech_settrap_02",
            "3": "techies_tech_settrap_03",
            "4": "techies_tech_settrap_04",
            "5": "techies_tech_settrap_06",
            "6": "techies_tech_settrap_07",
            "7": "techies_tech_settrap_08",
            "8": "techies_tech_settrap_09",
            "9": "techies_tech_settrap_10",
            "10": "techies_tech_settrap_11"
        }
        let sound_cast = "Hero_Techies.StasisTrap.Plant";
        if (RollPercentage(75)) {
            EmitSoundOn(GFuncRandom.RandomValue(cast_response), caster);
        }
        EmitSoundOn(sound_cast, caster);
        if (target) {
            let modifier_stasis = target.AddNewModifier(target, ability, "modifier_imba_statis_trap", {}) as modifier_imba_statis_trap;
            if (modifier_stasis) {
                modifier_stasis.owner = caster;
            }
            this.AddTimer(1, () => {
                if (target.IsAlive()) {
                    let particle_creep_fx = ResHelper.CreateParticleEx(particle_creep, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, target);
                    ParticleManager.SetParticleControlEnt(particle_creep_fx, 0, target, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                    ParticleManager.SetParticleControlEnt(particle_creep_fx, 1, target, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                    ParticleManager.ReleaseParticleIndex(particle_creep_fx);
                    return 1;
                } else {
                    return undefined;
                }
            });
        } else {
            let trap = caster.CreateSummon("npc_imba_techies_stasis_trap", target_point, 60, true);
            let playerID = caster.GetPlayerID();
            // trap.SetControllableByPlayer(playerID, true);
            trap.SetOwner(caster);
            trap.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_statis_trap", {});
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.POSITION_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_statis_trap extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public owner: IBaseNpc_Plus;
    public ability: imba_techies_stasis_trap;
    public activate_delay: number;
    public trigger_range: number;
    public root_range: number;
    public root_duration: number;
    public tick_rate: any;
    public flying_vision_duration: number;
    public active: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state: Partial<Record<modifierstate, boolean>> = {};
        if (IsServer()) {
            if (GFuncEntity.IsValid(this.caster) && this.caster.IsCreep()) {
                return state;
            }
            if (this.active) {
                state = {
                    [modifierstate.MODIFIER_STATE_INVISIBLE]: true,
                    [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
                }
            } else {
                state = {
                    [modifierstate.MODIFIER_STATE_INVISIBLE]: false,
                    [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
                }
            }
            return state;
        }
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetParentPlus();
            this.owner = this.caster.GetOwnerPlus();
            this.ability = this.owner.findAbliityPlus<imba_techies_stasis_trap>("imba_techies_stasis_trap");
            this.activate_delay = this.ability.GetSpecialValueFor("activation_time");
            this.trigger_range = this.ability.GetSpecialValueFor("stun_radius");
            this.root_range = this.ability.GetSpecialValueFor("stun_radius");
            this.root_duration = this.ability.GetSpecialValueFor("stun_duration");
            this.tick_rate = this.ability.GetSpecialValueFor("tick_rate");
            this.flying_vision_duration = this.ability.GetSpecialValueFor("flying_vision_duration");
            this.active = false;
            this.AddTimer(this.activate_delay, () => {
                this.active = true;
                this.StartIntervalThink(this.tick_rate);
            });
        }
    }
    OnIntervalThink(): void {
        let caster = this.caster;
        let modifier_sign = "modifier_imba_minefield_sign_detection";
        if (caster.HasModifier(modifier_sign)) {
            return undefined;
        }
        if (!caster.IsAlive()) {
            this.Destroy();
            return undefined;
        }
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, this.trigger_range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false);
        if (GameFunc.GetCount(enemies) > 0) {
            this._Explode();
        }
    }
    _Explode() {
        let caster = this.caster;
        let sound_explosion = "Hero_Techies.StasisTrap.Stun";
        EmitSoundOn(sound_explosion, caster);
        let particle_explode = "particles/units/heroes/hero_techies/techies_stasis_trap_explode.vpcf";
        let particle_explode_fx = ResHelper.CreateParticleEx(particle_explode, ParticleAttachment_t.PATTACH_WORLDORIGIN, caster);
        ParticleManager.SetParticleControl(particle_explode_fx, 0, caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_explode_fx, 1, Vector(this.root_range, 1, 1));
        ParticleManager.SetParticleControl(particle_explode_fx, 3, caster.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(particle_explode_fx);
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, this.root_range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        let modifier_root = "modifier_imba_statis_trap_root";
        let modifier_electrocharge = "modifier_imba_statis_trap_electrocharge";
        let modifier_disarmed = "modifier_imba_statis_trap_disarmed";
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (!caster.HasModifier(modifier_disarmed)) {
                enemy.AddNewModifier(caster, this.ability, modifier_root, {
                    duration: this.root_duration * (1 - enemy.GetStatusResistance())
                });
            }
            if (!enemy.HasModifier(modifier_electrocharge)) {
                enemy.AddNewModifier(caster, this.ability, modifier_electrocharge, {
                    duration: this.root_duration * (1 - enemy.GetStatusResistance())
                });
            } else {
                RefreshElectroCharge(enemy);
            }
        }
        let mines = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, this.root_range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_OTHER, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, mine] of GameFunc.iPair(mines)) {
            if (mine.GetUnitName() == "npc_imba_techies_stasis_trap" && mine != caster) {
                mine.AddNewModifier(caster, this.ability, modifier_disarmed, {});
            }
        }
        if (this.owner && this.owner.HasTalent("special_bonus_imba_techies_4")) {
            ApplyInflammableToRemoteMines(caster, this.root_range, mines);
        }
        AddFOWViewer(caster.GetTeamNumber(), caster.GetAbsOrigin(), this.root_range, this.flying_vision_duration, false);
        caster.ForceKill(false);
        this.Destroy();
    }
}
@registerModifier()
export class modifier_imba_statis_trap_root extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
        return state;
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
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_techies_stasis.vpcf";
    }
}
@registerModifier()
export class modifier_imba_statis_trap_electrocharge extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public owner: any;
    public teamnumber: any;
    public parent_teamnumber: any;
    public base_magnetic_radius: number;
    public base_magnetic_movespeed: number;
    public magnetic_stack_radius: number;
    public magnetic_stack_movespeed: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.owner = this.caster.GetOwnerPlus();
            this.teamnumber = this.caster.GetTeamNumber();
            this.parent_teamnumber = this.parent.GetTeamNumber();
            this.base_magnetic_radius = this.ability.GetSpecialValueFor("base_magnetic_radius");
            this.base_magnetic_movespeed = this.ability.GetSpecialValueFor("base_magnetic_movespeed");
            this.magnetic_stack_radius = this.ability.GetSpecialValueFor("magnetic_stack_radius");
            this.magnetic_stack_movespeed = this.ability.GetSpecialValueFor("magnetic_stack_movespeed");
            if (this.caster.GetUnitName() != "npc_imba_techies_stasis_trap") {
                return undefined;
            }
            if (this.teamnumber == this.parent_teamnumber) {
                return undefined;
            }
            if (this.owner) {
                this.base_magnetic_radius = this.base_magnetic_radius + this.owner.GetTalentValue("special_bonus_imba_techies_3");
            }
            this.StartIntervalThink(FrameTime());
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
    OnIntervalThink(): void {
        if (IsServer()) {
            let stacks = this.GetStackCount();
            let movespeed = this.base_magnetic_movespeed + this.magnetic_stack_movespeed * stacks;
            let radius = this.base_magnetic_radius + this.magnetic_stack_radius * stacks;
            let parentAbsOrigin = this.parent.GetAbsOrigin();
            let mines = FindUnitsInRadius(this.teamnumber, parentAbsOrigin, undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_OTHER, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, mine] of GameFunc.iPair(mines)) {
                let mineUnitName = mine.GetUnitName();
                if (mineUnitName == "npc_imba_techies_land_mines" || mineUnitName == "npc_imba_techies_land_mines_big_boom" || mineUnitName == "npc_imba_techies_stasis_trap" || mineUnitName == "npc_imba_techies_remote_mines") {
                    let mineAbsOrigin = mine.GetAbsOrigin();
                    let distance = (parentAbsOrigin - mineAbsOrigin as Vector).Length2D();
                    if (distance > 25) {
                        let direction = (parentAbsOrigin - mineAbsOrigin as Vector).Normalized();
                        let mine_location = mineAbsOrigin + direction * movespeed * FrameTime() as Vector;
                        mine.SetAbsOrigin(mine_location);
                    }
                }
            }
        }
    }
    GetTexture(): string {
        return "techies_stasis_trap";
    }
}
@registerModifier()
export class modifier_imba_statis_trap_disarmed extends BaseModifier_Plus {
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
@registerAbility()
export class imba_techies_suicide extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "techies_suicide";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetAOERadius(): number {
        let radius = this.GetSpecialValueFor("radius");
        return radius;
    }
    IsNetherWardStealable() {
        return false;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target_point = this.GetCursorPosition();
        let piggy_response = "Imba.LittlePiggyWhy";
        let sound_cast = "Hero_Techies.BlastOff.Cast";
        let modifier_blast = "modifier_imba_blast_off";
        EmitSoundOn(sound_cast, caster);
        let pig: IBaseNpc_Plus;
        let modifierParam = {
            target_point_x: target_point.x,
            target_point_y: target_point.y,
            target_point_z: target_point.z
        }
        if (caster.HasTalent("special_bonus_imba_techies_8")) {
            pig = caster.CreateSummon("npc_imba_techies_suicide_piggy", caster.GetAbsOrigin(), 60, false);
            let playerID = caster.GetPlayerID();
            // pig.SetControllableByPlayer(playerID, true);
            pig.SetForwardVector(caster.GetForwardVector());
            if (GameServiceConfig.USE_MEME_SOUNDS && RollPercentage(GameServiceConfig.MEME_SOUNDS_CHANCE)) {
                EmitSoundOn(piggy_response, caster);
            }
            pig.AddNewModifier(caster, ability, modifier_blast, modifierParam);
        } else {
            caster.AddNewModifier(caster, ability, modifier_blast, modifierParam);
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.POSITION_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_blast_off extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public modifier_movement: any;
    public max_jumps: any;
    public jump_continue_delay: number;
    public jump_duration: number;
    public jumps: any;
    public target_point: any;
    public direction: any;
    public distance: number;
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.modifier_movement = "modifier_imba_blast_off_movement";
            this.max_jumps = this.ability.GetSpecialValueFor("max_jumps");
            this.jump_continue_delay = this.ability.GetSpecialValueFor("jump_continue_delay");
            this.jump_duration = this.ability.GetSpecialValueFor("jump_duration");
            this.jumps = 0;
            this.target_point = Vector(keys.target_point_x, keys.target_point_y, keys.target_point_z);
            let parentAbsOrigin = this.parent.GetAbsOrigin();
            this.direction = (this.target_point - parentAbsOrigin as Vector).Normalized();
            this.distance = (this.target_point - parentAbsOrigin as Vector).Length2D();
            let tick = this.jump_duration + this.jump_continue_delay;
            this.parent.AddNewModifier(this.caster, this.ability, this.modifier_movement, {
                duration: tick,
                target_point_x: keys.target_point_x,
                target_point_y: keys.target_point_y,
                target_point_z: keys.target_point_z
            });
            this.StartIntervalThink(tick);
        }
    }
    OnIntervalThink(): void {
        this.jumps = this.jumps + 1;
        if (this.parent.IsStunned() || this.parent.IsHexed() || this.parent.IsSilenced()) {
            this.Destroy();
            return undefined;
        }
        if (this.jumps > this.max_jumps) {
            this.Destroy();
            return undefined;
        }
        this.target_point = this.target_point + this.direction * this.distance;
        this.parent.AddNewModifier(this.caster, this.ability, this.modifier_movement, {
            duration: this.jump_duration + this.jump_continue_delay,
            target_point_x: this.target_point.x,
            target_point_y: this.target_point.y,
            target_point_z: this.target_point.z
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
            1: Enum_MODIFIER_EVENT.ON_ORDER
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierUnitEvent): void {
        if (IsServer()) {
            let order_type = keys.order_type;
            let unit = keys.unit;
            if (unit == this.parent) {
                let eligible_order_types = [
                    dotaunitorder_t.DOTA_UNIT_ORDER_HOLD_POSITION,
                    dotaunitorder_t.DOTA_UNIT_ORDER_STOP,
                    dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION,
                    dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET,
                    dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE,
                    dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET
                ];
                for (let i = 0; i < eligible_order_types.length; i++) {
                    if (eligible_order_types[i] == order_type) {
                        this.Destroy();
                        return;
                    }
                }
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        }
        return state;
    }
    BeDestroy(): void {
        if (IsServer()) {
            let modifier_movement_handler = this.parent.FindModifierByName(this.modifier_movement) as modifier_imba_blast_off_movement;
            if (modifier_movement_handler) {
                modifier_movement_handler.last_jump = true;
            }
            if (this.parent.GetUnitName() == "npc_imba_techies_suicide_piggy") {
                let parent = this.parent;
                this.AddTimer(FrameTime(), () => {
                    parent.ForceKill(false);
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_blast_off_movement extends BaseModifierMotionBoth_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public damage: number;
    public radius: number;
    public self_damage_pct: number;
    public silence_duration: number;
    public jump_duration: number;
    public jump_max_height: any;
    public target_point: any;
    public direction: any;
    public distance: number;
    public velocity: any;
    public time_elapsed: number;
    public current_height: any;
    public frametime: number;
    public blast_off_finished: any;
    last_jump: boolean;
    BeCreated(keys: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            if (!this.BeginMotionOrDestroy()) { return };
            let particle_trail = "particles/units/heroes/hero_techies/techies_blast_off_trail.vpcf";
            this.damage = this.ability.GetSpecialValueFor("damage");
            this.radius = this.ability.GetSpecialValueFor("radius");
            this.self_damage_pct = this.ability.GetSpecialValueFor("hp_cost");
            this.silence_duration = this.ability.GetSpecialValueFor("silence_duration");
            this.jump_duration = this.ability.GetSpecialValueFor("jump_duration");
            this.jump_max_height = this.ability.GetSpecialValueFor("jump_max_height");
            this.target_point = Vector(keys.target_point_x, keys.target_point_y, keys.target_point_z);
            let parentAbsOrigin = this.parent.GetAbsOrigin();
            let particle_trail_fx = ResHelper.CreateParticleEx(particle_trail, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
            ParticleManager.SetParticleControl(particle_trail_fx, 0, parentAbsOrigin);
            ParticleManager.SetParticleControl(particle_trail_fx, 1, parentAbsOrigin);
            this.AddParticle(particle_trail_fx, false, false, -1, false, false);
            this.direction = (this.target_point - parentAbsOrigin as Vector).Normalized();
            this.distance = (this.target_point - parentAbsOrigin as Vector).Length2D();
            this.velocity = this.distance / this.jump_duration;
            this.time_elapsed = 0;
            this.current_height = 0;
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
        return modifierpriority.MODIFIER_PRIORITY_HIGH
    }
    UpdateVerticalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            let t = this.time_elapsed / this.jump_duration;
            this.current_height = this.current_height + FrameTime() * this.jump_max_height * (4 - 8 * t);
            this.parent.SetAbsOrigin(GetGroundPosition(this.parent.GetAbsOrigin(), this.parent) + Vector(0, 0, this.current_height) as Vector);
            this.time_elapsed = this.time_elapsed + dt;
        }
    }
    UpdateHorizontalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            if (this.time_elapsed < this.jump_duration) {
                let new_location = this.parent.GetAbsOrigin() + this.direction * this.velocity * dt;
                this.parent.SetAbsOrigin(new_location as Vector);
            } else {
                this.BlastOffLanded();
            }
        }
    }
    BlastOffLanded() {
        if (IsServer()) {
            if (this.blast_off_finished) {
                return;
            }
            this.blast_off_finished = true;
            let sound_suicide = "Hero_Techies.Suicide";
            EmitSoundOn(sound_suicide, this.parent);
            let particle_explosion = "particles/units/heroes/hero_techies/techies_blast_off.vpcf";
            let particle_explosion_fx = ResHelper.CreateParticleEx(particle_explosion, ParticleAttachment_t.PATTACH_WORLDORIGIN, this.parent);
            ParticleManager.SetParticleControl(particle_explosion_fx, 0, this.parent.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(particle_explosion_fx);
            GridNav.DestroyTreesAroundPoint(this.parent.GetAbsOrigin(), this.radius, true);
            let enemies = this.parent.FindUnitsInRadiusPlus(this.radius);
            let modifier_silence = "modifier_imba_blast_off_silence";
            let enemy_killed = false;
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let damageTable = {
                    victim: enemy,
                    attacker: this.caster,
                    damage: this.damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    ability: this.ability
                }
                ApplyDamage(damageTable);
                enemy.AddNewModifier(this.caster, this.ability, modifier_silence, {
                    duration: this.silence_duration * (1 - enemy.GetStatusResistance())
                });
                this.AddTimer(FrameTime(), () => {
                    if (!enemy.IsAlive()) {
                        enemy_killed = true;
                    }
                });
            }
            if (GameFunc.GetCount(enemies) == 0 && this.last_jump) {
                let sound;
                if (RollPercentage(15)) {
                    let rare_miss_response = {
                        "1": "techies_tech_suicidesquad_08",
                        "2": "techies_tech_failure_01"
                    }
                    sound = GFuncRandom.RandomValue(rare_miss_response);
                } else {
                    let miss_response = {
                        "1": "techies_tech_suicidesquad_04",
                        "2": "techies_tech_suicidesquad_09",
                        "3": "techies_tech_suicidesquad_13"
                    }
                    sound = GFuncRandom.RandomValue(miss_response);
                }
                EmitSoundOn(sound, this.caster);
            }
            this.AddTimer(FrameTime() * 2, () => {
                if (enemy_killed) {
                    let sound;
                    if (RollPercentage(15)) {
                        let rare_kill_response = {
                            "1": "techies_tech_focuseddetonate_14"
                        }
                        sound = GFuncRandom.RandomValue(rare_kill_response);
                    } else {
                        let kill_response = {
                            "1": "techies_tech_suicidesquad_02",
                            "2": "techies_tech_suicidesquad_03",
                            "3": "techies_tech_suicidesquad_06",
                            "4": "techies_tech_suicidesquad_11",
                            "5": "techies_tech_suicidesquad_12"
                        }
                        sound = GFuncRandom.RandomValue(kill_response);
                    }
                    EmitSoundOn(sound, this.caster);
                }
            });
            let self_damage = this.parent.GetMaxHealth() * this.self_damage_pct * 0.01;
            let damageTable = {
                victim: this.parent,
                attacker: this.caster,
                damage: self_damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                ability: this.ability,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_HPLOSS + DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION
            }
            ApplyDamage(damageTable);
            if (this.caster.HasTalent("special_bonus_imba_techies_5")) {
                let proximity_ability = "imba_techies_land_mines";
                let proximity_ability_handler = this.caster.FindAbilityByName(proximity_ability) as imba_techies_land_mines;
                if (proximity_ability_handler && proximity_ability_handler.GetLevel() > 0) {
                    PlantProximityMine(this.caster, proximity_ability_handler, this.parent.GetAbsOrigin());
                }
            }
            this.Destroy();
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.parent.SetUnitOnClearGround();
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        }
        return state;
    }
}
@registerModifier()
export class modifier_imba_blast_off_silence extends BaseModifier_Plus {
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
        let state = {
            [modifierstate.MODIFIER_STATE_SILENCED]: true
        }
        return state;
    }
    GetEffectName(): string {
        return "particles/generic_gameplay/generic_silence.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
}
@registerAbility()
export class imba_techies_remote_mines extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "techies_remote_mines";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetAssociatedSecondaryAbilities(): string {
        return "imba_techies_focused_detonate";
    }
    IsNetherWardStealable() {
        return false;
    }
    OnUpgrade(): void {
        let caster = this.GetCasterPlus();
        let focused_ability = "imba_techies_focused_detonate";
        let focused_ability_handler = caster.FindAbilityByName(focused_ability);
        if (focused_ability_handler) {
            focused_ability_handler.SetLevel(1);
        }
    }
    GetAOERadius(): number {
        let caster = this.GetCasterPlus();
        let ability = this;
        let scepter = caster.HasScepter();
        let radius = ability.GetSpecialValueFor("radius");
        let scepter_radius_bonus = ability.GetSpecialValueFor("cast_range_scepter_bonus");
        if (scepter) {
            radius = radius + scepter_radius_bonus;
        }
        return radius;
    }
    OnAbilityPhaseStart(): boolean {
        let caster = this.GetCasterPlus();
        let target_point = this.GetCursorPosition();
        let sound_toss = "Hero_Techies.RemoteMine.Toss";
        let particle_plant = "particles/hero/techies/techies_remote_mine_plant.vpcf";
        EmitSoundOn(sound_toss, caster);
        let particle_plant_fx = ResHelper.CreateParticleEx(particle_plant, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, caster);
        ParticleManager.SetParticleControlEnt(particle_plant_fx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_remote", caster.GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(particle_plant_fx, 1, target_point);
        ParticleManager.SetParticleControl(particle_plant_fx, 4, target_point);
        ParticleManager.ReleaseParticleIndex(particle_plant_fx);
        return true;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target_point = this.GetCursorPosition();
        let cast_response = {
            "1": "techies_tech_remotemines_03",
            "2": "techies_tech_remotemines_04",
            "3": "techies_tech_remotemines_05",
            "4": "techies_tech_remotemines_07",
            "5": "techies_tech_remotemines_08",
            "6": "techies_tech_remotemines_09",
            "7": "techies_tech_remotemines_13",
            "8": "techies_tech_remotemines_14",
            "9": "techies_tech_remotemines_15",
            "10": "techies_tech_remotemines_17",
            "11": "techies_tech_remotemines_18",
            "12": "techies_tech_remotemines_19",
            "13": "techies_tech_remotemines_20",
            "14": "techies_tech_remotemines_25",
            "15": "techies_tech_remotemines_26",
            "16": "techies_tech_remotemines_27",
            "17": "techies_tech_remotemines_30",
            "18": "techies_tech_remotemines_02",
            "19": "techies_tech_remotemines_10",
            "20": "techies_tech_remotemines_11",
            "21": "techies_tech_remotemines_16",
            "22": "techies_tech_remotemines_21",
            "23": "techies_tech_remotemines_22",
            "24": "techies_tech_remotemines_23",
            "25": "techies_tech_remotemines_28",
            "26": "techies_tech_remotemines_29"
        }
        let rare_cast_response = "techies_tech_remotemines_01";
        let sound_cast = "Hero_Techies.RemoteMine.Plant";
        let mine_ability = "imba_techies_remote_mines_pinpoint_detonation";
        let mine_duration = this.GetSpecialValueFor("duration");
        let sound;
        if (RollPercentage(50)) {
            sound = rare_cast_response;
        } else {
            sound = GFuncRandom.RandomValue(cast_response);
        }
        EmitSoundOn(sound, caster);
        EmitSoundOn(sound_cast, caster);
        let mine = caster.CreateSummon("npc_imba_techies_remote_mines", target_point, mine_duration, false);
        let playerID = caster.GetPlayerID();
        // mine.SetControllableByPlayer(playerID, true);
        let mine_ability_handler = mine.FindAbilityByName(mine_ability);
        if (mine_ability_handler) {
            mine_ability_handler.SetLevel(this.GetLevel());
        }
        mine.SetOwner(caster);
    }
    GetManaCost(level: number): number {
        return 100;
    }
    AutoSpellSelf() {
        return AI_ability.POSITION_if_enemy(this);
    }
}
@registerAbility()
export class imba_techies_remote_mines_pinpoint_detonation extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "techies_remote_mines_self_detonate";
    }
    IsStealable(): boolean {
        return false;
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    IsNetherWardStealable() {
        return false;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_remote_mine";
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let owner = caster.GetOwnerPlus();
        let ability = owner.findAbliityPlus<imba_techies_remote_mines>("imba_techies_remote_mines");
        let sound_activate = "Hero_Techies.RemoteMine.Activate";
        let sound_detonate = "Hero_Techies.RemoteMine.Detonate";
        let particle_explosion = "particles/units/heroes/hero_techies/techies_remote_mines_detonate.vpcf";
        let modifier_inflammable = "modifier_imba_remote_mine_inflammable";
        let modifier_electrocharge = "modifier_imba_statis_trap_electrocharge";
        let scepter = owner.HasScepter();
        let damage = ability.GetSpecialValueFor("damage");
        let radius = ability.GetSpecialValueFor("radius");
        let inflammable_duration = ability.GetSpecialValueFor("inflammable_duration");
        let inflammable_charge_radius = ability.GetSpecialValueFor("inflammable_charge_radius");
        let inflammable_charge_damage = ability.GetSpecialValueFor("inflammable_charge_damage");
        let scepter_damage_bonus = ability.GetSpecialValueFor("damage_scepter");
        let scepter_radius_bonus = ability.GetSpecialValueFor("cast_range_scepter_bonus");
        EmitSoundOn(sound_activate, caster);
        let random_wait_time = math.random(1, 4);
        this.AddTimer(FrameTime() * random_wait_time, () => {
            EmitSoundOn(sound_detonate, caster);
            let particle_explosion_fx = ResHelper.CreateParticleEx(particle_explosion, ParticleAttachment_t.PATTACH_WORLDORIGIN, caster);
            ParticleManager.SetParticleControl(particle_explosion_fx, 0, caster.GetAbsOrigin());
            ParticleManager.SetParticleControl(particle_explosion_fx, 1, Vector(radius, 1, 1));
            ParticleManager.SetParticleControl(particle_explosion_fx, 3, caster.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(particle_explosion_fx);
            if (scepter) {
                damage = damage + scepter_damage_bonus;
                radius = radius + scepter_radius_bonus;
            }
            let stacks = 0;
            let modifier_inflammable_handler = caster.FindModifierByName(modifier_inflammable);
            if (modifier_inflammable_handler) {
                stacks = modifier_inflammable_handler.GetStackCount();
            }
            damage = damage + inflammable_charge_radius * stacks;
            radius = radius + inflammable_charge_damage * stacks;
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                let damageTable = {
                    victim: enemy,
                    attacker: caster,
                    damage: damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    ability: ability
                }
                ApplyDamage(damageTable);
                RefreshElectroCharge(enemy);
            }
            let mines = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_OTHER, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, mine] of GameFunc.iPair(mines)) {
                if (mine.GetUnitName() == "npc_imba_techies_remote_mines") {
                    let modifier_inflammable_handler = mine.FindModifierByName(modifier_inflammable);
                    if (!modifier_inflammable_handler) {
                        modifier_inflammable_handler = mine.AddNewModifier(caster, ability, modifier_inflammable, {
                            duration: inflammable_duration
                        });
                    }
                    if (modifier_inflammable_handler) {
                        modifier_inflammable_handler.IncrementStackCount();
                        modifier_inflammable_handler.ForceRefresh();
                    }
                }
            }
            caster.ForceKill(true);
        });
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.NO_TARGET_cast(this);
    }
}
@registerModifier()
export class modifier_imba_remote_mine extends BaseModifier_Plus {
    BeCreated(p_0: any,): void {
        let caster = this.GetCasterPlus();
        let casterAbsOrigin = caster.GetAbsOrigin();
        let particle_mine = "particles/units/heroes/hero_techies/techies_remote_mine.vpcf";
        let particle_mine_fx = ResHelper.CreateParticleEx(particle_mine, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
        ParticleManager.SetParticleControl(particle_mine_fx, 0, casterAbsOrigin);
        ParticleManager.SetParticleControl(particle_mine_fx, 3, casterAbsOrigin);
        ParticleManager.ReleaseParticleIndex(particle_mine_fx);
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
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        }
        return state;
    }
}
@registerModifier()
export class modifier_imba_remote_mine_inflammable extends BaseModifier_Plus {
    public inflammable_max_charges: any;
    BeCreated(p_0: any,): void {
        this.inflammable_max_charges = this.GetSpecialValueFor("inflammable_max_charges");
    }
    GetTexture(): string {
        return "techies_remote_mines_self_detonate";
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
    OnStackCountChanged(old_count: number): void {
        let stacks = this.GetStackCount();
        if (stacks > this.inflammable_max_charges) {
            this.SetStackCount(this.inflammable_max_charges);
        }
    }
}
@registerAbility()
export class imba_techies_focused_detonate extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "techies_focused_detonate";
    }
    IsStealable(): boolean {
        return false;
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsNetherWardStealable() {
        return false;
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target_point = this.GetCursorPosition();
        let detonate_ability = "imba_techies_remote_mines_pinpoint_detonation";
        let radius = this.GetSpecialValueFor("radius");
        let remote_mines = FindUnitsInRadius(caster.GetTeamNumber(), target_point, undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_OTHER + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (let i = 0; i < GameFunc.GetCount(remote_mines); i++) {
            let unit = remote_mines[i];
            this.AddTimer(FrameTime() * (i + 1), () => {
                if (GFuncEntity.IsValid(unit)) {
                    let detonate_ability_handler = unit.FindAbilityByName(detonate_ability);
                    if (detonate_ability_handler) {
                        detonate_ability_handler.OnSpellStart();
                    }
                }
            });
        }
    }
}
@registerModifier()
export class modifier_imba_focused_detonate extends BaseModifier_Plus {
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
    BeDestroy(): void {
        if (IsServer()) {
            let stopOrder = {
                UnitIndex: this.GetCasterPlus().entindex(),
                OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_STOP
            }
            ExecuteOrderFromTable(stopOrder);
        }
    }
}
@registerAbility()
export class imba_techies_minefield_sign extends BaseAbility_Plus {
    public assigned_sign: any;
    GetAbilityTextureName(): string {
        return "techies_minefield_sign";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsNetherWardStealable() {
        return false;
    }
    IsInnateAbility() {
        return true;
    }
    GetAOERadius(): number {
        let caster = this.GetCasterPlus();
        let ability = this;
        let radius = ability.GetSpecialValueFor("aura_radius");
        radius = radius + caster.GetTalentValue("special_bonus_imba_techies_6");
        return radius;
    }
    OnUpgrade(): void {
        let ability = this;
        if (!ability.GetAutoCastState()) {
            ability.ToggleAutoCast();
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target_point = this.GetCursorPosition();
        let sound_cast = "Hero_Techies.Sign";
        let modifier_sign = "modifier_imba_minefield_sign_aura";
        EmitSoundOn(sound_cast, caster);
        if (this.assigned_sign && this.assigned_sign.Destroy) {
            this.assigned_sign.Destroy();
        }
        let sign = caster.CreateSummon("npc_imba_techies_minefield_sign", target_point, 60, false);
        GFuncEntity.AddRangeIndicator(sign, caster, this, "radius", undefined, 255, 40, 40, true);
        this.assigned_sign = sign;
        sign.AddNewModifier(caster, this, modifier_sign, {});
    }
}
@registerModifier()
export class modifier_imba_minefield_sign_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public radius: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.radius = this.ability.GetSpecialValueFor("aura_radius");
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
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true
        }
        return state;
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        let targetUnitName = target.GetUnitName();
        if (targetUnitName == "npc_imba_techies_land_mines" || targetUnitName == "npc_imba_techies_land_mines_big_boom" || targetUnitName == "npc_imba_techies_stasis_trap" || targetUnitName == "npc_imba_techies_remote_mines") {
            return false;
        }
        return true;
    }
    GetAuraRadius(): number {
        let radius = this.radius + this.caster.GetTalentValue("special_bonus_imba_techies_6");
        return radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_OTHER;
    }
    GetModifierAura(): string {
        return "modifier_imba_minefield_sign_detection";
    }
    IsAura(): boolean {
        if (IsServer()) {
            return this.ability.GetAutoCastState();
        }
    }
}
@registerModifier()
export class modifier_imba_minefield_sign_detection extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_TRUESIGHT_IMMUNE]: true
        }
        return state;
    }
    BeDestroy(): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            this.AddTimer(FrameTime(), () => {
                if (parent.GetUnitName() == "npc_imba_techies_remote_mines" && parent.IsAlive()) {
                    let detonate_ability = "imba_techies_remote_mines";
                    let detonate_ability_handler = parent.FindAbilityByName(detonate_ability);
                    if (detonate_ability_handler) {
                        let radius = detonate_ability_handler.GetSpecialValueFor("radius");
                        let enemies = FindUnitsInRadius(parent.GetTeamNumber(), parent.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                        if (GameFunc.GetCount(enemies) > 0) {
                            detonate_ability_handler.OnSpellStart();
                        }
                    }
                }
            });
        }
    }
}
