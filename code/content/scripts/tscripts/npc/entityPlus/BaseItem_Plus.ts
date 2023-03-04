import { ResHelper } from "../../helper/ResHelper";
import { BaseItem } from "./Base_Plus";

export class BaseItem_Plus extends BaseItem {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__: string;
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: any;
    /**使用报错提示信息 */
    public errorStr: string;

    /**
     * @client
     * @returns 
     */
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

    /**获取作用归属NPC，在谁身上 
     * @Server
    */
    GetParentPlus() {
        return this.GetParent() as IBaseNpc_Plus;
    }

    /**自己给自己施法的 
     * @Server
    */
    IsCastBySelf() {
        return this.GetCasterPlus().GetEntityIndex() == this.GetOwnerPlus().GetEntityIndex();
    }

    CanGiveToNpc(npc: IBaseNpc_Plus) {
        // let hPurchaser = this.GetPurchaser();
        // if (GFuncEntity.IsValid(hPurchaser)) {
        //     if( )
        // }
        // let iPurchaserID = IsValid(hPurchaser) and hPurchaser: GetPlayerOwnerID() or - 1
        // let bSamePlayer = iPurchaserID == -1 or (PlayerResource: IsValidPlayerID(iPlayerID) and iPlayerID == iPurchaserID)

        // if (not bSamePlayer) and(not hItem: IsCustomShareable()) then
        // ErrorMessage(iPlayerID, "dota_hud_error_not_shareable")
        // return false
        // end
        if (GFuncEntity.IsValid(this) &&
            GFuncEntity.IsValid(npc) &&
            this.IsDroppable() &&
            this.CanUnitPickUp(npc) &&
            npc.IsAlive() &&
            npc.IsRealUnit() &&
            npc.HasInventory()
        ) {
            return true;
        }
        return false;
    }

    /**尝试智能施法,AI会调用 */
    public AutoSpellSelf(): boolean { return true };
    /**
       * 技能施法可以释放
       * @returns
       */
    // public IsItemReady(): boolean {
    //     let hCaster = this.GetCaster()
    //     let iBehavior = this.GetBehaviorInt()
    //     if (this.IsHidden()) {
    //         return false
    //     }
    //     if (!hCaster) {
    //         return false
    //     }
    //     if (!(this.IsFullyCastable() && this.IsActivated() && this.IsCooldownReady() && this.GetLevel() > 0 && this.IsOwnersManaEnough())) {
    //         return false
    //     }
    //     if (hCaster.IsHexed() || hCaster.IsCommandRestricted()) {
    //         return false
    //     }
    //     // 被控是否可以施法
    //     if (hCaster.IsStunned() && !GameFunc.IncludeArgs(iBehavior, DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_PSEUDO_QUEUE)[0]) {
    //         return false
    //     }
    //     if (hCaster.IsChanneling() && !GameFunc.IncludeArgs(iBehavior, DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL)[0]) {
    //         return false
    //     }
    //     if (IsServer()) {
    //         if (hCaster.IsMuted()) {
    //             return false
    //         }
    //     }
    //     else {
    //         if (this.CanBeUsedOutOfInventory()) {
    //             return false
    //         }
    //         if (!this.IsPassive() && hCaster.IsMuted()) {
    //             return false
    //         }
    //     }
    //     return true

    // }
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
declare global {
    type IBaseItem_Plus = BaseItem_Plus;
}