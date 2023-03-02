import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_dragon_knight_6_form } from "./ability6_dragon_knight_elder_dragon_form";

/** dota原技能数据 */
export const Data_dragon_knight_breathe_fire = { "ID": "5226", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_DIRECTIONAL | DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "FightRecapLevel": "1", "AbilitySound": "Hero_DragonKnight.BreathFire", "AbilityCastRange": "600", "AbilityCastPoint": "0.2", "AbilityCooldown": "14 13 12 11", "AbilityDamage": "90 170 240 300", "AbilityManaCost": "90 100 110 120", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "start_radius": "150 150 150 150" }, "02": { "var_type": "FIELD_INTEGER", "end_radius": "250 250 250 250" }, "03": { "var_type": "FIELD_INTEGER", "range": "750" }, "04": { "var_type": "FIELD_INTEGER", "speed": "1050" }, "05": { "var_type": "FIELD_INTEGER", "reduction": "-25", "LinkedSpecialBonus": "special_bonus_unique_dragon_knight_3" }, "06": { "var_type": "FIELD_FLOAT", "duration": "11" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_dragon_knight_breathe_fire extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "dragon_knight_breathe_fire";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_dragon_knight_breathe_fire = Data_dragon_knight_breathe_fire;
    Init() {
        this.SetDefaultSpecialValue("debuff_duration", 7);
        this.SetDefaultSpecialValue("debuff_dps_percent", 10);
        this.SetDefaultSpecialValue("extra_burning_radius", 150);
        this.SetDefaultSpecialValue("debuff_slow_movespeed", -20);
        this.SetDefaultSpecialValue("debuff_armor_reduction", -20);
        this.SetDefaultSpecialValue("debuff_magic_resis_reduction", -20);
        this.SetDefaultSpecialValue("start_radius", 150);
        this.SetDefaultSpecialValue("end_radius", 250);
        this.SetDefaultSpecialValue("range", 850);
        this.SetDefaultSpecialValue("speed", 1050);
        this.SetDefaultSpecialValue("burning_dps_percent", 30);
        this.SetDefaultSpecialValue("form_burning_dps_percent", 40);
        this.SetDefaultSpecialValue("burning_radius", 50);
        this.SetDefaultSpecialValue("burning_duration", 7);
        this.SetDefaultSpecialValue("burning_max_count", [2, 3, 4, 5, 6, 7]);

    }

    burning_count: any;

    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        return super.GetCooldown(iLevel) - hCaster.GetTalentValue("special_bonus_unique_dragon_knight_custom_4")
    }

    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let start_radius = this.GetSpecialValueFor("start_radius")
        let end_radius = this.GetSpecialValueFor("end_radius")
        let range = this.GetSpecialValueFor("range")
        let speed = this.GetSpecialValueFor("speed")

        let vDirection = (vPosition - hCaster.GetAbsOrigin()) as Vector
        vDirection.z = 0

        let iDragonLevel = 0
        let hModifier = modifier_dragon_knight_6_form.findIn(hCaster)
        if (GFuncEntity.IsValid(hModifier)) {
            iDragonLevel = hModifier.iLevel || iDragonLevel
        }

        let sParticlePath = "particles/units/heroes/hero_dragon_knight/dragon_knight_breathe_fire.vpcf"
        if (iDragonLevel >= 1 && iDragonLevel <= 2) {
            sParticlePath = "particles/units/heroes/hero_dragon_knight/dragon_knight_breathe_fire_corrosive.vpcf"
        } else if (iDragonLevel >= 3 && iDragonLevel <= 4) {
            sParticlePath = "particles/units/heroes/hero_dragon_knight/dragon_knight_breathe_fire_fire.vpcf"
        } else if (iDragonLevel >= 5 && iDragonLevel <= 6) {
            sParticlePath = "particles/units/heroes/hero_dragon_knight/dragon_knight_breathe_fire_frost.vpcf"
        } else if (iDragonLevel >= 7) {
            sParticlePath = "particles/units/heroes/hero_dragon_knight/dragon_knight_breathe_fire_black.vpcf"
        }

        let vHead = hCaster.GetAttachmentOrigin(hCaster.ScriptLookupAttachment("attach_head"))
        let vStart = hCaster.GetAbsOrigin()
        vStart.z = vHead.z

        let tInfo: CreateLinearProjectileOptions = {
            Ability: this,
            Source: hCaster,
            EffectName: ResHelper.GetParticleReplacement(sParticlePath, hCaster),
            vSpawnOrigin: vStart,
            vVelocity: (vDirection.Normalized() * speed) as Vector,
            fDistance: range,
            fStartRadius: start_radius,
            fEndRadius: end_radius,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            ExtraData: {
                dragon_level: iDragonLevel,
            }
        }
        ProjectileManager.CreateLinearProjectile(tInfo)

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_DragonKnight.BreathFire", hCaster))
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        if (GFuncEntity.IsValid(hTarget)) {
            let hCaster = this.GetCasterPlus()
            let sTalentName = "special_bonus_unique_dragon_knight_custom_6"
            let burning_duration = this.GetSpecialValueFor("burning_duration") + hCaster.GetTalentValue(sTalentName)
            let burning_max_count = this.GetSpecialValueFor("burning_max_count")
            let damage = this.GetAbilityDamage()
            if (this.burning_count == null) { this.burning_count = 0 }
            if (this.burning_count < burning_max_count) {
                modifier_dragon_knight_1_thinker.applyThinker(hTarget.GetAbsOrigin(), hCaster, this, { duration: burning_duration, dragon_level: ExtraData.dragon_level }, hCaster.GetTeamNumber(), false)
            }
            let tDamageTable = {
                ability: this,
                attacker: hCaster,
                victim: hTarget,
                damage: damage,
                damage_type: this.GetAbilityDamageType()
            }
            BattleHelper.GoApplyDamage(tDamageTable)
        }
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_dragon_knight_1"
    // }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_dragon_knight_1 extends BaseModifier_Plus {
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
            if (!GFuncEntity.IsValid(ability)) {
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

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()
            let start_width = ability.GetSpecialValueFor("start_radius")
            let end_width = ability.GetSpecialValueFor("end_radius")

            let position = AoiHelper.GetLinearMostTargetsPosition(caster.GetAbsOrigin(),
                range,
                caster.GetTeamNumber(),
                start_width,
                end_width,
                null,
                ability.GetAbilityTargetTeam(),
                ability.GetAbilityTargetType(),
                ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE,
                FindOrder.FIND_CLOSEST)

            if (position != vec3_invalid && caster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: position,
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_dragon_knight_1_thinker extends BaseModifier_Plus {
    burning_dps_percent: number;
    form_burning_dps_percent: number;
    burning_radius: number;
    debuff_duration: number;
    extra_burning_radius: number;
    iDragonLevel: any;
    tick_time: number;
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

        this.burning_dps_percent = this.GetSpecialValueFor("burning_dps_percent")
        this.form_burning_dps_percent = this.GetSpecialValueFor("form_burning_dps_percent")
        this.burning_radius = this.GetSpecialValueFor("burning_radius")
        this.debuff_duration = this.GetSpecialValueFor("debuff_duration")
        this.extra_burning_radius = this.GetSpecialValueFor("extra_burning_radius")
        if (IsServer()) {
            this.iDragonLevel = params.dragon_level || 0
            if (this.iDragonLevel >= 3) {
                this.burning_radius = this.burning_radius + this.extra_burning_radius
            }
            let ability = this.GetAbilityPlus() as ability1_dragon_knight_breathe_fire
            if (GFuncEntity.IsValid(this.GetAbilityPlus())) {
                ability.burning_count = (ability.burning_count || 0) + 1
            }

            this.tick_time = 0.5
            this.StartIntervalThink(this.tick_time)
        }
        else {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/particle_sr/dragon_knight/dragon_knight_breathe_fire_burning.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(particleID, false, false, -1, false, false)
        }
    }
    BeDestroy() {

        if (IsServer()) {
            UTIL_Remove(this.GetParentPlus())
            let ability = this.GetAbilityPlus() as ability1_dragon_knight_breathe_fire

            if (GFuncEntity.IsValid(this.GetAbilityPlus())) {
                ability.burning_count = (ability.burning_count || 0) - 1
            }
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let caster = this.GetCasterPlus()
            if (!GFuncEntity.IsValid(caster)) {
                this.Destroy()
                return
            }
            let damage = caster.GetMaxHealth() * (modifier_dragon_knight_6_form.exist(caster) && this.form_burning_dps_percent || this.burning_dps_percent) * 0.01
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), this.burning_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 1)
            for (let target of (targets)) {

                if (this.iDragonLevel >= 1) {
                    modifier_dragon_knight_1_burning.apply(target, caster, this.GetAbilityPlus(), { duration: this.debuff_duration * target.GetStatusResistanceFactor(caster) })
                }
                if (this.iDragonLevel >= 5) {
                    modifier_dragon_knight_1_slow.apply(target, caster, this.GetAbilityPlus(), { duration: this.debuff_duration * target.GetStatusResistanceFactor(caster) })
                }
                if (this.iDragonLevel >= 7) {
                    modifier_dragon_knight_1_reduction.apply(target, caster, this.GetAbilityPlus(), { duration: this.debuff_duration * target.GetStatusResistanceFactor(caster) })
                }
                let tDamageTable = {
                    ability: this.GetAbilityPlus(),
                    victim: target,
                    attacker: caster,
                    damage: damage * this.tick_time,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                    eom_flags: BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_DOT,
                }
                BattleHelper.GoApplyDamage(tDamageTable)
            }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_dragon_knight_1_burning extends BaseModifier_Plus {
    debuff_dps_percent: number;
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
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
            this.StartIntervalThink(1)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_dragon_knight/dragon_knight_breathe_fire_fire_burn.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    Init(params: IModifierTable) {
        this.debuff_dps_percent = this.GetSpecialValueFor("debuff_dps_percent")
    }
    OnIntervalThink() {
        if (IsServer()) {
            let caster = this.GetCasterPlus()
            if (!GFuncEntity.IsValid(caster)) {
                this.Destroy()
                return
            }
            let damage = caster.GetMaxHealth() * this.debuff_dps_percent * 0.01
            let tDamageTable = {
                ability: this.GetAbilityPlus(),
                victim: this.GetParentPlus(),
                attacker: caster,
                damage: damage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL,
                eom_flags: BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_DOT,
            }
            BattleHelper.GoApplyDamage(tDamageTable)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_dragon_knight_1_slow extends BaseModifier_Plus {
    debuff_slow_movespeed: number;
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
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/generic_gameplay/generic_slowed_cold.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_frost.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, true, 10, false, false)
        }
    }
    Init(params: IModifierTable) {
        this.debuff_slow_movespeed = this.GetSpecialValueFor("debuff_slow_movespeed")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage(params: IModifierTable) {
        return this.debuff_slow_movespeed
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_dragon_knight_1_reduction extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BASE_PERCENTAGE)
    debuff_armor_reduction: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_BONUS)
    debuff_magic_resis_reduction: number;
    _tooltip: number;
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
    ShouldUseOverheadOffset() {
        return true
    }
    BeCreated(params: IModifierTable) {

        let hParent = this.GetParentPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_dragon_knight/dragon_knight_breathe_fire_corrosive_armor_reduction.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: hParent
            });

            this.AddParticle(iParticleID, false, false, -1, false, true)
        }
    }
    Init(params: IModifierTable) {
        let hParent = this.GetParentPlus()
        this.debuff_armor_reduction = this.GetSpecialValueFor("debuff_armor_reduction")
        this.debuff_magic_resis_reduction = this.GetSpecialValueFor("debuff_magic_resis_reduction")

    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        this._tooltip = (this._tooltip || 0) % 2 + 1
        if (this._tooltip == 1) {
            return this.debuff_armor_reduction
        } else if (this._tooltip == 2) {
            return this.debuff_magic_resis_reduction
        }
    }
}
