import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle_thinker } from "../../../modifier/modifier_particle";
import { ability1_crystal_maiden_crystal_nova } from "./ability1_crystal_maiden_crystal_nova";
import { ability2_crystal_maiden_frostbite } from "./ability2_crystal_maiden_frostbite";

/** dota原技能数据 */
export const Data_crystal_maiden_freezing_field = { "ID": "5129", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_CHANNELLED | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "2", "AbilitySound": "hero_Crystal.freezingField.wind", "HasScepterUpgrade": "1", "HasShardUpgrade": "1", "AbilityChannelTime": "10", "AbilityCastPoint": "0", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityChannelAnimation": "ACT_DOTA_CHANNEL_ABILITY_4", "AbilityCooldown": "110 100 90", "AbilityDuration": "10.0", "AbilityManaCost": "200 400 600", "AbilityModifierSupportValue": "0.35", "AbilitySpecial": { "10": { "var_type": "FIELD_INTEGER", "damage": "105 170 250", "LinkedSpecialBonus": "special_bonus_unique_crystal_maiden_3" }, "11": { "var_type": "FIELD_FLOAT", "scepter_delay": "1.75", "RequiresScepter": "1" }, "01": { "var_type": "FIELD_INTEGER", "radius": "810" }, "02": { "var_type": "FIELD_INTEGER", "explosion_radius": "300" }, "03": { "var_type": "FIELD_INTEGER", "bonus_armor": "20" }, "04": { "var_type": "FIELD_FLOAT", "explosion_interval": "0.1" }, "05": { "var_type": "FIELD_INTEGER", "movespeed_slow": "-30" }, "06": { "var_type": "FIELD_INTEGER", "attack_slow": "-60" }, "07": { "var_type": "FIELD_FLOAT", "slow_duration": "1.0" }, "08": { "var_type": "FIELD_INTEGER", "explosion_min_dist": "195" }, "09": { "var_type": "FIELD_INTEGER", "explosion_max_dist": "785" } } };

@registerAbility()
export class ability6_crystal_maiden_freezing_field extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "crystal_maiden_freezing_field";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_crystal_maiden_freezing_field = Data_crystal_maiden_freezing_field;
    Init() {
        this.SetDefaultSpecialValue("duration_tooltip", 7);
        this.SetDefaultSpecialValue("scepter_frostbite_chance", 35);
        this.SetDefaultSpecialValue("scepter_frostbite_damage_ptg", 200);
        this.SetDefaultSpecialValue("radius", 835);
        this.SetDefaultSpecialValue("explosion_radius", 300);
        this.SetDefaultSpecialValue("explosion_interval", 0.1);
        this.SetDefaultSpecialValue("movespeed_slow", -40);
        this.SetDefaultSpecialValue("slow_duration", 1);
        this.SetDefaultSpecialValue("explosion_min_dist", 195);
        this.SetDefaultSpecialValue("explosion_max_dist", 785);
        this.SetDefaultSpecialValue("damage", [200, 400, 800, 1200, 2000, 3600]);
        this.SetDefaultSpecialValue("damage_per_intellect", 10);

    }


    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        let sTalentName = "special_bonus_unique_crystal_maiden_custom_6"
        return super.GetCooldown(iLevel) - hCaster.GetTalentValue(sTalentName)
    }
    GetPlaybackRateOverride() {
        return 0.6
    }

    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetSpecialValueFor("radius") + this.GetCasterPlus().GetTalentValue("special_bonus_unique_crystal_maiden_custom_1")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let sTalentName = "special_bonus_unique_crystal_maiden_custom_4"
        modifier_crystal_maiden_6_caster.apply(hCaster, hCaster, this)
        if (hCaster.HasTalent(sTalentName)) {
            modifier_special_bonus_unique_crystal_maiden_custom_4.apply(hCaster, hCaster, this)
        }
    }

    OnChannelFinish(bInterrupted: boolean) {
        let hCaster = this.GetCasterPlus()
        modifier_crystal_maiden_6_caster.remove(hCaster);
        if (modifier_special_bonus_unique_crystal_maiden_custom_4.exist(hCaster)) {
            modifier_special_bonus_unique_crystal_maiden_custom_4.remove(hCaster);
        }
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_crystal_maiden_6"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
// Modifiers
@registerModifier()
export class modifier_crystal_maiden_6 extends BaseModifier_Plus {
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

            let range = this.GetAbilityPlus().GetCastRange(caster.GetAbsOrigin(), caster)
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
            let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
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
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
@registerModifier()
export class modifier_crystal_maiden_6_caster extends BaseModifier_Plus {
    radius: number;
    explosion_radius: number;
    slow_duration: number;
    explosion_interval: number;
    explosion_min_dist: number;
    explosion_max_dist: number;
    damage_per_intellect: number;
    damage: number;
    scepter_frostbite_damage_ptg: number;
    scepter_frostbite_chance: number;
    damage_type: DAMAGE_TYPES;
    count: number;
    hThinker: IBaseNpc_Plus;
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
        let hCaster = this.GetCasterPlus()
        this.radius = this.GetSpecialValueFor("radius") + hCaster.GetTalentValue("special_bonus_unique_crystal_maiden_custom_1")
        this.explosion_radius = this.GetSpecialValueFor("explosion_radius")
        this.explosion_interval = this.GetSpecialValueFor("explosion_interval")
        this.slow_duration = this.GetSpecialValueFor("slow_duration")
        this.explosion_min_dist = this.GetSpecialValueFor("explosion_min_dist")
        this.explosion_max_dist = this.GetSpecialValueFor("explosion_max_dist") + hCaster.GetTalentValue("special_bonus_unique_crystal_maiden_custom_1")
        this.damage = this.GetSpecialValueFor("damage")
        this.damage_per_intellect = this.GetSpecialValueFor("damage_per_intellect")
        this.scepter_frostbite_chance = this.GetSpecialValueFor("scepter_frostbite_chance")
        this.scepter_frostbite_damage_ptg = this.GetSpecialValueFor("scepter_frostbite_damage_ptg")
        if (IsServer()) {
            let parent = this.GetParentPlus()
            this.damage_type = this.GetAbilityPlus().GetAbilityDamageType()
            parent.EmitSound(ResHelper.GetSoundReplacement("hero_Crystal.freezingField.wind", parent))
            this.count = 0
            this.StartIntervalThink(this.explosion_interval)
            this.hThinker = modifier_crystal_maiden_6_particle_explosion.applyThinker(parent.GetAbsOrigin(), parent, this.GetAbilityPlus())
        }
        else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_crystalmaiden/maiden_freezing_field_snow.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW,
                owner: this.GetCasterPlus()
            });
            ParticleManager.SetParticleControl(iParticleID, 1, Vector(this.radius, this.radius + this.explosion_radius, this.radius + this.explosion_radius))
            this.AddParticle(iParticleID, false, true, 10, false, false)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let parent = this.GetParentPlus()
            modifier_crystal_maiden_6_particle_explosion.remove(this.hThinker);
            parent.StopSound(ResHelper.GetSoundReplacement("hero_Crystal.freezingField.wind", parent))
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let parent = this.GetParentPlus()
            let radian = math.rad(this.count * 90 + RandomFloat(0, 90))
            let distance = RandomFloat(this.explosion_min_dist, this.explosion_max_dist)
            let vPosition = GetGroundPosition((parent.GetAbsOrigin() + GameFunc.VectorFunctions.Rotation2D(Vector(1, 0, 0), radian) * distance) as Vector, parent)
            let damage = this.damage + this.damage_per_intellect * parent.GetIntellect()
            let crystal_maiden_1 = ability1_crystal_maiden_crystal_nova.findIn(parent)
            let bCanTriggerScepter = parent.HasScepter() && crystal_maiden_1 != null && crystal_maiden_1.GetLevel() > 0
            this.hThinker.SetAbsOrigin(vPosition)
            undefined

            this.count = this.count + 1
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_crystal_maiden_6_particle_explosion extends modifier_particle_thinker {
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
    }
    OnRefresh(params: ModifierTable) {
        super.OnRefresh(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsServer()) {
            let explosion_radius = this.GetSpecialValueFor("explosion_radius")
            let slow_duration = this.GetSpecialValueFor("slow_duration")
            let scepter_frostbite_chance = this.GetSpecialValueFor("scepter_frostbite_chance")
            let scepter_frostbite_damage_ptg = this.GetSpecialValueFor("scepter_frostbite_damage_ptg")
            let damage = this.GetSpecialValueFor("damage") + this.GetSpecialValueFor("damage_per_intellect") * hCaster.GetIntellect()
            let iDamageType = hAbility.GetAbilityDamageType()
            let crystal_maiden_2 = ability2_crystal_maiden_frostbite.findIn(hCaster)
            let bCanTriggerScepter = hCaster.HasScepter() && crystal_maiden_2 != null && crystal_maiden_2.GetLevel() > 0
            EmitSoundOnLocationWithCaster(hParent.GetAbsOrigin(), ResHelper.GetSoundReplacement("hero_Crystal.freezingField.explosion", hCaster), hCaster)
            let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hParent.GetAbsOrigin(), explosion_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, 0, FindOrder.FIND_CLOSEST)
            for (let target of (targets)) {

                let damage_table = {
                    ability: hAbility,
                    victim: target,
                    attacker: hCaster,
                    damage: damage,
                    damage_type: iDamageType
                }
                BattleHelper.GoApplyDamage(damage_table)
                modifier_crystal_maiden_6_slow.apply(target, hCaster, hAbility, { duration: slow_duration * target.GetStatusResistanceFactor(hCaster) })
                if (bCanTriggerScepter && RollPercentage(scepter_frostbite_chance)) {
                    crystal_maiden_2.Frostbite(target, scepter_frostbite_damage_ptg - 100)
                }
            }
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_crystalmaiden/maiden_freezing_field_explosion.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_WORLDORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hParent.GetAbsOrigin())
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_crystal_maiden_6_slow extends BaseModifier_Plus {
    movespeed_slow: number;
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
        this.movespeed_slow = this.GetSpecialValueFor("movespeed_slow")
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_frost.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, true, 10, false, false)
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(params: ModifierTable) {
        return this.movespeed_slow
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_special_bonus_unique_crystal_maiden_custom_4 extends BaseModifier_Plus {
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
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/items_fx/black_king_bar_avatar.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }

    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true
        }
    }

}
