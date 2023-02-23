import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_death_prophet_exorcism = { "ID": "5093", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "2", "AbilitySound": "Hero_DeathProphet.Exorcism.Cast", "HasScepterUpgrade": "1", "AbilityCastPoint": "0.5 0.5 0.5", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "145.0", "AbilityDuration": "35", "AbilityManaCost": "250 350 450", "AbilitySpecial": { "10": { "var_type": "FIELD_FLOAT", "ghost_spawn_rate": "0.35" }, "11": { "var_type": "FIELD_INTEGER", "scepter_movespeed_slow": "100", "RequiresScepter": "1" }, "12": { "var_type": "FIELD_FLOAT", "scepter_movespeed_debuff_duration": "0.3", "RequiresScepter": "1" }, "13": { "var_type": "FIELD_INTEGER", "scepter_spirit_life_duration": "20", "RequiresScepter": "1" }, "14": { "var_type": "FIELD_INTEGER", "scepter_spirit_bonus_damage": "50", "RequiresScepter": "1", "CalculateSpellDamageTooltip": "0" }, "15": { "var_type": "FIELD_INTEGER", "movement_bonus": "16 18 20" }, "01": { "var_type": "FIELD_INTEGER", "radius": "700 700 700" }, "02": { "var_type": "FIELD_INTEGER", "spirits": "8 16 24", "LinkedSpecialBonus": "special_bonus_unique_death_prophet" }, "03": { "var_type": "FIELD_INTEGER", "spirit_speed": "525" }, "04": { "var_type": "FIELD_INTEGER", "max_distance": "2000 2000 2000" }, "05": { "var_type": "FIELD_INTEGER", "give_up_distance": "1200 1200 1200" }, "06": { "var_type": "FIELD_INTEGER", "min_damage": "59" }, "07": { "var_type": "FIELD_INTEGER", "max_damage": "64" }, "08": { "var_type": "FIELD_INTEGER", "heal_percent": "25 25 25" }, "09": { "var_type": "FIELD_INTEGER", "average_damage": "61" } } };

@registerAbility()
export class ability6_death_prophet_exorcism extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "death_prophet_exorcism";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_death_prophet_exorcism = Data_death_prophet_exorcism;
    Init() {
        this.SetDefaultSpecialValue("ghost_spawn_rate", 0.25);
        this.SetDefaultSpecialValue("ghost_steal_intellect", 4);
        this.SetDefaultSpecialValue("scepter_movespeed_slow", 100);
        this.SetDefaultSpecialValue("scepter_movespeed_debuff_duration", 0.3);
        this.SetDefaultSpecialValue("scepter_spirit_life_duration", 20);
        this.SetDefaultSpecialValue("scepter_spirit_bonus_damage", 200);
        this.SetDefaultSpecialValue("duration", 15);
        this.SetDefaultSpecialValue("scepter_ghost_steal_intellect", 8);
        this.SetDefaultSpecialValue("shard_max_mana_damage_pct", 10);
        this.SetDefaultSpecialValue("radius", 1000);
        this.SetDefaultSpecialValue("spirits", [9, 12, 15, 18, 21, 24]);
        this.SetDefaultSpecialValue("spirit_speed", 700);
        this.SetDefaultSpecialValue("max_distance", 1500);
        this.SetDefaultSpecialValue("give_up_distance", 1200);
        this.SetDefaultSpecialValue("min_damage", [97, 197, 297, 397, 497, 597]);
        this.SetDefaultSpecialValue("max_damage", [103, 203, 303, 403, 503, 603]);
        this.SetDefaultSpecialValue("damage_per_int", 3);
        this.SetDefaultSpecialValue("average_damage", [100, 200, 300, 400, 500, 600]);

    }


    GetCastRange() {
        let hCaster = this.GetCasterPlus()
        return this.GetSpecialValueFor("radius") + hCaster.GetTalentValue("special_bonus_unique_death_prophet_custom")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration")

        modifier_death_prophet_6_buff.apply(hCaster, hCaster, this, { duration: duration })

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_DeathProphet.Exorcism.Cast", hCaster))
    }
    ScepterSpirit(hTarget: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        let hCaster = this.GetCasterPlus()
        if (!hCaster.HasScepter()) {
            return
        }
        let spirit_speed = this.GetSpecialValueFor("spirit_speed") + hCaster.GetTalentValue("special_bonus_unique_death_prophet_custom_3")
        let min_damage = this.GetSpecialValueFor("min_damage")
        let max_damage = this.GetSpecialValueFor("max_damage")
        let damage_per_int = this.GetSpecialValueFor("damage_per_int") + hCaster.GetTalentValue("special_bonus_unique_death_prophet_custom_2")
        let scepter_movespeed_debuff_duration = this.GetSpecialValueFor("scepter_movespeed_debuff_duration")
        let scepter_spirit_life_duration = this.GetSpecialValueFor("scepter_spirit_life_duration")
        let scepter_spirit_bonus_damage = this.GetSpecialValueFor("scepter_spirit_bonus_damage")
        let shard_max_mana_damage_pct = this.GetSpecialValueFor("shard_max_mana_damage_pct")

        let hModifier = modifier_death_prophet_6.findIn(hCaster)
        if (GameFunc.IsValid(hModifier)) {
            let hGhost = modifier_death_prophet_6_ghost.applyThinker(hCaster.GetAbsOrigin(), hCaster, this, null, hCaster.GetTeamNumber(), false)
            let vForward = RandomVector(1)
            hGhost.SetForwardVector(vForward)

            table.insert(hModifier.tScepterGhosts, hGhost)
            let bReturning = false
            let fEndTime = GameRules.GetGameTime() + scepter_spirit_life_duration
            this.addTimer(0, () => {
                if (!GameFunc.IsValid(hGhost)) {
                    GameFunc.ArrayFunc.ArrayRemove(hModifier.tScepterGhosts, hGhost)
                    return
                }
                if (!GameFunc.IsValid(hTarget)) {
                    if (GameFunc.IsValid(hModifier)) {
                        GameFunc.ArrayFunc.ArrayRemove(hModifier.tScepterGhosts, hGhost)
                    }
                    modifier_death_prophet_6_ghost.remove(hGhost);
                    return
                } else {
                    if (!hTarget.IsAlive()) {
                        hTarget = hCaster
                        bReturning = true
                    }
                }
                if (GameRules.GetGameTime() > fEndTime) {
                    if (GameFunc.IsValid(hModifier)) {
                        GameFunc.ArrayFunc.ArrayRemove(hModifier.tScepterGhosts, hGhost)
                    }
                    modifier_death_prophet_6_ghost.remove(hGhost);
                    return
                }
                let fAngularSpeed = (1 / 9) / (1 / 30) * FrameTime()
                let vTargetPosition = hTarget.GetAbsOrigin()
                let vDirection = (vTargetPosition - hGhost.GetAbsOrigin()) as Vector
                vDirection.z = 0
                vDirection = vDirection.Normalized()

                let vForward = hGhost.GetForwardVector()

                let fAngle = math.acos(GameFunc.mathUtil.Clamp(vDirection.x * vForward.x + vDirection.y * vForward.y, -1, 1))

                fAngularSpeed = math.min(fAngularSpeed, fAngle)

                let vCross = vForward.Cross(vDirection)
                if (vCross.z < 0) {
                    fAngularSpeed = -fAngularSpeed
                }
                vForward = GameFunc.VectorFunctions.Rotation2D(vForward, fAngularSpeed)

                hGhost.SetForwardVector(vForward)

                let vPosition = GetGroundPosition((hGhost.GetAbsOrigin() + hGhost.GetForwardVector() * (spirit_speed * FrameTime()) as Vector), hCaster)
                hGhost.SetAbsOrigin(vPosition)

                if (hGhost.IsPositionInRange(vTargetPosition, 32)) {
                    if (bReturning) {
                        if (GameFunc.IsValid(hModifier)) {
                            GameFunc.ArrayFunc.ArrayRemove(hModifier.tScepterGhosts, hGhost)
                        }
                        modifier_death_prophet_6_ghost.remove(hGhost);
                        return
                    } else {
                        modifier_death_prophet_6_debuff.apply(hTarget, hCaster, this, { duration: scepter_movespeed_debuff_duration * hTarget.GetStatusResistanceFactor(hCaster) })

                        let fDamage = (RandomInt(min_damage, max_damage) + hCaster.GetIntellect() * damage_per_int) * (1 + scepter_spirit_bonus_damage * 0.01)
                        let tDamageTable = {
                            ability: this,
                            attacker: hCaster,
                            victim: hTarget,
                            damage: fDamage,
                            damage_type: this.GetAbilityDamageType()
                        }
                        BattleHelper.GoApplyDamage(tDamageTable)
                        // 魔晶
                        if (hCaster.HasShard()) {
                            let damage_table =
                            {
                                ability: this,
                                attacker: hCaster,
                                victim: hTarget,
                                damage: hCaster.GetMaxMana() * shard_max_mana_damage_pct * 0.01,
                                damage_type: this.GetAbilityDamageType()
                            }
                            BattleHelper.GoApplyDamage(damage_table)
                        }

                        hTarget = hCaster
                        bReturning = true
                    }
                }

                return 0
            }
            )
        }
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_death_prophet_6"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_death_prophet_6 extends BaseModifier_Plus {
    tScepterGhosts: any[];
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
            this.tScepterGhosts = []
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }

    BeDestroy() {

        if (IsServer()) {
            for (let hGhost of (this.tScepterGhosts)) {
                if (GameFunc.IsValid(hGhost)) {
                    modifier_death_prophet_6_ghost.remove(hGhost);
                }
            }
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

            let range = caster.Script_GetAttackRange()
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable(
                    {
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                        AbilityIndex: ability.entindex()
                    }
                )
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    attackLanded(params: IModifierTable) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus()) {
            (this.GetAbilityPlus() as ability6_death_prophet_exorcism).ScepterSpirit(params.target)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_death_prophet_6_buff extends BaseModifier_Plus {
    radius: number;
    spirits: number;
    spirit_speed: number;
    max_distance: number;
    give_up_distance: number;
    min_damage: number;
    max_damage: number;
    damage_per_int: number;
    ghost_spawn_rate: number;
    shard_max_mana_damage_pct: number;
    damage_type: DAMAGE_TYPES;
    sSoundName: string;
    unique_str: string;
    tGhosts: any[];
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
    DestroyOnExpire() {
        return false
    }
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let bonus_radius = hCaster.GetTalentValue("special_bonus_unique_death_prophet_custom")
        let bonus_spirits = hCaster.GetTalentValue("special_bonus_unique_death_prophet_custom_5")
        let bonus_spirit_speed = hCaster.GetTalentValue("special_bonus_unique_death_prophet_custom_3")
        let bonus_damage_per_int = hCaster.GetTalentValue("special_bonus_unique_death_prophet_custom_2")
        this.radius = this.GetSpecialValueFor("radius") + bonus_radius
        this.spirits = this.GetSpecialValueFor("spirits") + bonus_spirits
        this.spirit_speed = this.GetSpecialValueFor("spirit_speed") + bonus_spirit_speed
        this.max_distance = this.GetSpecialValueFor("max_distance")
        this.give_up_distance = this.GetSpecialValueFor("give_up_distance")
        this.min_damage = this.GetSpecialValueFor("min_damage")
        this.max_damage = this.GetSpecialValueFor("max_damage")
        this.damage_per_int = this.GetSpecialValueFor("damage_per_int") + bonus_damage_per_int
        this.ghost_spawn_rate = this.GetSpecialValueFor("ghost_spawn_rate")
        this.shard_max_mana_damage_pct = this.GetSpecialValueFor("shard_max_mana_damage_pct")
        if (IsServer()) {
            let hAbility = this.GetAbilityPlus()
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            this.StartIntervalThink(this.ghost_spawn_rate)
            this.damage_type = hAbility.GetAbilityDamageType()

            this.sSoundName = ResHelper.GetSoundReplacement("Hero_DeathProphet.Exorcism", this.GetCasterPlus())
            hParent.EmitSound(this.sSoundName)

            this.tGhosts = []

            this.unique_str = DoUniqueString("modifier_death_prophet_6_buff")

            hParent.addTimer(0, () => {
                if (!GameFunc.IsValid(this)) {
                    return
                }
                if (!GameFunc.IsValid(hAbility) || !GameFunc.IsValid(hCaster)) {
                    return
                }
                if (this.GetRemainingTime() <= -10) {
                    this.Destroy()
                    return
                }
                let hAttackTarget = hParent.GetAttackTarget()
                let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), this.radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_ALL, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)
                for (let i = this.tGhosts.length - 1; i >= 0; i--) {
                    let hGhost = this.tGhosts[i]

                    if (this.GetRemainingTime() <= 0) {
                        hGhost.bReturning = true
                        hGhost.hTarget = hParent
                    }
                    if (hGhost.bReturning == false) {
                        let hTarget = hGhost.hTarget
                        if (GameFunc.IsValid(hTarget)) {
                            if (!hTarget.IsAlive() || !hParent.IsPositionInRange(hGhost.hUnit.GetAbsOrigin(), this.give_up_distance)) {
                                hTarget = null
                            }
                        }
                        if (!GameFunc.IsValid(hTarget)) {
                            hTarget = hAttackTarget
                            if (!GameFunc.IsValid(hTarget)) {
                                hTarget = GameFunc.ArrayFunc.RandomArray(tTargets)
                            }
                        }
                        hGhost.hTarget = hTarget
                        if (!GameFunc.IsValid(hGhost.hTarget)) {
                            if (hGhost.vTargetPosition == null) {
                                hGhost.vTargetPosition = hParent.GetAbsOrigin() + RandomVector(1) * RandomFloat(0, this.radius)
                            }
                        } else {
                            hGhost.vTargetPosition = null
                        }
                    }

                    if (!hParent.IsPositionInRange(hGhost.hUnit.GetAbsOrigin(), this.max_distance)) {
                        hGhost.hUnit.SetAbsOrigin(hParent.GetAbsOrigin())
                    }

                    let fAngularSpeed = this.GetRemainingTime() <= 0 && (1 / (1 / 30) * FrameTime()) || ((1 / 9) / (1 / 30) * FrameTime())
                    let vTargetPosition = GameFunc.IsValid(hGhost.hTarget) && hGhost.hTarget.GetAbsOrigin() || hGhost.vTargetPosition
                    let vDirection = (vTargetPosition - hGhost.hUnit.GetAbsOrigin()) as Vector
                    vDirection.z = 0
                    vDirection = vDirection.Normalized()

                    let vForward = hGhost.hUnit.GetForwardVector()

                    let fAngle = math.acos(GameFunc.mathUtil.Clamp(vDirection.x * vForward.x + vDirection.y * vForward.y, -1, 1))

                    fAngularSpeed = math.min(fAngularSpeed, fAngle)

                    let vCross = vForward.Cross(vDirection)
                    if (vCross.z < 0) {
                        fAngularSpeed = -fAngularSpeed
                    }
                    vForward = GameFunc.VectorFunctions.Rotation2D(vForward, fAngularSpeed)

                    hGhost.hUnit.SetForwardVector(vForward)

                    let vPosition = GetGroundPosition(hGhost.hUnit.GetAbsOrigin() + hGhost.hUnit.GetForwardVector() * (this.spirit_speed * FrameTime()), hParent)
                    hGhost.hUnit.SetAbsOrigin(vPosition)

                    if (hGhost.hUnit.IsPositionInRange(vTargetPosition, 32)) {
                        if (hGhost.hTarget != null) {
                            if (hGhost.bReturning) {
                                hGhost.hTarget = null
                                hGhost.bReturning = false
                                if (this.GetRemainingTime() <= 0) {
                                    modifier_death_prophet_6_ghost.remove(hGhost.hUnit);
                                    table.remove(this.tGhosts, i)
                                    if (this.tGhosts.length == 0) {
                                        this.Destroy()
                                        return
                                    }
                                }
                            } else {
                                let tDamageTable = {
                                    ability: hAbility,
                                    attacker: hCaster,
                                    victim: hGhost.hTarget,
                                    damage: RandomInt(this.min_damage, this.max_damage) + hCaster.GetIntellect() * this.damage_per_int,
                                    damage_type: this.damage_type
                                }
                                BattleHelper.GoApplyDamage(tDamageTable)
                                // 魔晶
                                if (hCaster.HasShard()) {
                                    let damage_table =
                                    {
                                        ability: hAbility,
                                        attacker: hCaster,
                                        victim: hGhost.hTarget,
                                        damage: hCaster.GetMaxMana() * this.shard_max_mana_damage_pct * 0.01,
                                        damage_type: hAbility.GetAbilityDamageType()
                                    }
                                    BattleHelper.GoApplyDamage(damage_table)
                                }

                                modifier_death_prophet_6_intellect_buff.apply(hParent, hParent, hAbility, { unique_str: this.unique_str })

                                hGhost.hTarget = hParent
                                hGhost.bReturning = true
                            }
                        } else {
                            hGhost.vTargetPosition = hParent.GetAbsOrigin() + RandomVector(1) * RandomFloat(0, this.radius)
                        }
                    }
                }
                return 0
            }
            )
        }
    }
    BeDestroy() {

        if (IsServer()) {
            let hParent = this.GetParentPlus()
            if (GameFunc.IsValid(hParent)) {
                hParent.StopSound(this.sSoundName)
                let modifier_intellect = modifier_death_prophet_6_intellect_buff.findIn(hParent)
                // if (GameFunc.IsValid(modifier_intellect) && modifier_intellect.ClearCount) {
                //     modifier_intellect.ClearCount(this.unique_str)
                // }
            }

            for (let hGhost of (this.tGhosts)) {
                if (GameFunc.IsValid(hGhost.hUnit)) {
                    modifier_death_prophet_6_ghost.remove(hGhost.hUnit);
                }
            }
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hAbility = this.GetAbilityPlus()
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()

            if (!GameFunc.IsValid(hAbility) || !GameFunc.IsValid(hCaster)) {
                this.Destroy()
                return
            }

            if ((this.tGhosts.length) < this.spirits) {
                let vPosition = hCaster.GetAbsOrigin()
                let vForward = RandomVector(1)
                let hGhost: any = {
                    hUnit: modifier_death_prophet_6_ghost.applyThinker(vPosition, hCaster, hAbility, null, hCaster.GetTeamNumber(), false),
                    vTargetPosition: null,
                    hTarget: null,
                    bReturning: false
                }
                hGhost.hUnit.SetForwardVector(vForward)
                table.insert(this.tGhosts, hGhost)
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_death_prophet_6_ghost extends BaseModifier_Plus {
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

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            this.GetParentPlus().SetModelScale(0.9)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_death_prophet/death_prophet_spirit_glow.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    BeDestroy() {

        if (IsServer()) {
            this.GetParentPlus().ForceKill(false)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE)
    GetModelChange(params: IModifierTable) {
        return ResHelper.GetModelReplacement("models/heroes/death_prophet/death_prophet_ghost.vmdl", this.GetCasterPlus())
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_RUN
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_death_prophet_6_debuff extends BaseModifier_Plus {
    scepter_movespeed_slow: any;
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
        this.scepter_movespeed_slow = this.GetSpecialValueFor("scepter_movespeed_slow")
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(params: IModifierTable) {
        return -this.scepter_movespeed_slow
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_death_prophet_6_intellect_buff// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_death_prophet_6_intellect_buff extends BaseModifier_Plus {
    ghost_steal_intellect: number;
    scepter_ghost_steal_intellect: number;
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
        return true
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    BeCreated(params: IModifierTable) {

        this.ghost_steal_intellect = this.GetSpecialValueFor("ghost_steal_intellect")
        this.scepter_ghost_steal_intellect = this.GetSpecialValueFor("scepter_ghost_steal_intellect")
        if (IsServer()) {
            let ghost_steal_intellect = this.GetParentPlus().HasScepter() && this.scepter_ghost_steal_intellect || this.ghost_steal_intellect
            this.changeStackCount(ghost_steal_intellect)
            this.addTimer(params.duration, () => {
                this.changeStackCount(-ghost_steal_intellect)
            })
        }
    }



    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect() {
        return this.GetStackCount()
    }
}
