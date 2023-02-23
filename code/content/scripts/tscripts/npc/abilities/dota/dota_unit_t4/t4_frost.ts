import { GameFunc } from "../../../../GameFunc";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";


@registerAbility()
export class t4_frost extends BaseAbility_Plus {

    Frost(hTarget: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration")

        modifier_t4_frost_slow.apply(hTarget, hCaster, this, { duration: duration * hTarget.GetStatusResistanceFactor(hCaster) })

        // let combination_t04_biting_frost  = combination_t04_biting_frost.findIn(  hCaster )
        // if (GameFunc.IsValid(combination_t04_biting_frost) && combination_t04_biting_frost.IsActivated()) {
        //     combination_t04_biting_frost.BitingFrost(hTarget, duration)
        // }
    }
    GetIntrinsicModifierName() {
        return "modifier_t4_frost"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t4_frost extends BaseModifier_Plus {
    records: any[];
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
            this.records = []
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY)
    On_AttackRecordDestroy(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus()) {
            GameFunc.ArrayFunc.ArrayRemove(this.records, params.record)
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    On_AttackStart(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop" || params.attacker.PassivesDisabled()) {
            return
        }
        if (params.attacker == this.GetParentPlus() && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
            modifier_t4_frost_projectile.apply(params.attacker, params.attacker, this.GetAbilityPlus(), null)
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    On_AttackRecord(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus()) {
            modifier_t4_frost_projectile.remove(params.attacker);

            if (!BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS) && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                table.insert(this.records, params.record)
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus()) {
            if (this.records.indexOf(params.record) != null) {
                if (GameFunc.IsValid(this.GetAbilityPlus())) {
                    (this.GetAbilityPlus() as t4_frost).Frost(params.target)
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t4_frost_projectile extends BaseModifier_Plus {
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
    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_ULTRA
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_NAME)
    GetProjectileName(params: IModifierTable) {
        return "particles/neutral_fx/ghost_frost_attack.vpcf"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t4_frost_slow extends BaseModifier_Plus {
    movespeed_slow: number;
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
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_frost.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, true, 10, false, false)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/generic_gameplay/generic_slowed_cold.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    Init(params: IModifierTable) {
        this.movespeed_slow = this.GetSpecialValueFor("movespeed_slow")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)

    GetMoveSpeedBonus_Percentage(params: IModifierTable) {
        return this.movespeed_slow
    }


}