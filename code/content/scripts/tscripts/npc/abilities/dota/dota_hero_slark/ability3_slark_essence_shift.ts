
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_slark_essence_shift = { "ID": "5496", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "agi_gain": "3" }, "02": { "var_type": "FIELD_INTEGER", "stat_loss": "1" }, "03": { "var_type": "FIELD_FLOAT", "duration": "15 30 60 100", "LinkedSpecialBonus": "special_bonus_unique_slark_4" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_slark_essence_shift extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "slark_essence_shift";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_slark_essence_shift = Data_slark_essence_shift;
    Init() {
        this.SetDefaultSpecialValue("damage_factor", [1, 1, 2, 3, 4]);
        this.SetDefaultSpecialValue("duration", 7);
        this.SetDefaultSpecialValue("bonus_attack_speed", [50, 100, 150, 200, 250]);
        this.SetDefaultSpecialValue("bonus_max_attack_speed", [50, 100, 150, 200, 250]);
        this.SetDefaultSpecialValue("scepter_bonus_all_stats", 20);

    }

    Init_old() {
        this.SetDefaultSpecialValue("duration", 7);
        this.SetDefaultSpecialValue("damage_factor", [1, 2, 3, 4, 5]);
        this.SetDefaultSpecialValue("kill", [0.1, 0.2, 0.3, 0.4, 0.5]);

    }


    GetIntrinsicModifierName() {
        return "modifier_slark_3"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_slark_3 extends BaseModifier_Plus {
    duration: number;
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

    Init(params: IModifierTable) {
        this.duration = this.GetSpecialValueFor("duration")
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    attackLanded(params: IModifierTable) {
        let hParent = this.GetParentPlus()
        if (GFuncEntity.IsValid(hParent) && params.attacker == hParent && !params.attacker.IsIllusion()) {
            if (!hParent.PassivesDisabled() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS) && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, hParent.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                modifier_slark_3_particle_slark_essence_shift.apply(hParent, params.target, this.GetAbilityPlus(), { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

                modifier_slark_3_buff.apply(hParent, hParent, this.GetAbilityPlus(), { duration: this.duration })
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    death(params: IModifierTable) {
        let hParent = this.GetParentPlus()
        let hAttacker = params.attacker
        if (!GFuncEntity.IsValid(hAttacker) || hAttacker.GetUnitLabel() == "builder") {
            return
        }
        if (hAttacker.GetTeamNumber() == params.unit.GetTeamNumber()) {
            return
        }
        // if (Spawner.IsEndless()) {
        //     return
        // }

        let hAttackSource = hAttacker.GetSource()

        if (hAttackSource == hParent) {
            modifier_slark_3_buff_kill.apply(hParent, hParent, this.GetAbilityPlus(), { factor: params.unit.IsConsideredHero() && 5 || 1 })
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_slark_3_buff extends BaseModifier_Plus {
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

    Init(params: IModifierTable) {
        if (IsServer()) {
            let stat_gain = params.stat_gain || this.GetSpecialValueFor("stat_gain")
            this.changeStackCount(stat_gain)
            this.addTimer(params.duration, () => {
                this.changeStackCount(-stat_gain)
            })
        }
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_tooltip(params: IModifierTable) {
        return this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_ALL_BONUS)
    CC_GetModifierBonusStats_All() {
        return this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_slark_3_buff_kill extends BaseModifier_Plus {
    kill: number;
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

    Init(params: IModifierTable) {
        this.kill = this.GetSpecialValueFor("kill")
        if (IsServer()) {
            let iCount = params.factor || 1
            this.SetStackCount(this.GetStackCount() + iCount)
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_tooltip(params: IModifierTable) {
        return this.kill * this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_ALL_BONUS)
    G_STATS_ALL_BONUS() {
        return this.kill * this.GetStackCount()
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_slark_3_particle_slark_essence_shift extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_slark/slark_essence_shift.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlForward(iParticleID, 3, ((hCaster.GetAbsOrigin() - hParent.GetAbsOrigin()) as Vector).Normalized())
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
