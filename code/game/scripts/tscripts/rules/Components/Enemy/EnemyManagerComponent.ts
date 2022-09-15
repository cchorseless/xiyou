import { Assert_Color } from "../../../assert/Assert_Color";
import { Assert_MsgEffect } from "../../../assert/Assert_MsgEffect";
import { Assert_ProjectileEffect, IProjectileEffectInfo } from "../../../assert/Assert_ProjectileEffect";
import { Assert_SpawnEffect, ISpawnEffectInfo, SpawnEffectModifier } from "../../../assert/Assert_SpawnEffect";
import { GameEnum } from "../../../GameEnum";
import { EntityHelper } from "../../../helper/EntityHelper";
import { EventHelper } from "../../../helper/EventHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_spawn_breaksoil } from "../../../npc/modifier/spawn/modifier_spawn_breaksoil";
import { modifier_spawn_fall } from "../../../npc/modifier/spawn/modifier_spawn_fall";
import { modifier_spawn_torrent } from "../../../npc/modifier/spawn/modifier_spawn_torrent";
import { ET, registerET } from "../../Entity/Entity";
import { ChessControlConfig } from "../../System/ChessControl/ChessControlConfig";
import { EnemyState } from "../../System/Enemy/EnemyState";
import { RoundConfig } from "../../System/Round/RoundConfig";
import { PlayerScene } from "../Player/PlayerScene";
import { ERoundBoard } from "../Round/ERoundBoard";
import { EnemyUnitComponent } from "./EnemyUnitComponent";
import { EnemyUnitEntityRoot } from "./EnemyUnitEntityRoot";

@registerET()
export class EnemyManagerComponent extends ET.Component {
    tPlayerKills: number = 0;
    tPlayerMissing: number = 0;
    tAllEnemy: string[] = [];

    iMaxEnemyBonus: number = 0;
    iMaxEnemyBonusEach: number = 0;

    onAwake(...args: any[]): void {
        this.addEvent();
        this.iMaxEnemyBonus = tonumber(KVHelper.KvServerConfig.building_config.MAX_ENERMY_EACH_PLAYER.configValue);
    }
    GetEnemySpawnPos() {
        let playerid = this.Domain.ETRoot.AsPlayer().Playerid;
        return EnemyState.SpawnEnemyPoint[playerid];
    }
    addEvent() {
        let player = this.Domain.ETRoot.AsPlayer();
        EventHelper.addServerEvent(this, RoundConfig.Event.roundboard_onstart,
            player.Playerid,
            (round: ERoundBoard) => {
                let allenemy = round.config.unitinfo;
                for (let unit_index in allenemy) {
                    this.CreateRoundBasicEnemy(round, unit_index, this.SpawnEffect);
                }
                // this.getAllEnemy()
                //     .forEach((b) => {
                //         b.RoundEnemyComp().OnBoardRound_Start();
                //     });
            });
        EventHelper.addServerEvent(this, RoundConfig.Event.roundboard_onbattle,
            player.Playerid,
            (round: ERoundBoard) => {
                this.getAllEnemy()
                    .forEach((b) => {
                        b.RoundEnemyComp().OnBoardRound_Battle();
                    });
            });
        EventHelper.addServerEvent(this, RoundConfig.Event.roundboard_onprize,
            player.Playerid,
            (iswin: boolean) => {
                if (!iswin) {
                    let damage = 0;
                    let delay_time = 0.5;
                    let aliveEnemy = this.getAllEnemy()
                    aliveEnemy.forEach((b) => {
                        b.RoundEnemyComp().OnBoardRound_Prize(this.ProjectileInfo);
                        damage += Number(b.GetRoundBasicUnitConfig().failure_count || "0");
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
            });
        EventHelper.addServerEvent(this, RoundConfig.Event.roundboard_onwaitingend,
            player.Playerid,
            (round: ERoundBoard) => {
                this.getAllEnemy()
                    .forEach((b) => {
                        b.RoundEnemyComp().OnBoardRound_WaitingEnd();
                    });
            });
    }
    SpawnEffect: ISpawnEffectInfo = Assert_SpawnEffect.Effect.Spawn_fall;
    ProjectileInfo: IProjectileEffectInfo = Assert_ProjectileEffect.p000;
    ApplyDamageHero(damage: number) {
        if (damage > 0) {
            let hero = this.GetDomain<PlayerScene>().ETRoot.Hero;
            Assert_MsgEffect.CreateNumberEffect(hero, damage, 2, Assert_MsgEffect.EMsgEffect.MSG_MISS, Assert_Color.red);
            EmitSoundOn(this.ProjectileInfo.sound, hero);
            let enemyM = this.Domain.ETRoot.AsPlayer().EnemyManagerComp();
            enemyM.getAllEnemy().forEach((e) => {
                enemyM.missEnemy(e);
            });
        }
    }

    public getAllEnemy() {
        return this.GetDomain<PlayerScene>().ETRoot.GetDomainChilds(EnemyUnitEntityRoot);
    }

    CreateRoundBasicEnemy(round: ERoundBoard, unit_index: string, spawnEffect: ISpawnEffectInfo = null) {
        let playerid = this.Domain.ETRoot.AsPlayer().Playerid;
        let allenemy = round.config.unitinfo;
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
                    this.addEnemy(enemyName, round.configID, unit_index, pos, spawnEffect);
                },
                this
            );
        } else {
            this.addEnemy(enemyName, round.configID, unit_index, pos, spawnEffect);
        }
    }



    addEnemy(enemyName: string, roundid: string, onlykey: string = null, pos: Vector = null, spawnEffect: ISpawnEffectInfo = null) {
        if (enemyName == "" || enemyName == null) {
            throw new Error("cant find emeny name");
        }
        if (pos == null) {
            pos = this.GetEnemySpawnPos();
        }
        if (pos == null) {
            throw new Error("cant find emeny spawn pos");
        }
        let playerid = this.Domain.ETRoot.AsPlayer().Playerid;
        let enemy = EntityHelper.CreateEntityByName(enemyName, pos, DOTATeam_t.DOTA_TEAM_BADGUYS) as BaseNpc_Plus;
        enemy.SetNeverMoveToClearSpace(false);
        EnemyUnitEntityRoot.Active(enemy, playerid, enemyName, roundid, onlykey);
        let domain = this.GetDomain<BaseNpc_Plus>();
        domain.ETRoot.AddDomainChild(enemy.ETRoot);
        this.tAllEnemy.push(enemy.ETRoot.Id);
        enemy.addSpawnedHandler(
            ET.Handler.create(this, () => {
                if (spawnEffect != null) {
                    if (spawnEffect.tp_sound != null) {
                        EmitSoundOn(spawnEffect.tp_sound, enemy);
                    }
                    if (spawnEffect.modifier != null) {
                        switch (spawnEffect.modifier) {
                            case SpawnEffectModifier.spawn_breaksoil:
                                modifier_spawn_breaksoil.applyOnly(enemy, enemy, null, {
                                    vx: pos.x,
                                    vy: pos.y,
                                });
                                return;
                            case SpawnEffectModifier.spawn_fall:
                                modifier_spawn_fall.applyOnly(enemy, enemy, null, {
                                    vx: pos.x,
                                    vy: pos.y,
                                });
                                return;
                            case SpawnEffectModifier.spawn_torrent:
                                modifier_spawn_torrent.applyOnly(enemy, enemy, null, {
                                    vx: pos.x,
                                    vy: pos.y,
                                });
                                return;
                        }
                    }
                };
                enemy.ETRoot.As<EnemyUnitEntityRoot>().OnSpawnAnimalFinish();
            })
        );
        return enemy;
    }
    killAllEnemy() { }

    killEnemy(etroot: EnemyUnitEntityRoot) {
        this.tPlayerKills += 1;
        this.removeEnemy(etroot);
    }

    missEnemy(etroot: EnemyUnitEntityRoot) {
        this.tPlayerMissing += 1;
        this.removeEnemy(etroot);
    }

    private removeEnemy(etroot: EnemyUnitEntityRoot) {
        let index = this.tAllEnemy.indexOf(etroot.Id);
        this.tAllEnemy.splice(index, 1);
        etroot.Dispose();
        if (this.tAllEnemy.length == 0) {
            this.Domain.ETRoot.AsPlayer().RoundManagerComp().getCurrentBoardRound().OnPrize();
        }
    }
}
