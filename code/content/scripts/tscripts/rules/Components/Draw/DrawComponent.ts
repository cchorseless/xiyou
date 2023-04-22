
import { EventHelper } from "../../../helper/EventHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { DrawConfig } from "../../../shared/DrawConfig";
import { ET, serializeETProps } from "../../../shared/lib/Entity";
import { ERoundBoard } from "../Round/ERoundBoard";

@GReloadable
export class DrawComponent extends ET.Component implements IRoundStateCallback {


    @serializeETProps()
    tLastCards: string[] = [];
    @serializeETProps()
    tWashCards: string[] = [];
    /**锁定详情 */
    tLockChess: { [k: string]: string } = {}

    onAwake(...args: any[]): void {
        this.SyncClient(true, true);
    }
    OnRound_Start(round: ERoundBoard) { }
    OnRound_Battle() { }
    OnRound_Prize(round: ERoundBoard) { }
    OnRound_WaitingEnd() { }
    //  开局抽卡
    DrawStartCard() {
        this.DrawCard(DrawConfig.EDrawCardType.DrawCardV1, 4);
    }

    //  抽卡
    DrawCard(sReservoirName: DrawConfig.EDrawCardType, iNum: number) {
        let r_arr: string[] = [];
        for (let i = 0; i < iNum; i++) {
            let itemid = KVHelper.RandomPoolGroupConfig("" + sReservoirName);
            if (!r_arr.includes(itemid)) {
                r_arr.push(itemid);
            }
            else {
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
        // 锁定
        for (let k in this.tLockChess) {
            let index = GToNumber(k);
            if (this.tLastCards[index]) {
                r_arr[index] = this.tLastCards[index];
            }
        }
        this.tLastCards = r_arr;
        this.SyncClient(true, true);
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
        if (DrawConfig.BOnlySelectOnce) {
            this.tLastCards = [];
            this.tLockChess = {};
        }
        else {
            this.tLastCards[index] = null;
            delete this.tLockChess[index + ""];
        }
        this.SyncClient(true, true);
        return [true, ""];
    }

    // 开局选卡
    OnStartCardSelected(index: number, sCardName: string): [boolean, string] {
        if (!GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid).CheckIsAlive()) {
            return [false, "hero is death"];
        }
        return [true, ""];
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

    OnLockChess(index: number, sCardName: string, block: 0 | 1): [boolean, string] {
        if (!GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid).CheckIsAlive()) {
            return [false, "hero is death"];
        }
        if (block == 0) {
            delete this.tLockChess[index + ""];
        }
        else {
            this.tLockChess[index + ""] = sCardName;
        }
        return [true, ""];
    }


    OnAdd2WishList(sCardName: string, isadd: 0 | 1): [boolean, string] {
        if (!GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid).CheckIsAlive()) {
            return [false, "hero is death"];
        }
        if (sCardName == null || sCardName == "") {
            return [false, "sCardName is invalid"];
        }
        if (isadd == 1) {
            if (this.tWashCards.length >= DrawConfig.iWashCardMax) {
                return [false, "washcard is full"];
            }
            if (this.tWashCards.includes(sCardName)) {
                return [false, "washcard has this card"];
            }
            this.tWashCards.push(sCardName);
        }
        else {
            this.tWashCards.splice(this.tWashCards.indexOf(sCardName), 1);
        }
        this.SyncClient(true, true);
        return [true, ""];

    }


}
