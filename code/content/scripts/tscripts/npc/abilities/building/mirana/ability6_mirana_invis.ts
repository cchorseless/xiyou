
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_mirana_3_buff } from "./ability3_mirana_leap";

/** dota原技能数据 */
export const Data_mirana_invis = { "ID": "5049", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "SpellImmunityType": "SPELL_IMMUNITY_ALLIES_YES", "FightRecapLevel": "2", "AbilitySound": "Ability.MoonlightShadow", "AbilityCastRange": "0", "AbilityCastPoint": "0.5 0.5 0.5", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "140.0 120.0 100.0", "AbilityManaCost": "125", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "fade_delay": "2.5 2.0 1.5" }, "02": { "var_type": "FIELD_FLOAT", "duration": "18.0", "LinkedSpecialBonus": "special_bonus_unique_mirana_5" }, "03": { "var_type": "FIELD_INTEGER", "bonus_movement_speed": "9 12 15" } } };

@registerAbility()
export class ability6_mirana_invis extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "mirana_invis";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_mirana_invis = Data_mirana_invis;
    Init() {
        this.SetDefaultSpecialValue("arrow_speed", 1200);
        this.SetDefaultSpecialValue("arrow_count", [5, 6, 7, 8, 9, 10]);
        this.SetDefaultSpecialValue("arrow_stun", [2, 2.5, 3, 3.5, 4, 4.5]);
        this.SetDefaultSpecialValue("arrow_chance", 15);
        this.SetDefaultSpecialValue("bonus_damage", 30);

    }

    Init_old() {
        this.SetDefaultSpecialValue("arrow_speed", 1200);
        this.SetDefaultSpecialValue("arrow_count", [5, 6, 7, 8, 9, 10]);
        this.SetDefaultSpecialValue("arrow_stun", [2, 2.5, 3, 3.5, 4, 4.5]);
        this.SetDefaultSpecialValue("arrow_chance", 15);
        this.SetDefaultSpecialValue("bonus_damage", 30);

    }


    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let arrow_count = this.GetSpecialValueFor("arrow_count")
        let iRange = this.GetCastRange(hCaster.GetAbsOrigin(), hCaster)

        let tTargets = AoiHelper.FindEntityInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), iRange, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST)
        let n = 0;
        for (let hUnit of (tTargets)) {
            this.Arrow(hUnit)
            n += 1;
            if (n >= arrow_count) {
                break
            }
        }

        hCaster.EmitSound("Hero_Mirana.ArrowCast")
    }
    Arrow(hTarget: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let arrow_speed = this.GetSpecialValueFor("arrow_speed")
        let arrow_stun = this.GetSpecialValueFor("arrow_stun")
        let iExtraDamage = hCaster.HasTalent("special_bonus_unique_mirana_custom_5") && hCaster.GetTalentValue("special_bonus_unique_mirana_custom_5") || 0
        let iDamage = this.GetAbilityDamage() + iExtraDamage * hCaster.GetAgility()
        let tInfo: CreateTrackingProjectileOptions = {
            EffectName: "particles/units/heroes/hero_mirana/mirana_spell_arrow_tracking.vpcf",
            Ability: this,
            iMoveSpeed: arrow_speed,
            Source: hCaster,
            Target: hTarget,
            iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_ATTACK_1,
            vSourceLoc: hCaster.GetAttachmentOrigin(DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_ATTACK_1),
            ExtraData: {
                iDamage: iDamage,
                iDuration: arrow_stun
            }
        }
        ProjectileManager.CreateTrackingProjectile(tInfo)
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        if (GameFunc.IsValid(hTarget)) {
            if (hTarget.IsMagicImmune && !hTarget.IsMagicImmune()) {
                modifier_mirana_6_stun.apply(hTarget, this.GetCasterPlus(), this, { duration: ExtraData.iDuration * hTarget.GetStatusResistanceFactor(this.GetCasterPlus()) })
                EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), "Hero_Mirana.ArrowImpact", this.GetCasterPlus())
                let damage_table = {
                    ability: this,
                    attacker: this.GetCasterPlus(),
                    victim: hTarget,
                    damage: ExtraData.iDamage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL
                }
                BattleHelper.GoApplyDamage(damage_table)
            }
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_mirana_6"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_mirana_6 extends BaseModifier_Plus {
    arrow_chance: number;
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

        this.arrow_chance = this.GetSpecialValueFor("arrow_chance")
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
            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster)
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets.length > 0) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex()
                })
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    On_Attack(params: ModifierAttackEvent) {
        let hParent = this.GetParentPlus()
        if (params.attacker == this.GetParentPlus() && modifier_mirana_3_buff.exist(hParent) && !hParent.IsIllusion()) {
            if (!BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)) {
                if (GameFunc.mathUtil.PRD(this.arrow_chance, params.attacker, "modifier_mirana_6")) {
                    (this.GetAbilityPlus() as ability6_mirana_invis).Arrow(params.target)
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_mirana_6_stun extends BaseModifier_Plus {
    bonus_damage: number;
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
        return true
    }
    AllowIllusionDuplicate() {
        return false
    }
    BeCreated(params: IModifierTable) {

        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/generic_gameplay/generic_stunned.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    Init(params: IModifierTable) {
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage")
    }

    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_DISABLED
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamagePercentage(params: IModifierTable) {
        let hParent = this.GetParentPlus()
        let hCaster = this.GetCasterPlus()
        if (params.target == hParent && params.attacker == hCaster && modifier_mirana_3_buff.exist(hCaster)) {
            return this.bonus_damage
        }
    }
}
