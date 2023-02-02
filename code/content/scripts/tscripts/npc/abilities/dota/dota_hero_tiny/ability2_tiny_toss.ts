
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionBoth_Plus, BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_tiny_toss = { "ID": "5107", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_RUNE_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_CUSTOM", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_CUSTOM", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "FightRecapLevel": "1", "AbilityCastRange": "900 1000 1100 1200", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilityCooldown": "17 15 13 11", "AbilityManaCost": "90 100 110 120", "AbilityModifierSupportValue": "0.25", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "1.4" }, "02": { "var_type": "FIELD_INTEGER", "grab_radius": "275" }, "03": { "var_type": "FIELD_INTEGER", "radius": "275" }, "04": { "var_type": "FIELD_INTEGER", "bonus_damage_pct": "30" }, "05": { "var_type": "FIELD_INTEGER", "toss_damage": "90 160 230 300" }, "06": { "var_type": "FIELD_INTEGER", "AbilityCharges": "", "LinkedSpecialBonus": "special_bonus_unique_tiny_2" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_tiny_toss extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "tiny_toss";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_tiny_toss = Data_tiny_toss;
    Init() {
        this.SetDefaultSpecialValue("toss_duration", 1.3);
        this.SetDefaultSpecialValue("bonus_grab_radius", 200);
        this.SetDefaultSpecialValue("grab_radius", 900);
        this.SetDefaultSpecialValue("toss_radius", 275);
        this.SetDefaultSpecialValue("toss_range", 900);
        this.SetDefaultSpecialValue("toss_damage", [1000, 2000, 3000, 4000, 5000, 6000]);
        this.SetDefaultSpecialValue("toss_health_damage", [0.5, 0.6, 0.7, 0.8, 0.9, 1.0]);
        this.SetDefaultSpecialValue("bonus_toss_damage_pct", 0);

    }

    Init_old() {
        this.SetDefaultSpecialValue("duration", 5);
        this.SetDefaultSpecialValue("bonus_damage", [20, 30, 40, 50, 60, 70]);
        this.SetDefaultSpecialValue("bonus_attack_range", 200);
        this.SetDefaultSpecialValue("splash_width", 300);
        this.SetDefaultSpecialValue("splash_range", 900);
        this.SetDefaultSpecialValue("splash_pct", [50, 60, 70, 80, 90, 100]);

    }



    GetAOERadius() {
        return this.GetSpecialValueFor("toss_radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        let grab_radius = this.GetSpecialValueFor("grab_radius")
        let bonus_grab_radius = this.GetSpecialValueFor("bonus_grab_radius")
        // 抓取自身600范围内一个目标
        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), grab_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_FARTHEST)
        for (let i = tTargets.length - 1; i >= 0; i--) {
            if (modifier_tiny_2_toss.exist(tTargets[i])) {
                table.remove(tTargets, i)
            }
        }
        if (GameFunc.IsValid(tTargets[0])) {
            // 额外抓取被抓取目标周围275范围内所有目标
            //  hCaster.StartGesture(GameActivity_t.ACT_TINY_TOSS)
            EmitSoundOnLocationWithCaster(tTargets[0].GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Tiny.Toss.Target"), hCaster)
            let tBonusTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), tTargets[0].GetAbsOrigin(), bonus_grab_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_CLOSEST)
            for (let hTossTarget of (tBonusTargets)) {
                if (GameFunc.IsValid(hTossTarget) && hTossTarget.IsAlive() && !modifier_tiny_2_toss.exist(hTossTarget)) {
                    modifier_tiny_2_toss.apply(hTossTarget, hCaster, this, { target_entindex: hTarget.entindex() })
                }
            }
        }
    }
    Toss(hTarget: IBaseNpc_Plus & { iBonusTossTimes: number }) {
        if (!GameFunc.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        let hCaster = this.GetCasterPlus()
        if (hCaster.HasTalent("special_bonus_unique_tiny_custom_8")) {
            let iBonusTossTimes = hCaster.GetTalentValue("special_bonus_unique_tiny_custom_8")
            if (hTarget.iBonusTossTimes == null || hTarget.iBonusTossTimes < iBonusTossTimes - 1) {
                modifier_tiny_2_toss.apply(hTarget, hCaster, this, { target_entindex: hTarget.entindex() })
                hTarget.iBonusTossTimes = (hTarget.iBonusTossTimes || 0) + 1
            }
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_tiny_2"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_tiny_2 extends BaseModifier_Plus {
    grab_radius: number;
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
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME)
        }
    }
    Init(params: IModifierTable) {
        this.grab_radius = this.GetSpecialValueFor("grab_radius")
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
            let radius = ability.GetAOERadius()

            let target = AoiHelper.GetAOEMostTargetsSpellTarget(caster.GetAbsOrigin(),
                range,
                caster.GetTeamNumber(),
                radius,
                null,
                ability.GetAbilityTargetTeam(),
                ability.GetAbilityTargetType(),
                ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS,
                FindOrder.FIND_CLOSEST)
            if (target != null && !modifier_tiny_2_toss.exist(target)) {
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
export class modifier_tiny_2_toss extends BaseModifierMotionBoth_Plus {
    toss_duration: number;
    toss_radius: number;
    toss_damage: number;
    toss_health_damage: number;
    bonus_toss_damage_pct: number;
    hTossTarget: IBaseNpc_Plus;
    vStartPosition: Vector;
    fTime: number;
    fAcceleration: number;
    fStartVerticalVelocity: number;
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
        this.toss_duration = this.GetSpecialValueFor("toss_duration")
        this.toss_radius = this.GetSpecialValueFor("toss_radius")
        this.toss_damage = this.GetSpecialValueFor("toss_damage")
        this.toss_health_damage = this.GetSpecialValueFor("toss_health_damage")
        this.bonus_toss_damage_pct = this.GetSpecialValueFor("bonus_toss_damage_pct")
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            this.hTossTarget = EntIndexToHScript(params.target_entindex || -1) as IBaseNpc_Plus
            if (this.ApplyHorizontalMotionController() && this.ApplyVerticalMotionController()) {
                this.vStartPosition = hParent.GetAbsOrigin()
                this.fTime = 0
                this.fAcceleration = -4250
                this.fStartVerticalVelocity = -this.fAcceleration * this.toss_duration / 2
            } else {
                this.Destroy()
            }
        }
        else {
            let iPtclID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_tiny/tiny_toss_blur.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iPtclID, false, false, -1, false, this.ShouldUseOverheadOffset())
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus() as ability2_tiny_toss
            let hParent = this.GetParentPlus() as IBaseNpc_Plus & { iBonusTossTimes: number }
            if (GameFunc.IsValid(this.hTossTarget)) {
                // if (!((hParent.Spawner_targetCornerName == this.hTossTarget.Spawner_targetCornerName &&
                //     hParent.Spawner_lastCornerName == this.hTossTarget.Spawner_lastCornerName) ||
                //     (hParent.Spawner_targetCornerName == this.hTossTarget.Spawner_lastCornerName &&
                //         hParent.Spawner_lastCornerName == this.hTossTarget.Spawner_targetCornerName))) {
                //     hParent.Spawner_targetCornerName = this.hTossTarget.Spawner_targetCornerName || hParent.Spawner_targetCornerName
                //     hParent.Spawner_lastCornerName = this.hTossTarget.Spawner_lastCornerName || hParent.Spawner_lastCornerName
                //     Spawner.MoveOrder(hParent)
                // }
            }

            if (!GameFunc.IsValid(hParent)) {
                return
            }

            let vPosition = hParent.GetAbsOrigin()

            hParent.RemoveHorizontalMotionController(this)
            hParent.RemoveVerticalMotionController(this)

            EmitSoundOnLocationWithCaster(vPosition, ResHelper.GetSoundReplacement("Ability.TossThrow"), hCaster)
            if (!GameFunc.IsValid(hCaster) || !GameFunc.IsValid(hAbility)) {
                return
            }
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vPosition, this.toss_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
            for (let hTarget of (tTargets)) {
                let fDamage = this.toss_damage + hCaster.GetMaxHealth() * this.toss_health_damage
                if (hTarget == hParent) {
                    fDamage = fDamage * (1 + this.bonus_toss_damage_pct * 0.01)
                }
                let tDamageTable = {
                    victim: hTarget,
                    attacker: hCaster,
                    damage: fDamage,
                    damage_type: hAbility.GetAbilityDamageType(),
                    ability: hAbility,
                }
                BattleHelper.GoApplyDamage(tDamageTable)
            }
            if (hCaster.HasTalent("special_bonus_unique_tiny_custom_8") && hAbility.Toss != null) {
                if (hParent.iBonusTossTimes != null && hParent.iBonusTossTimes >= hCaster.GetTalentValue("special_bonus_unique_tiny_custom_8") - 1) {
                    hParent.iBonusTossTimes = null
                    return
                }
                hAbility.Toss(hParent)
            }
        }
    }
    UpdateHorizontalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            this.fTime = this.fTime + dt
            if (!GameFunc.IsValid(this.hTossTarget)) {
                this.Destroy()
                return
            }
            me.SetAbsOrigin(GameFunc.VectorFunctions.VectorLerp(this.fTime / this.toss_duration, this.vStartPosition, this.hTossTarget.GetAbsOrigin()))
            if (this.fTime >= this.toss_duration) {
                this.Destroy()
            }
        }
    }
    UpdateVerticalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            if (this.fTime < this.toss_duration) {
                let vPosition = me.GetAbsOrigin()
                vPosition.z = vPosition.z + (this.fAcceleration * this.fTime + this.fStartVerticalVelocity) * dt
                me.SetAbsOrigin(vPosition)
            }
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
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_FLAIL
    }
}
