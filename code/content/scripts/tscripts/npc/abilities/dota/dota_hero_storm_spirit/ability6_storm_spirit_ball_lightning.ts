import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_generic_shock } from "../../../modifier/effect/modifier_generic_shock";
import { modifier_no_health_bar } from "../../../modifier/modifier_no_health_bar";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { ability1_storm_spirit_static_remnant } from "./ability1_storm_spirit_static_remnant";
import { ability3_storm_spirit_overload } from "./ability3_storm_spirit_overload";
/** dota原技能数据 */
export const Data_storm_spirit_ball_lightning = { "ID": "5101", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "AbilitySound": "Hero_StormSpirit.BallLightning", "AbilityCastPoint": "0.3 0.3 0.3", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityManaCost": "30", "AbilityDamage": "8 12 16", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "ball_lightning_initial_mana_percentage": "8" }, "02": { "var_type": "FIELD_INTEGER", "ball_lightning_initial_mana_base": "30" }, "03": { "var_type": "FIELD_INTEGER", "ball_lightning_move_speed": "1400 1850 2300" }, "04": { "var_type": "FIELD_INTEGER", "ball_lightning_aoe": "200" }, "05": { "var_type": "FIELD_INTEGER", "ball_lightning_travel_cost_base": "10" }, "06": { "var_type": "FIELD_FLOAT", "ball_lightning_travel_cost_percent": "0.65" }, "07": { "var_type": "FIELD_INTEGER", "ball_lightning_vision_radius": "400" }, "08": { "var_type": "FIELD_FLOAT", "blocker_duration": "5" }, "09": { "var_type": "FIELD_INTEGER", "scepter_remnant_interval": "300" } } };

@registerAbility()
export class ability6_storm_spirit_ball_lightning extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "storm_spirit_ball_lightning";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_storm_spirit_ball_lightning = Data_storm_spirit_ball_lightning;
    Init() {
        this.SetDefaultSpecialValue("auto_cast_max_range", 800);
        this.SetDefaultSpecialValue("shock_bonus_int", 1);
        this.SetDefaultSpecialValue("ball_lightning_initial_mana_percentage", 8);
        this.SetDefaultSpecialValue("ball_lightning_initial_mana_base", 30);
        this.SetDefaultSpecialValue("ball_lightning_move_speed", [1250, 1500, 1750, 2000, 2250, 2500]);
        this.SetDefaultSpecialValue("ball_lightning_aoe", 125);
        this.SetDefaultSpecialValue("ball_lightning_travel_cost_base", 10);
        this.SetDefaultSpecialValue("ball_lightning_travel_cost_percent", 0.65);
        this.SetDefaultSpecialValue("ball_lightning_damage", [100, 250, 400, 550, 700, 850]);
        this.SetDefaultSpecialValue("ball_lightning_min_distance", 400);
        this.SetDefaultSpecialValue("ball_lightning_duration", 3);

    }

    Init_old() {
        this.SetDefaultSpecialValue("damage_per_second", [300, 600, 900, 1200, 1800, 2400]);
        this.SetDefaultSpecialValue("damage_radius", 800);
        this.SetDefaultSpecialValue("per_second_get_layer", [5, 6, 7, 8, 9, 10]);
        this.SetDefaultSpecialValue("duration", 7);
        this.SetDefaultSpecialValue("per_second_cost_mana", 100);
        this.SetDefaultSpecialValue("per_second_cost_mana_percent", 1);
        this.SetDefaultSpecialValue("super_state_attack_interval", 1.2);
        this.SetDefaultSpecialValue("no_super_state_attack_interval", 1.4);

    }

    fManaCost: number;


    GetManaCost(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        if (!IsValid(hCaster)) {
            return super.GetManaCost(iLevel)
        }
        let fMaxMana = hCaster.GetMaxMana()
        if (IsServer() && modifier_storm_spirit_6_buff.exist(hCaster)) {
            return this.fManaCost || 0
        }
        return this.GetSpecialValueFor("ball_lightning_initial_mana_base") + fMaxMana * this.GetSpecialValueFor("ball_lightning_initial_mana_percentage") * 0.01
    }
    CastFilterResultLocation(vLocation: Vector) {
        let hCaster = this.GetCasterPlus()
        if (modifier_storm_spirit_6_buff.exist(hCaster)) {
            return UnitFilterResult.UF_FAIL_INVALID_LOCATION
        }
        if (((vLocation - hCaster.GetAbsOrigin()) as Vector).Length2D() < this.GetSpecialValueFor("ball_lightning_min_distance")) {
            return UnitFilterResult.UF_FAIL_INVALID_LOCATION
        }
        return UnitFilterResult.UF_SUCCESS
    }

    OnSpellStart() {
        let hCaster = this.GetCasterPlus()

        let vStartPosition = hCaster.GetAbsOrigin()
        let vTargetPosition = this.GetCursorPosition()
        let duration = this.GetSpecialValueFor("ball_lightning_duration")

        ProjectileManager.ProjectileDodge(hCaster)

        modifier_storm_spirit_6_buff.apply(hCaster, hCaster, this, { duration: duration, start_position: vStartPosition, target_position: vTargetPosition })

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_StormSpirit.BallLightning", hCaster))
    }

    GetIntrinsicModifierName() {
        return "modifier_storm_spirit_6"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_storm_spirit_6 extends BaseModifier_Plus {
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

            let hCaster = ability.GetCasterPlus()

            if (modifier_storm_spirit_6_buff.exist(hCaster)) {
                return
            }

            if (!ability.GetAutoCastState()) {
                return
            }

            if (hCaster.IsTempestDouble() || hCaster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }

            let range = ability.GetSpecialValueFor("auto_cast_max_range")
            let start_width = ability.GetSpecialValueFor("ball_lightning_aoe")
            let end_width = ability.GetSpecialValueFor("ball_lightning_aoe")
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let position = AoiHelper.GetLinearMostTargetsPosition(hCaster.GetAbsOrigin(), range, hCaster.GetTeamNumber(), start_width, end_width, null, teamFilter, typeFilter, flagFilter, FindOrder.FIND_CLOSEST)
            if (position != vec3_invalid && hCaster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: position
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_storm_spirit_6_buff extends BaseModifierMotionHorizontal_Plus {
    sSoundName: string;
    ball_lightning_move_speed: number;
    ball_lightning_aoe: number;
    ball_lightning_travel_cost_base: number;
    ball_lightning_travel_cost_percent: number;
    ball_lightning_damage: number;
    ball_lightning_min_distance: number;
    special_bonus_unique_storm_spirit_custom_8_count: number;
    vTargetPosition: Vector;
    fTotalDistance: number;
    vStartPosition: Vector;
    iSign: number;
    tTargets: any[];
    modifier_no_health_bar: IBaseModifier_Plus;
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
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.ball_lightning_move_speed = this.GetSpecialValueFor("ball_lightning_move_speed")
        this.ball_lightning_aoe = this.GetSpecialValueFor("ball_lightning_aoe")
        this.ball_lightning_travel_cost_base = this.GetSpecialValueFor("ball_lightning_travel_cost_base")
        this.ball_lightning_travel_cost_percent = this.GetSpecialValueFor("ball_lightning_travel_cost_percent")
        this.ball_lightning_damage = this.GetSpecialValueFor("ball_lightning_damage")
        this.ball_lightning_min_distance = this.GetSpecialValueFor("ball_lightning_min_distance")
        if (IsServer()) {
            this.special_bonus_unique_storm_spirit_custom_8_count = 0
            this.vStartPosition = GFuncVector.StringToVector(params.start_position)
            this.vTargetPosition = GFuncVector.StringToVector(params.target_position)
            this.fTotalDistance = 0
            this.iSign = 1
            this.tTargets = []
            if (!this.vStartPosition || !this.vTargetPosition || !this.ApplyHorizontalMotionController()) {
                this.Destroy()
                return
            }
            this.modifier_no_health_bar = modifier_no_health_bar.apply(this.GetParentPlus(), this.GetCasterPlus(), this.GetAbilityPlus(), null) as IBaseModifier_Plus
            this.sSoundName = ResHelper.GetSoundReplacement("Hero_StormSpirit.BallLightning.Loop", hCaster)
            if (((this.vTargetPosition - this.vStartPosition) as Vector).Length2D() > this.ball_lightning_move_speed * 2 / 30) {
                hParent.EmitSound(this.sSoundName)
            }
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_stormspirit/stormspirit_ball_lightning.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    BeDestroy() {

        let hParent = this.GetParentPlus()
        if (IsServer()) {
            FindClearSpaceForUnit(hParent, this.vStartPosition, true)
            hParent.StopSound("Hero_StormSpirit.BallLightning.Loop")
            hParent.RemoveHorizontalMotionController(this)
            if (IsValid(this.modifier_no_health_bar)) {
                this.modifier_no_health_bar.Destroy()
            }
        }
    }
    UpdateHorizontalMotion(hParent: IBaseNpc_Plus, dt: number) {
        if (IsServer()) {
            let hAbility = this.GetAbilityPlus() as ability6_storm_spirit_ball_lightning
            if (!IsValid(hAbility)) {
                this.Destroy()
                return
            }
            if (((this.vStartPosition - this.vTargetPosition) as Vector).Length2D() < this.ball_lightning_min_distance) {
                this.Destroy()
                return
            }
            let fDistance = this.ball_lightning_move_speed * dt
            let vPosition = hParent.GetAbsOrigin()
            let fManaCost = (this.ball_lightning_travel_cost_base + hParent.GetMaxMana() * this.ball_lightning_travel_cost_percent * 0.01) * (fDistance / 100)
            if (hParent.GetMana() >= fManaCost) {
                let fMana = hParent.GetMana()
                hAbility.fManaCost = fManaCost
                hAbility.UseResources(true, false, false, false)
                let vTargetPosition = this.iSign == 1 && this.vTargetPosition || this.vStartPosition
                let vDirection = (vTargetPosition - vPosition) as Vector
                vDirection.z = 0

                this.fTotalDistance = this.fTotalDistance + fDistance
                if (hParent.HasTalent("special_bonus_unique_storm_spirit_custom_8")) {
                    let storm_spirit_1 = ability1_storm_spirit_static_remnant.findIn(hParent) as ability1_storm_spirit_static_remnant;
                    if (IsValid(storm_spirit_1) && storm_spirit_1.GetLevel() > 0) {
                        let fValue = hParent.GetTalentValue("special_bonus_unique_storm_spirit_custom_8")
                        if (math.floor(this.fTotalDistance / fValue) > this.special_bonus_unique_storm_spirit_custom_8_count) {
                            this.special_bonus_unique_storm_spirit_custom_8_count = this.special_bonus_unique_storm_spirit_custom_8_count + 1
                            storm_spirit_1.ReleaseRemnant(vPosition)
                            let storm_spirit_4 = ability3_storm_spirit_overload.findIn(hParent) as ability3_storm_spirit_overload;
                            if (IsValid(storm_spirit_4) && storm_spirit_4.GetLevel() > 0) {
                                storm_spirit_4.Overload()
                            }
                        }
                    }
                }

                let vStart
                let vEnd
                if (vDirection.Length2D() <= fDistance) {
                    this.iSign = this.iSign * -1
                    vStart = vTargetPosition
                    vEnd = vPosition
                    vPosition = (vTargetPosition - vDirection.Normalized() * (fDistance - vDirection.Length2D())) as Vector
                    if (fDistance - vDirection.Length2D() > vDirection.Length2D()) {
                        vEnd = vPosition
                    }
                } else {
                    vStart = vPosition
                    vPosition = (vPosition + vDirection.Normalized() * fDistance) as Vector
                    vEnd = vPosition
                }

                hParent.SetAbsOrigin(vPosition)
                let tTargets = FindUnitsInLine(hParent.GetTeamNumber(), vStart, vEnd, null, this.ball_lightning_aoe, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE)
                let fDamage = math.floor(this.fTotalDistance / 100) * this.ball_lightning_damage
                let iShockCount = math.floor(this.fTotalDistance / 100) * this.GetSpecialValueFor("shock_bonus_int") * hParent.GetIntellect()
                for (let hTarget of (tTargets as IBaseNpc_Plus[])) {
                    if (this.tTargets.indexOf(hTarget) == null) {
                        BattleHelper.GoApplyDamage({
                            ability: this.GetAbilityPlus(),
                            attacker: hParent,
                            victim: hTarget,
                            damage: fDamage,
                            damage_type: this.GetAbilityPlus().GetAbilityDamageType()
                        })
                        modifier_generic_shock.Shock(hTarget, hParent, this.GetAbilityPlus(), iShockCount)
                    }
                }

                this.tTargets = tTargets
            } else {
                this.Destroy()
            }
        }
    }
    OnHorizontalMotionInterrupted() {
        if (IsServer()) {
            this.Destroy()
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_ATTACK_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_UNTARGETABLE]: true,
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_4
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TELEPORTED)
    OnTeleported(params: IModifierTable) {
        if (IsServer() && params.unit == this.GetParentPlus()) {
            this.vStartPosition = params.new_pos
        }
    }
}
