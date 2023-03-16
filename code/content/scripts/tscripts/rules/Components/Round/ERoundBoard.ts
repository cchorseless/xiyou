import {Assert_SpawnEffect, ISpawnEffectInfo} from "../../../assert/Assert_SpawnEffect";
import {Dota} from "../../../shared/Gen/Types";
import {serializeETProps} from "../../../shared/lib/Entity";
import {RoundConfig} from "../../../shared/RoundConfig";
import {ChessVector} from "../ChessControl/ChessVector";
import {ERound} from "./ERound";

@GReloadable
export class ERoundBoard extends ERound {
    @serializeETProps()
    unitDamageInfo: { [k: string]: BuildingConfig.IBuildingDamageInfo } = {};
    @serializeETProps()
    roundState: RoundConfig.ERoundBoardState = null;
    @serializeETProps()
    roundLeftTime: number = 0;
    @serializeETProps()
    isWin: boolean = false;

    _debug_StageStopped: boolean = false;


    _debug_nextStage() {
        if (this.roundState == RoundConfig.ERoundBoardState.start) {
            this.OnBattle();
        } else if (this.roundState == RoundConfig.ERoundBoardState.battle) {
            this.OnPrize();
        } else if (this.roundState == RoundConfig.ERoundBoardState.prize) {
            this.OnWaitingEnd();
        } else if (this.roundState == RoundConfig.ERoundBoardState.waiting_next) {
            this.OnEnd();
        }
    }

    config: Dota.RoundBoardConfigRecord;

    onAwake(configid: string): void {
        this.configID = configid;
        this.config = GJSONConfig.RoundBoardConfig.get("" + configid);
    }

    OnStart() {
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
        this.SyncClient(false);
        playerroot.PlayerDataComp().OnRoundStartBegin(this);
        playerroot.BuildingManager().OnRoundStartBegin(this);
        playerroot.FakerHeroRoot().OnRoundStartBegin(this);
        this.prizeTimer = GTimerHelper.AddTimer(delaytime, GHandler.create(this, () => {
            if (this._debug_StageStopped) {
                return 1;
            }
            this.OnBattle();
        }));
    }

    OnBattle() {
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
        this.SyncClient();
        player.ChessControlComp().OnRoundStartBattle();
        player.BuildingManager().OnRoundStartBattle();
        player.FakerHeroRoot().OnRoundStartBattle();
        let buildingCount = player.BuildingManager().getAllBattleUnitAlive().length;
        let enemyCount = player.EnemyManagerComp().getAllBattleUnitAlive().length;
        if (buildingCount == 0 || enemyCount == 0) {
            delaytime = 1;
        }
        this.prizeTimer = GTimerHelper.AddTimer(1, GHandler.create(this, () => {
            delaytime--;
            let buildingCount = player.BuildingManager().getAllBattleUnitAlive().length;
            let enemyCount = player.EnemyManagerComp().getAllBattleUnitAlive().length;
            if (delaytime > 0) {
                if (buildingCount > 0 && enemyCount > 0) {
                    return 1;
                }
                if (this._debug_StageStopped) {
                    return 1;
                }
            }
            this.OnPrize();
        }));
    }

    prizeTimer: ITimerTask;

    OnPrize() {
        if (this.prizeTimer != null) {
            this.prizeTimer.Clear()
            this.prizeTimer = null;
        }
        if (this.roundState == RoundConfig.ERoundBoardState.prize) {
            return;
        }
        let delaytime = 20;
        this.roundState = RoundConfig.ERoundBoardState.prize;
        this.roundLeftTime = GameRules.GetGameTime() + delaytime;
        let playerroot = GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid);
        let aliveEnemy = playerroot.EnemyManagerComp().getAllBattleUnitAlive();
        this.isWin = aliveEnemy.length == 0;
        this.SyncClient();
        playerroot.CourierRoot().OnRoundStartPrize(this);
        playerroot.BuildingManager().OnRoundStartPrize(this);
        playerroot.FakerHeroRoot().OnRoundStartPrize(this);
        this.prizeTimer = GTimerHelper.AddTimer(delaytime, GHandler.create(this, () => {
            if (this._debug_StageStopped) {
                return 1;
            }
            this.OnWaitingEnd();
        }));

    }

    onDestroy(): void {
        GLogHelper.print("onDestroy ERoundBoard");
    }

    OnWaitingEnd() {
        if (this.prizeTimer != null) {
            this.prizeTimer.Clear()
            this.prizeTimer = null;
        }
        if (this.roundState == RoundConfig.ERoundBoardState.waiting_next) {
            return;
        }
        this.roundState = RoundConfig.ERoundBoardState.waiting_next;
        this.roundLeftTime = -1;
        this.SyncClient();
        let playerroot = GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid);
        playerroot.CourierRoot().OnRoundWaitingEnd(this);
        playerroot.BuildingManager().OnRoundWaitingEnd(this);
        playerroot.FakerHeroRoot().OnRoundWaitingEnd(this);
        this.prizeTimer = GTimerHelper.AddTimer(0.1,
            GHandler.create(this, () => {
                if (this._debug_StageStopped) {
                    return 1;
                }
                this.OnEnd();
            }));
    }

    OnEnd() {
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

    IsBattle() {
        return this.roundState == RoundConfig.ERoundBoardState.battle;
    }

    IsWaitingEnd() {
        return this.roundState == RoundConfig.ERoundBoardState.waiting_next;
    }

    IsBelongPlayer(playerid: PlayerID) {
        return (this.BelongPlayerid == playerid)
    }

    CreateAllRoundBasicEnemy(SpawnEffect: ISpawnEffectInfo) {
        for (let enemyinfo of this.config.enemyinfo) {
            this.CreateRoundBasicEnemy(enemyinfo.id, SpawnEffect);
        }
    }

    CreateRoundBasicEnemy(unit_index: string, spawnEffect: ISpawnEffectInfo = null) {
        let player = GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid);
        let playerid = this.BelongPlayerid;
        let enemyinfo = this.config.enemyinfo.find((value) => {
            return value.id == unit_index
        });
        let _boardVec = new ChessVector((enemyinfo.positionX), (enemyinfo.positionY), playerid);
        let pos = _boardVec.getVector3();
        let angle = Vector(enemyinfo.anglesX, enemyinfo.anglesY, enemyinfo.anglesZ);
        let enemyName = enemyinfo.unitname;
        let delay = 0;
        if (spawnEffect != null && spawnEffect.tp_effect != null) {
            delay = RandomFloat(0.1, 2.1);
            Assert_SpawnEffect.ShowTPEffectAtPosition(pos, spawnEffect.tp_effect, delay);
        }
        if (delay > 0) {
            GTimerHelper.AddTimer(delay, GHandler.create(this, () => {
                player.EnemyManagerComp().addEnemy(enemyName, this.configID, unit_index, pos, spawnEffect);
            }));
        } else {
            player.EnemyManagerComp().addEnemy(enemyName, this.configID, unit_index, pos, spawnEffect);
        }
    }

    AddRoundDamage(attack: string, name: string, isattack: boolean, damagetype: DAMAGE_TYPES, damage: number) {
        if (this.unitDamageInfo[attack] == null) {
            this.unitDamageInfo[attack] = {name: name, phyD: 0, magD: 0, pureD: 0, byphyD: 0, bymagD: 0, bypureD: 0};
        }
        damage = Math.floor(damage);
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
        this.SyncClient();
        this.isSynced = true;
        GTimerHelper.AddTimer(1, GHandler.create(this, () => {
            this.isSynced = false;
        }));
    }
}
