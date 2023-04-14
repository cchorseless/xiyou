import { GameFunc } from "../../../GameFunc";
import { AI_ability } from "../../../ai/AI_ability";
import { EventHelper } from "../../../helper/EventHelper";
import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

@registerAbility()
export class imba_alchemist_acid_spray extends BaseAbility_Plus {
    GetManaCost(level: number): number {
        return 0;
    }

    GetCooldown(level: number): number {
        return 20;
    }

    AutoSpellSelf() {
        return AI_ability.POSITION_most_enemy(this);
    }

    GetAbilityTextureName(): string {
        return "alchemist_acid_spray";
    }

    IsHiddenWhenStolen(): boolean {
        return false;
    }

    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }

    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let point = this.GetCursorPosition();
        let team_id = caster.GetTeamNumber();
        if (this.GetCasterPlus().GetUnitName().includes("alchemist")) {
            let cast_responses = {
                "1": "alchemist_alch_ability_acid_01",
                "2": "alchemist_alch_ability_acid_02",
                "3": "alchemist_alch_ability_acid_03",
                "4": "alchemist_alch_ability_acid_04",
                "5": "alchemist_alch_ability_acid_05",
                "6": "alchemist_alch_ability_acid_06",
                "7": "alchemist_alch_ability_acid_07",
                "8": "alchemist_alch_ability_acid_08",
                "9": "alchemist_alch_ability_acid_09",
                "10": "alchemist_alch_ability_acid_10",
                "11": "alchemist_alch_ability_acid_11",
                "12": "alchemist_alch_ability_acid_12"
            }
            EmitSoundOn(GFuncRandom.RandomOne(Object.values(cast_responses)), caster);
        }
        let thinker = BaseModifier_Plus.CreateBuffThinker(caster, this, "modifier_imba_acid_spray_thinker", {
            duration: this.GetSpecialValueFor("duration")
        }, point, team_id);
    }

    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_alchemist_1") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_alchemist_1")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_alchemist_1"), "modifier_special_bonus_imba_alchemist_1", {});
        }
    }
}

@registerModifier()
export class modifier_imba_acid_spray_thinker extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public thinker: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public ability_target_team: any;
    public ability_target_type: any;
    public ability_target_flags: any;
    public modifier_spray: any;
    public thinker_loc: Vector;
    public radius: number;
    public tick_rate: any;
    public damage: number;
    public stack_damage: number;
    public ability_damage_type: number;
    public particle: any;

    IsAura(): boolean {
        return true;
    }

    BeCreated(keys: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.thinker = this.GetParentPlus();
            this.ability = this.GetAbilityPlus();
            this.ability_target_team = this.ability.GetAbilityTargetTeam();
            this.ability_target_type = this.ability.GetAbilityTargetType();
            this.ability_target_flags = this.ability.GetAbilityTargetFlags();
            this.modifier_spray = "modifier_imba_acid_spray_handler";
            this.thinker_loc = this.thinker.GetAbsOrigin();
            this.thinker.EmitSound("Hero_Alchemist.AcidSpray");
            this.radius = this.ability.GetSpecialValueFor("radius");
            this.tick_rate = this.ability.GetSpecialValueFor("tick_rate");
            this.damage = this.ability.GetSpecialValueFor("damage");
            this.stack_damage = this.ability.GetSpecialValueFor("stack_damage");
            this.ability_damage_type = this.ability.GetAbilityDamageType();
            this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_alchemist/alchemist_acid_spray.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.thinker);
            ParticleManager.SetParticleControl(this.particle, 0, (Vector(0, 0, 0)));
            ParticleManager.SetParticleControl(this.particle, 1, (Vector(this.radius, 1, 1)));
            ParticleManager.SetParticleControl(this.particle, 15, (Vector(25, 150, 25)));
            ParticleManager.SetParticleControl(this.particle, 16, (Vector(0, 0, 0)));
            let units = FindUnitsInRadius(this.thinker.GetTeamNumber(), this.thinker_loc, undefined, this.radius, this.ability_target_team, this.ability_target_type, this.ability_target_flags, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, unit] of GameFunc.iPair(units)) {
                if (unit.HasModifier(this.modifier_spray)) {
                    let modifier_spray_handler = unit.findBuff<modifier_imba_acid_spray_handler>(this.modifier_spray);
                    if (modifier_spray_handler && !modifier_spray_handler.center) {
                        modifier_spray_handler.center = this.thinker_loc;
                    }
                }
            }
            this.StartIntervalThink(this.tick_rate);
        }
    }

    OnIntervalThink(): void {
        let units = FindUnitsInRadius(this.thinker.GetTeamNumber(), this.thinker_loc, undefined, this.radius, this.ability_target_team, this.ability_target_type, this.ability_target_flags, FindOrder.FIND_ANY_ORDER, false);
        let damage = undefined;
        for (const [_, unit] of GameFunc.iPair(units)) {
            if (unit.HasModifier(this.modifier_spray)) {
                let modifier_spray_handler = unit.findBuff<modifier_imba_acid_spray_handler>(this.modifier_spray);
                if (modifier_spray_handler && !modifier_spray_handler.center) {
                    modifier_spray_handler.center = this.thinker_loc;
                }
                EmitSoundOn("Hero_Alchemist.AcidSpray.Damage", unit);
                damage = this.damage;
                if (unit.HasModifier("modifier_imba_acid_spray_debuff_dot")) {
                    damage = damage + (this.stack_damage * unit.findBuff<modifier_imba_acid_spray_debuff_dot>("modifier_imba_acid_spray_debuff_dot").GetStackCount());
                }
                ApplyDamage({
                    victim: unit,
                    attacker: this.GetCasterPlus(),
                    damage: damage,
                    damage_type: this.ability_damage_type,
                    ability: this.ability
                });
            }
        }
    }

    GetAuraRadius(): number {
        return this.radius;
    }

    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return this.ability_target_team;
    }

    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return this.ability_target_type;
    }

    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return this.ability_target_flags;
    }

    GetModifierAura(): string {
        return "modifier_imba_acid_spray_handler";
    }

    BeDestroy( /** keys */): void {
        if (IsServer()) {
            let thinker = this.GetParentPlus();
            thinker.StopSound("Hero_Alchemist.AcidSpray");
            ParticleManager.ClearParticle(this.particle, true);
        }
    }
}

@registerModifier()
export class modifier_imba_acid_spray_handler extends BaseModifier_Plus {
    public modifier: modifier_imba_acid_spray_debuff_dot;
    public tick_rate: any;
    public center: Vector;


    IsHidden(): boolean {
        return true;
    }

    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            let unit = this.GetParentPlus();
            this.modifier = unit.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_acid_spray_debuff_dot", {}) as modifier_imba_acid_spray_debuff_dot;
            if (this.GetAbilityPlus()) {
                this.modifier.damage = ability.GetSpecialValueFor("damage");
                this.modifier.stack_damage = ability.GetSpecialValueFor("stack_damage");
                this.tick_rate = ability.GetSpecialValueFor("tick_rate");
            } else {
                this.modifier.damage = 25;
                this.modifier.stack_damage = 5;
                this.tick_rate = 1;
            }
            if (caster.HasTalent("special_bonus_imba_alchemist_5") && caster.HasModifier("modifier_imba_goblins_greed_passive")) {
                let greed_stacks = caster.findBuff<modifier_imba_goblins_greed_passive>("modifier_imba_goblins_greed_passive").GetStackCount();
                let bonus_damage = (caster.GetTalentValue("special_bonus_imba_alchemist_5") / 100) * greed_stacks;
                this.modifier.damage = this.modifier.damage + bonus_damage;
            }
            this.StartIntervalThink(this.tick_rate);
        }
    }

    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.modifier.IsNull()) {
                this.StartIntervalThink(-1);
                return;
            }
            this.modifier.OnIntervalThink(true, false);
        }
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(params: ModifierInstanceEvent): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let parent = this.GetParentPlus();
            if ((params.unit == parent)) {
                if (params.unit.IsIllusion()) {
                    return undefined;
                }
                if (caster.HasTalent("special_bonus_imba_alchemist_4") && caster.HasModifier("modifier_imba_goblins_greed_passive")) {
                    let greed_stacks = caster.findBuff<modifier_imba_goblins_greed_passive>("modifier_imba_goblins_greed_passive").GetStackCount();
                    let stacks_to_gold = caster.GetTalentValue("special_bonus_imba_alchemist_4", "stacks_to_gold_percentage") * 0.01;
                    let gold = greed_stacks * stacks_to_gold;
                    let drop_chance_hero = caster.GetTalentValue("special_bonus_imba_alchemist_4", "drop_chance_percentage_hero");
                    let drop_chance_creep = caster.GetTalentValue("special_bonus_imba_alchemist_4", "drop_chance_percentage_creep");
                    let drop_chance;
                    if (params.unit.IsRealUnit()) {
                        drop_chance = drop_chance_hero;
                    } else {
                        drop_chance = drop_chance_creep;
                    }
                    if (RollPercentage(drop_chance)) {
                        let newItem = CreateItem("item_bag_of_gold", undefined, undefined);
                        newItem.SetPurchaseTime(0);
                        newItem.SetCurrentCharges(gold);
                        let drop = CreateItemOnPositionSync(parent.GetAbsOrigin(), newItem);
                        let dropTarget = parent.GetAbsOrigin() + RandomVector(RandomFloat(50, 150));
                        newItem.LaunchLoot(true, 300, 0.75, dropTarget as Vector);
                        EmitSoundOn("Dungeon.TreasureItemDrop", parent);
                    }
                }
            }
        }
    }
}

@registerModifier()
export class modifier_imba_acid_spray_debuff_dot extends BaseModifier_Plus {
    public armor_reduction: any;
    public stack_armor_reduction: number;
    public max_stacks: number;
    public tick_rate: any;
    public movespeed_slow: number;
    damage: number;
    stack_damage: number;

    IsDebuff(): boolean {
        return true;
    }

    IsPurgable(): boolean {
        return true;
    }

    BeCreated(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.armor_reduction = this.GetSpecialValueFor("armor_reduction");
            this.stack_armor_reduction = this.GetSpecialValueFor("stack_armor_reduction");
            this.max_stacks = this.GetSpecialValueFor("max_stacks");
            this.tick_rate = this.GetSpecialValueFor("tick_rate");
        } else {
            this.armor_reduction = 5;
            this.stack_armor_reduction = 1;
            this.max_stacks = 2;
            this.tick_rate = 1;
        }
        this.movespeed_slow = this.GetCasterPlus().GetTalentValue("special_bonus_imba_alchemist_1") * (-1);
        if (IsServer()) {
            this.SetStackCount(1);
            this.StartIntervalThink(this.tick_rate);
        }
    }

    OnIntervalThink(aura_tick = false, consume_stacks = false): void {
        if (IsServer()) {
            if (aura_tick) {
                this.IncrementStackCount();
            }
            let unit = this.GetParentPlus();
            if (aura_tick ||
                consume_stacks ||
                (!unit.HasModifier("modifier_imba_acid_spray_handler") &&
                    !unit.HasModifier("modifier_imba_chemical_rage_aura"))) {
                if (!aura_tick) {
                    this.DecrementStackCount();
                }
                if (this.GetStackCount() == 0) {
                    if (consume_stacks) {
                        return;
                    }
                    this.Destroy();
                    return;
                }
                if (consume_stacks) {
                    this.OnIntervalThink(false, consume_stacks);
                }
            }
        }
    }


    OnStackCountChanged(old_stack_count: number): void {
        let stack_count = this.GetStackCount();
        if (this.GetCasterPlus() && !this.GetCasterPlus().IsNull() && this.GetCasterPlus().HasModifier("modifier_imba_chemical_rage_buff_haste") && this.max_stacks) {
            if (this.GetAbilityPlus()) {
                this.max_stacks = this.GetSpecialValueFor("max_stacks") * 2;
            }
        }
        if (stack_count > this.max_stacks) {
            this.SetStackCount(this.max_stacks);
        }
    }

    GetTexture(): string {
        return "alchemist_acid_spray";
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        if (this.armor_reduction && this.stack_armor_reduction) {
            return (this.armor_reduction + this.stack_armor_reduction * this.GetStackCount()) * (-1);
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.movespeed_slow) {
            return this.movespeed_slow;
        }
    }
}

@registerAbility()
export class imba_alchemist_unstable_concoction extends BaseAbility_Plus {
    public time_charged: number;
    public brew_start: number = 0;
    public brew_time: number;
    public stun: any;
    public damage: number;
    public radius_increase: number;
    public radius: number;

    GetCooldown(level: number): number {
        let cooddown = 20;
        if (this.IsUnstableConcoction()) {
            if (IsServer()) {
                return cooddown - (GameRules.GetGameTime() - this.brew_start);
            }
            return 0;
        }
        if (IsServer() || this.GetLevel() == 0) {
            return 0;
        }
        return cooddown;
    }

    GetManaCost(level: number): number {
        return 0;
    }

    AutoSpellSelf() {
        if (this.IsUnstableConcoction()) {
            if ((GameRules.GetGameTime() - this.brew_start) > 4 ||
                this.GetCasterPlus().GetHealthLosePect() > 80
            ) {
                return AI_ability.TARGET_if_enemy(this);
            }
            return false;
        } else {
            return AI_ability.NO_TARGET_if_enemy(this);
        }
    }

    IsHiddenWhenStolen(): boolean {
        return false;
    }

    OnUpgrade(): void {

    }

    OnUnStolen(): void {
        let caster = this.GetCasterPlus();
        caster.RemoveModifierByName("modifier_imba_unstable_concoction_handler");
    }

    IsUnstableConcoction() {
        return this.GetCasterPlus().HasModifier("modifier_imba_unstable_concoction_handler");
    }

    OnSpellStart(): void {
        let cast_response = {
            "1": "alchemist_alch_ability_concoc_01",
            "2": "alchemist_alch_ability_concoc_02",
            "3": "alchemist_alch_ability_concoc_03",
            "4": "alchemist_alch_ability_concoc_04",
            "5": "alchemist_alch_ability_concoc_05",
            "6": "alchemist_alch_ability_concoc_06",
            "7": "alchemist_alch_ability_concoc_07",
            "8": "alchemist_alch_ability_concoc_08",
            "9": "alchemist_alch_ability_concoc_10"
        }
        let last_second_throw_response = {
            "1": "alchemist_alch_ability_concoc_16",
            "2": "alchemist_alch_ability_concoc_17"
        }
        if (this.IsUnstableConcoction()) {
            let target = this.GetCursorTarget();
            this.GetCasterPlus().StopSound("Hero_Alchemist.UnstableConcoction.Fuse");
            this.GetCasterPlus().EmitSound("Hero_Alchemist.UnstableConcoction.Throw");
            let modifier_unstable_handler = this.GetCasterPlus().findBuff<modifier_imba_unstable_concoction_handler>("modifier_imba_unstable_concoction_handler");
            if (modifier_unstable_handler) {
                let remaining_time = modifier_unstable_handler.GetRemainingTime();
                if (remaining_time < 1) {
                    EmitSoundOn(GFuncRandom.RandomOne(Object.values(last_second_throw_response)), this.GetCasterPlus());
                }
            }
            this.GetCasterPlus().RemoveModifierByName("modifier_imba_unstable_concoction_handler");
            this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_ALCHEMIST_CONCOCTION_THROW);
            this.GetCasterPlus().FadeGesture(GameActivity_t.ACT_DOTA_ALCHEMIST_CONCOCTION);
            this.time_charged = GameRules.GetGameTime() - this.brew_start;
            this.AddTimer(0.3, () => {
                let projectile_speed = this.GetSpecialValueFor("projectile_speed", 900);
                let info = {
                    Target: target,
                    Source: this.GetCasterPlus(),
                    Ability: this,
                    bDodgeable: false,
                    EffectName: "particles/units/heroes/hero_alchemist/alchemist_unstable_concoction_projectile.vpcf",
                    iMoveSpeed: projectile_speed
                }
                ProjectileManager.CreateTrackingProjectile(info);
            });
            return;
        }
        EmitSoundOn(GFuncRandom.RandomOne(Object.values(cast_response)), this.GetCasterPlus());
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_ALCHEMIST_CONCOCTION);
        this.brew_start = GameRules.GetGameTime();
        this.brew_time = this.GetSpecialValueFor("brew_time");
        let extra_brew_time = this.GetSpecialValueFor("brew_explosion");
        let duration = extra_brew_time;
        this.stun = this.GetSpecialValueFor("max_stun");
        this.damage = this.GetSpecialValueFor("max_damage");
        this.radius_increase = this.GetSpecialValueFor("radius_increase") / this.brew_time;
        let greed_modifier = this.GetCasterPlus().findBuff<modifier_imba_goblins_greed_passive>("modifier_imba_goblins_greed_passive");
        if (greed_modifier) {
            let greed_stacks = greed_modifier.GetStackCount();
            let greed_multiplier = this.GetSpecialValueFor("time_per_stack");
            duration = duration + (greed_stacks * greed_multiplier);
        }
        let speed_multiplier;
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_alchemist_6") && this.GetCasterPlus().findBuff<modifier_imba_chemical_rage_buff_haste>("modifier_imba_chemical_rage_buff_haste")) {
            speed_multiplier = this.GetCasterPlus().GetTalentValue("special_bonus_imba_alchemist_6");
        } else {
            speed_multiplier = 1;
        }
        duration = duration / speed_multiplier;
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_unstable_concoction_handler", {
            duration: duration
        });
        NetTablesHelper.SetDotaEntityData(this.GetCasterPlus().GetEntityIndex(),
            {
                brew_start: GameRules.GetGameTime(),
                radius_increase: this.radius_increase
            }
        )
        this.radius = this.GetSpecialValueFor("radius");
        this.GetCasterPlus().EmitSound("Hero_Alchemist.UnstableConcoction.Fuse");
    }

    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let particle_acid_blast = "particles/hero/alchemist/acid_spray_blast.vpcf";
            let brew_duration = (GameRules.GetGameTime() - this.brew_start);
            caster.FadeGesture(GameActivity_t.ACT_DOTA_ALCHEMIST_CONCOCTION);
            target.EmitSound("Hero_Alchemist.UnstableConcoction.Stun");
            if (target.GetTeam() != caster.GetTeam() || target == caster) {
                let damage_type = this.GetAbilityDamageType();
                let stun = this.stun;
                let damage = this.damage;
                let radius = this.GetAOERadius();
                let kill_response = {
                    "1": "alchemist_alch_ability_concoc_09",
                    "2": "alchemist_alch_ability_concoc_15"
                }
                if (target) {
                    location = target.GetAbsOrigin();
                }
                let units = FindUnitsInRadius(caster.GetTeam(), location, undefined, radius, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false);
                let brew_percentage = brew_duration / this.brew_time;
                let speed_multiplier;
                if (caster.HasTalent("special_bonus_imba_alchemist_6") && caster.findBuff<modifier_imba_chemical_rage_buff_haste>("modifier_imba_chemical_rage_buff_haste")) {
                    speed_multiplier = caster.GetTalentValue("special_bonus_imba_alchemist_6");
                } else {
                    speed_multiplier = 1;
                }
                brew_percentage = brew_percentage * speed_multiplier;
                damage = damage * brew_percentage;
                let stun_duration = stun * brew_percentage;
                if (stun_duration > stun) {
                    stun_duration = stun;
                }
                if (target) {
                    if (target == caster) {
                        if (!target.IsMagicImmune() && !target.IsInvulnerable() && !target.IsOutOfGame()) {
                            ApplyDamage({
                                victim: target,
                                attacker: caster,
                                damage: damage,
                                damage_type: damage_type
                            });
                            target.AddNewModifier(caster, this, "modifier_imba_unstable_concoction_stunned", {
                                duration: stun_duration * (1 - target.GetStatusResistance())
                            });
                        }
                    } else {
                        if (target.TriggerSpellAbsorb(this)) {
                            return;
                        }
                    }
                }
                for (const [_, unit] of GameFunc.iPair(units)) {
                    if (IsValid(unit) && unit.GetTeam() != caster.GetTeam()) {
                        ApplyDamage({
                            victim: unit,
                            attacker: caster,
                            damage: damage,
                            damage_type: damage_type
                        });
                        unit.AddNewModifier(caster, this, "modifier_imba_unstable_concoction_stunned", {
                            duration: stun_duration * (1 - unit.GetStatusResistance())
                        });
                        this.AddTimer(FrameTime(), () => {
                            if (!unit.IsAlive() && RollPercentage(50)) {
                                EmitSoundOn(GFuncRandom.RandomOne(Object.values(kill_response)), caster);
                            }
                        });

                        /**     if (unit.HasModifier("modifier_imba_acid_spray_handler")) {
                            let acid_spray_modifier = unit.findBuff<modifier_imba_acid_spray_handler>("modifier_imba_acid_spray_handler");
                            let acid_spray_ability = acid_spray_modifier.GetAbility();
                            let acid_spray_radius = acid_spray_ability.GetAOERadius();
                            if (acid_spray_modifier.center) {
                                location = acid_spray_modifier.center;
                            }
                            let particle_acid_blast_fx = ResHelper.CreateParticleEx(particle_acid_blast, ParticleAttachment_t.PATTACH_WORLDORIGIN, caster);
                            ParticleManager.SetParticleControl(particle_acid_blast_fx, 0, location);
                            ParticleManager.SetParticleControl(particle_acid_blast_fx, 1, location);
                            ParticleManager.SetParticleControl(particle_acid_blast_fx, 2, Vector(acid_spray_radius, 0, 0));
                            ParticleManager.ReleaseParticleIndex(particle_acid_blast_fx);
                            let acid_spray_units = FindUnitsInRadius(caster.GetTeam(), location, undefined, acid_spray_radius * 2, this.GetAbilityTargetTeam(), DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, this.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false);
                            let damage_multiplier = this.GetSpecialValueFor("acid_spray_damage") * 0.01;
                            for (const [_, acid_spray_unit] of GameFunc.iPair(acid_spray_units)) {
                                let actual_damage = ApplyDamage({
                                    victim: acid_spray_unit,
                                    attacker: caster,
                                    damage: damage * damage_multiplier,
                                    damage_type: damage_type
                                });
                                let modifier = acid_spray_unit.findBuff<modifier_imba_acid_spray_debuff_dot>("modifier_imba_acid_spray_debuff_dot");
                                if (modifier) {
                                    modifier.OnIntervalThink(false, true);
                                }
                            }
                            let modifier = unit.findBuff<modifier_imba_acid_spray_debuff_dot>("modifier_imba_acid_spray_debuff_dot");
                            if (modifier) {
                                modifier.OnIntervalThink(false, true);
                            }
                        }*/
                    }
                }
            } else {
                let total_duration = brew_duration * caster.GetTalentValue("special_bonus_imba_alchemist_2");
                let chemical_rage = caster.findAbliityPlus<imba_alchemist_chemical_rage>("imba_alchemist_chemical_rage");
                target.AddNewModifier(caster, chemical_rage, "modifier_imba_chemical_rage_buff_haste", {
                    duration: total_duration
                });
            }
        }
    }

    GetAbilityTextureName(): string {
        if (this.IsUnstableConcoction()) {
            return "alchemist_unstable_concoction_throw";
        }
        return super.GetAbilityTextureName();
    }


    GetCastPoint() {
        if (this.IsUnstableConcoction()) {
            return super.GetCastPoint();
        }
        return 0;
    }

    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.IsUnstableConcoction()) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET;
        }
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE;
    }

    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let hasTalent = caster.HasTalent("special_bonus_imba_alchemist_2");
            if (target) {
                if (target.GetTeam() == caster.GetTeam() && !hasTalent) {
                    return UnitFilterResult.UF_FAIL_FRIENDLY;
                }
                if (caster == target) {
                    return UnitFilterResult.UF_FAIL_CUSTOM;
                }
            }
            let nResult = UnitFilter(target, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), caster.GetTeamNumber());
            return nResult;
        }
    }

    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        return "dota_hud_error_cant_cast_on_self";
    }

    ProcsMagicStick(): boolean {
        let caster = this.GetCasterPlus();
        if (this.IsUnstableConcoction()) {
            return false;
        }
        return true;
    }

    GetAOERadius(): number {
        let caster = this.GetCasterPlus();
        let brew_start = 0;
        let radius_increase = 0;
        if (IsServer()) {
            brew_start = this.brew_start;
            radius_increase = this.radius_increase;
        } else {
            let net_table = NetTablesHelper.GetDotaEntityData(caster.GetEntityIndex());
            brew_start = net_table.brew_start || 0;
            radius_increase = net_table.radius_increase || 0;
        }
        let radius = this.GetSpecialValueFor("radius") + (GameRules.GetGameTime() - brew_start) * radius_increase;
        return radius;
    }
}

@registerModifier()
export class modifier_imba_unstable_concoction_handler extends BaseModifier_Plus {
    public last_second_responded: boolean;

    IsPurgable(): boolean {
        return false;
    }

    IsHidden(): boolean {
        return true;
    }

    BeDestroy(): void {
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus<imba_alchemist_unstable_concoction>();
        if (IsServer()) {
            if (!caster.IsAlive()) {
                caster.EmitSound("Hero_Alchemist.UnstableConcoction.Stun");
                caster.StopSound("Hero_Alchemist.UnstableConcoction.Fuse");
                ability.OnProjectileHit(caster, caster.GetAbsOrigin());
                ability.StartCooldown(ability.GetCooldown(ability.GetLevel()));
            }
        }
    }

    BeCreated(p_0: any,): void {
        this.StartIntervalThink(FrameTime());
    }

    OnIntervalThink(): void {
        if (IsServer()) {
            let caster = this.GetParentPlus();
            let ability = this.GetAbilityPlus<imba_alchemist_unstable_concoction>();
            if (!IsValid(ability)) {
                this.Destroy();
                return;
            }
            let last_second_response = {
                "1": "alchemist_alch_ability_concoc_11",
                "2": "alchemist_alch_ability_concoc_12",
                "3": "alchemist_alch_ability_concoc_13",
                "4": "alchemist_alch_ability_concoc_14",
                "5": "alchemist_alch_ability_concoc_18",
                "6": "alchemist_alch_ability_concoc_19",
                "7": "alchemist_alch_ability_concoc_20"
            }
            let self_blow_response = {
                "1": "alchemist_alch_ability_concoc_21",
                "2": "alchemist_alch_ability_concoc_22",
                "3": "alchemist_alch_ability_concoc_23",
                "4": "alchemist_alch_ability_concoc_24",
                "5": "alchemist_alch_ability_concoc_25"
            }
            let brew_time_passed = this.GetDuration();
            let brew_start = ability.brew_start || 0;
            let particleName = "particles/units/heroes/hero_alchemist/alchemist_unstable_concoction_timer.vpcf";
            let number = math.abs(GameRules.GetGameTime() - brew_start - brew_time_passed);
            if (caster.HasTalent("special_bonus_imba_alchemist_6") && caster.HasModifier("modifier_imba_chemical_rage_buff_haste")) {
                number = number * caster.GetTalentValue("special_bonus_imba_alchemist_6");
            }
            let integer = math.floor(number);
            if (integer <= 0 && !this.last_second_responded) {
                this.last_second_responded = true;
                EmitSoundOn(GFuncRandom.RandomOne(Object.values(last_second_response)), caster);
            }
            let digits = math.floor(math.log10(number)) + 2;
            let decimal = number % 1;
            if (decimal < 0.04) {
                decimal = 1;
            } else if (decimal > 0.5 && decimal < 0.54) {
                decimal = 8;
            } else {
                return;
            }
            if (!(integer == 0 && decimal <= 1)) {
                let allHeroes = caster.GetPlayerRoot().BattleUnitManagerComp().GetAllBattleUnitAliveNpc(caster.GetTeam());
                for (const [k, v] of GameFunc.iPair(allHeroes)) {
                    if (v.GetTeam() == caster.GetTeam()) {
                        let particle = ResHelper.CreateParticleEx(particleName, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, caster);
                        ParticleManager.SetParticleControl(particle, 0, caster.GetAbsOrigin());
                        ParticleManager.SetParticleControl(particle, 1, Vector(0, integer, decimal));
                        ParticleManager.SetParticleControl(particle, 2, Vector(digits, 0, 0));
                        if (caster.HasTalent("special_bonus_imba_alchemist_6") && caster.HasModifier("modifier_imba_chemical_rage_buff_haste")) {
                            this.AddTimer(0.5 / caster.GetTalentValue("special_bonus_imba_alchemist_6"), () => {
                                ParticleManager.ClearParticle(particle, true);
                            });
                        } else {
                            ParticleManager.ReleaseParticleIndex(particle);
                        }
                    }
                }
            } else {
                ability.time_charged = GameRules.GetGameTime() - ability.brew_start;
                EmitSoundOn(GFuncRandom.RandomOne(Object.values(self_blow_response)), caster);
                let info = {
                    Target: caster,
                    Source: caster,
                    Ability: ability,
                    bDodgeable: false,
                    EffectName: "particles/units/heroes/hero_alchemist/alchemist_unstable_concoction_projectile.vpcf",
                    iMoveSpeed: ability.GetSpecialValueFor("projectile_speed", 900)
                }
                ProjectileManager.CreateTrackingProjectile(info);
                ability.StartCooldown(ability.GetCooldown(ability.GetLevel()));
                caster.RemoveModifierByName("modifier_imba_unstable_concoction_handler");
            }
        }
    }
}

@registerModifier()
export class modifier_imba_unstable_concoction_stunned extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }

    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_DISABLED;
    }


    IsPurgable(): boolean {
        return false;
    }

    IsPurgeException(): boolean {
        return true;
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

@registerAbility()
export class imba_alchemist_goblins_greed extends BaseAbility_Plus {
    public greevil: IBaseNpc_Plus;
    public greevil_ability: imba_alchemist_greevils_greed;

    GetAbilityTextureName(): string {
        return "alchemist_goblins_greed";
    }

    IsStealable(): boolean {
        return false;
    }

    OnInventoryContentsChanged(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let mammonite_ability = "imba_alchemist_mammonite";
            if (caster.HasAbility(mammonite_ability)) {
                let mammonite_ability_handler = caster.FindAbilityByName(mammonite_ability);
                if (mammonite_ability_handler) {
                    if (caster.HasScepter()) {
                        mammonite_ability_handler.SetLevel(1);
                        mammonite_ability_handler.SetHidden(false);
                    } else {
                        if (mammonite_ability_handler.GetLevel() > 0) {
                            mammonite_ability_handler.SetLevel(0);
                            mammonite_ability_handler.SetHidden(true);
                        }
                    }
                }
            }
        }
    }

    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return super.GetCastRange(location, target);
    }

    GetIntrinsicModifierName(): string {
        return "modifier_imba_goblins_greed_passive";
    }

    OnUpgrade(): void {
        let caster = this.GetCasterPlus();
        let modifier = caster.FindModifierByName(this.GetIntrinsicModifierName());
        let base_gold = this.GetSpecialValueFor("bonus_gold");
        let base_gold_1 = this.GetLevelSpecialValueFor("bonus_gold", this.GetLevel() - 2);
        let stacks = modifier.GetStackCount();
        if (this.GetLevel() == 1) {
            base_gold_1 = 0;
        }
        modifier.SetStackCount(stacks + (base_gold - base_gold_1));
    }

    OnSpellStart(): void {
        if (IsServer()) {
            if (IsValid(this.greevil)) {
                this.EndCooldown();
                EventHelper.ErrorMessage("#dota_hud_error_active_greevil", this.GetCasterPlus().GetPlayerID());
                return;
            }
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            let cast_sound = "DOTA_Item.Hand_Of_Midas";
            let modifier = caster.FindModifierByName(this.GetIntrinsicModifierName());
            let gold_multiplier = this.GetSpecialValueFor("gold_multiplier");
            let exp_multiplier = this.GetSpecialValueFor("exp_multiplier");
            let total_gold = target.GetGoldBounty() * gold_multiplier;
            let total_exp = target.GetDeathXP() * exp_multiplier;
            let bonus_stacks = this.GetSpecialValueFor("bonus_stacks");
            let greevil_duration = this.GetSpecialValueFor("greevil_duration");
            target.EmitSound(cast_sound);
            SendOverheadEventMessage(caster.GetPlayerOwner(), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_GOLD, target, total_gold, undefined);
            let particle_fx = ResHelper.CreateParticleEx("particles/items2_fx/hand_of_midas.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
            ParticleManager.SetParticleControlEnt(particle_fx, 1, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), false);
            target.SetDeathXP(0);
            target.SetMinimumGoldBounty(0);
            target.SetMaximumGoldBounty(0);
            target.Kill(this, caster);
            const playerroot = GGameScene.GetPlayer(caster.GetPlayerID());
            // caster.AddExperience(total_exp, false, false);
            playerroot.PlayerDataComp().ModifyGold(total_gold, true, EDOTA_ModifyGold_Reason.DOTA_ModifyGold_Unspecified);
            modifier.SetStackCount(modifier.GetStackCount() + bonus_stacks);
            this.greevil = caster.CreateSummon("npc_imba_alchemist_greevil", target.GetAbsOrigin(), greevil_duration);
            this.greevil_ability = this.greevil.findAbliityPlus<imba_alchemist_greevils_greed>("imba_alchemist_greevils_greed");
            this.greevil_ability.SetLevel(1);
            this.AddTimer(0.1, () => {
                this.greevil.MoveToNPC(caster);
            });
            caster.AddNewModifier(caster, this, "modifier_imba_greevil_gold", {
                duration: greevil_duration
            });
        }
    }
}

@registerModifier()
export class modifier_imba_greevil_gold extends BaseModifier_Plus {
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.StartIntervalThink(2);
        }
    }

    OnIntervalThink(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            let gold_particle = "particles/units/heroes/hero_alchemist/alchemist_lasthit_coins.vpcf";
            let player = PlayerResource.GetPlayer(caster.GetPlayerID());
            let greed_modifier = caster.findBuff<modifier_imba_goblins_greed_passive>("modifier_imba_goblins_greed_passive");
            let stacks;
            if (greed_modifier) {
                stacks = greed_modifier.GetStackCount();
            }
            let gold_pct = ability.GetSpecialValueFor("periodic_gold_percentage");
            let total_gold = math.floor(stacks * (gold_pct / 100));
            let gold_particle_fx = ParticleManager.CreateParticleForPlayer(gold_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, caster, player);
            ParticleManager.SetParticleControl(gold_particle_fx, 0, caster.GetAbsOrigin());
            ParticleManager.SetParticleControl(gold_particle_fx, 1, caster.GetAbsOrigin());
            let msg_particle = "particles/units/heroes/hero_alchemist/alchemist_lasthit_msg_gold.vpcf";
            let msg_particle_fx = ParticleManager.CreateParticleForPlayer(msg_particle, ParticleAttachment_t.PATTACH_ABSORIGIN, caster, player);
            ParticleManager.SetParticleControl(msg_particle_fx, 1, Vector(0, total_gold, 0));
            ParticleManager.SetParticleControl(msg_particle_fx, 2, Vector(2, string.len(total_gold + "") + 1, 0));
            ParticleManager.SetParticleControl(msg_particle_fx, 3, Vector(255, 200, 33));
            let playerroot = GGameScene.GetPlayer(caster.GetPlayerID());
            let PlayerData = playerroot.PlayerDataComp();
            PlayerData.ModifyGold(total_gold, false, EDOTA_ModifyGold_Reason.DOTA_ModifyGold_Unspecified);
        }
    }

    IsHidden(): boolean {
        return true;
    }

    IsPurgable(): boolean {
        return true;
    }

    IsDebuff(): boolean {
        return false;
    }
}

@registerModifier()
export class modifier_imba_goblins_greed_passive extends BaseModifier_Plus {
    public greed_stacks: number;

    RemoveOnDeath(): boolean {
        return false;
    }

    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT + DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_IGNORE_INVULNERABLE;
    }

    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.greed_stacks = this.GetStackCount();
            let caster = this.GetCasterPlus();
            if (!caster.IsIllusion()) {
                let ability = this.GetAbilityPlus();
            }
        }
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH, false, true)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        let attacker = keys.attacker;
        let unit = keys.unit;
        if (caster.PassivesDisabled()) {
            return;
        }
        if (caster == attacker && !unit.IsBuilding() && !unit.IsIllusion() && !unit.IsTempestDouble() && caster.GetTeamNumber() != unit.GetTeamNumber() && unit.GetGoldBounty) {
            let stacks = this.GetStackCount();
            let hero_multiplier = 1;
            if (unit.IsRealUnit()) {
                hero_multiplier = ability.GetSpecialValueFor("hero_multiplier");
            }
            let playerroot = GGameScene.GetPlayer(caster.GetPlayerID());
            let PlayerData = playerroot.PlayerDataComp();
            PlayerData.ModifyGold(stacks * hero_multiplier, false, EDOTA_ModifyGold_Reason.DOTA_ModifyGold_Unspecified);
            let player = PlayerResource.GetPlayer(caster.GetPlayerID());
            let particleName = "particles/units/heroes/hero_alchemist/alchemist_lasthit_coins.vpcf";
            let particle1 = ParticleManager.CreateParticleForPlayer(particleName, ParticleAttachment_t.PATTACH_ABSORIGIN, unit, player);
            ParticleManager.SetParticleControl(particle1, 0, unit.GetAbsOrigin());
            ParticleManager.SetParticleControl(particle1, 1, unit.GetAbsOrigin());
            let symbol = 0;
            let color = Vector(255, 200, 33);
            let lifetime = 2;
            let digits = string.len(stacks + "") + 1;
            particleName = "particles/units/heroes/hero_alchemist/alchemist_lasthit_msg_gold.vpcf";
            let particle2 = ParticleManager.CreateParticleForPlayer(particleName, ParticleAttachment_t.PATTACH_ABSORIGIN, unit, player);
            ParticleManager.SetParticleControl(particle2, 1, Vector(symbol, stacks, symbol));
            ParticleManager.SetParticleControl(particle2, 2, Vector(lifetime, digits, 0));
            ParticleManager.SetParticleControl(particle2, 3, color);
            let stack_bonus = ability.GetSpecialValueFor("bonus_bonus_gold");
            let duration = ability.GetSpecialValueFor("duration");
            this.SetStackCount(stacks + stack_bonus);
            this.AddTimer(duration, () => {
                if (!this || this.IsNull() || !stacks) {
                    return undefined;
                }
                this.SetStackCount(this.GetStackCount() - stack_bonus);
            });
        }
    }
}

@registerAbility()
export class imba_alchemist_greevils_greed extends BaseAbility_Plus {

    target: IBaseNpc_Plus;

    GetAbilityTextureName(): string {
        return "alchemist_goblins_greed";
    }

    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        return 1;
    }

    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target = this.GetCursorTarget();
        let owner = caster.GetOwner();
        // let greed_ability = imba_alchemist_goblins_greed.findIn(owner as CDOTA_BaseNPC) ;
        let hull_size = target.GetHullRadius();
        let particle_greevil = "particles/econ/courier/courier_greevil_black/courier_greevil_black_ambient_3.vpcf"
        let particle_greevil_fx = ResHelper.CreateParticleEx(particle_greevil, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
        ParticleManager.SetParticleControl(particle_greevil_fx, 0, target.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_greevil_fx, 1, Vector(hull_size * 3, 1, 1));
        ParticleManager.ReleaseParticleIndex(particle_greevil_fx);
        this.target = target;
        caster.MoveToNPC(owner as IBaseNpc_Plus);
    }

    GetIntrinsicModifierName(): string {
        return "modifier_imba_greevils_greed_handler";
    }
}

@registerModifier()
export class modifier_imba_greevils_greed_handler extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: imba_alchemist_greevils_greed;
    public owner: IBaseNpc_Plus;

    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.owner = this.caster.GetOwner() as IBaseNpc_Plus;
            this.StartIntervalThink(0.5);
        }
    }

    OnIntervalThink(): void {
        if (IsServer()) {
            // if (this.owner.IsImbaInvisible()) {
            //     this.caster.AddNoDraw();
            // } else {
            //     this.caster.RemoveNoDraw();
            // }
            let target = this.ability.target;
            if (target && !target.IsAlive()) {
                this.ability.target = null;
            }
            if (!target) {
                if (this.owner.IsAlive()) {
                    this.caster.MoveToNPC(this.owner);
                } else {
                    this.Destroy();
                }
            }
        }
    }

    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (IsServer()) {
            let state = {
                [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
                [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
                [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
                [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
                [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true
            }
            return state;
        }
    }
}

@registerAbility()
export class imba_alchemist_chemical_rage extends BaseAbility_Plus {

    GetCooldown(level: number): number {
        return 20;
    }

    GetManaCost(level: number): number {
        return 100;
    }

    AutoSpellSelf() {
        return AI_ability.NO_TARGET_cast(this);
    }

    GetAbilityTextureName(): string {
        return "alchemist_chemical_rage";
    }

    IsHiddenWhenStolen(): boolean {
        return false;
    }

    GetAssociatedSecondaryAbilities(): string {
        return "imba_alchemist_acid_spray";
    }

    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let cast_response = {
            "1": "alchemist_alch_ability_rage_01",
            "2": "alchemist_alch_ability_rage_02",
            "3": "alchemist_alch_ability_rage_03",
            "4": "alchemist_alch_ability_rage_04",
            "5": "alchemist_alch_ability_rage_05",
            "6": "alchemist_alch_ability_rage_06",
            "7": "alchemist_alch_ability_rage_07",
            "8": "alchemist_alch_ability_rage_08",
            "9": "alchemist_alch_ability_rage_09",
            "10": "alchemist_alch_ability_rage_10",
            "11": "alchemist_alch_ability_rage_11",
            "12": "alchemist_alch_ability_rage_12",
            "13": "alchemist_alch_ability_rage_13",
            "14": "alchemist_alch_ability_rage_15",
            "15": "alchemist_alch_ability_rage_16",
            "16": "alchemist_alch_ability_rage_17",
            "17": "alchemist_alch_ability_rage_18",
            "18": "alchemist_alch_ability_rage_19",
            "19": "alchemist_alch_ability_rage_20",
            "20": "alchemist_alch_ability_rage_21",
            "21": "alchemist_alch_ability_rage_22",
            "22": "alchemist_alch_ability_rage_23",
            "23": "alchemist_alch_ability_rage_24",
            "24": "alchemist_alch_ability_rage_25"
        }
        let radius_of_swamp = 800;
        let enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, radius_of_swamp, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        let swamp_maximum_occupancy = PlayerResource.GetPlayerCount() * 0.25;
        if (GameFunc.GetCount(enemies) >= swamp_maximum_occupancy) {
            caster.EmitSound("Imba.AlchemistMySwamp");
        } else {
            EmitSoundOn(GFuncRandom.RandomOne(Object.values(cast_response)), caster);
        }
        caster.Purge(false, true, false, false, false);
        caster.AddNewModifier(caster, this, "modifier_imba_chemical_rage_handler", {});
        caster.EmitSound("Hero_Alchemist.ChemicalRage.Cast");
    }
}

@registerModifier()
export class modifier_imba_chemical_rage_handler extends BaseModifier_Plus {
    public transformation_time: number;

    IsHidden(): boolean {
        return true;
    }

    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.transformation_time = this.GetSpecialValueFor("transformation_time");
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (caster.GetUnitName().includes("alchemist")) {
                caster.StartGesture(GameActivity_t.ACT_DOTA_ALCHEMIST_CHEMICAL_RAGE_START);
            }
            this.SetDuration(this.transformation_time, false);
        }
    }

    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true
        };
    }

    BeDestroy(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            let buff_duration = ability.GetSpecialValueFor("duration");
            if (caster.HasModifier("modifier_imba_chemical_rage_buff_haste")) {
                caster.RemoveModifierByName("modifier_imba_chemical_rage_buff_haste");
            }
            caster.AddNewModifier(caster, ability, "modifier_imba_chemical_rage_buff_haste", {
                duration: buff_duration
            });
            if (caster.HasModifier("modifier_imba_chemical_rage_aura_talent")) {
                caster.RemoveModifierByName("modifier_imba_chemical_rage_aura_talent");
            }
            if (caster.HasTalent("special_bonus_imba_alchemist_8")) {
                caster.AddNewModifier(caster, ability, "modifier_imba_chemical_rage_aura_talent", {
                    duration: buff_duration
                });
            }
        }
    }
}

@registerModifier()
export class modifier_imba_chemical_rage_buff_haste extends BaseModifier_Plus {
    public bonus_mana_regen: number;
    public bonus_health_regen: number;
    public bonus_movespeed: number;
    public base_attack_time: number;
    public ability: IBaseAbility_Plus;
    public radius: number;

    AllowIllusionDuplicate(): boolean {
        return true;
    }

    BeCreated(p_0: any,): void {
        this.bonus_mana_regen = this.GetSpecialValueFor("bonus_mana_regen");
        this.bonus_health_regen = this.GetSpecialValueFor("bonus_health_regen");
        this.bonus_movespeed = this.GetSpecialValueFor("bonus_movespeed");
        this.base_attack_time = this.GetSpecialValueFor("base_attack_time");
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            let parent = this.GetParentPlus();
            let particle_acid_aura = "particles/hero/alchemist/chemical_rage_acid_aura.vpcf";
            this.ability = caster.findAbliityPlus<imba_alchemist_acid_spray>("imba_alchemist_acid_spray");
            if (this.ability) {
                this.radius = this.ability.GetSpecialValueFor("radius");
            } else {
                this.radius = 0;
            }
            let particle_acid_aura_fx = ResHelper.CreateParticleEx(particle_acid_aura, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
            ParticleManager.SetParticleControl(particle_acid_aura_fx, 0, parent.GetAbsOrigin());
            ParticleManager.SetParticleControl(particle_acid_aura_fx, 1, parent.GetAbsOrigin());
            this.AddParticle(particle_acid_aura_fx, false, false, -1, false, false);
        }
    }

    BeDestroy(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let parent = this.GetParentPlus();
            if (caster == parent) {
                caster.StartGesture(GameActivity_t.ACT_DOTA_ALCHEMIST_CHEMICAL_RAGE_END);
            }
        }
    }

    IsAura(): boolean {
        return true;
    }

    GetAuraRadius(): number {
        return this.radius;
    }

    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }

    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }

    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES;
    }

    GetModifierAura(): string {
        return "modifier_imba_chemical_rage_aura";
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS,
            5: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ATTACK_SOUND,
            6: GPropertyConfig.EMODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        return "chemical_rage";
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ATTACK_SOUND)
    CC_GetAttackSound(): string {
        return "Hero_Alchemist.ChemicalRage.Attack";
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        return this.bonus_mana_regen;
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.bonus_health_regen;
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        return this.bonus_movespeed;
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT)
    CC_GetModifierBaseAttackTimeConstant(): number {
        return this.base_attack_time;
    }

    GetEffectName(): string {
        return "particles/units/heroes/hero_alchemist/alchemist_chemical_rage.vpcf";
    }

    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }

    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_chemical_rage.vpcf";
    }

    StatusEffectPriority(): modifierpriority {
        return 4;
    }

    GetHeroEffectName(): string {
        return "particles/units/heroes/hero_alchemist/alchemist_chemical_rage_hero_effect.vpcf";
    }

    HeroEffectPriority(): modifierpriority {
        return 4;
    }
}

@registerModifier()
export class modifier_imba_chemical_rage_aura extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public modifier: any;

    IsDebuff(): boolean {
        return true;
    }

    IsHidden(): boolean {
        return true;
    }

    Init(p_0: any,): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let unit = this.GetParentPlus();
            this.ability = caster.findAbliityPlus<imba_alchemist_acid_spray>("imba_alchemist_acid_spray");
            this.modifier = unit.findBuff<modifier_imba_acid_spray_debuff_dot>("modifier_imba_acid_spray_debuff_dot");
            if (this.ability && this.modifier) {
                this.modifier.damage = this.ability.GetSpecialValueFor("damage");
                this.modifier.stack_damage = this.ability.GetSpecialValueFor("stack_damage");
                let tick_rate = this.ability.GetSpecialValueFor("tick_rate");
                this.StartIntervalThink(tick_rate);
            }
        }
    }

    OnIntervalThink(): void {
        if (IsServer()) {
            if (this.modifier.IsNull()) {
                return;
            }
            this.modifier.OnIntervalThink(true, false);
        }
    }
}

@registerModifier()
export class modifier_imba_chemical_rage_aura_talent extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }

    IsAura(): boolean {
        return true;
    }

    GetAuraRadius(): number {
        return this.GetCasterPlus().GetTalentValue("special_bonus_imba_alchemist_8");
    }

    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }

    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }

    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO;
    }

    GetModifierAura(): string {
        return "modifier_imba_chemical_rage_aura_buff";
    }
}

@registerModifier()
export class modifier_imba_chemical_rage_aura_buff extends BaseModifier_Plus {
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasModifier("modifier_imba_goblins_greed_passive")) {
            this.SetStackCount(this.GetCasterPlus().findBuff<modifier_imba_goblins_greed_passive>("modifier_imba_goblins_greed_passive").GetStackCount());
        }
        this.StartIntervalThink(0.5);
    }

    OnIntervalThink(): void {
        if (this.GetCasterPlus().HasModifier("modifier_imba_goblins_greed_passive")) {
            this.SetStackCount(this.GetCasterPlus().findBuff<modifier_imba_goblins_greed_passive>("modifier_imba_goblins_greed_passive").GetStackCount());
        }
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.GetStackCount();
    }

    IsDebuff(): boolean {
        return false;
    }

    IsHidden(): boolean {
        return false;
    }
}

@registerAbility()
export class imba_alchemist_mammonite extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "alchemist_mammonite";
    }

    IsStealable(): boolean {
        return false;
    }

    OnToggle(): void {
        return;
    }

    GetIntrinsicModifierName(): string {
        return "modifier_mammonite_passive";
    }
}

@registerModifier()
export class modifier_mammonite_passive extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public gold_damage: number;

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

    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.gold_damage = this.ability.GetSpecialValueFor("gold_damage");
    }

    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_FINISHED,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ABILITY_LAYOUT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ABILITY_LAYOUT)
    CC_GetModifierAbilityLayout(): number {
        return 5;
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        if (IsServer()) {
            if (this.caster.HasScepter()) {
                if (this.ability.GetToggleState()) {
                    let player = GGameScene.GetPlayer(this.caster.GetPlayerID());
                    let PlayerData = player.PlayerDataComp();
                    let gold = PlayerData.GetGold();
                    let gold_percent = this.gold_damage * 0.01;
                    let gold_damage = gold * gold_percent;
                    return gold_damage;
                }
            }
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_FINISHED)
    CC_OnAttackFinished(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            if (this.caster == attacker) {
                if (this.caster.HasScepter()) {
                    if (this.ability.GetToggleState()) {
                        let player = GGameScene.GetPlayer(this.caster.GetPlayerID());
                        let PlayerData = player.PlayerDataComp();
                        let gold = PlayerData.GetGold();
                        let gold_percent = this.gold_damage * 0.01;
                        let gold_damage = gold * gold_percent;
                        PlayerData.ModifyGold(gold_damage);
                    }
                }
            }
        }
    }
}

@registerModifier()
export class modifier_special_bonus_imba_alchemist_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_alchemist_2 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_alchemist_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_alchemist_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_alchemist_5 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_alchemist_6 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_alchemist_7 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_alchemist_8 extends BaseModifier_Plus {
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
