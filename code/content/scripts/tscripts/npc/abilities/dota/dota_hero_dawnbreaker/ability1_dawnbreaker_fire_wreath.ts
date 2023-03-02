import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";

/** dota原技能数据 */
export const Data_dawnbreaker_fire_wreath = { "ID": "7902", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_CAN_SELF_CAST | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_MOVEMENT | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "FightRecapLevel": "1", "AbilityCastPoint": "0.2", "AbilityCooldown": "17 15 13 11", "AbilityManaCost": "80", "AbilitySpecial": { "10": { "var_type": "FIELD_FLOAT", "sweep_stun_duration": "0.12" }, "11": { "var_type": "FIELD_FLOAT", "self_stun_duration": "0.2" }, "12": { "var_type": "FIELD_INTEGER", "swipe_slow": "-100" }, "13": { "var_type": "FIELD_INTEGER", "smash_distance_from_hero": "120" }, "14": { "var_type": "FIELD_FLOAT", "animation_rate": "0" }, "15": { "var_type": "FIELD_FLOAT", "turn_rate": "90" }, "01": { "var_type": "FIELD_FLOAT", "duration": "1.1" }, "02": { "var_type": "FIELD_INTEGER", "swipe_radius": "360" }, "03": { "var_type": "FIELD_INTEGER", "swipe_damage": "25 35 45 55" }, "04": { "var_type": "FIELD_INTEGER", "smash_radius": "250" }, "05": { "var_type": "FIELD_INTEGER", "smash_damage": "40 65 90 115" }, "07": { "var_type": "FIELD_INTEGER", "movement_speed": "215" }, "08": { "var_type": "FIELD_INTEGER", "total_attacks": "3" }, "09": { "var_type": "FIELD_FLOAT", "smash_stun_duration": "0.8 1.0 1.2 1.4" } } };

@registerAbility()
export class ability1_dawnbreaker_fire_wreath extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "awnbreaker_fire_wreath";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_dawnbreaker_fire_wreath = Data_dawnbreaker_fire_wreath;
    Init() {
        this.SetDefaultSpecialValue("duration", 1.1);
        this.SetDefaultSpecialValue("swipe_radius", 700);
        this.SetDefaultSpecialValue("swipe_damage_pct", [4, 4.5, 5, 5.5, 6.5, 7.5]);
        this.SetDefaultSpecialValue("smash_radius", 450);
        this.SetDefaultSpecialValue("smash_damage_pct", [7, 8, 9, 10, 12, 15]);
        this.SetDefaultSpecialValue("smash_stun_duration", 0.3);

    }

    GetCooldown(level: number) {
        if (IsServer()) {
            const talent = this.GetCasterPlus().HasTalent(7)
            if (talent) {
                return 0
            }
        }
        return super.GetCooldown(level)
    }

    Getduration() {
        const _v = this.GetCasterPlus().GetTalentValue(5)
        const durtion = this.GetSpecialValueFor("duration")
        if (_v != null) {
            return durtion * (100 - _v) * 0.01
        }
        else {
            return durtion
        }
    }

    CastFilterResult() {
        let _obj = (this.GetCaster() as any);
        if (_obj.no_hammer) {
            this.errorStr = "dota_hud_error_dawnbreaker_no_hammer"
            return UnitFilterResult.UF_FAIL_CUSTOM
        }
        return UnitFilterResult.UF_FAIL_CUSTOM
    }

    OnSpellStart() {
        let duration = this.Getduration() + 0.3;
        let caster = this.GetCasterPlus();
        modifier_dawnbreaker_1.apply(caster, caster, this, { duration: duration })
        this.GetCaster().EmitSound(this.GetSoundReplacement("Hero_Dawnbreaker.Fire_Wreath.Cast"))
    }

    // GetIntrinsicModifierName() {
    //     return modifier_dawnbreaker_1.name
    // }

}

@registerModifier()
export class modifier_dawnbreaker_1 extends BaseModifier_Plus {
    swipe_radius: number;
    swipe_damage_pct: number;
    smash_radius: number;
    smash_stun_duration: number;

    Init(params: IModifierTable) {
        this.swipe_radius = this.GetSpecialValueFor("swipe_radius")
        this.swipe_damage_pct = this.GetSpecialValueFor("swipe_damage_pct")
        this.smash_radius = this.GetSpecialValueFor("smash_radius")
        this.smash_stun_duration = this.GetSpecialValueFor("smash_stun_duration")
    }

    BeCreated(params: any) {

        if (IsServer()) {
            this.GetAbility().SetActivated(false);
            let iAttackState = BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN;
            let _v = 1;
            let _playrate = 1;
            let _talentV = this.GetCasterPlus().GetTalentValue(5)
            if (_talentV != null) {
                _v = (100 - _talentV) * 0.01;
                _playrate = (100 + _talentV) * 0.01
            }
            // 播放第一段动画
            this.GetCaster().StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_CAST_ABILITY_1, _playrate);
            this.addTimer(6 * 0.01 * _v,
                () => {
                    let tTargets = this.FindEnemyInRadius(this.swipe_radius);
                    let len = tTargets.length;
                    for (let i = 0; i < len; i++) {
                        if (i == 0) {
                            // 进行一次普攻
                            iAttackState = BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN;
                        }
                        BattleHelper.Attack(this.GetCaster(), tTargets[i], iAttackState);
                    }
                }
            );
            this.addTimer(10 * 0.01 * _v,
                () => {
                    // -- 播放第二段动作
                    this.GetCaster().StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_1, _playrate);
                    // -- 第二段造成伤害
                    this.addTimer(27 * 0.02 * _v,
                        () => {
                            let tTargets = this.FindEnemyInRadius(this.swipe_radius);
                            let len = tTargets.length;
                            for (let i = 0; i < len; i++) {
                                if (i == 0) {
                                    // 进行一次普攻
                                    iAttackState = BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN;
                                }
                                BattleHelper.Attack(this.GetCaster(), tTargets[i], iAttackState);
                            }
                        }
                    )
                    // -- 第三段动画 收锤子
                    this.addTimer(54 * 0.02 * _v,
                        () => {
                            //	-- 第二段造成眩晕
                            // -- 给自己加BUFF
                            let caster = this.GetCasterPlus();
                            modifier_dawnbreaker_1_buff.apply(caster, caster, this.GetAbilityPlus(), { duration: this.smash_stun_duration })
                            // -- 锤子位置
                            let vpoint = GFuncVector.Add(this.GetCaster().GetForwardVector() * 200 as Vector,
                                this.GetCaster().GetAbsOrigin())
                            // -- 给目标造成眩晕和伤害
                            let _tTargets = this.FindEnemyInRadius(this.smash_radius, vpoint)
                            let len = _tTargets.length;
                            for (let i = 0; i < len; i++) {
                                let hTarget = _tTargets[i];
                                // { duration = this.smash_stun_duration * hTarget.GetStatusResistanceFactor(caster) }
                                modifier_stunned.apply(hTarget, this.GetCasterPlus(), this.GetAbilityPlus(), { duration: this.smash_stun_duration });
                                if (i == 0) {
                                    // 进行一次普攻
                                    iAttackState = BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN;
                                }
                                BattleHelper.Attack(this.GetCaster(), hTarget, iAttackState);
                            }
                            // -- 播放音效
                            this.GetCaster().EmitSound("Hero_Dawnbreaker.Fire_Wreath.Smash")
                            // -- 播放收锤子动画
                            this.GetCaster().StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_CAST_ABILITY_1_END, _playrate)
                            // -- 砸地板特效
                            let _Particle_fire_id = ResHelper.CreateParticle({
                                resPath: "particles/units/heroes/hero_dawnbreaker/dawnbreaker_fire_wreath_smash.vpcf",
                                resNpc: this.GetCaster(),
                                iAttachment: ParticleAttachment_t.PATTACH_POINT,
                                owner: this.GetCaster()
                            })
                            ParticleManager.SetParticleControl(_Particle_fire_id, 0, vpoint)
                            this.addTimer(1 * _v,
                                () => {
                                    ParticleManager.DestroyParticle(_Particle_fire_id, true)
                                }
                            )
                        }
                    )
                }
            );
        }
    }

    BeDestroy() {

        if (IsServer()) {
            this.GetAbility().SetActivated(true);
        }
    }

}

@registerModifier()
export class modifier_dawnbreaker_1_buff extends BaseModifier_Plus {
    smash_damage_pct: number;
    Init(params: IModifierTable) {
        this.smash_damage_pct = this.GetSpecialValueFor("smash_damage_pct")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    BonusDamage() {
        return this.smash_damage_pct * this.GetCaster().GetMaxHealth() * 0.01;
    }
}



