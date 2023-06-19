import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

@registerAbility()
export class boss extends BaseAbility_Plus {
    GetIntrinsicModifierName() {
        return "modifier_boss"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_boss extends BaseModifier_Plus {
    IsHidden() {
        return false
    }
    stage_3_cooldown_reduction: number;
    tStageHealth: number[];
    iLevel: number;


    // BeCreated(params: IModifierTable) {
    //     // this.SetHasCustomTransmitterData(true)
    //     this.stage_3_cooldown_reduction = this.GetSpecialValueFor("stage_3_cooldown_reduction")
    //     this.tStageHealth = [
    //         this.GetAbilityPlus().GetLevelSpecialValueFor("stage_health_pct", 0),
    //         this.GetAbilityPlus().GetLevelSpecialValueFor("stage_health_pct", 1),
    //         this.GetAbilityPlus().GetLevelSpecialValueFor("stage_health_pct", 2)
    //     ]

    //     if (IsServer()) {
    //         this.StartIntervalThink(0.1)
    //         this.iLevel = 0

    //         if (null == this.tAttribute) {
    //             this.tAttribute = {}

    //             // 所有玩家漏过导致的属性成长
    //             let bToast = true
    //             for (let tIntensifyAttribute of (Spawner.tPlayerBossIntensify)) {

    //                 for (let v of (tIntensifyAttribute)) {


    //                     if (!this.tAttribute[k]) {
    //                         this.tAttribute[k] = v
    //                     } else {
    //                         this.tAttribute[k] = v + this.tAttribute[k]
    //                     }
    //                     this.SetStackCount(v)
    //                     //  if ( GSManager.getStateType() == GS_Preparation && bToast == true ) {
    //                     //  	Notification.Boss_Enhance({
    //                     //  		boss_enhance : this.tAttribute[k],
    //                     //  		tAttribute : k,
    //                     //  		message : "Boss_Enhance.length",
    //                     //  	})
    //                     //  }
    //                 }
    //                 bToast = false
    //             }
    //             this.ForceRefresh()
    //         }
    //     }
    // }
    // // AddCustomTransmitterData() {
    // //     return this.tAttribute
    // // }
    // // HandleCustomTransmitterData(tData) {
    // //     this.tAttribute = tData
    // // }
    // OnIntervalThink() {
    //     let hParent = this.GetParentPlus()
    //     let iLevel = this.iLevel
    //     for (let i = 1; i <= this.tStageHealth.length; i++) {
    //         if (hParent.GetHealthPercent() <= this.tStageHealth[i] && this.iLevel < i) {
    //             iLevel = i
    //         }
    //     }

    //     if (iLevel != this.iLevel) {
    //         this.iLevel = iLevel
    //         let tTargets = FindUnitsInRadius(hParent.GetTeamNumber(), hParent.GetAbsOrigin(), null, -1, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false)

    // 	let function set(sSpecial, typeEMDF, iBase)
    //         iBase = iBase || 0
    //         let iFactor = this.GetAbilityLevelSpecialValueFor(sSpecial, iLevel)
    //         let iRote = 0
    //         if (iFactor && 0 < iFactor) {
    //             iRote = tTargets.length / iFactor
    //         }
    //         this.tAttribute[typeEMDF] = iBase * iRote + (this.tAttribute[typeEMDF] || 0)
    //     }

    //     //  攻击力加成
    //     set("stage_attack_factor", "PhysicalAttack", GetOriginalBasePhysicalAttack(hParent))
    //     set("stage_attack_factor", "MagicalAttack", GetOriginalBaseMagicalAttack(hParent))

    //     //  防御力加成
    //     set("stage_armor_factor", "PhysicalArmor", GetOriginalBasePhysicalArmor(hParent))
    //     set("stage_armor_factor", "MagicalArmor", GetOriginalBaseMagicalArmor(hParent))

    //     this.ForceRefresh()
    // }

    // @registerProp(PropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ATTACK_BASE)
    // EOM_GetModifierPhysicalAttackBase() {
    //     return this.tAttribute.PhysicalAttack
    // }
    // @registerProp(PropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BASE,)
    // EOM_GetModifierPhysicalArmorBase() {
    //     return this.tAttribute.PhysicalArmor
    // }
    // @registerProp(PropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ATTACK_BASE,)
    // EOM_GetModifierMagicalAttackBase() {
    //     return this.tAttribute.MagicalAttack
    // }
    // @registerProp(PropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_BASE,)
    // EOM_GetModifierMagicalArmorBase() {
    //     return this.tAttribute.MagicalArmor
    // }
    // @registerProp(PropertyConfig.EMODIFIER_PROPERTY.HEALTH_PERCENT_ENEMY,)
    // EOM_GetModifierHealthPercentageEnemy() {
    //     return this.tAttribute.HealthPercent
    // }
    // @registerProp(PropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ATTACK_PERCENTAGE,)
    // EOM_GetModifierPhysicalAttackPercentage() {
    //     return this.tAttribute.PhysicalAttackPercent
    // }
    // @registerProp(PropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ATTACK_PERCENTAGE,)
    // EOM_GetModifierMagicalAttackPercentage() {
    //     return this.tAttribute.MagicalAttackPercent
    // }
    // @registerProp(PropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    // OnTooltip() {
    //     this._iToolTip = ((this._iToolTip || -1) + 1) % 7
    //     if (0 == this._iToolTip) {
    //         return this.EOM_GetModifierPhysicalAttackBase()
    //     } else if (1 == this._iToolTip) {
    //         return this.EOM_GetModifierMagicalAttackBase()
    //     } else if (2 == this._iToolTip) {
    //         return this.EOM_GetModifierPhysicalArmorBase()
    //     } else if (3 == this._iToolTip) {
    //         return this.EOM_GetModifierMagicalArmorBase()
    //     } else if (4 == this._iToolTip) {
    //         return this.EOM_GetModifierHealthPercentageEnemy()
    //     } else if (5 == this._iToolTip) {
    //         return this.EOM_GetModifierPhysicalAttackPercentage()
    //     } else if (6 == this._iToolTip) {
    //         return this.EOM_GetModifierMagicalAttackPercentage()
    //     }
    //     return 0
    // }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true
        }
    }
}