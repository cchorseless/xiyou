import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_shock } from "../../../modifier/effect/modifier_shock";

/** dota原技能数据 */
export const Data_disruptor_thunder_strike = { "ID": "5458", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_Disruptor.ThunderStrike.Target", "HasShardUpgrade": "1", "AbilityCastAnimation": "ACT_DOTA_THUNDER_STRIKE", "AbilityCastGestureSlot": "DEFAULT", "AbilityCastPoint": "0.05 0.05 0.05 0.05", "AbilityCooldown": "18 15 12 9", "AbilityManaCost": "130 140 150 160", "AbilityCastRange": "800 800 800 800", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "240" }, "02": { "var_type": "FIELD_INTEGER", "strikes": "4", "LinkedSpecialBonus": "special_bonus_unique_disruptor" }, "03": { "var_type": "FIELD_FLOAT", "strike_interval": "2.0 2.0 2.0 2.0" }, "04": { "var_type": "FIELD_INTEGER", "strike_damage": "45 70 95 120", "LinkedSpecialBonus": "special_bonus_unique_disruptor_3" }, "05": { "var_type": "FIELD_FLOAT", "slow_duration": "0.1" }, "06": { "var_type": "FIELD_INTEGER", "slow_amount": "100" } } };

@registerAbility()
export class ability1_disruptor_thunder_strike extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "disruptor_thunder_strike";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_disruptor_thunder_strike = Data_disruptor_thunder_strike;
    Init() {
        this.SetDefaultSpecialValue("duration", 4);
        this.SetDefaultSpecialValue("damage_radius", 300);
        this.SetDefaultSpecialValue("damage_interval", 1);
        this.SetDefaultSpecialValue("base_damage", [225, 350, 600, 1100, 1900, 3000]);
        this.SetDefaultSpecialValue("damage_bonus_int", [5, 6, 7, 8, 9, 10]);
        this.SetDefaultSpecialValue("shock_bonus_int", [2.5, 3, 3.5, 4, 4.5, 5]);

    }

    GetAOERadius() {
        return this.GetSpecialValueFor("damage_radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        this.SpawnLightning(this.GetCursorPosition())
        EmitSoundOn("Hero_Disruptor.ThunderStrike.Cast", hCaster)
    }
    SpawnLightning(vPos: Vector) {
        let hCaster = this.GetCasterPlus()
        let sTalentName2 = "special_bonus_unique_disruptor_custom_2"
        let sTalentName5 = "special_bonus_unique_disruptor_custom_5"
        let fDamage = this.GetSpecialValueFor("base_damage") + hCaster.GetIntellect() * (this.GetSpecialValueFor("damage_bonus_int") + hCaster.GetTalentValue(sTalentName2))
        let fDamageTick = this.GetSpecialValueFor("damage_interval") - hCaster.GetTalentValue(sTalentName5)
        let iShockCount = hCaster.GetIntellect() * this.GetSpecialValueFor("shock_bonus_int")
        let iRadius = this.GetSpecialValueFor("damage_radius")
        let duration = this.GetSpecialValueFor("duration")
        modifier_disruptor_1_thinker.applyThinker(vPos, hCaster, this, {
            fDamage: fDamage,
            fDamageTick: fDamageTick,
            iShockCount: iShockCount,
            duration: duration,
            iRadius: iRadius
        }, hCaster.GetTeam(), false)
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_disruptor_1"
    // }
}
//  Modifiers
@registerModifier()
export class modifier_disruptor_1 extends BaseModifier_Plus {
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

            let range = ability.GetCastRange(hCaster.GetAbsOrigin(), hCaster) + hCaster.GetCastRangeBonus()
            let radius = ability.GetSpecialValueFor("damage_radius")
            let vPos = AoiHelper.GetAOEMostTargetsPosition(hCaster.GetAbsOrigin(), range, hCaster.GetTeam(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0)
            if (vPos && vPos != vec3_invalid) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: vPos
                })
            }
        }
    }
}

//  Modifiers
@registerModifier()
export class modifier_disruptor_1_thinker extends BaseModifier_Plus {
    vPos: Vector;
    fDamage: any;
    iShockCount: any;
    fDamageTick: any;
    iRadius: any;
    iParticleID: ParticleID;
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
            let hCaster = this.GetCasterPlus()
            this.vPos = this.GetParentPlus().GetOrigin()
            this.fDamage = params.fDamage || 1
            this.iShockCount = params.iShockCount || 0
            this.fDamageTick = params.fDamageTick || 1
            this.iRadius = params.iRadius || 100
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_disruptor/disruptor_thunder_strike_buff.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControl(iParticleID, 0, (this.vPos + Vector(0, 0, 200)) as Vector)
            this.AddParticle(iParticleID, false, false, -1, false, false)
            this.iParticleID = iParticleID
            this.Process()
            this.StartIntervalThink(this.fDamageTick)
        }
    }
    BeDestroy() {

        if (IsServer()) {
            UTIL_Remove(this.GetParentPlus())
        }
    }
    OnIntervalThink() {
        this.Process()
    }
    Process() {
        let hCaster = this.GetCasterPlus()
        if (hCaster == null) {
            this.Destroy()
            return
        }
        let iParticle = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_disruptor/disruptor_thunder_strike_bolt.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
            owner: hCaster
        });

        ParticleManager.SetParticleControl(iParticle, 0, (this.vPos + Vector(0, 0, 200)) as Vector)
        ParticleManager.SetParticleControl(iParticle, 1, this.vPos)
        ParticleManager.SetParticleControl(iParticle, 2, this.vPos)
        ParticleManager.SetParticleControl(iParticle, 7, Vector(this.iRadius, 0, 0))
        let tDamageTable: BattleHelper.DamageOptions = {
            attacker: hCaster,
            damage: this.fDamage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            damage_flags: 0,
            victim: null,
            ability: this.GetAbilityPlus()
        }
        let units = FindUnitsInRadius(hCaster.GetTeam(), this.vPos, null, this.iRadius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, 0, 0, false)
        for (let hTarget of (units)) {
            tDamageTable.victim = hTarget
            BattleHelper.GoApplyDamage(tDamageTable)
            modifier_shock.Shock(hTarget, hCaster, this.GetAbilityPlus(), this.iShockCount)

        }
        EmitSoundOn("Hero_Disruptor.ThunderStrike.Target", this.GetParentPlus())
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_FLYING]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
        }
    }
}
