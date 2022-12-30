import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_jakiro_dual_breath = { "ID": "5297", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_Jakiro.DualBreath", "AbilityCastRange": "750", "AbilityCastPoint": "0.55", "AbilityCooldown": "10.0 10.0 10.0 10.0", "AbilityDuration": "5.0", "AbilityDamage": "0", "AbilityManaCost": "140 150 160 170", "AbilityModifierSupportValue": "0.25", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "start_radius": "225" }, "02": { "var_type": "FIELD_INTEGER", "end_radius": "275" }, "03": { "var_type": "FIELD_INTEGER", "range": "750 750 750 750", "LinkedSpecialBonus": "special_bonus_unique_jakiro_5" }, "04": { "var_type": "FIELD_INTEGER", "speed": "1050" }, "05": { "var_type": "FIELD_FLOAT", "fire_delay": "0.2" }, "06": { "var_type": "FIELD_INTEGER", "burn_damage": "20 40 60 80", "LinkedSpecialBonus": "special_bonus_unique_jakiro_2" }, "07": { "var_type": "FIELD_INTEGER", "slow_movement_speed_pct": "-28 -32 -36 -40" }, "08": { "var_type": "FIELD_INTEGER", "slow_attack_speed_pct": "-28 -32 -36 -40" }, "09": { "var_type": "FIELD_INTEGER", "speed_fire": "1050" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_jakiro_dual_breath extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "jakiro_dual_breath";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_jakiro_dual_breath = Data_jakiro_dual_breath;
    Init() {
        this.SetDefaultSpecialValue("scepter_amplify_all_damage", 15);
        this.SetDefaultSpecialValue("burn_damage_interval", 0.5);
        this.SetDefaultSpecialValue("start_radius", 275);
        this.SetDefaultSpecialValue("end_radius", 425);
        this.SetDefaultSpecialValue("range", 750);
        this.SetDefaultSpecialValue("speed", 1050);
        this.SetDefaultSpecialValue("fire_delay", 0.3);
        this.SetDefaultSpecialValue("burn_damage", [200, 350, 500, 800, 1100, 1700]);
        this.SetDefaultSpecialValue("slow_movement_speed_pct", 40);
        this.SetDefaultSpecialValue("duration", 5);
        this.SetDefaultSpecialValue("damage_int_factor", [5, 6, 7, 8, 10, 12]);

    }



    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        return super.GetCooldown(iLevel) - hCaster.GetTalentValue("special_bonus_unique_jakiro_custom_2")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vStartPosition = hCaster.GetAbsOrigin()
        let vTargetPosition = this.GetCursorPosition()
        if (this.GetCursorTarget()) {
            vTargetPosition = this.GetCursorTarget().GetAbsOrigin()
        }
        let fire_delay = this.GetSpecialValueFor("fire_delay")
        modifier_jakiro_1_cast.apply(hCaster, hCaster, this, { duration: fire_delay, vTargetPosition: (vTargetPosition) })
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        if (hTarget != null) {
            if (hTarget.TriggerSpellAbsorb(this)) {
                return
            }
            let hCaster = this.GetCasterPlus()
            let fire_delay = this.GetSpecialValueFor("fire_delay")
            let duration = this.GetSpecialValueFor("duration")
            let modifier = "modifier_jakiro_1_ice"
            if (ExtraData.fire == 1) { modifier = "modifier_jakiro_1_fire" }
            modifier_jakiro_1_fire.apply(hTarget, hCaster, this, { duration: duration })
        }
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_jakiro_1"
    // }

}
// // // // // // // // // // // // // // // // // // // -Modifiers// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_jakiro_1 extends BaseModifier_Plus {
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

            let hCaster = ability.GetCasterPlus()

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

            let range = ability.GetCastRange(hCaster.GetAbsOrigin(), hCaster) + hCaster.GetCastRangeBonus()
            let start_width = ability.GetSpecialValueFor("start_radius")
            let end_width = ability.GetSpecialValueFor("end_radius")

            let position = AoiHelper.GetLinearMostTargetsPosition(hCaster.GetAbsOrigin(), range, hCaster.GetTeamNumber(), start_width, end_width, null, ability.GetAbilityTargetTeam(), ability.GetAbilityTargetType(), ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_CLOSEST)

            if (position != vec3_invalid && hCaster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: position
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_jakiro_1_cast extends BaseModifier_Plus {
    end_radius: number;
    start_radius: number;
    speed: number;
    vTargetPosition: any;
    vDirection: any;
    range: number;
    info: CreateLinearProjectileOptions;
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
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            let hAbility = this.GetAbilityPlus()
            this.start_radius = this.GetSpecialValueFor("start_radius")
            this.end_radius = this.GetSpecialValueFor("end_radius")
            this.speed = this.GetSpecialValueFor("speed")
            this.range = this.GetSpecialValueFor("range") + hCaster.GetCastRangeBonus()
            this.vTargetPosition = GameFunc.VectorFunctions.StringToVector(params.vTargetPosition)
            this.vDirection = GameFunc.VectorFunctions.HorizonVector((this.vTargetPosition - hCaster.GetAbsOrigin()) as Vector)
            this.info = {
                Ability: hAbility,
                Source: hCaster,
                //  EffectName : ResHelper.GetParticleReplacement("particles/units/heroes/hero_jakiro/jakiro_dual_breath_ice.vpcf", hCaster),
                vSpawnOrigin: hCaster.GetAbsOrigin(),
                vVelocity: (this.vDirection * this.speed) as Vector,
                fDistance: this.range,
                fStartRadius: this.start_radius,
                fEndRadius: this.end_radius,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                ExtraData: {
                    fire: 0
                }
            }
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_jakiro/jakiro_dual_breath_ice.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hCaster.GetAttachmentOrigin(hCaster.ScriptLookupAttachment("attach_attack1")))
            ParticleManager.SetParticleControl(iParticleID, 1, (this.vDirection * this.speed) as Vector)
            ParticleManager.SetParticleControl(iParticleID, 3, Vector(0, 0, 0))
            ParticleManager.SetParticleControl(iParticleID, 9, hCaster.GetAttachmentOrigin(hCaster.ScriptLookupAttachment("attach_attack1")))
            hCaster.addTimer(this.range / this.speed, () => {
                ParticleManager.DestroyParticle(iParticleID, false)
            })
            ProjectileManager.CreateLinearProjectile(this.info)
            hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Jakiro.DualBreath.Cast", hCaster))
        }
    }

    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()
            this.info.EffectName = ResHelper.GetParticleReplacement("particles/units/heroes/hero_jakiro/jakiro_dual_breath_fire.vpcf", hCaster)
            this.info.ExtraData = {
                fire: 1
            }
            ProjectileManager.CreateLinearProjectile(this.info)
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_jakiro/jakiro_dual_breath_fire_launch_2.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hCaster.GetAttachmentOrigin(hCaster.ScriptLookupAttachment("attach_attack2")))
            ParticleManager.SetParticleControl(iParticleID, 1, (this.vDirection * this.speed) as Vector)
            ParticleManager.SetParticleControl(iParticleID, 9, hCaster.GetAttachmentOrigin(hCaster.ScriptLookupAttachment("attach_attack2")))
            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_jakiro_1_ice extends BaseModifier_Plus {
    slow_movement_speed_pct: number;
    scepter_amplify_all_damage: number;
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
    GetEffectName() {
        return "particles/generic_gameplay/generic_slowed_cold.vpcf"
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
    }
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    Init(params: ModifierTable) {
        this.slow_movement_speed_pct = this.GetSpecialValueFor("slow_movement_speed_pct")
        this.scepter_amplify_all_damage = this.GetSpecialValueFor("scepter_amplify_all_damage")
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage() {
        return -this.slow_movement_speed_pct
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    EOM_GetModifierIncomingDamagePercentage(params: ModifierTable) {
        if (params != null && GameFunc.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().HasScepter() && params.attacker == this.GetCasterPlus()) {
            return this.scepter_amplify_all_damage
        }
        return 0
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.scepter_amplify_all_damage
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_jakiro_1_fire extends BaseModifier_Plus {
    burn_damage: number;
    damage_int_factor: number;
    burn_damage_interval: number;
    scepter_amplify_all_damage: number;
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
    GetEffectName() {
        return "particles/units/heroes/hero_jakiro/jakiro_liquid_fire_debuff.vpcf"
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
    }
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        this.StartIntervalThink(this.burn_damage_interval)
    }
    Init(params: ModifierTable) {
        this.burn_damage = this.GetSpecialValueFor("burn_damage")
        this.damage_int_factor = this.GetSpecialValueFor("damage_int_factor")
        this.burn_damage_interval = this.GetSpecialValueFor("burn_damage_interval")
        this.scepter_amplify_all_damage = this.GetSpecialValueFor("scepter_amplify_all_damage")
    }

    OnIntervalThink() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            if (!GameFunc.IsValid(hCaster) || !hCaster.IsAlive()) {
                this.Destroy()
                return
            }
            let fDamage = (this.burn_damage + hCaster.GetIntellect() * this.damage_int_factor) * this.burn_damage_interval
            let damage_table = {
                ability: this.GetAbilityPlus(),
                attacker: hCaster,
                victim: hParent,
                damage: fDamage,
                damage_type: this.GetAbilityPlus().GetAbilityDamageType()
            }
            BattleHelper.GoApplyDamage(damage_table)
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    EOM_GetModifierIncomingDamagePercentage(params: ModifierTable) {
        if (params != null && GameFunc.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().HasScepter() && params.attacker == this.GetCasterPlus()) {
            return this.scepter_amplify_all_damage
        }
        return 0
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.scepter_amplify_all_damage
    }
}
