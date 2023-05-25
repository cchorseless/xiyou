
import { EventHelper } from "../../../helper/EventHelper";
import { DrawConfig } from "../../../shared/DrawConfig";
import { PublicBagConfig } from "../../../shared/PublicBagConfig";
import { ET, serializeETProps } from "../../../shared/lib/Entity";
import { ItemEntityRoot } from "../Item/ItemEntityRoot";
import { ERoundBoard } from "../Round/ERoundBoard";

@GReloadable
export class DrawComponent extends ET.Component implements IRoundStateCallback {


    @serializeETProps()
    tLastCards: string[] = [];
    @serializeETProps()
    tWashCards: string[] = [];
    /**锁定详情 */
    tLockChess: { [k: string]: string } = {}

    tLastArtifacts: { itemEntity: IBaseItem_Plus, drawtype: DrawConfig.EDrawType, result: string[] };
    tLastEquips: { itemEntity: IBaseItem_Plus, drawtype: DrawConfig.EDrawType, result: string[] };


    onAwake(...args: any[]): void {
        this.SyncClient(true, true);
    }
    OnRound_Start(round: ERoundBoard) {
        let Hero = GGameScene.GetPlayer(this.BelongPlayerid).Hero;
        if (Hero) {
            // 1秒后抽卡
            GTimerHelper.AddTimer(1, GHandler.create(this, () => {
                let ability_c = Hero.findAbliityPlus("courier_draw_card_v3")
                if (ability_c && ability_c.IsActivated()) {
                    this.DrawCard(DrawConfig.EDrawType.DrawCardV3, 4);
                    return;
                }
                let ability_b = Hero.findAbliityPlus("courier_draw_card_v2")
                if (ability_b && ability_c.IsActivated()) {
                    this.DrawCard(DrawConfig.EDrawType.DrawCardV2, 4);
                    return;
                }
                let ability_a = Hero.findAbliityPlus("courier_draw_card_v1")
                if (ability_a && ability_a.IsActivated()) {
                    this.DrawCard(DrawConfig.EDrawType.DrawCardV1, 4);
                    return;
                }
            }));
        }

    }
    OnRound_Battle() { }
    OnRound_Prize(round: ERoundBoard) { }
    OnRound_WaitingEnd() { }
    //  开局抽卡
    DrawStartCard() {
        // this.DrawCard(DrawConfig.EDrawType.DrawCardV1, 4);
    }
    //  抽神器
    DrawArtifact(itemEntity: IBaseItem_Plus, sReservoirName: DrawConfig.EDrawType, iNum: number) {
        if (!IsValid(itemEntity)) {
            return;
        }
        let r = GDrawSystem.GetInstance().Draw(sReservoirName, iNum);
        GLogHelper.print("DrawArtifact", r)
        this.tLastArtifacts = { itemEntity: itemEntity, drawtype: sReservoirName, result: r };
        // 通知客户端
        EventHelper.fireProtocolEventToPlayer(DrawConfig.EProtocol.DrawArtifactNotice, { data: r }, this.BelongPlayerid);
    }
    //  抽装备
    DrawEquip(itemEntity: IBaseItem_Plus, sReservoirName: DrawConfig.EDrawType, iNum: number) {
        if (!IsValid(itemEntity)) {
            return;
        }
        let r = GDrawSystem.GetInstance().Draw(sReservoirName, iNum);
        GLogHelper.print("DrawEquip", r)
        this.tLastEquips = { itemEntity: itemEntity, drawtype: sReservoirName, result: r };
        // 通知客户端
        EventHelper.fireProtocolEventToPlayer(DrawConfig.EProtocol.DrawEquipNotice, { data: r }, this.BelongPlayerid);
    }


    //  抽卡
    DrawCard(sReservoirName: DrawConfig.EDrawType, iNum: number) {
        this.tLastCards = GDrawSystem.GetInstance().Draw(sReservoirName, iNum);
        this.SyncClient(true, true);
        // 通知客户端
        EventHelper.fireProtocolEventToPlayer(DrawConfig.EProtocol.DrawCardNotice, null, this.BelongPlayerid);
    }
    /**
     * 特殊抽卡 
     * @param poolid 
     * @param iNum 
     */
    SpeDrawCard(poolid: number, iNum: number) {
        this.tLastCards = GDrawSystem.GetInstance().SpeDrawCard(poolid, iNum);
        this.SyncClient(true, true);
        // 通知客户端
        EventHelper.fireProtocolEventToPlayer(DrawConfig.EProtocol.DrawCardNotice, null, this.BelongPlayerid);
    }


    OnSelectCard(index: number, unitName: string, b2Public: number = 0): boolean {
        let player = GGameScene.GetPlayer(this.BelongPlayerid);
        if (!player.CheckIsAlive()) {
            GNotificationSystem.ErrorMessage("hero is death")
            return false;
        }
        if (this.tLastCards[index] !== unitName) {
            GNotificationSystem.ErrorMessage("index error")
            return false;
        }
        if (b2Public != 0) {
            let publicbag = GPublicBagSystem.GetInstance();
            if (publicbag.IsEmpty()) {
                let itemroot = publicbag.addBuildingItem(this.BelongPlayerid, unitName);
                if (itemroot == null) {
                    GNotificationSystem.ErrorMessage("itemcreate fail")
                    return false;
                }
                else {
                    // todo 通知
                }
            }
            else {
                GNotificationSystem.ErrorMessage("PublicBag is full")
                return false;
            }
        }
        else {
            let building = player.BuildingManager().addBuilding(unitName);
            if (building == null) {
                GNotificationSystem.ErrorMessage("buy fail")
                return false;
            }
        }
        if (DrawConfig.BOnlySelectOnce) {
            this.tLastCards = [];
            this.tLockChess = {};
        }
        else {
            this.tLastCards[index] = null;
            delete this.tLockChess[index + ""];
        }
        this.SyncClient(true, true);
        GDrawSystem.GetInstance().RegUseCard(unitName, true);
        return true;
    }

    // 开局选卡
    OnStartCardSelected(index: number, sCardName: string): boolean {
        if (!GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid).CheckIsAlive()) {
            GNotificationSystem.ErrorMessage("hero is death")
            return false;
        }
        return true;
    }


    OnRedrawStartCard(index: number, sCardName: string): boolean {
        if (!GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid).CheckIsAlive()) {
            GNotificationSystem.ErrorMessage("hero is death")
            return false;
        }
        return true;
        // let iPlayerID = events.PlayerID;
        // let iRedraw = this.tReDrawChance[iPlayerID] || 0;
        // if (iRedraw > 0) {
        //     this.tReDrawChance[iPlayerID] = iRedraw - 1;
        //     this.DrawStartCard(iPlayerID);
        // }
    }

    OnLockChess(index: number, sCardName: string, block: 0 | 1): boolean {
        if (!GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid).CheckIsAlive()) {
            GNotificationSystem.ErrorMessage("hero is death")
            return false;
        }
        if (block == 0) {
            delete this.tLockChess[index + ""];
        }
        else {
            this.tLockChess[index + ""] = sCardName;
        }
        return true;
    }


    OnAdd2WishList(sCardName: string, isadd: 0 | 1): boolean {
        if (!GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid).CheckIsAlive()) {
            GNotificationSystem.ErrorMessage("hero is death")
            return false;
        }
        if (sCardName == null || sCardName == "") {
            GNotificationSystem.ErrorMessage("sCardName is invalid")
            return false;
        }
        if (isadd == 1) {
            if (this.tWashCards.length >= DrawConfig.iWashCardMax) {
                GNotificationSystem.ErrorMessage("washcard is full")
                return false;
            }
            if (this.tWashCards.includes(sCardName)) {
                GNotificationSystem.ErrorMessage("washcard has this card")
                return false;
            }
            this.tWashCards.push(sCardName);
        }
        else {
            this.tWashCards.splice(this.tWashCards.indexOf(sCardName), 1);
        }
        this.SyncClient(true, true);
        return true;

    }

    OnSelectAtrifact(index: number, itemname: string): boolean {
        let playerroot = GGameScene.GetPlayer(this.BelongPlayerid);
        if (!playerroot.CheckIsAlive()) {
            GNotificationSystem.ErrorMessage("hero is death")
            return false;
        }
        if (!this.tLastArtifacts || !this.tLastArtifacts.result) {
            GNotificationSystem.ErrorMessage("data error")
            return false;
        }
        let useitem = this.tLastArtifacts.itemEntity;
        if (!IsValid(useitem) || !useitem.IsInInventory()) {
            GNotificationSystem.ErrorMessage("cant find itemEntity in inventory")
            return false;
        }
        // 随机抽取
        if (index == -1 || itemname == null) {
            itemname = null;
            for (let i = 0; i < 10; i++) {
                let r = GDrawSystem.GetInstance().Draw(this.tLastArtifacts.drawtype, 10);
                for (let otheritem of r) {
                    if (!this.tLastArtifacts.result.includes(otheritem)) {
                        itemname = otheritem;
                        break;
                    }
                }
                if (itemname) {
                    break;
                }
            }
        }
        else if (this.tLastArtifacts.result[index] !== itemname) {
            GNotificationSystem.ErrorMessage("index error")
            return false;
        }
        if (!itemname) {
            GNotificationSystem.ErrorMessage("itemname is invalid")
            return false
        }
        useitem.GetParentPlus().TakeItem(useitem);
        SafeDestroyItem(useitem);
        let itemEntity = playerroot.Hero.CreateOneItem(itemname);
        ItemEntityRoot.Active(itemEntity);
        let CourierBagComp = playerroot.CourierRoot().CourierBagComp();
        if (CourierBagComp.IsItemEmpty(PublicBagConfig.EBagSlotType.ArtifactSlot)) {
            playerroot.CourierRoot().CourierBagComp().putInItem(itemEntity.ETRoot as ItemEntityRoot, PublicBagConfig.EBagSlotType.ArtifactSlot)
        }
        else {
            playerroot.PlayerDataComp().ModifyGold(5000);
            this.tLastArtifacts = null;
            GNotificationSystem.ErrorMessage("artifact is full , auto change to 5000 gold")
            return false;
        }
        this.tLastArtifacts = null;
        return true;
    }
    OnSelectEquip(index: number, itemname: string): boolean {
        let playerroot = GGameScene.GetPlayer(this.BelongPlayerid);
        if (!playerroot.CheckIsAlive()) {
            GNotificationSystem.ErrorMessage("hero is death")
            return false;
        }
        if (!this.tLastEquips || !this.tLastEquips.result) {
            GNotificationSystem.ErrorMessage("data error")
            return false;
        }
        let useitem = this.tLastEquips.itemEntity;
        if (!IsValid(useitem) || !useitem.IsInInventory()) {
            GNotificationSystem.ErrorMessage("cant find itemEntity in inventory")
            return false;
        }
        // 随机抽取
        if (index == -1 || itemname == null) {
            itemname = null;
            for (let i = 0; i < 10; i++) {
                let r = GDrawSystem.GetInstance().Draw(this.tLastEquips.drawtype, 10);
                for (let otheritem of r) {
                    if (!this.tLastEquips.result.includes(otheritem)) {
                        itemname = otheritem;
                        break;
                    }
                }
                if (itemname) {
                    break;
                }
            }
        }
        else if (this.tLastEquips.result[index] !== itemname) {
            GNotificationSystem.ErrorMessage("index error")
            return false;
        }
        if (!itemname) {
            GNotificationSystem.ErrorMessage("itemname is invalid")
            return false;
        }
        useitem.GetParentPlus().TakeItem(useitem);
        SafeDestroyItem(useitem);
        GTimerHelper.AddFrameTimer(1, GHandler.create(this, () => {
            playerroot.Hero.AddItemOrInGround(itemname);
        }))
        this.tLastEquips = null;
        return true;
    }
}
