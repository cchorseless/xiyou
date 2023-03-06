
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class imba_luna_lucent_beam extends BaseAbility_Plus {
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST;
    }
    GetCooldown(level: number): number {
        return super.GetCooldown(level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_luna_lucent_beam_cooldown");
    }
    OnAbilityPhaseStart(): boolean {
        if (!IsServer()) {
            return;
        }
        let precast_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_luna/luna_lucent_beam_precast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(precast_particle, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(precast_particle);
        return true;
    }
    OnUpgrade(): void {
        if (this.GetLevel() == 1) {
            this.ToggleAutoCast();
        }
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCursorTarget().TriggerSpellAbsorb(this)) {
            return undefined;
        }
        this.GetCasterPlus().EmitSound("Hero_Luna.LucentBeam.Cast");
        this.GetCursorTarget().EmitSound("Hero_Luna.LucentBeam.Target");
        if (this.GetCasterPlus().GetName().includes("luna") && RollPercentage(50)) {
            let responses = {
                "1": "luna_luna_ability_lucentbeam_01",
                "2": "luna_luna_ability_lucentbeam_02",
                "3": "luna_luna_ability_lucentbeam_04",
                "4": "luna_luna_ability_lucentbeam_05"
            }
            this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(responses));
        }
        let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_luna/luna_lucent_beam.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControl(particle, 1, this.GetCursorTarget().GetAbsOrigin());
        ParticleManager.SetParticleControlEnt(particle, 5, this.GetCursorTarget(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetCursorTarget().GetAbsOrigin(), true);
        ParticleManager.SetParticleControlEnt(particle, 6, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(particle);
        let damageTable = {
            victim: this.GetCursorTarget(),
            damage: this.GetTalentSpecialValueFor("beam_damage"),
            damage_type: this.GetAbilityDamageType(),
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.GetCasterPlus(),
            ability: this
        }
        ApplyDamage(damageTable);
        this.GetCursorTarget().AddNewModifier(this.GetCasterPlus(), this, "modifier_stunned", {
            duration: this.GetSpecialValueFor("stun_duration") * (1 - this.GetCursorTarget().GetStatusResistance())
        });
        if (this.GetAutoCastState()) {
            let refraction_damage_radius = this.GetSpecialValueFor("refraction_damage_radius");
            let refraction_waves = this.GetSpecialValueFor("refraction_waves");
            let refraction_beams = this.GetSpecialValueFor("refraction_beams");
            let refraction_distance = this.GetSpecialValueFor("refraction_distance");
            let refraction_delay = this.GetSpecialValueFor("refraction_delay");
            let target_pos = this.GetCursorTarget().GetAbsOrigin();
            let random_vector = Vector(1, 1, 0).Normalized() * refraction_distance as Vector;
            let wave_count = 0;
            this.AddTimer(refraction_delay, () => {
                wave_count = wave_count + 1;
                random_vector = random_vector.Normalized() + (refraction_distance * wave_count) as Vector;
                for (let inner_beam = 1; inner_beam <= refraction_beams; inner_beam++) {
                    let beam_pos = GetGroundPosition(RotatePosition(target_pos, QAngle(0, 360 * inner_beam / 4, 0), target_pos + random_vector as Vector), undefined);
                    let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_luna/luna_lucent_beam.vpcf", ParticleAttachment_t.PATTACH_POINT, this.GetCasterPlus());
                    ParticleManager.SetParticleControl(particle, 1, beam_pos);
                    ParticleManager.SetParticleControl(particle, 5, beam_pos);
                    ParticleManager.SetParticleControlEnt(particle, 6, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT, "attach_attack1", this.GetCasterPlus().GetAbsOrigin(), true);
                    ParticleManager.SetParticleControl(particle, 60, Vector(RandomInt(0, 255), RandomInt(0, 255), RandomInt(0, 255)));
                    ParticleManager.SetParticleControl(particle, 61, Vector(1, 0, 0));
                    ParticleManager.ReleaseParticleIndex(particle);
                    let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), beam_pos, undefined, refraction_damage_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                    for (const [_, enemy] of GameFunc.iPair(enemies)) {
                        let damageTable = {
                            victim: enemy,
                            damage: this.GetTalentSpecialValueFor("beam_damage"),
                            damage_type: this.GetAbilityDamageType(),
                            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                            attacker: this.GetCasterPlus(),
                            ability: this
                        }
                        ApplyDamage(damageTable);
                    }
                }
                if (wave_count < refraction_waves) {
                    return refraction_delay;
                }
            });
        }
    }
    OnOwnerSpawned(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_luna_lucent_beam_cooldown") && !this.GetCasterPlus().HasModifier("modifier_special_bonus_imba_luna_lucent_beam_cooldown")) {
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this.GetCasterPlus().findAbliityPlus("special_bonus_imba_luna_lucent_beam_cooldown"), "modifier_special_bonus_imba_luna_lucent_beam_cooldown", {});
        }
    }
}
@registerAbility()
export class imba_luna_moon_glaive extends BaseAbility_Plus {
    public damage_type: number;
    public target_tracker: any;
    GetIntrinsicModifierName(): string {
        return "modifier_imba_luna_moon_glaive";
    }
    OnProjectileHit_ExtraData(hTarget: CDOTA_BaseNPC | undefined, vLocation: Vector, ExtraData: any): boolean | void {
        if (!IsServer()) {
            return;
        }
        if (hTarget) {
            this.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL;
            let damageTable = {
                victim: hTarget,
                damage: ExtraData.damage * ((100 - this.GetSpecialValueFor("damage_reduction_percent")) * 0.01) ^ (ExtraData.bounces + 1),
                damage_type: this.damage_type,
                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
                attacker: this.GetCasterPlus(),
                ability: this
            }
            let damage_dealt = ApplyDamage(damageTable);
            if (!this.target_tracker) {
                this.target_tracker = {}
            }
            if (!this.target_tracker[ExtraData.record]) {
                this.target_tracker[ExtraData.record] = {}
            }
            this.target_tracker[ExtraData.record][hTarget.GetEntityIndex()] = true;
        }
        ExtraData.bounces = ExtraData.bounces + 1;
        let glaive_launched = false;
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), vLocation, undefined, this.GetSpecialValueFor("range"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST, false);
        if (ExtraData.bounces < this.GetSpecialValueFor("bounces") && GameFunc.GetCount(enemies) > 1) {
            let all_enemies_bounced = true;
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (enemy != hTarget && !this.target_tracker[ExtraData.record][enemy.GetEntityIndex()]) {
                    all_enemies_bounced = false;
                    return;
                }
            }
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (enemy != hTarget && (!this.target_tracker[ExtraData.record][enemy.GetEntityIndex()] || all_enemies_bounced)) {
                    let glaive = {
                        Target: enemy,
                        Ability: this,
                        EffectName: "particles/units/heroes/hero_luna/luna_moon_glaive_bounce.vpcf",
                        iMoveSpeed: 900,
                        vSourceLoc: vLocation,
                        bDrawsOnMinimap: false,
                        bDodgeable: false,
                        bIsAttack: false,
                        bVisibleToEnemies: true,
                        bReplaceExisting: false,
                        flExpireTime: GameRules.GetGameTime() + 10,
                        bProvidesVision: false,
                        ExtraData: {
                            bounces: ExtraData.bounces,
                            record: ExtraData.record,
                            damage: ExtraData.damage
                        }
                    }
                    ProjectileManager.CreateTrackingProjectile(glaive);
                    glaive_launched = true;
                    return;
                }
            }
            if (!glaive_launched) {
                this.target_tracker[ExtraData.record] = undefined;
            }
        } else {
            this.target_tracker[ExtraData.record] = undefined;
        }
    }
}
@registerModifier()
export class modifier_imba_luna_moon_glaive extends BaseModifier_Plus {
    public glaive_particle: any;
    IsHidden(): boolean {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
    }
    BeRefresh(p_0: any,): void {
        if (!IsServer()) {
            return;
        }
        if (!this.glaive_particle && this.GetAbilityPlus().IsTrained()) {
            this.glaive_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_luna/luna_ambient_moon_glaive.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
            ParticleManager.SetParticleControlEnt(this.glaive_particle, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetCasterPlus().GetAbsOrigin(), true);
            this.AddParticle(this.glaive_particle, false, false, -1, false, false);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_FEEDBACK
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_FEEDBACK)
    CC_GetModifierProcAttack_Feedback(keys: ModifierAttackEvent): number {
        if (!IsServer()) {
            return;
        }
        if (keys.attacker == this.GetParentPlus() && !this.GetParentPlus().PassivesDisabled()) {
            let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), keys.target.GetAbsOrigin(), undefined, this.GetSpecialValueFor("range"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST, false);
            let crescents = 0;
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (enemy != keys.target) {
                    let glaive = {
                        Target: enemy,
                        Source: keys.target,
                        Ability: this.GetAbilityPlus(),
                        EffectName: "particles/units/heroes/hero_luna/luna_moon_glaive_bounce.vpcf",
                        iMoveSpeed: 900,
                        bDrawsOnMinimap: false,
                        bDodgeable: false,
                        bIsAttack: false,
                        bVisibleToEnemies: true,
                        bReplaceExisting: false,
                        flExpireTime: GameRules.GetGameTime() + 10,
                        bProvidesVision: false,
                        ExtraData: {
                            bounces: 0,
                            record: keys.record,
                            damage: keys.original_damage
                        }
                    }
                    ProjectileManager.CreateTrackingProjectile(glaive);
                    crescents = crescents + 1;
                    if (crescents > this.GetSpecialValueFor("bounces") || !this.GetAbilityPlus().IsCooldownReady()) {
                        return;
                    }
                }
            }
            if (this.GetAbilityPlus().IsCooldownReady() && GameFunc.GetCount(enemies) > 1) {
                this.GetAbilityPlus().UseResources(false, false, true);
            }
        }
    }
}
@registerAbility()
export class imba_luna_lunar_blessing extends BaseAbility_Plus {
    public full_moon: any;
    IsStealable(): boolean {
        return false;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_luna_lunar_blessing_aura";
    }
    CastFilterResult(): UnitFilterResult {
        this.full_moon = GameRules.GetDOTATime(true, true);
        return UnitFilterResult.UF_SUCCESS;
    }
    GetAbilityTextureName(): string {
        if (this.full_moon && GameRules.GetDOTATime(true, true) - this.full_moon <= this.GetSpecialValueFor("full_moon_duration")) {
            return "luna_lunar_blessing_full_moon";
        } else {
            return "luna_lunar_blessing";
        }
    }
}
@registerModifier()
export class modifier_imba_luna_lunar_blessing_aura extends BaseModifier_Plus {
    public initialized: any;
    public hero_primary_attribute: any;
    IsHidden(): boolean {
        return !(this.GetAbilityPlus() && this.GetAbilityPlus().GetLevel() >= 1);
    }
    IsAura(): boolean {
        return this.GetParentPlus() == this.GetCasterPlus();
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO;
    }
    GetModifierAura(): string {
        return "modifier_imba_luna_lunar_blessing_aura";
    }
    GetEffectName(): string {
        let ability = this.GetAbilityPlus<imba_luna_lunar_blessing>();
        if (ability && ability.GetLevel() >= 1 && (this.GetParentPlus() == this.GetCasterPlus() || (ability.full_moon && GameRules.GetDOTATime(true, true) - ability.full_moon <= this.GetSpecialValueFor("full_moon_duration")))) {
            return "particles/units/heroes/hero_luna/luna_ambient_lunar_blessing.vpcf";
        }
    }
    BeCreated(p_0: any,): void {
        this.initialized = false;
        this.StartIntervalThink(FrameTime());
        if (!IsServer()) {
            return;
        }
        this.SetStackCount(this.GetParentPlus().GetPrimaryAttribute() || 0);
    }
    OnIntervalThink(): void {
        if (!this.initialized) {
            this.hero_primary_attribute = this.GetStackCount();
            this.SetStackCount(0);
            this.initialized = true;
            if (IsServer()) {
                this.StartIntervalThink(0.5);
            } else {
                this.StartIntervalThink(-1);
            }
        }
        if (IsServer()) {
            // this.GetParentPlus().CalculateStatBonus(true);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            4: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        let ability = this.GetAbilityPlus<imba_luna_lunar_blessing>();
        if (ability && (this.hero_primary_attribute == Attributes.DOTA_ATTRIBUTE_STRENGTH ||
            (ability.full_moon && GameRules.GetDOTATime(true, true) - ability.full_moon <= this.GetSpecialValueFor("full_moon_duration"))) && !this.GetCasterPlus().PassivesDisabled()) {
            return this.GetSpecialValueFor("primary_attribute");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        let ability = this.GetAbilityPlus<imba_luna_lunar_blessing>();
        if (ability && (this.hero_primary_attribute == Attributes.DOTA_ATTRIBUTE_AGILITY ||
            (ability.full_moon && GameRules.GetDOTATime(true, true) - ability.full_moon <= this.GetSpecialValueFor("full_moon_duration"))) && !this.GetCasterPlus().PassivesDisabled()) {
            return this.GetSpecialValueFor("primary_attribute");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        let ability = this.GetAbilityPlus<imba_luna_lunar_blessing>();
        if (ability && (this.hero_primary_attribute == Attributes.DOTA_ATTRIBUTE_INTELLECT || (ability.full_moon && GameRules.GetDOTATime(true, true) - ability.full_moon <= this.GetSpecialValueFor("full_moon_duration"))) && !this.GetCasterPlus().PassivesDisabled()) {
            return this.GetSpecialValueFor("primary_attribute");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION)
    CC_GetBonusNightVision(): number {
        let ability = this.GetAbilityPlus<imba_luna_lunar_blessing>();
        if (this.GetAbilityPlus() && (this.GetParentPlus() == this.GetCasterPlus() || (ability.full_moon && GameRules.GetDOTATime(true, true) - ability.full_moon <= this.GetSpecialValueFor("full_moon_duration"))) && !this.GetCasterPlus().PassivesDisabled()) {
            return this.GetSpecialValueFor("bonus_night_vision");
        }
    }
}
@registerAbility()
export class imba_luna_lunar_blessing_723 extends BaseAbility_Plus {
    public full_moon: any;
    IsStealable(): boolean {
        return false;
    }
    GetIntrinsicModifierName(): string {
        return "modifier_imba_luna_lunar_blessing_aura_723";
    }
    CastFilterResult(): UnitFilterResult {
        this.full_moon = GameRules.GetDOTATime(true, true);
        return UnitFilterResult.UF_SUCCESS;
    }
    GetAbilityTextureName(): string {
        if (this.full_moon && GameRules.GetDOTATime(true, true) - this.full_moon <= this.GetSpecialValueFor("full_moon_duration")) {
            return "luna_lunar_blessing_full_moon";
        } else {
            return "luna_lunar_blessing";
        }
    }
}
@registerModifier()
export class modifier_imba_luna_lunar_blessing_aura_723 extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraRadius(): number {
        if (!this.GetCasterPlus().PassivesDisabled()) {
            let ability = this.GetAbilityPlus<imba_luna_lunar_blessing>();
            if ((ability.full_moon && GameRules.GetDOTATime(true, true) - ability.full_moon <= this.GetSpecialValueFor("full_moon_duration"))) {
                return 25000;
            } else {
                return this.GetSpecialValueFor("radius");
            }
        }
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_imba_luna_lunar_blessing_723";
    }
    GetAuraEntityReject(hEntity: IBaseNpc_Plus): boolean {
        let ability = this.GetAbilityPlus<imba_luna_lunar_blessing>();
        return (!hEntity.GetPlayerID && !hEntity.GetOwnerEntity()) || (!hEntity.IsRangedAttacker() && !((ability.full_moon && GameRules.GetDOTATime(true, true) - ability.full_moon <= this.GetSpecialValueFor("full_moon_duration"))));
    }
}
@registerModifier()
export class modifier_imba_luna_lunar_blessing_723 extends BaseModifier_Plus {
    public armor: any;
    BeCreated(p_0: any,): void {
        this.armor = this.GetParentPlus().GetPhysicalArmorValue(false);
        this.StartIntervalThink(0.1);
    }
    OnIntervalThink(): void {
        this.armor = 0;
        this.armor = this.GetParentPlus().GetPhysicalArmorValue(false);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP,
            3: GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE,
            4: GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        if (this.GetAbilityPlus() && !this.GetCasterPlus().PassivesDisabled() && this.armor) {
            return this.armor * this.GetSpecialValueFor("armor_pct") * 0.01;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        if (this.GetAbilityPlus() && !this.GetCasterPlus().PassivesDisabled()) {
            return this.GetSpecialValueFor("armor_pct");
        } else {
            return 0;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    CC_GetModifierBaseDamageOutgoing_Percentage(p_0: ModifierAttackEvent,): number {
        if (this.GetAbilityPlus() && !this.GetCasterPlus().PassivesDisabled()) {
            return this.GetSpecialValueFor("damage_pct");
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BONUS_NIGHT_VISION)
    CC_GetBonusNightVision(): number {
        let ability = this.GetAbilityPlus<imba_luna_lunar_blessing>();
        if (ability && (this.GetParentPlus() == this.GetCasterPlus() ||
            (ability.full_moon && GameRules.GetDOTATime(true, true) - ability.full_moon <= this.GetSpecialValueFor("full_moon_duration"))) && !this.GetCasterPlus().PassivesDisabled()) {
            return this.GetSpecialValueFor("bonus_night_vision");
        }
    }
}
@registerAbility()
export class imba_luna_eclipse extends BaseAbility_Plus {
    OnAbilityPhaseStart(): boolean {
        if (!IsServer()) {
            return;
        }
        let precast_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_luna/luna_eclipse_precast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetCasterPlus());
        ParticleManager.SetParticleControlEnt(precast_particle, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetCasterPlus().GetAbsOrigin(), true);
        ParticleManager.ReleaseParticleIndex(precast_particle);
        return true;
    }
    GetAssociatedPrimaryAbilities(): string {
        return "imba_luna_lucent_beam";
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetCasterPlus().HasScepter()) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET;
        }
    }
    GetCastRange(p_0: Vector, p_1: CDOTA_BaseNPC | undefined,): number {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("cast_range_tooltip_scepter");
        } else {
            return this.GetSpecialValueFor("radius");
        }
    }
    GetAOERadius(): number {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("radius");
        } else {
            return 0;
        }
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        if (this.GetCasterPlus().HasScepter()) {
            if (this.GetCursorTarget()) {
                this.GetCursorTarget().EmitSound("Hero_Luna.Eclipse.Cast");
            } else if (this.GetCursorPosition()) {
                EmitSoundOnLocationWithCaster(this.GetCursorPosition(), "Hero_Luna.Eclipse.Cast", this.GetCasterPlus());
            }
        } else {
            this.GetCasterPlus().EmitSound("Hero_Luna.Eclipse.Cast");
        }
        if (this.GetCasterPlus().GetName().includes("luna")) {
            let responses = {
                "1": "luna_luna_ability_eclipse_01",
                "2": "luna_luna_ability_eclipse_02",
                "3": "luna_luna_ability_eclipse_03",
                "4": "luna_luna_ability_eclipse_07"
            }
            this.GetCasterPlus().EmitSound(GFuncRandom.RandomValue(responses));
        }
        if (this.GetCasterPlus().HasScepter() && this.GetCursorTarget()) {
            this.GetCursorTarget().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_luna_eclipse", {});
        } else {
            let modifier_params: IModifierTable = {}
            if (this.GetCasterPlus().HasScepter() && this.GetCursorPosition()) {
                modifier_params.x = this.GetCursorPosition().x;
                modifier_params.y = this.GetCursorPosition().y;
                modifier_params.z = this.GetCursorPosition().z;
            }
            this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_luna_eclipse", modifier_params);
        }
        GameRules.BeginTemporaryNight(this.GetSpecialValueFor("night_duration"));
    }
}
@registerModifier()
export class modifier_imba_luna_eclipse extends BaseModifier_Plus {
    public beams: any;
    public hit_count: number;
    public beam_interval: number;
    public beam_interval_scepter: number;
    public duration_tooltip: number;
    public radius: number;
    public beams_scepter: any;
    public hit_count_scepter: number;
    public duration_tooltip_scepter: number;
    public cast_range_tooltip_scepter: number;
    public night_duration: number;
    public dark_moon_additional_beams: any;
    public moonscraper_beams: any;
    public moonscraper_spread: any;
    public moonscraper_radius: number;
    public beams_elapsed: any;
    public targets: { [k: string]: number };
    public target_position: any;
    public cast_pos: any;
    public refraction_pos: any;
    public think_interval: number;
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(params: any): void {
        this.beams = this.GetSpecialValueFor("beams");
        this.hit_count = this.GetSpecialValueFor("hit_count");
        this.beam_interval = this.GetSpecialValueFor("beam_interval");
        this.beam_interval_scepter = this.GetSpecialValueFor("beam_interval_scepter");
        this.duration_tooltip = this.GetSpecialValueFor("duration_tooltip");
        this.radius = this.GetSpecialValueFor("radius");
        this.beams_scepter = this.GetSpecialValueFor("beams_scepter");
        this.hit_count_scepter = this.GetSpecialValueFor("hit_count_scepter");
        this.duration_tooltip_scepter = this.GetSpecialValueFor("duration_tooltip_scepter");
        this.cast_range_tooltip_scepter = this.GetSpecialValueFor("cast_range_tooltip_scepter");
        this.night_duration = this.GetSpecialValueFor("night_duration");
        this.dark_moon_additional_beams = this.GetSpecialValueFor("dark_moon_additional_beams");
        this.moonscraper_beams = this.GetSpecialValueFor("moonscraper_beams");
        this.moonscraper_spread = this.GetSpecialValueFor("moonscraper_spread");
        this.moonscraper_radius = this.GetSpecialValueFor("moonscraper_radius");
        if (!IsServer()) {
            return;
        }
        this.beams_elapsed = 0;
        this.targets = {}
        let eclipse_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_luna/luna_eclipse.vpcf", ParticleAttachment_t.PATTACH_POINT, this.GetParentPlus());
        ParticleManager.SetParticleControl(eclipse_particle, 1, Vector(this.radius, 0, 0));
        if (params.x) {
            this.target_position = Vector(params.x, params.y, params.z);
            ParticleManager.SetParticleControl(eclipse_particle, 0, this.target_position);
        }
        this.AddParticle(eclipse_particle, false, false, -1, false, false);
        this.cast_pos = this.target_position || this.GetParentPlus().GetAbsOrigin();
        this.refraction_pos = this.cast_pos + RandomVector(this.radius);
        if (!this.target_position && this.GetCasterPlus().HasAbility("imba_luna_lunar_blessing") && this.GetCasterPlus().findAbliityPlus<imba_luna_lunar_blessing>("imba_luna_lunar_blessing").IsTrained()) {
            let ultimate_blessing_particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_luna/luna_ultimate_blessing.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetParentPlus());
            ParticleManager.SetParticleControlEnt(ultimate_blessing_particle, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", this.GetParentPlus().GetAbsOrigin(), true);
            this.AddParticle(ultimate_blessing_particle, false, false, -1, true, false);
        }
        this.OnIntervalThink();
        if (this.GetCasterPlus().HasScepter()) {
            this.StartIntervalThink(this.beam_interval_scepter);
        } else {
            this.StartIntervalThink(this.beam_interval);
        }
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        if (((this.GetCasterPlus().HasScepter() && this.beams_elapsed >= this.beams_scepter) || (!this.GetCasterPlus().HasScepter() && this.beams_elapsed >= this.beams)) || this.GetElapsedTime() >= this.night_duration) {
            this.Destroy();
            return;
        }
        if (this.target_position) {
            AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), this.target_position, this.radius, this.beam_interval_scepter, true);
        }
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.target_position || this.GetParentPlus().GetAbsOrigin(), undefined, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_ANY_ORDER, false);
        let valid_targets = false;
        let lucent_beam_ability = this.GetCasterPlus().findAbliityPlus<imba_luna_lucent_beam>("imba_luna_lucent_beam");
        for (const [_, enemy] of GameFunc.iPair(enemies)) {
            if (!this.targets[enemy.GetEntityIndex()]) {
                this.targets[enemy.GetEntityIndex()] = 0;
            }
            if ((this.GetCasterPlus().HasScepter() && this.targets[enemy.GetEntityIndex()] < this.hit_count_scepter) || (!this.GetCasterPlus().HasScepter() && this.targets[enemy.GetEntityIndex()] < this.hit_count)) {
                this.targets[enemy.GetEntityIndex()] = this.targets[enemy.GetEntityIndex()] + 1;
                enemy.EmitSound("Hero_Luna.Eclipse.Target");
                let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_luna/luna_eclipse_impact.vpcf", ParticleAttachment_t.PATTACH_POINT, enemy);
                ParticleManager.SetParticleControl(particle, 1, enemy.GetAbsOrigin());
                ParticleManager.SetParticleControlEnt(particle, 5, enemy, ParticleAttachment_t.PATTACH_POINT, "attach_hitloc", enemy.GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(particle);
                if (lucent_beam_ability) {
                    let damageTable = {
                        victim: enemy,
                        damage: lucent_beam_ability.GetTalentSpecialValueFor("beam_damage"),
                        damage_type: lucent_beam_ability.GetAbilityDamageType(),
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                        attacker: this.GetCasterPlus(),
                        ability: lucent_beam_ability
                    }
                    ApplyDamage(damageTable);
                    if (this.GetCasterPlus().HasTalent("special_bonus_unique_luna_5")) {
                        enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_stunned", {
                            duration: this.GetCasterPlus().GetTalentValue("special_bonus_unique_luna_5") * (1 - enemy.GetStatusResistance())
                        });
                    }
                }
                valid_targets = true;
                return;
            }
        }
        if (!valid_targets) {
            let random_location = RandomVector(RandomInt(0, this.radius));
            EmitSoundOnLocationWithCaster((this.target_position || this.GetParentPlus().GetAbsOrigin()) + random_location, "Hero_Luna.Eclipse.NoTarget", this.GetCasterPlus());
            let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_luna/luna_eclipse_impact_notarget.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetCasterPlus());
            ParticleManager.SetParticleControl(particle, 1, (this.target_position || this.GetParentPlus().GetAbsOrigin()) + random_location);
            ParticleManager.SetParticleControl(particle, 5, (this.target_position || this.GetParentPlus().GetAbsOrigin()) + random_location);
            ParticleManager.ReleaseParticleIndex(particle);
        }
        if (this.GetCasterPlus().HasScepter()) {
            this.think_interval = this.beam_interval_scepter;
        } else {
            this.think_interval = this.beam_interval;
        }
        for (let outer_beam = 0; outer_beam <= this.moonscraper_beams - 1; outer_beam++) {
            this.AddTimer((outer_beam / this.moonscraper_beams) * this.think_interval, () => {
                if (this && this.IsNull && !this.IsNull() && this.GetParent && this.GetParentPlus() && this.GetParentPlus().IsNull && !this.GetParentPlus().IsNull() && this.GetCaster && this.GetCasterPlus().IsNull && !this.GetCasterPlus().IsNull()) {
                    let beam_pos = GetGroundPosition(RotatePosition(this.cast_pos, QAngle(0, this.moonscraper_spread * outer_beam, 0), this.refraction_pos), undefined);
                    let particle = ResHelper.CreateParticleEx("particles/units/heroes/hero_luna/luna_eclipse_impact.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.GetParentPlus());
                    ParticleManager.SetParticleControl(particle, 1, beam_pos);
                    ParticleManager.SetParticleControl(particle, 5, beam_pos);
                    ParticleManager.SetParticleControl(particle, 60, Vector(RandomInt(0, 255), RandomInt(0, 255), RandomInt(0, 255)));
                    ParticleManager.SetParticleControl(particle, 61, Vector(1, 0, 0));
                    ParticleManager.ReleaseParticleIndex(particle);
                    let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), beam_pos, undefined, this.moonscraper_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
                    for (const [_, enemy] of GameFunc.iPair(enemies)) {
                        if (lucent_beam_ability) {
                            let damageTable = {
                                victim: enemy,
                                damage: lucent_beam_ability.GetTalentSpecialValueFor("beam_damage"),
                                damage_type: lucent_beam_ability.GetAbilityDamageType(),
                                damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                                attacker: this.GetCasterPlus(),
                                ability: lucent_beam_ability
                            }
                            ApplyDamage(damageTable);
                        }
                    }
                }
            });
        }
        this.cast_pos = this.target_position || this.GetParentPlus().GetAbsOrigin();
        this.refraction_pos = RotatePosition(this.cast_pos, QAngle(0, 10 * 8, 0), this.refraction_pos);
        this.beams_elapsed = this.beams_elapsed + 1;
        if (this.GetCasterPlus().HasScepter()) {
            this.SetStackCount(math.max(this.beams_scepter - this.beams_elapsed, 0));
        } else {
            this.SetStackCount(math.max(this.beams - this.beams_elapsed, 0));
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PURE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PURE)
    CC_GetModifierProcAttack_BonusDamage_Pure(p_0: ModifierAttackEvent,): number {
        if (IsServer() && !this.target_position && (this.GetCasterPlus().HasAbility("imba_luna_lunar_blessing") || this.GetCasterPlus().HasAbility("imba_luna_lunar_blessing_723"))) {
            return this.GetCasterPlus().findAbliityPlus<imba_luna_lunar_blessing>("imba_luna_lunar_blessing").GetSpecialValueFor("eclipse_pure_damage");
        }
    }
}
@registerModifier()
export class modifier_special_bonus_imba_luna_lucent_beam_cooldown extends BaseModifier_Plus {
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
