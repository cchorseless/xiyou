
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_poison } from "../../../modifier/effect/modifier_poison";

/** dota原技能数据 */
export const Data_viper_viper_strike = { "ID": "5221", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "FightRecapLevel": "2", "AbilitySound": "hero_viper.viperStrike", "HasScepterUpgrade": "1", "AbilityCastRange": "500", "AbilityCastPoint": "0.3 0.3 0.3", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "50 40 30", "AbilityManaCost": "100 150 200", "AbilitySpecial": { "10": { "var_type": "FIELD_FLOAT", "charge_restore_time": "30.0" }, "01": { "var_type": "FIELD_FLOAT", "duration": "5" }, "02": { "var_type": "FIELD_INTEGER", "damage": "80 120 160", "LinkedSpecialBonus": "special_bonus_unique_viper_2" }, "03": { "var_type": "FIELD_INTEGER", "bonus_movement_speed": "-40 -60 -80" }, "04": { "var_type": "FIELD_INTEGER", "bonus_attack_speed": "-40 -60 -80" }, "05": { "var_type": "FIELD_INTEGER", "mana_cost_scepter": "125 125 125", "RequiresScepter": "1" }, "06": { "var_type": "FIELD_FLOAT", "cooldown_scepter": "10", "RequiresScepter": "1" }, "07": { "var_type": "FIELD_INTEGER", "cast_range_scepter": "900", "RequiresScepter": "1" }, "08": { "var_type": "FIELD_INTEGER", "projectile_speed": "1200" }, "09": { "var_type": "FIELD_INTEGER", "max_charges": "2" } } };

@registerAbility()
export class ability6_viper_viper_strike extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "viper_viper_strike";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_viper_viper_strike = Data_viper_viper_strike;
    Init() {
        this.SetDefaultSpecialValue("poison_count", [2000, 3200, 4400, 5600, 6800, 8000]);
        this.SetDefaultSpecialValue("movespeed_reduce", [-40, -45, -50, -55, -60, -60]);
        this.SetDefaultSpecialValue("slow_duration", 5);
        this.SetDefaultSpecialValue("projectile_speed", 1200);
        this.SetDefaultSpecialValue("radius_scepter", 800);

    }

    Init_old() {
        this.SetDefaultSpecialValue("poison_count", [2000, 3200, 4400, 5600, 6800, 8000]);
        this.SetDefaultSpecialValue("movespeed_reduce", -310);
        this.SetDefaultSpecialValue("slow_duration", 5);
        this.SetDefaultSpecialValue("projectile_speed", 1200);
        this.SetDefaultSpecialValue("radius_scepter", 800);

    }


    iParticlePhaseStart: ParticleID;
    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        if (this.GetCasterPlus().HasScepter()) {
            return this.GetSpecialValueFor("radius_scepter")
        }
        return super.GetCastRange(vLocation, hTarget)
    }
    GetBehavior() {
        if (this.GetCasterPlus().HasScepter()) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST
        }
        return tonumber(tostring(super.GetBehavior()))
    }
    OnAbilityPhaseStart() {
        let hCaster = this.GetCasterPlus()
        let iParticle = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_viper/viper_viper_strike_warmup.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
            owner: hCaster
        });

        ParticleManager.SetParticleControlEnt(iParticle, 1, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_wing_barb_1", hCaster.GetAttachmentOrigin(hCaster.ScriptLookupAttachment("attach_wing_barb_1")), true)
        ParticleManager.SetParticleControlEnt(iParticle, 2, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_wing_barb_2", hCaster.GetAttachmentOrigin(hCaster.ScriptLookupAttachment("attach_wing_barb_2")), true)
        ParticleManager.SetParticleControlEnt(iParticle, 3, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_wing_barb_3", hCaster.GetAttachmentOrigin(hCaster.ScriptLookupAttachment("attach_wing_barb_3")), true)
        ParticleManager.SetParticleControlEnt(iParticle, 4, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_wing_barb_4", hCaster.GetAttachmentOrigin(hCaster.ScriptLookupAttachment("attach_wing_barb_4")), true)

        this.iParticlePhaseStart = iParticle
        return true
    }
    OnAbilityPhaseInterrupted() {
        ParticleManager.DestroyParticle(this.iParticlePhaseStart, false)
        ParticleManager.ReleaseParticleIndex(this.iParticlePhaseStart)
    }
    OnSpellStart() {
        ParticleManager.DestroyParticle(this.iParticlePhaseStart, false)
        ParticleManager.ReleaseParticleIndex(this.iParticlePhaseStart)
        let hCaster = this.GetCasterPlus()
        if (hCaster.HasScepter()) {
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), this.GetSpecialValueFor("radius_scepter"), null, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER)
            if (tTargets[1] != null) {
                for (let hTarget of (tTargets)) {
                    this.CreateTrackingProjectile(hTarget)
                }
            }
        } else {
            this.CreateTrackingProjectile(this.GetCursorTarget())
        }
    }
    CreateTrackingProjectile(hTarget: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hTarget)) {
            return
        }
        let hCaster = this.GetCasterPlus()
        let projectile_speed = this.GetSpecialValueFor("projectile_speed")
        // 显示用的特效
        let iParticle = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_viper/viper_viper_strike_beam.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
            owner: hCaster
        });

        ParticleManager.SetParticleControlEnt(iParticle, 1, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
        ParticleManager.SetParticleControlEnt(iParticle, 2, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_wing_barb_1", hCaster.GetAbsOrigin(), true)
        ParticleManager.SetParticleControlEnt(iParticle, 3, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_wing_barb_2", hCaster.GetAbsOrigin(), true)
        ParticleManager.SetParticleControlEnt(iParticle, 4, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_wing_barb_3", hCaster.GetAbsOrigin(), true)
        ParticleManager.SetParticleControlEnt(iParticle, 5, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_wing_barb_4", hCaster.GetAbsOrigin(), true)
        ParticleManager.SetParticleControl(iParticle, 6, Vector(projectile_speed, 0, 0))
        let hModifier = modifier_viper_6.findIn(hCaster);
        if (GameFunc.IsValid(hModifier)) {
            hModifier.AddParticle(iParticle, false, false, -1, false, false)
        }

        hTarget.EmitSound("hero_viper.viperStrike")

        // 实际作用的隐形弹道
        ProjectileManager.CreateTrackingProjectile(
            {
                Target: hTarget,
                Source: hCaster,
                Ability: this,
                //  EffectName : "",
                iMoveSpeed: projectile_speed,
                bDodgeable: true,
                ExtraData: { iParticle: iParticle }
            }
        )
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, extraData: any) {
        if (extraData.iParticle) {
            ParticleManager.DestroyParticle(extraData.iParticle, false)
        }

        if (!GameFunc.IsValid(hTarget)) {
            return
        }

        let hCaster = this.GetCasterPlus()

        // 神杖aoe蝮蛇突袭不触发林肯，
        if (!hCaster.HasScepter() && hTarget.TriggerSpellAbsorb(this)) {
            return
        }

        modifier_viper_6_debuff.apply(hTarget, this.GetCasterPlus(), this, { duration: this.GetSpecialValueFor("slow_duration") * hTarget.GetStatusResistanceFactor(this.GetCasterPlus()) })
        hTarget.EmitSound("hero_viper.viperStrikeImpact")
    }
    GetIntrinsicModifierName() {
        return "modifier_viper_6"
    }

}
// // // // // // // // // // // // // // // // // // // -modifier_viper_6// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_viper_6 extends BaseModifier_Plus {
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
        if (!IsServer()) {
            return
        }

        let hAbility = this.GetAbilityPlus()
        let hParent = this.GetParentPlus()

        if (!GameFunc.IsValid(hAbility) || !GameFunc.IsValid(hParent)) {
            this.StartIntervalThink(-1)
            this.Destroy()
            return
        }

        if (!hAbility.GetAutoCastState()) {
            return
        }

        if (hParent.IsTempestDouble() || hParent.IsIllusion()) {
            this.StartIntervalThink(-1)
            return
        }

        if (!hAbility.IsAbilityReady()) {
            return
        }

        let fRange = hAbility.GetCastRange(hParent.GetAbsOrigin(), hParent) + hParent.GetCastRangeBonus()
        if (hParent.HasScepter()) {
            fRange = this.GetSpecialValueFor("radius_scepter")
        }

        //  优先攻击目标
        let hTarget = hParent.GetAttackTarget()
        if (GameFunc.IsValid(hTarget) && (hTarget.GetClassname() == "dota_item_drop" || !hTarget.IsPositionInRange(hParent.GetAbsOrigin(), fRange))) {
            hTarget = null
        }

        //  搜索范围
        if (!GameFunc.IsValid(hTarget)) {
            hTarget = AoiHelper.FindOneUnitsInRadius(hParent.GetTeamNumber(), hParent.GetAbsOrigin(), fRange, null, hAbility.GetAbilityTargetTeam(), hAbility.GetAbilityTargetType(), hAbility.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)
        }

        //  施法命令
        if (hTarget != null) {
            let tOrder = {
                UnitIndex: hParent.entindex(),
                OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                TargetIndex: hTarget.entindex(),
                AbilityIndex: hAbility.entindex()
            }
            if (hParent.HasScepter()) {
                tOrder.OrderType = dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET
            }

            ExecuteOrderFromTable(tOrder)
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_viper_6_debuff// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_viper_6_debuff extends BaseModifier_Plus {
    movespeed_reduce: any;
    poison_count: any;
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
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    BeCreated(params: IModifierTable) {

        this.poison_count = this.GetSpecialValueFor("poison_count")
        this.movespeed_reduce = this.GetSpecialValueFor("movespeed_reduce")
        if (IsServer()) {
            modifier_poison.Poison(this.GetParentPlus(), this.GetCasterPlus(), this.GetAbilityPlus(), this.poison_count)
        }
        else {
            if (IsClient()) {
                let iParticle = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_viper/viper_viper_strike_debuff.vpcf",
                    resNpc: this.GetCasterPlus(),
                    iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                    owner: this.GetParentPlus()
                });

                this.AddParticle(iParticle, false, false, -1, false, false)
                iParticle = ResHelper.CreateParticle({
                    resPath: "particles/status_fx/status_effect_poison_viper.vpcf",
                    resNpc: this.GetCasterPlus(),
                    iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                    owner: this.GetParentPlus()
                });

                this.AddParticle(iParticle, false, true, 10, false, false)
            }
        }
    }
    BeRefresh(params: IModifierTable) {

        this.poison_count = this.GetSpecialValueFor("poison_count")
        this.movespeed_reduce = this.GetSpecialValueFor("movespeed_reduce")
        if (IsServer()) {
            modifier_poison.Poison(this.GetParentPlus(), this.GetCasterPlus(), this.GetAbilityPlus(), this.poison_count)
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage() {
        return this.movespeed_reduce
    }


}
