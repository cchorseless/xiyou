
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
import { ability3_lion_mana_drain } from "./ability3_lion_mana_drain";

/** dota原技能数据 */
export const Data_lion_finger_of_death = { "ID": "5047", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AOE", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "2", "AbilitySound": "Hero_Lion.FingerOfDeath", "HasScepterUpgrade": "1", "AbilityCastRange": "900", "AbilityCastPoint": "0.3 0.3 0.3", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "160.0 100.0 40.0", "AbilityManaCost": "200 420 650", "AbilityModifierSupportValue": "0.0", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "damage": "600 725 850", "LinkedSpecialBonus": "special_bonus_unique_lion_3" }, "02": { "var_type": "FIELD_INTEGER", "damage_scepter": "725 875 1025", "LinkedSpecialBonus": "special_bonus_unique_lion_3", "RequiresScepter": "1" }, "03": { "var_type": "FIELD_INTEGER", "damage_per_kill": "40", "LinkedSpecialBonus": "special_bonus_unique_lion_8", "CalculateSpellDamageTooltip": "0" }, "04": { "var_type": "FIELD_FLOAT", "grace_period": "3" }, "05": { "var_type": "FIELD_FLOAT", "damage_delay": "0.25", "CalculateSpellDamageTooltip": "0" }, "06": { "var_type": "FIELD_FLOAT", "cooldown_scepter": "100.0 60.0 20.0", "RequiresScepter": "1" }, "07": { "var_type": "FIELD_FLOAT", "splash_radius_scepter": "325", "RequiresScepter": "1" } } };

@registerAbility()
export class ability6_lion_finger_of_death extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "lion_finger_of_death";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_lion_finger_of_death = Data_lion_finger_of_death;
    Init() {
        this.SetDefaultSpecialValue("damage", [3000, 6000, 9000, 12000, 15000, 18000]);
        this.SetDefaultSpecialValue("damage_scepter", [13000, 16000, 19000, 22000, 25000, 28000]);
        this.SetDefaultSpecialValue("damage_per_kill", 80);
        this.SetDefaultSpecialValue("splash_radius", 275);
        this.SetDefaultSpecialValue("grace_period", 3);
        this.SetDefaultSpecialValue("damage_delay", 0.25);
        this.SetDefaultSpecialValue("kill_cooldown_reduce", 3);
        this.SetDefaultSpecialValue("cooldown_scepter", 10);
        this.SetDefaultSpecialValue("splash_radius_scepter", 500);

    }


    hParticleModifier: modifier_lion_6_particle_pre;
    tTarget: any[];
    fManaCostFactor: number;
    iTotalDamage: number;
    GetCooldown(iLevel: number) {
        let iCooldown = super.GetCooldown(iLevel)
        let hCaster = this.GetCasterPlus()
        if (hCaster.HasScepter()) {
            iCooldown = this.GetSpecialValueFor("cooldown_scepter")
        }
        return iCooldown
    }
    GetManaCost(iLevel: number) {
        let fManaCost = super.GetManaCost(iLevel)
        if (this.fManaCostFactor != null) {
            fManaCost = fManaCost * this.fManaCostFactor
        }
        return fManaCost
    }
    GetAOERadius() {
        let hCaster = this.GetCasterPlus()
        if (hCaster.HasScepter()) {
            return this.GetSpecialValueFor("splash_radius_scepter")
        }
        return this.GetSpecialValueFor("splash_radius")
    }
    OnAbilityPhaseStart() {
        let hCaster = this.GetCasterPlus()
        this.hParticleModifier = modifier_lion_6_particle_pre.apply(hCaster, hCaster, this)
        return true
    }

    OnAbilityPhaseInterrupted() {
        if (GameFunc.IsValid(this.hParticleModifier)) {
            this.hParticleModifier.Destroy()
        }
        let hTarget = this.GetCursorTarget()
        if (GameFunc.IsValid(hTarget) && hTarget.IsAlive()) {
            let hModifier = modifier_lion_6_extra_finger.findIn(hTarget)
            if (GameFunc.IsValid(hModifier)) {
                hModifier.Destroy()
            }
        }
    }

    OnSpellStart() {
        if (GameFunc.IsValid(this.hParticleModifier)) {
            this.hParticleModifier.Destroy()
        }
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        if (!GameFunc.IsValid(hTarget) || !hTarget.IsAlive()) {
            return
        }
        this.tTarget = []
        if (!hTarget.TriggerSpellAbsorb(this)) {
            let splash_radius = hCaster.HasScepter() && this.GetSpecialValueFor("splash_radius_scepter") || this.GetSpecialValueFor("splash_radius")
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hTarget.GetAbsOrigin(), splash_radius, null, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER)
            table.insert(this.tTarget, hTarget)
            this.FingerOfDeath(hTarget)
            for (let unit of (tTargets)) {
                if (GameFunc.IsValid(unit) && unit.IsAlive() && unit != hTarget) {
                    this.FingerOfDeath(unit)
                    table.insert(this.tTarget, unit)
                }
            }
        }

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Lion.FingerOfDeath", hCaster))
        this.fManaCostFactor = null
    }

    FingerOfDeath(hTarget: IBaseNpc_Plus) {
        if (hTarget == null) {
            return
        }

        let hCaster = this.GetCasterPlus()

        let damage_delay = this.GetSpecialValueFor("damage_delay")
        let grace_period = this.GetSpecialValueFor("grace_period")

        let vDirection = (hTarget.GetAttachmentOrigin(hTarget.ScriptLookupAttachment("attach_hitloc")) - hCaster.GetAttachmentOrigin(hTarget.ScriptLookupAttachment("attach_attack2"))) as Vector
        let iSign = RollPercentage(50) && 1 || -1
        let vVector = hCaster.GetAbsOrigin() + vDirection / 2 + iSign * GameFunc.VectorFunctions.Rotation2D(vDirection.Normalized(), math.rad(90)) * 200
        let vForward = hCaster.GetForwardVector()


        let iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_lion/lion_spell_finger_of_death.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            owner: hCaster
        });

        ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", hCaster.GetAbsOrigin(), true)
        ParticleManager.SetParticleControlEnt(iParticleID, 1, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
        ParticleManager.SetParticleControlEnt(iParticleID, 2, hTarget, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hTarget.GetAbsOrigin(), true)
        ParticleManager.SetParticleControlEnt(iParticleID, 3, hCaster, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
        ParticleManager.SetParticleControl(iParticleID, 6, (hCaster.GetAbsOrigin() + vDirection / 2 + iSign * GameFunc.VectorFunctions.Rotation2D(vDirection.Normalized(), math.rad(90)) * 200) as Vector)
        ParticleManager.SetParticleControl(iParticleID, 10, hCaster.GetAbsOrigin())
        ParticleManager.SetParticleControlForward(iParticleID, 10, hCaster.GetForwardVector())
        ParticleManager.ReleaseParticleIndex(iParticleID)

        modifier_lion_6_damage.apply(hTarget, hCaster, this, { duration: damage_delay })
        modifier_lion_6_delay.apply(hTarget, hCaster, this, { duration: grace_period })

        EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Lion.FingerOfDeathImpact", hCaster), hCaster)

        let hAbility4 = ability3_lion_mana_drain.findIn(hCaster)
        if (GameFunc.IsValid(hAbility4) && hAbility4.GetTargetMana != null) {
            hAbility4.GetTargetMana(hTarget)
        }
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_lion_6"
    // }




}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_lion_6 extends BaseModifier_Plus {
    damage_per_kill: number;
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        this.damage_per_kill = this.GetSpecialValueFor("damage_per_kill")
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }
    OnRefresh(params: ModifierTable) {
        super.OnRefresh(params);
        this.damage_per_kill = this.GetSpecialValueFor("damage_per_kill")
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
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    tooltip(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        let extra_damage_per_kill = hCaster.HasTalent("special_bonus_unique_lion_custom_2") && hCaster.GetTalentValue("special_bonus_unique_lion_custom_2") || 0
        return this.GetStackCount() * (this.damage_per_kill + extra_damage_per_kill)
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_lion_6_damage extends BaseModifier_Plus {
    damage: number;
    damage_scepter: number;
    damage_per_kill: number;
    damage_per_mana: number;
    damage_type: DAMAGE_TYPES;
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
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let extra_damage_per_mana = hCaster.HasTalent("special_bonus_unique_lion_custom_5") && hCaster.GetTalentValue("special_bonus_unique_lion_custom_5") || 0
        this.damage = this.GetSpecialValueFor("damage")
        this.damage_scepter = this.GetSpecialValueFor("damage_scepter")
        this.damage_per_kill = this.GetSpecialValueFor("damage_per_kill")
        this.damage_per_mana = this.GetSpecialValueFor("damage_per_mana") + extra_damage_per_mana
        if (IsServer()) {
            this.damage_type = this.GetAbilityPlus().GetAbilityDamageType()
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus() as ability6_lion_finger_of_death
            if (GameFunc.IsValid(hCaster) && GameFunc.IsValid(hAbility) && hParent.IsAlive()) {
                let extra_damage_per_kill = hCaster.GetTalentValue("special_bonus_unique_lion_custom_2")
                let damage_per_kill = this.damage_per_kill + extra_damage_per_kill
                let fDamage = hCaster.HasScepter() && this.damage_scepter || this.damage
                fDamage = fDamage + hCaster.GetMaxMana() * this.damage_per_mana * 0.01
                fDamage = fDamage + damage_per_kill * modifier_lion_6.GetStackIn(hCaster)

                let tDamageTable = {
                    ability: hAbility,
                    victim: hParent,
                    attacker: hCaster,
                    damage: fDamage,
                    damage_type: this.damage_type
                }
                BattleHelper.GoApplyDamage(tDamageTable)
                let tTarget = hAbility.tTarget
                if (hParent.IsAlive() && tTarget != null) {
                    if (hAbility.iTotalDamage != null) {
                        hAbility.iTotalDamage = hAbility.iTotalDamage + 1
                    }
                    // 在最后一个单位检测，是否全部被杀死
                    if (hAbility.iTotalDamage != tTarget.length) {
                        return
                    }
                    if (this.IsAllAlive != null && this.IsAllAlive(tTarget)) {
                        let hModifier = modifier_lion_6_extra_finger.apply(tTarget[0], hCaster, hAbility, null)
                        if (GameFunc.IsValid(hModifier)) {
                            let iCurLevelManaCost = hAbility.GetManaCost(hAbility.GetLevel() - 1)
                            let iExtraStack = this.GetExtraStock(hModifier.GetStackCount())
                            let iCurManaCost = iCurLevelManaCost * iExtraStack
                            let iCurMana = hCaster.GetMana()
                            let iCastRange = hAbility.GetCastRange(hCaster.GetAbsOrigin(), hCaster)
                            if (iCurManaCost > hCaster.GetMana() || !tTarget[0].IsPositionInRange(hCaster.GetAbsOrigin(), iCastRange)) {
                                hModifier.Destroy()
                                return
                            } else {
                                hAbility.EndCooldown()
                                hAbility.fManaCostFactor = iExtraStack
                                ExecuteOrderFromTable(
                                    {
                                        UnitIndex: hCaster.entindex(),
                                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                                        TargetIndex: tTarget[0].entindex(),
                                        AbilityIndex: hAbility.entindex()
                                    }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
    IsAllAlive(t: Array<any>) {
        for (let v of (t)) {
            if (!GameFunc.IsValid(v) || !v.IsAlive()) {
                return false
            }
        }
        return true
    }
    GetExtraStock(iCount: number) {
        let iNum = 1
        for (let i = 1; i <= iCount; i++) {
            iNum = iNum * 2
        }
        return iNum
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_lion_6_delay extends BaseModifier_Plus {
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
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus()

            if (!GameFunc.IsValid(hParent) || !hParent.IsAlive()) {
                if (GameFunc.IsValid(hCaster)) {
                    let factor = hParent.IsConsideredHero() && 5 || 1
                    let hmodifier_lion_6 = modifier_lion_6.findIn(hCaster)
                    // if (GameFunc.IsValid(hmodifier_lion_6) && !Spawner.IsEndless()) {
                    //     hmodifier_lion_6.SetStackCount(hmodifier_lion_6.GetStackCount() + factor)
                    // }
                    if (GameFunc.IsValid(hAbility)) {
                        let kill_cooldown_reduce = hAbility.GetSpecialValueFor("kill_cooldown_reduce")
                        if (!hAbility.IsCooldownReady()) {
                            let fCooldownTime = hAbility.GetCooldownTimeRemaining()
                            hAbility.EndCooldown()
                            fCooldownTime = fCooldownTime - kill_cooldown_reduce * factor
                            if (fCooldownTime > 0) {
                                hAbility.StartCooldown(fCooldownTime)
                            }
                        }
                    }
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_lion_6_extra_finger extends BaseModifier_Plus {
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.IncrementStackCount()
        }
    }
    OnRefresh(params: ModifierTable) {
        super.OnRefresh(params);
        if (IsServer()) {
            this.IncrementStackCount()
        }
    }
    OnDestroy() {
        super.OnDestroy();
        let ability = this.GetAbilityPlus() as ability6_lion_finger_of_death
        if (GameFunc.IsValid(this.GetAbilityPlus()) && ability.fManaCostFactor != null) {
            ability.fManaCostFactor = null
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_lion_6_particle_pre extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_lion/lion_spell_finger_of_death_charge.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
}
