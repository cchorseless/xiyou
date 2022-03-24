
import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_bounty_hunter_jinada = { "ID": "5286", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "AbilitySound": "Hero_BountyHunter.Jinada", "AbilityCooldown": "12 9 6 3", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "bonus_damage": "70 100 130 160", "LinkedSpecialBonus": "special_bonus_unique_bounty_hunter_4" }, "02": { "var_type": "FIELD_INTEGER", "gold_steal": "12 20 28 36", "LinkedSpecialBonus": "special_bonus_unique_bounty_hunter" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_bounty_hunter_jinada extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "bounty_hunter_jinada";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_bounty_hunter_jinada = Data_bounty_hunter_jinada;
    Init() {
        this.SetDefaultSpecialValue("duration", 5);
        this.SetDefaultSpecialValue("bonus_base_physics_damage", [100, 400, 700, 1000, 2000, 3000]);
        this.SetDefaultSpecialValue("bonus_attack_physics_damage_percent", [100, 120, 140, 160, 180, 200]);
        this.SetDefaultSpecialValue("fade_time", [1.0, 0.75, 0.5, 0.25]);

    }




    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration")
        modifier_bounty_hunter_2_buff.apply(hCaster, hCaster, this, { duration: duration })
        EmitSoundOnLocationWithCaster(hCaster.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_BountyHunter.WindWalk", hCaster), hCaster)
    }

    GetIntrinsicModifierName() {
        return "modifier_bounty_hunter_2"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
//  Modifiers
@registerModifier()
export class modifier_bounty_hunter_2 extends BaseModifier_Plus {
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

            // 隐身buff会导致自动攻击失效，加一个攻击指令
            if (modifier_bounty_hunter_2_buff.exist(caster) && !caster.IsAttacking() && !caster.IsChanneling()) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE,
                    Position: caster.GetAbsOrigin()
                })
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
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_bounty_hunter_2_buff extends BaseModifier_Plus {
    bonus_base_physics_damage: number;
    bonus_attack_physics_damage_percent: number;
    fade_time: number;
    IsHidden() {
        return false
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
        this.bonus_base_physics_damage = this.GetSpecialValueFor("bonus_base_physics_damage")
        this.bonus_attack_physics_damage_percent = this.GetSpecialValueFor("bonus_attack_physics_damage_percent")
        this.fade_time = this.GetSpecialValueFor("fade_time")
        if (params.IsOnCreated && IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_bounty_hunter/bounty_hunter_windwalk.vpcf",
                resNpc: this.GetParentPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }



    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: ModifierTable) {
        return this.bonus_base_physics_damage
    }
    GetDamageOutgoing_Percentage(params: ModifierTable) {
        return this.bonus_attack_physics_damage_percent
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OUTGOING_PHYSICAL_DAMAGE_PERCENTAGE)
    G_OUTGOING_PHYSICAL_DAMAGE_PERCENTAGE() {
        return this.GetSpecialValueFor("bonus_attack_physics_damage_percent")
    }
}
