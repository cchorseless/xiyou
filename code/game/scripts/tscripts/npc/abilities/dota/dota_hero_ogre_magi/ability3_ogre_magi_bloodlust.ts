import { GameEnum } from "../../../../GameEnum";
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
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../modifier/modifier_event";
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_ogre_magi_bloodlust = { "ID": "5440", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AUTOCAST | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_FRIENDLY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC | DOTA_UNIT_TARGET_BUILDING", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_INVULNERABLE", "SpellImmunityType": "SPELL_IMMUNITY_ALLIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "Hero_OgreMagi.Bloodlust.Target", "AbilityCastRange": "600", "AbilityCastPoint": "0.45", "AbilityCooldown": "20 18 16 14", "AbilityManaCost": "50 55 60 65", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "modelscale": "25" }, "02": { "var_type": "FIELD_INTEGER", "bonus_movement_speed": "7 9 11 13" }, "03": { "var_type": "FIELD_INTEGER", "bonus_attack_speed": "30 40 50 60", "LinkedSpecialBonus": "special_bonus_unique_ogre_magi" }, "04": { "var_type": "FIELD_INTEGER", "self_bonus": "30 50 70 90", "LinkedSpecialBonus": "special_bonus_unique_ogre_magi" }, "05": { "var_type": "FIELD_FLOAT", "duration": "30" }, "06": { "var_type": "FIELD_FLOAT", "multicast_bloodlust_aoe": "700" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_ogre_magi_bloodlust extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "ogre_magi_bloodlust";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_ogre_magi_bloodlust = Data_ogre_magi_bloodlust;
    Init() {
                this.SetDefaultSpecialValue("multicast_2_times", [40,45,50,55,60]);
        this.SetDefaultSpecialValue("multicast_3_times", [15,20,25,30,35]);
        this.SetDefaultSpecialValue("multicast_4_times", [0,5,10,15,20]);

        }

    Init_old() {
                this.SetDefaultSpecialValue("multicast_2_times", [40,45,50,55,60]);
        this.SetDefaultSpecialValue("multicast_3_times", [15,20,25,30,35]);
        this.SetDefaultSpecialValue("multicast_4_times", [0,5,10,15,20]);

        }



    GetIntrinsicModifierName() {
        return "modifier_ogre_magi_3"
    }
    Roll(hCaster: BaseNpc_Plus = null) {
        hCaster = hCaster || this.GetCasterPlus()

        let multicast_2_times = this.GetSpecialValueFor("multicast_2_times")
        let multicast_3_times = this.GetSpecialValueFor("multicast_3_times")
        let multicast_4_times = this.GetSpecialValueFor("multicast_4_times")

        if (GameFunc.mathUtil.PRD(multicast_4_times, hCaster, "ogre_magi_3_multicast_4_times")) {
            return 3
        } else if (GameFunc.mathUtil.PRD(multicast_3_times, hCaster, "ogre_magi_3_multicast_3_times")) {
            return 2
        } else if (GameFunc.mathUtil.PRD(multicast_2_times, hCaster, "ogre_magi_3_multicast_2_times")) {
            return 1
        }
        return 0
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_ogre_magi_3// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_ogre_magi_3 extends BaseModifier_Plus {
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
            let hParent = this.GetParentPlus()
             modifier_ogre_magi_3_buff.apply( hParent , hParent, this.GetAbilityPlus(), {}) 
        }
    }
    OnRefresh(params: ModifierTable) {
        super.OnRefresh(params);
        if (IsServer()) {
            let hParent = this.GetParentPlus()
             modifier_ogre_magi_3_buff.apply( hParent , hParent, this.GetAbilityPlus(), {}) 
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let hParent = this.GetParentPlus()
             modifier_ogre_magi_3_buff.remove( hParent );
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_ogre_magi_3_buff extends BaseModifier_Plus {
    multicast_2_times: number;
    multicast_3_times: number;
    IsHidden() {
        return true
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
    Init(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        this.multicast_2_times = this.GetSpecialValueFor("multicast_2_times")
        this.multicast_3_times = this.GetSpecialValueFor("multicast_3_times")
        this.multicast_2_times = this.GetSpecialValueFor("multicast_4_times")
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_SPELL_TARGET_READY)
    OnSpellTargetReady() {
        // let hCaster = params.unit
        // let hTarget = params.target
        // let hAbility = params.ability
        // if (!IsServer()) {
        //     return
        // }
        // if (!(GameFunc.IsValid(hCaster) && hCaster.IsAlive() && hCaster == this.GetParentPlus())) {
        //     return
        // }
        // if (hCaster.GetTeamNumber() == hTarget.GetTeamNumber()) {
        //     return
        // }
        // if (!GameFunc.IsValid(hAbility)) {
        //     return
        // }
        // //  如果是仅对友方生效的技能，就不触发了
        // if (hAbility.GetAbilityTargetTeam() == DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY) {
        //     return
        // }

        // if (TableFindKey(MULTICAST_BLACK_LIST, hAbility.GetName()) != null) {
        //     return
        // }
        // if (!GameFunc.IsValid(this.GetAbilityPlus()) || this.GetAbilityPlus().Roll == null) {
        //     return
        // }

        // let iExtraCount = this.GetAbilityPlus().Roll()
        // if (iExtraCount > 0) {
        //     let modifier_ogre_magi_3_buff_shard  = modifier_ogre_magi_3_buff_shard.findIn(  hCaster )
        //     let fRange = hAbility.GetCastRange(hTarget.GetAbsOrigin(), hTarget) + hCaster.GetCastRangeBonus()

        //     let iParticleID = ResHelper.CreateParticle({
        //     resPath: "particles/units/heroes/hero_ogre_magi/ogre_magi_multicast.vpcf",
        //     resNpc:   this.GetCasterPlus(),
        //     iAttachment:   ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
        //     owner:  hCaster
        // });

        //     ParticleManager.SetParticleControl(iParticleID, 1, Vector(iExtraCount + 1, 1, 0))
        //     ParticleManager.ReleaseParticleIndex(iParticleID)
        //     EmitSoundOnLocationWithCaster(hCaster.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_OgreMagi.Fireblast.x" + iExtraCount, this.GetCasterPlus()), hCaster)

        //     let hRecordTarget = hCaster.GetCursorCastTarget()
        //     let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), fRange + 600, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, hAbility.GetAbilityTargetType(), hAbility.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, 0)
        //     let bValidTaget = GameFunc.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().HasTalent("special_bonus_unique_ogre_magi_custom_8")

        //     //  先所有敌人打一遍
        //     for (let hUnit of (tTargets)) {
        //         if (GameFunc.IsValid(hUnit) && hUnit.IsAlive() && (hUnit != hTarget || bValidTaget)) {
        //             if (hAbility.CastFilterResultTarget(hUnit) == UnitFilterResult.UF_SUCCESS) {
        //                 hCaster.SetCursorCastTarget(hUnit)
        //                 hAbility.OnSpellStart()
        //                 if (GameFunc.IsValid(modifier_ogre_magi_3_buff_shard)) {
        //                     modifier_ogre_magi_3_buff_shard.ActiveTarget(hTarget: BaseNpc_Plus)
        //                 }
        //                 iExtraCount = iExtraCount - 1
        //                 if (iExtraCount <= 0) {
        //                     break
        //                 }
        //             }
        //         }
        //     }
        //     // 天赋可以对同一目标多次使用 随机打目标,如果是第一个第一个目标延迟攻击
        //     if (iExtraCount > 0 && bValidTaget) {
        //         hAbility.GameTimer(0.6, () => {
        //             let hUnit = GameFunc.ArrayFunc.RandomArray(tTargets)[0]
        //             if (GameFunc.IsValid(hUnit) && hUnit.IsAlive() && GameFunc.IsValid(hCaster) && hCaster.IsAlive()) {
        //                 if (hAbility.CastFilterResultTarget(hUnit) == UnitFilterResult.UF_SUCCESS) {
        //                     hCaster.SetCursorCastTarget(hUnit)
        //                     hAbility.OnSpellStart()
        //                     if (GameFunc.IsValid(modifier_ogre_magi_3_buff_shard)) {
        //                         modifier_ogre_magi_3_buff_shard.ActiveTarget(hTarget: BaseNpc_Plus)
        //                     }
        //                     iExtraCount = iExtraCount - 1
        //                     if (iExtraCount > 0) {
        //                         return 0.6
        //                     }
        //                 }
        //             }
        //         })
        //     }
        //     hCaster.SetCursorCastTarget(hRecordTarget)
        // }
    }
}
