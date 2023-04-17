
import { GameFunc } from "../../../GameFunc";
import { AI_ability } from "../../../ai/AI_ability";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_lycan_summon_wolves extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_lycan_summon_wolves_charges";
    }
    OnUpgrade(): void {
        if (this.GetCasterPlus().HasModifier("modifier_imba_lycan_summon_wolves_charges")) {
            this.GetCasterPlus().findBuff<modifier_imba_lycan_summon_wolves_charges>("modifier_imba_lycan_summon_wolves_charges").OnStackCountChanged(undefined);
        }
    }
    OnSpellStart(): void {
        let player_id = this.GetCasterPlus().GetPlayerID();
        for (const [_, unit] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_ANY_ORDER, false))) {
            for (let i = 0; i < 6; i++) {
                if (unit.GetUnitName() == "npc_imba_lycan_wolf" + i || unit.GetUnitName() == "npc_lycan_summoned_wolf_talent" && unit.GetPlayerID() == player_id) {
                    unit.ForceKill(false);
                }
            }
        }
        if (this.GetCasterPlus().GetUnitName().includes("lycan")) {
            EmitSoundOn("lycan_lycan_ability_summon_0" + RandomInt(1, 6), this.GetCasterPlus());
        }
        EmitSoundOn("Hero_Lycan.SummonWolves", this.GetCasterPlus());
        let particle_cast_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_lycan/lycan_summon_wolves_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(particle_cast_fx, 0, this.GetCasterPlus().GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(particle_cast_fx);
        let wolves_spawn_particle = undefined;
        let wolf: IBaseNpc_Plus = undefined;
        for (let i = 0; i <= this.GetTalentSpecialValueFor("wolves_count") - 1; i++) {
            wolf = this.GetCasterPlus().CreateSummon("npc_imba_lycan_wolf" + (this.GetSpecialValueFor("wolf_type") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_lycan_1")), this.GetCasterPlus().GetAbsOrigin() + (this.GetCasterPlus().GetForwardVector() * 200) + (this.GetCasterPlus().GetRightVector() * 120 * (i - ((this.GetTalentSpecialValueFor("wolves_count") - 1) / 2)) as Vector) as Vector, 60, true);
            wolves_spawn_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_lycan/lycan_summon_wolves_spawn.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, wolf);
            ParticleManager.ReleaseParticleIndex(wolves_spawn_particle);
            if (player_id) {
                // wolf.SetControllableByPlayer(player_id, true);
            }
            wolf.TempData().imba_lycan_summon_wolves = true;
            wolf.SetForwardVector(this.GetCasterPlus().GetForwardVector());
            wolf.SetBaseMaxHealth(wolf.GetBaseMaxHealth() + this.GetSpecialValueFor("HP_bonus_per_lycan_level") * this.GetCasterPlus().GetLevel());
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_lycan_2")) {
                wolf.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_lycan_summon_wolves_damage_talent", {});
            }
            if (this.GetSpecialValueFor("wolf_type") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_lycan_1") >= 5) {
                wolf.SetRenderColor(49, 49, 49);
            }
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_lycan_3")) {
            wolf = this.GetCasterPlus().CreateSummon("npc_lycan_summoned_wolf_talent", this.GetCasterPlus().GetAbsOrigin() + (this.GetCasterPlus().GetForwardVector() * 400) as Vector, 60, true);
            wolves_spawn_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_lycan/lycan_summon_wolves_spawn.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, wolf);
            ParticleManager.ReleaseParticleIndex(wolves_spawn_particle);
            if (player_id) {
                // wolf.SetControllableByPlayer(player_id, true);
            }
            wolf.SetForwardVector(this.GetCasterPlus().GetForwardVector());
            wolf.SetBaseMaxHealth(wolf.GetBaseMaxHealth() + this.GetSpecialValueFor("HP_bonus_per_lycan_level") * this.GetCasterPlus().GetLevel());
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_lycan_2")) {
                wolf.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_lycan_summon_wolves_damage_talent", {});
            }
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_lycan_10") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_lycan_10")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_lycan_10"), "modifier_special_bonus_imba_lycan_10", {});
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
export class modifier_imba_lycan_summon_wolves_charges extends BaseModifier_Plus {
    DestroyOnExpire(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus()) {
            this.SetStackCount(this.GetAbilityPlus().GetTalentSpecialValueFor("max_charges"));
        }
    }
    OnIntervalThink(): void {
        if (this.GetAbilityPlus() && this.GetStackCount() < this.GetAbilityPlus().GetTalentSpecialValueFor("max_charges")) {
            this.IncrementStackCount();
        }
    }
    OnStackCountChanged(stackCount: number): void {
        if (IsServer() && this.GetAbilityPlus()) {
            if (this.GetStackCount() < this.GetAbilityPlus().GetTalentSpecialValueFor("max_charges")) {
                if (this.GetRemainingTime() <= 0) {
                    this.StartIntervalThink(this.GetSpecialValueFor("charge_cooldown"));
                    this.SetDuration(this.GetSpecialValueFor("charge_cooldown"), true);
                }
            } else {
                this.StartIntervalThink(-1);
                this.SetDuration(-1, true);
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (keys.unit != keys.attacker && keys.unit.TempData().imba_lycan_summon_wolves && keys.unit.GetOwner() == this.GetCasterPlus() && this.GetStackCount() > 0) {
            this.DecrementStackCount();
            let player_id = this.GetCasterPlus().GetPlayerID();

            let wolf = BaseNpc_Plus.CreateUnitByName("npc_imba_lycan_wolf" + (this.GetSpecialValueFor("wolf_type") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_lycan_1")), this.GetCasterPlus().GetAbsOrigin() + (this.GetCasterPlus().GetForwardVector() * 200) as Vector, this.GetCasterPlus(), true);
            let wolves_spawn_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_lycan/lycan_summon_wolves_spawn.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, wolf);
            ParticleManager.ReleaseParticleIndex(wolves_spawn_particle);
            if (player_id) {
                // wolf.SetControllableByPlayer(player_id, true);
            }
            wolf.TempData().imba_lycan_summon_wolves = true;
            wolf.SetForwardVector(this.GetCasterPlus().GetForwardVector());
            wolf.SetBaseMaxHealth(wolf.GetBaseMaxHealth() + this.GetSpecialValueFor("HP_bonus_per_lycan_level") * this.GetCasterPlus().GetLevel());
            if (this.GetCasterPlus().HasTalent("special_bonus_imba_lycan_2")) {
                wolf.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_lycan_summon_wolves_damage_talent", {});
            }
            if (this.GetSpecialValueFor("wolf_type") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_lycan_1") >= 5) {
                wolf.SetRenderColor(49, 49, 49);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_lycan_summon_wolves_damage_talent extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(((this.GetCasterPlus().GetBaseDamageMin() + this.GetCasterPlus().GetBaseDamageMax()) / 2) * this.GetCasterPlus().GetTalentValue("special_bonus_imba_lycan_2") * 0.01);
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
}
@registerAbility()
export class imba_lycan_howl extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "lycan_howl";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let sound_cast = "Hero_Lycan.Howl";
        let response_sound = "lycan_lycan_ability_howl_0" + RandomInt(1, 5);
        let particle_lycan_howl = "particles/units/heroes/hero_lycan/lycan_howl_cast.vpcf";
        let particle_wolves_howl = "particles/units/heroes/hero_lycan/lycan_howl_cast_wolves.vpcf";
        let wolf_name = "npc_imba_lycan_wolf";
        let buff = "modifier_imba_howl_buff";
        let day = GameRules.IsDaytime();
        let duration = ability.GetSpecialValueFor("howl_duration");
        EmitSoundOnLocationForAllies(caster.GetAbsOrigin(), sound_cast, caster);
        EmitSoundOn(response_sound, caster);
        let particle_lycan_howl_fx = ResHelper.CreateParticleEx(particle_lycan_howl, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
        ParticleManager.SetParticleControl(particle_lycan_howl_fx, 0, caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_lycan_howl_fx, 1, caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_lycan_howl_fx, 2, caster.GetAbsOrigin());
        let creatures = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, creature] of GameFunc.iPair(creatures)) {
            for (let i = 0; i < 6; i++) {
                if (creature.GetUnitName() == wolf_name + i || "npc_lycan_summoned_wolf_talent") {
                    if (creature.IsIdle()) {
                        creature.StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_1);
                    } else {
                        creature.StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_2);
                    }
                    let particle_wolves_howl_fx = ResHelper.CreateParticleEx(particle_wolves_howl, ParticleAttachment_t.PATTACH_ABSORIGIN, creature);
                    ParticleManager.SetParticleControl(particle_wolves_howl_fx, 1, creature.GetAbsOrigin());
                    ParticleManager.SetParticleControl(particle_wolves_howl_fx, 2, creature.GetAbsOrigin());
                    if (caster.HasTalent("special_bonus_imba_lycan_4")) {
                        creature.AddNewModifier(caster, this, "modifier_imba_howl_flying_movement_talent", {
                            duration: caster.GetTalentValue("special_bonus_imba_lycan_4")
                        });
                    }
                }
            }
        }
        if (caster.HasTalent("special_bonus_imba_lycan_4")) {
            caster.AddNewModifier(caster, this, "modifier_imba_howl_flying_movement_talent", {
                duration: caster.GetTalentValue("special_bonus_imba_lycan_4")
            });
        }
        let allies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, ally] of GameFunc.iPair(allies)) {
            ally.AddNewModifier(caster, ability, buff, {
                duration: duration
            });
        }
    }
    OnUpgrade(): void {
        if (this.GetLevel() == 1) {
            this.ToggleAutoCast();
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
export class modifier_imba_howl_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public attack_speed: number;
    public armor: any;
    public hp_regen: any;
    public move_speed: number;
    GetEffectName(): string {
        return "particles/units/heroes/hero_lycan/lycan_howl_buff.vpcf";
    }
    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.attack_speed = this.ability.GetSpecialValueFor("attack_speed");
        this.armor = this.ability.GetSpecialValueFor("armor");
        this.hp_regen = this.ability.GetSpecialValueFor("hp_regen");
        this.move_speed = this.ability.GetSpecialValueFor("move_speed");
    }

    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.attack_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.armor;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.hp_regen;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        return this.move_speed;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (IsServer()) {
            let day = GameRules.IsDaytime();
            if (!GameRules.IsDaytime() && this.GetAbilityPlus().GetAutoCastState()) {
                let state = {
                    [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
                }
                return state;
            }
            return undefined;
        }
    }
}
@registerModifier()
export class modifier_imba_howl_flying_movement_talent extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.parent = this.GetParentPlus();
            this.parent.SetMoveCapability(DOTAUnitMoveCapability_t.DOTA_UNIT_CAP_MOVE_FLY);
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.parent.SetMoveCapability(DOTAUnitMoveCapability_t.DOTA_UNIT_CAP_MOVE_GROUND);
            GridNav.DestroyTreesAroundPoint(this.parent.GetAbsOrigin(), 200, false);
            this.parent.SetUnitOnClearGround();
        }
    }
    GetTexture(): string {
        return "howl_batwolf";
    }
}
@registerAbility()
export class imba_lycan_howl_723 extends BaseAbility_Plus {
    OnSpellStart(): void {
        EmitSoundOnLocationForAllies(this.GetCasterPlus().GetAbsOrigin(), "Hero_Lycan.Howl", this.GetCasterPlus());
        let particle_lycan_howl_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_lycan/lycan_howl_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
        ParticleManager.SetParticleControl(particle_lycan_howl_fx, 0, this.GetCasterPlus().GetAbsOrigin());
        ParticleManager.SetParticleControlEnt(particle_lycan_howl_fx, 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_mouth", this.GetCasterPlus().GetAbsOrigin(), true);
        for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
            enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_lycan_howl_723", {
                duration: this.GetSpecialValueFor("howl_duration") * (1 - enemy.GetStatusResistance())
            });
            if (!GameRules.IsDaytime() && this.GetAutoCastState()) {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_lycan_howl_723_phased", {
                    duration: this.GetSpecialValueFor("howl_duration")
                });
            }
        }
        for (const [_, creature] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_ANY_ORDER, false))) {
            for (let i = 0; i < 6; i++) {
                if (creature.GetUnitName() == "npc_imba_lycan_wolf" + i || "npc_lycan_summoned_wolf_talent") {
                    if (creature.IsIdle()) {
                        creature.StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_1);
                    } else {
                        creature.StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_2);
                    }
                    let particle_wolves_howl_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_lycan/lycan_howl_cast_wolves.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, creature);
                    ParticleManager.SetParticleControl(particle_wolves_howl_fx, 1, creature.GetAbsOrigin());
                    for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), creature.GetAbsOrigin(), undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
                        enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_lycan_howl_723", {
                            duration: this.GetSpecialValueFor("howl_duration") * (1 - enemy.GetStatusResistance())
                        });
                    }
                    if (!GameRules.IsDaytime() && this.GetAutoCastState()) {
                        creature.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_lycan_howl_723_phased", {
                            duration: this.GetSpecialValueFor("howl_duration")
                        });
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_lycan_howl_723 extends BaseModifier_Plus {
    public attack_damage_reduction: number;
    public armor: any;
    public move_speed: number;
    GetEffectName(): string {
        return "particles/units/heroes/hero_lycan/lycan_howl_buff.vpcf";
    }
    BeCreated(p_0: any,): void {
        this.attack_damage_reduction = this.GetSpecialValueFor("attack_damage_reduction") * (-1);
        this.armor = this.GetSpecialValueFor("armor") * (-1);
        this.move_speed = this.GetSpecialValueFor("move_speed") * (-1);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_ATTACK_DAMAGE_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_ATTACK_DAMAGE_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.attack_damage_reduction;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.armor;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        return this.move_speed;
    }
}
@registerModifier()
export class modifier_imba_lycan_howl_723_phased extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        };
    }
}
@registerAbility()
export class imba_lycan_feral_impulse extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "lycan_feral_impulse";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_feral_impulse_aura";
    }
}
@registerModifier()
export class modifier_imba_feral_impulse_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public base_bonus_damage_perc: number;
    public damage_inc_per_unit: number;
    public aura_radius: number;
    public hero_inc_multiplier: any;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            this.base_bonus_damage_perc = this.ability.GetSpecialValueFor("base_bonus_damage_perc");
            this.damage_inc_per_unit = this.ability.GetSpecialValueFor("damage_inc_per_unit");
            this.aura_radius = this.ability.GetSpecialValueFor("aura_radius");
            this.hero_inc_multiplier = this.ability.GetSpecialValueFor("hero_inc_multiplier");
            this.StartIntervalThink(0.2);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let value_increase = 0;
            let units = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, this.aura_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, unit] of GameFunc.iPair(units)) {
                if (unit != this.caster) {
                    if (unit.IsRealUnit()) {
                        value_increase = value_increase + 1 * this.hero_inc_multiplier;
                    } else {
                        value_increase = value_increase + 1;
                    }
                }
            }
            this.SetStackCount(value_increase);
        }
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT;
    }
    GetEffectName(): string {
        return "particles/generic/auras/aura_feral_impulse.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    GetAuraRadius(): number {
        return this.aura_radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_feral_impulse";
    }
    IsAura(): boolean {
        if (IsServer()) {
            if (this.caster.PassivesDisabled()) {
                return false;
            }
            return true;
        }
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_feral_impulse extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public aura_buff: string;
    public base_bonus_damage_perc: number;
    public damage_inc_per_unit: number;
    public health_regen: any;
    public regen_inc_per_unit: any;
    public feral_impulse_stacks: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.aura_buff = "modifier_imba_feral_impulse_aura";
        this.base_bonus_damage_perc = this.ability.GetSpecialValueFor("base_bonus_damage_perc");
        this.damage_inc_per_unit = this.ability.GetSpecialValueFor("damage_inc_per_unit");
        this.health_regen = this.ability.GetSpecialValueFor("health_regen");
        this.regen_inc_per_unit = this.ability.GetSpecialValueFor("regen_inc_per_unit");
        this.feral_impulse_stacks = this.caster.findBuffStack(this.aura_buff, this.caster);
        this.StartIntervalThink(0.1);
    }
    OnIntervalThink(): void {
        if (!IsValid(this.caster)) {
            this.Destroy();
            return
        }
        this.feral_impulse_stacks = this.caster.findBuffStack(this.aura_buff, this.caster);
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_ATTACK_DAMAGE_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_ATTACK_DAMAGE_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        let damage_perc_increase = this.base_bonus_damage_perc + this.damage_inc_per_unit * this.feral_impulse_stacks;
        return damage_perc_increase;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        let health_increase = this.health_regen + this.regen_inc_per_unit * this.feral_impulse_stacks;
        return health_increase;
    }
}
@registerAbility()
export class imba_lycan_shapeshift extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "lycan_shapeshift";
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasAbility("special_bonus_imba_lycan_7") && this.GetCasterPlus().findAbliityPlus("special_bonus_imba_lycan_7").IsTrained() && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_lycan_7")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_special_bonus_imba_lycan_7", {});
        }
    }
    OnUpgrade(): void {
        // todo: 有问题
        if (this.GetCasterPlus().HasAbility("lycan_shapeshift")) {
            this.GetCasterPlus().findAbliityPlus("lycan_shapeshift").SetLevel(this.GetLevel());
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let sound_cast = "Hero_Lycan.Shapeshift.Cast";
        let response_cast = "lycan_lycan_ability_shapeshift_";
        let particle_cast = "particles/units/heroes/hero_lycan/lycan_shapeshift_cast.vpcf";
        let transform_buff = "modifier_imba_shapeshift_transform";
        let transform_stun = "modifier_imba_shapeshift_transform_stun";
        let transformation_time = ability.GetSpecialValueFor("transformation_time");
        let duration = ability.GetSpecialValueFor("duration");
        caster.StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_4);
        let random_sound = RandomInt(1, 10);
        let correct_sound_num = "";
        if (random_sound < 10) {
            correct_sound_num = "0" + tostring(random_sound);
        } else {
            correct_sound_num += random_sound;
        }
        response_cast = response_cast + correct_sound_num;
        let who_let_the_dogs_out = 10;
        if (RollPercentage(who_let_the_dogs_out)) {
            EmitSoundOn("Imba.LycanDogsOut", caster);
        } else {
            EmitSoundOn(response_cast, caster);
        }
        EmitSoundOn(sound_cast, caster);
        let particle_cast_fx = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
        ParticleManager.SetParticleControl(particle_cast_fx, 0, caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_cast_fx, 1, caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_cast_fx, 2, caster.GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_cast_fx, 3, caster.GetAbsOrigin());
        ParticleManager.ReleaseParticleIndex(particle_cast_fx);
        caster.AddNewModifier(caster, ability, transform_stun, {
            duration: transformation_time
        });
        this.AddTimer(transformation_time, () => {
            caster.AddNewModifier(caster, ability, transform_buff, {
                duration: duration
            });
        });
    }
    GetCooldown(level: number): number {
        let caster = this.GetCasterPlus();
        let ability = this;
        let ability_level = ability.GetLevel();
        let base_cooldown = super.GetCooldown(level);
        let wolfsbane_modifier = "modifier_imba_wolfsbane_lycan";
        if (caster.HasModifier(wolfsbane_modifier) && !caster.PassivesDisabled()) {
            let stacks = caster.findBuffStack(wolfsbane_modifier, caster);
            let final_cooldown = (base_cooldown - stacks);
            if (final_cooldown < 0) {
                final_cooldown = 0;
            }
            return final_cooldown;
        }
        return super.GetCooldown(level);
    }
    GetManaCost(level: number): number {
        return 100;
    }
    AutoSpellSelf() {
        return AI_ability.NO_TARGET_if_enemy(this)
    }
}
@registerModifier()
export class modifier_imba_shapeshift_transform_stun extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }
    IsHidden(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_shapeshift_transform extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public aura: any;
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE)
    CC_GetModifierModelChange(): string {
        return "models/heroes/lycan/lycan_wolf.vmdl";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.aura = "modifier_imba_shapeshift_aura";
            if (this.caster && !this.caster.HasModifier(this.aura)) {
                this.caster.AddNewModifier(this.caster, this.ability, this.aura, {});
            }
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            let response_sound = "lycan_lycan_ability_revert_0" + RandomInt(1, 3);
            let particle_revert = "particles/units/heroes/hero_lycan/lycan_shapeshift_revert.vpcf";
            let certain_crit_buff = "modifier_imba_shapeshift_certain_crit";
            EmitSoundOn(response_sound, this.caster);
            let particle_revert_fx = ResHelper.CreateParticleEx(particle_revert, ParticleAttachment_t.PATTACH_ABSORIGIN, this.caster);
            ParticleManager.SetParticleControl(particle_revert_fx, 0, this.caster.GetAbsOrigin());
            ParticleManager.SetParticleControl(particle_revert_fx, 3, this.caster.GetAbsOrigin());
            if (this.caster.HasModifier(this.aura)) {
                this.caster.RemoveModifierByName(this.aura);
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
export class modifier_imba_shapeshift_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
        }
    }
    AllowIllusionDuplicate(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return 25000;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_shapeshift";
    }
    IsAura(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        if (IsServer()) {
            if (target.IsRealUnit()) {
                if (target == this.caster) {
                    return false;
                }
            }
            if (target.GetOwnerEntity()) {
                if (target.GetOwnerEntity() == this.caster) {
                    return false;
                }
            }
            return true;
        }
    }
}
@registerModifier()
export class modifier_imba_shapeshift extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public certain_crit_buff: any;
    public transform_buff: any;
    public night_vision_bonus: number;
    public absolute_speed: number;
    public crit_chance: number;
    public crit_damage: number;
    public certain_crit_cooldown: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.parent = this.GetParentPlus();
        this.certain_crit_buff = "modifier_imba_shapeshift_certain_crit";
        this.transform_buff = "modifier_imba_shapeshift_transform";
        this.night_vision_bonus = this.ability.GetSpecialValueFor("night_vision_bonus");
        this.absolute_speed = this.ability.GetSpecialValueFor("absolute_speed");
        this.crit_chance = this.ability.GetTalentSpecialValueFor("crit_chance");
        this.crit_damage = this.ability.GetSpecialValueFor("crit_damage");
        this.certain_crit_cooldown = this.ability.GetSpecialValueFor("certain_crit_cooldown");
        if (IsServer()) {
            if (!this.parent.HasModifier(this.certain_crit_buff)) {
                this.parent.AddNewModifier(this.caster, this.ability, this.certain_crit_buff, {});
            }
        }
    }

    GetEffectName(): string {
        return "particles/units/heroes/hero_lycan/lycan_shapeshift_buff.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE_MIN,
            3: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION)
    CC_GetBonusNightVision(): number {
        return this.night_vision_bonus;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE_MIN)
    CC_GetModifierMoveSpeed_AbsoluteMin(): number {
        if (this.caster.HasTalent("special_bonus_imba_lycan_7")) {
            return this.caster.GetTalentValue("special_bonus_imba_lycan_7", "max_movespeed");
        } else {
            return this.absolute_speed;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE_UNIQUE)
    CC_GetModifierPreAttack_CriticalStrike(p_0: ModifierAttackEvent,): number {
        if (IsServer()) {
            if (this.parent.HasModifier(this.certain_crit_buff)) {
                this.parent.RemoveModifierByName(this.certain_crit_buff);
                this.AddTimer(this.certain_crit_cooldown, () => {
                    if (this.caster.HasModifier(this.transform_buff)) {
                        this.parent.AddNewModifier(this.caster, this.ability, this.certain_crit_buff, {});
                    }
                });
                return this.crit_damage;
            }
            if (GFuncRandom.PRD(this.crit_chance, this)) {
                return this.crit_damage;
            }
            return undefined;
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            if (this.parent.HasModifier(this.certain_crit_buff)) {
                this.parent.RemoveModifierByName(this.certain_crit_buff);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_shapeshift_certain_crit extends BaseModifier_Plus {
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
export class imba_lycan_wolfsbane extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "wolfsbane";
    }
    IsInnateAbility() {
        return true;
    }
    OnUpgrade(): void {
        let caster = this.GetCasterPlus();
        let ability = this;
        let aura = "modifier_imba_wolfsbane_aura";
        let lycan_modifier = "modifier_imba_wolfsbane_lycan";
        if (!caster.HasModifier(aura)) {
            caster.AddNewModifier(caster, ability, aura, {});
        }
        if (!caster.HasModifier(lycan_modifier)) {
            caster.AddNewModifier(caster, ability, lycan_modifier, {});
        }
    }
}
@registerModifier()
export class modifier_imba_wolfsbane_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
    }
    DestroyOnExpire(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT;
    }
    GetAuraRadius(): number {
        return 25000;
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
        return "modifier_imba_wolfsbane_wolves";
    }
    IsAura(): boolean {
        if (this.caster.PassivesDisabled()) {
            return false;
        }
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        let scepter = this.caster.HasScepter();
        let wolf_found;
        if (target == this.caster) {
            return true;
        }
        let wolf_name = "npc_imba_lycan_wolf";
        let full_name = "";
        for (let i = 0; i < 6; i++) {
            full_name = wolf_name + i;
            if (full_name == target.GetUnitName()) {
                wolf_found = true;
            }
        }
        if (wolf_found) {
            return false;
        }
        if (scepter) {
            return false;
        }
        return true;
    }
}
@registerModifier()
export class modifier_imba_wolfsbane_wolves extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public wolf: any;
    public damage_bonus: number;
    Init(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.wolf = this.GetParentPlus();
        this.damage_bonus = this.ability.GetSpecialValueFor("damage_bonus");
        if (IsServer()) {
            this.StartIntervalThink(0.5);
        }
    }

    OnIntervalThink(): void {
        if (this.caster.HasModifier("modifier_imba_wolfsbane_lycan")) {
            this.SetStackCount(this.caster.findBuff<modifier_imba_wolfsbane_lycan>("modifier_imba_wolfsbane_lycan").GetStackCount());
        }
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        let stacks = this.GetStackCount();
        if (this.GetParentPlus().PassivesDisabled()) {
            return undefined;
        }
        return this.damage_bonus * stacks;
    }
}
@registerModifier()
export class modifier_imba_wolfsbane_lycan extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public aura: any;
    public prevent_modifier: any;
    public sound_howl: any;
    public radius: number;
    public minimum_allies_required: any;
    public prevent_modifier_duration: number;
    public scepter_radius: number;
    public damage_bonus: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.aura = "modifier_imba_wolfsbane_aura";
        this.prevent_modifier = "modifier_imba_wolfsbane_lycan_prevent";
        this.sound_howl = "Imba.LycanWolfsbane";
        this.radius = this.ability.GetSpecialValueFor("radius");
        this.minimum_allies_required = this.ability.GetSpecialValueFor("minimum_allies_required");
        this.prevent_modifier_duration = this.ability.GetSpecialValueFor("prevent_modifier_duration");
        this.scepter_radius = this.ability.GetSpecialValueFor("scepter_radius");
        this.damage_bonus = this.ability.GetSpecialValueFor("damage_bonus");
        this.StartIntervalThink(0.5);
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: Enum_MODIFIER_EVENT.ON_HERO_KILLED,
            3: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_HERO_KILLED)
    CC_OnHeroKilled(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let killed_hero = keys.target;
            let scepter = this.caster.HasScepter();
            if (this.caster.PassivesDisabled()) {
                return undefined;
            }
            if (this.caster.GetTeamNumber() != killed_hero.GetTeamNumber()) {
                let lycan_nearby = false;
                let should_grants_stacks = false;
                let units = FindUnitsInRadius(this.caster.GetTeamNumber(), killed_hero.GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_ANY_ORDER, false);
                for (const [_, unit] of GameFunc.iPair(units)) {
                    if (unit == this.caster) {
                        lycan_nearby = true;
                    }
                }
                if (GameFunc.GetCount(units) >= this.minimum_allies_required + 1 && lycan_nearby && this.caster.HasModifier(this.aura) && !this.caster.HasModifier(this.prevent_modifier)) {
                    should_grants_stacks = true;
                }
                if (scepter) {
                    let units = FindUnitsInRadius(this.caster.GetTeamNumber(), killed_hero.GetAbsOrigin(), undefined, this.scepter_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                    if (GameFunc.GetCount(units) >= this.minimum_allies_required && this.caster.HasModifier(this.aura) && !this.caster.HasModifier(this.prevent_modifier)) {
                        should_grants_stacks = true;
                    }
                }
                if (should_grants_stacks) {
                    EmitSoundOn(this.sound_howl, this.caster);
                    this.IncrementStackCount();
                    this.caster.AddNewModifier(this.caster, this.ability, this.prevent_modifier, {
                        duration: this.prevent_modifier_duration
                    });
                    if (this.caster.HasTalent("special_bonus_imba_lycan_8")) {
                        let units = FindUnitsInRadius(this.caster.GetTeamNumber(), this.caster.GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_ANY_ORDER, false);
                        for (const [_, unit] of GameFunc.iPair(units)) {
                            if (unit.GetOwnerEntity() == this.caster) {
                                unit.AddNewModifier(this.caster, this.ability, "modifier_imba_wolfsbane_talent", {
                                    duration: this.caster.GetTalentValue("special_bonus_imba_lycan_8", "duration")
                                });
                            }
                            this.caster.AddNewModifier(this.caster, this.ability, "modifier_imba_wolfsbane_talent", {
                                duration: this.caster.GetTalentValue("special_bonus_imba_lycan_8", "duration")
                            });
                        }
                    }
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        let stacks = this.GetStackCount();
        let damage_bonus = this.damage_bonus;
        if (this.caster.PassivesDisabled()) {
            return undefined;
        }
        return damage_bonus * stacks;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_wolfsbane_lycan_prevent extends BaseModifier_Plus {
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
export class modifier_imba_wolfsbane_talent extends BaseModifier_Plus {
    public movespeed_bonus: number;
    public damage_bonus: number;
    public attackspeed_bonus: number;
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
        let caster = this.GetCasterPlus();
        this.movespeed_bonus = caster.GetTalentValue("special_bonus_imba_lycan_8", "bonus_movespeed_pct");
        this.damage_bonus = caster.GetTalentValue("special_bonus_imba_lycan_8", "bonus_damage_pct");
        this.attackspeed_bonus = caster.GetTalentValue("special_bonus_imba_lycan_8", "bonus_attackspeed");
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_ATTACK_DAMAGE_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.movespeed_bonus;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_ATTACK_DAMAGE_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.damage_bonus;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.attackspeed_bonus;
    }
}
@registerAbility()
export class imba_summoned_wolf_wicked_crunch extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "lycan_summon_wolves_critical_strike";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_summoned_wolf_wicked_crunch";
    }
}
@registerModifier()
export class modifier_imba_summoned_wolf_wicked_crunch extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public debuff: any;
    public certain_crit: any;
    public duration: number;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.debuff = "modifier_imba_summoned_wolf_wicked_crunch_debuff";
            this.certain_crit = "modifier_imba_shapeshift_certain_crit";
            this.duration = this.ability.GetSpecialValueFor("duration");
        }
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            let target = keys.target;
            let owner = undefined as IBaseNpc_Plus;
            if (this.caster.GetOwnerEntity()) {
                owner = this.caster.GetOwnerEntity() as IBaseNpc_Plus;
            }
            if (this.caster == keys.attacker) {
                if (keys.attacker.PassivesDisabled()) {
                    return undefined;
                }
                if (target.IsBuilding()) {
                    return undefined;
                }
                target.AddNewModifier(this.caster, this.ability, this.debuff, {
                    duration: this.duration * (1 - target.GetStatusResistance())
                });
                target.AddNewModifier(this.caster, this.ability, "modifier_imba_summoned_wolf_wicked_crunch_damage", {
                    duration: this.duration * (1 - target.GetStatusResistance())
                });
            }
            if (owner && owner == keys.attacker && !owner.TempData().has_attacked_for_many_wolves_interaction) {
                if (target.HasModifier(this.debuff)) {
                    let damage_bonus_per_stack = this.ability.GetSpecialValueFor("damage_bonus_per_stack");
                    let max_stacks = this.ability.GetSpecialValueFor("max_stacks");
                    target.AddNewModifier(this.caster, this.ability, this.debuff, {
                        duration: this.ability.GetSpecialValueFor("duration") * (1 - target.GetStatusResistance()),
                        lycan_attack: true
                    });
                    let bonus_damage_modifier = target.findBuff<modifier_imba_summoned_wolf_wicked_crunch_damage>("modifier_imba_summoned_wolf_wicked_crunch_damage");
                    if (bonus_damage_modifier) {
                        let bonus_damage_stacks = GameFunc.GetCount(bonus_damage_modifier.stacks_table);
                        let damage = damage_bonus_per_stack * bonus_damage_stacks;
                        if (bonus_damage_stacks >= max_stacks) {
                            SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_DAMAGE, target, damage, undefined);
                        }
                        let damageTable = {
                            victim: target,
                            attacker: owner,
                            damage: damage,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
                        }
                        ApplyDamage(damageTable);
                        bonus_damage_modifier.Destroy();
                    }
                }
                owner.TempData().has_attacked_for_many_wolves_interaction = true;
                this.AddTimer(FrameTime(), () => {
                    owner.TempData().has_attacked_for_many_wolves_interaction = false;
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_summoned_wolf_wicked_crunch_debuff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public duration: number;
    public stacks_table: number[];
    public owner: any;
    public attack_speed_reduction: number;
    public max_stacks: number;
    BeCreated(params: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.duration = params.duration;
            if (!params.lycan_attack) {
                this.stacks_table = []
                if (!params.lycan_attack) {
                    this.stacks_table.push(GameRules.GetGameTime());
                }
                this.StartIntervalThink(0.1);
                this.owner = this.caster.GetOwnerPlus();
                if (this.owner && this.owner.HasTalent("special_bonus_imba_lycan_6") && !params.lycan_attack) {
                    this.stacks_table.push(GameRules.GetGameTime());
                }
            }
        }
        if (this.GetAbilityPlus()) {
            this.attack_speed_reduction = this.GetSpecialValueFor("attack_speed_reduction");
        }
    }
    BeRefresh(params: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.duration = params.duration;
            this.max_stacks = this.ability.GetSpecialValueFor("max_stacks");
            this.owner = this.caster.GetOwnerPlus();

            if (this.owner && this.owner.HasTalent("special_bonus_imba_lycan_6")) {
                this.max_stacks = this.max_stacks * this.owner.GetTalentValue("special_bonus_imba_lycan_6") * 0.01;
            }
            if (!params.lycan_attack) {
                this.stacks_table.push(GameRules.GetGameTime());
                if (GameFunc.GetCount(this.stacks_table) > this.max_stacks) {
                    this.stacks_table.shift();
                }
                if (this.owner && this.owner.HasTalent("special_bonus_imba_lycan_6")) {
                    this.stacks_table.push(GameRules.GetGameTime());
                }
                if (GameFunc.GetCount(this.stacks_table) > this.max_stacks) {
                    this.stacks_table.shift();
                }
            } else {
                for (let [i, v] of GameFunc.iPair(this.stacks_table)) {
                    this.stacks_table.splice(i, 1);
                    this.stacks_table.push(GameRules.GetGameTime());
                }
            }
        }
        if (this.GetAbilityPlus()) {
            this.attack_speed_reduction = this.GetSpecialValueFor("attack_speed_reduction");
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (GameFunc.GetCount(this.stacks_table) > 0) {
                for (let [i, j] of GameFunc.iPair(this.stacks_table)) {
                    if (this.stacks_table[i]) {
                        if (this.stacks_table[i] + this.duration < GameRules.GetGameTime()) {
                            if (this.stacks_table) {
                                this.stacks_table.splice(i, 1);
                            }
                        }
                    } else {
                        i = GameFunc.GetCount(this.stacks_table);
                    }
                }
                if (GameFunc.GetCount(this.stacks_table) == 0) {
                    this.Destroy();
                } else {
                    this.SetStackCount(GameFunc.GetCount(this.stacks_table));
                }
            }
        }
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_bloodseeker/bloodseeker_rupture_nuke.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    GetTexture(): string {
        return "lycan_summon_wolves_critical_strike";
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
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return (this.attack_speed_reduction * (-1) * this.GetStackCount());
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
    CC_GetModifierProvidesFOWVision(): 0 | 1 {
        if (IsServer()) {
            let owner = this.caster.GetOwnerEntity() as IBaseNpc_Plus;
            if (owner.HasTalent("special_bonus_imba_lycan_5")) {
                if (this.GetStackCount() >= owner.GetTalentValue("special_bonus_imba_lycan_5")) {
                    return 1;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        }
    }
}
@registerModifier()
export class modifier_imba_summoned_wolf_wicked_crunch_damage extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public duration: number;
    public stacks_table: number[];
    public owner: any;
    public attack_speed_reduction: number;
    public max_stacks: number;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.duration = params.duration;
            if (!params.lycan_attack) {
                this.stacks_table = []
                if (!params.lycan_attack) {
                    this.stacks_table.push(GameRules.GetGameTime());
                }
                this.StartIntervalThink(0.1);
                this.owner = this.caster.GetOwnerEntity();
                if (this.owner.HasTalent("special_bonus_imba_lycan_6") && !params.lycan_attack) {
                    this.stacks_table.push(GameRules.GetGameTime());
                }
            }
        }
    }
    BeRefresh(params: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.attack_speed_reduction = this.ability.GetSpecialValueFor("attack_speed_reduction");
            this.duration = params.duration;
            this.max_stacks = this.ability.GetSpecialValueFor("max_stacks");
            if (this.owner.HasTalent("special_bonus_imba_lycan_6")) {
                this.max_stacks = this.max_stacks * this.owner.GetTalentValue("special_bonus_imba_lycan_6") * 0.01;
            }
            this.stacks_table.push(GameRules.GetGameTime());
            if (GameFunc.GetCount(this.stacks_table) > this.max_stacks) {
                this.stacks_table.shift()
            }
            this.owner = this.caster.GetOwnerEntity();
            if (this.owner.HasTalent("special_bonus_imba_lycan_6") && this.GetStackCount() < this.max_stacks) {
                this.stacks_table.push(GameRules.GetGameTime());
            }
            if (GameFunc.GetCount(this.stacks_table) > this.max_stacks) {
                this.stacks_table.shift()
            }
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            if (GameFunc.GetCount(this.stacks_table) > 0) {
                for (let [i, j] of GameFunc.iPair(this.stacks_table)) {
                    if (this.stacks_table[i]) {
                        if (this.stacks_table[i] + this.duration < GameRules.GetGameTime()) {
                            if (this.stacks_table) {
                                this.stacks_table.splice(i, 1);
                            }
                        }
                    } else {
                        i = GameFunc.GetCount(this.stacks_table);
                    }
                }
                if (GameFunc.GetCount(this.stacks_table) == 0) {
                    this.Destroy();
                } else {
                    this.SetStackCount(GameFunc.GetCount(this.stacks_table));
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.GetStackCount() * this.GetSpecialValueFor("damage_bonus_per_stack");
    }
    GetTexture(): string {
        return "summoned_wolf_deep_claws";
    }
}
@registerAbility()
export class imba_summoned_wolf_hunter_instincts extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "hunter_instincts";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_summoned_wolf_hunter_instincts";
    }
}
@registerModifier()
export class modifier_imba_summoned_wolf_hunter_instincts extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public evasion: any;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.evasion = this.ability.GetSpecialValueFor("evasion");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EVASION_CONSTANT)
    CC_GetModifierEvasion_Constant(p_0: ModifierAttackEvent,): number {
        if (this.caster.PassivesDisabled()) {
            return undefined;
        }
        return this.evasion;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_PERMANENT;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
}
@registerAbility()
export class imba_summoned_wolf_invisibility extends BaseAbility_Plus {
    GetAbilityTextureName(): string {
        return "lycan_summon_wolves_invisibility";
    }
    OnUpgrade(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this;
            let buff = "modifier_imba_summoned_wolf_invisibility_fade";
            let fade_time = ability.GetSpecialValueFor("fade_time");
            if (!caster.HasModifier(buff)) {
                caster.AddNewModifier(caster, ability, buff, {
                    duration: fade_time
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_summoned_wolf_invisibility_fade extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public invis_buff: any;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetParentPlus();
            this.ability = this.GetAbilityPlus();
            this.invis_buff = "modifier_imba_summoned_wolf_invisibility";
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            this.caster.AddNewModifier(this.caster, this.ability, this.invis_buff, {});
            this.caster.AddNewModifier(this.caster, this.ability, "modifier_generic_invisible", {});
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_FINISHED
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_FINISHED)
    CC_OnAttackFinished(keys: ModifierAttackEvent): void {
        if (this.caster == keys.attacker) {
            this.ForceRefresh();
        }
    }
}
@registerModifier()
export class modifier_imba_summoned_wolf_invisibility extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public invis_fade: any;
    public fade_time: number;
    BeCreated(p_0: any,): void {
        this.caster = this.GetCasterPlus();
        this.ability = this.GetAbilityPlus();
        this.invis_fade = "modifier_imba_summoned_wolf_invisibility_fade";
        this.fade_time = this.ability.GetSpecialValueFor("fade_time");
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_FINISHED
        }
        return Object.values(decFuncs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_FINISHED)
    CC_OnAttackFinished(keys: ModifierAttackEvent): void {
        if (IsServer()) {
            if (this.caster == keys.attacker) {
                this.caster.RemoveModifierByName("modifier_generic_invisible");
                this.caster.AddNewModifier(this.caster, this.ability, this.invis_fade, {
                    duration: this.fade_time
                });
                this.Destroy();
            }
        }
    }
}
@registerAbility()
export class imba_summoned_wolf_pack_leader extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_talent_wolf_packleader_aura";
    }
}
@registerModifier()
export class modifier_imba_talent_wolf_packleader_aura extends BaseModifier_Plus {
    public radius: number;
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        let ability = this.GetAbilityPlus();
        this.radius = ability.GetSpecialValueFor("aura_radius");
    }
    GetAuraRadius(): number {
        return this.radius;
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
        return "modifier_imba_talent_wolf_packleader";
    }
}
@registerModifier()
export class modifier_imba_talent_wolf_packleader extends BaseModifier_Plus {
    public bonus_damage_pct: number;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetTexture(): string {
        return "alpha_wolf_command_aura";
    }
    BeCreated(p_0: any,): void {
        let ability = this.GetAbilityPlus();
        if (ability) {
            this.bonus_damage_pct = ability.GetSpecialValueFor("aura_bonus_damage_pct");
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_ATTACK_DAMAGE_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.bonus_damage_pct;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_lycan_7 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_lycan_10 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_lycan_5 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_lycan_3 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_lycan_1 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_lycan_2 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_lycan_6 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_lycan_9 extends BaseModifier_Plus {
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
