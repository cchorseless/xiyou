import { EventHelper } from "../../helper/EventHelper";
import { HttpHelper } from "../../helper/HttpHelper";
import { GameProtocol } from "../../shared/GameProtocol";
import { GameServiceConfig } from "../../shared/GameServiceConfig";
import { GEventHelper } from "../../shared/lib/GEventHelper";
import { GameServiceSystem } from "../../shared/rules/System/GameServiceSystem";
import { TItem } from "../../shared/service/bag/TItem";
// 英雄选择阶段的数据集合
// 英雄选择阶段只有这个数据集合同步有效
@GReloadable
export class GameServiceSystemComponent extends GameServiceSystem {
    static SelectionTime = 30;
    static SelectionReadyLockTime = 5;

    public onAwake(): void {
        this.addEvent();

    }

    onDebugReload(): void {
        GEventHelper.RemoveCaller(this);
        EventHelper.removeCallerProtocolEvent(this);
        this.addEvent();
    }


    StartGameModeSelection() {
        this.BeforeGameEndTime = GameRules.GetGameTime() + GameServiceSystemComponent.SelectionTime;
        const Allplayerids = GPlayerEntityRoot.GetAllPlayerid();
        Allplayerids.forEach(playerid => {
            this.initPlayerGameSelection(playerid);
        })
        GTimerHelper.AddTimer(0.1, GHandler.create(this, () => {
            if (GameRules.GetGameTime() >= this.BeforeGameEndTime) {
                this.FinishGameModeSelection()
                return
            }
            return 0.1;
        }));
        this.SyncClient()
    }

    FinishGameModeSelection() {
        this.BeforeGameEndTime = -1;
        let iSelectedDifficulty = GameServiceConfig.EDifficultyChapter.endless;
        const allPlayerroot = GPlayerEntityRoot.GetAllOnlinePlayer();
        allPlayerroot.forEach((playerroot) => {
            const data = this.getPlayerGameSelection(playerroot.BelongPlayerid);
            if (data) {
                //  优先低难度
                iSelectedDifficulty = math.min(iSelectedDifficulty, data.Difficulty.Chapter)
            }
            let player = PlayerResource.GetPlayer(playerroot.BelongPlayerid)
            if (player != null) {
                player.SetSelectedHero(GameServiceConfig.DEFAULT_PICKED_HERO)
            }
        })
        this.DifficultyChapter = iSelectedDifficulty;
        if (iSelectedDifficulty == GameServiceConfig.EDifficultyChapter.endless) {
            //  多人无尽选择规则
            let endlesslayer = 1
            allPlayerroot.forEach((playerroot) => {
                const data = this.getPlayerGameSelection(playerroot.BelongPlayerid);
                if (data) {
                    iSelectedDifficulty = math.min(endlesslayer, data.Difficulty.Level)
                }
            })
            this.DifficultyChapter = endlesslayer;
        }
        this.SyncClient()
    }

    addEvent() {
        GEventHelper.AddEvent(GCharacterDataComponent.name, GHandler.create(this, (e: ICharacterDataComponent) => {
            const playerid = e.BelongPlayerid;
            this.initPlayerGameSelection(playerid);
            const data = this.getPlayerGameSelection(playerid);
            data.Difficulty.MaxChapter = e.getDifficultyChapter();
            data.Difficulty.MaxLevel = e.getDifficultyLevel();
            data.Difficulty.Chapter = data.Difficulty.MaxChapter
            data.Difficulty.Level = data.Difficulty.MaxLevel;
            data.Courier = e.getCourierInUse();
            this.SyncClient();
        }))
        EventHelper.addProtocolEvent(GameProtocol.Protocol.SelectDifficultyChapter, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            const characterdata = this.tPlayerGameSelection[e.PlayerID + ""];
            const charpter = e.data;
            if (characterdata && characterdata.Difficulty.MaxChapter >= charpter) {
                characterdata.Difficulty.Chapter = charpter;
                e.state = true;
                this.SyncClient();
                return
            }
            e.state = false;
        }));
        EventHelper.addProtocolEvent(GameProtocol.Protocol.SelectDifficultyEndlessLevel, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            const characterdata = this.tPlayerGameSelection[e.PlayerID + ""];
            const level = e.data;
            if (characterdata && characterdata.Difficulty.MaxLevel >= level) {
                characterdata.Difficulty.Level = level;
                e.state = true;
                this.SyncClient();
                return
            }
            e.state = false;
        }));

        EventHelper.addProtocolEvent(GameProtocol.Protocol.SelectReady, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            const characterdata = this.tPlayerGameSelection[e.PlayerID + ""];
            if (characterdata && !characterdata.IsReady) {
                characterdata.IsReady = true;
                let allready = true;
                GPlayerEntityRoot.GetAllOnlinePlayer().forEach(player => {
                    if (!this.getPlayerGameSelection(player.BelongPlayerid).IsReady) {
                        allready = false;
                    }
                });
                if (allready) {
                    this.BeforeGameEndTime = GameRules.GetGameTime() + GameServiceSystemComponent.SelectionReadyLockTime;
                }
                e.state = true;
                this.SyncClient();
                return
            }
            e.state = false;
        }));

        EventHelper.addProtocolEvent(GameProtocol.Protocol.SelectCourier, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            const DataComp = GCharacterDataComponent.GetOneInstance(e.PlayerID);
            const allcouriers = DataComp.getAllCourierNames();
            const characterdata = this.tPlayerGameSelection[e.PlayerID + ""];
            const couriername = e.data;
            if (characterdata && couriername) {
                if (allcouriers.includes(couriername)) {
                    if (characterdata.Courier !== couriername) {
                        characterdata.Courier = couriername;
                        e.state = true;
                        this.SyncClient();
                        return
                    }
                }
                else {
                    GNotificationSystem.ErrorMessage("unlock this courier", e.PlayerID);
                }
            }
            e.state = false;
        }));
        //**使用背包道具 */
        EventHelper.addProtocolEvent(GameProtocol.Protocol.Use_BagItem, GHandler.create(this, async (e: CLIENT_DATA<C2H_Use_BagItem>) => {
            const playeroot = GGameScene.GetPlayer(e.PlayerID);
            const data = e.data;
            if (playeroot && data) {
                const titem = TItem.GetItemById(data.ItemId);
                if (titem == null) {
                    e.state = false;
                    e.message = "cant find item";
                }
                else {
                    const ItemConfigid = titem.ConfigId + "";
                    let uselimit = titem.Config.OneGameUseLimit;
                    if (uselimit > 0 && playeroot.TCharacter().GameRecordComp.GetItemUseRecord(ItemConfigid) >= uselimit) {
                        e.state = false;
                        e.message = "use limit";
                    }
                    else {
                        const useCount = data.ItemCount;
                        const cbdata: H2C_CommonResponse = await playeroot.PlayerHttpComp().PostAsync(e.protocol, data);
                        if (cbdata) {
                            e.state = cbdata.Error == 0;
                            e.message = cbdata.Message;
                            // 道具使用
                            if (e.state && uselimit > 0) {
                                playeroot.TCharacter().GameRecordComp.AddItemUseRecord(ItemConfigid, useCount)
                            }
                        }
                        else {
                            e.state = false;
                            e.message = "no message cb";
                        }
                    }
                }
            }
            if (e.state == false) {
                GNotificationSystem.ErrorMessage(e.message);
            }
            if (e.isawait && e.sendClientCB) {
                e.sendClientCB()
            }
        }));
        EventHelper.addProtocolEvent(GameProtocol.Protocol.Rank_CurRankDataInfo, GHandler.create(this, async (e: JS_TO_LUA_DATA) => {
            const playeroot = GGameScene.GetPlayer(e.PlayerID);
            if (playeroot) {
                const rankcomp = GGameScene.GetServerZone().RankComp;
                const RankType = e.data.RankType;
                const Page = e.data.Page;
                const tempdata = rankcomp.GetTempRankData(RankType, Page);
                if (tempdata) {
                    e.state = true;
                    e.message = tempdata.str;
                }
                else {
                    const cbdata: H2C_CommonResponse = await playeroot.PlayerHttpComp().PostAsync(e.protocol, e.data);
                    if (cbdata) {
                        e.state = cbdata.Error == 0;
                        e.message = cbdata.Message;
                        if (e.state) {
                            // 缓存一下数据
                            rankcomp.SetTempRankData(RankType, Page, e.message, 60 * 10);
                        }
                    }
                    else {
                        e.state = false;
                        e.message = "no message cb";
                    }
                }
                if (e.state == false) {
                    GNotificationSystem.ErrorMessage(e.message);
                }
                if (e.isawait && e.sendClientCB) {
                    e.sendClientCB()
                }
            }
        }));

        const hander = GHandler.create(this, async (e: JS_TO_LUA_DATA) => {
            const playeroot = GGameScene.GetPlayer(e.PlayerID);
            if (playeroot) {
                const cbdata: H2C_CommonResponse = await playeroot.PlayerHttpComp().PostAsync(e.protocol, e.data);
                if (cbdata) {
                    e.state = cbdata.Error == 0;
                    e.message = cbdata.Message;
                }
                else {
                    e.state = false;
                    e.message = "no message cb";
                }
                if (e.state == false) {
                    GNotificationSystem.ErrorMessage(e.message);
                }
                if (e.isawait && e.sendClientCB) {
                    e.sendClientCB()
                }
            }
        });
        EventHelper.addProtocolEvent(GameProtocol.Protocol.Buy_ShopItem, hander);
        EventHelper.addProtocolEvent(GameProtocol.Protocol.DrawEnemy_UploadBattleResult, hander);
        EventHelper.addProtocolEvent(GameProtocol.Protocol.Handle_CharacterMail, hander);
        EventHelper.addProtocolEvent(GameProtocol.Protocol.BattlePass_GetPrize, hander);
        EventHelper.addProtocolEvent(GameProtocol.Protocol.InfoPass_GetInfoPassPrize, hander);
        EventHelper.addProtocolEvent(GameProtocol.Protocol.GetPrize_ActivitySevenDayLogin, hander);
        EventHelper.addProtocolEvent(GameProtocol.Protocol.GetPrize_ActivityMonthLogin, hander);
        EventHelper.addProtocolEvent(GameProtocol.Protocol.GetPrize_ActivityMonthTotalLogin, hander);
        EventHelper.addProtocolEvent(GameProtocol.Protocol.GetPrize_ActivityGiftCommond, hander);
        EventHelper.addProtocolEvent(GameProtocol.Protocol.GetPrize_ActivityDailyOnlinePrize, hander);
        EventHelper.addProtocolEvent(GameProtocol.Protocol.GetPrize_ActivityInvestMetaStone, hander);
        EventHelper.addProtocolEvent(GameProtocol.Protocol.GetPrize_ActivityTotalGainMetaStone, hander);


    }

    /**
     *
     * @param key
     * @param name
     * @param token
     * @returns
     */
    public async SendServerKey(label: string, name: string, token: string) {
        if (!token) {
            return;
        }
        await HttpHelper.PostRequestAsync(
            GameProtocol.Protocol.SetServerKey,
            {
                ServerKey: token,
                Name: name,
                Label: label,
            },
            GameProtocol.HTTP_URL,
            ""
        );
    }

    /**
     *
     * @param error 发送错误日志
     */
    public SendErrorLog(error: any) {
        if (error == null) {
            return;
        }
        // this.HTTPRequest("PUT", 0, { tc: "c2_debug", t: "error", d: error }, null, "http://111.231.89.227:8080/tag");
    }

    private getDifficultyConfig(arr: { [k: string]: number }) {
        if (this.DifficultyLevel == 0) {
            return 0;
        }
        let kArr: number[] = [];
        Object.keys(arr).forEach((k) => {
            kArr.push(tonumber(k));
        });
        kArr.sort();
        while (kArr.length > 0) {
            let k = kArr.shift();
            if (this.DifficultyLevel >= k) {
                return arr[("" + k) as "1"];
            }
        }
        return 0;
    }

    getEnemyHPMult() {
        return this.getDifficultyConfig(GameServiceConfig.ENDLESS_ENEMEY_fHPMult);
    }
    getEnemyArmorPhyMult() {
        return this.getDifficultyConfig(GameServiceConfig.ENDLESS_ENEMEY_fArmorPhyMult);
    }
    getEnemyArmorMagMult() {
        return this.getDifficultyConfig(GameServiceConfig.ENDLESS_ENEMEY_fArmorMagMult);
    }
    getEnemyHPAdd() {
        return this.getDifficultyConfig(GameServiceConfig.ENDLESS_ENEMEY_fHPAdd);
    }
    getEnemyArmorPhyAdd() {
        return this.getDifficultyConfig(GameServiceConfig.ENDLESS_ENEMEY_fArmorPhyAdd);
    }
    getEnemyArmorMagAdd() {
        return this.getDifficultyConfig(GameServiceConfig.ENDLESS_ENEMEY_fArmorMagAdd);
    }

    OnBindHeroFinish(playerID: PlayerID) {
        this.BindHeroPlayer.push(playerID);
        this.IsAllPlayerBindHero = GPlayerEntityRoot.IsAllBindHeroFinish();
        this.SyncClient();
        GLogHelper.print("OnBindHeroFinish", this.IsAllPlayerBindHero)
        if (this.IsAllPlayerBindHero) {
            GGameScene.StartGame();
        }
    }
    public Sleep(fTime: number) {
        let co = coroutine.running();
        GTimerHelper.AddTimer(fTime, GHandler.create(this, () => {
            coroutine.resume(co);
        }))
        coroutine.yield();
    }
}

declare global {
    /**
     * @ServerOnly
     */
    var GGameServiceSystem: typeof GameServiceSystemComponent;
}
if (_G.GGameServiceSystem == null) {
    _G.GGameServiceSystem = GameServiceSystemComponent;
}
