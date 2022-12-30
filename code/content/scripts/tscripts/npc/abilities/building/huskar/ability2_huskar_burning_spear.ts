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
export const Data_huskar_burning_spear = { "ID": "5272", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_AUTOCAST | DOTA_ABILITY_BEHAVIOR_ATTACK", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilitySound": "Hero_Huskar.Burning_Spear", "AbilityCastRange": "450", "AbilityCastPoint": "0.0 0.0 0.0 0.0", "AbilityCooldown": "0.0 0.0 0.0 0.0", "AbilityDuration": "8", "AbilityManaCost": "0 0 0 0", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "health_cost": "3" }, "02": { "var_type": "FIELD_INTEGER", "burn_damage": "5 10 15 20", "LinkedSpecialBonus": "special_bonus_unique_huskar_2" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_huskar_burning_spear extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "huskar_burning_spear";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_huskar_burning_spear = Data_huskar_burning_spear;
    Init() {
        this.SetDefaultSpecialValue("base_damage", [120, 200, 310, 460, 660, 920]);
        this.SetDefaultSpecialValue("burn_damage", [80, 100, 120, 140, 160, 180]);
        this.SetDefaultSpecialValue("radius", 300);
        this.SetDefaultSpecialValue("health_cost", 1);

    }

    GetIntrinsicModifierName() {
        return modifier_huskar_2_projectile.name
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_huskar_2 extends BaseModifier_Plus {
    health_cost: number;
    radius: number;
    debuff_duration: number;
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.records = []
        }
    }
    Init(params: ModifierTable) {
        this.health_cost = this.GetSpecialValueFor("health_cost")
        this.radius = this.GetSpecialValueFor("radius")
        if (IsServer()) {
            this.debuff_duration = this.GetAbilityPlus().GetDuration()
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY)
    On_AttackRecordDestroy(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            GameFunc.ArrayFunc.ArrayRemove(this.records, params.record)
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    On_AttackStart(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            if ((this.GetParentPlus().GetCurrentActiveAbility() == this.GetAbilityPlus() || this.GetAbilityPlus().GetAutoCastState()) && !this.GetParentPlus().IsSilenced() && this.GetAbilityPlus().IsCooldownReady() && this.GetAbilityPlus().CastFilterResult() == UnitFilterResult.UF_SUCCESS) {
                modifier_huskar_2_projectile.applyOnly(params.attacker, params.attacker, this.GetAbilityPlus())
            }
        }
        else {
            modifier_huskar_2_projectile.remove(params.attacker);
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    On_AttackRecord(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            if ((this.GetParentPlus().GetCurrentActiveAbility() == this.GetAbilityPlus() || this.GetAbilityPlus().GetAutoCastState()) && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS) && !this.GetParentPlus().IsSilenced() && this.GetAbilityPlus().IsCooldownReady() && this.GetAbilityPlus().CastFilterResult() == UnitFilterResult.UF_SUCCESS) {
                table.insert(this.records, params.record)
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    On_Attack(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS)) {
            if (this.records.indexOf(params.record) != null) {
                params.attacker.EmitSound(ResHelper.GetSoundReplacement("Hero_Huskar.Burning_Spear", params.attacker))
                this.GetAbilityPlus().UseResources(true, true, true)
                let health_cost = this.GetParentPlus().HasTalent("special_bonus_unique_huskar_custom_3") && this.GetParentPlus().GetTalentValue("special_bonus_unique_huskar_custom_3") + this.health_cost || this.health_cost
                let iHealth = this.GetParentPlus().GetHealth() - health_cost * params.attacker.GetMaxHealth() * 0.01
                this.GetParentPlus().ModifyHealth(iHealth, this.GetAbilityPlus(), false, 0)
                if (!BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK)) {
                    let sTalentName = "special_bonus_unique_huskar_custom_1"
                    let hCaster = this.GetCasterPlus()
                    if (hCaster.HasTalent(sTalentName)) {
                        let arrow_count = hCaster.GetTalentValue(sTalentName)
                        let count = 0
                        let targets = AoiHelper.FindEntityInRadius(params.attacker.GetTeamNumber(), params.attacker.GetAbsOrigin(), params.attacker.Script_GetAttackRange() + params.attacker.GetHullRadius() + hCaster.GetTalentValue(sTalentName, "bonus_range"), null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_CLOSEST)
                        for (let target of (targets)) {
                            if (target != params.target) {
                                count = count + 1
                                let iAttackState = BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING
                                BattleHelper.Attack(params.attacker, target, iAttackState)

                                if (count >= arrow_count) {
                                    break
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    attackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion()) {
            if (this.records.indexOf(params.record) != null) {
                let duration = this.debuff_duration
                let hAbility = this.GetAbilityPlus()
                let tTargets = AoiHelper.FindEntityInRadius(params.attacker.GetTeamNumber(), params.target.GetAbsOrigin(), this.radius, null, hAbility.GetAbilityTargetTeam(), hAbility.GetAbilityTargetType(), hAbility.GetAbilityTargetFlags(), FindOrder.FIND_CLOSEST)
                for (let hTarget of (tTargets)) {
                    modifier_huskar_2_counter.apply(hTarget, params.attacker, this.GetAbilityPlus(), { duration: duration })
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_huskar_2_projectile extends BaseModifier_Plus {
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
        return "particles/units/heroes/hero_huskar/huskar_burning_spear.vpcf"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_huskar_2_counter extends BaseModifier_Plus {
    burn_damage: number;
    base_damage: number;
    health_cost: number;
    fGameTime: number;
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (!IsServer()) {
            let iPtclID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_huskar/huskar_burning_spear_debuff.vpcf",
                resNpc: this.GetParentPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iPtclID, false, false, -1, false, false)
            iPtclID = ResHelper.CreateParticle({
                resPath: "particles/status_fx/status_effect_life_stealer_open_wounds.vpcf",
                resNpc: this.GetParentPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iPtclID, false, true, 10, false, false)
        }
    }
    Init(params: ModifierTable) {
        this.burn_damage = this.GetSpecialValueFor("burn_damage") * 0.01
        this.base_damage = this.GetSpecialValueFor("base_damage")
        this.health_cost = this.GetSpecialValueFor("health_cost") * 0.01
        if (IsServer()) {
            let iStack = (params.iCount || 1)
            this.changeStackCount(iStack);
            GTimerHelper.AddTimer(params.duration, GHandler.create(this, () => {
                this.changeStackCount(-iStack);
            }))
        }
    }
    OnIntervalThink() {
        let hCaster = this.GetCasterPlus()
        let hAbility = this.GetAbilityPlus()
        if (!GameFunc.IsValid(hCaster) || !GameFunc.IsValid(hAbility)) {
            this.StartIntervalThink(-1)
            this.Destroy()
            return
        }
        if (IsServer()) {
            let health_cost = this.GetCasterPlus().GetTalentValue("special_bonus_unique_huskar_custom_3") * 0.01 + this.health_cost
            let damage_table = {
                ability: hAbility,
                victim: this.GetParentPlus(),
                attacker: hCaster,
                damage: this.base_damage + ((this.burn_damage * hCaster.GetMaxHealth() * health_cost) * this.GetStackCount() || 0),
                damage_type: hAbility.GetAbilityDamageType(),
                eom_flags: BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_DOT,
            }
            BattleHelper.GoApplyDamage(damage_table)
        }
    }
}
