import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_storm_spirit_electric_vortex = { "ID": "5099", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "FightRecapLevel": "1", "HasScepterUpgrade": "1", "AbilitySound": "Hero_StormSpirit.ElectricVortex", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCastRange": "300", "AbilityCooldown": "16", "AbilityDuration": "1.4 1.8 2.2 2.6", "AbilityManaCost": "60 70 80 90", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "electric_vortex_pull_distance": "180 220 260 300" }, "02": { "var_type": "FIELD_FLOAT", "electric_vortex_pull_tether_range": "1200.0" }, "03": { "var_type": "FIELD_INTEGER", "electric_vortex_self_slow": "-50" }, "04": { "var_type": "FIELD_INTEGER", "electric_vortex_self_slow_duration": "3.0" }, "05": { "var_type": "FIELD_FLOAT", "abilityduration": "", "LinkedSpecialBonus": "special_bonus_unique_storm_spirit" }, "06": { "var_type": "FIELD_INTEGER", "radius_scepter": "475", "RequiresScepter": "1" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_storm_spirit_electric_vortex extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "storm_spirit_electric_vortex";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_storm_spirit_electric_vortex = Data_storm_spirit_electric_vortex;
    Init() {
        this.SetDefaultSpecialValue("electric_vortex_pull_units_per_second", 200);
        this.SetDefaultSpecialValue("electric_vortex_incoming_damage", 30);
        this.SetDefaultSpecialValue("radius_scepter", 700);
        this.SetDefaultSpecialValue("shock_damage_increase", [20, 22, 24, 26, 28, 30]);

    }

    Init_old() {
        this.SetDefaultSpecialValue("pull_count", [1, 2, 3, 4, 5, 6]);
        this.SetDefaultSpecialValue("duration", [1, 1, 2, 2, 3, 3]);
        this.SetDefaultSpecialValue("absorb_mana_per_second", [50, 100, 150, 200, 250, 300]);
        this.SetDefaultSpecialValue("absorb_mana_per_second_self_percent", 2);

    }


    GetBehavior() {
        let iBehavior = tonumber(tostring(super.GetBehavior()))
        if (this.GetCasterPlus().HasScepter()) {
            iBehavior = iBehavior - DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET
            iBehavior = iBehavior + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET
        }
        return iBehavior
    }
    CastFilterResultTarget(hTarget: IBaseNpc_Plus) {
        // if (hTarget.Spawner_spawnerPlayerID != this.GetCasterPlus().GetPlayerOwnerID()) {
        //     return UnitFilterResult.UF_FAIL_OTHER
        // }
        return UnitFilter(hTarget, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, this.GetCasterPlus().GetTeamNumber())
    }
    GetCooldown(iLevel: number) {
        return super.GetCooldown(iLevel) - this.GetCasterPlus().GetTalentValue("special_bonus_unique_storm_spirit_custom_2")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let fDuration = this.GetDuration() + hCaster.GetTalentValue("special_bonus_unique_storm_spirit_custom_4")
        let radius_scepter = this.GetSpecialValueFor("radius_scepter")

        if (hCaster.HasScepter()) {
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), radius_scepter, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_CLOSEST)
            for (let hTarget of (tTargets)) {

                modifier_storm_spirit_2_pull.apply(hTarget, hCaster, this, { duration: fDuration * hTarget.GetStatusResistanceFactor(hCaster) })
            }
        } else {
            let hTarget = this.GetCursorTarget() as IBaseNpc_Plus
            if (!IsValid(hTarget) || !hTarget.IsAlive()) {
                return
            }
            if (hTarget.TriggerSpellAbsorb(this)) {
                return
            }
            modifier_storm_spirit_2_pull.apply(hTarget, hCaster, this, { duration: fDuration * hTarget.GetStatusResistanceFactor(hCaster) })
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_storm_spirit_2"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_storm_spirit_2 extends BaseModifier_Plus {
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

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster)
            if (!caster.HasScepter()) {
                range = range + caster.GetCastRangeBonus()
            }
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST

            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                let tOrder: ExecuteOrderOptions = {
                    UnitIndex: caster.entindex(),
                    AbilityIndex: ability.entindex(),
                    OrderType: null,
                    TargetIndex: null,
                }
                if (caster.HasScepter()) {
                    tOrder.OrderType = dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET
                }
                else {
                    tOrder.OrderType = dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET
                    tOrder.TargetIndex = targets[0].entindex()
                }

                ExecuteOrderFromTable(tOrder)
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_storm_spirit_2_pull extends BaseModifierMotionHorizontal_Plus {
    electric_vortex_pull_units_per_second: number;
    electric_vortex_incoming_damage: number;
    sSoundName: string;
    vTargetPosition: Vector;
    iParticleID: ParticleID;
    bTeleported: boolean;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return true
    }
    IsStunDebuff() {
        return true
    }
    AllowIllusionDuplicate() {
        return false
    }
    BeCreated(params: IModifierTable) {

        this.electric_vortex_pull_units_per_second = this.GetSpecialValueFor("electric_vortex_pull_units_per_second")
        this.electric_vortex_incoming_damage = this.GetSpecialValueFor("electric_vortex_incoming_damage")
        if (IsServer()) {
            this.bTeleported = false
            this.sSoundName = ResHelper.GetSoundReplacement("Hero_StormSpirit.ElectricVortex", this.GetCasterPlus())
            this.GetParentPlus().EmitSound(this.sSoundName)
            if (this.ApplyHorizontalMotionController()) {
                this.vTargetPosition = this.GetCasterPlus().GetAbsOrigin()
            }
            this.iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_stormspirit/stormspirit_electric_vortex.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(this.iParticleID, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, this.GetCasterPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(this.iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(this.iParticleID, false, false, -1, false, false)
        }
    }
    BeRefresh(params: IModifierTable) {

        this.electric_vortex_pull_units_per_second = this.GetSpecialValueFor("electric_vortex_pull_units_per_second")
        this.electric_vortex_incoming_damage = this.GetSpecialValueFor("electric_vortex_incoming_damage")
        if (IsServer()) {
            this.bTeleported = false
            if (this.ApplyHorizontalMotionController()) {
                this.vTargetPosition = this.GetCasterPlus().GetAbsOrigin()
            }
        }
    }
    BeDestroy() {

        if (IsServer()) {
            this.GetParentPlus().StopSound(this.sSoundName)
            this.GetParentPlus().RemoveHorizontalMotionController(this)
        }
    }
    UpdateHorizontalMotion(hParent: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            if (!IsValid(hCaster) && !this.bTeleported) {
                this.bTeleported = true
                ParticleManager.SetParticleControl(this.iParticleID, 0, this.vTargetPosition)
            }

            let vTargetPosition = this.vTargetPosition
            if (!this.bTeleported) {
                vTargetPosition = hCaster.GetAbsOrigin()
            }
            let vDirection = (vTargetPosition - hParent.GetAbsOrigin()) as Vector
            let fDistance = vDirection.Length2D()
            let fSpeed = this.electric_vortex_pull_units_per_second * dt
            if (fDistance >= fSpeed) {
                hParent.SetAbsOrigin((hParent.GetAbsOrigin() + vDirection.Normalized() * fSpeed) as Vector)
            } else {
                hParent.SetAbsOrigin(vTargetPosition)
            }
            this.vTargetPosition = vTargetPosition
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_SHOCK_DAMAGE_PERCENTAG)
    CC_INCOMING_SHOCK_DAMAGE_PERCENTAG() {
        return this.GetSpecialValueFor("shock_damage_increase")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_FLAIL
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.electric_vortex_incoming_damage
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamagePercentage(params: IModifierTable) {
        if (IsServer() && params) {
            let hCaster = this.GetCasterPlus()
            if (IsValid(hCaster)) {
                if (hCaster.HasTalent("special_bonus_unique_storm_spirit_custom_5") || params.attacker == hCaster) {
                    return this.electric_vortex_incoming_damage
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TELEPORTED)
    OnTeleported(params: IModifierTable) {
        if (params.unit == this.GetCasterPlus()) {
            this.bTeleported = true
            ParticleManager.SetParticleControl(this.iParticleID, 0, this.vTargetPosition)
        }
    }

}
