import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";


@registerAbility()
export class t25_demon_gaze extends BaseAbility_Plus {

    GetAOERadius() {
        return this.GetSpecialValueFor("damage_radius")
    }

    CastFilterResultTarget(target: IBaseNpc_Plus) {
        if (target.GetUnitName() == "npc_dota_wraith_king_skeleton_warrior_custom") {
            return UnitFilterResult.UF_FAIL_CUSTOM
        }
        return UnitFilterResult.UF_SUCCESS
    }



    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget() as IBaseNpc_Plus
        let duration = this.GetSpecialValueFor("duration")
        // 声音
        hCaster.EmitSound("Hero_Grimstroke.InkSwell.Cast")

        modifier_t25_demon_gaze_debuff.remove(hTarget);
        // modifier
        modifier_t25_demon_gaze_debuff.apply(hTarget, hCaster, this, { duration: duration * hTarget.GetStatusResistanceFactor(hCaster) })
    }


    GetIntrinsicModifierName() {
        return "modifier_t25_demon_gaze"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t25_demon_gaze extends BaseModifier_Plus {
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
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME)
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

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()

            //  优先攻击目标
            let target = caster.GetAttackTarget()
            if (target != null && target.GetClassname() == "dota_item_drop") {
                target = null
            }
            if (target != null && !target.IsPositionInRange(caster.GetAbsOrigin(), range)) {
                target = null
            }

            //  搜索范围
            if (target == null) {
                let teamFilter = ability.GetAbilityTargetTeam()
                let typeFilter = ability.GetAbilityTargetType()
                let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
                let order = FindOrder.FIND_CLOSEST
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
                target = targets[0]
            }

            //  施法命令
            if (target != null) {
                ExecuteOrderFromTable(
                    {
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                        TargetIndex: target.entindex(),
                        AbilityIndex: ability.entindex()
                    }
                )
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t25_demon_gaze_debuff extends BaseModifier_Plus {
    min_health: number;
    damage_radius: number;
    damage_pct: number;
    duration: number;
    damage: number;
    parent_damage: number;
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
        return true
    }
    AllowIllusionDuplicate() {
        return false
    }
    BeCreated(params: IModifierTable) {

        this.duration = this.GetSpecialValueFor("duration")
        this.damage_pct = this.GetSpecialValueFor("damage_pct")
        this.damage_radius = this.GetSpecialValueFor("damage_radius")
        this.damage = 0
        this.parent_damage = 0
        if (IsServer()) {
            this.min_health = this.GetParentPlus().GetHealth()
        } else {
            let hTarget = this.GetParentPlus()
            let EffectName = "particles/units/towers/t25_demon_gaze.vpcf"
            let nIndexFX = ResHelper.CreateParticle({
                resPath: EffectName,
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: hTarget
            });

            ParticleManager.SetParticleControlEnt(nIndexFX, 1, hTarget, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hTarget.GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(nIndexFX, 2, Vector(this.damage_radius, 0, 0))
            ParticleManager.SetParticleControlEnt(nIndexFX, 3, hTarget, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hTarget.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(nIndexFX, 4, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
            this.AddParticle(nIndexFX, false, false, -1, false, false)
        }
    }
    BeRefresh(params: IModifierTable) {

        this.damage_pct = this.GetSpecialValueFor("damage_pct")
        this.damage_radius = this.GetSpecialValueFor("damage_radius")
        if (IsServer()) {
            this.min_health = this.GetParentPlus().GetHealth()
        }
    }
    BeDestroy() {

        let hTarget = this.GetParentPlus()
        if (IsServer()) {
            let hAbility = this.GetAbilityPlus()
            let hCaster = this.GetCasterPlus()
            if (!GameFunc.IsValid(hCaster)) {
                return
            }
            hCaster.EmitSound("Hero_Grimstroke.InkSwell.Stun")

            let tDamageTable = {
                victim: this.GetParentPlus(),
                attacker: hCaster,
                damage: this.parent_damage,
                damage_type: hAbility.GetAbilityDamageType(),
                ability: hAbility
            }
            BattleHelper.GoApplyDamage(tDamageTable)

            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), this.damage_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, FindOrder.FIND_CLOSEST)
            for (let hTarget of (tTargets)) {
                // if (hTarget != this.GetParentPlus() && !hTarget.IsRoshan() && !hTarget.IsPhantomRoshan()) {
                //     let tDamageTable = {
                //         victim: hTarget,
                //         attacker: hCaster,
                //         damage: this.damage * this.damage_pct * 0.01,
                //         damage_type: hAbility.GetAbilityDamageType(),
                //         ability: hAbility
                //     }
                //     BattleHelper.GoApplyDamage(tDamageTable)
                // }
            }
        } else {
            let EffectName = "particles/units/heroes/hero_grimstroke/grimstroke_ink_swell_aoe.vpcf"
            let nIndexFX = ResHelper.CreateParticle({
                resPath: EffectName,
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hTarget
            });

            ParticleManager.SetParticleControlEnt(nIndexFX, 0, hTarget, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(nIndexFX, 2, Vector(this.damage_radius, this.damage_radius, this.damage_radius))
            ParticleManager.SetParticleControlEnt(nIndexFX, 4, hTarget, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(nIndexFX)
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    OnTakeDamage(params: ModifierInstanceEvent) {
        if (params.unit == this.GetParentPlus()) {
            this.parent_damage = this.parent_damage + params.damage
            if (params.damage_category == DamageCategory_t.DOTA_DAMAGE_CATEGORY_ATTACK) {
                this.damage = this.damage + params.damage
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MIN_HEALTH)
    Get_MinHealth() {
        return this.min_health
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_HEALING)
    Get_DisableHealing() {
        return 1
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
    }
}