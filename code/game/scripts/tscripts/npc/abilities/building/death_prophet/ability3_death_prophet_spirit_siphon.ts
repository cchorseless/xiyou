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
import { modifier_particle, modifier_particle_thinker } from "../../../modifier/modifier_particle";
import { ability6_death_prophet_exorcism } from "./ability6_death_prophet_exorcism";

/** dota原技能数据 */
export const Data_death_prophet_spirit_siphon = { "ID": "5685", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_DeathProphet.SpiritSiphon.Cast", "HasShardUpgrade": "1", "AbilityCastAnimation": "ACT_DOTA_DP_SPIRIT_SIPHON", "AbilityCastGestureSlot": "DEFAULT", "AbilityCastRange": "500", "AbilityCastPoint": "0.1", "AbilityCooldown": "0", "AbilityCharges": "1 2 3 4", "AbilityChargeRestoreTime": "36 34 32 30", "AbilityManaCost": "80", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "damage": "14" }, "02": { "var_type": "FIELD_FLOAT", "damage_pct": "1.0 2.5 4.0 5.5", "LinkedSpecialBonus": "special_bonus_unique_death_prophet_3" }, "03": { "var_type": "FIELD_FLOAT", "haunt_duration": "6" }, "04": { "var_type": "FIELD_INTEGER", "movement_steal": "0" }, "05": { "var_type": "FIELD_INTEGER", "siphon_buffer": "250" }, "06": { "var_type": "FIELD_FLOAT", "AbilityChargeRestoreTime": "", "LinkedSpecialBonus": "special_bonus_unique_death_prophet_5", "LinkedSpecialBonusOperation": "SPECIAL_BONUS_SUBTRACT" } } };

@registerAbility()
export class ability3_death_prophet_spirit_siphon extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "death_prophet_spirit_siphon";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_death_prophet_spirit_siphon = Data_death_prophet_spirit_siphon;
    Init() {
        this.SetDefaultSpecialValue("chance", [4, 8, 12, 16, 20]);
        this.SetDefaultSpecialValue("radius", [500, 600, 700, 800, 900]);
        this.SetDefaultSpecialValue("duration", [1, 2, 3, 4, 5]);
        this.SetDefaultSpecialValue("damage_increase", [5, 10, 15, 20, 25]);

    }

    GetDamageIncreasePercent() {
        return 1 + this.GetSpecialValueFor("damage_increase") / 100
    }
    // GetIntrinsicModifierName() {
    //     return "modifier_death_prophet_3"
    // }
    GetCastRange(vLocation: Vector, hTarget: BaseNpc_Plus) {
        return this.GetSpecialValueFor("radius")
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_death_prophet_3// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_death_prophet_3 extends BaseModifier_Plus {
    chance: number;
    radius: number;
    duration: number;
    damage_increase: number;
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
    Init(params: ModifierTable) {
        this.chance = this.GetSpecialValueFor("chance")
        this.radius = this.GetSpecialValueFor("radius")
        this.duration = this.GetSpecialValueFor("duration")
        this.damage_increase = this.GetSpecialValueFor("damage_increase")
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OUTGOING_DAMAGE_PERCENTAGE)
    EOM_GetModifierOutgoingDamagePercentage(params: ModifierTable) {
        if (params == null) {
            return
        }
        if (this.GetParentPlus().PassivesDisabled()) {
            return
        }
        if (bit.band(params.damage_flags, DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_DIRECTOR_EVENT) == DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_DIRECTOR_EVENT) {
            return
        }
        if (params.attacker == this.GetParentPlus() && params.target.IsSilenced()) {
            return this.damage_increase
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    OnAbilityExecuted(params: ModifierTable) {
        let hParent = this.GetParentPlus()
        let hCaster = params.unit
        if (hCaster != null && hCaster == hParent && !hCaster.IsIllusion()) {
            let hAbility = params.ability
            if (hAbility == null || hAbility.IsItem() || hAbility.IsToggle()) {
                return
            }
            this.SilenceAround()
        }
    }
    SilenceAround() {
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (GameFunc.mathUtil.PRD(this.chance, hParent, "death_prophet_4")) {
            let tTargets = FindUnitsInRadius(
                hParent.GetTeamNumber(),
                hParent.GetAbsOrigin(),
                null,
                this.radius,
                hAbility.GetAbilityTargetTeam(),
                hAbility.GetAbilityTargetType(),
                hAbility.GetAbilityTargetFlags(),
                FindOrder.FIND_ANY_ORDER,
                false
            ) as BaseNpc_Plus[]
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_death_prophet/death_prophet_silence.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, this.GetParentPlus().GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.GetSpecialValueFor("radius"), 0, 0))
            ParticleManager.ReleaseParticleIndex(iParticleID)
            if (tTargets.length > 0) {
                for (let hTarget of (tTargets)) {
                    modifier_death_prophet_3_silence.apply(hTarget, hParent, hAbility, { duration: this.duration * hTarget.GetStatusResistanceFactor(hParent) })
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_death_prophet_3_silence// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_death_prophet_3_silence extends BaseModifier_Plus {
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()

            let iParticleID2 = ResHelper.CreateParticle({
                resPath: "particles/generic_gameplay/generic_silenced.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: hParent
            });

            this.AddParticle(iParticleID2, false, false, -1, false, true)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_SILENCED]: true,
        }
    }

}
