import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
/** dota原技能数据 */
export const Data_void_spirit_astral_step = { "ID": "7705", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "FightRecapLevel": "1", "AbilitySound": "Hero_VoidSpirit.AstralStep.Start", "AnimationPlaybackRate": "1.5", "AbilityCastPoint": "0.2", "AbilityCooldown": "0", "AbilityCharges": "2", "AbilityChargeRestoreTime": "28 23 18", "AbilityManaCost": "100", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "170" }, "02": { "var_type": "FIELD_INTEGER", "AbilityCharges": "", "LinkedSpecialBonus": "special_bonus_unique_void_spirit_9" }, "03": { "var_type": "FIELD_INTEGER", "AbilityChargeRestoreTime": "", "LinkedSpecialBonus": "special_bonus_unique_void_spirit_1" }, "04": { "var_type": "FIELD_INTEGER", "min_travel_distance": "200" }, "05": { "var_type": "FIELD_INTEGER", "max_travel_distance": "700 850 1000" }, "06": { "var_type": "FIELD_FLOAT", "pop_damage_delay": "1.25" }, "07": { "var_type": "FIELD_INTEGER", "pop_damage": "150 200 250" }, "08": { "var_type": "FIELD_INTEGER", "movement_slow_pct": "40 60 80" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability6_void_spirit_astral_step extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "void_spirit_astral_step";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_void_spirit_astral_step = Data_void_spirit_astral_step;
    Init() {
        this.SetDefaultSpecialValue("chain_damage_intellect", [7, 8, 9, 10, 11, 13]);
        this.SetDefaultSpecialValue("radius", 280);
        this.SetDefaultSpecialValue("min_travel_distance", 200);
        this.SetDefaultSpecialValue("max_travel_distance", 1100);
        this.SetDefaultSpecialValue("pop_damage_delay", 1.25);
        this.SetDefaultSpecialValue("pop_damage", [500, 800, 1100, 1400, 1700, 2000]);
        this.SetDefaultSpecialValue("movement_slow_pct", 40);
        this.SetDefaultSpecialValue("damage_radius", 300);

    }


    GetCooldown(iLevel: number) {
        return super.GetCooldown(iLevel) - this.GetOriCaster().GetTalentValue("special_bonus_unique_void_spirit_custom_6")
    }
    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        if (IsClient()) {
            return this.GetSpecialValueFor("max_travel_distance")
        }
    }
    //  触发被动
    UseIllusionSpell() {
        if (!GameFunc.IsValid(this)
            || !GameFunc.IsValid(this.GetCasterPlus())) {
            return
        }

        let hCaster = this.GetCasterPlus() as IBaseNpc_Plus & { hParent: IBaseNpc_Plus, IsDummy: boolean, tIlls: any[], iActivePct: number };
        if (GameFunc.IsValid(hCaster)
            && !hCaster.IsIllusion()
            && !hCaster.IsDummy
            && hCaster.tIlls) {
            let hOriAbility = ability6_void_spirit_astral_step.findIn(hCaster)
            let iOriLevel = GameFunc.IsValid(hOriAbility) && hOriAbility.GetLevel() || -1
            if (iOriLevel <= 0) {
                return
            }

            //  灵扉施法
            for (let hIll of (hCaster.tIlls)) {

                if (GameFunc.IsValid(hIll) && hIll.bActive) {
                    //  激活概率判断
                    let iActivePct = hCaster.iActivePct
                    if (RandomInt(1, 100) < iActivePct) {
                        let hAbility = ability6_void_spirit_astral_step.findIn(hIll)
                        if (!GameFunc.IsValid(hAbility)) {
                            hAbility = hIll.AddAbility("ability6_void_spirit_astral_step")
                            hAbility.SetLevel(iOriLevel)
                        }
                        let iLevel = hAbility.GetLevel()
                        if (iLevel != iOriLevel) {
                            hAbility.SetLevel(iOriLevel)
                        }

                        //  hIll.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2)
                        hIll.SetForwardVector(hCaster.GetForwardVector())
                        hAbility.FullUseSpell(hIll, this.GetCursorPosition())
                        //  ExecuteOrderFromTable({
                        //  	UnitIndex : hIll.entindex(),
                        //  	OrderType : dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        //  	AbilityIndex : hAbility.entindex(),
                        //  	Position : this.GetCursorPosition(),
                        //  })
                    }
                }
            }
        }
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPos = this.GetCursorPosition()

        this.UseIllusionSpell()

        this.FullUseSpell(hCaster, vPos)
    }
    FullUseSpell(hCaster: IBaseNpc_Plus, vPos: Vector) {
        let hAbility = this
        if (this.GetCasterPlus() == (hAbility && hAbility.GetOriCaster && hAbility.GetOriCaster())) {
            hCaster.EmitSound("Hero_VoidSpirit.AstralStep.Start")
        }

        let min_travel_distance = this.GetSpecialValueFor("min_travel_distance")
        let max_travel_distance = this.GetSpecialValueFor("max_travel_distance")

        let vOrigin = hCaster.GetAbsOrigin()
        let vDir = ((vPos - hCaster.GetAbsOrigin()) as Vector).Normalized()
        let fDis = math.min(max_travel_distance, math.max(((vPos - hCaster.GetAbsOrigin()) as Vector).Length2D(), min_travel_distance))
        let vTarget = (hCaster.GetAbsOrigin() + vDir * fDis) as Vector
        //  单向延迟
        let fDealy = 0.3

        hCaster.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_2_END)
        this.UseSpell(vOrigin, vTarget, vDir, fDealy)

        let hOriCaster = this.GetOriCaster()
        if (hOriCaster.HasTalent('special_bonus_unique_void_spirit_custom_7')) {
            vDir = ((vOrigin - vTarget) as Vector).Normalized()
            this.addTimer(0.2, () => {
                this.UseSpell(vTarget, vOrigin, vDir, fDealy)
            })
        }
    }
    UseSpell(vOrigin: Vector, vTarget: Vector, vDir: Vector, fDealy: number) {
        if (!GameFunc.IsValid(this)
            || !GameFunc.IsValid(this.GetCasterPlus())) {
            return
        }

        let hCaster = this.GetCasterPlus() as IBaseNpc_Plus & { hParent: IBaseNpc_Plus, IsDummy: boolean, tIlls: any[], iActivePct: number };
        let radius = this.GetSpecialValueFor("radius")
        let pop_damage_delay = this.GetSpecialValueFor("pop_damage_delay")
        let tEnemies = FindUnitsInLine(
            hCaster.GetTeamNumber(),
            vOrigin,
            vTarget,
            null,
            radius,
            this.GetAbilityTargetTeam(),
            this.GetAbilityTargetType(),
            this.GetAbilityTargetFlags()
        )

        // 造成攻击
        let hAttacker = hCaster
        if (GameFunc.IsValid(hCaster.hParent)
            && hCaster.IsDummy) {
            hAttacker = hCaster.hParent as any
        }
        for (let hTarget of (tEnemies as IBaseNpc_Plus[])) {
            BattleHelper.Attack(hAttacker, hTarget, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NEVERMISS)
            if (hTarget.IsAlive()) {
                modifier_void_spirit_6_slow.apply(hTarget, hCaster, this, { duration: pop_damage_delay })
            }
        }
        // 位移特效
        let iPtclID = ResHelper.CreateParticle({
            resPath: 'particles/units/heroes/hero_void_spirit/astral_step/void_spirit_astral_step.vpcf',
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            owner: null
        });

        ParticleManager.SetParticleControl(iPtclID, 0, vOrigin)
        ParticleManager.SetParticleControl(iPtclID, 1, vTarget)
        //  刀光特效
        iPtclID = ResHelper.CreateParticle({
            resPath: 'particles/units/heroes/hero_void_spirit/void_spirit_attack_travel_strike_blur.vpcf',
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN,
            owner: hCaster
        });

        ParticleManager.SetParticleControl(iPtclID, 0, vTarget)
    }

    GetIntrinsicModifierName() {
        return "modifier_void_spirit_6"
    }

    //  这个技能都用这个应用伤害
    GoApplyDamage(hTarget: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hTarget)) {
            return
        }

        let hCaster = this.GetCasterPlus() as IBaseNpc_Plus & { hParent: IBaseNpc_Plus, IsDummy: boolean, tIlls: any[], iActivePct: number };
        let fDamage = this.GetSpecialValueFor("pop_damage")
        //  引爆智力伤害系数
        let chain_damage_intellect = this.GetSpecialValueFor("chain_damage_intellect") + hCaster.GetTalentValue('special_bonus_unique_void_spirit_custom_4')
        let iDamagePct = 100
        if (GameFunc.IsValid(hCaster.hParent) && hCaster.IsDummy) {
            // hCaster = hCaster.hParent
            // iDamagePct = hCaster.iDamagePct
            // iDamagePct = iDamagePct + (hCaster.HasShard() && hCaster.all_damage_amplify || 0) + hCaster.GetTalentValue('special_bonus_unique_void_spirit_custom_8')
        }
        fDamage = fDamage + hCaster.GetIntellect() * chain_damage_intellect
        fDamage = fDamage * (iDamagePct * 0.01)
        let damage_table = {
            ability: this,
            victim: hTarget,
            attacker: hCaster,
            damage: fDamage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            eom_flags: BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_SHOW_DAMAGE_NUMBER,
        }
        BattleHelper.GoApplyDamage(damage_table)
    }
    GetOriCaster() {
        let hCaster = this.GetCasterPlus() as IBaseNpc_Plus & { hParent: IBaseNpc_Plus, IsDummy: boolean, tIlls: any[], iActivePct: number };
        if (GameFunc.IsValid(hCaster.hParent)
            && hCaster.IsDummy) {
            hCaster = hCaster.hParent as any
        }
        return hCaster
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
//  Modifiers
@registerModifier()
export class modifier_void_spirit_6 extends BaseModifier_Plus {
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
            let ability = this.GetAbilityPlus()
            if (!GameFunc.IsValid(ability)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let hCaster = ability.GetCasterPlus() as IBaseNpc_Plus & { hParent: IBaseNpc_Plus, IsDummy: boolean, tIlls: any[], iActivePct: number };

            if (!ability.GetAutoCastState()) {
                return
            }

            if (hCaster.IsTempestDouble() || hCaster.IsIllusion() || hCaster.IsDummy) {
                this.StartIntervalThink(-1)
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }

            let range = ability.GetSpecialValueFor("max_travel_distance") + hCaster.GetCastRangeBonus()
            let start_width = ability.GetSpecialValueFor("radius")
            let end_width = ability.GetSpecialValueFor("radius")

            let position = AoiHelper.GetLinearMostTargetsPosition(hCaster.GetAbsOrigin(), range, hCaster.GetTeamNumber(), start_width, end_width, null, ability.GetAbilityTargetTeam(), ability.GetAbilityTargetType(), ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_CLOSEST)

            if (position != vec3_invalid && hCaster.IsPositionInRange(position, range)) {
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

// // // // // // // // // // // // // // // // // // // -modifier_void_spirit_6_slow// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_void_spirit_6_slow extends BaseModifier_Plus {
    movement_slow_pct: number;
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
    GetStatusEffectName() {
        return 'particles/status_fx/status_effect_void_spirit_astral_step_debuff.vpcf'
    }
    StatusEffectPriority() {
        return 10
    }
    GetEffectName() {
        return ResHelper.GetParticleReplacement('particles/units/heroes/hero_void_spirit/astral_step/void_spirit_astral_step_debuff.vpcf', this.GetCasterPlus())
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_CENTER_FOLLOW
    }
    ShouldUseOverheadOffset() {
        return true
    }
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        this.movement_slow_pct = this.GetSpecialValueFor("movement_slow_pct")
        let iPtclID = ResHelper.CreateParticle({
            resPath: 'particles/units/heroes/hero_void_spirit/astral_step/void_spirit_astral_step_impact.vpcf',
            resNpc: this.GetCasterPlus(),
            iAttachment: ParticleAttachment_t.PATTACH_POINT_FOLLOW,
            owner: this.GetParentPlus()
        });

        this.AddParticle(iPtclID, false, false, -1, false, true)
    }

    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus() as ability6_void_spirit_astral_step
            let damage_radius = this.GetSpecialValueFor("damage_radius")

            if (GameFunc.IsValid(hParent) && GameFunc.IsValid(hAbility)) {
                let tEnemies = FindUnitsInRadius(
                    hCaster.GetTeamNumber(),
                    hParent.GetAbsOrigin(),
                    null,
                    damage_radius,
                    hAbility.GetAbilityTargetTeam(),
                    hAbility.GetAbilityTargetType(),
                    hAbility.GetAbilityTargetFlags(),
                    FindOrder.FIND_ANY_ORDER,
                    false
                )

                for (let hTarget of (tEnemies as IBaseNpc_Plus[])) {
                    if (hAbility.GoApplyDamage) {
                        hAbility.GoApplyDamage(hTarget)
                    }
                }
            }
        }

        let iPtclID = ResHelper.CreateParticle({
            resPath: 'particles/units/heroes/hero_void_spirit/astral_step/void_spirit_astral_step_dmg.vpcf',
            resNpc: this.GetCasterPlus(),
            iAttachment: ParticleAttachment_t.PATTACH_POINT_FOLLOW,
            owner: this.GetParentPlus()
        });

        ParticleManager.ReleaseParticleIndex(iPtclID)
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage() {
        return -this.movement_slow_pct
    }
}
