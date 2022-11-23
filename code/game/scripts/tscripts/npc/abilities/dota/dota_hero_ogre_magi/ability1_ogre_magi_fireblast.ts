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
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";
import { modifier_particle, modifier_particle_thinker } from "../../../modifier/modifier_particle";
import { ability3_ogre_magi_bloodlust } from "./ability3_ogre_magi_bloodlust";

/** dota原技能数据 */
export const Data_ogre_magi_fireblast = { "ID": "5438", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "FightRecapLevel": "1", "HasScepterUpgrade": "0", "AbilitySound": "Hero_OgreMagi.Fireblast.Cast", "AbilityCastRange": "475", "AbilityCastPoint": "0.45", "AbilityCooldown": "11 10 9 8", "AbilityManaCost": "70 80 90 100", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "stun_duration": "1.5" }, "02": { "var_type": "FIELD_FLOAT", "multicast_delay": "0.6" }, "03": { "var_type": "FIELD_INTEGER", "fireblast_damage": "60 120 180 240", "LinkedSpecialBonus": "special_bonus_unique_ogre_magi_2" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_ogre_magi_fireblast extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "ogre_magi_fireblast";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_ogre_magi_fireblast = Data_ogre_magi_fireblast;
    Init() {
        this.SetDefaultSpecialValue("stun_duration", 1.5);
        this.SetDefaultSpecialValue("multicast_delay", 0.6);
        this.SetDefaultSpecialValue("fireblast_damage", [500, 800, 1100, 1400, 1700, 2000]);
        this.SetDefaultSpecialValue("fireblast_damage_per_str", 4);
        this.SetDefaultSpecialValue("fireblast_damage_per_int", 4);

    }

    Init_old() {
        this.SetDefaultSpecialValue("stun_duration", 1.5);
        this.SetDefaultSpecialValue("multicast_delay", 0.6);
        this.SetDefaultSpecialValue("fireblast_damage", [500, 800, 1100, 1400, 1700, 2000]);
        this.SetDefaultSpecialValue("fireblast_damage_per_str", 4);
        this.SetDefaultSpecialValue("fireblast_damage_per_int", 4);

    }



    Fireblast(hTarget: BaseNpc_Plus, iMulticastCount: number = null) {
        let hCaster = this.GetCasterPlus()
        let extra_stun_duration = hCaster.GetTalentValue("special_bonus_unique_ogre_magi_custom")
        let extra_fireblast_damage_factor = hCaster.GetTalentValue("special_bonus_unique_ogre_magi_custom_5")
        let stun_duration = this.GetSpecialValueFor("stun_duration") + extra_stun_duration
        let fireblast_damage = this.GetSpecialValueFor("fireblast_damage")
        let fireblast_damage_per_str = this.GetSpecialValueFor("fireblast_damage_per_str") + extra_fireblast_damage_factor
        let fireblast_damage_per_int = this.GetSpecialValueFor("fireblast_damage_per_int") + extra_fireblast_damage_factor

        modifier_ogre_magi_1_particle_damage.apply(hCaster, hTarget, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

        let iStr = 0
        if (hCaster.GetStrength != null) {
            iStr = hCaster.GetStrength()
        }
        let iInt = 0
        if (hCaster.GetIntellect != null) {
            iInt = hCaster.GetIntellect()
        }
        let fDamage = fireblast_damage + iStr * fireblast_damage_per_str + iInt * fireblast_damage_per_int
        if (iMulticastCount != null && iMulticastCount > 0) {
            fDamage = fDamage * iMulticastCount
        }
        let tDamageTable: BattleHelper.DamageOptions = {
            ability: this,
            attacker: hCaster,
            victim: hTarget,
            damage: fDamage,
            damage_type: this.GetAbilityDamageType()
        }
        BattleHelper.GoApplyDamage(tDamageTable)

        modifier_stunned.apply(hTarget, hCaster, this, { duration: stun_duration * hTarget.GetStatusResistanceFactor(hCaster) })

        EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_OgreMagi.Fireblast.Target", hCaster), hCaster)
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
        this.Fireblast(hTarget)
        modifier_ogre_magi_1_particle_cast.apply(hCaster, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_OgreMagi.Fireblast.Cast", hCaster))
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
                owner: hTarget
            });

            ParticleManager.SetParticleControl(iParticleID, 1, Vector(iCount + 1, iExtraCount - iCount + 1, iExtraCount))
            ParticleManager.ReleaseParticleIndex(iParticleID)

            this.addTimer(multicast_delay, () => {
                if (!GameFunc.IsValid(hTarget)) {
                    return
                }

                this.Fireblast(hTarget, iMulticastCount)

                iCount = iCount + 1

                EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_OgreMagi.Fireblast.x" + iCount, hCaster), hCaster)

                let iParticleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_ogre_magi/ogre_magi_multicast_counter.vpcf",
                    resNpc: hCaster,
                    iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                    owner: hTarget
                });

                ParticleManager.SetParticleControl(iParticleID, 1, Vector(iCount + 1, iExtraCount - iCount + 1, 0))
                ParticleManager.ReleaseParticleIndex(iParticleID)

                if (iExtraCount > iCount) {
                    return multicast_delay
                }
            }
            )
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_ogre_magi_1"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_ogre_magi_1 extends BaseModifier_Plus {
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
            if (target != null && target.GetClassname() == "dota_item_drop") {
                target = null
            }
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
                ExecuteOrderFromTable(
                    {
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                        TargetIndex: target.entindex(),
                        AbilityIndex: ability.entindex()
                    }
                )
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_ogre_magi_1_particle_damage extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetParentPlus()
        let hTarget = this.GetCasterPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let radius = this.GetSpecialValueFor("radius")
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_ogre_magi/ogre_magi_fireblast.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hTarget
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hTarget, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hTarget.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_ogre_magi_1_particle_cast extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        if (IsClient()) {
            let radius = this.GetSpecialValueFor("radius")
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_ogre_magi/ogre_magi_fireblast_cast.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack3", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 2, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_rear_fx", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 3, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_mount_mouth_fx", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 4, hCaster, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
