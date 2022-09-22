
import { ResHelper } from "../../helper/ResHelper";
import { LogHelper } from "../../helper/LogHelper";
import { BaseModifier, BaseNpc } from "./Base_Plus";
import { GameFunc } from "../../GameFunc";
import { BaseModifier_Plus } from "./BaseModifier_Plus";
import { GameEnum } from "../../GameEnum";
import { modifier_activity } from "../modifier/modifier_activity";
import { EntityHelper } from "../../helper/EntityHelper";
import { BaseAbility_Plus } from "./BaseAbility_Plus";
import { globalData } from "../../GameCache";
/**普通NPC单位基类 */
export class BaseNpc_Plus extends BaseNpc {

    /**
     *
     * @param v
     * @param team
     * @param creater 创建者
     * @param findClearSpace
     * @param npcOwner
     * @param entityOwner
     * @returns
     */
    static CreateOne<T extends typeof BaseNpc_Plus>(
        this: T,
        v: Vector,
        team: DOTATeam_t,
        findClearSpace: boolean = true,
        npcOwner: CBaseEntity | undefined = null,
        entityOwner: BaseNpc_Plus = null
    ): InstanceType<T> {
        return EntityHelper.CreateEntityByName(this.name, v, team, findClearSpace, npcOwner, entityOwner) as InstanceType<T>;
    }

    public addBuff?<T extends BaseModifier>(buffname: string, caster?: BaseNpc_Plus, ability?: BaseAbility_Plus, modifierTable?: ModifierTable): T {
        if (IsServer()) {
            let m = this.AddNewModifier(caster, ability, buffname, modifierTable) as T;
            if (m && m.UUID) {
                globalData.allModifiersIntance[buffname] = globalData.allModifiersIntance[buffname] || {};
                globalData.allModifiersIntance[buffname][m.UUID] = m;
            }
            return m;
        }
    }


    public addOnlyBuff?<T extends BaseModifier>(buffname: string, caster?: BaseNpc_Plus, ability?: BaseAbility_Plus, modifierTable?: ModifierTable): T {
        if (IsServer()) {
            if (this.existBuff(buffname)) {
                return this.findBuff(buffname, caster);
            } else {
                return this.addBuff<T>(buffname, caster, ability, modifierTable);
            }
        }
    }


    public removeBuff?<T extends BaseModifier>(buffname: string, caster?: CDOTA_BaseNPC) {
        if (IsServer()) {
            if (caster) {
                let modef = this.findBuff<T>(buffname, caster);
                if (modef) {
                    modef.Destroy();
                }
            } else {
                let modef = this.findBuff<T>(buffname);
                if (modef) {
                    modef.Destroy();
                }
            }
        }
    }


    public existBuff?<T extends BaseModifier>(buffname: string): boolean {
        if (buffname) {
            return this.HasModifier(buffname);
        }
        return false;
    }

    public findBuff?<T extends BaseModifier>(buffname: string, caster: CDOTA_BaseNPC = null): T {
        if (buffname && this.existBuff(buffname)) {
            if (caster) {
                return this.FindModifierByNameAndCaster(buffname, caster) as T;
            }
            return this.FindModifierByName(buffname) as T;
        }
    }


    public getBuffStack?<T extends BaseModifier>(buffname: string, caster: CDOTA_BaseNPC = null): number {
        let m = this.findBuff<T>(buffname, caster);
        if (m) {
            return m.GetStackCount();
        }
        return 0;
    }

    /**
    *
    * @param entityKeyValues
    */
    InitActivityModifier?() {
        if (this.__IN_DOTA_DATA__) {
            let entityKeyValues = this.__IN_DOTA_DATA__;
            let move = entityKeyValues.MovementSpeedActivityModifiers;
            let attackspeed = entityKeyValues.AttackSpeedActivityModifiers;
            let attackrange = entityKeyValues.AttackRangeActivityModifiers;
            let obj = {};
            if (move) {
                obj = Object.assign(obj, move)
            }
            if (attackspeed) {
                obj = Object.assign(obj, attackspeed)
            }
            if (attackrange) {
                obj = Object.assign(obj, attackrange)
            }
            if (Object.keys(obj).length > 0) {
                modifier_activity.apply(this, this, null, obj)
            }
        }

    }

    GetIntellect?() {
        return 1
    }
    GetStrength?() {
        return 1
    }
    GetAgility?() {
        return 1
    }
    GetAllStats?() {
        return 1
    }
    /**
     * 获取主属性值
     * @returns
     */
    GetPrimaryStatValue?() {
        return 1
    }
    /**
     * 获取主属性
     * @returns
     */
    GetPrimaryAttribute?() {
        return Attributes.DOTA_ATTRIBUTE_AGILITY
    }
    GetSource?() {
        if (this.IsSummoned() || this.IsClone() || this.IsIllusion()) {
            // return GameFunc.IsValid(this.GetSummoner()) && this.GetSummoner() || this
        }
        return this
    }
    /**
     *
     * @returns todo
     */
    GetSummoner?() {
        return this
    }

    /**
      * 创建幻象
      * @param vLocation
      * @param bFindClearSpace
      * @param hNPCOwner
      * @param hUnitOwner
      * @param iTeamNumber
      * @param fDuration
      * @param fOutgoingDamage
      * @param fIncomingDamage
      * @returns
      */
    CreateIllusion?(vLocation: Vector,
        bFindClearSpace: boolean,
        hNPCOwner: BaseNpc_Plus,
        hUnitOwner: BaseNpc_Plus,
        iTeamNumber: DOTATeam_t,
        fDuration: number,
        fOutgoingDamage: number,
        fIncomingDamage: number) {
        let hUnit = this;
        let illusion = CreateUnitByName(hUnit.GetUnitName(), vLocation, bFindClearSpace, hNPCOwner, hUnitOwner, iTeamNumber)
        // Attributes.Register(illusion)
        // Items.SetUnitQualificationLevel(illusion, Items.GetUnitQualificationLevel(hUnit))
        // illusion.MakeIllusion()
        // illusion.SetForwardVector(hUnit.GetForwardVector())
        // if (hUnitOwner != null) {
        //     illusion.SetControllableByPlayer(hUnitOwner.GetPlayerOwnerID(), !bFindClearSpace)
        // }
        // let iLevel = hUnit.GetLevel()
        // // for i = illusion.GetLevel(), iLevel - 1 do
        // //     if (illusion.LevelUp != null) {
        // //         illusion.LevelUp(false)
        // //     }
        // // }
        // let hUpgradeInfos = deepcopy(KeyValues.TowerUpgradesKv[hUnit.GetUnitName()])
        // if (hUpgradeInfos && hUpgradeInfos[tostring(iLevel - 1)]) {
        //     let hUpgradeInfo = hUpgradeInfos[tostring(iLevel - 1)]

        //     if (hUpgradeInfo.AttackDamageMin != null) {
        //         illusion.SetBaseDamageMin(tonumber(hUpgradeInfo.AttackDamageMin))
        //     }
        //     if (hUpgradeInfo.AttackDamageMax != null) {
        //         illusion.SetBaseDamageMax(tonumber(hUpgradeInfo.AttackDamageMax))
        //     }
        //     if (hUpgradeInfo.AttackCapabilities != null) {
        //         illusion.SetAttackCapability(AttackCapabilityS2I[hUpgradeInfo.AttackCapabilities])
        //     }
        //     if (hUpgradeInfo.ProjectileModel != null) {
        //         illusion.SetRangedProjectileName(hUpgradeInfo.ProjectileModel)
        //     }
        //     if (hUpgradeInfo.Model != null) {
        //         illusion.SetModel(hUpgradeInfo.Model)
        //         illusion.SetOriginalModel(hUpgradeInfo.Model)
        //     }
        //     if (hUpgradeInfo.ModelScale != null) {
        //         illusion.SetModelScale(hUpgradeInfo.ModelScale)
        //     }

        //     illusion.AddNewModifier(illusion, null, "modifier_build_system_creep", { level: iLevel - 1 })

        //     if (hUpgradeInfo.LevelupAbilities != null) {
        //         for (let sKey of Object.keys(hUpgradeInfo.LevelupAbilities)) {
        //             let sAbilityName = hUpgradeInfo.LevelupAbilities[sKey]

        //             let hAbility = illusion.FindAbilityByName(sAbilityName)
        //             if (hAbility) {
        //                 hAbility.UpgradeAbility(true)
        //             }
        //         }
        //     }
        // }

        // if (hUnit.IsBuilding()) {
        //     // illusion.IsBuilding = () => {
        //     //     return true
        //     // }
        // }

        // let modifiers = hUnit.FindAllModifiers() as BaseModifier_Plus[];
        // for (let modifier of (modifiers)) {
        //     if (modifier.AllowIllusionDuplicate && modifier.AllowIllusionDuplicate()) {
        //         let illusion_modifier = illusion.AddNewModifier(modifier.GetCasterPlus(), modifier.GetAbilityPlus(), modifier.GetName(), null)
        //     }
        // }
        // for (let i = 0; i <= hUnit.GetAbilityCount() - 1; i++) {
        //     let ability = hUnit.GetAbilityByIndex(i)
        //     if (ability != null) {
        //         let illusion_ability = illusion.FindAbilityByName(ability.GetAbilityName())
        //         if (illusion_ability == null && !ability.bInvokeSpell) {
        //             illusion_ability = illusion.AddAbility(ability.GetAbilityName())
        //         }
        //         if (illusion_ability != null) {
        //             if (illusion_ability.GetLevel() < ability.GetLevel()) {
        //                 while (illusion_ability.GetLevel() < ability.GetLevel()) {
        //                     illusion_ability.UpgradeAbility(true)
        //                 }
        //             } else if (illusion_ability.GetLevel() >= ability.GetLevel()) {
        //                 illusion_ability.SetLevel(ability.GetLevel())
        //                 if (illusion_ability.GetLevel() == 0) {
        //                     if (illusion_ability.GetAutoCastState()) {
        //                         illusion_ability.ToggleAutoCast()
        //                     }
        //                     if (illusion_ability.GetToggleState()) {
        //                         illusion_ability.ToggleAbility()
        //                     }

        //                     illusion.RemoveModifierByName(illusion_ability.GetIntrinsicModifierName() || "")
        //                 }
        //             }
        //         }
        //     }
        // }

        // for (let i = DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_1; i <= DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_9; i++) {
        //     let item = illusion.GetItemInSlot(i)
        //     if (item != null) {
        //         UTIL_Remove(item)
        //         //  item.RemoveSelf()
        //     }
        // }
        // for (let i = DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_1; i <= DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_9; i++) {
        //     let item = hUnit.GetItemInSlot(i)
        //     if (item != null) {
        //         let illusion_item = CreateItem(item.GetName(), illusion, illusion)
        //         if (GameFunc.IsValid(illusion_item)) {
        //             illusion_item.EndCooldown()
        //             illusion_item.SetPurchaser(null)
        //             illusion_item.SetShareability(ITEM_FULLY_SHAREABLE)
        //             illusion_item.SetPurchaseTime(item.GetPurchaseTime())
        //             illusion_item.SetCurrentCharges(item.GetCurrentCharges())
        //             illusion_item.SetItemState(item.GetItemState())
        //             if (illusion_item.GetToggleState() != item.GetToggleState()) {
        //                 illusion_item.ToggleAbility()
        //             }
        //             if (illusion_item.GetAutoCastState() != item.GetAutoCastState()) {
        //                 illusion_item.ToggleAutoCast()
        //             }
        //             illusion.AddItem(illusion_item)
        //             for (let j = DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_1; j <= DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_9; j++) {
        //                 let _item = illusion.GetItemInSlot(j)
        //                 if (_item == illusion_item) {
        //                     if (i != j) {
        //                         illusion.SwapItems(i, j)
        //                     }
        //                     break
        //                 }
        //             }
        //         }
        //     }
        // }

        // illusion.AddNewModifier(hUnitOwner, illusion.GetDummyAbility(), "modifier_illusion", { duration: fDuration, outgoing_damage: fOutgoingDamage, incoming_damage: fIncomingDamage })
        // illusion.SetHealth(hUnit.GetHealth())
        // illusion.SetMana(hUnit.GetMana())
        // let particleID = ParticleManager.CreateParticle("particles/generic_gameplay/illusion_created.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, illusion)
        // ParticleManager.ReleaseParticleIndex(particleID)
        return illusion
    }
}




