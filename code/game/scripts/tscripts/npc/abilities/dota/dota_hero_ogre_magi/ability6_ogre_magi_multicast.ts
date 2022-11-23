import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_particle, modifier_particle_thinker } from "../../../modifier/modifier_particle";
import { ability3_ogre_magi_bloodlust, modifier_ogre_magi_3_buff } from "./ability3_ogre_magi_bloodlust";

/** dota原技能数据 */
export const Data_ogre_magi_multicast = { "ID": "5441", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityCastAnimation": "ACT_INVALID", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "multicast_2_times": "75 75 75" }, "02": { "var_type": "FIELD_FLOAT", "multicast_3_times": "0 30 30" }, "03": { "var_type": "FIELD_FLOAT", "multicast_4_times": "0 0 15" } } };

@registerAbility()
export class ability6_ogre_magi_multicast extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "ogre_magi_multicast";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_ogre_magi_multicast = Data_ogre_magi_multicast;
    Init() {
        this.SetDefaultSpecialValue("modelscale", 25);
        this.SetDefaultSpecialValue("bonus_attack_speed", [50, 60, 70, 80, 90, 100]);
        this.SetDefaultSpecialValue("self_bonus", [100, 150, 200, 250, 300, 400]);
        this.SetDefaultSpecialValue("duration", 7);
        this.SetDefaultSpecialValue("multicast_bloodlust_aoe", 800);
        this.SetDefaultSpecialValue("duration_shard", 15);
        this.SetDefaultSpecialValue("count_shard", 3);
        this.SetDefaultSpecialValue("shard_damage", 8);
        this.SetDefaultSpecialValue("spell_amplify", [15, 20, 25, 30, 37, 45]);

    }

    Init_old() {
        this.SetDefaultSpecialValue("modelscale", 25);
        this.SetDefaultSpecialValue("bonus_attack_speed", [50, 60, 70, 80, 90, 100]);
        this.SetDefaultSpecialValue("self_bonus", [50, 70, 90, 110, 130, 150]);
        this.SetDefaultSpecialValue("duration", 7);
        this.SetDefaultSpecialValue("multicast_bloodlust_aoe", 800);

    }

    hLastTarget: BaseNpc_Plus;

    CastFilterResultTarget(hTarget: BaseNpc_Plus) {
        if (hTarget.GetUnitLabel() == "builder") {
            return UnitFilterResult.UF_FAIL_OTHER
        }
        return UnitFilter(hTarget, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, this.GetCasterPlus().GetTeamNumber())
    }
    Bloodlust(hTarget: BaseNpc_Plus) {
        if (!GameFunc.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }

        let hCaster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration")

        modifier_ogre_magi_6_buff.apply(hTarget, hCaster, this, { duration: duration })
        if (hCaster.HasShard()) {
            let duration_shard = this.GetSpecialValueFor("duration_shard")
            let count_shard = this.GetSpecialValueFor("count_shard")
            modifier_ogre_magi_6_buff_shard.apply(hTarget, hCaster, this, { duration: duration_shard })
        }
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        if (!GameFunc.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        this.Bloodlust(hTarget)

        modifier_ogre_magi_6_particle_cast.apply(hTarget, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_OgreMagi.Bloodlust.Cast", hCaster))
        EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_OgreMagi.Bloodlust.Target", hCaster), hCaster)

        //  嗜血术多重施法特殊处理，其他对友方的指向性技能无法触发多重施法
        let hAbility4 = ability3_ogre_magi_bloodlust.findIn(hCaster) as ability3_ogre_magi_bloodlust;
        if ((!GameFunc.IsValid(hAbility4)) || hAbility4.GetLevel() <= 0) {
            return
        }
        let multicast_bloodlust_aoe = this.GetSpecialValueFor("multicast_bloodlust_aoe")
        let iExtraCount = hAbility4.Roll()
        let iMulticastCount = iExtraCount + 1
        if (iExtraCount > 0) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_ogre_magi/ogre_magi_multicast.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControl(iParticleID, 1, Vector(iMulticastCount, 1, 0))
            ParticleManager.ReleaseParticleIndex(iParticleID)
            EmitSoundOnLocationWithCaster(hCaster.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_OgreMagi.Fireblast.x" + iExtraCount, hCaster), hCaster)

            let tTargets = FindUnitsInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), null, multicast_bloodlust_aoe, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), 0, false)
            for (let hMutiTarget of (tTargets)) {
                if (hMutiTarget != hTarget && hMutiTarget.GetUnitLabel() != "builder") {
                    this.Bloodlust(hMutiTarget)
                    iExtraCount = iExtraCount - 1
                }
                if (iExtraCount <= 0) {
                    break
                }
            }
        }
        this.hLastTarget = hTarget
    }
    OnProjectileHit_ExtraData(hTarget: BaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        if (hTarget != null) {
            if (!hTarget.TriggerSpellAbsorb(this)) {
                let hCaster = this.GetCasterPlus()
                let duration = this.GetSpecialValueFor("duration")
                if (ExtraData.hParent != null) {
                    let hParent = EntIndexToHScript(ExtraData.hParent) as BaseNpc_Plus
                    if (GameFunc.IsValid(hParent)) {
                        BattleHelper.GoApplyDamage({
                            ability: this,
                            attacker: hParent,
                            victim: hTarget,
                            damage: hParent.GetAllStats() * this.GetSpecialValueFor("shard_damage"),
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                        })
                    }
                }
            }
        }

        return true
    }

    GetIntrinsicModifierName() {
        return "modifier_ogre_magi_6"
    }

    OnStolen(hSourceAbility: this) {
        this.hLastTarget = hSourceAbility.hLastTarget
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_ogre_magi_6 extends BaseModifier_Plus {
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }


    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus() as ability6_ogre_magi_multicast
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

            if (!ability.IsAbilityReady()) {
                return
            }

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus() + caster.GetHullRadius()

            //  优先上一个目标
            let target = GameFunc.IsValid(ability.hLastTarget) && ability.hLastTarget || null
            if (target != null && !target.IsPositionInRange(caster.GetAbsOrigin(), range + target.GetHullRadius())) {
                target = null
            }

            //  搜索范围
            if (target == null) {
                let teamFilter = ability.GetAbilityTargetTeam()
                let typeFilter = ability.GetAbilityTargetType()
                let flagFilter = ability.GetAbilityTargetFlags()
                let order = FindOrder.FIND_CLOSEST
                let targets = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), null, range, teamFilter, typeFilter, flagFilter, order, false)
                for (let i = targets.length - 1; i >= 0; i--) {
                    if (targets[i].GetUnitLabel() == "builder") {
                        table.remove(targets, i)
                    }
                }
                //  优先英雄单位
                table.sort(targets, (a, b) => {
                    return a.GetUnitLabel() == "HERO" && b.GetUnitLabel() != "HERO"
                })
                table.sort(targets, (a, b) => {
                    return !modifier_ogre_magi_6_buff.exist(a) && modifier_ogre_magi_6_buff.exist(b)
                })
                target = targets[0]
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
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_ogre_magi_6_buff extends BaseModifier_Plus {
    bonus_attack_damage: number;
    bonus_attack_speed: number;
    self_bonus: number;
    modelscale: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return false
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
    GetEffectName() {
        return ResHelper.GetParticleReplacement("particles/units/heroes/hero_ogre_magi/ogre_magi_bloodlust_buff.vpcf", this.GetCasterPlus())
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
    }
    GetTexture() {
        return ResHelper.GetAbilityTextureReplacement("ogre_magi_bloodlust", this.GetCasterPlus())
    }
    Init(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        let extra_bonus_attack_speed = hCaster.GetTalentValue("special_bonus_unique_ogre_magi_custom_3")
        this.bonus_attack_damage = hCaster.GetTalentValue("special_bonus_unique_ogre_magi_custom_6")
        this.bonus_attack_speed = this.GetSpecialValueFor("bonus_attack_speed") + extra_bonus_attack_speed
        this.self_bonus = this.GetSpecialValueFor("self_bonus") + extra_bonus_attack_speed
        this.modelscale = this.GetSpecialValueFor("modelscale")
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            hParent.EmitSound(ResHelper.GetSoundReplacement("Hero_OgreMagi.Bloodlust.Target.FP", hCaster))
            let fDamage = (hCaster.GetBaseDamageMin() + hCaster.GetBaseDamageMax()) / 2 * this.bonus_attack_damage * 0.01
            this.changeStackCount(fDamage)
            this.addTimer(params.duration, () => {
                this.changeStackCount(-fDamage)
            })
            //  给非蓝胖增加当前等级的多重施法buff
            if (!hParent.HasAbility("ogre_magi_4")) {
                let hAbility4 = ability6_ogre_magi_multicast.findIn(hCaster)
                modifier_ogre_magi_3_buff.apply(hParent, hCaster, hAbility4)
            }
        }
    }
    OnDestroy() {
        super.OnDestroy();
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            this.StartIntervalThink(-1)
            if (!hParent.HasAbility("ogre_magi_4")) {
                modifier_ogre_magi_3_buff.remove(hParent);
            }
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.SPELL_AMPLIFY_BONUS)
    g_SPELL_AMPLIFY_BONUS() {
        return this.GetSpecialValueFor("spell_amplify")
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant(params: ModifierTable) {
        if (this.GetParentPlus() == this.GetCasterPlus()) {
            return this.self_bonus
        }
        return this.bonus_attack_speed
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: ModifierTable) {
        return this.GetStackCount()
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MODEL_SCALE)
    GetModelScale(params: ModifierTable) {
        return this.modelscale
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_ogre_magi_6_buff_shard// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_ogre_magi_6_buff_shard extends BaseModifier_Plus {
    count_shard: number;
    iParticleID: any;
    GetTexture() {
        return ResHelper.GetAbilityTextureReplacement('ogre_magi_smash', this.GetCasterPlus())
    }
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

    Init(params: ModifierTable) {
        this.count_shard = this.GetSpecialValueFor("count_shard")
        if (IsServer()) {
            this.changeStackCount(this.count_shard)
            if (this.iParticleID) {
                ParticleManager.DestroyParticle(this.iParticleID, true)
            }
            this.CreateParticle()
        }
    }
    CreateParticle() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_ogre_magi/ogre_magi_fire_shield.vpcf",
            resNpc: null,
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            owner: hCaster
        });

        //  保证position along ring 水平
        ParticleManager.SetParticleControl(this.iParticleID, 0, hParent.GetAttachmentOrigin(hParent.ScriptLookupAttachment("attach_hitloc")))
        hParent.addTimer(0.1, () => {
            ParticleManager.SetParticleControlEnt(this.iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
        })
        ParticleManager.SetParticleControl(this.iParticleID, 1, Vector(math.min(12, this.GetStackCount()), 0, 0))
        this.AddParticle(this.iParticleID, false, false, -1, false, false)
        this.SetFireBallVisible()
    }
    OnStackCountChanged(iStackCount: number) {
        if (this.GetStackCount() <= 0) {
            this.Destroy()
            return
        }
        this.SetFireBallVisible()
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_SPELL_TARGET_READY)
    OnSpellTargetReady() {
        // let hCaster = params.unit
        // let hTarget = params.target
        // let hAbility = params.ability
        // if (!(GameFunc.IsValid(hCaster) && hCaster.IsAlive()) || hCaster.GetTeamNumber() == hTarget.GetTeamNumber()) {
        //     return
        // }
        // if (!GameFunc.IsValid(hAbility) || (hAbility.GetName() != "ogre_magi_1" && hAbility.GetName() != "ogre_magi_2" && hAbility.GetName() != "ogre_magi_1_scepter" && TableFindKey(MULTICAST_BLACK_LIST, hAbility.GetName()))) {
        //     return
        // }

        // this.ActiveTarget(hTarget, true)
    }
    SetFireBallVisible() {
        if (this.iParticleID) {
            let iCount = math.min(12, this.GetStackCount()) //  最多显示12个火球
            for (let i = 1; i <= 12; i++) {
                ParticleManager.SetParticleControl(this.iParticleID, 9 + i, Vector((i <= iCount) && 1 || 0, 0, 0))
            }
        }
    }
    ActiveTarget(hTarget: BaseNpc_Plus, bUseCount: number) {
        let hCaster = this.GetCasterPlus()
        if (!GameFunc.IsValid(hCaster)) {
            return
        }
        let hParent = this.GetParentPlus()
        if (bUseCount) {
            this.DecrementStackCount()
        }

        let tInfo = {
            Ability: this.GetAbilityPlus(),
            EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_ogre_magi/ogre_magi_fire_shield_projectile.vpcf", hCaster),
            iSourceAttachment: hCaster.ScriptLookupAttachment("attach_attack1"),
            iMoveSpeed: 900,
            Target: hTarget,
            Source: hParent,
            ExtraData: {
                hParent: hParent.entindex(),
            }
        }
        ProjectileManager.CreateTrackingProjectile(tInfo)
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_ogre_magi_6_particle_cast extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetParentPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_ogre_magi/ogre_magi_bloodlust_cast.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 2, hTarget, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hTarget.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 3, hTarget, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hTarget.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
