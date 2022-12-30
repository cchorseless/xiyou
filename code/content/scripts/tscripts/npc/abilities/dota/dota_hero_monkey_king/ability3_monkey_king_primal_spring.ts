import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_monkey_king_6_soldier } from "./ability6_monkey_king_wukongs_command";

/** dota原技能数据 */
export const Data_monkey_king_primal_spring = { "ID": "5724", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_CHANNELLED | DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_MonkeyKing.Spring.Channel", "AbilityCastPoint": "0", "AbilityCastRange": "0", "AbilityCooldown": "19 17 15 13", "AbilityChannelTime": "1.7", "AbilityManaCost": "100", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "impact_damage": "140 210 280 350", "LinkedSpecialBonus": "special_bonus_unique_monkey_king_3" }, "02": { "var_type": "FIELD_INTEGER", "impact_movement_slow": "20 40 60 80" }, "03": { "var_type": "FIELD_FLOAT", "impact_slow_duration": "4.0" }, "04": { "var_type": "FIELD_INTEGER", "max_distance": "1000" }, "05": { "var_type": "FIELD_INTEGER", "impact_radius": "375" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_monkey_king_primal_spring extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "monkey_king_primal_spring";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_monkey_king_primal_spring = Data_monkey_king_primal_spring;
    Init() {
        this.SetDefaultSpecialValue("required_hits", 30);
        this.SetDefaultSpecialValue("bonus_damage_ptg", [100, 150, 200, 250, 300]);
        this.SetDefaultSpecialValue("max_duration", 5);
        this.SetDefaultSpecialValue("bonus_lifesteal", [10, 15, 20, 27, 35]);
        this.SetDefaultSpecialValue("lifesteal_agi", [0.5, 1, 1.5, 2, 2.5]);
        this.SetDefaultSpecialValue("lifesteal_duration", 7);

    }

    Init_old() {
        this.SetDefaultSpecialValue("required_hits", 30);
        this.SetDefaultSpecialValue("bonus_damage_ptg", [50, 100, 150, 200, 250, 300]);
        this.SetDefaultSpecialValue("max_duration", 4);

    }



    // GetIntrinsicModifierName() {
    //     return "modifier_monkey_king_3"
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_monkey_king_3 extends BaseModifier_Plus {
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

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    EOM_GetModifierLifestealAmplify_Percentage() {
        return this.GetSpecialValueFor("bonus_lifesteal")
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.LIFESTEAL_AMPLIFY_PERCENTAGE)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        let caster = params.attacker as IBaseNpc_Plus
        let target = params.target as IBaseNpc_Plus
        if (caster == this.GetParentPlus() || caster.HasShard() && !modifier_monkey_king_3_buff.exist((caster)) && !modifier_monkey_king_6_soldier.exist(caster) && !caster.PassivesDisabled() && !caster.IsIllusion() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS)) {
            modifier_monkey_king_3_counter.apply(caster, caster, this.GetAbilityPlus(), null)
        }

        let hParent = caster
        let hAbility = this.GetAbilityPlus()
        if (params.attacker == hParent && !params.attacker.IsIllusion() && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, hParent.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
            let iAgi = hParent.GetAgility != null && hParent.GetAgility() || 0
            let fBonusHealth = iAgi * this.GetSpecialValueFor("lifesteal_agi")
            fBonusHealth = fBonusHealth /*** hParent.GetLifestealAmplifyFactor()*/
            // modifier_item_paladin_sword_neutral_custom_buff.apply(hParent, hParent, hAbility, { duration: this.GetSpecialValueFor("lifesteal_duration"), bonus_health: fBonusHealth })
            // modifier_item_paladin_sword_neutral_custom_debuff.apply(params.target, hParent, hAbility, { duration: this.GetSpecialValueFor("lifesteal_duration"), bonus_health: fBonusHealth })
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_monkey_king_3_counter extends BaseModifier_Plus {
    iParticleID: ParticleID;
    required_hits: number;
    max_duration: number;
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
        this.required_hits = this.GetSpecialValueFor("required_hits")
        this.max_duration = this.GetSpecialValueFor("max_duration")
        if (IsServer()) {
            this.IncrementStackCount()
        } else {
            this.iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_monkey_king/monkey_king_quad_tap_counter.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControl(this.iParticleID, 1, Vector(0, 1, 0))
            this.AddParticle(this.iParticleID, false, false, -1, false, true)
        }
    }
    OnRefresh(params: ModifierTable) {
        super.OnRefresh(params);
        this.required_hits = this.GetSpecialValueFor("required_hits")
        this.max_duration = this.GetSpecialValueFor("max_duration")
        if (IsServer()) {
            this.IncrementStackCount()
        }
    }
    OnStackCountChanged(iOldStackCount: number) {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()

            let extra_required_hits = hCaster.HasTalent("special_bonus_unique_monkey_king_custom_2") && hCaster.GetTalentValue("special_bonus_unique_monkey_king_custom_2") || 0
            let required_hits = this.required_hits - extra_required_hits
            if (this.GetStackCount() >= required_hits) {
                let hParent = this.GetParentPlus()
                hParent.EmitSound(ResHelper.GetSoundReplacement("Hero_MonkeyKing.IronCudgel", hCaster))
                let extra_max_duration = hCaster.HasTalent("special_bonus_unique_monkey_king_custom_6") && hCaster.GetTalentValue("special_bonus_unique_monkey_king_custom_6") || 0
                let max_duration = this.max_duration + extra_max_duration
                modifier_monkey_king_3_buff.apply(hParent, hCaster, this.GetAbilityPlus(), { duration: max_duration })
                this.Destroy()
            }
        } else {
            let number = this.GetStackCount()
            if (this.iParticleID != null) {
                ParticleManager.SetParticleControl(this.iParticleID, 1, Vector(math.floor(number / 10), math.floor(number % 10), 0))
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_monkey_king_3_buff extends BaseModifier_Plus {
    bonus_damage_ptg: number;
    bonus_lifesteal: number;
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
        return true
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    ShouldUseOverheadOffset() {
        return true
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_monkey_king/monkey_king_quad_tap_start.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.ReleaseParticleIndex(iParticleID)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_monkey_king/monkey_king_quad_tap_overhead.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, true)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_monkey_king/monkey_king_tap_buff.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 2, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_weapon_top", this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(iParticleID, 3, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_weapon_bot", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    Init(params: ModifierTable) {
        this.bonus_damage_ptg = this.GetSpecialValueFor("bonus_damage_ptg")
        this.bonus_lifesteal = this.GetSpecialValueFor("bonus_lifesteal")
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.LIFESTEAL_AMPLIFY_PERCENTAGE)

    G_LIFESTEAL_AMPLIFY_PERCENTAGE() {
        return this.bonus_lifesteal
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    GetDamageOutgoing_Percentage(params: ModifierTable) {
        return this.bonus_damage_ptg
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        let caster = params.attacker
        let target = params.target
        if (caster == this.GetParentPlus()) {
            modifier_monkey_king_3_particle_monkey_king_quad_tap_hit.apply(caster, target, this.GetAbilityPlus(), { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    Get_ActivityTranslationModifiers() {
        if (this.GetStackCount() > 0) {
            return "iron_cudgel_charged_attack"
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_monkey_king_3_particle_monkey_king_quad_tap_hit extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_monkey_king/monkey_king_quad_tap_hit.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
