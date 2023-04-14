import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_shredder_chakram = { "ID": "5527", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityUnitDamageType": "DAMAGE_TYPE_PURE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_Shredder.Chakram.Cast", "HasScepterUpgrade": "1", "AbilityDraftUltScepterAbility": "shredder_chakram_2", "AbilityDraftUltShardAbility": "shredder_flamethrower", "AbilityCastRange": "1200 1200 1200", "AbilityCastPoint": "0.15", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "8.0 8.0 8.0", "AbilityManaCost": "80 140 200", "AbilitySpecial": { "10": { "var_type": "FIELD_INTEGER", "slow_health_percentage": "5" }, "11": { "var_type": "FIELD_FLOAT", "castpoint_scepter": "0.1", "RequiresScepter": "1" }, "01": { "var_type": "FIELD_FLOAT", "speed": "900.0" }, "02": { "var_type": "FIELD_INTEGER", "radius": "200" }, "03": { "var_type": "FIELD_INTEGER", "pass_damage": "100 140 180" }, "04": { "var_type": "FIELD_INTEGER", "damage_per_second": "50 75 100" }, "05": { "var_type": "FIELD_INTEGER", "slow": "5" }, "06": { "var_type": "FIELD_FLOAT", "damage_interval": "0.5" }, "07": { "var_type": "FIELD_FLOAT", "break_distance": "2000.0" }, "08": { "var_type": "FIELD_FLOAT", "mana_per_second": "16 23 30" }, "09": { "var_type": "FIELD_FLOAT", "pass_slow_duration": "0.5" } } };

@registerAbility()
export class ability6_shredder_chakram extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "shredder_chakram";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_shredder_chakram = Data_shredder_chakram;
    Init() {
        this.SetDefaultSpecialValue("speed", 1500);
        this.SetDefaultSpecialValue("radius", 200);
        this.SetDefaultSpecialValue("pass_damage", [700, 1000, 1300, 1600, 2000, 2400]);
        this.SetDefaultSpecialValue("damage_per_second", [350, 500, 650, 800, 1000, 1200]);
        this.SetDefaultSpecialValue("slow", 5);
        this.SetDefaultSpecialValue("damage_interval", 0.5);
        this.SetDefaultSpecialValue("duration", 7);
        this.SetDefaultSpecialValue("pass_slow_duration", 0.5);

    }

    Init_old() {
        this.SetDefaultSpecialValue("speed", 1500);
        this.SetDefaultSpecialValue("radius", 200);
        this.SetDefaultSpecialValue("pass_damage", [700, 1000, 1300, 1600, 2000, 2400]);
        this.SetDefaultSpecialValue("damage_per_second", [350, 500, 650, 800, 1000, 1200]);
        this.SetDefaultSpecialValue("slow", 5);
        this.SetDefaultSpecialValue("damage_interval", 0.5);
        this.SetDefaultSpecialValue("duration", 7);
        this.SetDefaultSpecialValue("pass_slow_duration", 0.5);

    }

    tHashtableIndexes: any[];


    GetAOERadius() {
        let hCaster = this.GetCasterPlus()
        let extra_radius = hCaster.GetTalentValue("special_bonus_unique_shredder_custom_2")
        return this.GetSpecialValueFor("radius") + extra_radius
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vTargetPosition = this.GetCursorPosition()
        let speed = this.GetSpecialValueFor("speed")

        let extra_radius = hCaster.GetTalentValue("special_bonus_unique_shredder_custom_2")
        let radius = this.GetSpecialValueFor("radius") + extra_radius

        let vStartPosition = hCaster.GetAttachmentOrigin(hCaster.ScriptLookupAttachment("attach_saw"))
        let vDirection = (vTargetPosition - vStartPosition) as Vector
        vDirection.z = 0

        let iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_shredder/shredder_chakram.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            owner: null
        });

        ParticleManager.SetParticleControl(iParticleID, 0, vStartPosition)
        ParticleManager.SetParticleControl(iParticleID, 1, (vDirection.Normalized() * speed) as Vector)
        ParticleManager.SetParticleControl(iParticleID, 14, Vector(radius, 1, 1))
        ParticleManager.SetParticleControl(iParticleID, 15, Vector(0, 0, 0))
        ParticleManager.SetParticleControl(iParticleID, 16, Vector(0, 0, 0))

        let hModifier = modifier_shredder_6.findIn(hCaster)
        if (IsValid(hModifier)) {
            hModifier.AddParticle(iParticleID, false, false, -1, false, false)
            // hModifier.hPtclThinker = hPtclThinker
        }

        let tHashtable = HashTableHelper.CreateHashtable()
        this.tHashtableIndexes = this.tHashtableIndexes || []
        table.insert(this.tHashtableIndexes, HashTableHelper.GetHashtableIndex(tHashtable))
        tHashtable.vChakramPosition = vStartPosition
        tHashtable.iParticleID = iParticleID
        let tInfo = {
            Ability: this,
            Source: hCaster,
            EffectName: "",
            vSpawnOrigin: vStartPosition,
            vVelocity: (vDirection.Normalized() * speed) as Vector,
            fDistance: vDirection.Length2D(),
            fStartRadius: radius,
            fEndRadius: radius,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            ExtraData: {
                iHashtableIndex: HashTableHelper.GetHashtableIndex(tHashtable),
            }
        }
        ProjectileManager.CreateLinearProjectile(tInfo)

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Shredder.Chakram.Cast", hCaster))
    }
    OnProjectileThink_ExtraData(vLocation: Vector, ExtraData: any) {
        if (ExtraData.iHashtableIndex == null) {
            return
        }
        let hCaster = this.GetCasterPlus()
        let tHashtable = HashTableHelper.GetHashtableByIndex(ExtraData.iHashtableIndex)

        tHashtable.vChakramPosition = vLocation

        if (tHashtable.bIsReturn) {
            let pass_slow_duration = this.GetSpecialValueFor("pass_slow_duration")
            let pass_damage = this.GetSpecialValueFor("pass_damage")
            let extra_radius = hCaster.GetTalentValue("special_bonus_unique_shredder_custom_2")
            let radius = this.GetSpecialValueFor("radius") + extra_radius

            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vLocation, radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
            for (let hTarget of (tTargets)) {
                if (tHashtable.tTargets == null || tHashtable.tTargets.indexOf(hTarget) == null) {
                    EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Shredder.Chakram.Target", hCaster), hCaster)

                    modifier_shredder_6_slow.apply(hTarget, hCaster, this, { duration: pass_slow_duration * hTarget.GetStatusResistanceFactor(hCaster) })

                    let tDamageTable = {
                        victim: hTarget,
                        attacker: hCaster,
                        damage: pass_damage,
                        damage_type: this.GetAbilityDamageType(),
                        ability: this,
                    }
                    BattleHelper.GoApplyDamage(tDamageTable)
                }
            }
            tHashtable.tTargets = tTargets
        }
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        if (ExtraData.iHashtableIndex == null) {
            return
        }
        let hCaster = this.GetCasterPlus()
        let tHashtable = HashTableHelper.GetHashtableByIndex(ExtraData.iHashtableIndex)

        if (tHashtable.bIsReturn) {
            if (tHashtable.iParticleID != null) {
                ParticleManager.DestroyParticle(tHashtable.iParticleID, false)
            }
            HashTableHelper.RemoveHashtable(tHashtable)
            GameFunc.ArrayFunc.ArrayRemove(this.tHashtableIndexes, ExtraData.iHashtableIndex)
        } else {
            if (hTarget != null) {
                let pass_slow_duration = this.GetSpecialValueFor("pass_slow_duration")
                let pass_damage = this.GetSpecialValueFor("pass_damage")

                EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Shredder.Chakram.Target", hCaster), hCaster)

                modifier_shredder_6_slow.apply(hTarget, hCaster, this, { duration: pass_slow_duration * hTarget.GetStatusResistanceFactor(hCaster) })

                let tDamageTable = {
                    victim: hTarget,
                    attacker: hCaster,
                    damage: pass_damage,
                    damage_type: this.GetAbilityDamageType(),
                    ability: this,
                }
                BattleHelper.GoApplyDamage(tDamageTable)

                return false
            }

            if (tHashtable.iParticleID != null) {
                ParticleManager.DestroyParticle(tHashtable.iParticleID, false)
            }

            let sTalentName = "special_bonus_unique_shredder_custom_4"
            let duration = this.GetSpecialValueFor("duration") + hCaster.GetTalentValue(sTalentName)

            let hChakram = modifier_shredder_6_thinker.applyThinker(vLocation, hCaster, this, { duration: duration, iHashtableIndex: ExtraData.iHashtableIndex }, hCaster.GetTeamNumber(), false)
        }

        return true
    }
    ChakramReturn(tHashtable: any) {
        let hCaster = this.GetCasterPlus()

        let vTargetPosition = hCaster.GetAbsOrigin()
        let speed = this.GetSpecialValueFor("speed")
        let extra_radius = hCaster.GetTalentValue("special_bonus_unique_shredder_custom_2")
        let radius = this.GetSpecialValueFor("radius") + extra_radius

        let vStartPosition = tHashtable.vChakramPosition
        let vDirection = (vTargetPosition - vStartPosition) as Vector
        vDirection.z = 0

        EmitSoundOnLocationWithCaster(tHashtable.vChakramPosition, ResHelper.GetSoundReplacement("Hero_Shredder.Chakram.Return", hCaster), hCaster)

        let iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_shredder/shredder_chakram_return.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            owner: null
        });

        ParticleManager.SetParticleControl(iParticleID, 0, vStartPosition)
        ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_saw", hCaster.GetAbsOrigin(), true)
        ParticleManager.SetParticleControl(iParticleID, 2, Vector(speed, 0, 0))
        ParticleManager.SetParticleControl(iParticleID, 14, Vector(radius, 1, 1))
        ParticleManager.SetParticleControl(iParticleID, 15, Vector(0, 0, 0))
        ParticleManager.SetParticleControl(iParticleID, 16, Vector(0, 0, 0))

        let hModifier = modifier_shredder_6.findIn(hCaster)
        if (IsValid(hModifier)) {
            hModifier.AddParticle(iParticleID, false, false, -1, false, false)
        }

        tHashtable.iParticleID = iParticleID
        tHashtable.bIsReturn = true

        let tInfo = {
            Ability: this,
            Target: hCaster,
            iMoveSpeed: speed,
            vSourceLoc: vStartPosition,
            EffectName: "",
            ExtraData: {
                iHashtableIndex: HashTableHelper.GetHashtableIndex(tHashtable),
            },
        }
        ProjectileManager.CreateTrackingProjectile(tInfo)
    }

    GetIntrinsicModifierName() {
        return "modifier_shredder_6"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_shredder_6 extends BaseModifier_Plus {
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

            let position = AoiHelper.GetAOEMostTargetsPosition(caster.GetAbsOrigin(),
                range,
                caster.GetTeamNumber(),
                radius,
                null,
                DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS,
                FindOrder.FIND_CLOSEST)

            //  施法命令
            if (position && position != vec3_invalid && caster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: position,
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_shredder_6_thinker extends BaseModifier_Plus {
    sSoundName: string;
    radius: number;
    damage_per_second: number;
    dps_per_str: number;
    damage_interval: number;
    pass_slow_duration: number;
    iHashtableIndex: any;
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
        let extra_radius = hCaster.HasTalent("special_bonus_unique_shredder_custom_2") && hCaster.GetTalentValue("special_bonus_unique_shredder_custom_2") || 0
        let extra_dps_per_str = hCaster.HasTalent("special_bonus_unique_shredder_custom_6") && hCaster.GetTalentValue("special_bonus_unique_shredder_custom_6") || 0
        this.radius = this.GetSpecialValueFor("radius") + extra_radius
        this.damage_per_second = this.GetSpecialValueFor("damage_per_second")
        this.dps_per_str = this.GetSpecialValueFor("dps_per_str") + extra_dps_per_str
        this.damage_interval = this.GetSpecialValueFor("damage_interval")
        this.pass_slow_duration = this.GetSpecialValueFor("pass_slow_duration")
        if (IsServer()) {
            this.StartIntervalThink(this.damage_interval)
            this.sSoundName = ResHelper.GetSoundReplacement("Hero_Shredder.Chakram", hCaster)
            hParent.EmitSound(this.sSoundName)
            hParent.SetAbsOrigin(GetGroundPosition(hParent.GetAbsOrigin(), hCaster))
            this.iHashtableIndex = params.iHashtableIndex
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_shredder/shredder_chakram_stay.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 14, Vector(this.radius, 1, 1))
            ParticleManager.SetParticleControl(iParticleID, 15, Vector(0, 0, 0))
            ParticleManager.SetParticleControl(iParticleID, 16, Vector(0, 0, 0))
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    BeDestroy() {

        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus() as ability6_shredder_chakram
            hParent.StopSound(this.sSoundName)
            UTIL_Remove(hParent)
            if (!IsValid(hCaster) || !IsValid(hAbility)) {
                HashTableHelper.RemoveHashtable(this.iHashtableIndex)
                return
            }
            if (hAbility && hAbility.ChakramReturn) {
                hAbility.ChakramReturn(HashTableHelper.GetHashtableByIndex(this.iHashtableIndex))
            }
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            if (!IsValid(hCaster) || !IsValid(hAbility)) {
                this.Destroy()
                return
            }
            let iStrength = 0
            if (hCaster.GetStrength) {
                iStrength = hCaster.GetStrength()
            }
            let fDamage = (this.damage_per_second + this.dps_per_str * iStrength) * this.damage_interval
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), this.radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
            for (let hTarget of (tTargets)) {

                modifier_shredder_6_slow.apply(hTarget, hCaster, hAbility, { duration: this.pass_slow_duration * hTarget.GetStatusResistanceFactor(hCaster) })

                let tDamageTable = {
                    victim: hTarget,
                    attacker: hCaster,
                    damage: fDamage,
                    damage_type: hAbility.GetAbilityDamageType(),
                    ability: hAbility,
                }
                BattleHelper.GoApplyDamage(tDamageTable)
            }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_NO_TEAM_MOVE_TO]: true,
            [modifierstate.MODIFIER_STATE_NO_TEAM_SELECT]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_shredder_6_slow extends BaseModifier_Plus {
    slow: number;
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
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.slow = this.GetSpecialValueFor("slow")
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_shredder/shredder_chakram_hit.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
    BeRefresh(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.slow = this.GetSpecialValueFor("slow")
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_shredder/shredder_chakram_hit.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(params: IModifierTable) {
        return -math.ceil((100 - this.GetParentPlus().GetHealthPercent()) / this.slow) * this.slow
    }
}
