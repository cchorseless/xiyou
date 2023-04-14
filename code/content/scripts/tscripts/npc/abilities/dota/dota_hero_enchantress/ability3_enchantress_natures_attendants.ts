
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";


/** dota原技能数据 */
export const Data_enchantress_natures_attendants = { "ID": "5269", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "SpellImmunityType": "SPELL_IMMUNITY_ALLIES_YES", "AbilitySound": "Hero_Enchantress.NaturesAttendantsCast", "HasShardUpgrade": "1", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCooldown": "35", "AbilityDuration": "12", "AbilityManaCost": "170 160 150 140", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "heal_interval": "0.5" }, "02": { "var_type": "FIELD_FLOAT", "heal": "4 8 12 16", "LinkedSpecialBonus": "special_bonus_unique_enchantress_5" }, "03": { "var_type": "FIELD_INTEGER", "radius": "275 275 275 275" }, "04": { "var_type": "FIELD_INTEGER", "wisp_count": "8", "LinkedSpecialBonus": "special_bonus_unique_enchantress_2" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_enchantress_natures_attendants extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "enchantress_natures_attendants";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_enchantress_natures_attendants = Data_enchantress_natures_attendants;
    Init() {
        this.SetDefaultSpecialValue("duration", 8);
        this.SetDefaultSpecialValue("radius", 300);
        this.SetDefaultSpecialValue("dps", [300, 600, 900, 1400, 1900, 2400]);
        this.SetDefaultSpecialValue("interval", 0.25);
        this.SetDefaultSpecialValue("int_coef", 1.5);
        this.SetDefaultSpecialValue("pure_damage", [4, 7, 10, 13, 16, 19]);

    }

    hThinker: IBaseNpc_Plus;
    _vLastPosition: Vector;
    // GetIntrinsicModifierName() {
    //     return "modifier_enchantress_3"
    // }
    GetAOERadius() {
        return this.GetSpecialValueFor("radius") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_enchantress_custom_4")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let duration = this.GetSpecialValueFor("duration")

        EmitSoundOnLocationWithCaster(hCaster.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Enchantress.NaturesAttendantsCast", hCaster), hCaster)
        this.hThinker = modifier_enchantress_3_thinker.applyThinker(vPosition, hCaster, this, { duration: duration }, hCaster.GetTeamNumber(), false)
    }

}
// // // // // // // // // // // // // // // // // // // -modifier_enchantress_3// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_enchantress_3 extends BaseModifier_Plus {
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

    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    order(params: IModifierTable) {
        if (IsServer()) {
            let hAbility = this.GetAbilityPlus() as ability3_enchantress_natures_attendants
            if (params.issuer_player_index != -1 && params.ability == hAbility) {
                if (params.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION) {
                    hAbility._vLastPosition = params.new_pos
                } else if (params.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO) {
                    let bState = hAbility.GetAutoCastState()
                    if (bState) { //  此函数在切换前被调用的
                        hAbility._vLastPosition = null
                    }
                }
            }
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hAbility = this.GetAbilityPlus() as ability3_enchantress_natures_attendants
            if (!IsValid(hAbility)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let hCaster = hAbility.GetCasterPlus()

            if (!hAbility.GetAutoCastState()) {
                return
            }

            if (hCaster.IsTempestDouble() || hCaster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }

            if (!hAbility.IsAbilityReady()) {
                return
            }
            if (IsValid((hAbility).hThinker)) {
                return
            }

            let fRange = hAbility.GetCastRange(hCaster.GetAbsOrigin(), hCaster) + hCaster.GetCastRangeBonus()
            let vPosition = hAbility._vLastPosition
            let iTeamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let iUnitType = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
            let iTargetFlag = hAbility.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS

            if (vPosition == null || vPosition == vec3_invalid || !hCaster.IsPositionInRange(vPosition, fRange)) {
                vPosition = AoiHelper.GetAOEMostTargetsPosition(hCaster.GetAbsOrigin(), fRange, hCaster.GetTeamNumber(), hAbility.GetAOERadius(), null, iTeamFilter, iUnitType, iTargetFlag, FindOrder.FIND_ANY_ORDER) as Vector
                if (vPosition && vPosition == vec3_invalid || !hCaster.IsPositionInRange(vPosition, fRange)) {
                    return
                }
            } else {
                //  施法范围内有单位才施放技能
                let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), fRange, null, iTeamFilter, iUnitType, iTargetFlag, FindOrder.FIND_ANY_ORDER)
                if (tTargets[0] == null) {
                    return
                }
            }

            //  施法命令
            ExecuteOrderFromTable({
                UnitIndex: hCaster.entindex(),
                OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                AbilityIndex: hAbility.entindex(),
                Position: vPosition,
            })
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_enchantress_3_thinker// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_enchantress_3_thinker extends BaseModifier_Plus {
    tPoints: any[];
    iParticleID: ParticleID;
    last_int: number;
    radius: any;
    interval: number;
    int_coef: number;
    dps: number;
    IsAura() {
        return true
    }
    GetAuraRadius() {
        return this.radius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
    }
    GetAura() {
        return 'modifier_enchantress_3_allies'
    }
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.radius = this.GetSpecialValueFor("radius") + hCaster.GetTalentValue("special_bonus_unique_enchantress_custom_4")
        this.dps = this.GetSpecialValueFor("dps")
        this.interval = this.GetSpecialValueFor("interval")
        this.int_coef = this.GetSpecialValueFor("int_coef")

        if (IsServer()) {
            //  小精灵特效
            this.tPoints = []
            for (let i = 3; i <= 11; i++) {
                this.tPoints[i] = hParent
            }
            this.iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_enchantress/enchantress_natures_attendants_lvl4.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_POINT,
                owner: hCaster
            });

            this.AddParticle(this.iParticleID, false, false, -1, false, false)
            for (let i = 0; i < this.tPoints.length; i++) {
                let hUnit = (this.tPoints)[i];
                ParticleManager.SetParticleControlEnt(this.iParticleID, i, hUnit, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hUnit.GetAbsOrigin(), false)
            }
            //  对敌方伤害可叠加
            this.last_int = 0
            this.StartIntervalThink(0)

        } else {

            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_enchantress/enchantress_3_ring.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_POINT,
                owner: hParent
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.radius, this.radius, this.radius))
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    BeDestroy() {

        if (IsServer()) {
            UTIL_Remove(this.GetParentPlus())
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hThinker = this.GetParentPlus()
            let tTargets = FindUnitsInRadius(hThinker.GetTeamNumber(), hThinker.GetAbsOrigin(), null, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false)

            if (null != tTargets[0]) {
                let hCaster = this.GetCasterPlus()
                //  特效处理
                for (let hTarget of (tTargets)) {
                    if (!this.tPoints.indexOf(hTarget)) {
                        //  如果还有没用到的小精灵，为他分配一个
                        for (let i = 0; i < this.tPoints.length; i++) {
                            let hUnit = (this.tPoints)[i];

                            if (hUnit == hThinker || !IsValid(hUnit) || ((hUnit.GetAbsOrigin() - hThinker.GetAbsOrigin()) as Vector).Length2D() > this.radius) {
                                this.tPoints[i] = hTarget
                                ParticleManager.SetParticleControlEnt(this.iParticleID, i, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), false)
                                break
                            }
                        }
                    }
                }
                //  清理不应该有小精灵的单位
                for (let i = 0; i < this.tPoints.length; i++) {
                    let hUnit = (this.tPoints)[i];

                    if (hUnit != hThinker) {
                        if (!IsValid(hUnit) || ((hUnit.GetAbsOrigin() - hThinker.GetAbsOrigin()) as Vector).Length2D() > this.radius) {
                            this.tPoints[i] = hThinker
                            ParticleManager.SetParticleControlEnt(this.iParticleID, i, hThinker, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hThinker.GetAbsOrigin(), false)
                        }
                    }
                }
                //  造成伤害
                if (IsValid(hCaster)) {
                    this.last_int = hCaster.GetIntellect()
                }
                let fDamage = (this.dps + this.last_int * this.int_coef) * this.interval
                let tDamageTable: BattleHelper.DamageOptions = {
                    ability: this.GetAbilityPlus(),
                    attacker: hCaster,
                    victim: null,
                    damage: fDamage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE
                }
                for (let hTarget of (tTargets)) {
                    tDamageTable.victim = hTarget
                    BattleHelper.GoApplyDamage(tDamageTable)
                }
            }

            this.StartIntervalThink(this.interval)
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_enchantress_3_allies// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_enchantress_3_allies extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_PURE_DAMAGE_PERCENTAGE)
    pure_damage: number;
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
        this.pure_damage = this.GetSpecialValueFor("pure_damage")
        if (params.IsOnCreated && IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_enchantress/enchantress_natures_attendants_heal_wispa.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }



    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_tooltip() {
        return this.pure_damage
    }




}
