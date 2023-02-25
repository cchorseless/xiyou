
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_antimage_mana_break extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "antimage_mana_break";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_mana_break_passive";
    }
}
@registerModifier()
export class modifier_imba_mana_break_passive extends BaseModifier_Plus {
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public particle_blast: any;
    public sound_blast: any;
    public particle_aoe_mana_burn: any;
    public damage_per_burn: number;
    public base_mana_burn: any;
    public threshold_difference: any;
    public blast_aoe: any;
    public max_mana_blast: any;
    public illusions_efficiency_pct: number;
    public mana_percentage: any;
    public mana_phase: any;
    public add_damage: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_START,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            3: GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE
        });
    } */
    Init(p_0: any,): void {
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.particle_blast = "particles/units/heroes/hero_antimage/antimage_manabreak_slow.vpcf";
        this.sound_blast = "tutorial_smallfence_smash";
        this.particle_aoe_mana_burn = "particles/econ/items/antimage/antimage_weapon_basher_ti5/am_manaburn_basher_ti_5.vpcf";
        this.damage_per_burn = this.ability.GetSpecialValueFor("damage_per_burn");
        this.base_mana_burn = this.ability.GetSpecialValueFor("base_mana_burn");
        this.threshold_difference = this.ability.GetSpecialValueFor("threshold_difference");
        this.blast_aoe = this.ability.GetSpecialValueFor("blast_aoe");
        this.max_mana_blast = this.ability.GetSpecialValueFor("max_mana_blast");
        this.illusions_efficiency_pct = this.ability.GetSpecialValueFor("illusions_efficiency_pct");
        if (IsServer()) {


        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    CC_OnAttackStart(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            let target = keys.target;
            if (attacker.PassivesDisabled()) {
                return;
            }
            if (!target.IsBaseNPC()) {
                return;
            }
            if (target.GetMaxMana() == 0 || target.IsMagicImmune()) {
                return;
            }
            if (this.parent == attacker && target.GetTeamNumber() != this.parent.GetTeamNumber()) {
                let target_mana_burn = target.GetMana();
                if ((target_mana_burn > this.base_mana_burn + (target.GetMaxMana() * this.GetSpecialValueFor("mana_per_hit_pct") * 0.01))) {
                    target_mana_burn = this.base_mana_burn + (target.GetMaxMana() * this.GetSpecialValueFor("mana_per_hit_pct") * 0.01);
                }
                if (this.GetParentPlus().IsIllusion()) {
                    target_mana_burn = target_mana_burn * this.GetSpecialValueFor("illusion_percentage") * 0.01;
                }
                this.mana_percentage = target.GetManaPercent();
                this.mana_phase = math.ceil(this.mana_percentage / this.threshold_difference);
                this.add_damage = target_mana_burn * this.damage_per_burn;
                if (attacker.HasTalent("special_bonus_imba_antimage_4")) {
                    this.add_damage = this.add_damage + (((target.GetMaxMana() - target.GetMana() + target_mana_burn) * ((attacker.GetTalentValue("special_bonus_imba_antimage_4")) / 100)) * this.damage_per_burn);
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = keys.attacker;
            let target = keys.target;
            if (attacker.PassivesDisabled()) {
                return undefined;
            }
            if (target.GetMaxMana() == 0 || target.IsMagicImmune()) {
                return undefined;
            }
            if (this.parent == attacker && target.GetTeamNumber() != this.parent.GetTeamNumber()) {
                target.EmitSound("Hero_Antimage.ManaBreak");
                let manaburn_pfx = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_manaburn.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, target);
                ParticleManager.SetParticleControl(manaburn_pfx, 0, target.GetAbsOrigin());
                ParticleManager.ReleaseParticleIndex(manaburn_pfx);
                let target_mana_burn = target.GetMana();
                if ((target_mana_burn > this.base_mana_burn + (target.GetMaxMana() * this.GetSpecialValueFor("mana_per_hit_pct") * 0.01))) {
                    target_mana_burn = this.base_mana_burn + (target.GetMaxMana() * this.GetSpecialValueFor("mana_per_hit_pct") * 0.01);
                }
                if (this.GetParentPlus().IsIllusion()) {
                    target_mana_burn = target_mana_burn * this.GetSpecialValueFor("illusion_percentage") * 0.01;
                }
                target.ReduceMana(target_mana_burn);
                SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_MANA_LOSS, target, target_mana_burn, undefined);
                if (target.IsMagicImmune()) {
                    return undefined;
                }
                let current_mana_percentage = target.GetManaPercent();
                let current_mana_phase = math.ceil(current_mana_percentage / this.threshold_difference);
                if (current_mana_phase < this.mana_phase || current_mana_phase == 0) {
                    let particle_blast_fx = ResHelper.CreateParticleEx(this.particle_blast, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, target);
                    ParticleManager.SetParticleControlEnt(particle_blast_fx, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                    ParticleManager.ReleaseParticleIndex(particle_blast_fx);
                    let blast_damage = target.GetMaxMana() * this.max_mana_blast * 0.01;
                    let enemies = FindUnitsInRadius(attacker.GetTeamNumber(), target.GetAbsOrigin(), undefined, this.blast_aoe, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                    if (this.parent.IsIllusion()) {
                        blast_damage = blast_damage * this.illusions_efficiency_pct * 0.01;
                    }
                    for (const [_, enemy] of ipairs(enemies)) {
                        if (!enemy.IsMagicImmune()) {
                            let damageTable = {
                                victim: enemy,
                                damage: blast_damage,
                                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                                attacker: attacker,
                                ability: this.ability
                            }
                            ApplyDamage(damageTable);
                        }
                    }
                    EmitSoundOnLocationWithCaster(target.GetAbsOrigin(), this.sound_blast, this.parent);
                }
                if (this.parent.HasTalent("special_bonus_imba_antimage_7")) {
                    let mana_burn_aoe = this.parent.GetTalentValue("special_bonus_imba_antimage_7", "mana_burn_aoe");
                    let mana_burn_pct = this.parent.GetTalentValue("special_bonus_imba_antimage_7", "mana_burn_pct");
                    let particle_aoe_mana_burn_fx = ResHelper.CreateParticleEx(this.particle_aoe_mana_burn, ParticleAttachment_t.PATTACH_ABSORIGIN, this.parent);
                    ParticleManager.SetParticleControl(particle_aoe_mana_burn_fx, 0, target.GetAbsOrigin());
                    ParticleManager.ReleaseParticleIndex(particle_aoe_mana_burn_fx);
                    let mana_aoe_break = target_mana_burn * mana_burn_pct * 0.01;
                    let enemies = FindUnitsInRadius(this.parent.GetTeamNumber(), target.GetAbsOrigin(), undefined, mana_burn_aoe, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                    for (const [_, enemy] of ipairs(enemies)) {
                        if (enemy != target && !enemy.IsMagicImmune()) {
                            enemy.ReduceMana(mana_aoe_break);
                            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_MANA_LOSS, enemy, mana_aoe_break, undefined);
                        }
                    }
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    CC_GetModifierBaseAttack_BonusDamage( /** params */): number {
        if (IsServer()) {
            return this.add_damage;
        }
    }
}
@registerAbility()
export class imba_antimage_blink extends BaseAbility_Plus {
    public cast_point: any;
    public blink_range: number;
    public percent_mana_burn: any;
    public percent_damage: number;
    public radius: number;
    public this_enemy_damage: number;
    GetAbilityTextureName(): string {
        return "antimage_blink";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_antimage_blink_charges";
    }
    IsNetherWardStealable() {
        return false;
    }
    OnAbilityPhaseStart(): boolean {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if ((caster.HasTalent("special_bonus_imba_antimage_3")) && (!this.cast_point)) {
                this.cast_point = true;
                let cast_point = this.GetCastPoint();
                cast_point = cast_point - caster.GetTalentValue("special_bonus_imba_antimage_3");
                this.SetOverrideCastPoint(cast_point);
            }
            return true;
        }
    }
    GetCooldown(nLevel: number): number {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_antimage_1")) {
            return 0;
        }
        return super.GetCooldown(nLevel) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_antimage_10");
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (IsClient()) {
            return this.GetTalentSpecialValueFor("blink_range") + this.GetCasterPlus().GetCastRangeBonus();
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let caster_position = caster.GetAbsOrigin();
            let target_point = this.GetCursorPosition();
            let modifier_spell_immunity = "modifier_imba_antimage_blink_spell_immunity";
            let distance = target_point - caster_position as Vector;
            this.blink_range = this.GetTalentSpecialValueFor("blink_range");
            this.percent_mana_burn = this.GetSpecialValueFor("percent_mana_burn");
            this.percent_damage = this.GetSpecialValueFor("percent_damage");
            this.radius = this.GetSpecialValueFor("radius");
            let mana_burn_limit = this.GetSpecialValueFor("mana_burn_limit");
            if (caster.HasTalent("special_bonus_imba_antimage_1")) {
                let modifier_blink_charges_handler = caster.findBuff<modifier_imba_antimage_blink_charges>("modifier_imba_antimage_blink_charges");
                if (modifier_blink_charges_handler) {
                    modifier_blink_charges_handler.DecrementStackCount();
                }
            }
            if (distance.Length2D() > this.blink_range) {
                target_point = (caster_position + GameFunc.AsVector(target_point - caster_position).Normalized() * this.blink_range) as Vector;
            }
            ProjectileManager.ProjectileDodge(caster);
            let blink_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_antimage/antimage_blink_start.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.ReleaseParticleIndex(blink_pfx);
            caster.EmitSound("Hero_Antimage.Blink_out");
            if (caster.HasTalent("special_bonus_imba_antimage_5")) {
                let immunity_duration = caster.GetTalentValue("special_bonus_imba_antimage_5");
                caster.AddNewModifier(caster, this, modifier_spell_immunity, {
                    duration: immunity_duration
                });
            }
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_antimage_9")) {
                let illusions = this.GetCasterPlus().CreateIllusion(this.GetCasterPlus(),
                    {
                        outgoing_damage: this.GetTalentValue("special_bonus_imba_antimage_9", "outgoing_damage"),
                        incoming_damage: this.GetTalentValue("special_bonus_imba_antimage_9", "incoming_damage"),
                        duration: this.GetTalentValue("special_bonus_imba_antimage_9", "illusion_duration")
                    });

                for (const [_, illusion] of ipairs(illusions)) {
                    illusion.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_antimage_blink_command_restricted", {});
                    //  英雄选取
                    // this.AddTimer(FrameTime(),
                    //     () => {
                    //     PlayerResource.RemoveFromSelection(this.GetCasterPlus().GetPlayerID(), illusion);
                    // });
                }
            }
            this.AddTimer(0.01, () => {
                caster.SetAbsOrigin(target_point);
                FindClearSpaceForUnit(caster, target_point, true);
                let blink_end_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_antimage/antimage_blink_end.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
                ParticleManager.ReleaseParticleIndex(blink_end_pfx);
                caster.EmitSound("Hero_Antimage.Blink_in");
                if (!(this.percent_mana_burn == 0)) {
                    let mananova_pfx = ResHelper.CreateParticleEx("particles/hero/antimage/blink_manaburn_basher_ti_5.vpcf", ParticleAttachment_t.PATTACH_POINT, caster);
                    ParticleManager.SetParticleControl(mananova_pfx, 0, caster.GetAbsOrigin());
                    ParticleManager.SetParticleControl(mananova_pfx, 1, Vector((this.radius * 2), 1, 1));
                    ParticleManager.ReleaseParticleIndex(mananova_pfx);
                    let nearby_enemies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                    for (const [_, enemy] of ipairs(nearby_enemies)) {
                        let mana_burn = enemy.GetMana() * (this.percent_mana_burn * 0.01);
                        if (mana_burn > 0) {
                            let this_enemy_damage = mana_burn * (this.percent_damage * 0.01);
                            if (this_enemy_damage > mana_burn_limit) {
                                this_enemy_damage = mana_burn_limit;
                            }
                            let manaburn_pfx = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_manaburn.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy);
                            ParticleManager.SetParticleControl(manaburn_pfx, 0, enemy.GetAbsOrigin());
                            ParticleManager.ReleaseParticleIndex(manaburn_pfx);
                            let damageTable = {
                                victim: enemy,
                                damage: this_enemy_damage,
                                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                                attacker: caster,
                                ability: this
                            }
                            ApplyDamage(damageTable);
                            enemy.ReduceMana(mana_burn);
                            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_MANA_LOSS, enemy, mana_burn, undefined);
                        }
                    }
                }
            });
        }
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_antimage_10") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_antimage_10")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_antimage_10"), "modifier_special_bonus_imba_antimage_10", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_antimage_blink_range") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_antimage_blink_range")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_antimage_blink_range"), "modifier_special_bonus_imba_antimage_blink_range", {});
        }
    }
}
@registerModifier()
export class modifier_imba_antimage_blink_charges extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public modifier_charge: any;
    public max_charge_count: number;
    public charge_replenish_rate: any;
    // public modifier_charge_handler: any;
    public turned_on: any;
    IsHidden(): boolean {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_antimage_1")) {
            return false;
        }
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.max_charge_count = this.caster.GetTalentValue("special_bonus_imba_antimage_1");
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            if (this.caster.IsIllusion()) {
                return;
            }
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.modifier_charge = "modifier_imba_antimage_blink_charges";
            this.charge_replenish_rate = this.ability.GetCooldown(this.ability.GetLevel() - 1);
            this.SetStackCount(this.max_charge_count);

            if (this.caster.IsRealHero()) {
                // this.SetStackCount(this.max_charge_count);
            }
            else {
                // let playerid = this.caster.GetPlayerID();
                // let real_hero = playerid.GetAssignedHero();
                // if (hero.HasModifier(this.modifier_charge)) {
                //     this.modifier_charge_handler = hero.findBuff<modifier_imba_antimage_blink_charges>(this.modifier_charge);
                //     if (this.modifier_charge_handler) {
                //         this.SetStackCount(this.modifier_charge_handler.GetStackCount());
                //         this.SetDuration(this.modifier_charge_handler.GetRemainingTime(), true);
                //     }
                // }
            }
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (!this.caster.HasTalent("special_bonus_imba_antimage_1")) {
                return;
            }
            if (!this.turned_on) {
                this.turned_on = true;
                this.BeCreated({});
            }
            let stacks = this.GetStackCount();
            if (stacks > 0) {
                this.ability.SetActivated(true);
            } else {
                this.ability.SetActivated(false);
            }
            if (stacks == this.max_charge_count) {
                return;
            }
            if (this.GetRemainingTime() < 0) {
                this.IncrementStackCount();
            }
        }
    }
    OnStackCountChanged(old_stack_count: number): void {
        if (IsServer()) {
            if (!this.turned_on) {
                return undefined;
            }
            let stacks = this.GetStackCount();
            let true_replenish_cooldown = this.charge_replenish_rate;
            if (stacks == 0) {
                this.ability.EndCooldown();
                this.ability.StartCooldown(this.GetRemainingTime());
            }
            if (stacks == 1 && !this.ability.IsCooldownReady()) {
                this.ability.EndCooldown();
            }
            let lost_stack;
            if (old_stack_count > stacks) {
                lost_stack = true;
            } else {
                lost_stack = false;
            }
            if (!lost_stack) {
                if (stacks < this.max_charge_count) {
                    this.SetDuration(true_replenish_cooldown, true);
                } else {
                    this.SetDuration(-1, true);
                }
            } else {
                if (old_stack_count == this.max_charge_count) {
                    this.SetDuration(true_replenish_cooldown, true);
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(keys: ModifierAbilityEvent): void {
        if (IsServer()) {
            let ability = keys.ability;
            let unit = keys.unit;
            if (unit == this.caster && ability.GetName() == "item_refresher") {
                this.SetStackCount(this.max_charge_count);
            }
        }
    }
    DestroyOnExpire(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_antimage_blink_spell_immunity extends BaseModifier_Plus {
    BeCreated(p_0: any,): void {
        this.GetParentPlus().Purge(false, true, false, false, false);
    }
    GetEffectName(): string {
        return "particles/hero/antimage/blink_spellguard_immunity.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
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
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
        }
        return state;
    }
}
@registerModifier()
export class modifier_imba_antimage_blink_command_restricted extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_IGNORING_MOVE_AND_ATTACK_ORDERS]: true
        };
    }
}
@registerAbility()
export class imba_antimage_spell_shield extends BaseAbility_Plus {
    public duration: number;
    GetAbilityTextureName(): string {
        return "antimage_spell_shield";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_antimage_2")) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_PSEUDO_QUEUE;
        }
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this;
            let active_modifier = "modifier_item_imba_lotus_orb_active";
            this.duration = ability.GetSpecialValueFor("active_duration");
            caster.AddNewModifier(caster, ability, active_modifier, {
                duration: this.duration,
                shield_pfx: "particles/units/heroes/hero_antimage/antimage_counter.vpcf",
                reflect_pfx: "particles/units/heroes/hero_antimage/antimage_spellshield.vpcf",
                cast_sound: "Hero_Antimage.Counterspell.Cast",
                absorb: true
            });
            let shield_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_antimage/antimage_blink_end_glow.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
            ParticleManager.ReleaseParticleIndex(shield_pfx);
            caster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_3);
            if (this.GetCasterPlus().IsRealHero() && this.GetCasterPlus().HasScepter()) {
                for (const [_, unit] of ipairs(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_ANY_ORDER, false))) {
                    if (unit.GetPlayerOwnerID() == this.GetCasterPlus().GetPlayerOwnerID() && unit.IsIllusion() && unit.HasAbility("imba_antimage_spell_shield") && unit.HasModifier("modifier_imba_antimage_blink_command_restricted")) {
                        unit.findAbliityPlus<imba_antimage_spell_shield>("imba_antimage_spell_shield").OnSpellStart();
                    }
                }
            }
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_spell_shield_buff_passive";
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnOwnerSpawned(): void {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_antimage_11") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_antimage_11")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_antimage_11"), "modifier_special_bonus_imba_antimage_11", {});
        }
    }
}
@registerModifier()
export class modifier_imba_spell_shield_buff_passive extends BaseModifier_Plus {
    public duration: number;
    public spellshield_max_distance: number;
    public internal_cooldown: number;
    public modifier_ready: any;
    public modifier_recharge: any;
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS
        });
    } */
    Init(p_0: any,): void {
        if (IsServer()) {
            this.duration = this.GetSpecialValueFor("active_duration");
            this.spellshield_max_distance = this.GetSpecialValueFor("spellshield_max_distance");
            this.internal_cooldown = this.GetSpecialValueFor("internal_cooldown");
            this.modifier_ready = "modifier_imba_spellshield_scepter_ready";
            this.modifier_recharge = "modifier_imba_spellshield_scepter_recharge";
            if (!this.GetParentPlus().HasModifier(this.modifier_ready)) {
                this.GetParentPlus().AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), this.modifier_ready, {});
            }
            this.GetParentPlus().TempData().tOldSpells = []
            this.StartIntervalThink(FrameTime());
        }
    }
    OnIntervalThink(): void {
        // 不清楚？？
        let tOldSpells = this.GetParentPlus().TempData<IBaseAbility_Plus[]>().tOldSpells;
        if (!tOldSpells) return;
        for (let len = tOldSpells.length, i = len - 1; i >= 0; i--) {
            let hSpell = tOldSpells[i];
            if (hSpell.NumModifiersUsingAbility() == 0 && !hSpell.IsChanneling()) {
                hSpell.RemoveSelf();
                tOldSpells.splice(i, 1);
            }
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(params: ModifierAttackEvent): number {
        if (!this.GetParentPlus().PassivesDisabled()) {
            return this.GetAbilityPlus().GetTalentSpecialValueFor("magic_resistance");
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (this.GetParentPlus().HasModifier(this.modifier_ready)) {
                this.GetParentPlus().RemoveModifierByName(this.modifier_ready);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_spellshield_scepter_ready extends BaseModifier_Plus {
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
}
@registerModifier()
export class modifier_imba_spellshield_scepter_recharge extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerAbility()
export class imba_antimage_mana_void extends BaseAbility_Plus {
    public this_enemy_damage: number;
    OnAbilityPhaseStart(): boolean {
        if (IsServer()) {
            this.GetCasterPlus().EmitSound("Hero_Antimage.ManaVoidCast");
            return true;
        }
    }
    GetCooldown(nLevel: number): number {
        let cooldown = super.GetCooldown(nLevel);
        let caster = this.GetCasterPlus();
        return cooldown;
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("mana_void_aoe_radius");
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            let ability = this;
            let modifier_ministun = "modifier_imba_mana_void_stunned";
            let modifier_delay = "modifier_imba_mana_void_delay_counter";
            let damage_per_mana = ability.GetSpecialValueFor("mana_void_damage_per_mana");
            let radius = ability.GetSpecialValueFor("mana_void_aoe_radius");
            let mana_burn_pct = ability.GetSpecialValueFor("mana_void_mana_burn_pct");
            let mana_void_ministun = ability.GetSpecialValueFor("mana_void_ministun");
            let damage = 0;
            if (caster.HasScepter()) {
                mana_void_ministun = ability.GetSpecialValueFor("scepter_ministun");
            }
            if (target.GetTeam() != caster.GetTeam()) {
                if (target.TriggerSpellAbsorb(ability)) {
                    return undefined;
                }
            }
            let time_to_wait = 0;
            if (caster.HasTalent("special_bonus_imba_antimage_6")) {
                time_to_wait = caster.GetTalentValue("special_bonus_imba_antimage_6", "delay_duration");
                target.AddNewModifier(caster, ability, modifier_delay, {
                    duration: time_to_wait + 0.2
                });
            }
            this.AddTimer(time_to_wait, () => {
                let target_mana_burn = target.GetMaxMana() * mana_burn_pct / 100;
                target.ReduceMana(target_mana_burn);
                target.AddNewModifier(caster, ability, modifier_ministun, {
                    duration: mana_void_ministun
                });
                let nearby_enemies = FindUnitsInRadius(caster.GetTeamNumber(), target.GetAbsOrigin(), undefined, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of ipairs(nearby_enemies)) {
                    let this_enemy_damage = 0;
                    if ((caster.HasTalent("special_bonus_imba_antimage_8")) || (enemy == target)) {
                        this_enemy_damage = (enemy.GetMaxMana() - enemy.GetMana()) * damage_per_mana;
                    }
                    damage = damage + this_enemy_damage;
                }
                if (caster.HasTalent("special_bonus_imba_antimage_6")) {
                    let modifier_delay_handler = target.FindModifierByName(modifier_delay);
                    if (modifier_delay_handler) {
                        damage = damage + modifier_delay_handler.GetStackCount();
                        modifier_delay_handler.Destroy();
                    }
                }
                for (const [_, enemy] of ipairs(nearby_enemies)) {
                    if (caster.HasScepter() && enemy.IsHero()) {
                        enemy.AddNewModifier(caster, this, "modifier_imba_mana_void_scepter", {});
                        this.AddTimer(mana_void_ministun, () => {
                            if (enemy.IsAlive()) {
                                enemy.RemoveModifierByName("modifier_imba_mana_void_scepter");
                            }
                        });
                    }
                    ApplyDamage({
                        attacker: caster,
                        victim: enemy,
                        ability: ability,
                        damage: damage,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE
                    });
                    SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, enemy, damage, undefined);
                }
                ScreenShake(target.GetOrigin(), 10, 0.1, 1, 500, 0, true);
                let void_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_antimage/antimage_manavoid.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, target);
                ParticleManager.SetParticleControlEnt(void_pfx, 0, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetOrigin(), true);
                ParticleManager.SetParticleControl(void_pfx, 1, Vector(radius, 0, 0));
                ParticleManager.ReleaseParticleIndex(void_pfx);
                target.EmitSound("Hero_Antimage.ManaVoid");
            });
        }
    }
}
@registerModifier()
export class modifier_imba_mana_void_scepter extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_RESPAWN
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_RESPAWN)
    CC_OnRespawn(kv: ModifierUnitEvent): void {
        let affected_ability = this.GetParentPlus().FindAbilityWithHighestCooldown();
        if (kv.unit == this.GetParentPlus() && affected_ability) {
            affected_ability.StartCooldown(affected_ability.GetCooldownTimeRemaining() + this.GetSpecialValueFor("scepter_cooldown_increase"));
        }
        this.Destroy();
    }
}
@registerModifier()
export class modifier_imba_mana_void_stunned extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
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
@registerModifier()
export class modifier_imba_mana_void_delay_counter extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public mana_point_worth: any;
    public particle_bubble: any;
    public target_mana: any;
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        if (this.caster.IsIllusion()) {
            return;
        }
        this.parent = this.GetParentPlus();
        this.mana_point_worth = this.caster.GetTalentValue("special_bonus_imba_antimage_6", "mana_point_worth");
        this.particle_bubble = "particles/hero/antimage/mana_void_delay_bubble.vpcf";
        let particle_bubble_fx = ResHelper.CreateParticleEx(this.particle_bubble, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
        ParticleManager.SetParticleControl(particle_bubble_fx, 0, this.parent.GetAbsOrigin());
        this.AddParticle(particle_bubble_fx, false, false, -1, false, false);
        this.target_mana = this.parent.GetMana();
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        let mana_difference = this.target_mana - this.parent.GetMana();
        this.target_mana = this.parent.GetMana();
        if (mana_difference <= 0) {
            return undefined;
        }
        let stacks = this.GetStackCount();
        let stack_to_add = mana_difference * this.mana_point_worth;
        this.SetStackCount(this.GetStackCount() + stack_to_add);
    }
}
@registerModifier()
export class modifier_special_bonus_imba_antimage_8 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_antimage_9 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_antimage_10 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_antimage_11 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_antimage_blink_range extends BaseModifier_Plus {
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
