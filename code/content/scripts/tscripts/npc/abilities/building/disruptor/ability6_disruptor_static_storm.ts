import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_shock } from "../../../modifier/effect/modifier_shock";

/** dota原技能数据 */
export const Data_disruptor_static_storm = { "ID": "5461", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "2", "AbilitySound": "Hero_Disruptor.StaticStorm.Cast", "HasScepterUpgrade": "1", "AbilityCastAnimation": "ACT_DOTA_STATIC_STORM", "AbilityCastGestureSlot": "DEFAULT", "AbilityCastPoint": "0.05 0.05 0.05 0.05", "AbilityCooldown": "90 80 70", "AbilityManaCost": "125 175 225", "AbilityCastRange": "800 800 800 800", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "500" }, "02": { "var_type": "FIELD_INTEGER", "pulses": "20", "LinkedSpecialBonus": "special_bonus_unique_disruptor_7", "LinkedSpecialBonusField": "value2" }, "03": { "var_type": "FIELD_INTEGER", "damage_max": "200 275 350" }, "04": { "var_type": "FIELD_FLOAT", "duration": "5.0", "LinkedSpecialBonus": "special_bonus_unique_disruptor_7" } } };

@registerAbility()
export class ability6_disruptor_static_storm extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "disruptor_static_storm";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_disruptor_static_storm = Data_disruptor_static_storm;
    Init() {
        this.SetDefaultSpecialValue("duration", 5);
        this.SetDefaultSpecialValue("damage_count", 10);
        this.SetDefaultSpecialValue("base_damage", [150, 250, 400, 650, 1000, 1500]);
        this.SetDefaultSpecialValue("damage_bonus_int", [2, 3, 4, 5, 6, 7]);
        this.SetDefaultSpecialValue("shock_bonus_int", [4, 4.5, 5, 5.5, 6, 7]);
        this.SetDefaultSpecialValue("damage_radius", 400);
        this.SetDefaultSpecialValue("shard_damage_increase", 35);

    }



    GetAOERadius() {
        return this.GetSpecialValueFor("damage_radius")
    }
    OnSpellStart() {
        this.SpawnStorm(this.GetCursorPosition())
    }
    SpawnStorm(vPos: Vector) {
        let hCaster = this.GetCasterPlus()
        let sTalentName1 = "special_bonus_unique_disruptor_custom_1"
        let sTalentName4 = "special_bonus_unique_disruptor_custom_4"
        let fDamage = this.GetSpecialValueFor("base_damage") + hCaster.GetIntellect() * (this.GetSpecialValueFor("damage_bonus_int") + hCaster.GetTalentValue(sTalentName1))
        let duration = this.GetSpecialValueFor("duration")
        let iDamageCount = this.GetSpecialValueFor("damage_count")
        let iShockCount = hCaster.GetIntellect() * (this.GetSpecialValueFor("shock_bonus_int") + hCaster.GetTalentValue(sTalentName4))
        let iRadius = this.GetSpecialValueFor("damage_radius")
        modifier_disruptor_6_thinker.applyThinker(vPos, hCaster, this, {
            fDamage: fDamage,
            fDamageTick: duration / iDamageCount,
            iShockCount: iShockCount,
            duration: duration,
            bScepter: hCaster.HasShard(),
            iRadius: iRadius
        }, hCaster.GetTeam(), false)
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_disruptor_6"
    // }
}
//  Modifiers
@registerModifier()
export class modifier_disruptor_6 extends BaseModifier_Plus {
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
            if (vPos != vec3_invalid) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: (vPos) as Vector
                })
            }
        }
    }
}

//  Modifiers
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_disruptor_6_debuff extends BaseModifier_Plus {
    iDamageIncrease: number;
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
    Init(params: IModifierTable) {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            this.iDamageIncrease = this.GetSpecialValueFor("shard_damage_increase")
            this.SetStackCount(this.iDamageIncrease)
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_MAGICAL_DAMAGE_PERCENTAGE)
    G_INCOMING_MAGICAL_DAMAGE_PERCENTAGE() {
        return this.iDamageIncrease
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.GetStackCount()
    }
}

//  Modifiers
// // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_disruptor_6_thinker extends BaseModifier_Plus {
    vPos: Vector;
    fDamage: any;
    iShockCount: any;
    fDamageTick: any;
    iRadius: any;
    bScepter: any;
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
    IsAura() {
        return true
    }
    GetAura() {
        return "modifier_disruptor_6_debuff"
    }
    GetAuraRadius() {
        return this.bScepter != 0 && this.iRadius || 0
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
    }
    GetAuraDuration() {
        return 0.1
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            this.vPos = this.GetParentPlus().GetOrigin()
            this.fDamage = params.fDamage || 1
            this.iShockCount = params.iShockCount || 0
            this.fDamageTick = params.fDamageTick || 1
            this.iRadius = params.iRadius || 100
            this.bScepter = params.bScepter
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_disruptor/disruptor_static_storm.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControl(iParticleID, 0, this.vPos)
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.iRadius, 0, 0))
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(this.GetDuration(), 0, 0))
            this.AddParticle(iParticleID, false, false, -1, false, false)
            this.iParticleID = iParticleID
            this.StartIntervalThink(this.fDamageTick)
        } else {
            EmitSoundOn("Hero_Disruptor.StaticStorm", this.GetParentPlus())
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            this.StartIntervalThink(-1)
            EmitSoundOn("Hero_Disruptor.StaticStorm.End", this.GetParentPlus())
            UTIL_Remove(this.GetParentPlus())
        }
    }
    OnIntervalThink() {
        this.Process()
    }
    Process() {
        let hCaster = this.GetCasterPlus()
        if (!GameFunc.IsValid(hCaster)) {
            this.Destroy()
            return
        }
        let tDamageTable: BattleHelper.DamageOptions = {
            attacker: hCaster,
            damage: this.fDamage * this.fDamageTick,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            damage_flags: 0,
            ability: this.GetAbilityPlus(),
            victim: null
        }
        let units = FindUnitsInRadius(hCaster.GetTeam(), this.vPos, null, this.iRadius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, 0, 0, false)
        for (let hTarget of (units)) {
            tDamageTable.victim = hTarget
            BattleHelper.GoApplyDamage(tDamageTable)
            modifier_shock.Shock(hTarget, hCaster, this.GetAbilityPlus(), this.iShockCount * this.fDamageTick)
        }
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
