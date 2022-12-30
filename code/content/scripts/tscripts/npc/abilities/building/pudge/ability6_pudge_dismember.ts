
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_pudge_dismember = { "ID": "5077", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_CHANNELLED | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "FightRecapLevel": "2", "HasShardUpgrade": "1", "AbilityDraftPreAbility": "pudge_eject", "AbilityCastRange": "160", "AbilityCastPoint": "0.3 0.3 0.3", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityChannelAnimation": "ACT_DOTA_CHANNEL_ABILITY_4", "AbilityChannelTime": "3.0 3.0 3.0", "AbilityCooldown": "30 25 20", "AbilityManaCost": "100 130 170", "AbilitySpecial": { "10": { "var_type": "FIELD_FLOAT", "order_lock_duration": "3", "RequiresShard": "1" }, "01": { "var_type": "FIELD_INTEGER", "dismember_damage": "60 90 120", "LinkedSpecialBonus": "special_bonus_unique_pudge_3", "LinkedSpecialBonusField": "value", "LinkedSpecialBonusOperation": "SPECIAL_BONUS_MULTIPLY" }, "02": { "var_type": "FIELD_FLOAT", "strength_damage": "0.3 0.6 0.9", "LinkedSpecialBonus": "special_bonus_unique_pudge_3", "LinkedSpecialBonusField": "value", "LinkedSpecialBonusOperation": "SPECIAL_BONUS_MULTIPLY", "CalculateSpellDamageTooltip": "0" }, "03": { "var_type": "FIELD_INTEGER", "ticks": "6", "LinkedSpecialBonus": "special_bonus_unique_pudge_6", "LinkedSpecialBonusField": "value2" }, "04": { "var_type": "FIELD_INTEGER", "pull_units_per_second": "75" }, "05": { "var_type": "FIELD_INTEGER", "pull_distance_limit": "125" }, "06": { "var_type": "FIELD_FLOAT", "animation_rate": "1.5" }, "07": { "var_type": "FIELD_INTEGER", "abilitychanneltime": "", "LinkedSpecialBonus": "special_bonus_unique_pudge_6" }, "08": { "var_type": "FIELD_INTEGER", "creep_dismember_duration_tooltip": "6.0 6.0 6.0" }, "09": { "var_type": "FIELD_INTEGER", "scepter_regen_pct": "6", "RequiresShard": "1" } } };

@registerAbility()
export class ability6_pudge_dismember extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "pudge_dismember";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_pudge_dismember = Data_pudge_dismember;
    Init() {
        this.SetDefaultSpecialValue("radius", 300);
        this.SetDefaultSpecialValue("per_damage", [1000, 1500, 2000, 2500, 3000, 4000]);
        this.SetDefaultSpecialValue("per_damage_str", [5, 6, 7, 8, 9, 10]);
        this.SetDefaultSpecialValue("damage_regen_health_pct", 100);
        this.SetDefaultSpecialValue("pull_units_per_second", 100);
        this.SetDefaultSpecialValue("scepter_duration", 4);
        this.SetDefaultSpecialValue("scepter_radius", 300);
        this.SetDefaultSpecialValue("interval", 0.5);
        this.SetDefaultSpecialValue("channel_duration", 4);

    }



    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        let radius = this.GetSpecialValueFor("radius")
        let duration = this.GetSpecialValueFor("channel_duration")
        this.OnCastPudge3(hTarget)
    }
    OnCastPudge3(hTarget: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let radius = this.GetSpecialValueFor("radius")
        let duration = this.GetSpecialValueFor("channel_duration")
        if (!GameFunc.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        let hThinker = BaseNpc_Plus.CreateUnitByName(hCaster.GetUnitName(), hCaster.GetAbsOrigin(), hCaster.GetTeamNumber(), false, hCaster, hCaster)

        for (let i = hThinker.GetAbilityCount() - 1; i >= 0; i++) {
            let hAbility = hThinker.GetAbilityByIndex(i)
            if (GameFunc.IsValid(hAbility)) {
                hThinker.RemoveAbilityByHandle(hAbility)
            }
        }
        hThinker.SetForwardVector(hCaster.GetForwardVector())
        let hModifier = modifier_pudge_6_thinker.apply(hThinker, hCaster, this, { duration: duration })

        let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), hTarget.GetAbsOrigin(), null, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
        for (let hTarget of (tTarget as IBaseNpc_Plus[])) {
            if (GameFunc.IsValid(hTarget) && hTarget.IsAlive()) {
                modifier_pudge_6_buff.apply(hTarget, hCaster, this, { duration: hCaster.HasTalent("special_bonus_unique_pudge_custom_6") && duration || duration * hTarget.GetStatusResistanceFactor(hCaster) })
            }
        }
        hCaster.EmitSound("Hero_Pudge.Dismember.Cast")
    }

    GetIntrinsicModifierName() {
        return "modifier_pudge_6"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_pudge_6 extends BaseModifier_Plus {
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

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()

            //  优先攻击目标
            let target = caster.GetAttackTarget()
            if (target != null && target.GetClassname() == "dota_item_drop") { target = null }
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
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                    TargetIndex: target.entindex(),
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_pudge_6_buff extends BaseModifierMotionHorizontal_Plus {
    per_damage: number;
    per_damage_str: number;
    damage_regen_health_pct: number;
    pull_speed: number;
    scepter_duration: number;
    scepter_radius: number;
    ticks: number;
    interval: number;
    pull_units_per_second: number;
    vTargetPosition: Vector;
    vVelocity: Vector;
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
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    Init(params: ModifierTable) {
        this.per_damage = this.GetSpecialValueFor("per_damage")
        this.per_damage_str = this.GetSpecialValueFor("per_damage_str")
        this.damage_regen_health_pct = this.GetSpecialValueFor("damage_regen_health_pct")
        this.pull_speed = this.GetSpecialValueFor("pull_speed")
        this.scepter_duration = this.GetSpecialValueFor("scepter_duration")
        this.scepter_radius = this.GetSpecialValueFor("scepter_radius")
        this.ticks = this.GetSpecialValueFor("ticks")
        this.interval = this.GetSpecialValueFor("interval")
        if (params.IsOnCreated && IsServer()) {
            if (this.ApplyHorizontalMotionController()) {
                this.pull_units_per_second = this.GetSpecialValueFor("pull_units_per_second")
                let vDirection = (this.GetCasterPlus().GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin()) as Vector
                vDirection.z = 0
                vDirection = vDirection.Normalized()
                this.vTargetPosition = this.GetCasterPlus().GetAbsOrigin()
                this.vVelocity = (vDirection * this.pull_units_per_second) as Vector
            }
            this.StartIntervalThink(this.interval)
        }
    }

    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus()
            let hParent = this.GetParentPlus()
            if (GameFunc.IsValid(hCaster)) {
                hCaster.InterruptChannel()
            }
            hParent.RemoveHorizontalMotionController(this)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus()
            let hParent = this.GetParentPlus()
            if (!GameFunc.IsValid(hCaster) || !GameFunc.IsValid(hAbility)) {
                this.Destroy()
                return
            }
            let fDamage = (this.per_damage + hCaster.GetStrength() * this.per_damage_str) * this.interval
            let fRegenHealth = fDamage * this.damage_regen_health_pct * 0.01
            hCaster.Heal(fRegenHealth, hAbility)
            if (hCaster.HasScepter()) {
                // 恢复300范围内所有友方英雄生命值溢出生命值转换临时血量上限
                let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), null, this.scepter_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
                for (let hTarget of (tTarget)) {
                    if (GameFunc.IsValid(hTarget) && hTarget.IsAlive() && hTarget != hCaster) {
                        let fMaxHealth = hTarget.GetMaxHealth()
                        let fCurHealth = hTarget.GetHealth()
                        let fLossHealth = fMaxHealth - fCurHealth
                        let fOverflowHealth = fRegenHealth > fLossHealth && fRegenHealth - fLossHealth || 0
                        let fGainHealth = fRegenHealth - fOverflowHealth
                        hTarget.Heal(fGainHealth, hAbility)
                        if (fOverflowHealth > 0) {
                            modifier_pudge_6_buff_health_limit.apply(hTarget, hCaster, hAbility, { duration: this.scepter_duration, fOverflowHealth: fOverflowHealth })
                        }
                    }
                }
            }
            let tDamageTable = {
                ability: hAbility,
                victim: hParent,
                attacker: hCaster,
                damage: fDamage,
                damage_type: hAbility.GetAbilityDamageType()
            }
            BattleHelper.GoApplyDamage(tDamageTable)
            EmitSoundOnLocationWithCaster(hParent.GetAbsOrigin(), "Hero_Pudge.Dismember", hCaster)
        }
    }
    UpdateHorizontalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            if (!GameFunc.IsValid(hCaster)) {
                this.Destroy()
                return
            }
            if (me.IsPositionInRange(this.vTargetPosition, this.pull_units_per_second * dt)) {
                me.SetAbsOrigin(this.vTargetPosition)
            } else {
                me.SetAbsOrigin((me.GetAbsOrigin() + this.vVelocity * dt) as Vector)
            }
        }
    }
    OnHorizontalMotionInterrupted() {
        if (IsServer()) {
            //  this.Destroy()
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_FLAIL
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_pudge_6_buff_health_limit extends BaseModifierMotionHorizontal_Plus {
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
        if (IsServer()) {
            let fOverflowHealth = params.fOverflowHealth || 0
            this.changeStackCount(fOverflowHealth)
            GTimerHelper.AddTimer(params.duration, GHandler.create(this, () => {
                this.changeStackCount(-fOverflowHealth)
            }))
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.HEALTH_BONUS)
    EOM_GetModifierHealthBonus() {
        return this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_pudge_6_thinker extends BaseModifier_Plus {
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

    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            this.GetParentPlus().SafeDestroy()
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_NO_TEAM_MOVE_TO]: true,
            [modifierstate.MODIFIER_STATE_NO_TEAM_SELECT]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_CHANNEL_ABILITY_4
    }
}
