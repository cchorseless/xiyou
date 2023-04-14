
import { GameFunc } from "../../../GameFunc";
import { AI_ability } from "../../../ai/AI_ability";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerAbility()
export class imba_sven_warcry_723 extends BaseAbility_Plus {
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return this.GetSpecialValueFor("radius") - this.GetCasterPlus().GetCastRangeBonus();
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let duration = this.GetSpecialValueFor("duration") + this.GetCasterPlus().GetTalentValue("special_bonus_imba_sven_10");
        this.GetCasterPlus().EmitSound("Hero_Sven.WarCry");
        if (this.GetCasterPlus().GetUnitName().includes("sven")) {
            this.GetCasterPlus().EmitSound("sven_sven_ability_warcry_0" + RandomInt(1, 4));
        }
        let warcry_cast_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_sven/sven_spell_warcry.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        if (this.GetCasterPlus().GetUnitName().includes("sven")) {
            ParticleManager.SetParticleControlEnt(warcry_cast_particle, 2, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_eyes", this.GetCasterPlus().GetAbsOrigin(), true);
        } else {
            ParticleManager.SetParticleControlEnt(warcry_cast_particle, 2, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCasterPlus().GetAbsOrigin(), true);
        }
        ParticleManager.ReleaseParticleIndex(warcry_cast_particle);
        this.GetCasterPlus().Purge(false, true, false, false, false);
        for (const [_, ally] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false))) {
            ally.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_sven_warcry_723", {
                duration: duration
            });
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_sven_7")) {
            let immunity_duration = duration * this.GetCasterPlus().GetTalentValue("special_bonus_imba_sven_7") / 100;
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_warcry_immunity", {
                duration: immunity_duration
            });
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
export class modifier_imba_sven_warcry_723 extends BaseModifier_Plus {
    public movespeed: number;
    public bonus_armor: number;
    public bonus_damage: number;
    public knightly_bonus_status_resistance: number;
    public warcry_particle: any;
    Init(p_0: any,): void {
        this.movespeed = this.GetSpecialValueFor("movespeed");
        this.bonus_armor = this.GetSpecialValueFor("bonus_armor");
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage");
        this.knightly_bonus_status_resistance = this.GetSpecialValueFor("knightly_bonus_status_resistance");
        if (!IsServer()) {
            return;
        }
        if (!this.warcry_particle) {
            this.warcry_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_sven/sven_warcry_buff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            ParticleManager.SetParticleControlEnt(this.warcry_particle, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, undefined, this.GetParentPlus().GetAbsOrigin(), true);
            this.AddParticle(this.warcry_particle, false, false, -1, false, true);
        }
    }

    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            4: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING,
            5: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        if (this.GetParentPlus() == this.GetCasterPlus()) {
            return this.movespeed;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.bonus_armor;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.knightly_bonus_status_resistance;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        if (this.GetParentPlus().GetUnitName().includes("sven")) {
            return "sven_warcry";
        }
    }
}
@registerAbility()
export class imba_sven_storm_bolt extends BaseAbility_Plus {
    public target: IBaseNpc_Plus;
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return false;
    }
    GetAbilityTextureName(): string {
        return "sven_storm_bolt";
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (!this.GetCasterPlus().HasScepter()) {
            return super.GetCastRange(location, target);
        } else {
            return super.GetCastRange(location, target) + this.GetSpecialValueFor("cast_range_bonus_scepter");
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            this.target = this.GetCursorTarget();
            let damage = this.GetSpecialValueFor("damage");
            let stun_duration = this.GetSpecialValueFor("stun_duration");
            let radius = this.GetTalentSpecialValueFor("radius");
            let vision_radius = this.GetSpecialValueFor("vision_radius");
            let bolt_speed = this.GetSpecialValueFor("bolt_speed");
            caster.EmitSound("Hero_Sven.StormBolt");
            if ((math.random(1, 100) <= 50) && (caster.GetUnitName().includes("sven"))) {
                caster.EmitSound("sven_sven_ability_stormbolt_0" + math.random(1, 9));
            }
            caster.AddNewModifier(caster, this, "modifier_imba_storm_bolt_caster", {});
            caster.AddNoDraw();
            let projectile = {
                Target: this.target,
                Source: caster,
                Ability: this,
                EffectName: "particles/units/heroes/hero_sven/sven_spell_storm_bolt.vpcf",
                iMoveSpeed: bolt_speed,
                vSpawnOrigin: caster.GetAbsOrigin(),
                bDrawsOnMinimap: false,
                bDodgeable: true,
                bIsAttack: false,
                bVisibleToEnemies: true,
                bReplaceExisting: false,
                flExpireTime: GameRules.GetGameTime() + 10,
                bProvidesVision: true,
                iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_ATTACK_2,
                iVisionRadius: vision_radius,
                iVisionTeamNumber: caster.GetTeamNumber(),
                ExtraData: {
                    damage: damage,
                    stun_duration: stun_duration,
                    radius: radius
                }
            }
            ProjectileManager.CreateTrackingProjectile(projectile);
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            EmitSoundOnLocationWithCaster(location, "Hero_Sven.StormBoltImpact", caster);
            caster.RemoveModifierByName("modifier_imba_storm_bolt_caster");
            caster.RemoveNoDraw();
            if (target || location) {
                let target_pos = location || target.GetAbsOrigin();
                let caster_pos = caster.GetAbsOrigin();
                let blink_pos = target_pos + (caster_pos - target_pos as Vector).Normalized() * 100 as Vector;
                FindClearSpaceForUnit(caster, blink_pos, true);
                if (((target_pos - caster_pos as Vector).Length2D() > 600) && (RandomInt(1, 100) <= 20) && (caster.GetUnitName().includes("sven"))) {
                    caster.EmitSound("sven_sven_ability_teleport_0" + math.random(1, 3));
                }
            }
            if (target) {
                caster.SetAttacking(target);
                let crit_max_duration = this.GetSpecialValueFor("crit_max_duration");
                caster.AddNewModifier(caster, this, "modifier_imba_storm_bolt_crit", {
                    duration: crit_max_duration
                });
                let enemies = FindUnitsInRadius(caster.GetTeamNumber(), location, undefined, ExtraData.radius, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false);
                for (const [_, enemy] of GameFunc.iPair(enemies)) {
                    if (enemy == target && target.TriggerSpellAbsorb(this)) {
                    } else {
                        ApplyDamage({
                            victim: enemy,
                            attacker: caster,
                            ability: this,
                            damage: ExtraData.damage,
                            damage_type: this.GetAbilityDamageType()
                        });
                        enemy.AddNewModifier(caster, this, "modifier_generic_stunned", {
                            duration: ExtraData.stun_duration * (1 - enemy.GetStatusResistance())
                        });
                        if (caster.HasShard()) {
                            enemy.Purge(true, false, false, false, false);
                        }
                    }
                }
            }
        }
    }
    GetAOERadius(): number {
        return this.GetTalentSpecialValueFor("radius");
    }
    GetCooldown(nLevel: number): number {
        return super.GetCooldown(nLevel) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_sven_5");
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_sven_5") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_sven_5")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_sven_5"), "modifier_special_bonus_imba_sven_5", {});
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
export class modifier_imba_storm_bolt_caster extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true
        }
        return state;
    }
}
@registerModifier()
export class modifier_imba_storm_bolt_crit extends BaseModifier_Plus {
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
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuns = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE
        }
        return Object.values(decFuns);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        if (IsServer()) {
            if (this.GetParentPlus() == params.attacker) {
                this.Destroy();
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_CRITICALSTRIKE_UNIQUE)
    CC_GetModifierPreAttack_CriticalStrike(params: ModifierAttackEvent): number {
        if (this.GetAbilityPlus<imba_sven_storm_bolt>().target == params.target) {
            return this.GetSpecialValueFor("crit_pct");
        } else {
            return undefined;
        }
    }
}
@registerAbility()
export class imba_sven_great_cleave extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return false;
    }
    GetAbilityTextureName(): string {
        return "sven_great_cleave";
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_great_cleave";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            this.GetCasterPlus().EmitSound("Hero_Sven.IronWill");
            this.GetCasterPlus().EmitSound("Hero_Sven.SignetLayer");
            caster.AddNewModifier(caster, this, "modifier_imba_great_cleave_active", {
                duration: 5
            });
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_sven_6") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_sven_6")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_sven_6"), "modifier_special_bonus_imba_sven_6", {});
        }
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.NO_TARGET_if_enemy(this);
    }
}
@registerModifier()
export class modifier_imba_great_cleave extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this.GetAbilityPlus();
            if ((params.attacker == caster) && caster.IsRealUnit() && (params.target.GetTeamNumber() != caster.GetTeamNumber()) && (!caster.HasModifier("modifier_imba_great_cleave_active")) && !caster.PassivesDisabled()) {
                let cleave_particle = "particles/units/heroes/hero_sven/sven_spell_great_cleave.vpcf";
                let cleave_damage_pct = ability.GetSpecialValueFor("great_cleave_damage") / 100;
                let cleave_radius_start = ability.GetSpecialValueFor("cleave_starting_width");
                let cleave_radius_end = ability.GetTalentSpecialValueFor("cleave_ending_width");
                let cleave_distance = ability.GetTalentSpecialValueFor("cleave_distance");
                DoCleaveAttack(params.attacker, params.target, ability, (params.damage * cleave_damage_pct), cleave_radius_start, cleave_radius_end, cleave_distance, cleave_particle);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_great_cleave_active extends BaseModifier_Plus {
    public armor_ignore: any;
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
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        let parent = this.GetParentPlus();
        let fire_fx = ResHelper.CreateParticleEx("particles/hero/sven/great_cleave_glow_base.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, parent);
        ParticleManager.SetParticleControlEnt(fire_fx, 0, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_weapon", parent.GetAbsOrigin(), true);
        this.AddParticle(fire_fx, false, false, -1, false, false);
        this.armor_ignore = this.GetAbilityPlus().GetTalentSpecialValueFor("armor_ignore");
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_CANNOT_MISS]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            3: Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY,
            4: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        if (this.GetParentPlus().GetUnitName().includes("sven")) {
            return "fear";
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && keys.target) {
            keys.target.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_great_cleave_armor_reduction", {
                armor_ignore: this.armor_ignore
            });
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY)
    CC_OnAttackRecordDestroy(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && keys.target) {
            keys.target.RemoveModifierByName("modifier_imba_great_cleave_armor_reduction");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.armor_ignore;
    }
}
@registerModifier()
export class modifier_imba_great_cleave_armor_reduction extends BaseModifier_Plus {
    public armor_ignore_base: any;
    public armor: any;
    public armor_ignore: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(keys: any): void {
        if (!IsServer()) {
            return;
        }
        this.armor_ignore_base = keys.armor_ignore;
        this.armor = this.GetParentPlus().GetPhysicalArmorValue(false);
        this.armor_ignore = math.min(this.armor, this.armor_ignore_base) * (-1);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.armor_ignore;
    }
}
@registerAbility()
export class imba_sven_warcry extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return true;
    }
    GetAbilityTextureName(): string {
        return "sven_warcry";
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ms_bonus_pct = this.GetTalentSpecialValueFor("ms_bonus_pct");
            let armor_bonus = this.GetSpecialValueFor("armor_bonus");
            let tenacity_bonus_pct = this.GetSpecialValueFor("tenacity_bonus_pct");
            let tenacity_self_pct = this.GetSpecialValueFor("tenacity_self_pct");
            let radius = this.GetSpecialValueFor("radius");
            let duration = this.GetSpecialValueFor("duration") + caster.GetTalentValue("special_bonus_imba_sven_10");
            let allies = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), undefined, radius, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false);
            for (const [_, ally] of GameFunc.iPair(allies)) {
                if (caster == ally) {
                    caster.AddNewModifier(caster, this, "modifier_imba_warcry", {
                        duration: duration
                    });
                    if (caster.HasTalent("special_bonus_imba_sven_7")) {
                        let immunity_duration = duration * caster.GetTalentValue("special_bonus_imba_sven_7") / 100;
                        caster.AddNewModifier(caster, this, "modifier_imba_warcry_immunity", {
                            duration: immunity_duration
                        });
                    }
                } else {
                    ally.AddNewModifier(caster, this, "modifier_imba_warcry", {
                        duration: duration
                    });
                }
            }
            caster.StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_3);
            caster.Purge(false, true, false, false, false);
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return this.GetSpecialValueFor("radius");
    }
    GetManaCost(level: number): number {
        return 0;
    }
    AutoSpellSelf() {
        return AI_ability.NO_TARGET_cast(this);
    }
}
@registerModifier()
export class modifier_imba_warcry extends BaseModifier_Plus {
    public ms_bonus_pct: number;
    public armor_bonus: number;
    public tenacity_pct: number;
    public hp_shield: any;
    public shield_size: any;
    public cast_fx: any;
    public buff_fx: any;
    public buff2_fx: any;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING,
            5: GPropertyConfig.EMODIFIER_PROPERTY.TOTAL_CONSTANT_BLOCK
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        // if (this.GetParentPlus().GetUnitName() .includes("sven")) {
        //     return "sven_warcry";
        // }
        return "sven_warcry";
    }
    Init(p_0: any,): void {
        this.ms_bonus_pct = this.GetAbilityPlus().GetTalentSpecialValueFor("ms_bonus_pct");
        this.armor_bonus = this.GetSpecialValueFor("armor_bonus");
        this.tenacity_pct = this.GetSpecialValueFor("tenacity_bonus_pct");
        let caster = this.GetCasterPlus();
        if (IsServer()) {
            this.hp_shield = this.GetSpecialValueFor("hp_shield") + (this.GetCasterPlus().GetStrength() * this.GetSpecialValueFor("hp_shield_str_mult"));
            this.shield_size = 120;
            if (this.GetParentPlus() == this.GetCasterPlus()) {
                this.GetCasterPlus().EmitSound("Hero_Sven.WarCry");
                if (this.GetCasterPlus().GetUnitName().includes("sven")) {
                    this.GetCasterPlus().EmitSound("sven_sven_ability_warcry_0" + math.random(1, 6));
                }
                if (this.cast_fx) {
                    ParticleManager.DestroyParticle(this.cast_fx, false);
                    ParticleManager.ReleaseParticleIndex(this.cast_fx);
                }
                this.cast_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_sven/sven_spell_warcry.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
                ParticleManager.SetParticleControlEnt(this.cast_fx, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, undefined, this.GetCasterPlus().GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(this.cast_fx, 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, undefined, this.GetCasterPlus().GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(this.cast_fx, 2, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, undefined, this.GetCasterPlus().GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(this.cast_fx, 4, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, undefined, this.GetCasterPlus().GetAbsOrigin(), true);
                this.AddParticle(this.cast_fx, false, false, -1, false, false);
            }
            if (this.buff_fx) {
                ParticleManager.DestroyParticle(this.buff_fx, false);
                ParticleManager.ReleaseParticleIndex(this.buff_fx);
            }
            this.buff_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_sven/sven_warcry_buff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
            ParticleManager.SetParticleControlEnt(this.buff_fx, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, undefined, this.GetParentPlus().GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(this.buff_fx, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, undefined, this.GetParentPlus().GetAbsOrigin(), true);
            this.AddParticle(this.buff_fx, false, false, -1, false, false);
            if (this.buff2_fx) {
                ParticleManager.DestroyParticle(this.buff_fx, false);
                ParticleManager.ReleaseParticleIndex(this.buff_fx);
            }
            this.buff2_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_sven/sven_warcry_buff_shield.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
            ParticleManager.SetParticleControl(this.buff2_fx, 0, this.GetParentPlus().GetAbsOrigin() + Vector(0, 0, 0) as Vector);
            ParticleManager.SetParticleControl(this.buff2_fx, 1, Vector(this.shield_size, 0, 0));
            ParticleManager.SetParticleControlEnt(this.buff2_fx, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
            this.AddParticle(this.buff2_fx, false, false, -1, false, false);
            this.SetStackCount(this.hp_shield);
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.tenacity_pct;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.ms_bonus_pct;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.armor_bonus;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTAL_CONSTANT_BLOCK)
    CC_GetModifierTotal_ConstantBlock(keys: ModifierAttackEvent): number {
        if (!IsServer()) {
            return;
        }
        if (keys.damage_category != DamageCategory_t.DOTA_DAMAGE_CATEGORY_ATTACK) {
            return 0;
        }
        if (keys.damage >= this.hp_shield) {
            if (this.cast_fx) {
                ParticleManager.DestroyParticle(this.cast_fx, false);
                ParticleManager.ReleaseParticleIndex(this.cast_fx);
            }
            if (this.buff_fx) {
                ParticleManager.DestroyParticle(this.buff_fx, false);
                ParticleManager.ReleaseParticleIndex(this.buff_fx);
            }
            if (this.buff2_fx) {
                ParticleManager.DestroyParticle(this.buff2_fx, false);
                ParticleManager.ReleaseParticleIndex(this.buff2_fx);
            }
            if (this.GetParentPlus().HasModifier("modifier_imba_warcry")) {
                this.GetParentPlus().RemoveModifierByName("modifier_imba_warcry");
            }
            return this.hp_shield;
        }
        let hit_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_sven/sven_warcry_buff_shield_hit.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControl(hit_pfx, 0, this.GetParentPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(hit_pfx, 1, Vector(this.shield_size, 0, 0));
        this.AddParticle(hit_pfx, false, false, -1, false, false);
        this.hp_shield = this.hp_shield - keys.damage;
        SendOverheadEventMessage(this.GetParentPlus().GetPlayerOwner(), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BLOCK, this.GetParentPlus(), math.min(this.hp_shield, keys.damage), this.GetParentPlus().GetPlayerOwner());
        this.SetStackCount(this.hp_shield);
        return keys.damage;
    }
}
@registerModifier()
export class modifier_imba_warcry_immunity extends BaseModifier_Plus {
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
        }
        return state;
    }
    GetEffectName(): string {
        return "particles/items_fx/black_king_bar_avatar.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_POINT_FOLLOW;
    }
}
@registerAbility()
export class imba_sven_gods_strength extends BaseAbility_Plus {
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return false;
    }
    GetAbilityTextureName(): string {
        return "sven_gods_strength";
    }
    GetCooldown(nLevel: number): number {
        return super.GetCooldown(nLevel) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_sven_4");
    }
    GetAssociatedPrimaryAbilities(): string {
        return "imba_sven_colossal_slash";
    }
    OnUpgrade(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability_slash = caster.FindAbilityByName(this.GetAssociatedPrimaryAbilities());
            if (ability_slash) {
                ability_slash.SetLevel(this.GetLevel());
                if (!caster.HasModifier("modifier_imba_god_strength")) {
                    ability_slash.SetActivated(false);
                }
            }
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let duration = this.GetSpecialValueFor("duration");
            caster.AddNewModifier(caster, this, "modifier_imba_god_strength", {
                duration: duration
            });
            caster.EmitSound("Hero_Sven.GodsStrength");
            if ((math.random(1, 100) <= 25)) {
                caster.EmitSound("Imba.SvenBeAMan");
            }
            caster.StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_4);
            let roar_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_sven/sven_spell_gods_strength.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
            ParticleManager.SetParticleControlEnt(roar_pfx, 1, caster, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, undefined, caster.GetAbsOrigin(), true);
            ParticleManager.ReleaseParticleIndex(roar_pfx);
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_sven_4") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_sven_4")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_sven_4"), "modifier_special_bonus_imba_sven_4", {});
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_sven_8") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_sven_8")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_sven_8"), "modifier_special_bonus_imba_sven_8", {});
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
export class modifier_imba_god_strength extends BaseModifier_Plus {
    public bonus_dmg_pct: number;
    public gods_strength_bonus_str: number;
    public aura_radius_scepter: number;
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
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        this.bonus_dmg_pct = this.GetAbilityPlus().GetTalentSpecialValueFor("bonus_dmg_pct");
        this.gods_strength_bonus_str = this.GetSpecialValueFor("gods_strength_bonus_str");
        this.aura_radius_scepter = this.GetSpecialValueFor("aura_radius_scepter");
        if (IsServer()) {
            let nFXIndex = ResHelper.CreateParticleEx("particles/units/heroes/hero_sven/sven_spell_gods_strength_ambient.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            ParticleManager.SetParticleControlEnt(nFXIndex, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_weapon", this.GetParentPlus().GetOrigin(), true);
            ParticleManager.SetParticleControlEnt(nFXIndex, 2, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_head", this.GetParentPlus().GetOrigin(), true);
            this.AddParticle(nFXIndex, false, false, -1, false, true);
            // this.GetCasterPlus().findAbliityPlus<imba_sven_colossal_slash>("imba_sven_colossal_slash").SetActivated(true);
        }
    }
    BeRefresh(p_0: any,): void {
        this.bonus_dmg_pct = this.GetAbilityPlus().GetTalentSpecialValueFor("bonus_dmg_pct");
        this.gods_strength_bonus_str = this.GetSpecialValueFor("gods_strength_bonus_str");
        this.aura_radius_scepter = this.GetSpecialValueFor("aura_radius_scepter");
    }
    BeDestroy(): void {
        if (IsServer()) {
            // this.GetCasterPlus().findAbliityPlus<imba_sven_colossal_slash>("imba_sven_colossal_slash").SetActivated(false);
        }
    }
    IsAura(): boolean {
        if (IsServer()) {
            return this.GetCasterPlus().HasScepter();
        }
        return false;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ATTACK_SOUND)
    CC_GetAttackSound(): string {
        return "Hero_Sven.GodsStrength.Attack";
    }
    GetHeroEffectName(): string {
        return "particles/units/heroes/hero_sven/sven_gods_strength_hero_effect.vpcf";
    }
    HeroEffectPriority(): modifierpriority {
        return 10;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_gods_strength.vpcf";
    }
    StatusEffectPriority(): modifierpriority {
        return 10;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return this.GetAbilityPlus().GetAbilityTargetTeam();
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return this.GetAbilityPlus().GetAbilityTargetType();
    }
    GetModifierAura(): string {
        return "modifier_imba_god_strength_allies";
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return this.GetAbilityPlus().GetAbilityTargetFlags();
    }
    GetAuraRadius(): number {
        return this.aura_radius_scepter;
    }
    GetAuraEntityReject(target: CDOTA_BaseNPC): boolean {
        if (IsServer()) {
            if (this.GetParentPlus() == target) {
                return true;
            }
        }
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ATTACK_SOUND
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        if (this.GetAbilityPlus()) {
            return this.GetAbilityPlus().GetTalentSpecialValueFor("bonus_dmg_pct");
        } else {
            return this.bonus_dmg_pct;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.gods_strength_bonus_str;
    }
}
@registerModifier()
export class modifier_imba_god_strength_allies extends BaseModifier_Plus {
    public bonus_dmg_pct: number;
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
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.bonus_dmg_pct;
    }
    Init(p_0: any,): void {
        this.bonus_dmg_pct = this.GetSpecialValueFor("ally_bonus_dmg_pct_scepter");
    }

    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
}
@registerAbility()
export class imba_sven_colossal_slash extends BaseAbility_Plus {
    public animation: any;
    public sound: any;
    public swing_fx: any;
    IsHiddenWhenStolen(): boolean {
        return false;
    }
    IsRefreshable(): boolean {
        return true;
    }
    IsStealable(): boolean {
        return true;
    }
    IsNetherWardStealable() {
        return false;
    }
    GetAbilityTextureName(): string {
        return "sven_colossal_strike";
    }
    GetAssociatedSecondaryAbilities(): string {
        return "imba_sven_gods_strength";
    }
    OnAbilityPhaseStart(): boolean {
        let caster = this.GetCasterPlus();
        this.animation = true;
        let roar_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_sven/sven_spell_gods_strength.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
        ParticleManager.SetParticleControlEnt(roar_pfx, 1, caster, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, undefined, caster.GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(roar_pfx);
        if (caster.GetUnitName().includes("sven")) {
            if ((math.random(1, 100) <= 25)) {
                this.sound = "Imba.SvenGetsugaTensho";
            } else {
                this.sound = "sven_sven_ability_godstrength_0" + math.random(1, 2);
            }
            caster.EmitSound(this.sound);
            this.swing_fx = ResHelper.CreateParticleEx("particles/hero/sven/colossal_slash_cast.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, caster);
            let swing_fx = this.swing_fx;
            ParticleManager.SetParticleControlEnt(this.swing_fx, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_sword", caster.GetAbsOrigin(), true);
            ParticleManager.SetParticleControlEnt(this.swing_fx, 1, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_sword", caster.GetAbsOrigin(), true);
            this.AddTimer(this.GetBackswingTime(), () => {
                ParticleManager.DestroyParticle(swing_fx, false);
                ParticleManager.ReleaseParticleIndex(swing_fx);
            });
            caster.FadeGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_3);
            caster.FadeGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_4);
            caster.StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_VICTORY, 3);
            this.AddTimer(0.4, () => {
                if (this.animation) {
                    let mod = caster.AddNewModifier(caster, this, "modifier_imba_colossal_slash_animation", {});
                    caster.FadeGesture(GameActivity_t.ACT_DOTA_VICTORY);
                    caster.StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_SPAWN, 1.4);
                    this.AddTimer(FrameTime(), () => {
                        mod.Destroy();
                    });
                }
            });
        }
        return true;
    }
    OnAbilityPhaseInterrupted(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            caster.FadeGesture(GameActivity_t.ACT_DOTA_VICTORY);
            caster.FadeGesture(GameActivity_t.ACT_DOTA_SPAWN);
            this.animation = false;
            if (this.sound) {
                caster.StopSound(this.sound);
            }
            ParticleManager.DestroyParticle(this.swing_fx, false);
        }
    }
    OnSpellStart(): void {
        if (IsServer()) {
            if (this.GetCursorPosition() == this.GetCasterPlus().GetAbsOrigin()) {
                this.GetCasterPlus().SetCursorPosition(this.GetCursorPosition() + this.GetCasterPlus().GetForwardVector() as Vector);
            }
            let caster = this.GetCasterPlus();
            let target_loc = this.GetCursorPosition();
            let caster_loc = caster.GetAbsOrigin();
            let proj_speed = this.GetSpecialValueFor("proj_speed");
            let radius = this.GetSpecialValueFor("radius");
            let crit_bonus_pct = this.GetSpecialValueFor("crit_bonus_pct");
            let base_range = this.GetSpecialValueFor("base_range");
            let range_multiplier = this.GetSpecialValueFor("range_multiplier");
            let direction = (target_loc - caster_loc as Vector).Normalized();
            let modifier = caster.findBuff<modifier_imba_god_strength>("modifier_imba_god_strength");
            ScreenShake(caster_loc, 10, 0.3, 0.5, 1000, 0, true);
            let remaining_time = 0;
            if (modifier) {
                remaining_time = modifier.GetRemainingTime();
                modifier.Destroy();
            }
            let total_range = base_range + (remaining_time * range_multiplier);
            let caster_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_earth_spirit/espirit_spawn_ground.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, caster);
            ParticleManager.SetParticleControl(caster_pfx, 0, (caster.GetAbsOrigin() + direction * 100) as Vector);
            let projectile = {
                Ability: this,
                EffectName: "particles/hero/sven/colossal_slash.vpcf",
                vSpawnOrigin: caster_loc,
                fDistance: total_range,
                fStartRadius: radius,
                fEndRadius: radius,
                Source: caster,
                bHasFrontalCone: false,
                bReplaceExisting: false,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                fExpireTime: GameRules.GetGameTime() + 5.0,
                bDeleteOnHit: false,
                vVelocity: Vector(direction.x, direction.y, 0) * proj_speed as Vector,
                bProvidesVision: true,
                iVisionRadius: radius,
                iVisionTeamNumber: caster.GetTeamNumber()
            }
            ProjectileManager.CreateLinearProjectile(projectile);
            EmitSoundOnLocationWithCaster(caster_loc, "Imba.SvenShockWave", caster);
            let current_distance = 0;
            let rate = 0.3;
            this.AddTimer(0, () => {
                let location = caster_loc + direction * current_distance;
                current_distance = current_distance + (proj_speed * rate);
                if (current_distance < total_range) {
                    return rate;
                }
            });
        }
    }
    OnProjectileHit(target: CDOTA_BaseNPC | undefined, location: Vector): boolean | void {
        if (target) {
            let caster = this.GetCasterPlus();
            let mod = caster.AddNewModifier(caster, this, "modifier_imba_colossal_slash_crit", {});
            caster.AttackOnce(target, true, false, true, false, false, false, true);
            mod.Destroy();
        }
    }
}
@registerModifier()
export class modifier_imba_colossal_slash_crit extends BaseModifier_Plus {
    public crit_bonus_pct: number;
    public bonus_dmg_pct: number;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsPurgeException(): boolean {
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ATTACK_SOUND
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ATTACK_SOUND)
    CC_GetAttackSound(): string {
        return "Hero_Sven.GodsStrength.Attack";
    }
    BeCreated(p_0: any,): void {
        this.crit_bonus_pct = this.GetSpecialValueFor("crit_bonus_pct") - 100;
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasModifier("modifier_imba_god_strength")) {
            this.bonus_dmg_pct = 0;
        } else {
            this.bonus_dmg_pct = this.GetAbilityPlus().GetTalentSpecialValueFor("bonus_dmg_pct");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        return this.bonus_dmg_pct;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOTALDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierTotalDamageOutgoing_Percentage(params: ModifierAttackEvent): number {
        let damage = params.damage + (params.damage * this.crit_bonus_pct / 100);
        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_CRITICAL, params.target, damage, undefined);
        return this.crit_bonus_pct;
    }
}
@registerModifier()
export class modifier_imba_colossal_slash_animation extends BaseModifier_Plus {
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
        return false;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    CC_GetActivityTranslationModifiers(): string {
        // if (this.GetParentPlus().GetUnitName() .includes("sven")) {
        //     return "loadout";
        // }
        return "loadout";
    }
}
@registerModifier()
export class modifier_special_bonus_imba_sven_4 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_sven_5 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_sven_6 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_sven_7 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_sven_8 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_sven_9 extends BaseModifier_Plus {
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
export class modifier_special_bonus_imba_sven_10 extends BaseModifier_Plus {
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
