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
export const Data_jakiro_macropyre = { "ID": "5300", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "2", "AbilitySound": "Hero_Jakiro.Macropyre.Cast", "HasScepterUpgrade": "1", "AbilityDraftUltShardAbility": "jakiro_liquid_ice", "AbilityCastRange": "1400", "AbilityCastPoint": "0.55", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "60 60 60", "AbilityManaCost": "220 330 440", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "damage": "100 140 180", "LinkedSpecialBonus": "special_bonus_unique_jakiro_7" }, "02": { "var_type": "FIELD_INTEGER", "cast_range": "1400" }, "03": { "var_type": "FIELD_INTEGER", "path_radius": "260" }, "04": { "var_type": "FIELD_INTEGER", "duration": "10" }, "05": { "var_type": "FIELD_FLOAT", "burn_interval": "0.5 0.5 0.5" }, "06": { "var_type": "FIELD_FLOAT", "linger_duration": "2" }, "07": { "var_type": "FIELD_INTEGER", "scepter_bonus_range": "400", "RequiresScepter": "1" }, "08": { "var_type": "FIELD_FLOAT", "scepter_bonus_duration": "20", "RequiresScepter": "1" } } };

@registerAbility()
export class ability6_jakiro_macropyre extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "jakiro_macropyre";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_jakiro_macropyre = Data_jakiro_macropyre;
    Init() {
        this.SetDefaultSpecialValue("damage", [400, 700, 1000, 1500, 2000, 3000]);
        this.SetDefaultSpecialValue("damage_int_factor", [10, 12, 14, 16, 20, 25]);
        this.SetDefaultSpecialValue("path_radius", 260);
        this.SetDefaultSpecialValue("duration", 10);
        this.SetDefaultSpecialValue("burn_interval", 0.5);
        this.SetDefaultSpecialValue("bonus_duration", 2);

    }


    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vStartPosition = hCaster.GetAbsOrigin()
        let vTargetPosition = this.GetCursorPosition()
        let duration = this.GetSpecialValueFor("duration")
        let fissure_range = this.GetCastRange(hCaster.GetAbsOrigin(), null) + hCaster.GetCastRangeBonus()
        let distance_between_blocker = 24
        let blocker_collision = 24
        let vDirection = (vTargetPosition - vStartPosition) as Vector
        vDirection.z = 0
        vStartPosition = GetGroundPosition((vStartPosition + vDirection.Normalized() * distance_between_blocker * 2) as Vector, hCaster)
        vTargetPosition = GetGroundPosition((vStartPosition + vDirection.Normalized() * (fissure_range - distance_between_blocker * 2)) as Vector, hCaster)
        modifier_jakiro_6_thinker.applyThinker(((vStartPosition + vTargetPosition) / 2) as Vector, hCaster, this, {
            duration: duration,
            vStartPosition: GameFunc.VectorFunctions.VectorToString(vStartPosition),
            vTargetPosition: GameFunc.VectorFunctions.VectorToString(vTargetPosition),
        }, hCaster.GetTeamNumber(), false)
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Jakiro.Macropyre.Cast", hCaster))
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_jakiro_6"
    // }

}
// // // // // // // // // // // // // // // // // // // -Modifiers// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_jakiro_6 extends BaseModifier_Plus {
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
            let start_width = ability.GetSpecialValueFor("path_radius")
            let end_width = ability.GetSpecialValueFor("path_radius")

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
export class modifier_jakiro_6_thinker extends BaseModifier_Plus {
    bonus_duration: any;
    path_range: any;
    path_radius: number;
    duration: number;
    vStartPosition: Vector;
    vTargetPosition: Vector;
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
    GetAuraRadius() {
        return this.path_range
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE
    }
    GetAuraDuration() {
        return this.bonus_duration
    }
    GetAura() {
        return "modifier_jakiro_6_burn_debuff"
    }
    GetAuraEntityReject(hTarget: IBaseNpc_Plus) {
        if (CalcDistanceToLineSegment2D(hTarget.GetAbsOrigin(), this.vStartPosition, this.vTargetPosition) <= this.path_radius + hTarget.GetHullRadius()) {
            return false
        }
        return true
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.path_radius = this.GetSpecialValueFor("path_radius")
        this.duration = this.GetSpecialValueFor("duration")
        this.bonus_duration = this.GetSpecialValueFor("bonus_duration")
        this.path_range = this.GetAbilityPlus().GetCastRange(hCaster.GetAbsOrigin(), null) + hCaster.GetCastRangeBonus()

        if (IsServer()) {
            this.vStartPosition = GameFunc.VectorFunctions.StringToVector(params.vStartPosition)
            this.vTargetPosition = GameFunc.VectorFunctions.StringToVector(params.vTargetPosition)
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_jakiro/jakiro_macropyre.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: null
            });

            ParticleManager.SetParticleControl(iParticleID, 0, this.vStartPosition)
            ParticleManager.SetParticleControl(iParticleID, 1, this.vTargetPosition)
            ParticleManager.SetParticleControl(iParticleID, 2, Vector(this.duration, 0, 0))
            this.AddParticle(iParticleID, false, false, -1, false, false)
            hCaster.EmitSound(ResHelper.GetSoundReplacement("hero_jakiro.macropyre", hCaster))
        }
    }
    OnDestroy() {
        super.OnDestroy();
        let hParent = this.GetParentPlus()
        let hCaster = this.GetCasterPlus()
        if (IsServer()) {
            if (GameFunc.IsValid(hParent)) {
                UTIL_Remove(hParent)
            }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_FLYING_FOR_PATHING_PURPOSES_ONLY]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_jakiro_6_burn_debuff extends BaseModifier_Plus {
    burn_interval: number;
    damage_int_factor: number;
    damage: number;
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
    GetEffectName() {
        return "particles/units/heroes/hero_jakiro/jakiro_liquid_fire_debuff.vpcf"
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(this.burn_interval)
        }
    }
    Init(params: ModifierTable) {
        this.damage = this.GetSpecialValueFor("damage")
        this.damage_int_factor = this.GetSpecialValueFor("damage_int_factor")
        this.burn_interval = this.GetSpecialValueFor("burn_interval")
    }

    OnIntervalThink() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsServer()) {
            if (!GameFunc.IsValid(hCaster) || !hCaster.IsAlive() || !GameFunc.IsValid(hAbility)) {
                this.Destroy()
                return
            }
            let fDamage = this.damage + hCaster.GetIntellect() * this.damage_int_factor
            let damage_table =
            {
                ability: hAbility,
                attacker: hCaster,
                victim: hParent,
                damage: fDamage * this.burn_interval,
                damage_type: hAbility.GetAbilityDamageType()
            }
            BattleHelper.GoApplyDamage(damage_table)
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    EOM_GetModifierIncomingDamagePercentage(params: ModifierTable) {
        if (params != null && GameFunc.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().IsAlive() && params.attacker == this.GetCasterPlus()) {
            return this.GetCasterPlus().GetTalentValue("special_bonus_unique_jakiro_custom_8")
        }
    }
}
