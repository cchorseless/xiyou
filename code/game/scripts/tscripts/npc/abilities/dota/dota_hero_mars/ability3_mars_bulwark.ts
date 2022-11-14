import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_knockback } from "../../../modifier/modifier_knockback";
import { modifier_mars_1_hit_obstacle_stun, modifier_mars_1_move } from "./ability1_mars_spear";

/** dota原技能数据 */
export const Data_mars_bulwark = { "ID": "6582", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_TOGGLE", "HasScepterUpgrade": "1", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "physical_damage_reduction": "40 50 60 70" }, "02": { "var_type": "FIELD_INTEGER", "forward_angle": "140" }, "03": { "var_type": "FIELD_INTEGER", "physical_damage_reduction_side": "20 25 30 35" }, "04": { "var_type": "FIELD_INTEGER", "side_angle": "240" }, "05": { "var_type": "FIELD_INTEGER", "redirect_chance": "70" }, "06": { "var_type": "FIELD_INTEGER", "redirect_range": "800" }, "07": { "var_type": "FIELD_INTEGER", "redirect_speed_penatly": "20" }, "08": { "var_type": "FIELD_INTEGER", "soldier_count": "5" }, "09": { "var_type": "FIELD_INTEGER", "soldier_offset": "200" } } };

@registerAbility()
export class ability3_mars_bulwark extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "mars_bulwark";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_mars_bulwark = Data_mars_bulwark;
    Init() {
        this.SetDefaultSpecialValue("base_attack_interval", 1.7);
        this.SetDefaultSpecialValue("bonus_attack_damage_percent", [150, 230, 330, 470, 620]);
        this.SetDefaultSpecialValue("angle", 140);
        this.SetDefaultSpecialValue("knockback_duration", 0.3);
        this.SetDefaultSpecialValue("knockback_distance", 150);
        this.SetDefaultSpecialValue("duration", [3, 3.5, 4, 4.5, 5]);
        this.SetDefaultSpecialValue("mark_duration", 3);

    }


    OnSpellStart() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let duration = this.GetSpecialValueFor("duration")
            modifier_mars_3_buff.apply(hCaster, hCaster, this, { duration: duration })
        }
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_mars_3"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_mars_3 extends BaseModifier_Plus {
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
    OnRefresh(params: ModifierTable) {
        super.OnRefresh(params);
        if (IsServer()) {
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
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

            //  施法命令
            if (targets[0] != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    OnDeath(params: ModifierTable) {
        let hAttacker = params.attacker
        if (GameFunc.IsValid(hAttacker) && hAttacker.GetUnitLabel() != "builder") {
            if (hAttacker.GetTeamNumber() == params.unit.GetTeamNumber()) {
                return
            }
            hAttacker = hAttacker.GetSource()
            if (GameFunc.IsValid(hAttacker) && hAttacker == this.GetParentPlus() && !hAttacker.IsIllusion() && !hAttacker.PassivesDisabled()) {
                if ((this.GetParentPlus().HasTalent("special_bonus_unique_mars_custom_3"))) {
                    let hAbility = this.GetAbilityPlus()
                    let flCooldown = hAbility.GetCooldownTimeRemaining() + this.GetParentPlus().GetTalentValue("special_bonus_unique_mars_custom_3")
                    if (flCooldown > 0) {
                        hAbility.EndCooldown()
                        hAbility.StartCooldown(flCooldown)
                    }
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_mars_3_buff extends BaseModifier_Plus {
    base_attack_interval: number;
    angle: number;
    duration: number;
    distance: number;
    mark_duration: number;
    bonus_attack_damage_percent: number;
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
        this.base_attack_interval = this.GetSpecialValueFor("base_attack_interval")
        this.angle = this.GetSpecialValueFor("angle")
        this.duration = this.GetSpecialValueFor("knockback_duration")
        this.distance = this.GetSpecialValueFor("knockback_distance")
        this.mark_duration = this.GetSpecialValueFor("mark_duration")
        this.bonus_attack_damage_percent = this.GetSpecialValueFor("bonus_attack_damage_percent")
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.target == null) { return }
        if (params.target.GetClassname() == "dota_item_drop") { return }
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (params.attacker == hParent) {
            if (!BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN) && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                let vCaster = hParent.GetAbsOrigin()
                let vTarget = params.target.GetAbsOrigin()
                let vCasterDir = ((vTarget - vCaster) as Vector).Normalized()
                let fCasterAngle = VectorAngles(vCasterDir).y
                let iParticleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_mars/mars_shield_bash.vpcf",
                    resNpc: hParent,
                    iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                    owner: hParent
                });

                ParticleManager.SetParticleControl(iParticleID, 0, hParent.GetAbsOrigin())
                ParticleManager.SetParticleControlForward(iParticleID, 0, hParent.GetForwardVector())
                ParticleManager.ReleaseParticleIndex(iParticleID)
                let tTarget = FindUnitsInRadius(hParent.GetTeamNumber(), hParent.GetAbsOrigin(), null, hParent.Script_GetAttackRange(), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
                for (let hTarget of (tTarget as BaseNpc_Plus[])) {

                    let vTargetDir = ((hTarget.GetAbsOrigin() - vCaster) as Vector).Normalized()
                    let vTargetAngle = VectorAngles(vTargetDir).y
                    let fAngleDiff = math.abs(AngleDiff(fCasterAngle, vTargetAngle))
                    if (fAngleDiff <= this.angle) {
                        if (hTarget != params.target) {
                            BattleHelper.Attack(hParent, hTarget, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NEVERMISS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)
                        }
                        let vCenter = hParent.GetAbsOrigin()
                        let modifierKnockback = {
                            center_x: vCenter.x,
                            center_y: vCenter.y,
                            center_z: vCenter.z,
                            should_stun: false,
                            duration: this.duration,
                            knockback_duration: this.duration,
                            knockback_distance: this.distance,
                            knockback_height: 25
                        }
                        if (!modifier_mars_1_move.exist(hParent) && !modifier_mars_1_hit_obstacle_stun.exist(hParent) && !modifier_mars_3_mark_debuff.exist(hParent)) {
                            modifier_knockback.apply(hTarget, hParent, hAbility, modifierKnockback)
                        }
                        modifier_mars_3_mark_debuff.apply(hTarget, hParent, hAbility, { duration: this.mark_duration })
                    }
                }
            }
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT)
    GetBaseAttackTimeConstant() {
        return this.base_attack_interval
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    GetDamageOutgoing_Percentage() {
        return this.bonus_attack_damage_percent
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_mars_3_mark_debuff extends BaseModifier_Plus {
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

}
