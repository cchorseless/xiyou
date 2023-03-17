import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_generic_feared } from "../../../modifier/effect/modifier_generic_feared";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_queenofpain_blink = { "ID": "5174", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES", "AbilitySound": "Hero_QueenOfPain.Blink_in", "HasShardUpgrade": "1", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2", "AbilityCastRange": "0", "AbilityCastPoint": "0.33 0.33 0.33 0.33", "AbilityCooldown": "12.0 10.0 8.0 6.0", "AbilityManaCost": "60 60 60 60", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "blink_range": "1075 1150 1225 1300" }, "02": { "var_type": "FIELD_INTEGER", "min_blink_range": "200" } } };

@registerAbility()
export class ability2_queenofpain_blink extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "queenofpain_blink";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_queenofpain_blink = Data_queenofpain_blink;
    Init() {
        this.SetDefaultSpecialValue("area_of_effect", 900);
        this.SetDefaultSpecialValue("projectile_speed", 900);
        this.SetDefaultSpecialValue("damage_per_int", [7, 8, 9, 11, 13, 15]);

    }

    Init_old() {
        this.SetDefaultSpecialValue("area_of_effect", 900);
        this.SetDefaultSpecialValue("projectile_speed", 900);
        this.SetDefaultSpecialValue("damage_per_int", [4.5, 5, 5.5, 6, 6.5, 7]);

    }



    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("area_of_effect")
    }
    ScreamOfPain(hTarget: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let projectile_speed = this.GetSpecialValueFor("projectile_speed")

        let tInfo = {
            Ability: this,
            EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_queenofpain/queen_scream_of_pain.vpcf", hCaster),
            Source: hCaster,
            iSourceAttachment: hCaster.ScriptLookupAttachment("attach_hitloc"),
            vSourceLoc: hCaster.GetAbsOrigin(),
            Target: hTarget,
            iMoveSpeed: projectile_speed,
            bDodgeable: false,
        }
        ProjectileManager.CreateTrackingProjectile(tInfo)
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()

        modifier_queenofpain_2_particle_cast.apply(hCaster, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

        let fCastRange = this.GetCastRange(hCaster.GetAbsOrigin(), hCaster)
        let iTeamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
        let iTypeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
        let iFlagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
        let iOrder = FindOrder.FIND_CLOSEST
        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), fCastRange, null, iTeamFilter, iTypeFilter, iFlagFilter, iOrder)
        for (let hUnit of (tTargets)) {
            this.ScreamOfPain(hUnit)
        }

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_QueenOfPain.ScreamOfPain", hCaster))
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        if (GFuncEntity.IsValid(hTarget)) {
            let hCaster = this.GetCasterPlus()
            let fDamage = this.GetAbilityDamage()
            let damage_per_int = this.GetSpecialValueFor("damage_per_int")

            if (hCaster.HasTalent("special_bonus_unique_queenofpain_custom_1")) {
                let duration = hCaster.GetTalentValue("special_bonus_unique_queenofpain_custom_1")
                modifier_generic_feared.apply(hTarget, hCaster, this, { duration: duration * hTarget.GetStatusResistanceFactor(hCaster) })
            }

            let iInt = 0
            if (hCaster.GetIntellect != null) {
                iInt = hCaster.GetIntellect()
            }
            let tDamageTable = {
                ability: this,
                victim: hTarget,
                attacker: hCaster,
                damage: fDamage + iInt * damage_per_int,
                damage_type: this.GetAbilityDamageType(),
            }
            BattleHelper.GoApplyDamage(tDamageTable)
        }

        return true
    }

    GetIntrinsicModifierName() {
        return "modifier_queenofpain_2"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_queenofpain_2 extends BaseModifier_Plus {
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
    BeRefresh(params: IModifierTable) {

        if (IsServer()) {
        }
    }
    BeDestroy() {

        if (IsServer()) {
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

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster)

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
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_START)
    OnAbilityStart(params: IModifierTable) {
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (params.unit != null && params.unit == hParent && params.ability && hParent.HasShard()) {
            if (params.ability.GetAbilityName() == "queenofpain_1" || params.ability.GetAbilityName() == "queenofpain_3") {
                hAbility.OnSpellStart()
            }
        }
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_queenofpain_2_particle_cast extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_queenofpain/queen_scream_of_pain_owner.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
