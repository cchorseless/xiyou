import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_templar_assassin_6_mark } from "./ability6_templar_assassin_psionic_trap";

/** dota原技能数据 */
export const Data_templar_assassin_meld = { "ID": "5195", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_MOVEMENT | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilitySound": "Hero_TemplarAssassin.Meld", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilityCooldown": "11 9 7 5", "AbilityDuration": "12", "AbilityManaCost": "35 40 45 50", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "bonus_damage": "80 120 160 200" }, "02": { "var_type": "FIELD_INTEGER", "bonus_armor": "-5 -6 -7 -8", "LinkedSpecialBonus": "special_bonus_unique_templar_assassin_2" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_templar_assassin_meld extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "templar_assassin_meld";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_templar_assassin_meld = Data_templar_assassin_meld;
    Init() {
        this.SetDefaultSpecialValue("bonus_attack_magnification", [1.0, 1.25, 1.5, 1.75, 2, 2.25]);
        this.SetDefaultSpecialValue("armor_reduce", [4, 6, 8, 10, 12, 14]);
        this.SetDefaultSpecialValue("armor_duration", 5);

    }

    Init_old() {
        this.SetDefaultSpecialValue("bonus_attack_magnification", [1.0, 1.25, 1.5, 1.75, 2, 2.25]);
        this.SetDefaultSpecialValue("armor_reduce", [4, 6, 8, 10, 12, 14]);
        this.SetDefaultSpecialValue("armor_duration", 5);

    }





    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        modifier_templar_assassin_2_meld.apply(hCaster, hCaster, this, null)

        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_TemplarAssassin.Meld", hCaster))
    }



    GetIntrinsicModifierName() {
        return "modifier_templar_assassin_2"
    }


}
// // // // // // // // // // // // // // // // // // // -Modifiers// // // // // // // // // // // // // // // // // // // //
@registerModifier()
export class modifier_templar_assassin_2 extends BaseModifier_Plus {
    armor_duration: number;
    bonus_attack_magnification: number;
    records: any[];
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
            this.records = []
        }
    }
    Init(params: IModifierTable) {
        this.armor_duration = this.GetSpecialValueFor("armor_duration")
        this.bonus_attack_magnification = this.GetSpecialValueFor("bonus_attack_magnification")
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROCATTACK_BONUS_DAMAGE_PHYSICAL)
    GetProcAttack_BonusDamage_Physical(params: IModifierTable) {
        let attacker = params.attacker
        if (!attacker.IsIllusion()) {
            if (this.records.indexOf(params.record) != null) {
                let coef = this.bonus_attack_magnification
                if (attacker.HasTalent("special_bonus_unique_templar_assassin_custom_4")) {
                    coef = coef + attacker.GetTalentValue("special_bonus_unique_templar_assassin_custom_4")
                }
                return params.damage * coef
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    On_AttackRecord(params: ModifierAttackEvent) {
        let attacker = params.attacker
        let target = params.target
        if (target != null && target.GetClassname() != "dota_item_drop" && attacker == this.GetParentPlus() && !attacker.IsIllusion()) {
            if (modifier_templar_assassin_6_mark.exist(target)) { // 任何攻击都可以触发陷阱攻击的首次攻击效果
                table.insert(this.records, params.record)
                modifier_templar_assassin_2_particle_templar_assassin_meld_start.apply(attacker, attacker, this.GetAbilityPlus(), { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
            } else if (modifier_templar_assassin_2_meld.exist(attacker)) {
                // 某些类型的攻击不会触发主动的buff
                if (!BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS)) {
                    table.insert(this.records, params.record)
                    modifier_templar_assassin_2_particle_templar_assassin_meld_start.apply(attacker, attacker, this.GetAbilityPlus(), { duration: BaseModifier_Plus.LOCAL_PARTICLE_MODIFIER_DURATION })
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    On_Attack(params: ModifierAttackEvent) {
        let attacker = params.attacker as IBaseNpc_Plus
        let target = params.target as IBaseNpc_Plus
        if (this.records.indexOf(params.record) && target != null && target.GetClassname() != "dota_item_drop" && attacker == this.GetParentPlus() && !attacker.IsIllusion()) {
            if (modifier_templar_assassin_6_mark.exist(target)) { // 优先消耗三技能的效果
                if (!attacker.HasTalent("special_bonus_unique_templar_assassin_custom_5")) {
                    modifier_templar_assassin_6_mark.remove(target);
                }
            } else if (modifier_templar_assassin_2_meld.exist(attacker)) {
                modifier_templar_assassin_2_meld.remove(attacker);
            }

            let i = RandomInt(1, 2)
            let attach = "attach_attack" + i
            ProjectileManager.CreateTrackingProjectile({
                Ability: this.GetAbilityPlus(),
                EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_templar_assassin/templar_assassin_meld_attack.vpcf", attacker),
                vSourceLoc: attacker.GetAttachmentOrigin(attacker.ScriptLookupAttachment(attach)),
                iMoveSpeed: attacker.GetProjectileSpeed(),
                Target: target
            })
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) { // 只在server
        let attacker = params.attacker as IBaseNpc_Plus
        let target = params.target as IBaseNpc_Plus
        if (this.records.indexOf(params.record) && attacker == this.GetParentPlus() && target != null) {
            modifier_templar_assassin_2_meld_armor.apply(target, attacker, this.GetAbilityPlus(), { duration: this.armor_duration * target.GetStatusResistanceFactor(attacker) })
            EmitSoundOnLocationWithCaster(target.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_TemplarAssassin.Meld.Attack", attacker), attacker)
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY)
    On_AttackRecordDestroy(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            GameFunc.ArrayFunc.ArrayRemove(this.records, params.record)
        }
    }
    OnIntervalThink() {
        if (!IsServer()) {
            return
        }
        let ability = this.GetAbilityPlus()
        if (!GameFunc.IsValid(ability)) {
            this.StartIntervalThink(-1)
            this.Destroy()
            return
        }

        let caster = ability.GetCasterPlus()

        if (caster.IsTempestDouble() || caster.IsIllusion()) {
            this.StartIntervalThink(-1)
            return
        }

        if (!ability.GetAutoCastState()) {
            return
        }

        if (!ability.IsAbilityReady()) {
            return
        }

        let range = caster.Script_GetAttackRange()
        let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
        let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
        let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
        let order = FindOrder.FIND_CLOSEST
        let targets = FindUnitsInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), null, range, teamFilter, typeFilter, flagFilter, order, false)
        if (targets[0] != null) {
            ExecuteOrderFromTable({
                UnitIndex: caster.entindex(),
                OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                AbilityIndex: ability.entindex()
            })
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_templar_assassin_2_meld// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_templar_assassin_2_meld extends BaseModifier_Plus {
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

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TRANSLATE_ACTIVITY_MODIFIERS)
    Get_ActivityTranslationModifiers() {
        return "meld"
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_templar_assassin_2_meld_armor// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_templar_assassin_2_meld_armor extends BaseModifier_Plus {
    armor_reduce: number;
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
        return false
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

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_templar_assassin/templar_meld_overhead.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: hParent
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 1, hParent, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, hParent.GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, true)
            iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_templar_assassin/templar_assassin_meld_armor.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    Init(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        this.armor_reduce = this.GetSpecialValueFor("armor_reduce") + hCaster.GetTalentValue("special_bonus_unique_templar_assassin_custom_8")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    G_PHYSICAL_ARMOR_BONUS() {
        return -this.armor_reduce
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_templar_assassin_2_particle_templar_assassin_meld_start extends modifier_particle {
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsClient()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_templar_assassin/templar_assassin_meld_start.vpcf",
                resNpc: hParent,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
}
