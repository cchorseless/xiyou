
import { GameFunc } from "../../GameFunc";
import { modifier_hero_property } from "../propertystat/modifier_hero_property";
import { PropertyCalculate } from "../propertystat/PropertyCalculate";
import { BaseItem_Plus } from "./BaseItem_Plus";
import { BaseNpc } from "./Base_Plus";
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
        entityOwner: IBaseNpc_Plus = null
    ): InstanceType<T> {
        return BaseNpc_Plus.CreateUnitByName(this.name, v, team, findClearSpace, npcOwner, entityOwner) as InstanceType<T>;
    }

    static CreateUnitByName(
        unitname: string,
        v: Vector,
        team: DOTATeam_t,
        findClearSpace: boolean = true,
        npcOwner: CBaseEntity | undefined = null,
        entityOwner: IBaseNpc_Plus = null
    ) {
        let unit = CreateUnitByName(unitname, v, findClearSpace, npcOwner, entityOwner, team);
        GameFunc.BindInstanceToCls(unit, GGetRegClass(unitname) || BaseNpc_Plus);
        return unit as IBaseNpc_Plus;
    }
    /**
     * @Server
     * @returns 
     */
    GetIntellect?() {
        return PropertyCalculate.GetIntellect(this)
    }
    /**
     * @Server
     * @returns 
     */
    GetStrength?() {
        return PropertyCalculate.GetStrength(this)
    }
    /**
     * @Server
     * @returns 
     */
    GetAgility?() {
        return PropertyCalculate.GetAgility(this)
    }
    /**
     * @Server
     * @returns 
     */
    GetAllStats?() {
        return this.GetIntellect() + this.GetStrength() + this.GetAgility();
    }
    /**
     * 获取主属性值
     * @returns
     */
    GetPrimaryStatValue?() {
        const Primary = this.GetPrimaryAttribute();
        if (Primary == Attributes.DOTA_ATTRIBUTE_AGILITY) {
            return this.GetAgility()
        }
        else if (Primary == Attributes.DOTA_ATTRIBUTE_STRENGTH) {
            return this.GetStrength()
        }
        else if (Primary == Attributes.DOTA_ATTRIBUTE_INTELLECT) {
            return this.GetIntellect()
        }
        return 0;
    }
    /**
     * 获取主属性
     * @Both
     * @returns
     */
    GetPrimaryAttribute?() {
        const herobuff = GPropertyConfig.HERO_PROPERTY_BUFF_NAME;
        if (this.HasModifier(herobuff)) {
            return this.GetModifierStackCount(herobuff, this)
        }
        return Attributes.DOTA_ATTRIBUTE_INVALID
    }
    /**
     * @Server
     */
    SetPrimaryAttribute?(iPrimaryAttribute: Attributes) {
        if (iPrimaryAttribute > Attributes.DOTA_ATTRIBUTE_INVALID && iPrimaryAttribute < Attributes.DOTA_ATTRIBUTE_MAX) {
            const herobuff = GPropertyConfig.HERO_PROPERTY_BUFF_NAME;
            const buff = this.findBuff(herobuff, this) as modifier_hero_property;
            if (buff) {
                buff.SetPrimaryStat(iPrimaryAttribute)
            }
        }
    }
    GetSource?() {
        if (this.IsSummoned() || this.IsClone() || this.IsIllusion()) {
            return GameFunc.IsValid(this.GetSummoner()) && this.GetSummoner() || this;
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
        hNPCOwner: IBaseNpc_Plus,
        hUnitOwner: IBaseNpc_Plus,
        iTeamNumber: DOTATeam_t,
        fDuration: number,
        fOutgoingDamage: number,
        fIncomingDamage: number) {
        let illusion = BaseNpc_Plus.CreateUnitByName(this.GetUnitName(), vLocation, iTeamNumber, bFindClearSpace, hNPCOwner, hUnitOwner) as IBaseNpc_Plus;
        illusion.MakeIllusion()
        illusion.SetForwardVector(this.GetForwardVector())
        if (hUnitOwner != null) {
            illusion.SetControllableByPlayer(hUnitOwner.GetPlayerOwnerID(), !bFindClearSpace)
        }
        let iLevel = this.GetLevel();
        illusion.SetBaseDamageMin(this.GetBaseDamageMin())
        illusion.SetBaseDamageMax(this.GetBaseDamageMax())
        illusion.SetAttackCapability(this.GetAttackCapability())
        illusion.SetRangedProjectileName(this.GetRangedProjectileName())
        illusion.SetModel(this.GetModelName())
        illusion.SetOriginalModel(this.GetModelName())
        illusion.SetModelScale(this.GetModelScale());
        // buff
        let modifiers = this.FindAllModifiers() as IBaseModifier_Plus[];
        for (let modifier of (modifiers)) {
            if (modifier.AllowIllusionDuplicate && modifier.AllowIllusionDuplicate()) {
                let buff = illusion.addBuff(modifier.GetName(), modifier.GetCasterPlus(), modifier.GetAbilityPlus())
                buff.SetStackCount(modifier.GetStackCount())
            }
        }
        for (let i = 0; i <= this.GetAbilityCount() - 1; i++) {
            let ability = this.GetAbilityByIndex(i)
            if (ability != null) {
                let illusion_ability = illusion.FindAbilityByName(ability.GetAbilityName())
                if (illusion_ability == null) {
                    illusion_ability = illusion.addAbilityPlus(ability.GetAbilityName())
                }
                if (illusion_ability != null) {
                    if (illusion_ability.GetLevel() < ability.GetLevel()) {
                        while (illusion_ability.GetLevel() < ability.GetLevel()) {
                            illusion_ability.UpgradeAbility(true)
                        }
                    }
                    else if (illusion_ability.GetLevel() >= ability.GetLevel()) {
                        illusion_ability.SetLevel(ability.GetLevel())
                        if (illusion_ability.GetLevel() == 0) {
                            if (illusion_ability.GetAutoCastState()) {
                                illusion_ability.ToggleAutoCast()
                            }
                            if (illusion_ability.GetToggleState()) {
                                illusion_ability.ToggleAbility()
                            }
                            illusion.RemoveModifierByName(illusion_ability.GetIntrinsicModifierName() || "")
                        }
                    }
                }
            }
        }
        for (let i = DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_1; i <= DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_9; i++) {
            let item = illusion.GetItemInSlot(i)
            if (item != null) {
                UTIL_Remove(item)
            }
        }
        for (let i = DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_1; i <= DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_9; i++) {
            let item = this.GetItemInSlot(i)
            if (item != null) {
                let illusion_item = BaseItem_Plus.CreateItem(item.GetName(), illusion as any, illusion as any)
                if (GameFunc.IsValid(illusion_item)) {
                    illusion_item.EndCooldown()
                    illusion_item.SetPurchaser(null)
                    illusion_item.SetShareability(EShareAbility.ITEM_FULLY_SHAREABLE)
                    illusion_item.SetPurchaseTime(item.GetPurchaseTime())
                    illusion_item.SetCurrentCharges(item.GetCurrentCharges())
                    illusion_item.SetItemState(item.GetItemState())
                    if (illusion_item.GetToggleState() != item.GetToggleState()) {
                        illusion_item.ToggleAbility()
                    }
                    if (illusion_item.GetAutoCastState() != item.GetAutoCastState()) {
                        illusion_item.ToggleAutoCast()
                    }
                    illusion.AddItem(illusion_item)
                    for (let j = DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_1; j <= DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_9; j++) {
                        let _item = illusion.GetItemInSlot(j)
                        if (_item == illusion_item) {
                            if (i != j) {
                                illusion.SwapItems(i, j)
                            }
                            break
                        }
                    }
                }
            }
        }
        illusion.addBuff("modifier_illusion", hUnitOwner, null, { duration: fDuration, outgoing_damage: fOutgoingDamage, incoming_damage: fIncomingDamage })
        illusion.SetHealth(this.GetHealth())
        illusion.SetMana(this.GetMana())
        let particleID = ParticleManager.CreateParticle("particles/generic_gameplay/illusion_created.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, illusion)
        ParticleManager.ReleaseParticleIndex(particleID)
        return illusion
    }
}
declare global {
    type IBaseNpc_Plus = BaseNpc_Plus;
}



