import { Assert_Color } from "../../../assert/Assert_Color";
import { Assert_MsgEffect } from "../../../assert/Assert_MsgEffect";
import { IProjectileEffectInfo } from "../../../assert/Assert_ProjectileEffect";
import { ISpawnEffectInfo, SpawnEffectModifier } from "../../../assert/Assert_SpawnEffect";

import { LogHelper } from "../../../helper/LogHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_spawn_breaksoil } from "../../../npc/modifier/spawn/modifier_spawn_breaksoil";
import { modifier_spawn_fall } from "../../../npc/modifier/spawn/modifier_spawn_fall";
import { modifier_spawn_torrent } from "../../../npc/modifier/spawn/modifier_spawn_torrent";
import { ET } from "../../../shared/lib/Entity";
import { PlayerScene } from "../Player/PlayerScene";
import { EnemyUnitEntityRoot } from "./EnemyUnitEntityRoot";

@GReloadable
export class EnemyManagerComponent extends ET.Component {
    tPlayerKills: number = 0;
    tPlayerMissing: number = 0;
    tAllEnemy: string[] = [];

    iMaxEnemyBonus: number = 0;
    iMaxEnemyBonusEach: number = 0;

    onAwake(...args: any[]): void {
        this.addEvent();
    }
    GetEnemySpawnPos() {
        return GEnemySystem.GetInstance().SpawnEnemyPoint[this.BelongPlayerid];
    }
    addEvent() {

    }

    ApplyDamageHero(damage: number, projectileInfo: IProjectileEffectInfo) {
        if (damage > 0) {
            let hero = this.GetDomain<PlayerScene>().ETRoot.Hero;
            let heroroot = hero.ETRoot.As<ICourierEntityRoot>();
            Assert_MsgEffect.CreateNumberEffect(hero, damage, 2, Assert_MsgEffect.EMsgEffect.MSG_MISS, Assert_Color.red);
            EmitSoundOn(projectileInfo.sound, hero);
            heroroot.ApplyDamageByEnemy(damage);
        }
    }

    getAllEnemy() {
        let player = GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid);
        let r: IEnemyUnitEntityRoot[] = [];
        this.tAllEnemy.forEach((entityid) => {
            let entity = player.GetDomainChild<IEnemyUnitEntityRoot>(entityid);
            if (entity) {
                r.push(entity);
            }
        })
        return r;
    }
    public getAllBattleUnitAlive() {
        let allenemy = this.getAllEnemy();
        let r: IBattleUnitEntityRoot[] = [];
        allenemy.forEach(b => {
            r = r.concat(b.BattleUnitManager().GetAllBattleUnitAlive())
        })
        return r
    }

    getAllAliveEnemy() {
        let player = GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid);
        let r: IEnemyUnitEntityRoot[] = [];
        this.tAllEnemy.forEach((entityid) => {
            let entity = player.GetDomainChild<IEnemyUnitEntityRoot>(entityid);
            if (entity && entity.ChessComp().isAlive) {
                r.push(entity);
            }
        })
        return r;
    }
    getAllDeathEnemy() {
        let player = GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid);
        let r: IEnemyUnitEntityRoot[] = [];
        this.tAllEnemy.forEach((entityid) => {
            let entity = player.GetDomainChild<IEnemyUnitEntityRoot>(entityid);
            if (entity && entity.ChessComp().isAlive == false) {
                r.push(entity);
            }
        })
        return r;
    }

    addEnemy(enemyName: string, roundid: string, onlykey: string = null, pos: Vector = null, spawnEffect: ISpawnEffectInfo = null) {
        if (enemyName == "" || enemyName == null) {
            GLogHelper.error("cant find emeny name");
        }
        if (pos == null) {
            pos = this.GetEnemySpawnPos();
        }
        if (pos == null) {
            GLogHelper.error("cant find emeny spawn pos");
        }
        let enemy = BaseNpc_Plus.CreateUnitByName(enemyName, pos, null, true, DOTATeam_t.DOTA_TEAM_BADGUYS);
        enemy.SetNeverMoveToClearSpace(false);
        EnemyUnitEntityRoot.Active(enemy, this.BelongPlayerid, enemyName, roundid, onlykey);
        let domain = this.GetDomain<PlayerScene>();
        domain.ETRoot.AddDomainChild(enemy.ETRoot);
        this.tAllEnemy.push(enemy.ETRoot.Id);
        enemy.addSpawnedHandler(
            GHandler.create(this, () => {
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
                enemy.ETRoot.As<IEnemyUnitEntityRoot>().OnSpawnAnimalFinish();
            })
        );
        return enemy;
    }

    killEnemy(etroot: IEnemyUnitEntityRoot) {
        if (!this.tAllEnemy.includes(etroot.Id)) {
            LogHelper.error("killEnemy error")
            return;
        }
        this.tPlayerKills += 1;
    }
    removeAllEnemy() {
        let player = GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid);
        this.tAllEnemy.forEach((entityid) => {
            let entity = player.GetDomainChild<IEnemyUnitEntityRoot>(entityid);
            if (entity) {
                entity.Dispose();
            }
        });
        this.tAllEnemy = [];
    }
    removeEnemy(etroot: IEnemyUnitEntityRoot) {
        if (this.tAllEnemy.includes(etroot.Id)) {
            let index = this.tAllEnemy.indexOf(etroot.Id);
            this.tAllEnemy.splice(index, 1);
        }
        etroot.Dispose();
    }
}
