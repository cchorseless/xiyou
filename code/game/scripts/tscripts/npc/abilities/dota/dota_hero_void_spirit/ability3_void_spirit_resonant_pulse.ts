import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../modifier/modifier_event";
import { modifier_invisible } from "../../../modifier/modifier_invisible";

/** dota原技能数据 */
export const Data_void_spirit_resonant_pulse = { "ID": "7710", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_VoidSpirit.Pulse.Cast", "HasScepterUpgrade": "1", "AbilityCastRange": "0", "AbilityCastPoint": "0.0", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCastGestureSlot": "DEFAULT", "AbilityCooldown": "18", "AbilityManaCost": "115 120 125 130", "AbilitySpecial": { "10": { "var_type": "FIELD_FLOAT", "silence_duration_scepter": "2.0" }, "01": { "var_type": "FIELD_INTEGER", "radius": "500" }, "02": { "var_type": "FIELD_INTEGER", "speed": "1200" }, "03": { "var_type": "FIELD_INTEGER", "damage": "70 120 170 220", "LinkedSpecialBonus": "special_bonus_unique_void_spirit_4" }, "04": { "var_type": "FIELD_FLOAT", "buff_duration": "10.0" }, "05": { "var_type": "FIELD_INTEGER", "base_absorb_amount": "40 80 120 160" }, "06": { "var_type": "FIELD_INTEGER", "absorb_per_hero_hit": "30 45 60 75" }, "07": { "var_type": "FIELD_INTEGER", "return_projectile_speed": "900" }, "08": { "var_type": "FIELD_INTEGER", "max_charges": "2", "RequiresScepter": "1" }, "09": { "var_type": "FIELD_INTEGER", "charge_restore_time": "18", "RequiresScepter": "1" } } };

@registerAbility()
export class ability3_void_spirit_resonant_pulse extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "void_spirit_resonant_pulse";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_void_spirit_resonant_pulse = Data_void_spirit_resonant_pulse;
    Init() {
        this.SetDefaultSpecialValue("buff_duration", 10);
        this.SetDefaultSpecialValue("radius", 700);
        this.SetDefaultSpecialValue("speed", 1680);
        this.SetDefaultSpecialValue("damage", [900, 1000, 1100, 1300, 1600, 1900]);
        this.SetDefaultSpecialValue("extra_damage_pct", [170, 240, 310, 380, 450, 520]);
        this.SetDefaultSpecialValue("base_absorb_amount", [400, 600, 800, 1000, 1200, 1500]);
        this.SetDefaultSpecialValue("absorb_per_hero_hit", [200, 300, 400, 500, 600, 700]);
        this.SetDefaultSpecialValue("return_projectile_speed", 900);
        this.SetDefaultSpecialValue("silence_duration_scepter", 1);

    }



    GetCooldown(iLevel: number) {
        return super.GetCooldown(iLevel) - this.GetOriCaster().GetTalentValue("special_bonus_unique_void_spirit_custom_2")
    }

    GetIntrinsicModifierName() {
        return "modifier_void_spirit_2"
    }

    GetCastRange(vLocation: Vector, hTarget: BaseNpc_Plus) {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        this.UseIllusionSpell()
        this.FullUseSpell()
    }
    FullUseSpell() {
        let hCaster = this.GetCasterPlus()

        let hOri = this.GetOriCaster()
        //   modifier_void_spirit_2_hit_charge.apply( hOri , hOri, this, {
        //  	duration = this.GetSpecialValueFor("buff_duration")
        //  })
        if (this.GetCasterPlus() == (this && this.GetOriCaster && this.GetOriCaster())) {
            modifier_void_spirit_2_buff.apply(hCaster, hCaster, this, {
                duration: this.GetSpecialValueFor("buff_duration")
            })
        }
        this.UseSpell()
        if (hOri.HasScepter()) {
            let silence_duration_scepter = this.GetSpecialValueFor("silence_duration_scepter")
            hCaster.addTimer(silence_duration_scepter, () => {
                this.UseSpell()
            })
        }
    }
    UseSpell() {
        if (!GameFunc.IsValid(this)
            || !GameFunc.IsValid(this.GetCasterPlus())) {
            return
        }

        let hCaster = this.GetCasterPlus()
        let speed = this.GetSpecialValueFor("speed")
        let radius = this.GetSpecialValueFor("radius")

        hCaster.EmitSound('Hero_VoidSpirit.Pulse.Cast')

        let fCurRange = speed * FrameTime()
        let tCurDamageTargets = [] as any[]
        let vOrign = hCaster.GetAbsOrigin()

        //  幻象共鸣脉冲击中的单位也会提升本体的攻击
        let hOri = this.GetOriCaster()
        //  let hBuff  = modifier_void_spirit_2_hit_charge.findIn(  hOri )
        //  对圈内敌人造成伤害，剔除已伤害过的
        let DamageRadius = () => {
            let hEnemies = FindUnitsInRadius(
                hCaster.GetTeamNumber(),
                vOrign,
                null,
                fCurRange,
                DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                this.GetAbilityTargetType(),
                this.GetAbilityTargetFlags(),
                FindOrder.FIND_ANY_ORDER,
                false);
            for (let hTarget of (hEnemies as BaseNpc_Plus[])) {
                if (tCurDamageTargets.indexOf(hTarget) == null) {
                    modifier_void_spirit_2_hit_charge.apply(hOri, hOri, this, {
                        duration: this.GetSpecialValueFor("buff_duration")
                    })
                    hTarget.EmitSound('Hero_VoidSpirit.Pulse.Target')
                    this.GoApplyDamage(hTarget)
                    let iPtclID = ResHelper.CreateParticle({
                        resPath: "particles/units/heroes/hero_void_spirit/pulse/void_spirit_pulse_impact.vpcf",
                        resNpc: null,
                        iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                        owner: hTarget
                    });

                    ParticleManager.SetParticleControlEnt(iPtclID, 1, hTarget, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), false)
                    table.insert(tCurDamageTargets, hTarget)
                }
            }
        }

        DamageRadius()
        hCaster.addFrameTimer(1, () => {
            fCurRange = math.min(fCurRange + speed * FrameTime(), radius)
            DamageRadius()
            if (fCurRange < radius) {
                return 1
            }
        })

        // 脉冲
        //  LocalPlayerAbilityParticle(this,  () => {
        let iPtclID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_void_spirit/pulse/void_spirit_2_pulse.vpcf",
            resNpc: null,
            iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
            owner: hCaster
        });

        ParticleManager.SetParticleControl(iPtclID, 1, Vector(speed, 0, 0))
        //  }, PARTICLE_DETAIL_LEVEL_MEDIUM)
    }
    //  这个技能都用这个应用伤害
    GoApplyDamage(hTarget: BaseNpc_Plus) {
        if (!GameFunc.IsValid(hTarget)) {
            return
        }
        let hCaster = this.GetCasterPlus() as BaseNpc_Plus & { hParent: BaseNpc_Plus, IsDummy: boolean, tIlls: any[], iActivePct: number };
        let iDamagePct = 100
        if (GameFunc.IsValid(hCaster.hParent)
            && hCaster.IsDummy) {
            hCaster = hCaster.hParent as BaseNpc_Plus & { hParent: BaseNpc_Plus, IsDummy: boolean, tIlls: any[], iActivePct: number };
            //  灵扉只造成一定百分比伤害
            // iDamagePct = hCaster.iDamagePct
            // iDamagePct = iDamagePct + (hCaster.HasShard() && hCaster.all_damage_amplify || 0) + hCaster.GetTalentValue('special_bonus_unique_void_spirit_custom_8')
        }

        let fDamage = this.GetSpecialValueFor("damage")
        let extra_damage_pct = this.GetSpecialValueFor("extra_damage_pct")
        if (hCaster.HasTalent('special_bonus_unique_void_spirit_custom_5')) {
            extra_damage_pct = extra_damage_pct + hCaster.GetTalentValue('special_bonus_unique_void_spirit_custom_5')
        }
        fDamage = fDamage + hCaster.GetAverageTrueAttackDamage(null) * extra_damage_pct * 0.01
        fDamage = fDamage * (iDamagePct * 0.01)

        let damage_table = {
            ability: this,
            victim: hTarget,
            attacker: hCaster,
            damage: fDamage,
            damage_type: this.GetAbilityDamageType(),
        }
        BattleHelper.GoApplyDamage(damage_table)
    }
    //  触发被动
    UseIllusionSpell() {
        if (!GameFunc.IsValid(this)
            || !GameFunc.IsValid(this.GetCasterPlus())) {
            return
        }

        let hCaster = this.GetCasterPlus() as BaseNpc_Plus & { hParent: BaseNpc_Plus, IsDummy: boolean, tIlls: any[], iActivePct: number };
        if (GameFunc.IsValid(hCaster)
            && !hCaster.IsIllusion()
            && !hCaster.IsDummy
            && hCaster.tIlls) {
            let hOriAbility = ability3_void_spirit_resonant_pulse.findIn(hCaster)
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
                        let hAbility = ability3_void_spirit_resonant_pulse.findIn(hIll)
                        if (!GameFunc.IsValid(hAbility)) {
                            hAbility = hIll.AddAbility("void_spirit_2")
                            hAbility.SetLevel(iOriLevel)
                        }
                        let iLevel = hAbility.GetLevel()
                        if (iLevel != iOriLevel) {
                            hAbility.SetLevel(iOriLevel)
                        }
                        hAbility.FullUseSpell()
                        hIll.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_4)
                        //  ExecuteOrderFromTable({
                        //  	UnitIndex : hIll.entindex(),
                        //  	OrderType : dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                        //  	AbilityIndex : hAbility.entindex(),
                        //  })
                    }
                }
            }
        }
    }
    GetOriCaster() {
        let hCaster = this.GetCasterPlus() as BaseNpc_Plus & { hParent: BaseNpc_Plus, IsDummy: boolean, tIlls: any[], iActivePct: number };
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
export class modifier_void_spirit_2 extends BaseModifier_Plus {
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

    OnIntervalThink() {
        if (!IsServer()) {
            return
        }
        let hAbility = this.GetAbilityPlus()
        if (!GameFunc.IsValid(hAbility)) {
            this.StartIntervalThink(-1)
            this.Destroy()
            return
        }

        let hCaster = hAbility.GetCasterPlus() as BaseNpc_Plus & { hParent: BaseNpc_Plus, IsDummy: boolean, tIlls: any[], iActivePct: number };

        if (hCaster.IsTempestDouble() || hCaster.IsIllusion() || hCaster.IsDummy) {
            this.StartIntervalThink(-1)
            return
        }

        if (!hAbility.GetAutoCastState()) {
            return
        }

        if (!hAbility.IsAbilityReady()) {
            return
        }

        let fRange = hAbility.GetCastRange(hCaster.GetAbsOrigin(), hCaster) + hCaster.GetCastRangeBonus()
        let teamFilter = hAbility.GetAbilityTargetTeam()
        let typeFilter = hAbility.GetAbilityTargetType()
        let flagFilter = hAbility.GetAbilityTargetFlags()
        let order = FindOrder.FIND_CLOSEST
        let targets = FindUnitsInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), null, fRange, teamFilter, typeFilter, flagFilter, order, false)
        if (targets[0] != null) {
            ExecuteOrderFromTable({
                UnitIndex: hCaster.entindex(),
                OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                AbilityIndex: hAbility.entindex(),
            })
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_void_spirit_2_buff// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_void_spirit_2_buff extends BaseModifier_Plus {
    base_absorb_amount: number;
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
    GetStatusEffectName() {
        return "particles/status_fx/status_effect_void_spirit_pulse_buff.vpcf"
    }
    StatusEffectPriority() {
        return 100
    }
    GetEffectName() {
        return "particles/units/heroes/hero_void_spirit/pulse/void_spirit_pulse_buff.vpcf"
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let iPtclID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_void_spirit/pulse/void_spirit_pulse_shield.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_CENTER_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControlEnt(iPtclID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), false)
            ParticleManager.SetParticleControl(iPtclID, 1, Vector(this.GetParentPlus().GetModelRadius(), 0, 0))
            this.AddParticle(iPtclID, false, false, -1, false, false)
        }
    }
    Init(params: ModifierTable) {
        this.base_absorb_amount = this.GetSpecialValueFor("base_absorb_amount")
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            this.GetParentPlus().EmitSound('Hero_VoidSpirit.Pulse.Destroy')
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage() {
        return this.base_absorb_amount
    }
}

// // // // // // // // // // // // // // // // // // // -modifier_void_spirit_2_hit_charge// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_void_spirit_2_hit_charge extends BaseModifier_Plus {
    absorb_per_hero_hit: number;
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
        this.absorb_per_hero_hit = this.GetSpecialValueFor("absorb_per_hero_hit")
        if (IsServer()) {
            this.IncrementStackCount()
            this.addTimer(params.duration, () => {
                this.DecrementStackCount()
            })
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage() {
        return this.absorb_per_hero_hit * this.GetStackCount()
    }


}
