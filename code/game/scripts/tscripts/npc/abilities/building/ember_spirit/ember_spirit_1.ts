import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { modifier_truesight } from "../../../modifier/modifier_truesight";

/** dota原技能数据 */
export const Data_ember_spirit_searing_chains = { "ID": "5603", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_EmberSpirit.SearingChains.Target", "AbilityCastRange": "400", "AbilityCastPoint": "0", "AbilityCooldown": "13 12 11 10", "AbilityManaCost": "80 90 100 110", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "1.5 2.0 2.5 3.0", "LinkedSpecialBonus": "special_bonus_unique_ember_spirit_2" }, "02": { "var_type": "FIELD_INTEGER", "radius": "400" }, "03": { "var_type": "FIELD_INTEGER", "total_damage": "75 150 225 300" }, "04": { "var_type": "FIELD_FLOAT", "tick_interval": "0.5" }, "05": { "var_type": "FIELD_INTEGER", "unit_count": "2" }, "06": { "var_type": "FIELD_INTEGER", "radius_scepter": "500" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ember_spirit_1 extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "ember_spirit_searing_chains";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_ember_spirit_searing_chains = Data_ember_spirit_searing_chains;
    Init() {
        this.SetDefaultSpecialValue("duration", [1, 2, 3, 4, 5, 6]);
        this.SetDefaultSpecialValue("radius", 1000);
        this.SetDefaultSpecialValue("damage", [100, 200, 400, 600, 800, 1000]);
        this.SetDefaultSpecialValue("tick_interval", 0.5);
        this.SetDefaultSpecialValue("unit_count", 5);
        this.SetDefaultSpecialValue("agility", 2);
        this.SetDefaultSpecialValue("damage_increase", [20, 22, 24, 26, 28, 30]);

    }



    OnSpellStart() {
        let caster = this.GetCasterPlus()
        let radius = this.GetSpecialValueFor("radius")
        let unit_count = this.GetSpecialValueFor("unit_count")
        let duration = this.GetSpecialValueFor("duration")
        modifier_ember_spirit_1_particle_ember_spirit_searing_chains_cast.apply(caster, caster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
        caster.EmitSound(ResHelper.GetSoundReplacement("Hero_EmberSpirit.SearingChains.Cast", caster))
        let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_ANY_ORDER)
        let n = 0
        for (let target of (targets)) {
            modifier_ember_spirit_1_debuff.apply(target, caster, this, { duration: duration * target.GetStatusResistanceFactor(caster) })
            modifier_ember_spirit_1_particle_ember_spirit_searing_chains_start.apply(target, caster, this, { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
            EmitSoundOnLocationWithCaster(target.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_EmberSpirit.SearingChains.Target", caster), caster)
            n = n + 1
            if (n >= unit_count) {
                break
            }
        }
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_ember_spirit_1"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_ember_spirit_1 extends BaseModifier_Plus {
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
            let order = FindOrder.FIND_ANY_ORDER
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable(
                    {
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                        AbilityIndex: ability.entindex()
                    }
                )
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_ember_spirit_1_debuff extends BaseModifier_Plus {
    damage: number;
    agility: number;
    tick_interval: number;
    duration: number;
    armor_reduction: number;
    damage_type: DAMAGE_TYPES;
    modifier_truesight: BaseModifier_Plus;
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        this.damage = this.GetSpecialValueFor("damage")
        this.agility = this.GetSpecialValueFor("agility")
        this.tick_interval = this.GetSpecialValueFor("tick_interval")
        this.duration = this.GetSpecialValueFor("duration") + hCaster.GetTalentValue("special_bonus_unique_ember_spirit_custom_8")
        this.armor_reduction = hCaster.GetTalentValue("special_bonus_unique_ember_spirit_custom")
        if (IsServer()) {
            this.damage_type = hAbility.GetAbilityDamageType()
            this.StartIntervalThink(this.tick_interval)
            this.modifier_truesight = modifier_truesight.apply(hParent, hCaster, hAbility, { duration: this.GetDuration() }) as BaseModifier_Plus
        } else {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_ember_spirit/ember_spirit_searing_chains_debuff.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });
            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }
    OnRefresh(params: ModifierTable) {
        super.OnRefresh(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        this.damage = this.GetSpecialValueFor("damage")
        this.agility = this.GetSpecialValueFor("agility")
        this.tick_interval = this.GetSpecialValueFor("tick_interval")
        this.duration = this.GetSpecialValueFor("duration") + hCaster.GetTalentValue("special_bonus_unique_ember_spirit_custom_8")
        this.armor_reduction = hCaster.GetTalentValue("special_bonus_unique_ember_spirit_custom")
        if (IsServer()) {
            this.damage_type = hAbility.GetAbilityDamageType()
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            if (GameFunc.IsValid(this.modifier_truesight)) {
                this.modifier_truesight.Destroy()
            }
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus()
            if (!GameFunc.IsValid(hCaster) || !hCaster.IsAlive()) {
                this.Destroy()
                return
            }
            let damage_table = {
                ability: hAbility,
                victim: hParent,
                attacker: hCaster,
                damage: this.damage * this.tick_interval + this.agility * hCaster.GetAgility(),
                damage_type: this.damage_type,
                eom_flags: BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_DOT,
            }
            BattleHelper.GoApplyDamage(damage_table)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    G_PHYSICAL_ARMOR_BONUS() {
        return -this.armor_reduction
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_PHYSICAL_DAMAGE_PERCENTAGE)
    EOM_GetModifierIncomingPhysicalDamagePercentage(params: ModifierTable) {
        if (params.damage_category != 1) { return }
        return this.GetSpecialValueFor("damage_increase")
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_ember_spirit_1_particle_ember_spirit_searing_chains_cast extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        let radius = this.GetSpecialValueFor("radius")
        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_ember_spirit/ember_spirit_searing_chains_cast.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });
            ParticleManager.SetParticleControl(particleID, 1, Vector(radius, radius, radius))
            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_ember_spirit_1_particle_ember_spirit_searing_chains_start extends modifier_particle {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_ember_spirit/ember_spirit_searing_chains_start.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: hCaster
            });
            ParticleManager.SetParticleControlEnt(particleID, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hCaster.GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(particleID, 1, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }
}
