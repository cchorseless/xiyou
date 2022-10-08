import { ResHelper } from "../../helper/ResHelper";
import { LogHelper } from "../../helper/LogHelper";
import { BaseItem } from "./Base_Plus";
import { BaseNpc_Plus } from "./BaseNpc_Plus";
import { GameFunc } from "../../GameFunc";

export class BaseItem_Plus extends BaseItem {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__: string;
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: any;
    /**使用报错提示信息 */
    public errorStr: string;

    public GetAbilityTextureName(): string {
        // 默认使用dota默认技能ICON
        if (this.__IN_DOTA_NAME__) {
            return this.__IN_DOTA_NAME__;
        }
        return super.GetAbilityTextureName();
        let iconpath = ResHelper.GetAbilityTextureReplacement("", this.GetCaster());
        if (iconpath == null) {
            iconpath = super.GetAbilityTextureName();
        }
        return iconpath;
    }

    /**获取施法来源NPC，谁施法的 */
    GetCasterPlus() {
        return this.GetCaster() as BaseNpc_Plus;
    }
    /**获取作用归属NPC，在谁身上 */
    GetParentPlus() {
        return this.GetParent() as BaseNpc_Plus;
    }
    GetOwnerPlus() {
        return this.GetOwner() as BaseNpc_Plus;
    }
    /**自己给自己施法的 */
    IsCastBySelf() {
        return this.GetCasterPlus().GetEntityIndex() == this.GetOwnerPlus().GetEntityIndex();
    }
    /**尝试智能施法,AI会调用 */
    public AutoSpellSelf(): boolean { return true };
    /**
       * 技能施法可以释放
       * @returns
       */
    public IsItemReady(): boolean {
        let hCaster = this.GetCaster()
        let iBehavior = this.GetBehaviorInt()
        if (this.IsHidden()) {
            return false
        }
        if (!hCaster) {
            return false
        }
        if (!(this.IsFullyCastable() && this.IsActivated() && this.IsCooldownReady() && this.GetLevel() > 0 && this.IsOwnersManaEnough())) {
            return false
        }
        if (hCaster.IsHexed() || hCaster.IsCommandRestricted()) {
            return false
        }
        // 被控是否可以施法
        if (hCaster.IsStunned() && !GameFunc.IncludeArgs(iBehavior, DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_PSEUDO_QUEUE)[0]) {
            return false
        }
        if (hCaster.IsChanneling() && !GameFunc.IncludeArgs(iBehavior, DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL)[0]) {
            return false
        }
        if (IsServer()) {
            if (this.IsItem()) {
                if (hCaster.IsMuted()) {
                    return false
                }
            }
            else {
                if (hCaster.IsSilenced()) {
                    return false
                }
            }
        }
        else {
            if (this.IsItem()) {
                if (this.CanBeUsedOutOfInventory()) {
                    return false
                }
                if (!this.IsPassive() && hCaster.IsMuted()) {
                    return false
                }
            }
            else {
                if (!this.IsPassive() && hCaster.IsSilenced()) {
                    return false
                }
                if (this.IsPassive() && hCaster.PassivesDisabled()) {
                    return false
                }
            }
        }
        return true

    }

    /**
     * 创建一个物品给单位，如果单位身上没地方放了，就扔在他附近随机位置
     * @param this
     * @param hUnit
     * @returns
     */
    static CreateOneToUnit<T extends typeof BaseItem_Plus>(this: T, hUnit: BaseNpc_Plus, itemname: string = null): InstanceType<T> {
        let player = hUnit.GetPlayerOwner();
        if (itemname == null) {
            itemname = this.name;
        }
        let hItem = CreateItem(itemname, player, player) as BaseItem_Plus;
        hItem.SetPurchaseTime(0);
        hUnit.AddItem(hItem);
        if (GameFunc.IsValid(hItem) && hItem.GetParent() != hUnit && hItem.GetContainer() == null) {
            hItem.SetParent(hUnit, "");
            hItem.CreateItemOnPositionRandom(hUnit.GetAbsOrigin());
        }
        return hItem as InstanceType<T>;
    }

    static findInUnit<T extends typeof BaseItem_Plus>(this: T, hUnit: BaseNpc_Plus): InstanceType<T> {
        let item = hUnit.FindItemInInventory(this.name);
        return item as InstanceType<T>;
    }

    /**
     * 在地面创建道具
     * @param vCenter
     * @param hItem
     * @returns
     */
    CreateItemOnPositionRandom(vCenter: Vector) {
        let vPosition = (vCenter + RandomVector(125)) as Vector;
        let hContainer = CreateItemOnPositionForLaunch(vPosition, this);
        return hContainer;
    }
}
