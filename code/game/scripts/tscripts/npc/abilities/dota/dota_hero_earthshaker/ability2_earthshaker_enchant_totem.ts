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
import { modifier_particle } from "../../../modifier/modifier_particle";
import { modifier_earthshaker_1_root } from "./ability1_earthshaker_fissure";

/** dota原技能数据 */
export const Data_earthshaker_enchant_totem = { "ID": "5024", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "Hero_EarthShaker.Totem", "HasScepterUpgrade": "1", "AbilityCastRange": "0", "AbilityCastPoint": "0.69 0.69 0.69 0.69", "FightRecapLevel": "1", "AbilityCooldown": "5.0", "AbilityDuration": "14", "AbilityDamage": "0 0 0 0", "AbilityManaCost": "35 40 45 50", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "totem_damage_percentage": "100 200 300 400", "CalculateSpellDamageTooltip": "0" }, "02": { "var_type": "FIELD_INTEGER", "distance_scepter": "950", "RequiresScepter": "1" }, "03": { "var_type": "FIELD_INTEGER", "aftershock_range": "300" }, "04": { "var_type": "FIELD_INTEGER", "scepter_height": "950" }, "05": { "var_type": "FIELD_INTEGER", "scepter_height_arcbuffer": "100" }, "06": { "var_type": "FIELD_INTEGER", "scepter_acceleration_z": "4000" }, "07": { "var_type": "FIELD_INTEGER", "scepter_acceleration_horizontal": "3000" }, "08": { "var_type": "FIELD_FLOAT", "scepter_leap_duration": "1.0" }, "09": { "var_type": "FIELD_INTEGER", "bonus_attack_range": "75" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_earthshaker_enchant_totem extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "earthshaker_enchant_totem";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_earthshaker_enchant_totem = Data_earthshaker_enchant_totem;
    Init() {
        this.SetDefaultSpecialValue("totem_damage_percentage", [100, 200, 300, 400, 500, 600]);
        this.SetDefaultSpecialValue("bonus_attack_range", 300);
        this.SetDefaultSpecialValue("splash_damage", 100);
        this.SetDefaultSpecialValue("splash_radius", 250);

    }



    vLeapPosition: any;


    GetCooldown(iLevel: number) {
        return super.GetCooldown(iLevel) - this.GetCasterPlus().GetTalentValue("special_bonus_unique_earthshaker")
    }
    GetCastRange(vLocation: Vector, hTarget: BaseNpc_Plus) {
        return this.GetSpecialValueFor("aftershock_range")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        if (this.vLeapPosition == null) {
            let duration = this.GetDuration()

            modifier_earthshaker_2_buff.apply(hCaster, hCaster, this, { duration: duration })

            hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_EarthShaker.Totem", hCaster))
        }
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_earthshaker_2"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_earthshaker_2 extends BaseModifier_Plus {
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

            let hCaster = ability.GetCasterPlus()

            if (!GameFunc.IsValid(hCaster)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

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

            //  点了天赋攻击不消耗强化图腾的时候，没必要一直释放
            if (modifier_earthshaker_2_buff.exist(hCaster)) {
                return
            }

            let range = hCaster.Script_GetAttackRange() + ability.GetSpecialValueFor("bonus_attack_range")
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets.length > 0) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex()
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_earthshaker_2_buff extends BaseModifier_Plus {
    totem_damage_percentage: number;
    splash_damage: number;
    bonus_attack_range: number;
    splash_radius: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return false
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.totem_damage_percentage = this.GetSpecialValueFor("totem_damage_percentage") + hCaster.GetTalentValue("special_bonus_unique_earthshaker_custom_8")
        this.bonus_attack_range = this.GetSpecialValueFor("bonus_attack_range")
        this.splash_damage = this.GetSpecialValueFor("splash_damage") + hCaster.GetTalentValue("special_bonus_unique_earthshaker_custom_1")
        this.splash_radius = this.GetSpecialValueFor("splash_radius")
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_earthshaker/earthshaker_totem_buff.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_totem", hParent.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_earthshaker/earthshaker_totem_cast.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
    OnRefresh(params: ModifierTable) {
        super.OnRefresh(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.totem_damage_percentage = this.GetSpecialValueFor("totem_damage_percentage") + hCaster.GetTalentValue("special_bonus_unique_earthshaker_custom_8")
        this.bonus_attack_range = this.GetSpecialValueFor("bonus_attack_range")
        this.splash_damage = this.GetSpecialValueFor("splash_damage") + hCaster.GetTalentValue("special_bonus_unique_earthshaker_custom_1")
        this.splash_radius = this.GetSpecialValueFor("splash_radius")
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_earthshaker/earthshaker_totem_cast.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_CANNOT_MISS]: true,
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE)
    Get_BaseDamageOutgoing_Percentage(params: ModifierTable) {
        return this.totem_damage_percentage
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    Get_ActivityTranslationModifiers() {
        return "enchant_totem"
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    Get_AttackRangeBonus(params: ModifierTable) {
        return this.bonus_attack_range
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.CAST_RANGE_BONUS_STACKING)
    Get_CastRangeBonusStacking(params: ModifierAbilityEvent) {
        if (GameFunc.IsValid(params.ability) && GameFunc.IncludeArgs(params.ability.GetBehaviorInt(), DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_ATTACK)[0]) {
            return this.bonus_attack_range
        }
        return 0
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierTable) {
        if (!GameFunc.IsValid(params.target) || params.target.GetClassname() == "dota_item_drop") { return }

        if (params.attacker == this.GetParentPlus()) {
            if (params.attacker.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)) {
                return
            }

            modifier_earthshaker_2_particle_attack.apply(params.attacker, params.target, this.GetAbilityPlus(), { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
            EmitSoundOnLocationWithCaster(params.target.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_EarthShaker.Totem.Attack", params.attacker), params.attacker)

            let tTargets = FindUnitsInRadius(params.attacker.GetTeamNumber(), params.target.GetAbsOrigin(), null, this.splash_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST, false)
            GameFunc.ArrayFunc.ArrayRemove(tTargets, params.target)
            if (params.attacker.HasScepter()) {
                let _tTargets = AoiHelper.FindUnitsInRadiusByModifierName("modifier_earthshaker_1_root", params.attacker.GetTeamNumber(), Vector(0, 0, 0), 5000, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST)
                for (let v of (_tTargets)) {
                    let hModifier = modifier_earthshaker_1_root.findIn(v) as modifier_earthshaker_1_root;
                    if (GameFunc.IsValid(hModifier) && GameFunc.IsValid(hModifier.GetCasterPlus()) && hModifier.GetCasterPlus().GetPlayerOwnerID() == params.attacker.GetPlayerOwnerID()) {
                        table.insert(tTargets, v)
                    }
                }
            }
            for (let hTarget of (tTargets as BaseNpc_Plus[])) {
                BattleHelper.GoApplyDamage({
                    ability: this.GetAbilityPlus(),
                    attacker: params.attacker,
                    victim: hTarget,
                    damage: params.original_damage * this.splash_damage * 0.01,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
                    eom_flags: BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_NO_SPELL_CRIT,
                })
            }

            if (!params.attacker.HasTalent("special_bonus_unique_earthshaker_custom_5")) {
                this.Destroy()
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_earthshaker_2_particle_attack extends modifier_particle {
    splash_radius: number;
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        this.splash_radius = this.GetSpecialValueFor("splash_radius")

        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_earthshaker/earthshaker_totem_blur_impact.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)

            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_earthshaker/earthshaker_aftershock.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hCaster.GetAbsOrigin())
            ParticleManager.SetParticleControlForward(iParticleID, 0, (-((hCaster.GetAbsOrigin() - hParent.GetAbsOrigin()) as Vector).Normalized()) as Vector)
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.splash_radius, this.splash_radius, this.splash_radius))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
