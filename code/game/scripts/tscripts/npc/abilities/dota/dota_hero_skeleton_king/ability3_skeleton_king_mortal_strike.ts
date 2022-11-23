import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_skeleton_king_2_summon } from "./ability2_skeleton_king_vampiric_aura";

/** dota原技能数据 */
export const Data_skeleton_king_mortal_strike = { "ID": "5088", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO", "AbilitySound": "Hero_SkeletonKing.CriticalStrike", "AbilityCooldown": "4", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "crit_mult": "140 180 220 260" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_3" };

@registerAbility()
export class ability3_skeleton_king_mortal_strike extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "skeleton_king_mortal_strike";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_skeleton_king_mortal_strike = Data_skeleton_king_mortal_strike;
    Init() {
        this.SetDefaultSpecialValue("aura_radius", 800);
        this.SetDefaultSpecialValue("regen", [1, 2, 3, 4, 5]);
        this.SetDefaultSpecialValue("increase_attack_pct", 30);
        this.SetDefaultSpecialValue("add_atk_pct_perS", [2, 2.5, 3, 3.5, 4]);

    }

    Init_old() {
        this.SetDefaultSpecialValue("aura_radius", 800);
        this.SetDefaultSpecialValue("regen", [1, 2, 3, 4, 5]);

    }



    GetAOERadius() {
        return this.GetSpecialValueFor("aura_radius")
    }

    GetIntrinsicModifierName() {
        return "modifier_skeleton_king_3"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_skeleton_king_3 extends BaseModifier_Plus {
    aura_radius: any;
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
    IsAura() {
        return true
    }
    GetAuraSearchTeam() {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH
    }
    GetAuraSearchType() {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP
    }
    GetAuraSearchFlags() {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE
    }
    GetAuraRadius() {
        return this.aura_radius
    }
    GetAura() {
        return "modifier_skeleton_king_3_aura"
    }
    GetAuraEntityReject(hEntity: BaseNpc_Plus) {
        if (hEntity.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber() && !modifier_skeleton_king_2_summon.exist(hEntity)) {
            return true
        }
        return false
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        this.aura_radius = this.GetSpecialValueFor("aura_radius")
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_skeleton_king_3_aura extends BaseModifier_Plus {
    regen: number;
    add_atk_pct_perS: number;
    IsHidden() {
        return true
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.add_atk_pct_perS = this.GetSpecialValueFor("add_atk_pct_perS")
        if (IsServer()) {
            if (GameFunc.IsValid(hCaster)) {
                if (hCaster.GetTeamNumber() == hParent.GetTeamNumber() && modifier_skeleton_king_2_summon.exist(hParent)) {
                    modifier_skeleton_king_3_attack.apply(hCaster, hParent, this.GetAbilityPlus(), null)
                }
            }
        }
    }
    OnDestroy() {
        super.OnDestroy();
        this.regen = this.GetSpecialValueFor("regen")
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    OnDeath(params: ModifierTable) {
        if (params.unit == this.GetParentPlus()) {
            let hCaster = this.GetCasterPlus()
            if (GameFunc.IsValid(hCaster) && GameFunc.IsValid(this.GetAbilityPlus())) {
                let hBuff = hCaster.FindModifierByName(this.GetAbilityPlus().GetIntrinsicModifierName()) as BaseModifier_Plus;
                if (GameFunc.IsValid(hBuff)) {
                    let iCount = this.regen
                    for (let i = 1; i <= iCount; i++) {
                        hBuff.IncrementStackCount()
                    }
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_skeleton_king_3_attack extends BaseModifier_Plus {
    add_atk_pct_perS: number;
    increase_attack_pct: number;
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
    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(0)
        }
    }
    Init(params: ModifierTable) {
        this.increase_attack_pct = this.GetSpecialValueFor("increase_attack_pct")
        this.add_atk_pct_perS = this.GetSpecialValueFor("add_atk_pct_perS")
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    GetDamageOutgoing_Percentage() {
        return this.increase_attack_pct
    }

    //  pipixia add 增加攻擊具體數值
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage() {
        let r = this.add_atk_pct_perS * this.GetParentPlus().GetMaxHealth() * 0.01;
        return r;
    }

    //  // pipixia }
    OnIntervalThink() {
        if (IsServer()) {
            if (!GameFunc.IsValid(this.GetCasterPlus()) || !this.GetCasterPlus().IsAlive()) {
                this.Destroy()
                return
            }
        }
    }
}
