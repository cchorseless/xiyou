import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_riki_backstab = { "ID": "5144", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilityDraftUltShardAbility": "riki_poison_dart", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "damage_multiplier": "1.4 1.8 2.2", "LinkedSpecialBonus": "special_bonus_unique_riki_1", "CalculateSpellDamageTooltip": "0" }, "02": { "var_type": "FIELD_INTEGER", "backstab_angle": "105 105 105" }, "03": { "var_type": "FIELD_FLOAT", "fade_delay": "4 3 2" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability6_riki_backstab extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "riki_backstab";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_riki_backstab = Data_riki_backstab;
    Init() {
        this.SetDefaultSpecialValue("radius", 450);
        this.SetDefaultSpecialValue("attack_count", 8);
        this.SetDefaultSpecialValue("attack_damage_pct", [100, 135, 170, 205, 250, 300]);
        this.SetDefaultSpecialValue("duration", 2);
        this.SetDefaultSpecialValue("scepter_attacks", 4);
        this.SetDefaultSpecialValue("attack_targets", 1);
        this.SetDefaultSpecialValue("scepter_duration", 1);

    }



    GetCooldown(iLevel: number) {
        return super.GetCooldown(iLevel) - this.GetCasterPlus().GetTalentValue("special_bonus_unique_riki_custom_7")
    }
    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let duration = this.GetSpecialValueFor("duration")
        let scepter_duration = this.GetSpecialValueFor("scepter_duration")
        if (hCaster.HasScepter()) {
            duration = duration + scepter_duration
        }
        let iParticle = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_riki/riki_tricks_cast.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            owner: null
        });

        ParticleManager.SetParticleControlEnt(iParticle, 0, hCaster, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
        ParticleManager.ReleaseParticleIndex(iParticle)
        if (!hCaster.HasTalent("special_bonus_unique_riki_custom_6")) {
            modifier_riki_6_buff.apply(hCaster, hCaster, this, { duration: duration })
        }
        modifier_riki_6_thinker.applyThinker(vPosition, hCaster, this, { duration: duration }, hCaster.GetTeamNumber(), false)
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Riki.TricksOfTheTrade", hCaster))
    }

    GetIntrinsicModifierName() {
        return "modifier_riki_6"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_riki_6 extends BaseModifier_Plus {
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

            let position = AoiHelper.GetAOEMostTargetsPosition(caster.GetAbsOrigin(), range, caster.GetTeamNumber(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_CLOSEST)

            //  施法命令
            if (position && position != vec3_invalid && caster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: position
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_riki_6_thinker extends BaseModifier_Plus {
    radius: number;
    attack_count: number;
    scepter_attacks: number;
    attack_targets: number;
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
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.radius = this.GetSpecialValueFor("radius")
        this.attack_count = this.GetSpecialValueFor("attack_count")
        this.scepter_attacks = this.GetSpecialValueFor("scepter_attacks")
        this.attack_targets = this.GetSpecialValueFor("attack_targets")
        if (IsServer()) {
            let iParticle = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_riki/riki_tricks.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticle, 0, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticle, 1, Vector(this.radius, 1, 1))
            ParticleManager.SetParticleControl(iParticle, 2, Vector(this.GetDuration(), 0, 0))
            this.AddParticle(iParticle, false, false, -1, false, false)
            if (hCaster.HasScepter()) {
                this.attack_count = this.attack_count + this.scepter_attacks
            }
            this.StartIntervalThink(this.GetDuration() / this.attack_count)
        }
    }

    OnIntervalThink() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            if (!GameFunc.IsValid(hCaster) || !hCaster.IsAlive()) {
                this.Destroy()
                return
            }
            let tTargets = FindUnitsInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), null, this.radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false)
            let hTarget = tTargets[0] as BaseNpc_Plus
            if (GameFunc.IsValid(hTarget)) {
                let vPosition = hCaster.GetAbsOrigin()
                let vTarget = (hTarget.GetAbsOrigin() + (-hTarget.GetForwardVector() * 100)) as Vector
                hCaster.SetAbsOrigin(vTarget)
                modifier_riki_6_damage_pct.apply(hCaster, hCaster, this.GetAbilityPlus(), null)
                BattleHelper.Attack(hCaster, hTarget, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)
                modifier_riki_6_damage_pct.remove(hCaster);
                hCaster.SetAbsOrigin(vPosition)
            }
            if (hCaster.HasScepter()) {
                for (let i = 1; i <= this.attack_targets; i++) {
                    hTarget = tTargets[i + 1] as BaseNpc_Plus
                    if (GameFunc.IsValid(hTarget)) {
                        let vPosition = hCaster.GetAbsOrigin()
                        let vTarget = (hTarget.GetAbsOrigin() + (-hTarget.GetForwardVector() * 100)) as Vector
                        hCaster.SetAbsOrigin(vTarget)
                        modifier_riki_6_damage_pct.apply(hCaster, hCaster, this.GetAbilityPlus(), null)
                        BattleHelper.Attack(hCaster, hTarget, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)
                        modifier_riki_6_damage_pct.remove(hCaster);
                        hCaster.SetAbsOrigin(vPosition)
                    }
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_riki_6_buff extends BaseModifier_Plus {
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
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            hParent.AddNoDraw()
        }
    }

    OnDestroy() {
        super.OnDestroy();
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            hParent.RemoveNoDraw()
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_ATTACK_IMMUNE]: true,
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_riki_6_damage_pct extends BaseModifier_Plus {
    attack_damage_pct: number;
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
    Init(params: ModifierTable) {
        this.attack_damage_pct = this.GetSpecialValueFor("attack_damage_pct") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_riki_custom_3")
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    GetDamageOutgoing_Percentage() {
        return this.attack_damage_pct
    }
}
