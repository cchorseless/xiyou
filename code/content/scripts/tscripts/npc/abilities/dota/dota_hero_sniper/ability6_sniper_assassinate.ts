import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_truesight } from "../../../modifier/modifier_truesight";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
/** dota原技能数据 */
export const Data_sniper_assassinate = { "ID": "5157", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_NORMAL_WHEN_STOLEN", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_INVULNERABLE", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "FightRecapLevel": "2", "HasScepterUpgrade": "1", "AbilitySound": "Ability.Assassinate", "AbilityDraftUltShardAbility": "sniper_concussive_grenade", "AbilityCastRange": "3000", "AbilityCastRangeBuffer": "600", "AbilityCastPoint": "2", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "20 15 10", "AbilityDamage": "320 485 650", "AbilityManaCost": "175 225 275", "AbilityModifierSupportValue": "0.0", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "projectile_speed": "2500 2500 2500" }, "02": { "var_type": "FIELD_FLOAT", "abilitycastpoint": "", "LinkedSpecialBonus": "special_bonus_unique_sniper_4", "LinkedSpecialBonusOperation": "SPECIAL_BONUS_SUBTRACT" }, "03": { "var_type": "FIELD_FLOAT", "scepter_stun_duration": "1 1.25 1.5", "RequiresScepter": "1" }, "04": { "var_type": "FIELD_FLOAT", "scepter_cast_point": "0.5", "RequiresScepter": "1" } } };

@registerAbility()
export class ability6_sniper_assassinate extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "sniper_assassinate";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_sniper_assassinate = Data_sniper_assassinate;
    Init() {
        this.SetDefaultSpecialValue("radius", 300);
        this.SetDefaultSpecialValue("target_count", [3, 3, 4, 4, 5, 5]);
        this.SetDefaultSpecialValue("inherit_attack_per", [50, 60, 70, 80, 90, 100]);

    }

    Init_old() {
        this.SetDefaultSpecialValue("radius", 300);
        this.SetDefaultSpecialValue("target_count", [3, 3, 4, 4, 5, 5]);
        this.SetDefaultSpecialValue("inherit_attack_per", [50, 60, 70, 80, 90, 100]);

    }


    GetAOERadius() {
        return this.GetSpecialValueFor("radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let radius = this.GetSpecialValueFor("radius")
        let target_count = this.GetSpecialValueFor("target_count")
        let hModifier = modifier_sniper_6.findIn(hCaster)
        if (GameFunc.IsValid(hModifier) && hModifier.targetSign == null) {
            hModifier.targetSign = []
        }
        let targets = FindUnitsInRadius(hCaster.GetTeamNumber(), vPosition, hCaster, radius, this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST, false)
        let count = 0
        for (let target of (targets)) {
            if (GameFunc.IsValid(target) && target.IsAlive()) {
                if (hModifier.targetSign != null && !hModifier.targetSign.indexOf(target)) {
                    // 添加标记
                    modifier_sniper_6_debuff.apply(target, hCaster, this, null)
                    table.insert(hModifier.targetSign, target)
                    count = count + 1
                    if (count >= target_count) {
                        break
                    }
                }
            }
        }
    }
    GetIntrinsicModifierName() {
        return "modifier_sniper_6"
    }


}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_sniper_6 extends BaseModifier_Plus {
    targetSign: any[];
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
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    On_Attack(params: ModifierAttackEvent) {
        if (params.target == null) { return }
        if (params.target.GetClassname() == "dota_item_drop") { return }

        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion() && GameFunc.IsValid(this.GetAbilityPlus())) {
            if (!BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK)) {
                let attacker = params.attacker as IBaseNpc_Plus
                if (this.targetSign != null) {
                    for (let target of (this.targetSign)) {
                        if (GameFunc.IsValid(target) && target.IsAlive() && modifier_sniper_6_debuff.exist(target)) {
                            modifier_sniper_6_projectile.apply(attacker, params.attacker, this.GetAbilityPlus(), null)
                            modifier_sniper_6_bonus_damage.apply(attacker, params.attacker, this.GetAbilityPlus(), null)
                            BattleHelper.Attack(attacker, target, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NEVERMISS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK)
                            modifier_sniper_6_projectile.remove(attacker);
                            modifier_sniper_6_bonus_damage.remove(attacker);
                        } else {
                            GameFunc.ArrayFunc.ArrayRemove(this.targetSign, target)
                        }
                    }
                }
            }
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

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()
            let radius = ability.GetAOERadius()

            let vPosition = AoiHelper.GetAOEMostTargetsPosition(caster.GetAbsOrigin(), range, caster.GetTeamNumber(), radius, null, ability.GetAbilityTargetTeam(), ability.GetAbilityTargetType(), ability.GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST)

            if (vPosition && vPosition != vec3_invalid && caster.IsPositionInRange(vPosition, range)) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: vPosition
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_sniper_6_debuff extends BaseModifier_Plus {
    modifier_truesight: IBaseModifier_Plus;
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
        return true
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsServer()) {
            this.modifier_truesight = modifier_truesight.apply(hParent, hCaster, hAbility, { duration: this.GetDuration() }) as IBaseModifier_Plus
            this.StartIntervalThink(0)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_sniper/sniper_crosshair.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: hParent
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    BeDestroy() {

        if (IsServer()) {
            if (GameFunc.IsValid(this.modifier_truesight)) {
                this.modifier_truesight.Destroy()
            }
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            if (!GameFunc.IsValid(this.GetCasterPlus()) || !GameFunc.IsValid(this.GetAbilityPlus())) {
                this.Destroy()
                return
            }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_PROVIDES_VISION]: true
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_sniper_6_projectile extends BaseModifier_Plus {
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
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_NAME)
    GetProjectileName(params: IModifierTable) {
        return ResHelper.GetParticleReplacement("particles/units/heroes/hero_sniper/sniper_assassinate.vpcf", this.GetCasterPlus())
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_sniper_6_bonus_damage extends BaseModifier_Plus {
    inherit_attack_per: number;
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
    Init(params: IModifierTable) {
        this.inherit_attack_per = this.GetSpecialValueFor("inherit_attack_per")
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    GetAttackRangeBonus(params: IModifierTable) {
        return -1
    }
    // 额外增加攻击力百分比
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    GetDamageOutgoing_Percentage(params: IModifierTable) {
        if (IsServer()) {
            let vlaue = this.GetParentPlus().HasTalent("special_bonus_unique_sniper_custom_4") && this.GetParentPlus().GetTalentValue("special_bonus_unique_sniper_custom_4") || 0
            return this.inherit_attack_per + vlaue - 100
        }
    }
}
