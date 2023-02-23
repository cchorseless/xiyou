import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_silence } from "../../../modifier/modifier_silence";

/** dota原技能数据 */
export const Data_puck_waning_rift = { "ID": "5071", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_Puck.Waning_Rift", "HasShardUpgrade": "1", "AbilityCastPoint": "0.1", "AbilityCooldown": "19 17 15 13", "AbilityManaCost": "100 110 120 130", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "400 400 400 400", "LinkedSpecialBonus": "special_bonus_unique_puck_6" }, "02": { "var_type": "FIELD_FLOAT", "silence_duration": "2.0 2.5 3.0 3.5", "LinkedSpecialBonus": "special_bonus_unique_puck_7" }, "03": { "var_type": "FIELD_INTEGER", "damage": "70 130 190 250", "LinkedSpecialBonus": "special_bonus_unique_puck_4" }, "04": { "var_type": "FIELD_INTEGER", "max_distance": "300", "LinkedSpecialBonus": "special_bonus_unique_puck_6" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_puck_waning_rift extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "puck_waning_rift";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_puck_waning_rift = Data_puck_waning_rift;
    Init() {
        this.SetDefaultSpecialValue("radius", 900);
        this.SetDefaultSpecialValue("silence_duration", [2, 2, 3, 3, 4, 4]);
        this.SetDefaultSpecialValue("damage", [400, 700, 1000, 1500, 2000, 2700]);
        this.SetDefaultSpecialValue("damage_int_factor", [6, 7, 7, 8, 9, 11]);

    }



    GetCooldown(iLevel: number) {
        return super.GetCooldown(iLevel) - this.GetCasterPlus().GetTalentValue("special_bonus_unique_puck_custom_2")
    }
    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let radius = this.GetSpecialValueFor("radius")
        let silence_duration = this.GetSpecialValueFor("silence_duration")
        let damage = this.GetSpecialValueFor("damage")
        let damage_int_factor = this.GetSpecialValueFor("damage_int_factor")

        let vPosition = hCaster.GetAbsOrigin()

        let iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_puck/puck_waning_rift.vpcf",
            resNpc: null,
            iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
            owner: hCaster
        });

        ParticleManager.SetParticleControl(iParticleID, 1, Vector(radius, radius, radius))
        ParticleManager.ReleaseParticleIndex(iParticleID)

        let iInt = type(hCaster.GetIntellect) == "function" && hCaster.GetIntellect() || 0
        let fDamage = damage + iInt * damage_int_factor

        let tTargets = FindUnitsInRadius(hCaster.GetTeamNumber(), vPosition, null, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
        for (let hTarget of (tTargets as IBaseNpc_Plus[])) {
            if (hCaster.HasTalent("special_bonus_unique_puck_custom_4") && !hTarget.IsAttackImmune()) {
                BattleHelper.Attack(hCaster, hTarget, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK)
            }

            modifier_silence.apply(hTarget, hCaster, this, { duration: silence_duration * hTarget.GetStatusResistanceFactor(hCaster) })
            BattleHelper.GoApplyDamage({
                ability: this,
                attacker: hCaster,
                victim: hTarget,
                damage: fDamage,
                damage_type: this.GetAbilityDamageType()
            })
        }

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Puck.Waning_Rift", hCaster))
    }

    GetIntrinsicModifierName() {
        return "modifier_puck_2"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_puck_2 extends BaseModifier_Plus {
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
            let ability = this.GetAbilityPlus() as ability2_puck_waning_rift
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

            let range = this.GetSpecialValueFor("radius")
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
