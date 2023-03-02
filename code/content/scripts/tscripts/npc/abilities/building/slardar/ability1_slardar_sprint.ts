
import { AI_ability } from "../../../../ai/AI_ability";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { ActiveRootAbility } from "../../ActiveRootAbility";

/** dota原技能数据 */
export const Data_slardar_sprint = { "ID": "5114", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "Hero_Slardar.Sprint", "HasScepterUpgrade": "1", "AbilityCastRange": "0", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilityManaCost": "25", "AbilityCooldown": "17", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "bonus_speed": "16 24 32 40" }, "02": { "var_type": "FIELD_FLOAT", "duration": "10" }, "03": { "var_type": "FIELD_INTEGER", "river_speed": "25" }, "04": { "var_type": "FIELD_INTEGER", "puddle_regen": "30", "RequiresScepter": "1" }, "05": { "var_type": "FIELD_INTEGER", "puddle_armor": "10", "RequiresScepter": "1" }, "06": { "var_type": "FIELD_INTEGER", "puddle_status_resistance": "40", "RequiresScepter": "1" }, "07": { "var_type": "FIELD_INTEGER", "river_speed_tooltip": "41 49 57 65" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_slardar_sprint extends ActiveRootAbility {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "slardar_sprint";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_slardar_sprint = Data_slardar_sprint;
    Init() {
        this.SetDefaultSpecialValue("puddle_max_attack_speed_bonus", 180);
        this.SetDefaultSpecialValue("puddle_stun_increase", 50);
        this.SetDefaultSpecialValue("puddle_crit_damage_increase", 100);
        this.SetDefaultSpecialValue("shard_amplify_attack_damage_pct", 100);
        this.SetDefaultSpecialValue("crush_radius", 400);
        this.SetDefaultSpecialValue("crush_extra_slow", [-15, -20, -25, -30, -35, -40]);
        this.SetDefaultSpecialValue("crush_extra_slow_duration", [3, 3.6, 4.2, 4.8, 5.4, 6]);
        this.SetDefaultSpecialValue("crush_stun_duration", [1.3, 1.5, 1.7, 1.9, 2.1, 2.3]);
        this.SetDefaultSpecialValue("crush_damage", [700, 1400, 2100, 3000, 4000, 5200]);
        this.SetDefaultSpecialValue("puddle_radius", 750);
        this.SetDefaultSpecialValue("puddle_attack_bonus", 200);
        this.SetDefaultSpecialValue("puddle_attack_speed_bonus", 180);

    }

    hBuffPtcl: modifier_slardar_1_particle_pre;
    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let sTalentName = "special_bonus_unique_slardar_custom_4"
        return this.GetSpecialValueFor("crush_radius") + hCaster.GetTalentValue(sTalentName)
    }
    OnAbilityPhaseStart() {
        this.hBuffPtcl = modifier_slardar_1_particle_pre.apply(this.GetCasterPlus(), this.GetCasterPlus(), this)
        return true
    }
    OnAbilityPhaseInterrupted() {
        if (GFuncEntity.IsValid(this.hBuffPtcl)) {
            this.hBuffPtcl.Destroy()
        }
    }
    GetIncreasedStunDuration(hTarget: IBaseNpc_Plus) {
        let puddle_stun_increase = this.GetSpecialValueFor("puddle_stun_increase")
        if (this.GetCasterPlus().HasScepter() && modifier_slardar_1_aura_debuff.exist(hTarget)) {
            return 1 + puddle_stun_increase / 100
        }
        return 1
    }
    OnSpellStart() {
        if (GFuncEntity.IsValid(this.hBuffPtcl)) {
            this.hBuffPtcl.Destroy()
        }
        let hCaster = this.GetCasterPlus()
        let vPosition = hCaster.GetAbsOrigin()
        let sTalentName = "special_bonus_unique_slardar_custom_6"
        let crush_radius = this.GetCastRange(vPosition, hCaster)
        let crush_extra_slow_duration = this.GetSpecialValueFor("crush_extra_slow_duration")
        let crush_stun_duration = this.GetSpecialValueFor("crush_stun_duration") + hCaster.GetTalentValue(sTalentName)
        let crush_damage = this.GetSpecialValueFor("crush_damage")

        modifier_slardar_1_particle_start.apply(hCaster, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Slardar.Slithereen_Crush", hCaster))

        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vPosition, crush_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
        for (let hTarget of (tTargets)) {
            let tDamageTable = {
                ability: this,
                victim: hTarget,
                attacker: hCaster,
                damage: crush_damage,
                damage_type: this.GetAbilityDamageType(),
            }
            BattleHelper.GoApplyDamage(tDamageTable)
            modifier_stunned.apply(hTarget, hCaster, this, { duration: crush_stun_duration * hTarget.GetStatusResistanceFactor(hCaster) * this.GetIncreasedStunDuration(hTarget) })
            modifier_slardar_1_slow.apply(hTarget, hCaster, this, { duration: (crush_stun_duration + crush_extra_slow_duration) * hTarget.GetStatusResistanceFactor(hCaster) })
        }
    }

    GetIntrinsicModifierName() {
        return modifier_slardar_1.name;
    }

    AutoSpellSelf(): boolean {
        let radius = this.GetSpecialValueFor("crush_radius")
        return AI_ability.NO_TARGET_if_enemy(this, radius)
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_slardar_1 extends BaseModifier_Plus {
    IsHidden() {
        return true
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (!GFuncEntity.IsValid(ability)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let hCaster = ability.GetCasterPlus()

            if (hCaster.IsTempestDouble() || hCaster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }

            if (hCaster.HasScepter()) {
                if (!modifier_slardar_1_scepter_buff.exist(hCaster)) {
                    modifier_slardar_1_scepter_buff.apply(hCaster, hCaster, ability, null)
                }
            } else {
                if (modifier_slardar_1_scepter_buff.exist(hCaster)) {
                    modifier_slardar_1_scepter_buff.remove(hCaster);
                }
            }

            if (!ability.GetAutoCastState()) {
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }
            let range = this.GetAbilityPlus().GetCastRange(hCaster.GetAbsOrigin(), hCaster)
            let teamFilter = ability.GetAbilityTargetTeam()
            let typeFilter = ability.GetAbilityTargetType()
            let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_slardar_1_slow extends BaseModifier_Plus {
    crush_extra_slow: number;
    shard_amplify_attack_damage_pct: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
    }
    IsPurgable() {
        return true
    }
    IsPurgeException() {
        return true
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    Init(params: IModifierTable) {
        this.crush_extra_slow = this.GetSpecialValueFor("crush_extra_slow")
        this.shard_amplify_attack_damage_pct = this.GetSpecialValueFor("shard_amplify_attack_damage_pct")
        if (params.IsOnCreated && IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_slardar/slardar_crush_entity.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(particleID, false, false, -1, false, this.ShouldUseOverheadOffset())
            particleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_slardar_crush.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: this.GetParentPlus()
            });

            this.AddParticle(particleID, false, true, 10, false, false)
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(params: IModifierTable) {
        return this.crush_extra_slow
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamagePercentage(params: ModifierAttackEvent) {
        if (GFuncEntity.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().HasShard() && params != null && params.damage_category == DamageCategory_t.DOTA_DAMAGE_CATEGORY_ATTACK) {
            return this.shard_amplify_attack_damage_pct
        }
        return 0
    }
}

// 特效
@registerModifier()
export class modifier_slardar_1_particle_pre extends modifier_particle {
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_slardar/slardar_crush_start.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetCasterPlus()
            });

            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }
}

// 特效
@registerModifier()
export class modifier_slardar_1_particle_start extends modifier_particle {
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let hCaster = this.GetCasterPlus()
            let vPosition = hCaster.GetAbsOrigin()
            let crush_radius = this.GetAbilityPlus().GetCastRange(vPosition, hCaster)
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_slardar/slardar_crush.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControl(iParticleID, 1, Vector(crush_radius, crush_radius, crush_radius))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_slardar_1_scepter_buff// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_slardar_1_scepter_buff extends BaseModifier_Plus {
    puddle_radius: number;
    puddle_attack_bonus: number;
    puddle_attack_speed_bonus: number;
    puddle_max_attack_speed_bonus: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    IsAura() {
        return this.GetCasterPlus().HasScepter()
    }
    GetAuraRadius() {
        return this.puddle_radius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_ALL
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
    }
    GetAura() {
        return "modifier_slardar_1_aura_debuff"
    }

    Init(params: IModifierTable) {
        this.puddle_radius = this.GetSpecialValueFor("puddle_radius")
        this.puddle_attack_bonus = this.GetSpecialValueFor("puddle_attack_bonus")
        this.puddle_attack_speed_bonus = this.GetSpecialValueFor("puddle_attack_speed_bonus")
        this.puddle_max_attack_speed_bonus = this.GetSpecialValueFor("puddle_max_attack_speed_bonus")
        if (params.IsOnCreated && IsClient()) {
            let hCaster = this.GetCasterPlus()
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_slardar/slardar_water_puddle.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, null, hCaster.GetAbsOrigin(), false)
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.puddle_radius, 1, 1))
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS)
    G_MAX_ATTACKSPEED_BONUS() {
        return this.puddle_max_attack_speed_bonus
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    GetBaseDamageOutgoing_Percentage(params: IModifierTable) {
        return this.GetCasterPlus().HasScepter() && this.puddle_attack_bonus || 0
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant(params: IModifierTable) {
        return this.GetCasterPlus().HasScepter() && this.puddle_attack_speed_bonus || 0
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    Tooltip(params: IModifierTable) {
        return this.GetCasterPlus().HasScepter() && this.puddle_max_attack_speed_bonus || 0
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_slardar_1_aura_debuff// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_slardar_1_aura_debuff extends BaseModifier_Plus {
    puddle_stun_increase: number;
    puddle_crit_damage_increase: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return true
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    Init(params: IModifierTable) {
        this.puddle_stun_increase = this.GetSpecialValueFor("puddle_stun_increase")
        this.puddle_crit_damage_increase = this.GetSpecialValueFor("puddle_crit_damage_increase")
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_tooltip(params: IModifierTable) {
        return this.puddle_stun_increase
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP2)
    CC_tooltip2(params: IModifierTable) {
        return this.puddle_crit_damage_increase
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_CRITICALSTRIKE_PERCENT)
    CC_GetModifierIncomingCriticalStrikePercent(params: IModifierTable) {
        if (params.attacker == this.GetCasterPlus()) {
            return this.puddle_crit_damage_increase
        }
    }
}
