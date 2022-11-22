import { Assert_SpawnEffect, ISpawnEffectInfo } from "../../../assert/Assert_SpawnEffect";
import { reloadable } from "../../../GameCache";
import { GameFunc } from "../../../GameFunc";
import { EventHelper } from "../../../helper/EventHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { building_round_board } from "../../../kvInterface/building/building_round_board";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { serializeETProps } from "../../Entity/Entity";
import { ChessControlConfig } from "../../System/ChessControl/ChessControlConfig";
import { RoundConfig } from "../../System/Round/RoundConfig";
import { PlayerScene } from "../Player/PlayerScene";
import { ERound } from "./ERound";
@reloadable
export class ERoundBoard extends ERound {
    @serializeETProps()
    unitDamageInfo: { [k: string]: BuildingConfig.IBuildingDamageInfo } = {};
    @serializeETProps()
    roundState: RoundConfig.ERoundBoardState = null;
    @serializeETProps()
    roundLeftTime: number = 0;
    @serializeETProps()
    isWin: boolean = false;
    config: building_round_board.OBJ_2_1 = null;
    onAwake(configid: string): void {
        this.configID = configid;
        this.config = KVHelper.KvServerConfig.building_round_board["" + configid];
    }
    OnStart() {
        let delaytime = Number(this.config.round_readytime || 10);
        this.unitSpawned = 0;
        this.bRunning = true;
        this.roundState = RoundConfig.ERoundBoardState.start;
        this.roundLeftTime = GameRules.GetGameTime() + delaytime;
        let playerroot = this.Domain.ETRoot.AsPlayer();
        playerroot.SyncClientEntity(this, false);
        playerroot.PlayerDataComp().OnRoundStartBegin(this);
        playerroot.BuildingManager().OnRoundStartBegin(this);
        playerroot.FakerHeroRoot().OnRoundStartBegin(this);
        TimerHelper.addTimer(
            delaytime,
            () => {
                this.OnBattle();
            },
            this
        );
    }

    OnBattle() {
        let delaytime = Number(this.config.round_time || 30);
        let player = this.Domain.ETRoot.AsPlayer();
        this.roundState = RoundConfig.ERoundBoardState.battle;
        this.roundLeftTime = GameRules.GetGameTime() + delaytime;
        player.SyncClientEntity(this, false);
        player.ChessControlComp().OnRoundStartBattle();
        player.BuildingManager().OnRoundStartBattle();
        player.FakerHeroRoot().OnRoundStartBattle();
        let buildingCount = player.BuildingManager().getAllBattleUnitAlive().length;
        let enemyCount = player.EnemyManagerComp().getAllBattleUnitAlive().length;
        if (buildingCount == 0 || enemyCount == 0) {
            delaytime = 1;
        }
        this.prizeTimer = TimerHelper.addTimer(
            1,
            () => {
                delaytime--;
                let buildingCount = player.BuildingManager().getAllBattleUnitAlive().length;
                let enemyCount = player.EnemyManagerComp().getAllBattleUnitAlive().length;
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
        let delaytime = Number(20 || 20);
        this.roundState = RoundConfig.ERoundBoardState.prize;
        this.roundLeftTime = GameRules.GetGameTime() + delaytime;
        let playerroot = this.Domain.ETRoot.AsPlayer();
        playerroot.SyncClientEntity(this);
        let aliveEnemy = this.Domain.ETRoot.AsPlayer().EnemyManagerComp().getAllBattleUnitAlive();
        this.isWin = aliveEnemy.length == 0;
        playerroot.CourierRoot().OnRoundStartPrize(this);
        playerroot.BuildingManager().OnRoundStartPrize(this);
        playerroot.FakerHeroRoot().OnRoundStartPrize(this);
        this.waitingEndTimer = TimerHelper.addTimer(
            delaytime,
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
        this.roundLeftTime = -1;
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

    AddRoundDamage(attack: string, isattack: boolean, damagetype: DAMAGE_TYPES, damage: number) {
        if (this.unitDamageInfo[attack] == null) {
            this.unitDamageInfo[attack] = { phyD: 0, magD: 0, pureD: 0, byphyD: 0, bymagD: 0, bypureD: 0 };
        }
        damage = Math.floor(damage);
        if (damagetype == DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL) {
            if (isattack) {
                this.unitDamageInfo[attack].phyD += damage
            }
            else {
                this.unitDamageInfo[attack].byphyD += damage
            }
        }
        else if (damagetype == DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL) {
            if (isattack) {
                this.unitDamageInfo[attack].magD += damage
            }
            else {
                this.unitDamageInfo[attack].bymagD += damage
            }
        }
        else if (damagetype == DAMAGE_TYPES.DAMAGE_TYPE_PURE) {
            if (isattack) {
                this.unitDamageInfo[attack].pureD += damage
            }
            else {
                this.unitDamageInfo[attack].bypureD += damage
            }
        }
        let playerroot = this.Domain.ETRoot.AsPlayer();
        let playerid = playerroot.Playerid;
        NetTablesHelper.SetETEntityPart(playerid, this, ["unitDamageInfo"], playerid)

    }
}
