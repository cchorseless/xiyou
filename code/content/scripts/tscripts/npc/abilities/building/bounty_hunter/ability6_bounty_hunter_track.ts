
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_bounty_hunter_track = { "ID": "5288", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES | DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "Hero_BountyHunter.Target", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO", "AbilityCastRange": "1000", "AbilityCastPoint": "0.3 0.3 0.3", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "4", "AbilityManaCost": "60", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "target_crit_multiplier": "140 170 200" }, "02": { "var_type": "FIELD_INTEGER", "bonus_gold_radius": "1200" }, "03": { "var_type": "FIELD_INTEGER", "bonus_gold_self": "130 225 320", "LinkedSpecialBonus": "special_bonus_unique_bounty_hunter_3" }, "04": { "var_type": "FIELD_INTEGER", "bonus_gold": "40 80 120", "LinkedSpecialBonus": "special_bonus_unique_bounty_hunter_3" }, "05": { "var_type": "FIELD_FLOAT", "duration": "30.0 30.0 30.0" }, "06": { "var_type": "FIELD_FLOAT", "gold_steal": "0.3 0.4 0.5" }, "07": { "var_type": "FIELD_INTEGER", "bonus_move_speed_pct": "16 20 24" } } };

@registerAbility()
export class ability6_bounty_hunter_track extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "bounty_hunter_track";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_bounty_hunter_track = Data_bounty_hunter_track;
    Init() {
        this.SetDefaultSpecialValue("shard_bonus_attack_speed_limit", 600);
        this.SetDefaultSpecialValue("target_crit_multiplier", [180, 220, 260, 300, 340, 380]);
        this.SetDefaultSpecialValue("threshold_hp_percent", 20);
        this.SetDefaultSpecialValue("stack_count", 5);
        this.SetDefaultSpecialValue("min_gold", [1, 2, 3, 4, 5, 6]);
        this.SetDefaultSpecialValue("max_gold", [2, 4, 6, 10, 14, 18]);
        this.SetDefaultSpecialValue("cast_range_tooltip", 1000);
        this.SetDefaultSpecialValue("radius", 500);
        this.SetDefaultSpecialValue("bonus_xp_percent", 200);
        this.SetDefaultSpecialValue("shard_bonus_attack_speed", 200);

    }





    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()

        if (!GameFunc.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        if (hTarget.TriggerSpellAbsorb(this)) {
            return
        }

        EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_BountyHunter.Target", hCaster), hCaster)

        modifier_bounty_hunter_6_track.apply(hTarget, hCaster, this, null)
    }

    GetIntrinsicModifierName() {
        return "modifier_bounty_hunter_6"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_bounty_hunter_6 extends BaseModifier_Plus {
    shard_bonus_attack_speed: number;
    shard_bonus_attack_speed_limit: number;
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

        this.shard_bonus_attack_speed = this.GetSpecialValueFor("shard_bonus_attack_speed")
        this.shard_bonus_attack_speed_limit = this.GetSpecialValueFor("shard_bonus_attack_speed_limit")
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (!GameFunc.IsValid(ability)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let caster = ability.GetCasterPlus()

            if (!ability.GetAutoCastState()) {
                return
            }

            if (caster.IsTempestDouble() || caster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()

            //  优先攻击目标
            let target = caster.GetAttackTarget()
            if (target != null && target.GetClassname() == "dota_item_drop") {
                target = null
            }
            if (target != null && !target.IsPositionInRange(caster.GetAbsOrigin(), range)) {
                target = null
            }
            if (target != null && modifier_bounty_hunter_6_track.exist(target)) {
                target = null
            }

            //  搜索范围
            if (target == null) {
                let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
                let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
                let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
                let order = FindOrder.FIND_CLOSEST
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
                for (let unit of (targets)) {

                    if (!modifier_bounty_hunter_6_track.exist(unit)) {
                        target = unit
                        break
                    }
                }
            }

            //  施法命令
            if (target != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                    TargetIndex: target.entindex(),
                    AbilityIndex: ability.entindex()
                })
            }
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant() {
        if (IsServer()) {
            if (GameFunc.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().HasShard() && GameFunc.IsValid(this.GetCasterPlus().GetAttackTarget()) && this.GetCasterPlus().GetAttackTarget().GetClassname() != "dota_item_drop" && modifier_bounty_hunter_6_track.exist(this.GetCasterPlus().GetAttackTarget())) {
                return this.shard_bonus_attack_speed
            }
            return 0
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS)
    CC_GetModifierMaximumAttackSpeedBonus() {
        if (IsServer()) {
            if (GameFunc.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().HasShard() && GameFunc.IsValid(this.GetCasterPlus().GetAttackTarget()) && this.GetCasterPlus().GetAttackTarget().GetClassname() != "dota_item_drop" && modifier_bounty_hunter_6_track.exist(this.GetCasterPlus().GetAttackTarget())) {
                return this.shard_bonus_attack_speed_limit
            }
            return 0
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_bounty_hunter_6_track extends BaseModifier_Plus {
    true_sight_radius: any;
    target_crit_multiplier: number;
    threshold_hp_percent: number;
    stack_count: number;
    min_gold: number;
    max_gold: number;
    radius: number;
    bonus_xp_percent: number;
    fTotalDamage: number;
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
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW
    }
    ShouldUseOverheadOffset() {
        return true
    }
    IsAura() {
        return true
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE
    }
    GetAuraRadius() {
        return this.true_sight_radius
    }
    GetAura() {
        return "modifier_truesight"
    }
    BeCreated(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        let extra_target_crit_multiplier = hCaster.HasTalent("special_bonus_unique_bounty_hunter_custom_7") && hCaster.GetTalentValue("special_bonus_unique_bounty_hunter_custom_7") || 0
        this.target_crit_multiplier = this.GetSpecialValueFor("target_crit_multiplier") + extra_target_crit_multiplier
        this.threshold_hp_percent = this.GetSpecialValueFor("threshold_hp_percent")
        this.stack_count = this.GetSpecialValueFor("stack_count")
        this.min_gold = this.GetSpecialValueFor("min_gold")
        this.max_gold = this.GetSpecialValueFor("max_gold")
        this.true_sight_radius = this.GetSpecialValueFor("true_sight_radius")
        this.radius = this.GetSpecialValueFor("radius")
        this.bonus_xp_percent = this.GetSpecialValueFor("bonus_xp_percent")
        let hTarget = this.GetParentPlus()
        this.fTotalDamage = 0
        if (IsServer()) {
            // 修改改单位死亡时的经验值
            // if (hTarget.SetBonusDeathXPPercent != null) {
            //     this.key = hTarget.SetBonusDeathXPPercent(this.bonus_xp_percent)
            // }
            let iStackCount = math.floor((hTarget.GetHealth() / hTarget.GetMaxHealth()) * this.stack_count)
            this.SetStackCount(math.max(iStackCount, 1))

            if (params.bShift == null) {
                let iParticleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_bounty_hunter/bounty_hunter_track_cast.vpcf",
                    resNpc: hCaster,
                    iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                    owner: hCaster
                });

                ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_weapon2", hCaster.GetAbsOrigin(), true)
                ParticleManager.SetParticleControlEnt(iParticleID, 1, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
                ParticleManager.ReleaseParticleIndex(iParticleID)
            }
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_bounty_hunter/bounty_hunter_track_shield.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: this.GetEffectAttachType(),
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, this.ShouldUseOverheadOffset())
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_bounty_hunter/bounty_hunter_track_trail.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hTarget
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 1, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }

    BeDestroy() {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsServer()) {
            if (!hParent.IsAlive()) {
                // 当标记单位死亡时，转移到附件最近的附近最近的单位身上
                if (GameFunc.IsValid(hCaster) && hCaster.IsAlive()) {
                    let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), null, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST, false)
                    for (let hTarget of (tTarget)) {
                        if (GameFunc.IsValid(hTarget) && hTarget.IsAlive()) {
                            modifier_bounty_hunter_6_track.apply(hTarget, hCaster, hAbility, { bShift: true })
                            break
                        }
                    }
                }
            } else {
                // if (hParent.SetBonusDeathXPPercent != null) {
                //     if (this.key != null) {
                //         hParent.SetBonusDeathXPPercent(null, this.key)
                //     }
                // }
            }
        }
    }
    OnStackCountChanged(iOldStackCount: number) {
        if (IsServer()) {
            if (this.GetStackCount() == 0) {
                this.Destroy()
            }
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROVIDES_FOW_POSITION)
    GetProvidesFOWVision() {
        return 1
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TARGET_CRITICALSTRIKE)
    CC_GetModifierTargetCriticalStrike(params: IModifierTable) {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            if (!GameFunc.IsValid(hCaster)) {
                this.Destroy()
                return
            }

            if (hCaster == params.attacker || hCaster.HasScepter()) {
                return this.target_crit_multiplier
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE, false, true)
    OnTakeDamage(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetParentPlus()

        if (!GameFunc.IsValid(hCaster)) {
            this.Destroy()
            return
        }
        if (params.unit == hTarget) {
            this.fTotalDamage = this.fTotalDamage + params.damage

            let fThreshold = hTarget.GetMaxHealth() * this.threshold_hp_percent * 0.01
            let iCount = math.min(this.GetStackCount(), math.floor(this.fTotalDamage / fThreshold))
            for (let i = 1; i <= iCount; i++) {
                this.fTotalDamage = this.fTotalDamage - fThreshold

                let iGold = RandomInt(this.min_gold, this.max_gold)

                let fDelay = 0.1
                GTimerHelper.AddTimer(i * 0.1, GHandler.create(this, () => {
                    // if (Spawner.IsEndless()) {
                    //     return
                    // }
                    // let track_bounty  = modifier_bounty_hunter_track_bounty.findIn(  hCaster )
                    // if (GameFunc.IsValid(track_bounty) && type(track_bounty.AddTotalGold) == "function") {
                    //     track_bounty.AddTotalGold(iGold)
                    // }

                    // PlayerData.ModifyGold(hCaster.GetPlayerOwnerID(), iGold, true)

                    SendOverheadEventMessage(hCaster.GetPlayerOwner(), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_GOLD, hTarget, iGold, null)

                    EmitSoundOnLocationWithCaster(hCaster.GetAbsOrigin(), "General.Coins", hCaster)
                }))
                this.DecrementStackCount()
            }
            if (iCount > 0) {
                modifier_bounty_hunter_6_particle_bounty_hunter_track_reward.apply(hCaster, hTarget, this.GetAbilityPlus(), { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_bounty_hunter_6_particle_bounty_hunter_track_reward extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_bounty_hunter/bounty_hunter_track_reward.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 2, hParent, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 3, hCaster, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
