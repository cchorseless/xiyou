
import { EventHelper } from "../../../helper/EventHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { DrawConfig } from "../../../shared/DrawConfig";
import { ET, serializeETProps } from "../../../shared/lib/Entity";
import { ERoundBoard } from "../Round/ERoundBoard";

@GReloadable
export class DrawComponent extends ET.Component implements IRoundStateCallback {
    @serializeETProps()
    tLastCards: string[] = [];

    onAwake(...args: any[]): void {
        this.SyncClient();
    }
    OnRound_Start(round: ERoundBoard) { }
    OnRound_Battle() { }
    OnRound_Prize(round: ERoundBoard) { }
    OnRound_WaitingEnd() { }
    //  开局抽卡
    DrawStartCard() {
        // let sReservoirName = "draw_card_start";
        // let iNum = START_DRAW_CARD_NUM;
        // let tTowers = {};
        // let tVipCards = {};
        // let vipReservoir = "draw_card_start_vip";
        // for (let i = 1; i <= VIP_Start_Draw_Card; i++) {
        //     let sCardName = this.DrawDouble(vipReservoir);
        //     let sTowerName = Card.Card2TowerName(sCardName);
        //     while (TableFindKey(tTowers, sTowerName) != null) {
        //         sCardName = this.DrawDouble(vipReservoir);
        //         sTowerName = Card.Card2TowerName(sCardName);
        //     }
        //     table.insert(tTowers, sTowerName);
        //     tVipCards[tTowers.length] = 1;
        // }
        // for (let i = 1; i <= iNum; i++) {
        //     let sCardName = this.DrawDouble(sReservoirName);
        //     let sTowerName = Card.Card2TowerName(sCardName);
        //     while (TableFindKey(tTowers, sTowerName) != null) {
        //         sCardName = this.DrawDouble(sReservoirName);
        //         sTowerName = Card.Card2TowerName(sCardName);
        //     }
        //     table.insert(tTowers, sTowerName);
        // }
        // this.tPlayerCards[iPlayerID] = { tTower = tTowers, tVipCards = tVipCards, bFreeTake = true };
        // this.UpdateNetTables();
        this.DrawCard(DrawConfig.EDrawCardType.DrawCardV1, 4);
    }

    //  抽卡
    DrawCard(sReservoirName: DrawConfig.EDrawCardType, iNum: number) {
        let r_arr: string[] = [];
        for (let i = 0; i < iNum; i++) {
            let itemid = KVHelper.RandomPoolGroupConfig("" + sReservoirName);
            if (!r_arr.includes(itemid)) {
                r_arr.push(itemid);
            } else {
                let tryTimes = 5;
                while (tryTimes > 0) {
                    tryTimes--;
                    if (tryTimes == 0) {
                        r_arr.push(itemid);
                        break;
                    } else {
                        itemid = KVHelper.RandomPoolGroupConfig("" + sReservoirName);
                        if (!r_arr.includes(itemid)) {
                            r_arr.push(itemid);
                            break;
                        }
                    }
                }
            }
        }
        this.tLastCards = [].concat(r_arr);
        this.SyncClient();
        // 通知客户端
        EventHelper.fireProtocolEventToPlayer(DrawConfig.EProtocol.DrawCardResult, null, this.BelongPlayerid);
    }

    OnSelectCard(index: number, unitName: string, b2Public: number = 0): [boolean, string] {
        let player = GGameScene.GetPlayer(this.BelongPlayerid);
        if (!player.CheckIsAlive()) {
            return [false, "hero is death"];
        }
        if (this.tLastCards[index] !== unitName) {
            return [false, "index error"];
        }
        if (b2Public != 0) {
            let publicbag = GPublicBagSystem.GetInstance();
            if (publicbag.IsEmpty()) {
                let itemroot = publicbag.addBuildingItem(this.BelongPlayerid, unitName);
                if (itemroot == null) {
                    return [false, "itemcreate fail"];
                }
                else {
                    // todo 通知
                }
            }
            else {
                return [false, "PublicBag is full"];
            }
        }
        else {
            let building = player.BuildingManager().addBuilding(unitName);
            if (building == null) {
                return [false, "buy fail"];
            }
        }
        this.tLastCards[index] = null;
        this.SyncClient();
        return [true, ""];
    }

    // 开局选卡
    OnStartCardSelected(index: number, sCardName: string): [boolean, string] {
        if (!GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid).CheckIsAlive()) {
            return [false, "hero is death"];
        }
        return [true, ""];
        // let iPlayerID = events.PlayerID;
        // let sCardName = events.card_name;
        // let bFreeTake = this.tPlayerCards[iPlayerID].bFreeTake;
        // if (!bFreeTake) {
        //     return;
        // }
        // this.tPlayerCards[iPlayerID].bFreeTake = false;

        // let hItem = hHero.GiveItem(sCardName);

        // Service.UseConsumable(iPlayerID, "410009", 1);

        // this.tPlayerCards[iPlayerID] = {};
        // this.tReDrawChance[iPlayerID] = 0;
        // this.tLastCards[iPlayerID] = {};
        // this.UpdateNetTables();
    }


    OnRedrawStartCard(index: number, sCardName: string): [boolean, string] {
        if (!GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid).CheckIsAlive()) {
            return [false, "hero is death"];
        }
        return [true, ""];
        // let iPlayerID = events.PlayerID;
        // let iRedraw = this.tReDrawChance[iPlayerID] || 0;
        // if (iRedraw > 0) {
        //     this.tReDrawChance[iPlayerID] = iRedraw - 1;
        //     this.DrawStartCard(iPlayerID);
        // }
    }
    OnAdd2WishList(index: number, sCardName: string): [boolean, string] {
        if (!GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid).CheckIsAlive()) {
            return [false, "hero is death"];
        }
        return [true, ""];
        // let iPlayerID = events.PlayerID;
        // let sTowerName = events.tower;
        // if (this.tWishList[iPlayerID] == null) {
        //     this.tWishList[iPlayerID] = {};
        // }
        // if (TableFindKey(this.tWishList[iPlayerID], sTowerName)) {
        //     return;
        // }
        // table.insert(this.tWishList[iPlayerID], sTowerName);
        // if (MaxWishCard == null) {
        //     MaxWishCard = 5;
        // }
        // while (this.tWishList.length[iPlayerID] > MaxWishCard) {
        //     table.remove(this.tWishList[iPlayerID], 1);
        // }
        // this.UpdateNetTables();
    }
    OnRemoveWishList(index: number, sCardName: string): [boolean, string] {
        if (!GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid).CheckIsAlive()) {
            return [false, "hero is death"];
        }
        return [true, ""];
        // let iPlayerID = events.PlayerID;
        // let sTowerName = events.tower;
        // if (this.tWishList[iPlayerID] == null) {
        //     this.tWishList[iPlayerID] = {};
        // }
        // ArrayRemove(this.tWishList[iPlayerID], sTowerName);
        // this.UpdateNetTables();
    }
    OnToggleWishList(index: number, sCardName: string): [boolean, string] {
        if (!GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid).CheckIsAlive()) {
            return [false, "hero is death"];
        }
        return [true, ""];
        // let iPlayerID = events.PlayerID;
        // let sTowerName = events.tower;
        // if (this.tWishList[iPlayerID] == null) {
        //     this.tWishList[iPlayerID] = {};
        // }
        // if (TableFindKey(this.tWishList[iPlayerID], sTowerName)) {
        //     ArrayRemove(this.tWishList[iPlayerID], sTowerName);
        // } else {
        //     table.insert(this.tWishList[iPlayerID], sTowerName);
        //     if (MaxWishCard == null) {
        //         MaxWishCard = 5;
        //     }
        //     while (this.tWishList.length[iPlayerID] > MaxWishCard) {
        //         table.remove(this.tWishList[iPlayerID], 1);
        //     }
        // }
        // this.UpdateNetTables();
    }
}
