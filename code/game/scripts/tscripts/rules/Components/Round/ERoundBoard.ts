import { Assert_Color } from "../../../assert/Assert_Color";
import { Assert_MsgEffect } from "../../../assert/Assert_MsgEffect";
import { Assert_ProjectileEffect, IProjectileEffectInfo } from "../../../assert/Assert_ProjectileEffect";
import { Assert_SpawnEffect, ISpawnEffectInfo } from "../../../assert/Assert_SpawnEffect";
import { EventHelper } from "../../../helper/EventHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { building_round_board } from "../../../kvInterface/building/building_round_board";
import { BaseNpc_Hero_Plus } from "../../../npc/entityPlus/BaseNpc_Hero_Plus";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { serializeETProps } from "../../Entity/Entity";
import { ChessControlConfig } from "../../System/ChessControl/ChessControlConfig";
import { RoundConfig } from "../../System/Round/RoundConfig";
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
        let allenemy = this.config.unitinfo;
        for (let unit_index in allenemy) {
            this.CreateOneEnemy(unit_index, Assert_SpawnEffect.Effect.Spawn_fall);
        }
        this.Domain.ETRoot.AsPlayer()
            .BuildingManager()
            .getAllBuilding()
            .forEach((b) => {
                b.RoundBuildingComp().OnBoardRound_Start();
            });
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

    ProjectileInfo: IProjectileEffectInfo = Assert_ProjectileEffect.p000;
    OnBattle() {
        this.roundState = RoundConfig.ERoundBoardState.battle;
        EventHelper.SyncETEntity(this.toJsonObject(), this.Domain.ETRoot.AsPlayer().Playerid);
        this.Domain.ETRoot.AsPlayer()
            .EnemyManagerComp()
            .getAllEnemy()
            .forEach((b) => {
                b.RoundEnemyComp().OnBoardRound_Battle();
            });
        this.Domain.ETRoot.AsPlayer()
            .BuildingManager()
            .getAllBuilding()
            .forEach((b) => {
                b.RoundBuildingComp().OnBoardRound_Battle();
            });
        let player = this.Domain.ETRoot.AsPlayer();
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
        EventHelper.SyncETEntity(this.toJsonObject(), this.Domain.ETRoot.AsPlayer().Playerid);
        let aliveEnemy = this.Domain.ETRoot.AsPlayer().EnemyManagerComp().getAllEnemy();
        if (aliveEnemy.length > 0) {
            let damage = 0;
            let delay_time = 0.5;
            aliveEnemy.forEach((b) => {
                b.RoundEnemyComp().OnBoardRound_Prize(this.ProjectileInfo);
                damage += Number(b.GetRoundUnitConfig().failure_count || "0");
                delay_time = math.min(delay_time, b.GetDistance2Player() / 1000);
            });
            TimerHelper.addTimer(
                delay_time,
                () => {
                    this.ApplyDamageHero(damage);
                },
                this,
                true
            );
        }
        this.Domain.ETRoot.AsPlayer()
            .BuildingManager()
            .getAllBuilding()
            .forEach((b) => {
                b.RoundBuildingComp().OnBoardRound_Prize();
            });
    }

    ApplyDamageHero(damage: number) {
        if (damage > 0) {
            let domain = this.GetDomain<BaseNpc_Hero_Plus>();
            Assert_MsgEffect.CreateNumberEffect(domain, damage, 2, Assert_MsgEffect.EMsgEffect.MSG_MISS, Assert_Color.red);
            EmitSoundOn(this.ProjectileInfo.sound, domain);
            let enemyM = this.Domain.ETRoot.AsPlayer().EnemyManagerComp();
            enemyM.getAllEnemy().forEach((e) => {
                enemyM.missEnemy(e);
            });
        }
    }

    CreateOneEnemy(unit_index: string, spawnEffect: ISpawnEffectInfo = null) {
        let playerid = this.Domain.ETRoot.AsPlayer().Playerid;
        let allenemy = this.config.unitinfo;
        let _boardVec = new ChessControlConfig.ChessVector(Number(allenemy[unit_index].position_x), Number(allenemy[unit_index].position_y), playerid);
        let pos = GameRules.Addon.ETRoot.ChessControlSystem().GetBoardGirdVector3(_boardVec);
        let angle = Vector(Number(allenemy[unit_index].angles_x), Number(allenemy[unit_index].angles_y), Number(allenemy[unit_index].angles_z));
        let enemyName = allenemy[unit_index].unit;
        let delay = 0;
        if (spawnEffect != null && spawnEffect.tp_effect != null) {
            delay = RandomFloat(0.1, 2.1);
            Assert_SpawnEffect.ShowTPEffectAtPosition(pos, spawnEffect.tp_effect, delay);
        }
        let domain = this.GetDomain<BaseNpc_Plus>();
        let enemyManager = domain.ETRoot.AsPlayer().EnemyManagerComp();
        if (delay > 0) {
            TimerHelper.addTimer(
                delay,
                () => {
                    enemyManager.addEnemy(enemyName, this.configID, unit_index, pos, spawnEffect);
                },
                this
            );
        } else {
            enemyManager.addEnemy(enemyName, this.configID, unit_index, pos, spawnEffect);
        }
    }
}
