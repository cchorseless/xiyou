
import { GameSetting } from "../../../../GameSetting";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_generic_shock } from "../../../modifier/effect/modifier_generic_shock";

/** dota原技能数据 */
export const Data_razor_plasma_field = { "ID": "5082", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "Ability.PlasmaField", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1", "AbilityCastGestureSlot": "DEFAULT", "AbilityCastRange": "0", "AbilityCastPoint": "0 0 0 0", "AbilityCooldown": "13 12 11 10", "AbilityManaCost": "125 125 125 125", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "damage_min": "35 40 45 50" }, "02": { "var_type": "FIELD_INTEGER", "damage_max": "80 115 150 185" }, "03": { "var_type": "FIELD_INTEGER", "radius": "700" }, "04": { "var_type": "FIELD_INTEGER", "speed": "636" }, "05": { "var_type": "FIELD_INTEGER", "slow_min": "5" }, "06": { "var_type": "FIELD_INTEGER", "slow_max": "25 30 35 40" }, "07": { "var_type": "FIELD_FLOAT", "slow_duration": "1.5" } } };

@registerAbility()
export class ability1_razor_plasma_field extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "razor_plasma_field";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_razor_plasma_field = Data_razor_plasma_field;
    Init() {
        this.SetDefaultSpecialValue("radius", 1000);
        this.SetDefaultSpecialValue("damage", [500, 700, 900, 1200, 1500, 2000]);
        this.SetDefaultSpecialValue("damage_bonus_agi", [4, 5, 6, 7, 8, 9]);
        this.SetDefaultSpecialValue("shock_pct", 65);
        this.SetDefaultSpecialValue("speed", 1000);

    }


    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        this.SpawnField()
    }
    SpawnField() {
        let hCaster = this.GetCasterPlus()
        let iRadius = this.GetSpecialValueFor("radius")
        let iSpeed = this.GetSpecialValueFor("speed")
        let sTalentName2 = "special_bonus_unique_razor_custom_2"
        let sTalentName8 = "special_bonus_unique_razor_custom_8"
        let fDamage = this.GetSpecialValueFor("damage") + hCaster.GetAgility() * (this.GetSpecialValueFor("damage_bonus_agi") + hCaster.GetTalentValue(sTalentName2))
        let iShockCount = this.GetSpecialValueFor("shock_pct") + hCaster.GetTalentValue(sTalentName8)
        modifier_razor_1_thinker.apply(hCaster, hCaster, this, {
            iRadius: iRadius,
            iSpeed: iSpeed,
            fDamage: fDamage,
            iShockCount: iShockCount,
            duration: iRadius / iSpeed
        })
    }

    GetIntrinsicModifierName() {
        return "modifier_razor_1"
    }
}

@registerModifier()
export class modifier_razor_1 extends BaseModifier_Plus {
    IsHidden() {
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
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (!GFuncEntity.IsValid(ability)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let hCaster = ability.GetCasterPlus()

            if (!ability.GetAutoCastState()) {
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }

            let range = ability.GetCastRange(hCaster.GetAbsOrigin(), hCaster)



            if (FindUnitsInRadius(hCaster.GetTeam(), hCaster.GetAbsOrigin(), null, range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0, false).length >= 1) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex()
                })
            }
        }
    }
}

//  MODIFIERS
@registerModifier()
export class modifier_razor_1_thinker extends BaseModifier_Plus {
    iSpeed: any;
    iRadius: any;
    fDamage: any;
    iShockCount: any;
    group1: { [k: string]: number };
    group2: { [k: string]: number };
    iParticleID: ParticleID;

    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    DestroyOnExpire() {
        return false
    }
    IsHidden() {
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
            this.iSpeed = params.iSpeed
            this.iRadius = params.iRadius
            this.fDamage = params.fDamage
            this.iShockCount = params.iShockCount
            this.group1 = {}
            this.group2 = {}
            this.SetHasCustomTransmitterData(true)
            this.StartIntervalThink(0)
        }
    }
    HandleCustomTransmitterData(params: IModifierTable) {
        this.iSpeed = params.iSpeed
        this.iRadius = params.iRadius
        let iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_razor/razor_plasmafield.vpcf",
            resNpc: null,
            iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
            owner: this.GetParentPlus()
        });

        ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.iSpeed, this.iRadius, 0))
        this.AddParticle(iParticleID, false, false, -1, false, false)
        this.iParticleID = iParticleID
        this.StartIntervalThink(this.iRadius / this.iSpeed)
        EmitSoundOn("Ability.PlasmaField", this.GetParentPlus())
    }
    AddCustomTransmitterData() {
        return {
            iSpeed: this.iSpeed,
            iRadius: this.iRadius
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetParentPlus()
            let d = this.GetElapsedTime() / this.GetDuration()
            let radius = 0
            if (d <= 1) {
                radius = this.iRadius * d
                let units = FindUnitsInRadius(hCaster.GetTeam(), hCaster.GetOrigin(), null, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, 0, 0, false)
                for (let u of (units)) {
                    if (!this.group1[u.entindex()]) {
                        BattleHelper.GoApplyDamage({
                            attacker: hCaster,
                            victim: u,
                            ability: this.GetAbilityPlus(),
                            damage: this.fDamage,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                        })
                        modifier_generic_shock.Shock(u, hCaster, this.GetAbilityPlus(), this.fDamage * (this.iShockCount * 0.01))
                        EmitSoundOn("Ability.PlasmaFieldImpact", this.GetParentPlus())
                        this.group1[u.entindex()] = 1
                    }
                }
            } else if (d <= 2) {
                radius = this.iRadius * (2 - d)
                let units = FindUnitsInRadius(hCaster.GetTeam(), hCaster.GetOrigin(), null, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, 0, 0, false)
                for (let u of (units)) {
                    if (!this.group2[u.entindex()]) {
                        BattleHelper.GoApplyDamage({
                            attacker: hCaster,
                            victim: u,
                            ability: this.GetAbilityPlus(),
                            damage: this.fDamage,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                        })
                        modifier_generic_shock.Shock(u, hCaster, this.GetAbilityPlus(), this.fDamage * (this.iShockCount * 0.01))
                        EmitSoundOn("Ability.PlasmaFieldImpact", this.GetParentPlus())
                        this.group2[u.entindex()] = 1
                    }
                }
            } else {
                this.Destroy()
            }
        } else {
            ParticleManager.SetParticleControl(this.iParticleID, 1, Vector(this.iSpeed, this.iRadius, -1))
        }
    }
}
