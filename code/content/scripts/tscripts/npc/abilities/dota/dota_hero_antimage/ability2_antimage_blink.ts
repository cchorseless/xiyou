
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_antimage_blink = { "ID": "5004", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES", "HasScepterUpgrade": "0", "AbilityCastPoint": "0.4 0.4 0.4 0.4", "AbilityCooldown": "15 12 9 6", "AbilityManaCost": "60", "AbilitySound": "Hero_Antimage.Blink_out", "HasShardUpgrade": "1", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "blink_range": "925 1000 1075 1150", "LinkedSpecialBonus": "special_bonus_unique_antimage_3" }, "02": { "var_type": "FIELD_INTEGER", "min_blink_range": "200" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_antimage_blink extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "antimage_blink";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_antimage_blink = Data_antimage_blink;
    Init() {
        this.SetDefaultSpecialValue("blink_range", [900, 1000, 1100, 1200, 1300, 1400]);
        this.SetDefaultSpecialValue("path_width", 250);
        this.SetDefaultSpecialValue("illusion_out_damage", [55, 56, 57, 58, 59, 60]);
        this.SetDefaultSpecialValue("illusion_duration", [5, 6, 7, 9, 11, 13]);

    }






    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        return super.GetCooldown(iLevel) - hCaster.GetTalentValue("special_bonus_unique_antimage_custom_4")
    }
    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("blink_range")
    }
    OnSpellStart() {
        let path_width = this.GetSpecialValueFor("path_width")
        let illusion_out_damage = this.GetSpecialValueFor("illusion_out_damage")
        let illusion_duration = this.GetSpecialValueFor("illusion_duration")

        let hCaster = this.GetCasterPlus()
        let hHero = PlayerResource.GetSelectedHeroEntity(hCaster.GetPlayerOwnerID())

        let vCasterPosition = hCaster.GetAbsOrigin()
        let vTargetPosition = this.GetCursorPosition()

        let vDirection = (vTargetPosition - vCasterPosition) as Vector
        vDirection.z = 0
        vDirection = vDirection.Normalized()

        modifier_antimage_2_particle_antimage_blink_start.applyThinker(vDirection, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION }, hCaster.GetTeamNumber(), false)

        EmitSoundOnLocationWithCaster(vCasterPosition, ResHelper.GetSoundReplacement("Hero_Antimage.Blink_out", hCaster), hCaster)

        let iCount = 1
        let iInterval = 0
        let iRange = 0
        let iIntervalAdd = 0
        for (let i = 1; i <= iCount; i++) {
            hCaster.addTimer(
                iIntervalAdd,
                () => {
                    let vTargetLocation = (vTargetPosition + hCaster.GetForwardVector() * iRange * (i - 1)) as Vector
                    let hIllusion = hCaster.CreateIllusion(vTargetLocation, false, hHero, hHero, hCaster.GetTeamNumber(), illusion_duration, illusion_out_damage - 100, 0)
                    // hIllusion.FireIllusionSummonned(hCaster)
                    modifier_antimage_2_particle_antimage_blink_end.apply(hIllusion, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
                    if (hCaster.HasTalent('special_bonus_unique_antimage_custom_7')) {
                        modifier_antimage_2_amplify_illusion.apply(hIllusion, hCaster, this, null)
                    }
                    EmitSoundOnLocationWithCaster(hIllusion.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Antimage.Blink_in", hCaster), hCaster)
                    let vLocation = hCaster.GetAbsOrigin()
                    let vStartPosition = (vCasterPosition + vDirection * path_width) as Vector
                    let vEndPosition = (hIllusion.GetAbsOrigin() - vDirection * path_width) as Vector
                    let tTargets = FindUnitsInLine(hCaster.GetTeamNumber(), vStartPosition, vEndPosition, null, path_width, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE)
                    table.sort(
                        tTargets,
                        (a, b) => {
                            return ((vCasterPosition - b.GetAbsOrigin()) as Vector).Length2D() > ((vCasterPosition - a.GetAbsOrigin()) as Vector).Length2D()
                        }
                    )
                    for (let hTarget of (tTargets)) {
                        modifier_antimage_2_particle_antimage_blink_target.apply(hCaster, hTarget, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
                        hCaster.SetAbsOrigin((hTarget.GetAbsOrigin() + (vCasterPosition - hTarget.GetAbsOrigin()) as Vector).Normalized())
                        BattleHelper.Attack(hCaster, hTarget, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)
                    }
                    hCaster.SetAbsOrigin(vLocation)
                }
            )
            iIntervalAdd = iIntervalAdd + iInterval
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_antimage_2"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_antimage_2 extends BaseModifier_Plus {
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
            if (target != null && target.GetClassname() == "dota_item_drop") {
                target = null
            }
            if (target != null && !target.IsPositionInRange(caster.GetAbsOrigin(), range)) {
                target = null
            }
            //  搜索范围
            if (target == null) {
                let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
                let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
                let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
                let order = FindOrder.FIND_CLOSEST
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
                target = targets[0]
            }
            //  施法命令
            if (target != null) {
                ExecuteOrderFromTable(
                    {
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        Position: target.GetAbsOrigin(),
                        AbilityIndex: ability.entindex()
                    }
                )
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_antimage_2_amplify_illusion extends BaseModifier_Plus {
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
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OUTGOING_DAMAGE_PERCENTAGE)
    G_OUTGOING_DAMAGE_PERCENTAGE() {
        return this.GetCasterPlus().GetTalentValue("special_bonus_unique_antimage_custom_7")
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
@registerModifier()
export class modifier_antimage_2_particle_antimage_blink_start extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_antimage/antimage_blink_start.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });
            ParticleManager.SetParticleControlForward(iParticleID, 0, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticleID, 0, hCaster.GetAbsOrigin())
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
@registerModifier()
export class modifier_antimage_2_particle_antimage_blink_end extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_antimage/antimage_blink_end.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hParent
            });
            ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
@registerModifier()
export class modifier_antimage_2_particle_antimage_blink_target extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_antimage/antimage_blink_target.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hCaster
            });
            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
