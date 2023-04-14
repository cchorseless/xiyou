import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { modifier_lycan_1 } from "./ability1_lycan_summon_wolves";

/** dota原技能数据 */
export const Data_lycan_shapeshift = { "ID": "5398", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "2", "AbilitySound": "Hero_Lycan.Shapeshift.Cast", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "HasScepterUpgrade": "1", "AbilityDraftUltScepterAbility": "lycan_wolf_bite", "AbilityCooldown": "125 110 95", "AbilityManaCost": "100", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "28", "LinkedSpecialBonus": "special_bonus_unique_lycan_1" }, "02": { "var_type": "FIELD_INTEGER", "speed": "550" }, "03": { "var_type": "FIELD_INTEGER", "bonus_night_vision": "1000" }, "04": { "var_type": "FIELD_FLOAT", "transformation_time": "1.1" }, "05": { "var_type": "FIELD_INTEGER", "crit_chance": "40", "LinkedSpecialBonus": "special_bonus_unique_lycan_5" }, "06": { "var_type": "FIELD_INTEGER", "crit_multiplier": "150 175 200" }, "07": { "var_type": "FIELD_INTEGER", "health_bonus": "200 300 400" } } };

@registerAbility()
export class ability6_lycan_shapeshift extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "lycan_shapeshift";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_lycan_shapeshift = Data_lycan_shapeshift;
    Init() {
        this.SetDefaultSpecialValue("shard_crit_multiplier", 550);
        this.SetDefaultSpecialValue("duration", 10);
        this.SetDefaultSpecialValue("bonus_attack_range", 400);
        this.SetDefaultSpecialValue("bonus_health_damage", 10);
        this.SetDefaultSpecialValue("transformation_time", 1.5);
        this.SetDefaultSpecialValue("speed", 800);
        this.SetDefaultSpecialValue("crit_chance", 30);
        this.SetDefaultSpecialValue("crit_multiplier", [150, 175, 200, 225, 250, 275]);
        this.SetDefaultSpecialValue("scepter_transformation_time", 0.5);
        this.SetDefaultSpecialValue("scepter_wolf_count", 2);

    }


    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration")
        let transformation_time = hCaster.HasScepter() && this.GetSpecialValueFor("scepter_transformation_time") || this.GetSpecialValueFor("transformation_time")

        modifier_lycan_6_transform.remove(hCaster);
        if (hCaster.HasShard()) {
            transformation_time = 0
        }
        modifier_lycan_6_transform.apply(hCaster, hCaster, this, { duration: transformation_time })

        GTimerHelper.AddTimer(transformation_time, GHandler.create(this, () => {
            if (IsValid(hCaster) && hCaster.IsAlive()) {
                modifier_lycan_6_form.apply(hCaster, hCaster, this, { duration: duration })
            }
        }))
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Lycan.Shapeshift.Cast", hCaster))
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_lycan_6"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_lycan_6 extends BaseModifier_Plus {
    bonus_attack_range: number;
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

        this.bonus_attack_range = this.GetSpecialValueFor("bonus_attack_range")
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (!IsValid(ability)) {
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

            if (modifier_lycan_6_form.exist(caster)) {
                return
            }

            let range = caster.Script_GetAttackRange() + this.bonus_attack_range
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
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_lycan_6_transform extends BaseModifier_Plus {
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

        if (IsClient()) {
            let hCaster = this.GetCasterPlus()
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_lycan/lycan_shapeshift_cast.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_4
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION_RATE)
    Get_OverrideAnimationRate() {
        return 1.5 / this.GetDuration()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_lycan_6_form extends BaseModifier_Plus {
    bonus_attack_range: number;
    bonus_health_damage: number;
    wolf_count: number;
    hBuffPtcl: any;
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
        return true
    }
    IsAura() {
        return true
    }
    GetAuraRadius() {
        return -1
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_OTHER
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE
    }
    GetAuraEntityReject(hEntity: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        if (!IsValid(hCaster)) {
            return true
        }
        if (hEntity.GetPlayerOwnerID() != hCaster.GetPlayerOwnerID()) {
            return true
        }
        if (hCaster.HasTalent("special_bonus_unique_lycan_custom_4") && (hEntity.IsSummoned() || hEntity == hCaster)) {
            return false
        }
        if (hEntity.GetUnitName() == "npc_dota_lycan_wolf_custom" || hEntity == hCaster) {
            return false
        }
        return true
    }
    GetAura() {
        return "modifier_lycan_6_aura"
    }
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let extra_bonus_health_damage = hCaster.HasTalent("special_bonus_unique_lycan_custom_5") && hCaster.GetTalentValue("special_bonus_unique_lycan_custom_5") || 0
        this.bonus_attack_range = this.GetSpecialValueFor("bonus_attack_range")
        this.bonus_health_damage = this.GetSpecialValueFor("bonus_health_damage") + extra_bonus_health_damage
        this.wolf_count = hParent.HasScepter() && this.GetSpecialValueFor("scepter_wolf_count") || 0

        if (IsServer()) {
            this.SetStackCount(hParent.GetMaxHealth() * this.bonus_health_damage * 0.01)
            this.StartIntervalThink(0)
            let modifier_lycan1 = modifier_lycan_1.findIn(hParent)
            if (IsValid(modifier_lycan1)) {
                modifier_lycan1.OnIntervalThink()
            }
        }
    }
    BeRefresh(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let extra_bonus_health_damage = hCaster.HasTalent("special_bonus_unique_lycan_custom_5") && hCaster.GetTalentValue("special_bonus_unique_lycan_custom_5") || 0
        this.bonus_attack_range = this.GetSpecialValueFor("bonus_attack_range")
        this.bonus_health_damage = this.GetSpecialValueFor("bonus_health_damage") + extra_bonus_health_damage
        this.wolf_count = hParent.HasScepter() && this.GetSpecialValueFor("scepter_wolf_count") || 0

        if (IsServer()) {
            this.SetStackCount(hParent.GetMaxHealth() * this.bonus_health_damage * 0.01)

            let modifier_lycan1 = modifier_lycan_1.findIn(hParent)
            if (IsValid(modifier_lycan1)) {
                modifier_lycan1.OnIntervalThink()
            }
        }
    }
    OnIntervalThink() {
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            if (this.hBuffPtcl == null) {
                this.hBuffPtcl = modifier_lycan_6_particle_buff.apply(hParent, hParent, this.GetAbilityPlus(), { duration: this.GetDuration() })
            }

            this.SetStackCount(hParent.GetMaxHealth() * this.bonus_health_damage * 0.01)
        }
    }
    BeDestroy() {

        let hParent = this.GetParentPlus()
        if (IsServer()) {
            let modifier_lycan1 = modifier_lycan_1.findIn(hParent)
            if (IsValid(modifier_lycan1)) {
                modifier_lycan1.OnIntervalThink()
            }
            if (IsValid(this.hBuffPtcl)) {
                this.hBuffPtcl.Destroy()
            }
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    GetAttackRangeBonus(params: IModifierTable) {
        return this.bonus_attack_range
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: IModifierTable) {
        return this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CAST_RANGE_BONUS_STACKING)
    GetCastRangeBonusStacking(params: ModifierAbilityEvent) {
        if (IsValid(params.ability) &&
            GameFunc.IncludeArgs(params.ability.GetBehaviorInt(), DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_ATTACK)[0]) {
            return this.bonus_attack_range
        }
        return 0
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE)
    GetModelChange(params: IModifierTable) {
        return ResHelper.GetModelReplacement("models/heroes/lycan/lycan_wolf.vmdl", this.GetParentPlus())
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_lycan_6_aura extends BaseModifier_Plus {
    speed: number;
    crit_chance: number;
    crit_multiplier: number;
    IsHidden() {
        return this.GetParentPlus() == this.GetCasterPlus()
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
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
    }
    Init(params: IModifierTable) {
        this.speed = this.GetSpecialValueFor("speed")
        this.crit_chance = this.GetSpecialValueFor("crit_chance")
        this.crit_multiplier = this.GetSpecialValueFor("crit_multiplier") + (this.GetCasterPlus().HasShard() && this.GetSpecialValueFor("shard_crit_multiplier") || 0)
        if (params.IsOnCreated && IsClient()) {
            if (this.GetParentPlus() != this.GetCasterPlus()) {
                let iPtclID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_lycan/lycan_shapeshift_buff_speed.vpcf",
                    resNpc: this.GetCasterPlus(),
                    iAttachment: this.GetEffectAttachType(),
                    owner: this.GetParentPlus()
                });

                this.AddParticle(iPtclID, false, false, -1, false, this.ShouldUseOverheadOffset())
            }
        }
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: IModifierTable) {
        if (!IsValid(this.GetCasterPlus()) || this.GetParentPlus() == this.GetCasterPlus()) {
            return 0
        }
        return modifier_lycan_6_form.GetStackIn(this.GetCasterPlus())
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CRITICALSTRIKE)
    CC_GetModifierCriticalStrike(params: IModifierTable) {
        if (params.attacker == this.GetParentPlus() && !params.attacker.PassivesDisabled() && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
            let hCaster = this.GetCasterPlus()
            let extra_crit_chance = (IsValid(hCaster) && hCaster.HasTalent("special_bonus_unique_lycan_custom_7")) && hCaster.GetTalentValue("special_bonus_unique_lycan_custom_7") || 0
            let crit_chance = this.crit_chance + extra_crit_chance
            if (GFuncMath.PRD(crit_chance, params.attacker, "lycan_3")) {
                return this.crit_multiplier
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BASE_OVERRIDE)
    GetMoveSpeedOverride(params: IModifierTable) {
        return this.speed
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE_MIN)
    GetMoveSpeed_AbsoluteMin(params: IModifierTable) {
        return this.speed
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_MOVESPEED_LIMIT)
    GetIgnoreMovespeedLimit(params: IModifierTable) {
        return 1
    }
}

// 特效
@registerModifier()
export class modifier_lycan_6_particle_buff extends modifier_particle {
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let hParent = this.GetParentPlus()
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_lycan/lycan_shapeshift_buff.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_mane", hParent.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }

}
