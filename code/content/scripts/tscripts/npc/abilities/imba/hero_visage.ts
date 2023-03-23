
import { AI_ability } from "../../../ai/AI_ability";
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_visage_grave_chill extends BaseAbility_Plus {
    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        if (target.TriggerSpellAbsorb(this)) {
            return;
        }
        this.GetCasterPlus().EmitSound("Hero_Visage.GraveChill.Cast");
        target.EmitSound("Hero_Visage.GraveChill.Target");
        if (this.GetCasterPlus().GetUnitName().includes("visage") && RollPercentage(25)) {
            let responses = {
                "1": "visage_visa_gravechill_04",
                "2": "visage_visa_gravechill_05",
                "3": "visage_visa_gravechill_14",
                "4": "visage_visa_gravechill_21",
                "5": "visage_visa_gravechill_22"
            }
            this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(responses));
        }
        let chill_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_visage/visage_grave_chill_cast_beams.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(chill_particle, 0, target, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(chill_particle, 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(chill_particle);
        this.GetCasterPlus().AddNewModifier(target, this, "modifier_imba_visage_grave_chill_buff", {
            duration: this.GetSpecialValueFor("chill_duration") * (1 - target.GetStatusResistance())
        });
        let allies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, 1200, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, ally] of GameFunc.iPair(allies)) {
            if (ally.GetUnitName().includes("npc_imba_visage_familiar")) {
                ally.AddNewModifier(target, this, "modifier_imba_visage_grave_chill_buff", {
                    duration: this.GetSpecialValueFor("chill_duration") * (1 - target.GetStatusResistance())
                });
            }
        }
        target.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_visage_grave_chill_debuff", {
            duration: this.GetSpecialValueFor("chill_duration") * (1 - target.GetStatusResistance())
        });
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_visage_grave_chill_buff extends BaseModifier_Plus {
    public movespeed_bonus: number;
    public attackspeed_bonus: number;
    public deaths_enticement_bonus_per_sec: number;
    IsDebuff(): boolean {
        return false;
    }
    Init(p_0: any,): void {
        this.movespeed_bonus = this.GetSpecialValueFor("movespeed_bonus");
        this.attackspeed_bonus = this.GetSpecialValueFor("attackspeed_bonus");
        this.deaths_enticement_bonus_per_sec = this.GetSpecialValueFor("deaths_enticement_bonus_per_sec");
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().TempData().time_spawned) {
            this.SetStackCount(math.floor(GameRules.GetGameTime() - this.GetCasterPlus().TempData().time_spawned) * (-1));
        }
        let chill_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_visage/visage_grave_chill_caster.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(chill_particle, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetParentPlus().GetAbsOrigin(), true);
        if (this.GetParentPlus().GetUnitName().includes("visage") && !this.GetParentPlus().HasModifier("modifier_imba_visage_become_familiar")) {
            ParticleManager.SetParticleControlEnt(chill_particle, 2, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_tail_tip", this.GetParentPlus().GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(chill_particle, 3, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_wingtipL", this.GetParentPlus().GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(chill_particle, 4, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_wingtipR", this.GetParentPlus().GetAbsOrigin(), true);
        } else {
            ParticleManager.SetParticleControlEnt(chill_particle, 2, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(chill_particle, 3, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(chill_particle, 4, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        }
        this.AddParticle(chill_particle, false, false, -1, false, false);
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.movespeed_bonus;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.attackspeed_bonus + (this.GetStackCount() * (-1) * this.deaths_enticement_bonus_per_sec);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE)
    CC_GetModifierTurnRate_Percentage(): number {
        return this.GetStackCount() * (-1) * this.deaths_enticement_bonus_per_sec;
    }
}
@registerModifier()
export class modifier_imba_visage_grave_chill_debuff extends BaseModifier_Plus {
    public movespeed_bonus: number;
    public attackspeed_bonus: number;
    public deaths_enticement_bonus_per_sec: number;
    GetStatusEffectName(): string {
        return "particles/units/heroes/hero_visage/status_effect_visage_chill_slow.vpcf";
    }
    Init(p_0: any,): void {
        this.movespeed_bonus = this.GetSpecialValueFor("movespeed_bonus") * (-1);
        this.attackspeed_bonus = this.GetSpecialValueFor("attackspeed_bonus") * (-1);
        this.deaths_enticement_bonus_per_sec = this.GetSpecialValueFor("deaths_enticement_bonus_per_sec");
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().TempData().time_spawned) {
            this.SetStackCount(math.floor(GameRules.GetGameTime() - this.GetParentPlus().TempData().time_spawned) * (-1));
        }
        let chill_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_visage/visage_grave_chill_tgt.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(chill_particle, 2, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
        this.AddParticle(chill_particle, false, false, -1, false, false);
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.movespeed_bonus;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.attackspeed_bonus + (this.GetStackCount() * this.deaths_enticement_bonus_per_sec);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_PERCENTAGE)
    CC_GetModifierTurnRate_Percentage(): number {
        return this.GetStackCount() * this.deaths_enticement_bonus_per_sec;
    }
}
@registerAbility()
export class imba_visage_soul_assumption extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_visage_soul_assumption";
    }
    OnUpgrade(): void {
        if (!IsServer()) {
            return;
        }
        let buff = this.GetCasterPlus().FindModifierByNameAndCaster(this.GetIntrinsicModifierName(), this.GetCasterPlus()) as modifier_imba_visage_soul_assumption;
        if (this.GetLevel() >= 1 && !buff.particle) {
            buff.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_visage/visage_soul_overhead.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetCasterPlus());
            buff.AddParticle(buff.particle, false, false, -1, false, false);
        }
    }
    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        this.GetCasterPlus().EmitSound("Hero_Visage.SoulAssumption.Cast");
        if (this.GetCasterPlus().GetUnitName().includes("visage")) {
            if (RollPercentage(10)) {
                let responses_rare = {
                    "1": "visage_visa_soulassumption01",
                    "2": "visage_visa_soulassumption02",
                    "3": "visage_visa_soulassumption07"
                }
                this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(responses_rare));
            } else {
                let responses = {
                    "1": "visage_visa_gravechill_24",
                    "2": "visage_visa_gravechill_26",
                    "3": "visage_visa_gravechill_27",
                    "4": "visage_visa_gravechill_28",
                    "5": "visage_visa_gravechill_32"
                }
                this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(responses));
            }
        }
        let assumption_counter_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_visage_soul_assumption_counter", this.GetCasterPlus());
        let damage_bars = 0;
        let effect_name = "particles/units/heroes/hero_visage/visage_soul_assumption_bolt.vpcf";
        let overflow_counter = 1;
        if (assumption_counter_modifier) {
            damage_bars = math.min(math.floor(assumption_counter_modifier.GetStackCount() / this.GetSpecialValueFor("damage_limit")), this.GetSpecialValueFor("stack_limit"));
            overflow_counter = math.max(assumption_counter_modifier.GetStackCount() - (this.GetSpecialValueFor("damage_limit") * this.GetSpecialValueFor("stack_limit")), 0);
            if (damage_bars > 0) {
                effect_name = "particles/units/heroes/hero_visage/visage_soul_assumption_bolt" + damage_bars + ".vpcf";
            }
            let assumption_stack_modifiers = this.GetCasterPlus().FindAllModifiersByName("modifier_imba_visage_soul_assumption_stacks");
            for (const [_, mod] of GameFunc.iPair(assumption_stack_modifiers)) {
                mod.Destroy();
            }
            assumption_counter_modifier.Destroy();
        }
        let projectile: CreateTrackingProjectileOptions = {
            Target: undefined,
            Source: this.GetCasterPlus(),
            Ability: this,
            EffectName: effect_name,
            iMoveSpeed: math.min(this.GetSpecialValueFor("bolt_speed") + overflow_counter, this.GetSpecialValueFor("soul_accelerant_max")),
            vSourceLoc: this.GetCasterPlus().GetAbsOrigin(),
            bDrawsOnMinimap: false,
            bDodgeable: true,
            bIsAttack: false,
            bVisibleToEnemies: true,
            bReplaceExisting: false,
            flExpireTime: GameRules.GetGameTime() + 10.0,
            bProvidesVision: false,
            iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_ATTACK_1,
            ExtraData: {
                charges: damage_bars
            }
        }
        projectile.Target = target;
        ProjectileManager.CreateTrackingProjectile(projectile);
        let target_counter = 1;
        let enemy_heroes = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), target.GetAbsOrigin(), undefined, this.GetCastRange(this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus()) + this.GetCasterPlus().GetCastRangeBonus(), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, enemy] of GameFunc.iPair(enemy_heroes)) {
            if (target_counter >= this.GetTalentSpecialValueFor("targets")) {
                return;
            }
            if (enemy != target) {
                projectile.Target = enemy;
                ProjectileManager.CreateTrackingProjectile(projectile);
                target_counter = target_counter + 1;
            }
        }
        if (target_counter < this.GetTalentSpecialValueFor("targets")) {
            let enemy_creeps = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), target.GetAbsOrigin(), undefined, this.GetCastRange(this.GetCasterPlus().GetAbsOrigin(), this.GetCasterPlus()) + this.GetCasterPlus().GetCastRangeBonus(), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(enemy_creeps)) {
                if (target_counter >= this.GetTalentSpecialValueFor("targets")) {
                    return;
                }
                if (enemy != target) {
                    projectile.Target = enemy;
                    ProjectileManager.CreateTrackingProjectile(projectile);
                    target_counter = target_counter + 1;
                }
            }
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, data: any): boolean | void {
        if (target && !target.TriggerSpellAbsorb(this)) {
            target.EmitSound("Hero_Visage.SoulAssumption.Target");
            let damageTable = {
                victim: target,
                damage: this.GetSpecialValueFor("soul_base_damage") + (this.GetTalentSpecialValueFor("soul_charge_damage") * data.charges),
                damage_type: this.GetAbilityDamageType(),
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                attacker: this.GetCasterPlus(),
                ability: this
            }
            ApplyDamage(damageTable);
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
export class modifier_imba_visage_soul_assumption extends BaseModifier_Plus {
    public particle: ParticleID;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetAbilityPlus() && this.GetAbilityPlus().GetLevel() >= 1 && !this.particle) {
            this.particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_visage/visage_soul_overhead.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus());
            this.AddParticle(this.particle, false, false, -1, false, false);
        }
    }
    BeDestroy(): void {
        if (IsServer() && this.particle) {
            ParticleManager.DestroyParticle(this.particle, true);
            ParticleManager.ReleaseParticleIndex(this.particle);
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
        if ((keys.unit.GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).Length2D() <= this.GetSpecialValueFor("radius") && (keys.attacker.IsControllableByAnyPlayer() /**|| keys.attacker.IsRoshan()*/) && (keys.unit.IsRealUnit() || keys.attacker.GetUnitName().includes("npc_imba_visage_familiar")) && keys.unit != keys.attacker && keys.damage >= this.GetSpecialValueFor("damage_min") && keys.damage <= this.GetSpecialValueFor("damage_max") && keys.inflictor != this.GetAbilityPlus()) {
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_visage_soul_assumption_counter", {
                duration: this.GetSpecialValueFor("stack_duration"),
                stacks: keys.damage
            });
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_visage_soul_assumption_stacks", {
                duration: this.GetSpecialValueFor("stack_duration"),
                stacks: keys.damage
            });
        }
    }
}
@registerModifier()
export class modifier_imba_visage_soul_assumption_stacks extends BaseModifier_Plus {
    public damage_limit: number;
    public stack_limit: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(params: any): void {
        if (!IsServer()) {
            return;
        }
        this.damage_limit = this.GetSpecialValueFor("damage_limit");
        this.stack_limit = this.GetSpecialValueFor("stack_limit");
        this.SetStackCount(params.stacks);
        let assumption_modifier = this.GetParentPlus().FindModifierByNameAndCaster("modifier_imba_visage_soul_assumption", this.GetCasterPlus()) as modifier_imba_visage_soul_assumption;
        let assumption_counter_modifier = this.GetParentPlus().FindModifierByNameAndCaster("modifier_imba_visage_soul_assumption_counter", this.GetCasterPlus());
        if (assumption_modifier && assumption_modifier.particle && assumption_counter_modifier) {
            assumption_counter_modifier.SetStackCount(assumption_counter_modifier.GetStackCount() + params.stacks);
            for (let bar = 1; bar <= this.stack_limit; bar++) {
                ParticleManager.SetParticleControl(assumption_modifier.particle, bar, Vector(assumption_counter_modifier.GetStackCount() - (this.damage_limit * bar), 0, 0));
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        let assumption_modifier = this.GetParentPlus().FindModifierByNameAndCaster("modifier_imba_visage_soul_assumption", this.GetCasterPlus()) as modifier_imba_visage_soul_assumption;
        let assumption_counter_modifier = this.GetParentPlus().FindModifierByNameAndCaster("modifier_imba_visage_soul_assumption_counter", this.GetCasterPlus());
        if (assumption_counter_modifier) {
            assumption_counter_modifier.SetStackCount(assumption_counter_modifier.GetStackCount() - this.GetStackCount());
            if (assumption_modifier && assumption_modifier.particle) {
                for (let bar = 1; bar <= this.stack_limit; bar++) {
                    ParticleManager.SetParticleControl(assumption_modifier.particle, bar, Vector(assumption_counter_modifier.GetStackCount() - (this.damage_limit * bar), 0, 0));
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_visage_soul_assumption_counter extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
}
@registerAbility()
export class imba_visage_gravekeepers_cloak extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_imba_visage_gravekeepers_cloak";
    }
    OnUpgrade(): void {
        let cloak_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_visage_gravekeepers_cloak", this.GetCasterPlus()) as modifier_imba_visage_gravekeepers_cloak;
        if (cloak_modifier) {
            if (this.GetLevel() >= 1 && !cloak_modifier.initialized) {
                cloak_modifier.SetStackCount(this.GetSpecialValueFor("max_layers"));
                cloak_modifier.initialized = true;
            }
        }
    }
    OnSpellStart(): void {
    }
}
@registerModifier()
export class modifier_imba_visage_gravekeepers_cloak extends BaseModifier_Plus {
    public cloak_particle: any;
    initialized: boolean = false;
    IsHidden(): boolean {
        return this.GetAbilityPlus() == undefined || this.GetAbilityPlus().GetLevel() < 1;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.cloak_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_visage/visage_cloak_ambient.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        for (let layer = 2; layer <= 5; layer++) {
            ParticleManager.SetParticleControl(this.cloak_particle, layer, Vector(1, 0, 0));
        }
        this.AddParticle(this.cloak_particle, false, false, -1, false, false);
        this.StartIntervalThink(this.GetAbilityPlus().GetTalentSpecialValueFor("recovery_time"));
    }
    OnIntervalThink(): void {
        if (this.GetStackCount() < this.GetSpecialValueFor("max_layers")) {
            this.IncrementStackCount();
            for (let layer = 2; layer <= 5; layer++) {
                if (this.GetStackCount() + 1 >= layer) {
                    ParticleManager.SetParticleControl(this.cloak_particle, layer, Vector(1, 0, 0));
                } else {
                    ParticleManager.SetParticleControl(this.cloak_particle, layer, Vector(0, 0, 0));
                }
            }
        } else {
            let allies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false);
            for (const [_, ally] of GameFunc.iPair(allies)) {
                if (ally != this.GetParentPlus() && !ally.GetUnitName().includes("npc_imba_visage_familiar")) {
                    let secondary_cloak_modifier = ally.FindModifierByNameAndCaster("modifier_imba_visage_gravekeepers_cloak_secondary_ally", this.GetCasterPlus());
                    if (!secondary_cloak_modifier || secondary_cloak_modifier.GetStackCount() < this.GetSpecialValueFor("max_layers")) {
                        ally.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_visage_gravekeepers_cloak_secondary_ally", {});
                        return;
                    }
                }
            }
        }
        this.StartIntervalThink(-1);
        this.StartIntervalThink(this.GetAbilityPlus().GetTalentSpecialValueFor("recovery_time"));
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(keys: ModifierAttackEvent): number {
        if (!this.GetParentPlus().PassivesDisabled() && keys.attacker.IsControllableByAnyPlayer() && keys.attacker != this.GetParentPlus() && keys.damage > this.GetSpecialValueFor("minimum_damage") && this.GetStackCount() > 0) {
            this.DecrementStackCount();
            for (let layer = 2; layer <= 5; layer++) {
                if (this.GetStackCount() + 1 >= layer) {
                    ParticleManager.SetParticleControl(this.cloak_particle, layer, Vector(1, 0, 0));
                } else {
                    ParticleManager.SetParticleControl(this.cloak_particle, layer, Vector(0, 0, 0));
                }
            }
            return this.GetSpecialValueFor("damage_reduction") * (this.GetStackCount() + 1) * (-1);
        } else {
            return 0;
        }
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_visage_gravekeepers_cloak_secondary";
    }
    GetAuraEntityReject(hTarget: CDOTA_BaseNPC): boolean {
        return this.GetCasterPlus().PassivesDisabled() || !hTarget.GetOwnerPlus() || hTarget.GetOwnerPlus() !== this.GetCasterPlus() || !hTarget.GetUnitName().includes("npc_imba_visage_familiar");
    }
}
@registerModifier()
export class modifier_imba_visage_gravekeepers_cloak_secondary extends BaseModifier_Plus {
    public damage_reduction: number;
    public familiar_max_damage_reduction: number;
    BeCreated(p_0: any,): void {
        this.damage_reduction = this.GetSpecialValueFor("damage_reduction");
        this.familiar_max_damage_reduction = this.GetSpecialValueFor("familiar_max_damage_reduction");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(keys: ModifierAttackEvent): number {
        return math.min(this.GetCasterPlus().findBuffStack("modifier_imba_visage_gravekeepers_cloak", this.GetCasterPlus()) * this.damage_reduction, this.familiar_max_damage_reduction) * (-1);
    }
}
@registerModifier()
export class modifier_imba_visage_gravekeepers_cloak_secondary_ally extends BaseModifier_Plus {
    public minimum_damage: number;
    public damage_reduction: number;
    IsPurgable(): boolean {
        return false;
    }
    Init(p_0: any,): void {
        this.minimum_damage = this.GetSpecialValueFor("minimum_damage");
        this.damage_reduction = this.GetSpecialValueFor("damage_reduction");
        if (!IsServer()) {
            return;
        }
        this.IncrementStackCount();
    }

    OnStackCountChanged(stackCount: number): void {
        if (this.GetStackCount() <= 0) {
            this.StartIntervalThink(FrameTime());
        }
    }
    OnIntervalThink(): void {
        this.StartIntervalThink(-1);
        this.Destroy();
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(keys: ModifierAttackEvent): number {
        if (keys.attacker.IsControllableByAnyPlayer() && keys.attacker != this.GetParentPlus() && keys.damage > this.minimum_damage && this.GetStackCount() > 0) {
            this.DecrementStackCount();
            return this.damage_reduction * (this.GetStackCount() + 1) * (-1);
        } else {
            return 0;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.damage_reduction * this.GetStackCount();
    }
}
@registerAbility()
export class imba_visage_stone_form_self_cast extends BaseAbility_Plus {
    IsStealable(): boolean {
        return false;
    }
    ProcsMagicStick(): boolean {
        return false;
    }
    GetAssociatedSecondaryAbilities(): string {
        return "imba_visage_summon_familiars";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_visage_stone_form_self_cast";
    }
    OnSpellStart(): void {
        let allies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_CLOSEST, false);
        for (const [_, ally] of GameFunc.iPair(allies)) {
            if (ally.GetUnitName().includes("npc_imba_visage_familiar")) {
                let stone_form_ability = ally.findAbliityPlus<imba_visage_summon_familiars_stone_form>("imba_visage_summon_familiars_stone_form");
                if (stone_form_ability && stone_form_ability.IsCooldownReady() && !(ally.IsStunned() || ally.IsSilenced() || ally.IsNightmared() || ally.IsOutOfGame())) {
                    stone_form_ability.CastAbility();
                    return;
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_visage_stone_form_self_cast extends BaseModifier_Plus {
    public summon_familiars_ability: any;
    public lowest_cooldown: number;
    public stone_form_ability: any;
    public bValidFamiliars: any;
    IsHidden(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.summon_familiars_ability = this.GetCasterPlus().findAbliityPlus<imba_visage_summon_familiars>("imba_visage_summon_familiars");
        this.lowest_cooldown = 99;
        this.stone_form_ability = undefined;
        this.StartIntervalThink(0.1);
    }
    OnIntervalThink(): void {
        if (this.summon_familiars_ability && this.summon_familiars_ability.familiar_table) {
            this.bValidFamiliars = false;
            for (let num = 0; num < GameFunc.GetCount(this.summon_familiars_ability.familiar_table); num++) {
                if (this.summon_familiars_ability.familiar_table[num] && EntIndexToHScript(this.summon_familiars_ability.familiar_table[num]) && EntIndexToHScript(this.summon_familiars_ability.familiar_table[num]).IsAlive()) {
                    this.bValidFamiliars = true;
                    return;
                }
            }
            if (!this.bValidFamiliars) {
                this.GetAbilityPlus().SetActivated(false);
                return;
            } else {
                this.GetAbilityPlus().SetActivated(true);
            }
            this.lowest_cooldown = 99;
            let allies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_CLOSEST, false);
            for (const [_, ally] of GameFunc.iPair(allies)) {
                if (ally.GetUnitName().includes("npc_imba_visage_familiar")) {
                    this.stone_form_ability = ally.findAbliityPlus<imba_visage_summon_familiars_stone_form>("imba_visage_summon_familiars_stone_form");
                    if (this.stone_form_ability && this.stone_form_ability.GetCooldownTimeRemaining() <= this.lowest_cooldown) {
                        this.lowest_cooldown = this.stone_form_ability.GetCooldownTimeRemaining();
                    }
                }
            }
            this.GetAbilityPlus().EndCooldown();
            this.GetAbilityPlus().StartCooldown(this.lowest_cooldown);
        } else {
            this.GetAbilityPlus().SetActivated(false);
            this.summon_familiars_ability = this.GetCasterPlus().findAbliityPlus<imba_visage_summon_familiars>("imba_visage_summon_familiars");
        }
    }
}
@registerAbility()
export class imba_visage_summon_familiars extends BaseAbility_Plus {
    public responses: { [K: string]: string };
    public familiar_table: EntityIndex[];
    GetAssociatedPrimaryAbilities(): string {
        return "imba_visage_stone_form_self_cast";
    }
    OnUpgrade(): void {
        let stone_form_self_cast_ability = this.GetCasterPlus().findAbliityPlus<imba_visage_stone_form_self_cast>("imba_visage_stone_form_self_cast");
        if (stone_form_self_cast_ability) {
            stone_form_self_cast_ability.SetLevel(this.GetLevel());
        }
        let become_familiar_ability = this.GetCasterPlus().findAbliityPlus<imba_visage_become_familiar>("imba_visage_become_familiar");
        if (become_familiar_ability) {
            become_familiar_ability.SetLevel(this.GetLevel());
        }
    }
    OnSpellStart(): void {
        this.GetCasterPlus().EmitSound("Hero_Visage.SummonFamiliars.Cast");
        if (this.GetCasterPlus().GetUnitName().includes("visage")) {
            if (!this.responses) {
                this.responses = {
                    "1": "visage_visa_summon_03",
                    "2": "visage_visa_summon_04"
                }
            }
            if (this.responses) {
                this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(this.responses));
            }
        }
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_4);
        let unit_count = this.GetSpecialValueFor("initial_familiar_count");
        if (this.GetCasterPlus().GetLevel() >= 25) {
            unit_count = this.GetSpecialValueFor("familiars_at_level_25");
        }
        if (this.GetCasterPlus().HasScepter()) {
            unit_count = unit_count + 1;
        }
        if (this.familiar_table) {
            for (let num = 0; num < GameFunc.GetCount(this.familiar_table); num++) {
                let unit = EntIndexToHScript(this.familiar_table[num]) as IBaseNpc_Plus;
                if (this.familiar_table[num] && unit && unit.IsNull && !unit.IsNull() && unit.IsAlive()) {
                    unit.ForceKill(false);
                }
            }
        }
        this.familiar_table = []
        let familiar = undefined;
        let spawn_location: Vector = undefined;
        let stone_form_ability = undefined;
        let summon_particle = undefined;
        for (let num = 1; num <= unit_count; num++) {
            spawn_location = this.GetCasterPlus().GetAbsOrigin() + (this.GetCasterPlus().GetForwardVector() * 200) + (this.GetCasterPlus().GetRightVector() * ((math.max(unit_count - 1, 0) * 120) * (-0.5 + ((math.max(num - 1, 0)) / (unit_count - 1))))) as Vector;
            familiar = this.GetCasterPlus().CreateSummon("npc_imba_visage_familiar" + math.min(this.GetLevel(), 3), spawn_location, -1, true);
            summon_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_visage/visage_summon_familiars.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, familiar);
            ParticleManager.ReleaseParticleIndex(summon_particle);
            familiar.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_visage_summon_familiars", {});
            familiar.SetForwardVector(this.GetCasterPlus().GetForwardVector());
            stone_form_ability = familiar.findAbliityPlus<imba_visage_summon_familiars_stone_form>("imba_visage_summon_familiars_stone_form");
            if (stone_form_ability) {
                stone_form_ability.SetLevel(this.GetLevel());
            }
            familiar.SetOwner(this.GetCasterPlus());
            familiar.SetTeam(this.GetCasterPlus().GetTeam());
            // familiar.SetControllableByPlayer(this.GetCasterPlus().GetPlayerID(), false);
            familiar.SetBaseMaxHealth(this.GetSpecialValueFor("familiar_hp"));
            familiar.SetMaxHealth(this.GetSpecialValueFor("familiar_hp"));
            familiar.SetHealth(this.GetSpecialValueFor("familiar_hp"));
            familiar.SetPhysicalArmorBaseValue(this.GetSpecialValueFor("familiar_armor"));
            familiar.SetBaseMoveSpeed(this.GetTalentSpecialValueFor("familiar_speed"));
            familiar.SetBaseDamageMin(this.GetTalentSpecialValueFor("familiar_attack_damage"));
            familiar.SetBaseDamageMax(this.GetTalentSpecialValueFor("familiar_attack_damage"));
            this.familiar_table.push(familiar.entindex());
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_visage_summon_familiars_bonus_move_speed") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_visage_summon_familiars_bonus_move_speed")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_visage_summon_familiars_bonus_move_speed"), "modifier_special_bonus_imba_visage_summon_familiars_bonus_move_speed", {});
        }
    }
    GetManaCost(level: number): number {
        return 100;
    }
    AutoSpellSelf() {
        return AI_ability.NO_TARGET_cast(this);
    }
}
@registerModifier()
export class modifier_imba_visage_summon_familiars extends BaseModifier_Plus {
    public unfeeling_status_resistance: any;
    public petrifying_breath_duration: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.unfeeling_status_resistance = this.GetSpecialValueFor("unfeeling_status_resistance");
        this.petrifying_breath_duration = this.GetSpecialValueFor("petrifying_breath_duration");
        if (!IsServer()) {
            return;
        }
        this.StartIntervalThink(FrameTime());
    }
    OnIntervalThink(): void {
        if (!this.GetAbilityPlus() || !GFuncEntity.IsValid(this.GetCasterPlus())) {
            this.StartIntervalThink(-1);
            this.GetParentPlus().ForceKill(false);
            return;
        }
        let allies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.GetParentPlus().GetHullRadius(), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED, FindOrder.FIND_ANY_ORDER, false);
        for (const [_, ally] of GameFunc.iPair(allies)) {
            if (ally != this.GetParentPlus() && ally.GetUnitName().includes("visage_familiar") && !ally.IsMoving()) {
                ally.SetAbsOrigin(GetGroundPosition(ally.GetAbsOrigin() + (ally.GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin()) as Vector, ally));
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_FLYING]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.unfeeling_status_resistance;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus()) {
            keys.target.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_imba_visage_summon_familiars_petrifying_breath", {
                duration: this.petrifying_breath_duration * (1 - keys.target.GetStatusResistance())
            });
        }
    }
}
@registerModifier()
export class modifier_imba_visage_summon_familiars_petrifying_breath extends BaseModifier_Plus {
    public petrifying_breath_reduction_per_stack: number;
    IsPurgable(): boolean {
        return false;
    }
    Init(p_0: any,): void {
        if (this.GetAbilityPlus()) {
            this.petrifying_breath_reduction_per_stack = this.GetSpecialValueFor("petrifying_breath_reduction_per_stack");
        } else {
            this.petrifying_breath_reduction_per_stack = 0;
        }
        if (!IsServer()) {
            return;
        }
        this.IncrementStackCount();
    }

    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        return this.petrifying_breath_reduction_per_stack * this.GetStackCount() * (-1);
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.petrifying_breath_reduction_per_stack * this.GetStackCount() * (-1);
    }
}
@registerAbility()
export class imba_visage_summon_familiars_stone_form extends BaseAbility_Plus {
    ProcsMagicStick(): boolean {
        return false;
    }
    OnSpellStart(): void {
        let summon_familiars_ability = this.GetCasterPlus().GetOwnerPlus().findAbliityPlus<imba_visage_summon_familiars>("imba_visage_summon_familiars");
        if (!summon_familiars_ability) {
            this.SetHidden(true);
            return;
        }
        this.GetCasterPlus().StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_CAST_ABILITY_1, 1);
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_visage_summon_familiars_stone_form_root", {
            duration: this.GetSpecialValueFor("stun_delay")
        });
    }
}
@registerModifier()
export class modifier_imba_visage_summon_familiars_stone_form_root extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    BeDestroy(): void {
        if (!IsServer() || !this.GetAbilityPlus() || this.GetRemainingTime() > 0) {
            return;
        }
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_visage_summon_familiars_stone_form_buff", {
            duration: this.GetSpecialValueFor("stone_duration")
        });
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_SILENCED]: true
        }
        return state;
    }
}
@registerModifier()
export class modifier_imba_visage_summon_familiars_stone_form_buff extends BaseModifier_Plus {
    public hp_regen: any;
    public stun_radius: number;
    public stun_damage: number;
    public stun_duration: number;
    public stone_duration: number;
    public counter: number;
    public stone_form_overhead_particle: any;
    GetEffectName(): string {
        return "particles/units/heroes/hero_visage/visage_stone_form_area_energy.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (!this.GetAbilityPlus()) {
            this.Destroy();
            return;
        }
        this.hp_regen = this.GetSpecialValueFor("hp_regen");
        if (!IsServer()) {
            return;
        }
        this.stun_radius = this.GetSpecialValueFor("stun_radius");
        this.stun_damage = this.GetSpecialValueFor("stun_damage");
        this.stun_duration = this.GetSpecialValueFor("stun_duration");
        this.stone_duration = this.GetSpecialValueFor("stone_duration");
        this.GetParentPlus().EmitSound("Visage_Familar.StoneForm.Cast");
        let stone_form_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_visage/visage_stone_form.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetCasterPlus());
        this.AddParticle(stone_form_particle, false, false, -1, false, false);
        GridNav.DestroyTreesAroundPoint(this.GetParentPlus().GetAbsOrigin(), this.GetParentPlus().GetHullRadius(), true);
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.stun_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
        let damageTable: ApplyDamageOptions = {
            victim: undefined,
            damage: this.stun_damage,
            damage_type: this.GetAbilityPlus().GetAbilityDamageType(),
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.GetParentPlus(),
            ability: this.GetAbilityPlus()
        }
        let stun_modifier = undefined;
        if (GameFunc.GetCount(enemies) >= 1) {
            this.GetParentPlus().EmitSound("Visage_Familar.StoneForm.Stun");
        }
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            enemy.AddNewModifier(this.GetParentPlus(), this.GetAbilityPlus(), "modifier_generic_stunned", {
                duration: this.stun_duration * (1 - enemy.GetStatusResistance())
            });
            damageTable.victim = enemy;
            ApplyDamage(damageTable);
        }
        this.counter = this.stone_duration;
        this.StartIntervalThink(1);
    }
    OnIntervalThink(): void {
        this.counter = this.counter - 1;
        this.stone_form_overhead_particle = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_visage/visage_stoneform_overhead_timer.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus(), this.GetParentPlus().GetTeamNumber());
        ParticleManager.SetParticleControl(this.stone_form_overhead_particle, 1, Vector(0, this.counter, 0));
        ParticleManager.SetParticleControl(this.stone_form_overhead_particle, 2, Vector(1, 0, 0));
        ParticleManager.ReleaseParticleIndex(this.stone_form_overhead_particle);
    }
    BeDestroy(): void {
        let stone_form_transform_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_visage/visage_familiar_transform.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.ReleaseParticleIndex(stone_form_transform_particle);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        if (!IsServer()) {
            return;
        }
        let state = {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.VISUAL_Z_DELTA
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.hp_regen;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.VISUAL_Z_DELTA)
    CC_GetVisualZDelta(): number {
        return 0;
    }
}
@registerAbility()
export class imba_visage_become_familiar extends BaseAbility_Plus {
    IsStealable(): boolean {
        return false;
    }
    OnSpellStart(): void {
        this.SetActivated(false);
        this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_visage_become_familiar_delay", {
            duration: this.GetSpecialValueFor("familiar_transform_delay")
        });
    }
}
@registerModifier()
export class modifier_imba_visage_become_familiar_delay extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_spirit_breaker/spirit_breaker_haste_owner_dark.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().EmitSound("Visage_Familar.BellToll");
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        let become_familiar_modifier = this.GetCasterPlus().FindModifierByNameAndCaster("modifier_imba_visage_become_familiar", this.GetCasterPlus());
        if (!become_familiar_modifier) {
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_visage_become_familiar", {});
        } else {
            become_familiar_modifier.Destroy();
        }
        this.GetAbilityPlus().SetActivated(true);
    }
}
@registerModifier()
export class modifier_imba_visage_become_familiar extends BaseModifier_Plus {
    public familiar_speed: number;
    public familiar_attack_damage: number;
    public familiar_attack_rate: any;
    public familiar_vision_daytime: number;
    public familiar_vision_nighttime: number;
    public familiar_projectile_speed: number;
    public familiar_armor: any;
    public familiar_movement_turn_rate: any;
    public familiar_attack_range: number;
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        this.familiar_speed = this.GetAbilityPlus().GetTalentSpecialValueFor("familiar_speed");
        this.familiar_attack_damage = this.GetSpecialValueFor("familiar_attack_damage");
        this.familiar_attack_rate = this.GetSpecialValueFor("familiar_attack_rate");
        this.familiar_vision_daytime = this.GetSpecialValueFor("familiar_vision_daytime");
        this.familiar_vision_nighttime = this.GetSpecialValueFor("familiar_vision_nighttime");
        this.familiar_projectile_speed = this.GetSpecialValueFor("familiar_projectile_speed");
        this.familiar_armor = this.GetSpecialValueFor("familiar_armor");
        this.familiar_movement_turn_rate = this.GetSpecialValueFor("familiar_movement_turn_rate");
        this.familiar_attack_range = this.GetSpecialValueFor("familiar_attack_range");
        if (!IsServer()) {
            return;
        }
        this.StartIntervalThink(0.1);
    }
    OnIntervalThink(): void {
        if (!GameRules.IsDaytime()) {
            AddFOWViewer(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), this.familiar_vision_daytime, 0.1, false);
        } else {
            AddFOWViewer(this.GetParentPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), this.familiar_vision_nighttime, 0.1, false);
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_FLYING]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_MUTED]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_NAME,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BASE_OVERRIDE,
            4: GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_OVERRIDE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE)
    CC_GetModifierModelChange(): string {
        return "models/items/visage/immortal_familiar/immortal_familiar.vmdl";
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_NAME)
    CC_GetModifierProjectileName(): string {
        return "particles/econ/items/visage/immortal_familiar/visage_immortal_ti5/visage_familiar_base_attack_ti5.vpcf";
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BASE_OVERRIDE)
    CC_GetModifierMoveSpeedOverride(): number {
        return this.familiar_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TURN_RATE_OVERRIDE)
    CC_GetModifierTurnRate_Override(): number {
        return this.familiar_movement_turn_rate;
    }
}
@registerModifier()
export class modifier_special_bonus_imba_visage_soul_assumption_extra_targets extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_visage_soul_assumption_charge_damage extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_visage_gravekeepers_cloak_cd_reduction extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_visage_summon_familiars_bonus_move_speed extends BaseModifier_Plus {
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
