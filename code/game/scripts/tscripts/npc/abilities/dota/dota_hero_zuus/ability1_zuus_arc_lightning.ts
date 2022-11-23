
import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { EntityHelper } from "../../../../helper/EntityHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { LogHelper } from "../../../../helper/LogHelper";

/** dota原技能数据 */
export const Data_zuus_arc_lightning = { "ID": "5110", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "AbilitySound": "Hero_Zuus.ArcLightning.Cast", "AbilityCastRange": "850", "AbilityCastPoint": "0.2", "AbilityCooldown": "1.6", "AbilityManaCost": "80", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "arc_damage": "75 100 125 150", "LinkedSpecialBonus": "special_bonus_unique_zeus_2" }, "02": { "var_type": "FIELD_INTEGER", "radius": "500 500 500 500" }, "03": { "var_type": "FIELD_INTEGER", "jump_count": "5 7 9 15" }, "04": { "var_type": "FIELD_FLOAT", "jump_delay": "0.25 0.25 0.25 0.25" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_zuus_arc_lightning extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "zuus_arc_lightning";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_zuus_arc_lightning = Data_zuus_arc_lightning;
    Init() {
        this.SetDefaultSpecialValue("arc_damage", [200, 450, 700, 1100, 1500, 2000]);
        this.SetDefaultSpecialValue("radius", 1300);
        this.SetDefaultSpecialValue("jump_count", [5, 7, 9, 11, 13, 15]);
        this.SetDefaultSpecialValue("jump_delay", 0.25);
        this.SetDefaultSpecialValue("shock_bonus", [100, 200, 350, 500, 700, 900]);

    }

    Jump(tUnits: BaseNpc_Plus[]) {
        let jump_count = this.GetSpecialValueFor("jump_count", 5);
        if (tUnits.length >= jump_count) { return }
        this.addTimer(this.GetSpecialValueFor("jump_delay", 0.25), () => {
            let hTarget = tUnits[tUnits.length - 1];
            if (!GameFunc.IsValid(hTarget)) {
                return
            }
            let hCaster = this.GetCasterPlus()
            let radius = this.GetSpecialValueFor("radius")
            let hNewTarget = AoiHelper.GetBounceTarget(tUnits, hCaster.GetTeamNumber(), radius, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS)
            if (GameFunc.IsValid(hNewTarget)) {
                this.ArcLightning(hTarget, hNewTarget);
                tUnits.push(hNewTarget);
                this.Jump(tUnits);
            }
        })
    }
    ArcLightning(fromNpc: BaseNpc_Plus, hTarget: BaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let arc_damage = this.GetSpecialValueFor("arc_damage", 200)
        let restore_energy = this.GetSpecialValueFor("restore_energy");
        let resInfo: ResHelper.ParticleInfo = {
            resPath: "particles/units/heroes/hero_zuus/zuus_arc_lightning.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN
        }
        let iParticleID = ResHelper.CreateParticle(resInfo)
        ParticleManager.SetParticleControlEnt(iParticleID, 0, fromNpc, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", hCaster.GetAbsOrigin(), true)
        ParticleManager.SetParticleControlEnt(iParticleID, 1, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
        ParticleManager.ReleaseParticleIndex(iParticleID)
        // if (AbilityUpgrades.HasAbilityMechanicsUpgrade(hCaster, this.GetAbilityName(), "fs")) {
        //     let iStackCount = 0
        //     let hModifier = modifier_zuus_1_debuff.findIn(hTarget);
        //     if (GameFunc.IsValid(hModifier)) {
        //         iStackCount = hModifier.GetStackCount()
        //     }
        //     arc_damage = arc_damage * (1 + iStackCount * this.GetSpecialValueFor("damage_percent") * 0.01)
        //     modifier_zuus_1_debuff.apply(hTarget, hCaster, this, { duration: this.GetSpecialValueFor("duration") })
        // }
        BattleHelper.GoApplyDamage({
            ability: this,
            attacker: hCaster,
            victim: hTarget,
            damage: arc_damage,
            damage_type: this.GetAbilityDamageType()
        })
        if (restore_energy > 0) {
            EntityHelper.ModifyEnergy(hCaster, restore_energy);
        }
        EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Zuus.ArcLightning.Target", hCaster), hCaster)
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Zuus.ArcLightning.Cast", hCaster))

    }
    OnSpellStart() {
        let hTarget = this.GetCursorTarget() as BaseNpc_Plus
        if (GameFunc.IsValid(hTarget) && !hTarget.TriggerSpellAbsorb(this)) {
            this.ArcLightning(this.GetCasterPlus(), hTarget);
            this.Jump([hTarget]);
        }
    }



}

@registerModifier()
export class modifier_zuus_1_debuff extends BaseModifier_Plus {
    damage_percent: number;
    Init(params: ModifierTable) {
        this.damage_percent = this.GetSpecialValueFor("damage_percent", 100);
        if (IsServer()) {
            this.addTimer(params.duration, () => {
                this.DecrementStackCount()
            })
            this.IncrementStackCount()
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    OnShowTooltip() {
        return this.damage_percent * this.GetStackCount()
    }
}