import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { modifier_rooted } from "../../../modifier/modifier_rooted";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_monkey_king_wukongs_command = { "ID": "5725", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_NORMAL_WHEN_STOLEN", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "FightRecapLevel": "2", "AbilitySound": "Hero_MonkeyKing.FurArmy", "HasScepterUpgrade": "1", "AbilityCastPoint": "1.2", "AbilityCastRange": "0", "AbilityCastAnimation": "ACT_INVALID", "AbilityCooldown": "120 100 80", "AbilityDuration": "13.0", "AbilityManaCost": "100", "AbilitySpecial": { "10": { "var_type": "FIELD_INTEGER", "cast_range": "550" }, "11": { "var_type": "FIELD_INTEGER", "cast_range_scepter": "1550", "RequiresScepter": "1" }, "12": { "var_type": "FIELD_INTEGER", "outer_attack_buffer": "0" }, "13": { "var_type": "FIELD_INTEGER", "cooldown_scepter": "90 70 50", "RequiresScepter": "1" }, "14": { "var_type": "FIELD_FLOAT", "scepter_spawn_interval": "4", "RequiresScepter": "1" }, "15": { "var_type": "FIELD_FLOAT", "scepter_spawn_duration": "12", "RequiresScepter": "1" }, "01": { "var_type": "FIELD_INTEGER", "first_radius": "300" }, "02": { "var_type": "FIELD_INTEGER", "second_radius": "750" }, "03": { "var_type": "FIELD_INTEGER", "num_first_soldiers": "5" }, "04": { "var_type": "FIELD_INTEGER", "num_second_soldiers": "9" }, "05": { "var_type": "FIELD_INTEGER", "move_speed": "700" }, "06": { "var_type": "FIELD_INTEGER", "bonus_armor": "12 18 24", "LinkedSpecialBonus": "special_bonus_unique_monkey_king_4" }, "07": { "var_type": "FIELD_FLOAT", "attack_speed": "1.1" }, "08": { "var_type": "FIELD_FLOAT", "duration": "13.0" }, "09": { "var_type": "FIELD_INTEGER", "leadership_radius_buffer": "30" } } };

@registerAbility()
export class ability6_monkey_king_wukongs_command extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "monkey_king_wukongs_command";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_monkey_king_wukongs_command = Data_monkey_king_wukongs_command;
    Init() {
        this.SetDefaultSpecialValue("cast_range", 800);
        this.SetDefaultSpecialValue("outer_attack_buffer", 0);
        this.SetDefaultSpecialValue("scepter_third_radius", 1100);
        this.SetDefaultSpecialValue("scepter_num_third_soldiers", 7);
        this.SetDefaultSpecialValue("scepter_duration", 13);
        this.SetDefaultSpecialValue("scepter_interval", 3);
        this.SetDefaultSpecialValue("first_radius", 300);
        this.SetDefaultSpecialValue("second_radius", 750);
        this.SetDefaultSpecialValue("num_first_soldiers", 5);
        this.SetDefaultSpecialValue("num_second_soldiers", 9);
        this.SetDefaultSpecialValue("move_speed", 700);
        this.SetDefaultSpecialValue("attack_damage_ptg", [50, 60, 70, 80, 90, 100]);
        this.SetDefaultSpecialValue("attack_speed", 0.8);
        this.SetDefaultSpecialValue("attack_range", 450);
        this.SetDefaultSpecialValue("duration", 13);

    }

    Init_old() {
        this.SetDefaultSpecialValue("num_first_soldiers", 5);
        this.SetDefaultSpecialValue("num_second_soldiers", 9);
        this.SetDefaultSpecialValue("move_speed", 700);
        this.SetDefaultSpecialValue("attack_damage_ptg", [50, 60, 70, 80, 90, 100]);
        this.SetDefaultSpecialValue("attack_speed", 1.2);
        this.SetDefaultSpecialValue("attack_range", 450);
        this.SetDefaultSpecialValue("duration", 13);
        this.SetDefaultSpecialValue("leadership_radius_buffer", 500);
        this.SetDefaultSpecialValue("cast_range", 800);
        this.SetDefaultSpecialValue("outer_attack_buffer", 0);
        this.SetDefaultSpecialValue("scepter_third_radius", 1100);
        this.SetDefaultSpecialValue("scepter_num_third_soldiers", 7);
        this.SetDefaultSpecialValue("scepter_duration", 13);
        this.SetDefaultSpecialValue("scepter_interval", 4.5);
        this.SetDefaultSpecialValue("first_radius", 300);
        this.SetDefaultSpecialValue("second_radius", 750);

    }

    tScepterSoldiers: any[];
    tSoldiers: any[];
    vLastPosition: Vector;
    hDummy: IBaseNpc_Plus;
    hitting: boolean;;
    GetCastAnimation() {
        return GameActivity_t.ACT_DOTA_MK_FUR_ARMY
    }
    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("cast_range")
    }
    GetAOERadius() {
        return this.GetSpecialValueFor("second_radius")
    }
    OnAbilityPhaseStart() {
        let hCaster = this.GetCasterPlus()
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_MonkeyKing.FurArmy.Channel", hCaster))

        let iSoldierCount = this.GetLevelSpecialValueFor("num_first_soldiers", 0) + this.GetLevelSpecialValueFor("num_second_soldiers", 0)
        for (let i = this.tSoldiers.length + 1; i >= iSoldierCount; i--) {
            this.CreateSoldier(true)
        }
        modifier_monkey_king_6_particle_monkey_king_fur_army_cast.apply(hCaster, hCaster, this, null)
        return true
    }
    OnAbilityPhaseInterrupted() {
        let hCaster = this.GetCasterPlus()
        hCaster.StopSound(ResHelper.GetSoundReplacement("Hero_MonkeyKing.FurArmy.Channel", hCaster))
        modifier_monkey_king_6_particle_monkey_king_fur_army_cast.remove(hCaster);
        return true
    }

    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        modifier_monkey_king_6_particle_monkey_king_fur_army_cast.remove(hCaster);

        let vPosition = this.GetCursorPosition()
        let cast_range = this.GetSpecialValueFor("cast_range") + hCaster.GetCastRangeBonus()

        let vDirection = (vPosition - hCaster.GetAbsOrigin()) as Vector
        vDirection.z = 0
        vPosition = GetGroundPosition((hCaster.GetAbsOrigin() + vDirection.Normalized() * math.min(vDirection.Length2D(), cast_range) as Vector), hCaster)
        let first_radius = this.GetSpecialValueFor("first_radius")
        let second_radius = this.GetSpecialValueFor("second_radius")
        let num_first_soldiers = this.GetSpecialValueFor("num_first_soldiers")
        let num_second_soldiers = this.GetSpecialValueFor("num_second_soldiers")
        let duration = this.GetSpecialValueFor("duration")
        let max_radius = second_radius
        for (let i = 1; i <= num_first_soldiers; i++) {
            let hSoldier = this.tSoldiers[i]
            let vTargetPosition = GetGroundPosition((vPosition + first_radius * GameFunc.VectorFunctions.Rotation2D(Vector(0, 1, 0), math.rad((i - 1) * 360 / num_first_soldiers)) as Vector), hSoldier)
            modifier_monkey_king_6_soldier_active.remove(hSoldier);
            modifier_monkey_king_6_soldier_active.apply(hSoldier, hCaster, this, { position: vPosition, radius: max_radius, target_position: vTargetPosition })
        }

        for (let i = 1; i <= num_second_soldiers; i++) {
            let hSoldier = this.tSoldiers[i + num_first_soldiers]
            let vTargetPosition = GetGroundPosition((vPosition + second_radius * GameFunc.VectorFunctions.Rotation2D(Vector(0, 1, 0), math.rad((i - 1) * 360 / num_second_soldiers)) as Vector), hSoldier)
            modifier_monkey_king_6_soldier_active.remove(hSoldier);
            modifier_monkey_king_6_soldier_active.apply(hSoldier, hCaster, this, { position: vPosition, radius: max_radius, target_position: vTargetPosition })
        }

        if (GameFunc.IsValid(this.hDummy)) {
            modifier_monkey_king_6_thinker.remove(this.hDummy);
        }
        this.hDummy = modifier_monkey_king_6_thinker.applyThinker(vPosition, hCaster, this, { radius: max_radius }, hCaster.GetTeamNumber(), false) as IBaseNpc_Plus
        modifier_monkey_king_6_buff.apply(hCaster, hCaster, this, { duration: duration })
        // modifier_monkey_king_bounce_perch.remove(hCaster);

        this.vLastPosition = vPosition
    }

    OnScepterStart() {
        let hCaster = this.GetCasterPlus()
        let scepter_duration = this.GetSpecialValueFor("scepter_duration")
        let scepter_interval = this.GetSpecialValueFor("scepter_interval")

        let iScepterSoldierCount = math.floor(scepter_duration / scepter_interval) + 1
        for (let i = this.tSoldiers.length + 1; i >= iScepterSoldierCount; i--) {
            this.CreateScepterSoldier(true)
        }
        let first_radius = this.GetSpecialValueFor("first_radius")
        let vTargetPosition = (hCaster.GetAbsOrigin() + RandomVector(1) * RandomFloat(0, first_radius)) as Vector
        vTargetPosition = GetGroundPosition(vTargetPosition, hCaster)
        for (let hSoldier of (this.tScepterSoldiers)) {
            if (!modifier_monkey_king_6_scepter_active.exist(hSoldier)) {
                modifier_monkey_king_6_scepter_active.apply(hSoldier, hCaster, this, { duration: scepter_duration, target_position: vTargetPosition })
                break
            }
        }
    }

    CreateSoldier(bImmediately: boolean) {
        let hCaster = this.GetCasterPlus()
        let iSoldierCount = this.GetLevelSpecialValueFor("num_first_soldiers", 0) + this.GetLevelSpecialValueFor("num_second_soldiers", 0)
        let hHero = PlayerResource.GetSelectedHeroEntity(hCaster.GetPlayerOwnerID())

        if (this.tSoldiers.length >= iSoldierCount) { return false }

        let hSoldier = CreateUnitByName(hCaster.GetUnitName(), hCaster.GetAbsOrigin(), false, hHero, hHero, hCaster.GetTeamNumber())
        modifier_monkey_king_6_soldier.apply(hSoldier, hCaster, this, null)

        table.insert(this.tSoldiers, hSoldier)
        return true
    }
    CreateScepterSoldier(bImmediately: boolean) {
        let hCaster = this.GetCasterPlus()
        let iScepterSoldierCount = math.floor(this.GetLevelSpecialValueFor("scepter_duration", 0) / this.GetLevelSpecialValueFor("scepter_interval", 0)) + 1
        let hHero = PlayerResource.GetSelectedHeroEntity(hCaster.GetPlayerOwnerID())
        if (this.tScepterSoldiers.length >= iScepterSoldierCount) { return false }
        let hSoldier = CreateUnitByName(hCaster.GetUnitName(), hCaster.GetAbsOrigin(), false, hHero, hHero, hCaster.GetTeamNumber())
        modifier_monkey_king_6_soldier.apply(hSoldier, hCaster, this, null)
        table.insert(this.tScepterSoldiers, hSoldier)
        return true
    }
    Spawn() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            if (hCaster.IsTempestDouble() || hCaster.IsIllusion()) {
                return
            }
            if (this.tSoldiers == null) {
                this.tSoldiers = []
                this.tScepterSoldiers = []
            }
            this.addTimer(1, () => {
                if (modifier_monkey_king_6_soldier.exist(hCaster)) {
                    return
                }
                if (!this.CreateScepterSoldier(true)) {
                    if (!this.CreateSoldier(true)) {
                        return
                    }
                }
                return 1
            })
        }
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_monkey_king_6"
    // }

    OnStolen(hSourceAbility: this) {
        this.vLastPosition = hSourceAbility.vLastPosition
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_monkey_king_6 extends BaseModifier_Plus {
    attack_damage_ptg: number;
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
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }
    Init(params: ModifierTable) {
        this.attack_damage_ptg = this.GetSpecialValueFor("attack_damage_ptg")
        if (IsServer()) {
            modifier_monkey_king_6_scepter_buff.apply(this.GetParentPlus(), this.GetCasterPlus(), this.GetAbilityPlus(), null)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            modifier_monkey_king_6_scepter_buff.remove(this.GetParentPlus());
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus() as ability6_monkey_king_wukongs_command
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

            if (modifier_monkey_king_6_buff.exist(hCaster)) {
                return
            }

            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE
            let order = FindOrder.FIND_CLOSEST

            let range = ability.GetCastRange(hCaster.GetAbsOrigin(), hCaster) + hCaster.GetCastRangeBonus()
            //  优先释放在上一次释放的位置
            let radius = ability.GetAOERadius()
            if (ability.vLastPosition != null && hCaster.IsPositionInRange(ability.vLastPosition, range)) {
                let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), ability.vLastPosition, radius, null, teamFilter, typeFilter, flagFilter, order)

                //  施法命令
                if (targets.length > 0) {
                    ExecuteOrderFromTable({
                        UnitIndex: hCaster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        Position: ability.vLastPosition,
                        AbilityIndex: ability.entindex()
                    })
                }
            } else {
                //  优先攻击目标
                let target = hCaster.GetAttackTarget()
                if (target != null && target.GetClassname() == "dota_item_drop") {
                    target = null
                }
                if (target != null && !target.IsPositionInRange(hCaster.GetAbsOrigin(), range)) {
                    target = null
                }

                //  搜索范围
                if (target == null) {
                    let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
                    target = targets[0]
                }

                //  施法命令
                if (target != null) {
                    ExecuteOrderFromTable({
                        UnitIndex: hCaster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        Position: target.GetAbsOrigin(),
                        AbilityIndex: ability.entindex()
                    })
                }
            }
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    GetDamageOutgoing_Percentage(params: ModifierTable) {
        if (IsServer()) {
            if (params.target == null) {
                return
            }
            let parent = this.GetParentPlus()
            let ability = this.GetAbilityPlus() as ability6_monkey_king_wukongs_command
            if (ability.hitting) {
                let extra_attack_damage_ptg = parent.HasTalent("special_bonus_unique_monkey_king_custom_3") && parent.GetTalentValue("special_bonus_unique_monkey_king_custom_3") || 0
                return (this.attack_damage_ptg + extra_attack_damage_ptg) - 100
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_monkey_king_6_soldier_active extends BaseModifier_Plus {
    attack_speed: number;
    attack_range: number;
    move_speed: number;
    outer_attack_buffer: number;
    radius: any;
    vTargetPosition: Vector;
    vPosition: Vector;
    iPhase: string;
    fAttackTimeRecord: number;
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
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let extra_attack_range = hCaster.HasTalent("special_bonus_unique_monkey_king_custom_5") && hCaster.GetTalentValue("special_bonus_unique_monkey_king_custom_5") || 0
        let extra_attack_speed = hCaster.HasTalent("special_bonus_unique_monkey_king_custom_7") && hCaster.GetTalentValue("special_bonus_unique_monkey_king_custom_7") || 0
        this.attack_speed = this.GetSpecialValueFor("attack_speed") + extra_attack_speed
        this.attack_range = this.GetSpecialValueFor("attack_range")
        this.attack_range = this.attack_range + extra_attack_range
        this.move_speed = this.GetSpecialValueFor("move_speed")
        if (IsServer()) {
            this.outer_attack_buffer = this.GetSpecialValueFor("outer_attack_buffer")
            this.radius = params.radius
            this.vPosition = GameFunc.VectorFunctions.StringToVector(params.position)
            this.vTargetPosition = GameFunc.VectorFunctions.StringToVector(params.target_position)
            FindClearSpaceForUnit(hParent, hCaster.GetAbsOrigin(), false)
            hParent.RemoveNoDraw()
            this.StartIntervalThink(((this.vTargetPosition - hParent.GetAbsOrigin()) as Vector).Length() / this.move_speed)
            this.iPhase = "moving"
            hParent.MoveToPosition(this.vTargetPosition)
            modifier_monkey_king_6_status.apply(hParent, hCaster, this.GetAbilityPlus(), null)
            this.fAttackTimeRecord = GameRules.GetGameTime()
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_monkey_king/monkey_king_fur_army_positions.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, this.vTargetPosition)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            this.GetParentPlus().SetDayTimeVisionRange(0)
            this.GetParentPlus().SetNightTimeVisionRange(0)
            this.GetParentPlus().AddNoDraw()
            this.GetParentPlus().Stop()
            modifier_rooted.remove(this.GetParentPlus());
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            let hCaster = this.GetCasterPlus()
            if (!GameFunc.IsValid(hCaster)) {
                this.Destroy()
                return
            }
            if (this.iPhase == "moving") {
                this.iPhase = "stand"
                modifier_rooted.apply(hParent, hCaster, null, null)
                FindClearSpaceForUnit(hParent, this.vTargetPosition, false)
            }

            if (this.iPhase == "stand") {
                let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), hParent.Script_GetAttackRange() + hParent.GetHullRadius(), null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_CLOSEST)
                for (let i = targets.length - 1; i >= 0; i--) {
                    if (!targets[i].IsPositionInRange(this.vPosition, this.radius + this.outer_attack_buffer)) {
                        table.remove(targets, i)
                    }
                }
                let target = targets[0]
                if (target != null) {
                    if (GameRules.GetGameTime() > this.fAttackTimeRecord) {
                        ExecuteOrderFromTable({
                            UnitIndex: hParent.entindex(),
                            OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET,
                            TargetIndex: target.entindex()
                        })
                    } else {
                        if (!hParent.IsIdle()) {
                            hParent.Stop()
                        }
                    }
                    if (modifier_monkey_king_6_status.exist(hParent)) {
                        modifier_monkey_king_6_status.remove(hParent);
                    }
                } else {
                    if (!hParent.IsIdle()) {
                        hParent.Stop()
                    }
                    if (!modifier_monkey_king_6_status.exist(hParent)) {
                        modifier_monkey_king_6_status.apply(hParent, hCaster, this.GetAbilityPlus(), null)
                    }
                }
            }
            this.StartIntervalThink(0.1)
        }
    }


    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)

    GetAttackSpeedBonus_Constant(params: ModifierTable) {
        if (GameFunc.IsValid(this.GetCasterPlus())) {
            return this.GetCasterPlus().GetIncreasedAttackSpeed() * 100
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MOVESPEED_ABSOLUTE)
    GetMoveSpeed_Absolute(params: ModifierTable) {
        return this.move_speed
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    GetDamageOutgoing_Percentage(params: ModifierTable) {
        return -1000
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACK_RANGE_BASE_OVERRIDE)
    GetAttackRangeOverride(params: ModifierTable) {
        return this.attack_range
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    Get_ActivityTranslationModifiers() {
        return "run_fast"
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    On_Attack(params: ModifierAttackEvent) {
        if (params.attacker == this.GetParentPlus()) {
            this.fAttackTimeRecord = GameRules.GetGameTime() + this.attack_speed
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.attacker == this.GetParentPlus()) {
            let ability = this.GetAbilityPlus() as ability6_monkey_king_wukongs_command
            if (!GameFunc.IsValid(ability)) {
                return
            }
            ability.hitting = true
            let hCaster = this.GetCasterPlus()
            let vPosition = hCaster.GetAbsOrigin()
            hCaster.SetAbsOrigin(this.GetParentPlus().GetAbsOrigin())
            BattleHelper.Attack(hCaster, params.target, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE)
            hCaster.SetAbsOrigin(vPosition)
            ability.hitting = false
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_monkey_king_6_thinker extends BaseModifier_Plus {
    radius: any;
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
            this.radius = params.radius
            this.GetCasterPlus().EmitSound(ResHelper.GetSoundReplacement("Hero_MonkeyKing.FurArmy", this.GetCasterPlus()))

            this.StartIntervalThink(1)
        } else {
            let radius = this.GetAbilityPlus().GetAOERadius()
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_monkey_king/monkey_king_furarmy_ring.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, this.GetParentPlus().GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(radius, radius, radius))
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            if (!GameFunc.IsValid(hCaster)) {
                return
            }
            hCaster.StopSound(ResHelper.GetSoundReplacement("Hero_MonkeyKing.FurArmy", hCaster))
            UTIL_Remove(this.GetParentPlus())
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus() as ability6_monkey_king_wukongs_command

            if (!GameFunc.IsValid(hCaster) || !GameFunc.IsValid(hAbility)) {
                this.Destroy()
                return
            }
            this.GetCasterPlus().StopSound(ResHelper.GetSoundReplacement("Hero_MonkeyKing.FurArmy", this.GetCasterPlus()))
            if (!modifier_monkey_king_6_buff.exist(hCaster)) {
                if (hAbility.tSoldiers) {
                    for (let hSoldier of (hAbility.tSoldiers)) {
                        modifier_monkey_king_6_soldier_active.remove(hSoldier);
                    }
                }
                this.Destroy()
            }
            this.StartIntervalThink(0)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_monkey_king_6_soldier extends BaseModifier_Plus {
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
            this.GetParentPlus().SetDayTimeVisionRange(0)
            this.GetParentPlus().SetNightTimeVisionRange(0)
            this.GetParentPlus().AddNoDraw()

            this.StartIntervalThink(0.1)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()

            if (!GameFunc.IsValid(hCaster)) {
                UTIL_Remove(this.GetParentPlus())
                return
            }
            if (!modifier_monkey_king_6_soldier_active.exist(this.GetParentPlus()) && !modifier_monkey_king_6_scepter_active.exist(this.GetParentPlus())) {
                this.GetParentPlus().SetAbsOrigin(hCaster.GetAbsOrigin())
            }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
            [modifierstate.MODIFIER_STATE_NO_TEAM_SELECT]: true,
            [modifierstate.MODIFIER_STATE_NO_TEAM_MOVE_TO]: true,
            [modifierstate.MODIFIER_STATE_UNTARGETABLE]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    Get_ActivityTranslationModifiers() {
        return "fur_army_soldier"
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.DISABLE_AUTOATTACK)
    Get_DisableAutoAttack() {
        return 1
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TEMPEST_DOUBLE)
    GetTempestDouble(params: ModifierTable) {
        return 1
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TRANSLATE_ATTACK_SOUND)
    Get_AttackSound() {
        return ""
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_monkey_king_6_buff extends BaseModifier_Plus {
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
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_monkey_king_6_status extends BaseModifier_Plus {
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
    StatusEffectPriority() {
        return 10
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_monkey_king_fur_army.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControl(iParticleID, 0, this.GetParentPlus().GetAbsOrigin())
            this.AddParticle(iParticleID, false, true, this.StatusEffectPriority(), false, false)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_monkey_king/monkey_king_fur_army_attack.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_monkey_king_6_scepter_buff extends BaseModifier_Plus {
    scepter_duration: number;
    scepter_interval: number;
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
        this.scepter_duration = this.GetSpecialValueFor("scepter_duration")
        this.scepter_interval = this.GetSpecialValueFor("scepter_interval")
        if (IsServer()) {
            this.StartIntervalThink(this.scepter_interval)
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus() as ability6_monkey_king_wukongs_command
            if (hCaster.IsIllusion() || hCaster.IsTempestDouble() || hCaster.IsClone()) {
                this.StartIntervalThink(-1)
                return
            }
            if (hCaster.HasScepter()) {
                hAbility.OnScepterStart()
                this.StartIntervalThink(this.scepter_interval)
            } else {
                this.StartIntervalThink(0)
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_monkey_king_6_scepter_active extends BaseModifier_Plus {
    iPhase: string;
    vTargetPosition: Vector;
    attack_speed: number;
    fAttackTimeRecord: number;
    move_speed: any;
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
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let extra_attack_speed = hCaster.HasTalent("special_bonus_unique_monkey_king_custom_7") && hCaster.GetTalentValue("special_bonus_unique_monkey_king_custom_7") || 0
        this.attack_speed = this.GetSpecialValueFor("attack_speed") + extra_attack_speed
        this.move_speed = this.GetSpecialValueFor("move_speed")
        if (IsServer()) {
            this.vTargetPosition = GameFunc.VectorFunctions.StringToVector(params.target_position)
            FindClearSpaceForUnit(hParent, hCaster.GetAbsOrigin(), false)
            hParent.RemoveNoDraw()
            this.StartIntervalThink(((this.vTargetPosition - hParent.GetAbsOrigin()) as Vector).Length() / this.move_speed)
            this.iPhase = "moving"
            hParent.MoveToPosition(this.vTargetPosition)
            modifier_monkey_king_6_status.apply(hParent, hCaster, this.GetAbilityPlus(), null)
            this.fAttackTimeRecord = GameRules.GetGameTime()
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_monkey_king/monkey_king_fur_army_positions.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, this.vTargetPosition)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            this.GetParentPlus().AddNoDraw()
            this.GetParentPlus().Stop()
            modifier_rooted.remove(this.GetParentPlus());
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            let hCaster = this.GetCasterPlus()

            if (!GameFunc.IsValid(hCaster)) {
                this.Destroy()
                return
            }

            if (this.iPhase == "moving") {
                this.iPhase = "stand"
                modifier_rooted.apply(hParent, hCaster, null, null)
                FindClearSpaceForUnit(hParent, this.vTargetPosition, false)
            }

            if (this.iPhase == "stand") {
                let targets = FindUnitsInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), null, hParent.Script_GetAttackRange() + hParent.GetHullRadius(), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_CLOSEST, false)
                let target = targets[0]
                if (GameFunc.IsValid(target)) {
                    if (GameRules.GetGameTime() > this.fAttackTimeRecord) {
                        ExecuteOrderFromTable({
                            UnitIndex: hParent.entindex(),
                            OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET,
                            TargetIndex: target.entindex()
                        })
                    } else {
                        if (!hParent.IsIdle()) {
                            hParent.Stop()
                        }
                    }
                } else {
                    if (!hParent.IsIdle()) {
                        hParent.Stop()
                    }
                }
            }
            this.StartIntervalThink(0.1)
        }
    }



    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant(params: ModifierTable) {
        if (GameFunc.IsValid(this.GetCasterPlus())) {
            return this.GetCasterPlus().GetIncreasedAttackSpeed() * 100
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MOVESPEED_ABSOLUTE)
    GetMoveSpeed_Absolute(params: ModifierTable) {
        return this.move_speed
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    GetDamageOutgoing_Percentage(params: ModifierTable) {
        return -1000
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACK_RANGE_BASE_OVERRIDE)
    GetAttackRangeOverride(params: ModifierTable) {
        if (GameFunc.IsValid(this.GetCasterPlus())) {
            return this.GetCasterPlus().Script_GetAttackRange()
        }
        return 900
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    Get_ActivityTranslationModifiers() {
        return "run_fast"
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    On_Attack(params: ModifierAttackEvent) {
        if (params.attacker == this.GetParentPlus()) {
            this.fAttackTimeRecord = GameRules.GetGameTime() + this.attack_speed
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.attacker == this.GetParentPlus()) {
            let hAbility = this.GetAbilityPlus() as ability6_monkey_king_wukongs_command
            if (!GameFunc.IsValid(hAbility)) {
                return
            }
            hAbility.hitting = true
            let hCaster = this.GetCasterPlus()
            let vPosition = hCaster.GetAbsOrigin()
            hCaster.SetAbsOrigin(this.GetParentPlus().GetAbsOrigin())
            BattleHelper.Attack(hCaster, params.target as IBaseNpc_Plus, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE)
            hCaster.SetAbsOrigin(vPosition)
            hAbility.hitting = false
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_monkey_king_6_particle_monkey_king_fur_army_cast extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_monkey_king/monkey_king_fur_army_cast.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
}
