import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_shock } from "../../../modifier/effect/modifier_shock";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_arc_warden_tempest_double = { "ID": "5683", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "FightRecapLevel": "2", "AbilitySound": "Hero_ArcWarden.TempestDouble", "HasScepterUpgrade": "1", "AbilityCastPoint": "0.15", "AbilityCastAnimation": "ACT_DOTA_OVERRIDE_ABILITY_4", "AbilityCastGestureSlot": "DEFAULT", "AbilityCooldown": "60 50 40", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "18 22 26", "LinkedSpecialBonus": "special_bonus_unique_arc_warden_6" }, "02": { "var_type": "FIELD_INTEGER", "bounty": "180 240 300" } } };

@registerAbility()
export class ability6_arc_warden_tempest_double extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "arc_warden_tempest_double";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_arc_warden_tempest_double = Data_arc_warden_tempest_double;
    Init() {
        this.SetDefaultSpecialValue("duration", 12);
        this.SetDefaultSpecialValue("wraith_count", 1);
        this.SetDefaultSpecialValue("base_damage", [400, 700, 1100, 1800, 2600, 3500]);
        this.SetDefaultSpecialValue("spawn_interval", 0.3);
        this.SetDefaultSpecialValue("shock_bonus_all", 2.5);
        this.SetDefaultSpecialValue("damage_radius", 300);
        this.SetDefaultSpecialValue("proj_speed", 550);
        this.SetDefaultSpecialValue("fire_count", 3);
        this.SetDefaultSpecialValue("shard_fire_count", 0);

    }



    GetAOERadius() {
        return this.GetSpecialValueFor("damage_radius")
    }
    OnSpellStart() {
        this.SpawnThinker(this.GetCursorPosition())
    }
    SpawnThinker(vPos: Vector) {
        let hCaster = this.GetCasterPlus()
        EmitSoundOn(ResHelper.GetSoundReplacement("Hero_ArcWarden.SparkWraith.Cast", hCaster), hCaster)
        let iCount = this.GetSpecialValueFor("wraith_count") + hCaster.GetTalentValue("special_bonus_unique_arc_warden_custom_1")
        let fSpawnInterval = this.GetSpecialValueFor("spawn_interval")
        modifier_arc_warden_6_thinker.applyThinker(vPos, hCaster, this, {
            iCount: iCount,
            fSpawnInterval: fSpawnInterval
        }, hCaster.GetTeam(), false)
    }
    FireProjectile(vPos: Vector, hTarget: IBaseNpc_Plus, fDamage: number, iShockCount: number, iTalent: any, iFireCount: number) {
        if (!GFuncEntity.IsValid(this.GetCasterPlus())) {
            return
        }
        if (iFireCount <= 0) {
            return
        }
        let tProjInfo = {
            Target: hTarget,
            iMoveSpeed: this.GetSpecialValueFor("proj_speed"),
            EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_arc_warden/arc_warden_wraith_prj.vpcf", this.GetCasterPlus()),
            Ability: this,
            bDodgeable: false,
            vSourceLoc: vPos,
            ExtraData: {
                fDamage: fDamage,
                iShockCount: iShockCount,
                iTalent: iTalent,
                iFireCount: iFireCount
            }
        }
        ProjectileManager.CreateTrackingProjectile(tProjInfo)
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        if (!GFuncEntity.IsValid(hTarget)) {
            return
        }
        let hCaster = this.GetCasterPlus()
        let fDamage = ExtraData.fDamage || 0
        let iShockCount = ExtraData.iShockCount || 0
        let iTalent = ExtraData.iTalent || 0
        let iFireCount = (ExtraData.iFireCount || 0) - 1
        let tDamageTable = {
            attacker: hCaster,
            victim: hTarget,
            damage: fDamage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            ability: this
        }
        modifier_shock.Shock(hTarget, hCaster, this, iShockCount)
        BattleHelper.GoApplyDamage(tDamageTable)
        EmitSoundOn(ResHelper.GetSoundReplacement("Hero_ArcWarden.SparkWraith.Damage", hCaster), hTarget)
        if (iTalent > 0) {
            modifier_shock.ShockActive(hTarget, hCaster, this, iTalent, true)
        }
        if (iFireCount > 0) {
            let units = FindUnitsInRadius(hCaster.GetTeam(), vLocation, null, this.GetSpecialValueFor("damage_radius") * 2, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, 0, 0, false)
            let hNext = null
            for (let u of (units)) {

                if (u != hTarget) {
                    hNext = u
                }
            }
            if (hNext) {
                this.FireProjectile(vLocation, hNext, fDamage, iShockCount, iTalent, iFireCount)
            }
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_arc_warden_6"
    }
}
//  Modifiers
@registerModifier()
export class modifier_arc_warden_6 extends BaseModifier_Plus {
    private _vLastPosition: any;
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
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    On_Order(params: IModifierTable) {
        if (IsServer()) {
            let hAbility = this.GetAbilityPlus()
            if (params.issuer_player_index != -1 && params.ability == hAbility) {
                if (params.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION) {
                    this._vLastPosition = params.new_pos
                } else if (params.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO) {
                    let bState = hAbility.GetAutoCastState()
                    if (bState) { //  此函数在切换前被调用的
                        this._vLastPosition = null
                    }
                }
            }
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

            let hCaster = ability.GetCasterPlus()

            if (!ability.GetAutoCastState()) {
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }
            //  if ( this._vLastPosition ) {
            //  	ExecuteOrderFromTable({
            //  		UnitIndex : hCaster.entindex(),
            //  		OrderType : dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
            //  		AbilityIndex : ability.entindex(),
            //  		Position : this._vLastPosition
            //  	})
            //  	return
            //  }
            let range = ability.GetCastRange(hCaster.GetAbsOrigin(), hCaster) + hCaster.GetCastRangeBonus()
            let radius = ability.GetAOERadius()
            let vPos = AoiHelper.GetAOEMostTargetsPosition(hCaster.GetAbsOrigin(), range, hCaster.GetTeam(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0)
            if (vPos != vec3_invalid) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: this._vLastPosition || vPos
                })
            }
        }
    }
}
//  Modifiers
// // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_arc_warden_6_thinker extends BaseModifier_Plus {
    iCount: any;
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            this.iCount = params.iCount
            let fSpawnInterval = params.fSpawnInterval || 0.3
            this.StartIntervalThink(fSpawnInterval)
            this.Spawn()
        }
    }
    BeDestroy() {

        if (IsServer()) {
            this.StartIntervalThink(-1)
            UTIL_Remove(this.GetParentPlus())
        }
    }
    OnIntervalThink() {
        if (!GFuncEntity.IsValid(this.GetCasterPlus()) || !GFuncEntity.IsValid(this.GetAbilityPlus())) {
            this.Destroy()
            return
        }
        this.Spawn()
    }
    Spawn() {
        let hAbility = this.GetAbilityPlus()
        let hCaster = this.GetCasterPlus()
        let duration = hAbility.GetSpecialValueFor("duration")
        let iRadius = hAbility.GetSpecialValueFor("damage_radius")
        let fDamage = hAbility.GetSpecialValueFor("base_ability")
        let iShockCount = hAbility.GetSpecialValueFor("shock_bonus_all") * hCaster.GetAllStats()
        let iTalent = hCaster.GetTalentValue("special_bonus_unique_arc_warden_custom_6")
        let iFireCount = hAbility.GetSpecialValueFor("fire_count") //  + (hCaster.HasShard() && hAbility.GetSpecialValueFor("shard_fire_count") || 0)
        modifier_arc_warden_6_wraith.applyThinker(this.GetParentPlus().GetOrigin(), hCaster, hAbility, {
            duration: duration,
            iRadius: iRadius,
            fDamage: fDamage,
            iShockCount: iShockCount,
            iTalent: iTalent,
            iFireCount: iFireCount
        }, hCaster.GetTeam(), false)
        this.iCount = this.iCount - 1
        if (this.iCount <= 0) {
            this.Destroy()
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_FLYING]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
        }
    }
}

//  Modifiers
// // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_arc_warden_6_wraith extends BaseModifier_Plus {
    iRadius: any;
    fDamage: any;
    iShockCount: any;
    iTalent: any;
    iFireCount: any;
    IsAura() {
        return true
    }
    GetAura() {
        return ""
    }
    GetAuraRadius() {
        return this.iRadius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
    }
    GetAuraDuration() {
        return 0.1
    }
    GetAuraEntityReject(hEntity: IBaseNpc_Plus) {
        if (GFuncEntity.IsValid(hEntity)) {
            let ability = this.GetAbilityPlus() as ability6_arc_warden_tempest_double
            if (GFuncEntity.IsValid(this.GetCasterPlus()) && GFuncEntity.IsValid(this.GetAbilityPlus()) && ability.FireProjectile) {
                ability.FireProjectile(this.GetParentPlus().GetOrigin(), hEntity, this.fDamage, this.iShockCount, this.iTalent, this.iFireCount)
            }
            this.Destroy()
        }
        return true
    }
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            this.iRadius = params.iRadius || 300
            this.fDamage = params.fDamage || 0
            this.iShockCount = params.iShockCount || 0
            this.iTalent = params.iTalent || 0
            this.iFireCount = params.iFireCount || 1
            let hCaster = this.GetCasterPlus()
            EmitSoundOn(ResHelper.GetSoundReplacement("Hero_ArcWarden.SparkWraith.Activate", hCaster), this.GetParentPlus())
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_arc_warden/arc_warden_wraith.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.iRadius, 0, 0))
            this.AddParticle(iParticleID, false, false, 0, false, false)
        }
    }
    BeDestroy() {

        if (IsServer()) {
            UTIL_Remove(this.GetParentPlus())
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_FLYING]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
        }
    }
}
