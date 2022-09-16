import { Assert_SpawnEffect, ISpawnEffectInfo } from "../../../assert/Assert_SpawnEffect";
import { EventHelper } from "../../../helper/EventHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { building_round_board } from "../../../kvInterface/building/building_round_board";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { serializeETProps } from "../../Entity/Entity";
import { ChessControlConfig } from "../../System/ChessControl/ChessControlConfig";
import { RoundConfig } from "../../System/Round/RoundConfig";
import { PlayerScene } from "../Player/PlayerScene";
import { ERound } from "./ERound";

export class ERoundBoard extends ERound {
    @serializeETProps()
    roundState: RoundConfig.ERoundBoardState = null;
    @serializeETProps()
    roundStartTime: string;
    config: building_round_board.OBJ_2_1 = null;
    onAwake(configid: string): void {
        this.configID = configid;
        this.config = KVHelper.KvServerConfig.building_round_board["" + configid];
    }
    OnStart() {
        this.unitSpawned = 0;
        this.bRunning = true;
        this.roundState = RoundConfig.ERoundBoardState.start;
        this.roundStartTime = TimerHelper.now();
        let playerroot = this.Domain.ETRoot.AsPlayer();
        playerroot.SyncClientEntity(this, false);
        EventHelper.fireServerEvent(RoundConfig.Event.roundboard_onstart, playerroot.Playerid, this);
        if (this.config.round_readytime != null) {
            TimerHelper.addTimer(
                Number(this.config.round_readytime),
                () => {
                    this.OnBattle();
                },
                this
            );
        }
    }

    OnBattle() {
        let player = this.Domain.ETRoot.AsPlayer();
        this.roundState = RoundConfig.ERoundBoardState.battle;
        player.SyncClientEntity(this, false);
        EventHelper.fireServerEvent(RoundConfig.Event.roundboard_onbattle, player.Playerid, this);
        let buildingCount = player.BuildingManager().getAllBattleBuilding().length;
        let enemyCount = player.EnemyManagerComp().getAllAliveEnemy().length;
        let delaytime = Number(this.config.round_time);
        if (buildingCount == 0 || enemyCount == 0) {
            delaytime = 1;
        }
        this.prizeTimer = TimerHelper.addTimer(
            1,
            () => {
                delaytime--;
                let buildingCount = player.BuildingManager().getAllBattleBuilding().length;
                let enemyCount = player.EnemyManagerComp().getAllAliveEnemy().length;
                if (delaytime > 0) {
                    if (buildingCount > 0 && enemyCount > 0) {
                        return 1;
                    }
                }
                this.OnPrize();
            },
            this
        );
    }
    prizeTimer: string;
    OnPrize() {
        if (this.prizeTimer != null) {
            TimerHelper.removeTimer(this.prizeTimer);
            this.prizeTimer = null;
        }
        if (this.roundState == RoundConfig.ERoundBoardState.prize) {
            return;
        }
        this.roundState = RoundConfig.ERoundBoardState.prize;
        let playerroot = this.Domain.ETRoot.AsPlayer();
        playerroot.SyncClientEntity(this, false);
        let aliveEnemy = this.Domain.ETRoot.AsPlayer().EnemyManagerComp().getAllAliveEnemy();
        let isWin = aliveEnemy.length == 0;
        EventHelper.fireServerEvent(RoundConfig.Event.roundboard_onprize, playerroot.Playerid, isWin);
        this.waitingEndTimer = TimerHelper.addTimer(
            20,
            () => {
                this.OnWaitingEnd();
            },
            this
        );
    }

    waitingEndTimer: string;
    OnWaitingEnd() {
        if (this.waitingEndTimer != null) {
            TimerHelper.removeTimer(this.waitingEndTimer);
            this.waitingEndTimer = null;
        }
        if (this.roundState == RoundConfig.ERoundBoardState.waiting_next) {
            return;
        }
        this.roundState = RoundConfig.ERoundBoardState.waiting_next;
        let playerroot = this.Domain.ETRoot.AsPlayer();
        playerroot.SyncClientEntity(this, false);
        EventHelper.fireServerEvent(RoundConfig.Event.roundboard_onwaitingend, playerroot.Playerid, this);
        GameRules.Addon.ETRoot.RoundSystem().endBoardRound();
    }

    IsBattle() {
        return this.roundState == RoundConfig.ERoundBoardState.battle;
    }

    IsWaitingEnd() {
        return this.roundState == RoundConfig.ERoundBoardState.waiting_next;
    }

    IsBelongPlayer(playerid: PlayerID) {
        return (this.Domain.ETRoot.AsPlayer().Playerid == playerid)
    }
    CreateAllRoundBasicEnemy(SpawnEffect: ISpawnEffectInfo) {
        let allenemy = this.config.unitinfo;
        for (let unit_index in allenemy) {
            this.CreateRoundBasicEnemy(unit_index, SpawnEffect);
        }
    }
    CreateRoundBasicEnemy(unit_index: string, spawnEffect: ISpawnEffectInfo = null) {
        let player = this.Domain.ETRoot.AsPlayer();
        let playerid = player.Playerid;
        let allenemy = this.config.unitinfo;
        let _boardVec = new ChessControlConfig.ChessVector(Number(allenemy[unit_index].position_x), Number(allenemy[unit_index].position_y), playerid);
        let pos = _boardVec.getVector3();
        let angle = Vector(Number(allenemy[unit_index].angles_x), Number(allenemy[unit_index].angles_y), Number(allenemy[unit_index].angles_z));
        let enemyName = allenemy[unit_index].unit;
        let delay = 0;
        if (spawnEffect != null && spawnEffect.tp_effect != null) {
            delay = RandomFloat(0.1, 2.1);
            Assert_SpawnEffect.ShowTPEffectAtPosition(pos, spawnEffect.tp_effect, delay);
        }
        if (delay > 0) {
            TimerHelper.addTimer(
                delay,
                () => {
                    player.EnemyManagerComp().addEnemy(enemyName, this.configID, unit_index, pos, spawnEffect);
                },
                this
            );
        } else {
            player.EnemyManagerComp().addEnemy(enemyName, this.configID, unit_index, pos, spawnEffect);
        }
    }
}
