
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_warlock_fatal_bonds extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target = this.GetCursorTarget();
        let particle_base = "particles/units/heroes/hero_warlock/warlock_fatal_bonds_base.vpcf";
        let particle_hit = "particles/units/heroes/hero_warlock/warlock_fatal_bonds_hit.vpcf";
        let modifier_bonds = "modifier_imba_fatal_bonds";
        let max_targets = ability.GetSpecialValueFor("max_targets");
        let duration = ability.GetSpecialValueFor("duration");
        let link_search_radius = ability.GetSpecialValueFor("link_search_radius");
        EmitSoundOn("Hero_Warlock.FatalBonds", caster);
        let targets_linked = 0;
        let linked_units: EntityIndex[] = []
        let bond_table: IBaseNpc_Plus[] = []
        let modifier_table: modifier_imba_fatal_bonds[] = []
        if (target.GetTeam() != caster.GetTeam()) {
            if (target.TriggerSpellAbsorb(ability)) {
                return undefined;
            }
        }
        let bond_target = target;
        for (let link = 0; link < max_targets; link++) {
            let enemies = FindUnitsInRadius(caster.GetTeamNumber(), bond_target.GetAbsOrigin(), undefined, link_search_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (!linked_units.includes(enemy.GetEntityIndex())) {
                    let bond_modifier = enemy.AddNewModifier(caster, ability, modifier_bonds, {
                        duration: duration * (1 - enemy.GetStatusResistance())
                    });
                    modifier_table.push(bond_modifier as modifier_imba_fatal_bonds);
                    bond_table.push(enemy);
                    linked_units.push(enemy.GetEntityIndex());;
                    if (enemy == target) {
                        let particle_hit_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_warlock/warlock_fatal_bonds_hit_parent.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, caster, caster);
                        ParticleManager.SetParticleControlEnt(particle_hit_fx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", caster.GetAbsOrigin(), true);
                        ParticleManager.SetParticleControlEnt(particle_hit_fx, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                        ParticleManager.ReleaseParticleIndex(particle_hit_fx);
                    } else {
                        let particle_hit_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_warlock/warlock_fatal_bonds_hit_parent.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, caster, caster);
                        ParticleManager.SetParticleControlEnt(particle_hit_fx, 0, bond_target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", bond_target.GetAbsOrigin(), true);
                        ParticleManager.SetParticleControlEnt(particle_hit_fx, 1, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
                        ParticleManager.ReleaseParticleIndex(particle_hit_fx);
                    }
                    bond_target = enemy;
                    return;
                }
            }
            if (link > GameFunc.GetCount(modifier_table)) {
                return;
            }
        }
        for (const modifiers of (modifier_table)) {
            modifiers.bond_table = bond_table;
        }
    }
}
@registerModifier()
export class modifier_imba_fatal_bonds extends BaseModifier_Plus {
    bond_table: IBaseNpc_Plus[];
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public sound_damage: string;
    public modifier_bonds: any;
    public modifier_word: any;
    public ability_word: any;
    public link_damage_share_pct: number;
    public golem_link_radius: number;
    public golem_link_damage_pct: number;
    public ability_word_handler: any;
    public pfx_overhead: any;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.sound_damage = "Hero_Warlock.FatalBondsDamage";
        this.modifier_bonds = "modifier_imba_fatal_bonds";
        this.modifier_word = "modifier_imba_shadow_word";
        this.ability_word = "imba_warlock_shadow_word";
        this.link_damage_share_pct = this.ability.GetSpecialValueFor("link_damage_share_pct");
        this.golem_link_radius = this.ability.GetSpecialValueFor("golem_link_radius");
        this.golem_link_damage_pct = this.ability.GetSpecialValueFor("golem_link_damage_pct");
        this.link_damage_share_pct = this.link_damage_share_pct + this.caster.GetTalentValue("special_bonus_imba_warlock_3");
        this.golem_link_radius = this.golem_link_radius + this.caster.GetTalentValue("special_bonus_imba_warlock_7");
        if (IsServer()) {
            if (this.caster.HasAbility(this.ability_word)) {
                this.ability_word_handler = this.caster.FindAbilityByName(this.ability_word);
            }
            this.pfx_overhead = ResHelper.CreateParticleEx("particles/units/heroes/hero_warlock/warlock_fatal_bonds_icon.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.parent, this.caster);
        }
    }
    BeDestroy(): void {
        if (this.pfx_overhead) {
            ParticleManager.DestroyParticle(this.pfx_overhead, false);
            ParticleManager.ReleaseParticleIndex(this.pfx_overhead);
        }
        if (!IsServer() || this.GetParentPlus().IsAlive()) {
            return;
        }
        for (const [_, enemy] of GameFunc.iPair(this.bond_table)) {
            if (enemy != this.GetParentPlus()) {
                let bond_modifiers = enemy.FindAllModifiersByName("modifier_imba_fatal_bonds") as modifier_imba_fatal_bonds[];
                for (const modifier of (bond_modifiers)) {
                    for (let num = GameFunc.GetCount((modifier.bond_table)) - 1; num >= 0; num--) {
                        if ((modifier.bond_table)[num] == this.GetParentPlus()) {
                            modifier.bond_table.splice(num, 1);
                            return;
                        }
                    }
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (IsServer() && bit.band(keys.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) != DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION) {
            let unit = keys.unit;
            let original_damage = keys.original_damage;
            let damage_type = keys.damage_type;
            let inflictor = keys.inflictor;
            if (unit == this.GetParentPlus() && this.bond_table) {
                for (const [_, bonded_enemy] of GameFunc.iPair(this.bond_table)) {
                    if (!bonded_enemy.IsNull() && bonded_enemy != this.GetParentPlus()) {
                        let damageTable = {
                            victim: bonded_enemy,
                            damage: keys.original_damage * this.link_damage_share_pct * 0.01,
                            damage_type: keys.damage_type,
                            attacker: this.GetCasterPlus(),
                            ability: this.ability,
                            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION
                        }
                        ApplyDamage(damageTable);
                        let particle_hit_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_warlock/warlock_fatal_bonds_hit.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, this.parent, this.GetCasterPlus());
                        ParticleManager.SetParticleControlEnt(particle_hit_fx, 0, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
                        ParticleManager.SetParticleControlEnt(particle_hit_fx, 1, bonded_enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", bonded_enemy.GetAbsOrigin(), true);
                        ParticleManager.ReleaseParticleIndex(particle_hit_fx);
                        if (this.parent.HasModifier(this.modifier_word) && !bonded_enemy.HasModifier(this.modifier_word)) {
                            if (!this.ability_word_handler) {
                                return undefined;
                            }
                            if (!bonded_enemy.IsMagicImmune()) {
                                let modifier_word_handler = this.parent.FindModifierByName(this.modifier_word);
                                if (modifier_word_handler) {
                                    let duration_remaining = modifier_word_handler.GetRemainingTime();
                                    bonded_enemy.AddNewModifier(this.caster, this.ability_word_handler, this.modifier_word, {
                                        duration: duration_remaining
                                    });
                                }
                            }
                        }
                    }
                }
            } else if (keys.attacker == this.GetParentPlus() && string.find(keys.unit.GetUnitName(), "warlock_golem") && keys.unit.GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
                if ((keys.unit.GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).Length2D() <= this.golem_link_radius) {
                    let damageTable = {
                        victim: this.GetParentPlus(),
                        damage: keys.original_damage * this.golem_link_damage_pct * 0.01,
                        damage_type: keys.damage_type,
                        attacker: this.GetCasterPlus(),
                        ability: this.ability,
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_REFLECTION
                    }
                    ApplyDamage(damageTable);
                    let particle_hit_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_warlock/warlock_fatal_bonds_hit.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, this.parent, this.GetCasterPlus());
                    ParticleManager.SetParticleControlEnt(particle_hit_fx, 0, unit, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", unit.GetAbsOrigin(), true);
                    ParticleManager.SetParticleControlEnt(particle_hit_fx, 1, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
                    ParticleManager.ReleaseParticleIndex(particle_hit_fx);
                    if (!this.ability_word_handler) {
                        return undefined;
                    }
                    if (!this.parent.IsMagicImmune()) {
                        if (unit.HasModifier(this.modifier_word) && !this.parent.HasModifier(this.modifier_word)) {
                            let modifier_word_handler = unit.FindModifierByName(this.modifier_word);
                            if (modifier_word_handler) {
                                let duration_remaining = modifier_word_handler.GetRemainingTime();
                                this.parent.AddNewModifier(this.caster, this.ability_word_handler, this.modifier_word, {
                                    duration: duration_remaining
                                });
                            }
                        }
                    }
                    if (this.parent.HasModifier(this.modifier_word) && !unit.HasModifier(this.modifier_word)) {
                        let modifier_word_handler = this.parent.FindModifierByName(this.modifier_word);
                        if (modifier_word_handler) {
                            let duration_remaining = modifier_word_handler.GetRemainingTime();
                            unit.AddNewModifier(this.caster, this.ability_word_handler, this.modifier_word, {
                                duration: duration_remaining
                            });
                        }
                    }
                }
            }
        }
    }
}
@registerAbility()
export class imba_warlock_shadow_word extends BaseAbility_Plus {
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        return this.GetSpecialValueFor("cast_range");
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetAOERadius(): number {
        let ability = this;
        let radius = ability.GetSpecialValueFor("radius");
        return radius;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let target_point = this.GetCursorPosition();
        let sound_target = "Hero_Warlock.ShadowWord";
        let sound_explosion = "Imba.WarlockShadowWordExplosion";
        let particle_aoe = "particles/hero/warlock/warlock_shadow_word_aoe_a.vpcf";
        let modifier_word = "modifier_imba_shadow_word";
        let radius = ability.GetSpecialValueFor("radius");
        let duration = ability.GetSpecialValueFor("duration");
        duration = duration + caster.GetTalentValue("special_bonus_imba_warlock_5");
        EmitSoundOn(sound_target, caster);
        EmitSoundOnLocationWithCaster(target_point, sound_explosion, caster);
        let particle_aoe_fx = ResHelper.CreateParticleEx(particle_aoe, ParticleAttachment_t.PATTACH_WORLDORIGIN, caster);
        ParticleManager.SetParticleControl(particle_aoe_fx, 0, target_point);
        ParticleManager.SetParticleControl(particle_aoe_fx, 1, Vector(radius, 0, 0));
        ParticleManager.SetParticleControl(particle_aoe_fx, 2, target_point);
        ParticleManager.ReleaseParticleIndex(particle_aoe_fx);
        AddFOWViewer(caster.GetTeamNumber(), target_point, radius, 2, true);
        let units = FindUnitsInRadius(caster.GetTeamNumber(), target_point, undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, unit] of GameFunc.iPair(units)) {
            unit.AddNewModifier(caster, ability, modifier_word, {
                duration: duration
            });
        }
        this.AddTimer(duration, () => {
            StopSoundOn(sound_target, caster);
        });
    }
}
@registerModifier()
export class modifier_imba_shadow_word extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public sound_good: any;
    public sound_bad: any;
    public particle_good: any;
    public particle_bad: any;
    public tick_value: any;
    public golem_bonus_ms_pct: number;
    public golem_bonus_as: number;
    public tick_interval: number;
    public good_guy: any;
    public is_golem: any;
    public particle_good_fx: any;
    public particle_bad_fx: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.sound_good = "Hero_Warlock.ShadowWordCastGood";
        this.sound_bad = "Hero_Warlock.ShadowWordCastBad";
        this.particle_good = "particles/units/heroes/hero_warlock/warlock_shadow_word_buff.vpcf";
        this.particle_bad = "particles/units/heroes/hero_warlock/warlock_shadow_word_debuff.vpcf";
        if (!this.ability) {
            return;
        }
        this.tick_value = this.ability.GetSpecialValueFor("tick_value");
        this.golem_bonus_ms_pct = this.ability.GetSpecialValueFor("golem_bonus_ms_pct");
        this.golem_bonus_as = this.ability.GetSpecialValueFor("golem_bonus_as");
        this.tick_interval = this.ability.GetSpecialValueFor("tick_interval");
        this.golem_bonus_as = this.golem_bonus_as + this.caster.GetTalentValue("special_bonus_imba_warlock_1");
        if (this.parent.GetTeamNumber() == this.caster.GetTeamNumber()) {
            this.good_guy = true;
        } else {
            this.good_guy = false;
        }
        if (this.good_guy && string.find(this.parent.GetUnitName(), "warlock_golem")) {
            this.is_golem = true;
        }
        if (IsServer()) {
            if (this.good_guy) {
                EmitSoundOn(this.sound_good, this.parent);
            } else {
                EmitSoundOn(this.sound_bad, this.parent);
            }
            if (this.good_guy) {
                this.particle_good_fx = ResHelper.CreateParticleEx(this.particle_good, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
                ParticleManager.SetParticleControl(this.particle_good_fx, 0, this.parent.GetAbsOrigin());
                ParticleManager.SetParticleControl(this.particle_good_fx, 2, this.parent.GetAbsOrigin());
                this.AddParticle(this.particle_good_fx, false, false, -1, false, false);
            } else {
                this.particle_bad_fx = ResHelper.CreateParticleEx(this.particle_bad, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
                ParticleManager.SetParticleControl(this.particle_bad_fx, 0, this.parent.GetAbsOrigin());
                ParticleManager.SetParticleControl(this.particle_bad_fx, 2, this.parent.GetAbsOrigin());
                this.AddParticle(this.particle_bad_fx, false, false, -1, false, false);
            }
            this.StartIntervalThink(this.tick_interval);
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IgnoreTenacity() {
        return true;
    }
    IsDebuff(): boolean {
        if (this.good_guy) {
            return false;
        }
        return true;
    }
    OnIntervalThink(): void {
        if (!GFuncEntity.IsValid(this.caster)) {
            this.Destroy();
            return;
        }
        if (this.good_guy) {
            let spell_power = this.caster.GetSpellAmplification(false);
            let heal = this.tick_value * (1 + spell_power * 0.01);
            this.parent.ApplyHeal(heal, this.ability);
        } else {
            let damageTable = {
                victim: this.parent,
                attacker: this.caster,
                damage: this.tick_value,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                ability: this.ability
            }
            ApplyDamage(damageTable);
        }
    }
    BeDestroy(): void {
        if (this.good_guy) {
            StopSoundOn(this.sound_good, this.parent);
        } else {
            StopSoundOn(this.sound_bad, this.parent);
        }
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
        if (!this.is_golem) {
            return undefined;
        }
        return this.golem_bonus_ms_pct;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (!this.is_golem) {
            return undefined;
        }
        return this.golem_bonus_as;
    }
}
@registerAbility()
export class imba_warlock_upheaval extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetChannelTime(): number {
        let caster = this.GetCasterPlus();
        if (caster.HasTalent("special_bonus_imba_warlock_6")) {
            return 0;
        }
        return super.GetChannelTime();
    }
    GetAOERadius(): number {
        let radius = this.GetSpecialValueFor("radius");
        return radius;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target_point = this.GetCursorPosition();
        let cast_response = "warlock_warl_ability_upheav_0" + math.random(1, 4);
        let sound_loop = "Hero_Warlock.Upheaval";
        let modifier_upheaval = "modifier_imba_upheaval";
        if (!caster.HasTalent("special_bonus_imba_warlock_6")) {
            EmitSoundOn(cast_response, caster);
            EmitSoundOn(sound_loop, caster);
            BaseModifier_Plus.CreateBuffThinker(caster, this, modifier_upheaval, {}, target_point, caster.GetTeamNumber(), false);
        } else {
            let playerID = caster.GetPlayerID();
            let demon = BaseNpc_Plus.CreateUnitByName("npc_imba_warlock_upheaval_demon", target_point, caster, true);
            // demon.SetControllableByPlayer(playerID, true);
            demon.AddNewModifier(demon, this, "modifier_kill", {
                duration: 20
            });
            this.AddTimer(FrameTime(), () => {
                ResolveNPCPositions(target_point, 64);
                demon.SetBaseMaxHealth(caster.GetBaseMaxHealth());
                demon.SetMaxHealth(caster.GetMaxHealth());
                demon.SetHealth(demon.GetMaxHealth());
                let ability_demon = demon.findAbliityPlus<imba_warlock_upheaval>("imba_warlock_upheaval");
                ability_demon.SetLevel(this.GetLevel());
                ability_demon.SetActivated(true);
                let queue = false;
                ExecuteOrderFromTable({
                    UnitIndex: demon.GetEntityIndex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    Position: demon.GetAbsOrigin(),
                    AbilityIndex: ability_demon.GetEntityIndex(),
                    Queue: queue
                });
                demon.StartGesture(GameActivity_t.ACT_DOTA_IDLE);
            });
        }
    }
    OnChannelFinish(p_0: boolean,): void {
        let caster = this.GetCasterPlus();
        let sound_loop = "Hero_Warlock.Upheaval";
        let sound_end = "Hero_Warlock.Upheaval.Stop";
        StopSoundOn(sound_loop, caster);
        EmitSoundOn(sound_end, caster);
        if (string.find(caster.GetUnitName(), "npc_imba_warlock_upheaval_demon")) {
            this.AddTimer(2, () => {
                caster.Kill(this, caster);
            });
        }
    }
}
@registerModifier()
export class modifier_imba_upheaval extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public particle_upheaval: any;
    public modifier_debuff: any;
    public modifier_golem_buff: any;
    public radius: number;
    public ms_slow_pct_per_tick: number;
    public linger_duration: number;
    public tick_interval: number;
    public max_slow_pct: number;
    public slow: any;
    public particle_upheaval_fx: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.particle_upheaval = "particles/units/heroes/hero_warlock/warlock_upheaval.vpcf";
        this.modifier_debuff = "modifier_imba_upheaval_debuff";
        this.modifier_golem_buff = "modifier_imba_upheaval_buff";
        this.radius = this.ability.GetSpecialValueFor("radius");
        this.ms_slow_pct_per_tick = this.ability.GetSpecialValueFor("ms_slow_pct_per_tick");
        this.linger_duration = this.ability.GetSpecialValueFor("linger_duration");
        this.tick_interval = this.ability.GetSpecialValueFor("tick_interval");
        this.max_slow_pct = this.ability.GetSpecialValueFor("max_slow_pct");
        this.slow = 0;
        if (IsServer()) {
            this.particle_upheaval_fx = ResHelper.CreateParticleEx(this.particle_upheaval, ParticleAttachment_t.PATTACH_WORLDORIGIN, this.parent);
            ParticleManager.SetParticleControl(this.particle_upheaval_fx, 0, this.parent.GetAbsOrigin());
            ParticleManager.SetParticleControl(this.particle_upheaval_fx, 1, Vector(this.radius, 1, 1));
            this.AddParticle(this.particle_upheaval_fx, false, false, -1, false, false);
            this.StartIntervalThink(this.tick_interval);
        }
    }
    OnIntervalThink(): void {
        if (!this.caster.IsChanneling()) {
            this.Destroy();
            return undefined;
        }
        this.slow = this.slow + (this.ms_slow_pct_per_tick * this.tick_interval);
        if (this.slow > this.max_slow_pct) {
            this.slow = this.max_slow_pct;
        }
        let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            let modifier_debuff_handler = enemy.AddNewModifier(this.caster, this.ability, this.modifier_debuff, {
                duration: this.linger_duration * (1 - enemy.GetStatusResistance())
            }) as modifier_imba_upheaval_debuff;
            if (modifier_debuff_handler) {
                modifier_debuff_handler.slow = this.slow;
            }
        }
        let units = FindUnitsInRadius(this.caster.GetTeamNumber(), this.parent.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, unit] of GameFunc.iPair(units)) {
            if (string.find(unit.GetUnitName(), "warlock_golem")) {
                let modifier_golem_buff_handler = unit.AddNewModifier(this.caster, this.ability, this.modifier_golem_buff, {
                    duration: (this.tick_interval * 2)
                }) as modifier_imba_upheaval_buff;
                if (modifier_golem_buff_handler) {
                    modifier_golem_buff_handler.radius = this.radius;
                    modifier_golem_buff_handler.center = this.parent.GetAbsOrigin();
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_upheaval_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public particle_debuff_hero: any;
    public particle_debuff_creep: any;
    public particle_debuff_hero_fx: any;
    public particle_debuff_creep_fx: any;
    slow: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        this.particle_debuff_hero = "particles/units/heroes/hero_warlock/warlock_upheaval_debuff.vpcf";
        this.particle_debuff_creep = "particles/units/heroes/hero_warlock/warlock_upheaval_debuff_creep.vpcf";
        if (this.parent.IsRealUnit()) {
            this.particle_debuff_hero_fx = ResHelper.CreateParticleEx(this.particle_debuff_hero, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
            ParticleManager.SetParticleControl(this.particle_debuff_hero_fx, 0, this.parent.GetAbsOrigin());
            ParticleManager.SetParticleControl(this.particle_debuff_hero_fx, 1, this.parent.GetAbsOrigin());
            this.AddParticle(this.particle_debuff_hero_fx, false, false, -1, false, false);
        } else {
            this.particle_debuff_creep_fx = ResHelper.CreateParticleEx(this.particle_debuff_creep, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
            ParticleManager.SetParticleControl(this.particle_debuff_creep_fx, 0, this.parent.GetAbsOrigin());
            this.AddParticle(this.particle_debuff_creep_fx, false, false, -1, false, false);
        }
        if (IsServer()) {
            this.StartIntervalThink(0.1);
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
            if (!this.slow) {
                return undefined;
            }
            this.SetStackCount(this.slow);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetStackCount() * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        if (this.caster.HasTalent("special_bonus_imba_warlock_2")) {
            return this.GetStackCount() * (-1);
        }
    }
}
@registerModifier()
export class modifier_imba_upheaval_buff extends BaseModifier_Plus {
    radius: number
    center: Vector
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
export class imba_warlock_rain_of_chaos extends BaseAbility_Plus {


    GetManaCost(level: number): number {
        return 100
    }

    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsNetherWardStealable() {
        return false;
    }
    GetAOERadius(): number {
        let ability = this;
        let radius = ability.GetSpecialValueFor("radius");
        return radius;
    }
    OnAbilityPhaseStart(): boolean {
        let caster = this.GetCasterPlus();
        let ability = this;
        let sound_precast = "Hero_Warlock.RainOfChaos_buildup";
        EmitSoundOn(sound_precast, caster);
        return true;
    }
    OnAbilityPhaseInterrupted(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let sound_precast = "Hero_Warlock.RainOfChaos_buildup";
        StopSoundOn(sound_precast, caster);
    }
    OnSpellStart(): void {
        let cursor_position = this.GetCursorPosition();
        if (this.GetCasterPlus().HasScepter()) {
            for (let golems = 0; golems <= this.GetSpecialValueFor("number_of_golems_scepter") - 1; golems++) {
                this.AddTimer(0.4 * golems, () => {
                    this.SummonGolem(cursor_position, true, false);
                });
            }
        } else {
            this.SummonGolem(cursor_position, false, false);
        }
    }
    SummonGolem(target_point: Vector, bScepter: boolean, bDeath: boolean) {
        EmitSoundOn("Hero_Warlock.RainOfChaos", this.GetCasterPlus());
        let particle_start_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_warlock/warlock_rain_of_chaos_start.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(particle_start_fx, 0, target_point);
        ParticleManager.ReleaseParticleIndex(particle_start_fx);
        let effect_delay = this.GetSpecialValueFor("effect_delay");
        if (bDeath) {
            effect_delay = 0;
        }
        this.AddTimer(effect_delay, () => {
            GridNav.DestroyTreesAroundPoint(target_point, this.GetSpecialValueFor("radius"), false);
            let particle_main_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_warlock/warlock_rain_of_chaos.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
            ParticleManager.SetParticleControl(particle_main_fx, 0, target_point);
            ParticleManager.SetParticleControl(particle_main_fx, 1, Vector(this.GetSpecialValueFor("radius"), 0, 0));
            ParticleManager.ReleaseParticleIndex(particle_main_fx);
            let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), target_point, undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_rain_of_chaos_stun", {
                    duration: this.GetSpecialValueFor("stun_duration") * (1 - enemy.GetStatusResistance())
                });
            }
            let golem = undefined;
            if (!bScepter || bDeath) {
                golem = BaseNpc_Plus.CreateUnitByName("npc_dota_warlock_golem_" + this.GetLevel(), target_point, this.GetCasterPlus(), true);
            } else {
                golem = BaseNpc_Plus.CreateUnitByName("npc_dota_warlock_golem_scepter_" + this.GetLevel(), target_point, this.GetCasterPlus(), true);
            }
            golem.AddNewModifier(this.GetCasterPlus(), this, "modifier_kill", {
                duration: this.GetSpecialValueFor("duration")
            });
            // golem.SetControllableByPlayer(this.GetCasterPlus().GetPlayerID(), true);
            let bonus_hp = this.GetCasterPlus().GetStrength() * this.GetSpecialValueFor("bonus_hp_per_str");
            let bonus_damage = this.GetCasterPlus().GetIntellect() * this.GetSpecialValueFor("bonus_damage_per_int");
            let bonus_armor = this.GetCasterPlus().GetAgility() * this.GetSpecialValueFor("bonus_armor_per_agi");
            let bonus_attack_speed = this.GetCasterPlus().GetAgility() * this.GetSpecialValueFor("bonus_aspeed_per_agi");
            let bonus_move_speed = this.GetCasterPlus().GetMoveSpeedModifier(this.GetCasterPlus().GetBaseMoveSpeed(), false) - this.GetCasterPlus().GetBaseMoveSpeed();
            if (bScepter || bDeath) {
                bonus_hp = bonus_hp * (100 - this.GetSpecialValueFor("hp_dmg_reduction_scepter")) * 0.01;
                bonus_damage = bonus_damage * (100 - this.GetSpecialValueFor("hp_dmg_reduction_scepter")) * 0.01;
                bonus_armor = bonus_armor * (100 - this.GetSpecialValueFor("hp_dmg_reduction_scepter")) * 0.01;
                bonus_attack_speed = bonus_attack_speed * (100 - this.GetSpecialValueFor("hp_dmg_reduction_scepter")) * 0.01;
                bonus_move_speed = bonus_move_speed * (100 - this.GetSpecialValueFor("hp_dmg_reduction_scepter")) * 0.01;
                if (!bDeath) {
                    golem.SetMinimumGoldBounty(golem.GetMinimumGoldBounty() * (100 - this.GetSpecialValueFor("bounty_reduction_scepter")) * 0.01);
                    golem.SetMaximumGoldBounty(golem.GetMaximumGoldBounty() * (100 - this.GetSpecialValueFor("bounty_reduction_scepter")) * 0.01);
                }
            }
            golem.SetBaseMaxHealth(golem.GetBaseMaxHealth() + bonus_hp);
            golem.SetMaxHealth(golem.GetMaxHealth() + bonus_hp);
            golem.SetHealth(golem.GetMaxHealth());
            golem.SetBaseDamageMin(golem.GetBaseDamageMin() + bonus_damage);
            golem.SetBaseDamageMax(golem.GetBaseDamageMax() + bonus_damage);
            golem.SetPhysicalArmorBaseValue(golem.GetPhysicalArmorValue(false) + bonus_armor);
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_warlock_4")) {
                golem.SetPhysicalArmorBaseValue(golem.GetPhysicalArmorValue(false) + this.GetCasterPlus().GetTalentValue("special_bonus_imba_warlock_4"));
            }
            let modifier_attackspeed_handler = golem.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_rain_of_chaos_golem_as", {});
            if (modifier_attackspeed_handler) {
                modifier_attackspeed_handler.SetStackCount(bonus_attack_speed);
            }
            let modifier_movespeed_handler = golem.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_rain_of_chaos_golem_ms", {});
            if (modifier_movespeed_handler) {
                modifier_movespeed_handler.SetStackCount(bonus_move_speed);
            }
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_warlock_8")) {
                let ability_spell_immunity = golem.AddAbility("imba_warlock_golem_spell_immunity") as imba_warlock_golem_spell_immunity;
                ability_spell_immunity.SetLevel(1);
            }
            let ability_fists_handler = golem.findAbliityPlus<imba_warlock_flaming_fists>("imba_warlock_flaming_fists");
            if (ability_fists_handler) {
                ability_fists_handler.SetLevel(this.GetLevel());
            }
            let ability_immolate_handler = golem.findAbliityPlus<imba_warlock_permanent_immolation>("imba_warlock_permanent_immolation");
            if (ability_immolate_handler) {
                ability_immolate_handler.SetLevel(this.GetLevel());
            }
            ResolveNPCPositions(target_point, 128);
        });
    }
    OnOwnerDied(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_warlock_9") && (!this.GetCasterPlus().IsReincarnating || (this.GetCasterPlus().IsReincarnating && !this.GetCasterPlus().IsReincarnating())) && this.IsTrained()) {
            this.SummonGolem(this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus().HasScepter(), true);
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_warlock_chaotic_offering_magic_resistance") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_warlock_chaotic_offering_magic_resistance")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_warlock_chaotic_offering_magic_resistance"), "modifier_special_bonus_imba_warlock_chaotic_offering_magic_resistance", {});
        }
    }
}
@registerModifier()
export class modifier_imba_rain_of_chaos_stun extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        };
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
export class modifier_imba_rain_of_chaos_golem_as extends BaseModifier_Plus {
    public magic_resistance: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (this.GetAbilityPlus() && this.GetCasterPlus() && !this.GetCasterPlus().IsNull() && this.GetCasterPlus().HasTalent("special_bonus_imba_warlock_chaotic_offering_magic_resistance")) {
            this.magic_resistance = 100;
        } else {
            this.magic_resistance = 0;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.GetStackCount();
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.magic_resistance;
    }
}
@registerModifier()
export class modifier_imba_rain_of_chaos_golem_ms extends BaseModifier_Plus {
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
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_rain_of_chaos_demon_link extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public particle_link: any;
    public particle_link_damage: string;
    public scepter_damage_transfer_pct: number;
    public scepter_damage_per_demon_pct: number;
    public scepter_demon_count: number;
    public demon_table: IBaseNpc_Plus[];
    public particle_table: ParticleID[];
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.particle_link = "particles/hero/warlock/warlock_demon_link.vpcf";
        this.particle_link_damage = "particles/hero/warlock/warlock_demon_link_damage.vpcf";
        this.scepter_damage_transfer_pct = this.ability.GetSpecialValueFor("scepter_damage_transfer_pct");
        this.scepter_damage_per_demon_pct = this.ability.GetSpecialValueFor("scepter_damage_per_demon_pct");
        this.scepter_demon_count = this.ability.GetSpecialValueFor("scepter_demon_count");
        this.demon_table = []
        this.particle_table = []
        if (IsServer()) {
            this.AddTimer(FrameTime(), () => {
                if (GameFunc.GetCount(this.demon_table) < this.scepter_demon_count) {
                    return FrameTime();
                } else {
                    for (let i = 0; i < this.scepter_demon_count; i++) {
                        this.particle_table[i] = ResHelper.CreateParticleEx(this.particle_link, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, this.demon_table[i]);
                        ParticleManager.SetParticleControlEnt(this.particle_table[i], 0, this.demon_table[i], ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.demon_table[i].GetAbsOrigin(), true);
                        ParticleManager.SetParticleControlEnt(this.particle_table[i], 1, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
                    }
                    if (this && !this.IsNull()) {
                        this.SetStackCount(this.scepter_demon_count);
                        this.StartIntervalThink(FrameTime());
                    }
                }
            });
        }
    }
    OnIntervalThink(): void {
        for (let i = 0; i < GameFunc.GetCount(this.demon_table); i++) {
            if (!this.parent.IsNull() && this.parent.GetAbsOrigin && !this.demon_table[i].IsNull() && this.demon_table[i].GetAbsOrigin) {
                let direction = (this.parent.GetAbsOrigin() - this.demon_table[i].GetAbsOrigin() as Vector).Normalized();
                this.demon_table[i].SetForwardVector(direction);
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE,
            3: Enum_MODIFIER_EVENT.ON_DEATH,
            4: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        for (let i = 0; i < GameFunc.GetCount(this.demon_table); i++) {
            if (!this.demon_table[i] || !this.demon_table[i].IsAlive()) {
                return 0;
            }
        }
        return -100;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.GetStackCount() * this.scepter_damage_per_demon_pct;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            let unit = keys.unit;
            let damage = keys.original_damage;
            let attacker = keys.attacker;
            let damage_type = keys.damage_type;
            if (unit == this.parent) {
                let chosen_demon = math.random(1, GameFunc.GetCount(this.demon_table));
                let particle_link_damage_fx = ResHelper.CreateParticleEx(this.particle_link_damage, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, this.parent);
                ParticleManager.SetParticleControlEnt(particle_link_damage_fx, 0, this.parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.parent.GetAbsOrigin(), true);
                if (!this.demon_table[chosen_demon].IsNull()) {
                    ParticleManager.SetParticleControlEnt(particle_link_damage_fx, 1, this.demon_table[chosen_demon], ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.demon_table[chosen_demon].GetAbsOrigin(), true);
                }
                this.AddTimer(0.5, () => {
                    ParticleManager.DestroyParticle(particle_link_damage_fx, false);
                    ParticleManager.ReleaseParticleIndex(particle_link_damage_fx);
                });
                damage = damage * this.scepter_damage_transfer_pct * 0.01;
                let damageTable = {
                    victim: this.demon_table[chosen_demon],
                    attacker: attacker,
                    damage: damage,
                    damage_type: damage_type
                }
                ApplyDamage(damageTable);
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            let unit = keys.unit;
            for (let [i, v] of GameFunc.iPair(this.demon_table)) {
                if (unit == this.demon_table[i]) {
                    this.DecrementStackCount();
                    if (!this.particle_table[i]) {
                        return;
                    }
                    ParticleManager.DestroyParticle(this.particle_table[i], false);
                    ParticleManager.ReleaseParticleIndex(this.particle_table[i]);
                    this.demon_table.splice(i, 1)
                    this.particle_table.splice(i, 1)
                }
                if (GameFunc.GetCount(this.demon_table) == 0) {
                    this.Destroy();
                }
            }
        }
    }
    BeRemoved(): void {
        for (let i = 0; i < GameFunc.GetCount(this.demon_table); i++) {
            if (this.particle_table[i]) {
                this.demon_table[i].Kill(this.ability, this.caster);
                ParticleManager.DestroyParticle(this.particle_table[i], false);
                ParticleManager.ReleaseParticleIndex(this.particle_table[i]);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_rain_of_chaos_demon_visible extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.StartIntervalThink(1);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (!this.GetCasterPlus().IsAlive()) {
            this.GetParentPlus().ForceKill(false);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
    CC_GetModifierProvidesFOWVision(): 0 | 1 {
        return 1;
    }
}
@registerAbility()
export class imba_warlock_flaming_fists extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "warlock_golem_flaming_fists";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_flaming_fists";
    }
}
@registerModifier()
export class modifier_imba_flaming_fists extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public modifier_upheaval: any;
    public particle_burn: any;
    public damage: number;
    public radius: number;
    public particle_burn_fx: any;
    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.modifier_upheaval = "modifier_imba_upheaval_buff";
        this.particle_burn = "particles/hero/warlock/warlock_upheaval_golem_burn.vpcf";
        this.damage = this.ability.GetSpecialValueFor("damage");
        this.radius = this.ability.GetSpecialValueFor("radius");
    }

    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PURE,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PURE)
    CC_GetModifierProcAttack_BonusDamage_Pure(keys: ModifierAttackEvent): number {
        let target = keys.target;
        if (!target.IsRealUnit() && !target.IsCreep()) {
            return undefined;
        }
        if (this.caster.PassivesDisabled()) {
            return undefined;
        }
        return this.damage;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let target = keys.target;
            let attacker = keys.attacker;
            if (this.caster == attacker) {
                if (!target.IsRealUnit() && !target.IsCreep()) {
                    return undefined;
                }
                if (this.caster.PassivesDisabled()) {
                    return undefined;
                }
                let radius = this.radius;
                if (this.caster.HasModifier(this.modifier_upheaval)) {
                    let modifier_upheaval_handler = this.caster.FindModifierByName(this.modifier_upheaval) as modifier_imba_upheaval_buff;
                    if (modifier_upheaval_handler && modifier_upheaval_handler.radius && modifier_upheaval_handler.center) {
                        radius = modifier_upheaval_handler.radius;
                        this.particle_burn_fx = ResHelper.CreateParticleEx(this.particle_burn, ParticleAttachment_t.PATTACH_WORLDORIGIN, this.caster);
                        ParticleManager.SetParticleControl(this.particle_burn_fx, 0, modifier_upheaval_handler.center);
                        ParticleManager.SetParticleControl(this.particle_burn_fx, 1, Vector(radius, 0, 0));
                        ParticleManager.ReleaseParticleIndex(this.particle_burn_fx);
                    }
                }
                let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    if (enemy != target) {
                        let damageTable = {
                            victim: enemy,
                            attacker: this.caster,
                            damage: this.damage,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                            ability: this.ability
                        }
                        ApplyDamage(damageTable);
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
}
@registerAbility()
export class imba_warlock_permanent_immolation extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_permanent_immolation_aura";
    }
    GetAbilityTextureName(): string {
        return "warlock_golem_permanent_immolation";
    }
}
@registerModifier()
export class modifier_imba_permanent_immolation_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public modifier_burn: any;
    public modifier_upheaval: any;
    public modifier_upheaval_debuff: any;
    public particle_burn: any;
    public radius: number;
    public actual_radius: number;
    public particle_burn_fx: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.modifier_burn = "modifier_imba_permanent_immolation_debuff";
        this.modifier_upheaval = "modifier_imba_upheaval_buff";
        this.modifier_upheaval_debuff = "modifier_imba_upheaval_debuff";
        this.particle_burn = "particles/hero/warlock/warlock_upheaval_golem_burn.vpcf";
        this.radius = this.ability.GetSpecialValueFor("radius");
        this.actual_radius = this.radius;
        if (IsServer()) {
            this.StartIntervalThink(this.GetSpecialValueFor("burn_interval"));
        }
    }
    OnIntervalThink(): void {
        if (this.caster.HasModifier(this.modifier_upheaval)) {
            let modifier_upheaval_handler = this.caster.FindModifierByName(this.modifier_upheaval) as modifier_imba_upheaval_buff;
            if (modifier_upheaval_handler && modifier_upheaval_handler.radius && modifier_upheaval_handler.center) {
                this.actual_radius = modifier_upheaval_handler.radius * 2;
                this.particle_burn_fx = ResHelper.CreateParticleEx(this.particle_burn, ParticleAttachment_t.PATTACH_WORLDORIGIN, this.caster);
                ParticleManager.SetParticleControl(this.particle_burn_fx, 0, modifier_upheaval_handler.center);
                ParticleManager.SetParticleControl(this.particle_burn_fx, 1, Vector(modifier_upheaval_handler.radius, 0, 0));
                ParticleManager.ReleaseParticleIndex(this.particle_burn_fx);
            }
        } else {
            this.actual_radius = this.radius;
        }
        let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.actual_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (enemy.HasModifier(this.modifier_burn)) {
                ApplyDamage({
                    victim: enemy,
                    attacker: this.caster,
                    damage: this.GetSpecialValueFor("damage"),
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    ability: this.ability
                });
            }
        }
    }
    GetAuraRadius(): number {
        return this.actual_radius;
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
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        if (this.caster.HasModifier(this.modifier_upheaval) && target.HasModifier(this.modifier_upheaval_debuff)) {
            return false;
        }
        if ((this.caster.GetAbsOrigin() - target.GetAbsOrigin() as Vector).Length2D() > this.radius) {
            return true;
        }
        return false;
    }
    GetModifierAura(): string {
        return "modifier_imba_permanent_immolation_debuff";
    }
    IsAura(): boolean {
        if (this.GetCasterPlus().PassivesDisabled()) {
            return false;
        }
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
}
@registerModifier()
export class modifier_imba_permanent_immolation_debuff extends BaseModifier_Plus {
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
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
}
@registerAbility()
export class imba_warlock_golem_spell_immunity extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "neutral_spell_immunity";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_golem_spell_immunity";
    }
}
@registerModifier()
export class modifier_imba_golem_spell_immunity extends BaseModifier_Plus {
    GetEffectName(): string {
        return "particles/items_fx/black_king_bar_avatar.vpcf";
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
        };
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
export class modifier_special_bonus_imba_warlock_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_warlock_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_warlock_9 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_warlock_5 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_warlock_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_warlock_chaotic_offering_magic_resistance extends BaseModifier_Plus {
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
