
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { ability2_skeleton_king_vampiric_aura, modifier_skeleton_king_2_summon } from "./ability2_skeleton_king_vampiric_aura";
import { modifier_skeleton_king_3 } from "./ability3_skeleton_king_mortal_strike";

/** dota原技能数据 */
export const Data_skeleton_king_hellfire_blast = { "ID": "5086", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "FightRecapLevel": "1", "AbilitySound": "Hero_SkeletonKing.Hellfire_Blast", "AbilityCastRange": "525", "AbilityCastPoint": "0.35 0.35 0.35 0.35", "AbilityCooldown": "17 14 11 8", "AbilityDamage": "70 80 90 100", "AbilityManaCost": "95 110 125 140", "AbilityModifierSupportValue": "0.5", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "blast_speed": "1000" }, "02": { "var_type": "FIELD_FLOAT", "blast_stun_duration": "1.1 1.4 1.7 2.0", "LinkedSpecialBonus": "special_bonus_unique_wraith_king_11" }, "03": { "var_type": "FIELD_FLOAT", "blast_dot_duration": "2.0", "LinkedSpecialBonus": "special_bonus_unique_wraith_king_7" }, "04": { "var_type": "FIELD_INTEGER", "blast_slow": "-20" }, "05": { "var_type": "FIELD_INTEGER", "blast_dot_damage": "10 30 50 70", "LinkedSpecialBonus": "special_bonus_unique_wraith_king_3" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_skeleton_king_hellfire_blast extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "skeleton_king_hellfire_blast";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_skeleton_king_hellfire_blast = Data_skeleton_king_hellfire_blast;
    Init() {
        this.SetDefaultSpecialValue("blast_speed", 1000);
        this.SetDefaultSpecialValue("blast_root_duration", 4);
        this.SetDefaultSpecialValue("max_target", 6);
        this.SetDefaultSpecialValue("damage_per_second", [100, 200, 300, 400, 800, 1600]);
        this.SetDefaultSpecialValue("damage_interval", 0.5);
        this.SetDefaultSpecialValue("energy", 2);
        this.SetDefaultSpecialValue("energy_damage_pct", 200);
        this.SetDefaultSpecialValue("ignore_armor", 100);
        this.SetDefaultSpecialValue("shard_point", 3);

    }

    Init_old() {
        this.SetDefaultSpecialValue("blast_speed", 1000);
        this.SetDefaultSpecialValue("blast_root_duration", 4);
        this.SetDefaultSpecialValue("max_target", 6);
        this.SetDefaultSpecialValue("damage_per_second", [100, 200, 300, 400, 500, 600]);
        this.SetDefaultSpecialValue("damage_interval", 0.5);
        this.SetDefaultSpecialValue("energy", 2);
        this.SetDefaultSpecialValue("energy_damage_pct", 200);

    }


    OnAbilityPhaseStart() {
        modifier_skeleton_king_1_particle_warmup.apply(this.GetCasterPlus(), this.GetCasterPlus(), this, null)
        return true
    }
    OnAbilityPhaseInterrupted() {
        modifier_skeleton_king_1_particle_warmup.remove(this.GetCasterPlus());
    }
    UseEnergy(iCount: number) {
        let hCaster = this.GetCasterPlus()
        let hModifier = modifier_skeleton_king_3.findIn(hCaster) as IBaseModifier_Plus;
        if (GameFunc.IsValid(hModifier) && hModifier.GetStackCount() >= iCount) {
            hModifier.SetStackCount(hModifier.GetStackCount() - iCount)
            return 1
        }
        return 0
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        modifier_skeleton_king_1_particle_warmup.remove(hCaster);
        let energy = this.GetSpecialValueFor("energy")
        this.HellFireBlast(this.UseEnergy(energy))
        let hAbility = ability2_skeleton_king_vampiric_aura.findIn(hCaster) as ability2_skeleton_king_vampiric_aura;
        for (let hUnit of (hAbility.tSkeletons)) {
            if (GameFunc.IsValid(hUnit) && hUnit.GetStackCount("modifier_skeleton_king_2_summon", hCaster) == 3) {
                this.HellFireBlast(0, hUnit)
            }
        }
    }
    HellFireBlast(bUseEnergy: number, hUnit: IBaseNpc_Plus = null) {
        let caster = this.GetCasterPlus()
        let hSource = hUnit || caster
        let blast_speed = this.GetSpecialValueFor("blast_speed")
        let max_target = this.GetSpecialValueFor("max_target")

        let range = this.GetCastRange(caster.GetAbsOrigin(), caster)
        let teamFilter = this.GetAbilityTargetTeam()
        let typeFilter = this.GetAbilityTargetType()
        let flagFilter = this.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
        let order = FindOrder.FIND_CLOSEST
        let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
        let n = 0;
        for (let target of (targets)) {
            let info: CreateTrackingProjectileOptions = {
                Ability: this,
                EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_skeletonking/skeletonking_hellfireblast.vpcf", caster),
                vSourceLoc: hSource.GetAbsOrigin(),
                iMoveSpeed: blast_speed,
                Target: target,
                Source: hSource,
                bProvidesVision: true,
                iVisionTeamNumber: caster.GetTeamNumber(),
                iVisionRadius: 0,
                iSourceAttachment: hUnit == null && DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_ATTACK_2 || DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION,
                ExtraData: {
                    bUseEnergy: bUseEnergy
                }
            }
            ProjectileManager.CreateTrackingProjectile(info)
            n += 1
            if (n >= max_target) {
                break
            }
        }

        caster.EmitSound(ResHelper.GetSoundReplacement("Hero_SkeletonKing.Hellfire_Blast", caster))
    }
    OnTalentTrigger(hTarget: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let blast_speed = this.GetSpecialValueFor("blast_speed")
        let info = {
            Ability: this,
            EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_skeletonking/skeletonking_hellfireblast.vpcf", hCaster),
            vSourceLoc: hCaster.GetAbsOrigin(),
            iMoveSpeed: blast_speed,
            Target: hTarget,
            Source: hCaster,
            bProvidesVision: true,
            iVisionTeamNumber: hCaster.GetTeamNumber(),
            iVisionRadius: 0,
            iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_ATTACK_2
        }
        ProjectileManager.CreateTrackingProjectile(info)
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        let caster = this.GetCasterPlus()

        if (!GameFunc.IsValid(hTarget)) {
            return true
        }

        if (caster.HasShard()) {
            let shard_point = this.GetSpecialValueFor("shard_point")
            let hModifier = modifier_skeleton_king_3.findIn(caster) as IBaseModifier_Plus;
            if (GameFunc.IsValid(hModifier)) {
                hModifier.changeStackCount(shard_point)
            }
        }

        let blast_root_duration = this.GetSpecialValueFor("blast_root_duration") + caster.GetTalentValue("special_bonus_unique_skeleton_king_custom_3")

        EmitSoundOnLocationWithCaster(vLocation, ResHelper.GetSoundReplacement("Hero_SkeletonKing.Hellfire_BlastImpact", caster), caster)

        modifier_skeleton_king_1_debuff.apply(hTarget, caster, this, { duration: blast_root_duration * hTarget.GetStatusResistanceFactor(caster), bUseEnergy: ExtraData.bUseEnergy })
        return true
    }

    GetIntrinsicModifierName() {
        return "modifier_skeleton_king_1"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_skeleton_king_1 extends BaseModifier_Plus {
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

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster)

            let teamFilter = ability.GetAbilityTargetTeam()
            let typeFilter = ability.GetAbilityTargetType()
            let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)

            //  施法命令
            if (targets[0] != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex()
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_skeleton_king_1_debuff extends BaseModifier_Plus {
    damage_type: DAMAGE_TYPES;
    bUseEnergy: any;
    damage_per_second: number;
    damage_interval: number;
    energy_damage_pct: number;
    ignore_armor: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
    }
    IsPurgable() {
        return true
    }
    IsPurgeException() {
        return true
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let extra_damage_factor = this.GetCasterPlus().HasTalent("special_bonus_unique_skeleton_king_custom_4") && this.GetCasterPlus().GetTalentValue("special_bonus_unique_skeleton_king_custom_4") || 0
        this.damage_per_second = this.GetSpecialValueFor("damage_per_second") + extra_damage_factor * this.GetCasterPlus().GetStrength()
        this.damage_interval = this.GetSpecialValueFor("damage_interval")
        this.energy_damage_pct = this.GetSpecialValueFor("energy_damage_pct")
        this.ignore_armor = this.GetSpecialValueFor("ignore_armor")
        if (IsServer()) {
            this.damage_type = this.GetAbilityPlus().GetAbilityDamageType()
            this.StartIntervalThink(this.damage_interval)
            this.OnIntervalThink()
            this.bUseEnergy = params.bUseEnergy
        } else {
            let iPtclID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_skeletonking/skeletonking_hellfireblast_debuff.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iPtclID, false, false, -1, false, false)
        }
    }
    OnRefresh(params: IModifierTable) {
        super.OnRefresh(params);
        let extra_damage_factor = this.GetCasterPlus().HasTalent("special_bonus_unique_skeleton_king_custom_4") && this.GetCasterPlus().GetTalentValue("special_bonus_unique_skeleton_king_custom_4") || 0
        this.damage_per_second = this.GetSpecialValueFor("damage_per_second") + extra_damage_factor * this.GetCasterPlus().GetStrength()
        this.damage_interval = this.GetSpecialValueFor("damage_interval")
        this.energy_damage_pct = this.GetSpecialValueFor("energy_damage_pct")
        this.ignore_armor = this.GetSpecialValueFor("ignore_armor")
    }

    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_PHYSICAL_ARMOR_PERCENTAGE)
    EOM_GetModifierIgnorePhysicalArmorPercentageTarget(params: IModifierTable) {
        if (IsServer() && this.bUseEnergy) {
            //  骷髅王无视护甲
            if (params.attacker == this.GetCasterPlus()) {
                return this.ignore_armor
            } else {
                //  小骷髅无视护甲
                let hSummonBuff = modifier_skeleton_king_2_summon.findIn(params.attacker)
                if (GameFunc.IsValid(hSummonBuff) && hSummonBuff.GetCasterPlus() == this.GetCasterPlus()) {
                    return this.ignore_armor
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    On_AttackStart(params: ModifierAttackEvent) {
        let hCaster = this.GetCasterPlus()
        let sTalentName = "special_bonus_unique_skeleton_king_custom_1"
        if (params.target == this.GetParentPlus() && (params.attacker == this.GetCasterPlus() || modifier_skeleton_king_2_summon.exist(params.attacker))) {
            if (this.bUseEnergy) {
                modifier_skeleton_king_1_cannot_miss.apply(params.attacker, params.attacker, this.GetAbilityPlus(), null)
            }
            if (hCaster.HasTalent(sTalentName)) {
                modifier_special_bonus_unique_skeleton_king_custom_1.apply(params.attacker, hCaster, this.GetAbilityPlus(), null)
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    On_AttackRecord(params: ModifierAttackEvent) {
        if (params.target == this.GetParentPlus()) {
            modifier_skeleton_king_1_cannot_miss.remove(params.attacker);
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let caster = this.GetCasterPlus()
            let target = this.GetParentPlus()
            let ability = this.GetAbilityPlus()

            if (!GameFunc.IsValid(ability) || !GameFunc.IsValid(caster)) {
                this.Destroy()
                return
            }

            let damage = this.bUseEnergy == 1 && this.damage_per_second * this.damage_interval * this.energy_damage_pct * 0.01 || this.damage_per_second * this.damage_interval
            let damage_table = {
                ability: ability,
                victim: target,
                attacker: caster,
                damage: damage,
                damage_type: this.damage_type,
                eom_flags: BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_DOT,
            }
            BattleHelper.GoApplyDamage(damage_table)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_skeleton_king_1_cannot_miss extends BaseModifier_Plus {
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
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_CANNOT_MISS]: true
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_special_bonus_unique_skeleton_king_custom_1 extends BaseModifier_Plus {
    bonus_attackspeed: number;
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
        this.bonus_attackspeed = this.GetCasterPlus().GetTalentValue("special_bonus_unique_skeleton_king_custom_1")
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant(params: IModifierTable) {
        return this.bonus_attackspeed
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.attacker == this.GetParentPlus()) {
            this.Destroy()
        }
    }
}
// 特效
@registerModifier()
export class modifier_skeleton_king_1_particle_warmup extends modifier_particle {
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_skeletonking/skeletonking_hellfireblast_warmup.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: this.GetCasterPlus()
            });

            ParticleManager.SetParticleControlEnt(particleID, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", this.GetCasterPlus().GetAbsOrigin(), true)
            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }
}
