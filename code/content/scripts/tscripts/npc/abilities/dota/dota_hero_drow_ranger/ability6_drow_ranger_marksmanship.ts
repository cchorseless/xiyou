import { GameFunc } from "../../../../GameFunc";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_drow_ranger_marksmanship = { "ID": "5022", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityCastRange": "400", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "HasScepterUpgrade": "1", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "chance": "20 30 40", "LinkedSpecialBonus": "special_bonus_unique_drow_ranger_3" }, "02": { "var_type": "FIELD_INTEGER", "bonus_damage": "50 70 90", "CalculateSpellDamageTooltip": "0" }, "03": { "var_type": "FIELD_INTEGER", "agility_multiplier": "25 35 45" }, "04": { "var_type": "FIELD_INTEGER", "agility_range": "1200" }, "05": { "var_type": "FIELD_INTEGER", "split_count_scepter": "2", "RequiresScepter": "1" }, "06": { "var_type": "FIELD_INTEGER", "scepter_range": "375", "RequiresScepter": "1" }, "07": { "var_type": "FIELD_INTEGER", "damage_reduction_scepter": "50", "RequiresScepter": "1", "CalculateSpellDamageTooltip": "0" }, "08": { "var_type": "FIELD_INTEGER", "disable_range": "400" } } };

@registerAbility()
export class ability6_drow_ranger_marksmanship extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "drow_ranger_marksmanship";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_drow_ranger_marksmanship = Data_drow_ranger_marksmanship;
    Init() {
        this.SetDefaultSpecialValue("chance", 40);
        this.SetDefaultSpecialValue("bonus_damage", [300, 500, 700, 900, 1200, 1400]);
        this.SetDefaultSpecialValue("split_count_scepter", 2);
        this.SetDefaultSpecialValue("scepter_range", 350);

    }


    OnProjectileHit(hTarget: IBaseNpc_Plus, vLocation: Vector) {
        if (hTarget != null) {
            let caster = this.GetCasterPlus()
            let modifier = modifier_drow_ranger_6.findIn(caster)
            if (IsValid(modifier)) {
                modifier.split_attack = true
                BattleHelper.Attack(caster, hTarget, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)
                modifier.split_attack = null
            }
        }
    }
    // GetIntrinsicModifierName() {
    //     return "modifier_drow_ranger_6"
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_drow_ranger_6 extends BaseModifier_Plus {
    chance: number;
    bonus_damage: number;
    scepter_range: number;
    split_count_scepter: number;
    records: any[];
    split_attack: boolean;
    start: boolean;
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
            this.records = []
        } else {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_drow/drow_marksmanship.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControl(particleID, 2, Vector(2, 0, 0))
            this.AddParticle(particleID, false, false, -1, false, false)
            particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_drow/drow_marksmanship_start.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.ReleaseParticleIndex(particleID)
        }
    }
    Init(params: IModifierTable) {
        let hCaster = this.GetCasterPlus()
        this.chance = this.GetSpecialValueFor("chance")
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage")
        this.scepter_range = this.GetSpecialValueFor("scepter_range")
        this.split_count_scepter = this.GetSpecialValueFor("split_count_scepter")
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

    On_AttackStart_AttackSystem(params: ModifierAttackEvent) {
        this.On_AttackStart(params)
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    On_AttackStart(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            this.start = true
            let sTalentName = "special_bonus_unique_drow_ranger_custom_3"
            let chance = this.chance + (params.attacker as IBaseNpc_Plus).GetTalentValue(sTalentName)
            if (GFuncMath.PRD(chance, params.attacker, "drow_ranger_3") && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                modifier_drow_ranger_6_projectile.apply(params.attacker, params.attacker, this.GetAbilityPlus(), null)
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    On_AttackRecord(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        let attacker = params.attacker as IBaseNpc_Plus
        if (attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            let sTalentName = "special_bonus_unique_drow_ranger_custom_3"
            let chance = this.chance + attacker.GetTalentValue(sTalentName)
            if (this.start && modifier_drow_ranger_6_projectile.exist(params.attacker)) {
                table.insert(this.records, params.record)
            } else if (!this.start && GFuncMath.PRD(chance, params.attacker, "drow_ranger_3") && UnitFilter(params.target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, params.attacker.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                table.insert(this.records, params.record)
            }
            modifier_drow_ranger_6_projectile.remove(params.attacker);
            this.start = false
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: IModifierTable) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (!params.attacker.IsIllusion()) {
            if (this.records.indexOf(params.record) != -1) {
                return this.bonus_damage
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.IGNORE_PHYSICAL_ARMOR_PERCENTAGE)
    CC_GetModifierIgnorePhysicalArmorPercentage(params: IModifierTable) {
        if (params == null || params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            if (this.records.indexOf(params.record) != -1) {
                EmitSoundOnLocationWithCaster(params.target.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_DrowRanger.Marksmanship.Target", params.attacker), params.attacker)
                return 100
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && params.attacker.HasScepter() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK) && !this.GetParentPlus().PassivesDisabled()) {
            let count = 0
            let targets = AoiHelper.FindEntityInRadius(params.attacker.GetTeamNumber(), params.target.GetAbsOrigin(), this.scepter_range, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, 0)
            for (let target of (targets)) {
                if (target != params.target) {
                    let info = {
                        Ability: this.GetAbilityPlus(),
                        EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_drow/drow_base_attack.vpcf", params.attacker),
                        vSourceLoc: params.target.GetAttachmentOrigin(params.target.ScriptLookupAttachment("attach_hitloc")),
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
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_drow_ranger_6_projectile extends BaseModifier_Plus {
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
        return modifierpriority.MODIFIER_PRIORITY_HIGH
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_NAME)
    GetProjectileName(params: IModifierTable) {
        return ResHelper.GetParticleReplacement("particles/units/heroes/hero_drow/drow_marksmanship_attack.vpcf", this.GetCasterPlus())
    }
}
