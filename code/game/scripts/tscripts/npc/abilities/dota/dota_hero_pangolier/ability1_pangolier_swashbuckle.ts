
import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionBoth_Plus, BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { ability2_pangolier_shield_crash } from "./ability2_pangolier_shield_crash";
import { modifier_pangolier_6_rolling } from "./ability6_pangolier_gyroshell";

/** dota原技能数据 */
export const Data_pangolier_swashbuckle = { "ID": "6344", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_MOVEMENT | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES | DOTA_ABILITY_BEHAVIOR_VECTOR_TARGETING", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "AbilityCastPoint": "0.0", "AbilityCastRange": "850", "AbilityCooldown": "20 16 12 8", "AbilityManaCost": "80 90 100 110", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "dash_range": "850" }, "02": { "var_type": "FIELD_INTEGER", "range": "1000", "LinkedSpecialBonus": "special_bonus_unique_pangolier_7" }, "05": { "var_type": "FIELD_INTEGER", "damage": "24 42 60 78", "LinkedSpecialBonus": "special_bonus_unique_pangolier_3", "CalculateSpellDamageTooltip": "0" }, "03": { "var_type": "FIELD_INTEGER", "dash_speed": "2000" }, "04": { "var_type": "FIELD_FLOAT", "attack_interval": "0.1 0.1 0.1 0.1" }, "06": { "var_type": "FIELD_INTEGER", "start_radius": "125" }, "07": { "var_type": "FIELD_INTEGER", "end_radius": "125" }, "08": { "var_type": "FIELD_INTEGER", "strikes": "4" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_pangolier_swashbuckle extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "pangolier_swashbuckle";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_pangolier_swashbuckle = Data_pangolier_swashbuckle;
    Init() {
        this.SetDefaultSpecialValue("chance", 17);
        this.SetDefaultSpecialValue("slow", [12, 18, 24, 30, 36, 42]);
        this.SetDefaultSpecialValue("armor", [3, 4, 5, 6, 7, 8]);
        this.SetDefaultSpecialValue("duration", 2);
        this.SetDefaultSpecialValue("attack_damage_pct", [50, 55, 60, 70, 90, 120]);
        this.SetDefaultSpecialValue("dash_range", 1000);
        this.SetDefaultSpecialValue("range", 900);
        this.SetDefaultSpecialValue("damage", [78, 234, 390, 546, 702, 858]);
        this.SetDefaultSpecialValue("dash_speed", 2000);
        this.SetDefaultSpecialValue("attack_interval", 0.1);
        this.SetDefaultSpecialValue("width", 125);
        this.SetDefaultSpecialValue("strikes", 4);
        this.SetDefaultSpecialValue("jump_height", 250);
        this.SetDefaultSpecialValue("jump_duration", 0.4);

    }

    Init_old() {
        this.SetDefaultSpecialValue("width", 125);
        this.SetDefaultSpecialValue("strikes", 4);
        this.SetDefaultSpecialValue("jump_height", 250);
        this.SetDefaultSpecialValue("jump_duration", 0.4);
        this.SetDefaultSpecialValue("chance", 17);
        this.SetDefaultSpecialValue("slow", [12, 18, 24, 30, 36, 42]);
        this.SetDefaultSpecialValue("armor", [3, 4, 5, 6, 7, 8]);
        this.SetDefaultSpecialValue("duration", 2);
        this.SetDefaultSpecialValue("dash_range", 1000);
        this.SetDefaultSpecialValue("range", 900);
        this.SetDefaultSpecialValue("damage", [78, 234, 390, 546, 702, 858]);
        this.SetDefaultSpecialValue("dash_speed", 2000);
        this.SetDefaultSpecialValue("attack_interval", 0.1);

    }

    vCasterLoc: Vector;
    vDirection: Vector;
    vTargetPosition: Vector;

    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        return super.GetCooldown(iLevel) - hCaster.GetTalentValue("special_bonus_unique_pangolier_custom_7")
    }
    GetBehavior() {
        return modifier_pangolier_6_rolling.exist(this.GetCasterPlus()) && DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_DONT_RESUME_MOVEMENT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST || DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_DONT_RESUME_MOVEMENT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        if (modifier_pangolier_6_rolling.exist(hCaster)) {
            let iRange = this.GetSpecialValueFor("range")
            let strikes = this.GetSpecialValueFor("strikes")
            let vDirection = hCaster.GetForwardVector()
            let teamFilter = this.GetAbilityTargetTeam()
            let typeFilter = this.GetAbilityTargetType()
            let flagFilter = this.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), iRange, null, teamFilter, typeFilter, flagFilter, order)
            for (let hUnit of (targets)) {
                if (hUnit != null) {
                    vDirection = ((hUnit.GetAbsOrigin() - hCaster.GetAbsOrigin()) as Vector).Normalized()
                    break
                }
            }

            let direction_count = hCaster.HasTalent("special_bonus_unique_pangolier_custom_3") && 4 || 1
            for (let i = 1; i <= direction_count; i++) {
                let vPosition = GameFunc.VectorFunctions.Rotation2D(vDirection, math.rad(i * 90 - 90)) * iRange + hCaster.GetAbsOrigin()
                this.Swashbuckle(hCaster.GetAbsOrigin(), vPosition as Vector, strikes)
            }

            undefined

            return
        }

        if (!GameFunc.IsValid(hTarget)) {
            return
        }
        // this.vCasterLoc = GetGroundPosition(hCaster.GetBuilding == null && hCaster.GetAbsOrigin() || hCaster.GetBuilding().GetLocation(), hCaster)
        // this.vDirection = (-hTarget.GetForwardVector()) as Vector
        // let hLastCorner = Entities.FindByName(null, hTarget.Spawner_lastCornerName)
        // let hNextCorner = Entities.FindByName(null, hTarget.Spawner_targetCornerName)
        // let fOffsetDistance = hTarget.GetMoveSpeedModifier(hTarget.GetBaseMoveSpeed(), false)
        // let fNextCornerDistance = 500
        // if (hLastCorner && hNextCorner) {
        //     this.vDirection = (hLastCorner.GetAbsOrigin() - hNextCorner.GetAbsOrigin()) as Vector
        //     this.vDirection.z = 0
        //     fNextCornerDistance = ((hNextCorner.GetAbsOrigin() - GetGroundPosition(hTarget.GetAbsOrigin(), hTarget)) as Vector).Length2D()
        // }
        // fOffsetDistance = fOffsetDistance > fNextCornerDistance && fNextCornerDistance || fOffsetDistance
        // this.vTargetPosition = (GetGroundPosition(hTarget.GetAbsOrigin(), hTarget) - this.vDirection.Normalized() * fOffsetDistance) as Vector
        // let dash_speed = this.GetSpecialValueFor("dash_speed")
        // let duration = ((this.vTargetPosition - this.vCasterLoc) as Vector).Length2D() / dash_speed
        // hCaster.SetForwardVector(((this.vTargetPosition - this.vCasterLoc) as Vector).Normalized())
        //  modifier_pangolier_1_dash.apply( hCaster , hCaster, this, { duration: duration })
        //  modifier_pangolier_1_stun.apply( hCaster , hCaster, this, null)
        // hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Pangolier.Swashbuckle.Cast", hCaster))
    }
    Swashbuckle(vStartLoc: Vector, vEndLoc: Vector, iStrikes: number) {
        let hCaster = this.GetCasterPlus()
        let width = this.GetSpecialValueFor("width")
        let attack_interval = this.GetSpecialValueFor("attack_interval")
        let strikes = iStrikes || this.GetSpecialValueFor("strikes")
        let iCount = 0
        modifier_pangolier_1_damage.apply(hCaster, hCaster, this, null)
        hCaster.addTimer(
            0, () => {
                if (iCount < strikes) {
                    let iParticleID = ResHelper.CreateParticle({
                        resPath: "particles/units/heroes/hero_pangolier/pangolier_swashbuckler_images.vpcf",
                        resNpc: hCaster,
                        iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                        owner: hCaster
                    });

                    ParticleManager.SetParticleControl(iParticleID, 3, vStartLoc)
                    ParticleManager.SetParticleControlForward(iParticleID, 3, ((vEndLoc - vStartLoc) as Vector).Normalized())
                    ParticleManager.ReleaseParticleIndex(iParticleID)
                    let tTargets = FindUnitsInLine(hCaster.GetTeamNumber(), vStartLoc, vEndLoc, null, width, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags())
                    //  DebugDrawLine(vStartLoc, vEndLoc, 255,255,255, true, 1)
                    let iAttackFlags = BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK
                    for (let hTarget of (tTargets)) {
                        BattleHelper.Attack(hCaster, hTarget, iCount == 1 && iAttackFlags || iAttackFlags + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)
                    }
                    hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Pangolier.Swashbuckle.Attack", hCaster))
                    iCount = iCount + 1
                    return attack_interval
                } else {
                    modifier_pangolier_1_damage.remove(hCaster);
                }
            }
        )
    }


    GetIntrinsicModifierName() {
        return "modifier_pangolier_1"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_pangolier_1 extends BaseModifier_Plus {
    chance: number;
    duration: number;
    range: number;
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
        this.chance = this.GetSpecialValueFor("chance")
        this.duration = this.GetSpecialValueFor("duration")
        this.range = this.GetSpecialValueFor("range")
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

            let teamFilter = ability.GetAbilityTargetTeam()
            let typeFilter = ability.GetAbilityTargetType()
            let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST

            if (modifier_pangolier_6_rolling.exist(caster)) {
                let range = this.range
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
                let target = targets[0]
                //  施法命令
                if (target != null) {
                    ExecuteOrderFromTable(
                        {
                            UnitIndex: caster.entindex(),
                            OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                            TargetIndex: target.entindex(),
                            AbilityIndex: ability.entindex()
                        }
                    )
                }
            } else {
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
                    let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
                    target = targets[0]
                }

                //  施法命令
                if (target != null) {
                    ExecuteOrderFromTable(
                        {
                            UnitIndex: caster.entindex(),
                            OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                            TargetIndex: target.entindex(),
                            AbilityIndex: ability.entindex()
                        }
                    )
                }
            }
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.IGNORE_CAST_ANGLE)
    GetIgnoreCastAngle(params: ModifierTable) {
        if (IsServer()) {
            if (this.GetCasterPlus().GetCurrentActiveAbility() == this.GetAbilityPlus()) {
                return 1
            }
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.DISABLE_TURNING)
    GetDisableTurning(params: ModifierTable) {
        if (IsServer()) {
            if (this.GetCasterPlus().GetCurrentActiveAbility() == this.GetAbilityPlus()) {
                return 1
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_pangolier_1_dash extends BaseModifierMotionHorizontal_Plus {
    dash_speed: number;
    vVelocity: Vector;
    hParticleModifier: modifier_pangolier_1_particle_pangolier_swashbuckler_dash;
    caster_position: any;
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
        this.dash_speed = this.GetSpecialValueFor("dash_speed")
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus() as ability1_pangolier_swashbuckle
            if (this.ApplyHorizontalMotionController()) {
                this.hParticleModifier = modifier_pangolier_1_particle_pangolier_swashbuckler_dash.apply(hCaster, hCaster, hAbility);
                let vDirection = ((hAbility.vTargetPosition - hAbility.vCasterLoc) as Vector).Normalized()
                this.vVelocity = (vDirection * this.dash_speed) as Vector
            } else {
                this.Destroy()
            }
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            if (GameFunc.IsValid(this.hParticleModifier)) {
                this.hParticleModifier.Destroy()
            }
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus() as ability1_pangolier_swashbuckle
            hCaster.RemoveHorizontalMotionController(this)
            hCaster.SetAbsOrigin(hAbility.vTargetPosition)
            modifier_pangolier_1_attack.apply(hCaster, hCaster, hAbility, { caster_position: this.caster_position })
        }
    }
    UpdateHorizontalMotion(me: BaseNpc_Plus, dt: number) {
        if (IsServer()) {
            let vPosition = me.GetAbsOrigin() + this.vVelocity * dt
            me.SetAbsOrigin(vPosition as Vector)
        }
    }
    OnHorizontalMotionInterrupted() {
        if (IsServer()) {
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_CAST_ABILITY_1
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_pangolier_1_attack extends BaseModifier_Plus {
    range: number;
    width: number;
    attack_interval: number;
    strikes: number;
    damage: number;
    jump_duration: number;
    duration: number;
    chance: number;
    attack_damage_pct: number;
    iParticleDestroyDelay: number;
    iCount: number;
    tParticles: any[];
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
    Init(params: ModifierTable) {
        this.range = this.GetSpecialValueFor("range")
        this.width = this.GetSpecialValueFor("width")
        this.attack_interval = this.GetSpecialValueFor("attack_interval")
        this.strikes = this.GetSpecialValueFor("strikes")
        this.damage = this.GetSpecialValueFor("damage")
        this.jump_duration = this.GetSpecialValueFor("jump_duration")
        this.chance = this.GetSpecialValueFor("chance")
        this.duration = this.GetSpecialValueFor("duration")
        this.attack_damage_pct = this.GetSpecialValueFor("attack_damage_pct")
        this.iParticleDestroyDelay = 0.25
        this.iCount = 0
        this.tParticles = []
        if (IsServer()) {
            this.GetCasterPlus().SetForwardVector((this.GetAbilityPlus() as ability1_pangolier_swashbuckle).vDirection)
            this.StartIntervalThink(this.attack_interval)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus()
            hCaster.addTimer(
                this.iParticleDestroyDelay,
                () => {
                    for (let iParticleID of (this.tParticles)) {
                        if (iParticleID != null) {
                            ParticleManager.DestroyParticle(iParticleID, true)
                        }
                    }
                }
            )
            modifier_pangolier_1_rolling_back.apply(hCaster, hCaster, hAbility, { duration: this.jump_duration })
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus() as ability1_pangolier_swashbuckle
            let vStartLoc = hCaster.GetAbsOrigin()
            let vEndLoc = (vStartLoc + hAbility.vDirection * this.range) as Vector
            if (this.iCount < this.strikes) {
                let iParticleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_pangolier/pangolier_swashbuckler.vpcf",
                    resNpc: hCaster,
                    iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN,
                    owner: hCaster
                });

                ParticleManager.SetParticleControl(iParticleID, 1, ((vEndLoc - vStartLoc) as Vector).Normalized())
                this.AddParticle(iParticleID, false, false, -1, false, false)
                table.insert(this.tParticles, iParticleID)
                let tTargets = FindUnitsInLine(hCaster.GetTeamNumber(), vStartLoc, vEndLoc, null, this.width, hAbility.GetAbilityTargetTeam(), hAbility.GetAbilityTargetType(), hAbility.GetAbilityTargetFlags())
                let iAttackFlags = BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK
                for (let hTarget of (tTargets)) {
                    BattleHelper.Attack(hCaster, hTarget, this.iCount == 0 && iAttackFlags || iAttackFlags + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)
                }
                hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Pangolier.Swashbuckle.Attack", hCaster))
                this.iCount = this.iCount + 1
            } else {
                this.Destroy()
            }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_CAST_ABILITY_1_END
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: ModifierTable) {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let bonus_damage = hCaster.HasTalent("special_bonus_unique_pangolier_custom_5") && hCaster.GetTalentValue("special_bonus_unique_pangolier_custom_5") || 0
            return this.damage + bonus_damage * hCaster.GetAgility()
        }
        return 0
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    GetDamageOutgoing_Percentage(params: ModifierTable) {
        return this.attack_damage_pct
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_pangolier_1_rolling_back extends BaseModifierMotionBoth_Plus {
    flTime: any;
    jump_height: number;
    jump_duration: number;
    vVelocity: Vector;
    hParticleModifier: modifier_pangolier_1_particle_pangolier_swashbuckler_dash;
    flDistance: any;
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
        this.jump_height = this.GetSpecialValueFor("jump_height")
        this.jump_duration = this.GetSpecialValueFor("jump_duration")
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus() as ability1_pangolier_swashbuckle
            //  A杖
            if (hCaster.HasScepter()) {
                let iRange = hAbility.GetSpecialValueFor("range")
                let vDirection = Vector(iRange, 0, 0)
                for (let i = 1; i <= 4; i++) {
                    let vPosition = (GameFunc.VectorFunctions.Rotation2D(vDirection, math.rad(i * 90)) + hCaster.GetAbsOrigin()) as Vector
                    undefined
                }
            }

            let vDirection = ((hAbility.vCasterLoc - hCaster.GetAbsOrigin()) as Vector).Normalized()
            hCaster.SetForwardVector((-vDirection) as Vector)
            if (this.ApplyHorizontalMotionController() && this.ApplyVerticalMotionController()) {
                hCaster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2)
                this.hParticleModifier = modifier_pangolier_1_particle_pangolier_swashbuckler_dash.apply(hCaster, hCaster, hAbility)
                hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Pangolier.TailThump.Cast", hCaster))
                this.flTime = 0
                this.flDistance = ((hAbility.vCasterLoc - hCaster.GetAbsOrigin()) as Vector).Length2D()
                this.vVelocity = (vDirection * this.flDistance / this.jump_duration) as Vector
            } else {
                this.Destroy()
            }
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            if (GameFunc.IsValid(this.hParticleModifier)) {
                this.hParticleModifier.Destroy()
            }
            let hCaster = this.GetCasterPlus()

            hCaster.RemoveHorizontalMotionController(this)
            hCaster.RemoveVerticalMotionController(this)

            let vForward = hCaster.GetForwardVector()
            vForward.z = 0
            hCaster.SetForwardVector(vForward)
            hCaster.SetAbsOrigin((this.GetAbilityPlus() as ability1_pangolier_swashbuckle).vCasterLoc)
            modifier_pangolier_1_stun.remove(hCaster);
            let ability2 = ability2_pangolier_shield_crash.findIn(hCaster)
            if (ability2 && hCaster.HasScepter() && ability2.GetLevel() > 0) {
                ability2.TailThump()
            }
        }
    }
    UpdateHorizontalMotion(me: BaseNpc_Plus, dt: number) {
        if (IsServer()) {
            let vPosition = me.GetAbsOrigin() + this.vVelocity * dt
            me.SetAbsOrigin(vPosition as Vector)
        }
    }
    OnHorizontalMotionInterrupted() {
    }
    UpdateVerticalMotion(me: BaseNpc_Plus, dt: number) {
        if (IsServer()) {
            let z = math.sin(this.flTime * (3.1415926 / this.jump_duration)) * this.jump_height
            this.flTime = this.flTime + dt
            me.SetAbsOrigin((GetGroundPosition(me.GetAbsOrigin(), me) + Vector(0, 0, z) as Vector))
        }
    }
    OnVerticalMotionInterrupted() {
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_pangolier_1_stun extends BaseModifier_Plus {
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


    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_TELEPORTED)
    teleported(params: ModifierTable) {
        if (IsServer() && params.unit == this.GetParentPlus()) {
            (this.GetAbilityPlus() as ability1_pangolier_swashbuckle).vCasterLoc = params.new_pos
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_pangolier_1_damage extends BaseModifier_Plus {
    attack_damage_pct: number;
    damage: number;
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
    Init(params: ModifierTable) {
        this.damage = this.GetSpecialValueFor("damage")
        this.attack_damage_pct = this.GetSpecialValueFor("attack_damage_pct")
    }


    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: ModifierTable) {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let bonus_damage = hCaster.HasTalent("special_bonus_unique_pangolier_custom_5") && hCaster.GetTalentValue("special_bonus_unique_pangolier_custom_5") || 0
            return this.damage + bonus_damage * hCaster.GetAgility()
        }
        return 0
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    GetDamageOutgoing_Percentage(params: ModifierTable) {
        return this.attack_damage_pct
    }
}
// // // // // // // // // // // // // // // // // // // // // // //
@registerModifier()
export class modifier_pangolier_1_particle_pangolier_swashbuckler_dash extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_pangolier/pangolier_swashbuckler_dash.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }

}
