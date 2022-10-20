import { reloadable } from "../../../GameCache";
import { GameFunc } from "../../../GameFunc";
import { EventHelper } from "../../../helper/EventHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { BaseItem_Plus } from "../../../npc/entityPlus/BaseItem_Plus";
import { ET, serializeETProps } from "../../Entity/Entity";
import { DrawConfig } from "../../System/Draw/DrawConfig";
import { PlayerEntityRoot } from "../Player/PlayerEntityRoot";
import { PlayerScene } from "../Player/PlayerScene";

@reloadable
export class DrawComponent extends ET.Component {
    @serializeETProps()
    tLastCards: string[] = [];

    onAwake(...args: any[]): void {
        this.Domain.ETRoot.AsPlayer().SyncClientEntity(this);
    }

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
            let poolid = KVHelper.RandomPoolGroupConfig("" + sReservoirName);
            let itemid = KVHelper.RandomPoolConfig("" + poolid);
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
                        poolid = KVHelper.RandomPoolGroupConfig("" + sReservoirName);
                        itemid = KVHelper.RandomPoolConfig("" + poolid);
                        if (!r_arr.includes(itemid)) {
                            r_arr.push(itemid);
                            break;
                        }
                    }
                }
            }
        }
        this.tLastCards = [].concat(r_arr);
        let playerid = this.Domain.ETRoot.AsPlayer().Playerid;
        this.Domain.ETRoot.AsPlayer().SyncClientEntity(this);
        EventHelper.fireProtocolEventToPlayer(DrawConfig.EProtocol.DrawCardResult, null, playerid);
    }

    OnSelectCard(index: number, unitName: string, b2Public: number = 0): [boolean, string] {
        let player = this.GetDomain<PlayerScene>().ETRoot;
        if (!player.CheckIsAlive()) {
            return [false, "hero is death"];
        }
        if (this.tLastCards[index] !== unitName) {
            return [false, "index error"];
        }
        if (b2Public != 0) {
            let publicbag = GameRules.Addon.ETRoot.PublicBagSystem();
            if (publicbag.IsEmpty()) {
                let itemroot = publicbag.addBuildingItem(unitName);
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
        this.Domain.ETRoot.AsPlayer().SyncClientEntity(this);
        return [true, ""];
    }
    //  选卡
    OnSelectCard2(index: number, unitName: string, b2Public: boolean = false): [boolean, string] {
        if (!this.Domain.ETRoot.AsPlayer().CheckIsAlive()) {
            return [false, "hero is death"];
        }
        if (this.tLastCards[index] !== unitName) {
            return [false, "index error"];
        }
        let cardItemName = KVHelper.KvServerConfig.building_unit_tower[unitName].CardName;
        // let hItem = BaseItem_Plus.CreateOneToUnit(this.GetDomain<BaseNpc_Hero_Plus>(), cardItemName);
        let hItem = this.GetDomain<PlayerScene>().ETRoot.Hero.AddItemByName(cardItemName);
        // hItem.OnSpellStart()
        if (GameFunc.IsValid(hItem) && b2Public) {
            // Items.TryMoveEmptyPublic(iPlayerID, hHero, hItem);
            this.tLastCards = [];
        }
        // let bFreeTake = this.tPlayerCards[iPlayerID].bFreeTake;
        // let index = TableFindKey(this.tPlayerCards[iPlayerID].tTower, sTowerName);
        // if (index != null) {
        //     //  VIP限定卡牌
        //     if (this.tPlayerCards[iPlayerID].tVipCards && this.tPlayerCards[iPlayerID].tVipCards[index] == 1 && !PlayerProperty.HasPlus(iPlayerID)) {
        //         ErrorMessage(iPlayerID, "dota_hud_error_card_need_VIP");
        //         return;
        //     }
        //     let sCardName = Card.Tower2CardName(sTowerName);
        //     let iCost = GetItemCost(sCardName);
        //     if (!bFreeTake && PlayerData.GetGold(iPlayerID) < iCost) {
        //         ErrorMessage(iPlayerID, "DOTA_Hud_NeedMoreGold");
        //         return;
        //     }
        //     if (!bFreeTake) {
        //         PlayerData.ModifyGold(iPlayerID, -iCost);
        //     }

        //     let hItem = hHero.GiveItem(sCardName);
        //     if (GameFunc.IsValid(hItem) && b2Public) {
        //         Items.TryMoveEmptyPublic(iPlayerID, hHero, hItem);
        //     }

        //     //  if ( Card.GetCardRarity(sCardName) == "ssr" ) {
        //     //  	CustomGameEventManager.Send_ServerToAllClients("show_drawing", { name = sCardName })
        //     //  } else if ( Card.GetCardRarity(sCardName) == "sr" ) {
        //     //  	CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(iPlayerID), "show_drawing", { name = sCardName })
        //     //  }
        //     this.tPlayerCards[iPlayerID] = {};
        //     this.tReDrawChance[iPlayerID] = 0;
        //     this.tLastCards[iPlayerID] = {};
        //     this.UpdateNetTables();
        // }
        this.Domain.ETRoot.AsPlayer().SyncClientEntity(this);
        return [true, ""];
    }
    // 开局选卡
    OnStartCardSelected(index: number, sCardName: string): [boolean, string] {
        if (!this.Domain.ETRoot.AsPlayer().CheckIsAlive()) {
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

    OnSelectCard2Public(index: number, sCardName: string): [boolean, string] {
        if (!this.Domain.ETRoot.AsPlayer().CheckIsAlive()) {
            return [false, "hero is death"];
        }
        return [true, ""];
        // let iPlayerID = events.PlayerID;
        // let cardName = events.card_name || "";
        // this.SelectCard(iPlayerID, cardName, true);
    }
    OnRedrawStartCard(index: number, sCardName: string): [boolean, string] {
        if (!this.Domain.ETRoot.AsPlayer().CheckIsAlive()) {
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
        if (!this.Domain.ETRoot.AsPlayer().CheckIsAlive()) {
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
        if (!this.Domain.ETRoot.AsPlayer().CheckIsAlive()) {
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
        if (!this.Domain.ETRoot.AsPlayer().CheckIsAlive()) {
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
