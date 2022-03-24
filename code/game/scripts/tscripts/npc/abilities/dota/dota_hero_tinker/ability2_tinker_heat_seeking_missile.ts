import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";
import { modifier_particle } from "../../../modifier/modifier_particle";

/** dota原技能数据 */
export const Data_tinker_heat_seeking_missile = { "ID": "5151", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE | DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO", "FightRecapLevel": "1", "AbilitySound": "Hero_Tinker.Heat-Seeking_Missile", "AbilityCastPoint": "0 0 0 0", "AbilityCooldown": "18", "AbilityManaCost": "80 95 110 125", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "damage": "125 200 275 350" }, "02": { "var_type": "FIELD_INTEGER", "radius": "2500 2500 2500 2500" }, "03": { "var_type": "FIELD_INTEGER", "targets": "2 2 2 2", "LinkedSpecialBonus": "special_bonus_unique_tinker_6" }, "04": { "var_type": "FIELD_INTEGER", "speed": "700" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_tinker_heat_seeking_missile extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "tinker_heat_seeking_missile";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_tinker_heat_seeking_missile = Data_tinker_heat_seeking_missile;
    Init() {
                this.SetDefaultSpecialValue("cooldown_tooltip", [10,9,8,7,6,5]);
        this.SetDefaultSpecialValue("damage", [500,800,1600,2400,3200,4000]);
        this.SetDefaultSpecialValue("radius", 1500);
        this.SetDefaultSpecialValue("targets", 4);
        this.SetDefaultSpecialValue("speed", 700);
        this.SetDefaultSpecialValue("duration", 3);

        }

    Init_old() {
                this.SetDefaultSpecialValue("cooldown_tooltip", [10,9,8,7,6,5]);
        this.SetDefaultSpecialValue("damage", [500,800,1600,2400,3200,4000]);
        this.SetDefaultSpecialValue("radius", 1500);
        this.SetDefaultSpecialValue("targets", 4);
        this.SetDefaultSpecialValue("speed", 700);
        this.SetDefaultSpecialValue("targets_scepter", 8);

        }



    GetCastRange(vLocation: Vector, hTarget: BaseNpc_Plus) {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let radius = this.GetSpecialValueFor("radius")
        let targets = hCaster.HasScepter() && this.GetSpecialValueFor("targets_scepter") || this.GetSpecialValueFor("targets")
        let speed = this.GetSpecialValueFor("speed")
        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
        let n = 0
        for (let hTarget of (tTargets)) {
            let tHashtable = HashTableHelper.CreateHashtable()
            tHashtable.hModifier = modifier_tinker_2_projectile.apply(hCaster, hTarget, this, null)
            let tInfo = {
                Ability: this,
                Target: hTarget,
                iMoveSpeed: speed,
                vSourceLoc: hCaster.GetAttachmentOrigin(hCaster.ScriptLookupAttachment("attach_attack3")),
                EffectName: "",
                ExtraData: {
                    hashtable_index: tHashtable.__hashuuid__
                }
            }
            n += 1
            ProjectileManager.CreateTrackingProjectile(tInfo)
            if (n >= targets) {
                break
            }
        }
        if (hCaster.HasScepter()) {
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
            for (let hTarget of (tTargets)) {
                if (hTarget.GetPlayerOwnerID() == hCaster.GetPlayerOwnerID() && hTarget.GetUnitLabel() == "HERO") {
                    let tHashtable = HashTableHelper.CreateHashtable()
                    tHashtable.hModifier = modifier_tinker_2_projectile.apply(hCaster, hTarget, this, null)
                    let tInfo = {
                        Ability: this,
                        Target: hTarget,
                        iMoveSpeed: speed,
                        vSourceLoc: hCaster.GetAttachmentOrigin(hCaster.ScriptLookupAttachment("attach_attack3")),
                        EffectName: "",
                        ExtraData: {
                            hashtable_index: tHashtable.__hashuuid__
                        }
                    }
                    ProjectileManager.CreateTrackingProjectile(tInfo)
                }
            }
        }
        if (tTargets.length > 0) {
            hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Tinker.Heat-Seeking_Missile", hCaster))
        } else {
            modifier_tinker_2_particle_dud.apply(hCaster, hCaster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
        }
    }
    OnProjectileHit_ExtraData(hTarget: BaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        if (hTarget != null) {
            let hCaster = this.GetCasterPlus()
            let damage = this.GetSpecialValueFor("damage")
            let duration = this.GetSpecialValueFor("duration")
            let tDamageTable = {
                ability: this,
                attacker: hCaster,
                victim: hTarget,
                damage: damage + hCaster.GetIntellect() * hCaster.GetTalentValue("special_bonus_unique_tinker_custom_5"),
                damage_type: this.GetAbilityDamageType()
            }
            if (hTarget.GetTeamNumber() != hCaster.GetTeamNumber()) {
                if (!hTarget.TriggerSpellAbsorb(this)) {
                    BattleHelper.GoApplyDamage(tDamageTable)
                    let sTalentName = "special_bonus_unique_tinker_custom_4"
                    if (hCaster.HasTalent(sTalentName)) {
                        modifier_stunned.apply(hTarget, hCaster, this, { duration: hCaster.GetTalentValue(sTalentName) })
                    }
                }
            } else {
                modifier_tinker_2_buff.apply(hTarget, hCaster, this, { duration: duration })
            }

            modifier_tinker_2_particle_hit.apply(hCaster, hTarget, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
        }
        if (ExtraData && ExtraData.hashtable_index != null) {
            let tHashtable = HashTableHelper.GetHashtableByIndex(ExtraData.hashtable_index || -1)
            if (tHashtable != null && GameFunc.IsValid(tHashtable.hModifier)) {
                tHashtable.hModifier.Destroy()
            }
        }
        return true
    }

    GetIntrinsicModifierName() {
        return "modifier_tinker_2"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_tinker_2 extends BaseModifier_Plus {
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
            this.StartIntervalThink(0)
        }
    }


    OnIntervalThink() {
        if (IsServer()) {
            let hAbility = this.GetAbilityPlus()
            if (!GameFunc.IsValid(hAbility)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }
            let hCaster = hAbility.GetCasterPlus()

            if (!hAbility.GetAutoCastState()) {
                return
            }
            if (hCaster.IsTempestDouble() || hCaster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }

            if (!hAbility.IsAbilityReady()) {
                return
            }
            let fRange = this.GetSpecialValueFor("radius")
            let iTeamFilter = hCaster.HasScepter() && DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH || DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let iTypeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let iFlagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let iOrder = FindOrder.FIND_CLOSEST
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), fRange, null, iTeamFilter, iTypeFilter, iFlagFilter, iOrder)
            if (tTargets[0] != null) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: hAbility.entindex(),
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_tinker_2_buff extends BaseModifier_Plus {
    damage: number;
    damage_per_int: number;
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
    Init(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        this.damage = this.GetSpecialValueFor("damage")
        this.damage_per_int = this.GetSpecialValueFor("damage_per_int") + (GameFunc.IsValid(hCaster) && hCaster.GetTalentValue("special_bonus_unique_tinker_custom_5") || 0)
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OUTGOING_MAGICAL_DAMAGE_CONSTANT)
    EOM_GetModifierOutgoingMagicalDamageConstant() {
        let hCaster = this.GetCasterPlus()
        if (GameFunc.IsValid(hCaster)) {
            return this.damage + hCaster.GetIntellect() * this.damage_per_int
        }
        return 0
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP2)

    On_Tooltip2() {
        let hCaster = this.GetCasterPlus()
        if (GameFunc.IsValid(hCaster)) {
            return this.damage + hCaster.GetIntellect() * this.damage_per_int
        }
        return 0
    }
}
//  Particle
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_tinker_2_projectile extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let speed = this.GetSpecialValueFor("speed")
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_tinker/tinker_missile.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack3", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(speed, 0, 0))
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_tinker_2_particle_dud extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        if (IsServer()) {
            hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Tinker.Heat-Seeking_Missile_Dud", hCaster))
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_tinker/tinker_missile_dud.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT, "attach_attack3", hCaster.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_tinker_2_particle_hit extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetParentPlus()
        let hParent = this.GetCasterPlus()
        if (IsServer()) {
            EmitSoundOnLocationWithCaster(hParent.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Tinker.Heat-Seeking_Missile.Impact", hCaster), hCaster)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_tinker/tinker_missle_explosion.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
