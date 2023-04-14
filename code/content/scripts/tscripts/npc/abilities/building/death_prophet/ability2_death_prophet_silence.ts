
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { ability6_death_prophet_exorcism } from "./ability6_death_prophet_exorcism";

/** dota原技能数据 */
export const Data_death_prophet_silence = { "ID": "5091", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_POINT", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "Hero_DeathProphet.Silence", "AbilityCastRange": "900", "AbilityCastPoint": "0.4", "AbilityCooldown": "15 14 13 12", "AbilityDuration": "3 4 5 6", "AbilityManaCost": "80 90 100 110", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "425" }, "02": { "var_type": "FIELD_FLOAT", "duration": "3.0 4.0 5.0 6.0" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_death_prophet_silence extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "death_prophet_silence";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_death_prophet_silence = Data_death_prophet_silence;
    Init() {
        this.SetDefaultSpecialValue("radius", 900);
        this.SetDefaultSpecialValue("damage", [250, 400, 550, 700, 850, 1000]);
        this.SetDefaultSpecialValue("intellect", [13, 16, 20, 25, 30, 40]);
        this.SetDefaultSpecialValue("movement_slow", [-10, -12, -14, -16, -18, -20]);
        this.SetDefaultSpecialValue("duration", 5);
        this.SetDefaultSpecialValue("max_count", [7, 8, 9, 10, 11, 12]);
        this.SetDefaultSpecialValue("single_max_count", 3);

    }



    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("radius") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_death_prophet_custom")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = hCaster.GetAbsOrigin()
        let radius = this.GetSpecialValueFor("radius") + hCaster.GetTalentValue("special_bonus_unique_death_prophet_custom")
        let duration = this.GetSpecialValueFor("duration")
        let max_count = this.GetSpecialValueFor("max_count")
        let single_max_count = this.GetSpecialValueFor("single_max_count")

        let death_prophet_3 = ability6_death_prophet_exorcism.findIn(hCaster)

        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vPosition, radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)

        let count
        // 单位小于max_count时，可以对同一目标施法多次，但是不超过single_max_count
        for (let hTarget of (tTargets)) {
            if (IsValid(death_prophet_3) && death_prophet_3.GetLevel() > 0) {
                death_prophet_3.ScepterSpirit(hTarget)
            }
            let hModifier = modifier_death_prophet_2_debuff.findIn(hTarget)
            if (IsValid(hModifier)) {
                hModifier.SetDuration(duration, true)
                hModifier.ForceRefresh()
            } else {
                modifier_death_prophet_2_debuff.apply(hTarget, hCaster, this, { duration: duration })
            }
            // count = n
        }
        if (tTargets.length > 0) {
            // for (let i = count; i <= max_count; i++) {
            //     let tTempTargets = shallowcopy(tTargets)
            //     let hTarget = GetRandomElement(tTempTargets)
            //     let hModifier  = modifier_death_prophet_2_debuff.findIn(  hTarget )
            //     while (IsValid(hModifier) && hModifier.GetStackCount() >= single_max_count) {
            //         ArrayRemove(tTempTargets, hTarget)
            //         if (tTempTargets.length <= 0) {
            //             break
            //         }
            //         hTarget = GetRandomElement(tTempTargets)
            //         hModifier  = modifier_death_prophet_2_debuff.findIn(  hTarget )
            //     }
            //     if (IsValid(hTarget)) {
            //         if (IsValid(death_prophet_3) && death_prophet_3.GetLevel() > 0) {
            //             death_prophet_3.ScepterSpirit(hTarget)
            //         }
            //         let hModifier = hTarget.FindModifierByNameAndCaster("modifier_death_prophet_2_debuff", hCaster)
            //         if (IsValid(hModifier)) {
            //             hModifier.SetDuration(duration, true)
            //             hModifier.ForceRefresh()
            //         } else {
            //              modifier_death_prophet_2_debuff.apply( hTarget , hCaster, this, { duration = duration })
            //         }
            //     }
            // }
        }

        EmitSoundOnLocationWithCaster(vPosition, ResHelper.GetSoundReplacement("Hero_DeathProphet.Silence", hCaster), hCaster)
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_death_prophet_2"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_death_prophet_2 extends BaseModifier_Plus {
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
    GetTexture() {
        return "death_prophet_spirit_siphon"
    }
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }


    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (!IsValid(ability)) {
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

            let range = ability.GetSpecialValueFor("radius")
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
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
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect() {
        return this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_death_prophet_2_debuff extends BaseModifier_Plus {
    radius: number;
    damage: number;
    intellect: number;
    movement_slow: number;
    single_max_count: number;
    interval: number;
    damage_type: DAMAGE_TYPES;
    sSoundName: string;
    fIntervalTime: number;
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
    ShouldUseOverheadOffset() {
        return true
    }
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    Init(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.radius = this.GetSpecialValueFor("radius")
        this.damage = this.GetSpecialValueFor("damage")
        this.intellect = this.GetSpecialValueFor("intellect")
        this.movement_slow = this.GetSpecialValueFor("movement_slow")
        this.single_max_count = this.GetSpecialValueFor("single_max_count")
        this.interval = 0.25
        if (IsServer()) {
            let root_duration = hCaster.GetTalentValue("special_bonus_unique_death_prophet_custom_7")
            if (root_duration > 0) {
                modifier_death_prophet_2_talent_root.apply(hParent, hCaster, this.GetAbilityPlus(), { duration: root_duration * hParent.GetStatusResistanceFactor(hCaster) })
            }
            this.damage_type = this.GetAbilityPlus().GetAbilityDamageType()
            this.sSoundName = ResHelper.GetSoundReplacement("Hero_DeathProphet.SpiritSiphon.Target", hCaster)
            hParent.EmitSound(this.sSoundName)
            if (this.GetStackCount() < this.single_max_count) {
                this.IncrementStackCount()
                GTimerHelper.AddTimer(params.duration, GHandler.create(this, () => {
                    this.DecrementStackCount()
                }))
            } else {
                let sTalentName = "special_bonus_unique_death_prophet_custom_4"
                let bIsValidTalent = hCaster.HasTalent(sTalentName)
                if (bIsValidTalent) {
                    let duration = hCaster.GetTalentValue(sTalentName)
                    //  modifier_death_prophet_2_buff.apply( hCaster , hCaster, this.GetAbilityPlus(), { duration: duration, int: this.tDatas[0].iInt })
                }
            }

            this.fIntervalTime = GameRules.GetGameTime() + this.interval
            this.StartIntervalThink(1 / 30)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_death_prophet/death_prophet_spiritsiphon.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_head", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticleID, 5, Vector(this.GetDuration(), 0, 0))
            ParticleManager.SetParticleControl(iParticleID, 11, Vector(0, 0, 0))
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }


    OnIntervalThink() {
        if (IsServer()) {
            let hAbility = this.GetAbilityPlus()
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            if (!IsValid(hAbility) || !IsValid(hCaster) || !hCaster.IsAlive()) {
                this.Destroy()
                return
            }

            let sTalentName = "special_bonus_unique_death_prophet_custom_4"
            let bIsValidTalent = hCaster.HasTalent(sTalentName)

            let fGameTime = GameRules.GetGameTime()



            if (fGameTime >= this.fIntervalTime) {
                this.fIntervalTime = this.fIntervalTime + this.interval

                let fDamage = this.damage * this.interval * this.GetStackCount()
                let tDamageTable = {
                    ability: hAbility,
                    attacker: hCaster,
                    victim: hParent,
                    damage: fDamage,
                    damage_type: this.damage_type,
                    extra_flags: BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_DOT,
                }
                BattleHelper.GoApplyDamage(tDamageTable)
            }

            this.UpdateInt()
        }
    }
    UpdateInt() {
        if (IsServer()) {
            // let hAbility = this.GetAbilityPlus()
            // let hCaster = this.GetCasterPlus()
            // let hParent = this.GetParentPlus()

            // let iInt = 0
            // for (let i = this.tDatas.length- 1; i >= 0; i--) {
            //     iInt = iInt + this.tDatas[i].iInt
            // }
            // let iChangedInt = math.floor(iInt) - math.floor(this.iInt)
            // this.iInt = iInt

            // if (!IsValid(hAbility) || !IsValid(hCaster) || !hCaster.IsAlive()) {
            //     return
            // }

            // let hModifier  = hAbility.GetIntrinsicModifierName(.findIn(  hCaster )
            // if (IsValid(hModifier)) {
            //     hModifier.SetStackCount(hModifier.GetStackCount() + iChangedInt)
            // }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_SILENCED]: true,
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage() {
        return this.movement_slow * this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_death_prophet_2_buff extends BaseModifier_Plus {
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
    GetTexture() {
        return "death_prophet_spirit_siphon"
    }
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            let iInt = params.int || 0
            let hParent = this.GetParentPlus()
            this.ChangeStackCount(iInt)
            GTimerHelper.AddTimer(params.duration, GHandler.create(this, () => {
                this.ChangeStackCount(-iInt)
            }))
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)

    CC_tooltip(params: IModifierTable) {
        return this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect() {
        return this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_death_prophet_2_talent_root// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_death_prophet_2_talent_root extends BaseModifier_Plus {
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
                resPath: "particles/generic_gameplay/common_root.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
        }
    }
}
