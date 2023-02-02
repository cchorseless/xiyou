import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionBoth_Plus, BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";
import { modifier_dummy } from "../../../modifier/modifier_dummy";
import { ability6_snapfire_mortimer_kisses } from "./ability6_snapfire_mortimer_kisses";

/** dota原技能数据 */
export const Data_snapfire_firesnap_cookie = { "ID": "6483", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_FRIENDLY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_CREEP", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "FightRecapLevel": "1", "AbilitySound": "Hero_Snapfire.FeedCookie.Cast", "AbilityCastRange": "700", "AbilityCastPoint": "0.2", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2", "AbilityCooldown": "21 19 17 15", "AbilityManaCost": "110", "AbilitySpecial": { "10": { "var_type": "FIELD_FLOAT", "impact_stun_duration": "1.6 1.8 2.0 2.2" }, "11": { "var_type": "FIELD_FLOAT", "self_cast_delay": "0.3" }, "01": { "var_type": "FIELD_INTEGER", "projectile_speed": "1000" }, "02": { "var_type": "FIELD_FLOAT", "pre_hop_duration": "0.0" }, "03": { "var_type": "FIELD_FLOAT", "jump_duration": "0.484" }, "04": { "var_type": "FIELD_INTEGER", "jump_height": "257" }, "05": { "var_type": "FIELD_INTEGER", "jump_horizontal_distance": "425" }, "06": { "var_type": "FIELD_FLOAT", "pre_land_anim_time": "0.14" }, "07": { "var_type": "FIELD_FLOAT", "landing_gesture_duration": "0.6" }, "08": { "var_type": "FIELD_INTEGER", "impact_radius": "300" }, "09": { "var_type": "FIELD_INTEGER", "impact_damage": "70 140 210 280" } } };

@registerAbility()
export class ability2_snapfire_firesnap_cookie extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "snapfire_firesnap_cookie";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_snapfire_firesnap_cookie = Data_snapfire_firesnap_cookie;
    Init() {
        this.SetDefaultSpecialValue("bonus_attack_speed", 300);
        this.SetDefaultSpecialValue("damage_percent", [120, 140, 160, 190, 220, 250]);
        this.SetDefaultSpecialValue("bonus_attack_range", 300);
        this.SetDefaultSpecialValue("reduce_armor", [0.5, 1, 1.5, 2, 2.5, 3]);
        this.SetDefaultSpecialValue("max_reduce_armor_stack", 6);
        this.SetDefaultSpecialValue("reduce_armor_duration", 4);
        this.SetDefaultSpecialValue("attack_stack", [5, 7, 9, 11, 13, 15]);
        this.SetDefaultSpecialValue("mark_duration", 15);
        this.SetDefaultSpecialValue("base_attack_time", 1);
        this.SetDefaultSpecialValue("mark_stack", 5);

    }


    hTarget: IBaseNpc_Plus;

    OnSpellStart() {
        let hCaster = this.GetCasterPlus() as IBaseNpc_Plus & { tMarkUnit: IBaseNpc_Plus[] }
        let hTarget = this.GetCursorTarget()
        this.hTarget = hTarget
        this.CastSpellStart(hTarget)
        if (hCaster.tMarkUnit != null) {
            for (let hTarget of (hCaster.tMarkUnit)) {
                this.CastSpellStart(hTarget)
            }
        }
    }
    CastSpellStart(hTarget: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        if (GameFunc.IsValid(hTarget)) {
            let iProjectileSpeed = this.GetSpecialValueFor("projectile_speed")
            // 音效
            hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Snapfire.FeedCookie.Cast", hCaster))
            hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Snapfire.FeedCookie.Projectile", hCaster))
            let info = {
                Target: hTarget,
                Source: hCaster,
                Ability: this,
                EffectName: "particles/units/heroes/hero_snapfire/hero_snapfire_cookie_projectile.vpcf",
                iMoveSpeed: iProjectileSpeed,
                bDodgeable: false,
                bDrawsOnMinimap: false,
            }
            ProjectileManager.CreateTrackingProjectile(info)
        }
    }
    OnProjectileHit(hTarget: IBaseNpc_Plus, vLocation: Vector) {
        let hCaster = this.GetCasterPlus()
        if (GameFunc.IsValid(hTarget)) {
            ParticleManager.ReleaseParticleIndex(ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_snapfire/hero_snapfire_cookie_buff.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_POINT_FOLLOW,
                owner: hTarget
            }));

            hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Snapfire.FeedCookie.Consume", hCaster))
            let jump_duration = this.GetSpecialValueFor("jump_duration")
            modifier_snapfire_2_jump.apply(hTarget, hCaster, this, { duration: jump_duration })
            // 天赋
            if (hCaster.HasTalent("special_bonus_unique_snapfire_custom_3") && hTarget == this.hTarget) {
                let radius = hCaster.GetTalentValue("special_bonus_unique_snapfire_custom_3")
                let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), hTarget.GetAbsOrigin(), null, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
                for (let _hTarget of (tTarget)) {
                    if (GameFunc.IsValid(_hTarget) && _hTarget != hTarget) {
                        this.CastSpellStart(_hTarget)
                    }
                }
            }
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_snapfire_2"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_snapfire_2 extends BaseModifier_Plus {
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
    OnCreated(params: IModifierTable) {
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
export class modifier_snapfire_2_jump extends BaseModifierMotionBoth_Plus {
    jump_height: number;
    jump_horizontal_distance: number;
    impact_radius: number;
    impact_damage: number;
    impact_stun_duration: number;
    str_factor_damage: number;
    vS: Vector;
    fSpeed: number;
    vV: Vector;
    fDistance: number;
    corner: CBaseEntity;
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params)
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        this.jump_height = this.GetSpecialValueFor("jump_height")
        this.jump_horizontal_distance = this.GetSpecialValueFor("jump_horizontal_distance")
        this.impact_radius = this.GetSpecialValueFor("impact_radius") + hCaster.GetTalentValue("special_bonus_unique_snapfire_custom_2")
        this.impact_damage = this.GetSpecialValueFor("impact_damage")
        this.impact_stun_duration = this.GetSpecialValueFor("impact_stun_duration")
        this.str_factor_damage = this.GetSpecialValueFor("str_factor_damage")
        if (IsServer()) {
            if (this.ApplyHorizontalMotionController() && this.ApplyVerticalMotionController()) {
                // this.corner = Entities.FindByName(null, hParent.Spawner_targetCornerName)
                // if (!GameFunc.IsValid(this.corner)) {
                //     this.Destroy()
                //     return
                // }
                // this.fDistance = ((this.corner.GetAbsOrigin() - hParent.GetAbsOrigin()) as Vector).Length2D()
                // this.jump_horizontal_distance = this.fDistance < this.jump_horizontal_distance && this.fDistance || this.jump_horizontal_distance
                // this.vS = hParent.GetAbsOrigin()
                // this.fSpeed = this.jump_horizontal_distance / this.GetDuration()
                // let vDir = ((this.corner.GetAbsOrigin() - hParent.GetAbsOrigin()) as Vector).Normalized()
                // this.vV = (vDir * this.fSpeed) as Vector
            }
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_snapfire/hero_snapfire_cookie_receive.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
            return iParticleID
        }
    }
    funcGetJmepHeight(x: number): number {
        let a = math.sqrt(this.jump_height)
        x = (x / this.jump_horizontal_distance) * a * 2 - a
        return -(x ^ 2) + this.jump_height
    }
    UpdateHorizontalMotion(me: IBaseNpc_Plus, dt: number): void {
        if (IsServer()) {
            if (this.vV != null) {
                let vPos = (this.vV * dt + this.GetParentPlus().GetAbsOrigin()) as Vector
                let fDis = ((vPos - this.vS) as Vector).Length2D()
                if (fDis > this.jump_horizontal_distance) {
                    fDis = this.jump_horizontal_distance
                }
                vPos.z = this.vS.z + this.funcGetJmepHeight(fDis)
                me.SetAbsOrigin(vPos)
                if (fDis == this.jump_horizontal_distance) {
                    // 成功着陆
                    this.JumpFinish()
                    this.Destroy()
                }
            }
        }
    }
    JumpFinish() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (!GameFunc.IsValid(hCaster)) {
            return
        }

        let iPtclID = ResHelper.CreateParticle({
            resPath: 'particles/units/heroes/hero_snapfire/hero_snapfire_cookie_landing.vpcf',
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN,
            owner: hParent
        });

        ParticleManager.SetParticleControl(iPtclID, 1, Vector(this.impact_radius, this.impact_radius, this.impact_radius))
        ParticleManager.ReleaseParticleIndex(iPtclID)
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Snapfire.FeedCookie.Impact", hCaster))

        let tTargets = FindUnitsInRadius(hCaster.GetTeamNumber(),
            hParent.GetAbsOrigin(), null,
            this.impact_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false) as IBaseNpc_Plus[]
        for (let hTarget of (tTargets)) {
            let damage_table = {
                ability: hAbility,
                attacker: hCaster,
                victim: hTarget,
                damage: this.impact_damage + hCaster.GetStrength() * this.str_factor_damage,
                damage_type: hAbility.GetAbilityDamageType()
            }
            BattleHelper.GoApplyDamage(damage_table)
            modifier_stunned.apply(hTarget, hCaster, this.GetAbilityPlus(), { duration: this.impact_stun_duration * hTarget.GetStatusResistanceFactor(hCaster) })
        }
        // 天赋
        if (hCaster.HasTalent("special_bonus_unique_snapfire_custom_7")) {
            let hThinker = modifier_dummy.applyThinker(hParent.GetAbsOrigin(), hCaster, hAbility, null, hCaster.GetTeamNumber(), false)
            let hAbility3 = ability6_snapfire_mortimer_kisses.findIn(hCaster)
            if (GameFunc.IsValid(hAbility3) && hAbility3.GetLevel() > 0) {
                // hAbility3.OnProjectileHit_ExtraData(hThinker, hThinker.GetAbsOrigin(), {})
            }
        }
    }
    UpdateVerticalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            this.UpdateHorizontalMotion(me, dt)
        }
    }
    OnHorizontalMotionInterrupted() {
        if (IsServer()) {
            this.Destroy()
        }
    }
    OnVerticalMotionInterrupted() {
        if (IsServer()) {
            this.Destroy()
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            this.GetParentPlus().RemoveHorizontalMotionController(this)
            this.GetParentPlus().RemoveVerticalMotionController(this)
        }
    }
}
