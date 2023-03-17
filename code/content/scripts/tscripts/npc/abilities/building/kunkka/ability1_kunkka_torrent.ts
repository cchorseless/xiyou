import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseModifierMotionVertical_Plus, BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_generic_stunned } from "../../../modifier/effect/modifier_generic_stunned";
import { ActiveRootAbility } from "../../ActiveRootAbility";
import { modifier_kunkka_3_ebb, modifier_kunkka_3_talent, modifier_kunkka_3_tide } from "./ability3_kunkka_x_marks_the_spot";
import { ability6_kunkka_ghostship } from "./ability6_kunkka_ghostship";

/** dota原技能数据 */
export const Data_kunkka_torrent = { "ID": "5031", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "Ability.Torrent", "HasScepterUpgrade": "1", "AbilityCastRange": "1300", "AbilityCastPoint": "0.4", "AbilityCooldown": "16 14 12 10", "AbilityManaCost": "90 100 110 120", "AbilityModifierSupportValue": "0.5", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "225", "LinkedSpecialBonus": "special_bonus_unique_kunkka" }, "02": { "var_type": "FIELD_INTEGER", "movespeed_bonus": "-35" }, "03": { "var_type": "FIELD_FLOAT", "slow_duration": "1 2 3 4" }, "04": { "var_type": "FIELD_FLOAT", "stun_duration": "1.6", "LinkedSpecialBonus": "special_bonus_unique_kunkka_7" }, "05": { "var_type": "FIELD_FLOAT", "delay": "1.6 1.6 1.6 1.6" }, "06": { "var_type": "FIELD_INTEGER", "torrent_damage": "75 150 225 300", "LinkedSpecialBonus": "special_bonus_unique_kunkka_2" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_kunkka_torrent extends ActiveRootAbility {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "kunkka_torrent";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_kunkka_torrent = Data_kunkka_torrent;
    Init() {
        this.SetDefaultSpecialValue("radius", 350);
        this.SetDefaultSpecialValue("movespeed_bonus", -50);
        this.SetDefaultSpecialValue("slow_duration", 2);
        this.SetDefaultSpecialValue("stun_duration", 2);
        this.SetDefaultSpecialValue("damage", [300, 600, 900, 1200, 1600, 2000]);
        this.SetDefaultSpecialValue("tide_pct", 50);
        this.SetDefaultSpecialValue("ebb_damage", 20);
        this.SetDefaultSpecialValue("scepter_interval", 4);
        this.SetDefaultSpecialValue("sign_duration", 4);

    }

    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        return super.GetCooldown(iLevel)
    }
    GetAOERadius() {
        let hCaster = this.GetCasterPlus()
        return this.GetSpecialValueFor("radius")
    }
    OnAbilityPhaseInterrupted() {
        let caster = this.GetCasterPlus()
        caster.FaceTowards((caster.GetAbsOrigin() + caster.GetForwardVector()) as Vector)
    }

    Torrent(vPosition: Vector) {
        let caster = this.GetCasterPlus()
        let delay = 0
        modifier_kunkka_1_thinker.applyThinker(vPosition, caster, this, { duration: delay }, caster.GetTeamNumber(), false)
    }
    OnSpellStart() {
        let caster = this.GetCasterPlus()
        let position = this.GetCursorPosition()
        this.Torrent(position)
        if (modifier_kunkka_3_talent.exist(caster)) {
            let hModifier = modifier_kunkka_3_talent.findIn(caster)
            let duration = caster.GetTalentValue("special_bonus_unique_kunkka_custom_8", "duration")
            if (hModifier.GetStackCount() == hModifier.max_charge) {
                let fInterval = hModifier.interval * caster.GetCooldownReduction()
                hModifier.SetDuration(fInterval, true)
                hModifier.StartIntervalThink(fInterval)
                hModifier.DecrementStackCount()
                let ability = ability6_kunkka_ghostship.findIn(caster)
                if (hModifier.GetAbilityPlus().GetToggleState() == true) {
                    modifier_kunkka_3_ebb.apply(caster, caster, ability, { duration: duration })
                } else {
                    modifier_kunkka_3_tide.apply(caster, caster, ability, { duration: duration })
                }
            }
        }
        caster.FaceTowards((caster.GetAbsOrigin() + caster.GetForwardVector()) as Vector)
    }
    OnInit() {
        // this.addFrameTimer(1, () => {
        //     let hCaster = this.GetCasterPlus()
        //     if (this.GetCasterPlus().HasScepter() && this.GetLevel() > 0) {
        //         if (!modifier_kunkka_1_scepter.exist(hCaster)) {
        //             modifier_kunkka_1_scepter.apply(hCaster, hCaster, this, null)
        //         }
        //     } else {
        //         modifier_kunkka_1_scepter.remove(hCaster);
        //     }
        //     return 1
        // })
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_kunkka_1"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_kunkka_1 extends BaseModifier_Plus {
    ebb_damage: number;
    flTime: number;
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
        this.ebb_damage = this.GetSpecialValueFor("ebb_damage")
        if (IsServer()) {
            this.flTime = 0
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
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

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()
            let radius = ability.GetAOERadius()

            let position = AoiHelper.GetAOEMostTargetsPosition(caster.GetAbsOrigin(), range, caster.GetTeamNumber(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)

            //  施法命令
            if (position && position != vec3_invalid && caster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: position
                })
            }
        }
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_CAST_ANGLE)
    GetIgnoreCastAngle(params: IModifierTable) {
        if (IsServer()) {
            if (this.GetCasterPlus().GetCurrentActiveAbility() == this.GetAbilityPlus()) {
                return 1
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DISABLE_TURNING)
    GetDisableTurning(params: IModifierTable) {
        if (IsServer()) {
            if (this.GetCasterPlus().GetCurrentActiveAbility() == this.GetAbilityPlus()) {
                return 1
            }
        }
    }
    // 退潮 昆卡对受影响单位造成伤害提升xx%
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_DAMAGE_PERCENTAGE)
    CC_GetModifierOutgoingDamagePercentage(params: IModifierTable) {
        if (params != null && params.attacker == this.GetParentPlus() && modifier_kunkka_1_slow.exist(params.target)) {
            return this.ebb_damage
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_kunkka_1_thinker extends BaseModifier_Plus {
    radius: number;
    stun_duration: number;
    slow_duration: number;
    sign_duration: number;
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

        let caster = this.GetCasterPlus()
        let extra_radius = caster.GetTalentValue("special_bonus_unique_kunkka_custom")
        this.radius = this.GetSpecialValueFor("radius") + extra_radius
        this.stun_duration = this.GetSpecialValueFor("stun_duration")
        this.slow_duration = this.GetSpecialValueFor("slow_duration")
        this.sign_duration = this.GetSpecialValueFor("sign_duration")
        let position = this.GetParentPlus().GetAbsOrigin()
        if (IsServer()) {
            EmitSoundOnLocationForAllies(position, ResHelper.GetSoundReplacement("Ability.pre.Torrent", caster), caster)
        } else {
            let particleID = ParticleManager.CreateParticleForTeam(ResHelper.GetParticleReplacement("particles/units/heroes/hero_kunkka/kunkka_spell_torrent_bubbles.vpcf", caster), ParticleAttachment_t.PATTACH_WORLDORIGIN, null, caster.GetTeamNumber())
            ParticleManager.SetParticleControl(particleID, 0, position)
            this.AddParticle(particleID, false, false, -1, false, false)
            particleID = ParticleManager.CreateParticleForTeam(ResHelper.GetParticleReplacement("particles/units/heroes/hero_kunkka/kunkka_spell_torrent_bubbles_bonus.vpcf", caster), ParticleAttachment_t.PATTACH_WORLDORIGIN, null, caster.GetTeamNumber())
            ParticleManager.SetParticleControl(particleID, 0, position)
            ParticleManager.SetParticleControl(particleID, 1, Vector(this.radius, 0, 0))
            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }
    BeRemoved(): void {
        let caster = this.GetCasterPlus()
        let position = this.GetParentPlus().GetAbsOrigin()
        let ability = this.GetAbilityPlus()

        if (IsServer()) {
            if (GFuncEntity.IsValid(caster)) {
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), position, this.radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, FindOrder.FIND_CLOSEST)
                for (let target of (targets)) {
                    if (!modifier_kunkka_1_sign.exist(target)) {
                        modifier_kunkka_1_slow.apply(target, caster, ability, { duration: this.stun_duration + this.slow_duration * target.GetStatusResistanceFactor(caster) })
                        modifier_kunkka_1_torrent.apply(target, caster, ability, { duration: this.stun_duration })
                        modifier_kunkka_1_sign.apply(target, caster, ability, { duration: this.sign_duration })
                    }
                }
                EmitSoundOnLocationWithCaster(position, ResHelper.GetSoundReplacement("Ability.Torrent", caster), caster)
            }
            UTIL_Remove(this.GetParentPlus())
        } else {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_kunkka/kunkka_spell_torrent_splash.vpcf",
                resNpc: caster,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(particleID, 0, position)
            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_kunkka_1_torrent extends BaseModifierMotionVertical_Plus {
    radius: number;
    stun_duration: number;
    tide_pct: number;
    damage_per_str: number;
    damage: number;
    tick_interval: number;
    damage_type: DAMAGE_TYPES;
    fTime: number;
    fMotionDuration: number;
    vAcceleration: number;
    vStartVerticalVelocity: number;
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

        let hCaster = this.GetCasterPlus()
        this.radius = this.GetSpecialValueFor("radius") + hCaster.GetTalentValue("special_bonus_unique_kunkka_custom")
        this.stun_duration = this.GetSpecialValueFor("stun_duration")
        this.tide_pct = this.GetSpecialValueFor("tide_pct")
        this.damage_per_str = this.GetSpecialValueFor("damage_per_str") + hCaster.GetTalentValue("special_bonus_unique_kunkka_custom_2")
        this.damage = this.GetSpecialValueFor("damage")
        if (IsServer()) {
            this.damage_type = this.GetAbilityPlus().GetAbilityDamageType()
            this.tick_interval = 0.2
            this.StartIntervalThink(this.tick_interval)

            if (this.ApplyVerticalMotionController()) {
                this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_FLAIL)
                this.fTime = 0
                this.fMotionDuration = 1.2
                this.vAcceleration = -this.GetParentPlus().GetUpVector() * 1800
                this.vStartVerticalVelocity = Vector(0, 0, 0) / this.fMotionDuration - this.vAcceleration * this.fMotionDuration / 2
            }
        } else {
            let iPtclID = ResHelper.CreateParticle({
                resPath: "particles/generic_gameplay/generic_stunned.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iPtclID, false, false, -1, false, this.ShouldUseOverheadOffset())
        }
    }
    BeRefresh(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let extra_radius = 0
        let extra_damage_per_str = 0
        if (GFuncEntity.IsValid(hCaster)) {
            extra_radius = hCaster.GetTalentValue("special_bonus_unique_kunkka_custom")
            extra_damage_per_str = hCaster.GetTalentValue("special_bonus_unique_kunkka_custom_2")
        }
        this.radius = this.GetSpecialValueFor("radius") + extra_radius
        this.stun_duration = this.GetSpecialValueFor("stun_duration")
        this.tide_pct = this.GetSpecialValueFor("tide_pct")
        this.damage_per_str = this.GetSpecialValueFor("damage_per_str") + extra_damage_per_str
        this.damage = this.GetSpecialValueFor("damage")
        if (IsServer()) {
            this.damage_type = this.GetAbilityPlus().GetAbilityDamageType()
        }
    }
    BeDestroy() {

        if (IsServer()) {
            this.GetParentPlus().RemoveVerticalMotionController(this)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let caster = this.GetCasterPlus()
            let ability = this.GetAbilityPlus()
            if (!GFuncEntity.IsValid(caster) || !GFuncEntity.IsValid(ability)) {
                this.Destroy()
                return
            }
            let target = this.GetParentPlus()
            let iStrength = 0
            if (caster.GetStrength) {
                iStrength = caster.GetStrength()
            }
            let damage_per_second = (this.damage + this.damage_per_str * iStrength) / this.GetDuration()

            let damage_table = {
                ability: this.GetAbilityPlus(),
                victim: target,
                attacker: caster,
                damage: damage_per_second * this.tick_interval,
                damage_type: this.damage_type,
                eom_flags: BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_DOT,
            }
            BattleHelper.GoApplyDamage(damage_table)
        }
    }
    UpdateVerticalMotion(me: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            me.SetAbsOrigin((me.GetAbsOrigin() + (this.vAcceleration * this.fTime + this.vStartVerticalVelocity) * dt) as Vector)
            this.fTime = this.fTime + dt
            if (this.fTime >= this.fMotionDuration) {
                this.GetParentPlus().RemoveGesture(GameActivity_t.ACT_DOTA_FLAIL)
                this.GetParentPlus().RemoveVerticalMotionController(this)
                let hCaster = this.GetCasterPlus()
                let hParent = this.GetParentPlus()
                let hAbility = this.GetAbilityPlus()
                hParent.RemoveVerticalMotionController(this)
                if (GFuncEntity.IsValid(hCaster) && modifier_kunkka_3_tide.exist(hCaster)) {
                    let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), this.radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, FindOrder.FIND_CLOSEST)
                    for (let hUnit of (tTargets)) {
                        modifier_generic_stunned.apply(hUnit, hCaster, hAbility, { duration: this.stun_duration * this.tide_pct * 0.01 * hUnit.GetStatusResistanceFactor(hCaster) })
                        let damage_table = {
                            ability: hAbility,
                            victim: hUnit,
                            attacker: hCaster,
                            damage: this.damage * this.tide_pct * 0.01,
                            damage_type: this.damage_type
                        }
                        BattleHelper.GoApplyDamage(damage_table)
                    }
                }
            }
        }
    }
    OnVerticalMotionInterrupted() {
        if (IsServer()) {
            this.GetParentPlus().RemoveGesture(GameActivity_t.ACT_DOTA_FLAIL)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_DISABLED
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_kunkka_1_slow extends BaseModifier_Plus {
    movespeed_bonus: number;
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
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    Init(params: IModifierTable) {
        this.movespeed_bonus = this.GetSpecialValueFor("movespeed_bonus")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(params: IModifierTable) {
        return this.movespeed_bonus
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_kunkka_1_scepter extends BaseModifier_Plus {
    scepter_interval: number;
    IsHidden() {
        return true
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

        this.scepter_interval = this.GetSpecialValueFor("scepter_interval")
        if (IsServer()) {
            this.StartIntervalThink(this.scepter_interval)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus() as ability1_kunkka_torrent
            let flRange = hAbility.GetCastRange(hCaster.GetAbsOrigin(), hCaster) + hCaster.GetCastRangeBonus()
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), flRange, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, FindOrder.FIND_ANY_ORDER)
            if (tTargets.length > 0 && GFuncEntity.IsValid(tTargets[0])) {
                hAbility.Torrent(tTargets[0].GetAbsOrigin())
            }
        }
    }
}
// 标记，被洪流影响的单位，在4秒内不会再次被洪流影响
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_kunkka_1_sign extends BaseModifier_Plus {
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
