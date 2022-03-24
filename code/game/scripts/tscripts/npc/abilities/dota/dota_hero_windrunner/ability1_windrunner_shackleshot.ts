
import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Hero_Plus } from "../../../entityPlus/BaseNpc_Hero_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_windrunner_shackleshot = { "ID": "5130", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "FightRecapLevel": "1", "AbilitySound": "Hero_Windrunner.ShackleshotCast", "AbilityCastRange": "800", "AbilityCastPoint": "0.15", "AbilityCooldown": "16 14 12 10", "AbilityDamage": "0 0 0 0", "AbilityManaCost": "70 80 90 100", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "fail_stun_duration": "0.75 0.75 0.75 0.75" }, "02": { "var_type": "FIELD_FLOAT", "stun_duration": "2.0 2.6 3.2 3.8", "LinkedSpecialBonus": "special_bonus_unique_windranger_6" }, "03": { "var_type": "FIELD_INTEGER", "shackle_distance": "575" }, "04": { "var_type": "FIELD_INTEGER", "arrow_speed": "1650" }, "05": { "var_type": "FIELD_INTEGER", "shackle_count": "1" }, "06": { "var_type": "FIELD_FLOAT", "shackle_angle": "23" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_windrunner_shackleshot extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "windrunner_shackleshot";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_windrunner_shackleshot = Data_windrunner_shackleshot;
    Init() {
        this.SetDefaultSpecialValue("int_factor_damage", [1, 2, 3, 4, 5, 6]);
        this.SetDefaultSpecialValue("stun_duration", 2.5);
        this.SetDefaultSpecialValue("shackle_radius", 350);
        this.SetDefaultSpecialValue("arrow_speed", 1650);
        this.SetDefaultSpecialValue("increase_range_damage_pct", 40);
        this.SetDefaultSpecialValue("stun_duration_only_one", 0.75);

    }


    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        let iArrowSpeed = this.GetSpecialValueFor("arrow_speed")
        let vOrigin = hCaster.GetAbsOrigin()
        let sProjectileName = ResHelper.GetParticleReplacement("particles/units/heroes/hero_windrunner/windrunner_shackleshot.vpcf", hCaster)
        let tInfo = {
            Target: hTarget,
            Source: hCaster,
            Ability: this,
            EffectName: sProjectileName,
            iMoveSpeed: iArrowSpeed,
            bDodgeable: true,
        }
        ProjectileManager.CreateTrackingProjectile(tInfo)

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Windrunner.ShackleshotCast", hCaster))
    }
    OnProjectileHit(hTarget: BaseNpc_Plus, vLocation: Vector) {
        if (!GameFunc.IsValid(hTarget)) {
            return
        }
        if (hTarget.TriggerSpellAbsorb(this)) {
            return
        }
        let hCaster = this.GetCasterPlus() as BaseNpc_Hero_Plus
        let int_factor_damage = this.GetSpecialValueFor("int_factor_damage")
        let shackle_radius = this.GetSpecialValueFor("shackle_radius")
        let stun_duration = this.GetSpecialValueFor("stun_duration") + hCaster.GetTalentValue("special_bonus_unique_windrunner_custom_1")
        let stun_duration_only_one = this.GetSpecialValueFor("stun_duration_only_one") + hCaster.GetTalentValue("special_bonus_unique_windrunner_custom_1")
        let tTarget = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hTarget.GetAbsOrigin(), shackle_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)
        for (let hEnemy of (tTarget)) {
            let fDamage = int_factor_damage * hCaster.GetIntellect()
            let damage_table =
            {
                ability: this,
                attacker: hCaster,
                victim: hEnemy,
                damage: fDamage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
            }
            BattleHelper.GoApplyDamage(damage_table)
            let duration = tTarget.length == 1 && stun_duration_only_one || stun_duration
            if (hEnemy != hTarget) {
                let iParticle = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_windrunner/windrunner_shackleshot_pair.vpcf",
                    resNpc: hCaster,
                    iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                    owner: null
                });

                ParticleManager.SetParticleControlEnt(iParticle, 0, hTarget, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", Vector(0, 0, 0), true)
                ParticleManager.SetParticleControlEnt(iParticle, 1, hEnemy, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "attach_hitloc", Vector(0, 0, 0), true)
                ParticleManager.SetParticleControl(iParticle, 2, Vector(duration * hEnemy.GetStatusResistanceFactor(hCaster), 0, 0))
                ParticleManager.ReleaseParticleIndex(iParticle)
            }
            modifier_windrunner_1_debuff.apply(hEnemy, hCaster, this, { duration: duration * hEnemy.GetStatusResistanceFactor(hCaster) })
        }
        // 束缚太多单位声音会太大吵死了
        hTarget.EmitSound(ResHelper.GetSoundReplacement("Hero_Windrunner.ShackleshotBind", hCaster))
        hTarget.EmitSound(ResHelper.GetSoundReplacement("Hero_Windrunner.ShackleshotStun", hCaster))
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_windrunner_1"
    // }

}


// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers

@registerModifier()
export class modifier_windrunner_1 extends BaseModifier_Plus {
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

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()

            //  优先攻击目标
            let target = caster.GetAttackTarget()
            if (target != null && target.GetClassname() == "dota_item_drop") { target = null }
            if (target != null && !target.IsPositionInRange(caster.GetAbsOrigin(), range)) {
                target = null
            }

            //  搜索范围
            if (target == null) {
                let teamFilter = ability.GetAbilityTargetTeam()
                let typeFilter = ability.GetAbilityTargetType()
                let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
                let order = FindOrder.FIND_CLOSEST
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
                target = targets[1]
            }

            //  施法命令
            if (target != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                    TargetIndex: target.entindex(),
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_windrunner_1_debuff extends BaseModifier_Plus {
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
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW
    }
    increase_range_damage_pct: number;
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let hCaster = this.GetCasterPlus();
            let resInfo: ResHelper.ParticleInfo = {
                resPath: "particles/generic_gameplay/generic_stunned.vpcf",
                resNpc: hCaster,
                iAttachment: this.GetEffectAttachType(),
                owner: hCaster,
                level: ResHelper.PARTICLE_DETAIL_LEVEL.PARTICLE_DETAIL_LEVEL_MEDIUM
            }
            let iParticleID = ResHelper.CreateParticle(resInfo)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    Init(params: ModifierTable) {
        this.increase_range_damage_pct = this.GetSpecialValueFor("increase_range_damage_pct")

    }

    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_DISABLED
    };

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    GetIncomingDamagePercentage(params: ModifierAttackEvent) {
        let hParent = this.GetParentPlus()
        if (params != null && params.target == hParent && params.attacker.GetAttackCapability() == DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK) {
            return this.increase_range_damage_pct
        }
        return 0
    }
}