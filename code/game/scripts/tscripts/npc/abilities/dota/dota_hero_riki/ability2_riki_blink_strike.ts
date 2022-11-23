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
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_riki_blink_strike = { "ID": "5143", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_CUSTOM", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_CUSTOM", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "AbilitySound": "Hero_Riki.Blink_Strike", "AbilityCastRange": "600 700 800 900", "AbilityCastPoint": "0.3", "AbilityCooldown": "0.1", "AbilityCharges": "2", "AbilityChargeRestoreTime": "25 20 15 10", "AbilityManaCost": "50", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "abilitycastrange": "", "LinkedSpecialBonus": "special_bonus_unique_riki_3" }, "02": { "var_type": "FIELD_INTEGER", "bonus_damage": "25 50 75 100" }, "03": { "var_type": "FIELD_FLOAT", "AbilityChargeRestoreTime": "", "LinkedSpecialBonus": "special_bonus_unique_riki_9", "LinkedSpecialBonusOperation": "SPECIAL_BONUS_SUBTRACT" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_riki_blink_strike extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "riki_blink_strike";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_riki_blink_strike = Data_riki_blink_strike;
    Init() {
        this.SetDefaultSpecialValue("damage", [100, 200, 350, 500, 800, 1100]);
        this.SetDefaultSpecialValue("attack_damage_pct", [100, 150, 200, 250, 300, 350]);
        this.SetDefaultSpecialValue("radius", [600, 700, 800, 900, 1000, 1100]);

    }


    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let radius = this.GetSpecialValueFor("radius")
        let damage = this.GetSpecialValueFor("damage")
        let iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_riki/riki_blink_strike.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_POINT,
            owner: hCaster
        })
        ParticleManager.SetParticleControl(iParticleID, 0, hCaster.GetAbsOrigin())
        ParticleManager.SetParticleControl(iParticleID, 1, hCaster.GetAbsOrigin())

        let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), null, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
        let vPosition = hCaster.GetAbsOrigin()
        for (let hTarget of (tTarget as BaseNpc_Plus[])) {

            // 造成伤害
            let damage_table =
            {
                ability: this,
                attacker: hCaster,
                victim: hTarget,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
            }
            BattleHelper.GoApplyDamage(damage_table)
            // 背击
            let vTarget = (hTarget.GetAbsOrigin() + (-hTarget.GetForwardVector() * 100)) as Vector
            hCaster.SetAbsOrigin(vTarget)
            modifier_riki_2_damage_pct.apply(hCaster, hCaster, this)
            BattleHelper.Attack(hCaster, hTarget, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)
            modifier_riki_2_damage_pct.remove(hCaster)
            hCaster.SetAbsOrigin(vPosition)
            ParticleManager.SetParticleControl(iParticleID, 1, hTarget.GetAbsOrigin())
        }
        ParticleManager.ReleaseParticleIndex(iParticleID)

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Riki.Blink_Strike", hCaster))
    }
    OnUpgrade() {
        if (this.GetLevel() == 1) {
            this.ToggleAutoCast()
        }
    }
    GetIntrinsicModifierName() {
        return "modifier_riki_2"
    }
    IsHiddenWhenStolen() {
        return false
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_riki_2 extends BaseModifier_Plus {
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
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }
    OnRefresh(params: ModifierTable) {
    }
    OnDestroy() {
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

            let range = ability.GetAOERadius()

            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets.length > 0) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_riki_2_damage_pct extends BaseModifier_Plus {
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
        this.attack_damage_pct = this.GetSpecialValueFor("attack_damage_pct")
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    GetDamageOutgoing_Percentage() {
        return this.attack_damage_pct
    }
}
