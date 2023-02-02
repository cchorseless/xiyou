
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_razor_static_link = { "ID": "5083", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilitySound": "Ability.static.start", "AbilityCastRange": "550", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCooldown": "40 35 30 25", "AbilityManaCost": "65", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "drain_length": "5 6 7 8" }, "02": { "var_type": "FIELD_FLOAT", "drain_duration": "15 16 17 18" }, "03": { "var_type": "FIELD_INTEGER", "drain_rate": "7 12 17 22", "LinkedSpecialBonus": "special_bonus_unique_razor" }, "04": { "var_type": "FIELD_INTEGER", "drain_range_buffer": "250" }, "05": { "var_type": "FIELD_INTEGER", "radius": "200 200 200 200" }, "06": { "var_type": "FIELD_INTEGER", "speed": "900 900 900 900" }, "07": { "var_type": "FIELD_INTEGER", "vision_radius": "800 800 800 800" }, "08": { "var_type": "FIELD_FLOAT", "vision_duration": "3.34 3.34 3.34 3.34" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_razor_static_link extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "razor_static_link";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_razor_static_link = Data_razor_static_link;
    Init() {
        this.SetDefaultSpecialValue("link_break_buffer", 400);
        this.SetDefaultSpecialValue("damage_tick", 0.75);
        this.SetDefaultSpecialValue("shock_damage_increase_pct", [20, 23, 26, 29, 32, 35]);
        this.SetDefaultSpecialValue("shard_aoe_radius", 300);
        this.SetDefaultSpecialValue("duration", 7);

    }


    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        if (hCaster.HasShard()) {
            let iAOERadius = this.GetSpecialValueFor("shard_aoe_radius")
            let hTarget = this.GetCursorTarget()
            if (hTarget == null) {
                return
            }
            let targets = FindUnitsInRadius(hCaster.GetTeam(), hTarget.GetOrigin(), null, iAOERadius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, 0, 0, false)
            for (let t of (targets)) {
                this.CreateLink(hCaster, t)
                this.ApplyDebuff(hCaster, t)
            }
        } else {
            let hTarget = this.GetCursorTarget()
            if (hTarget == null) {
                return
            }
            this.CreateLink(hCaster, hTarget)
            this.ApplyDebuff(hCaster, hTarget)
        }
    }
    GetAOERadius() {
        let hCaster = this.GetCasterPlus()
        if (hCaster.HasShard()) {
            return this.GetSpecialValueFor("shard_aoe_radius")
        } else {
            return 0
        }
    }
    CreateLink(hCaster: IBaseNpc_Plus, hTarget: IBaseNpc_Plus) {
        let iMaxDistance = this.GetCastRange(hTarget.GetOrigin(), hTarget) + hCaster.GetCastRangeBonus() + this.GetSpecialValueFor("link_break_buffer")
        let fDuration = this.GetSpecialValueFor("duration")
        let sTalentName = "special_bonus_unique_razor_custom_6"
        let fDamageTick = this.GetSpecialValueFor("damage_tick") - hCaster.GetTalentValue(sTalentName)
        modifier_razor_2_link.apply(hTarget, hCaster, this, {
            duration: fDuration,
            iMaxDistance: iMaxDistance,
            fDamageTick: fDamageTick
        })
    }
    ApplyDebuff(hCaster: IBaseNpc_Plus, hTarget: IBaseNpc_Plus) {
        let fDuration = this.GetSpecialValueFor("duration")
        let sTalentName = "special_bonus_unique_razor_custom_4"
        let iDamageIncrease = this.GetSpecialValueFor("shock_damage_increase_pct") + hCaster.GetTalentValue(sTalentName)
        modifier_razor_2_debuff.apply(hTarget, hCaster, this, {
            duration: fDuration,
            iDamageIncrease: iDamageIncrease
        })
    }

    GetIntrinsicModifierName() {
        return "modifier_razor_2"
    }
}


//  Modifiers
@registerModifier()
export class modifier_razor_2 extends BaseModifier_Plus {

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
            let hTarget = AoiHelper.GetAOEMostTargetsSpellTarget(hCaster.GetAbsOrigin(), range, hCaster.GetTeam(), this.GetSpecialValueFor("shard_aoe_radius"), null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0)
            if (hTarget) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                    AbilityIndex: ability.entindex(),
                    TargetIndex: hTarget.entindex()
                })
            }
        }
    }
}

//  Modifiers
@registerModifier()
export class modifier_razor_2_link extends BaseModifier_Plus {
    iMaxDistance: number;

    GetTexture() {
        return this.GetAbilityPlus().GetAbilityTextureName()
    }
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            let iMaxDistance = params.iMaxDistance
            let fDamageTick = params.fDamageTick
            this.iMaxDistance = iMaxDistance
            this.StartIntervalThink(fDamageTick)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_razor/razor_static_link.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_POINT_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetCasterPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_static", Vector(0, 0, 0), false)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", Vector(0, 0, 0), false)
            this.AddParticle(iParticleID, false, false, -1, false, false)
            EmitSoundOn("Ability.static.start", this.GetParentPlus())
            EmitSoundOn("Ability.static.loop", this.GetParentPlus())
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            this.StartIntervalThink(-1)
        } else {
            StopSoundOn("Ability.static.loop", this.GetParentPlus())
            EmitSoundOn("Ability.static.}", this.GetParentPlus())
        }
    }
    OnIntervalThink() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (!GameFunc.IsValid(hCaster) || !GameFunc.IsValid(hParent)) {
            this.Destroy()
        }
        let fDistance = CalcDistanceBetweenEntityOBB(hCaster, hParent)
        if (fDistance > this.iMaxDistance) {
            this.Destroy()
            return
        }
        BattleHelper.Attack(hCaster, hParent, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE)
    }
}
//  Modifiers
@registerModifier()
export class modifier_razor_2_debuff extends BaseModifier_Plus {

    GetTexture() {
        return this.GetAbilityPlus().GetAbilityTextureName()
    }
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
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_SHOCK_DAMAGE_PERCENTAGE)
    EOM_GetModifierIncomingShockDamagePercentage() {
        return this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    Tooltip() {
        return this.GetStackCount()
    }
    Init(params: IModifierTable) {
        if (IsServer()) {
            let iDamageIncrease = params.iDamageIncrease
            if (!iDamageIncrease) {
                iDamageIncrease = 0
            }
            this.SetStackCount(iDamageIncrease)
        }
    }

    GetEffectName() {
        return "particles/units/heroes/hero_razor/razor_static_link_debuff.vpcf"
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_POINT_FOLLOW
    }
}
