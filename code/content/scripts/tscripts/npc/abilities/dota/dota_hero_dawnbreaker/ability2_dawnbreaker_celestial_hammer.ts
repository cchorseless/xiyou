import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_dawnbreaker_celestial_hammer = { "ID": "7914", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilityCastPoint": "0.25", "AbilityCooldown": "18 16 14 12", "AbilityManaCost": "110 120 130 140", "AbilitySpecial": { "10": { "var_type": "FIELD_INTEGER", "hammer_aoe_radius": "250" }, "11": { "var_type": "FIELD_INTEGER", "travel_speed_pct": "100" }, "12": { "var_type": "FIELD_INTEGER", "return_anim_distance_threshold": "300" }, "13": { "var_type": "FIELD_INTEGER", "range": "1000 1100 1200 1300" }, "01": { "var_type": "FIELD_INTEGER", "hammer_damage": "60 90 120 150", "LinkedSpecialBonus": "special_bonus_unique_dawnbreaker_celestial_blade" }, "02": { "var_type": "FIELD_INTEGER", "projectile_radius": "150" }, "03": { "var_type": "FIELD_INTEGER", "projectile_speed": "1500" }, "04": { "var_type": "FIELD_FLOAT", "flare_debuff_duration": "2.5" }, "05": { "var_type": "FIELD_INTEGER", "flare_radius": "150" }, "06": { "var_type": "FIELD_INTEGER", "move_slow": "35" }, "07": { "var_type": "FIELD_INTEGER", "burn_damage": "20 30 40 50" }, "08": { "var_type": "FIELD_FLOAT", "burn_interval": "0.5" }, "09": { "var_type": "FIELD_FLOAT", "pause_duration": "2" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_dawnbreaker_celestial_hammer extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "dawnbreaker_celestial_hammer";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_dawnbreaker_celestial_hammer = Data_dawnbreaker_celestial_hammer;
    Init() {
        this.SetDefaultSpecialValue("projectile_radius", 150);
        this.SetDefaultSpecialValue("hammer_stu_time", 2);
        this.SetDefaultSpecialValue("atk_speed_add", 400);
        this.SetDefaultSpecialValue("atk_speed_roof_add", 300);
        this.SetDefaultSpecialValue("hammer_base_damage", [500, 800, 1300, 2100, 3100, 5000]);
        this.SetDefaultSpecialValue("hammer_strength_factor", [4, 5, 6, 7, 8, 9]);
        this.SetDefaultSpecialValue("damage_area_continue_time", 4);
        this.SetDefaultSpecialValue("damage_area_width", 200);
        this.SetDefaultSpecialValue("damage_area_strength_factor", [4, 5, 6, 7, 8, 9]);
        this.SetDefaultSpecialValue("duration", 6);
        this.SetDefaultSpecialValue("projectile_speed", 1500);

    }

    iDamage: number;
    vPoint: Vector;
    vStartPosition: Vector;
    fDistance: any;
    projectile_speed: number;
    projectile_radius: number;
    damage_area_continue_time: number;
    damage_area_width: number;
    damage_area_strength_factor: number;
    private _Particleid: ParticleID;
    goto_Projectile: ProjectileID;
    return_Projectile: ProjectileID;


    GetCastAnimation() {
        let hCaster = this.GetCasterPlus()
        if (hCaster.HasTalent("special_bonus_unique_dawnbreaker_custom_2")) {
            return GameActivity_t.ACT_RESET
        }
        return super.GetCastAnimation()
    }
    GetCastPoint() {
        let caster = this.GetCasterPlus()
        if (caster.HasTalent("special_bonus_unique_dawnbreaker_custom_2")) {
            return 0
        }
        return super.GetCastPoint()
    }
    CastFilterResultLocation(v: Vector) {
        let caster = this.GetCasterPlus() as IBaseNpc_Plus & { no_hammer: boolean }
        //  没有锤子无法释放
        if (caster.no_hammer == true) {
            this.errorStr = "dota_hud_error_dawnbreaker_no_hammer"
            return UnitFilterResult.UF_FAIL_CUSTOM
        }
        return UnitFilterResult.UF_SUCCESS
    }


    OnSpellStart() {
        // -@type CDOTA_BaseNPC
        let hCaster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration")
        //  增加攻速 和 攻速上限
        modifier_dawnbreaker_2_buff_attack.apply(hCaster, hCaster, this, { duration: duration })
        let extra_streng_damage = this.GetSpecialValueFor("hammer_strength_factor") * hCaster.GetStrength()
        this.iDamage = this.GetSpecialValueFor("hammer_base_damage") + extra_streng_damage
        this.vPoint = this.GetCursorPosition()
        this.vStartPosition = hCaster.GetAbsOrigin()
        this.fDistance = ((this.vPoint - this.vStartPosition) as Vector).Length()
        this.projectile_speed = this.GetSpecialValueFor("projectile_speed")
        this.projectile_radius = this.GetSpecialValueFor("projectile_radius")
        this.damage_area_continue_time = this.GetSpecialValueFor("damage_area_continue_time")
        this.damage_area_width = this.GetSpecialValueFor("damage_area_width")
        this.damage_area_strength_factor = this.GetSpecialValueFor("damage_area_strength_factor")
        //  播放动画
        this.addTimer(29 * 0.01,
            () => {
                this.createfirstProjectile()
            })
        //  音效
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Dawnbreaker.Celestial_Hammer.Cast", hCaster))

    }
    //  获取锤子保留时间
    getHammer_stu_time() {
        return this.GetSpecialValueFor("hammer_stu_time")
    }


    //  锤子旋转动画
    createfirstProjectile() {
        let hCaster = this.GetCasterPlus()
        this._Particleid = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_dawnbreaker/dawnbreaker_celestial_hammer_projectile.vpcf",
            resNpc: null,
            iAttachment: ParticleAttachment_t.PATTACH_POINT,
            owner: hCaster
        });

        let vDirection = ((this.vPoint - this.vStartPosition) as Vector).Normalized()
        let tInfo: CreateLinearProjectileOptions = {
            Source: hCaster,
            Ability: this,
            vSpawnOrigin: this.vStartPosition,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            fDistance: this.fDistance,
            fStartRadius: this.projectile_radius,
            fEndRadius: this.projectile_radius,
            vVelocity: (vDirection * this.projectile_speed) as Vector,
        }
        this.goto_Projectile = ProjectileManager.CreateLinearProjectile(tInfo)
        //  锤子旋转
        ParticleManager.SetParticleControl(this._Particleid, 1, (vDirection * this.projectile_speed) as Vector)
        ParticleManager.SetParticleControl(this._Particleid, 4, Vector(3, 0, 0))
        //  音效
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Dawnbreaker.Celestial_Hammer.Projectile", hCaster))

    }
    //  锤子返回动画
    createReturnProjectile() {
        // -@type CDOTA_BaseNPC
        let hCaster = this.GetCasterPlus()
        this._Particleid = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_dawnbreaker/dawnbreaker_celestial_hammer_return.vpcf",
            resNpc: null,
            iAttachment: ParticleAttachment_t.PATTACH_POINT,
            owner: hCaster
        });

        let vDirection = ((this.vStartPosition - this.vPoint) as Vector).Normalized()
        let tInfo: CreateLinearProjectileOptions = {
            Source: hCaster,
            Ability: this,
            vSpawnOrigin: this.vPoint,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            fDistance: this.fDistance,
            fStartRadius: this.projectile_radius,
            fEndRadius: this.projectile_radius,
            vVelocity: (vDirection * this.projectile_speed) as Vector,
        }
        this.return_Projectile = ProjectileManager.CreateLinearProjectile(tInfo)
        //  锤子返回旋转
        ParticleManager.SetParticleControl(this._Particleid, 0, this.vPoint)
        ParticleManager.SetParticleControl(this._Particleid, 1, (this.vStartPosition + Vector(0, 0, 300)) as Vector)
        ParticleManager.SetParticleControl(this._Particleid, 2, Vector(this.projectile_speed, 0, 0))
        ParticleManager.SetParticleControl(this._Particleid, 4, Vector(3, 0, 0))
        //  音效
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Dawnbreaker.Celestial_Hammer.Return", hCaster))
        //  地面火焰
        //  有天赋有火焰路径
        if (hCaster.HasTalent("special_bonus_unique_dawnbreaker_custom_4")) {
            let vpoint = Vector(this.vPoint.x, this.vPoint.y, this.vPoint.z)
            let needTime = this.fDistance / this.projectile_speed
            this.addTimer(0.03,
                () => {
                    needTime = needTime - 0.03
                    if (needTime > 0) {
                        vpoint = (vpoint + vDirection * 40) as Vector
                        this.createBurnFire(vpoint, this.damage_area_continue_time)
                        return 0.03
                    }
                })
            //  音效
            hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Dawnbreaker.Celestial_Hammer.Burn", hCaster))
            //  造成伤害
            let fireTime = this.damage_area_continue_time
            let damage = hCaster.GetStrength() * this.damage_area_strength_factor
            this.addTimer(1,
                () => {
                    fireTime = fireTime - 1
                    if (fireTime < 0) {
                        return
                    }
                    let tTargets = FindUnitsInLine(hCaster.GetTeamNumber(), this.vStartPosition, this.vPoint, null, this.damage_area_width, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE)
                    for (let hTarget of (tTargets)) {
                        let tDamageTable: BattleHelper.DamageOptions = {
                            ability: this,
                            victim: hTarget,
                            attacker: hCaster,
                            damage: damage,
                            damage_type: this.GetAbilityDamageType()
                        }
                        BattleHelper.GoApplyDamage(tDamageTable)
                    }
                    return 1
                })
        }
    }

    //  创建地面燃烧特效
    createBurnFire(vpoint: Vector, t: number) {
        let hCaster = this.GetCasterPlus()
        let _Particle_fire_id = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_dawnbreaker/dawnbreaker_converge_burning_trail.vpcf",
            resNpc: null,
            iAttachment: ParticleAttachment_t.PATTACH_POINT,
            owner: hCaster
        });

        ParticleManager.SetParticleControl(_Particle_fire_id, 0, vpoint)
        ParticleManager.SetParticleControl(_Particle_fire_id, 1, this.vStartPosition)
        //  燃烧时间
        ParticleManager.SetParticleControl(_Particle_fire_id, 2, Vector(t, 0, 0))

    }

    OnProjectileHitHandle(hTarget: IBaseNpc_Plus, vLocation: Vector, projectileHandle: any) {
        let hCaster = this.GetCasterPlus()
        if (IsServer()) {
            if (GameFunc.IsValid(hTarget)) {
                //  造成伤害
                let tDamageTable = {
                    ability: this,
                    victim: hTarget,
                    attacker: hCaster,
                    damage: this.iDamage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    eom_flags: BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_DOT,
                }
                BattleHelper.GoApplyDamage(tDamageTable)
                //  音效
                hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Dawnbreaker.Celestial_Hammer.Impact", hCaster))

                //  到达目标点
            } else {
                if (projectileHandle == this.goto_Projectile) {
                    let iProjectile = ResHelper.CreateParticle({
                        resPath: "particles/units/heroes/hero_dawnbreaker/dawnbreaker_celestial_hammer_grounded.vpcf",
                        resNpc: null,
                        iAttachment: ParticleAttachment_t.PATTACH_POINT,
                        owner: hCaster
                    });

                    ParticleManager.SetParticleControl(iProjectile, 0, this.vPoint)
                    this.addTimer(this.getHammer_stu_time(),
                        () => {
                            ParticleManager.DestroyParticle(iProjectile, true)
                            //  播放返回锤子的动画
                            this.createReturnProjectile()
                        })

                } else {
                    if (projectileHandle == this.return_Projectile) {
                        //  播放收锤子动画
                        hCaster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2_END)
                        let _m = modifier_dawnbreaker_2_buff_attack.findIn(hCaster)
                        if (_m != null) {
                            _m.Destroy()
                        }
                    }
                }
                //  关闭锤子旋转动画
                ParticleManager.DestroyParticle(this._Particleid, true)
                return true
            }
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_dawnbreaker_2"
    }


}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_dawnbreaker_2 extends BaseModifier_Plus {
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
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
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
            let range = hAbility.GetCastRange(hCaster.GetAbsOrigin(), null) + hCaster.GetCastRangeBonus()
            let arrow_width = hAbility.GetSpecialValueFor("arrow_width")
            let vPosition = AoiHelper.GetLinearMostTargetsPosition(hCaster.GetAbsOrigin(), range, hCaster.GetTeamNumber(), arrow_width, arrow_width, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_CLOSEST)

            //  优先攻击目标
            let target = hCaster.GetAttackTarget()
            if (target != null && target.GetClassname() == "dota_item_drop") { target = null }
            if (target != null && !target.IsPositionInRange(hCaster.GetAbsOrigin(), range)) {
                target = null
            }
            if (target != null) {
                vPosition = target.GetAbsOrigin()
            }

            if (vPosition != vec3_invalid && hCaster.IsPositionInRange(vPosition, range)) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: hAbility.entindex(),
                    Position: vPosition
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_dawnbreaker_2_buff extends BaseModifier_Plus {
    powershot_damage: number;
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
    Init(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        this.powershot_damage = this.GetSpecialValueFor("powershot_damage") + hCaster.GetTalentValue("special_bonus_unique_dawnbreaker_custom_7")
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    GetDamageOutgoing_Percentage() {
        return this.powershot_damage
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_dawnbreaker_2_buff_attack extends BaseModifier_Plus {
    atk_speed_add: number;
    atk_speed_roof_add: number;
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let parent = this.GetParentPlus() as IBaseNpc_Plus & { no_hammer: boolean }
        //  标记没有锤子的状态
        parent.no_hammer = true

    }
    Init(params: IModifierTable) {
        this.atk_speed_add = this.GetSpecialValueFor("atk_speed_add")
        this.atk_speed_roof_add = this.GetSpecialValueFor("atk_speed_roof_add")
    }
    OnDestroy() {
        super.OnDestroy();
        let parent = this.GetParentPlus() as IBaseNpc_Plus & { no_hammer: boolean }
        parent.no_hammer = null
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    Get_ActivityTranslationModifiers() {
        return "no_hammer"
    }
    //  攻速提升
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant() {
        return this.atk_speed_add
    }
    //  攻速上限提升
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS)
    EOM_GetModifierMaximumAttackSpeedBonus(params: IModifierTable) {
        return this.atk_speed_roof_add
    }
}
