import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { ability1_skeleton_king_hellfire_blast } from "./ability1_skeleton_king_hellfire_blast";
import { modifier_skeleton_king_2_summon } from "./ability2_skeleton_king_vampiric_aura";

/** dota原技能数据 */
export const Data_skeleton_king_reincarnation = { "ID": "5089", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_FRIENDLY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "2", "HasShardUpgrade": "1", "HasScepterUpgrade": "1", "AbilitySound": "Hero_SkeletonKing.Reincarnate", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityManaCost": "180", "AbilityCooldown": "200 120 40", "AbilityModifierSupportValue": "0.2", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "reincarnate_time": "3.0 3.0 3.0" }, "02": { "var_type": "FIELD_INTEGER", "slow_radius": "900" }, "03": { "var_type": "FIELD_INTEGER", "movespeed": "-75" }, "04": { "var_type": "FIELD_INTEGER", "attackslow": "-75" }, "05": { "var_type": "FIELD_FLOAT", "slow_duration": "5.0" }, "07": { "var_type": "FIELD_FLOAT", "scepter_duration": "7", "RequiresScepter": "1" }, "08": { "var_type": "FIELD_INTEGER", "aura_radius": "1200" }, "09": { "var_type": "FIELD_INTEGER", "aura_radius_tooltip_scepter": "1200", "RequiresScepter": "1" } } };

@registerAbility()
export class ability6_skeleton_king_reincarnation extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "skeleton_king_reincarnation";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_skeleton_king_reincarnation = Data_skeleton_king_reincarnation;
    Init() {
        this.SetDefaultSpecialValue("damage_strength", [1.0, 1.5, 2.0, 2.5, 3.0, 3.5]);
        this.SetDefaultSpecialValue("damage_pct", [10, 20, 30, 40, 50, 60]);
        this.SetDefaultSpecialValue("duration", 8);
        this.SetDefaultSpecialValue("energy_cost", 10);

    }

    Init_old() {
        this.SetDefaultSpecialValue("damage_strength", [1.0, 1.5, 2.0, 2.5, 3.0, 3.5]);
        this.SetDefaultSpecialValue("damage_pct", [10, 20, 30, 40, 50, 60]);
        this.SetDefaultSpecialValue("duration", 8);
        this.SetDefaultSpecialValue("energy_cost", 10);

    }



    OnSpellStart() {
        let caster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration")

        let bUseEnergy = ability1_skeleton_king_hellfire_blast.findIn(caster).UseEnergy(this.GetSpecialValueFor("energy_cost"))

        modifier_skeleton_king_6_aura.apply(caster, caster, this, { duration: duration, bUseEnergy: bUseEnergy })

        caster.EmitSound(ResHelper.GetSoundReplacement("Hero_SkeletonKing.MortalStrike.Cast", caster))

    }

    GetIntrinsicModifierName() {
        return "modifier_skeleton_king_6"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_skeleton_king_6 extends BaseModifier_Plus {
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

            let range = caster.Script_GetAttackRange()
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_skeleton_king_6_aura extends BaseModifier_Plus {
    damage_strength: number;
    bUseEnergy: any;
    fade_time: number;
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
    IsAura() {
        return true
    }
    GetAuraEntityReject(hEntity: IBaseNpc_Plus) {
        let bAccept = hEntity == this.GetCasterPlus() || (hEntity.IsSummoned() && hEntity.GetSummoner() == this.GetCasterPlus())
        return !bAccept
    }
    GetAuraRadius() {
        return FIND_UNITS_EVERYWHERE
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE
    }
    GetAura() {
        return "modifier_skeleton_king_6_buff"
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        if (IsServer()) {
            this.bUseEnergy = params.bUseEnergy
            this.StartIntervalThink(0)
        } else {
            this.fade_time = 1
            this.StartIntervalThink(this.GetRemainingTime() - this.fade_time)
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/particle_ssr/skeleton_king/skeleton_king_3_cast.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    Init(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        let sTalentName = "special_bonus_unique_skeleton_king_custom_5"
        this.damage_strength = this.GetSpecialValueFor("damage_strength") + hCaster.GetTalentValue(sTalentName)
    }
    OnIntervalThink() {
        if (IsServer()) {
            this.SetStackCount(this.damage_strength * this.GetParentPlus().GetStrength())
        } else {
            if (this.GetRemainingTime() > this.fade_time + 0.1) {
                this.StartIntervalThink(this.GetRemainingTime() - this.fade_time)
            } else {
                //  为至宝做的空特效
                let iPtclID = ResHelper.CreateParticle({
                    resPath: "particles/particle_ssr/skeleton_king/skeleton_king_3_end.vpcf",
                    resNpc: this.GetCasterPlus(),
                    iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                    owner: this.GetParentPlus()
                });

                this.AddParticle(iPtclID, false, false, -1, false, false)
                this.StartIntervalThink(-1)
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_skeleton_king_6_buff extends BaseModifier_Plus {
    IsHidden() {
        return this.GetParentPlus() == this.GetCasterPlus()
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
            this.SetStackCount(modifier_skeleton_king_6_aura.findIn(this.GetCasterPlus()).bUseEnergy)
        } else {
            let iPtclID = ResHelper.CreateParticle({
                resPath: "particles/particle_ssr/skeleton_king/skeleton_king_3_buff.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iPtclID, false, false, -1, false, false)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            if (modifier_skeleton_king_2_summon.exist(this.GetParentPlus())) {
                this.GetParentPlus().ForceKill(true)
            }
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE_POST_CRIT)
    GetPreAttack_BonusDamage(params: ModifierTable) {
        if (GameFunc.IsValid(this.GetCasterPlus()) && this.GetStackCount() == 1) {
            return modifier_skeleton_king_6_aura.GetStackIn(this.GetCasterPlus(), this.GetCasterPlus())
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamagePostCrit(params: ModifierTable) {
        if (GameFunc.IsValid(this.GetCasterPlus()) && this.GetStackCount() == 0) {
            return modifier_skeleton_king_6_aura.GetStackIn(this.GetCasterPlus(), this.GetCasterPlus())
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_skeleton_king_6_damage extends BaseModifier_Plus {
    damage_pct: number;
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
        let hCaster = this.GetCasterPlus()
        let sTalentName = "special_bonus_unique_skeleton_king_custom_7"
        this.damage_pct = this.GetSpecialValueFor("damage_pct") + hCaster.GetTalentValue(sTalentName)
        if (IsServer()) {
            this.IncrementStackCount()
            this.addTimer(params.duration, () => {
                this.DecrementStackCount()
            })
        }
    }


    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    GetBaseDamageOutgoing_Percentage(params: ModifierTable) {
        return this.damage_pct * this.GetStackCount()
    }
}
