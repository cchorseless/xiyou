
import { GameEnum } from "../../../../GameEnum";
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
export const Data_vengefulspirit_wave_of_terror = { "ID": "5124", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySound": "Hero_VengefulSpirit.WaveOfTerror", "HasShardUpgrade": "1", "AbilityCastRange": "1400", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCooldown": "16 14 12 10", "AbilityDuration": "8", "AbilityDamage": "70 90 110 130", "AbilityManaCost": "25 30 35 40", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "wave_speed": "2000.0" }, "02": { "var_type": "FIELD_INTEGER", "wave_width": "325" }, "03": { "var_type": "FIELD_INTEGER", "armor_reduction": "-3 -4 -5 -6", "LinkedSpecialBonus": "special_bonus_unique_vengeful_spirit_4" }, "04": { "var_type": "FIELD_FLOAT", "vision_aoe": "350" }, "05": { "var_type": "FIELD_FLOAT", "vision_duration": "4" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_vengefulspirit_wave_of_terror extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "vengefulspirit_wave_of_terror";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_vengefulspirit_wave_of_terror = Data_vengefulspirit_wave_of_terror;
    Init() {
        this.SetDefaultSpecialValue("wave_speed", 2000);
        this.SetDefaultSpecialValue("wave_width", 300);
        this.SetDefaultSpecialValue("armor_reduction", [3, 4, 5, 6, 7, 8]);
        this.SetDefaultSpecialValue("armor_duration", [2, 3, 4, 5, 6, 8]);
        this.SetDefaultSpecialValue("damage", [600, 800, 1000, 1200, 1500, 2000]);
        this.SetDefaultSpecialValue("distance", 900);

    }

    Init_old() {
        this.SetDefaultSpecialValue("wave_speed", 2000);
        this.SetDefaultSpecialValue("wave_width", 300);
        this.SetDefaultSpecialValue("armor_reduction", [3, 4, 5, 6, 7, 8, 9]);
        this.SetDefaultSpecialValue("armor_duration", [2, 3, 4, 5, 6, 8]);
        this.SetDefaultSpecialValue("damage", [600, 800, 1000, 1200, 1500, 2000]);
        this.SetDefaultSpecialValue("distance", 900);

    }

    wave_speed: number;
    wave_width: number;
    nProjID: ProjectileID;

    OnSpellStart() {
        let vPosition = this.GetCursorPosition()
        this.SpellStart2(vPosition)
    }
    SpellStart2(vPosition: Vector) {
        let hCaster = this.GetCasterPlus()
        let distance = this.GetSpecialValueFor("distance") + hCaster.GetCastRangeBonus()
        this.wave_speed = this.GetSpecialValueFor("wave_speed")
        this.wave_width = this.GetSpecialValueFor("wave_width")
        let tInfo = {
            Ability: this,
            EffectName: "particles/units/heroes/hero_vengeful/vengeful_wave_of_terror.vpcf",
            vSpawnOrigin: hCaster.GetAbsOrigin(),
            fDistance: distance,
            vVelocity: ((vPosition - hCaster.GetAbsOrigin()) as Vector).Normalized() * this.wave_speed as Vector,
            fStartRadius: this.wave_width,
            fEndRadius: this.wave_width,
            Source: hCaster,
            bHasFrontalCone: false,
            bReplaceExisting: false,
            iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
            iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
            iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
            bProvidesVision: true,
            iVisionTeamNumber: this.GetCasterPlus().GetTeamNumber(),
            iVisionRadius: 0,
        }
        this.nProjID = ProjectileManager.CreateLinearProjectile(tInfo)
        hCaster.EmitSound("Hero_VengefulSpirit.WaveOfTerror")
    }
    OnProjectileHit(hTarget: BaseNpc_Plus, vLocation: Vector) {
        let hCaster = this.GetCasterPlus()
        if (GameFunc.IsValid(hTarget) && hTarget.IsAlive()) {
            let damage = this.GetSpecialValueFor("damage")
            let armor_duration = this.GetSpecialValueFor("armor_duration")
            let tDamageTable = {
                ability: this,
                attacker: hCaster,
                victim: hTarget,
                damage: damage,
                damage_type: this.GetAbilityDamageType()
            }
            let fDamage = BattleHelper.GoApplyDamage(tDamageTable)
            modifier_vengefulspirit_2_debuff.apply(hTarget, hCaster, this, { duration: armor_duration })
            if (hCaster.HasShard()) {
                modifier_vengefulspirit_2_bonus_damage.apply(hCaster, hCaster, this,
                    {
                        duration: armor_duration, bonus_damage: fDamage
                    })
            }
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_vengefulspirit_2"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
// Modifiers
@registerModifier()
export class modifier_vengefulspirit_2 extends BaseModifier_Plus {
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
            let hAbility = this.GetAbilityPlus()
            if (!GameFunc.IsValid(hAbility)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let hCaster = hAbility.GetCasterPlus()
            if (!hAbility.GetAutoCastState()) {
                return
            }

            if (hCaster.IsTempestDouble()) {
                this.StartIntervalThink(-1)
                return
            }

            if (!hAbility.IsAbilityReady()) {
                return
            }

            let start_width = hAbility.GetSpecialValueFor("wave_width")
            let end_width = hAbility.GetSpecialValueFor("wave_width")
            let range = hAbility.GetCastRange(hCaster.GetAbsOrigin(), null) + hCaster.GetCastRangeBonus()
            let vPosition = AoiHelper.GetLinearMostTargetsPosition(hCaster.GetAbsOrigin(), range, hCaster.GetTeamNumber(), start_width, end_width, null, hAbility.GetAbilityTargetTeam(), hAbility.GetAbilityTargetType(), hAbility.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_CLOSEST)
            if (vPosition && vPosition != vec3_invalid && hCaster.IsPositionInRange(vPosition, range)) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: hAbility.entindex(),
                    Position: vPosition
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_vengefulspirit_2_debuff extends BaseModifier_Plus {
    armor_reduction: number;
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
        super.OnCreated(params)
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (!GameFunc.IsValid(hCaster)) {
            return
        }
        if (!IsServer()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_vengeful/vengeful_wave_of_terror_recipient.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    Init(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (!GameFunc.IsValid(hCaster)) {
            return
        }
        this.armor_reduction = this.GetSpecialValueFor("armor_reduction") + hCaster.GetTalentValue("special_bonus_unique_vengefulspirit_custom_2")
        if (IsServer()) {
            this.IncrementStackCount()
            this.addTimer(params.duration, () => {
                this.DecrementStackCount()
            })
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    GetSTATUS_RESISTANCE_STACKING() {
        return this.GetCasterPlus().GetTalentValue("special_bonus_unique_vengefulspirit_custom_3")
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    EOM_GetModifierPhysicalArmorBonus(params: any) {
        return -this.armor_reduction * this.GetStackCount()
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    Tooltip(params: any) {
        return -this.armor_reduction * this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_vengefulspirit_2_bonus_damage extends BaseModifier_Plus {
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
    Init(params: ModifierTable) {
        if (IsServer()) {
            this.SetStackCount(params.bonus_damage || 0)
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage() {
        if (GameFunc.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().HasShard()) {
            return this.GetStackCount()
        }
        return 0
    }
}
