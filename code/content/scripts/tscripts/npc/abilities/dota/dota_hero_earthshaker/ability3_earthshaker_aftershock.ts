import { GameFunc } from "../../../../GameFunc";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_earthshaker_1_root } from "./ability1_earthshaker_fissure";

/** dota原技能数据 */
export const Data_earthshaker_aftershock = { "ID": "5025", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "AbilityDuration": "0.6 0.9 1.2 1.5", "AbilityDamage": "75 100 125 150", "AbilityModifierSupportBonus": "100", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "aftershock_range": "300" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_earthshaker_aftershock extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "earthshaker_aftershock";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_earthshaker_aftershock = Data_earthshaker_aftershock;
    Init() {
        this.SetDefaultSpecialValue("aftershock_range", 800);
        this.SetDefaultSpecialValue("damage", [500, 2000, 4000, 5000, 6000]);
        this.SetDefaultSpecialValue("health_damage", 70);

    }




    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("aftershock_range")
    }
    TriggerAfterShock() {
        let hCaster = this.GetCasterPlus()
        if (hCaster.PassivesDisabled()) {
            return
        }

        let aftershock_range = this.GetSpecialValueFor("aftershock_range")
        let duration = this.GetDuration()
        let damage = this.GetSpecialValueFor("damage")
        let health_damage = this.GetSpecialValueFor("health_damage") + hCaster.GetTalentValue("special_bonus_unique_earthshaker_custom_6")

        let fDamage = damage + hCaster.GetMaxHealth() * health_damage * 0.01

        let tTargets = FindUnitsInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), null, aftershock_range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)

        if (hCaster.HasScepter()) {
            let _tTargets = AoiHelper.FindUnitsInRadiusByModifierName("modifier_earthshaker_1_root", hCaster.GetTeamNumber(), Vector(0, 0, 0), 5000, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
            for (let v of (_tTargets)) {
                let hModifier = modifier_earthshaker_1_root.findIn(v) as modifier_earthshaker_1_root;
                if (GameFunc.IsValid(hModifier) && GameFunc.IsValid(hModifier.GetCasterPlus()) && hModifier.GetCasterPlus().GetPlayerOwnerID() == hCaster.GetPlayerOwnerID()) {
                    table.insert(tTargets, v)
                }
            }
        }

        for (let hTarget of (tTargets as IBaseNpc_Plus[])) {

            modifier_stunned.apply(hTarget, hCaster, this, { duration: hCaster.HasTalent("special_bonus_unique_earthshaker_custom_7") && duration || duration * hTarget.GetStatusResistanceFactor(hCaster) })

            BattleHelper.GoApplyDamage({
                ability: this,
                attacker: hCaster,
                victim: hTarget,
                damage: fDamage,
                damage_type: this.GetAbilityDamageType()
            })
        }

        modifier_earthshaker_3_particle.apply(hCaster, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
    }
    ShardTriggerAfterShock(tTargets: IBaseNpc_Plus[], tPos: Vector[]) {
        let hCaster = this.GetCasterPlus()
        if (hCaster.PassivesDisabled()) {
            return
        }
        let aftershock_range = this.GetSpecialValueFor("aftershock_range")
        let duration = this.GetDuration()
        let damage = this.GetSpecialValueFor("damage")
        let health_damage = this.GetSpecialValueFor("health_damage") + hCaster.GetTalentValue("special_bonus_unique_earthshaker_custom_6")

        let fDamage = damage + hCaster.GetMaxHealth() * health_damage * 0.01

        if (hCaster.HasScepter()) {
            let _tTargets = AoiHelper.FindUnitsInRadiusByModifierName("modifier_earthshaker_1_root", hCaster.GetTeamNumber(), Vector(0, 0, 0), 5000, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
            for (let v of (_tTargets)) {
                let hModifier = modifier_earthshaker_1_root.findIn(v) as modifier_earthshaker_1_root;
                if (GameFunc.IsValid(hModifier) && GameFunc.IsValid(hModifier.GetCasterPlus()) && hModifier.GetCasterPlus().GetPlayerOwnerID() == hCaster.GetPlayerOwnerID()) {
                    table.insert(tTargets, v)
                }
            }
        }

        for (let hTarget of (tTargets)) {
            modifier_stunned.apply(hTarget, hCaster, this, { duration: hCaster.HasTalent("special_bonus_unique_earthshaker_custom_7") && duration || duration * hTarget.GetStatusResistanceFactor(hCaster) })
            BattleHelper.GoApplyDamage({
                ability: this,
                attacker: hCaster,
                victim: hTarget,
                damage: fDamage,
                damage_type: this.GetAbilityDamageType()
            })
        }
        for (let vPos of (tPos)) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_earthshaker/earthshaker_aftershock.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, vPos)
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(aftershock_range, aftershock_range, aftershock_range))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
    // GetIntrinsicModifierName() {
    //     return "modifier_earthshaker_3"
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_earthshaker_3 extends BaseModifier_Plus {
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
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    OnAbilityExecuted(params: ModifierAbilityEvent) {
        let hParent = this.GetParentPlus()
        if (params.unit == hParent) {
            let hAbility = params.ability
            if (GameFunc.IsValid(hAbility) && !hAbility.IsItem() && !hAbility.IsToggle() && hAbility.ProcsMagicStick()) {
                let ability = this.GetAbilityPlus() as ability3_earthshaker_aftershock
                if (ability.TriggerAfterShock != null) {
                    ability.TriggerAfterShock()
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_earthshaker_3_particle extends modifier_particle {
    aftershock_range: number;
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        this.aftershock_range = this.GetSpecialValueFor("aftershock_range")
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_earthshaker/earthshaker_aftershock.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.aftershock_range, this.aftershock_range, this.aftershock_range))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
