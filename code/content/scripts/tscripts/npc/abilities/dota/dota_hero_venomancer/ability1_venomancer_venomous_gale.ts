
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_poison } from "../../../modifier/effect/modifier_poison";
import { ability2_venomancer_poison_sting } from "./ability2_venomancer_poison_sting";

/** dota原技能数据 */
export const Data_venomancer_venomous_gale = { "ID": "5178", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_AOE | DOTA_ABILITY_BEHAVIOR_POINT", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_Venomancer.VenomousGale", "HasShardUpgrade": "1", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1", "AbilityCastGestureSlot": "DEFAULT", "AbilityCastRange": "800", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilityCooldown": "21 20 19 18", "AbilityManaCost": "125", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "15.0 15.0 15.0 15.0" }, "02": { "var_type": "FIELD_INTEGER", "strike_damage": "50 75 100 125" }, "03": { "var_type": "FIELD_INTEGER", "tick_damage": "15 45 75 105" }, "04": { "var_type": "FIELD_FLOAT", "tick_interval": "3.0 3.0 3.0 3.0" }, "05": { "var_type": "FIELD_INTEGER", "movement_slow": "-50 -50 -50 -50" }, "06": { "var_type": "FIELD_INTEGER", "radius": "125" }, "07": { "var_type": "FIELD_INTEGER", "speed": "1200 1200 1200 1200" } } };

@registerAbility()
export class ability1_venomancer_venomous_gale extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "venomancer_venomous_gale";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_venomancer_venomous_gale = Data_venomancer_venomous_gale;
    Init() {
        this.SetDefaultSpecialValue("base_damage", [400, 600, 1000, 1400, 2000, 3000]);
        this.SetDefaultSpecialValue("movement_slow", -40);
        this.SetDefaultSpecialValue("duration", 7);
        this.SetDefaultSpecialValue("poison_count", [200, 300, 500, 700, 1000, 1500]);
        this.SetDefaultSpecialValue("radius", 125);
        this.SetDefaultSpecialValue("speed", 1200);

    }

    Init_old() {
        this.SetDefaultSpecialValue("base_damage", [400, 600, 800, 1000, 1200, 1400]);
        this.SetDefaultSpecialValue("movement_slow", -40);
        this.SetDefaultSpecialValue("duration", 7);
        this.SetDefaultSpecialValue("poison_count", [200, 300, 400, 500, 600, 700]);
        this.SetDefaultSpecialValue("radius", 125);
        this.SetDefaultSpecialValue("speed", 1200);

    }

    GetCooldown(iLevel: number) {
        return super.GetCooldown(iLevel) - this.GetCasterPlus().GetTalentValue('special_bonus_unique_venomancer_custom_1')
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPos = this.GetCursorPosition()
        EmitSoundOnLocationWithCaster(hCaster.GetAbsOrigin(), ResHelper.GetSoundReplacement('Hero_Venomancer.VenomousGale', hCaster), hCaster)
        this.CreateLinearProjectile(hCaster.GetAttachmentOrigin(hCaster.ScriptLookupAttachment("attach_mouth")), vPos)
        //  守卫一起喷
        let hAbility2 = ability2_venomancer_poison_sting.findIn(hCaster)
        if (hAbility2 != null && hAbility2.tWards != null && hAbility2.tWards.length > 0) {
            for (let hWard of (hAbility2.tWards)) {
                if (GameFunc.IsValid(hWard) && hWard.IsAlive()) {
                    this.CreateLinearProjectile(hWard.GetAttachmentOrigin(hWard.ScriptLookupAttachment("attach_attack1")), vPos)
                }
            }
        }
    }
    CreateLinearProjectile(vStartPos: Vector, vEndPos: Vector) {
        let hCaster = this.GetCasterPlus()
        let speed = this.GetSpecialValueFor("speed")
        let radius = this.GetSpecialValueFor("radius")
        let vDirection = GameFunc.VectorFunctions.HorizonVector((vEndPos - vStartPos) as Vector)

        ProjectileManager.CreateLinearProjectile({
            Ability: this,
            Source: hCaster,
            EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_venomancer/venomancer_venomous_gale.vpcf", hCaster),
            vSpawnOrigin: vStartPos,
            vVelocity: (vDirection.Normalized() * speed) as Vector,
            fDistance: this.GetCastRange(hCaster.GetAbsOrigin(), hCaster) + hCaster.GetCastRangeBonus(),  // 最大距离等于施法距离
            fStartRadius: radius,
            fEndRadius: radius,
            iUnitTargetTeam: this.GetAbilityTargetTeam(),
            iUnitTargetType: this.GetAbilityTargetType(),
            iUnitTargetFlags: this.GetAbilityTargetFlags(),
        })
    }
    OnProjectileHit(hTarget: IBaseNpc_Plus, vLocation: Vector) {
        if (!GameFunc.IsValid(hTarget)) { return }

        let hCaster = this.GetCasterPlus()
        let base_damage = this.GetSpecialValueFor("base_damage")
        let duration = this.GetSpecialValueFor("duration")
        let poison_count = this.GetSpecialValueFor("poison_count")

        BattleHelper.GoApplyDamage({
            ability: this,
            attacker: hCaster,
            victim: hTarget,
            damage: base_damage,
            damage_type: this.GetAbilityDamageType()
        })

        EmitSoundOnLocationWithCaster(vLocation, ResHelper.GetSoundReplacement("Hero_Venomancer.VenomousGaleImpact", hCaster), hCaster)

        modifier_poison.Poison(hTarget, hCaster, this, poison_count)
        modifier_venomancer_1_projectile_debuff.apply(hTarget, hCaster, this, { duration: duration * hTarget.GetStatusResistanceFactor(hCaster) })
    }
    GetIntrinsicModifierName() {
        return "modifier_venomancer_1"
    }

}
// // // // // // // // // // // // // // // // // // // -modifier_venomancer_1// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_venomancer_1 extends BaseModifier_Plus {
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
        if (!IsServer()) {
            return
        }
        let hAbility = this.GetAbilityPlus()
        if (!GameFunc.IsValid(hAbility)) {
            this.StartIntervalThink(-1)
            this.Destroy()
            return
        }

        let hCaster = hAbility.GetCasterPlus()

        if (hCaster.IsTempestDouble() || hCaster.IsIllusion()) {
            this.StartIntervalThink(-1)
            return
        }

        if (!hAbility.GetAutoCastState()) {
            return
        }

        if (!hAbility.IsAbilityReady()) {
            return
        }

        let fRange = hAbility.GetCastRange(hCaster.GetAbsOrigin(), hCaster) + hCaster.GetCastRangeBonus()
        let teamFilter = hAbility.GetAbilityTargetTeam()
        let typeFilter = hAbility.GetAbilityTargetType()
        let flagFilter = hAbility.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE

        let vPos = AoiHelper.GetLinearMostTargetsPosition(
            hCaster.GetAbsOrigin(),
            fRange,
            hCaster.GetTeamNumber(),
            hAbility.GetSpecialValueFor("radius"),
            hAbility.GetSpecialValueFor("radius"),
            null,
            hAbility.GetAbilityTargetTeam(),
            hAbility.GetAbilityTargetType(),
            hAbility.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE,
            FindOrder.FIND_ANY_ORDER
        )

        if (vPos != vec3_invalid && hCaster.IsPositionInRange(vPos, fRange)) {
            ExecuteOrderFromTable({
                UnitIndex: hCaster.entindex(),
                OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                AbilityIndex: hAbility.entindex(),
                Position: vPos,
            })
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_venomancer_1_projectile_debuff// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_venomancer_1_projectile_debuff extends BaseModifier_Plus {
    movement_slow: any;
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

    Init(params: IModifierTable) {
        this.movement_slow = this.GetSpecialValueFor("movement_slow")
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage() {
        return this.movement_slow
    }
}
