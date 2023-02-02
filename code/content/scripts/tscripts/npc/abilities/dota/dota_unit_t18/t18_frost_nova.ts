import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle, modifier_particle_thinker } from "../../../modifier/modifier_particle";


@registerAbility()
export class t18_frost_nova extends BaseAbility_Plus {

    GetAOERadius() {
        let hCaster = this.GetCasterPlus()
        // let modifier_combination_t18_frost_condense = modifier_combination_t18_frost_condense.findIn(hCaster) as IBaseModifier_Plus & { extra_radius: number };
        // let extra_radius = (GameFunc.IsValid(modifier_combination_t18_frost_condense) && modifier_combination_t18_frost_condense.GetStackCount() > 0) && modifier_combination_t18_frost_condense.extra_radius || 0
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let thinker_duration = this.GetSpecialValueFor('thinker_duration')

        modifier_t18_frost_nova_thinker.applyThinker((vPosition + Vector(0, 0, 64) as Vector), hCaster, this, { duration: thinker_duration }, hCaster.GetTeamNumber(), false)
    }


    GetIntrinsicModifierName() {
        return "modifier_t18_frost_nova"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t18_frost_nova extends BaseModifier_Plus {
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


    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (!GameFunc.IsValid(ability)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let hCaster = ability.GetCasterPlus()

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

            let range = ability.GetCastRange(hCaster.GetAbsOrigin(), hCaster) + hCaster.GetCastRangeBonus()
            let radius = ability.GetAOERadius()

            let position = AoiHelper.GetAOEMostTargetsPosition(hCaster.GetAbsOrigin(),
                range,
                hCaster.GetTeamNumber(),
                radius,
                null,
                DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
                DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE,
                FindOrder.FIND_CLOSEST
            )

            if (position && position != vec3_invalid && hCaster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: position,
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t18_frost_nova_thinker extends modifier_particle_thinker {
    think_interval: number;
    radius: number;
    slow_duration: number;
    damage_per_second: number;
    tTargetCount: any[];
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        this.radius = this.GetSpecialValueFor("radius")
        this.think_interval = this.GetSpecialValueFor("think_interval")
        this.slow_duration = this.GetSpecialValueFor("slow_duration")
        this.damage_per_second = this.GetSpecialValueFor("damage_per_second")
        if (IsServer()) {
            this.tTargetCount = []
            this.StartIntervalThink(this.think_interval)
            this.SetDuration(this.GetDuration() + this.think_interval - 1 / 30, true)
        }
    }
    OnIntervalThink() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let vPosition = hParent.GetAbsOrigin()
        let hAbility = this.GetAbilityPlus()

        if (IsServer()) {
            if (!GameFunc.IsValid(hCaster)) {
                this.Destroy()
                return
            }

            // let combination_t18_frost_condense  = combination_t18_frost_condense.findIn(  hCaster )
            // let has_combination_t18_frost_condense = GameFunc.IsValid(combination_t18_frost_condense) && combination_t18_frost_condense.IsActivated() && combination_t18_frost_condense.FrostCondense != null
            // let extra_radius = has_combination_t18_frost_condense && combination_t18_frost_condense.GetSpecialValueFor("extra_radius") || 0
            // + extra_radius
            let radius = this.radius

            modifier_t18_frost_nova_particle.apply(hParent, hCaster, hAbility, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

            // 声音
            EmitSoundOnLocationWithCaster(vPosition, "Hero_Lich.IceAge.Tick", hCaster)

            // 伤害 和 减速
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vPosition, radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, FindOrder.FIND_CLOSEST)
            for (let hTarget of (tTargets)) {

                let iTargetEntIndex = hTarget.entindex()

                modifier_t18_frost_nova_slow.apply(hTarget, hCaster, hAbility, { duration: this.slow_duration * hTarget.GetStatusResistanceFactor(hCaster) })

                // if (has_combination_t18_frost_condense) {
                //     if (this.tTargetCount[iTargetEntIndex] == null) { this.tTargetCount[iTargetEntIndex] = 0 }
                //     this.tTargetCount[iTargetEntIndex] = combination_t18_frost_condense.FrostCondense(hTarget, this.tTargetCount[iTargetEntIndex])
                // }

                hTarget.Purge(true, false, false, false, false)

                let tDamageTable = {
                    victim: hTarget,
                    attacker: hCaster,
                    damage: this.damage_per_second * this.think_interval,
                    damage_type: hAbility.GetAbilityDamageType(),
                    ability: hAbility,
                }
                BattleHelper.GoApplyDamage(tDamageTable)
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t18_frost_nova_slow extends BaseModifier_Plus {
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/generic_gameplay/generic_slowed_cold.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_frost.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, true, 10, false, false)
        }
    }
    Init(params: IModifierTable) {
        this.movespeed_bonus = this.GetSpecialValueFor("movespeed_bonus")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage() {
        return this.movespeed_bonus
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t18_frost_nova_particle extends modifier_particle {
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let vPosition = hParent.GetAbsOrigin()
        let hAbility = this.GetAbilityPlus()
        // let hModifier = modifier_combination_t18_frost_condense.findIn(hCaster) as IBaseModifier_Plus & { extra_radius: number };
        // let extra_radius = (GameFunc.IsValid(hModifier) && hModifier.GetStackCount() == 1) && hModifier.extra_radius || 0
        let radius = this.GetSpecialValueFor("radius")
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_lich/lich_ice_age_dmg.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControl(iParticleID, 1, vPosition)
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(radius, radius, radius))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}