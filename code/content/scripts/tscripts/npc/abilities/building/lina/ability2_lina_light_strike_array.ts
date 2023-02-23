import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";
import { ability1_lina_dragon_slave } from "./ability1_lina_dragon_slave";
import { ability3_lina_fiery_soul, modifier_lina_3_fiery_soul } from "./ability3_lina_fiery_soul";

/** dota原技能数据 */
export const Data_lina_light_strike_array = { "ID": "5041", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES_STRONG", "FightRecapLevel": "1", "AbilitySound": "Ability.LightStrikeArray", "AbilityCastRange": "625", "AbilityCastPoint": "0.45 0.45 0.45 0.45", "AbilityCooldown": "10 9 8 7", "AbilityManaCost": "100 105 110 115", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "light_strike_array_aoe": "250" }, "02": { "var_type": "FIELD_FLOAT", "light_strike_array_delay_time": "0.5" }, "03": { "var_type": "FIELD_FLOAT", "light_strike_array_stun_duration": "1.6 1.9 2.2 2.5" }, "04": { "var_type": "FIELD_INTEGER", "light_strike_array_damage": "80 130 180 230", "LinkedSpecialBonus": "special_bonus_unique_lina_3" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_lina_light_strike_array extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "lina_light_strike_array";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_lina_light_strike_array = Data_lina_light_strike_array;
    Init() {
        this.SetDefaultSpecialValue("light_strike_array_aoe", 450);
        this.SetDefaultSpecialValue("light_strike_array_delay_time", 0.5);
        this.SetDefaultSpecialValue("light_strike_array_stun_duration", [1.0, 1.25, 1.5, 2.0, 2.5, 3.0]);
        this.SetDefaultSpecialValue("light_strike_array_damage", [1000, 2000, 3000, 4000, 5000, 6000]);
        this.SetDefaultSpecialValue("chance_scepter", 40);
        this.SetDefaultSpecialValue("int_damage_factor", [2, 2.5, 3, 4, 5, 7]);

    }


    GetAOERadius() {
        return this.GetSpecialValueFor("light_strike_array_aoe")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        this.DoAoeDamage(vPosition, true)
    }
    DoAoeDamage(vPosition: Vector, bScepterMultiCast: Boolean) {
        let hCaster = this.GetCasterPlus()

        let light_strike_array_delay_time = this.GetSpecialValueFor("light_strike_array_delay_time")

        modifier_lina_2_thinker.applyThinker(vPosition, hCaster, this, { duration: light_strike_array_delay_time }, hCaster.GetTeamNumber(), false)

        // a帐效果
        if (bScepterMultiCast) {
            this.ScepterMutiCast(vPosition)
        }
    }
    ScepterMutiCast(vPosition: Vector) {
        let hCaster = this.GetCasterPlus()
        let chance_scepter = this.GetSpecialValueFor("chance_scepter")
        let hAbility_4 = ability3_lina_fiery_soul.findIn(hCaster)
        let hModifier = modifier_lina_3_fiery_soul.findIn(hCaster) as IBaseModifier_Plus;
        if (hCaster.HasScepter() && GameFunc.IsValid(hAbility_4) && GameFunc.IsValid(hModifier)) {
            chance_scepter = chance_scepter + hModifier.GetStackCount() * hAbility_4.GetSpecialValueFor("chance_factor")
        }
        if (!hCaster.HasScepter() || !GameFunc.mathUtil.PRD(chance_scepter, hCaster, "lina_2_scepter")) {
            return
        }
        GTimerHelper.AddTimer(0.5, GHandler.create(this, () => {
            this.DoAoeDamage(vPosition, true)
        }))
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_lina_2"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_lina_2 extends BaseModifier_Plus {
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

            let hCaster = ability.GetCasterPlus()

            if (!ability.GetAutoCastState()) {
                return
            }

            if (hCaster.IsTempestDouble() || hCaster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }

            let range = ability.GetCastRange(hCaster.GetAbsOrigin(), hCaster) + hCaster.GetCastRangeBonus()
            let radius = ability.GetAOERadius()

            let position = AoiHelper.GetAOEMostTargetsPosition(hCaster.GetAbsOrigin(),
                range,
                hCaster.GetTeamNumber(),
                radius,
                null,
                DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
                ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS,
                FindOrder.FIND_CLOSEST)

            //  施法命令
            if (position && position != vec3_invalid && hCaster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: position,
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_lina_2_talent_3_debuff// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_lina_2_talent_3_debuff extends BaseModifier_Plus {
    damage_income: number;
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
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    Init(params: IModifierTable) {
        this.damage_income = this.GetCasterPlus().GetTalentValue("special_bonus_unique_lina_custom_3", "damage_income")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_MAGICAL_DAMAGE_PERCENTAGE)
    G_INCOMING_MAGICAL_DAMAGE_PERCENTAGE() {
        return this.damage_income
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.damage_income
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_lina_2_thinker extends modifier_particle_thinker {
    light_strike_array_aoe: number;
    light_strike_array_delay_time: number;
    light_strike_array_stun_duration: number;
    int_damage_factor: number;
    light_strike_array_damage: number;
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        let vPosition = hParent.GetAbsOrigin()
        this.light_strike_array_aoe = this.GetSpecialValueFor("light_strike_array_aoe")
        this.light_strike_array_delay_time = this.GetSpecialValueFor("light_strike_array_delay_time")
        this.light_strike_array_stun_duration = this.GetSpecialValueFor("light_strike_array_stun_duration")
        this.light_strike_array_damage = this.GetSpecialValueFor("light_strike_array_damage")
        this.int_damage_factor = this.GetSpecialValueFor("int_damage_factor")
        if (IsServer()) {
            EmitSoundOnLocationForAllies(vPosition, ResHelper.GetSoundReplacement("Ability.PreLightStrikeArray", hCaster), hCaster)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_lina/lina_spell_light_strike_array_ray_team.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.light_strike_array_aoe, this.light_strike_array_aoe, this.light_strike_array_aoe))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
    OnRemoved() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        let vPosition = hParent.GetAbsOrigin()
        if (IsServer()) {
            if (!GameFunc.IsValid(hAbility) || !GameFunc.IsValid(hCaster)) {
                return
            }
            GridNav.DestroyTreesAroundPoint(vPosition, this.light_strike_array_aoe, false)

            let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), vPosition, this.light_strike_array_aoe, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST)

            let bValidTalent3 = hCaster.HasTalent("special_bonus_unique_lina_custom_3")
            let talent3_duration = 0
            if (bValidTalent3) {
                talent3_duration = hCaster.GetTalentValue("special_bonus_unique_lina_custom_3", "duration")
            }

            for (let target of (targets)) {
                let damage_table = {
                    ability: hAbility,
                    victim: target,
                    attacker: hCaster,
                    damage: this.light_strike_array_damage + hCaster.GetIntellect() * this.int_damage_factor,
                    damage_type: hAbility.GetAbilityDamageType(),
                }
                BattleHelper.GoApplyDamage(damage_table)

                modifier_stunned.apply(target, hCaster, hAbility, { duration: this.light_strike_array_stun_duration * target.GetStatusResistanceFactor(hCaster) })
                if (bValidTalent3) {
                    modifier_lina_2_talent_3_debuff.apply(target, hCaster, hAbility, { duration: talent3_duration })
                }
            }

            EmitSoundOnLocationWithCaster(vPosition, ResHelper.GetSoundReplacement("Ability.LightStrikeArray", hCaster), hCaster)
            //  光击阵中心释十字放龙破斩
            let sTalentName = "special_bonus_unique_lina_custom_2"
            let lina_1 = ability1_lina_dragon_slave.findIn(hCaster) as ability1_lina_dragon_slave;
            if (hCaster.HasTalent(sTalentName) && GameFunc.IsValid(lina_1) && lina_1.GetLevel() > 0 && type(lina_1.DragonSlave) == "function") {
                let vDirection = Vector(1, 0, 0)
                for (let i = 1; i <= 4; i++) {
                    lina_1.DragonSlave(vPosition, (GameFunc.VectorFunctions.Rotation2D(vDirection, math.rad(i * 90)) + vPosition) as Vector, false)
                }
            }
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_lina/lina_spell_light_strike_array.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: hCaster
            });

            ParticleManager.SetParticleControl(iParticleID, 0, vPosition)
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.light_strike_array_aoe, 1, 1))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
