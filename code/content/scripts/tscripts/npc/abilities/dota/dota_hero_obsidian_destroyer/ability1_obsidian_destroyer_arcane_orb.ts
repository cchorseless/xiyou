import { GameFunc } from "../../../../GameFunc";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { ability3_obsidian_destroyer_equilibrium, modifier_obsidian_destroyer_3 } from "./ability3_obsidian_destroyer_equilibrium";

/** dota原技能数据 */
export const Data_obsidian_destroyer_arcane_orb = { "ID": "5391", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AUTOCAST | DOTA_ABILITY_BEHAVIOR_ATTACK", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_PURE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilitySound": "Hero_ObsidianDestroyer.ArcaneOrb", "AbilityCastRange": "450", "AbilityManaCost": "0", "AbilityCooldown": "6 4 2 0", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "mana_pool_damage_pct": "16", "LinkedSpecialBonus": "special_bonus_unique_outworld_devourer" }, "02": { "var_type": "FIELD_FLOAT", "mana_cost_percentage": "20" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_obsidian_destroyer_arcane_orb extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "obsidian_destroyer_arcane_orb";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_obsidian_destroyer_arcane_orb = Data_obsidian_destroyer_arcane_orb;
    Init() {
        this.SetDefaultSpecialValue("mana_pool_damage_pct", [20, 25, 30, 35, 40, 50]);
        this.SetDefaultSpecialValue("essence_energy", 1);
        this.SetDefaultSpecialValue("radius", 225);
        this.SetDefaultSpecialValue("mana_cost_percent", [1.5, 2.0, 2.5, 3.0, 3.5, 4.0]);
        this.SetDefaultSpecialValue("extra_count", 3);

    }

    Init_old() {
        this.SetDefaultSpecialValue("mana_pool_damage_pct", [10, 11, 12, 13, 14, 15]);
        this.SetDefaultSpecialValue("essence_energy", 1);
        this.SetDefaultSpecialValue("radius", 225);

    }



    GetManaCost(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        if (iLevel == -1) {
            return hCaster.GetMaxMana() * this.GetSpecialValueFor("mana_cost_percent") * 0.01
        }
        return hCaster.GetMaxMana() * this.GetLevelSpecialValueFor("mana_cost_percent", iLevel) * 0.01
    }

    GetIntrinsicModifierName() {
        return "modifier_obsidian_destroyer_1"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_obsidian_destroyer_1 extends BaseModifier_Plus {
    mana_pool_damage_pct: number;
    int_steal_duration: number;
    radius: number;
    essence_energy: number;
    extra_count: number;
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
    Init(params: IModifierTable) {
        let hParent = this.GetParentPlus()
        this.mana_pool_damage_pct = this.GetSpecialValueFor("mana_pool_damage_pct")
        this.int_steal_duration = this.GetSpecialValueFor("int_steal_duration")
        this.radius = this.GetSpecialValueFor("radius")
        this.essence_energy = this.GetSpecialValueFor("essence_energy")
        this.extra_count = this.GetSpecialValueFor("extra_count")
        if (IsServer() && params.IsOnCreated) {
            this.records = []
        }
    }


    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    On_AttackStart(params: ModifierAttackEvent) {
        let hParent = this.GetParentPlus()
        let hTarget = params.target
        let hAbility = this.GetAbilityPlus()

        if (!(IsValid(hTarget) && hTarget.GetClassname() != "dota_item_drop" && hAbility.CastFilterResult() == UnitFilterResult.UF_SUCCESS)) {
            return
        }
        if (hParent.IsIllusion() || hParent.IsSilenced()) {
            return
        }
        if (!((hParent.GetCurrentActiveAbility() == hAbility || hAbility.GetAutoCastState()) && hAbility.IsCooldownReady() && hAbility.IsOwnersManaEnough())) {
            return
        }
        let hBuff = modifier_obsidian_destroyer_1_projectile.apply(hParent, hParent, hAbility)
        if (IsValid(hBuff)) {
            print("add success")
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    On_AttackRecord(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            modifier_obsidian_destroyer_1_projectile.remove(params.attacker);
            print("RemoveModifierByName")
            if ((this.GetParentPlus().GetCurrentActiveAbility() == this.GetAbilityPlus() || this.GetAbilityPlus().GetAutoCastState()) && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS) && !this.GetParentPlus().IsSilenced() && this.GetAbilityPlus().IsCooldownReady() && this.GetAbilityPlus().IsOwnersManaEnough() && this.GetAbilityPlus().CastFilterResult() == UnitFilterResult.UF_SUCCESS) {
                table.insert(this.records, params.record)
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    On_Attack(params: ModifierAttackEvent) {
        let hParent = this.GetParentPlus()
        let hTarget = params.target
        if (!IsValid(hTarget) || hTarget.GetClassname() == "dota_item_drop") { return }

        if (!params.attacker.IsIllusion() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS)) {
            if (this.records.indexOf(params.record) != null) {
                params.attacker.EmitSound(ResHelper.GetSoundReplacement("Hero_ObsidianDestroyer.ArcaneOrb", params.attacker))
                this.GetAbilityPlus().UseResources(true, true, true)

                let hAbility_4 = ability3_obsidian_destroyer_equilibrium.findIn(this.GetParentPlus())
                if (hAbility_4 && hAbility_4.GetLevel() >= 1) {
                    let chance = hAbility_4.GetSpecialValueFor("chance")
                    let max_mana_ragen_percent = hAbility_4.GetSpecialValueFor("max_mana_ragen_percent")
                    if (GFuncMath.PRD(chance, this.GetParentPlus(), "obsidian_destroyer_1")) {
                        // 吸蓝特效
                        let iMaxMana = this.GetParentPlus().GetMaxMana()
                        let iGiveMana = iMaxMana * max_mana_ragen_percent * 0.01
                        this.GetParentPlus().GiveMana(iGiveMana)
                    }
                }

                if (hParent.HasShard() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK)) {
                    let n = 0
                    let tTargets = AoiHelper.FindEntityInRadius(hParent.GetTeamNumber(), hParent.GetAbsOrigin(), hParent.Script_GetAttackRange() + params.attacker.GetHullRadius(), null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_CLOSEST)
                    let iAttackState = BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING
                    for (let hTarget of (tTargets)) {

                        if (hTarget != params.target) {
                            BattleHelper.Attack(hParent, hTarget, iAttackState)
                            n = n + 1
                            if (n >= this.extra_count) {
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
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") { return }
        let attacker = params.attacker as IBaseNpc_Plus
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            if (this.records.indexOf(params.record) != null) {
                EmitSoundOnLocationWithCaster(params.target.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_ObsidianDestroyer.ArcaneOrb.Impact", params.attacker), params.attacker)
                let extra_radius = attacker.HasTalent("special_bonus_unique_obsidian_destroyer_custom") && attacker.GetTalentValue("special_bonus_unique_obsidian_destroyer_custom") || 0
                let radius = this.radius + extra_radius

                let damage_factor = attacker.GetTalentValue("special_bonus_unique_obsidian_destroyer_custom_5")
                let fDamage = (this.mana_pool_damage_pct + damage_factor) * 0.01 * params.attacker.GetMana()

                let targets = AoiHelper.FindEntityInRadius(params.attacker.GetTeamNumber(), params.target.GetAbsOrigin(), radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, 0, 0)
                for (let target of (targets)) {
                    if (IsValid(target) && target.IsAlive()) {
                        let damage_table: BattleHelper.DamageOptions = {
                            ability: this.GetAbilityPlus(),
                            victim: target,
                            attacker: params.attacker,
                            damage: fDamage,
                            damage_type: this.GetAbilityPlus().GetAbilityDamageType(),
                        }
                        if (target == params.target) {
                            damage_table.extra_flags = BattleHelper.enum_CC_DAMAGE_FLAGS.CC_DAMAGE_FLAG_SHOW_DAMAGE_NUMBER
                        }
                        BattleHelper.GoApplyDamage(damage_table)
                        // 提供精华能量 每次伤害一个目标提供一点能量
                        let hModifier = modifier_obsidian_destroyer_3.findIn(this.GetParentPlus()) as IBaseModifier_Plus;
                        if (IsValid(hModifier)) {
                            hModifier.SetStackCount(this.essence_energy + this.GetParentPlus().GetTalentValue("special_bonus_unique_obsidian_destroyer_custom_4"))
                        }
                    }
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY)
    On_AttackRecordDestroy(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            GameFunc.ArrayFunc.ArrayRemove(this.records, params.record)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_obsidian_destroyer_1_projectile extends BaseModifier_Plus {
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
        return ResHelper.GetParticleReplacement("particles/units/heroes/hero_obsidian_destroyer/obsidian_destroyer_arcane_orb.vpcf", this.GetParentPlus())
    }
}
