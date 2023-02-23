import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { ability3_ogre_magi_bloodlust } from "./ability3_ogre_magi_bloodlust";

/** dota原技能数据 */
export const Data_ogre_magi_ignite = { "ID": "5439", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AOE", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_OgreMagi.Ignite.Cast", "AbilityCastRange": "700 800 900 1000", "AbilityCastPoint": "0.35", "AbilityCooldown": "15", "AbilityManaCost": "110", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "5 6 7 8" }, "02": { "var_type": "FIELD_INTEGER", "burn_damage": "20 30 40 50", "LinkedSpecialBonus": "special_bonus_unique_ogre_magi_4" }, "03": { "var_type": "FIELD_INTEGER", "slow_movement_speed_pct": "-20 -22 -24 -26" }, "04": { "var_type": "FIELD_INTEGER", "projectile_speed": "1000" }, "05": { "var_type": "FIELD_FLOAT", "multicast_delay": "0.6" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_ogre_magi_ignite extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "ogre_magi_ignite";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_ogre_magi_ignite = Data_ogre_magi_ignite;
    Init() {
        this.SetDefaultSpecialValue("duration", [5, 6, 7, 8, 9, 10]);
        this.SetDefaultSpecialValue("burn_damage", [260, 420, 580, 740, 900, 1600]);
        this.SetDefaultSpecialValue("burn_damage_per_str", 1.5);
        this.SetDefaultSpecialValue("burn_damage_per_int", 1.5);
        this.SetDefaultSpecialValue("slow_movement_speed_pct", [-20, -22, -24, -26, -28, -30]);
        this.SetDefaultSpecialValue("projectile_speed", 1000);
        this.SetDefaultSpecialValue("multicast_delay", 0.6);

    }

    Init_old() {
        this.SetDefaultSpecialValue("duration", [5, 6, 7, 8, 9, 10]);
        this.SetDefaultSpecialValue("burn_damage", [260, 420, 580, 740, 900, 1600]);
        this.SetDefaultSpecialValue("burn_damage_per_str", 1.5);
        this.SetDefaultSpecialValue("burn_damage_per_int", 1.5);
        this.SetDefaultSpecialValue("slow_movement_speed_pct", -150);
        this.SetDefaultSpecialValue("projectile_speed", 1000);
        this.SetDefaultSpecialValue("multicast_delay", 0.6);

    }

    iPreParticleID: ParticleID;



    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        return super.GetCooldown(iLevel) - hCaster.GetTalentValue("special_bonus_unique_ogre_magi_custom_4")
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        if (hTarget != null) {
            if (!hTarget.TriggerSpellAbsorb(this)) {
                let hCaster = this.GetCasterPlus()
                let duration = this.GetSpecialValueFor("duration")
                if (ExtraData.iMulticastCount != null && ExtraData.iMulticastCount != 0) {
                    duration = duration * ExtraData.iMulticastCount
                }
                modifier_ogre_magi_2_debuff.apply(hTarget, hCaster, this, { duration: duration })

                EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_OgreMagi.Ignite.Target", hCaster), hCaster)
            }
        }

        return true
    }
    Ignite(hTarget: IBaseNpc_Plus, range: number = null, iMulticastCount: number = null) {
        let hCaster = this.GetCasterPlus()
        let projectile_speed = this.GetSpecialValueFor("projectile_speed")

        if (!GameFunc.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }

        range = range || (this.GetCastRange(hTarget.GetAbsOrigin(), hTarget) + hCaster.GetCastRangeBonus())
        let tInfo = {
            Ability: this,
            EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_ogre_magi/ogre_magi_ignite.vpcf", hCaster),
            iSourceAttachment: hCaster.ScriptLookupAttachment("attach_attack1"),
            iMoveSpeed: projectile_speed,
            Target: hTarget,
            Source: hCaster,
            ExtraData: {
                iMulticastCount: iMulticastCount,
            },
        }
        ProjectileManager.CreateTrackingProjectile(tInfo)

        let hTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), range + 250, null, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER)
        for (let i = hTargets.length - 1; i >= 0; i--) {
            if (hTargets[i] == hTarget || modifier_ogre_magi_2_debuff.exist(hTargets[i])) {
                table.remove(hTargets, i)
            }
        }
        table.sort(hTargets, (a, b) => { return CalcDistanceBetweenEntityOBB(a, hTarget) < CalcDistanceBetweenEntityOBB(b, hTarget) })
        if (hTargets[0] != null) {
            let tInfo = {
                Ability: this,
                EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_ogre_magi/ogre_magi_ignite.vpcf", hCaster),
                iSourceAttachment: hCaster.ScriptLookupAttachment("attach_attack1"),
                iMoveSpeed: projectile_speed,
                Target: hTargets[0],
                Source: hCaster,
                ExtraData: {
                    iMulticastCount: iMulticastCount,
                },
            }
            ProjectileManager.CreateTrackingProjectile(tInfo)
        }

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_OgreMagi.Ignite.Cast", hCaster))
    }
    OnAbilityPhaseStart() {
        let hCaster = this.GetCasterPlus()
        this.iPreParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_ogre_magi/ogre_magi_ignite_cast.vpcf",
            resNpc: null,
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            owner: hCaster
        });

        ParticleManager.SetParticleControlEnt(this.iPreParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_toss", hCaster.GetAbsOrigin(), true)
        ParticleManager.SetParticleControlEnt(this.iPreParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_bottle", hCaster.GetAbsOrigin(), true)
        return true
    }
    OnAbilityPhaseInterrupted() {
        if (this.iPreParticleID != null) {
            ParticleManager.DestroyParticle(this.iPreParticleID, true)
            this.iPreParticleID = null
        }
    }
    OnSpellStart() {
        if (this.iPreParticleID != null) {
            ParticleManager.DestroyParticle(this.iPreParticleID, false)
            this.iPreParticleID = null
        }

        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        this.Ignite(hTarget)
        //  嗜血术多重施法特殊处理
        let hAbility4 = ability3_ogre_magi_bloodlust.findIn(hCaster) as ability3_ogre_magi_bloodlust;
        if ((!GameFunc.IsValid(hAbility4)) || hAbility4.GetLevel() <= 0) {
            return
        }
        let multicast_delay = this.GetSpecialValueFor("multicast_delay")
        let iExtraCount = hAbility4.Roll()
        let iMulticastCount = iExtraCount
        let iCount = 0
        if (iExtraCount > iCount) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_ogre_magi/ogre_magi_multicast.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControl(iParticleID, 1, Vector(iCount + 1, iExtraCount - iCount + 1, iExtraCount))
            ParticleManager.ReleaseParticleIndex(iParticleID)

            GTimerHelper.AddTimer(multicast_delay, GHandler.create(this, () => {
                iCount = iCount + 1

                let hTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), 1400, null, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER)
                if (hTargets[0] != null) {
                    this.Ignite(hTargets[0], 1400, iMulticastCount)
                    EmitSoundOnLocationWithCaster(hTargets[0].GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_OgreMagi.Fireblast.x" + iCount, hCaster), hCaster)
                } else if (GameFunc.IsValid(hTarget) && hTarget.IsAlive()) {
                    this.Ignite(hTarget, 1400, iMulticastCount)
                    EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_OgreMagi.Fireblast.x" + iCount, hCaster), hCaster)
                }

                let iParticleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_ogre_magi/ogre_magi_multicast_counter.vpcf",
                    resNpc: hCaster,
                    iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                    owner: hCaster
                });

                ParticleManager.SetParticleControl(iParticleID, 1, Vector(iCount + 1, iExtraCount - iCount + 1, 0))
                ParticleManager.ReleaseParticleIndex(iParticleID)

                if (iExtraCount > iCount) {
                    return multicast_delay
                }
            }))
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_ogre_magi_2"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_ogre_magi_2 extends BaseModifier_Plus {
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

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()

            //  优先攻击目标
            let target = caster.GetAttackTarget()
            if (target != null && target.GetClassname() == "dota_item_drop") { target = null }
            if (target != null && !target.IsPositionInRange(caster.GetAbsOrigin(), range)) {
                target = null
            }

            //  搜索范围
            if (target == null) {
                let teamFilter = ability.GetAbilityTargetTeam()
                let typeFilter = ability.GetAbilityTargetType()
                let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
                let order = FindOrder.FIND_CLOSEST
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
                target = targets[0]
            }

            //  施法命令
            if (target != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                    TargetIndex: target.entindex(),
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_ogre_magi_2_debuff extends BaseModifier_Plus {
    slow_movement_speed_pct: number;
    burn_damage: number;
    burn_damage_per_str: number;
    burn_damage_per_int: number;
    sSoundName: string;
    damage_type: DAMAGE_TYPES;
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
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let extra_burn_damage_factor = hCaster.GetTalentValue("special_bonus_unique_ogre_magi_custom_2")
        this.slow_movement_speed_pct = this.GetSpecialValueFor("slow_movement_speed_pct")
        this.burn_damage = this.GetSpecialValueFor("burn_damage")
        this.burn_damage_per_str = this.GetSpecialValueFor("burn_damage_per_str") + extra_burn_damage_factor
        this.burn_damage_per_int = this.GetSpecialValueFor("burn_damage_per_int") + extra_burn_damage_factor
        let hParent = this.GetParentPlus()

        // let modifier_ogre_magi_2_debuff = Load(hParent, "modifier_ogre_magi_2_debuff") || {}
        // table.insert(modifier_ogre_magi_2_debuff, this)
        // Save(hParent, "modifier_ogre_magi_2_debuff", modifier_ogre_magi_2_debuff)

        if (IsServer()) {
            this.damage_type = this.GetAbilityPlus().GetAbilityDamageType()
            this.sSoundName = ResHelper.GetSoundReplacement("Hero_OgreMagi.Ignite.Damage", hCaster)
            hParent.EmitSound(this.sSoundName)

            this.StartIntervalThink(1)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_ogre_magi/ogre_magi_ignite_debuff.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    BeRefresh(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let extra_burn_damage_factor = hCaster.GetTalentValue("special_bonus_unique_ogre_magi_custom_2")
        this.slow_movement_speed_pct = this.GetSpecialValueFor("slow_movement_speed_pct")
        this.burn_damage = this.GetSpecialValueFor("burn_damage")
        this.burn_damage_per_str = this.GetSpecialValueFor("burn_damage_per_str") + extra_burn_damage_factor
        this.burn_damage_per_int = this.GetSpecialValueFor("burn_damage_per_int") + extra_burn_damage_factor
    }
    BeDestroy() {

        let hParent = this.GetParentPlus()

        // let modifier_ogre_magi_2_debuff = Load(hParent, "modifier_ogre_magi_2_debuff") || {}
        // GameFunc.ArrayFunc.ArrayRemove(modifier_ogre_magi_2_debuff, this)
        // Save(hParent, "modifier_ogre_magi_2_debuff", modifier_ogre_magi_2_debuff)

        if (IsServer()) {
            hParent.StopSound(this.sSoundName)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()

            if (!GameFunc.IsValid(hCaster) || !GameFunc.IsValid(hAbility)) {
                this.Destroy()
                return
            }

            let iStrength = 0
            let iIntellect = 0
            if (hCaster.GetStrength) {
                iStrength = hCaster.GetStrength()
            }
            if (hCaster.GetIntellect) {
                iIntellect = hCaster.GetIntellect()
            }

            let tDamageTable = {
                ability: hAbility,
                victim: hParent,
                attacker: hCaster,
                damage: this.burn_damage + iStrength * this.burn_damage_per_str + iIntellect * this.burn_damage_per_int,
                damage_type: this.damage_type,
                eom_flags: BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_DOT,
            }
            BattleHelper.GoApplyDamage(tDamageTable)
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(params: IModifierTable) {
        let hParent = this.GetParentPlus()
        // let modifier_ogre_magi_2_debuff = Load(hParent, "modifier_ogre_magi_2_debuff") || {}
        // if (modifier_ogre_magi_2_debuff[0] == this) {
        //     return this.slow_movement_speed_pct * hParent.GetStatusResistanceFactor(this.GetCasterPlus())
        // }
    }
}
