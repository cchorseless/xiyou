import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";
import { modifier_mirana_3_buff } from "./ability3_mirana_leap";
/** dota原技能数据 */
export const Data_mirana_starfall = { "ID": "5051", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "1", "AbilitySound": "Ability.Starfall", "HasScepterUpgrade": "0", "AbilityCastPoint": "0.4", "AbilityCooldown": "12.0 12.0 12.0 12.0", "AbilityDuration": "10.0 10.0 10.0 10.0", "AbilityDamage": "75 150 225 300", "AbilityManaCost": "80 105 130 155", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "starfall_radius": "650" }, "02": { "var_type": "FIELD_INTEGER", "starfall_secondary_radius": "425" }, "03": { "var_type": "FIELD_INTEGER", "secondary_starfall_damage_percent": "75" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1", "AbilityCastGestureSlot": "DEFAULT" };

@registerAbility()
export class ability1_mirana_starfall extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "mirana_starfall";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_mirana_starfall = Data_mirana_starfall;
    Init() {
        this.SetDefaultSpecialValue("starfall_radius", 1300);
        this.SetDefaultSpecialValue("starfall_secondary_radius", 1300);
        this.SetDefaultSpecialValue("interval_scepter", 8);
        this.SetDefaultSpecialValue("secondary_starfall_damage_percent", 100);
        this.SetDefaultSpecialValue("duration", 5);
        this.SetDefaultSpecialValue("interval", 0.5);

    }

    Init_old() {
        this.SetDefaultSpecialValue("starfall_radius", 1300);
        this.SetDefaultSpecialValue("starfall_secondary_radius", 1300);
        this.SetDefaultSpecialValue("interval_scepter", 8);
        this.SetDefaultSpecialValue("secondary_starfall_damage_percent", 75);
        this.SetDefaultSpecialValue("duration", 5);
        this.SetDefaultSpecialValue("interval", 0.5);

    }

    static delay = 0.57

    GetAOERadius() {
        return this.GetSpecialValueFor("starfall_radius")
    }
    GetCooldown(iLevel: number) {
        if (iLevel == 100) {
            return this.GetSpecialValueFor("interval_scepter")
        }
        return super.GetCooldown(iLevel)
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vCasterLoc = hCaster.GetAbsOrigin()

        let starfall_radius = this.GetSpecialValueFor("starfall_radius")
        let duration = this.GetSpecialValueFor("duration")
        let starfall_secondary_radius = this.GetSpecialValueFor("starfall_secondary_radius")
        let starfall_damage = this.GetAbilityDamage() + this.GetSpecialValueFor("agility_factor") * hCaster.GetAgility()
        let interval = this.GetSpecialValueFor("interval")

        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vCasterLoc, starfall_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)
        let tTargetEntIndex = HashTableHelper.CreateHashtable();
        tTargetEntIndex.data = [];
        for (let v of (tTargets)) {
            table.insert(tTargetEntIndex.data, v.entindex())
        }

        let hThinker = modifier_mirana_1_thinker.applyThinker(vCasterLoc, hCaster, this, { duration: ability1_mirana_starfall.delay, hashtable_index: HashTableHelper.GetHashtableIndex(tTargetEntIndex) }, hCaster.GetTeamNumber(), false)
    }

    GetIntrinsicModifierName() {
        return "modifier_mirana_1"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_mirana_1 extends BaseModifier_Plus {
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

        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }


    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (ability == null || ability.IsNull()) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let caster = ability.GetCasterPlus()

            if (caster.HasScepter() && !modifier_mirana_1_scepter.exist(caster)) {
                modifier_mirana_1_scepter.apply(caster, caster, ability, null)
            } else if (!caster.HasScepter() && modifier_mirana_1_scepter.exist(caster)) {
                modifier_mirana_1_scepter.remove(caster);
            }

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

            let range = ability.GetSpecialValueFor("starfall_radius")

            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let tTargets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (tTargets.length > 0) {
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
export class modifier_mirana_1_thinker extends modifier_particle_thinker {
    bIsSecondary: boolean;
    tTargetEntIndex: any[];
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsServer()) {
            this.bIsSecondary = params.is_secondary == 1
            this.tTargetEntIndex = HashTableHelper.GetHashtableByIndex(params.hashtable_index || -1).data as Array<any>
            for (let iTargetEntIndex of (this.tTargetEntIndex)) {
                let hTarget = EntIndexToHScript(iTargetEntIndex)
                if (GameFunc.IsValid(hTarget)) {
                    let iParticleID = ResHelper.CreateParticle({
                        resPath: "particles/units/heroes/hero_mirana/mirana_starfall_attack.vpcf",
                        resNpc: hCaster,
                        iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                        owner: null
                    });

                    ParticleManager.SetParticleControlEnt(iParticleID, 0, hTarget, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hTarget.GetAbsOrigin(), true)
                    ParticleManager.ReleaseParticleIndex(iParticleID)
                }
            }
            HashTableHelper.RemoveHashtable(this.tTargetEntIndex)
            if (!this.bIsSecondary) {
                hCaster.EmitSound(ResHelper.GetSoundReplacement("Ability.Starfall", hCaster))
            }
        } else {
            this.bIsSecondary = this.GetStackCount() == 1
            if (!this.bIsSecondary) {
                let iParticleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_mirana/mirana_starfall_moonray.vpcf",
                    resNpc: hCaster,
                    iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW,
                    owner: hCaster
                });

                ParticleManager.ReleaseParticleIndex(iParticleID)
            }
        }
    }
    OnRemoved() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsServer()) {
            if (!GameFunc.IsValid(hAbility) || !GameFunc.IsValid(hCaster)) {
                return
            }
            let duration = hAbility.GetSpecialValueFor("duration")
            let extra_secondary_starfall_damage_percent = hCaster.HasTalent("special_bonus_unique_mirana_custom_2") && hCaster.GetTalentValue("special_bonus_unique_mirana_custom_2") || 0
            let secondary_starfall_damage_percent = hAbility.GetSpecialValueFor("secondary_starfall_damage_percent") + extra_secondary_starfall_damage_percent
            let starfall_radius = hAbility.GetSpecialValueFor("starfall_radius")
            let agility_factor = hAbility.GetSpecialValueFor("agility_factor")

            let bHas_special_bonus_unique_mirana_custom_4 = hCaster.HasTalent("special_bonus_unique_mirana_custom_4")

            let stack_damage_percent = 0
            let stack_duration = 0
            let max_stack_damage_percent = 0
            if (bHas_special_bonus_unique_mirana_custom_4) {
                stack_damage_percent = hCaster.GetTalentValue("special_bonus_unique_mirana_custom_4")
                stack_duration = hCaster.GetTalentValue("special_bonus_unique_mirana_custom_4", "duration")
                max_stack_damage_percent = hCaster.GetTalentValue("special_bonus_unique_mirana_custom_4", "max_value")
            }

            let iAgi = hCaster.GetAgility != null && hCaster.GetAgility() || 0
            let fDamage = hAbility.GetAbilityDamage() + iAgi * agility_factor
            if (this.bIsSecondary) {
                fDamage = fDamage * secondary_starfall_damage_percent * 0.01
            }
            for (let iTargetEntIndex of (this.tTargetEntIndex)) {
                let hTarget = EntIndexToHScript(iTargetEntIndex) as IBaseNpc_Plus
                if (GameFunc.IsValid(hTarget) && hTarget.IsAlive()) {
                    let iStackCount = 0
                    if (this.bIsSecondary) {
                        let hModifier = modifier_mirana_1_counter.findIn(hTarget) as IBaseModifier_Plus;
                        if (GameFunc.IsValid(hModifier)) {
                            iStackCount = hModifier.GetStackCount()
                        }
                    }
                    let fStackDamagePercent = math.min(iStackCount * stack_damage_percent, max_stack_damage_percent)
                    // 魔晶伤害无上限
                    if (hCaster.HasShard()) {
                        fStackDamagePercent = iStackCount * stack_damage_percent
                    }
                    let tDamageTable = {
                        ability: hAbility,
                        attacker: hCaster,
                        victim: hTarget,
                        damage: fDamage * (1 + fStackDamagePercent * 0.01),
                        damage_type: hAbility.GetAbilityDamageType()
                    }
                    BattleHelper.GoApplyDamage(tDamageTable)

                    EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Ability.StarfallImpact", hCaster), hCaster)

                    if (bHas_special_bonus_unique_mirana_custom_4) {
                        modifier_mirana_1_counter.apply(hTarget, hCaster, hAbility, { duration: stack_duration })
                    }
                }
            }

            if (!this.bIsSecondary) {
                let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), starfall_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)
                let tTargetEntIndex = HashTableHelper.CreateHashtable()
                tTargetEntIndex.data = [];
                for (let v of (tTargets)) {
                    table.insert(tTargetEntIndex.data, v.entindex())
                    break
                }

                let hModifier = modifier_mirana_1_thinker.apply(hParent, hCaster, hAbility, { duration: ability1_mirana_starfall.delay, is_secondary: 1, hashtable_index: HashTableHelper.GetHashtableIndex(tTargetEntIndex) }) as IBaseModifier_Plus
                if (GameFunc.IsValid(hModifier)) {
                    hModifier.SetStackCount(1)
                }
                if (modifier_mirana_3_buff.exist(hCaster)) {
                    modifier_mirana_1_effect.apply(hParent, hCaster, hAbility, { duration: duration })
                }
            }
        }
    }
    BeDestroy() {

        let hParent = this.GetParentPlus()
        if (IsServer()) {
            if (this.bIsSecondary && !modifier_mirana_1_effect.exist(hParent)) {
                UTIL_Remove(hParent)
                //  hParent.RemoveSelf()
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_mirana_1_effect extends modifier_particle_thinker {
    interval: number;
    BeCreated(params: IModifierTable) {

        this.interval = this.GetSpecialValueFor("interval")
        if (IsServer()) {
            this.StartIntervalThink(this.interval)
        }
    }
    OnIntervalThink() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsServer()) {
            if (!GameFunc.IsValid(hAbility) || !GameFunc.IsValid(hCaster)) {
                this.Destroy()
                return
            }
            let starfall_radius = hAbility.GetSpecialValueFor("starfall_radius")
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), starfall_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)
            let tTargetEntIndex = HashTableHelper.CreateHashtable()
            tTargetEntIndex.data = [];
            for (let v of (tTargets)) {
                table.insert(tTargetEntIndex.data, v.entindex())
            }
            let hModifier = modifier_mirana_1_thinker.apply(hParent, hCaster, hAbility, { duration: ability1_mirana_starfall.delay, is_secondary: 1, hashtable_index: HashTableHelper.GetHashtableIndex(tTargetEntIndex) }) as IBaseModifier_Plus
            if (GameFunc.IsValid(hModifier)) {
                hModifier.SetStackCount(1)
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_mirana_1_scepter extends BaseModifier_Plus {
    initialized: any;
    max_charge: number;
    interval_scepter: number;
    IsHidden() {
        return !this.GetParentPlus().HasScepter() || this.GetCasterPlus().IsIllusion()
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
    RemoveOnDeath() {
        return false
    }
    DestroyOnExpire() {
        return false
    }
    Init_old() {
        if (IsServer()) {
            if (!this.initialized && this.GetAbilityPlus().GetLevel() != 0) {
                this.initialized = true
                let fInterval = this.interval_scepter * this.GetCasterPlus().GetCooldownReduction()
                this.SetDuration(fInterval, true)
                this.StartIntervalThink(fInterval)
                let time = GameRules.GetGameTime() + 1
                GTimerHelper.AddFrameTimer(1, GHandler.create(this, () => {
                    if (this.IsNull()) {
                        return
                    }
                    if (GameRules.GetGameTime() > time) {
                        time = GameRules.GetGameTime() + 1
                        if (this.GetStackCount() == 0) {
                            return 0
                        }
                        let parent = this.GetParentPlus()
                        if (parent.HasScepter() && !parent.PassivesDisabled() && !parent.IsIllusion() && parent.IsAlive() && !parent.IsInvisible()) {
                            let target_point = parent.GetAbsOrigin()
                            let starfall_radius = this.GetSpecialValueFor("starfall_radius")
                            let targets = AoiHelper.FindEntityInRadius(parent.GetTeamNumber(), target_point, starfall_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)
                            if (targets.length > 0) {
                                if (this.GetStackCount() == this.max_charge) {
                                    let fInterval = this.interval_scepter * parent.GetCooldownReduction()
                                    this.SetDuration(fInterval, true)
                                    this.StartIntervalThink(fInterval)
                                    this.DecrementStackCount()
                                    this.GetAbilityPlus().OnSpellStart()
                                }
                            }
                        }
                    }
                    return 1
                }))
            }
        }
    }
    BeCreated(params: IModifierTable) {

        this.max_charge = 1
        this.interval_scepter = this.GetSpecialValueFor("interval_scepter")
        if (IsServer()) {
            this.Init()
        }
    }
    BeRefresh(params: IModifierTable) {

        this.max_charge = 1
        this.interval_scepter = this.GetSpecialValueFor("interval_scepter")
        if (IsServer()) {
            this.Init()
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            this.IncrementStackCount()
            if (this.GetStackCount() == this.max_charge) {
                this.StartIntervalThink(-1)
            } else {
                let fInterval = this.interval_scepter * this.GetCasterPlus().GetCooldownReduction()
                this.SetDuration(fInterval, true)
                this.StartIntervalThink(fInterval)
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_mirana_1_counter extends BaseModifier_Plus {
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
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            this.IncrementStackCount()
            GTimerHelper.AddTimer(params.duration, GHandler.create(this, () => {
                this.DecrementStackCount()
            }))
        }
    }

}
