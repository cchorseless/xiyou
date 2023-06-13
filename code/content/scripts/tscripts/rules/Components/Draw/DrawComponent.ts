
import { EventHelper } from "../../../helper/EventHelper";
import { CombinationConfig } from "../../../shared/CombinationConfig";
import { DrawConfig } from "../../../shared/DrawConfig";
import { GameProtocol } from "../../../shared/GameProtocol";
import { PublicBagConfig } from "../../../shared/PublicBagConfig";
import { ET, serializeETProps } from "../../../shared/lib/Entity";
import { TimeUtils } from "../../../shared/lib/TimeUtils";
import { TBattleTeamRecord } from "../../../shared/service/battleteam/TBattleTeamRecord";
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
    tLastSects: { select: string, result: string[] };
    tLastArtifacts: { itemEntity: IBaseItem_Plus, drawtype: DrawConfig.EDrawType, result: string[] };
    tLastEquips: { itemEntity: IBaseItem_Plus, drawtype: DrawConfig.EDrawType, result: string[] };
    tLastEnemys: TBattleTeamRecord[] = [];




    onAwake(...args: any[]): void {
        this.SyncClient(true, true);
    }
    OnRound_Start(round: ERoundBoard) {
        // 开局抽流派
        if (round.config.roundIndex == 1) {
            GTimerHelper.AddTimer(1, GHandler.create(this, () => {
                this.DrawStartSect();
            }));
            return
        }
        // 抽敌人
        else if (round.config.randomEnemy) {
            GTimerHelper.AddTimer(1, GHandler.create(this, () => {
                this.DrawEnemy(round);
            }));
            return
        }
        // 抽棋子
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
    OnRound_Prize(round: ERoundBoard) {


    }
    OnRound_WaitingEnd() { }


    drawEnemyTimer: TimeUtils.TimerTask;

    /**抽本局对手 */
    async DrawEnemy(round: ERoundBoard, onlyfakerdata: boolean = false) {
        const EnemyCount = 3;
        const roundIndex = round.config.roundIndex;
        let playeroot = GGameScene.GetPlayer(this.BelongPlayerid);
        const RoundCharpter = GGameServiceSystem.GetInstance().getDifficultyNumberDes();
        const score = playeroot.BuildingManager().GetBuildingTeamScore();
        const data: any[] = [];
        if (onlyfakerdata == false) {
            const cbdata: H2C_CommonResponse = await playeroot.PlayerHttpComp().PostAsync(GameProtocol.Protocol.DrawEnemy_GetEnemyInfo, {
                RoundIndex: roundIndex,
                RoundCharpter: RoundCharpter,
                EnemyCount: EnemyCount,
                Score: score,
            });
            if (cbdata.Error == 0) {
                let msgcb: any[] = json.decode(cbdata.Message)[0];
                for (let i = 0, len = msgcb.length; i < len; i++) {
                    const child1 = this.tLastEnemys[i] || this.AddChild(TBattleTeamRecord);
                    this.tLastEnemys[i] = child1;
                    const info = msgcb[i];
                    child1.DBServerEntityId = info._id;
                    child1.SteamAccountId = info.SteamAccountId;
                    child1.SteamAccountName = info.SteamAccountName;
                    child1.RoundIndex = info.RoundIndex;
                    child1.RoundCharpter = info.RoundCharpter;
                    child1.Score = info.Score;
                    child1.BattleWinCount = info.BattleWinCount;
                    child1.BattleLoseCount = info.BattleLoseCount;
                    child1.BattleDrawCount = info.BattleDrawCount;
                    child1.SectInfo = info.SectInfo;
                    child1.UnitInfo = info.UnitInfo;
                    child1.UnitInfo.forEach(enemyinfo => {
                        enemyinfo.OnlyKey = round.RandomEnemyPrizeId();
                    })
                    data.push(child1.toJsonObject())
                }
            }
        }
        // 数量不足
        const leftEnemycount = EnemyCount - data.length
        if (leftEnemycount > 0) {
            const allenemyInfo = GJSONConfig.RoundEnemyPoolConfig.getDataList().filter((v) => {
                return v.roundMin <= roundIndex && v.roundMax >= roundIndex;
            });
            const allenemy = GFuncRandom.RandomArray(allenemyInfo, EnemyCount, false);
            for (let i = 0; i < EnemyCount; i++) {
                if (data[i]) { continue; }
                const child1 = this.tLastEnemys[i] || this.AddChild(TBattleTeamRecord);
                this.tLastEnemys[i] = child1;
                const info = allenemy[i];
                child1.DBServerEntityId = "-1";
                child1.SteamAccountId = info.accountid;
                child1.SteamAccountName = info.playername;
                child1.RoundIndex = roundIndex;
                child1.RoundCharpter = RoundCharpter;
                child1.Score = info.battlescore;
                child1.BattleWinCount = RandomInt(100, 200);
                child1.BattleLoseCount = RandomInt(100, 200);
                child1.BattleDrawCount = RandomInt(100, 200);
                child1.SectInfo = info.sectinfo;
                child1.UnitInfo = [];
                info.enemyinfo.forEach((v) => {
                    child1.UnitInfo.push({
                        OnlyKey: round.RandomEnemyPrizeId(),
                        UnitName: v.unitname,
                        Level: v.level,
                        Star: v.star,
                        PosX: v.positionX,
                        PosY: v.positionY,
                        WearBundleId: v.WearBundleId,
                        EquipInfo: [v.itemslot1, v.itemslot2, v.itemslot3, v.itemslot4, v.itemslot5, v.itemslot6],
                        Buffs: (v.spawnBuff || "").split("|"),
                    })
                });
                data.push(child1.toJsonObject())
            }
        }
        EventHelper.fireProtocolEventToPlayer(DrawConfig.EProtocol.DrawEnemyNotice, { data: data }, this.BelongPlayerid);
        // 阵容倒计时
        if (this.drawEnemyTimer) {
            this.drawEnemyTimer.Clear();
            this.drawEnemyTimer = null;
        }
        this.drawEnemyTimer = GTimerHelper.AddTimer(DrawConfig.DrawEnemyWaitingTime, GHandler.create(this, () => {
            if (this.drawEnemyTimer && this.tLastEnemys.length > 0) {
                const index = RandomInt(0, this.tLastEnemys.length - 0.5)
                const team = this.tLastEnemys[index];
                this.OnSelectEnemy(index, team.SteamAccountId);
            }

        }))
    }

    //  开局抽流派
    DrawStartSect() {
        let r = GFuncRandom.RandomArray(CombinationConfig.ESectNameList, 3, false);
        this.tLastSects = { select: r[0], result: r };
        EventHelper.fireProtocolEventToPlayer(DrawConfig.EProtocol.DrawSectNotice, { data: r }, this.BelongPlayerid);

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

    // 开局选流派
    OnSelectSect(index: number, sectName: string): boolean {
        let playerroot = GGameScene.GetPlayer(this.BelongPlayerid);
        if (!playerroot.CheckIsAlive()) {
            GNotificationSystem.ErrorMessage("hero is death")
            return false;
        }
        if (!this.tLastSects || !this.tLastSects.result) {
            GNotificationSystem.ErrorMessage("data error")
            return false;
        }
        // 随机抽取
        if (index == -1 || sectName == null) {
            sectName = null;
            for (let i = 0; i < 10; i++) {
                let r = GFuncRandom.RandomArray(CombinationConfig.ESectNameList, 10, false);
                for (let otheritem of r) {
                    if (!this.tLastSects.result.includes(otheritem)) {
                        sectName = otheritem;
                        break;
                    }
                }
                if (sectName) {
                    break;
                }
            }
        }
        else if (this.tLastSects.result[index] !== sectName) {
            GNotificationSystem.ErrorMessage("index error")
            return false;
        }
        if (!sectName) {
            GNotificationSystem.ErrorMessage("sectName is invalid")
            return false
        }
        this.tLastSects.select = sectName;
        let allhero = GFuncRandom.RandomArray(GJsonConfigHelper.GetAllHeroBySectLabel(sectName), 2, false);
        allhero.forEach(heroname => {
            playerroot.BuildingManager().addBuilding(heroname, true, 0);
        })
        return true;
    }

    /**
     * 选对手
     * @param index 
     * @param sCardName 
     * @returns 
     */
    OnSelectEnemy(index: number, accountid: string): boolean {
        if (this.drawEnemyTimer == null) { return }
        // 清除计时器
        this.drawEnemyTimer.Clear();
        this.drawEnemyTimer = null;
        let playerroot = GGameScene.GetPlayer(this.BelongPlayerid);
        if (!playerroot.CheckIsAlive()) {
            GNotificationSystem.ErrorMessage("hero is death")
            return false;
        }
        if (!this.tLastEnemys || !this.tLastEnemys[index]) {
            GNotificationSystem.ErrorMessage("data error")
            return false;
        }
        const battleteam = this.tLastEnemys[index];
        if (battleteam.SteamAccountId !== accountid) {
            GNotificationSystem.ErrorMessage("index error")
            return false;
        }
        const round = playerroot.RoundManagerComp().getCurrentBoardRound();
        round.CreateDrawEnemy(battleteam, playerroot.FakerHeroRoot().SpawnEffect);
        return true;
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
