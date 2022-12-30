import { GameFunc } from "../../../../GameFunc";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_enchantress_impetus = { "ID": "5270", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AUTOCAST | DOTA_ABILITY_BEHAVIOR_ATTACK", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "AbilityUnitDamageType": "DAMAGE_TYPE_PURE", "FightRecapLevel": "1", "AbilitySound": "Hero_Enchantress.Impetus", "AbilityCastRange": "575", "AbilityCastPoint": "0.0 0.0 0.0", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "6 4 2 0", "AbilityDuration": "1.5 1.5 1.5", "AbilityManaCost": "65", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "distance_damage_pct": "8 12 16 20", "LinkedSpecialBonus": "special_bonus_unique_enchantress_4" }, "02": { "var_type": "FIELD_INTEGER", "distance_cap": "1750" } } };

@registerAbility()
export class ability1_enchantress_impetus extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "enchantress_impetus";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_enchantress_impetus = Data_enchantress_impetus;
    Init() {
        this.SetDefaultSpecialValue("int_coef", [1, 2, 3, 4, 5, 6]);
        this.SetDefaultSpecialValue("distance_coef", [0.3, 0.36, 0.42, 0.48, 0.54, 0.6]);

    }

    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        return this.GetCasterPlus().Script_GetAttackRange()
    }

    GetIntrinsicModifierName() {
        return modifier_enchantress_1.name
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_enchantress_1 extends BaseModifier_Plus {
    int_coef: number;
    distance_coef: number;
    records: any[];
    private _scepter_records: any[];
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
            this.records = []
            this._scepter_records = []
        }
    }
    Init(params: ModifierTable) {
        this.int_coef = this.GetSpecialValueFor("int_coef")
        this.distance_coef = this.GetSpecialValueFor("distance_coef")
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    On_AttackStart(params: ModifierAttackEvent) {
        let hTarget = params.target
        if (hTarget == null || hTarget.GetClassname() == "dota_item_drop") {
            return
        }
        let hAbility = this.GetAbilityPlus()
        let hParent = this.GetParentPlus()
        if (!hParent.IsIllusion() && !hParent.IsSilenced()) {
            if ((hParent.GetCurrentActiveAbility() == hAbility ||
                hAbility.GetAutoCastState()) &&
                hAbility.IsCooldownReady() &&
                hAbility.IsOwnersManaEnough() &&
                hAbility.CastFilterResult() == UnitFilterResult.UF_SUCCESS
            ) {
                if (!modifier_enchantress_1_projectile.exist(hParent)) {
                    modifier_enchantress_1_projectile.apply(hParent, hParent, hAbility, null)
                }
            }
        }
        else {
            modifier_enchantress_1_projectile.remove(hParent);
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    On_AttackRecord(params: ModifierAttackEvent) {
        let hTarget = params.target
        if (hTarget == null || hTarget.GetClassname() == "dota_item_drop") {
            return
        }
        let hAbility = this.GetAbilityPlus()
        let hParent = this.GetParentPlus()
        if (!hParent.IsIllusion() && !hParent.IsSilenced()) {
            if ((hParent.GetCurrentActiveAbility() == hAbility || hAbility.GetAutoCastState()) && hAbility.IsCooldownReady() && hAbility.IsOwnersManaEnough()) {
                if (hAbility.CastFilterResult() == UnitFilterResult.UF_SUCCESS) {
                    table.insert(this.records, params.record)
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    On_Attack(params: ModifierAttackEvent) {
        if (this.records.indexOf(params.record) != null) {
            let hParent = this.GetParentPlus()
            let hCaster = this.GetCasterPlus()
            let hTarget = params.target
            if (!modifier_enchantress_1_sound_cd.exist(hParent)) {
                EmitSoundOnLocationWithCaster(hParent.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Enchantress.Impetus", hCaster), hCaster)
                modifier_enchantress_1_sound_cd.apply(hParent, hCaster, this.GetAbilityPlus(), { duration: 0.2 })
            }
            this.GetAbilityPlus().UseResources(true, true, true)
            if (!BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK)) {
                let iExtraCount = hCaster.GetTalentValue("special_bonus_unique_enchantress_custom_6")
                if (iExtraCount > 0) {
                    let n = 0
                    let tTargets = AoiHelper.FindEntityInRadius(hParent.GetTeamNumber(), hParent.GetAbsOrigin(), hParent.Script_GetAttackRange() + params.attacker.GetHullRadius(), null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_ANY_ORDER)
                    //  攻击范围内离攻击目标最近的单位
                    let cal_distance = (hUnit: IBaseNpc_Plus) => {
                        return ((hTarget.GetAbsOrigin() - hUnit.GetAbsOrigin()) as Vector).Length2D()
                    }
                    table.sort(tTargets, (hUnit_a, hUnit_b) => {
                        return cal_distance(hUnit_a) < cal_distance(hUnit_b)
                    })
                    for (let hTarget of (tTargets)) {

                        if (hTarget != params.target) {
                            let iAttackState = BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING
                            BattleHelper.Attack(params.attacker, hTarget, iAttackState)
                            n = n + 1
                            if (n >= iExtraCount) {
                                break
                            }
                        }
                    }
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (this.records.indexOf(params.record) != null) {
            let hTarget = params.target
            let hParent = this.GetParentPlus()
            let fDistance = ((hTarget.GetAbsOrigin() - hParent.GetAbsOrigin()) as Vector).Length2D()
            //  跃动的攻击视为从最大攻击距离攻击
            if (fDistance < hParent.Script_GetAttackRange()) {
                if (this._scepter_records.indexOf(params.record)) {
                    fDistance = hParent.Script_GetAttackRange()
                }
            }
            let int_coef = this.int_coef + this.GetCasterPlus().GetTalentValue("special_bonus_unique_enchantress_custom_5")
            let distance_coef = this.distance_coef + this.GetCasterPlus().GetTalentValue("special_bonus_unique_enchantress_custom_7")
            let fDamage = hParent.GetIntellect() * int_coef * fDistance * distance_coef / 100
            BattleHelper.GoApplyDamage({
                ability: this.GetAbilityPlus(),
                attacker: this.GetParentPlus(),
                victim: hTarget,
                damage: fDamage,
                damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                eom_flags: BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_SHOW_DAMAGE_NUMBER,
            })
            EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_Enchantress.ImpetusDamage", this.GetCasterPlus()), this.GetCasterPlus())
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY)
    On_AttackRecordDestroy(params: ModifierAttackEvent) {
        GameFunc.ArrayFunc.ArrayRemove(this.records, params.record)
        GameFunc.ArrayFunc.ArrayRemove(this._scepter_records, params.record)
    }
}

// // // // // // // // // // // // // // // // // // // -modifier_enchantress_1_projectile// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_enchantress_1_projectile extends BaseModifier_Plus {
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
    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_ULTRA
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PROJECTILE_NAME)
    GetProjectileName(params: ModifierTable) {
        return ResHelper.GetParticleReplacement("particles/units/heroes/hero_enchantress/enchantress_impetus.vpcf", this.GetCasterPlus())
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_enchantress_1_sound_cd// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_enchantress_1_sound_cd extends BaseModifier_Plus {
    IsHidden() {
        return true
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
}

