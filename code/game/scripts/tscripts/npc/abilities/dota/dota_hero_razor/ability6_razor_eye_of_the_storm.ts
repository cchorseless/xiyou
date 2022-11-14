import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_shock } from "../../../modifier/effect/modifier_shock";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_razor_eye_of_the_storm = { "ID": "5085", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "FightRecapLevel": "1", "HasScepterUpgrade": "1", "AbilitySound": "Hero_Razor.Storm.Cast", "AbilityCastAnimation": "ACT_DOTA_OVERRIDE_ABILITY_4", "AbilityCastGestureSlot": "DEFAULT", "AbilityCastPoint": "0", "AbilityCooldown": "80 70 60", "AbilityManaCost": "100 150 200", "AbilityModifierSupportValue": "0.1", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "500" }, "02": { "var_type": "FIELD_FLOAT", "duration": "30.0" }, "03": { "var_type": "FIELD_FLOAT", "strike_interval": "0.7 0.6 0.5", "LinkedSpecialBonus": "special_bonus_unique_razor_2" }, "04": { "var_type": "FIELD_INTEGER", "armor_reduction": "1 1 1" }, "05": { "var_type": "FIELD_INTEGER", "damage": "60 75 90" } } };

@registerAbility()
export class ability6_razor_eye_of_the_storm extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "razor_eye_of_the_storm";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_razor_eye_of_the_storm = Data_razor_eye_of_the_storm;
    Init() {
        this.SetDefaultSpecialValue("radius", 750);
        this.SetDefaultSpecialValue("attack_targets", 1);
        this.SetDefaultSpecialValue("scepter_targets_bonus", 2);
        this.SetDefaultSpecialValue("damage_tick", 0.75);
        this.SetDefaultSpecialValue("damage", [200, 300, 450, 650, 900, 1300]);
        this.SetDefaultSpecialValue("damage_bonus_agi", [2.5, 3, 3.5, 4, 4.5, 5]);
        this.SetDefaultSpecialValue("duration", 8);
        this.SetDefaultSpecialValue("shock_pct", 65);

    }



    GetCastRange(vLocation: Vector, hTarget: BaseNpc_Plus) {
        return this.GetSpecialValueFor("radius")
    }
    SpawnStorm() {
        let hCaster = this.GetCasterPlus()
        let sTalentName1 = "special_bonus_unique_razor_custom_1"
        let sTalentName3 = "special_bonus_unique_razor_custom_3"
        let sTalentName5 = "special_bonus_unique_razor_custom_5"
        let sTalentName8 = "special_bonus_unique_razor_custom_8"
        let fDamage = this.GetSpecialValueFor("damage") + hCaster.GetAgility() * (this.GetSpecialValueFor("damage_bonus_agi") + hCaster.GetTalentValue(sTalentName1))
        let fDamageTick = this.GetSpecialValueFor("damage_tick") - hCaster.GetTalentValue(sTalentName3)
        let iShockCount = this.GetSpecialValueFor("shock_pct") + hCaster.GetTalentValue(sTalentName5) + hCaster.GetTalentValue(sTalentName8)
        let iHitCount = this.GetSpecialValueFor("attack_targets") + (hCaster.HasScepter() && this.GetSpecialValueFor("scepter_targets_bonus") || 0)
        let iRadius = this.GetSpecialValueFor("radius")
        let duration = this.GetSpecialValueFor("duration")
        modifier_razor_6_buff.apply(hCaster, hCaster, this, {
            iRadius: iRadius,
            fDamageTick: fDamageTick,
            iHitCount: iHitCount,
            fDamage: fDamage,
            iShockCount: iShockCount,
            duration: duration
        })
    }

    GetIntrinsicModifierName() {
        return "modifier_razor_6"
    }
}


//  Modifiers
@registerModifier()
export class modifier_razor_6 extends BaseModifier_Plus {
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

            let hCaster = ability.GetCasterPlus()

            if (!ability.GetAutoCastState()) {
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }

            let range = ability.GetCastRange(hCaster.GetAbsOrigin(), hCaster)



            if (FindUnitsInRadius(hCaster.GetTeam(), hCaster.GetAbsOrigin(), null, range, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0, false).length >= 1) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex()
                })
            }
        }
    }
}

//  Modifiers
@registerModifier()
export class modifier_razor_6_buff extends BaseModifier_Plus {
    iRadius: any;
    fDamageTick: any;
    iHitCount: any;
    fDamage: any;
    iShockCount: any;

    GetTexture() {
        return this.GetAbilityPlus().GetAbilityTextureName()
    }
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    IsHidden() {
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
            this.iRadius = params.iRadius
            this.fDamageTick = params.fDamageTick
            this.iHitCount = params.iHitCount
            this.fDamage = params.fDamage
            this.iShockCount = params.iShockCount
            this.StartIntervalThink(this.fDamageTick)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_razor/razor_rain_storm.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
            EmitSoundOn("Hero_Razor.Storm.Cast", this.GetParentPlus())
        }
    }
    OnIntervalThink() {
        let hCaster = this.GetParentPlus()
        let units = FindUnitsInRadius(hCaster.GetTeam(), hCaster.GetOrigin(), null, this.iRadius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, 0, false)
        table.sort(units, (a, b) => {
            return a.GetHealth() < b.GetHealth()
        })
        let len = math.min(this.iHitCount, units.length)
        for (let i = 0; i < len; i++) {
            this.HitTarget(units[i])
        }
    }
    HitTarget(hTarget: BaseNpc_Plus) {
        let hCaster = this.GetParentPlus()
        let damageInfo = {
            attacker: hCaster,
            victim: hTarget,
            ability: this.GetAbilityPlus(),
            damage: this.fDamage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
        }
        BattleHelper.GoApplyDamage(damageInfo)
        modifier_shock.Shock(hTarget, hCaster, this.GetAbilityPlus(), this.fDamage * (this.iShockCount * 0.01))
        let iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_razor/razor_storm_lightning_strike.vpcf",
            resNpc: null,
            iAttachment: ParticleAttachment_t.PATTACH_POINT,
            owner: hCaster
        });

        ParticleManager.SetParticleControl(iParticleID, 0, (hCaster.GetAbsOrigin() + Vector(0, 0, 526)) as Vector)
        ParticleManager.SetParticleControlEnt(iParticleID, 1, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", Vector(0, 0, 0), false)
        ParticleManager.ReleaseParticleIndex(iParticleID)
        EmitSoundOn("Hero_razor.lightning", hTarget)
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            this.StartIntervalThink(-1)
        } else {
            EmitSoundOn("Hero_Razor.Storm.End", this.GetParentPlus())
        }
    }



}
