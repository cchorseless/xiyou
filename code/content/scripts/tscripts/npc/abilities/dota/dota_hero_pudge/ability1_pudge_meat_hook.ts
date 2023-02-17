
import { GameFunc } from "../../../../GameFunc";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { LogHelper } from "../../../../helper/LogHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifierMotionHorizontal_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { item_towerchange_custom } from "../../../items/avalon/item_towerchange_custom";
import { modifier_bleeding } from "../../../modifier/effect/modifier_bleeding";

/** dota原技能数据 */
export const Data_pudge_meat_hook = { "ID": "5075", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitDamageType": "DAMAGE_TYPE_PURE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_Pudge.AttackHookExtend", "AbilityCastRange": "1300", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCooldown": "18 16 14 12", "AbilityManaCost": "125 130 135 140", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "damage": "150 220 290 360", "LinkedSpecialBonus": "special_bonus_unique_pudge_7" }, "02": { "var_type": "FIELD_FLOAT", "hook_speed": "1450.0" }, "03": { "var_type": "FIELD_INTEGER", "hook_width": "100" }, "04": { "var_type": "FIELD_INTEGER", "hook_distance": "1300" }, "05": { "var_type": "FIELD_INTEGER", "vision_radius": "500 500 500 500" }, "06": { "var_type": "FIELD_FLOAT", "vision_duration": "4.0 4.0 4.0 4.0" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

declare interface HookInfo {
    __hashuuid__: string;
    bChainAttached: boolean;
    hCaster: IBaseNpc_Plus;
    hook_speed: number;
    hook_width: number;
    hook_distance: number;
    bleed_damage: number;
    bleed_damage_str: number;
    bleed_duration: number;
    vStartPosition: Vector;
    vProjectileLocation: Vector;
    vTargetPosition: Vector;
    vHookOffset: Vector;
    vHookTarget: Vector;
    iParticleID: ParticleID;
    iProjectileID: ProjectileID;
    tVictim: Array<any>;
    bRetracting: boolean;
    bDiedInHook: boolean;
}

@registerAbility()
export class ability1_pudge_meat_hook extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "pudge_meat_hook";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_pudge_meat_hook = Data_pudge_meat_hook;
    Init() {
        this.SetDefaultSpecialValue("bleed_damage", [1000, 1500, 2000, 2500, 3000, 4000]);
        this.SetDefaultSpecialValue("bleed_damage_str", [3, 4, 5, 6, 7, 8]);
        this.SetDefaultSpecialValue("hook_speed", 1450);
        this.SetDefaultSpecialValue("hook_width", 200);
        this.SetDefaultSpecialValue("hook_distance", 1300);
        this.SetDefaultSpecialValue("duration", 1);
        this.SetDefaultSpecialValue("incoming_bleed_damage", 100);
        this.SetDefaultSpecialValue("extra_count", 4);
        this.SetDefaultSpecialValue("extra_angle", 15);

    }

    AutoSpellSelf() {
        if (IsServer()) {
            if (!GameFunc.IsValid(this)) {
                this.Destroy()
                return
            }
            let caster = this.GetCasterPlus()
            if (!this.GetAutoCastState()) {
                return
            }
            if (!this.IsAbilityReady()) {
                return
            }
            let range = this.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()
            let radius = this.GetAOERadius()
            let position = AoiHelper.GetAOEMostTargetsPosition(
                caster.GetAbsOrigin(),
                range,
                caster.GetTeamNumber(),
                radius,
                null,
                DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
                DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS,
                FindOrder.FIND_CLOSEST)
            //  施法命令
            if (position && caster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable(
                    {
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        AbilityIndex: this.entindex(),
                        Position: position
                    }
                )
            }
        }
    }
    GetManaCost() {
        return 50
    }

    OnAbilityPhaseStart() {
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_1)
        return true
    }
    OnAbilityPhaseInterrupted() {
        this.GetCasterPlus().RemoveGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_1)
    }
    LaunchHook(vDirection: Vector) {
        let tHashtable = HashTableHelper.CreateHashtable() as HookInfo;
        let caster = this.GetCasterPlus()
        tHashtable.bChainAttached = false
        tHashtable.hCaster = caster
        tHashtable.hook_speed = this.GetSpecialValueFor("hook_speed")
        tHashtable.hook_width = this.GetSpecialValueFor("hook_width") + caster.GetTalentValue(2);
        tHashtable.bleed_damage = /**this.GetSpecialValueFor("bleed_damage")|| */ 1000;
        tHashtable.bleed_damage_str = this.GetSpecialValueFor("bleed_damage_str")
        tHashtable.bleed_duration = this.GetSpecialValueFor("duration")
        tHashtable.hook_distance = this.GetSpecialValueFor("hook_distance") + caster.GetCastRangeBonus()
        // 开始位置
        tHashtable.vStartPosition = caster.GetOrigin()
        // 实时位置
        tHashtable.vProjectileLocation = tHashtable.vStartPosition
        // 目标点位置
        tHashtable.vTargetPosition = (tHashtable.vStartPosition + vDirection * tHashtable.hook_distance) as Vector
        tHashtable.vHookOffset = Vector(0, 0, 96)
        // 特效目标点
        tHashtable.vHookTarget = (tHashtable.vTargetPosition + tHashtable.vHookOffset) as Vector
        // 特效
        tHashtable.iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_pudge/pudge_meathook.vpcf",
            resNpc: caster,
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN
        })
        // 伸出去 | 拉回来
        tHashtable.bRetracting = false;
        // 勾中单位
        tHashtable.tVictim = [];
        // 目标是否死亡
        tHashtable.bDiedInHook = false
        ParticleManager.SetParticleAlwaysSimulate(tHashtable.iParticleID)
        ParticleManager.SetParticleControlEnt(tHashtable.iParticleID, 0, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_weapon_chain_rt", (caster.GetAbsOrigin() + tHashtable.vHookOffset) as Vector, true)
        ParticleManager.SetParticleControl(tHashtable.iParticleID, 1, tHashtable.vHookTarget)
        ParticleManager.SetParticleControl(tHashtable.iParticleID, 2, Vector(tHashtable.hook_speed, tHashtable.hook_distance, tHashtable.hook_width))
        let vKillswitch = Vector(20, 0, 0);
        ParticleManager.SetParticleControl(tHashtable.iParticleID, 3, vKillswitch)
        ParticleManager.SetParticleControl(tHashtable.iParticleID, 4, Vector(1, 0, 0))
        ParticleManager.SetParticleControl(tHashtable.iParticleID, 5, Vector(0, 0, 0))
        ParticleManager.SetParticleControlEnt(tHashtable.iParticleID, 7, caster, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, null, caster.GetAbsOrigin(), true)
        // 音效
        caster.EmitSound(ResHelper.GetSoundReplacement("Hero_Pudge.AttackHookExtend", caster))
        // 弹道
        let tInfo: CreateLinearProjectileOptions = {
            Ability: this,
            vSpawnOrigin: tHashtable.vStartPosition,
            vVelocity: (vDirection * tHashtable.hook_speed) as Vector,
            fDistance: tHashtable.hook_distance,
            fStartRadius: tHashtable.hook_width,
            fEndRadius: tHashtable.hook_width,
            Source: caster,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_OTHER,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH,
            ExtraData: {
                hashtableUUid: tHashtable.__hashuuid__,
            },
        }
        tHashtable.iProjectileID = ProjectileManager.CreateLinearProjectile(tInfo)
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hModel = hCaster.FirstMoveChild()
        // 根据饰品替换特效
        while (hModel != null) {
            if (hModel.GetClassname() == GameEnum.Unit.UnitClass.dota_item_wearable && hModel.GetModelName() != "") {
                if (hModel.GetModelName() == ResHelper.GetModelReplacement("models/heroes/pudge/righthook.vmdl", hCaster)) {
                    hModel.AddEffects(EntityEffects.EF_NODRAW)
                }
            }
            hModel = hModel.NextMovePeer()
        }
        let vDirection = GameFunc.VectorFunctions.HorizonVector((this.GetCursorPosition() - hCaster.GetAbsOrigin()) as Vector)
        this.LaunchHook(vDirection)
        if (hCaster.HasShard()) {
            let extra_count = this.GetSpecialValueFor("extra_count")
            let extra_angle = this.GetSpecialValueFor("extra_angle")
            for (let i = 0; i <= extra_count - 1; i++) {
                let x = (i % 2 == 0) && 1 || -1
                let y = math.floor(i / 2) + 1
                this.LaunchHook(GameFunc.VectorFunctions.Rotation2D(vDirection, math.rad(extra_angle * x * y)))
            }
        }
    }

    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: IModifierTable) {
        let tHashtable = HashTableHelper.GetHashtableByIndex(ExtraData.hashtableUUid) as HookInfo;
        if (hTarget == tHashtable.hCaster) {
            return false
        }
        LogHelper.print(hTarget == null, vLocation, tHashtable.bRetracting)
        // 伸出去
        if (!tHashtable.bRetracting) {
            let vHookPos;
            // 施法者碰撞盒圆心
            let flPad = tHashtable.hCaster.GetPaddedCollisionRadius()
            if (hTarget) {
                table.insert(tHashtable.tVictim, hTarget);
                vHookPos = hTarget.GetAbsOrigin()
                flPad += hTarget.GetPaddedCollisionRadius()
                EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Pudge.AttackHookImpact", tHashtable.hCaster), tHashtable.hCaster)
                // 目标转向
                let vDirection = (tHashtable.vStartPosition - tHashtable.vTargetPosition) as Vector
                vDirection.z = 0
                hTarget.SetForwardVector(vDirection.Normalized())
                modifier_pudge_1_buff.apply(hTarget, tHashtable.hCaster, this, { hashtableUUid: HashTableHelper.GetHashtableIndex(tHashtable) });
                // 流血
                let fDamage = tHashtable.bleed_damage + tHashtable.bleed_damage_str * tHashtable.hCaster.GetStrength();
                modifier_bleeding.Bleeding(hTarget, tHashtable.hCaster, this, tHashtable.bleed_duration, (tDamageTable: BattleHelper.DamageOptions) => {
                    LogHelper.print(fDamage, 111)
                    return fDamage
                }, true)
                if (!hTarget.IsAlive()) {
                    tHashtable.bDiedInHook = true
                }
                // 流血特效
                let iParticleID = ResHelper.CreateParticle(
                    {
                        resPath: "particles/units/heroes/hero_pudge/pudge_meathook_impact.vpcf",
                        resNpc: tHashtable.hCaster,
                        iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                        owner: tHashtable.hCaster
                    })
                ParticleManager.SetParticleControlEnt(iParticleID, 0, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", tHashtable.hCaster.GetAbsOrigin(), true)
                ParticleManager.ReleaseParticleIndex(iParticleID)
            }
            else {
                vHookPos = tHashtable.vTargetPosition
            }
            let vVelocity = (tHashtable.vStartPosition - vHookPos) as Vector
            vVelocity.z = 0
            let flDistance = vVelocity.Length2D() - flPad
            vVelocity = (vVelocity.Normalized() * tHashtable.hook_speed) as Vector
            let tInfo: CreateLinearProjectileOptions = {
                Ability: this,
                vSpawnOrigin: vHookPos,
                vVelocity: vVelocity,
                fDistance: flDistance,
                fStartRadius: tHashtable.hook_width,
                fEndRadius: tHashtable.hook_width,
                // 拉回去不要勾到目标
                // Source: tHashtable.hCaster,
                // iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_NONE,
                // iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_NONE,
                // iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                ExtraData: {
                    hashtableUUid: HashTableHelper.GetHashtableIndex(tHashtable),
                }
            }
            tHashtable.iProjectileID = ProjectileManager.CreateLinearProjectile(tInfo)
            tHashtable.vProjectileLocation = vHookPos
            if (hTarget) {
                ParticleManager.SetParticleControlEnt(tHashtable.iParticleID, 1, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", (hTarget.GetAbsOrigin() + tHashtable.vHookOffset) as Vector, true)
                ParticleManager.SetParticleControl(tHashtable.iParticleID, 4, Vector(0, 0, 0))
                ParticleManager.SetParticleControl(tHashtable.iParticleID, 5, Vector(1, 0, 0))
            }
            else {
                if (tHashtable.bChainAttached == false) {
                    ParticleManager.SetParticleControlEnt(tHashtable.iParticleID, 1, tHashtable.hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_weapon_chain_rt", (tHashtable.hCaster.GetAbsOrigin() + tHashtable.vHookOffset) as Vector, true)
                }
                else {
                    ParticleManager.SetParticleControlEnt(tHashtable.iParticleID, 1, tHashtable.hCaster, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, null, (tHashtable.vStartPosition + tHashtable.vHookOffset) as Vector, true)
                    ParticleManager.SetParticleControl(tHashtable.iParticleID, 1, (tHashtable.vStartPosition + tHashtable.vHookOffset) as Vector)
                }
            }
            if (tHashtable.hCaster.IsAlive()) {
                tHashtable.hCaster.RemoveGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_1)
                tHashtable.hCaster.StartGesture(GameActivity_t.ACT_DOTA_CHANNEL_ABILITY_1)
            }
            tHashtable.bRetracting = true;
            return true
        }
        // 拉回来
        else {
            if (hTarget == null) {
                if (tHashtable.hCaster) {
                    let hModel = tHashtable.hCaster.FirstMoveChild()
                    while (hModel != null) {
                        if (hModel.GetClassname() == "dota_item_wearable" && hModel.GetModelName() != "") {
                            if (hModel.GetModelName() == ResHelper.GetModelReplacement("models/heroes/pudge/righthook.vmdl", tHashtable.hCaster)) {
                                hModel.RemoveEffects(EntityEffects.EF_NODRAW)
                            }
                        }
                        hModel = hModel.NextMovePeer()
                    }
                }
                for (let i = tHashtable.tVictim.length - 1; i >= 0; i--) {
                    let hVictim = tHashtable.tVictim[i]
                    if (GameFunc.IsValid(hVictim)) {
                        let vFinalHookPos = vLocation
                        modifier_pudge_1_buff.remove(hVictim)
                        let vVictimPosCheck = (hVictim.GetOrigin() - vFinalHookPos) as Vector;
                        let flPad = tHashtable.hCaster.GetPaddedCollisionRadius() + hVictim.GetPaddedCollisionRadius()
                        if (vVictimPosCheck.Length2D() > flPad) {
                            FindClearSpaceForUnit(hVictim, tHashtable.vStartPosition, false)
                        }
                        table.remove(tHashtable.tVictim, i)
                    }
                }
                tHashtable.tVictim = []
                ParticleManager.DestroyParticle(tHashtable.iParticleID, true)
                tHashtable.hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Pudge.AttackHookRetractStop", tHashtable.hCaster))
                HashTableHelper.RemoveHashtable(tHashtable)
            }
            return hTarget == null
        }

    }

    OnProjectileThink_ExtraData(vLocation: Vector, ExtraData: IModifierTable) {
        let tHashtable = HashTableHelper.GetHashtableByIndex(ExtraData.hashtableUUid)
        // 更新实时位置
        tHashtable.vProjectileLocation = vLocation
        let vToCaster = (tHashtable.vStartPosition - tHashtable.hCaster.GetAbsOrigin()) as Vector
        let flDist = vToCaster.Length2D()
        if (tHashtable.bChainAttached == false && flDist > 128) {
            tHashtable.bChainAttached = true
            ParticleManager.SetParticleControlEnt(tHashtable.iParticleID, 0, tHashtable.hCaster, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, null, tHashtable.vStartPosition + tHashtable.vHookOffset, true)
            ParticleManager.SetParticleControl(tHashtable.iParticleID, 0, tHashtable.vStartPosition + tHashtable.vHookOffset)
            if (tHashtable.tVictim.length == 0) {
                ParticleManager.SetParticleControlEnt(tHashtable.iParticleID, 1, tHashtable.hCaster, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, null, tHashtable.vStartPosition + tHashtable.vHookOffset, true)
                if (tHashtable.bRetracting == true) {
                    ParticleManager.SetParticleControl(tHashtable.iParticleID, 1, tHashtable.vStartPosition + tHashtable.vHookOffset)
                }
                else {
                    ParticleManager.SetParticleControl(tHashtable.iParticleID, 1, tHashtable.vHookTarget)
                }
            }
        }

    }
    OnOwnerDied() {
        super.OnOwnerDied()
        this.GetCasterPlus().RemoveGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_1)
        this.GetCasterPlus().RemoveGesture(GameActivity_t.ACT_DOTA_CHANNEL_ABILITY_1)
    }


}


@registerModifier()
export class modifier_pudge_1_buff extends BaseModifierMotionHorizontal_Plus {
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
    RemoveOnDeath() {
        return false
    }

    incoming_bleed_damage: number;
    Init(params: IModifierTable) {
        this.incoming_bleed_damage = this.GetSpecialValueFor("incoming_bleed_damage")
    }
    iHashtableIndex: string;
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.iHashtableIndex = params.hashtableUUid;
            let item = item_towerchange_custom.FindInUnit(this.GetParentPlus())
            if (item) {
                item.SetShareability(EShareAbility.ITEM_FULLY_SHAREABLE)
                this.GetCasterPlus().AddItem(item);
                item.SetOwner(this.GetCasterPlus())
                item.SetParent(this.GetCasterPlus(), "")
            }
            // avalon 偷东西
            if (this.ApplyHorizontalMotionController()) {
                this.GetParent().EmitSound("Hero_Pudge.AttackHookRetract")
            }
            else {
                this.addFrameTimer(1, () => {
                    this.UpdateHorizontalMotion(this.GetParent(), 1 / 30)
                    return 1
                })
            }
        }
    }

    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            this.GetParent().RemoveHorizontalMotionController(this)
            let tHashtable = HashTableHelper.GetHashtableByIndex(this.iHashtableIndex)
            if (GameFunc.IsValid(tHashtable.hCaster)) {
                ParticleManager.SetParticleControlEnt(tHashtable.iParticleID, 1, tHashtable.hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_weapon_chain_rt", tHashtable.hCaster.GetAbsOrigin() + tHashtable.vHookOffset, true)
            }
            this.GetParent().StopSound("Hero_Pudge.AttackHookRetract")
        }
    }
    UpdateHorizontalMotion(me: CDOTA_BaseNPC, dt: number) {
        if (IsServer()) {
            let tHashtable = HashTableHelper.GetHashtableByIndex(this.iHashtableIndex)
            let iParticleID = ResHelper.CreateParticle(
                {
                    resPath: "particles/units/heroes/hero_pudge/pudge_meathook_impact.vpcf",
                    resNpc: this.GetCasterPlus(),
                    iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                    owner: this.GetParent()
                })
            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParent(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParent().GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID);
            let v = GetGroundPosition(tHashtable.vProjectileLocation, this.GetParent());
            this.GetParent().SetAbsOrigin(v);
        }
    }
    OnHorizontalMotionInterrupted() {
        if (IsServer()) {
            this.Destroy()
        }
    }
    CheckState() {
        if (IsServer()) {
            if (this.GetCasterPlus() != null && this.GetParentPlus() != null) {
                return {
                    [modifierstate.MODIFIER_STATE_STUNNED]: true
                }
            }
        }
        return {}
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    OVERRIDE_ANIMATION = GameActivity_t.ACT_DOTA_FLAIL;

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_BLEED_DAMAGE_PERCENTAGE)
    GetIncomingBleedDamagePercentage() {
        return this.incoming_bleed_damage
    }
}