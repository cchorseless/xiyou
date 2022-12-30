
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
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_centaur_double_edge = { "ID": "5515", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_Centaur.DoubleEdge", "HasShardUpgrade": "1", "AbilityCooldown": "4.0", "AbilityCastRange": "150 150 150 150", "AbilityCastPoint": "0.3", "AbilityManaCost": "0 0 0 0", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "edge_damage": "120 180 240 300" }, "02": { "var_type": "FIELD_INTEGER", "strength_damage": "60 80 100 120", "LinkedSpecialBonus": "special_bonus_unique_centaur_4" }, "03": { "var_type": "FIELD_INTEGER", "radius": "190" }, "04": { "var_type": "FIELD_INTEGER", "scepter_range": "500" }, "05": { "var_type": "FIELD_INTEGER", "shard_str_pct": "15" }, "06": { "var_type": "FIELD_FLOAT", "shard_str_duration": "15" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_centaur_double_edge extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "centaur_double_edge";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_centaur_double_edge = Data_centaur_double_edge;
    Init() {
        this.SetDefaultSpecialValue("health_damage", [50, 60, 70, 80, 90, 100]);
        this.SetDefaultSpecialValue("radius", 600);
        this.SetDefaultSpecialValue("str_percent", 15);
        this.SetDefaultSpecialValue("duration", 10);
        this.SetDefaultSpecialValue("max_count", 5);

    }



    hParticleModifier: modifier_centaur_2_particle_pre;


    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        return super.GetCastRange(vLocation, hTarget) + hCaster.GetTalentValue("special_bonus_unique_centaur_custom")
    }
    OnAbilityPhaseStart() {
        let hCaster = this.GetCasterPlus()
        this.hParticleModifier = modifier_centaur_2_particle_pre.apply(hCaster, hCaster, this)
        return true
    }
    OnAbilityPhaseInterrupted() {
        if (GameFunc.IsValid(this.hParticleModifier)) {
            this.hParticleModifier.Destroy()
        }
    }
    OnSpellStart() {
        if (GameFunc.IsValid(this.hParticleModifier)) {
            this.hParticleModifier.Destroy()
        }

        let caster = this.GetCasterPlus()
        let target = this.GetCursorTarget()

        if (!GameFunc.IsValid(target) || !target.IsAlive()) {
            return
        }
        if (target.TriggerSpellAbsorb(this)) {
            return
        }
        this.CostCentaur2Ability(target)
    }

    CostCentaur2Ability(target: IBaseNpc_Plus) {
        let caster = this.GetCasterPlus()
        let target_point = target.GetAbsOrigin()
        let radius = this.GetSpecialValueFor("radius")
        let duration = this.GetSpecialValueFor("duration")
        let health_damage = this.GetSpecialValueFor("health_damage") + caster.GetTalentValue("special_bonus_unique_centaur_custom_2")
        let damage = health_damage * caster.GetMaxHealth() * 0.01

        let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), target_point, radius, null, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST)
        for (let _target of (targets)) {
            let damage_table = {
                ability: this,
                victim: _target,
                attacker: caster,
                damage: damage,
                damage_type: this.GetAbilityDamageType()
            }
            BattleHelper.GoApplyDamage(damage_table)
            if (caster.HasShard()) {
                modifier_centaur_2_shard_buff.apply(caster, caster, this, { duration: duration })
            }
        }
        modifier_centaur_2_particle_start.apply(caster, target, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
        caster.EmitSound(ResHelper.GetSoundReplacement("Hero_Centaur.DoubleEdge", caster))
    }

    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }

    GetIntrinsicModifierName() {
        return "modifier_centaur_2"
    }




}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_centaur_2 extends BaseModifier_Plus {
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
            let radius = ability.GetAOERadius()

            let target = AoiHelper.GetAOEMostTargetsSpellTarget(caster.GetAbsOrigin(), range, caster.GetTeamNumber(), radius, null, ability.GetAbilityTargetTeam(), ability.GetAbilityTargetType(), ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)

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
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (!GameFunc.IsValid(params.target)) { return }
        if (params.target.GetClassname() == "dota_item_drop") { return }
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus() as ability2_centaur_double_edge
        if (params.attacker == hParent && hParent.HasTalent("special_bonus_unique_centaur_custom_7")) {
            if (hAbility.CostCentaur2Ability != null && GameFunc.mathUtil.PRD(hParent.GetTalentValue("special_bonus_unique_centaur_custom_7"), hParent, "special_bonus_unique_centaur_custom_7")) {
                hAbility.CostCentaur2Ability(params.target)
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_centaur_2_shard_buff// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_centaur_2_shard_buff extends BaseModifier_Plus {
    str_percent: number;
    max_count: number;
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
        this.str_percent = this.GetSpecialValueFor("str_percent")
        this.max_count = this.GetSpecialValueFor("max_count")
        if (IsServer()) {
            let iNewCount = math.min(this.max_count, this.GetStackCount() + 1)
            this.SetStackCount(iNewCount)
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.STATS_STRENGTH_PERCENTAGE)
    EOM_GetModifierStats_Strength_Percentage() {
        return this.str_percent * this.GetStackCount()
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    tooltip() {
        return this.EOM_GetModifierStats_Strength_Percentage()
    }
}
// 特效
@registerModifier()
export class modifier_centaur_2_particle_pre extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_centaur/centaur_double_edge_phase.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetCasterPlus()
            });

            ParticleManager.SetParticleControlEnt(particleID, 1, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_weapon", this.GetCasterPlus().GetAbsOrigin(), true)
            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }
}

// 特效
@registerModifier()
export class modifier_centaur_2_particle_start extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let radius = this.GetSpecialValueFor("radius")
        if (IsClient()) {
            let target = this.GetCasterPlus()
            let parent = this.GetParentPlus()

            let vFoward = ((parent.GetAbsOrigin() - target.GetAbsOrigin()) as Vector).Normalized()
            vFoward.z = 0

            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_centaur/centaur_double_edge_body.vpcf",
                resNpc: parent,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)

            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_centaur/centaur_double_edge.vpcf",
                resNpc: parent,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", target.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlForward(iParticleID, 2, vFoward)
            ParticleManager.SetParticleControlEnt(iParticleID, 3, target, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, target.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 5, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_head", parent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticleID, 6, Vector(radius, radius, radius))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
