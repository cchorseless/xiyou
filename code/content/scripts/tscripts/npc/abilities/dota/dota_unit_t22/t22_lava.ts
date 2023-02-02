import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { unit_dummy } from "../../../units/common/unit_dummy";


@registerAbility()
export class t22_lava extends BaseAbility_Plus {

    GetAOERadius() {
        return this.GetSpecialValueFor("aoe_radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let duration = this.GetSpecialValueFor("duration")

        // 声音 实测这个声音没有效果
        //  hCaster.EmitSound("RoshanDT.Fireball.Cast")
        //  多重魔火
        // let combination_t22_multi_lava = combination_t22_multi_lava.findIn(hCaster)
        // let has_combination_t22_multi_lava = GameFunc.IsValid(combination_t22_multi_lava) && combination_t22_multi_lava.IsActivated()
        // if (has_combination_t22_multi_lava) {
        //     let chance = combination_t22_multi_lava.GetSpecialValueFor("chance")
        //     if (GameFunc.mathUtil.PRD(chance, hCaster, "t22_lava")) {
        //         modifier_t22_lava_particle_ogre_magi_multicast.apply(hCaster, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

        //         let hThinker = unit_dummy.CreateOne( vPosition, hCaster.GetTeamNumber(), false, hCaster, hCaster)
        //         modifier_t22_lava_thinker.apply(hThinker, hThinker, this, { duration: duration })
        //     }
        // }
        // ,
        let hThinker = unit_dummy.CreateOne(vPosition, hCaster.GetTeamNumber(), false, hCaster, hCaster)
        modifier_t22_lava_thinker.apply(hThinker, hThinker, this, { duration: duration })
    }


    GetIntrinsicModifierName() {
        return "modifier_t22_lava"
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_t22_lava extends BaseModifier_Plus {
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
            let position = AoiHelper.GetAOEMostTargetsPosition(hCaster.GetAbsOrigin(), range, hCaster.GetTeamNumber(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_CLOSEST)
            if (position && position != vec3_invalid && hCaster.IsPositionInRange(position, range)) {
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
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
//  Modifiers
@registerModifier()
export class modifier_t22_lava_thinker extends BaseModifier_Plus {
    duration: number;
    damage_per_second: number;
    damage_interval: number;
    kill_damage_per_second: number;
    aoe_radius: number;
    death_count: number;
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
    IsAura() {
        return true
    }
    GetAuraRadius() {
        return this.aoe_radius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
    }
    GetAura() {
        return "modifier_t22_lava_magic_resistance"
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        this.death_count = 0
        // this.GetAbilityPlus().death_count = this.death_count
        let duration = this.duration
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetParentPlus().GetAbsOrigin()
        if (IsServer()) {
            this.StartIntervalThink(this.damage_interval)
        } else {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/neutral_fx/black_dragon_fireball.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControl(particleID, 0, vPosition)
            ParticleManager.SetParticleControl(particleID, 1, vPosition)
            ParticleManager.SetParticleControl(particleID, 2, Vector(duration, 0, 0))
            ParticleManager.SetParticleControl(particleID, 3, vPosition)
            this.AddParticle(particleID, true, false, -1, false, false)
        }
    }

    OnRefresh(params: IModifierTable) {
        super.OnRefresh(params);
        this.duration = this.GetSpecialValueFor("duration")
        this.kill_damage_per_second = this.GetSpecialValueFor("kill_damage_per_second")
        this.damage_per_second = this.GetSpecialValueFor("damage_per_second")
        this.damage_interval = this.GetSpecialValueFor("damage_interval")
        this.aoe_radius = this.GetSpecialValueFor("aoe_radius")
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            UTIL_Remove(this.GetParentPlus())
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hAbility = this.GetAbilityPlus()
            if (!GameFunc.IsValid(hAbility)) {
                return
            }
            let hCaster = hAbility.GetCasterPlus()
            if (!GameFunc.IsValid(hCaster)) {
                return
            }

            let fDamage = (this.damage_per_second + this.kill_damage_per_second * this.death_count) * this.damage_interval
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), this.aoe_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, FindOrder.FIND_CLOSEST)
            for (let hTarget of (tTargets)) {

                let tDamageTable = {
                    victim: hTarget,
                    attacker: hCaster,
                    damage: fDamage,
                    damage_type: hAbility.GetAbilityDamageType(),
                    ability: hAbility,
                    eom_flags: BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_DOT,
                }
                BattleHelper.GoApplyDamage(tDamageTable)

                //  火焰附体
                // let combination_t22_burning  = combination_t22_burning.findIn(  hCaster )
                // // && combination_t22_burning.Burning != null
                // let has_combination_t22_burning = GameFunc.IsValid(combination_t22_burning) && combination_t22_burning.IsActivated()
                // if (has_combination_t22_burning) {
                //     // combination_t22_burning.Burning(hTarget)
                // }
            }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    OnDeath(params: IModifierTable) {
        if (!GameFunc.IsValid(this.GetAbilityPlus())) {
            return
        }
        if (IsServer() && params.unit.GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
            if (params.unit.IsPositionInRange(this.GetParentPlus().GetAbsOrigin(), this.aoe_radius)) {
                this.death_count = this.death_count + 1
                this.SetStackCount(this.death_count)
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
//  Modifiers
@registerModifier()
export class modifier_t22_lava_magic_resistance extends BaseModifier_Plus {
    incoming_spell_damage: number;
    incoming_spell_damage_kill: number;
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
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    Init(params: IModifierTable) {
        this.incoming_spell_damage = this.GetSpecialValueFor("incoming_spell_damage")
        this.incoming_spell_damage_kill = this.GetSpecialValueFor("incoming_spell_damage_kill")
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        let hCaster = this.GetCasterPlus()
        if (GameFunc.IsValid(hCaster)) {
            let iStackCount = modifier_t22_lava_thinker.GetStackIn(hCaster, hCaster)
            return this.incoming_spell_damage + this.incoming_spell_damage_kill * iStackCount
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_MAGICAL_DAMAGE_PERCENTAGE)
    EOM_GetModifierIncomingMagicalDamagePercentage(params: IModifierTable) {
        return this.On_Tooltip()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_t22_lava_particle_ogre_magi_multicast extends modifier_particle {
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_ogre_magi/ogre_magi_multicast.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControl(iParticleID, 1, Vector(2, 1, 0))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}