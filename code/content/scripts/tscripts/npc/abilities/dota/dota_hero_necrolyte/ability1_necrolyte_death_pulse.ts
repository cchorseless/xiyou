import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_feared } from "../../../modifier/effect/modifier_feared";

/** dota原技能数据 */
export const Data_necrolyte_death_pulse = { "ID": "5158", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_Necrolyte.DeathPulse", "AbilityCastRange": "0", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilityCooldown": "8 7 6 5", "AbilityDamage": "100 150 200 250", "AbilityManaCost": "100 130 160 190", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "area_of_effect": "500" }, "02": { "var_type": "FIELD_INTEGER", "heal": "60 80 100 120", "LinkedSpecialBonus": "special_bonus_unique_necrophos_4" }, "03": { "var_type": "FIELD_INTEGER", "projectile_speed": "400" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_necrolyte_death_pulse extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "necrolyte_death_pulse";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_necrolyte_death_pulse = Data_necrolyte_death_pulse;
    Init() {
        this.SetDefaultSpecialValue("base_damage", [250, 500, 750, 1000, 1250, 1500]);
        this.SetDefaultSpecialValue("intellect_damage_factor", [2, 2.5, 3, 3.5, 4, 5]);
        this.SetDefaultSpecialValue("aoe_radius", 800);
        this.SetDefaultSpecialValue("speed", 450);

    }

    Init_old() {
        this.SetDefaultSpecialValue("base_damage", [250, 300, 350, 400, 450, 500]);
        this.SetDefaultSpecialValue("intellect_damage_factor", [1.0, 1.4, 1.8, 2.2, 2.6, 3.2]);
        this.SetDefaultSpecialValue("aoe_radius", 800);
        this.SetDefaultSpecialValue("speed", 450);

    }



    OnSpellStart() {
        let hCaster = this.GetCasterPlus()

        let aoe_radius = this.GetSpecialValueFor("aoe_radius")

        // 声音
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Necrolyte.DeathPulse", hCaster))

        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), aoe_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)
        for (let hTarget of (tTargets)) {
            this._OnSpellStart(hTarget, hCaster.GetAbsOrigin())
        }
    }
    _OnSpellStart(hTarget: IBaseNpc_Plus, vSourceLoc: Vector) {
        if (GameFunc.IsValid(hTarget)) {
            let hCaster = this.GetCasterPlus()
            let speed = this.GetSpecialValueFor("speed")
            let info: CreateTrackingProjectileOptions = {
                vSourceLoc: vSourceLoc,
                EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_necrolyte/necrolyte_pulse_enemy.vpcf", hCaster),
                Ability: this,
                iMoveSpeed: speed,
                Target: hTarget,
            }
            ProjectileManager.CreateTrackingProjectile(info)
        }
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        let hCaster = this.GetCasterPlus()
        if (GameFunc.IsValid(hTarget)) {
            let base_damage = this.GetSpecialValueFor("base_damage")
            let intellect_damage_factor = this.GetSpecialValueFor("intellect_damage_factor")

            EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Necrolyte.ProjectileImpact", hCaster), hCaster)

            BattleHelper.GoApplyDamage({
                victim: hTarget,
                attacker: hCaster,
                damage: base_damage + intellect_damage_factor * hCaster.GetIntellect(),
                damage_type: this.GetAbilityDamageType(),
                ability: this,
            })
            let sTalentName = "special_bonus_unique_necrolyte_custom_4"
            if (hCaster.HasTalent(sTalentName)) {
                modifier_special_bonus_unique_necrolyte_custom_4.apply(hTarget, hCaster, this, { duration: hCaster.GetTalentValue(sTalentName) })
            }
            sTalentName = "special_bonus_unique_necrolyte_custom_5"
            if (hCaster.HasTalent(sTalentName) && !hTarget.IsAncient()) {
                modifier_feared.apply(hTarget, hCaster, this, { duration: hCaster.GetTalentValue(sTalentName) })
            }

        }
    }
    OnTalentHit(hTarget: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let base_damage = this.GetSpecialValueFor("base_damage")
        let intellect_damage_factor = this.GetSpecialValueFor("intellect_damage_factor")
        let tDamageTable = {
            victim: hTarget,
            attacker: hCaster,
            damage: base_damage + intellect_damage_factor * hCaster.GetIntellect(),
            damage_type: this.GetAbilityDamageType(),
            ability: this,
        }
        BattleHelper.GoApplyDamage(tDamageTable)
    }

    GetIntrinsicModifierName() {
        return "modifier_necrolyte_1"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_necrolyte_1 extends BaseModifier_Plus {
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

            let range = ability.GetSpecialValueFor("aoe_radius")

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
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_special_bonus_unique_necrolyte_custom_4 extends BaseModifier_Plus {
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
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    G_INCOMING_DAMAGE_PERCENTAGE() {
        return this.GetCasterPlus().GetTalentValue("special_bonus_unique_necrolyte_custom_4", "bonus_spell_damage_pct")
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        if (GameFunc.IsValid(this.GetCasterPlus())) {
            return this.GetCasterPlus().GetTalentValue("special_bonus_unique_necrolyte_custom_4", "bonus_spell_damage_pct")
        }
        return 0
    }
}
