import { GameFunc } from "../../../../GameFunc";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_pangolier_6_rolling } from "./ability6_pangolier_gyroshell";

/** dota原技能数据 */
export const Data_pangolier_lucky_shot = { "ID": "7307", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "chance_pct": "17" }, "02": { "var_type": "FIELD_FLOAT", "duration": "2 3 4 5" }, "03": { "var_type": "FIELD_INTEGER", "slow": "35" }, "04": { "var_type": "FIELD_INTEGER", "armor": "3 4 5 6" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_pangolier_lucky_shot extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "pangolier_lucky_shot";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_pangolier_lucky_shot = Data_pangolier_lucky_shot;
    Init() {
        this.SetDefaultSpecialValue("chance", 17);
        this.SetDefaultSpecialValue("duration", 2);
        this.SetDefaultSpecialValue("damage_amplify_percent", [5, 10, 15, 20, 25]);
        this.SetDefaultSpecialValue("raduce_health_percent", -20);
        this.SetDefaultSpecialValue("raduce_armor", [-4, -8, -12, -16, -20]);
        this.SetDefaultSpecialValue("raduce_magic_armor", [-4, -8, -12, -16, -20]);
        this.SetDefaultSpecialValue("damage_pct_perS", [40, 45, 50, 55, 60]);

    }

    Init_old() {
        this.SetDefaultSpecialValue("chance", 17);
        this.SetDefaultSpecialValue("duration", 2);
        this.SetDefaultSpecialValue("damage_amplify_percent", [5, 10, 15, 20, 25]);
        this.SetDefaultSpecialValue("raduce_health_percent", 20);
        this.SetDefaultSpecialValue("raduce_armor_percent", [10, 20, 30, 40, 50]);
        this.SetDefaultSpecialValue("raduce_magic_resisstance_percent", [10, 20, 30, 40, 50]);

    }



    // 触发所有效果
    _OnSpellStart(hTarget: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration")
        modifier_pangolier_3_stun.apply(hTarget, hCaster, this, { duration: duration })
        modifier_pangolier_3_silent.apply(hTarget, hCaster, this, { duration: duration })
        modifier_pangolier_3_remove_armor.apply(hTarget, hCaster, this, { duration: duration })
        modifier_pangolier_3_remove_magic_armor.apply(hTarget, hCaster, this, { duration: duration })
        modifier_pangolier_3_reduce_health.apply(hTarget, hCaster, this, { duration: duration })
        let iParticleID = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_pangolier/pangolier_luckyshot_disarm_cast.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
            owner: hCaster
        });

        ParticleManager.SetParticleControlEnt(iParticleID, 1, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
        ParticleManager.ReleaseParticleIndex(iParticleID)
    }

    GetIntrinsicModifierName() {
        return "modifier_pangolier_3"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_pangolier_3 extends BaseModifier_Plus {
    chance: number;
    damage_amplify_percent: number;
    duration: number;
    damage_pct_perS: number;
    tData: number[];
    tRecords: any[][];
    IsHidden() {
        return this.GetStackCount() == 0
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
        this.chance = this.GetSpecialValueFor("chance")
        this.duration = this.GetSpecialValueFor("duration")
        this.damage_amplify_percent = this.GetSpecialValueFor("damage_amplify_percent")
        this.damage_pct_perS = this.GetSpecialValueFor("damage_pct_perS")
        if (IsServer() && params.IsOnCreated) {
            this.tData = [
                GameRules.GetGameTime(),
                GameRules.GetGameTime(),
                GameRules.GetGameTime(),
                GameRules.GetGameTime(),
                GameRules.GetGameTime(),
            ]
            this.tRecords = [
                [], [], [], [], [], []
            ]
            this.StartIntervalThink(0)
            this.OnIntervalThink()
        }
    }

    BeDestroy() {

        if (IsServer()) {
            let hAbility = this.GetAbilityPlus()
            // hAbility.AddOutgoingDamagePercent = null
            // hAbility.RemoveOutgoingDamagePercent = null
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let fGameTime = GameRules.GetGameTime()
            let iStackCount = 0
            for (let fTime of (this.tData)) {
                if (fTime >= fGameTime) {
                    iStackCount = iStackCount + 1
                }
            }
            this.SetStackCount(iStackCount)
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_tooltip() {
        return this.damage_amplify_percent * this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_DAMAGE_PERCENTAGE)
    CC_GetModifierOutgoingDamagePercentage(params: IModifierTable) {
        return this.damage_amplify_percent * this.GetStackCount()
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    attackRecord(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") { return }

        let hParent = this.GetParentPlus()
        if (params.attacker == hParent && !hParent.IsIllusion()) {
            hParent.RemoveGesture(GameActivity_t.ACT_DOTA_ATTACK_EVENT)
            let hTarget = params.target
            let hAbility = this.GetAbilityPlus()
            if (!hParent.PassivesDisabled() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS) && UnitFilter(hTarget, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, hParent.GetTeamNumber()) == UnitFilterResult.UF_SUCCESS) {
                let bProc = false
                let chance = this.chance
                if (modifier_pangolier_6_rolling.exist(hParent)) {
                    let hModifier = modifier_pangolier_6_rolling.findIn(hParent)
                    let hAbility3 = hModifier.GetAbilityPlus()
                    if (GameFunc.IsValid(hAbility3)) {
                        chance = chance + hAbility3.GetSpecialValueFor("lucky_shot_chance")
                    }
                }

                if (GameFunc.mathUtil.PRD(chance, hParent, "modifier_pangolier_3_stun")) {
                    bProc = true
                    table.insert(this.tRecords[0], params.record)
                }
                if (GameFunc.mathUtil.PRD(chance, hParent, "modifier_pangolier_3_silent")) {
                    bProc = true
                    table.insert(this.tRecords[2], params.record)
                }
                if (GameFunc.mathUtil.PRD(chance, hParent, "modifier_pangolier_3_remove_armor")) {
                    bProc = true
                    table.insert(this.tRecords[3], params.record)
                }
                if (GameFunc.mathUtil.PRD(chance, hParent, "modifier_pangolier_3_remove_magic_armor")) {
                    bProc = true
                    table.insert(this.tRecords[4], params.record)
                }
                if (GameFunc.mathUtil.PRD(chance, hParent, "modifier_pangolier_3_reduce_health")) {
                    bProc = true
                    table.insert(this.tRecords[5], params.record)
                }

                if (bProc) {
                    hParent.StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_ATTACK_EVENT, hParent.GetAttackSpeed())
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") { return }

        let hParent = this.GetParentPlus()
        if (params.attacker == hParent && !hParent.IsIllusion()) {
            let hAbility = this.GetAbilityPlus()
            let hCaster = this.GetCasterPlus()
            let hTarget = params.target as IBaseNpc_Plus
            let bProc = false
            if (this.tRecords[0].indexOf(params.record) != -1) {
                bProc = true
                // 触发眩晕
                this.tData[0] = math.max(GameRules.GetGameTime() + this.duration * hTarget.GetStatusResistanceFactor(hParent), this.tData[0])
                modifier_pangolier_3_stun.apply(hTarget, hParent, hAbility, { duration: this.duration * hTarget.GetStatusResistanceFactor(hParent) })
            }
            if (this.tRecords[2].indexOf(params.record) != -1) {
                bProc = true
                // 触发沉默
                this.tData[2] = math.max(GameRules.GetGameTime() + this.duration * hTarget.GetStatusResistanceFactor(hParent), this.tData[2])
                modifier_pangolier_3_silent.apply(hTarget, hParent, hAbility, { duration: this.duration * hTarget.GetStatusResistanceFactor(hParent) })
            }
            if (this.tRecords[3].indexOf(params.record) != -1) {
                bProc = true
                // 移除所有护甲
                this.tData[3] = math.max(GameRules.GetGameTime() + this.duration * hTarget.GetStatusResistanceFactor(hParent), this.tData[3])
                modifier_pangolier_3_remove_armor.apply(hTarget, hParent, hAbility, { duration: this.duration * hTarget.GetStatusResistanceFactor(hParent) })
            }
            if (this.tRecords[4].indexOf(params.record) != -1) {
                bProc = true
                // 移除所有魔抗
                this.tData[4] = math.max(GameRules.GetGameTime() + this.duration * hTarget.GetStatusResistanceFactor(hParent), this.tData[4])
                modifier_pangolier_3_remove_magic_armor.apply(hTarget, hParent, hAbility, { duration: this.duration * hTarget.GetStatusResistanceFactor(hParent) })
            }
            if (this.tRecords[5].indexOf(params.record) != -1) {
                bProc = true
                // 降低20%最大生命值 // 不吃状态抗性
                this.tData[5] = math.max(GameRules.GetGameTime() + this.duration * hTarget.GetStatusResistanceFactor(hParent), this.tData[5])
                modifier_pangolier_3_reduce_health.apply(hTarget, hParent, hAbility, { duration: this.duration * hTarget.GetStatusResistanceFactor(hParent) })
            }
            if (bProc) {
                let iParticleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_pangolier/pangolier_luckyshot_disarm_cast.vpcf",
                    resNpc: hParent,
                    iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                    owner: hParent
                });

                ParticleManager.SetParticleControlEnt(iParticleID, 1, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hTarget.GetAbsOrigin(), true)
                ParticleManager.ReleaseParticleIndex(iParticleID)
                //   pipixia add 造成生命万分比伤害
                let damage = hCaster.GetMaxHealth() * this.damage_pct_perS / 100;
                BattleHelper.GoApplyDamage({
                    ability: hAbility,
                    attacker: hCaster,
                    victim: hTarget,
                    damage: damage,
                    damage_type: hAbility.GetAbilityDamageType()
                })
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_CANCELLED)
    On_AttackCancelled(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") { return }

        let hParent = this.GetParentPlus()
        if (params.attacker == hParent && !hParent.IsIllusion()) {
            hParent.RemoveGesture(GameActivity_t.ACT_DOTA_ATTACK_EVENT)
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY)
    On_AttackRecordDestroy(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") { return }

        let hParent = this.GetParentPlus()
        if (params.attacker == hParent && !hParent.IsIllusion()) {
            GameFunc.ArrayFunc.ArrayRemove(this.tRecords[0], params.record)
            GameFunc.ArrayFunc.ArrayRemove(this.tRecords[2], params.record)
            GameFunc.ArrayFunc.ArrayRemove(this.tRecords[3], params.record)
            GameFunc.ArrayFunc.ArrayRemove(this.tRecords[4], params.record)
            GameFunc.ArrayFunc.ArrayRemove(this.tRecords[5], params.record)
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_pangolier_3_stun extends BaseModifier_Plus {
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

            this.AddParticle(iParticleID, false, false, -1, false, true)
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_STUNNED]: true
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation(params: IModifierTable) {
        return GameActivity_t.ACT_DOTA_DISABLED
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_pangolier_3_silent extends BaseModifier_Plus {
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
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_SILENCED]: true
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_pangolier_3_remove_armor extends BaseModifier_Plus {
    raduce_armor: number;
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
    Init(params: IModifierTable) {
        this.raduce_armor = this.GetSpecialValueFor("raduce_armor")
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(params: IModifierTable) {
        return this.raduce_armor
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_pangolier_3_remove_magic_armor extends BaseModifier_Plus {
    raduce_magic_armor: number;
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
    Init(params: IModifierTable) {
        this.raduce_magic_armor = this.GetSpecialValueFor("raduce_magic_armor")
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_BONUS)
    G_MAGICAL_ARMOR_BONUS() {
        return this.raduce_magic_armor
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_pangolier_3_reduce_health extends BaseModifier_Plus {
    raduce_health_percent: number;
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
    Init(params: IModifierTable) {
        this.raduce_health_percent = this.GetSpecialValueFor("raduce_health_percent")
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.raduce_health_percent
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HP_PERCENTAGE)
    G_HP_PERCENTAGE() {
        return this.raduce_health_percent
    }


}
