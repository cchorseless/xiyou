
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_slark_shadow_dance = { "ID": "5497", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_NO_TARGET", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "2", "AbilitySound": "Hero_Slark.ShadowDance", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityDraftUltShardAbility": "slark_fish_bait", "AbilityCooldown": "80 65 50", "AbilityManaCost": "120 120 120", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "4 4.25 4.5", "LinkedSpecialBonus": "special_bonus_unique_slark_3" }, "02": { "var_type": "FIELD_FLOAT", "fade_time": "0.0 0.0 0.0" }, "03": { "var_type": "FIELD_INTEGER", "bonus_movement_speed": "24 36 48" }, "04": { "var_type": "FIELD_INTEGER", "bonus_regen_pct": "5 6 7" }, "05": { "var_type": "FIELD_FLOAT", "activation_delay": "0.5 0.5 0.5" }, "06": { "var_type": "FIELD_FLOAT", "neutral_disable": "2.0 2.0 2.0" } } };

@registerAbility()
export class ability6_slark_shadow_dance extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "slark_shadow_dance";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_slark_shadow_dance = Data_slark_shadow_dance;
    Init() {
        this.SetDefaultSpecialValue("stat_gain", [1, 2, 3, 4, 5, 6]);
        this.SetDefaultSpecialValue("duration", 30);
        this.SetDefaultSpecialValue("kill", 0.5);

    }

    Init_old() {
        this.SetDefaultSpecialValue("stat_gain", [1, 2, 3, 4, 5, 6]);
        this.SetDefaultSpecialValue("duration", 30);

    }


    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration")
        modifier_slark_6_buff.apply(hCaster, hCaster, this, { duration: duration })
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Slark.ShadowDance", hCaster))
    }

    GetIntrinsicModifierName() {
        return "modifier_slark_6"
    }

}
// // // // // // // // // // // // // // // // // // // -modifier_slark_6// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_slark_6 extends BaseModifier_Plus {
    damage_factor: number;
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
        this.damage_factor = this.GetSpecialValueFor("damage_factor")
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

        let hCaster = hAbility.GetCasterPlus()

        if (hCaster.IsTempestDouble() || hCaster.IsIllusion()) {
            this.StartIntervalThink(-1)
            return
        }

        // 隐身buff会导致自动攻击失效，加一个攻击指令
        if (modifier_slark_6_buff.exist(hCaster) && !hCaster.IsAttacking() && !hCaster.IsChanneling()) {
            ExecuteOrderFromTable({
                UnitIndex: hCaster.entindex(),
                OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE,
                Position: hCaster.GetAbsOrigin()
            })
        }

        if (!hAbility.GetAutoCastState()) {
            return
        }

        if (!hAbility.IsAbilityReady()) {
            return
        }

        let fRange = hCaster.Script_GetAttackRange()
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
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACKED)
    attacked(params: IModifierTable) {
        let hParent = this.GetParentPlus()
        if (GameFunc.IsValid(hParent) && params.attacker == hParent && !params.attacker.IsIllusion() && !hParent.PassivesDisabled()) {
            if (!BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS) && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, hParent.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                let damage_factor = this.damage_factor + hParent.GetTalentValue("special_bonus_unique_slark_custom_4")
                let fDamage = (hParent.GetStrength() + hParent.GetAgility() + hParent.GetIntellect()) * damage_factor
                if (hParent.HasTalent("special_bonus_unique_slark_custom_5")) {
                    let fRadius = hParent.GetTalentValue("special_bonus_unique_slark_custom_5")

                    modifier_slark_6_particle_aoe.apply(hParent, params.target, this.GetAbilityPlus(), { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })

                    let tTargets = FindUnitsInRadius(hParent.GetTeamNumber(), params.target.GetAbsOrigin(), null, fRadius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST, false)
                    for (let hTarget of (tTargets)) {
                        BattleHelper.GoApplyDamage({
                            ability: this.GetAbilityPlus(),
                            victim: hTarget,
                            attacker: hParent,
                            damage: fDamage,
                            damage_type: this.GetAbilityPlus().GetAbilityDamageType()
                        })
                    }
                } else {
                    BattleHelper.GoApplyDamage({
                        ability: this.GetAbilityPlus(),
                        victim: params.target,
                        attacker: hParent,
                        damage: fDamage,
                        damage_type: this.GetAbilityPlus().GetAbilityDamageType()
                    })
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_slark_6_buff// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_slark_6_buff extends BaseModifier_Plus {
    bonus_attack_speed: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS)
    bonus_max_attack_speed: number;
    scepter_bonus_all_stats: number;
    bHasScepter: boolean;
    private _tooltip: number;
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
        return "particles/status_fx/status_effect_slark_shadow_dance.vpcf"
    }
    StatusEffectPriority() {
        return 10
    }
    Init(params: IModifierTable) {
        let hParent = this.GetParentPlus()
        this.bonus_attack_speed = this.GetSpecialValueFor("bonus_attack_speed")
        this.bonus_max_attack_speed = this.GetSpecialValueFor("bonus_max_attack_speed")
        this.scepter_bonus_all_stats = this.GetSpecialValueFor("scepter_bonus_all_stats")
        this.bHasScepter = this.GetCasterPlus().HasScepter()
        if (params.IsOnCreated) {
            if (IsServer()) {
                this.StartIntervalThink(0)
            }
            else {
                let iParticleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_slark/slark_shadow_dance.vpcf",
                    resNpc: hParent,
                    iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                    owner: hParent
                });

                ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, null, hParent.GetAbsOrigin(), true)
                ParticleManager.SetParticleControlEnt(iParticleID, 3, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_eyeR", hParent.GetAbsOrigin(), true)
                ParticleManager.SetParticleControlEnt(iParticleID, 4, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_eyeL", hParent.GetAbsOrigin(), true)
                this.AddParticle(iParticleID, false, false, -1, false, false)
            }
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            if (hParent.IsIdle()) {
                ExecuteOrderFromTable({
                    UnitIndex: hParent.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE,
                    Position: hParent.GetAbsOrigin()
                })
            }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: true,
            [modifierstate.MODIFIER_STATE_TRUESIGHT_IMMUNE]: true,
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_ALL_PERCENTAGE)
    G_STATS_ALL_PERCENTAGE() {
        if (this.bHasScepter) {
            return this.scepter_bonus_all_stats
        }
        return 0
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    tooltip() {
        this._tooltip = (this._tooltip || 0) % 2 + 1
        if (this._tooltip == 1) {
            return this.bonus_max_attack_speed
        } else if (this._tooltip == 2) {
            return this.bHasScepter && this.scepter_bonus_all_stats || 0
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    Get_ActivityTranslationModifiers() {
        return "shadow_dance"
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    GetInvisibilityLevel() {
        return 1
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant() {
        return this.bonus_attack_speed
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_slark_6_particle_aoe// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_slark_6_particle_aoe extends modifier_particle {
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        let fRadius = hParent.GetTalentValue("special_bonus_unique_slark_custom_5")
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_slark/slark_3.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hCaster.GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(fRadius, 0, 0))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
