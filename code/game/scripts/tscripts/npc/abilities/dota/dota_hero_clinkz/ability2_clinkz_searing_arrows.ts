import { GameEnum } from "../../../../GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { ability6_clinkz_death_pact } from "./ability6_clinkz_death_pact";

/** dota原技能数据 */
export const Data_clinkz_searing_arrows = { "ID": "5260", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AUTOCAST | DOTA_ABILITY_BEHAVIOR_ATTACK", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC | DOTA_UNIT_TARGET_BUILDING", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "AbilitySound": "Hero_Clinkz.SearingArrows.Impact", "AbilityCastRange": "625", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilityCooldown": "0.0 0.0 0.0 0.0", "AbilityManaCost": "12", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "damage_bonus": "24 36 48 60", "LinkedSpecialBonus": "special_bonus_unique_clinkz_1" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_clinkz_searing_arrows extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "clinkz_searing_arrows";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_clinkz_searing_arrows = Data_clinkz_searing_arrows;
    Init() {
        this.SetDefaultSpecialValue("duration", [3, 4, 5, 6, 7, 8]);
        this.SetDefaultSpecialValue("attack_speed_bonus_pct", 150);
        this.SetDefaultSpecialValue("scepter_skeleton_count", 2);
        this.SetDefaultSpecialValue("bonus_damage_percent", [20, 30, 40, 50, 60, 70]);
    }

    OnSpellStart() {
        let caster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration")
        caster.EmitSound(ResHelper.GetSoundReplacement("Hero_Clinkz.Strafe", caster))
        modifier_clinkz_2_bonus_attackspeed.apply(caster, caster, this, { duration: duration })
        // let clinkz_6 = ability6_clinkz_death_pact.findIn(caster);
        let clinkz_6 = caster.FindAbilityByName("ability6_clinkz_death_pact") as ability6_clinkz_death_pact;
        if (GameFunc.IsValid(clinkz_6)) {
            if (clinkz_6.tArmys != null) {
                for (let hArmy of (clinkz_6.tArmys)) {

                    if (GameFunc.IsValid(hArmy)) {
                        modifier_clinkz_2_bonus_attackspeed.apply(hArmy, caster, this, { duration: duration })
                    }
                }
            }
            if (clinkz_6.GetLevel() > 0 && caster.HasScepter()) {
                let scepter_skeleton_count = this.GetSpecialValueFor("scepter_skeleton_count")
                clinkz_6.ScepterSummon(scepter_skeleton_count)
            }
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_clinkz_2"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_clinkz_2 extends BaseModifier_Plus {
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
    OnRefresh(params: ModifierTable) {
        super.OnRefresh(params);
        if (IsServer()) {
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
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
export class modifier_clinkz_2_bonus_attackspeed extends BaseModifier_Plus {
    attack_speed_bonus_pct: number;
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_clinkz/clinkz_strafe.vpcf",
                resNpc: this.GetParentPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControlEnt(particleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(particleID, 3, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }
    Init(params: ModifierTable) {
        this.attack_speed_bonus_pct = this.GetSpecialValueFor("attack_speed_bonus_pct")
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant(params: ModifierTable) {
        return this.attack_speed_bonus_pct
    }
}
