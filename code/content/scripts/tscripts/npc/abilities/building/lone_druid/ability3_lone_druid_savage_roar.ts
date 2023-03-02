import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_feared } from "../../../modifier/effect/modifier_feared";
import { modifier_particle } from "../../../modifier/modifier_particle";
/** dota原技能数据 */
export const Data_lone_druid_savage_roar = { "ID": "5414", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "Hero_LoneDruid.SavageRoar.Cast", "HasShardUpgrade": "1", "AbilityCastPoint": "0.1", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3", "AbilityCooldown": "38 32 26 20", "AbilityManaCost": "50", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "radius": "375" }, "02": { "var_type": "FIELD_INTEGER", "bonus_speed": "20" }, "03": { "var_type": "FIELD_FLOAT", "duration": "1.4 1.8 2.2 2.6" }, "04": { "var_type": "FIELD_INTEGER", "only_affects_player_units": "1" } } };

@registerAbility()
export class ability3_lone_druid_savage_roar extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "lone_druid_savage_roar";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_lone_druid_savage_roar = Data_lone_druid_savage_roar;

    Init() {
        this.SetDefaultSpecialValue("radius", 800);
        this.SetDefaultSpecialValue("duration", [1.5, 1.8, 2.1, 2.4, 2.8, 3.2]);
        this.SetDefaultSpecialValue("deep_damage_per", [5, 10, 15, 20, 25, 30]);
        this.SetDefaultSpecialValue("scepter_amplify_damage_per", 50);

    }
    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus() as IBaseNpc_Plus & { hSpiritBear: IBaseNpc_Plus, tSummonUnit: IBaseNpc_Plus[] }
        let duration = this.GetSpecialValueFor("duration") + hCaster.GetTalentValue("special_bonus_unique_lone_druid_custom_1")
        let radius = this.GetSpecialValueFor("radius")

        let tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), null, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
        this.SavageRoar(hCaster, tTarget)
        if (GFuncEntity.IsValid(hCaster.hSpiritBear) && hCaster.hSpiritBear.IsAlive()) {
            tTarget = FindUnitsInRadius(hCaster.GetTeamNumber(), hCaster.hSpiritBear.GetAbsOrigin(), null, radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
            this.SavageRoar(hCaster.hSpiritBear, tTarget)
        }
        if (hCaster.HasScepter()) {
            modifier_lone_druid_3_scepter_buff.apply(hCaster, hCaster, this, { duration: duration })
            if (hCaster.tSummonUnit != null) {
                for (let unit of (hCaster.tSummonUnit)) {
                    if (GFuncEntity.IsValid(unit) && unit.IsAlive()) {
                        modifier_lone_druid_3_scepter_buff.apply(unit, hCaster, this, { duration: duration })
                    }
                }
            }
        }
    }
    SavageRoar(unit: IBaseNpc_Plus, tTarget: IBaseNpc_Plus[]) {
        let hCaster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration") + hCaster.GetTalentValue("special_bonus_unique_lone_druid_custom_1")
        // 特效
        modifier_lone_druid_3_particle.apply(unit, unit, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
        // 音效
        EmitSoundOnLocationWithCaster(hCaster.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_LoneDruid.SavageRoar.Cast", hCaster), hCaster)
        for (let hTarget of (tTarget)) {

            if (GFuncEntity.IsValid(hTarget) && hTarget.IsAlive()) {
                modifier_feared.apply(hTarget, hCaster, this, { duration: duration * hTarget.GetStatusResistanceFactor(hCaster) })
                modifier_lone_druid_3_debuff.apply(hTarget, hCaster, this, { duration: duration * hTarget.GetStatusResistanceFactor(hCaster) })
            }
        }
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_lone_druid_3"
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_lone_druid_3 extends BaseModifier_Plus {
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

            let range = ability.GetSpecialValueFor("radius")

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
export class modifier_lone_druid_3_scepter_buff extends BaseModifier_Plus {
    scepter_amplify_damage_per: number;
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
    Init(params: IModifierTable) {
        let hParent = this.GetParentPlus()
        this.scepter_amplify_damage_per = this.GetSpecialValueFor("scepter_amplify_damage_per")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_DAMAGE_PERCENTAGE)
    G_OUTGOING_DAMAGE_PERCENTAGE() {
        return this.scepter_amplify_damage_per
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.scepter_amplify_damage_per
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_lone_druid_3_debuff extends BaseModifier_Plus {
    deep_damage_per: number;
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
        this.deep_damage_per = this.GetSpecialValueFor("deep_damage_per")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    G_INCOMING_DAMAGE_PERCENTAGE() {
        return this.deep_damage_per
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_lone_druid_3_particle extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let radius = this.GetSpecialValueFor("radius")
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_lone_druid/lone_druid_savage_roar.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });
            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_mouth", hParent.GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticleID, 3, Vector(radius, radius, radius))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
