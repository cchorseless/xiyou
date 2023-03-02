
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_windrunner_focusfire = { "ID": "5133", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC | DOTA_UNIT_TARGET_BUILDING", "AbilityUnitTargetFlags": "DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilitySound": "Ability.Focusfire", "AbilityCastRange": "600", "AbilityCastPoint": "0", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "70 50 30", "AbilityDuration": "20.0", "AbilityManaCost": "75 100 125", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "bonus_attack_speed": "475" }, "02": { "var_type": "FIELD_INTEGER", "focusfire_damage_reduction": "-50 -40 -30", "LinkedSpecialBonus": "special_bonus_unique_windranger_8" }, "03": { "var_type": "FIELD_INTEGER", "focusfire_fire_on_the_move": "1" } } };

@registerAbility()
export class ability6_windrunner_focusfire extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "windrunner_focusfire";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_windrunner_focusfire = Data_windrunner_focusfire;
    Init() {
        this.SetDefaultSpecialValue("bonus_attack_speed", [300, 350, 400, 470, 550, 650]);
        this.SetDefaultSpecialValue("per_increase_attack_speed_limit", 20);
        this.SetDefaultSpecialValue("max_attack_speed_stack", 40);
        this.SetDefaultSpecialValue("attack_speed_limit_duration", 2);
        this.SetDefaultSpecialValue("amplify_item_damage", [50, 70, 90, 110, 130, 150]);
        this.SetDefaultSpecialValue("duration", 20);
        this.SetDefaultSpecialValue("scepter_range", 300);
        this.SetDefaultSpecialValue("split_count_scepter", 1);

    }


    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        return super.GetCooldown(iLevel) - hCaster.GetTalentValue("special_bonus_unique_windrunner_custom_8")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        let duration = this.GetSpecialValueFor("duration")
        modifier_windrunner_6_buff.remove(hCaster);
        modifier_windrunner_6_buff.apply(hCaster, hCaster, this, { duration: duration, iTargetIndex: hTarget.entindex() })

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Ability.Focusfire", hCaster))
    }
    OnProjectileHit(hTarget: IBaseNpc_Plus, vLocation: Vector) {
        if (hTarget != null) {
            let hCaster = this.GetCasterPlus()
            BattleHelper.Attack(hCaster, hTarget,
                BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN +
                BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS +
                BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE +
                BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK +
                BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)
        }
    }
    // GetIntrinsicModifierName() {
    //     return "modifier_windrunner_6"
    // }




}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_windrunner_6 extends BaseModifier_Plus {
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

            //  优先攻击目标
            let target = caster.GetAttackTarget()
            if (target != null && target.GetClassname() == "dota_item_drop") { target = null }
            if (target != null && !target.IsPositionInRange(caster.GetAbsOrigin(), range)) {
                target = null
            }

            //  搜索范围
            if (target == null) {
                let teamFilter = ability.GetAbilityTargetTeam()
                let typeFilter = ability.GetAbilityTargetType()
                let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
                let order = FindOrder.FIND_CLOSEST
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
                target = targets[1]
            }

            //  施法命令
            if (target != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                    TargetIndex: target.entindex(),
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_windrunner_6_buff extends BaseModifier_Plus {
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
    bonus_attack_speed: number;
    attack_speed_limit_duration: number;
    amplify_item_damage: number;
    scepter_range: number;
    split_count_scepter: number;
    bIsAttackTarget: boolean;
    hTarget: IBaseNpc_Plus;
    Init(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.bonus_attack_speed = this.GetSpecialValueFor("bonus_attack_speed")
        this.attack_speed_limit_duration = this.GetSpecialValueFor("attack_speed_limit_duration")
        this.amplify_item_damage = this.GetSpecialValueFor("amplify_item_damage") + hCaster.GetTalentValue("special_bonus_unique_windrunner_custom_5")
        this.scepter_range = this.GetSpecialValueFor("scepter_range")
        this.split_count_scepter = this.GetSpecialValueFor("split_count_scepter")
        if (IsServer()) {
            this.hTarget = EntIndexToHScript(params.iTargetIndex || -1) as IBaseNpc_Plus
            if (!GFuncEntity.IsValid(this.hTarget) || !this.hTarget.IsAlive()) {
                this.Destroy()
                return
            }
        }
    }
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            this.bIsAttackTarget = false
            this.hTarget = EntIndexToHScript(params.iTargetIndex || -1) as IBaseNpc_Plus
            if (!GFuncEntity.IsValid(this.hTarget) || !this.hTarget.IsAlive()) {
                this.Destroy()
                return
            }
            this.StartIntervalThink(this.GetParentPlus().TimeUntilNextAttack())
        }
        else {
            let info: ResHelper.ParticleInfo = {
                resPath: "particles/units/heroes/hero_windrunner/windrunner_focusfire_start.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            }
            let iParticleID = ResHelper.CreateParticle(info)
            ParticleManager.ReleaseParticleIndex(iParticleID);
            info = {
                resPath: "particles/units/heroes/hero_windrunner/windrunner_focusfire.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            }
            iParticleID = ResHelper.CreateParticle(info);
            ParticleManager.SetParticleControlEnt(iParticleID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControl(iParticleID, 10, Vector(1, 0, 0))
            this.AddParticle(iParticleID, false, false, -1, false, false)

        }
    }

    BeDestroy() {

        let hParent = this.GetParentPlus()
        if (IsServer()) {
            hParent.FadeGesture(GameActivity_t.ACT_DOTA_ATTACK)
        }
    }
    OnIntervalThink() {
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            if (!GFuncEntity.IsValid(this.hTarget) || !this.hTarget.IsAlive()) {
                this.Destroy()
                return
            }
            if (hParent.IsStunned()) {
                return
            }
            if (hParent.IsDisarmed()) {
                return
            }
            if (hParent.IsHexed()) {
                return
            }
            if (hParent.AttackReady() && hParent.IsAttackingEntity(this.hTarget)) {
                BattleHelper.Attack(hParent, this.hTarget)
            }
            if (!hParent.IsAttackingEntity(this.hTarget) && this.hTarget.IsPositionInRange(hParent.GetAbsOrigin(), hParent.Script_GetAttackRange())) {
                ExecuteOrderFromTable({
                    UnitIndex: hParent.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET,
                    TargetIndex: this.hTarget.entindex()
                })
            }
            this.StartIntervalThink(hParent.TimeUntilNextAttack())
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    attackRecord(params: ModifierAttackEvent) {
        this.bIsAttackTarget = false
        if (params.target == this.hTarget) {
            this.bIsAttackTarget = true
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    attackLanded(params: ModifierAttackEvent) {
        let hTarget = params.target
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (!GFuncEntity.IsValid(hTarget) || hTarget.GetClassname() == "dota_item_drop") {
            return
        }
        if (GFuncEntity.IsValid(this.hTarget)
            && this.hTarget == hTarget
            && params.attacker == hParent
            && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_windrunner/windrunner_focusfire_hit.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: params.target
            });

            ParticleManager.SetParticleControl(iParticleID, 0, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControlEnt(iParticleID, 1, params.target, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", params.target.GetAbsOrigin(), true)
            ParticleManager.ReleaseParticleIndex(iParticleID)

            modifier_windrunner_6_attack_limit.apply(hParent, hParent, hAbility, { duration: this.attack_speed_limit_duration })
            if (params.attacker.HasScepter()) {
                let count = 0
                let targets = AoiHelper.FindEntityInRadius(params.attacker.GetTeamNumber(), params.target.GetAbsOrigin(), this.scepter_range, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, 0)
                for (let target of (targets)) {
                    if (target != hTarget) {
                        let info = {
                            Ability: hAbility,
                            EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_windrunner/windrunner_base_attack.vpcf", params.attacker),
                            vSourceLoc: hTarget.GetAttachmentOrigin(hTarget.ScriptLookupAttachment("attach_hitloc")),
                            iMoveSpeed: 1250,
                            Target: target
                        }
                        ProjectileManager.CreateTrackingProjectile(info)
                        count = count + 1
                        if (count >= this.split_count_scepter) {
                            break
                        }
                    }
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_BONUS)
    GetSpellAmplifyBonus(params: ModifierAttackEvent) {
        if (params != null) {
            let hTarget = params.target
            let hAttacker = params.attacker
            let hinflictor = params.inflictor
            let hParent = this.GetParentPlus()
            if (GFuncEntity.IsValid(this.hTarget)
                && GFuncEntity.IsValid(hAttacker)
                && GFuncEntity.IsValid(hinflictor)
                && this.hTarget == hTarget
                && hAttacker == hParent
                && hinflictor.IsItem()) {
                return this.amplify_item_damage
            }
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonusConstant(params: any) {
        if (IsServer()) {
            if (this.bIsAttackTarget) {
                return this.bonus_attack_speed
            }
        } else {
            return this.bonus_attack_speed
        }
        return 0
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    activityTranslationModifiers() {
        return "focusfire"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_windrunner_6_attack_limit extends BaseModifier_Plus {
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
    per_increase_attack_speed_limit: number;
    max_attack_speed_stack: number;
    Init(params: IModifierTable) {
        this.per_increase_attack_speed_limit = this.GetSpecialValueFor("per_increase_attack_speed_limit")
        this.max_attack_speed_stack = this.GetSpecialValueFor("max_attack_speed_stack")
        if (IsServer()) {
            this.SetStackCount(math.min(this.GetStackCount() + 1, this.max_attack_speed_stack))
        }
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS)
    GetMaximumAttackSpeedBonus() {
        return this.per_increase_attack_speed_limit * this.GetStackCount()
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    Tooltip() {
        return this.per_increase_attack_speed_limit * this.GetStackCount()
    }


}