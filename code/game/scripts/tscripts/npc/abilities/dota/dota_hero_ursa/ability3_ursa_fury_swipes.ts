
import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_ursa_6_buff } from "./ability6_ursa_enrage";
/** dota原技能数据 */
export const Data_ursa_fury_swipes = { "ID": "5359", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "bonus_reset_time": "8 12 16 20", "LinkedSpecialBonus": "special_bonus_unique_ursa_4" }, "02": { "var_type": "FIELD_FLOAT", "bonus_reset_time_roshan": "10" }, "03": { "var_type": "FIELD_INTEGER", "damage_per_stack": "9 18 27 36", "LinkedSpecialBonus": "special_bonus_unique_ursa" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_ursa_fury_swipes extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "ursa_fury_swipes";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_ursa_fury_swipes = Data_ursa_fury_swipes;
    Init() {
        this.SetDefaultSpecialValue("bonus_reset_time", 6);
        this.SetDefaultSpecialValue("damage_per_stack", [8, 10, 12, 16, 20]);
        this.SetDefaultSpecialValue("max_stack", 400);
        this.SetDefaultSpecialValue("shock_chance_per_stack", 0.5);
        this.SetDefaultSpecialValue("shard_bonus_reset_time", 2);

    }

    Init_old() {
        this.SetDefaultSpecialValue("bonus_reset_time", 5);
        this.SetDefaultSpecialValue("damage_per_stack", [4, 5, 6, 8, 10]);
        this.SetDefaultSpecialValue("max_stack", 400);
        this.SetDefaultSpecialValue("shock_chance_per_stack", 0.5);

    }

    GetIntrinsicModifierName() {
        return "modifier_ursa_3"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_ursa_3 extends BaseModifier_Plus {
    bonus_reset_time: number;
    shard_bonus_reset_time: number;
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
    Init(params: ModifierTable) {
        this.bonus_reset_time = this.GetSpecialValueFor("bonus_reset_time")
        this.shard_bonus_reset_time = this.GetSpecialValueFor("shard_bonus_reset_time")
    }


    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    attackLanded(params: ModifierAttackEvent) {
        if (!GameFunc.IsValid(params.target) || params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion() && !params.attacker.PassivesDisabled()) {
            modifier_ursa_3_buff.apply(params.attacker, params.attacker, this.GetAbilityPlus(),
                { duration: ((params.attacker as BaseNpc_Plus).HasShard() && this.shard_bonus_reset_time || this.bonus_reset_time) })
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_ursa_3_buff extends BaseModifier_Plus {
    damage_per_stack: number;
    shock_chance_per_stack: number;
    max_stack: number;
    bonus_reset_time: number;
    shard_bonus_reset_time: number;
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
    ShouldUseOverheadOffset() {
        return true
    }
    DestroyOnExpire() {
        return false
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params)
        if (!IsServer()) {
            let particleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_ursa/ursa_fury_swipes_debuff.vpcf",
                resNpc: this.GetParentPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(particleID, false, true, -1, false, false)
        }
    }
    Init(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        let sTalentName = "special_bonus_unique_ursa_custom_5"
        this.damage_per_stack = hCaster.HasTalent(sTalentName) && this.GetSpecialValueFor("damage_per_stack") + hCaster.GetTalentValue(sTalentName) || this.GetSpecialValueFor("damage_per_stack")
        this.shock_chance_per_stack = this.GetSpecialValueFor("shock_chance_per_stack")
        this.max_stack = this.GetSpecialValueFor("max_stack")
        this.bonus_reset_time = this.GetSpecialValueFor("bonus_reset_time")
        this.shard_bonus_reset_time = this.GetSpecialValueFor("shard_bonus_reset_time")
        if (IsServer()) {
            let iStackCount = 1
            let hModifier = modifier_ursa_6_buff.findIn(this.GetParentPlus())
            if (GameFunc.IsValid(hModifier)) {
                iStackCount = iStackCount * hModifier.enrage_multiplier
            }
            if (hCaster.HasShard()) {
                this.SetStackCount(this.GetStackCount() + iStackCount)
            } else {
                this.SetStackCount(math.min(this.GetStackCount() + iStackCount, this.max_stack))
            }
            this.StartIntervalThink((hCaster.HasShard() && this.shard_bonus_reset_time || this.bonus_reset_time))
        }
    }
    OnDestroy() {
        super.OnDestroy()
        if (IsServer()) {
            this.StartIntervalThink(-1)
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            let lossPercent = hParent.HasScepter() && 0.5 || 1
            this.SetStackCount(this.GetStackCount() * (1 - lossPercent))
            this.StartIntervalThink((hParent.HasShard() && this.shard_bonus_reset_time || this.bonus_reset_time))
            this.SetDuration((hParent.HasShard() && this.shard_bonus_reset_time || this.bonus_reset_time), true)
        }
    }
    OnStackCountChanged(iStackCount: number) {
        if (IsServer()) {
            if (this.GetStackCount() <= 0) {
                this.Destroy()
            }
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    EOM_GetModifierBaseAttack_BonusDamage() {
        return this.damage_per_stack * this.GetStackCount()
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP2)
    tooltip2(params: ModifierTable) {
        return this.damage_per_stack * this.GetStackCount()
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    tooltip(params: ModifierTable) {
        return this.shock_chance_per_stack * this.GetStackCount()
    }
}
