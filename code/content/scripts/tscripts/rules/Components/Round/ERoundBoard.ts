import { Assert_SpawnEffect, ISpawnEffectInfo } from "../../../assert/Assert_SpawnEffect";
import { EventHelper } from "../../../helper/EventHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { ChessControlConfig } from "../../../shared/ChessControlConfig";
import { GameProtocol } from "../../../shared/GameProtocol";
import { Dota } from "../../../shared/Gen/Types";
import { serializeETProps } from "../../../shared/lib/Entity";
import { RoundConfig } from "../../../shared/RoundConfig";
import { ERoundBoardResultRecord } from "../../../shared/rules/Round/ERoundBoardResultRecord";
import { TBattleTeamRecord } from "../../../shared/service/battleteam/TBattleTeamRecord";
import { ChessVector } from "../ChessControl/ChessVector";
import { ERound } from "./ERound";

@GReloadable
export class ERoundBoard extends ERound implements IRoundStateCallback {
    @serializeETProps()
    unitDamageInfo: { [k: string]: BuildingConfig.IBuildingDamageInfo } = {};
    @serializeETProps()
    roundState: RoundConfig.ERoundBoardState = null;
    @serializeETProps()
    roundLeftTime: number = 0;
    @serializeETProps()
    readonly isWin: -1 | 0 | 1 = 0;
    /**本轮对战的阵容实体 */
    readonly BattleTeam: TBattleTeamRecord;
    /**本轮参展的队伍 */
    readonly BattleBuilding: { unitname: string, star: number }[] = [];

    _debug_StageStopped: boolean = false;


    _debug_nextStage() {
        if (this.roundState == RoundConfig.ERoundBoardState.start) {
            this.OnRound_Battle();
        } else if (this.roundState == RoundConfig.ERoundBoardState.battle) {
            this.OnRound_Prize();
        } else if (this.roundState == RoundConfig.ERoundBoardState.prize) {
            this.OnRound_WaitingEnd();
        } else if (this.roundState == RoundConfig.ERoundBoardState.waiting_next) {
            this.OnRound_End();
        }
    }

    config: Dota.RoundBoardConfigRecord;

    onAwake(configid: string): void {
        this.configID = configid;
        this.config = GJSONConfig.RoundBoardConfig.get("" + configid);
    }

    OnRound_Start() {
        if (this.prizeTimer != null) {
            this.prizeTimer.Clear()
            this.prizeTimer = null;
        }
        if (this.roundState == RoundConfig.ERoundBoardState.start) {
            return;
        }
        let delaytime = (this.config.roundReadytime || 10);
        this.unitSpawned = 0;
        this.bRunning = true;
        this.roundState = RoundConfig.ERoundBoardState.start;
        this.roundLeftTime = GameRules.GetGameTime() + delaytime;
        let playerroot = GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid);
        this.SyncClient(true);
        playerroot.PlayerDataComp().OnRound_Start(this);
        playerroot.CourierRoot().OnRound_Start(this);
        playerroot.BuildingManager().OnRound_Start(this);
        playerroot.FakerHeroRoot().OnRound_Start(this);
        playerroot.DrawComp().OnRound_Start(this);
        EventHelper.fireProtocolEventToPlayer(RoundConfig.EProtocol.roundboard_onstart, {}, this.BelongPlayerid);
        this.prizeTimer = GTimerHelper.AddTimer(delaytime, GHandler.create(this, () => {
            if (this._debug_StageStopped) {
                return 1;
            }
            this.OnRound_Battle();
        }));
    }

    OnRound_Battle() {
        if (this.prizeTimer != null) {
            this.prizeTimer.Clear()
            this.prizeTimer = null;
        }
        if (this.roundState == RoundConfig.ERoundBoardState.battle) {
            return;
        }
        let delaytime = (this.config.roundTime || 30);
        let player = GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid);
        this.roundState = RoundConfig.ERoundBoardState.battle;
        this.roundLeftTime = GameRules.GetGameTime() + delaytime;
        (this.BattleBuilding as any) = [];
        player.BuildingManager().getAllBattleBuilding(true).forEach((b) => {
            this.BattleBuilding.push({ unitname: b.ConfigID, star: b.iStar });
        });
        this.SyncClient(true);

        player.BuildingManager().OnRound_Battle(this);
        player.CourierRoot().OnRound_Battle(this);
        player.FakerHeroRoot().OnRound_Battle(this);

        let buildingCount = player.BattleUnitManagerComp().GetAllBattleUnitAlive(DOTATeam_t.DOTA_TEAM_GOODGUYS).length;
        let enemyCount = player.BattleUnitManagerComp().GetAllBattleUnitAlive(DOTATeam_t.DOTA_TEAM_BADGUYS).length;
        if (this.IsFinalRound()) {
            enemyCount = GRoundSystem.GetInstance().RoundFinishEnemys.filter((v) => v.IsAlive()).length;
            GPlayerEntityRoot.GetAllValidPlayer().forEach(v => {
                if (v != player) {
                    buildingCount += v.BattleUnitManagerComp().GetAllBattleUnitAlive(DOTATeam_t.DOTA_TEAM_GOODGUYS).length;
                }
            })
        }
        if (buildingCount == 0 || enemyCount == 0) {
            delaytime = 1;
        }
        this.prizeTimer = GTimerHelper.AddTimer(1, GHandler.create(this, () => {
            delaytime--;
            buildingCount = player.BattleUnitManagerComp().GetAllBattleUnitAlive(DOTATeam_t.DOTA_TEAM_GOODGUYS).length;
            enemyCount = player.BattleUnitManagerComp().GetAllBattleUnitAlive(DOTATeam_t.DOTA_TEAM_BADGUYS).length;
            if (this.IsFinalRound()) {
                enemyCount = GRoundSystem.GetInstance().RoundFinishEnemys.filter((v) => v.IsAlive()).length;
                GPlayerEntityRoot.GetAllValidPlayer().forEach(v => {
                    if (v != player) {
                        buildingCount += v.BattleUnitManagerComp().GetAllBattleUnitAlive(DOTATeam_t.DOTA_TEAM_GOODGUYS).length;
                    }
                })
            }
            if (delaytime > 0) {
                if (buildingCount > 0 && enemyCount > 0) {
                    return 1;
                }
                if (this._debug_StageStopped) {
                    return 1;
                }
            }
            this.OnRound_Prize();
        }));
    }

    prizeTimer: ITimerTask;

    OnRound_Prize() {
        if (this.prizeTimer != null) {
            this.prizeTimer.Clear()
            this.prizeTimer = null;
        }
        if (this.roundState == RoundConfig.ERoundBoardState.prize) {
            return;
        }
        let delaytime = 3;
        this.roundState = RoundConfig.ERoundBoardState.prize;
        this.roundLeftTime = GameRules.GetGameTime() + delaytime;
        let playerroot = GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid);
        let buildingCount = playerroot.BattleUnitManagerComp().GetAllBattleUnitAlive(DOTATeam_t.DOTA_TEAM_GOODGUYS).length;
        let enemyCount = playerroot.BattleUnitManagerComp().GetAllBattleUnitAlive(DOTATeam_t.DOTA_TEAM_BADGUYS).length;
        if (this.IsFinalRound()) {
            enemyCount = GRoundSystem.GetInstance().RoundFinishEnemys.filter((v) => v.IsAlive()).length;
            GPlayerEntityRoot.GetAllValidPlayer().forEach(v => {
                if (v != playerroot) {
                    buildingCount += v.BattleUnitManagerComp().GetAllBattleUnitAlive(DOTATeam_t.DOTA_TEAM_GOODGUYS).length;
                }
            })
        }
        if (buildingCount > 0 && enemyCount == 0) {
            (this.isWin as any) = 1;
        }
        else if (buildingCount == 0 && enemyCount > 0) {
            (this.isWin as any) = -1;
        }
        else {
            (this.isWin as any) = 0;
        }
        this.SyncClient(true);
        this.NoticeBattleResultData(this);
        this.UploadBattleResultData(this);
        playerroot.CourierRoot().OnRound_Prize(this);
        playerroot.BuildingManager().OnRound_Prize(this);
        playerroot.FakerHeroRoot().OnRound_Prize(this);
        this.prizeTimer = GTimerHelper.AddTimer(delaytime, GHandler.create(this, () => {
            if (this._debug_StageStopped) {
                return 1;
            }
            this.OnRound_WaitingEnd();
        }));

    }

    OnRound_WaitingEnd() {
        if (this.prizeTimer != null) {
            this.prizeTimer.Clear()
            this.prizeTimer = null;
        }
        if (this.roundState == RoundConfig.ERoundBoardState.waiting_next) {
            return;
        }
        this.roundState = RoundConfig.ERoundBoardState.waiting_next;
        this.roundLeftTime = -1;
        this.SyncClient(true);
        let playerroot = GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid);
        playerroot.CourierRoot().OnRound_WaitingEnd();
        playerroot.BuildingManager().OnRound_WaitingEnd();
        playerroot.FakerHeroRoot().OnRound_WaitingEnd();
        if (this.IsFinalRound()) {
            if (this.isWin <= 0) {
                GGameScene.Defeat()
            }
            else {
                GGameScene.Victory()
            }
            return
        }
        this.prizeTimer = GTimerHelper.AddTimer(0.1,
            GHandler.create(this, () => {
                if (this._debug_StageStopped) {
                    return 1;
                }
                this.OnRound_End();
            }));
    }

    OnRound_End() {
        if (this.prizeTimer != null) {
            this.prizeTimer.Clear()
            this.prizeTimer = null;
        }
        if (!this.bRunning) {
            return
        }
        this.bRunning = false;
        GRoundSystem.GetInstance().endBoardRound();
    }
    IsRoundStart() {
        return this.roundState == RoundConfig.ERoundBoardState.start;
    }
    IsRoundBattle() {
        return this.roundState == RoundConfig.ERoundBoardState.battle;
    }
    IsRoundWaitingEnd() {
        return this.roundState == RoundConfig.ERoundBoardState.waiting_next;
    }
    IsRoundChallenge() {
        return false
    }
    /** 最终回合 */
    IsFinalRound() {
        return this.config.roundNextid == "";
    }

    IsBelongPlayer(playerid: PlayerID) {
        return (this.BelongPlayerid == playerid)
    }

    /**创建随机敌方阵营 */
    CreateDrawEnemy(battleteam: TBattleTeamRecord, spawnEffect: ISpawnEffectInfo) {
        let player = GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid);
        let playerid = this.BelongPlayerid;
        // 记录一下用于数据上报
        (this.BattleTeam as any) = battleteam;
        for (const enemyinfo of battleteam.UnitInfo) {
            let _boardVec: ChessVector = new ChessVector(
                ChessControlConfig.Gird_Max_X - 1 - enemyinfo.PosX,
                ChessControlConfig.Gird_Max_Y + 1 - enemyinfo.PosY,
                playerid);
            let pos = _boardVec.getVector3();
            let enemyName = enemyinfo.UnitName;
            enemyName = enemyName.replace("_hero_", "_enemy_")
            let delay = 0;
            if (spawnEffect != null && spawnEffect.tp_effect != null) {
                delay = Assert_SpawnEffect.ShowTPEffectAtPosition(pos, spawnEffect);
            }
            if (delay > 0) {
                GTimerHelper.AddTimer(delay, GHandler.create(this, () => {
                    let enemyroot = player.EnemyManagerComp().AddEnemy(enemyName, this.configID, enemyinfo.OnlyKey, pos, null, spawnEffect);
                    if (enemyroot) {
                        enemyroot.LoadData(enemyinfo)
                    }

                }));
            } else {
                let enemyroot = player.EnemyManagerComp().AddEnemy(enemyName, this.configID, enemyinfo.OnlyKey, pos, null, spawnEffect);
                if (enemyroot) {
                    enemyroot.LoadData(enemyinfo)
                }
            }
        }
    }

    /**随机一个怪物onlyId给随机的敌方阵营，绑定属性和奖励 */
    RandomEnemyPrizeId() {
        const enemyinfo = this.config.enemyinfo.filter(v => v.enemycreatetype == GEEnum.EEnemyCreateType.DataDriver);
        const weights = enemyinfo.map(v => {
            return v.unitWeight;
        })
        return GFuncRandom.RandomArrayByWeight(enemyinfo, weights).map(v => { return v.id })[0]
    }

    /**创建固定的敌方阵营 */
    CreateAllRoundBasicEnemy(SpawnEffect: ISpawnEffectInfo) {
        if (this.config.randomEnemy) {
            return;
        }
        let baseenemys = this.config.enemyinfo.filter((value) => {
            return value.enemycreatetype == GEEnum.EEnemyCreateType.None
        });
        if (baseenemys.length > 0) {
            for (let enemyinfo of baseenemys) {
                this.CreateRoundBasicEnemy(enemyinfo.id, SpawnEffect);
            }
        }

    }
    GetBoardRandomEmptyEnemyGird(playerid: PlayerID) {
        let min_x = 0;
        let min_y = 8;
        let validPos: [number, number][] = [];
        for (let y = min_y; y <= ChessControlConfig.Gird_Max_Y; y++) {
            for (let x = min_x; x < ChessControlConfig.Gird_Max_X; x++) {
                if (y == min_y) {
                    validPos.push([x, y])
                }
                else {
                    if (x != 3 && x != 4) {
                        validPos.push([x, y])
                    }
                }
            }

        }
        let r = GFuncRandom.RandomArray(validPos)[0];
        return new ChessVector(r[0], r[1], playerid);
        // let min_x = -3;
        // let max_x = 9;
        // let min_y = 1;
        // let max_y = 12;
        // return new ChessVector(RandomFloat(min_x, max_x), RandomFloat(min_y, max_y), playerid);
    }
    GetBoardRandomEggPos() {
        let playerroot = GGameScene.GetPlayer(this.BelongPlayerid);
        let validPos: number[][] = [];
        if (playerroot.CourierRoot().CourierEggComp().IsPathLeft) {
            validPos = [
                [0, ChessControlConfig.Gird_Max_Y],
                [1, ChessControlConfig.Gird_Max_Y],
                [2, ChessControlConfig.Gird_Max_Y],
            ];
        }
        else {
            validPos = [
                [5, ChessControlConfig.Gird_Max_Y],
                [6, ChessControlConfig.Gird_Max_Y],
                [7, ChessControlConfig.Gird_Max_Y],
            ];
        }
        let r = GFuncRandom.RandomArray(validPos)[0];
        return new ChessVector(r[0], r[1], this.BelongPlayerid);
    }
    CreateRoundBasicEnemy(onlykey: string, spawnEffect: ISpawnEffectInfo = null, npcOwner: IBaseNpc_Plus = null) {
        let player = GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid);
        let playerid = this.BelongPlayerid;
        let enemyinfo = this.config.enemyinfo.find((value) => {
            return value.id == onlykey
        });
        let _boardVec: ChessVector;
        if (enemyinfo.enemycreatetype == GEEnum.EEnemyCreateType.None) {
            _boardVec = new ChessVector((enemyinfo.positionX), (enemyinfo.positionY), playerid);
        }
        else if (enemyinfo.enemycreatetype == GEEnum.EEnemyCreateType.RandomReplace) {
            _boardVec = new ChessVector((enemyinfo.positionX), (enemyinfo.positionY), playerid);
        }
        else if (enemyinfo.enemycreatetype == GEEnum.EEnemyCreateType.SummedBattle) {
            _boardVec = this.GetBoardRandomEmptyEnemyGird(playerid);
        }
        else if (enemyinfo.enemycreatetype == GEEnum.EEnemyCreateType.SummedEgg) {
            _boardVec = this.GetBoardRandomEggPos();
        }
        let pos = _boardVec.getVector3();
        let angle = Vector(enemyinfo.anglesX, enemyinfo.anglesY, enemyinfo.anglesZ);
        let enemyName = enemyinfo.unitname;
        if (enemyinfo.enemycreatetype == GEEnum.EEnemyCreateType.RandomReplace) {
            enemyName = GFuncRandom.RandomOne(GJsonConfigHelper.GetAllHeroBySectLabel(enemyName));
            enemyName = enemyName.replace("_hero_", "_enemy_")
        }
        let delay = 0;
        if (spawnEffect != null && spawnEffect.tp_effect != null) {
            delay = Assert_SpawnEffect.ShowTPEffectAtPosition(pos, spawnEffect);
        }
        if (delay > 0) {
            GTimerHelper.AddTimer(delay, GHandler.create(this, () => {
                player.EnemyManagerComp().AddEnemy(enemyName, this.configID, onlykey, pos, angle, spawnEffect, npcOwner);
            }));
        } else {
            player.EnemyManagerComp().AddEnemy(enemyName, this.configID, onlykey, pos, angle, spawnEffect, npcOwner);
        }
        return pos
    }

    /**
     * 创建召唤单位
     * @param unit_index 
     * @param spawnEffect 
     */
    CreateRoundSummonEggEnemy(count: number, spawnEffect: ISpawnEffectInfo = null, npcOwner: IBaseNpc_Plus = null) {
        let baseenemys = this.config.enemyinfo.filter((value) => { return value.enemycreatetype == GEEnum.EEnemyCreateType.SummedEgg });
        if (baseenemys.length == 0) { return }
        let weightarr = baseenemys.map((value) => { return value.unitWeight });
        let posArr: Vector[] = [];
        for (let i = 0; i < count; i++) {
            let enemyinfo = GFuncRandom.RandomArrayByWeight(baseenemys, weightarr)[0];
            if (enemyinfo == null) { continue }
            let pos = this.CreateRoundBasicEnemy(enemyinfo.id, spawnEffect, npcOwner);
            posArr.push(pos);
        }
        return posArr;
    }
    /**
     * 通知客户端战斗结果
     * @param round 
     */
    NoticeBattleResultData(round: ERoundBoard) {
        let entity = this.AddChild(ERoundBoardResultRecord);
        entity.configID = round.configID;
        entity.isWin = round.isWin;
        if (round.config.randomEnemy) {
            entity.iBattleScoreChange = round.isWin * round.config.rankScore;
            if (round.BattleTeam) {
                entity.accountid = round.BattleTeam.SteamAccountId;
                entity.enemyBattleScore = round.BattleTeam.Score;
            }
        }
        else {
            let baseenemy = round.config.enemyinfo.filter((value) => {
                return value.enemycreatetype == GEEnum.EEnemyCreateType.None || value.enemycreatetype == GEEnum.EEnemyCreateType.PublicEnemy;
            })[0];
            if (baseenemy) {
                entity.enemyid = baseenemy.unitname;
            }
        }
        // 回合奖励
        if (round.isWin == 1) {
            const items: { [itemconfig: string]: number } = {};
            // 英雄经验
            if (round.config.winPrizeHeroExp && round.config.winPrizeHeroExp > 0 && this.BattleBuilding.length > 0) {
                entity.heroExps = entity.heroExps || {};
                for (let unitinfo of this.BattleBuilding) {
                    const heroname = unitinfo.unitname;
                    const itemid = GJsonConfigHelper.GetHeroExpItemConfigId(heroname);
                    if (itemid) {
                        entity.heroExps[heroname] = entity.heroExps[heroname] || 0;
                        entity.heroExps[heroname] += round.config.winPrizeHeroExp;
                        items[itemid + ""] = items[itemid + ""] || 0;
                        items[itemid + ""] += round.config.winPrizeHeroExp;
                    }
                }
            }
            // 奖励局内道具
            if (round.config.winPrizeItems && round.config.winPrizeItems > 0) {
                entity.prizeItems = KVHelper.RandomItemPrizePoolGroupPrize(round.config.winPrizeItems)
                for (let itemid in entity.prizeItems) {
                    items[itemid + ""] = items[itemid + ""] || 0;
                    items[itemid + ""] += entity.prizeItems[itemid + ""]
                }
            }
            // 通知服务器添加道具
            if (Object.keys(items).length > 0) {
                const ItemDes: string[] = [];
                for (let k in items) {
                    ItemDes.push(`${k}|${items[k]}`)
                }
                const playeroot = GGameScene.GetPlayer(this.BelongPlayerid);
                playeroot.PlayerHttpComp().Post(GameProtocol.Protocol.Add_BagItem, {
                    AddReason: "RoundWin",
                    ItemDes: ItemDes,
                }, (Body: H2C_CommonResponse, response: CScriptHTTPResponse) => {
                    if (Body.Error == 0) {
                        const message = {
                            string_from: "lang_Module_Round_Result",
                            message: "lang_Notification_Round_ItemPrize",
                            player_id: this.BelongPlayerid,
                            roundindex: "" + round.config.roundIndex,
                            roundresult: round.isWin == 1 ? "RoundResultWin" : (round.isWin == 0 ? "RoundResultDraw" : "RoundResultLose"),
                            item_get: "",
                        }
                        ItemDes.forEach(v => {
                            message.item_get = v;
                            GNotificationSystem.NoticeCombatMessage(message as any, this.BelongPlayerid);
                        })
                    }
                    else {
                        GNotificationSystem.ErrorMessage(Body.Message)
                    }
                })
            }
        }
        entity.SyncClient(true)
    }
    /**
     * 上传战斗结果数据
     */
    UploadBattleResultData(round: ERoundBoard) {
        if (!round.config.randomEnemy) { return }
        if (!round.BattleTeam) { return }
        if (round.BattleTeam.DBServerEntityId == "-1") { return }
        let playeroot = GGameScene.GetPlayer(this.BelongPlayerid);
        const RoundCharpter = GGameServiceSystem.GetInstance().getDifficultyNumberDes();
        const score = round.isWin * round.config.rankScore;
        playeroot.PlayerHttpComp().Post(GameProtocol.Protocol.DrawEnemy_UploadBattleResult, {
            RoundIndex: round.config.roundIndex,
            RoundCharpter: RoundCharpter,
            EnemyEntityId: round.BattleTeam.DBServerEntityId,
            BattleScore: score,
        }, (Body: H2C_CommonResponse, response: CScriptHTTPResponse) => {
            if (Body.Error == 0) {
                GNotificationSystem.NoticeCombatMessage({
                    string_from: "lang_Module_Round_Result",
                    message: "lang_Notification_Round_Result",
                    player_id: this.BelongPlayerid,
                    roundindex: "" + round.config.roundIndex,
                    roundresult: round.isWin == 1 ? "RoundResultWin" : (round.isWin == 0 ? "RoundResultDraw" : "RoundResultLose"),
                    scorechange: `${score > 0 ? "+" : ""}${score}(${Body.Message})`,
                });
            }
        })
    }

    AddRoundDamage(attack: string, name: string, isattack: boolean, damagetype: DAMAGE_TYPES, damage: number) {
        if (this.unitDamageInfo[attack] == null) {
            this.unitDamageInfo[attack] = { name: name, phyD: 0, magD: 0, pureD: 0, byphyD: 0, bymagD: 0, bypureD: 0 };
        }
        damage = Math.floor(damage);
        this.tTotalDamage += damage;
        if (damagetype == DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL) {
            if (isattack) {
                this.unitDamageInfo[attack].phyD += damage
            } else {
                this.unitDamageInfo[attack].byphyD += damage
            }
        } else if (damagetype == DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL) {
            if (isattack) {
                this.unitDamageInfo[attack].magD += damage
            } else {
                this.unitDamageInfo[attack].bymagD += damage
            }
        } else if (damagetype == DAMAGE_TYPES.DAMAGE_TYPE_PURE) {
            if (isattack) {
                this.unitDamageInfo[attack].pureD += damage
            } else {
                this.unitDamageInfo[attack].bypureD += damage
            }
        }
        this.SyncClientData()

    }

    isSynced = false;

    public SyncClientData(): void {
        if (this.isSynced) {
            return
        }
        this.SyncClient(true);
        this.isSynced = true;
        GTimerHelper.AddTimer(1, GHandler.create(this, () => {
            this.isSynced = false;
        }));
    }
}

declare global {
    interface IRoundStateCallback {
        OnRound_Start(round?: ERoundBoard): void;
        OnRound_Battle(round?: ERoundBoard): void;
        OnRound_Prize(round?: ERoundBoard): void;
        OnRound_WaitingEnd(): void;
        OnRound_End?(): void;
        OnGame_End?(iswin: boolean): void;
    }
}