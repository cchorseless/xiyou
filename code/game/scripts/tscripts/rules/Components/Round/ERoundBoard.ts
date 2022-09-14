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
        let enemyCount = player.EnemyManagerComp().getAllEnemy().length;
        let delaytime = Number(this.config.round_time);
        if (buildingCount == 0 || enemyCount == 0) {
            delaytime = 1;
        }
        this.prizeTimer = TimerHelper.addTimer(
            delaytime,
            () => {
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
        let aliveEnemy = this.Domain.ETRoot.AsPlayer().EnemyManagerComp().getAllEnemy();
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


}
