import { GameFunc } from "../../../../GameFunc";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";


@registerAbility()
export class t38_wind_thunder extends BaseAbility_Plus {

    InheritAbility(hTarget: IBaseNpc_Plus, duration: number) {
        let hCaster = this.GetCasterPlus()
        if (GameFunc.IsValid(hTarget)) {
            modifier_t38_wind_thunder.apply(hTarget, hCaster, this, { duration: duration })
        }
    }
    GetIntrinsicModifierName() {
        return "modifier_t38_wind_thunder"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t38_wind_thunder extends BaseModifier_Plus {
    damage_factor: number;
    attack_speed: number;
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            if (GameFunc.IsValid(hCaster) && hCaster != hParent) {
                let iParticleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_razor/razor_static_link.vpcf",
                    resNpc: null,
                    iAttachment: ParticleAttachment_t.PATTACH_POINT_FOLLOW,
                    owner: hCaster
                });

                ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
                ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
                this.AddParticle(iParticleID, false, false, -1, false, false)
            }
        }
    }
    Init(params: IModifierTable) {
        let hParent = this.GetParentPlus()
        this.damage_factor = this.GetSpecialValueFor("damage_factor")
        this.attack_speed = this.GetSpecialValueFor("attack_speed")
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PHYSICAL)
    GetProcAttack_BonusDamage_Physical(params: IModifierTable) {
        if (params.attacker == this.GetParentPlus() && GameFunc.IsValid(this.GetAbilityPlus()) && !params.attacker.IsIllusion() && !params.attacker.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS) && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
            let fDamage = (this.GetParentPlus().GetStrength() + this.GetParentPlus().GetAgility() + this.GetParentPlus().GetIntellect()) * this.damage_factor
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/towers/t38.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_POINT_FOLLOW,
                owner: params.target
            });

            ParticleManager.ReleaseParticleIndex(iParticleID)
            let damage_table =
            {
                ability: this.GetAbilityPlus(),
                attacker: this.GetParentPlus(),
                victim: params.target,
                damage: fDamage,
                damage_type: this.GetAbilityPlus().GetAbilityDamageType()
            }
            BattleHelper.GoApplyDamage(damage_table)
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant() {
        return this.attack_speed
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS)
    EOM_GetModifierMaximumAttackSpeedBonus() {
        let hCaster = this.GetCasterPlus()
        if (GameFunc.IsValid(hCaster)) {
            // let _modifier_combination_t38_thor_mark = modifier_combination_t38_thor_mark.findIn(hCaster) as any;
            // return (GameFunc.IsValid(modifier_combination_t38_thor_mark) && modifier_combination_t38_thor_mark.GetStackCount() > 0) && modifier_combination_t38_thor_mark.attack_speed_limit || 0
        }
        return 0
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_PURE_DAMAGE_PERCENTAGE)
    EOM_GetModifierOutgoingPureDamagePercentage() {
        let hCaster = this.GetCasterPlus()
        if (GameFunc.IsValid(hCaster)) {
            // let modifier_combination_t38_thor_mark = modifier_combination_t38_thor_mark.findIn(hCaster) as any;
            // return (GameFunc.IsValid(modifier_combination_t38_thor_mark) && modifier_combination_t38_thor_mark.GetStackCount() > 0) && modifier_combination_t38_thor_mark.increase_pure_damage_pct || 0
        }
        return 0
    }
}