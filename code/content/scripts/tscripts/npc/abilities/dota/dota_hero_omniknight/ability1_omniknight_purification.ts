import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_omniknight_purification = { "ID": "5263", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AOE", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_FRIENDLY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_PURE", "SpellImmunityType": "SPELL_IMMUNITY_ALLIES_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_Omniknight.Purification", "AbilityCastRange": "550", "AbilityCastPoint": "0.2", "AbilityCooldown": "18 16 14 12", "AbilityManaCost": "80 95 110 125", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "heal": "90 160 230 300", "LinkedSpecialBonus": "special_bonus_unique_omniknight_1" }, "02": { "var_type": "FIELD_INTEGER", "radius": "260", "LinkedSpecialBonus": "special_bonus_unique_omniknight_4" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_omniknight_purification extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "omniknight_purification";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_omniknight_purification = Data_omniknight_purification;
    Init() {
        this.SetDefaultSpecialValue("value", [900, 1600, 2300, 3000, 3700, 4400]);
        this.SetDefaultSpecialValue("damage_factor", [0.5, 1, 1.5, 2, 2.5, 3]);
        this.SetDefaultSpecialValue("radius", 600);
        this.SetDefaultSpecialValue("duration", 6);
        this.SetDefaultSpecialValue("max_stack", 1);

    }

    Init_old() {
        this.SetDefaultSpecialValue("value", [900, 1600, 2300, 3000, 3700]);
        this.SetDefaultSpecialValue("damage_factor", [0.5, 1, 1.5, 2, 2.5, 3]);
        this.SetDefaultSpecialValue("radius", 600);
        this.SetDefaultSpecialValue("duration", 6);
        this.SetDefaultSpecialValue("max_stack", 1);

    }

    hLastTarget: CDOTA_BaseNPC;



    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    OnAbilityPhaseStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        if (hCaster == hTarget) {
            modifier_omniknight_1_self_animation.apply(hCaster, hCaster, this, null)
        } else {
            modifier_omniknight_1_self_animation.remove(hCaster);
        }
        return true
    }
    Purification(hTarget: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()

        let value = this.GetSpecialValueFor("value")
        let damage_factor = this.GetSpecialValueFor("damage_factor") + hCaster.GetTalentValue("special_bonus_unique_omniknight_custom_6")
        let radius = this.GetSpecialValueFor("radius")
        let duration = this.GetSpecialValueFor("duration")

        let iStr = 0
        let iInt = 0
        let iAgi = 0
        if (!GFuncEntity.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        if (hTarget.GetStrength != null) {
            iStr = hTarget.GetStrength()
        }
        if (hTarget.GetIntellect != null) {
            iInt = hTarget.GetIntellect()
        }
        if (hTarget.GetAgility != null) {
            iAgi = hTarget.GetAgility()
        }
        let fDamage = value + (iStr + iInt + iAgi) * damage_factor

        modifier_omniknight_1_buff.apply(hTarget, hCaster, this, { duration: duration })

        modifier_omniknight_1_particle_start.apply(hCaster, hTarget, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

        EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Omniknight.Purification", hCaster), hCaster)

        SendOverheadEventMessage(hTarget.GetPlayerOwner(), DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_HEAL, hTarget, value, hCaster.GetPlayerOwner())

        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hTarget.GetAbsOrigin(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, 0, FindOrder.FIND_CLOSEST)
        for (let hUnit of (tTargets)) {
            let tDamageTable = {
                ability: this,
                attacker: hCaster,
                victim: hUnit,
                damage: fDamage,
                damage_type: this.GetAbilityDamageType()
            }
            BattleHelper.GoApplyDamage(tDamageTable)
        }
    }
    OnSpellStart() {
        this.hLastTarget = this.GetCursorTarget()
        let hTarget = this.GetCursorTarget()
        let hCaster = this.GetCasterPlus()
        let radius = this.GetSpecialValueFor("radius")
        let fCastRange = this.GetCastRange(vec3_invalid, null) + hCaster.GetCastRangeBonus()

        modifier_omniknight_1_particle_cast.apply(hCaster, hTarget, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
        this.Purification(hTarget)
        if (GFuncEntity.IsValid(hTarget) && hCaster.HasTalent("special_bonus_unique_omniknight_custom_4")) {
            let extra_count = hCaster.GetTalentValue("special_bonus_unique_omniknight_custom_4")
            let delay = hCaster.GetTalentValue("special_bonus_unique_omniknight_custom_4", "delay")
            let iCount = 0
            let hLastTarget = hTarget
            let vHitLoc = hLastTarget.GetAttachmentOrigin(hLastTarget.ScriptLookupAttachment("attach_hitloc"))
            let tTargets = [hLastTarget]
            this.addTimer(delay, () => {
                let hNextTarget = AoiHelper.GetBounceTarget([hLastTarget], hCaster.GetTeamNumber(), fCastRange, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, GFuncEntity.IsValid(hLastTarget) && hLastTarget.GetAbsOrigin() || vHitLoc, FindOrder.FIND_CLOSEST, false)
                if (GFuncEntity.IsValid(hNextTarget)) {
                    let iParticleID = ResHelper.CreateParticle({
                        resPath: "particles/units/heroes/hero_omniknight/omniknight_purification_cast.vpcf",
                        resNpc: hCaster,
                        iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                        owner: hLastTarget
                    });

                    if (GFuncEntity.IsValid(hLastTarget)) {
                        ParticleManager.SetParticleControlEnt(iParticleID, 0, hLastTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hLastTarget.GetAbsOrigin(), true)
                    } else {
                        ParticleManager.SetParticleControl(iParticleID, ParticleAttachment_t.PATTACH_POINT_FOLLOW, vHitLoc)
                    }
                    ParticleManager.SetParticleControlEnt(iParticleID, 1, hNextTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hNextTarget.GetAbsOrigin(), true)
                    ParticleManager.ReleaseParticleIndex(iParticleID)

                    this.Purification(hNextTarget)

                    iCount = iCount + 1
                    if (iCount < extra_count) {
                        table.insert(tTargets, hNextTarget)
                        return delay
                    }
                }
            })
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_omniknight_1"
    }

    OnStolen(hSourceAbility: this) {
        this.hLastTarget = hSourceAbility.hLastTarget
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_omniknight_1 extends BaseModifier_Plus {
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
            let ability = this.GetAbilityPlus() as ability1_omniknight_purification
            if (!GFuncEntity.IsValid(ability)) {
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

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus() + caster.GetHullRadius()

            //  优先上一个目标
            let target = GFuncEntity.IsValid(ability.hLastTarget) && ability.hLastTarget || null
            if (target != null && !target.IsPositionInRange(caster.GetAbsOrigin(), range + target.GetHullRadius())) {
                target = null
            }

            //  搜索范围
            if (target == null) {
                let teamFilter = ability.GetAbilityTargetTeam()
                let typeFilter = ability.GetAbilityTargetType()
                let flagFilter = ability.GetAbilityTargetFlags()
                let order = FindOrder.FIND_CLOSEST
                let targets = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), null, range, teamFilter, typeFilter, flagFilter, order, false)
                for (let i = targets.length - 1; i >= 0; i--) {
                    if (targets[i].GetUnitLabel() == "builder") {
                        table.remove(targets, i)
                    }
                }
                //  优先英雄单位
                table.sort(targets, (a, b) => {
                    return a.GetUnitLabel() == "HERO" && b.GetUnitLabel() != "HERO"
                })
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
@registerModifier()
export class modifier_omniknight_1_buff extends BaseModifier_Plus {
    value: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return false
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
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.value = this.GetSpecialValueFor("value")
        if (IsClient()) {
            let iPtclID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_omniknight/omniknight_repel_buff.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iPtclID, false, false, -1, false, false)
        }
    }
    BeRefresh(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.value = this.GetSpecialValueFor("value")
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_BONUS)
    G_HEALTH_BONUS() {
        return this.value
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    G_MANA_BONUSS() {
        return this.value
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.value
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_omniknight_1_self_animation extends BaseModifier_Plus {
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
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    Get_ActivityTranslationModifiers() {
        return "this"
    }
}
// 特效
@registerModifier()
export class modifier_omniknight_1_particle_start extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let radius = this.GetSpecialValueFor("radius")
        if (IsClient()) {
            let hTarget = this.GetCasterPlus()
            let hCaster = this.GetParentPlus()
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_omniknight/omniknight_purification.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hTarget
            });

            ParticleManager.SetParticleControl(iParticleID, 1, Vector(radius, radius, radius))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
// 特效
@registerModifier()
export class modifier_omniknight_1_particle_cast extends modifier_particle {
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let hTarget = this.GetCasterPlus()
            let hCaster = this.GetParentPlus()
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_omniknight/omniknight_purification_cast.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
