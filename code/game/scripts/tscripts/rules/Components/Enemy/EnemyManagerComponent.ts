import { Assert_Color } from "../../../assert/Assert_Color";
import { Assert_MsgEffect } from "../../../assert/Assert_MsgEffect";
import { Assert_ProjectileEffect, IProjectileEffectInfo } from "../../../assert/Assert_ProjectileEffect";
import { Assert_SpawnEffect, ISpawnEffectInfo, SpawnEffectModifier } from "../../../assert/Assert_SpawnEffect";
import { reloadable } from "../../../GameCache";
import { GameEnum } from "../../../shared/GameEnum";
import { EntityHelper } from "../../../helper/EntityHelper";
import { EventHelper } from "../../../helper/EventHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_spawn_breaksoil } from "../../../npc/modifier/spawn/modifier_spawn_breaksoil";
import { modifier_spawn_fall } from "../../../npc/modifier/spawn/modifier_spawn_fall";
import { modifier_spawn_torrent } from "../../../npc/modifier/spawn/modifier_spawn_torrent";
import { ET } from "../../Entity/Entity";
import { ChessControlConfig } from "../../../shared/ChessControlConfig";
import { EnemyState } from "../../System/Enemy/EnemyState";
import { RoundConfig } from "../../../shared/RoundConfig";
import { CourierEntityRoot } from "../Courier/CourierEntityRoot";
import { BattleUnitEntityRoot } from "../BattleUnit/BattleUnitEntityRoot";
import { PlayerScene } from "../Player/PlayerScene";
import { ERoundBoard } from "../Round/ERoundBoard";
import { EnemyUnitComponent } from "./EnemyUnitComponent";
import { EnemyUnitEntityRoot } from "./EnemyUnitEntityRoot";

@reloadable
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

    }
    ApplyDamageHero(damage: number, projectileInfo: IProjectileEffectInfo) {
        if (damage > 0) {
            let hero = this.GetDomain<PlayerScene>().ETRoot.Hero;
            let heroroot = hero.ETRoot.As<CourierEntityRoot>();
            Assert_MsgEffect.CreateNumberEffect(hero, damage, 2, Assert_MsgEffect.EMsgEffect.MSG_MISS, Assert_Color.red);
            EmitSoundOn(projectileInfo.sound, hero);
            heroroot.CourierDataComp().ApplyDamage(damage);
        }
    }

    getAllEnemy() {
        let player = this.Domain.ETRoot.AsPlayer();
        let r: EnemyUnitEntityRoot[] = [];
        this.tAllEnemy.forEach((entityid) => {
            let entity = player.GetDomainChild<EnemyUnitEntityRoot>(entityid);
            if (entity) {
                r.push(entity);
            }
        })
        return r;
    }
    public getAllBattleUnitAlive() {
        let allenemy = this.getAllEnemy();
        let r: BattleUnitEntityRoot[] = [];
        allenemy.forEach(b => {
            r = r.concat(b.BattleUnitManager().GetAllBattleUnitAlive())
        })
        return r
    }

    getAllAliveEnemy() {
        let player = this.Domain.ETRoot.AsPlayer();
        let r: EnemyUnitEntityRoot[] = [];
        this.tAllEnemy.forEach((entityid) => {
            let entity = player.GetDomainChild<EnemyUnitEntityRoot>(entityid);
            if (entity && entity.ChessComp().isAlive) {
                r.push(entity);
            }
        })
        return r;
    }
    getAllDeathEnemy() {
        let player = this.Domain.ETRoot.AsPlayer();
        let r: EnemyUnitEntityRoot[] = [];
        this.tAllEnemy.forEach((entityid) => {
            let entity = player.GetDomainChild<EnemyUnitEntityRoot>(entityid);
            if (entity && entity.ChessComp().isAlive == false) {
                r.push(entity);
            }
        })
        return r;
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
        let enemy = BaseNpc_Plus.CreateUnitByName(enemyName, pos, DOTATeam_t.DOTA_TEAM_BADGUYS);
        enemy.SetNeverMoveToClearSpace(false);
        EnemyUnitEntityRoot.Active(enemy, playerid, enemyName, roundid, onlykey);
        let domain = this.GetDomain<PlayerScene>();
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

    killEnemy(etroot: EnemyUnitEntityRoot) {
        if (!this.tAllEnemy.includes(etroot.Id)) {
            LogHelper.error("killEnemy error")
            return;
        }
        this.tPlayerKills += 1;
    }
    removeAllEnemy() {
        let player = this.Domain.ETRoot.AsPlayer();
        this.tAllEnemy.forEach((entityid) => {
            let entity = player.GetDomainChild<EnemyUnitEntityRoot>(entityid);
            if (entity) {
                entity.Dispose();
            }
        });
        this.tAllEnemy = [];
    }
    removeEnemy(etroot: EnemyUnitEntityRoot) {
        if (this.tAllEnemy.includes(etroot.Id)) {
            let index = this.tAllEnemy.indexOf(etroot.Id);
            this.tAllEnemy.splice(index, 1);
        }
        etroot.Dispose();
    }
}
