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

/** dota原技能数据 */
export const Data_ember_spirit_flame_guard = { "ID": "5605", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "Hero_EmberSpirit.FlameGuard.Cast", "AbilityCastRange": "400", "AbilityCastPoint": "0", "AbilityCooldown": "35.0", "AbilityManaCost": "80 90 100 110", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "11 14 17 20" }, "02": { "var_type": "FIELD_INTEGER", "radius": "400" }, "03": { "var_type": "FIELD_INTEGER", "absorb_amount": "80 220 360 500", "LinkedSpecialBonus": "special_bonus_unique_ember_spirit_1" }, "04": { "var_type": "FIELD_FLOAT", "tick_interval": "0.2" }, "05": { "var_type": "FIELD_INTEGER", "damage_per_second": "25 35 45 55", "LinkedSpecialBonus": "special_bonus_unique_ember_spirit_3" }, "06": { "var_type": "FIELD_INTEGER", "blind_pct": "50" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ember_spirit_3 extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "ember_spirit_flame_guard";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_ember_spirit_flame_guard = Data_ember_spirit_flame_guard;

    Init() {
        this.SetDefaultSpecialValue("duration", [10, 11, 12, 13, 14, 15]);
        this.SetDefaultSpecialValue("radius", 800);
        this.SetDefaultSpecialValue("bonus_attack_damage_per_agi", [2, 3, 4, 5, 6, 7]);
        this.SetDefaultSpecialValue("tick_interval", 0.5);
        this.SetDefaultSpecialValue("damage_per_second", [350, 500, 650, 800, 950, 1100]);
        this.SetDefaultSpecialValue("ageility", [3, 5, 7, 9, 11, 14]);
        this.SetDefaultSpecialValue("attribute_percent", [60, 70, 80, 90, 100]);

    }




    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        return super.GetCooldown(iLevel) - hCaster.GetTalentValue("special_bonus_unique_ember_spirit_custom_7")
    }
    OnSpellStart() {
        let caster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration")

        modifier_ember_spirit_3_buff.apply(caster, caster, this, { duration: duration })

        caster.EmitSound(ResHelper.GetSoundReplacement("Hero_EmberSpirit.FlameGuard.Cast", caster))
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_ember_spirit_3"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_ember_spirit_3 extends BaseModifier_Plus {
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

            if (!ability.IsAbilityReady()) {
                return
            }

            let range = ability.GetSpecialValueFor("radius")
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
export class modifier_ember_spirit_3_buff extends BaseModifier_Plus {
    bonus_attack_damage_per_agi: number;
    radius: number;
    is_aura: any;
    aura_radius: number;
    tick_interval: number;
    damage_per_second: number;
    damage_type: DAMAGE_TYPES;
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
    IsAura() {
        return this.is_aura
    }
    GetAuraRadius() {
        return this.aura_radius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE
    }
    GetAura() {
        return "modifier_ember_spirit_3_friend"
    }
    GetAuraEntityReject(hTarget: BaseNpc_Plus) {
        return hTarget == this.GetParentPlus()
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        this.radius = this.GetSpecialValueFor("radius")
        this.is_aura = hCaster.HasTalent("special_bonus_unique_ember_spirit_custom_4")
        this.aura_radius = this.is_aura && this.radius || 0
        this.bonus_attack_damage_per_agi = this.GetSpecialValueFor("bonus_attack_damage_per_agi") + hCaster.GetTalentValue("special_bonus_unique_ember_spirit_custom_2")
        this.tick_interval = this.GetSpecialValueFor("tick_interval")
        this.damage_per_second = this.GetSpecialValueFor("damage_per_second")
        if (IsServer()) {
            if (hCaster.HasTalent("special_bonus_unique_ember_spirit_custom_6")) {
                modifier_ember_spirit_3_enemy_arua.apply(hCaster, hCaster, this.GetAbilityPlus(), { duration: this.GetDuration() })
            }
            this.damage_type = this.GetAbilityPlus().GetAbilityDamageType()

            let hParent = this.GetParentPlus()

            hParent.EmitSound(ResHelper.GetSoundReplacement("Hero_EmberSpirit.FlameGuard.Loop", hParent))

            this.StartIntervalThink(this.tick_interval)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_ember_spirit/ember_spirit_flameguard.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW, null, hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(this.radius, this.radius, this.radius))
            ParticleManager.SetParticleControl(iParticleID, 3, Vector(hCaster.GetModelRadius(), 0, 0))
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    OnRefresh(params: ModifierTable) {
        super.OnRefresh(params);
        let hCaster = this.GetCasterPlus()
        this.radius = this.GetSpecialValueFor("radius")
        this.is_aura = hCaster.HasTalent("special_bonus_unique_ember_spirit_custom_4")
        this.aura_radius = this.is_aura && this.radius || 0
        if (IsServer()) {
            if (hCaster.HasTalent("special_bonus_unique_ember_spirit_custom_6")) {
                modifier_ember_spirit_3_enemy_arua.apply(hCaster, hCaster, this.GetAbilityPlus(), { duration: this.GetDuration() })
            }
        }
        this.bonus_attack_damage_per_agi = this.GetSpecialValueFor("bonus_attack_damage_per_agi") + hCaster.GetTalentValue("special_bonus_unique_ember_spirit_custom_2")
        this.tick_interval = this.GetSpecialValueFor("tick_interval")
        this.damage_per_second = this.GetSpecialValueFor("damage_per_second")
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            this.GetParentPlus().StopSound(ResHelper.GetSoundReplacement("Hero_EmberSpirit.FlameGuard.Loop", this.GetParentPlus()))
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus()
            let damage = this.damage_per_second * this.tick_interval
            let radius = this.radius
            let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0)
            for (let hTarget of (tTargets)) {
                let tDamageTable = {
                    ability: hAbility,
                    victim: hTarget,
                    attacker: hCaster,
                    damage: damage + hCaster.GetAgility() * this.GetSpecialValueFor("ageility"),
                    damage_type: this.damage_type,
                    eom_flags: BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_DOT,
                }
                BattleHelper.GoApplyDamage(tDamageTable)
            }
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: ModifierTable) {
        return this.bonus_attack_damage_per_agi * this.GetParentPlus().GetAgility()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_ember_spirit_3_friend extends BaseModifier_Plus {
    bonus_attack_damage_per_agi: number;
    bouns_attack_damage: number;
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
        let hCaster = this.GetCasterPlus()
        if (GameFunc.IsValid(hCaster)) {
            this.bonus_attack_damage_per_agi = this.GetSpecialValueFor("bonus_attack_damage_per_agi") + hCaster.GetTalentValue("special_bonus_unique_ember_spirit_custom_2")
            this.bouns_attack_damage = this.bonus_attack_damage_per_agi * hCaster.GetAgility() * (hCaster.GetTalentValue("special_bonus_unique_ember_spirit_custom_4") * 0.01)
        }
    }
    OnRefresh(params: ModifierTable) {
        super.OnRefresh(params);
        let hCaster = this.GetCasterPlus()
        if (GameFunc.IsValid(hCaster)) {
            this.bonus_attack_damage_per_agi = this.GetSpecialValueFor("bonus_attack_damage_per_agi") + hCaster.GetTalentValue("special_bonus_unique_ember_spirit_custom_2")
            this.bouns_attack_damage = this.bonus_attack_damage_per_agi * hCaster.GetAgility() * (hCaster.GetTalentValue("special_bonus_unique_ember_spirit_custom_4") * 0.01)
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: ModifierTable) {
        return this.bouns_attack_damage
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_ember_spirit_3_enemy_arua extends BaseModifier_Plus {
    radius: any;
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
    IsAura() {
        return true
    }
    GetAura() {
        return "modifier_ember_spirit_3_enemy_arua_debuff"
    }
    GetAuraRadius() {
        return this.radius
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        this.radius = this.GetSpecialValueFor("radius")
    }
    OnRefresh(params: ModifierTable) {
        super.OnRefresh(params);
        this.radius = this.GetSpecialValueFor("radius")
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_ember_spirit_3_enemy_arua_debuff extends BaseModifier_Plus {
    bonus_magic_resistance: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
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
        let hCaster = this.GetCasterPlus()
        this.bonus_magic_resistance = hCaster.GetTalentValue("special_bonus_unique_ember_spirit_custom_6")
    }
    OnRefresh(params: ModifierTable) {
        super.OnRefresh(params);
        let hCaster = this.GetCasterPlus()
        this.bonus_magic_resistance = hCaster.GetTalentValue("special_bonus_unique_ember_spirit_custom_6")
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)

    On_Tooltip() {
        return this.bonus_magic_resistance
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MAGICAL_ARMOR_BONUS)
    g_MAGICAL_ARMOR_BONUS() {
        return this.bonus_magic_resistance
    }



}
