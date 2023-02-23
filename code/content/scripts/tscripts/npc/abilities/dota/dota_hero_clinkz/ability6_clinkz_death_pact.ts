import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_building } from "../../../modifier/modifier_building";
import { ability3_clinkz_wind_walk, modifier_clinkz_3 } from "./ability3_clinkz_wind_walk";

/** dota原技能数据 */
export const Data_clinkz_death_pact = { "ID": "5262", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilitySound": "Hero_Clinkz.DeathPact", "AbilityDraftUltScepterAbility": "clinkz_burning_army", "AbilityCastRange": "900", "AbilityCastPoint": "0.2", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "80 70 60", "AbilityManaCost": "100", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "65" }, "02": { "var_type": "FIELD_INTEGER", "health_gain_pct": "40 70 100", "LinkedSpecialBonus": "special_bonus_unique_clinkz_8" }, "03": { "var_type": "FIELD_INTEGER", "damage_gain_pct": "4 8 12", "LinkedSpecialBonus": "special_bonus_unique_clinkz_8", "LinkedSpecialBonusField": "value2" } } };

@registerAbility()
export class ability6_clinkz_death_pact extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "clinkz_death_pact";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_clinkz_death_pact = Data_clinkz_death_pact;
    Init() {
        this.SetDefaultSpecialValue("radius", 100);
        this.SetDefaultSpecialValue("duration", [5, 6, 7, 8, 9, 10]);
        this.SetDefaultSpecialValue("count", [2, 2, 3, 3, 4, 4]);
        this.SetDefaultSpecialValue("attack_rate", 1.6);
        this.SetDefaultSpecialValue("damage_percent", [40, 45, 50, 55, 60, 70]);

    }

    tArmys: any[];

    Precache(context: any) {
        PrecacheUnitByNameSync("npc_dota_clinkz_skeleton_archer", context, -1)
    }

    ScepterSummon(iCount: number) {
        let hCaster = this.GetCasterPlus()
        let radius = this.GetSpecialValueFor("radius")
        let sTalentName = "special_bonus_unique_clinkz_custom_7"
        let duration = this.GetSpecialValueFor("duration") + hCaster.GetTalentValue(sTalentName)
        let damage_percent = this.GetSpecialValueFor("damage_percent") + hCaster.GetTalentValue(sTalentName)
        let hHero = PlayerResource.GetSelectedHeroEntity(hCaster.GetPlayerOwnerID())

        let vDirection = hCaster.GetForwardVector()

        let iBaseMinDamage = hCaster.GetAverageTrueAttackDamage(null) * damage_percent * 0.01
        let iBaseMaxDamage = hCaster.GetAverageTrueAttackDamage(null) * damage_percent * 0.01

        let clinkz_4 = ability3_clinkz_wind_walk.findIn(hCaster)
        let iAbilityLevel = GameFunc.IsValid(clinkz_4) && clinkz_4.GetLevel() || 0

        if (this.tArmys == null) {
            this.tArmys = []
        }


        for (let i = 1; i <= iCount; i++) {
            let vPosition = (hCaster.GetAbsOrigin() + GameFunc.VectorFunctions.Rotation2D(vDirection, math.rad(360 / iCount * (i - 1))) * radius) as Vector

            let hArmy = CreateUnitByName("npc_dota_clinkz_skeleton_archer", vPosition, false, hHero, hHero, hCaster.GetTeamNumber())
            hArmy.SetBaseDamageMin(iBaseMinDamage)
            hArmy.SetBaseDamageMax(iBaseMaxDamage)

            this.addTimer(0, () => {
                let army_clinkz_4 = ability3_clinkz_wind_walk.findIn(hArmy)
                if (army_clinkz_4) {
                    army_clinkz_4.SetLevel(iAbilityLevel)
                    if (iAbilityLevel == 0) {
                        modifier_clinkz_3.remove(hArmy)
                    } else {
                        if (!army_clinkz_4.GetAutoCastState()) {
                            army_clinkz_4.ToggleAutoCast()
                        }
                    }
                }
            })

            hArmy.SetForwardVector(hCaster.GetForwardVector())
            hArmy.SetControllableByPlayer(hCaster.GetPlayerOwnerID(), true)
            modifier_clinkz_6_summon.apply(hArmy, hCaster, this, { duration: duration })
            // hArmy.FireSummonned(hCaster)
        }
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let sTalentName = "special_bonus_unique_clinkz_custom_4"
        let count = this.GetSpecialValueFor("count") + hCaster.GetTalentValue(sTalentName)
        this.ScepterSummon(count)
    }

    GetIntrinsicModifierName() {
        return "modifier_clinkz_6"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_clinkz_6 extends BaseModifier_Plus {
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

            let range = caster.Script_GetAttackRange()
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
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
export class modifier_clinkz_6_summon extends BaseModifier_Plus {
    attack_rate: number;
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

        let hCaster = this.GetCasterPlus()
        let sTalentName = "special_bonus_unique_clinkz_custom_5"
        this.attack_rate = this.GetSpecialValueFor("attack_rate") - hCaster.GetTalentValue(sTalentName)
        if (IsServer()) {
            modifier_building.apply(this.GetParentPlus(), this.GetCasterPlus(), this.GetAbilityPlus(), null)

            table.insert((this.GetAbilityPlus() as ability6_clinkz_death_pact).tArmys, this.GetParentPlus())
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_clinkz/clinkz_burning_army.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_clinkz/clinkz_burning_army_start.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
    BeRefresh(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let sTalentName = "special_bonus_unique_clinkz_custom_5"
        this.attack_rate = this.GetSpecialValueFor("attack_rate") - hCaster.GetTalentValue(sTalentName)
    }
    BeDestroy() {

        if (IsServer()) {
            if (GameFunc.IsValid(this.GetAbilityPlus())) {
                GameFunc.ArrayFunc.ArrayRemove((this.GetAbilityPlus() as ability6_clinkz_death_pact).tArmys, this.GetParentPlus())
            }
            this.GetParentPlus().ForceKill(false)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT)
    GetBaseAttackTimeConstant(params: IModifierTable) {
        return this.attack_rate
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BASE_OVERRIDE)
    GetAttackRangeOverride(params: IModifierTable) {
        if (GameFunc.IsValid(this.GetCasterPlus())) {
            return this.GetCasterPlus().Script_GetAttackRange()
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MODEL_CHANGE)
    GetModelChange(params: IModifierTable) {
        return ResHelper.GetModelReplacement("models/heroes/clinkz/clinkz_archer.vmdl", this.GetCasterPlus())
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.LIFETIME_FRACTION)
    Get_UnitLifetimeFraction() {
        return (this.GetDieTime() - GameRules.GetGameTime()) / this.GetDuration()
    }
}
