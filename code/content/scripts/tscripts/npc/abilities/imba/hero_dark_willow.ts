
import { AI_ability } from "../../../ai/AI_ability";
import { GameFunc } from "../../../GameFunc";
import { AoiHelper } from "../../../helper/AoiHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

@registerAbility()
export class imba_dark_willow_bramble_maze extends BaseAbility_Plus {
    IsStealable(): boolean {
        return true;
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
        EmitSoundOn("Hero_DarkWillow.Brambles.Cast", caster);
        EmitSoundOnLocationWithCaster(point, "Hero_DarkWillow.Brambles.CastTarget", caster);
        this.GrowMaze(point);
    }
    PlantBush(vLocation: Vector) {
        let caster = this.GetCasterPlus();
        let point = vLocation;
        let duration = this.GetSpecialValueFor("duration");
        let bush = BaseModifier_Plus.CreateBuffThinker(caster, this, "modifier_imba_dark_willow_bramble_maze", {
            duration: duration
        }, point, caster.GetTeam(), false);
    }
    GrowMaze(vLocation: Vector) {
        let caster = this.GetCasterPlus();
        let point = vLocation;
        let direction = GFuncVector.CalculateDirection(point, caster.GetAbsOrigin());
        let radius = this.GetSpecialValueFor("radius");
        let duration = this.GetSpecialValueFor("duration");
        let limit = this.GetSpecialValueFor("max_count");
        let nfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_dark_willow/dark_willow_bramble_cast.vpcf", ParticleAttachment_t.PATTACH_POINT, caster);
        ParticleManager.SetParticleControlEnt(nfx, 0, caster, ParticleAttachment_t.PATTACH_POINT, "attach_attack1", caster.GetAbsOrigin(), true);
        ParticleManager.SetParticleControl(nfx, 1, point);
        ParticleManager.SetParticleControl(nfx, 2, Vector(radius, 0, 0));
        let spawn_point1 = point + direction * radius / 2 as Vector;
        let spawn_point2 = point + direction * radius as Vector;
        let cap = (limit - 1) / 2;
        let innerCap = math.floor(cap);
        let outerCap = math.ceil(cap);
        this.PlantBush(point);
        for (let i = 1; i <= innerCap; i += 1) {
            let qAngle = QAngle(0, i * 360 / innerCap, 0);
            let newSpawn = RotatePosition(point, qAngle, spawn_point1);
            this.PlantBush(newSpawn);
        }
        for (let i = 1; i <= outerCap; i += 1) {
            let qAngle = QAngle(0, 45 + i * 360 / outerCap, 0);
            let newSpawn = RotatePosition(point, qAngle, spawn_point2);
            this.PlantBush(newSpawn);
        }
        this.AddTimer(duration, () => {
            ParticleManager.ClearParticle(nfx, false);
        });
    }
    GetManaCost(level: number): number {
        return 0;
    }

    AutoSpellSelf() {
        return AI_ability.POSITION_most_enemy(this);
    }

}
@registerModifier()
export class modifier_imba_dark_willow_bramble_maze extends BaseModifier_Plus {
    public talent2: boolean;
    public talent2Radius: number;
    public radius: number;
    public duration: number;
    BeCreated(table: any): void {
        let caster = this.GetCasterPlus();
        this.talent2 = caster.HasTalent("special_bonus_unique_imba_dark_willow_bramble_maze_2") != null;
        this.talent2Radius = caster.GetTalentValue("special_bonus_unique_imba_dark_willow_bramble_maze_2", "radius");
        if (IsServer()) {
            let point = this.GetParentPlus().GetAbsOrigin();
            EmitSoundOn("Hero_DarkWillow.Bramble.Spawn", this.GetParentPlus());
            EmitSoundOn("Hero_DarkWillow.BrambleLoop", this.GetParentPlus());
            this.radius = this.GetSpecialValueFor("latch_range");
            this.duration = this.GetSpecialValueFor("debuff_duration");
            let nfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_dark_willow/dark_willow_bramble_wraith.vpcf", ParticleAttachment_t.PATTACH_POINT, caster);
            ParticleManager.SetParticleControl(nfx, 0, point);
            ParticleManager.SetParticleControl(nfx, 1, Vector(this.radius, this.radius, this.radius));
            this.AddParticle(nfx, false, false, 0, false, false);
            this.StartIntervalThink(this.GetSpecialValueFor("delay"));
        }
    }
    OnIntervalThink(): void {
        let caster = this.GetCasterPlus();
        let ability = this.GetAbilityPlus();
        let point = this.GetParentPlus().GetAbsOrigin();
        let enemies = AoiHelper.FindEntityInRadius(caster.GetTeam(), point, this.radius);
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (!enemy.HasModifier("modifier_imba_dark_willow_bramble_maze_damage")) {
                EmitSoundOn("Hero_DarkWillow.Bramble.Target.Layer", this.GetParentPlus());
                if (!enemy.TriggerSpellAbsorb(this.GetAbilityPlus())) {
                    let duration = this.duration;
                    // if (enemy.IsMinion()) {
                    //     duration = duration * 3;
                    // }
                    enemy.AddNewModifier(caster, ability, "modifier_imba_dark_willow_bramble_maze_damage", {
                        duration: duration
                    });
                }
                this.Destroy();
                return;
            }
        }
        this.StartIntervalThink(0.1);
    }
    BeRemoved(): void {
        if (IsServer()) {
            StopSoundOn("Hero_DarkWillow.BrambleLoop", this.GetParentPlus());
            EmitSoundOn("Hero_DarkWillow.Bramble.Destroy", this.GetParentPlus());
        }
    }
    IsAura(): boolean {
        return this.talent2;
    }
    GetModifierAura(): string {
        return "modifier_imba_dark_willow_bramble_maze_talent";
    }
    GetAuraRadius(): number {
        return this.talent2Radius;
    }
    GetAuraDuration(): number {
        return 0.5;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
}
@registerModifier()
export class modifier_imba_dark_willow_bramble_maze_talent extends BaseModifier_Plus {
    public resist: any;
    BeCreated(p_0: any,): void {
        this.resist = this.GetCasterPlus().GetTalentValue("special_bonus_unique_imba_dark_willow_bramble_maze_2");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING,
            2: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.resist;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(p_0: ModifierAttackEvent,): number {
        return this.resist * (-1);
    }
}
@registerModifier()
export class modifier_imba_dark_willow_bramble_maze_damage extends BaseModifier_Plus {
    public damage: number;
    public lifesteal: any;
    BeCreated(table: any): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let parent = this.GetParentPlus();
            EmitSoundOn("Hero_DarkWillow.Bramble.Target", this.GetParentPlus());
            this.damage = this.GetSpecialValueFor("damage") * 0.5;
            this.lifesteal = caster.GetTalentValue("special_bonus_unique_imba_dark_willow_bramble_maze_1");
            let radius = this.GetSpecialValueFor("latch_range");
            let nfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_dark_willow/dark_willow_bramble.vpcf", ParticleAttachment_t.PATTACH_POINT, caster);
            ParticleManager.SetParticleControlEnt(nfx, 0, parent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(nfx, 0, parent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true);
            this.AddParticle(nfx, false, false, 0, false, false);
            this.StartIntervalThink(0.5);
        }
    }
    BeRefresh(table: any): void {
        if (IsServer()) {
            this.lifesteal = this.GetCasterPlus().GetTalentValue("special_bonus_unique_imba_dark_willow_bramble_maze_1");
            this.damage = this.GetSpecialValueFor("damage") * 0.5;
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (caster.HasTalent("special_bonus_unique_imba_dark_willow_bramble_maze_1")) {
                this.GetCasterPlus().Lifesteal(this.GetAbilityPlus(), this.lifesteal, this.damage, this.GetParentPlus(), this.GetAbilityPlus().GetAbilityDamageType(), DamageCategory_t.DOTA_DAMAGE_CATEGORY_SPELL, true);
            } else {
                this.GetAbilityPlus().DealDamage(this.GetCasterPlus(), this.GetParentPlus(), this.damage, {}, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_POISON_DAMAGE);
            }
        }
    }
    IsDebuff(): boolean {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_INVISIBLE]: false
        };
    }
}

@registerAbility()
export class imba_dark_willow_shadow_realm extends BaseAbility_Plus {
    projectiles: { [key: string]: { damage: number } } = {};
    damage: number;
    IsStealable(): boolean {
        return true;
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    // GetManaCost(iLvl: number): number {
    //     return super.GetManaCost(iLvl);
    // }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        caster.AddNewModifier(caster, this, "modifier_imba_dark_willow_shadow_realm", {
            duration: this.GetSpecialValueFor("duration")
        });
    }
    OnProjectileHitHandle(hTarget: IBaseNpc_Plus, vLocation: Vector, iProjectile: ProjectileID) {
        let caster = this.GetCasterPlus();
        let damage = this.projectiles[iProjectile + ""].damage;
        if (hTarget) {
            EmitSoundOn("Hero_DarkWillow.Shadow_Realm.Damage", caster);
            this.DealDamage(caster, hTarget, damage, {}, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE);
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }

    AutoSpellSelf() {
        return AI_ability.NO_TARGET_cast(this);
    }
}
@registerModifier()
export class modifier_imba_dark_willow_shadow_realm extends BaseModifier_Plus {
    public attack_range_bonus: number;
    public max_damage: number;
    public damage: number;
    public damageGrowth: number;
    public bonus_as: number;
    public bonus_asGrowth: number;
    public talent2: any;
    public talent1: boolean;
    BeCreated(table: any): void {
        this.attack_range_bonus = this.GetSpecialValueFor("attack_range_bonus");
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let parent = this.GetParentPlus();
            let ability = this.GetAbilityPlus();
            this.max_damage = this.GetSpecialValueFor("max_damage");
            this.damage = 0;
            this.damageGrowth = this.GetSpecialValueFor("max_damage") * 0.1 / this.GetSpecialValueFor("max_delay");
            if (caster.HasTalent("special_bonus_unique_imba_dark_willow_shadow_realm_2")) {
                this.bonus_as = 0;
                this.bonus_asGrowth = caster.GetTalentValue("special_bonus_unique_imba_dark_willow_shadow_realm_2") * 0.1 / this.GetDuration();
                this.talent2 = true;
            }
            this.talent1 = caster.HasTalent("special_bonus_unique_imba_dark_willow_shadow_realm_1") != null;
            this.StartIntervalThink(0.1);
        }
    }
    BeRefresh(table: any): void {
        this.attack_range_bonus = this.GetSpecialValueFor("attack_range_bonus");
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            this.GetAbilityPlus<imba_dark_willow_shadow_realm>().damage = 0;
            this.damage = this.GetSpecialValueFor("damage") * 0.1;
            this.talent1 = caster.HasTalent("special_bonus_unique_imba_dark_willow_shadow_realm_1") != null;
            if (caster.HasTalent("special_bonus_unique_imba_dark_willow_shadow_realm_2")) {
                this.bonus_as = 0;
                this.bonus_asGrowth = caster.GetTalentValue("special_bonus_unique_imba_dark_willow_shadow_realm_2") * 0.1 / this.GetDuration();
                this.talent2 = true;
            }
        }
    }
    OnIntervalThink(): void {
        this.damage = math.min(this.max_damage, this.damage + this.damageGrowth);
        this.SetStackCount(math.floor(this.damage / this.max_damage * 100 + 0.5));
        if (this.talent2) {
            this.bonus_as = this.bonus_as + this.bonus_asGrowth;
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_UNSLOWABLE]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_ALLOW_PATHING_THROUGH_TREES]: true,
            [modifierstate.MODIFIER_STATE_ATTACK_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_START,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        return this.attack_range_bonus;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    CC_OnAttackStart(params: ModifierAttackEvent): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (caster == params.attacker) {
                this.Destroy();
            }
        }
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_dark_willow/dark_willow_shadow_realm.vpcf";
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_dark_willow_shadow_realm.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return 10;
    }
    IsDebuff(): boolean {
        return true;
    }
    BeRemoved(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let parent = this.GetParentPlus();
            let ability = this.GetAbilityPlus();
            ability.SetCooldown();
            parent.AddNewModifier(caster, ability, "modifier_imba_dark_willow_shadow_realm_damage", {
                duration: this.GetSpecialValueFor("linger_duration"),
                damage: this.damage
            });
            if (caster.HasTalent("special_bonus_unique_imba_dark_willow_shadow_realm_2")) {
                parent.AddNewModifier(caster, ability, "modifier_imba_dark_willow_shadow_realm_bonus_as", {
                    duration: caster.GetTalentValue("special_bonus_unique_imba_dark_willow_shadow_realm_2", "duration"),
                    attackspeed: this.bonus_as
                });
            }
        }
    }
    IsAura(): boolean {
        return this.talent1;
    }
    GetModifierAura(): string {
        return "modifier_imba_dark_willow_shadow_realm_talent";
    }
    GetAuraRadius(): number {
        return 400;
    }
    GetAuraDuration(): number {
        return 0.5;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
}
@registerModifier()
export class modifier_imba_dark_willow_shadow_realm_talent extends BaseModifier_Plus {
    public tick: any;
    public max_damage: number;
    public max_slow: any;
    Init(kv: any): void {
        let caster = this.GetCasterPlus();
        this.tick = caster.GetTalentValue("special_bonus_unique_imba_dark_willow_shadow_realm_1", "tick");
        this.max_damage = this.GetSpecialValueFor("max_damage") * caster.GetTalentValue("special_bonus_unique_imba_dark_willow_shadow_realm_1", "damage") / 100;
        this.max_slow = caster.GetTalentValue("special_bonus_unique_imba_dark_willow_shadow_realm_1") * (-1);
        this.StartIntervalThink(this.tick);
    }

    OnIntervalThink(): void {
        let caster = this.GetCasterPlus();
        let parent = this.GetParentPlus();
        let ability = this.GetAbilityPlus();
        if (IsServer()) {
            ability.DealDamage(caster, parent, this.tick * this.max_damage * caster.findBuffStack("modifier_imba_dark_willow_shadow_realm", caster) / 100);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.max_slow * this.GetCasterPlus().findBuffStack("modifier_imba_dark_willow_shadow_realm", this.GetCasterPlus()) / 100;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_dark_willow/dark_willow_shadow_realm_charge.vpcf";
    }
    IsDebuff(): boolean {
        return true;
    }
}
@registerModifier()
export class modifier_imba_dark_willow_shadow_realm_damage extends BaseModifier_Plus {
    public bonus_ar: number;
    public damage: number;
    BeCreated(kv: any): void {
        this.bonus_ar = this.GetSpecialValueFor("attack_range_bonus");
        this.damage = kv.damage;
    }
    BeRefresh(kv: any): void {
        this.bonus_ar = this.GetSpecialValueFor("attack_range_bonus");
        this.damage = kv.damage;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS,
            2: Enum_MODIFIER_EVENT.ON_ATTACK
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        return this.bonus_ar;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(params: ModifierAttackEvent): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus<imba_dark_willow_shadow_realm>();
            let attacker = params.attacker;
            let target = params.target;
            if (attacker == caster && target != attacker) {
                let distance = GFuncVector.CalculateDistance(target, attacker);
                let speed = caster.GetProjectileSpeed();
                let time = distance / speed;
                EmitSoundOn("Hero_DarkWillow.Shadow_Realm.Attack", attacker);
                let projectile = ability.FireTrackingProjectile("", target, caster.GetProjectileSpeed(), {}, DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_ATTACK_1, true, true, 250);
                ability.projectiles = ability.projectiles || {}
                ability.projectiles[projectile + ""] = { damage: this.damage }
                let nfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_dark_willow/dark_willow_shadow_attack.vpcf", ParticleAttachment_t.PATTACH_POINT, caster);
                ParticleManager.SetParticleControlEnt(nfx, 0, caster, ParticleAttachment_t.PATTACH_POINT, "attach_attack1", caster.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(nfx, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
                ParticleManager.SetParticleControl(nfx, 2, Vector(caster.GetProjectileSpeed(), 0, 0));
                ParticleManager.SetParticleControl(nfx, 5, Vector(1, 0, 0));
                this.AddTimer(time, () => {
                    ParticleManager.ClearParticle(nfx, false);
                });
                this.Destroy();
            }
        }
    }
    IsDebuff(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_dark_willow_shadow_realm_bonus_as extends BaseModifier_Plus {
    public bonus_as: number;
    BeCreated(kv: any): void {
        this.bonus_as = kv.attackspeed;
    }
    BeRefresh(kv: any): void {
        this.bonus_as = kv.attackspeed;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_as;
    }
    IsDebuff(): boolean {
        return false;
    }
}

@registerAbility()
export class imba_dark_willow_cursed_crown extends BaseAbility_Plus {
    IsStealable(): boolean {
        return true;
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target = this.GetCursorTarget();
        EmitSoundOn("Hero_DarkWillow.Ley.Cast", caster);
        EmitSoundOn("Hero_DarkWillow.Ley.Target", caster);
        if (target.TriggerSpellAbsorb(this)) {
            return;
        }
        let delay = this.GetSpecialValueFor("delay");
        let nfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_dark_willow/dark_willow_ley_cast.vpcf", ParticleAttachment_t.PATTACH_POINT, caster);
        ParticleManager.SetParticleControlEnt(nfx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", caster.GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(nfx, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(nfx);
        target.AddNewModifier(caster, this, "modifier_imba_dark_willow_cursed_crown", {
            duration: delay
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
export class modifier_imba_dark_willow_cursed_crown extends BaseModifier_Plus {
    public radius: number;
    public duration: number;
    status_resist: number;
    BeCreated(table: any): void {
        if (IsServer()) {
            this.SetDuration(this.GetSpecialValueFor("delay"), true);
            this.radius = this.GetSpecialValueFor("radius");
            this.duration = this.GetSpecialValueFor("duration");
            this.StartIntervalThink(1);
        }
    }
    OnIntervalThink(): void {
        let caster = this.GetCasterPlus();
        let point = this.GetParentPlus().GetAbsOrigin();
        EmitSoundOn("Hero_DarkWillow.Ley.Count", this.GetParentPlus());
        let nfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_dark_willow/dark_willow_leyconduit_marker_helper.vpcf", ParticleAttachment_t.PATTACH_POINT, caster);
        ParticleManager.SetParticleControl(nfx, 0, point);
        ParticleManager.SetParticleControl(nfx, 1, Vector(this.radius, this.radius, this.radius));
        ParticleManager.ReleaseParticleIndex(nfx);
        if (caster.HasTalent("special_bonus_unique_imba_dark_willow_cursed_crown_2")) {
            let enemies = AoiHelper.FindEntityInRadius(caster.GetTeam(), point, this.radius * 2);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (enemy != this.GetParentPlus() && !enemy.TriggerSpellAbsorb(this.GetAbilityPlus())) {
                    enemy.ApplyCharm(this.GetAbilityPlus(), this.GetParentPlus(), 1);
                }
            }
        }
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_dark_willow/dark_willow_leyconduit_start.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    BeRemoved(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let point = this.GetParentPlus().GetAbsOrigin();
            let damage = 0;
            EmitSoundOn("Hero_DarkWillow.Ley.Stun", this.GetParentPlus());
            if (caster.HasTalent("special_bonus_unique_imba_dark_willow_cursed_crown_1")) {
                damage = caster.GetIntellect();
            }
            let nfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_dark_willow/dark_willow_leyconduit_marker.vpcf", ParticleAttachment_t.PATTACH_POINT, caster);
            ParticleManager.SetParticleControlEnt(nfx, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
            ParticleManager.SetParticleControl(nfx, 2, Vector(this.radius, this.radius, this.radius));
            ParticleManager.ReleaseParticleIndex(nfx);
            let enemies = AoiHelper.FindEntityInRadius(caster.GetTeam(), point, this.radius);
            for (const [_, enemy] of ipairs(enemies)) {
                if (!enemy.TriggerSpellAbsorb(this.GetAbilityPlus())) {
                    enemy.ApplyStunned(this.GetAbilityPlus(), caster, this.duration)
                    this.GetAbilityPlus().DealDamage(caster, enemy, damage, {}, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_POISON_DAMAGE);
                }
            }
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.status_resist;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
}


@registerAbility()
export class imba_dark_willow_bedlam extends BaseAbility_Plus {
    IsStealable(): boolean {
        return false;
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasScepter()) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE;
        }
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IMMEDIATE;
    }
    // GetManaCost(iLevel: number): number {
    //     if (this.GetCasterPlus().HasScepter()) {
    //         return this.GetSpecialValueFor("scepter_mana_cost");
    //     }
    //     return super.GetManaCost(iLevel);
    // }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        if (!caster.HasScepter()) {
            caster.AddNewModifier(caster, this, "modifier_imba_dark_willow_bedlam", {
                duration: this.GetSpecialValueFor("duration")
            });
        }
    }
    OnToggle(): void {
        let caster = this.GetCasterPlus();
        if (caster.HasScepter()) {
            if (caster.HasModifier("modifier_imba_dark_willow_bedlam")) {
                caster.RemoveModifierByName("modifier_imba_dark_willow_bedlam");
            } else {
                caster.AddNewModifier(caster, this, "modifier_imba_dark_willow_bedlam", {});
                this.SetCooldown();
            }
        }
    }
    OnProjectileHit(hTarget: CDOTA_BaseNPC | undefined, vLocation: Vector): boolean | void {
        let caster = this.GetCasterPlus();
        if (hTarget) {
            this.DealDamage(caster, hTarget, caster.GetAttackDamage() / 2, {
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION
            }, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_DAMAGE);
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
export class modifier_imba_dark_willow_bedlam extends BaseModifier_Plus {
    public direction: any;
    public distance: number;
    public scepter_cost: any;
    public i: any;
    public point: any;
    public bug: IBaseNpc_Plus;
    BeCreated(table: any): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let parent = this.GetParentPlus();
            this.direction = caster.GetForwardVector();
            this.distance = this.GetSpecialValueFor("radius");
            this.scepter_cost = this.GetSpecialValueFor("scepter_mana_cost");
            this.i = 0;
            this.point = caster.GetAbsOrigin() + this.direction * this.distance + Vector(0, 0, 100);
            EmitSoundOn("Hero_DarkWillow.WispStrike.Cast", caster);
            this.bug = caster.CreateSummon("npc_imba_dark_willow_creature", this.point, this.GetDuration());
            this.bug.SetAbsOrigin(this.point);
            this.bug.AddNewModifier(caster, this.GetAbilityPlus(), "modifier_imba_dark_willow_bedlam_bug", {});
            this.StartIntervalThink(FrameTime());
        }
    }
    OnIntervalThink(): void {
        if (!GFuncEntity.IsValid(this.bug)) {
            this.Destroy();
            return
        }
        let qAngle = QAngle(0, this.i, 0);
        let parent = this.GetParentPlus();
        let parentPos = parent.GetAbsOrigin() + Vector(0, 0, 100) as Vector;
        let newSpawn = RotatePosition(parentPos, qAngle, this.point);
        this.bug.SetAbsOrigin(newSpawn);
        this.bug.SetForwardVector(GFuncVector.GetPerpendicularVector(GFuncVector.CalculateDirection(this.GetCasterPlus(), this.bug)));
        this.point = parentPos + this.direction * this.distance;
        this.i = this.i + parent.GetIdealSpeedNoSlows() * FrameTime();
    }
    BeRemoved(): void {
        if (IsServer()) {
            GFuncEntity.SafeDestroyUnit(this.bug);
        }
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    IsPurgable(): boolean {
        return !this.GetCasterPlus().HasScepter();
    }
}
@registerModifier()
export class modifier_imba_dark_willow_bedlam_bug extends BaseModifier_Plus {
    public radius: number;
    public attackRate: any;
    public scepter_cost: any;
    BeCreated(table: any): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let parent = this.GetParentPlus();
            let nfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_dark_willow/dark_willow_willowisp_ambient.vpcf", ParticleAttachment_t.PATTACH_POINT, caster);
            ParticleManager.SetParticleControlEnt(nfx, 0, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(nfx, 1, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true);
            this.AddParticle(nfx, false, false, 0, false, false);
            this.radius = caster.GetAttackRangePlus();
            this.attackRate = this.GetSpecialValueFor("attack_rate");
            this.scepter_cost = this.GetSpecialValueFor("scepter_mana_cost") * this.attackRate;
            this.StartIntervalThink(this.attackRate);
        }
    }
    OnIntervalThink(): void {
        let caster = this.GetCasterPlus();
        let parent = this.GetParentPlus();
        EmitSoundOn("Hero_DarkWillow.WillOWisp.Damage", parent);
        let enemies = AoiHelper.FindEntityInRadius(caster.GetTeam(), parent.GetAbsOrigin(), this.radius);
        for (const [_, enemy] of ipairs(enemies)) {
            this.GetAbilityPlus().FireTrackingProjectile("particles/units/heroes/hero_dark_willow/dark_willow_willowisp_base_attack.vpcf", enemy, 1400, {
                source: parent,
                origin: parent.GetAbsOrigin()
            }, DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION, true, true, 50);
            return;
        }
        if (this.GetCasterPlus().HasScepter()) {
            if (caster.GetMana() >= this.scepter_cost) {
                caster.ReduceMana(this.scepter_cost);
            } else {
                this.GetAbilityPlus().SetCooldown();
                caster.RemoveModifierByName("modifier_imba_dark_willow_bedlam");
            }
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_FLYING]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_UNTARGETABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_IDLE;
    }
}




@registerAbility()
export class imba_dark_willow_terrorize extends BaseAbility_Plus {
    public nfx: any;
    public bug: IBaseNpc_Plus;
    public fear: modifier_imba_dark_willow_terrorize;
    IsStealable(): boolean {
        return true;
    }
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    OnAbilityPhaseStart(): boolean {
        let caster = this.GetCasterPlus();
        let point = this.GetCursorPosition();
        let radius = this.GetSpecialValueFor("radius");
        this.nfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_dark_willow/dark_willow_wisp_spell_marker.vpcf", ParticleAttachment_t.PATTACH_POINT, caster);
        ParticleManager.SetParticleControl(this.nfx, 0, point);
        ParticleManager.SetParticleControl(this.nfx, 1, Vector(radius, 2, 1000));
        this.bug = caster.CreateSummon("npc_imba_dark_willow_creature", caster.GetAbsOrigin(), 10);
        this.fear = this.bug.AddNewModifier(caster, this, "modifier_imba_dark_willow_terrorize", {}) as modifier_imba_dark_willow_terrorize;
        EmitSoundOn("Hero_DarkWillow.Fear.Cast", caster);
        let pos = GetGroundPosition(caster.GetAbsOrigin(), caster);
        let height = 300;
        this.bug.SetAbsOrigin(pos + Vector(0, 0, height) as Vector);
        this.bug.SetForwardVector(GFuncVector.CalculateDirection(point, caster.GetAbsOrigin()));
        return true;
    }
    OnAbilityPhaseInterrupted(): void {
        let caster = this.GetCasterPlus();
        this.fear.abilityInterrupted = true;
        GFuncEntity.SafeDestroyUnit(this.bug);
        this.bug = null;
        this.fear = null;
        ParticleManager.ClearParticle(this.nfx, false);
        StopSoundOn("Hero_DarkWillow.Fear.Cast", caster);
    }
    OnSpellStart(): void {
        this.fear.StartIntervalThink(0.03);
    }
    GetManaCost(level: number): number {
        return 0;
    }

    AutoSpellSelf() {
        if (this.IsInAbilityPhase()) {
            return true;
        }
        return AI_ability.POSITION_if_enemy(this);
    }

}
@registerModifier()
export class modifier_imba_dark_willow_terrorize extends BaseModifier_Plus {
    public distance: number;
    public direction: any;
    public speed: number;
    public height: any;
    public distanceTraveled: number;
    BeCreated(table: any): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let parent = this.GetParentPlus();
            EmitSoundOn("Hero_DarkWillow.Fear.Wisp", parent);
            let nfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_dark_willow/dark_willow_willowisp_ambient.vpcf", ParticleAttachment_t.PATTACH_POINT, caster);
            ParticleManager.SetParticleControlEnt(nfx, 0, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(nfx, 1, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true);
            this.AddParticle(nfx, false, false, 0, false, false);
            let nfx2 = ResHelper.CreateParticleEx("particles/units/heroes/hero_dark_willow/dark_willow_wisp_spell_channel.vpcf", ParticleAttachment_t.PATTACH_POINT, caster);
            ParticleManager.SetParticleControlEnt(nfx2, 0, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true);
            this.AddParticle(nfx2, false, false, 0, false, false);
            let point = this.GetAbilityPlus().GetCursorPosition();
            this.distance = GFuncVector.CalculateDistance(point, parent);
            this.direction = GFuncVector.CalculateDirection(point, parent);
            this.speed = 2000;
            this.height = 300;
            this.distanceTraveled = 0;
        }
    }
    OnIntervalThink(): void {
        let caster = this.GetCasterPlus();
        let parent = this.GetParentPlus();
        if (this.distanceTraveled < this.distance) {
            let newPos = GetGroundPosition(parent.GetAbsOrigin(), parent) + this.direction * this.speed * 0.03 as Vector;
            newPos = newPos + Vector(0, 0, this.height) as Vector;
            parent.SetAbsOrigin(newPos);
            this.distanceTraveled = this.distanceTraveled + this.speed * 0.03;
            this.height = (this.height - this.height * this.distanceTraveled / this.distance * 0.1);
        } else {
            this.Destroy();
        }

    }
    abilityInterrupted = false;
    BeRemoved(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let parent = this.GetParentPlus();
            let point = GetGroundPosition(parent.GetAbsOrigin(), parent);
            let radius = this.GetSpecialValueFor("radius");
            let duration = this.GetSpecialValueFor("duration");
            StopSoundOn("Hero_DarkWillow.Fear.Wisp", parent);
            if (!this.abilityInterrupted) {
                EmitSoundOnLocationWithCaster(point, "Hero_DarkWillow.Fear.Location", caster);
                let nfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_dark_willow/dark_willow_wisp_spell.vpcf", ParticleAttachment_t.PATTACH_POINT, caster);
                ParticleManager.SetParticleControl(nfx, 0, point);
                ParticleManager.SetParticleControl(nfx, 1, Vector(radius, 2, 1000));
                ParticleManager.ReleaseParticleIndex(nfx);
                let enemies = AoiHelper.FindEntityInRadius(caster.GetTeam(), point, radius);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    if (!enemy.TriggerSpellAbsorb(this.GetAbilityPlus())) {
                        EmitSoundOn("Hero_DarkWillow.Fear.Target", enemy);
                        enemy.ApplyFear(this.GetAbilityPlus(), caster, duration);
                        if (caster.HasTalent("special_bonus_unique_imba_dark_willow_terrorize_1")) {
                            enemy.AddNewModifier(caster, this.GetAbilityPlus(), "modifier_imba_dark_willow_terrorize_damage", {
                                duration: duration
                            });
                        }
                        if (caster.HasTalent("special_bonus_unique_imba_dark_willow_terrorize_2")) {
                            this.AddTimer(duration, () => {
                                enemy.ApplyDaze(this.GetAbilityPlus(), caster, 2);
                            });
                        }
                    }
                }
            }
            GFuncEntity.SafeDestroyUnit(parent);
        }
    }



    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_FLYING]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_UNTARGETABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_IDLE;
    }
}
@registerModifier()
export class modifier_imba_dark_willow_terrorize_damage extends BaseModifier_Plus {
    public damage: number;
    BeCreated(table: any): void {
        if (IsServer()) {
            this.damage = this.GetParentPlus().GetMaxHealth() * 2 / 100;
            this.StartIntervalThink(1);
        }
    }
    BeRefresh(table: any): void {
        if (IsServer()) {
            this.damage = this.GetParentPlus().GetMaxHealth() * 2 / 100;
        }
    }
    OnIntervalThink(): void {
        let caster = this.GetCasterPlus();
        let parent = this.GetParentPlus();
        this.GetAbilityPlus().DealDamage(caster, parent, this.damage, {
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_DAMAGE_MULTIPLIERS
        }, 0);
    }
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
}
